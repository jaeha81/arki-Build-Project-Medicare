"""Subscription ORM model."""
import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class Subscription(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "subscriptions"

    customer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("customers.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    vertical: Mapped[str] = mapped_column(String(100), nullable=False)
    plan: Mapped[str] = mapped_column(String(100), nullable=False, default="basic")
    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="active",
        # CHECK: active | paused | cancelled | expired
    )
    renewal_date: Mapped[str | None] = mapped_column(String(20), nullable=True)
