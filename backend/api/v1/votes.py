import logging
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import BaseModel

from core.dependencies import get_current_user
from services.vote_service import DuplicateVoteError

logger = logging.getLogger(__name__)

router = APIRouter()


class CastVoteRequest(BaseModel):
    choice: str

    def validate_choice(self) -> None:
        if self.choice not in ("yes", "no", "abstain"):
            raise HTTPException(status_code=422, detail="choice must be 'yes', 'no', or 'abstain'")


class VoteReceipt(BaseModel):
    id: str
    choice: str
    created_at: str


class MyVote(BaseModel):
    target_type: str
    target_id: int | str
    title: str | None
    detail_url: str | None
    choice: str
    created_at: str


class RecentVoteEvent(BaseModel):
    target_type: str
    target_id: int | str
    choice: str
    created_at: str


class Tally(BaseModel):
    yes_count: int
    no_count: int
    abstain_count: int


@router.post("/bills/{bill_id}/vote", response_model=VoteReceipt)
async def vote_on_bill(
    bill_id: int, body: CastVoteRequest, request: Request, user: dict = Depends(get_current_user)
) -> dict:
    body.validate_choice()
    vote_service = request.app.state.vote_service
    try:
        return vote_service.cast_vote(user["id"], body.choice, bill_id=bill_id)
    except DuplicateVoteError:
        raise HTTPException(status_code=409, detail="You have already voted on this bill")


@router.post("/regulations/{regulation_id}/vote", response_model=VoteReceipt)
async def vote_on_regulation(
    regulation_id: str, body: CastVoteRequest, request: Request, user: dict = Depends(get_current_user)
) -> dict:
    body.validate_choice()
    vote_service = request.app.state.vote_service
    try:
        return vote_service.cast_vote(user["id"], body.choice, regulation_id=regulation_id)
    except DuplicateVoteError:
        raise HTTPException(status_code=409, detail="You have already voted on this regulation")


@router.get("/users/me/votes", response_model=list[MyVote])
async def get_my_votes(request: Request, user: dict = Depends(get_current_user)) -> list[dict]:
    vote_service = request.app.state.vote_service
    return vote_service.get_user_votes(user["id"])


@router.get("/bills/{bill_id}/tally", response_model=Tally)
async def get_bill_tally(bill_id: int, request: Request) -> dict:
    vote_service = request.app.state.vote_service
    return vote_service.get_tally(bill_id=bill_id)


@router.get("/regulations/{regulation_id}/tally", response_model=Tally)
async def get_regulation_tally(regulation_id: str, request: Request) -> dict:
    vote_service = request.app.state.vote_service
    return vote_service.get_tally(regulation_id=regulation_id)


@router.get("/votes/recent", response_model=list[RecentVoteEvent])
async def get_recent_votes(
    request: Request,
    since: datetime | None = Query(None, description="ISO 8601 timestamp; defaults to the last 60 seconds"),
    limit: int = Query(50, ge=1, le=200),
) -> list[dict]:
    """Anonymized feed for the badge poller — never includes user identity."""
    vote_service = request.app.state.vote_service
    if since is None:
        since = datetime.now(timezone.utc) - timedelta(seconds=60)
    return vote_service.get_recent_votes(since, limit=limit)
