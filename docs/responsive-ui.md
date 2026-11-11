# Obsługa komputerów i smartfonów

Wymaganie dotyczy wszystkich istniejących i przyszłych funkcji aplikacji.
Oba motywy muszą zachować tę samą funkcjonalność na każdym ekranie.

- Projektuj od najmniejszego ekranu (320 px); rozszerzaj układ przez `sm` i `lg`.
- Od 1024 px pokazuj sidebar; poniżej używaj wspólnego menu mobilnego.
- Formularze i wyniki na smartfonie układaj w jednej kolumnie. Nie ukrywaj pól
  ani akcji tylko z powodu szerokości ekranu.
- Kontenery flex i grid muszą umożliwiać zwężanie (`min-w-0`); długie teksty
  muszą się zawijać. Strona nie może wymagać poziomego przewijania.
- Szerokie tabele przewijaj poziomo we własnym kontenerze `overflow-x-auto`.
- Dialogi renderuj w portalu, z marginesem od krawędzi i ograniczeniem wysokości
  do viewportu. Długi formularz musi się przewijać, także po otwarciu klawiatury.
- Elementy dotykowe powinny mieć przynajmniej 44 px wysokości i szerokości.
  Pola edytowalne na telefonie mają tekst 16 px, aby uniknąć zoomu przy fokusie.
- Korzystaj ze wspólnych komponentów UI i zmiennych motywu, bez inline styles.
- Menu musi zamykać się po wybraniu trasy, klawiszem Escape i przyciskiem
  zamknięcia; zachowaj obsługę fokusu zapewnianą przez Radix Dialog.
- Przed ukończeniem nowego widoku sprawdź 320, 390, 768, 1024 i 1440 px,
  orientację poziomą, długie treści, dostępność akcji i przewijanie dialogów.
- Zmiany nawigacji i interakcji wymagają testów zachowania; sam test klas CSS
  nie zastępuje sprawdzenia układu w przeglądarce.
