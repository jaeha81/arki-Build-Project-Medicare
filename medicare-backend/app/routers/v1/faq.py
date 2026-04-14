from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.catalog import FAQOut
from app.services import faq_service

router = APIRouter(prefix="/faq", tags=["faq"])


@router.get("", response_model=list[FAQOut])
async def list_faqs(
    vertical: str | None = Query(None, description="Filter by vertical slug"),
    db: AsyncSession = Depends(get_db),
) -> list[FAQOut]:
    return await faq_service.get_faqs(db, vertical_slug=vertical)
