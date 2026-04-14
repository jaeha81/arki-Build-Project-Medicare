from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.catalog import VerticalOut, ProductOut
from app.services import catalog_service

router = APIRouter(prefix="/verticals", tags=["catalog"])


@router.get("", response_model=list[VerticalOut])
async def list_verticals(db: AsyncSession = Depends(get_db)) -> list[VerticalOut]:
    return await catalog_service.get_verticals(db)


@router.get("/{slug}", response_model=VerticalOut)
async def get_vertical(slug: str, db: AsyncSession = Depends(get_db)) -> VerticalOut:
    vertical = await catalog_service.get_vertical_by_slug(db, slug)
    if not vertical:
        raise HTTPException(status_code=404, detail="Vertical not found")
    return vertical


@router.get("/{slug}/products", response_model=list[ProductOut])
async def list_vertical_products(slug: str, db: AsyncSession = Depends(get_db)) -> list[ProductOut]:
    return await catalog_service.get_products_by_vertical(db, slug)
