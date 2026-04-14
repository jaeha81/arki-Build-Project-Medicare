from fastapi import APIRouter
from app.routers.v1 import catalog, faq, consultation, legal

router = APIRouter(prefix="/api/v1")
router.include_router(catalog.router)
router.include_router(faq.router)
router.include_router(consultation.router)
router.include_router(legal.router)
