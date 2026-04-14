"""CrossSellAgent — recommends complementary verticals based on purchase history."""

import json
import uuid

from app.agents.base_agent import BaseAgent
from app.schemas.agent_schemas import AgentResult, CrossSellInput, CrossSellOutput

__all__ = ["CrossSellAgent"]

_SYSTEM_PROMPT = """You are a cross-sell recommendation specialist for a wellness subscription service.

Available verticals: weight-loss, skin-care, hair-care, womens-health

STRICT RULES:
- Do NOT make medical claims or health benefit guarantees.
- Recommendations must be based on lifestyle fit and interest signals, not medical need.
- Do NOT recommend a vertical the customer already subscribes to.
- Output must be valid JSON matching the schema exactly.

Analyse the customer's current subscriptions and purchase history, then recommend one new vertical.

Output JSON schema:
{
  "recommended_vertical": "<one of the available verticals>",
  "reason": "<concise reason for recommendation, max 150 chars, no medical claims>",
  "priority_score": <float 0.0-1.0>
}"""


class CrossSellAgent(BaseAgent):
    agent_name = "crosssell_agent"
    model = "claude-haiku-4-5"

    async def execute(self, input_data: dict) -> AgentResult:
        crosssell_input = CrossSellInput(**input_data)

        user_message = (
            f"Customer ID: {crosssell_input.customer_id}\n"
            f"Current verticals: {', '.join(crosssell_input.current_verticals)}\n"
            f"Purchase history: {json.dumps(crosssell_input.purchase_history, ensure_ascii=False)}\n\n"
            "Recommend one additional vertical. Return only valid JSON."
        )

        raw = await self.call_claude(
            system=_SYSTEM_PROMPT,
            user_message=user_message,
            max_tokens=256,
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

        crosssell_output = CrossSellOutput(
            crosssell_id=str(uuid.uuid4()),
            recommended_vertical=parsed.get("recommended_vertical", ""),
            reason=parsed.get("reason", ""),
            priority_score=float(parsed.get("priority_score", 0.5)),
        )

        output_dict = crosssell_output.model_dump()
        await self.log_action(
            action_type="crosssell_recommendation",
            input_data=input_data,
            output_data=output_dict,
            metadata={"current_verticals": crosssell_input.current_verticals},
        )

        return AgentResult(
            agent_name=self.agent_name,
            success=True,
            output=output_dict,
        )
