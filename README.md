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
- `src/subjects.js` — katalog przedmiotów i podstawowe treści lekcji
- `src/expanded-content.js` — rozszerzone notatki, ściągi, ćwiczenia i dodatkowe pytania dla lekcji

## Dodawanie tematów

W `src/subjects.js` znajdź przedmiot i dodaj obiekt do jego tablicy `lessons`. Każda lekcja może zawierać `summary`, `examples`, `detailedNotes`, `definitions`, `importantFacts`, `cheatSheet`, `reviewExercises` i `quizQuestions`. Wspierane są także wcześniejsze pola `quiz`, `cheatFacts` i `sections`.

Rozszerzenia istniejących lekcji można dopisać w `src/expanded-content.js`, pod kluczem równym pełnemu tytułowi lekcji. `detailedNotes` to krótkie sekcje z polami `title`, `points`, `example` i `remember`; `definitions` przechowują `term`, `meaning` i opcjonalny `example`; `cheatSheet` zawiera karty z `title`, `items`, `rule`, `example` i `remember`. `reviewExercises` obsługuje typy `choice`, `truefalse`, `blank`, `complete`, `open` i `translate`. `quizQuestions` rozszerza dotychczasowy test; pytanie zamknięte ma cztery odpowiedzi i indeks `correct` od zera, a otwarte listę `acceptedAnswers` oraz krótkie `explanation`.

Postęp w powtórkach jest przechowywany w pamięci przeglądarki na tym urządzeniu.
