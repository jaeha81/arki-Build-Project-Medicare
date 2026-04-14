"""Pydantic v2 schemas shared across all Medicare agents."""

from pydantic import BaseModel, Field

__all__ = [
    "AgentInput",
    "AgentResult",
    "IntakeInput",
    "IntakeOutput",
    "ComplianceInput",
    "ComplianceOutput",
    "OfferInput",
    "OfferOutput",
    "RetentionInput",
    "RetentionOutput",
    "CrossSellInput",
    "CrossSellOutput",
    "ReviewInput",
    "ReviewOutput",
    "CSInput",
    "CSOutput",
]


class AgentInput(BaseModel):
    """Generic wrapper for agent input payloads."""

    agent_name: str
    payload: dict


class AgentResult(BaseModel):
    """Standardised result envelope returned by every agent."""

    agent_name: str
    success: bool
    output: dict
    needs_approval: bool = False
    approval_id: str | None = None
    error: str | None = None


# ---------------------------------------------------------------------------
# Intake agent schemas
# ---------------------------------------------------------------------------

class IntakeInput(BaseModel):
    """Input schema for IntakeAgent."""

    customer_id: str
    vertical: str = Field(
        description="One of: weight-loss | skin-care | hair-care | womens-health"
    )
    contact_type: str = Field(
        description="One of: phone | web | app | email"
    )
    initial_info: str
    urgency: str = Field(
        default="normal",
        description="One of: high | normal | low",
    )


class IntakeOutput(BaseModel):
    """Structured output produced by IntakeAgent after Claude analysis."""

    intake_id: str
    intent_category: str
    initial_assessment: str
    recommended_vertical: str
    needs_compliance_review: bool
    confidence_score: float = Field(ge=0.0, le=1.0)
    follow_up_schedule: str | None = None


# ---------------------------------------------------------------------------
# Compliance agent schemas
# ---------------------------------------------------------------------------

class ComplianceInput(BaseModel):
    """Input schema for ComplianceGateAgent."""

    content: str = Field(..., min_length=1, description="Text to check for compliance violations")
    content_type: str = Field(
        description="One of: marketing | product_description | recommendation | response"
    )
    agent_source: str = Field(description="Name of the originating agent")
    vertical: str = Field(
        description="One of: weight-loss | skin-care | hair-care | womens-health"
    )


class ComplianceOutput(BaseModel):
    """Structured output produced by ComplianceGateAgent."""

    compliance_id: str
    is_compliant: bool
    violations: list[dict]
    compliance_score: float = Field(ge=0.0, le=1.0)
    automated_fix_applied: bool = False
    requires_human_review: bool


# ---------------------------------------------------------------------------
# Offer agent schemas
# ---------------------------------------------------------------------------

class OfferInput(BaseModel):
    """Input schema for OfferAgent."""

    customer_id: str
    vertical: str = Field(description="One of: weight-loss | skin-care | hair-care | womens-health")
    consultation_data: dict


class OfferOutput(BaseModel):
    """Structured output produced by OfferAgent."""

    offer_id: str
    title: str
    description: str
    discount_pct: float = Field(ge=0.0, le=100.0)
    validity_days: int = Field(ge=1)
    target_segment: str


# ---------------------------------------------------------------------------
# Retention agent schemas
# ---------------------------------------------------------------------------

class RetentionInput(BaseModel):
    """Input schema for RetentionAgent."""

    customer_id: str
    subscription_days: int = Field(ge=0)
    last_login_days: int = Field(ge=0)
    cancellation_risk_score: float = Field(ge=0.0, le=1.0)


class RetentionOutput(BaseModel):
    """Structured output produced by RetentionAgent."""

    retention_id: str
    risk_level: str = Field(description="One of: low | medium | high | critical")
    message: str
    action_type: str
    send_channel: str = Field(description="One of: email | sms | push | in-app")


# ---------------------------------------------------------------------------
# CrossSell agent schemas
# ---------------------------------------------------------------------------

class CrossSellInput(BaseModel):
    """Input schema for CrossSellAgent."""

    customer_id: str
    current_verticals: list[str]
    purchase_history: dict


class CrossSellOutput(BaseModel):
    """Structured output produced by CrossSellAgent."""

    crosssell_id: str
    recommended_vertical: str
    reason: str
    priority_score: float = Field(ge=0.0, le=1.0)


# ---------------------------------------------------------------------------
# Review agent schemas
# ---------------------------------------------------------------------------

class ReviewInput(BaseModel):
    """Input schema for ReviewAgent."""

    review_id: str
    review_text: str = Field(min_length=1)
    rating: int = Field(ge=1, le=5)
    vertical: str


class ReviewOutput(BaseModel):
    """Structured output produced by ReviewAgent."""

    review_analysis_id: str
    sentiment: str = Field(description="One of: positive | neutral | negative")
    key_themes: list[str]
    compliance_flag: bool
    recommended_response: str


# ---------------------------------------------------------------------------
# CS agent schemas
# ---------------------------------------------------------------------------

class CSInput(BaseModel):
    """Input schema for CSAgent."""

    ticket_id: str
    customer_message: str = Field(min_length=1)
    category: str
    vertical: str


class CSOutput(BaseModel):
    """Structured output produced by CSAgent."""

    cs_response_id: str
    draft_response: str
    confidence_score: float = Field(ge=0.0, le=1.0)
    escalate_to_human: bool
