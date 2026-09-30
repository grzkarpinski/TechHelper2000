# Bezpieczna obsluga produkcji

## Stala lokalizacja danych

Produkcyjna baza znajduje sie na hoście pod sciezka:

```text
/root/TechHelper2000/backend/data/machining.db
```

Docker montuje katalog `./backend/data` jako `/app/backend/data`. Nie należy zmieniać
tej ścieżki ani używać `docker compose down -v` podczas zwykłego wdrożenia.

## Jednorazowe uruchomienie migracji

Po wdrożeniu wersji zawierającej Alembic wykonaj dokładnie raz:

```bash
cd /root/TechHelper2000
chmod +x scripts/*.sh
./scripts/initialize-production-migrations.sh
```

Skrypt najpierw tworzy i sprawdza backup, a następnie dodaje wyłącznie tabelę
`alembic_version`. Nie tworzy ponownie istniejących tabel aplikacji.

## Backup ręczny

```bash
cd /root/TechHelper2000
docker compose run --rm tech-helper-backend python -m backend.backup_database
```

Kopie trafiają do `backend/data/backups/`. Domyślnie przechowywanych jest 14
najnowszych kopii. Backup korzysta z API SQLite, dlatego może być wykonany przy
działającej aplikacji.

## Backup codzienny

Edytuj harmonogram poleceniem `crontab -e` i dodaj:

```cron
15 2 * * * cd /root/TechHelper2000 && docker compose run --rm tech-helper-backend python -m backend.backup_database >> /var/log/machining-backup.log 2>&1
```

Co najmniej jedną aktualną kopię należy regularnie pobierać poza VPS, np. przez
WinSCP.

## Standardowe wdrożenie

Po jednorazowej inicjalizacji migracji:

```bash
cd /root/TechHelper2000
git pull --ff-only
./scripts/deploy-production.sh
```

Skrypt sprawdza Compose, buduje obrazy, uruchamia testy backendu, wykonuje backup,
stosuje migracje i czeka na zdrowy backend. Nie usuwa bazy ani wolumenu.

## Odtworzenie kopii

Odtworzenie wykonuj tylko podczas przerwy serwisowej:

```bash
cd /root/TechHelper2000
docker compose stop tech-helper-backend
cp backend/data/machining.db backend/data/machining-before-restore.db
cp backend/data/backups/machining-RRRRMMDD-GGMMSS.db backend/data/machining.db
docker compose start tech-helper-backend
docker compose ps
```

Po uruchomieniu sprawdź logowanie i odczyt katalogu narzędzi. Pliku
`machining-before-restore.db` nie usuwaj, dopóki przywrócona wersja nie zostanie
zweryfikowana.
