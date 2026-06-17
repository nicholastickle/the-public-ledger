import logging
from datetime import date, timedelta

from supabase import Client

from services.bill_sync import strip_house_suffix
from services.parliament_client import ParliamentClient

logger = logging.getLogger(__name__)


class DivisionSyncService:
    def __init__(self, supabase: Client, parliament: ParliamentClient) -> None:
        self._db = supabase
        self._parliament = parliament

    async def sync_divisions_for_bill(self, bill_id: int) -> None:
        """Search for parliamentary divisions matching each stage sitting of a bill."""
        bill_result = self._db.table("bills").select("short_title").eq("id", bill_id).single().execute()
        if not bill_result.data:
            logger.warning("Bill %d not found in DB — skipping division sync", bill_id)
            return

        search_term = strip_house_suffix(bill_result.data.get("short_title") or "")
        if not search_term:
            return

        stages_result = self._db.table("bill_stages").select(
            "id, house, bill_stage_sittings(sitting_date)"
        ).eq("bill_id", bill_id).execute()

        for stage in stages_result.data or []:
            for sitting in stage.get("bill_stage_sittings") or []:
                sitting_date_str = sitting.get("sitting_date")
                if not sitting_date_str:
                    continue
                await self._fetch_and_store(
                    stage_id=stage["id"],
                    house=stage.get("house") or "",
                    search_term=search_term,
                    sitting_date=date.fromisoformat(sitting_date_str),
                )

    async def _fetch_and_store(
        self,
        stage_id: int,
        house: str,
        search_term: str,
        sitting_date: date,
    ) -> None:
        # Search ±1 day to account for late-sitting divisions
        from_date = sitting_date - timedelta(days=1)
        to_date = sitting_date + timedelta(days=1)

        try:
            if "Lords" in house:
                divisions = await self._parliament.search_lords_divisions(
                    search_term=search_term,
                    from_date=from_date,
                    to_date=to_date,
                )
            else:
                divisions = await self._parliament.search_commons_divisions(
                    search_term=search_term,
                    from_date=from_date,
                    to_date=to_date,
                )
        except Exception:
            logger.exception(
                "Division search failed (stage=%d, house=%s, date=%s)", stage_id, house, sitting_date
            )
            return

        for div in divisions:
            self._upsert_division(div, stage_id, house)

    def _upsert_division(self, div: dict, stage_id: int, house: str) -> None:
        # Parliament API field names vary in case between Commons and Lords responses
        def get(d: dict, *keys: str) -> object:
            for k in keys:
                if k in d:
                    return d[k]
            return None

        division_id = get(div, "DivisionId", "divisionId")
        raw_date = str(get(div, "Date", "date") or "")
        division_date = raw_date[:10]

        if not division_id or not division_date:
            return

        is_lords = "Lords" in house
        if is_lords:
            content = int(get(div, "ContentCount", "contentCount") or 0)
            not_content = int(get(div, "NotContentCount", "notContentCount") or 0)
            row = {
                "bill_stage_id": stage_id,
                "division_id": division_id,
                "house": "Lords",
                "division_date": division_date,
                "title": get(div, "Title", "title"),
                "content_count": content,
                "not_content_count": not_content,
                "did_pass": content > not_content,
                "division_number": get(div, "Number", "number"),
            }
        else:
            ayes = int(get(div, "AyeCount", "ayeCount") or 0)
            noes = int(get(div, "NoCount", "noCount") or 0)
            row = {
                "bill_stage_id": stage_id,
                "division_id": division_id,
                "house": "Commons",
                "division_date": division_date,
                "title": get(div, "Title", "title"),
                "aye_count": ayes,
                "no_count": noes,
                "did_pass": ayes > noes,
                "division_number": get(div, "Number", "number"),
            }

        self._db.table("parliamentary_divisions").upsert(
            row, on_conflict="house,division_id"
        ).execute()
