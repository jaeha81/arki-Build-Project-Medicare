"""ORM models local to the agents service.

These mirror the equivalent models in medicare-backend to maintain service
independence — both services connect to the same physical database but manage
their own SQLAlchemy metadata.
"""

import uuid

from sqlalchemy import BigInteger, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin

__all__ = ["AdminApproval", "AgentActionLog"]


class AdminApproval(Base, UUIDMixin, TimestampMixin):
    """Pending approval requests raised by agents."""

    __tablename__ = "admin_approvals"

    agent_id: Mapped[str] = mapped_column(String(200), nullable=False)
    action: Mapped[str] = mapped_column(String(200), nullable=False)
    details: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    reviewed_by: Mapped[uuid.UUID | None] = mapped_column(nullable=True)
    review_note: Mapped[str | None] = mapped_column(Text, nullable=True)


class AgentActionLog(Base, TimestampMixin):
    """Append-only audit log — no UPDATE/DELETE allowed."""

    __tablename__ = "agent_action_logs"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    agent_id: Mapped[str] = mapped_column(String(200), nullable=False)
    action: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    result: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
