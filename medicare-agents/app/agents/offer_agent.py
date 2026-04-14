"""OfferAgent — generates personalised marketing offers from customer profiles.

Medical claims are explicitly prohibited in system prompts and outputs.
"""

import json
import uuid

from app.agents.base_agent import BaseAgent
from app.schemas.agent_schemas import AgentResult, OfferInput, OfferOutput

__all__ = ["OfferAgent"]

_SYSTEM_PROMPT = """You are a marketing offer specialist for a wellness subscription service.

STRICT RULES (never violate):
- Do NOT make any medical claims or health benefit guarantees.
- Do NOT use terms like "cures", "treats", "heals", "clinically proven", or "FDA approved".
- Offers must focus on lifestyle, convenience, and value — not medical outcomes.
- Output must be valid JSON matching the schema exactly.

Generate a personalised marketing offer based on the customer profile provided.

Output JSON schema:
{
  "title": "<offer title, max 60 chars>",
  "description": "<offer description, max 200 chars, no medical claims>",
  "discount_pct": <float 0-50>,
  "validity_days": <int 7-90>,
  "target_segment": "<e.g. new_user | at_risk | loyal | reactivation>"
}"""


class OfferAgent(BaseAgent):
    agent_name = "offer_agent"
    model = "claude-haiku-4-5"

    async def execute(self, input_data: dict) -> AgentResult:
        offer_input = OfferInput(**input_data)

        user_message = (
            f"Customer ID: {offer_input.customer_id}\n"
            f"Vertical: {offer_input.vertical}\n"
            f"Consultation data: {json.dumps(offer_input.consultation_data, ensure_ascii=False)}\n\n"
            "Generate a personalised marketing offer. Return only valid JSON."
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

        offer_output = OfferOutput(
            offer_id=str(uuid.uuid4()),
            title=parsed.get("title", ""),
            description=parsed.get("description", ""),
            discount_pct=float(parsed.get("discount_pct", 0.0)),
            validity_days=int(parsed.get("validity_days", 30)),
            target_segment=parsed.get("target_segment", "general"),
        )

        output_dict = offer_output.model_dump()
        await self.log_action(
            action_type="offer_generation",
            input_data=input_data,
            output_data=output_dict,
            metadata={"vertical": offer_input.vertical},
        )

        return AgentResult(
            agent_name=self.agent_name,
            success=True,
            output=output_dict,
        )
