"""Admin subscription management endpoints."""

import uuid as _uuid

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.subscription import Subscription

__all__: list[str] = []

router = APIRouter(prefix="/subscriptions", tags=["admin-subscriptions"])


class SubscriptionRecord(BaseModel):
    id: str
    customer_id: str
    vertical: str
    plan: str
    status: str
    renewal_date: str | None = None


class SubscriptionListResponse(BaseModel):
    items: list[SubscriptionRecord]
    total: int
    page: int
    page_size: int


class SubscriptionPatch(BaseModel):
    status: str


@router.get("", response_model=SubscriptionListResponse)
async def list_subscriptions(
    page: int = 1,
    page_size: int = 20,
    db: AsyncSession = Depends(get_db),
) -> SubscriptionListResponse:
    """Return paginated list of all subscriptions."""
    offset = (page - 1) * page_size
    total = (await db.execute(select(func.count(Subscription.id)))).scalar_one()
    rows = (
        await db.execute(select(Subscription).offset(offset).limit(page_size))
    ).scalars().all()
    return SubscriptionListResponse(
        items=[
            SubscriptionRecord(
                id=str(r.id),
                customer_id=str(r.customer_id),
                vertical=r.vertical,
                plan=r.plan,
                status=r.status,
                renewal_date=r.renewal_date,
            )
            for r in rows
        ],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{subscription_id}", response_model=SubscriptionRecord)
async def get_subscription(
    subscription_id: str,
    db: AsyncSession = Depends(get_db),
) -> SubscriptionRecord:
    """Return a single subscription by ID."""
    try:
        uid = _uuid.UUID(subscription_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid UUID")
    row = (
        await db.execute(select(Subscription).where(Subscription.id == uid))
    ).scalar_one_or_none()
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subscription {subscription_id!r} not found",
        )
    return SubscriptionRecord(
        id=str(row.id),
        customer_id=str(row.customer_id),
        vertical=row.vertical,
        plan=row.plan,
        status=row.status,
        renewal_date=row.renewal_date,
    )


@router.patch("/{subscription_id}", response_model=SubscriptionRecord)
async def patch_subscription(
    subscription_id: str,
    body: SubscriptionPatch,
    db: AsyncSession = Depends(get_db),
) -> SubscriptionRecord:
    """Update the status of a subscription."""
    allowed_statuses = {"active", "paused", "cancelled", "expired"}
    if body.status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"status must be one of {sorted(allowed_statuses)}",
        )
    try:
        uid = _uuid.UUID(subscription_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid UUID")
    row = (
        await db.execute(select(Subscription).where(Subscription.id == uid))
    ).scalar_one_or_none()
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Subscription {subscription_id!r} not found",
        )
    row.status = body.status
    await db.commit()
    await db.refresh(row)
    return SubscriptionRecord(
        id=str(row.id),
        customer_id=str(row.customer_id),
        vertical=row.vertical,
        plan=row.plan,
        status=row.status,
        renewal_date=row.renewal_date,
    )
