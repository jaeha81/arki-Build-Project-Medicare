from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.catalog import FAQ, Vertical


async def get_faqs(db: AsyncSession, vertical_slug: str | None = None) -> list[FAQ]:
    query = select(FAQ).where(FAQ.is_active == True).order_by(FAQ.sort_order)
    if vertical_slug:
        query = query.join(Vertical).where(Vertical.slug == vertical_slug)
    result = await db.execute(query)
    return list(result.scalars().all())
