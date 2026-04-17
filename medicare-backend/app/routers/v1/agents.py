"""Agent configuration & log router — /api/v1/agents"""

from __future__ import annotations

__all__: list[str] = []

import logging
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.agents import AgentActionLog, AgentConfiguration

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/agents", tags=["agents"])


# ---------------------------------------------------------------------------
# Pydantic response models
# ---------------------------------------------------------------------------


class AgentConfigOut(BaseModel):
    id: str
    agent_type: str
    name_en: str
    model: str
    is_enabled: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class AgentLogOut(BaseModel):
    id: int
    agent_id: str
    action: str
    status: str
    result: dict | None
    error: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class TogglePayload(BaseModel):
    is_enabled: bool


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@router.get("", response_model=list[AgentConfigOut])
async def list_agents(
    db: AsyncSession = Depends(get_db),
) -> list[AgentConfiguration]:
    """Return all AgentConfiguration rows sorted by agent_type."""
    try:
        result = await db.execute(
            select(AgentConfiguration).order_by(AgentConfiguration.agent_type)
        )
        return list(result.scalars().all())
    except Exception as exc:
        logger.error("list_agents failed: %s", exc)
        raise


@router.get("/logs", response_model=list[AgentLogOut])
async def list_all_logs(
    db: AsyncSession = Depends(get_db),
) -> list[AgentActionLog]:
    """Return the 100 most recent AgentActionLog rows across all agents."""
    try:
        result = await db.execute(
            select(AgentActionLog)
            .order_by(AgentActionLog.created_at.desc())
            .limit(100)
        )
        return list(result.scalars().all())
    except Exception as exc:
        logger.error("list_all_logs failed: %s", exc)
        raise


@router.get("/{agent_type}/logs", response_model=list[AgentLogOut])
async def list_agent_logs(
    agent_type: str,
    db: AsyncSession = Depends(get_db),
) -> list[AgentActionLog]:
    """Return the 100 most recent logs for a specific agent_type."""
    try:
        result = await db.execute(
            select(AgentActionLog)
            .where(AgentActionLog.agent_id == agent_type)
            .order_by(AgentActionLog.created_at.desc())
            .limit(100)
        )
        return list(result.scalars().all())
    except Exception as exc:
        logger.error("list_agent_logs(%s) failed: %s", agent_type, exc)
        raise


@router.post("/{agent_type}/toggle", response_model=AgentConfigOut)
async def toggle_agent(
    agent_type: str,
    payload: TogglePayload,
    db: AsyncSession = Depends(get_db),
) -> AgentConfiguration:
    """Toggle is_enabled for the given agent_type and return the updated row."""
    try:
        result = await db.execute(
            select(AgentConfiguration).where(
                AgentConfiguration.agent_type == agent_type
            )
        )
        agent: AgentConfiguration | None = result.scalars().first()

        if agent is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"AgentConfiguration with agent_type='{agent_type}' not found.",
            )

        agent.is_enabled = payload.is_enabled
        await db.commit()
        await db.refresh(agent)
        return agent
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("toggle_agent(%s) failed: %s", agent_type, exc)
        await db.rollback()
        raise
