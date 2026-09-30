def test_login_and_me(api_context: dict, admin_headers: dict[str, str]) -> None:
    response = api_context["client"].get("/api/auth/me", headers=admin_headers)

    assert response.status_code == 200
    assert response.json()["username"] == "admin"
    assert "hashed_password" not in response.json()


def test_rejects_invalid_and_blocked_login(api_context: dict) -> None:
    client = api_context["client"]

    invalid = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "wrong-password"},
    )
    blocked = client.post(
        "/api/auth/login",
        json={"username": "blocked", "password": "blocked-password"},
    )

    assert invalid.status_code == 401
    assert blocked.status_code == 403


def test_user_cannot_access_admin_resources(api_context: dict, user_headers: dict[str, str]) -> None:
    client = api_context["client"]

    assert client.get("/api/admin/users", headers=user_headers).status_code == 403
    assert client.get("/api/tools/drills/", headers=user_headers).status_code == 403
    assert client.post("/api/calculators/cost", headers=user_headers, json=[]).status_code == 403


def test_admin_can_manage_drill(api_context: dict, admin_headers: dict[str, str]) -> None:
    client = api_context["client"]
    payload = {
        "srednica_D_mm": 12.0,
        "symbol_narzedzia": "DR-12",
        "producent": "Test",
        "rodzaj_wiertla": "VHM",
    }

    created = client.post("/api/tools/drills/", headers=admin_headers, json=payload)
    assert created.status_code == 201
    drill_id = created.json()["id"]

    listed = client.get("/api/tools/drills/", headers=admin_headers)
    assert listed.status_code == 200
    assert [item["symbol_narzedzia"] for item in listed.json()] == ["DR-12"]

    payload["producent"] = "Zmieniony"
    updated = client.put(f"/api/tools/drills/{drill_id}", headers=admin_headers, json=payload)
    assert updated.status_code == 200
    assert updated.json()["producent"] == "Zmieniony"

    deleted = client.delete(f"/api/tools/drills/{drill_id}", headers=admin_headers)
    assert deleted.status_code == 204
    assert client.get(f"/api/tools/drills/{drill_id}", headers=admin_headers).status_code == 404


def test_admin_cannot_modify_own_account(api_context: dict, admin_headers: dict[str, str]) -> None:
    client = api_context["client"]
    current_user = client.get("/api/auth/me", headers=admin_headers).json()

    response = client.patch(
        f"/api/admin/users/{current_user['id']}",
        headers=admin_headers,
        json={"is_active": False},
    )

    assert response.status_code == 403


def test_calculators_have_expected_access(api_context: dict, admin_headers: dict[str, str]) -> None:
    client = api_context["client"]
    milling = client.post(
        "/api/calculators/milling",
        json={"vc": 100, "fz": 0.2, "d": 50, "z": 4},
    )
    cost = client.post(
        "/api/calculators/cost?rate_type=new_2026",
        headers=admin_headers,
        json=[{"group_id": "6", "tpz": 30, "tj": 30}],
    )

    assert milling.status_code == 200
    assert cost.status_code == 200
    assert cost.json()["total"] == 185
