from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.admin import ApprovalListItem, ApprovalAction
from app.services import admin_service

router = APIRouter(prefix="/approvals")


@router.get("", response_model=list[ApprovalListItem])
async def list_approvals(
    status: str = Query("pending"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
) -> list[ApprovalListItem]:
    return await admin_service.list_approvals(db, status=status, skip=skip, limit=limit)


@router.post("/{approval_id}/action", response_model=ApprovalListItem)
async def process_approval(
    approval_id: str,
    action: ApprovalAction,
    db: AsyncSession = Depends(get_db),
) -> ApprovalListItem:
    approval = await admin_service.process_approval(db, approval_id, action)
    if not approval:
        raise HTTPException(status_code=404, detail="Approval not found")
    return approval
