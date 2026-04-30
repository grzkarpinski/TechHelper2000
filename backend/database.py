from pathlib import Path
import logging

from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from backend.config import get_env, validate_environment

logger = logging.getLogger(__name__)
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DATABASE_URL = "sqlite+aiosqlite:///./data/machining.db"


def normalize_database_url(database_url: str) -> str:
    url = make_url(database_url)
    if not url.drivername.startswith("sqlite"):
        return database_url

    sqlite_path = url.database
    if not sqlite_path or sqlite_path == ":memory:":
        return database_url

    path = Path(sqlite_path)
    if path.is_absolute():
        return database_url

    absolute_path = (PROJECT_ROOT / path).resolve()
    logger.warning(
        "Wykryto relatywny DATABASE_URL dla SQLite (%s). "
        "Zostanie uzyta sciezka absolutna: %s",
        database_url,
        absolute_path,
    )
    return url.set(database=str(absolute_path)).render_as_string(hide_password=False)


DATABASE_URL = normalize_database_url(get_env("DATABASE_URL", DEFAULT_DATABASE_URL))


class Base(DeclarativeBase):
    pass


connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_async_engine(DATABASE_URL, connect_args=connect_args)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


def ensure_data_directory() -> None:
    url = make_url(DATABASE_URL)
    if not url.drivername.startswith("sqlite"):
        return

    sqlite_path = url.database
    if not sqlite_path or sqlite_path == ":memory:":
        return

    Path(sqlite_path).parent.mkdir(parents=True, exist_ok=True)


async def init_db() -> None:
    validate_environment()
    ensure_data_directory()

    from backend import models  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session


if __name__ == "__main__":
    import asyncio

    asyncio.run(init_db())
