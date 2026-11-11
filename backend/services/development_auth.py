from datetime import UTC, datetime
from ipaddress import ip_address
from urllib.parse import urlsplit

from fastapi import HTTPException, Request

from backend.config import get_env
from backend.models import User
from backend.services.security import create_access_token


def development_admin_enabled() -> bool:
    return (
        get_env("APP_ENV", "production") == "development"
        and get_env("DEV_ADMIN_ENABLED", "false").lower() == "true"
    )


def is_loopback(host: str | None) -> bool:
    if host == "localhost":
        return True
    try:
        return ip_address(host or "").is_loopback
    except ValueError:
        return False


def require_local_development(request: Request) -> None:
    origin = request.headers.get("origin")
    if not (
        development_admin_enabled()
        and request.client is not None
        and is_loopback(request.client.host)
        and is_loopback(request.url.hostname)
        and (origin is None or is_loopback(urlsplit(origin).hostname))
    ):
        raise HTTPException(status_code=404, detail="Nie znaleziono zasobu")


def create_development_session(request: Request) -> str:
    require_local_development(request)
    return create_access_token("development-admin", development=True)


def get_development_admin(request: Request) -> User:
    require_local_development(request)
    # Konto istnieje wyłącznie w pamięci, nie tworzymy go w bazie.
    return User(
        id=0, username="Administrator DEV", role="admin", is_active=True,
        hashed_password="", created_at=datetime.now(UTC),
    )
