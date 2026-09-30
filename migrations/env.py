from logging.config import fileConfig
from pathlib import Path

from alembic import context
from sqlalchemy import engine_from_config, pool
from sqlalchemy.engine import make_url

from backend import models  # noqa: F401
from backend.database import Base, DATABASE_URL

config = context.config


def get_sync_database_url() -> str:
    url = make_url(DATABASE_URL)
    if url.drivername.startswith("sqlite") and url.database:
        database_path = Path(url.database).resolve().as_posix()
        return f"sqlite+pysqlite:///{database_path}"
    return url.set(drivername=url.drivername.split("+")[0]).render_as_string(hide_password=False)


config.set_main_option("sqlalchemy.url", get_sync_database_url())

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(
        url=config.get_main_option("sqlalchemy.url"),
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata, compare_type=True)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
