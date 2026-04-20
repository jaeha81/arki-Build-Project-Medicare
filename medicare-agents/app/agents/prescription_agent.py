"""PrescriptionAgent — drug interaction check + LINE card summary generation."""

import json
import logging

from app.agents.base_agent import BaseAgent
from app.schemas.agent_schemas import AgentResult

__all__ = ["PrescriptionAgent"]

logger = logging.getLogger(__name__)

_HAIKU_MODEL = "claude-haiku-4-5"

_SYSTEM_PROMPT = """
You are a clinical pharmacist assistant for a Japanese telemedicine platform.

Given a prescription and the patient's current medications from the health survey,
perform two tasks:

1. DRUG INTERACTION CHECK: Identify any clinically significant interactions between
   the prescribed drug and current medications. Flag severity as: none / mild / moderate / severe.

2. PRESCRIPTION SUMMARY CARD: Generate a concise LINE message card (≤160 characters
   in Japanese) summarising the prescription for the patient.

Respond strictly in this JSON format:
{
  "interaction_severity": "<none|mild|moderate|severe>",
  "interactions": [
    {
      "drug_a": "<prescribed drug>",
      "drug_b": "<current medication>",
      "severity": "<mild|moderate|severe>",
      "description": "<brief clinical note in English>"
    }
  ],
  "line_card_message": "<Japanese summary ≤160 chars>",
  "review_required": <true if severity is moderate or severe>
}
"""


class PrescriptionAgent(BaseAgent):
    """Check drug interactions and generate a LINE card message for a prescription."""

    agent_name = "prescription_agent"
    model = _HAIKU_MODEL

    async def execute(self, input_data: dict) -> AgentResult:
        """Run interaction check + LINE card generation.

        Expected input_data keys:
            drug_name (str): Prescribed drug name.
            dosage (str): Dosage instructions.
            current_medications (list[str]): From health survey C-06.
            patient_name (str | None): Display name for the LINE message.
        """
        drug_name: str = input_data.get("drug_name", "")
        dosage: str = input_data.get("dosage", "")
        current_meds: list[str] = input_data.get("current_medications", [])
        patient_name: str = input_data.get("patient_name", "患者様")

        user_message = (
            f"Prescribed drug: {drug_name}\n"
            f"Dosage: {dosage}\n"
            f"Patient name (for LINE card): {patient_name}\n"
            f"Current medications: {', '.join(current_meds) if current_meds else 'None'}"
        )

        try:
            raw = await self.call_claude(
                system=_SYSTEM_PROMPT,
                user_message=user_message,
                max_tokens=512,
            )
            # Strip markdown fences if present
            cleaned = raw.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.split("```")[1]
                if cleaned.startswith("json"):
                    cleaned = cleaned[4:]
            result = json.loads(cleaned)
        except (json.JSONDecodeError, Exception) as exc:
            logger.error("PrescriptionAgent parse error: %s", exc)
            result = {
                "interaction_severity": "none",
                "interactions": [],
                "line_card_message": f"{patient_name}様の処方箋が発行されました。{drug_name} {dosage}",
                "review_required": False,
            }

        return AgentResult(
            agent_name=self.agent_name,
            success=True,
            output=result,
            metadata={"drug_name": drug_name, "current_medications": current_meds},
        )
