from datetime import datetime
from pydantic import BaseModel


class KpiSnapshotOut(BaseModel):
    total_consultations: int
    pending_consultations: int
    active_subscriptions: int
    pending_approvals: int
    total_reviews: int
    avg_compliance_score: float
    conversion_rate: float
    churn_risk_count: int
    generated_at: datetime


class TrendPoint(BaseModel):
    date: str
    count: int


class VerticalDistribution(BaseModel):
    vertical: str
    count: int
    percentage: float


class AgentActivitySummary(BaseModel):
    agent_id: str
    runs_today: int
    success_rate: float
