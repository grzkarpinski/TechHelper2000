import asyncio

from sqlalchemy import inspect

from backend.database import Base, engine
from backend import models  # noqa: F401


def compare_schema(connection) -> list[str]:
    inspector = inspect(connection)
    expected_tables = set(Base.metadata.tables)
    actual_tables = set(inspector.get_table_names())
    actual_tables.discard("alembic_version")
    errors: list[str] = []

    missing_tables = expected_tables - actual_tables
    unexpected_tables = actual_tables - expected_tables
    if missing_tables:
        errors.append(f"Brakujace tabele: {', '.join(sorted(missing_tables))}")
    if unexpected_tables:
        errors.append(f"Nieoczekiwane tabele: {', '.join(sorted(unexpected_tables))}")

    for table_name in expected_tables & actual_tables:
        expected_columns = set(Base.metadata.tables[table_name].columns.keys())
        actual_columns = {column["name"] for column in inspector.get_columns(table_name)}
        missing_columns = expected_columns - actual_columns
        unexpected_columns = actual_columns - expected_columns
        if missing_columns:
            errors.append(
                f"Tabela {table_name} - brakujace kolumny: {', '.join(sorted(missing_columns))}"
            )
        if unexpected_columns:
            errors.append(
                f"Tabela {table_name} - nieoczekiwane kolumny: {', '.join(sorted(unexpected_columns))}"
            )
    return errors


async def check_schema() -> None:
    async with engine.connect() as connection:
        errors = await connection.run_sync(compare_schema)
    if errors:
        raise RuntimeError("Schemat bazy nie jest zgodny:\n- " + "\n- ".join(errors))
    print("Schemat bazy jest zgodny z modelami aplikacji.")


if __name__ == "__main__":
    asyncio.run(check_schema())
