"""Abstract base class shared by all Medicare AI agents."""

import uuid
from abc import ABC, abstractmethod
from datetime import datetime

from anthropic import AsyncAnthropic
from sqlalchemy import insert

from app.config import settings
from app.database import AsyncSessionLocal
from app.models.agent_models import AdminApproval, AgentActionLog
from app.schemas.agent_schemas import AgentResult

__all__ = ["BaseAgent"]


class BaseAgent(ABC):
    """Common interface for every Medicare agent.

    Subclasses must set the class-level :attr:`agent_name` and :attr:`model`
    attributes, and implement :meth:`execute`.
    """

    agent_name: str
    model: str

    def __init__(self) -> None:
        self.client = AsyncAnthropic(api_key=settings.anthropic_api_key)

    @abstractmethod
    async def execute(self, input_data: dict) -> AgentResult:
        """Run the agent with *input_data* and return a structured result."""

    async def call_claude(
        self,
        system: str,
        user_message: str,
        max_tokens: int = 1024,
    ) -> str:
        """Call the Anthropic Messages API and return the text response.

        Args:
            system: System prompt text.
            user_message: User turn content.
            max_tokens: Maximum tokens in the completion.

        Returns:
            The assistant reply as a plain string.
        """
        response = await self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            system=system,
            messages=[{"role": "user", "content": user_message}],
        )
        # response.content is a list[ContentBlock]; first block is always text here.
        return response.content[0].text

    async def log_action(
        self,
        action_type: str,
        input_data: dict,
        output_data: dict,
        metadata: dict,
    ) -> None:
        """Append an :class:`AgentActionLog` row to the database.

        This is an append-only operation — no UPDATE/DELETE is issued.
        """
        async with AsyncSessionLocal() as session:
            stmt = insert(AgentActionLog).values(
                agent_id=self.agent_name,
                action=action_type,
                status="completed",
                result={
                    "input": input_data,
                    "output": output_data,
                    "metadata": metadata,
                    "logged_at": datetime.utcnow().isoformat(),
                },
                error=None,
            )
            await session.execute(stmt)
            await session.commit()

    async def request_approval(
        self,
        agent_id: str,
        action: str,
        details: dict,
    ) -> str:
        """Insert a pending :class:`AdminApproval` row and return its UUID.

        Args:
            agent_id: Identifier for the agent requesting approval.
            action: Short description of the action that needs sign-off.
            details: Free-form detail payload.

        Returns:
            The string representation of the new approval's UUID primary key.
        """
        approval_id = uuid.uuid4()
        async with AsyncSessionLocal() as session:
            stmt = insert(AdminApproval).values(
                id=approval_id,
                agent_id=agent_id,
                action=action,
                details=details,
                status="pending",
            )
            await session.execute(stmt)
            await session.commit()
        return str(approval_id)
