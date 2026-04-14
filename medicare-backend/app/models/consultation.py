import uuid
from sqlalchemy import String, Text, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, UUIDMixin, TimestampMixin


class ConsultationRequest(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "consultation_requests"

    vertical_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("verticals.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    email: Mapped[str] = mapped_column(String(300), nullable=False)
    age_range: Mapped[str | None] = mapped_column(String(50), nullable=True)
    preferred_language: Mapped[str] = mapped_column(String(10), default="en")
    health_survey: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    product_interest: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    consent_terms: Mapped[bool] = mapped_column(Boolean, default=False)
    consent_privacy: Mapped[bool] = mapped_column(Boolean, default=False)
    consent_medical: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(
        String(50), default="pending",
        # CHECK: pending, under_review, approved, rejected, completed
    )
    ip_address: Mapped[str | None] = mapped_column(String(50), nullable=True)
