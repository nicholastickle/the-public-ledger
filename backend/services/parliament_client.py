import logging
from datetime import date
from xml.etree import ElementTree

import httpx

logger = logging.getLogger(__name__)

BILLS_API_BASE = "https://bills-api.parliament.uk/api/v1"
COMMONS_VOTES_BASE = "https://commonsvotes-api.parliament.uk"
LORDS_VOTES_BASE = "https://lordsvotes-api.parliament.uk"


class ParliamentClient:
    def __init__(self, client: httpx.AsyncClient) -> None:
        self._client = client

    async def get_bills(
        self,
        skip: int = 0,
        take: int = 50,
        sort_order: int = 4,  # 4 = Updated (newest first)
    ) -> dict:
        params: dict = {"Skip": skip, "Take": take, "SortOrder": sort_order}
        response = await self._client.get(f"{BILLS_API_BASE}/Bills", params=params)
        response.raise_for_status()
        return response.json()

    async def get_bill(self, bill_id: int) -> dict:
        response = await self._client.get(f"{BILLS_API_BASE}/Bills/{bill_id}")
        response.raise_for_status()
        return response.json()

    async def get_bill_stages(self, bill_id: int) -> list[dict]:
        response = await self._client.get(f"{BILLS_API_BASE}/Bills/{bill_id}/Stages")
        response.raise_for_status()
        return response.json()

    async def get_rss_updated_bill_ids(self) -> list[int]:
        response = await self._client.get(f"{BILLS_API_BASE}/Rss/allbills.rss")
        response.raise_for_status()
        root = ElementTree.fromstring(response.text)
        bill_ids: list[int] = []
        # RSS links are like https://bills.parliament.uk/bills/3737
        for link in root.iter("{http://www.w3.org/2005/Atom}link"):
            href = link.get("href", "")
            if "/bills/" in href.lower():
                try:
                    bill_ids.append(int(href.rstrip("/").split("/")[-1]))
                except ValueError:
                    pass
        return list(set(bill_ids))

    async def search_commons_divisions(
        self,
        search_term: str | None = None,
        from_date: date | None = None,
        to_date: date | None = None,
        take: int = 25,
    ) -> list[dict]:
        params: dict = {"take": take}
        if search_term:
            params["searchTerm"] = search_term
        if from_date:
            params["queryParameters.startDate"] = from_date.isoformat()
        if to_date:
            params["queryParameters.endDate"] = to_date.isoformat()
        response = await self._client.get(
            f"{COMMONS_VOTES_BASE}/data/divisions.json/search",
            params=params,
        )
        response.raise_for_status()
        return response.json()

    async def search_lords_divisions(
        self,
        search_term: str | None = None,
        from_date: date | None = None,
        to_date: date | None = None,
        take: int = 25,
    ) -> list[dict]:
        params: dict = {"Take": take}
        if search_term:
            params["SearchTerm"] = search_term
        if from_date:
            params["StartDate"] = from_date.isoformat()
        if to_date:
            params["EndDate"] = to_date.isoformat()
        response = await self._client.get(
            f"{LORDS_VOTES_BASE}/data/Divisions/search",
            params=params,
        )
        response.raise_for_status()
        return response.json()
