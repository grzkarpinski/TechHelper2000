import pytest
from fastapi import HTTPException

from backend.routers.calculators import calculate_time_from_cost_endpoint
from backend.schemas import TimeFromCostOperationRequest


@pytest.mark.asyncio
async def test_calculates_time_from_cost_using_selected_rate() -> None:
    operations = [TimeFromCostOperationRequest(group_id="6", cost=185)]

    result = await calculate_time_from_cost_endpoint(operations, "new_2026", None)

    assert result.total_cost == 185
    assert result.total_time_minutes == 60
    assert result.operations[0].rate == 185
    assert result.operations[0].time_minutes == 60


@pytest.mark.asyncio
async def test_sums_time_for_multiple_machine_groups() -> None:
    operations = [
        TimeFromCostOperationRequest(group_id="1", cost=55),
        TimeFromCostOperationRequest(group_id="4", cost=120),
    ]

    result = await calculate_time_from_cost_endpoint(operations, "old", None)

    assert result.total_cost == 175
    assert result.total_time_minutes == 90


@pytest.mark.asyncio
async def test_rejects_unknown_machine_group() -> None:
    operations = [TimeFromCostOperationRequest(group_id="unknown", cost=100)]

    with pytest.raises(HTTPException) as error:
        await calculate_time_from_cost_endpoint(operations, "old", None)

    assert error.value.status_code == 400


def test_rejects_non_positive_cost() -> None:
    with pytest.raises(ValueError):
        TimeFromCostOperationRequest(group_id="6", cost=0)
