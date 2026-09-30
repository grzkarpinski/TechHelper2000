#!/bin/sh
set -eu

cd "$(dirname "$0")/.."

echo "Sprawdzanie konfiguracji..."
docker compose config --quiet

echo "Budowanie obrazow..."
docker compose build

echo "Testy backendu w nowym obrazie..."
docker compose run --rm tech-helper-backend python -m pytest -q

echo "Backup aktywnej bazy..."
docker compose run --rm tech-helper-backend python -m backend.backup_database

echo "Migracje bazy..."
docker compose run --rm tech-helper-backend alembic upgrade head

echo "Uruchamianie nowej wersji..."
docker compose up -d

attempt=0
while [ "$attempt" -lt 30 ]; do
  status=$(docker inspect --format '{{.State.Health.Status}}' tech-helper-backend 2>/dev/null || true)
  if [ "$status" = "healthy" ]; then
    docker compose ps
    echo "Wdrozenie zakonczone. Backend jest healthy."
    exit 0
  fi
  attempt=$((attempt + 1))
  sleep 2
done

docker compose logs --tail=100 tech-helper-backend
echo "Backend nie osiagnal stanu healthy." >&2
exit 1
