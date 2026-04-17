"""ComplianceGateAgent — 1차 패턴 검사 + Claude 2차/3차 검사."""

import json
import logging
import re
import uuid

from pydantic import ValidationError

logger = logging.getLogger(__name__)

from app.agents.base_agent import BaseAgent
from app.schemas.agent_schemas import AgentResult, ComplianceInput, ComplianceOutput

__all__ = ["ComplianceGateAgent"]

_COMPLIANCE_REVIEW_THRESHOLD: float = 0.7
_HAIKU_MODEL: str = "claude-haiku-4-5"
_SONNET_MODEL: str = "claude-sonnet-4-6"

_SYSTEM_PROMPT = """
You are a pharmaceutical and medical content compliance specialist for a Japanese telemedicine platform.
Analyse the provided text for regulatory compliance violations.

RULES:
- Identify any prohibited medical claims, efficacy guarantees, or misleading health statements.
- Never approve content that makes definitive cure claims.
- Never approve content that guarantees treatment outcomes.
- Provide a JSON response only.

Respond strictly in this JSON format:
{
  "is_compliant": <true|false>,
  "compliance_score": <0.0-1.0>,
  "violations": [
    {
      "phrase": "<matched phrase>",
      "severity": "<critical|warning>",
      "category": "<medical_claim|efficacy|guarantee>",
      "suggestion": "<replacement suggestion or null>",
      "matched_text": "<exact text that triggered violation>"
    }
  ],
  "requires_human_review": <true|false>
}
"""


class ComplianceGateAgent(BaseAgent):
    """컴플라이언스 게이트 에이전트.

    단계:
    1. 정규식 패턴 1차 검사 (빠른 사전 필터).
    2. Claude Haiku 2차 검사.
    3. score < 0.7이면 Claude Sonnet 재검사.
    4. score < 0.7이면 ``request_approval`` 호출.
    """

    agent_name = "compliance_gate_agent"
    model = _HAIKU_MODEL

    PROHIBITED_PATTERNS: list[str] = [
        # 확정적 의료 주장
        r"(치료|cure|治療)(됩니다|guarantees|できます)",
        r"(100%|완전히|definitely)\s*(효과|effective|効果)",
        r"FDA\s*(승인|approved|承認)",
        # 과장 표현
        r"(가장|most|最も)\s*(효과적|effective|効果的)인\s*(약|medicine|薬)",
        r"(즉시|immediately|即座に)\s*(효과|results|効果)",
        # 완치/부작용
        r"(완치|completely\s*cured|完治)",
        r"(부작용\s*없|no\s*side\s*effects|副作用なし)",
        r"(보장|guarantee|保証)(합니다|します|s)",
    ]

    async def execute(self, input_data: dict) -> AgentResult:
        """컴플라이언스 검사 파이프라인 실행.

        Args:
            input_data: :class:`ComplianceInput` 필드 딕셔너리.

        Returns:
            :class:`AgentResult` — ``output`` 필드는 :class:`ComplianceOutput` 직렬화값.
        """
        # --- 1. 입력 검증 ---
        try:
            compliance_input = ComplianceInput(**input_data)
        except ValidationError as exc:
            return AgentResult(
                agent_name=self.agent_name,
                success=False,
                output={},
                error=f"Input validation error: {exc}",
            )

        content = compliance_input.content

        # --- 2. 정규식 1차 검사 ---
        pattern_violations: list[dict] = []
        for pattern in self.PROHIBITED_PATTERNS:
            try:
                match = re.search(pattern, content, re.IGNORECASE)
                if match:
                    pattern_violations.append(
                        {
                            "phrase": pattern,
                            "severity": "critical",
                            "category": "medical_claim",
                            "suggestion": None,
                            "matched_text": match.group(0),
                        }
                    )
            except re.error:
                logger.warning("Invalid regex pattern skipped: %r", pattern, exc_info=True)

        # --- 3. Claude Haiku 2차 검사 ---
        user_message = (
            f"Content type: {compliance_input.content_type}\n"
            f"Agent source: {compliance_input.agent_source}\n"
            f"Vertical: {compliance_input.vertical}\n\n"
            f"Text to check:\n{content}"
        )

        try:
            raw_response = await self.call_claude(
                system=_SYSTEM_PROMPT,
                user_message=user_message,
                max_tokens=1024,
            )
        except Exception as exc:
            return AgentResult(
                agent_name=self.agent_name,
                success=False,
                output={},
                error=f"Claude API error (Haiku): {exc}",
            )

        parsed = _parse_claude_response(raw_response)
        if parsed is None:
            return AgentResult(
                agent_name=self.agent_name,
                success=False,
                output={"raw_response": raw_response},
                error="Failed to parse Haiku compliance response",
            )

        # 패턴 검사 위반 병합
        all_violations: list[dict] = parsed.get("violations", []) + pattern_violations
        score: float = float(parsed.get("compliance_score", 1.0))

        # --- 4. score < 0.7이면 Sonnet 재검사 ---
        automated_fix_applied = False
        if score < _COMPLIANCE_REVIEW_THRESHOLD:
            try:
                original_model = self.model
                self.model = _SONNET_MODEL
                raw_sonnet = await self.call_claude(
                    system=_SYSTEM_PROMPT,
                    user_message=user_message,
                    max_tokens=2048,
                )
                self.model = original_model  # 복원
                sonnet_parsed = _parse_claude_response(raw_sonnet)
                if sonnet_parsed:
                    all_violations = sonnet_parsed.get("violations", []) + pattern_violations
                    score = float(sonnet_parsed.get("compliance_score", score))
            except Exception:
                # Sonnet 실패 시 Haiku 결과 유지
                logger.warning("Sonnet re-check failed; keeping Haiku result", exc_info=True)

        requires_human_review = score < _COMPLIANCE_REVIEW_THRESHOLD
        compliance_id = str(uuid.uuid4())

        output = ComplianceOutput(
            compliance_id=compliance_id,
            is_compliant=len(all_violations) == 0,
            violations=all_violations,
            compliance_score=score,
            automated_fix_applied=automated_fix_applied,
            requires_human_review=requires_human_review,
        )

        # --- 5. score < 0.7이면 승인 요청 ---
        approval_id: str | None = None
        needs_approval = requires_human_review

        if needs_approval:
            try:
                approval_id = await self.request_approval(
                    agent_id=self.agent_name,
                    action="compliance_review_required",
                    details={
                        "compliance_id": compliance_id,
                        "compliance_score": score,
                        "violation_count": len(all_violations),
                        "content_type": compliance_input.content_type,
                        "agent_source": compliance_input.agent_source,
                    },
                )
            except Exception as exc:
                return AgentResult(
                    agent_name=self.agent_name,
                    success=False,
                    output=output.model_dump(),
                    needs_approval=True,
                    error=f"Approval request failed: {exc}",
                )

        # --- 6. 액션 로그 기록 ---
        try:
            await self.log_action(
                action_type="compliance_check",
                input_data=compliance_input.model_dump(),
                output_data=output.model_dump(),
                metadata={"approval_id": approval_id, "needs_approval": needs_approval},
            )
        except Exception:
            logger.warning("Failed to log compliance action; result still returned", exc_info=True)

        return AgentResult(
            agent_name=self.agent_name,
            success=True,
            output=output.model_dump(),
            needs_approval=needs_approval,
            approval_id=approval_id,
        )


def _parse_claude_response(raw: str) -> dict | None:
    """Claude 응답에서 JSON 블록을 추출하여 dict로 반환. 실패 시 None."""
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        cleaned = "\n".join(
            lines[1:-1] if lines[-1].strip() == "```" else lines[1:]
        )
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None
