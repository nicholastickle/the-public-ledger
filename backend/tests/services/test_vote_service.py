import pytest
from datetime import datetime, timezone
from unittest.mock import MagicMock

from postgrest.exceptions import APIError

from services.vote_service import DuplicateVoteError, VoteService


def _make_service() -> tuple[VoteService, MagicMock]:
    db = MagicMock()
    return VoteService(db), db


def test_cast_vote_inserts_row_with_choice_and_target() -> None:
    service, db = _make_service()
    db.table.return_value.insert.return_value.execute.return_value.data = [
        {"id": "abc", "choice": "yes", "created_at": "2026-01-01T00:00:00Z"}
    ]

    result = service.cast_vote("user-1", "yes", bill_id=42)

    inserted = db.table.return_value.insert.call_args[0][0]
    assert inserted == {"user_id": "user-1", "choice": "yes", "bill_id": 42, "regulation_id": None}
    assert result["choice"] == "yes"


def test_cast_vote_raises_duplicate_vote_error_on_unique_violation() -> None:
    service, db = _make_service()
    db.table.return_value.insert.return_value.execute.side_effect = APIError({"code": "23505", "message": "dup"})

    with pytest.raises(DuplicateVoteError):
        service.cast_vote("user-1", "yes", bill_id=42)


def test_cast_vote_reraises_other_api_errors() -> None:
    service, db = _make_service()
    db.table.return_value.insert.return_value.execute.side_effect = APIError({"code": "23503", "message": "fk"})

    with pytest.raises(APIError):
        service.cast_vote("user-1", "yes", bill_id=42)


def test_has_voted_true_when_row_exists() -> None:
    service, db = _make_service()
    db.table.return_value.select.return_value.eq.return_value.eq.return_value.limit.return_value.execute.return_value.data = [
        {"id": "abc"}
    ]

    assert service.has_voted("user-1", bill_id=42) is True


def test_has_voted_false_when_no_row() -> None:
    service, db = _make_service()
    db.table.return_value.select.return_value.eq.return_value.eq.return_value.limit.return_value.execute.return_value.data = []

    assert service.has_voted("user-1", bill_id=42) is False


def test_get_recent_votes_never_includes_user_id() -> None:
    service, db = _make_service()
    db.table.return_value.select.return_value.gt.return_value.order.return_value.limit.return_value.execute.return_value.data = [
        {"choice": "yes", "created_at": "2026-01-01T00:00:00Z", "bill_id": 42, "regulation_id": None},
        {"choice": "no", "created_at": "2026-01-01T00:01:00Z", "bill_id": None, "regulation_id": "abc123"},
    ]

    events = service.get_recent_votes(datetime.now(timezone.utc))

    assert all("user_id" not in e for e in events)
    assert events[0] == {"target_type": "bill", "target_id": 42, "choice": "yes", "created_at": "2026-01-01T00:00:00Z"}
    assert events[1] == {"target_type": "regulation", "target_id": "abc123", "choice": "no", "created_at": "2026-01-01T00:01:00Z"}


def test_get_tally_returns_zeros_when_no_rows() -> None:
    service, db = _make_service()
    db.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []

    tally = service.get_tally(bill_id=42)

    assert tally == {"yes_count": 0, "no_count": 0, "abstain_count": 0}
