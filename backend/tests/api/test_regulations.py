from unittest.mock import MagicMock


_SAMPLE_ROW = {
    "id": "ht3Ga2ie",
    "title": "Town and Country Planning (Amendment) Order 2026",
    "enabling_act_names": ["Town and Country Planning Act 1990"],
    "procedure_name": "Made negative",
    "commons_laying_date": "2026-07-30T00:00:00",
    "lords_laying_date": "2026-07-30T00:00:00",
    "paper_made_date": "2026-07-29T00:00:00",
    "detail_url": "https://www.legislation.gov.uk/uksi/2026/896/made",
    "updated_at": "2026-07-30T00:00:00",
    "paper_number": 896,
}


def _setup_list_mock(mock_db: MagicMock, rows: list[dict]) -> None:
    (
        mock_db.table.return_value
        .select.return_value
        .order.return_value
        .range.return_value
        .execute.return_value
        .data
    ) = rows


def test_list_regulations_returns_mapped_fields(test_client) -> None:
    client, app, mock_db = test_client
    _setup_list_mock(mock_db, [_SAMPLE_ROW])
    response = client.get("/api/v1/regulations")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == "ht3Ga2ie"
    assert data[0]["procedure"] == "negative"
    assert data[0]["status"] == "made"
    assert data[0]["house"] == "Both"
    assert data[0]["detail_url"] == "https://www.legislation.gov.uk/uksi/2026/896/made"
    assert data[0]["enabling_act"] == "Town and Country Planning Act 1990"
    assert data[0]["paper_number"] == 896


def test_list_regulations_never_exposes_originating_house_equivalent(test_client) -> None:
    # Regulations have no originating_house-equivalent field to leak, but the
    # response model is the enforcement point — assert it stays a closed set.
    client, app, mock_db = test_client
    _setup_list_mock(mock_db, [_SAMPLE_ROW])
    response = client.get("/api/v1/regulations")
    body = response.json()[0]
    assert set(body.keys()) == {
        "id", "title", "enabling_act", "procedure", "laid_date", "made_date",
        "deadline", "status", "house", "last_update", "detail_url", "paper_number",
    }


def test_status_approved_returns_empty_list_not_derivable(test_client) -> None:
    client, app, mock_db = test_client
    response = client.get("/api/v1/regulations?status=approved")
    assert response.status_code == 200
    assert response.json() == []


def test_get_regulation_returns_404_when_not_found(test_client) -> None:
    client, app, mock_db = test_client
    (
        mock_db.table.return_value
        .select.return_value
        .eq.return_value
        .single.return_value
        .execute.return_value
        .data
    ) = None
    response = client.get("/api/v1/regulations/does-not-exist")
    assert response.status_code == 404


def test_get_regulation_returns_detail(test_client) -> None:
    client, app, mock_db = test_client
    (
        mock_db.table.return_value
        .select.return_value
        .eq.return_value
        .single.return_value
        .execute.return_value
        .data
    ) = _SAMPLE_ROW
    response = client.get("/api/v1/regulations/ht3Ga2ie")
    assert response.status_code == 200
    assert response.json()["id"] == "ht3Ga2ie"


def test_trigger_regulation_sync_returns_message(test_client) -> None:
    client, app, mock_db = test_client
    regulation_sync = MagicMock()
    app.state.regulation_sync = regulation_sync
    response = client.post("/api/v1/admin/regulations/sync")
    assert response.status_code == 200
    assert "sync" in response.json()["message"].lower()
