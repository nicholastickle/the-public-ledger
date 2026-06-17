import pytest
from datetime import date
from unittest.mock import AsyncMock, MagicMock

from services.division_sync import DivisionSyncService


def _make_service() -> tuple[DivisionSyncService, MagicMock, AsyncMock]:
    db = MagicMock()
    db.table.return_value.upsert.return_value.execute.return_value = MagicMock()
    parliament = AsyncMock()
    return DivisionSyncService(db, parliament), db, parliament


@pytest.mark.asyncio
async def test_sync_skips_bill_not_in_db() -> None:
    service, db, parliament = _make_service()
    db.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value.data = None

    await service.sync_divisions_for_bill(999)

    parliament.search_commons_divisions.assert_not_called()
    parliament.search_lords_divisions.assert_not_called()


@pytest.mark.asyncio
async def test_sync_searches_commons_divisions_for_commons_stage() -> None:
    service, db, parliament = _make_service()

    db.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value.data = {
        "short_title": "Renters' Rights Bill"
    }
    db.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        {
            "id": 55,
            "house": "Commons",
            "bill_stage_sittings": [{"sitting_date": "2024-11-12"}],
        }
    ]
    parliament.search_commons_divisions.return_value = []

    await service.sync_divisions_for_bill(123)

    parliament.search_commons_divisions.assert_awaited_once()
    call_kwargs = parliament.search_commons_divisions.call_args.kwargs
    assert call_kwargs["search_term"] == "Renters' Rights Bill"
    assert call_kwargs["from_date"] == date(2024, 11, 11)
    assert call_kwargs["to_date"] == date(2024, 11, 13)


@pytest.mark.asyncio
async def test_upsert_commons_division_calculates_did_pass() -> None:
    service, db, parliament = _make_service()

    div = {
        "DivisionId": 777,
        "Date": "2024-11-12T00:00:00",
        "Title": "Renters' Rights Bill: Second Reading",
        "AyeCount": 301,
        "NoCount": 200,
        "Number": 45,
    }
    service._upsert_division(div, stage_id=55, house="Commons")

    upserted = db.table.return_value.upsert.call_args[0][0]
    assert upserted["division_id"] == 777
    assert upserted["aye_count"] == 301
    assert upserted["did_pass"] is True
    assert upserted["house"] == "Commons"


@pytest.mark.asyncio
async def test_upsert_lords_division_uses_content_counts() -> None:
    service, db, _ = _make_service()

    div = {
        "DivisionId": 888,
        "Date": "2024-11-20T00:00:00",
        "Title": "Some Lords Bill: Second Reading",
        "ContentCount": 150,
        "NotContentCount": 200,
        "Number": 12,
    }
    service._upsert_division(div, stage_id=66, house="Lords")

    upserted = db.table.return_value.upsert.call_args[0][0]
    assert upserted["house"] == "Lords"
    assert upserted["content_count"] == 150
    assert upserted["not_content_count"] == 200
    assert upserted["did_pass"] is False
