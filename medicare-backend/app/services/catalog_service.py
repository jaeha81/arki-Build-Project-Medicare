from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.catalog import Vertical, Product, FAQ


async def get_verticals(db: AsyncSession) -> list[Vertical]:
    result = await db.execute(
        select(Vertical).where(Vertical.is_active == True).order_by(Vertical.sort_order)
    )
    return list(result.scalars().all())


async def get_vertical_by_slug(db: AsyncSession, slug: str) -> Vertical | None:
    result = await db.execute(select(Vertical).where(Vertical.slug == slug))
    return result.scalar_one_or_none()


async def get_products_by_vertical(db: AsyncSession, vertical_slug: str) -> list[Product]:
    result = await db.execute(
        select(Product)
        .join(Vertical)
        .where(Vertical.slug == vertical_slug, Product.is_active == True)
        .options(selectinload(Product.variants))
        .order_by(Product.sort_order)
    )
    return list(result.scalars().all())


async def get_product_by_slug(db: AsyncSession, slug: str) -> Product | None:
    result = await db.execute(
        select(Product)
        .where(Product.slug == slug)
        .options(selectinload(Product.variants))
    )
    return result.scalar_one_or_none()
