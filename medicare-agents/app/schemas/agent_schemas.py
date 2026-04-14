"""Pydantic v2 schemas shared across all Medicare agents."""

from pydantic import BaseModel, Field

__all__ = [
    "AgentInput",
    "AgentResult",
    "IntakeInput",
    "IntakeOutput",
    "ComplianceInput",
    "ComplianceOutput",
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
