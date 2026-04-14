from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.kpi import (
    AgentActivitySummary,
    KpiSnapshotOut,
    TrendPoint,
    VerticalDistribution,
)
from app.services import kpi_service

router = APIRouter(prefix="/kpi", tags=["admin-kpi"])


@router.get("/snapshot", response_model=KpiSnapshotOut)
async def get_snapshot(db: AsyncSession = Depends(get_db)) -> KpiSnapshotOut:
    snapshot = await kpi_service.get_kpi_snapshot(db)
    return KpiSnapshotOut(
        total_consultations=snapshot.total_consultations,
        pending_consultations=snapshot.pending_consultations,
        active_subscriptions=snapshot.active_subscriptions,
        pending_approvals=snapshot.pending_approvals,
        total_reviews=snapshot.total_reviews,
        avg_compliance_score=snapshot.avg_compliance_score,
        conversion_rate=snapshot.conversion_rate,
        churn_risk_count=snapshot.churn_risk_count,
        generated_at=datetime.utcnow(),
    )


@router.get("/trend", response_model=list[TrendPoint])
async def get_trend(
    days: int = Query(30, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
) -> list[TrendPoint]:
    rows = await kpi_service.get_consultation_trend(db, days=days)
    return [TrendPoint(date=str(r["date"]), count=int(r["count"])) for r in rows]


@router.get("/verticals", response_model=list[VerticalDistribution])
async def get_verticals(
    db: AsyncSession = Depends(get_db),
) -> list[VerticalDistribution]:
    rows = await kpi_service.get_vertical_distribution(db)
    return [
        VerticalDistribution(
            vertical=str(r["vertical"]),
            count=int(r["count"]),
            percentage=float(r["percentage"]),
        )
        for r in rows
    ]


@router.get("/agents", response_model=list[AgentActivitySummary])
async def get_agents(
    db: AsyncSession = Depends(get_db),
) -> list[AgentActivitySummary]:
    rows = await kpi_service.get_agent_activity_summary(db)
    return [
        AgentActivitySummary(
            agent_id=str(r["agent_id"]),
            runs_today=int(r["runs_today"]),
            success_rate=float(r["success_rate"]),
        )
        for r in rows
    ]
