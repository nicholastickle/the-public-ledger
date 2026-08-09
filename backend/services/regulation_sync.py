import logging

from supabase import Client

from services.parliament_client import ParliamentClient

logger = logging.getLogger(__name__)

# The live SI register runs to several thousand historical instruments (mostly
# decades old and never revisited). Citizens only ever vote on what's currently
# live, so the sync deliberately only tracks a recent window rather than crawling
# the full historical backlog — see sync_recent()/sync_details() below.
RECENT_WINDOW_TAKE = 100
RECENT_WINDOW_PAGES = 3
DETAIL_BACKFILL_LIMIT = 150


class RegulationSyncService:
    def __init__(self, supabase: Client, parliament: ParliamentClient) -> None:
        self._db = supabase
        self._parliament = parliament

    async def sync_recent(self) -> None:
        """Poll the most recent statutory instruments (list/summary fields only —
        cheap, no per-item detail fetch). Assumes the API returns newest-first by
        default; there's no documented sort or updated-since filter to rely on."""
        logger.info("Syncing recent statutory instruments")
        synced = 0
        for page in range(RECENT_WINDOW_PAGES):
            skip = page * RECENT_WINDOW_TAKE
            data = await self._parliament.get_statutory_instruments(
                skip=skip, take=RECENT_WINDOW_TAKE
            )
            items = data.get("items") or []
            if not items:
                break
            for wrapped in items:
                summary = wrapped.get("value") or {}
                if summary.get("id"):
                    self._upsert_summary(summary)
                    synced += 1
        logger.info("Recent statutory instrument sync complete — %d processed", synced)

    async def sync_details(self) -> None:
        """Backfill detail_url / enabling acts / laying body for the most recently
        made instruments we already know about (the list endpoint doesn't include
        these fields, so they need a per-item detail fetch)."""
        logger.info("Backfilling statutory instrument detail fields")
        result = (
            self._db.table("regulations")
            .select("id")
            .order("paper_made_date", desc=True)
            .limit(DETAIL_BACKFILL_LIMIT)
            .execute()
        )
        ids = [row["id"] for row in (result.data or [])]
        backfilled = 0
        for instrument_id in ids:
            try:
                data = await self._parliament.get_statutory_instrument(instrument_id)
            except Exception:
                logger.exception("Failed to fetch SI detail %s", instrument_id)
                continue
            detail = data.get("value") or {}
            if detail.get("id"):
                self._upsert_detail(detail)
                backfilled += 1
        logger.info("Detail backfill complete — %d instruments updated", backfilled)

    def _upsert_summary(self, summary: dict) -> None:
        procedure = summary.get("procedure") or {}
        row = {
            "id": summary["id"],
            "title": summary.get("name"),
            "paper_prefix": summary.get("paperPrefix"),
            "paper_number": summary.get("paperNumber"),
            "paper_year": summary.get("paperYear"),
            "procedure_name": procedure.get("name"),
            "paper_made_date": summary.get("paperMadeDate"),
            "commons_laying_date": summary.get("commonsLayingDate"),
            "lords_laying_date": summary.get("lordsLayingDate"),
            "workpackage_id": summary.get("workpackageId"),
        }
        self._db.table("regulations").upsert(row, on_conflict="id").execute()

    def _upsert_detail(self, detail: dict) -> None:
        laying_body = detail.get("layingBody") or {}
        enabling_acts = detail.get("enablingActs") or []
        row = {
            "id": detail["id"],
            "detail_url": detail.get("link"),
            "laying_body_name": laying_body.get("name"),
            "enabling_act_names": [act.get("name") for act in enabling_acts if act.get("name")],
            "coming_into_force_date": detail.get("paperComingIntoForceDate"),
        }
        self._db.table("regulations").upsert(row, on_conflict="id").execute()
