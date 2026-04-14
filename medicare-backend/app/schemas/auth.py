"""Pydantic v2 schemas for authentication."""

from pydantic import BaseModel, EmailStr, Field

__all__ = [
    "RegisterRequest",
    "LoginRequest",
    "AuthResponse",
    "TokenPayload",
]


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str = Field(min_length=1)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: str | None = None


class TokenPayload(BaseModel):
    sub: str  # user_id
    email: str
    role: str = "customer"
    exp: int
