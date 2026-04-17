from fastapi import APIRouter
from app.routers.v1 import agents, catalog, faq, consultation, legal, auth, customer
from app.routers.v1.admin import router as admin_router

router = APIRouter(prefix="/api/v1")
router.include_router(catalog.router)
router.include_router(faq.router)
router.include_router(consultation.router)
router.include_router(legal.router)
router.include_router(auth.router)
router.include_router(customer.router)
router.include_router(admin_router)
router.include_router(agents.router)
