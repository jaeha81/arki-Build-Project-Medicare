"""Compliance service — prohibited phrase checking and scoring."""

import re
from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.compliance import ProhibitedPhrase

__all__ = ["ViolationResult", "check_compliance", "calculate_compliance_score"]

_CRITICAL_PENALTY: float = 0.3
_WARNING_PENALTY: float = 0.1


@dataclass
class ViolationResult:
    phrase: str
    severity: str
    category: str
    suggestion: str | None
    matched_text: str


async def check_compliance(
    db: AsyncSession,
    content: str,
) -> list[ViolationResult]:
    """DB의 금지 문구/패턴과 대조하여 위반 목록 반환.

    검사 순서:
    1. ``phrase`` 필드에 대한 직접 포함 검사 (대소문자 무시).
    2. ``pattern`` 필드가 있으면 정규식 검사.

    Args:
        db: 비동기 SQLAlchemy 세션.
        content: 검사 대상 텍스트.

    Returns:
        발견된 위반 목록. 위반 없으면 빈 리스트.
    """
    result = await db.execute(
        select(ProhibitedPhrase).where(ProhibitedPhrase.is_active.is_(True))
    )
    phrases: list[ProhibitedPhrase] = list(result.scalars().all())

    violations: list[ViolationResult] = []

    for record in phrases:
        matched_text: str | None = None

        # 1. 직접 포함 검사
        if record.phrase.lower() in content.lower():
            # 실제 매칭된 원문 추출
            idx = content.lower().find(record.phrase.lower())
            matched_text = content[idx: idx + len(record.phrase)]

        # 2. 정규식 패턴 검사 (패턴이 존재하고 직접 검사에서 미탐지된 경우)
        if matched_text is None and record.pattern:
            try:
                match = re.search(record.pattern, content, re.IGNORECASE)
                if match:
                    matched_text = match.group(0)
            except re.error:
                # 잘못된 패턴은 무시
                pass

        if matched_text is not None:
            violations.append(
                ViolationResult(
                    phrase=record.phrase,
                    severity=record.severity,
                    category=record.category,
                    suggestion=record.suggestion,
                    matched_text=matched_text,
                )
            )

    return violations


async def calculate_compliance_score(violations: list[ViolationResult]) -> float:
    """violations 기반 0.0~1.0 점수 계산.

    감점 규칙:
    - critical 위반 1개당 -0.3
    - warning 위반 1개당 -0.1
    - 최소값 0.0

    Args:
        violations: :func:`check_compliance` 반환값.

    Returns:
        준수 점수 (1.0 = 완전 준수, 0.0 = 최다 위반).
    """
    score: float = 1.0
    for v in violations:
        if v.severity == "critical":
            score -= _CRITICAL_PENALTY
        else:
            score -= _WARNING_PENALTY
    return max(0.0, score)
