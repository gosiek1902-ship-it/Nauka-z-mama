# Aleksander Kozdra – Uczę się po swojemu

Przyjazna, osobista aplikacja edukacyjna Aleksandra dla ucznia 5 klasy. Działa w nowoczesnej przeglądarce i nie wymaga instalowania bibliotek.

## Uruchomienie

Otwórz `index.html` w przeglądarce. Możesz też uruchomić serwer lokalny z katalogu projektu:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Następnie otwórz <http://localhost:8000>.

## Struktura

- `index.html` — szkielet strony i dostępne zakładki
- `styles.css` — responsywny, przyjazny interfejs
- `src/app.js` — nawigacja, notatki, quiz i zapisywanie postępu
- `src/subjects.js` — katalog przedmiotów i treści lekcji

## Dodawanie tematów

W `src/subjects.js` znajdź przedmiot i dodaj obiekt do jego tablicy `lessons`. Każda lekcja powinna mieć `title`, `summary` i `examples`. Opcjonalnie dodaj `quiz` (pytanie, cztery odpowiedzi, indeks poprawnej odpowiedzi od zera i wyjaśnienie) oraz `cheatFacts` (tablicę krótkich wskazówek). Zakładka Powtórka automatycznie pokaże nowy temat.

Postęp w powtórkach jest przechowywany w pamięci przeglądarki na tym urządzeniu.
