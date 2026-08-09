from unittest.mock import MagicMock

import pytest

from core.dependencies import get_current_user
from services.vote_service import DuplicateVoteError


@pytest.fixture()
def authed_client(test_client):
    client, app, mock_db = test_client
    app.dependency_overrides[get_current_user] = lambda: {"id": "user-1", "email": "citizen@example.com"}
    yield client, app, mock_db
    app.dependency_overrides.pop(get_current_user, None)


def test_vote_on_bill_requires_auth(test_client) -> None:
    client, app, mock_db = test_client
    response = client.post("/api/v1/bills/42/vote", json={"choice": "yes"})
    assert response.status_code == 401


def test_vote_on_bill_casts_vote(authed_client) -> None:
    client, app, mock_db = authed_client
    vote_service = MagicMock()
    vote_service.cast_vote.return_value = {"id": "vote-1", "choice": "yes", "created_at": "2026-01-01T00:00:00Z"}
    app.state.vote_service = vote_service

    response = client.post("/api/v1/bills/42/vote", json={"choice": "yes"})

    assert response.status_code == 200
    vote_service.cast_vote.assert_called_once_with("user-1", "yes", bill_id=42)
    assert response.json()["choice"] == "yes"
    assert "user_id" not in response.json()


def test_vote_on_bill_rejects_invalid_choice(authed_client) -> None:
    client, app, mock_db = authed_client
    response = client.post("/api/v1/bills/42/vote", json={"choice": "maybe"})
    assert response.status_code == 422


def test_vote_on_bill_returns_409_on_duplicate(authed_client) -> None:
    client, app, mock_db = authed_client
    vote_service = MagicMock()
    vote_service.cast_vote.side_effect = DuplicateVoteError()
    app.state.vote_service = vote_service

    response = client.post("/api/v1/bills/42/vote", json={"choice": "yes"})

    assert response.status_code == 409


def test_get_my_votes_requires_auth(test_client) -> None:
    client, app, mock_db = test_client
    response = client.get("/api/v1/users/me/votes")
    assert response.status_code == 401


def test_get_my_votes_returns_service_result(authed_client) -> None:
    client, app, mock_db = authed_client
    vote_service = MagicMock()
    vote_service.get_user_votes.return_value = [
        {
            "target_type": "bill",
            "target_id": 42,
            "title": "Test Bill",
            "detail_url": "https://bills.parliament.uk/bills/42",
            "choice": "yes",
            "created_at": "2026-01-01T00:00:00Z",
        }
    ]
    app.state.vote_service = vote_service

    response = client.get("/api/v1/users/me/votes")

    assert response.status_code == 200
    vote_service.get_user_votes.assert_called_once_with("user-1")
    assert response.json()[0]["target_id"] == 42


def test_get_recent_votes_is_public_and_anonymized(test_client) -> None:
    client, app, mock_db = test_client
    vote_service = MagicMock()
    vote_service.get_recent_votes.return_value = [
        {"target_type": "bill", "target_id": 42, "choice": "yes", "created_at": "2026-01-01T00:00:00Z"}
    ]
    app.state.vote_service = vote_service

    response = client.get("/api/v1/votes/recent")

    assert response.status_code == 200
    assert "user_id" not in response.json()[0]


def test_get_bill_tally(test_client) -> None:
    client, app, mock_db = test_client
    vote_service = MagicMock()
    vote_service.get_tally.return_value = {"yes_count": 3, "no_count": 1, "abstain_count": 0}
    app.state.vote_service = vote_service

    response = client.get("/api/v1/bills/42/tally")

    assert response.status_code == 200
    vote_service.get_tally.assert_called_once_with(bill_id=42)
    assert response.json() == {"yes_count": 3, "no_count": 1, "abstain_count": 0}
