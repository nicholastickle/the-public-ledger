import logging

from fastapi import APIRouter, BackgroundTasks, HTTPException, Query, Request
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter()


def _map_procedure(name: str | None) -> str:
    """Map the SI API's free-text procedure name to the frontend's 4-value enum."""
    if not name:
        return "none"
    lowered = name.lower()
    if "super" in lowered and "affirmative" in lowered:
        return "super-affirmative"
    if "affirmative" in lowered:
        return "affirmative"
    if "negative" in lowered:
        return "negative"
    return "none"


def _derive_status(paper_made_date: str | None) -> str:
    # The SI API exposes no clean boolean for annulled/withdrawn (would require
    # parsing free-text timeline step names) — not attempted yet, so those two
    # states never appear here today. See regulation_sync.py.
    return "made" if paper_made_date else "pending"


def _derive_house(commons_date: str | None, lords_date: str | None) -> str | None:
    if commons_date and lords_date:
        return "Both"
    if commons_date:
        return "Commons"
    if lords_date:
        return "Lords"
    return None


def _to_response(row: dict) -> dict:
    return {
        "id": row["id"],
        "title": row.get("title"),
        "enabling_act": ", ".join(row.get("enabling_act_names") or []) or None,
        "procedure": _map_procedure(row.get("procedure_name")),
        "laid_date": row.get("commons_laying_date") or row.get("lords_laying_date"),
        "made_date": row.get("paper_made_date"),
        "deadline": None,  # not derivable from the SI API — see regulation_sync.py
        "status": _derive_status(row.get("paper_made_date")),
        "house": _derive_house(row.get("commons_laying_date"), row.get("lords_laying_date")),
        "last_update": row.get("updated_at"),
        "detail_url": row.get("detail_url"),
        "paper_number": row.get("paper_number"),
    }


class RegulationSummary(BaseModel):
    id: str
    title: str | None
    enabling_act: str | None
    procedure: str
    laid_date: str | None
    made_date: str | None
    deadline: str | None
    status: str
    house: str | None
    last_update: str | None
    detail_url: str | None
    paper_number: int | None


@router.get("/regulations", response_model=list[RegulationSummary])
async def list_regulations(
    request: Request,
    status: str | None = Query(None, pattern="^(pending|approved|made|annulled|withdrawn)$"),
    procedure: str | None = Query(None, pattern="^(affirmative|negative|super-affirmative|none)$"),
    skip: int = Query(0, ge=0),
    take: int = Query(20, ge=1, le=100),
) -> list[dict]:
    # status/procedure are derived, not stored columns (see _to_response), so
    # filtering happens against the underlying raw columns here — never filter
    # in Python *after* paginating, or a filtered page can come back short even
    # when more matching rows exist past the current range.
    db = request.app.state.supabase
    query = db.table("regulations").select(
        "id, title, enabling_act_names, procedure_name, commons_laying_date, "
        "lords_laying_date, paper_made_date, detail_url, updated_at, paper_number"
    )

    if status == "pending":
        query = query.is_("paper_made_date", "null")
    elif status == "made":
        query = query.not_.is_("paper_made_date", "null")
    elif status in ("approved", "annulled", "withdrawn"):
        # Not derivable from what the SI API gives us today (see module docstring
        # in regulation_sync.py) — nothing can ever match, so return early.
        return []

    if procedure == "none":
        query = query.not_.ilike("procedure_name", "%affirmative%").not_.ilike("procedure_name", "%negative%")
    elif procedure == "super-affirmative":
        query = query.ilike("procedure_name", "%super%affirmative%")
    elif procedure == "affirmative":
        query = query.ilike("procedure_name", "%affirmative%").not_.ilike("procedure_name", "%super%affirmative%")
    elif procedure == "negative":
        query = query.ilike("procedure_name", "%negative%")

    result = query.order("paper_made_date", desc=True).range(skip, skip + take - 1).execute()
    return [_to_response(r) for r in (result.data or [])]


@router.get("/regulations/{regulation_id}", response_model=RegulationSummary)
async def get_regulation(regulation_id: str, request: Request) -> dict:
    db = request.app.state.supabase
    result = (
        db.table("regulations")
        .select(
            "id, title, enabling_act_names, procedure_name, commons_laying_date, "
            "lords_laying_date, paper_made_date, detail_url, updated_at"
        )
        .eq("id", regulation_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Regulation not found")
    return _to_response(result.data)


@router.post("/admin/regulations/sync")
async def trigger_regulation_sync(request: Request, background_tasks: BackgroundTasks) -> dict:
    regulation_sync = request.app.state.regulation_sync
    background_tasks.add_task(regulation_sync.sync_recent)
    background_tasks.add_task(regulation_sync.sync_details)
    return {"message": "Regulation sync started in background"}
