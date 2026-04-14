"""RetentionAgent — detects churn risk and generates retention messages."""

import json
import uuid

from app.agents.base_agent import BaseAgent
from app.schemas.agent_schemas import AgentResult, RetentionInput, RetentionOutput

__all__ = ["RetentionAgent"]

_SYSTEM_PROMPT = """You are a customer retention specialist for a wellness subscription service.

STRICT RULES:
- Do NOT make medical claims or health guarantees.
- Focus on value, community, and convenience — not health outcomes.
- Be empathetic and non-pushy in messaging.
- Output must be valid JSON matching the schema exactly.

Analyse the customer's risk profile and generate an appropriate retention message.

Output JSON schema:
{
  "risk_level": "<low | medium | high | critical>",
  "message": "<personalised retention message, max 300 chars>",
  "action_type": "<discount_offer | personal_outreach | pause_option | content_nudge>",
  "send_channel": "<email | sms | push | in-app>",
  "confidence": <float 0.0-1.0>
}"""


class RetentionAgent(BaseAgent):
    agent_name = "retention_agent"
    model = "claude-haiku-4-5"

    async def execute(self, input_data: dict) -> AgentResult:
        retention_input = RetentionInput(**input_data)

        user_message = (
            f"Customer ID: {retention_input.customer_id}\n"
            f"Subscription age (days): {retention_input.subscription_days}\n"
            f"Days since last login: {retention_input.last_login_days}\n"
            f"Cancellation risk score: {retention_input.cancellation_risk_score:.2f}\n\n"
            "Analyse churn risk and generate a retention message. Return only valid JSON."
        )

        raw = await self.call_claude(
            system=_SYSTEM_PROMPT,
            user_message=user_message,
            max_tokens=512,
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

        confidence: float = float(parsed.get("confidence", 1.0))
        retention_id = str(uuid.uuid4())

        retention_output = RetentionOutput(
            retention_id=retention_id,
            risk_level=parsed.get("risk_level", "medium"),
            message=parsed.get("message", ""),
            action_type=parsed.get("action_type", "content_nudge"),
            send_channel=parsed.get("send_channel", "email"),
        )

        output_dict = retention_output.model_dump()
        needs_approval = confidence < 0.6
        approval_id: str | None = None

        if needs_approval:
            approval_id = await self.request_approval(
                agent_id=self.agent_name,
                action="retention_message",
                details={
                    "customer_id": retention_input.customer_id,
                    "confidence": confidence,
                    "output": output_dict,
                },
            )

        await self.log_action(
            action_type="retention_analysis",
            input_data=input_data,
            output_data=output_dict,
            metadata={
                "confidence": confidence,
                "needs_approval": needs_approval,
            },
        )

        return AgentResult(
            agent_name=self.agent_name,
            success=True,
            output=output_dict,
            needs_approval=needs_approval,
            approval_id=approval_id,
        )
