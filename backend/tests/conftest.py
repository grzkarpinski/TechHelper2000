import asyncio
from collections.abc import AsyncIterator, Iterator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from backend.database import Base, get_db_session
from backend.main import app
from backend.models import User
from backend.services.security import hash_password


@pytest.fixture
def api_context(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Iterator[dict]:
    monkeypatch.setenv("SECRET_KEY", "test-secret-key-with-at-least-32-characters")
    monkeypatch.setenv("JWT_EXPIRE_HOURS", "8")
    engine = create_async_engine(f"sqlite+aiosqlite:///{tmp_path / 'test.db'}")
    session_factory = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    async def prepare_database() -> None:
        async with engine.begin() as connection:
            await connection.run_sync(Base.metadata.create_all)
        async with session_factory() as session:
            session.add_all(
                [
                    User(
                        username="admin",
                        hashed_password=hash_password("admin-password"),
                        role="admin",
                        is_active=True,
                    ),
                    User(
                        username="operator",
                        hashed_password=hash_password("operator-password"),
                        role="user",
                        is_active=True,
                    ),
                    User(
                        username="blocked",
                        hashed_password=hash_password("blocked-password"),
                        role="user",
                        is_active=False,
                    ),
                ]
            )
            await session.commit()

    async def override_session() -> AsyncIterator[AsyncSession]:
        async with session_factory() as session:
            yield session

    asyncio.run(prepare_database())
    app.dependency_overrides[get_db_session] = override_session
    client = TestClient(app)
    yield {"client": client, "session_factory": session_factory}
    client.close()
    app.dependency_overrides.clear()
    asyncio.run(engine.dispose())


@pytest.fixture
def admin_headers(api_context: dict) -> dict[str, str]:
    response = api_context["client"].post(
        "/api/auth/login",
        json={"username": "admin", "password": "admin-password"},
    )
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


@pytest.fixture
def user_headers(api_context: dict) -> dict[str, str]:
    response = api_context["client"].post(
        "/api/auth/login",
        json={"username": "operator", "password": "operator-password"},
    )
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}
