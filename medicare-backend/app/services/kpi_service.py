from dataclasses import dataclass
from datetime import datetime, timedelta, date

from sqlalchemy import select, func, cast, Date, Integer, case
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.agents import AdminApproval, AgentActionLog
from app.models.consultation import ConsultationRequest
from app.models.review import Review
from app.models.catalog import Vertical


@dataclass
class KpiSnapshot:
    total_consultations: int
    pending_consultations: int
    active_subscriptions: int
    pending_approvals: int
    total_reviews: int
    avg_compliance_score: float
    conversion_rate: float
    churn_risk_count: int


async def get_kpi_snapshot(db: AsyncSession) -> KpiSnapshot:
    """현재 KPI 스냅샷 반환"""
    total_consultations: int = await db.scalar(
        select(func.count(ConsultationRequest.id))
    ) or 0

    pending_consultations: int = await db.scalar(
        select(func.count(ConsultationRequest.id)).where(
            ConsultationRequest.status == "pending"
        )
    ) or 0

    completed_consultations: int = await db.scalar(
        select(func.count(ConsultationRequest.id)).where(
            ConsultationRequest.status == "completed"
        )
    ) or 0

    pending_approvals: int = await db.scalar(
        select(func.count(AdminApproval.id)).where(
            AdminApproval.status == "pending"
        )
    ) or 0

    total_reviews: int = await db.scalar(
        select(func.count(Review.id))
    ) or 0

    # 활성 구독: Phase 2 구독 테이블이 없으므로 완료된 상담을 플레이스홀더로 사용
    active_subscriptions: int = completed_consultations

    # 평균 컴플라이언스 점수: AgentActionLog 성공률 기반
    total_logs: int = await db.scalar(select(func.count(AgentActionLog.id))) or 0
    success_logs: int = await db.scalar(
        select(func.count(AgentActionLog.id)).where(
            AgentActionLog.status == "success"
        )
    ) or 0
    avg_compliance_score: float = (
        round(success_logs / total_logs * 100, 2) if total_logs > 0 else 0.0
    )

    # 전환율: 완료된 상담 / 전체 상담
    conversion_rate: float = (
        round(completed_consultations / total_consultations * 100, 2)
        if total_consultations > 0
        else 0.0
    )

    # 이탈 위험: under_review 상태가 7일 이상 경과한 상담
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    churn_risk_count: int = await db.scalar(
        select(func.count(ConsultationRequest.id)).where(
            ConsultationRequest.status == "under_review",
            ConsultationRequest.created_at <= seven_days_ago,
        )
    ) or 0

    return KpiSnapshot(
        total_consultations=total_consultations,
        pending_consultations=pending_consultations,
        active_subscriptions=active_subscriptions,
        pending_approvals=pending_approvals,
        total_reviews=total_reviews,
        avg_compliance_score=avg_compliance_score,
        conversion_rate=conversion_rate,
        churn_risk_count=churn_risk_count,
    )


async def get_consultation_trend(
    db: AsyncSession, days: int = 30
) -> list[dict[str, str | int]]:
    """일별 상담 수 트렌드 (지난 N일)
    반환: [{"date": "2026-04-01", "count": 5}, ...]
    """
    since = datetime.utcnow() - timedelta(days=days)

    result = await db.execute(
        select(
            cast(ConsultationRequest.created_at, Date).label("day"),
            func.count(ConsultationRequest.id).label("count"),
        )
        .where(ConsultationRequest.created_at >= since)
        .group_by(cast(ConsultationRequest.created_at, Date))
        .order_by(cast(ConsultationRequest.created_at, Date))
    )
    rows = result.all()

    # 날짜 맵으로 변환 후 누락된 날짜는 0으로 채움
    count_map: dict[str, int] = {
        row.day.strftime("%Y-%m-%d"): row.count for row in rows
    }
    trend: list[dict[str, str | int]] = []
    for i in range(days):
        d: date = (datetime.utcnow() - timedelta(days=days - 1 - i)).date()
        key = d.strftime("%Y-%m-%d")
        trend.append({"date": key, "count": count_map.get(key, 0)})

    return trend


async def get_vertical_distribution(db: AsyncSession) -> list[dict[str, str | int | float]]:
    """버티컬별 상담 분포
    반환: [{"vertical": "weight-loss", "count": 10, "percentage": 40.0}, ...]
    """
    result = await db.execute(
        select(
            Vertical.slug.label("vertical"),
            func.count(ConsultationRequest.id).label("count"),
        )
        .join(ConsultationRequest, ConsultationRequest.vertical_id == Vertical.id, isouter=True)
        .group_by(Vertical.slug)
        .order_by(func.count(ConsultationRequest.id).desc())
    )
    rows = result.all()

    total: int = sum(row.count for row in rows)
    distribution: list[dict[str, str | int | float]] = []
    for row in rows:
        percentage: float = (
            round(row.count / total * 100, 1) if total > 0 else 0.0
        )
        distribution.append(
            {
                "vertical": row.vertical,
                "count": row.count,
                "percentage": percentage,
            }
        )
    return distribution


async def get_agent_activity_summary(db: AsyncSession) -> list[dict[str, str | int | float]]:
    """에이전트별 오늘 활동 요약
    반환: [{"agent_id": "intake_agent", "runs_today": 5, "success_rate": 0.9}, ...]
    """
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    result = await db.execute(
        select(
            AgentActionLog.agent_id,
            func.count(AgentActionLog.id).label("runs_today"),
            func.sum(
                case((AgentActionLog.status == "success", 1), else_=0)
            ).label("success_count"),
        )
        .where(AgentActionLog.created_at >= today_start)
        .group_by(AgentActionLog.agent_id)
        .order_by(func.count(AgentActionLog.id).desc())
    )
    rows = result.all()

    summary: list[dict[str, str | int | float]] = []
    for row in rows:
        runs: int = row.runs_today or 0
        successes: int = row.success_count or 0
        success_rate: float = round(successes / runs, 2) if runs > 0 else 0.0
        summary.append(
            {
                "agent_id": row.agent_id,
                "runs_today": runs,
                "success_rate": success_rate,
            }
        )
    return summary
