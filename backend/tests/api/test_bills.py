from unittest.mock import MagicMock

import pytest

from core.dependencies import get_current_user


_SAMPLE_ROW = {
    "id": 123,
    "short_title": "Renters' Rights Bill",
    "long_title": "A bill to improve renters' rights",
    "current_house": "Commons",
    "current_stage_name": "Second Reading",
    "is_act": False,
    "is_defeated": False,
    "bill_withdrawn": None,
    "parliament_last_update": "2024-11-12T10:00:00",
    "detail_url": "https://bills.parliament.uk/bills/123",
}


def _setup_list_mock(mock_db: MagicMock, rows: list[dict]) -> None:
    (
        mock_db.table.return_value
        .select.return_value
        .eq.return_value
        .eq.return_value
        .is_.return_value
        .order.return_value
        .range.return_value
        .execute.return_value
        .data
    ) = rows


def test_list_bills_returns_200(test_client) -> None:
    client, app, mock_db = test_client
    _setup_list_mock(mock_db, [_SAMPLE_ROW])
    response = client.get("/api/v1/bills")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["short_title"] == "Renters' Rights Bill"


def test_list_bills_never_exposes_originating_house(test_client) -> None:
    client, app, mock_db = test_client
    _setup_list_mock(mock_db, [_SAMPLE_ROW])
    response = client.get("/api/v1/bills")
    assert "originating_house" not in response.json()[0]


def test_list_bills_empty_returns_empty_list(test_client) -> None:
    client, app, mock_db = test_client
    _setup_list_mock(mock_db, [])
    response = client.get("/api/v1/bills")
    assert response.status_code == 200
    assert response.json() == []


def test_get_bill_returns_404_when_not_found(test_client) -> None:
    client, app, mock_db = test_client
    (
        mock_db.table.return_value
        .select.return_value
        .eq.return_value
        .single.return_value
        .execute.return_value
        .data
    ) = None
    response = client.get("/api/v1/bills/9999")
    assert response.status_code == 404


def test_get_bill_returns_detail(test_client) -> None:
    client, app, mock_db = test_client
    detail_row = {**_SAMPLE_ROW, "introduced_session_id": 39, "summary": None}
    (
        mock_db.table.return_value
        .select.return_value
        .eq.return_value
        .single.return_value
        .execute.return_value
        .data
    ) = detail_row
    response = client.get("/api/v1/bills/123")
    assert response.status_code == 200
    assert response.json()["id"] == 123
    assert "originating_house" not in response.json()


def test_get_bill_stages_returns_list(test_client) -> None:
    client, app, mock_db = test_client
    (
        mock_db.table.return_value
        .select.return_value
        .eq.return_value
        .order.return_value
        .execute.return_value
        .data
    ) = [
        {
            "id": 55,
            "stage_name": "Second Reading",
            "house": "Commons",
            "sort_order": 2,
            "last_update": "2024-11-12T10:00:00",
            "bill_stage_sittings": [{"sitting_date": "2024-11-12"}],
        }
    ]
    response = client.get("/api/v1/bills/123/stages")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["stage_name"] == "Second Reading"
    assert data[0]["sittings"] == ["2024-11-12"]
    assert "divisions" not in data[0]


def test_get_bill_result_requires_auth(test_client) -> None:
    client, app, mock_db = test_client
    response = client.get("/api/v1/bills/123/result")
    assert response.status_code == 401


def test_get_bill_result_requires_prior_vote(test_client) -> None:
    client, app, mock_db = test_client
    app.dependency_overrides[get_current_user] = lambda: {"id": "user-1", "email": "citizen@example.com"}
    vote_service = MagicMock()
    vote_service.has_voted.return_value = False
    app.state.vote_service = vote_service

    response = client.get("/api/v1/bills/123/result")

    assert response.status_code == 403
    app.dependency_overrides.pop(get_current_user, None)


def test_get_bill_result_returns_divisions_after_voting(test_client) -> None:
    client, app, mock_db = test_client
    app.dependency_overrides[get_current_user] = lambda: {"id": "user-1", "email": "citizen@example.com"}
    vote_service = MagicMock()
    vote_service.has_voted.return_value = True
    app.state.vote_service = vote_service

    (
        mock_db.table.return_value
        .select.return_value
        .eq.return_value
        .order.return_value
        .execute.return_value
        .data
    ) = [
        {
            "id": 55,
            "stage_name": "Second Reading",
            "parliamentary_divisions": [
                {
                    "division_id": 777,
                    "house": "Commons",
                    "division_date": "2024-11-12",
                    "title": "Second Reading",
                    "aye_count": 301,
                    "no_count": 200,
                    "content_count": None,
                    "not_content_count": None,
                    "did_pass": True,
                    "division_number": 45,
                }
            ],
        },
        {"id": 56, "stage_name": "Committee Stage", "parliamentary_divisions": []},
    ]

    response = client.get("/api/v1/bills/123/result")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1  # the stage with no divisions is dropped
    assert data[0]["stage_id"] == 55
    assert data[0]["divisions"][0]["aye_count"] == 301
    app.dependency_overrides.pop(get_current_user, None)


def test_trigger_sync_returns_message(test_client) -> None:
    client, app, mock_db = test_client
    bill_sync = MagicMock()
    bill_sync.sync_all_active = MagicMock(return_value=None)
    app.state.bill_sync = bill_sync
    response = client.post("/api/v1/admin/sync")
    assert response.status_code == 200
    assert "sync" in response.json()["message"].lower()
