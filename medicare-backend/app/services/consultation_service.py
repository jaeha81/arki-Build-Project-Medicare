import asyncio
import logging
from typing import Set

import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.consultation import ConsultationRequest
from app.schemas.consultation import ConsultationCreate

logger = logging.getLogger(__name__)

# fire-and-forget 태스크 참조를 유지해 GC에 의한 조기 수집을 방지한다
_background_tasks: Set[asyncio.Task] = set()


async def _fire_intake_agent(
    consultation_id: str,
    name: str,
    email: str,
    vertical_id: str | None,
    health_survey: dict | None,
    product_interest: list[str] | None,
) -> None:
    """agents 서비스의 IntakeAgent를 fire-and-forget 방식으로 호출한다.

    호출 실패 시 consultation 생성에는 영향을 주지 않으며 경고 로그만 기록한다.
    """
    url = f"{settings.agents_service_url}/agents/intake"
    payload: dict = {
        "consultation_id": consultation_id,
        "name": name,
        "email": email,
        "vertical_id": vertical_id,
        "health_survey": health_survey or {},
        "product_interest": product_interest,
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, json=payload)
            if response.status_code >= 400:
                logger.warning(
                    "IntakeAgent returned non-2xx status",
                    extra={
                        "consultation_id": consultation_id,
                        "status_code": response.status_code,
                        "body": response.text[:200],
                    },
                )
    except httpx.HTTPError as exc:
        logger.warning(
            "IntakeAgent HTTP error: %s",
            exc,
            extra={"consultation_id": consultation_id},
        )
    except Exception as exc:  # noqa: BLE001
        logger.warning(
            "IntakeAgent unexpected error: %s",
            exc,
            extra={"consultation_id": consultation_id},
        )


def _extract_product_interest(data: ConsultationCreate) -> list[str] | None:
    """ConsultationCreate.product_interest(dict | None)를 agents 서비스가 기대하는
    list[str] | None 형태로 변환한다.

    dict인 경우 값(value) 목록을 문자열로 평탄화하여 반환한다.
    """
    raw = data.product_interest
    if raw is None:
        return None
    if isinstance(raw, list):
        return [str(item) for item in raw]
    # dict: {'0': 'product_a', '1': 'product_b', ...} 또는 {'key': True, ...} 형태 모두 허용
    return [str(v) for v in raw.values()]


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

    task = asyncio.create_task(
        _fire_intake_agent(
            consultation_id=str(consultation.id),
            name=data.name,
            email=str(data.email),
            vertical_id=str(data.vertical_id) if data.vertical_id else None,
            health_survey=data.health_survey,
            product_interest=_extract_product_interest(data),
        )
    )
    _background_tasks.add(task)
    task.add_done_callback(_background_tasks.discard)

    return consultation


async def get_consultation_status(db: AsyncSession, consultation_id: str) -> ConsultationRequest | None:
    from sqlalchemy import select  # noqa: PLC0415
    import uuid  # noqa: PLC0415
    result = await db.execute(
        select(ConsultationRequest).where(ConsultationRequest.id == uuid.UUID(consultation_id))
    )
    return result.scalar_one_or_none()
