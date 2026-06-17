import pytest
from unittest.mock import AsyncMock, MagicMock, call

from services.bill_sync import BillSyncService, strip_house_suffix


def test_strip_house_suffix_removes_hl() -> None:
    assert strip_house_suffix("Data (Use and Access) Bill [HL]") == "Data (Use and Access) Bill"


def test_strip_house_suffix_removes_lords() -> None:
    assert strip_house_suffix("Some Bill [Lords]") == "Some Bill"


def test_strip_house_suffix_leaves_plain_title() -> None:
    assert strip_house_suffix("Renters' Rights Bill") == "Renters' Rights Bill"


def _make_service() -> tuple[BillSyncService, MagicMock, AsyncMock]:
    db = MagicMock()
    db.table.return_value.upsert.return_value.execute.return_value = MagicMock()
    parliament = AsyncMock()
    return BillSyncService(db, parliament), db, parliament


_SAMPLE_BILL = {
    "billId": 123,
    "shortTitle": "Test Bill",
    "longTitle": "A bill to test things",
    "originatingHouse": "Commons",
    "currentHouse": "Commons",
    "currentStage": {"id": 7, "description": "Second Reading"},
    "isAct": False,
    "isDefeated": False,
    "billWithdrawn": None,
    "introducedSessionId": 39,
    "billTypeId": 4,
    "summary": None,
    "lastUpdate": "2024-01-15T10:00:00",
}


@pytest.mark.asyncio
async def test_sync_single_bill_fetches_bill_and_stages() -> None:
    service, _, parliament = _make_service()
    parliament.get_bill.return_value = _SAMPLE_BILL
    parliament.get_bill_stages.return_value = []

    await service.sync_single_bill(123)

    parliament.get_bill.assert_awaited_once_with(123)
    parliament.get_bill_stages.assert_awaited_once_with(123)


@pytest.mark.asyncio
async def test_sync_single_bill_upserts_bill_row() -> None:
    service, db, parliament = _make_service()
    parliament.get_bill.return_value = _SAMPLE_BILL
    parliament.get_bill_stages.return_value = []

    await service.sync_single_bill(123)

    upserted = db.table.return_value.upsert.call_args_list[0][0][0]
    assert upserted["id"] == 123
    assert upserted["short_title"] == "Test Bill"
    assert upserted["is_act"] is False
    assert upserted["current_stage_name"] == "Second Reading"


@pytest.mark.asyncio
async def test_sync_stages_upserts_stage_and_sittings() -> None:
    service, db, parliament = _make_service()
    parliament.get_bill.return_value = _SAMPLE_BILL
    parliament.get_bill_stages.return_value = [
        {
            "id": 55,
            "stageId": 6,
            "description": "Second Reading",
            "abbreviation": "2R",
            "house": "Commons",
            "sessionId": 39,
            "sortOrder": 2,
            "lastUpdate": "2024-01-15T10:00:00",
            "stageSittings": [{"date": "2024-01-15T00:00:00"}],
        }
    ]

    await service.sync_single_bill(123)

    tables_upserted = [c[0][0] for c in db.table.call_args_list]
    assert "bill_stages" in tables_upserted
    assert "bill_stage_sittings" in tables_upserted


@pytest.mark.asyncio
async def test_sync_all_active_paginates() -> None:
    service, db, parliament = _make_service()
    # default take=50; totalResults=51 requires 2 pages
    page1 = [_SAMPLE_BILL] * 50
    page2 = [{**_SAMPLE_BILL, "billId": 124}]
    parliament.get_bills.side_effect = [
        {"items": page1, "totalResults": 51},
        {"items": page2, "totalResults": 51},
    ]
    parliament.get_bill_stages.return_value = []

    await service.sync_all_active()

    assert parliament.get_bills.call_count == 2


@pytest.mark.asyncio
async def test_rss_poll_syncs_each_bill() -> None:
    service, db, parliament = _make_service()
    parliament.get_rss_updated_bill_ids.return_value = [10, 20]
    parliament.get_bill.return_value = _SAMPLE_BILL
    parliament.get_bill_stages.return_value = []

    await service.sync_bills_from_rss()

    assert parliament.get_bill.await_count == 2
