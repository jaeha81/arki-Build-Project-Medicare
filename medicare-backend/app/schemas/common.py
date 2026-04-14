from pydantic import BaseModel
from datetime import datetime


class ErrorResponse(BaseModel):
    code: str
    message: str
    details: dict = {}
    timestamp: datetime


class PaginatedResponse(BaseModel):
    total: int
    page: int
    size: int
    items: list
