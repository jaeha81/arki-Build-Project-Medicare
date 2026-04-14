"""FastAPI application entry point for the Medicare Agents service (port 8001)."""

from fastapi import FastAPI, HTTPException, status

from app.agents.compliance_agent import ComplianceGateAgent
from app.agents.intake_agent import IntakeAgent
from app.queue.redis_client import RedisClient
from app.schemas.agent_schemas import AgentResult, ComplianceInput, IntakeInput

__all__ = ["app"]

app = FastAPI(
    title="Medicare Agents Service",
    description="AI agent microservice for the Medicare telemedicine platform.",
    version="0.1.0",
)

_redis = RedisClient()


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@app.get("/agents/health", tags=["system"])
async def health_check() -> dict:
    """Return service liveness status."""
    redis_ok = await _redis.ping()
    return {
        "status": "ok",
        "service": "medicare-agents",
        "redis": "connected" if redis_ok else "unavailable",
    }


# ---------------------------------------------------------------------------
# Queue status
# ---------------------------------------------------------------------------

@app.get("/agents/queue/status", tags=["queue"])
async def queue_status() -> dict:
    """Return current length of the intake processing queue."""
    intake_length = await _redis.queue_length("intake_queue")
    return {
        "intake_queue": intake_length,
    }


# ---------------------------------------------------------------------------
# Intake agent
# ---------------------------------------------------------------------------

@app.post(
    "/agents/intake",
    response_model=AgentResult,
    status_code=status.HTTP_200_OK,
    tags=["agents"],
)
async def run_intake_agent(payload: IntakeInput) -> AgentResult:
    """Execute the IntakeAgent with the supplied patient inquiry data.

    - On success: returns a structured :class:`AgentResult` with ``success=True``.
    - When Claude's confidence is below 0.7, ``needs_approval=True`` and an
      ``approval_id`` are included in the response.
    - On agent failure: raises HTTP 500 with the error detail.
    """
    agent = IntakeAgent()
    result = await agent.execute(payload.model_dump())
    if not result.success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result.error or "IntakeAgent execution failed.",
        )
    return result


# ---------------------------------------------------------------------------
# Compliance Gate agent
# ---------------------------------------------------------------------------

@app.post(
    "/agents/compliance",
    response_model=AgentResult,
    status_code=status.HTTP_200_OK,
    tags=["agents"],
)
async def run_compliance_agent(payload: ComplianceInput) -> AgentResult:
    """Execute the ComplianceGateAgent with the supplied content.

    - 1차: 정규식 패턴 사전 검사.
    - 2차: Claude Haiku 검사.
    - 3차: score < 0.7이면 Claude Sonnet 재검사.
    - score < 0.7이면 ``needs_approval=True`` 및 ``approval_id`` 포함.
    - 실패 시 HTTP 500.
    """
    agent = ComplianceGateAgent()
    result = await agent.execute(payload.model_dump())
    if not result.success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result.error or "ComplianceGateAgent execution failed.",
        )
    return result
