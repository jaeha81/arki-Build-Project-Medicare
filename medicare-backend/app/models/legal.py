from sqlalchemy import String, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, UUIDMixin, TimestampMixin


class LegalContent(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "legal_contents"

    page_type: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False
        # privacy_policy, terms_of_use, medical_disclaimer, consultation_notice, data_consent
    )
    title_en: Mapped[str] = mapped_column(String(300), nullable=False)
    title_ja: Mapped[str] = mapped_column(String(300), nullable=False)
    content_en: Mapped[str] = mapped_column(Text, nullable=False)
    content_ja: Mapped[str] = mapped_column(Text, nullable=False)
    is_draft: Mapped[bool] = mapped_column(Boolean, default=True)
    version: Mapped[str] = mapped_column(String(20), default="0.1")
