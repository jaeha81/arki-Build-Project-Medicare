from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.legal import LegalContent


async def get_legal_content(db: AsyncSession, page_type: str) -> LegalContent | None:
    result = await db.execute(
        select(LegalContent).where(LegalContent.page_type == page_type)
    )
    return result.scalar_one_or_none()
