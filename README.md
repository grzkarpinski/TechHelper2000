# Machining Helper

Aplikacja webowa dla technologa obrobki skrawaniem z backendem FastAPI i frontendem React.

## Szybki start (Windows)

Uruchom z katalogu glownego projektu jednym poleceniem:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
```

Skrypt `start-dev.ps1`:
- tworzy `.venv` tylko gdy nie istnieje,
- reinstaluje backend dependencies tylko po zmianie `requirements.txt`,
- reinstaluje frontend dependencies tylko po zmianie `package-lock.json` (albo `package.json`, gdy locka brak),
- uruchamia backend i frontend w osobnych oknach PowerShell,
- sprawdza `http://127.0.0.1:8000/health` i wypisuje adresy URL.

## Wymagania systemowe

- Python 3.13+
- Node.js 18+
- Git

## Krok 1 - Klonowanie i konfiguracja srodowiska

```bash
git clone <url-repozytorium>
cd machining-helper

python -m venv .venv
source .venv/bin/activate
.venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
```

Uzupelnij `SECRET_KEY` w pliku `.env`.

Opcjonalnie dla frontendu utworz `frontend/.env` na podstawie `frontend/.env.example`.

## Krok 2 - Inicjalizacja bazy danych

```bash
python -m backend.database
```

## Krok 3 - Utworzenie pierwszego konta admina

```bash
.venv\Scripts\python.exe backend/create_admin.py
```

## Krok 4 - Uruchomienie backendu

```bash
uvicorn backend.main:app --reload --port 8000
```

API: http://localhost:8000
Swagger: http://localhost:8000/docs

## Krok 5 - Uruchomienie frontendu

```bash
cd frontend
npm install
npm run dev
```

Aplikacja: http://localhost:5173

## Manualny start DEV (fallback)

Jesli nie korzystasz ze skryptu `start-dev.ps1`, uruchom backend i frontend recznie (jak powyzej, w 2 terminalach).

## Uruchomienie w Docker (backend + frontend)

W repo sa gotowe pliki:
- `Dockerfile.backend`
- `Dockerfile.frontend`
- `docker-compose.yml`

### 1. Wymagania

- Docker Engine + Docker Compose plugin

### 2. Konfiguracja `.env`

Upewnij sie, ze w glownym `.env` masz co najmniej:
- `SECRET_KEY` (minimum 32 znaki),
- `JWT_EXPIRE_HOURS=8`.

W kontenerze backend nadpisuje:
- `DATABASE_URL=sqlite+aiosqlite:////app/data/machining.db` (SQLite w volume),
- `PORT=8000`.

### 3. CORS dla Dockera

Domyslnie `docker-compose.yml` ustawia:
- `DOCKER_ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080`

Na produkcji (np. domena przez Cloudflare) ustaw przed startem:

```bash
export DOCKER_ALLOWED_ORIGINS="https://twoja-domena.pl,https://www.twoja-domena.pl"
```

PowerShell:

```powershell
$env:DOCKER_ALLOWED_ORIGINS = "https://twoja-domena.pl,https://www.twoja-domena.pl"
```

### 4. Build i start

```bash
docker compose up -d --build
```

Aplikacja bedzie dostepna pod:
- `http://localhost:8080`

### 5. Trwalosc bazy SQLite

Baza nie znika po restarcie kontenerow, bo `docker-compose.yml` mapuje:
- `./data:/app/data`

Plik bazy w kontenerze:
- `/app/data/machining.db`

### 6. Limity RAM (VPS 1 GB)

W compose ustawione sa limity:
- backend: `200m`
- frontend: `200m`

### 7. Przydatne komendy

```bash
docker compose logs -f
docker compose ps
docker compose down
```

## Pierwsze wdrozenie na VPS (mikr.us)

Ponizsza procedura zaklada, ze backend serwuje frontend po buildzie (`frontend/dist`) i dziala jako jeden proces `uvicorn`.

### 1. Przygotowanie serwera

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip nodejs npm git
```

### 2. Klonowanie i backend

```bash
git clone <url-repozytorium>
cd machining-helper

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

W `.env` ustaw minimum:
- `SECRET_KEY` (min. 32 znaki),
- `DATABASE_URL` jako absolutna sciezka pliku SQLite, np. `sqlite+aiosqlite:////home/<twoj_uzytkownik>/machining-helper/data/machining.db`,
- `ALLOWED_ORIGINS` jako lista CSV originow, np. `https://twoja-domena.pl,https://www.twoja-domena.pl`,
- `PORT` (port backendu, np. 8000),
- `STATIC_DIR=frontend/dist`.

### 3. Build frontendu

```bash
cp frontend/.env.example frontend/.env
```

Przy Nginx reverse proxy (`/api -> 127.0.0.1:8000`) zostaw `VITE_API_URL` puste,
aby frontend korzystal z same-origin i wywolywal `/api/*` na tej samej domenie.

Jesli frontend i API sa na roznych domenach, ustaw `VITE_API_URL` na pelny URL API
bez koncowego `/`, np. `https://api.twoja-domena.pl`.

```bash
cd frontend
npm install
npm run build
cd ..
```

### 4. Inicjalizacja DB i konto admina

```bash
python -m backend.database
python backend/create_admin.py
```

### 5. Uruchomienie aplikacji (test)

```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

Healthcheck: `http://<host>:8000/health`

### 6. Uruchamianie jako usluga systemd (zalecane)

Przyklad `machining-helper.service`:

```ini
[Unit]
Description=Machining Helper API
After=network.target

[Service]
User=<twoj_uzytkownik>
WorkingDirectory=/home/<twoj_uzytkownik>/machining-helper
EnvironmentFile=/home/<twoj_uzytkownik>/machining-helper/.env
ExecStart=/home/<twoj_uzytkownik>/machining-helper/.venv/bin/uvicorn backend.main:app --host 0.0.0.0 --port ${PORT}
Restart=always

[Install]
WantedBy=multi-user.target
```

### 7. mikr.us i Cloudflare

- mikr.us udostepnia IPv6 i ograniczona liczbe portow po IPv4 (NAT),
- jesli masz domene: ustaw rekord `AAAA` na IPv6 serwera,
- wlacz proxy/SSL po stronie Cloudflare,
- w panelu mikr.us udostepnij port backendu (np. 8000), jesli korzystasz z IPv4 NAT.
