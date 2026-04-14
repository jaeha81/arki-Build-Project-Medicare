"""Compliance-related ORM models."""

from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin

__all__ = ["ProhibitedPhrase"]


class ProhibitedPhrase(Base, UUIDMixin, TimestampMixin):
    """금지 문구 및 패턴 테이블.

    severity 값: ``critical`` | ``warning``
    category 값: ``medical_claim`` | ``efficacy`` | ``guarantee``
    """

    __tablename__ = "prohibited_phrases"

    phrase: Mapped[str] = mapped_column(String(500), nullable=False)
    pattern: Mapped[str | None] = mapped_column(String(500), nullable=True)  # regex
    severity: Mapped[str] = mapped_column(String(50), default="warning")
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    suggestion: Mapped[str | None] = mapped_column(Text, nullable=True)
