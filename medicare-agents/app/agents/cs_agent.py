"""CSAgent (Customer Service) — drafts automated responses to customer tickets."""

import json
import uuid

from app.agents.base_agent import BaseAgent
from app.schemas.agent_schemas import AgentResult, CSInput, CSOutput

__all__ = ["CSAgent"]

_SYSTEM_PROMPT = """You are a customer service agent for a wellness subscription service.

STRICT RULES:
- Do NOT make medical claims, diagnoses, or treatment recommendations.
- Always suggest consulting a qualified healthcare professional for medical questions.
- Be empathetic, concise, and professional.
- If the query involves billing disputes, legal threats, or safety concerns, set escalate_to_human = true.
- Output must be valid JSON matching the schema exactly.

Draft a helpful response to the customer's inquiry.

Output JSON schema:
{
  "draft_response": "<response text, max 500 chars>",
  "confidence_score": <float 0.0-1.0>,
  "escalate_to_human": <true if complex / sensitive issue, else false>
}"""

_CONFIDENCE_THRESHOLD = 0.75


class CSAgent(BaseAgent):
    agent_name = "cs_agent"
    model = "claude-sonnet-4-6"

    async def execute(self, input_data: dict) -> AgentResult:
        cs_input = CSInput(**input_data)

        user_message = (
            f"Ticket ID: {cs_input.ticket_id}\n"
            f"Category: {cs_input.category}\n"
            f"Vertical: {cs_input.vertical}\n"
            f"Customer message: {cs_input.customer_message}\n\n"
            "Draft a customer service response. Return only valid JSON."
        )

        raw = await self.call_claude(
            system=_SYSTEM_PROMPT,
            user_message=user_message,
            max_tokens=768,
        )

        try:
            parsed: dict = json.loads(raw)
        except json.JSONDecodeError:
            return AgentResult(
                agent_name=self.agent_name,
                success=False,
                output={},
                error=f"Claude returned non-JSON: {raw[:200]}",
            )

        confidence: float = float(parsed.get("confidence_score", 1.0))
        escalate: bool = bool(parsed.get("escalate_to_human", False))
        needs_approval = confidence < _CONFIDENCE_THRESHOLD

        cs_output = CSOutput(
            cs_response_id=str(uuid.uuid4()),
            draft_response=parsed.get("draft_response", ""),
            confidence_score=confidence,
            escalate_to_human=escalate,
        )

        output_dict = cs_output.model_dump()
        approval_id: str | None = None

        if needs_approval:
            approval_id = await self.request_approval(
                agent_id=self.agent_name,
                action="cs_draft_response",
                details={
                    "ticket_id": cs_input.ticket_id,
                    "confidence": confidence,
                    "escalate": escalate,
                    "output": output_dict,
                },
            )

        await self.log_action(
            action_type="cs_response_draft",
            input_data=input_data,
            output_data=output_dict,
            metadata={
                "confidence": confidence,
                "needs_approval": needs_approval,
                "escalate_to_human": escalate,
            },
        )

        return AgentResult(
            agent_name=self.agent_name,
            success=True,
            output=output_dict,
            needs_approval=needs_approval,
            approval_id=approval_id,
        )
