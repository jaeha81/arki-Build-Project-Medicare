import uuid
from sqlalchemy import String, Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, UUIDMixin, TimestampMixin


class Prescription(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "prescriptions"

    consultation_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("consultation_requests.id"), nullable=False
    )
    customer_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("customers.id"), nullable=False
    )
    doctor_id: Mapped[str] = mapped_column(String(255), nullable=False)
    drug_name: Mapped[str] = mapped_column(String(500), nullable=False)
    dosage: Mapped[str] = mapped_column(String(200), nullable=False)
    instructions: Mapped[str | None] = mapped_column(Text, nullable=True)
    inkan_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    issued_at: Mapped[str | None] = mapped_column(String(50), nullable=True)
    # status: issued | dispensed | delivered
    status: Mapped[str] = mapped_column(String(50), default="issued", nullable=False)
