from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from backend.config import get_env, validate_environment

DEFAULT_DATABASE_URL = "sqlite+aiosqlite:///./data/machining.db"
DATABASE_URL = get_env("DATABASE_URL", DEFAULT_DATABASE_URL)


class Base(DeclarativeBase):
    pass


connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_async_engine(DATABASE_URL, connect_args=connect_args)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


def ensure_data_directory() -> None:
    if DATABASE_URL.startswith("sqlite") and "///./" in DATABASE_URL:
        relative_path = DATABASE_URL.split("///./", maxsplit=1)[1]
        Path(relative_path).parent.mkdir(parents=True, exist_ok=True)


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
