from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.consultation import ConsultationCreate, ConsultationStatusOut
from app.services import consultation_service

router = APIRouter(prefix="/consultations", tags=["consultation"])


@router.post("", response_model=ConsultationStatusOut, status_code=201)
async def create_consultation(
    data: ConsultationCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> ConsultationStatusOut:
    ip = request.client.host if request.client else None
    consultation = await consultation_service.create_consultation(db, data, ip)
    return consultation


@router.get("/{consultation_id}/status", response_model=ConsultationStatusOut)
async def get_consultation_status(
    consultation_id: str, db: AsyncSession = Depends(get_db)
) -> ConsultationStatusOut:
    consultation = await consultation_service.get_consultation_status(db, consultation_id)
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return consultation
