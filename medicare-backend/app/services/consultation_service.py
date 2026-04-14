from sqlalchemy.ext.asyncio import AsyncSession
from app.models.consultation import ConsultationRequest
from app.schemas.consultation import ConsultationCreate


async def create_consultation(
    db: AsyncSession, data: ConsultationCreate, ip_address: str | None = None
) -> ConsultationRequest:
    consultation = ConsultationRequest(
        vertical_id=data.vertical_id,
        name=data.name,
        email=data.email,
        age_range=data.age_range,
        preferred_language=data.preferred_language,
        health_survey=data.health_survey,
        product_interest=data.product_interest,
        consent_terms=data.consent_terms,
        consent_privacy=data.consent_privacy,
        consent_medical=data.consent_medical,
        ip_address=ip_address,
        status="pending",
    )
    db.add(consultation)
    await db.commit()
    await db.refresh(consultation)
    return consultation


async def get_consultation_status(db: AsyncSession, consultation_id: str) -> ConsultationRequest | None:
    from sqlalchemy import select
    import uuid
    result = await db.execute(
        select(ConsultationRequest).where(ConsultationRequest.id == uuid.UUID(consultation_id))
    )
    return result.scalar_one_or_none()
