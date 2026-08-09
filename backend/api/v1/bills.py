import logging

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, Request
from pydantic import BaseModel

from core.dependencies import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter()


# Never add `originating_house` to any response model here. It identifies the
# political/institutional source of a bill and must never surface — see the
# "Product principle: impartiality" section in CLAUDE.md. The column stays in
# the DB; it just never leaves this API.


class StageDetail(BaseModel):
    id: int
    stage_name: str | None
    house: str | None
    sort_order: int | None
    last_update: str | None
    sittings: list[str]
    # Deliberately no division/vote-count field here — this endpoint is reachable
    # during the voting flow, and parliamentary results must never be shown before
    # or during a citizen's own vote. See GET /bills/{id}/result for the gated view.


class BillSummary(BaseModel):
    id: int
    short_title: str | None
    long_title: str | None
    current_house: str | None
    current_stage_name: str | None
    is_act: bool
    is_defeated: bool
    bill_withdrawn: str | None
    parliament_last_update: str | None
    detail_url: str | None


class BillDetail(BillSummary):
    introduced_session_id: int | None
    summary: str | None


class DivisionResult(BaseModel):
    division_id: int
    house: str
    division_date: str
    title: str | None
    aye_count: int | None
    no_count: int | None
    content_count: int | None
    not_content_count: int | None
    did_pass: bool | None
    division_number: int | None


class StageResult(BaseModel):
    stage_id: int
    stage_name: str | None
    divisions: list[DivisionResult]


@router.get("/bills", response_model=list[BillSummary])
async def list_bills(
    request: Request,
    status: str = Query("active", pattern="^(active|completed|defeated|withdrawn)$"),
    house: str | None = Query(None),
    search: str | None = Query(None),
    skip: int = Query(0, ge=0),
    take: int = Query(20, ge=1, le=100),
) -> list[dict]:
    db = request.app.state.supabase
    query = db.table("bills").select(
        "id, short_title, long_title, current_house, "
        "current_stage_name, is_act, is_defeated, bill_withdrawn, parliament_last_update, detail_url"
    )

    if status == "active":
        query = query.eq("is_act", False).eq("is_defeated", False).is_("bill_withdrawn", "null")
    elif status == "completed":
        query = query.eq("is_act", True)
    elif status == "defeated":
        query = query.eq("is_defeated", True)
    elif status == "withdrawn":
        query = query.not_.is_("bill_withdrawn", "null")

    if house:
        query = query.eq("current_house", house)
    if search:
        query = query.ilike("short_title", f"%{search}%")

    result = query.order("parliament_last_update", desc=True).range(skip, skip + take - 1).execute()
    return result.data or []


@router.get("/bills/{bill_id}", response_model=BillDetail)
async def get_bill(bill_id: int, request: Request) -> dict:
    db = request.app.state.supabase
    result = (
        db.table("bills")
        .select(
            "id, short_title, long_title, current_house, "
            "current_stage_name, is_act, is_defeated, bill_withdrawn, "
            "parliament_last_update, detail_url, introduced_session_id, summary"
        )
        .eq("id", bill_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Bill not found")
    return result.data


@router.get("/bills/{bill_id}/stages", response_model=list[StageDetail])
async def get_bill_stages(bill_id: int, request: Request) -> list[dict]:
    db = request.app.state.supabase
    result = (
        db.table("bill_stages")
        .select("id, stage_name, house, sort_order, last_update, bill_stage_sittings(sitting_date)")
        .eq("bill_id", bill_id)
        .order("sort_order")
        .execute()
    )

    stages = []
    for row in result.data or []:
        stages.append({
            "id": row["id"],
            "stage_name": row.get("stage_name"),
            "house": row.get("house"),
            "sort_order": row.get("sort_order"),
            "last_update": row.get("last_update"),
            "sittings": [s["sitting_date"] for s in row.get("bill_stage_sittings") or []],
        })
    return stages


@router.get("/bills/{bill_id}/result", response_model=list[StageResult])
async def get_bill_result(
    bill_id: int, request: Request, user: dict = Depends(get_current_user)
) -> list[dict]:
    """Aggregate (never per-MP) parliamentary Aye/No counts — gated on the caller
    having already cast their own shadow vote on this bill. Never call this from
    anywhere in the voting flow itself."""
    db = request.app.state.supabase
    vote_service = request.app.state.vote_service
    if not vote_service.has_voted(user["id"], bill_id=bill_id):
        raise HTTPException(status_code=403, detail="Cast your vote on this bill before viewing the result")

    result = (
        db.table("bill_stages")
        .select(
            "id, stage_name, "
            "parliamentary_divisions(division_id, house, division_date, title, "
            "aye_count, no_count, content_count, not_content_count, did_pass, division_number)"
        )
        .eq("bill_id", bill_id)
        .order("sort_order")
        .execute()
    )

    stages = []
    for row in result.data or []:
        divisions = row.get("parliamentary_divisions") or []
        if not divisions:
            continue
        stages.append({
            "stage_id": row["id"],
            "stage_name": row.get("stage_name"),
            "divisions": divisions,
        })
    return stages


@router.post("/admin/sync")
async def trigger_sync(request: Request, background_tasks: BackgroundTasks) -> dict:
    bill_sync = request.app.state.bill_sync
    background_tasks.add_task(bill_sync.sync_all_active)
    return {"message": "Full sync started in background"}


@router.post("/admin/sync/{bill_id}")
async def trigger_bill_sync(
    bill_id: int, request: Request, background_tasks: BackgroundTasks
) -> dict:
    bill_sync = request.app.state.bill_sync
    division_sync = request.app.state.division_sync
    background_tasks.add_task(bill_sync.sync_single_bill, bill_id)
    background_tasks.add_task(division_sync.sync_divisions_for_bill, bill_id)
    return {"message": f"Sync started for bill {bill_id}"}
