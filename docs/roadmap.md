# Roadmapa rozwoju Machining Helper

Dokument przechowuje pomysły i planowane kierunki rozwoju aplikacji. Kolejność
realizacji może się zmieniać po analizie zakresu i zależności.

## Planowane

### Tryb jasny interfejsu

**Cel:** umożliwić przełączanie pomiędzy ciemnym i jasnym motywem.

Zakres wstępny:

- przełącznik motywu dostępny w głównym layoucie,
- zapamiętywanie wyboru użytkownika,
- wykorzystanie istniejących zmiennych kolorystycznych shadcn/ui,
- sprawdzenie kontrastu formularzy, tabel, dialogów i komunikatów,
- zachowanie obecnego trybu ciemnego jako jednej z opcji.

**Wpływ na bazę danych:** brak.  
**Szacowana złożoność:** mała/średnia.

### Layout dla ekranów smartfonów

**Cel:** zapewnić czytelne korzystanie z kalkulatorów i pozostałych funkcji na
telefonach.

Zakres wstępny:

- zwijana nawigacja mobilna zamiast stałego sidebara,
- jednokolumnowy układ kalkulatorów na małych ekranach,
- formularze i dialogi mieszczące się w szerokości ekranu,
- wygodne rozmiary przycisków i pól dotykowych,
- kontrolowane przewijanie szerokich tabel,
- testy dla najważniejszych szerokości ekranu.

**Wpływ na bazę danych:** brak.  
**Szacowana złożoność:** średnia.

### Dynamiczny kalkulator frezowania

**Cel:** umożliwić interaktywne dobieranie parametrów obróbki w granicach
zalecanych wartości narzędzia.

Zakres wstępny:

- zakres prędkości skrawania od `Vc min` do `Vc max`,
- zakres posuwu na ząb od `Fz min` do `Fz max`,
- sterowanie parametrami za pomocą suwaków,
- natychmiastowe przeliczanie wyłącznie obrotów `n` i posuwu `F`,
- jednoczesne pokazywanie wartości liczbowej przy suwaku,
- walidacja niepełnych lub nieprawidłowych zakresów,
- możliwość ręcznego podania zakresów,
- możliwość pobrania zakresów zapisanych w katalogu narzędzi,
- działanie wyłącznie poglądowe, bez zapisywania wyników i zmian w bazie,
- zachowanie klasycznego kalkulatora ręcznego.

Do ustalenia przed implementacją:

- sposób wyboru wartości początkowej wewnątrz zakresu.

Kalkulator nie będzie obsługiwał wyboru materiału obrabianego ani zapisywania
wybranych ustawień.

**Wpływ na bazę danych:** brak; dane z katalogu będą wyłącznie odczytywane.  
**Szacowana złożoność:** średnia/duża.

## Duże projekty

### Kalkulatory czasów obróbki

**Cel:** obliczać przewidywany czas wykonania detalu z uwzględnieniem różnych
operacji technologicznych.

To będzie największy dotychczasowy moduł aplikacji i powinien zostać wykonany
etapami.

Proponowane fazy:

1. Analiza domeny i lista obsługiwanych operacji.
2. Definicja danych wejściowych oraz wzorów dla każdej operacji.
3. Projekt modelu procesu technologicznego i zmian bazy danych.
4. Kalkulatory pojedynczych operacji.
5. Budowanie procesu z wielu operacji i sumowanie czasów.
6. Zapisywanie, kopiowanie i edycja przygotowanych procesów.
7. Raport podsumowujący czasy operacji i całego detalu.
8. Testy na rzeczywistych przykładach technologicznych.

Przykładowe grupy operacji do późniejszego doprecyzowania:

- frezowanie,
- wiercenie,
- wytaczanie,
- pogłębianie,
- rozwiercanie,
- inne operacje wykonywane narzędziami wiertarskimi.

Moduł nie będzie obejmował toczenia. Zakres obróbki skrawaniem jest ograniczony
do frezowania oraz operacji wykonywanych narzędziami wiertarskimi.

Do ustalenia przed rozpoczęciem:

- dokładna lista operacji dla pierwszej wersji,
- wymagane parametry i wzory,
- jednostki oraz zasady zaokrąglania,
- sposób uwzględniania liczby sztuk i czasu przygotowawczego,
- powiązanie z katalogiem narzędzi oraz kalkulatorem kosztów,
- zakres zapisywania procesów i uprawnienia użytkowników,
- przykładowe rzeczywiste obliczenia służące jako testy akceptacyjne.

**Wpływ na bazę danych:** duży; prawdopodobnie nowe tabele procesów, operacji i
parametrów. Wszystkie zmiany będą wdrażane przez Alembic po wykonaniu backupu.  
**Szacowana złożoność:** bardzo duża.

## Sugerowana kolejność

1. Tryb jasny.
2. Layout mobilny.
3. Dynamiczny kalkulator frezowania.
4. Analiza i projekt kalkulatorów czasów obróbki.
5. Etapowa implementacja kalkulatorów czasów.

Tryb jasny i layout mobilny można realizować bez zmian bazy. Dynamiczny
kalkulator pozwoli wypracować wzorzec interaktywnych obliczeń przed rozpoczęciem
większego modułu czasów obróbki.

## W realizacji

Brak.

## Zrealizowane

- mechanizm bezpiecznych backupów produkcyjnej bazy SQLite,
- kontrolowane migracje Alembic,
- testy integracyjne backendu i podstawowe testy frontendu,
- bezpieczny skrypt wdrożeniowy.

## Dług techniczny i usprawnienia

- dalsze zwiększanie pokrycia testami interfejsu,
- podział produkcyjnego bundla JavaScript,
- aktualizacja danych Browserslist,
- przegląd zależności zgłaszanych przez `npm audit`.
