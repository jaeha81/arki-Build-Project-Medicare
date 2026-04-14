import uuid
from pydantic import BaseModel, EmailStr


class ConsultationCreate(BaseModel):
    vertical_id: uuid.UUID | None = None
    name: str
    email: EmailStr
    age_range: str | None = None
    preferred_language: str = "en"
    health_survey: dict | None = None
    product_interest: dict | None = None
    consent_terms: bool
    consent_privacy: bool
    consent_medical: bool


class ConsultationStatusOut(BaseModel):
    id: uuid.UUID
    status: str

    model_config = {"from_attributes": True}
