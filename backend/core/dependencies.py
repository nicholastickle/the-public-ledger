import logging

from fastapi import HTTPException, Request, status

logger = logging.getLogger(__name__)


async def get_current_user(request: Request) -> dict:
    """Verify the Supabase JWT from the Authorization header or session cookie."""
    # TODO: implement once Supabase Auth is wired up
    # 1. Extract Bearer token from Authorization header (or session cookie)
    # 2. Verify with supabase.auth.get_user(token)
    # 3. Return the user dict
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
    )
