"""Prescription endpoints — customer (read) + admin (write)."""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_customer, require_admin_role
from app.models.customer import Customer
from app.models.prescription import Prescription
from app.schemas.auth import TokenPayload

__all__: list[str] = []

router = APIRouter()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------


class PrescriptionOut(BaseModel):
    id: str
    consultation_id: str
    customer_id: str
    doctor_id: str
    drug_name: str
    dosage: str
    instructions: str | None = None
    inkan_number: str | None = None
    issued_at: str | None = None
    status: str
    created_at: str

    @classmethod
    def from_orm(cls, p: Prescription) -> "PrescriptionOut":
        return cls(
            id=str(p.id),
            consultation_id=str(p.consultation_id),
            customer_id=str(p.customer_id),
            doctor_id=p.doctor_id,
            drug_name=p.drug_name,
            dosage=p.dosage,
            instructions=p.instructions,
            inkan_number=p.inkan_number,
            issued_at=p.issued_at,
            status=p.status,
            created_at=p.created_at.isoformat(),
        )


class PrescriptionCreate(BaseModel):
    consultation_id: str
    customer_id: str
    doctor_id: str
    drug_name: str
    dosage: str
    instructions: str | None = None
    inkan_number: str | None = None
    issued_at: str | None = None


class PrescriptionStatusUpdate(BaseModel):
    status: str  # issued | dispensed | delivered


# ---------------------------------------------------------------------------
# Customer endpoints (read-only)
# ---------------------------------------------------------------------------

customer_router = APIRouter(prefix="/customer", tags=["customer"])


@customer_router.get("/prescriptions", response_model=list[PrescriptionOut])
async def get_my_prescriptions(
    token: TokenPayload = Depends(get_current_customer),
    db: AsyncSession = Depends(get_db),
) -> list[PrescriptionOut]:
    """Return the authenticated customer's prescription list."""
    cust_result = await db.execute(
        select(Customer).where(Customer.supabase_uid == token.sub)
    )
    customer = cust_result.scalar_one_or_none()
    if not customer:
        return []
    result = await db.execute(
        select(Prescription)
        .where(Prescription.customer_id == customer.id)
        .order_by(Prescription.created_at.desc())
    )
    rows = result.scalars().all()
    return [PrescriptionOut.from_orm(r) for r in rows]


# ---------------------------------------------------------------------------
# Admin endpoints (write)
# ---------------------------------------------------------------------------

admin_router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(require_admin_role)],
)


@admin_router.post("/prescriptions", response_model=PrescriptionOut, status_code=201)
async def issue_prescription(
    body: PrescriptionCreate,
    db: AsyncSession = Depends(get_db),
) -> PrescriptionOut:
    """Doctor issues a new prescription."""
    prescription = Prescription(
        consultation_id=uuid.UUID(body.consultation_id),
        customer_id=uuid.UUID(body.customer_id),
        doctor_id=body.doctor_id,
        drug_name=body.drug_name,
        dosage=body.dosage,
        instructions=body.instructions,
        inkan_number=body.inkan_number,
        issued_at=body.issued_at or datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        status="issued",
    )
    db.add(prescription)
    await db.commit()
    await db.refresh(prescription)
    return PrescriptionOut.from_orm(prescription)


@admin_router.patch("/prescriptions/{prescription_id}", response_model=PrescriptionOut)
async def update_prescription_status(
    prescription_id: str,
    body: PrescriptionStatusUpdate,
    db: AsyncSession = Depends(get_db),
) -> PrescriptionOut:
    """Update prescription status (dispensed / delivered)."""
    valid_statuses = {"issued", "dispensed", "delivered"}
    if body.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"status must be one of {valid_statuses}")

    result = await db.execute(
        select(Prescription).where(Prescription.id == uuid.UUID(prescription_id))
    )
    prescription = result.scalar_one_or_none()
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")

    prescription.status = body.status
    prescription.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(prescription)
    return PrescriptionOut.from_orm(prescription)
