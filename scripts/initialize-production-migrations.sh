#!/bin/sh
set -eu

cd "$(dirname "$0")/.."

echo "Sprawdzanie konfiguracji Docker Compose..."
docker compose config --quiet

echo "Budowanie obrazu backendu z obsluga migracji..."
docker compose build tech-helper-backend

echo "Tworzenie sprawdzonego backupu przed oznaczeniem schematu..."
docker compose run --rm tech-helper-backend python -m backend.backup_database

echo "Kontrola integralnosci aktywnej bazy..."
docker compose run --rm tech-helper-backend python -c \
  "import sqlite3; p='/app/backend/data/machining.db'; c=sqlite3.connect(p); r=c.execute('PRAGMA integrity_check').fetchone()[0]; c.close(); print(r); raise SystemExit(0 if r == 'ok' else 1)"

echo "Porownanie tabel i kolumn z modelami aplikacji..."
docker compose run --rm tech-helper-backend python -m backend.check_schema

echo "Oznaczanie istniejacego schematu jako rewizja bazowa..."
docker compose run --rm tech-helper-backend alembic stamp 0001_existing_schema
docker compose run --rm tech-helper-backend alembic current

echo "Migracje zostaly zainicjalizowane. Dane i tabele nie byly przebudowywane."
