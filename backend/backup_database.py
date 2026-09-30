import argparse
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy.engine import make_url

from backend.database import DATABASE_URL


def get_database_path() -> Path:
    url = make_url(DATABASE_URL)
    if not url.drivername.startswith("sqlite") or not url.database:
        raise RuntimeError("Backup jest obslugiwany tylko dla bazy SQLite")
    if url.database == ":memory:":
        raise RuntimeError("Nie mozna wykonac backupu bazy w pamieci")
    return Path(url.database).resolve()


def verify_database(path: Path) -> None:
    with sqlite3.connect(path) as connection:
        result = connection.execute("PRAGMA integrity_check").fetchone()
    if result is None or result[0] != "ok":
        raise RuntimeError(f"Kontrola integralnosci nie powiodla sie: {result}")


def create_backup(destination: Path | None = None, keep: int = 14) -> Path:
    source = get_database_path()
    if not source.is_file():
        raise FileNotFoundError(f"Nie znaleziono bazy danych: {source}")

    backup_dir = destination or source.parent / "backups"
    backup_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    backup_path = backup_dir / f"machining-{timestamp}.db"

    with sqlite3.connect(source) as source_connection:
        with sqlite3.connect(backup_path) as backup_connection:
            source_connection.backup(backup_connection)

    verify_database(backup_path)
    backups = sorted(backup_dir.glob("machining-*.db"), reverse=True)
    for expired_backup in backups[max(keep, 1) :]:
        expired_backup.unlink()
    return backup_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Tworzy bezpieczny backup bazy SQLite")
    parser.add_argument("--destination", type=Path, help="Katalog docelowy")
    parser.add_argument("--keep", type=int, default=14, help="Liczba zachowanych kopii")
    return parser.parse_args()


if __name__ == "__main__":
    arguments = parse_args()
    created_path = create_backup(arguments.destination, arguments.keep)
    print(f"Utworzono i sprawdzono backup: {created_path}")
