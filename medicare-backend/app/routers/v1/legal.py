from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services import legal_service

router = APIRouter(prefix="/legal", tags=["legal"])

VALID_PAGE_TYPES = {
    "privacy_policy", "terms_of_use", "medical_disclaimer",
    "consultation_notice", "data_consent"
}


class LegalContentOut(BaseModel):
    page_type: str
    title_en: str
    title_ja: str
    content_en: str
    content_ja: str
    is_draft: bool
    version: str

    model_config = {"from_attributes": True}


@router.get("/{page_type}", response_model=LegalContentOut)
async def get_legal(page_type: str, db: AsyncSession = Depends(get_db)) -> LegalContentOut:
    if page_type not in VALID_PAGE_TYPES:
        raise HTTPException(status_code=404, detail="Legal page not found")
    content = await legal_service.get_legal_content(db, page_type)
    if not content:
        raise HTTPException(status_code=404, detail="Legal content not found")
    return content
