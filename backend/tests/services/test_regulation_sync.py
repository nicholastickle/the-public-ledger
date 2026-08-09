import pytest
from unittest.mock import AsyncMock, MagicMock

from services.regulation_sync import RegulationSyncService


def _make_service() -> tuple[RegulationSyncService, MagicMock, AsyncMock]:
    db = MagicMock()
    db.table.return_value.upsert.return_value.execute.return_value = MagicMock()
    parliament = AsyncMock()
    return RegulationSyncService(db, parliament), db, parliament


_SAMPLE_SUMMARY = {
    "id": "ht3Ga2ie",
    "name": "Town and Country Planning (Amendment) Order 2026",
    "paperPrefix": "SI",
    "paperNumber": 896,
    "paperYear": "2026",
    "procedure": {"id": "5S6p4YsP", "name": "Made negative"},
    "paperMadeDate": "2026-07-29T00:00:00",
    "commonsLayingDate": "2026-07-30T00:00:00",
    "lordsLayingDate": "2026-07-30T00:00:00",
    "workpackageId": "3bCOdsRt",
}

_SAMPLE_DETAIL = {
    "id": "ht3Ga2ie",
    "name": "Town and Country Planning (Amendment) Order 2026",
    "link": "https://www.legislation.gov.uk/uksi/2026/896/made",
    "layingBody": {"id": "fKqMNz79", "name": "Ministry of Housing, Communities and Local Government"},
    "enablingActs": [{"id": "vwCQEWuL", "name": "Town and Country Planning Act 1990"}],
    "paperComingIntoForceDate": "2026-08-27T00:00:00",
}


@pytest.mark.asyncio
async def test_sync_recent_upserts_summary_fields() -> None:
    service, db, parliament = _make_service()
    parliament.get_statutory_instruments.side_effect = [
        {"items": [{"value": _SAMPLE_SUMMARY}]},
        {"items": []},
        {"items": []},
    ]

    await service.sync_recent()

    upserted = db.table.return_value.upsert.call_args_list[0][0][0]
    assert upserted["id"] == "ht3Ga2ie"
    assert upserted["title"] == "Town and Country Planning (Amendment) Order 2026"
    assert upserted["procedure_name"] == "Made negative"
    assert upserted["paper_number"] == 896


@pytest.mark.asyncio
async def test_sync_recent_stops_when_a_page_is_empty() -> None:
    service, _, parliament = _make_service()
    parliament.get_statutory_instruments.return_value = {"items": []}

    await service.sync_recent()

    parliament.get_statutory_instruments.assert_awaited_once()


@pytest.mark.asyncio
async def test_sync_details_backfills_detail_url_and_enabling_acts() -> None:
    service, db, parliament = _make_service()
    db.table.return_value.select.return_value.order.return_value.limit.return_value.execute.return_value.data = [
        {"id": "ht3Ga2ie"}
    ]
    parliament.get_statutory_instrument.return_value = {"value": _SAMPLE_DETAIL}

    await service.sync_details()

    upserted = db.table.return_value.upsert.call_args_list[0][0][0]
    assert upserted["detail_url"] == "https://www.legislation.gov.uk/uksi/2026/896/made"
    assert upserted["laying_body_name"] == "Ministry of Housing, Communities and Local Government"
    assert upserted["enabling_act_names"] == ["Town and Country Planning Act 1990"]


@pytest.mark.asyncio
async def test_sync_details_skips_failed_fetches() -> None:
    service, db, parliament = _make_service()
    db.table.return_value.select.return_value.order.return_value.limit.return_value.execute.return_value.data = [
        {"id": "bad-id"}
    ]
    parliament.get_statutory_instrument.side_effect = Exception("boom")

    await service.sync_details()

    db.table.return_value.upsert.assert_not_called()
