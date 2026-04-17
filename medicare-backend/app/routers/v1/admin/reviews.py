"""Admin review management endpoints."""

import uuid as _uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.review import Review
from app.schemas.admin import ReviewStatusUpdate

__all__: list[str] = []

router = APIRouter(prefix="/reviews", tags=["admin-reviews"])


class ReviewRecord(BaseModel):
    id: str
    product_id: str
    customer_name: str
    rating: int
    body: str | None
    status: str
    is_approved: bool
    is_flagged: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ReviewListResponse(BaseModel):
    items: list[ReviewRecord]
    total: int
    page: int
    page_size: int


def _to_record(row: Review) -> ReviewRecord:
    return ReviewRecord(
        id=str(row.id),
        product_id=str(row.product_id),
        customer_name=row.customer_name,
        rating=row.rating,
        body=row.body,
        status=row.status,
        is_approved=row.is_approved,
        is_flagged=row.is_flagged,
        created_at=row.created_at,
    )


@router.get("", response_model=ReviewListResponse)
async def list_reviews(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status_filter: str | None = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
) -> ReviewListResponse:
    """Return paginated list of reviews, optionally filtered by status."""
    offset = (page - 1) * page_size
    base_query = select(Review)
    count_query = select(func.count(Review.id))
    if status_filter is not None:
        base_query = base_query.where(Review.status == status_filter)
        count_query = count_query.where(Review.status == status_filter)
    total = (await db.execute(count_query)).scalar_one()
    rows = (
        await db.execute(base_query.offset(offset).limit(page_size))
    ).scalars().all()
    return ReviewListResponse(
        items=[_to_record(r) for r in rows],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{review_id}", response_model=ReviewRecord)
async def get_review(
    review_id: str,
    db: AsyncSession = Depends(get_db),
) -> ReviewRecord:
    """Return a single review by ID."""
    try:
        uid = _uuid.UUID(review_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid UUID")
    row = (
        await db.execute(select(Review).where(Review.id == uid))
    ).scalar_one_or_none()
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Review {review_id!r} not found",
        )
    return _to_record(row)


@router.patch("/{review_id}", response_model=ReviewRecord)
async def patch_review(
    review_id: str,
    body: ReviewStatusUpdate,
    db: AsyncSession = Depends(get_db),
) -> ReviewRecord:
    """Update the moderation status of a review."""
    try:
        uid = _uuid.UUID(review_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid UUID")
    row = (
        await db.execute(select(Review).where(Review.id == uid))
    ).scalar_one_or_none()
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Review {review_id!r} not found",
        )
    row.status = body.status
    if body.status == "approved":
        row.is_approved = True
        row.is_flagged = False
    elif body.status == "rejected":
        row.is_approved = False
        row.is_flagged = True
    else:  # pending
        row.is_approved = False
        row.is_flagged = False
    await db.commit()
    await db.refresh(row)
    return _to_record(row)
