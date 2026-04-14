"""ReviewAgent — analyses customer reviews and classifies sentiment."""

import json
import uuid

from app.agents.base_agent import BaseAgent
from app.schemas.agent_schemas import AgentResult, ReviewInput, ReviewOutput

__all__ = ["ReviewAgent"]

_SYSTEM_PROMPT = """You are a customer review analyst for a wellness subscription service.

STRICT RULES:
- Flag any medical claims in customer reviews (compliance_flag = true).
- Do NOT include medical claims in recommended_response.
- Be empathetic in recommended_response; acknowledge concerns professionally.
- Output must be valid JSON matching the schema exactly.

Analyse the review for sentiment, key themes, and compliance issues.

Output JSON schema:
{
  "sentiment": "<positive | neutral | negative>",
  "key_themes": ["<theme1>", "<theme2>"],
  "compliance_flag": <true if review contains medical claims, false otherwise>,
  "recommended_response": "<suggested response to customer, max 300 chars>",
  "confidence": <float 0.0-1.0>
}"""


class ReviewAgent(BaseAgent):
    agent_name = "review_agent"
    model = "claude-haiku-4-5"

    async def execute(self, input_data: dict) -> AgentResult:
        review_input = ReviewInput(**input_data)

        user_message = (
            f"Review ID: {review_input.review_id}\n"
            f"Vertical: {review_input.vertical}\n"
            f"Rating: {review_input.rating}/5\n"
            f"Review text: {review_input.review_text}\n\n"
            "Analyse this review. Return only valid JSON."
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
        compliance_flag: bool = bool(parsed.get("compliance_flag", False))
        sentiment: str = parsed.get("sentiment", "neutral")
        needs_approval = compliance_flag or sentiment == "negative"

        review_output = ReviewOutput(
            review_analysis_id=str(uuid.uuid4()),
            sentiment=sentiment,
            key_themes=parsed.get("key_themes", []),
            compliance_flag=compliance_flag,
            recommended_response=parsed.get("recommended_response", ""),
        )

        output_dict = review_output.model_dump()
        approval_id: str | None = None

        if needs_approval:
            approval_id = await self.request_approval(
                agent_id=self.agent_name,
                action="review_response",
                details={
                    "review_id": review_input.review_id,
                    "compliance_flag": compliance_flag,
                    "sentiment": sentiment,
                    "confidence": confidence,
                    "output": output_dict,
                },
            )

        await self.log_action(
            action_type="review_analysis",
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
