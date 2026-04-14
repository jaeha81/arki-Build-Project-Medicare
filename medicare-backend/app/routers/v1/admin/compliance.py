"""Admin compliance router — prohibited phrase management and text checking."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.compliance import ProhibitedPhrase
from app.schemas.compliance import (
    ComplianceCheckRequest,
    ComplianceCheckResult,
    ProhibitedPhraseCreate,
    ProhibitedPhraseRead,
)
from app.services.compliance_service import calculate_compliance_score, check_compliance

__all__ = ["router"]

router = APIRouter(prefix="/compliance", tags=["admin-compliance"])

_HUMAN_REVIEW_THRESHOLD: float = 0.7


# ---------------------------------------------------------------------------
# GET /api/v1/admin/compliance/phrases
# ---------------------------------------------------------------------------

@router.get("/phrases", response_model=list[ProhibitedPhraseRead])
async def list_phrases(
    db: AsyncSession = Depends(get_db),
) -> list[ProhibitedPhraseRead]:
    """활성 금지 문구 전체 목록 반환."""
    result = await db.execute(
        select(ProhibitedPhrase).order_by(ProhibitedPhrase.created_at.desc())
    )
    return list(result.scalars().all())


# ---------------------------------------------------------------------------
# POST /api/v1/admin/compliance/phrases
# ---------------------------------------------------------------------------

@router.post(
    "/phrases",
    response_model=ProhibitedPhraseRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_phrase(
    body: ProhibitedPhraseCreate,
    db: AsyncSession = Depends(get_db),
) -> ProhibitedPhraseRead:
    """새 금지 문구 추가."""
    phrase = ProhibitedPhrase(
        phrase=body.phrase,
        pattern=body.pattern,
        severity=body.severity,
        category=body.category,
        suggestion=body.suggestion,
    )
    db.add(phrase)
    await db.commit()
    await db.refresh(phrase)
    return phrase


# ---------------------------------------------------------------------------
# DELETE /api/v1/admin/compliance/phrases/{id}
# ---------------------------------------------------------------------------

@router.delete("/phrases/{phrase_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_phrase(
    phrase_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """금지 문구 삭제."""
    result = await db.execute(
        select(ProhibitedPhrase).where(ProhibitedPhrase.id == phrase_id)
    )
    phrase = result.scalar_one_or_none()
    if not phrase:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phrase not found")
    await db.execute(delete(ProhibitedPhrase).where(ProhibitedPhrase.id == phrase_id))
    await db.commit()


# ---------------------------------------------------------------------------
# POST /api/v1/admin/compliance/check
# ---------------------------------------------------------------------------

@router.post("/check", response_model=ComplianceCheckResult)
async def check_text(
    body: ComplianceCheckRequest,
    db: AsyncSession = Depends(get_db),
) -> ComplianceCheckResult:
    """텍스트 컴플라이언스 검사.

    DB에 등록된 금지 문구·패턴과 대조하고 점수를 계산합니다.
    ``compliance_score < 0.7`` 이면 ``requires_human_review=True``.
    """
    violations = await check_compliance(db, body.content)
    score = await calculate_compliance_score(violations)

    return ComplianceCheckResult(
        is_compliant=len(violations) == 0,
        compliance_score=score,
        violations=[
            {
                "phrase": v.phrase,
                "severity": v.severity,
                "category": v.category,
                "suggestion": v.suggestion,
                "matched_text": v.matched_text,
            }
            for v in violations
        ],
        requires_human_review=score < _HUMAN_REVIEW_THRESHOLD,
    )
