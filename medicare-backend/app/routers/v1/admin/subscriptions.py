"""Admin subscription management endpoints."""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

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


# ---------------------------------------------------------------------------
# Mock data — replace with real DB queries once schema is migrated.
# ---------------------------------------------------------------------------

_MOCK_SUBSCRIPTIONS: list[SubscriptionRecord] = [
    SubscriptionRecord(
        id="sub-001",
        customer_id="cust-001",
        vertical="weight-loss",
        plan="premium",
        status="active",
        renewal_date="2026-05-01",
    ),
    SubscriptionRecord(
        id="sub-002",
        customer_id="cust-002",
        vertical="skin-care",
        plan="basic",
        status="paused",
        renewal_date="2026-04-20",
    ),
]


@router.get("", response_model=SubscriptionListResponse)
async def list_subscriptions(
    page: int = 1,
    page_size: int = 20,
) -> SubscriptionListResponse:
    """Return paginated list of all subscriptions."""
    start = (page - 1) * page_size
    end = start + page_size
    items = _MOCK_SUBSCRIPTIONS[start:end]
    return SubscriptionListResponse(
        items=items,
        total=len(_MOCK_SUBSCRIPTIONS),
        page=page,
        page_size=page_size,
    )


@router.get("/{subscription_id}", response_model=SubscriptionRecord)
async def get_subscription(subscription_id: str) -> SubscriptionRecord:
    """Return a single subscription by ID."""
    for sub in _MOCK_SUBSCRIPTIONS:
        if sub.id == subscription_id:
            return sub
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Subscription {subscription_id!r} not found",
    )


@router.patch("/{subscription_id}", response_model=SubscriptionRecord)
async def patch_subscription(
    subscription_id: str,
    body: SubscriptionPatch,
) -> SubscriptionRecord:
    """Update the status of a subscription."""
    allowed_statuses = {"active", "paused", "cancelled", "expired"}
    if body.status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"status must be one of {sorted(allowed_statuses)}",
        )
    for sub in _MOCK_SUBSCRIPTIONS:
        if sub.id == subscription_id:
            sub.status = body.status
            return sub
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Subscription {subscription_id!r} not found",
    )
