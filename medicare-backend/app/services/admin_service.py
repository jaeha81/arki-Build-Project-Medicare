import uuid
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.consultation import ConsultationRequest
from app.models.agents import AdminApproval
from app.schemas.admin import ConsultationStatusUpdate, ApprovalAction


async def list_consultations(
    db: AsyncSession,
    status: str | None = None,
    skip: int = 0,
    limit: int = 50,
) -> list[ConsultationRequest]:
    query = select(ConsultationRequest).order_by(ConsultationRequest.created_at.desc())
    if status:
        query = query.where(ConsultationRequest.status == status)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return list(result.scalars().all())


async def update_consultation_status(
    db: AsyncSession,
    consultation_id: uuid.UUID,  # P2 fix: FastAPI validates UUID in path param
    update: ConsultationStatusUpdate,
) -> ConsultationRequest | None:
    result = await db.execute(
        select(ConsultationRequest).where(ConsultationRequest.id == consultation_id)
    )
    consultation = result.scalar_one_or_none()
    if not consultation:
        return None
    consultation.status = update.status
    await db.commit()
    await db.refresh(consultation)
    return consultation


async def list_approvals(
    db: AsyncSession,
    status: str = "pending",
    skip: int = 0,
    limit: int = 50,
) -> list[AdminApproval]:
    result = await db.execute(
        select(AdminApproval)
        .where(AdminApproval.status == status)
        .order_by(AdminApproval.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(result.scalars().all())


async def process_approval(
    db: AsyncSession,
    approval_id: uuid.UUID,  # P2 fix: FastAPI validates UUID in path param
    action: ApprovalAction,
) -> AdminApproval | None:
    result = await db.execute(
        select(AdminApproval).where(AdminApproval.id == approval_id)
    )
    approval = result.scalar_one_or_none()
    if not approval:
        return None
    # P2 fix: action.action is now Literal["approve","reject"] — no silent fallback
    approval.status = action.action + "d"  # "approve" → "approved", "reject" → "rejected"
    approval.review_note = action.note
    await db.commit()
    await db.refresh(approval)
    return approval


async def get_stats(db: AsyncSession) -> dict:
    total = await db.scalar(select(func.count(ConsultationRequest.id)))
    pending = await db.scalar(
        select(func.count(ConsultationRequest.id)).where(ConsultationRequest.status == "pending")
    )
    pending_approvals = await db.scalar(
        select(func.count(AdminApproval.id)).where(AdminApproval.status == "pending")
    )
    return {
        "total_consultations": total or 0,
        "pending_consultations": pending or 0,
        "active_subscriptions": 0,  # Placeholder — subscriptions table Phase 3+
        "pending_approvals": pending_approvals or 0,
    }
