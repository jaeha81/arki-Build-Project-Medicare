"""Pydantic schemas for compliance endpoints."""

import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

__all__ = [
    "ProhibitedPhraseCreate",
    "ProhibitedPhraseRead",
    "ComplianceCheckRequest",
    "ComplianceCheckResult",
]

SeverityType = Literal["critical", "warning"]
CategoryType = Literal["medical_claim", "efficacy", "guarantee"]
ContentType = Literal["marketing", "product_description", "recommendation", "response"]


class ProhibitedPhraseCreate(BaseModel):
    phrase: str = Field(..., max_length=500)
    pattern: str | None = Field(default=None, max_length=500, description="Optional regex pattern")
    severity: SeverityType = "warning"
    category: CategoryType
    suggestion: str | None = None


class ProhibitedPhraseRead(BaseModel):
    id: uuid.UUID
    phrase: str
    pattern: str | None
    severity: str
    category: str
    is_active: bool
    suggestion: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ComplianceCheckRequest(BaseModel):
    content: str = Field(..., min_length=1, description="Text to check for compliance violations")
    content_type: ContentType


class ComplianceCheckResult(BaseModel):
    is_compliant: bool
    compliance_score: float = Field(ge=0.0, le=1.0)
    violations: list[dict]
    requires_human_review: bool
