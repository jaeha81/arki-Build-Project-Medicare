import uuid
from pydantic import BaseModel
from datetime import datetime


class VerticalOut(BaseModel):
    id: uuid.UUID
    slug: str
    name_en: str
    name_ja: str
    description_en: str
    description_ja: str
    icon: str | None
    is_active: bool

    model_config = {"from_attributes": True}


class ProductVariantOut(BaseModel):
    id: uuid.UUID
    name_en: str
    name_ja: str
    price: float
    duration_days: int | None

    model_config = {"from_attributes": True}


class ProductOut(BaseModel):
    id: uuid.UUID
    slug: str
    name_en: str
    name_ja: str
    description_en: str
    description_ja: str
    base_price: float
    currency: str
    vertical_id: uuid.UUID
    variants: list[ProductVariantOut] = []

    model_config = {"from_attributes": True}


class FAQOut(BaseModel):
    id: uuid.UUID
    vertical_id: uuid.UUID | None
    question_en: str
    question_ja: str
    answer_en: str
    answer_ja: str
    sort_order: int

    model_config = {"from_attributes": True}
