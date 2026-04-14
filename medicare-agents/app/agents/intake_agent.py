"""IntakeAgent — first-contact assessment for Medicare telemedicine inquiries."""

import json
import uuid

from pydantic import ValidationError

from app.agents.base_agent import BaseAgent
from app.schemas.agent_schemas import AgentResult, IntakeInput, IntakeOutput

__all__ = ["IntakeAgent"]

_CONFIDENCE_APPROVAL_THRESHOLD = 0.7


class IntakeAgent(BaseAgent):
    """Analyse an incoming patient inquiry and produce a structured intake record."""

    agent_name = "intake_agent"
    model = "claude-sonnet-4-5"

    SYSTEM_PROMPT = """
You are a medical consultation intake specialist for a Japanese telemedicine platform.
Analyse customer inquiries and provide structured assessments.

COMPLIANCE RULES:
- Never make definitive medical diagnoses
- Never guarantee treatment outcomes
- Always recommend professional medical consultation
- Flag any content that makes medical efficacy claims

Respond in JSON format only, using exactly this structure:
{
  "intake_id": "<uuid string>",
  "intent_category": "<category string>",
  "initial_assessment": "<assessment text>",
  "recommended_vertical": "<weight-loss|skin-care|hair-care|womens-health>",
  "needs_compliance_review": <true|false>,
  "confidence_score": <0.0-1.0>,
  "follow_up_schedule": "<schedule string or null>"
}
"""

    async def execute(self, input_data: dict) -> AgentResult:
        """Run the intake analysis pipeline.

        Steps:
        1. Parse *input_data* into :class:`IntakeInput`.
        2. Call Claude with the patient inquiry.
        3. Parse the JSON response into :class:`IntakeOutput`.
        4. Request admin approval when ``confidence_score < 0.7``.
        5. Append an action log entry.
        6. Return a fully populated :class:`AgentResult`.

        Args:
            input_data: Raw dict that must be coercible to :class:`IntakeInput`.

        Returns:
            :class:`AgentResult` with ``success=True`` on the happy path, or
            ``success=False`` plus an ``error`` message on failure.
        """
        # --- 1. Validate input ---
        try:
            intake_input = IntakeInput(**input_data)
        except ValidationError as exc:
            return AgentResult(
                agent_name=self.agent_name,
                success=False,
                output={},
                error=f"Input validation error: {exc}",
            )

        # --- 2. Build user message & call Claude ---
        user_message = (
            f"Customer ID: {intake_input.customer_id}\n"
            f"Vertical: {intake_input.vertical}\n"
            f"Contact type: {intake_input.contact_type}\n"
            f"Urgency: {intake_input.urgency}\n\n"
            f"Initial inquiry:\n{intake_input.initial_info}"
        )

        try:
            raw_response = await self.call_claude(
                system=self.SYSTEM_PROMPT,
                user_message=user_message,
                max_tokens=1024,
            )
        except Exception as exc:
            return AgentResult(
                agent_name=self.agent_name,
                success=False,
                output={},
                error=f"Claude API error: {exc}",
            )

        # --- 3. Parse Claude's JSON output ---
        try:
            # Strip markdown fences if present.
            cleaned = raw_response.strip()
            if cleaned.startswith("```"):
                lines = cleaned.splitlines()
                cleaned = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])
            parsed_json: dict = json.loads(cleaned)
            # Ensure intake_id is present; generate one if Claude omitted it.
            if not parsed_json.get("intake_id"):
                parsed_json["intake_id"] = str(uuid.uuid4())
            intake_output = IntakeOutput(**parsed_json)
        except (json.JSONDecodeError, ValidationError) as exc:
            return AgentResult(
                agent_name=self.agent_name,
                success=False,
                output={"raw_response": raw_response},
                error=f"Output parsing error: {exc}",
            )

        # --- 4. Request approval when confidence is low ---
        approval_id: str | None = None
        needs_approval = intake_output.confidence_score < _CONFIDENCE_APPROVAL_THRESHOLD

        if needs_approval:
            try:
                approval_id = await self.request_approval(
                    agent_id=self.agent_name,
                    action="intake_low_confidence",
                    details={
                        "customer_id": intake_input.customer_id,
                        "confidence_score": intake_output.confidence_score,
                        "intake_id": intake_output.intake_id,
                    },
                )
            except Exception as exc:
                # Approval failure is non-fatal; flag but continue.
                return AgentResult(
                    agent_name=self.agent_name,
                    success=False,
                    output=intake_output.model_dump(),
                    needs_approval=True,
                    error=f"Approval request failed: {exc}",
                )

        # --- 5. Log the action ---
        try:
            await self.log_action(
                action_type="intake_analysis",
                input_data=intake_input.model_dump(),
                output_data=intake_output.model_dump(),
                metadata={"approval_id": approval_id, "needs_approval": needs_approval},
            )
        except Exception:
            # Logging failure must not bubble up to the caller.
            pass

        # --- 6. Return result ---
        return AgentResult(
            agent_name=self.agent_name,
            success=True,
            output=intake_output.model_dump(),
            needs_approval=needs_approval,
            approval_id=approval_id,
        )
