import pytest
from unittest.mock import AsyncMock, MagicMock

from services.parliament_client import ParliamentClient, BILLS_API_BASE


def _make_client(json_data: object, status_code: int = 200) -> ParliamentClient:
    mock_response = MagicMock()
    mock_response.json.return_value = json_data
    mock_response.raise_for_status = MagicMock()
    mock_response.text = ""
    http = AsyncMock()
    http.get = AsyncMock(return_value=mock_response)
    return ParliamentClient(http), http  # type: ignore[return-value]


@pytest.mark.asyncio
async def test_get_bill_calls_correct_url() -> None:
    client, http = _make_client({"billId": 42})
    result = await client.get_bill(42)
    http.get.assert_called_once_with(f"{BILLS_API_BASE}/Bills/42")
    assert result["billId"] == 42


@pytest.mark.asyncio
async def test_get_bills_passes_pagination_params() -> None:
    client, http = _make_client({"items": [], "totalResults": 0})
    await client.get_bills(skip=50, take=25)
    params = http.get.call_args.kwargs["params"]
    assert params["Skip"] == 50
    assert params["Take"] == 25


@pytest.mark.asyncio
async def test_get_bill_stages_calls_correct_url() -> None:
    client, http = _make_client([])
    await client.get_bill_stages(99)
    http.get.assert_called_once_with(f"{BILLS_API_BASE}/Bills/99/Stages")


@pytest.mark.asyncio
async def test_get_rss_updated_bill_ids_parses_links() -> None:
    rss_xml = """<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <link href="https://bills.parliament.uk/bills/3737" rel="alternate"/>
  <link href="https://bills.parliament.uk/bills/3800" rel="alternate"/>
  <link href="https://bills.parliament.uk/bills/3737" rel="alternate"/>
</feed>"""
    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.text = rss_xml
    http = AsyncMock()
    http.get = AsyncMock(return_value=mock_response)
    client = ParliamentClient(http)

    ids = await client.get_rss_updated_bill_ids()
    assert sorted(ids) == [3737, 3800]
