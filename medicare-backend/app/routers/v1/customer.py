"""Customer dashboard API — protected by JWT authentication."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_customer
from app.models.consultation import ConsultationRequest
from app.models.customer import Customer
from app.models.subscription import Subscription
from app.schemas.auth import TokenPayload

__all__: list[str] = []

router = APIRouter(prefix="/customer", tags=["customer"])


class CustomerProfile(BaseModel):
    user_id: str
    email: str
    role: str
    full_name: str | None = None


class ConsultationSummary(BaseModel):
    consultation_id: str
    vertical: str
    status: str
    created_at: str


class SubscriptionSummary(BaseModel):
    subscription_id: str
    vertical: str
    plan: str
    status: str
    renewal_date: str | None = None


@router.get("/me", response_model=CustomerProfile)
async def get_my_profile(
    token: TokenPayload = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
) -> CustomerProfile:
    """Return the authenticated customer's profile."""
    result = await db.execute(
        select(Customer).where(Customer.supabase_uid == token.sub)
    )
    customer = result.scalar_one_or_none()
    return CustomerProfile(
        user_id=token.sub,
        email=token.email,
        role=token.role,
        full_name=customer.full_name if customer else None,
    )


@router.get("/consultations", response_model=list[ConsultationSummary])
async def get_my_consultations(
    token: TokenPayload = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
) -> list[ConsultationSummary]:
    """Return the authenticated customer's consultation list."""
    result = await db.execute(
        select(ConsultationRequest).where(ConsultationRequest.email == token.email)
    )
    rows = result.scalars().all()
    return [
        ConsultationSummary(
            consultation_id=str(r.id),
            vertical=str(r.vertical_id) if r.vertical_id else "general",
            status=r.status,
            created_at=r.created_at.isoformat(),
        )
        for r in rows
    ]


@router.get("/subscriptions", response_model=list[SubscriptionSummary])
async def get_my_subscriptions(
    token: TokenPayload = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
) -> list[SubscriptionSummary]:
    """Return the authenticated customer's subscription list."""
    cust_result = await db.execute(
        select(Customer).where(Customer.supabase_uid == token.sub)
    )
    customer = cust_result.scalar_one_or_none()
    if not customer:
        return []
    sub_result = await db.execute(
        select(Subscription).where(Subscription.customer_id == customer.id)
    )
    rows = sub_result.scalars().all()
    return [
        SubscriptionSummary(
            subscription_id=str(r.id),
            vertical=r.vertical,
            plan=r.plan,
            status=r.status,
            renewal_date=r.renewal_date,
        )
        for r in rows
    ]
