# Machining Helper

Aplikacja webowa dla technologa obrobki skrawaniem z backendem FastAPI i frontendem React.

## Szybki start (Windows)

Uruchom z katalogu glownego projektu jednym poleceniem (tworzy `.venv`, doinstalowuje zaleznosci tylko gdy sie zmienia i odpala backend + frontend w osobnych oknach):

```powershell
powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
```

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
