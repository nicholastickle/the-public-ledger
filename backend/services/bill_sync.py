import logging
import re

from supabase import Client

from services.parliament_client import ParliamentClient

logger = logging.getLogger(__name__)

_HOUSE_SUFFIX_RE = re.compile(r"\s*\[.*?\]\s*$")


def strip_house_suffix(title: str) -> str:
    """Remove trailing [HL], [Lords] etc. from a bill title."""
    return _HOUSE_SUFFIX_RE.sub("", title).strip()


def _house_name(value: object) -> str | None:
    """Parliament API returns house as either a string or a {name, value} dict."""
    if isinstance(value, dict):
        return value.get("name")
    return value  # type: ignore[return-value]


class BillSyncService:
    def __init__(self, supabase: Client, parliament: ParliamentClient) -> None:
        self._db = supabase
        self._parliament = parliament

    async def sync_all_active(self) -> None:
        """Fetch all bills from the Parliament API and upsert to DB."""
        logger.info("Starting full bill sync")
        skip = 0
        take = 50
        synced = 0

        while True:
            data = await self._parliament.get_bills(skip=skip, take=take)
            items = data.get("items") or []
            if not items:
                break
            for item in items:
                await self._upsert_bill(item)
                await self._sync_stages(item["billId"])
                synced += 1
            total = data.get("totalResults", 0)
            skip += take
            if skip >= total:
                break

        logger.info("Full bill sync complete — %d bills processed", synced)

    async def sync_bills_from_rss(self) -> None:
        """Poll RSS feed and re-sync only recently updated bills."""
        logger.info("RSS poll: checking for updated bills")
        try:
            bill_ids = await self._parliament.get_rss_updated_bill_ids()
        except Exception:
            logger.exception("Failed to fetch Parliament RSS feed")
            return

        for bill_id in bill_ids:
            try:
                await self.sync_single_bill(bill_id)
            except Exception:
                logger.exception("Failed to sync bill %d from RSS", bill_id)

        logger.info("RSS poll complete — %d bills checked", len(bill_ids))

    async def sync_single_bill(self, bill_id: int) -> None:
        bill_data = await self._parliament.get_bill(bill_id)
        await self._upsert_bill(bill_data)
        await self._sync_stages(bill_id)

    async def _upsert_bill(self, data: dict) -> None:
        current_stage = data.get("currentStage") or {}
        row = {
            "id": data["billId"],
            "short_title": data.get("shortTitle"),
            "long_title": data.get("longTitle"),
            "originating_house": _house_name(data.get("originatingHouse")),
            "current_house": _house_name(data.get("currentHouse")),
            "current_stage_id": current_stage.get("id"),
            "current_stage_name": current_stage.get("description") or current_stage.get("abbreviation"),
            "is_act": data.get("isAct", False),
            "is_defeated": data.get("isDefeated", False),
            "bill_withdrawn": data.get("billWithdrawn"),
            "introduced_session_id": data.get("introducedSessionId"),
            "bill_type_id": data.get("billTypeId"),
            "summary": data.get("summary"),
            "parliament_last_update": data.get("lastUpdate"),
        }
        self._db.table("bills").upsert(row, on_conflict="id").execute()

    async def _sync_stages(self, bill_id: int) -> None:
        try:
            stages = await self._parliament.get_bill_stages(bill_id)
        except Exception:
            logger.exception("Failed to fetch stages for bill %d", bill_id)
            return

        for stage in stages:
            stage_row = {
                "id": stage["id"],
                "bill_id": bill_id,
                "stage_id": stage.get("stageId"),
                "stage_name": stage.get("description"),
                "abbreviation": stage.get("abbreviation"),
                "house": _house_name(stage.get("house")),
                "session_id": stage.get("sessionId"),
                "sort_order": stage.get("sortOrder"),
                "last_update": stage.get("lastUpdate"),
            }
            self._db.table("bill_stages").upsert(stage_row, on_conflict="id").execute()

            for sitting in stage.get("stageSittings") or []:
                sitting_date = (sitting.get("date") or "")[:10]
                if sitting_date:
                    self._db.table("bill_stage_sittings").upsert(
                        {"bill_stage_id": stage["id"], "sitting_date": sitting_date},
                        on_conflict="bill_stage_id,sitting_date",
                    ).execute()
