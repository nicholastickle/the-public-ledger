import logging

from fastapi import HTTPException, Request, status
from supabase_auth.errors import AuthApiError

logger = logging.getLogger(__name__)


async def get_current_user(request: Request) -> dict:
    """Verify the Supabase JWT from the Authorization header and return the user."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    token = auth_header.removeprefix("Bearer ").strip()
    supabase = request.app.state.supabase
    try:
        response = supabase.auth.get_user(token)
    except AuthApiError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    if not response or not response.user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    return {"id": response.user.id, "email": response.user.email}
