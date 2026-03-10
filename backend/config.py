import os

from dotenv import load_dotenv

load_dotenv()

REQUIRED_ENV_VARS = ["SECRET_KEY", "DATABASE_URL", "ALLOWED_ORIGINS", "JWT_EXPIRE_HOURS"]


def get_env(name: str, default: str | None = None) -> str:
    value = os.getenv(name, default)
    if value is None or not value.strip():
        raise RuntimeError(f"Brakuje wymaganej zmiennej srodowiskowej: {name}")
    return value


def validate_environment() -> None:
    for variable in REQUIRED_ENV_VARS:
        get_env(variable)

    if len(get_env("SECRET_KEY")) < 32:
        raise RuntimeError("Zmienne SECRET_KEY musi miec co najmniej 32 znaki")


def get_allowed_origins() -> list[str]:
    return [origin.strip() for origin in get_env("ALLOWED_ORIGINS").split(",") if origin.strip()]
