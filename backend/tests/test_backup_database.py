import sqlite3
from pathlib import Path

import pytest

from backend import backup_database


def test_backup_creates_verified_copy(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    source = tmp_path / "machining.db"
    with sqlite3.connect(source) as connection:
        connection.execute("CREATE TABLE sample (id INTEGER PRIMARY KEY, value TEXT)")
        connection.execute("INSERT INTO sample (value) VALUES ('dane')")

    monkeypatch.setattr(backup_database, "get_database_path", lambda: source)
    created = backup_database.create_backup(keep=2)

    assert created.is_file()
    with sqlite3.connect(created) as connection:
        assert connection.execute("SELECT value FROM sample").fetchone() == ("dane",)


def test_backup_removes_only_expired_copies(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    source = tmp_path / "machining.db"
    with sqlite3.connect(source) as connection:
        connection.execute("CREATE TABLE sample (id INTEGER PRIMARY KEY)")
    backup_dir = tmp_path / "backups"
    backup_dir.mkdir()
    for index in range(3):
        (backup_dir / f"machining-2025010{index}-000000.db").touch()

    monkeypatch.setattr(backup_database, "get_database_path", lambda: source)
    backup_database.create_backup(backup_dir, keep=2)

    assert len(list(backup_dir.glob("machining-*.db"))) == 2
