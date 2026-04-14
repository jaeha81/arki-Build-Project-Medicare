"""
컴플라이언스 금지 문구 시드 데이터 스크립트
실행: python scripts/seed_compliance.py
"""

import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import settings
from app.models.base import Base
from app.models.compliance import ProhibitedPhrase

engine = create_async_engine(settings.database_url, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

INITIAL_PHRASES: list[dict] = [
    # ── critical: medical_claim ──────────────────────────────────────────────
    {
        "phrase": "완치됩니다",
        "pattern": r"완치\s*(됩니다|됩니다\.)",
        "severity": "critical",
        "category": "medical_claim",
        "suggestion": "증상 완화에 도움이 될 수 있습니다 {COMPLIANCE_PLACEHOLDER}",
    },
    {
        "phrase": "치료됩니다",
        "pattern": r"치료\s*(됩니다|할\s*수\s*있습니다)",
        "severity": "critical",
        "category": "medical_claim",
        "suggestion": "증상 개선을 지원할 수 있습니다 {COMPLIANCE_PLACEHOLDER}",
    },
    {
        "phrase": "FDA 승인",
        "pattern": r"FDA\s*(승인|approved|承認)",
        "severity": "warning",
        "category": "medical_claim",
        "suggestion": "의약품 규제 당국의 허가를 받은 성분이 포함되어 있습니다 {COMPLIANCE_PLACEHOLDER}",
    },
    {
        "phrase": "의학적으로 증명",
        "pattern": r"(의학적으로|임상적으로)\s*(증명|검증|입증)\s*(되었습니다|됩니다)",
        "severity": "critical",
        "category": "medical_claim",
        "suggestion": "임상 연구에서 긍정적인 결과가 보고된 성분을 포함하고 있습니다 {COMPLIANCE_PLACEHOLDER}",
    },
    {
        "phrase": "질병 치료",
        "pattern": r"(질병|질환|증상)\s*(을|를)?\s*치료",
        "severity": "critical",
        "category": "medical_claim",
        "suggestion": "건강 관리에 도움이 될 수 있습니다 {COMPLIANCE_PLACEHOLDER}",
    },
    # ── critical: efficacy ───────────────────────────────────────────────────
    {
        "phrase": "100% 효과",
        "pattern": r"100\s*%\s*(효과|effective|効果)",
        "severity": "critical",
        "category": "efficacy",
        "suggestion": "많은 사용자가 효과를 경험했습니다 {COMPLIANCE_PLACEHOLDER}",
    },
    {
        "phrase": "즉시 효과",
        "pattern": r"(즉시|바로|당장)\s*(효과|결과|개선)",
        "severity": "critical",
        "category": "efficacy",
        "suggestion": "개인차가 있을 수 있으며 지속적인 사용을 권장합니다 {COMPLIANCE_PLACEHOLDER}",
    },
    {
        "phrase": "확실한 효과",
        "pattern": r"(확실한|완벽한|완전한)\s*(효과|결과)",
        "severity": "critical",
        "category": "efficacy",
        "suggestion": "효과는 개인마다 다를 수 있습니다 {COMPLIANCE_PLACEHOLDER}",
    },
    {
        "phrase": "가장 효과적인 약",
        "pattern": r"(가장|제일|최고로)\s*(효과적인|좋은)\s*(약|치료법|솔루션)",
        "severity": "warning",
        "category": "efficacy",
        "suggestion": "검증된 성분이 포함된 제품입니다 {COMPLIANCE_PLACEHOLDER}",
    },
    {
        "phrase": "단기간 효과",
        "pattern": r"(단기간|며칠|1주일)\s*(만에|안에|이내)\s*(효과|변화)",
        "severity": "warning",
        "category": "efficacy",
        "suggestion": "꾸준한 사용으로 변화를 경험할 수 있습니다 {COMPLIANCE_PLACEHOLDER}",
    },
    # ── critical: guarantee ──────────────────────────────────────────────────
    {
        "phrase": "부작용 없음",
        "pattern": r"부작용\s*(없|없음|없습니다|이\s*없)",
        "severity": "critical",
        "category": "guarantee",
        "suggestion": "대부분의 사용자에게 잘 맞는 성분을 사용하고 있으나 개인차가 있을 수 있습니다 {COMPLIANCE_PLACEHOLDER}",
    },
    {
        "phrase": "효과를 보장합니다",
        "pattern": r"(효과|결과)\s*(를|을)?\s*(보장|guarantee)",
        "severity": "critical",
        "category": "guarantee",
        "suggestion": "효과적인 결과를 위해 노력하고 있습니다 {COMPLIANCE_PLACEHOLDER}",
    },
    {
        "phrase": "반드시 효과",
        "pattern": r"(반드시|무조건|틀림없이)\s*(효과|좋아)",
        "severity": "critical",
        "category": "guarantee",
        "suggestion": "효과는 개인의 상태에 따라 다를 수 있습니다 {COMPLIANCE_PLACEHOLDER}",
    },
    {
        "phrase": "안전성 보장",
        "pattern": r"(완전히|100%)\s*(안전|safe)",
        "severity": "critical",
        "category": "guarantee",
        "suggestion": "엄격한 품질 관리를 거쳐 제조된 제품입니다 {COMPLIANCE_PLACEHOLDER}",
    },
    # ── warning: medical_claim ───────────────────────────────────────────────
    {
        "phrase": "처방 불필요",
        "pattern": r"(처방\s*없이|처방전\s*없이|의사\s*없이)\s*(사용|구매|복용)",
        "severity": "warning",
        "category": "medical_claim",
        "suggestion": "전문 의료진과 상담 후 사용을 권장합니다 {COMPLIANCE_PLACEHOLDER}",
    },
    {
        "phrase": "의사 추천",
        "pattern": r"(의사|전문의|의료진)\s*(추천|권장|보증)",
        "severity": "warning",
        "category": "medical_claim",
        "suggestion": "의료 전문가의 상담을 통해 적합성을 확인해보세요 {COMPLIANCE_PLACEHOLDER}",
    },
    {
        "phrase": "임상 실험 완료",
        "pattern": r"(임상\s*실험|임상\s*시험)\s*(완료|통과|합격)",
        "severity": "warning",
        "category": "medical_claim",
        "suggestion": "관련 연구에서 긍정적인 결과가 보고되었습니다 {COMPLIANCE_PLACEHOLDER}",
    },
    # ── warning: efficacy ────────────────────────────────────────────────────
    {
        "phrase": "다이어트 효과",
        "pattern": r"(다이어트|체중\s*감량)\s*(효과|결과)\s*(보장|확실|완벽)",
        "severity": "warning",
        "category": "efficacy",
        "suggestion": "균형 잡힌 식이요법과 함께 사용하면 도움이 될 수 있습니다 {COMPLIANCE_PLACEHOLDER}",
    },
    {
        "phrase": "탈모 완전 회복",
        "pattern": r"(탈모|모발\s*손실)\s*(완전|100%)\s*(회복|치료|해결)",
        "severity": "warning",
        "category": "efficacy",
        "suggestion": "모발 건강 개선을 지원하는 성분이 포함되어 있습니다 {COMPLIANCE_PLACEHOLDER}",
    },
    {
        "phrase": "피부 완벽 개선",
        "pattern": r"(피부)\s*(완벽|완전|100%)\s*(개선|치료|회복)",
        "severity": "warning",
        "category": "efficacy",
        "suggestion": "피부 상태 개선에 도움이 될 수 있습니다 {COMPLIANCE_PLACEHOLDER}",
    },
]


async def seed_compliance(session: AsyncSession) -> None:
    print(f"Seeding {len(INITIAL_PHRASES)} prohibited phrases...")
    for data in INITIAL_PHRASES:
        phrase_obj = ProhibitedPhrase(
            phrase=data["phrase"],
            pattern=data.get("pattern"),
            severity=data["severity"],
            category=data["category"],
            suggestion=data.get("suggestion"),
            is_active=True,
        )
        session.add(phrase_obj)
    await session.commit()
    print("Compliance seed complete.")


async def main() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as session:
        await seed_compliance(session)
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
