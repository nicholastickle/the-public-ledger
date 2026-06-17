"""
Shared fixtures for backend tests.
Patches create_client so tests don't need real Supabase credentials.
"""
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def test_client():
    """TestClient with a mocked Supabase client wired into app.state."""
    mock_db = MagicMock()
    with patch("main.create_client", return_value=mock_db):
        from main import app
        with TestClient(app) as client:
            app.state.supabase = mock_db
            yield client, app, mock_db
