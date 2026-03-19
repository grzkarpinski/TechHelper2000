from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db_session
from backend.dependencies import require_admin
from backend.models import Drill, User
from backend.schemas_tools import DrillCreate, DrillResponse

router = APIRouter(prefix="/api/tools/drills", tags=["drills"])


@router.get("/", response_model=list[DrillResponse])
async def list_drills(
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(require_admin),
) -> list[DrillResponse]:
    result = await session.execute(select(Drill))
    return [DrillResponse.model_validate(row) for row in result.scalars().all()]


@router.post("/", response_model=DrillResponse, status_code=status.HTTP_201_CREATED)
async def create_drill(
    payload: DrillCreate,
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(require_admin),
) -> DrillResponse:
    drill = Drill(**payload.model_dump())
    session.add(drill)
    await session.commit()
    await session.refresh(drill)
    return DrillResponse.model_validate(drill)


@router.get("/{drill_id}", response_model=DrillResponse)
async def get_drill(
    drill_id: int,
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(require_admin),
) -> DrillResponse:
    result = await session.execute(select(Drill).where(Drill.id == drill_id))
    drill = result.scalar_one_or_none()
    if drill is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wiertlo nie znalezione")
    return DrillResponse.model_validate(drill)


@router.put("/{drill_id}", response_model=DrillResponse)
async def update_drill(
    drill_id: int,
    payload: DrillCreate,
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(require_admin),
) -> DrillResponse:
    result = await session.execute(select(Drill).where(Drill.id == drill_id))
    drill = result.scalar_one_or_none()
    if drill is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wiertlo nie znalezione")
    for key, value in payload.model_dump().items():
        setattr(drill, key, value)
    await session.commit()
    await session.refresh(drill)
    return DrillResponse.model_validate(drill)


@router.delete("/{drill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_drill(
    drill_id: int,
    session: AsyncSession = Depends(get_db_session),
    _: User = Depends(require_admin),
) -> None:
    result = await session.execute(select(Drill).where(Drill.id == drill_id))
    drill = result.scalar_one_or_none()
    if drill is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wiertlo nie znalezione")
    await session.delete(drill)
    await session.commit()
