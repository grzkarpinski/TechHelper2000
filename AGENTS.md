# AGENTS.md — Machining Helper App

## Cel projektu

Aplikacja webowa dla technologa obróbki skrawaniem, dostępna przez przeglądarkę po wdrożeniu na publiczny hosting. Dostęp chroniony uwierzytelnianiem — tylko zalogowani użytkownicy mogą korzystać z aplikacji. Składa się z trzech głównych modułów:
1. **Kalkulatory** — obliczenia parametrów skrawania
2. **Katalog** — baza narzędzi, zestawów parametrów i notatek
3. **Panel admina** — zarządzanie kontami użytkowników (dostępny tylko dla roli `admin`)

---

## Stack technologiczny

| Warstwa      | Technologia                             |
|--------------|-----------------------------------------|
| Backend      | Python 3.13+, FastAPI, Uvicorn          |
| ORM          | SQLAlchemy (async)                      |
| Baza danych  | SQLite (plik `data/machining.db`)       |
| Walidacja    | Pydantic v2                             |
| Frontend     | React 19, Vite, Tailwind CSS            |
| Komunikacja  | REST API (JSON over HTTP)               |
| Autentykacja | JWT (`python-jose`), bcrypt (`passlib`) |
| Konfiguracja | `python-dotenv`, plik `.env`            |
| Dev tools    | Ruff (linter), Pytest, Vitest           |

---

## Struktura katalogów

```
machining-helper/
├── backend/
│   ├── main.py                  # FastAPI app, rejestracja routerów, CORS
│   ├── database.py              # silnik SQLite, sesja async
│   ├── models.py                # modele tabel SQLAlchemy
│   ├── schemas.py               # schematy Pydantic (request/response)
│   ├── dependencies.py          # get_current_user, require_admin — dependency injection
│   ├── create_admin.py          # skrypt do ręcznego tworzenia pierwszego konta admina
│   ├── calculations/
│   │   ├── milling_feed_speed.py    # logika obliczeń frezowania
│   │   └── drilling_feed_speed.py   # logika obliczeń wiercenia
│   ├── routers/
│   │   ├── auth.py                  # login, /me
│   │   ├── admin.py                 # zarządzanie użytkownikami (tylko admin)
│   │   ├── calculators.py           # endpointy kalkulatorów (bezstanowe)
│   │   ├── milling_heads.py         # CRUD głowic frezarskich
│   │   ├── milling_cutters.py       # CRUD frezów
│   │   └── drills.py                # CRUD wierteł
│   └── tests/
│       ├── test_milling_calculator.py
│       └── test_drilling_calculator.py
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js                # base URL + automatyczne dołączanie tokenu JWT
│   │   │   ├── calculators.js           # wywołania API kalkulatorów
│   │   │   ├── millingHeads.js          # wywołania API głowic
│   │   │   ├── millingCutters.js        # wywołania API frezów
│   │   │   └── drills.js                # wywołania API wierteł
│   │   ├── components/
│   │   │   ├── calculators/
│   │   │   │   ├── MillingCalculator.jsx
│   │   │   │   ├── DrillingCalculator.jsx
│   │   │   │   └── CostCalculator.jsx
│   │   │   ├── tools/
│   │   │   │   ├── MillingHeadsTable.jsx
│   │   │   │   ├── MillingCuttersTable.jsx
│   │   │   │   ├── DrillsTable.jsx
│   │   │   │   └── ToolForm.jsx         # współdzielony formularz (tryb add/edit)
│   │   │   └── admin/
│   │   │       └── UsersTable.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── CalculatorsPage.jsx
│   │   │   ├── ToolsPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # globalny stan zalogowanego użytkownika
│   │   └── App.jsx                      # routing, PrivateRoute, AdminRoute
│   ├── package.json
│   └── vite.config.js
├── data/                        # katalog na plik machining.db (gitignore)
├── .env                         # zmienne środowiskowe (gitignore)
├── .env.example                 # szablon zmiennych (commitowany do repo)
├── requirements.txt
└── AGENTS.md                    # ten plik
```

---

## Zasady architektury

### Backend

1. **Każdy router w osobnym pliku** — `auth.py`, `admin.py`, `calculators.py`, `tools.py`, `parameter_sets.py`, `notes.py`. Nie łącz ich w jeden plik.
2. **Kalkulatory są bezstanowe** — endpointy w `calculators.py` przyjmują dane wejściowe i zwracają wynik. Nie zapisują nic do bazy.
3. **Modele SQLAlchemy tylko w `models.py`**, schematy Pydantic tylko w `schemas.py`. Nie mieszaj ich.
4. **Jeden plik bazy** — `data/machining.db`. Ścieżka konfigurowana przez zmienną środowiskową `DATABASE_URL`, z fallbackiem `sqlite+aiosqlite:///./data/machining.db`.
5. **Zawsze używaj async** — sesje bazy danych przez `AsyncSession`, endpointy jako `async def`.
6. **Inicjalizacja bazy danych** — na etapie MVP inicjalizacja odbywa się przez `Base.metadata.create_all()`. Kod modeli musi być jednak czysty i modularny, aby w przyszłości umożliwić łatwe wdrożenie narzędzia Alembic.
6. **CORS** — dozwolone originy czytane ze zmiennej środowiskowej `ALLOWED_ORIGINS`. W dev: `http://localhost:5173`.
7. **Ochrona endpointów przez dependency injection** — wszystkie endpointy poza `/api/auth/login` wymagają `Depends(get_current_user)` z `dependencies.py`. Endpointy admina dodatkowo wymagają `Depends(require_admin)`.
8. **Prefixy routerów:**
   - `/api/auth`
   - `/api/admin`
   - `/api/calculators`
   - `/api/tools/milling-heads`
   - `/api/tools/milling-cutters`
   - `/api/tools/drills`

### Zasady modułowości — zakaz dużych plików

Agent musi aktywnie dbać o to, żeby żaden plik nie rozrósł się ponad miarę. Poniższe limity są twarde — jeśli plik zbliża się do limitu, agent musi go rozdzielić zanim przejdzie dalej.

#### Limity długości plików

| Typ pliku | Maksymalna długość |
|---|---|
| Router FastAPI (`routers/*.py`) | 150 linii |
| Plik obliczeń (`calculations/*.py`) | 100 linii |
| Komponent React (`*.jsx`) | 150 linii |
| `models.py` | 200 linii |
| `schemas.py` | 200 linii |
| Jakikolwiek inny plik | 200 linii |

#### Zasady podziału — backend

- Każdy router zawiera **tylko** definicje endpointów. Logika biznesowa idzie do osobnego pliku (np. `calculations/` lub `services/`).
- Jeśli `schemas.py` rośnie za duży, dziel go na pliki per moduł: `schemas_tools.py`, `schemas_calculators.py` itp.
- Jeśli `models.py` rośnie za duży, dziel na pliki per moduł i importuj wszystko w `models/__init__.py`.

#### Zasady podziału — frontend

- Jeden komponent = jeden plik. Nigdy nie umieszczaj dwóch niezależnych komponentów w jednym pliku `.jsx`.
- Jeśli komponent przekracza limit, wydziel podkomponenty do osobnych plików w tym samym katalogu, np. `MillingHeadsTable.jsx` → `MillingHeadsTable.jsx` + `MillingHeadForm.jsx` + `MillingHeadRow.jsx`.
- Logika filtrowania, sortowania i walidacji wydzielona do hooków (`src/hooks/`) jeśli jest używana w więcej niż jednym miejscu.
- Stałe i konfiguracja (np. kolumny tabel, słowniki) w osobnych plikach `src/constants/`.

#### Czego agent NIE powinien robić (modułowość)

- ❌ Nie umieszczaj logiki biznesowej w routerach — tylko definicje endpointów.
- ❌ Nie twórz komponentów „bóg" obsługujących formularz, tabelę i modal jednocześnie.
- ❌ Nie kopiuj tego samego kodu między plikami — wydziel do wspólnej funkcji lub hooka.
- ❌ Nie dodawaj nowych funkcji do istniejącego pliku jeśli zbliża się do limitu — najpierw podziel.

### Frontend w katalogu `src/api/`** — komponenty nie używają `fetch` bezpośrednio.
2. **Base URL API** — zdefiniowany raz w `src/api/client.js`. Plik automatycznie dołącza token JWT z `localStorage` do każdego żądania w nagłówku `Authorization: Bearer`.
3. **Globalny stan auth w `AuthContext.jsx`** — przechowuje dane zalogowanego użytkownika i token. Nie odczytuj tokenu z `localStorage` bezpośrednio w komponentach.
4. **Chronione trasy** — `App.jsx` implementuje `PrivateRoute` (redirect do `/login` gdy brak tokenu) i `AdminRoute` (redirect gdy rola != `admin`). Każda strona poza `/login` jest opakowana w `PrivateRoute`.
5. **Tailwind CSS** — wyłącznie utility classes. Bez osobnych plików `.css` dla komponentów.

---

## Wytyczne UI / UX

### Biblioteka komponentów

Używaj **shadcn/ui** jako głównej biblioteki komponentów. Instalacja przez CLI (`npx shadcn@latest add ...`). Komponenty shadcn/ui mają pierwszeństwo przed pisaniem własnych od zera.

Komponenty shadcn/ui do zainstalowania na starcie:
`button`, `input`, `label`, `card`, `table`, `dialog`, `select`, `badge`, `separator`, `tooltip`, `form`

### Motyw i kolory

- **Tryb**: dark mode w pierwszej wersji. Light mode nie jest implementowany teraz, ale kod musi być na to przygotowany — używaj wyłącznie zmiennych CSS z shadcn/ui (`bg-background`, `text-foreground`, `bg-card` itp.), a nie hardkodowanych klas jak `bg-slate-900`. Dzięki temu przejście na light mode w przyszłości wymagać będzie tylko zmiany motywu, nie przepisywania komponentów.
- **Klasa bazowa**: `dark` na elemencie `<html>`, `bg-background text-foreground` na `<body>`.
- **Paleta akcentów**: niebieski (`blue-500` / `blue-600`) jako główny kolor akcji (przyciski CTA, aktywne linki nawigacji, focus ring).
- **Kolory pomocnicze**:
  - Sukces / wartość obliczona: `green-400`
  - Ostrzeżenie / walidacja: `yellow-400`
  - Błąd / usuń: `red-500`
  - Tekst drugorzędny: `slate-400`

### Typografia

- Font: **Inter** (Google Fonts) — jedyna dozwolona rodzina fontów.
- Nagłówki stron: `text-2xl font-semibold`
- Nagłówki sekcji / kart: `text-lg font-medium`
- Etykiety pól formularza: `text-sm font-medium text-slate-300`
- Tekst pomocniczy / placeholder: `text-sm text-slate-400`

### Layout

- **Sidebar nawigacja** po lewej stronie — stała szerokość `w-64`, widoczna na każdej podstronie.
- **Obszar roboczy** po prawej: `flex-1 p-6 overflow-auto`.
- Sidebar zawiera sekcje: *Kalkulatory* (frezowanie, wiercenie, koszt obróbki) i *Baza narzędzi* (głowice, frezy, wiertła). Link do panelu admina widoczny tylko dla roli `admin`.
- Strona `/login` — pełny ekran bez sidebara, formularz wyśrodkowany.

### Zakaz nakładania się elementów UI

Elementy interfejsu nigdy nie mogą na siebie nachodzić. Agent musi przestrzegać:

- **Sidebar i treść** — obszar roboczy zawsze zaczyna się za sidebarem. Layout główny: `flex h-screen overflow-hidden`. Sidebar: `w-64 flex-shrink-0`. Obszar roboczy: `flex-1 overflow-auto` — nigdy `overflow-visible` na kontenerze strony.
- **Modale i dialogi** — zawsze renderowane przez `<Dialog>` z shadcn/ui (Portal do `<body>`). Nigdy pozycjonowane przez `absolute` wewnątrz kontenera z `overflow:hidden`.
- **Dropdowny i tooltips** — używaj komponentów shadcn/ui (`<Select>`, `<Tooltip>`), które automatycznie obsługują Portal i z-index.
- **Powiadomienia / toasty** — używaj `sonner` lub `<Toast>` z shadcn/ui, renderowane w dedykowanym `<Toaster>` na poziomie `App.jsx`.
- **Tabele z wieloma kolumnami** — gdy kolumny nie mieszczą się w obszarze, stosuj `overflow-x-auto` na kontenerze tabeli, nigdy nie pozwalaj na wychodzenie poza viewport.
- **Formularze w kartach** — karty mają stały padding, pola formularza nigdy nie wychodzą poza krawędź karty. Przyciski akcji zawsze wewnątrz karty, wyrównane do dołu lub do prawej.
- **Z-index** — używaj wyłącznie wartości z systemu shadcn/ui. Nie ustawiaj własnych `z-index` bez wyraźnej potrzeby.



- Każda podstrona osadzona w `<Card>` z shadcn/ui lub ekwiwalencie: `rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-lg`.
- Formularze kalkulatorów i wyniki w osobnych kartach obok siebie (layout `grid grid-cols-2 gap-6`) na szerokich ekranach.
- Tabele narzędzi zajmują pełną szerokość obszaru roboczego.

### Tabele

- Używaj komponentu `<Table>` z shadcn/ui.
- Nagłówki kolumn klikalnie sortowalne — ikona strzałki (`↑` / `↓`) przy aktywnej kolumnie.
- Wiersze z hover: `hover:bg-slate-800/50`.
- Przyciski akcji (Edytuj / Usuń) w ostatniej kolumnie, wyrównane do prawej, widoczne zawsze (nie tylko na hover).

### Formularze

- Używaj `react-hook-form` + `zod` do walidacji — shadcn/ui `<Form>` jest na tym zbudowany.
- Pola wymagane oznaczone gwiazdką `*` przy etykiecie.
- Komunikaty błędów walidacji pod polem: `text-sm text-red-400`.
- Przyciski submit: wariant `default` (niebieski). Przyciski anulowania / reset: wariant `outline`.

### Nawigacja i stan aktywny

- Aktywny link w sidebarze: `bg-slate-800 text-white` z lewym obramowaniem `border-l-2 border-blue-500`.
- Nieaktywny link: `text-slate-400 hover:text-white hover:bg-slate-800/50`.

### Czego agent NIE powinien robić (UI)

- ❌ Nie implementuj light mode teraz — ale używaj zmiennych CSS shadcn/ui, nie hardkodowanych kolorów.
- ❌ Nie używaj inline styles (`style={{}}`).
- ❌ Nie twórz własnych komponentów Button, Input, Modal jeśli istnieje odpowiednik w shadcn/ui.
- ❌ Nie używaj innych bibliotek komponentów (MUI, Ant Design, Chakra UI).
- ❌ Nie stosuj animacji wejścia na tabelach z danymi — spowalniają pracę.

---



### Uwierzytelnianie JWT

- Token JWT ważny **8 godzin**, podpisany kluczem `SECRET_KEY` z `.env`
- Algorytm: `HS256`
- Token przechowywany w `localStorage` po stronie frontendu
- Każde żądanie do API (poza `/api/auth/login`) musi zawierać nagłówek `Authorization: Bearer <token>`
- Po wygaśnięciu tokenu frontend przekierowuje na `/login`

### Zmienne środowiskowe (plik `.env`)

```
SECRET_KEY=<losowy ciąg min. 32 znaki>
DATABASE_URL=sqlite+aiosqlite:///./data/machining.db
ALLOWED_ORIGINS=http://localhost:5173
JWT_EXPIRE_HOURS=8
```

Plik `.env` jest w `.gitignore`. Do repozytorium trafia tylko `.env.example` z pustymi wartościami.

### Zarządzanie użytkownikami

- Brak publicznej rejestracji — konta tworzy wyłącznie admin przez panel
- Pierwsze konto admina tworzone ręcznie skryptem `backend/create_admin.py` przy pierwszym wdrożeniu
- Przy starcie aplikacji sprawdź czy istnieje choć jeden admin — jeśli nie, zaloguj ostrzeżenie
- Hasła przechowywane wyłącznie jako hash bcrypt — nigdy plaintext
- Pole `hashed_password` nigdy nie pojawia się w schematach odpowiedzi Pydantic
- Skrypt `backend/create_admin.py` musi bezwzględnie importować logikę haszowania haseł z tego samego modułu co routery (`passlib`/`bcrypt`) — nigdy nie implementuj własnego haszowania w skrypcie, aby uniknąć niespójności formatów hashów

### Tabela `users`

| Pole            | Typ        | Opis                                     |
|-----------------|------------|------------------------------------------|
| id              | Integer PK | auto                                     |
| username        | String     | unikalny, używany do logowania           |
| hashed_password | String     | hash bcrypt                              |
| role            | String     | `admin` lub `user`                       |
| is_active       | Boolean    | domyślnie `true` — admin może zablokować |
| created_at      | DateTime   | auto                                     |

### Endpointy auth

| Metoda | Ścieżka           | Opis                            | Dostęp     |
|--------|-------------------|---------------------------------|------------|
| POST   | `/api/auth/login` | zwraca token JWT                | publiczny  |
| GET    | `/api/auth/me`    | dane zalogowanego użytkownika   | zalogowany |

### Endpointy panelu admina

| Metoda | Ścieżka                 | Opis                          | Dostęp |
|--------|-------------------------|-------------------------------|--------|
| GET    | `/api/admin/users`      | lista wszystkich użytkowników | admin  |
| POST   | `/api/admin/users`      | utwórz nowe konto             | admin  |
| PATCH  | `/api/admin/users/{id}` | zmień rolę lub zablokuj       | admin  |
| DELETE | `/api/admin/users/{id}` | usuń konto                    | admin  |

---

## Funkcjonalność — Kalkulatory

### Zasady wspólne dla wszystkich kalkulatorów

- Logika obliczeń wyłącznie w plikach `backend/calculations/`. Routery tylko przyjmują dane i wywołują funkcje z tych plików.
- Kalkulatory są **bezstanowe** — nie zapisują nic do bazy danych.
- Wszystkie pola numeryczne muszą być dodatnie (walidacja Pydantic: `gt=0`).
- Wyniki obliczeń wyświetlane w tej samej sekcji strony bez przeładowania (stan React `useState`).
- Przycisk **CLEAR** resetuje wszystkie pola formularza i wyniki.

---

### Kalkulator frezowania (`MillingCalculator.jsx`)

**Endpoint:** `POST /api/calculators/milling`
**Plik logiki:** `backend/calculations/milling_feed_speed.py`

#### Parametry wejściowe

| Pole | Opis              | Jednostka |
|------|-------------------|-----------|
| Vc   | Prędkość skrawania | m/min    |
| n    | Obroty wrzeciona  | obr/min   |
| Fz   | Posuw na ząb      | mm/ząb    |
| F    | Posuw stołu       | mm/min    |
| D    | Średnica narzędzia | mm       |
| z    | Liczba ostrzy     | —         |

#### Logika wzajemnego wykluczania pól

- Jeśli użytkownik wpisze `Vc` → pole `n` staje się nieaktywne (i odwrotnie).
- Jeśli użytkownik wpisze `Fz` → pole `F` staje się nieaktywne (i odwrotnie).
- Wykrywanie aktywnych pól po stronie frontendu (React) i backendu (Python).

#### Wzory

```
Vc = (π × D × n) / 1000
n  = (1000 × Vc) / (π × D)
F  = Fz × z × n
Fz = F / (z × n)
```

#### Opcjonalne obliczenie — Objętościowa wydajność skrawania Q

Po obliczeniu podstawowych parametrów użytkownik może dodatkowo podać:

| Pole | Opis                  | Jednostka |
|------|-----------------------|-----------|
| Ap   | Głębokość skrawania   | mm        |
| Ae   | Szerokość skrawania   | mm        |

Wzór:
```
Q = (Ap × Ae × F) / 1000     [cm³/min]
```

Zasady UI:
- Pola `Ap` i `Ae` widoczne zawsze, ale opcjonalne — nie blokują obliczenia podstawowych parametrów.
- Wynik `Q` wyświetlany tylko jeśli podano `Ap`, `Ae` oraz znane jest `F` (wpisane lub obliczone).
- Jeśli którekolwiek z pól `Ap` / `Ae` jest puste — sekcja wyniku `Q` jest ukryta.

---

### Kalkulator wiercenia (`DrillingCalculator.jsx`)

**Endpoint:** `POST /api/calculators/drilling`
**Plik logiki:** `backend/calculations/drilling_feed_speed.py`

#### Parametry wejściowe

| Pole | Opis               | Jednostka |
|------|--------------------|-----------|
| Vc   | Prędkość skrawania | m/min     |
| n    | Obroty wrzeciona   | obr/min   |
| fn   | Posuw na obrót     | mm/obr    |
| F    | Posuw              | mm/min    |
| D    | Średnica wiertła   | mm        |

#### Logika wzajemnego wykluczania pól

- Jeśli użytkownik wpisze `Vc` → pole `n` staje się nieaktywne (i odwrotnie).
- Jeśli użytkownik wpisze `fn` → pole `F` staje się nieaktywne (i odwrotnie).

#### Wzory

```
Vc = (π × D × n) / 1000
n  = (1000 × Vc) / (π × D)
F  = fn × n
fn = F / n
```

---

### Kalkulator kosztu obróbki (`CostCalculator.jsx`)

**Endpoint:** `POST /api/calculators/cost`
**Plik logiki:** wbudowany w router (prosta arytmetyka, bez osobnego pliku)

Endpoint przyjmuje w body listę obiektów (JSON Array), gdzie każdy obiekt reprezentuje jedną operację i zawiera: `group_id` (string), `tpz` (float) oraz `tj` (float). Przykład:

```json
[
  { "group_id": "6", "tpz": 30.0, "tj": 45.0 },
  { "group_id": "4", "tpz": 15.0, "tj": 60.0 }
]
```

#### Parametry wejściowe (dla każdej operacji, max 10)

| Pole  | Opis                             |
|-------|----------------------------------|
| group | Grupa maszyny (dropdown)         |
| Tpz   | Czas przygotowawczo-zakończeniowy (min) |
| Tj    | Czas jednostkowy (min)           |

#### Typ stawki — wybór przez użytkownika

Na górze kalkulatora użytkownik wybiera jeden z trzech trybów (radio button lub segmented control):
- **Stare stawki**
- **Nowe stawki 2026** (produkcja wewnętrzna IM)
- **Usługi zewnętrzne 2026**

Wybrany typ stawki stosowany jest do wszystkich operacji jednocześnie.

#### Stawki godzinowe (zakodowane w backendzie, niedostępne do edycji w UI)

| Grupa | Typ maszyny                    | Stare stawki | Nowe 2026 | Zewnętrzne 2026 |
|-------|--------------------------------|--------------|-----------|-----------------|
| 1     | Frezarki konwencjonalne        | 110          | 140       | 161             |
| 2     | Frezarki konwencjonalne        | 120          | 140       | 161             |
| 17    | Ślusarze                       | 90           | 110       | 150             |
| 4     | Tokarka CNC                    | 120          | 185       | 210             |
| 6     | Frezarka 3-osie                | 140          | 185       | 210             |
| 7     | Soraluce                       | 220          | 310       | 420             |
| 8     | You Ji                         | 180          | 185       | 210             |
| 10    | Frezarko-wytaczarki            | 220          | 410       | 600             |
| 16    | Frezarka bramowa               | 220          | 300       | 400             |
| 18    | Frezarka bramowa duża ZAYER    | 800          | 500       | 700             |
| KJ    | Ramie pomiarowe, laser Tracker | 100          | 150       | 185             |

> Stawki zakodowane w backendzie jako słownik `MACHINE_RATES` w pliku `backend/routers/calculators.py`. Niedostępne do edycji przez UI na etapie MVP.

#### Wzory

```
Koszt_Tpz = (Tpz / 60) × stawka
Koszt_Tj  = (Tj / 60) × stawka
Suma      = Σ (Koszt_Tpz + Koszt_Tj) dla wszystkich operacji
```

#### UI

- Dynamiczne dodawanie/usuwanie wierszy operacji (przyciski „Dodaj operację" / „Usuń").
- Maksymalnie 10 operacji — przycisk „Dodaj" blokuje się po osiągnięciu limitu.
- Suma kosztów aktualizowana na żywo przy każdej zmianie pola (React `useState`).
- Przycisk **CLEAR** resetuje wszystkie operacje do jednej pustej.

---

## Funkcjonalność — Baza narzędzi

### Zasady wspólne dla wszystkich tabel narzędzi

- Pełny CRUD przez UI: dodawanie, podgląd, edycja, usuwanie.
- Usuwanie z potwierdzeniem (modal/dialog).
- Filtrowanie po co najmniej: `średnica_D_mm`, `symbol_narzędzia`, `producent`.
- Wyszukiwanie live — filtrowanie listy przy wpisywaniu (po stronie frontendu, bez dodatkowego żądania API jeśli dane już załadowane).
- Tabela z sortowaniem kolumn (rosnąco/malejąco) po kliknięciu nagłówka.
- Formularz dodawania/edycji w modalu lub osobnym widoku — ta sama decyzja dla wszystkich trzech typów narzędzi.
- Aplikacja jest **desktop only** — brak wymagań responsywności mobilnej.

#### Zasada wymagalności pól w formularzach

**Wszystkie pola z modelu są zawsze widoczne w formularzu** — zarówno wymagane, jak i opcjonalne. Kolumna „Wymagane" w tabelach poniżej oznacza wyłącznie **walidację przy zapisie** (pole nie może być puste), nie decyduje o tym czy pole pojawia się w UI. Agent nie może pomijać żadnego pola w formularzu tylko dlatego, że jest oznaczone jako niewymagane (❌). Pola opcjonalne renderowane są jako zwykłe inputy — użytkownik po prostu może je pozostawić puste.

---

### Głowice frezarskie (`/tools/milling-heads`)

**Router:** `backend/routers/milling_heads.py`
**Endpointy:** `GET/POST /api/tools/milling-heads`, `GET/PUT/DELETE /api/tools/milling-heads/{id}`

#### Model tabeli `milling_heads`

| Pole                    | Typ   | Wymagane | Opis                    |
|-------------------------|-------|----------|-------------------------|
| id                      | int   | auto PK  |                         |
| srednica_D_mm           | float | ✅       | Średnica narzędzia      |
| symbol_narzedzia        | str   | ✅       | Symbol katalogowy       |
| producent               | str   | ❌       | Producent               |
| symbol_plytki           | str   | ❌       | Symbol i gatunek płytki |
| liczba_ostrzy           | int   | ✅       | Liczba ostrzy (z)       |
| material                | str   | ❌       | Obrabiany materiał      |
| posuw_na_zab_min        | float | ❌       | Minimalny fz            |
| posuw_na_zab_max        | float | ❌       | Maksymalny fz           |
| predkosc_skrawania_min  | float | ❌       | Minimalna Vc            |
| predkosc_skrawania_max  | float | ❌       | Maksymalna Vc           |
| obroty                  | float | ❌       | n (obr/min)             |
| posuw                   | float | ❌       | F (mm/min)              |
| glebokosc_skrawania_ap  | float | ❌       | ap (mm)                 |
| uwagi                   | str   | ❌       | Dodatkowe informacje    |

---

### Frezy (`/tools/milling-cutters`)

**Router:** `backend/routers/milling_cutters.py`
**Endpointy:** `GET/POST /api/tools/milling-cutters`, `GET/PUT/DELETE /api/tools/milling-cutters/{id}`

#### Model tabeli `milling_cutters`

| Pole                       | Typ   | Wymagane | Opis                       |
|----------------------------|-------|----------|----------------------------|
| id                         | int   | auto PK  |                            |
| srednica_D_mm              | float | ✅       | Średnica narzędzia         |
| symbol_narzedzia           | str   | ✅       | Symbol katalogowy          |
| producent                  | str   | ❌       | Producent                  |
| liczba_ostrzy              | int   | ✅       | Liczba ostrzy (z)          |
| material                   | str   | ❌       | Obrabiany materiał         |
| posuw_na_zab_min           | float | ❌       | Minimalny fz               |
| posuw_na_zab_max           | float | ❌       | Maksymalny fz              |
| predkosc_skrawania_min     | float | ❌       | Minimalna Vc               |
| predkosc_skrawania_max     | float | ❌       | Maksymalna Vc              |
| obroty                     | float | ❌       | n (obr/min)                |
| posuw                      | float | ❌       | F (mm/min)                 |
| glebokosc_skrawania_ap     | float | ❌       | ap (mm)                    |
| szerokosc_skrawania_ae_pct | float | ❌       | ae (% średnicy D)          |
| uwagi                      | str   | ❌       | Dodatkowe informacje       |

---

### Wiertła (`/tools/drills`)

**Router:** `backend/routers/drills.py`
**Endpointy:** `GET/POST /api/tools/drills`, `GET/PUT/DELETE /api/tools/drills/{id}`

#### Model tabeli `drills`

| Pole                   | Typ   | Wymagane | Opis                              |
|------------------------|-------|----------|-----------------------------------|
| id                     | int   | auto PK  |                                   |
| srednica_D_mm          | float | ✅       | Średnica wiertła                  |
| symbol_narzedzia       | str   | ✅       | Symbol katalogowy                 |
| producent              | str   | ❌       | Producent                         |
| rodzaj_wiertla         | str   | ✅       | `HSS` / `VHM` / `1_plytka` / `2_plytki` |
| symbol_plytki          | str   | ❌       | Symbol płytki (opcjonalnie)       |
| dlugosc_robocza_mm     | float | ❌       | Długość robocza                   |
| liczba_ostrzy          | int   | ❌       | Liczba ostrzy                     |
| posuw_fn_min           | float | ❌       | Minimalny fn (mm/obr)             |
| posuw_fn_max           | float | ❌       | Maksymalny fn (mm/obr)            |
| predkosc_skrawania_min | float | ❌       | Minimalna Vc                      |
| predkosc_skrawania_max | float | ❌       | Maksymalna Vc                     |
| obroty                 | float | ❌       | n (obr/min)                       |
| posuw                  | float | ❌       | F (mm/min)                        |
| uwagi                  | str   | ❌       | Dodatkowe informacje              |

Dodatkowe filtry dla wierteł: `rodzaj_wiertla`.

---

## Routing (React Router)

| Ścieżka                    | Komponent              | Dostęp     |
|----------------------------|------------------------|------------|
| `/login`                   | `LoginPage`            | publiczny  |
| `/calculators/milling`     | `MillingCalculator`    | zalogowany |
| `/calculators/drilling`    | `DrillingCalculator`   | zalogowany |
| `/calculators/cost`        | `CostCalculator`       | zalogowany |
| `/tools/milling-heads`     | `MillingHeadsTable`    | zalogowany |
| `/tools/milling-cutters`   | `MillingCuttersTable`  | zalogowany |
| `/tools/drills`            | `DrillsTable`          | zalogowany |
| `/admin`                   | `AdminPage`            | admin      |

---

## Konwencje nazewnictwa i komentarzy

### Język

- **Kod** (zmienne, funkcje, klasy, nazwy plików) — **angielski**
- **Komentarze w kodzie** — **polski**
- **Komunikaty w UI** (etykiety, przyciski, placeholdery, błędy walidacji) — **polski**
- **Nazwy endpointów REST** — angielski, kebab-case, liczba mnoga: `/api/tools/milling-heads`

### Python

| Element | Konwencja | Przykład |
|---|---|---|
| Zmienne i funkcje | snake_case | `calculate_cutting_speed` |
| Klasy | PascalCase | `MillingHeadSchema` |
| Stałe | UPPER_SNAKE_CASE | `MACHINE_RATES` |
| Pliki | snake_case | `milling_feed_speed.py` |
| Komentarz blokowy | `# Po polsku` | `# Oblicz prędkość skrawania` |

### React / JavaScript

| Element | Konwencja | Przykład |
|---|---|---|
| Zmienne i funkcje | camelCase | `handleSubmit`, `toolData` |
| Komponenty | PascalCase | `MillingCalculator` |
| Pliki komponentów | PascalCase + `.jsx` | `MillingCalculator.jsx` |
| Pliki pomocnicze | camelCase + `.js` | `calculators.js` |
| Stałe globalne | UPPER_SNAKE_CASE | `API_BASE` |

### Nazwy tabel i kolumn w bazie danych

- Tabele: snake_case, liczba mnoga angielska: `milling_heads`, `drills`, `users`
- Kolumny: snake_case, wyłącznie ASCII (bez polskich znaków): `srednica_D_mm`, `symbol_narzedzia`

---

## Zasady obsługi błędów

### Backend

- Każdy endpoint zwraca błędy jako JSON: `{ "detail": "Opis błędu po polsku" }`
- Kody HTTP: `400` dla błędów walidacji, `401` dla braku autoryzacji, `403` dla braku uprawnień, `404` gdy zasób nie istnieje, `500` dla nieoczekiwanych błędów serwera
- Nieoczekiwane wyjątki logowane przez `logging` (nie `print`) z poziomem `ERROR`
- Kalkulatory zwracają `400` z opisem gdy dane wejściowe są niewystarczające do obliczenia (np. brak wymaganych pól)

### Frontend — zasady ogólne

- Każde wywołanie API opakowane w `try/catch`
- Błędy nigdy nie są cicho połykane — zawsze widoczna informacja zwrotna dla użytkownika
- Używaj `sonner` (toast) do wyświetlania błędów i potwierdzeń operacji CRUD
- Podczas ładowania danych wyświetlaj stan ładowania (spinner lub skeleton) — nigdy pusta przestrzeń

### Frontend — komunikaty dla użytkownika

| Sytuacja | Zachowanie |
|---|---|
| Błąd sieci / serwer niedostępny | Toast: „Błąd połączenia z serwerem" |
| Błąd walidacji formularza (frontend) | Komunikat pod polem, nie toast |
| Błąd walidacji (odpowiedź 400 z API) | Toast z treścią `detail` z odpowiedzi |
| Brak autoryzacji (401) | Redirect do `/login` |
| Brak uprawnień (403) | Toast: „Brak uprawnień do tej operacji" |
| Zasób nie znaleziony (404) | Toast: „Nie znaleziono zasobu" |
| Sukces dodania / edycji | Toast: „Zapisano pomyślnie" |
| Sukces usunięcia | Toast: „Usunięto pomyślnie" |

### Frontend — obsługa wygaśnięcia tokenu JWT

- `client.js` przechwytuje każdą odpowiedź `401` i wywołuje `logout()` z `AuthContext`, po czym przekierowuje na `/login`
- Nie wyświetlaj komunikatu błędu przy automatycznym wylogowaniu — strona logowania wystarczy

---

## Instrukcja pierwszego uruchomienia

Agent musi wygenerować plik `README.md` w katalogu głównym projektu zawierający poniższe kroki.

### Wymagania systemowe

- Python 3.13+
- Node.js 18+
- Git

### Krok 1 — Klonowanie i konfiguracja środowiska

```bash
git clone <url-repozytorium>
cd machining-helper

# Backend — środowisko wirtualne
python -m venv .venv
source .venv/bin/activate        # Linux/macOS
.venv\Scripts\activate           # Windows

pip install -r requirements.txt

# Skopiuj i uzupełnij zmienne środowiskowe
cp .env.example .env
# Edytuj .env — wpisz SECRET_KEY (min. 32 losowe znaki)
```

### Krok 2 — Inicjalizacja bazy danych

```bash
# Tworzy plik data/machining.db i wszystkie tabele
python -m backend.database
```

### Krok 3 — Utworzenie pierwszego konta admina

```bash
# Skrypt interaktywny — pyta o login i hasło
python backend/create_admin.py
```

### Krok 4 — Uruchomienie backendu

```bash
uvicorn backend.main:app --reload --port 8000
# API dostępne pod: http://localhost:8000
# Dokumentacja Swagger: http://localhost:8000/docs
```

### Krok 5 — Uruchomienie frontendu

```bash
cd frontend
npm install
npm run dev
# Aplikacja dostępna pod: http://localhost:5173
```


---

## Plan implementacji

Agent implementuje projekt fazami. **Po zakończeniu każdej fazy agent zatrzymuje się, raportuje co zostało zrobione i czeka na potwierdzenie użytkownika przed przejściem do kolejnej fazy.** Nie wolno rozpoczynać następnej fazy bez wyraźnej zgody.

W ramach każdej fazy agent zawsze zaczyna od backendu (modele → schematy → endpointy → testy), a dopiero potem przechodzi do frontendu.

### Status implementacji

- Aktualny stan na `2026-03-12`: **Faza 2 zakonczona**
- Zrealizowane: kalkulatory backend (`milling_feed_speed.py`, `drilling_feed_speed.py`, `routers/calculators.py`), schematy kalkulatorow w `schemas.py`, testy `test_milling_calculator.py` i `test_drilling_calculator.py`, frontendowe komponenty `MillingCalculator`, `DrillingCalculator`, `CostCalculator`, klient API `src/api/calculators.js`, podpiecie tras kalkulatorow w `App.jsx`, rozbicie wyniku kosztu na osobne podsumowania `Tpz` i `Tj`
- Zweryfikowane: `pytest backend/tests/test_milling_calculator.py backend/tests/test_drilling_calculator.py -v` (8/8 PASS), `npm run build` (PASS), frontend build po zmianie widoku kosztu (PASS)
- Kolejny krok na nastepna sesje: **Faza 3 — Baza narzedzi**
- Przed dalsza praca upewnij sie, ze istnieje pierwsze konto admina utworzone przez `backend/create_admin.py`

---

### Faza 1 — Fundament i autoryzacja

**Cel:** działająca aplikacja z logowaniem, do której można się zalogować i nawigować między pustymi podstronami.

Kolejność:
1. Inicjalizacja struktury katalogów zgodnie z sekcją „Struktura katalogów"
2. `requirements.txt` i `package.json` z wszystkimi zależnościami
3. `.env.example` z pustymi wartościami
4. `backend/database.py` — silnik SQLite, `AsyncSession`
5. `backend/models.py` — tylko tabela `users`
6. `backend/schemas.py` — schematy dla `users` i tokenów JWT
7. `backend/dependencies.py` — `get_current_user`, `require_admin`
8. `backend/routers/auth.py` — `POST /api/auth/login`, `GET /api/auth/me`
9. `backend/create_admin.py` — interaktywny skrypt tworzący pierwsze konto admina
10. `backend/main.py` — rejestracja routerów, CORS
11. `frontend` — konfiguracja Vite, Tailwind, shadcn/ui (dark mode)
12. `src/api/client.js` — base URL, automatyczne dołączanie tokenu JWT, obsługa 401
13. `src/context/AuthContext.jsx` — stan zalogowanego użytkownika
14. `src/App.jsx` — routing, `PrivateRoute`, `AdminRoute`
15. `LoginPage.jsx` — formularz logowania
16. Sidebar z nawigacją i pustymi podstronami (placeholdery dla wszystkich modułów)
17. `README.md` z instrukcją pierwszego uruchomienia

**Warunek ukończenia:** można uruchomić aplikację, zalogować się kontem admina i nawigować po pustych podstronach.

---

### Faza 2 — Kalkulatory

**Cel:** działające kalkulatory frezowania, wiercenia i kosztu obróbki.

Kolejność:
1. `backend/calculations/milling_feed_speed.py` — funkcje obliczeniowe
2. `backend/calculations/drilling_feed_speed.py` — funkcje obliczeniowe
3. `backend/schemas.py` — schematy wejścia/wyjścia dla kalkulatorów
4. `backend/routers/calculators.py` — endpointy `POST /api/calculators/milling`, `/drilling`, `/cost`
5. `backend/tests/test_milling_calculator.py` — testy jednostkowe wzorów
6. `backend/tests/test_drilling_calculator.py` — testy jednostkowe wzorów
7. `src/api/calculators.js` — wywołania API
8. `MillingCalculator.jsx` — komponent z logiką wykluczania pól
9. `DrillingCalculator.jsx` — komponent z logiką wykluczania pól
10. `CostCalculator.jsx` — dynamiczne wiersze operacji, wybór typu stawki
11. Podpięcie komponentów do `CalculatorsPage.jsx`

**Warunek ukończenia:** wszystkie trzy kalkulatory liczą poprawnie, testy przechodzą, błędy walidacji są widoczne w UI.

---

### Faza 3 — Baza narzędzi

**Cel:** pełny CRUD dla głowic frezarskich, frezów i wierteł.

Kolejność:
1. `backend/models.py` — dodanie tabel `milling_heads`, `milling_cutters`, `drills`
2. `backend/schemas.py` — schematy dla wszystkich trzech typów narzędzi
3. `backend/routers/milling_heads.py` — pełny CRUD
4. `backend/routers/milling_cutters.py` — pełny CRUD
5. `backend/routers/drills.py` — pełny CRUD
6. Rejestracja nowych routerów w `backend/main.py`
7. `src/api/millingHeads.js`, `millingCutters.js`, `drills.js`
8. `MillingHeadsTable.jsx` — tabela z sortowaniem, filtrowaniem, CRUD
9. `MillingCuttersTable.jsx` — tabela z sortowaniem, filtrowaniem, CRUD
10. `DrillsTable.jsx` — tabela z sortowaniem, filtrowaniem, CRUD
11. `ToolForm.jsx` — współdzielony formularz (tryb add/edit) dla wszystkich typów
12. Podpięcie komponentów do `ToolsPage.jsx`

**Warunek ukończenia:** można dodawać, edytować, usuwać i filtrować narzędzia wszystkich trzech typów. Wszystkie pola formularza są widoczne niezależnie od wymagalności.

---

### Faza 4 — Panel admina

**Cel:** zarządzanie kontami użytkowników dostępne tylko dla roli `admin`.

Kolejność:
1. `backend/routers/admin.py` — pełny CRUD użytkowników
2. Rejestracja routera w `backend/main.py`
3. `src/api/admin.js`
4. `UsersTable.jsx` — lista użytkowników z akcjami (dodaj, zablokuj, zmień rolę, usuń)
5. Podpięcie do `AdminPage.jsx`

**Warunek ukończenia:** admin może tworzyć konta, blokować użytkowników i zmieniać role. Strona `/admin` niedostępna dla roli `user`.


---

## Zakres MVP

### Co jest w MVP (implementuj teraz)

- Logowanie / wylogowanie (JWT)
- Panel admina — zarządzanie kontami użytkowników
- Kalkulator frezowania
- Kalkulator wiercenia
- Kalkulator kosztu obróbki (z wyborem typu stawki)
- Baza narzędzi — głowice frezarskie, frezy, wiertła (pełny CRUD)
- Dark mode

### Czego NIE ma w MVP (nie implementuj)

- ❌ Edycja stawek godzinowych przez UI — stawki są zakodowane w backendzie
- ❌ Light mode / przełącznik motywu
- ❌ Responsywność mobilna — aplikacja desktop only
- ❌ Eksport danych (PDF, Excel, CSV)
- ❌ Historia obliczeń / zapisywanie wyników kalkulatorów
- ❌ Importowanie narzędzi z pliku
- ❌ Powiadomienia email
- ❌ Wielojęzyczność (i18n)
- ❌ Jakiekolwiek integracje z zewnętrznymi systemami

### Zaplanowane na przyszłość (nie blokuj, ale nie implementuj)

- Wdrożenie na publiczny hosting (platforma TBD)
- Opcjonalna migracja bazy na PostgreSQL
- Light mode
- Eksport danych
- Dodatkowe typy narzędzi i kalkulatorów

---

## Przygotowanie do wdrożenia

Kod musi być napisany tak, żeby dało się go wdrożyć na dowolnym hostingu bez przepisywania. Agent musi przestrzegać poniższych zasad od pierwszej linii kodu.

### Zmienne środowiskowe

- **Żadnych hardkodowanych wartości** zależnych od środowiska — wszystko przez `.env`
- Dotyczy to: `SECRET_KEY`, `DATABASE_URL`, `ALLOWED_ORIGINS`, portów, ścieżek do plików
- Backend przy starcie waliduje obecność wymaganych zmiennych i rzuca czytelny błąd jeśli brakuje którejś

### Ścieżki do plików

- Ścieżka do `machining.db` zawsze względna i konfigurowana przez `DATABASE_URL`
- Nie używaj ścieżek bezwzględnych (`C:\...`, `/home/user/...`) nigdzie w kodzie

### Backend — gotowość produkcyjna

- `uvicorn` uruchamiany bez flagi `--reload` w produkcji — flaga tylko w dev
- Aplikacja nasłuchuje na porcie z zmiennej środowiskowej `PORT`, z fallbackiem `8000`: `port = int(os.getenv("PORT", 8000))`
- CORS `ALLOWED_ORIGINS` musi obsługiwać wiele origins (lista rozdzielona przecinkiem w `.env`)

### Frontend — gotowość produkcyjna

- `API_BASE` w `client.js` czytany ze zmiennej środowiskowej Vite: `import.meta.env.VITE_API_URL`
- Domyślna wartość fallback: `http://localhost:8000`
- `vite.config.js` musi mieć skonfigurowany `build.outDir` — katalog `dist` w `frontend/`

### Plik `Procfile` (opcjonalny, ale wygeneruj)

Agent generuje `Procfile` w katalogu głównym — wymagany przez większość platform hostingowych:

```
web: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

