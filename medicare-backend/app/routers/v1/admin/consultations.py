from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.admin import ConsultationListItem, ConsultationStatusUpdate, AdminStats
from app.services import admin_service

router = APIRouter(prefix="/consultations")


@router.get("", response_model=list[ConsultationListItem])
async def list_consultations(
    status: str | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
) -> list[ConsultationListItem]:
    return await admin_service.list_consultations(db, status=status, skip=skip, limit=limit)


@router.patch("/{consultation_id}/status", response_model=ConsultationListItem)
async def update_status(
    consultation_id: str,
    update: ConsultationStatusUpdate,
    db: AsyncSession = Depends(get_db),
) -> ConsultationListItem:
    consultation = await admin_service.update_consultation_status(db, consultation_id, update)
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return consultation


@router.get("/stats", response_model=AdminStats)
async def get_stats(db: AsyncSession = Depends(get_db)) -> AdminStats:
    stats = await admin_service.get_stats(db)
    return AdminStats(**stats)
