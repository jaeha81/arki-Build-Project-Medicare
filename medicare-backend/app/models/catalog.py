import uuid
from sqlalchemy import String, Text, Boolean, Numeric, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class Vertical(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "verticals"

    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    name_en: Mapped[str] = mapped_column(String(200), nullable=False)
    name_ja: Mapped[str] = mapped_column(String(200), nullable=False)
    description_en: Mapped[str] = mapped_column(Text, nullable=False, default="")
    description_ja: Mapped[str] = mapped_column(Text, nullable=False, default="")
    icon: Mapped[str | None] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    products: Mapped[list["Product"]] = relationship("Product", back_populates="vertical")
    faqs: Mapped[list["FAQ"]] = relationship("FAQ", back_populates="vertical")


class Product(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "products"

    vertical_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("verticals.id"), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    name_en: Mapped[str] = mapped_column(String(300), nullable=False)
    name_ja: Mapped[str] = mapped_column(String(300), nullable=False)
    description_en: Mapped[str] = mapped_column(Text, nullable=False, default="")
    description_ja: Mapped[str] = mapped_column(Text, nullable=False, default="")
    base_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="JPY")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    vertical: Mapped["Vertical"] = relationship("Vertical", back_populates="products")
    variants: Mapped[list["ProductVariant"]] = relationship("ProductVariant", back_populates="product")


class ProductVariant(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "product_variants"

    product_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("products.id"), nullable=False)
    name_en: Mapped[str] = mapped_column(String(200), nullable=False)
    name_ja: Mapped[str] = mapped_column(String(200), nullable=False)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    duration_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    product: Mapped["Product"] = relationship("Product", back_populates="variants")


class FAQ(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "faqs"

    vertical_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("verticals.id"), nullable=True)
    question_en: Mapped[str] = mapped_column(Text, nullable=False)
    question_ja: Mapped[str] = mapped_column(Text, nullable=False)
    answer_en: Mapped[str] = mapped_column(Text, nullable=False)
    answer_ja: Mapped[str] = mapped_column(Text, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    vertical: Mapped["Vertical | None"] = relationship("Vertical", back_populates="faqs")
