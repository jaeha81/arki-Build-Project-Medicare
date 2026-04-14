from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings

# P1 fix: bearer token guard for all /admin/* endpoints
_bearer = HTTPBearer(auto_error=True)


async def require_admin_token(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> str:
    """
    Dev-phase stub: validates a static bearer token from env.
    Phase 4: replace with Supabase JWT + RBAC role check.
    """
    expected = settings.admin_api_token
    if credentials.credentials != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return credentials.credentials


from app.routers.v1.admin import consultations, approvals, kpi, compliance  # noqa: E402

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(require_admin_token)],  # P1 fix: all sub-routes protected
)
router.include_router(consultations.router)
router.include_router(approvals.router)
router.include_router(kpi.router)
router.include_router(compliance.router)
