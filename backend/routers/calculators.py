from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.calculations.drilling_feed_speed import calculate_drilling
from backend.calculations.milling_feed_speed import calculate_milling
from backend.dependencies import require_admin
from backend.models import User
from backend.schemas import (
    CostCalculationResponse,
    CostOperationRequest,
    CostOperationResult,
    DrillingCalculationRequest,
    DrillingCalculationResponse,
    MillingCalculationRequest,
    MillingCalculationResponse,
)

router = APIRouter(prefix="/api/calculators", tags=["calculators"])

MACHINE_RATES = {
    "1": {"old": 110, "new_2026": 140, "external_2026": 161},
    "2": {"old": 120, "new_2026": 140, "external_2026": 161},
    "17": {"old": 90, "new_2026": 110, "external_2026": 150},
    "4": {"old": 120, "new_2026": 185, "external_2026": 210},
    "6": {"old": 140, "new_2026": 185, "external_2026": 210},
    "7": {"old": 220, "new_2026": 310, "external_2026": 420},
    "8": {"old": 180, "new_2026": 185, "external_2026": 210},
    "10": {"old": 220, "new_2026": 410, "external_2026": 600},
    "16": {"old": 220, "new_2026": 300, "external_2026": 400},
    "18": {"old": 800, "new_2026": 500, "external_2026": 700},
    "KJ": {"old": 100, "new_2026": 150, "external_2026": 185},
}


@router.post("/milling", response_model=MillingCalculationResponse)
async def calculate_milling_endpoint(
    payload: MillingCalculationRequest,
) -> MillingCalculationResponse:
    try:
        result = calculate_milling(payload.model_dump())
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error

    return MillingCalculationResponse(**result)


@router.post("/drilling", response_model=DrillingCalculationResponse)
async def calculate_drilling_endpoint(
    payload: DrillingCalculationRequest,
) -> DrillingCalculationResponse:
    try:
        result = calculate_drilling(payload.model_dump())
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error

    return DrillingCalculationResponse(**result)


@router.post("/cost", response_model=CostCalculationResponse)
async def calculate_cost_endpoint(
    operations: list[CostOperationRequest],
    rate_type: str = Query(default="old", pattern="^(old|new_2026|external_2026)$"),
    _: User = Depends(require_admin),
) -> CostCalculationResponse:
    if len(operations) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Lista operacji nie moze byc pusta")

    if len(operations) > 10:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Maksymalnie 10 operacji")

    operation_results: list[CostOperationResult] = []
    total = 0.0

    for operation in operations:
        rates = MACHINE_RATES.get(operation.group_id)
        if rates is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Nieznana grupa maszyny: {operation.group_id}",
            )

        rate = float(rates[rate_type])
        cost_tpz = (operation.tpz / 60) * rate
        cost_tj = (operation.tj / 60) * rate
        operation_total = cost_tpz + cost_tj
        total += operation_total

        operation_results.append(
            CostOperationResult(
                group_id=operation.group_id,
                rate=round(rate, 2),
                tpz=round(operation.tpz, 4),
                tj=round(operation.tj, 4),
                cost_tpz=round(cost_tpz, 4),
                cost_tj=round(cost_tj, 4),
                total=round(operation_total, 4),
            )
        )

    return CostCalculationResponse(operations=operation_results, total=round(total, 4))
