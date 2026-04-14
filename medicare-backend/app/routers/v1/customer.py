"""Customer dashboard API — protected by JWT authentication."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.dependencies import get_current_customer
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
) -> CustomerProfile:
    """Return the authenticated customer's profile."""
    return CustomerProfile(
        user_id=token.sub,
        email=token.email,
        role=token.role,
    )


@router.get("/consultations", response_model=list[ConsultationSummary])
async def get_my_consultations(
    token: TokenPayload = Depends(get_current_customer),
) -> list[ConsultationSummary]:
    """Return the authenticated customer's consultation list.

    TODO: Replace mock data with DB query filtered by token.sub.
    """
    _ = token  # used for auth guard; DB query will use token.sub
    return []


@router.get("/subscriptions", response_model=list[SubscriptionSummary])
async def get_my_subscriptions(
    token: TokenPayload = Depends(get_current_customer),
) -> list[SubscriptionSummary]:
    """Return the authenticated customer's subscription list.

    TODO: Replace mock data with DB query filtered by token.sub.
    """
    _ = token  # used for auth guard; DB query will use token.sub
    return []
