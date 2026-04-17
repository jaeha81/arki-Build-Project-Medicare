"""Admin product management endpoints."""

import uuid as _uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.catalog import Product
from app.schemas.admin import ProductUpdate

__all__: list[str] = []

router = APIRouter(prefix="/products", tags=["admin-products"])


class ProductRecord(BaseModel):
    id: str
    vertical_id: str
    slug: str
    name_en: str
    name_ja: str
    base_price: float
    currency: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ProductListResponse(BaseModel):
    items: list[ProductRecord]
    total: int
    page: int
    page_size: int


def _to_record(row: Product) -> ProductRecord:
    return ProductRecord(
        id=str(row.id),
        vertical_id=str(row.vertical_id),
        slug=row.slug,
        name_en=row.name_en,
        name_ja=row.name_ja,
        base_price=float(row.base_price),
        currency=row.currency,
        is_active=row.is_active,
        created_at=row.created_at,
    )


@router.get("", response_model=ProductListResponse)
async def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> ProductListResponse:
    """Return paginated list of all products."""
    offset = (page - 1) * page_size
    total = (await db.execute(select(func.count(Product.id)))).scalar_one()
    rows = (
        await db.execute(select(Product).offset(offset).limit(page_size))
    ).scalars().all()
    return ProductListResponse(
        items=[_to_record(r) for r in rows],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{product_id}", response_model=ProductRecord)
async def get_product(
    product_id: str,
    db: AsyncSession = Depends(get_db),
) -> ProductRecord:
    """Return a single product by ID."""
    try:
        uid = _uuid.UUID(product_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid UUID")
    row = (
        await db.execute(select(Product).where(Product.id == uid))
    ).scalar_one_or_none()
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {product_id!r} not found",
        )
    return _to_record(row)


@router.patch("/{product_id}", response_model=ProductRecord)
async def patch_product(
    product_id: str,
    body: ProductUpdate,
    db: AsyncSession = Depends(get_db),
) -> ProductRecord:
    """Partially update a product. None fields are skipped."""
    try:
        uid = _uuid.UUID(product_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid UUID")
    row = (
        await db.execute(select(Product).where(Product.id == uid))
    ).scalar_one_or_none()
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {product_id!r} not found",
        )
    for field, value in body.model_dump().items():
        if value is not None:
            setattr(row, field, value)
    await db.commit()
    await db.refresh(row)
    return _to_record(row)


@router.delete("/{product_id}", response_model=ProductRecord)
async def delete_product(
    product_id: str,
    db: AsyncSession = Depends(get_db),
) -> ProductRecord:
    """Soft-delete a product by setting is_active=False."""
    try:
        uid = _uuid.UUID(product_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid UUID")
    row = (
        await db.execute(select(Product).where(Product.id == uid))
    ).scalar_one_or_none()
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {product_id!r} not found",
        )
    row.is_active = False
    await db.commit()
    await db.refresh(row)
    return _to_record(row)
