import logging
from datetime import datetime

from postgrest.exceptions import APIError
from supabase import Client

logger = logging.getLogger(__name__)


class DuplicateVoteError(Exception):
    """Raised when a user has already voted on this bill/regulation."""


class VoteService:
    def __init__(self, supabase: Client) -> None:
        self._db = supabase

    def cast_vote(
        self,
        user_id: str,
        choice: str,
        bill_id: int | None = None,
        regulation_id: str | None = None,
    ) -> dict:
        """Insert a vote. Votes are immutable — a second vote on the same item is
        rejected (via the DB's partial unique index), never silently overwritten."""
        row = {"user_id": user_id, "choice": choice, "bill_id": bill_id, "regulation_id": regulation_id}
        try:
            result = self._db.table("votes").insert(row).execute()
        except APIError as exc:
            if exc.code == "23505":  # unique_violation
                raise DuplicateVoteError from exc
            raise
        return result.data[0]

    def has_voted(self, user_id: str, bill_id: int | None = None, regulation_id: str | None = None) -> bool:
        query = self._db.table("votes").select("id").eq("user_id", user_id)
        query = query.eq("bill_id", bill_id) if bill_id is not None else query.eq("regulation_id", regulation_id)
        result = query.limit(1).execute()
        return bool(result.data)

    def get_user_votes(self, user_id: str) -> list[dict]:
        result = (
            self._db.table("votes")
            .select(
                "choice, created_at, bill_id, regulation_id, "
                "bills(id, short_title, detail_url), "
                "regulations(id, title, detail_url)"
            )
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        votes = []
        for row in result.data or []:
            bill = row.get("bills")
            regulation = row.get("regulations")
            votes.append({
                "choice": row["choice"],
                "created_at": row["created_at"],
                "target_type": "bill" if bill else "regulation",
                "target_id": row.get("bill_id") or row.get("regulation_id"),
                "title": (bill or regulation or {}).get("short_title") or (bill or regulation or {}).get("title"),
                "detail_url": (bill or regulation or {}).get("detail_url"),
            })
        return votes

    def get_tally(self, bill_id: int | None = None, regulation_id: str | None = None) -> dict:
        table = "bill_vote_tallies" if bill_id is not None else "regulation_vote_tallies"
        column = "bill_id" if bill_id is not None else "regulation_id"
        value = bill_id if bill_id is not None else regulation_id
        result = self._db.table(table).select("yes_count, no_count, abstain_count").eq(column, value).execute()
        if result.data:
            return result.data[0]
        return {"yes_count": 0, "no_count": 0, "abstain_count": 0}

    def get_recent_votes(self, since: datetime, limit: int = 50) -> list[dict]:
        """Anonymized recent vote events for the badge feed — never includes user_id."""
        result = (
            self._db.table("votes")
            .select("choice, created_at, bill_id, regulation_id")
            .gt("created_at", since.isoformat())
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        events = []
        for row in result.data or []:
            events.append({
                "target_type": "bill" if row.get("bill_id") is not None else "regulation",
                "target_id": row.get("bill_id") or row.get("regulation_id"),
                "choice": row["choice"],
                "created_at": row["created_at"],
            })
        return events
