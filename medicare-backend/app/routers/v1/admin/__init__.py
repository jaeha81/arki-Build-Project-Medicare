"""Admin router — JWT RBAC protected (role == "admin" required)."""

from fastapi import APIRouter, Depends

from app.dependencies import require_admin_role
from app.routers.v1.admin import consultations, approvals, kpi, compliance, subscriptions  # noqa: E402

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(require_admin_role)],
)
router.include_router(consultations.router)
router.include_router(approvals.router)
router.include_router(kpi.router)
router.include_router(compliance.router)
router.include_router(subscriptions.router)
