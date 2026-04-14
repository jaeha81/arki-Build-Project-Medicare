from fastapi import APIRouter
from app.routers.v1.admin import consultations, approvals

router = APIRouter(prefix="/admin", tags=["admin"])
router.include_router(consultations.router)
router.include_router(approvals.router)
