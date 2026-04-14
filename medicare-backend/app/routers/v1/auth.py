"""Auth router — register, login, logout, me endpoints.

Uses Supabase REST Auth API via httpx. Falls back to self-issued JWT
(HS256, jwt_secret) when supabase_url is not configured.
"""

import time
import uuid

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from jose import jwt
from sqlalchemy import select

from app.config import settings
from app.database import AsyncSessionLocal
from app.dependencies import get_current_customer
from app.models.customer import Customer
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, TokenPayload

__all__: list[str] = []

router = APIRouter(prefix="/auth", tags=["auth"])

_DEV_MODE = not settings.supabase_url and settings.debug


def _issue_dev_jwt(user_id: str, email: str, full_name: str | None) -> str:
    """Issue a self-signed HS256 JWT for dev/test environments."""
    payload: dict = {
        "sub": user_id,
        "email": email,
        "role": "customer",
        "full_name": full_name,
        "exp": int(time.time()) + 86400,  # 24 h
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest) -> AuthResponse:
    """Create a new customer account."""
    if _DEV_MODE:
        user_id = str(uuid.uuid4())
        async with AsyncSessionLocal() as _db:
            _existing = await _db.execute(
                select(Customer).where(Customer.supabase_uid == user_id)
            )
            if _existing.scalar_one_or_none() is None:
                _db.add(Customer(
                    supabase_uid=user_id,
                    email=body.email,
                    full_name=body.full_name,
                ))
                await _db.commit()
        token = _issue_dev_jwt(user_id, body.email, body.full_name)
        return AuthResponse(
            access_token=token,
            user_id=user_id,
            email=body.email,
            full_name=body.full_name,
        )
    elif not settings.supabase_url:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service not configured. Set SUPABASE_URL in environment.",
        )

    url = f"{settings.supabase_url}/auth/v1/signup"
    headers = {
        "apikey": settings.supabase_anon_key,
        "Content-Type": "application/json",
    }
    payload = {
        "email": body.email,
        "password": body.password,
        "data": {"full_name": body.full_name},
    }
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.post(url, json=payload, headers=headers)

    if resp.status_code not in (200, 201):
        detail = resp.json().get("msg") or resp.json().get("error_description") or "Registration failed"
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

    data = resp.json()
    access_token: str = data.get("access_token", "")
    user: dict = data.get("user") or {}
    user_id: str = user.get("id", "")
    user_meta: dict = user.get("user_metadata") or {}
    full_name: str | None = user_meta.get("full_name")

    async with AsyncSessionLocal() as _db:
        _existing = await _db.execute(
            select(Customer).where(Customer.supabase_uid == user_id)
        )
        if _existing.scalar_one_or_none() is None:
            _db.add(Customer(
                supabase_uid=user_id,
                email=body.email,
                full_name=full_name,
            ))
            await _db.commit()

    return AuthResponse(
        access_token=access_token,
        user_id=user_id,
        email=body.email,
        full_name=full_name,
    )


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest) -> AuthResponse:
    """Authenticate with email + password."""
    if _DEV_MODE:
        user_id = str(uuid.uuid4())
        token = _issue_dev_jwt(user_id, body.email, None)
        return AuthResponse(
            access_token=token,
            user_id=user_id,
            email=body.email,
        )
    elif not settings.supabase_url:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service not configured. Set SUPABASE_URL in environment.",
        )

    url = f"{settings.supabase_url}/auth/v1/token?grant_type=password"
    headers = {
        "apikey": settings.supabase_anon_key,
        "Content-Type": "application/json",
    }
    payload = {"email": body.email, "password": body.password}

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.post(url, json=payload, headers=headers)

    if resp.status_code != 200:
        detail = resp.json().get("error_description") or "Invalid credentials"
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)

    data = resp.json()
    access_token = data.get("access_token", "")
    user: dict = data.get("user") or {}
    user_id = user.get("id", "")
    user_meta: dict = user.get("user_metadata") or {}

    return AuthResponse(
        access_token=access_token,
        user_id=user_id,
        email=body.email,
        full_name=user_meta.get("full_name"),
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout() -> None:
    """Stateless logout — client discards the token."""
    return None


@router.get("/me", response_model=TokenPayload)
async def me(token: TokenPayload = Depends(get_current_customer)) -> TokenPayload:
    """Return the currently authenticated user's token payload."""
    return token
