import uuid
from pydantic import BaseModel
from datetime import datetime


class ConsultationListItem(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    status: str
    preferred_language: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ConsultationStatusUpdate(BaseModel):
    status: str  # pending, under_review, approved, rejected, completed


class ProductUpdate(BaseModel):
    name_en: str | None = None
    name_ja: str | None = None
    description_en: str | None = None
    description_ja: str | None = None
    base_price: float | None = None
    is_active: bool | None = None


class ReviewListItem(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    customer_name: str
    rating: int
    body: str | None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ReviewStatusUpdate(BaseModel):
    status: str  # approved, rejected


class ApprovalListItem(BaseModel):
    id: uuid.UUID
    agent_id: str
    action: str
    details: dict
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ApprovalAction(BaseModel):
    action: str  # approve, reject
    note: str | None = None


class AdminStats(BaseModel):
    total_consultations: int
    pending_consultations: int
    active_subscriptions: int
    pending_approvals: int
