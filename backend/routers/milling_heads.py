from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db_session
from backend.dependencies import require_admin
from backend.models import MillingHead, User
from backend.schemas_tools import MillingHeadCreate, MillingHeadResponse

router = APIRouter(prefix="/api/tools/milling-heads", tags=["milling-heads"])


@router.get("/", response_model=list[MillingHeadResponse])
async def list_milling_heads(
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(require_admin),
) -> list[MillingHeadResponse]:
    result = await session.execute(select(MillingHead))
    return [MillingHeadResponse.model_validate(row) for row in result.scalars().all()]


@router.post("/", response_model=MillingHeadResponse, status_code=status.HTTP_201_CREATED)
async def create_milling_head(
    payload: MillingHeadCreate,
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(require_admin),
) -> MillingHeadResponse:
    head = MillingHead(**payload.model_dump())
    session.add(head)
    await session.commit()
    await session.refresh(head)
    return MillingHeadResponse.model_validate(head)


@router.get("/{head_id}", response_model=MillingHeadResponse)
async def get_milling_head(
    head_id: int,
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(require_admin),
) -> MillingHeadResponse:
    result = await session.execute(select(MillingHead).where(MillingHead.id == head_id))
    head = result.scalar_one_or_none()
    if head is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Glowica nie znaleziona")
    return MillingHeadResponse.model_validate(head)


@router.put("/{head_id}", response_model=MillingHeadResponse)
async def update_milling_head(
    head_id: int,
    payload: MillingHeadCreate,
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(require_admin),
) -> MillingHeadResponse:
    result = await session.execute(select(MillingHead).where(MillingHead.id == head_id))
    head = result.scalar_one_or_none()
    if head is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Glowica nie znaleziona")
    for key, value in payload.model_dump().items():
        setattr(head, key, value)
    await session.commit()
    await session.refresh(head)
    return MillingHeadResponse.model_validate(head)


@router.delete("/{head_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_milling_head(
    head_id: int,
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(require_admin),
) -> None:
    result = await session.execute(select(MillingHead).where(MillingHead.id == head_id))
    head = result.scalar_one_or_none()
    if head is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Glowica nie znaleziona")
    await session.delete(head)
    await session.commit()
