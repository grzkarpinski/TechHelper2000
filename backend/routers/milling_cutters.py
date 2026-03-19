from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db_session
from backend.dependencies import require_admin
from backend.models import MillingCutter, User
from backend.schemas_tools import MillingCutterCreate, MillingCutterResponse

router = APIRouter(prefix="/api/tools/milling-cutters", tags=["milling-cutters"])


@router.get("/", response_model=list[MillingCutterResponse])
async def list_milling_cutters(
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(require_admin),
) -> list[MillingCutterResponse]:
    result = await session.execute(select(MillingCutter))
    return [MillingCutterResponse.model_validate(row) for row in result.scalars().all()]


@router.post("/", response_model=MillingCutterResponse, status_code=status.HTTP_201_CREATED)
async def create_milling_cutter(
    payload: MillingCutterCreate,
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(require_admin),
) -> MillingCutterResponse:
    cutter = MillingCutter(**payload.model_dump())
    session.add(cutter)
    await session.commit()
    await session.refresh(cutter)
    return MillingCutterResponse.model_validate(cutter)


@router.get("/{cutter_id}", response_model=MillingCutterResponse)
async def get_milling_cutter(
    cutter_id: int,
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(require_admin),
) -> MillingCutterResponse:
    result = await session.execute(select(MillingCutter).where(MillingCutter.id == cutter_id))
    cutter = result.scalar_one_or_none()
    if cutter is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Frez nie znaleziony")
    return MillingCutterResponse.model_validate(cutter)


@router.put("/{cutter_id}", response_model=MillingCutterResponse)
async def update_milling_cutter(
    cutter_id: int,
    payload: MillingCutterCreate,
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(require_admin),
) -> MillingCutterResponse:
    result = await session.execute(select(MillingCutter).where(MillingCutter.id == cutter_id))
    cutter = result.scalar_one_or_none()
    if cutter is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Frez nie znaleziony")
    for key, value in payload.model_dump().items():
        setattr(cutter, key, value)
    await session.commit()
    await session.refresh(cutter)
    return MillingCutterResponse.model_validate(cutter)


@router.delete("/{cutter_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_milling_cutter(
    cutter_id: int,
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(require_admin),
) -> None:
    result = await session.execute(select(MillingCutter).where(MillingCutter.id == cutter_id))
    cutter = result.scalar_one_or_none()
    if cutter is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Frez nie znaleziony")
    await session.delete(cutter)
    await session.commit()
