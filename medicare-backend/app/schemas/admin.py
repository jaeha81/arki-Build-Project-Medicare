import uuid
from typing import Literal
from pydantic import BaseModel
from datetime import datetime

# Valid status literals — prevents unconstrained strings from reaching the DB
ConsultationStatus = Literal["pending", "under_review", "approved", "rejected", "completed"]
ReviewStatus = Literal["pending", "approved", "rejected"]
ApprovalActionType = Literal["approve", "reject"]


class ConsultationListItem(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    status: str
    preferred_language: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ConsultationStatusUpdate(BaseModel):
    status: ConsultationStatus  # P2 fix: Literal enum — rejects unknown values


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
    status: ReviewStatus  # P2 fix: Literal enum


class ApprovalListItem(BaseModel):
    id: uuid.UUID
    agent_id: str
    action: str
    details: dict
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ApprovalAction(BaseModel):
    action: ApprovalActionType  # P2 fix: Literal — rejects typos like "aprove"
    note: str | None = None


class AdminStats(BaseModel):
    total_consultations: int
    pending_consultations: int
    active_subscriptions: int
    pending_approvals: int
