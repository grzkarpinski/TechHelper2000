import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from backend.dependencies import require_admin
from backend.main import app

# Stawki referencyjne z wymagań, niezależne od kodu kalkulatorów.
EXPECTED_RATES = [
    ("1", 110, 140, 161), ("2", 120, 140, 161), ("17", 90, 110, 150),
    ("4", 120, 185, 210), ("6", 140, 185, 210), ("7", 220, 310, 420),
    ("8", 180, 185, 210), ("10", 220, 410, 600), ("16", 220, 300, 400),
    ("18", 800, 500, 700), ("KJ", 100, 150, 185),
]
RATE_CASES = [(group, kind, rates[index])
              for group, *rates in EXPECTED_RATES
              for index, kind in enumerate(("old", "new_2026", "external_2026"))]


@pytest.fixture
def cost_client():
    # Sprawdzamy API kalkulatora bez dostępu do rzeczywistej bazy.
    app.dependency_overrides[require_admin] = lambda: None
    client = TestClient(app)
    yield client
    client.close()
    app.dependency_overrides.pop(require_admin, None)


@pytest.mark.parametrize("group,kind,rate", RATE_CASES)
def test_both_directions_for_every_rate(cost_client, group, kind, rate):
    response = cost_client.post(f"/api/calculators/cost?rate_type={kind}",
                               json=[{"group_id": group, "tpz": 15, "tj": 45}])
    assert response.status_code == 200
    result = response.json()
    assert result["total"] == rate
    assert result["operations"][0]["cost_tpz"] == rate / 4
    assert result["operations"][0]["cost_tj"] == rate * 3 / 4
    response = cost_client.post(f"/api/calculators/time-from-cost?rate_type={kind}",
                               json=[{"group_id": group, "cost": rate / 4}])
    assert response.status_code == 200
    assert response.json()["total_time_minutes"] == 15
    assert response.json()["total_cost"] == rate / 4


def test_mixed_operations_and_fractional_minutes(cost_client):
    response = cost_client.post("/api/calculators/cost?rate_type=new_2026", json=[
        {"group_id": "6", "tpz": 30, "tj": 45},
        {"group_id": "4", "tpz": 15, "tj": 60},
    ])
    assert response.json()["total"] == 462.5
    response = cost_client.post("/api/calculators/time-from-cost?rate_type=new_2026", json=[
        {"group_id": "6", "cost": 231.25}, {"group_id": "1", "cost": 70},
    ])
    assert response.json()["total_time_minutes"] == 105
    response = cost_client.post("/api/calculators/cost?rate_type=external_2026", json=[
        {"group_id": "1", "tpz": 0.5, "tj": 1.25},
    ])
    assert response.json()["total"] == pytest.approx(4.6958)


@pytest.mark.parametrize("endpoint,fields", [
    ("cost", {"tpz": 1, "tj": 1}), ("time-from-cost", {"cost": 1}),
])
def test_operation_limits_and_invalid_values(cost_client, endpoint, fields):
    url = f"/api/calculators/{endpoint}?rate_type=new_2026"
    valid = {"group_id": "6", **fields}
    assert cost_client.post(url, json=[valid] * 10).status_code == 200
    for payload in ([], [valid] * 11, [{**valid, "group_id": "unknown"}]):
        assert cost_client.post(url, json=payload).status_code == 400
    for field in fields:
        for value in (0, -1, None):
            assert cost_client.post(url, json=[{**valid, field: value}]).status_code == 422
    assert cost_client.post(f"/api/calculators/{endpoint}?rate_type=invalid",
                            json=[valid]).status_code == 422


def test_frontend_rates_match_requirements():
    source = (Path(__file__).parents[2] / "frontend/src/components/calculators/costConstants.js").read_text()
    for group, *rates in EXPECTED_RATES:
        key = json.dumps(group) if group != "KJ" else "KJ"
        assert f'{key}: {{ old: {rates[0]}, new_2026: {rates[1]}, external_2026: {rates[2]} }}' in source
