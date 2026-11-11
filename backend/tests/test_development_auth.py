import pytest
from fastapi.testclient import TestClient

from backend.config import validate_environment
from backend.main import app
from backend.services.security import decode_access_token


@pytest.fixture
def development_client(api_context, monkeypatch):
    monkeypatch.setenv("APP_ENV", "development")
    monkeypatch.setenv("DEV_ADMIN_ENABLED", "true")
    with_client = TestClient(app, base_url="http://127.0.0.1", client=("127.0.0.1", 50000))
    yield with_client
    with_client.close()


def test_development_admin_has_full_access_without_database_account(development_client):
    client = development_client
    token = client.post("/api/auth/development-session").json()["access_token"]
    assert decode_access_token(token)["development_admin"] is True
    headers = {"Authorization": f"Bearer {token}"}
    me = client.get("/api/auth/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["role"] == "admin"
    assert "hashed_password" not in me.json()
    users = client.get("/api/admin/users", headers=headers)
    assert users.status_code == 200
    assert all(user["id"] != 0 for user in users.json())
    assert client.get("/api/tools/drills/", headers=headers).status_code == 200
    assert client.get("/api/admin/users").status_code == 401


@pytest.mark.parametrize("environment,enabled", [("production", "false"), ("production", "true"), ("development", "false")])
def test_development_session_is_disabled_by_default(development_client, monkeypatch, environment, enabled):
    monkeypatch.setenv("APP_ENV", environment)
    monkeypatch.setenv("DEV_ADMIN_ENABLED", enabled)
    assert development_client.post("/api/auth/development-session").status_code == 404


def test_existing_development_token_stops_working_when_disabled(development_client, monkeypatch):
    token = development_client.post("/api/auth/development-session").json()["access_token"]
    monkeypatch.setenv("APP_ENV", "production")
    response = development_client.get("/api/admin/users", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 404


@pytest.mark.parametrize("host,origin,client_host", [
    ("example.com", "http://localhost:5173", "127.0.0.1"),
    ("localhost", "https://example.com", "127.0.0.1"),
    ("localhost", "http://localhost:5173", "192.168.1.5"),
])
def test_development_access_requires_local_client_host_and_origin(development_client, host, origin, client_host):
    client = TestClient(app, base_url=f"http://{host}", client=(client_host, 50001))
    try:
        assert client.post("/api/auth/development-session", headers={"Origin": origin}).status_code == 404
    finally:
        client.close()


def test_production_startup_rejects_development_admin_flag(monkeypatch):
    monkeypatch.setenv("APP_ENV", "production")
    monkeypatch.setenv("DEV_ADMIN_ENABLED", "true")
    with pytest.raises(RuntimeError, match="DEV_ADMIN_ENABLED"):
        validate_environment()
