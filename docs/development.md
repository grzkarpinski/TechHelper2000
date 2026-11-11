# Lokalne uruchomienie z dostępem administratora

```powershell
powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
```

Skrypt automatycznie loguje frontend jako **Administrator DEV**. Można otwierać
wszystkie kalkulatory, katalog narzędzi i panel użytkowników bez podawania hasła.
Wirtualne konto nie jest zapisywane w bazie. Operacje CRUD korzystają z lokalnej
bazy wskazanej przez `DATABASE_URL` i zapisują w niej zwykłe dane.

Aby sprawdzić standardowe logowanie i role:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-dev.ps1 -NoDevAdmin
```

Przed zmianą trybu zatrzymaj poprzednie serwery. Wylogowanie działa do następnego
przeładowania strony; tryb DEV przy przeładowaniu ponownie otwiera sesję.

Przy ręcznym uruchamianiu ustaw w procesie backendu `APP_ENV=development` oraz
`DEV_ADMIN_ENABLED=true`, a w procesie Vite `VITE_DEV_ADMIN=true`.
Oba serwery uruchamiaj na `127.0.0.1`; frontend domyślnie korzysta z portu 5173.

Backend wydaje podpisany JWT przez `POST /api/auth/development-session`.
Wydanie i każde użycie tego tokenu wymaga włączonych obu ustawień backendu,
lokalnego adresu klienta, lokalnego nagłówka Host i lokalnego Origin, jeśli istnieje.
Żądania bez tokenu nadal podlegają standardowej autoryzacji.

Domyślnie obowiązuje `APP_ENV=production` i `DEV_ADMIN_ENABLED=false`.
Włączenie flagi poza `development` blokuje start backendu.
Docker Compose jawnie wymusza ustawienia produkcyjne. Build produkcyjny
frontendu pomija automatyczne logowanie niezależnie od `VITE_DEV_ADMIN`.
