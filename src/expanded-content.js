/* Rozszerzenia lekcji. Klucze są pełnymi tytułami, a dotychczasowe dane
   w subjects.js pozostają nienaruszone i są łączone z tym materiałem. */
let nextDifficulty = 0;
const difficulty = () => ['Łatwe', 'Średnie', 'Trudniejsze'][nextDifficulty++ % 3];
const choice = (question, answers, correct, explanation, level = difficulty()) => ({ type: 'choice', question, answers, correct, explanation, promptLanguage: 'pl-PL', explanationLanguage: 'pl-PL', level });
const open = (question, acceptedAnswers, explanation, level = difficulty()) => ({ type: 'open', question, acceptedAnswers, explanation, promptLanguage: 'pl-PL', explanationLanguage: 'pl-PL', level });
const speech = (...parts) => parts.map(([text, lang]) => ({ text, lang }));
const pl = (text) => [text, 'pl-PL'];
const en = (text) => [text, 'en-GB'];
const de = (text) => [text, 'de-DE'];

window.NaukaZMamaExpandedContent = {
  'Ułamki zwykłe': {
    detailedNotes: [
      { title: '1. Co pokazuje ułamek?', points: ['Ułamek opisuje część całości podzielonej na równe części.', 'Kreska ułamkowa oznacza dzielenie.', 'Całość może być figurą, zbiorem przedmiotów albo liczbą.'], example: 'Jeśli pizzę podzielimy na 8 równych kawałków i zjemy 3, zjemy 3/8 pizzy.', remember: 'Części muszą być równe. Ułamek 3/8 oznacza 3 z 8 równych części.' },
      { title: '2. Licznik i mianownik', points: ['Licznik znajduje się nad kreską i mówi, ile części bierzemy.', 'Mianownik znajduje się pod kreską i mówi, na ile równych części podzielono całość.', 'Mianownik nie może być zerem, bo nie można dzielić przez zero.'], example: 'W 5/6 licznik 5 oznacza pięć wziętych części, a mianownik 6 — sześć równych części całości.', remember: 'Na górze jest licznik, na dole mianownik.' },
      { title: '3. Ułamki na rysunku i na osi', points: ['Aby zaznaczyć ułamek na rysunku, podziel całość na tyle równych części, ile wskazuje mianownik.', 'Zamaluj tyle części, ile wskazuje licznik.', 'Na osi liczbowej od 0 do 1 podziel odcinek na tyle równych odcinków, ile wskazuje mianownik.'], example: 'Aby pokazać 2/5, podziel prostokąt na 5 równych pól i zamaluj 2.' },
      { title: '4. Ułamki mniejsze, równe i większe od 1', points: ['Gdy licznik jest mniejszy od mianownika, ułamek jest mniejszy od 1.', 'Gdy licznik jest równy mianownikowi, ułamek jest równy 1.', 'Gdy licznik jest większy od mianownika, ułamek jest większy od 1.'], example: '3/7 < 1, 5/5 = 1, a 8/5 > 1.', remember: 'Porównaj licznik z mianownikiem, jeśli chcesz sprawdzić, czy ułamek jest mniejszy czy większy od 1.' },
      { title: '5. Ułamki równe całości', points: ['Ułamek o liczniku równym mianownikowi ma wartość 1.', 'Kilka całości można zapisać jako ułamek niewłaściwy, np. 2 = 8/4.'], example: 'Dwie tabliczki podzielone każda na 4 kostki to 8/4 tabliczki, czyli 2 całe tabliczki.' },
    ],
    definitions: [
      { term: 'Ułamek zwykły', meaning: 'Zapis części całości w postaci licznika nad mianownikiem.', example: '3/8' },
      { term: 'Licznik', meaning: 'Liczba nad kreską; mówi, ile części bierzemy.', example: 'W 3/8 licznikiem jest 3.' },
      { term: 'Mianownik', meaning: 'Liczba pod kreską; mówi, na ile równych części dzielimy całość.', example: 'W 3/8 mianownikiem jest 8.' },
      { term: 'Ułamek właściwy', meaning: 'Ułamek mniejszy od 1 — licznik jest mniejszy od mianownika.', example: '2/5' },
      { term: 'Ułamek niewłaściwy', meaning: 'Ułamek równy 1 lub większy od 1 — licznik jest równy mianownikowi albo od niego większy.', example: '7/4' },
    ],
    importantFacts: ['Całość dzielimy na równe części.', 'Licznik jest u góry, mianownik na dole.', 'Jeśli licznik jest mniejszy od mianownika, ułamek jest mniejszy od 1.', 'Nie wolno dzielić przez zero.'],
    cheatSheet: [
      { title: 'Budowa ułamka', items: [{ label: 'Licznik', text: 'ile części bierzemy (góra)' }, { label: 'Mianownik', text: 'na ile równych części dzielimy (dół)' }], example: '3/8: bierzemy 3 z 8 równych części.', remember: 'Równe części są bardzo ważne!' },
      { title: 'Ułamek a jedność', items: [{ label: 'licznik < mianownik', text: 'ułamek < 1' }, { label: 'licznik = mianownik', text: 'ułamek = 1' }, { label: 'licznik > mianownik', text: 'ułamek > 1' }], example: '2/7 < 1, 4/4 = 1, 6/4 > 1.' },
      { title: 'Rysunek i oś', rule: 'Podziel całość na tyle równych części, ile pokazuje mianownik. Zaznacz tyle części, ile pokazuje licznik.', example: '3/5: pięć równych pól, trzy zamalowane.' },
      { title: 'Uważaj na to!', rule: 'Mianownik nigdy nie może wynosić 0.', remember: 'Kreska ułamkowa oznacza dzielenie.' },
    ],
    reviewExercises: [
      { type: 'choice', prompt: 'W ułamku 4/9 co oznacza liczba 9?', options: ['Ile części bierzemy', 'Na ile równych części dzielimy całość', 'Wynik dodawania'], correct: 1, hint: 'Mianownik jest na dole.' },
      { type: 'blank', prompt: 'Uzupełnij: Liczba nad kreską ułamkową to ____.', acceptedAnswers: ['licznik'], hint: 'To górna część ułamka.' },
      { type: 'truefalse', prompt: 'W ułamku 3/5 licznik jest większy od mianownika.', correct: 1, options: ['Prawda', 'Fałsz'], hint: 'Porównaj 3 i 5.' },
      { type: 'open', prompt: 'Własnymi słowami wyjaśnij, co oznacza ułamek 2/6.', acceptedAnswers: ['dwie z sześciu równych części', '2 z 6 równych części', 'dwie szóste'], hint: 'Powiedz, ile części bierzemy i z ilu równych.' },
      { type: 'complete', prompt: 'Wpisz znak: 7/7 __ 1', acceptedAnswers: ['='], hint: 'Licznik jest równy mianownikowi.' },
      { type: 'choice', prompt: 'Narysowano koło podzielone na 8 równych części. Zamalowano 3. Jaki ułamek zamalowano?', options: ['8/3', '3/8', '5/8'], correct: 1, hint: 'Zamalowane części to licznik.' },
      { type: 'translate', prompt: 'Zapisz słowami: 1/4.', acceptedAnswers: ['jedna czwarta', 'jedna czwarta całości'], hint: 'Całość podzielono na cztery równe części.' },
    ],
    quizQuestions: [
      choice('W ułamku 4/7 która liczba jest licznikiem?', ['4', '7', '11', '3'], 0, 'Licznik jest nad kreską, więc to 4.'),
      choice('Co mówi mianownik ułamka 3/8?', ['Ile części bierzemy', 'Na ile równych części podzielono całość', 'Ile zostało części', 'Jaki jest licznik'], 1, 'Mianownik jest na dole i mówi o liczbie równych części.'),
      choice('Który ułamek jest mniejszy od 1?', ['6/4', '5/5', '3/8', '9/7'], 2, 'W 3/8 licznik jest mniejszy od mianownika.'),
      choice('Który ułamek jest równy 1?', ['2/3', '5/5', '4/7', '1/6'], 1, 'Równe liczniki i mianowniki oznaczają całość.'),
      choice('Jak pokazujemy 2/5 na rysunku?', ['5 pól, 2 zamalowane', '2 pola, 5 zamalowanych', '5 pól, wszystkie zamalowane', '2 pola, 1 zamalowane'], 0, 'Mianownik to 5 równych pól, licznik to 2 zamalowane.'),
      choice('Ile części bierzemy w ułamku 7/10?', ['10', '7', '17', '3'], 1, 'Licznik 7 mówi, że bierzemy siedem części.'),
      choice('Który mianownik jest niedozwolony?', ['1', '5', '0', '10'], 2, 'Nie można dzielić przez zero.'),
      choice('Który ułamek jest większy od 1?', ['3/8', '4/4', '7/5', '2/9'], 2, 'W 7/5 licznik jest większy od mianownika.'),
      choice('Odcinek od 0 do 1 podzielono na 6 równych części. Który punkt jest drugi za 0?', ['1/6', '2/6', '4/6', '6/2'], 1, 'Każdy krok ma długość 1/6, więc drugi punkt to 2/6.'),
      choice('Który zapis oznacza jedną czwartą?', ['4/1', '1/4', '1/1', '4/4'], 1, 'Jedna z czterech równych części to 1/4.'),
      choice('Licznik ułamka wynosi 3, mianownik 8. Jaki to ułamek?', ['8/3', '3/8', '3/5', '11/3'], 1, 'Licznik zapisujemy nad mianownikiem.'),
      choice('Kasia zjadła 5 z 8 równych kawałków. Jaka część pizzy została zjedzona?', ['3/8', '5/8', '8/5', '5/3'], 1, 'Zjedzono 5 kawałków z 8, czyli 5/8.'),
      open('Wpisz licznik ułamka 6/11.', ['6'], 'Licznik znajduje się nad kreską ułamkową.'),
      open('Wpisz mianownik ułamka 2/9.', ['9'], 'Mianownik znajduje się pod kreską ułamkową.'),
      open('Zapisz ułamek: cztery z siedmiu równych części.', ['4/7'], 'Cztery części to licznik, a siedem wszystkich części to mianownik.'),
      open('Czy 5/8 jest większe czy mniejsze od 1? Odpowiedz jednym słowem.', ['mniejsze', 'mniejszy'], 'Licznik 5 jest mniejszy od mianownika 8.'),
      open('Podzielono tabliczkę na 6 równych kostek. Zjedzono 2. Jaki ułamek zjedzono?', ['2/6', '⅓'], 'Licznik to zjedzone kostki, a mianownik to wszystkie równe kostki.'),
      open('Ile równych części trzeba narysować, aby pokazać siódme części?', ['7', 'siedem'], 'Mianownik 7 oznacza siedem równych części.'),
      open('Uzupełnij znakiem: 3/3 __ 1', ['='], 'Trzy z trzech równych części to całość.'),
      open('Podaj przykład ułamka większego od 1 z mianownikiem 4.', ['5/4', '6/4', '7/4', '8/4', '9/4'], 'Licznik musi być większy od 4.')
    ],
  },
  'Kolejność działań': {
    detailedNotes: [
      { title: '1. Dlaczego kolejność jest ważna?', points: ['W jednym działaniu może być kilka różnych znaków.', 'Jeśli każdy liczy w innej kolejności, otrzymamy różne wyniki.', 'Obowiązująca kolejność sprawia, że wszyscy dostają ten sam wynik.'], example: 'W 3 + 2 × 4 najpierw liczymy 2 × 4, a dopiero potem dodajemy 3.' },
      { title: '2. Nawiasy mają pierwszeństwo', points: ['Najpierw wykonaj działania zapisane w nawiasach.', 'Jeśli nawias jest w nawiasie, zacznij od tego najbardziej wewnętrznego.'], example: '(6 + 2) × 3 = 8 × 3 = 24.', remember: 'Najpierw nawiasy!' },
      { title: '3. Mnożenie i dzielenie', points: ['Po nawiasach wykonujemy mnożenie i dzielenie.', 'Mnożenie i dzielenie mają taki sam priorytet.', 'Gdy występują obok siebie, liczymy od lewej do prawej.'], example: '24 : 6 × 2 = 4 × 2 = 8.' },
      { title: '4. Dodawanie i odejmowanie', points: ['Na końcu wykonujemy dodawanie i odejmowanie.', 'Te działania mają taki sam priorytet, więc liczymy od lewej do prawej.'], example: '18 − 5 + 2 = 13 + 2 = 15.' },
      { title: '5. Jak rozwiązywać?', points: ['Zaznacz nawiasy.', 'Potem znajdź mnożenie i dzielenie, licząc od lewej strony.', 'Na końcu wykonaj dodawanie i odejmowanie.', 'Zapisuj każdy krok, żeby łatwo znaleźć ewentualną pomyłkę.'], example: '20 − 2 × 6 = 20 − 12 = 8.', remember: 'Nawiasy → mnożenie i dzielenie → dodawanie i odejmowanie.' },
    ],
    definitions: [
      { term: 'Priorytet działania', meaning: 'Zasada mówiąca, które działanie wykonujemy wcześniej.', example: 'Mnożenie przed dodawaniem.' },
      { term: 'Nawias', meaning: 'Znaki ( ), które wskazują działanie do wykonania w pierwszej kolejności.', example: '(3 + 2) × 4' },
      { term: 'Działania równorzędne', meaning: 'Działania o takim samym priorytecie; liczymy je od lewej do prawej.', example: 'dodawanie i odejmowanie' },
    ],
    importantFacts: ['Najpierw wykonujemy działania w nawiasach.', 'Mnożenie i dzielenie wykonujemy przed dodawaniem i odejmowaniem.', 'Działania o równym priorytecie liczymy od lewej do prawej.', 'Zapisuj kolejne kroki i nie pomijaj znaków.'],
    cheatSheet: [
      { title: 'Kolejność kroków', items: [{ label: 'Krok 1', text: 'nawiasy' }, { label: 'Krok 2', text: 'mnożenie i dzielenie od lewej do prawej' }, { label: 'Krok 3', text: 'dodawanie i odejmowanie od lewej do prawej' }], remember: 'Nawiasy → × i : → + i −' },
      { title: 'Tak samo ważne', rule: 'Mnożenie i dzielenie są równorzędne. Dodawanie i odejmowanie są równorzędne. W każdej takiej parze licz od lewej do prawej.', example: '24 : 6 × 2 = 4 × 2 = 8.' },
      { title: 'Uważaj na nawiasy', rule: 'Zawsze najpierw oblicz zawartość nawiasu.', example: '(6 + 2) × 3 = 8 × 3 = 24.' },
      { title: 'Kontrola wyniku', rule: 'Zapisz jeden krok w każdej linijce i sprawdź, czy przepisujesz wszystkie liczby i znaki.' },
    ],
    reviewExercises: [
      { type: 'choice', prompt: 'Co wykonasz jako pierwsze w 7 + 3 × 4?', options: ['Dodawanie', 'Mnożenie', 'Odejmowanie'], correct: 1, hint: 'Mnożenie jest przed dodawaniem.' },
      { type: 'blank', prompt: 'Uzupełnij kolejność: nawiasy → ___ i dzielenie → dodawanie i odejmowanie.', acceptedAnswers: ['mnożenie'], hint: 'To działanie oznaczamy znakiem ×.' },
      { type: 'truefalse', prompt: 'W 18 − 6 + 2 najpierw wykonujemy dodawanie.', correct: 1, options: ['Prawda', 'Fałsz'], hint: 'Dodawanie i odejmowanie liczymy od lewej strony.' },
      { type: 'open', prompt: 'Własnymi słowami wyjaśnij, dlaczego w 3 + 2 × 4 najpierw mnożymy.', acceptedAnswers: ['mnożenie ma pierwszeństwo przed dodawaniem', 'bo mnożenie wykonujemy przed dodawaniem'], hint: 'Przypomnij sobie kolejność działań.' },
      { type: 'complete', prompt: 'Oblicz: (5 + 3) × 2 = ___.', acceptedAnswers: ['16'], hint: 'Zacznij od nawiasu.' },
      { type: 'choice', prompt: 'Jaki jest wynik 20 − 2 × 6?', options: ['108', '8', '12'], correct: 1, hint: 'Najpierw oblicz 2 × 6.' },
      { type: 'open', prompt: 'Oblicz: 30 : 5 × 2. Zapisz wynik.', acceptedAnswers: ['12'], hint: 'Dzielenie i mnożenie licz od lewej strony.' },
    ],
    quizQuestions: [
      choice('Co robimy jako pierwsze w działaniu z nawiasem?', ['Dodawanie poza nawiasem', 'Działanie w nawiasie', 'Zawsze mnożenie', 'Odejmowanie poza nawiasem'], 1, 'Nawias ma pierwszeństwo.'),
      choice('Ile wynosi 5 + 3 × 2?', ['16', '11', '13', '10'], 1, 'Najpierw 3 × 2 = 6, potem 5 + 6 = 11.'),
      choice('Ile wynosi (5 + 3) × 2?', ['11', '16', '13', '10'], 1, 'Najpierw nawias: 5 + 3 = 8, potem 8 × 2 = 16.'),
      choice('Które działania wykonujemy na końcu?', ['Mnożenie i dzielenie', 'Nawiasy', 'Dodawanie i odejmowanie', 'Potęgowanie'], 2, 'Dodawanie i odejmowanie są na końcu.'),
      choice('Ile wynosi 18 − 6 + 2?', ['10', '14', '8', '20'], 1, 'Dodawanie i odejmowanie mają równy priorytet: 18 − 6 = 12, potem +2.'),
      choice('Ile wynosi 24 : 6 × 2?', ['2', '8', '12', '4'], 1, 'Dzielimy od lewej: 24 : 6 = 4, a 4 × 2 = 8.'),
      choice('Ile wynosi 7 + (12 − 5)?', ['14', '12', '2', '24'], 0, 'Najpierw nawias: 12 − 5 = 7; potem 7 + 7 = 14.'),
      choice('Ile wynosi 4 × 3 − 5?', ['7', '17', '12', '20'], 0, 'Najpierw 4 × 3 = 12, potem 12 − 5 = 7.'),
      choice('Które działanie ma pierwszeństwo przed dodawaniem?', ['Odejmowanie', 'Mnożenie', 'Dodawanie', 'Żadne'], 1, 'Mnożenie wykonujemy wcześniej niż dodawanie.'),
      choice('Ile wynosi 36 : (3 × 4)?', ['3', '12', '9', '48'], 0, 'Nawias: 3 × 4 = 12; następnie 36 : 12 = 3.'),
      choice('Ile wynosi 40 − 12 : 3?', ['28', '9', '36', '16'], 2, 'Najpierw dzielenie: 12 : 3 = 4, następnie 40 − 4 = 36.'),
      choice('Który zapis daje wynik 20?', ['(6 + 4) × 2', '6 + 4 × 2', '6 × (4 − 2)', '20 : 2 + 2'], 0, '(6 + 4) × 2 = 10 × 2 = 20.'),
      open('Oblicz: 9 + 2 × 5.', ['19'], 'Najpierw mnożymy: 2 × 5 = 10. Potem 9 + 10 = 19.'),
      open('Oblicz: (9 + 2) × 5.', ['55'], 'Najpierw nawias: 9 + 2 = 11. Następnie 11 × 5 = 55.'),
      open('Oblicz: 32 : 4 + 6.', ['14'], 'Najpierw dzielimy: 32 : 4 = 8. Potem 8 + 6 = 14.'),
      open('Oblicz: 20 − 3 × 4.', ['8'], 'Najpierw 3 × 4 = 12. Potem 20 − 12 = 8.'),
      open('Wpisz znak działania, które wykonujesz jako pierwsze: 8 + 2 __ 6.', ['×', 'mnożenie'], 'Mnożenie ma pierwszeństwo przed dodawaniem.'),
      open('Oblicz od lewej do prawej: 30 : 5 × 3.', ['18'], '30 : 5 = 6, a potem 6 × 3 = 18.'),
      open('Oblicz: 50 − (8 + 7) × 2.', ['20'], 'Nawias daje 15, potem 15 × 2 = 30, a 50 − 30 = 20.'),
      open('Oblicz: 6 + 24 : 3 − 2.', ['12'], 'Najpierw dzielenie: 24 : 3 = 8. Potem 6 + 8 − 2 = 12.')
    ],
  },
  'Porównywanie i zapisywanie liczb': {
    detailedNotes: [
      { title: '1. Rzędy i klasy', points: ['Cyfry w liczbie mają różne wartości zależnie od miejsca.', 'Od prawej strony czytamy: jedności, dziesiątki, setki, tysiące, dziesiątki tysięcy, setki tysięcy.', 'Grupujemy cyfry po trzy, zaczynając od prawej strony.'], example: 'W liczbie 352 418 cyfra 3 oznacza 300 000, a cyfra 5 oznacza 50 000.', remember: 'Trzy cyfry od prawej tworzą grupę jedności, a dalej grupę tysięcy.' },
      { title: '2. Zapis słowny i cyfrowy', points: ['Czytaj liczbę grupami: najpierw tysiące, potem jedności.', 'Zwróć uwagę na zera w środku i na końcu liczby.', 'Po zapisie sprawdź, czy liczba cyfr i grup zgadza się z treścią.'], example: '„Dwieście czterdzieści tysięcy siedemnaście” zapisujemy 240 017.', remember: 'W zapisie 240 017 zera wypełniają brakujące dziesiątki tysięcy i setki.' },
      { title: '3. Porównywanie liczb', points: ['Najpierw porównaj liczbę cyfr. Liczba z większą liczbą cyfr jest większa.', 'Jeśli liczby mają tyle samo cyfr, porównuj od lewej strony.', 'Zatrzymaj się przy pierwszej różnej cyfrze — ona rozstrzyga.'], example: '53 820 > 9 999, bo 53 820 ma pięć cyfr, a 9 999 cztery.' },
      { title: '4. Znaki porównania', points: ['Znak < oznacza „mniejsze niż”.', 'Znak > oznacza „większe niż”.', 'Znak = oznacza „równe”.', 'Otwarta część znaków < i > jest skierowana w stronę większej liczby.'], example: '12 305 < 12 350, a 700 020 > 699 999.', remember: 'Krokodyl zjada większą liczbę — otwarta strona znaku wskazuje większą wartość.' },
      { title: '5. Szacowanie i kontrola', points: ['Sprawdź, czy wynik jest rozsądny, porównując rzędy wielkości.', 'Przy zapisie słownym zaznacz osobno grupę tysięcy i jedności.', 'Nie pomijaj zera, gdy w danym rzędzie nie ma żadnych jedności.'], example: '„Czterysta tysięcy osiem” to 400 008, a nie 400 8.' },
    ],
    definitions: [
      { term: 'Cyfra', meaning: 'Jeden ze znaków 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.', example: 'Liczba 407 składa się z cyfr 4, 0 i 7.' },
      { term: 'Rząd', meaning: 'Miejsce cyfry w liczbie, np. jedności, setki lub tysiące.', example: 'W 5 321 cyfra 5 jest w rzędzie tysięcy.' },
      { term: 'Porównywanie', meaning: 'Ustalanie, która z liczb jest większa, mniejsza lub czy są równe.', example: '45 < 54' },
      { term: 'Liczba sześciocyfrowa', meaning: 'Liczba od 100 000 do 999 999.', example: '120 050' },
    ],
    importantFacts: ['Najpierw porównuj liczbę cyfr, potem cyfry od lewej strony.', 'Znak < czytamy „mniejsze niż”, znak > „większe niż”.', 'Oddzielaj grupy cyfr spacją, licząc od prawej strony.', 'W zapisie liczby nie pomijaj zer w środku.'],
    cheatSheet: [
      { title: 'Rzędy od prawej', items: [{ label: '1.', text: 'jedności' }, { label: '2.', text: 'dziesiątki' }, { label: '3.', text: 'setki' }, { label: '4.', text: 'tysiące' }, { label: '5.–6.', text: 'dziesiątki i setki tysięcy' }] },
      { title: 'Porównywanie', rule: 'Najpierw policz cyfry. Jeśli jest ich tyle samo, porównuj od lewej i znajdź pierwszą różnicę.', example: '42 815 > 42 185, bo 8 setek > 1 setki.' },
      { title: 'Znaki', items: [{ label: '<', text: 'mniejsze niż' }, { label: '>', text: 'większe niż' }, { label: '=', text: 'równe' }], remember: 'Otwarta część znaku < lub > patrzy na większą liczbę.' },
      { title: 'Zapis liczb', rule: 'Oddzielaj cyfry spacją co trzy miejsca od prawej. Zachowuj zera w brakujących rzędach.', example: '„Trzysta dwa tysiące pięćdziesiąt cztery” = 302 054.' },
    ],
    reviewExercises: [
      { type: 'choice', prompt: 'Która liczba jest większa?', options: ['98 765', '9 876'], correct: 0, hint: 'Liczba z większą liczbą cyfr jest większa.' },
      { type: 'blank', prompt: 'Znak ___ oznacza „mniejsze niż”.', acceptedAnswers: ['<'], hint: 'Otwarta część znaku wskazuje większą liczbę.' },
      { type: 'truefalse', prompt: 'W liczbie 40 205 cyfra 4 oznacza cztery tysiące.', correct: 1, options: ['Prawda', 'Fałsz'], hint: 'Sprawdź rząd, w którym jest cyfra 4.' },
      { type: 'open', prompt: 'Własnymi słowami opisz, jak porównujesz dwie liczby o tej samej liczbie cyfr.', acceptedAnswers: ['porównuję cyfry od lewej strony', 'porównuję od lewej i patrzę na pierwszą różną cyfrę'], hint: 'Zacznij od najwyższego rzędu.' },
      { type: 'complete', prompt: 'Zapisz cyframi: pięćdziesiąt tysięcy dziewięć.', acceptedAnswers: ['50 009', '50009'], hint: 'Zachowaj zera w brakujących rzędach.' },
      { type: 'choice', prompt: 'Wstaw znak: 70 090 __ 70 900', options: ['<', '>', '='], correct: 0, hint: 'Porównaj setki: 0 i 9.' },
      { type: 'open', prompt: 'Jaka jest wartość cyfry 6 w liczbie 261 040?', acceptedAnswers: ['60 000', '60000', 'sześćdziesiąt tysięcy'], hint: 'Cyfra 6 jest w rzędzie dziesiątek tysięcy.' },
    ],
    quizQuestions: [
      choice('Która liczba jest największa?', ['405 612', '450 612', '405 621', '450 621'], 3, 'Porównujemy od lewej; 450 621 jest większa od 450 612.'),
      choice('Wybierz znak: 73 405 __ 73 450', ['<', '>', '=', 'Nie da się porównać'], 0, 'Obie mają tyle samo cyfr. W setkach 4 < 4? Porównaj dziesiątki: 0 < 5, więc pierwsza jest mniejsza.'),
      choice('Ile cyfr ma liczba 82 004?', ['4', '5', '6', '3'], 1, 'Spacja tylko oddziela grupy; liczba ma pięć cyfr.'),
      choice('Jaka jest wartość cyfry 7 w liczbie 274 130?', ['7', '700', '7 000', '70 000'], 3, 'Cyfra 7 stoi w rzędzie dziesiątek tysięcy.'),
      choice('Który zapis oznacza „trzysta dwa tysiące pięćdziesiąt cztery”?', ['302 054', '320 054', '302 504', '32 054'], 0, '302 tysiące i 54 jedności zapisujemy 302 054.'),
      choice('Która liczba jest najmniejsza?', ['90 010', '9 999', '10 001', '99 000'], 1, '9 999 ma cztery cyfry, pozostałe liczby mają pięć.'),
      choice('Wstaw właściwy znak: 600 020 __ 599 999', ['<', '>', '=', '≈'], 1, '600 020 jest większa od 599 999.'),
      choice('Jaka jest wartość cyfry 4 w liczbie 148 302?', ['4', '400', '4 000', '40 000'], 3, '4 znajduje się w rzędzie dziesiątek tysięcy.'),
      choice('Który zapis słowny pasuje do 51 006?', ['pięć tysięcy sto sześć', 'pięćdziesiąt jeden tysięcy sześć', 'pięćdziesiąt jeden tysięcy sześćdziesiąt', 'pięćset jeden tysięcy sześć'], 1, '51 000 i 6 to pięćdziesiąt jeden tysięcy sześć.'),
      choice('Która cyfra stoi w rzędzie setek liczby 83 725?', ['8', '3', '7', '2'], 2, 'Od prawej: 5 jedności, 2 dziesiątki, 7 setek.'),
      choice('Która liczba jest równa 240 017?', ['dwieście czterdzieści tysięcy siedemnaście', 'dwieście cztery tysiące siedemnaście', 'dwieście czterdzieści tysięcy sto siedemnaście', 'dwadzieścia cztery tysiące siedemnaście'], 0, '240 tysięcy i 17 jedności to 240 017.'),
      choice('Uzupełnij: 9 999 __ 10 000', ['>', '<', '=', '≤'], 1, '10 000 ma pięć cyfr, a 9 999 ma cztery.'),
      open('Zapisz cyframi: dwieście czterdzieści tysięcy siedemnaście.', ['240 017', '240017'], 'To 240 tysięcy oraz 17 jedności. Zera zachowują puste rzędy.'),
      open('Wpisz znak <, > albo =: 82 099 __ 82 100.', ['<'], '82 099 jest o jeden mniejsze od 82 100.'),
      open('Zapisz cyframi: sześćdziesiąt tysięcy czterysta dwa.', ['60 402', '60402'], '60 tysięcy i 402 jedności zapisujemy jako 60 402.'),
      open('Jaka jest wartość cyfry 5 w liczbie 351 208?', ['50 000', '50000', 'pięćdziesiąt tysięcy'], 'Cyfra 5 jest w rzędzie dziesiątek tysięcy.'),
      open('Ułóż rosnąco: 12 500, 9 999, 12 050. Wpisz liczby od najmniejszej.', ['9 999, 12 050, 12 500', '9999 12050 12500', '9 999 12 050 12 500'], 'Najpierw 9 999, a potem porównujemy 12 050 i 12 500.'),
      open('Zapisz słowami liczbę 4 008.', ['cztery tysiące osiem'], 'Zachowaj informację, że w setkach i dziesiątkach są zera.'),
      open('Podaj liczbę o 1 większą od 99 999.', ['100 000', '100000'], 'Po 99 999 następuje 100 000.'),
      open('Wstaw znak: 305 040 __ 305 004.', ['>'], 'W setkach obie mają 0, ale w dziesiątkach 4 jest większe od 0.'),
    ],
  },
  'Step 2 – Warm up your brain! Powtórzenie nazw przedmiotów w klasie, produktów spożywczych, ubrań, miejsc w mieście': {
    examples: 'This is my book. — To jest moja książka. I like apples. — Lubię jabłka. My shoes are blue. — Moje buty są niebieskie. The park is near my school. — Park jest blisko mojej szkoły.',
    examplesSpeechSegments: speech(
      en('This is my book.'), pl('— To jest moja książka.'), en('I like apples.'), pl('— Lubię jabłka.'),
      en('My shoes are blue.'), pl('— Moje buty są niebieskie.'), en('The park is near my school.'), pl('— Park jest blisko mojej szkoły.'),
    ),
    detailedNotes: [
      { title: '1. Rzeczy w klasie — classroom objects', titleSpeechSegments: speech(pl('1. Rzeczy w klasie —'), en('classroom objects')), points: ['book — książka; pen — długopis; pencil — ołówek.', 'ruler — linijka; rubber — gumka; school bag — plecak szkolny.', 'Mówimy a przed wyrazem zaczynającym się od spółgłoski, np. a book.'], pointSpeechSegments: [speech(en('book —'), pl('książka;'), en('pen —'), pl('długopis;'), en('pencil —'), pl('ołówek.')), speech(en('ruler —'), pl('linijka;'), en('rubber —'), pl('gumka;'), en('school bag —'), pl('plecak szkolny.')), speech(pl('Mówimy a przed wyrazem zaczynającym się od spółgłoski, np.'), en('a book.'))], example: 'This is my book. — To jest moja książka. I have a blue pen. — Mam niebieski długopis.', exampleSpeechSegments: speech(en('This is my book.'), pl('— To jest moja książka.'), en('I have a blue pen.'), pl('— Mam niebieski długopis.')), remember: 'Pencil to ołówek, a pen to długopis.', rememberSpeechSegments: speech(en('Pencil'), pl('to ołówek,'), en('a pen'), pl('to długopis.')) },
      { title: '2. Jedzenie — food', titleSpeechSegments: speech(pl('2. Jedzenie —'), en('food')), points: ['apple — jabłko; banana — banan; bread — chleb.', 'cheese — ser; milk — mleko; sandwich — kanapka.', 'I like… znaczy „Lubię…”. Do apple w liczbie mnogiej dodajemy -s: apples.'], pointSpeechSegments: [speech(en('apple —'), pl('jabłko;'), en('banana —'), pl('banan;'), en('bread —'), pl('chleb.')), speech(en('cheese —'), pl('ser;'), en('milk —'), pl('mleko;'), en('sandwich —'), pl('kanapka.')), speech(en('I like…'), pl('znaczy „Lubię…”. Do'), en('apple'), pl('w liczbie mnogiej dodajemy'), en('-s: apples.'))], example: 'I like apples. — Lubię jabłka. I have a cheese sandwich. — Mam kanapkę z serem.', exampleSpeechSegments: speech(en('I like apples.'), pl('— Lubię jabłka.'), en('I have a cheese sandwich.'), pl('— Mam kanapkę z serem.')) },
      { title: '3. Ubrania — clothes', titleSpeechSegments: speech(pl('3. Ubrania —'), en('clothes')), points: ['T-shirt — koszulka; trousers — spodnie; shoes — buty.', 'jacket — kurtka; dress — sukienka; socks — skarpetki.', 'Nazwy trousers i shoes zwykle występują w liczbie mnogiej.', 'My … is … opisuje jedną rzecz: My T-shirt is green.'], pointSpeechSegments: [speech(en('T-shirt —'), pl('koszulka;'), en('trousers —'), pl('spodnie;'), en('shoes —'), pl('buty.')), speech(en('jacket —'), pl('kurtka;'), en('dress —'), pl('sukienka;'), en('socks —'), pl('skarpetki.')), speech(pl('Nazwy'), en('trousers'), pl('i'), en('shoes'), pl('zwykle występują w liczbie mnogiej.')), speech(en('My … is …'), pl('opisuje jedną rzecz:'), en('My T-shirt is green.'))], example: 'Put on your jacket. — Załóż kurtkę. My shoes are blue. — Moje buty są niebieskie.', exampleSpeechSegments: speech(en('Put on your jacket.'), pl('— Załóż kurtkę.'), en('My shoes are blue.'), pl('— Moje buty są niebieskie.')), remember: 'Przy trousers i shoes używamy are, np. My trousers are black.', rememberSpeechSegments: speech(pl('Przy'), en('trousers'), pl('i'), en('shoes'), pl('używamy'), en('are, np. My trousers are black.')) },
      { title: '4. Miejsca w mieście — places in town', titleSpeechSegments: speech(pl('4. Miejsca w mieście —'), en('places in town')), points: ['school — szkoła; park — park; shop — sklep.', 'library — biblioteka; cinema — kino; bus stop — przystanek autobusowy.', 'near znaczy „blisko”, at the library — „w bibliotece”.'], pointSpeechSegments: [speech(en('school —'), pl('szkoła;'), en('park —'), pl('park;'), en('shop —'), pl('sklep.')), speech(en('library —'), pl('biblioteka;'), en('cinema —'), pl('kino;'), en('bus stop —'), pl('przystanek autobusowy.')), speech(en('near'), pl('znaczy „blisko”,'), en('at the library'), pl('— „w bibliotece”.'))], example: 'The park is near my school. — Park jest blisko mojej szkoły. I read at the library. — Czytam w bibliotece.', exampleSpeechSegments: speech(en('The park is near my school.'), pl('— Park jest blisko mojej szkoły.'), en('I read at the library.'), pl('— Czytam w bibliotece.')) },
      { title: '5. Krótkie zdania', titleSpeechSegments: speech(pl('5. Krótkie zdania')), points: ['This is… — To jest…', 'I have… — Mam…', 'I like… — Lubię…', 'My … is… — Mój/Moja… jest…', 'Where is…? — Gdzie jest…?'], pointSpeechSegments: [speech(en('This is…'), pl('— To jest…')), speech(en('I have…'), pl('— Mam…')), speech(en('I like…'), pl('— Lubię…')), speech(en('My … is…'), pl('— Mój/Moja… jest…')), speech(en('Where is…?'), pl('— Gdzie jest…?'))], example: 'Where is the bus stop? — Gdzie jest przystanek autobusowy? It is near the shop. — Jest blisko sklepu.', exampleSpeechSegments: speech(en('Where is the bus stop?'), pl('— Gdzie jest przystanek autobusowy?'), en('It is near the shop.'), pl('— Jest blisko sklepu.')), remember: 'Ułóż zdanie z osobą/rzeczą, czasownikiem i resztą informacji. Czytaj je na głos.', rememberSpeechSegments: speech(pl('Ułóż zdanie z osobą/rzeczą, czasownikiem i resztą informacji. Czytaj je na głos.')) },
    ],
    definitions: [
      { term: 'Classroom objects', termSpeechSegments: speech(en('Classroom objects')), meaning: 'Przedmioty, których używamy w klasie.', meaningSpeechSegments: speech(pl('Przedmioty, których używamy w klasie.')), example: 'book, pencil, ruler', exampleSpeechSegments: speech(en('book, pencil, ruler')) },
      { term: 'Food', termSpeechSegments: speech(en('Food')), meaning: 'Jedzenie i produkty spożywcze.', meaningSpeechSegments: speech(pl('Jedzenie i produkty spożywcze.')), example: 'apple, bread, milk', exampleSpeechSegments: speech(en('apple, bread, milk')) },
      { term: 'Clothes', termSpeechSegments: speech(en('Clothes')), meaning: 'Ubrania i rzeczy, które nosimy.', meaningSpeechSegments: speech(pl('Ubrania i rzeczy, które nosimy.')), example: 'jacket, dress, shoes', exampleSpeechSegments: speech(en('jacket, dress, shoes')) },
      { term: 'Places in town', termSpeechSegments: speech(en('Places in town')), meaning: 'Miejsca, które można znaleźć w mieście.', meaningSpeechSegments: speech(pl('Miejsca, które można znaleźć w mieście.')), example: 'park, shop, library', exampleSpeechSegments: speech(en('park, shop, library')) },
      { term: 'Near', termSpeechSegments: speech(en('Near')), meaning: 'Po angielsku „blisko”.', meaningSpeechSegments: speech(pl('Po angielsku „blisko”.')), example: 'The park is near my school.', exampleSpeechSegments: speech(en('The park is near my school.')) },
    ],
    importantFacts: ['pencil = ołówek, pen = długopis.', 'bread = chleb, cheese = ser, milk = mleko.', 'trousers = spodnie, shoes = buty; używamy z nimi are.', 'library = biblioteka, bus stop = przystanek autobusowy.', 'I like… = Lubię…, I have… = Mam…'],
    importantFactsSpeechSegments: [
      speech(en('pencil ='), pl('ołówek,'), en('pen ='), pl('długopis.')),
      speech(en('bread ='), pl('chleb,'), en('cheese ='), pl('ser,'), en('milk ='), pl('mleko.')),
      speech(en('trousers ='), pl('spodnie,'), en('shoes ='), pl('buty; używamy z nimi'), en('are.')),
      speech(en('library ='), pl('biblioteka,'), en('bus stop ='), pl('przystanek autobusowy.')),
      speech(en('I like… ='), pl('Lubię…,'), en('I have… ='), pl('Mam…')),
    ],
    cheatSheet: [
      { title: 'Classroom objects · klasa', titleSpeechSegments: speech(en('Classroom objects ·'), pl('klasa')), items: [{ label: 'book', labelSpeechSegments: speech(en('book')), text: 'książka', textSpeechSegments: speech(pl('książka')) }, { label: 'pen / pencil', labelSpeechSegments: speech(en('pen / pencil')), text: 'długopis / ołówek', textSpeechSegments: speech(pl('długopis / ołówek')) }, { label: 'ruler / rubber', labelSpeechSegments: speech(en('ruler / rubber')), text: 'linijka / gumka', textSpeechSegments: speech(pl('linijka / gumka')) }, { label: 'school bag', labelSpeechSegments: speech(en('school bag')), text: 'plecak szkolny', textSpeechSegments: speech(pl('plecak szkolny')) }], remember: 'Pen to długopis, pencil to ołówek.', rememberSpeechSegments: speech(en('Pen'), pl('to długopis,'), en('pencil'), pl('to ołówek.')) },
      { title: 'Food · jedzenie', titleSpeechSegments: speech(en('Food ·'), pl('jedzenie')), items: [{ label: 'apple / banana', labelSpeechSegments: speech(en('apple / banana')), text: 'jabłko / banan', textSpeechSegments: speech(pl('jabłko / banan')) }, { label: 'bread / cheese', labelSpeechSegments: speech(en('bread / cheese')), text: 'chleb / ser', textSpeechSegments: speech(pl('chleb / ser')) }, { label: 'milk / sandwich', labelSpeechSegments: speech(en('milk / sandwich')), text: 'mleko / kanapka', textSpeechSegments: speech(pl('mleko / kanapka')) }], example: 'I like apples. — Lubię jabłka.', exampleSpeechSegments: speech(en('I like apples.'), pl('— Lubię jabłka.')) },
      { title: 'Clothes · ubrania', titleSpeechSegments: speech(en('Clothes ·'), pl('ubrania')), items: [{ label: 'T-shirt / jacket', labelSpeechSegments: speech(en('T-shirt / jacket')), text: 'koszulka / kurtka', textSpeechSegments: speech(pl('koszulka / kurtka')) }, { label: 'trousers / shoes', labelSpeechSegments: speech(en('trousers / shoes')), text: 'spodnie / buty', textSpeechSegments: speech(pl('spodnie / buty')) }, { label: 'dress / socks', labelSpeechSegments: speech(en('dress / socks')), text: 'sukienka / skarpetki', textSpeechSegments: speech(pl('sukienka / skarpetki')) }], remember: 'Trousers i shoes łączymy z are.', rememberSpeechSegments: speech(en('Trousers'), pl('i'), en('shoes'), pl('łączymy z'), en('are.')) },
      { title: 'Places in town · miasto', titleSpeechSegments: speech(en('Places in town ·'), pl('miasto')), items: [{ label: 'school / park', labelSpeechSegments: speech(en('school / park')), text: 'szkoła / park', textSpeechSegments: speech(pl('szkoła / park')) }, { label: 'shop / library', labelSpeechSegments: speech(en('shop / library')), text: 'sklep / biblioteka', textSpeechSegments: speech(pl('sklep / biblioteka')) }, { label: 'cinema / bus stop', labelSpeechSegments: speech(en('cinema / bus stop')), text: 'kino / przystanek autobusowy', textSpeechSegments: speech(pl('kino / przystanek autobusowy')) }], example: 'The park is near my school. — Park jest blisko mojej szkoły.', exampleSpeechSegments: speech(en('The park is near my school.'), pl('— Park jest blisko mojej szkoły.')) },
      { title: 'Przydatne konstrukcje', titleSpeechSegments: speech(pl('Przydatne konstrukcje')), items: [{ label: 'This is…', labelSpeechSegments: speech(en('This is…')), text: 'To jest…', textSpeechSegments: speech(pl('To jest…')) }, { label: 'I have…', labelSpeechSegments: speech(en('I have…')), text: 'Mam…', textSpeechSegments: speech(pl('Mam…')) }, { label: 'I like…', labelSpeechSegments: speech(en('I like…')), text: 'Lubię…', textSpeechSegments: speech(pl('Lubię…')) }, { label: 'near', labelSpeechSegments: speech(en('near')), text: 'blisko', textSpeechSegments: speech(pl('blisko')) }] },
    ],
    reviewExercises: [
      { type: 'choice', prompt: 'Co znaczy ruler?', promptLanguage: 'pl-PL', speechSegments: speech(pl('Co znaczy'), en('ruler?')), options: ['linijka', 'plecak', 'książka'], correct: 0, answerSpeechSegments: speech(pl('linijka')), hint: 'To przyrząd do mierzenia i rysowania prostych linii.', hintSpeechSegments: speech(pl('To przyrząd do mierzenia i rysowania prostych linii.')) },
      { type: 'blank', prompt: 'Uzupełnij: apple — ____.', promptLanguage: 'pl-PL', speechSegments: speech(pl('Uzupełnij:'), en('apple'), pl('— luka.')), acceptedAnswers: ['jabłko'], answerSpeechSegments: speech(pl('jabłko')), hint: 'To owoc czerwony lub zielony.', hintSpeechSegments: speech(pl('To owoc czerwony lub zielony.')) },
      { type: 'truefalse', prompt: 'Trousers znaczy „spodnie”.', promptLanguage: 'pl-PL', speechSegments: speech(en('Trousers'), pl('znaczy „spodnie”.')), correct: 0, options: ['Prawda', 'Fałsz'], answerSpeechSegments: speech(pl('Prawda')), hint: 'To ubranie noszone na nogach.', hintSpeechSegments: speech(pl('To ubranie noszone na nogach.')) },
      { type: 'translate', prompt: 'Przetłumacz na angielski: biblioteka.', promptLanguage: 'pl-PL', acceptedAnswers: ['library'], answerSpeechSegments: speech(en('library')), hint: 'Można tam wypożyczyć książki.', hintSpeechSegments: speech(pl('Można tam wypożyczyć książki.')) },
      { type: 'complete', prompt: 'Uzupełnij zdanie: The park is ___ my school. (blisko)', promptLanguage: 'pl-PL', speechSegments: speech(pl('Uzupełnij zdanie:'), en('The park is ___ my school.'), pl('(blisko)')), acceptedAnswers: ['near'], answerSpeechSegments: speech(en('near')), hint: 'To krótkie słowo oznacza „blisko”.', hintSpeechSegments: speech(pl('To krótkie słowo oznacza „blisko”.')) },
      { type: 'open', prompt: 'Napisz po angielsku jedno zdanie z I like i nazwą jedzenia.', promptLanguage: 'pl-PL', speechSegments: speech(pl('Napisz po angielsku jedno zdanie z'), en('I like'), pl('i nazwą jedzenia.')), acceptedAnswers: ['i like apples', 'i like bananas', 'i like bread', 'i like cheese', 'i like milk'], answerSpeechSegments: speech(en('Na przykład: I like apples.')), hint: 'I like znaczy „Lubię”.', hintSpeechSegments: speech(en('I like'), pl('znaczy „Lubię”.')) },
      { type: 'translate', prompt: 'Przetłumacz: I have a blue pen.', promptLanguage: 'pl-PL', speechSegments: speech(pl('Przetłumacz:'), en('I have a blue pen.')), acceptedAnswers: ['mam niebieski długopis', 'mam niebieskie pióro'], answerSpeechSegments: speech(pl('Mam niebieski długopis.')), hint: 'I have znaczy „Mam”.', hintSpeechSegments: speech(en('I have'), pl('znaczy „Mam”.')) },
      { type: 'choice', prompt: 'Które słowo oznacza miejsce w mieście?', promptLanguage: 'pl-PL', options: ['socks', 'library', 'cheese'], correct: 1, answerSpeechSegments: speech(en('library')), hint: 'To miejsce, gdzie wypożyczamy książki.', hintSpeechSegments: speech(pl('To miejsce, gdzie wypożyczamy książki.')) },
    ],
    quizQuestions: [
      choice('Co znaczy school bag?', ['plecak szkolny', 'torba na zakupy', 'piórnik', 'sala lekcyjna'], 0, 'School bag to plecak szkolny.'),
      choice('Jak po angielsku jest „gumka do ścierania”?', ['rubber', 'ruler', 'rubber boots', 'book'], 0, 'Rubber to gumka do ścierania.'),
      choice('Co znaczy cheese?', ['mleko', 'ser', 'chleb', 'jabłko'], 1, 'Cheese to ser.'),
      choice('Wybierz poprawne zdanie: „Moje buty są niebieskie”.', ['My shoes is blue.', 'My shoes are blue.', 'My shoe are blue.', 'My shoes blue.'], 1, 'Shoes to liczba mnoga, więc mówimy are.'),
      open('Wpisz po angielsku: linijka.', ['ruler'], 'Ruler to linijka.'),
      open('Wpisz po angielsku: banan.', ['banana'], 'Banana to banan.'),
      choice('Co znaczy jacket?', ['sukienka', 'kurtka', 'skarpetka', 'koszulka'], 1, 'Jacket to kurtka.'),
      choice('Które słowo oznacza spodnie?', ['dress', 'shoes', 'trousers', 'socks'], 2, 'Trousers to spodnie.'),
      open('Wpisz po angielsku: sukienka.', ['dress'], 'Dress to sukienka.'),
      choice('Gdzie można wypożyczyć książkę?', ['at the cinema', 'at the library', 'at the bus stop', 'at the park'], 1, 'At the library znaczy „w bibliotece”.'),
      choice('Co znaczy bus stop?', ['przystanek autobusowy', 'dworzec kolejowy', 'sklep', 'park'], 0, 'Bus stop to przystanek autobusowy.'),
      open('Wpisz po angielsku: kino.', ['cinema', 'movie theater'], 'Cinema to kino.'),
      choice('Jak przetłumaczysz „I like milk”?', ['Mam mleko.', 'Lubię mleko.', 'Piję wodę.', 'Kupuję mleko.'], 1, 'I like znaczy „Lubię”.'),
      choice('Które słowo oznacza jedzenie?', ['ruler', 'jacket', 'bread', 'library'], 2, 'Bread to chleb.'),
      open('Uzupełnij: The park is ___ my school. (blisko)', ['near'], 'Near znaczy „blisko”.'),
      open('Napisz po angielsku: Mam książkę.', ['i have a book', 'i have book'], 'I have znaczy „Mam”.'),
      choice('Co znaczy socks?', ['buty', 'skarpetki', 'spodnie', 'kurtka'], 1, 'Socks to skarpetki.'),
      choice('Które zdanie znaczy „To jest moja książka”?', ['This is my book.', 'I like my book.', 'Where is my book?', 'My book is blue.'], 0, 'This is… znaczy „To jest…”.'),
      open('Wpisz po angielsku: sklep.', ['shop', 'store'], 'Shop (albo store) to sklep.'),
      open('Przetłumacz na polski: Put on your jacket.', ['załóż swoją kurtkę', 'załóż kurtkę'], 'Put on znaczy „załóż”, a jacket to kurtka.')
    ],
  },
};

// Niemiecki: każda niemiecka i polska część materiału ma jawny język mowy.
const germanPair = (german, polish) => speech(de(german), pl(polish));
const germanNote = (title, lines, example, remember, titleSegments, rememberSegments) => ({
  title,
  titleSpeechSegments: titleSegments ? speech(...titleSegments) : speech(pl(title)),
  points: lines.map(([german, polish]) => `${german} — ${polish}`),
  pointSpeechSegments: lines.map(([german, polish]) => germanPair(german, polish)),
  ...(example ? { example: `${example[0]} — ${example[1]}`, exampleSpeechSegments: germanPair(...example) } : {}),
  ...(remember ? { remember: remember[0], rememberSpeechSegments: rememberSegments ? speech(...rememberSegments) : speech(pl(remember[0])) } : {}),
});
const germanExercise = (prompt, promptParts, answer, answerParts, extra = {}) => ({
  type: 'open', prompt, promptLanguage: 'pl-PL', speechSegments: speech(...promptParts),
  acceptedAnswers: Array.isArray(answer) ? answer : [answer], answerSpeechSegments: speech(...answerParts),
  hint: 'Spokojnie przypomnij sobie zwrot z notatki.', hintSpeechSegments: speech(pl('Spokojnie przypomnij sobie zwrot z notatki.')),
  ...extra,
});
const germanChoice = (prompt, promptParts, options, correct, answerParts, explanationParts) => ({
  type: 'choice', prompt, promptLanguage: 'pl-PL', speechSegments: speech(...promptParts),
  options, correct, answerSpeechSegments: speech(...answerParts),
  hint: 'Wróć do odpowiedniej sekcji notatki.', hintSpeechSegments: speech(pl('Wróć do odpowiedniej sekcji notatki.')),
  acceptedAnswers: [],
  explanation: explanationParts.map(([text]) => text).join(' '), explanationSpeechSegments: speech(...explanationParts),
});
const germanQuizChoice = (question, questionParts, answers, correct, answerParts, explanationParts, level) => ({
  type: 'choice', question, promptLanguage: 'pl-PL', speechSegments: speech(...questionParts),
  answers, correct, answerSpeechSegments: speech(...answerParts), explanation: explanationParts.map(([text]) => text).join(' '),
  explanationSpeechSegments: speech(...explanationParts), level,
});
const germanQuizOpen = (question, questionParts, acceptedAnswers, answerParts, explanationParts, level) => ({
  type: 'open', question, promptLanguage: 'pl-PL', speechSegments: speech(...questionParts),
  acceptedAnswers, answerSpeechSegments: speech(...answerParts), explanation: explanationParts.map(([text]) => text).join(' '),
  explanationSpeechSegments: speech(...explanationParts), level,
});

window.NaukaZMamaExpandedContent['Guten Tag!'] = {
  speechLanguage: 'de-DE',
  summary: 'Poznasz powitania, pożegnania i krótkie zdania o sobie. Ucz się małymi krokami: przeczytaj zwrot, jego tłumaczenie, a potem powiedz go na głos.',
  summarySpeechSegments: speech(pl('Poznasz powitania, pożegnania i krótkie zdania o sobie. Ucz się małymi krokami: przeczytaj zwrot, jego tłumaczenie, a potem powiedz go na głos.')),
  detailedNotes: [
    germanNote('Begrüßung – powitania', [
      ['Guten Morgen!', 'Dzień dobry! (rano)'], ['Guten Tag!', 'Dzień dobry!'], ['Guten Abend!', 'Dobry wieczór!'],
      ['Hallo!', 'Cześć! / Witaj!'], ['Gute Nacht!', 'Dobranoc! (na pożegnanie przed snem)'],
    ], ['Guten Morgen, Aleksander!', 'Dzień dobry, Aleksandrze!'], ['Rano mówimy Guten Morgen, a wieczorem Guten Abend. Gute Nacht mówimy, gdy ktoś idzie spać.'], [de('Begrüßung'), pl('– powitania')], [pl('Rano mówimy'), de('Guten Morgen'), pl(', a wieczorem'), de('Guten Abend'), pl('.'), de('Gute Nacht'), pl('mówimy, gdy ktoś idzie spać.')]),
    germanNote('Abschied – pożegnania', [
      ['Auf Wiedersehen!', 'Do widzenia! (grzecznie)'], ['Tschüss!', 'Pa!'], ['Bis bald!', 'Do zobaczenia wkrótce!'], ['Bis morgen!', 'Do jutra!'],
    ], ['Tschüss, bis morgen!', 'Pa, do jutra!'], ['Gute Nacht to pożegnanie przed snem. W innych sytuacjach możesz powiedzieć Tschüss albo Auf Wiedersehen.'], [de('Abschied'), pl('– pożegnania')], [de('Gute Nacht'), pl('to pożegnanie przed snem. W innych sytuacjach możesz powiedzieć'), de('Tschüss'), pl('albo'), de('Auf Wiedersehen.' )]),
    germanNote('Przedstawianie się', [
      ['Wie heißt du?', 'Jak masz na imię?'], ['Ich heiße Aleksander.', 'Mam na imię Aleksander.'],
      ['Wer bist du?', 'Kim jesteś?'], ['Ich bin Aleksander.', 'Jestem Aleksander.'],
    ], ['Hallo! Wie heißt du? — Ich heiße Aleksander.', 'Cześć! Jak masz na imię? — Mam na imię Aleksander.'], ['W pytaniu Wie heißt du? używamy du, gdy rozmawiamy z jedną osobą, z którą jesteśmy na ty.'], undefined, [pl('W pytaniu'), de('Wie heißt du?'), pl('używamy'), de('du'), pl(', gdy rozmawiamy z jedną osobą, z którą jesteśmy na ty.')]),
    germanNote('Skąd jesteś?', [
      ['Woher kommst du?', 'Skąd jesteś?'], ['Ich komme aus Polen.', 'Pochodzę z Polski.'], ['Ich komme aus Deutschland.', 'Pochodzę z Niemiec.'],
    ], ['Woher kommst du? — Ich komme aus Polen.', 'Skąd jesteś? — Pochodzę z Polski.'], ['Po aus zwykle podajemy nazwę kraju. Nazwę kraju zapamiętuj razem z przyimkiem, np. aus Polen.'], undefined, [pl('Po'), de('aus'), pl('zwykle podajemy nazwę kraju. Nazwę kraju zapamiętuj razem z przyimkiem, np.'), de('aus Polen.')]),
    germanNote('Gdzie mieszkasz?', [
      ['Wo wohnst du?', 'Gdzie mieszkasz?'], ['Ich wohne in Warschau.', 'Mieszkam w Warszawie.'], ['Ich wohne in Krakau.', 'Mieszkam w Krakowie.'],
    ], ['Wo wohnst du? — Ich wohne in Warschau.', 'Gdzie mieszkasz? — Mieszkam w Warszawie.'], ['Pytanie Wo wohnst du? dotyczy miejsca zamieszkania. Odpowiadamy Ich wohne in…'], undefined, [pl('Pytanie'), de('Wo wohnst du?'), pl('dotyczy miejsca zamieszkania. Odpowiadamy'), de('Ich wohne in…')]),
    germanNote('Jak się masz?', [
      ['Wie geht’s?', 'Jak się masz?'], ['Wie geht es dir?', 'Jak się masz? (pełna forma)'], ['Gut, danke.', 'Dobrze, dziękuję.'],
      ['Sehr gut!', 'Bardzo dobrze!'], ['Es geht.', 'Jakoś leci.'], ['Nicht so gut.', 'Niezbyt dobrze.'],
    ], ['Wie geht es dir? — Sehr gut, danke!', 'Jak się masz? — Bardzo dobrze, dziękuję!'], ['Możesz odpowiedzieć krótko i zgodnie z tym, jak naprawdę się czujesz.']),
    germanNote('Liczby 0–20', [
      ['null, eins, zwei, drei, vier', 'zero, jeden, dwa, trzy, cztery'], ['fünf, sechs, sieben, acht, neun', 'pięć, sześć, siedem, osiem, dziewięć'],
      ['zehn, elf, zwölf, dreizehn, vierzehn', 'dziesięć, jedenaście, dwanaście, trzynaście, czternaście'],
      ['fünfzehn, sechzehn, siebzehn, achtzehn, neunzehn, zwanzig', 'piętnaście, szesnaście, siedemnaście, osiemnaście, dziewiętnaście, dwadzieścia'],
    ], ['sieben + drei = zehn', 'siedem + trzy = dziesięć'], ['Liczby 13–19 zwykle kończą się na -zehn. Uwaga: sechzehn (16) i siebzehn (17) mają krótszą formę.'], undefined, [pl('Liczby 13–19 zwykle kończą się na'), de('-zehn.'), pl('Uwaga:'), de('sechzehn'), pl('(16) i'), de('siebzehn'), pl('(17) mają krótszą formę.')]),
    germanNote('Ile masz lat?', [
      ['Wie alt bist du?', 'Ile masz lat?'], ['Ich bin elf Jahre alt.', 'Mam jedenaście lat.'], ['Ich bin zehn Jahre alt.', 'Mam dziesięć lat.'],
    ], ['Wie alt bist du? — Ich bin elf Jahre alt.', 'Ile masz lat? — Mam jedenaście lat.'], ['Po Ich bin podajemy liczbę i słowa Jahre alt. Wiek po niemiecku wyrażamy jako „jestem … lat stary”.'], undefined, [pl('Po'), de('Ich bin'), pl('podajemy liczbę i słowa'), de('Jahre alt.'), pl('Wiek po niemiecku wyrażamy jako „jestem … lat stary”.')]),
    germanNote('Du i Sie', [
      ['du', 'ty — do kolegi, koleżanki lub dziecka'], ['Sie', 'Pan / Pani / Państwo — grzecznie do dorosłej osoby'],
      ['Wie heißen Sie?', 'Jak ma Pan / Pani na imię?'], ['Wie heißen Sie, Frau Müller?', 'Jak ma Pani na imię, pani Müller?'],
    ], ['Hallo, Mia! Wie heißt du?', 'Cześć, Mia! Jak masz na imię?'], ['Sie grzecznościowe zapisujemy wielką literą. Jeśli nie wiesz, której formy użyć, zapytaj dorosłego.'], undefined, [de('Sie'), pl('grzecznościowe zapisujemy wielką literą. Jeśli nie wiesz, której formy użyć, zapytaj dorosłego.')]),
    germanNote('Czasownik sein – być', [
      ['ich bin', 'ja jestem'], ['du bist', 'ty jesteś'], ['er ist / sie ist', 'on jest / ona jest'],
      ['wir sind', 'my jesteśmy'], ['ihr seid', 'wy jesteście'], ['sie sind / Sie sind', 'oni są / Pan, Pani lub Państwo są'],
    ], ['Ich bin Aleksander. Du bist Mia.', 'Jestem Aleksander. Ty jesteś Mia.'], ['Odmianę sein warto zapamiętać w rytmie: ich bin, du bist, er/sie ist, wir sind, ihr seid, sie/Sie sind.'], undefined, [pl('Odmianę'), de('sein'), pl('warto zapamiętać w rytmie:'), de('ich bin, du bist, er/sie ist, wir sind, ihr seid, sie/Sie sind.')]),
    germanNote('Podstawowe czasowniki', [
      ['heißen', 'nazywać się'], ['kommen', 'pochodzić / przychodzić'], ['wohnen', 'mieszkać'], ['sein', 'być'], ['haben', 'mieć'],
      ['Ich heiße Mia.', 'Mam na imię Mia.'], ['Ich komme aus Polen.', 'Pochodzę z Polski.'], ['Ich wohne in Łódź.', 'Mieszkam w Łodzi.'], ['Ich habe ein Buch.', 'Mam książkę.'],
    ], ['Wie heißt du? — Ich heiße Mia.', 'Jak masz na imię? — Mam na imię Mia.'], ['Ucz się czasownika w krótkim zdaniu. Wtedy łatwiej pamiętać, jak go użyć.'], undefined, [pl('Ucz się czasownika w krótkim zdaniu. Wtedy łatwiej pamiętać, jak go użyć.')]),
    germanNote('Państwa i pochodzenie', [
      ['Polen', 'Polska'], ['Deutschland', 'Niemcy'], ['Österreich', 'Austria'], ['die Schweiz', 'Szwajcaria'],
      ['polnisch', 'polski / polska'], ['deutsch', 'niemiecki / niemiecka'], ['österreichisch', 'austriacki / austriacka'], ['schweizerisch', 'szwajcarski / szwajcarska'],
      ['Ich komme aus Polen.', 'Pochodzę z Polski.'], ['Ich bin polnisch.', 'Jestem Polakiem / Polką.'],
    ], ['Er kommt aus Deutschland. Er ist deutsch.', 'On pochodzi z Niemiec. Jest Niemcem.'], ['Nazwy państw piszemy wielką literą. W zdaniu Ich komme aus Polen kraj też zaczyna się wielką literą.'], undefined, [pl('Nazwy państw piszemy wielką literą. W zdaniu'), de('Ich komme aus Polen'), pl('kraj też zaczyna się wielką literą.')]),
    germanNote('Krótki dialog', [
      ['A: Guten Tag! Wie heißt du?', 'A: Dzień dobry! Jak masz na imię?'], ['B: Hallo! Ich heiße Aleksander.', 'B: Cześć! Mam na imię Aleksander.'],
      ['A: Woher kommst du?', 'A: Skąd jesteś?'], ['B: Ich komme aus Polen. Wo wohnst du?', 'B: Pochodzę z Polski. Gdzie mieszkasz?'],
      ['A: Ich wohne in Berlin. Wie geht’s?', 'A: Mieszkam w Berlinie. Jak się masz?'], ['B: Gut, danke. Tschüss!', 'B: Dobrze, dziękuję. Pa!'],
    ], ['Bis bald!', 'Do zobaczenia wkrótce!'], ['Możesz zamienić imię, kraj, miasto i odpowiedź o samopoczuciu. Nie musisz uczyć się dialogu na pamięć słowo w słowo.'], undefined, [pl('Możesz zamienić imię, kraj, miasto i odpowiedź o samopoczuciu. Nie musisz uczyć się dialogu na pamięć słowo w słowo.')]),
  ],
  definitions: [
    { term: 'sein', termSpeechSegments: speech(de('sein')), meaning: 'Czasownik „być”.', meaningSpeechSegments: speech(pl('Czasownik „być”.')), example: 'ich bin — ja jestem', exampleSpeechSegments: germanPair('ich bin', 'ja jestem') },
    { term: 'heißen', termSpeechSegments: speech(de('heißen')), meaning: 'Czasownik „nazywać się”.', meaningSpeechSegments: speech(pl('Czasownik „nazywać się”.')), example: 'Ich heiße Mia. — Mam na imię Mia.', exampleSpeechSegments: germanPair('Ich heiße Mia.', 'Mam na imię Mia.') },
    { term: 'du', termSpeechSegments: speech(de('du')), meaning: 'Forma „ty”, używana nieoficjalnie.', meaningSpeechSegments: speech(pl('Forma „ty”, używana nieoficjalnie.')) },
    { term: 'Sie', termSpeechSegments: speech(de('Sie')), meaning: 'Grzeczna forma „Pan / Pani / Państwo”.', meaningSpeechSegments: speech(pl('Grzeczna forma „Pan / Pani / Państwo”.')) },
  ],
  importantFacts: [
    'Guten Morgen mówimy rano, Guten Tag w dzień, a Guten Abend wieczorem.',
    'Gute Nacht to pożegnanie przed snem.',
    'Pytamy Wie heißt du? i odpowiadamy Ich heiße…',
    'Odmiana sein: ich bin, du bist, er/sie ist, wir sind, ihr seid, sie/Sie sind.',
    'du jest nieformalne, a Sie grzecznościowe i zapisujemy je wielką literą.',
  ],
  importantFactsSpeechSegments: [
    speech(de('Guten Morgen'), pl('mówimy rano,'), de('Guten Tag'), pl('w dzień, a'), de('Guten Abend'), pl('wieczorem.')),
    speech(de('Gute Nacht'), pl('to pożegnanie przed snem.')),
    speech(pl('Pytamy'), de('Wie heißt du?'), pl('i odpowiadamy'), de('Ich heiße…')),
    speech(pl('Odmiana'), de('sein:'), de('ich bin, du bist, er/sie ist, wir sind, ihr seid, sie/Sie sind.')),
    speech(de('du'), pl('jest nieformalne, a'), de('Sie'), pl('grzecznościowe i zapisujemy je wielką literą.')),
  ],
  cheatSheet: [
    { title: 'Powitania i pożegnania', titleSpeechSegments: speech(pl('Powitania i pożegnania')), items: [
      { label: 'Guten Tag!', labelSpeechSegments: speech(de('Guten Tag!')), text: 'Dzień dobry!', textSpeechSegments: speech(pl('Dzień dobry!')) },
      { label: 'Hallo!', labelSpeechSegments: speech(de('Hallo!')), text: 'Cześć!', textSpeechSegments: speech(pl('Cześć!')) },
      { label: 'Auf Wiedersehen!', labelSpeechSegments: speech(de('Auf Wiedersehen!')), text: 'Do widzenia!', textSpeechSegments: speech(pl('Do widzenia!')) },
      { label: 'Tschüss! / Bis bald! / Bis morgen!', labelSpeechSegments: speech(de('Tschüss! / Bis bald! / Bis morgen!')), text: 'Pa! / Do zobaczenia wkrótce! / Do jutra!', textSpeechSegments: speech(pl('Pa! / Do zobaczenia wkrótce! / Do jutra!')) },
    ], remember: 'Gute Nacht! oznacza „Dobranoc!” i mówimy tak przed snem.', rememberSpeechSegments: speech(de('Gute Nacht!'), pl('oznacza „Dobranoc!” i mówimy tak przed snem.')) },
    { title: 'O sobie', titleSpeechSegments: speech(pl('O sobie')), items: [
      { label: 'Wie heißt du?', labelSpeechSegments: speech(de('Wie heißt du?')), text: 'Jak masz na imię?', textSpeechSegments: speech(pl('Jak masz na imię?')) },
      { label: 'Ich heiße…', labelSpeechSegments: speech(de('Ich heiße…')), text: 'Mam na imię…', textSpeechSegments: speech(pl('Mam na imię…')) },
      { label: 'Woher kommst du?', labelSpeechSegments: speech(de('Woher kommst du?')), text: 'Skąd jesteś?', textSpeechSegments: speech(pl('Skąd jesteś?')) },
      { label: 'Ich komme aus Polen.', labelSpeechSegments: speech(de('Ich komme aus Polen.')), text: 'Pochodzę z Polski.', textSpeechSegments: speech(pl('Pochodzę z Polski.')) },
      { label: 'Wo wohnst du? / Ich wohne in…', labelSpeechSegments: speech(de('Wo wohnst du? / Ich wohne in…')), text: 'Gdzie mieszkasz? / Mieszkam w…', textSpeechSegments: speech(pl('Gdzie mieszkasz? / Mieszkam w…')) },
    ] },
    { title: 'Samopoczucie i wiek', titleSpeechSegments: speech(pl('Samopoczucie i wiek')), items: [
      { label: 'Wie geht’s?', labelSpeechSegments: speech(de('Wie geht’s?')), text: 'Jak się masz?', textSpeechSegments: speech(pl('Jak się masz?')) },
      { label: 'Gut, danke. / Sehr gut. / Es geht. / Nicht so gut.', labelSpeechSegments: speech(de('Gut, danke. / Sehr gut. / Es geht. / Nicht so gut.')), text: 'Dobrze, dziękuję. / Bardzo dobrze. / Jakoś leci. / Niezbyt dobrze.', textSpeechSegments: speech(pl('Dobrze, dziękuję. / Bardzo dobrze. / Jakoś leci. / Niezbyt dobrze.')) },
      { label: 'Wie alt bist du?', labelSpeechSegments: speech(de('Wie alt bist du?')), text: 'Ile masz lat?', textSpeechSegments: speech(pl('Ile masz lat?')) },
      { label: 'Ich bin … Jahre alt.', labelSpeechSegments: speech(de('Ich bin … Jahre alt.')), text: 'Mam … lat.', textSpeechSegments: speech(pl('Mam … lat.')) },
    ] },
    { title: 'Liczby 0–20', titleSpeechSegments: speech(pl('Liczby 0–20')), items: [
      { label: '0–5', labelSpeechSegments: speech(pl('Zero–pięć')), text: 'null, eins, zwei, drei, vier, fünf', textSpeechSegments: speech(de('null, eins, zwei, drei, vier, fünf')) },
      { label: '6–10', labelSpeechSegments: speech(pl('Sześć–dziesięć')), text: 'sechs, sieben, acht, neun, zehn', textSpeechSegments: speech(de('sechs, sieben, acht, neun, zehn')) },
      { label: '11–15', labelSpeechSegments: speech(pl('Jedenaście–piętnaście')), text: 'elf, zwölf, dreizehn, vierzehn, fünfzehn', textSpeechSegments: speech(de('elf, zwölf, dreizehn, vierzehn, fünfzehn')) },
      { label: '16–20', labelSpeechSegments: speech(pl('Szesnaście–dwadzieścia')), text: 'sechzehn, siebzehn, achtzehn, neunzehn, zwanzig', textSpeechSegments: speech(de('sechzehn, siebzehn, achtzehn, neunzehn, zwanzig')) },
    ], remember: 'Zapamiętaj wyjątki: sechzehn (16) i siebzehn (17).', rememberSpeechSegments: speech(pl('Zapamiętaj wyjątki:'), de('sechzehn'), pl('(16) i'), de('siebzehn'), pl('(17).')) },
    { title: 'Czasownik sein – być', titleSpeechSegments: speech(de('sein'), pl('– być')), items: [
      { label: 'ich bin', labelSpeechSegments: speech(de('ich bin')), text: 'ja jestem', textSpeechSegments: speech(pl('ja jestem')) }, { label: 'du bist', labelSpeechSegments: speech(de('du bist')), text: 'ty jesteś', textSpeechSegments: speech(pl('ty jesteś')) },
      { label: 'er/sie ist', labelSpeechSegments: speech(de('er/sie ist')), text: 'on/ona jest', textSpeechSegments: speech(pl('on/ona jest')) }, { label: 'wir sind', labelSpeechSegments: speech(de('wir sind')), text: 'my jesteśmy', textSpeechSegments: speech(pl('my jesteśmy')) },
      { label: 'ihr seid', labelSpeechSegments: speech(de('ihr seid')), text: 'wy jesteście', textSpeechSegments: speech(pl('wy jesteście')) }, { label: 'sie/Sie sind', labelSpeechSegments: speech(de('sie/Sie sind')), text: 'oni są / Pan, Pani są', textSpeechSegments: speech(pl('oni są / Pan, Pani są')) },
    ], example: 'Ich bin elf Jahre alt. — Mam jedenaście lat.', exampleSpeechSegments: germanPair('Ich bin elf Jahre alt.', 'Mam jedenaście lat.') },
    { title: 'du czy Sie?', titleSpeechSegments: speech(de('du'), pl('czy'), de('Sie?')), rule: 'du mówimy do kolegi lub dziecka. Sie używamy grzecznościowo wobec dorosłych.', ruleSpeechSegments: speech(de('du'), pl('mówimy do kolegi lub dziecka.'), de('Sie'), pl('używamy grzecznościowo wobec dorosłych.')), remember: 'Grzecznościowe Sie zawsze zapisujemy wielką literą.', rememberSpeechSegments: speech(pl('Grzecznościowe'), de('Sie'), pl('zawsze zapisujemy wielką literą.')) },
  ],
  reviewExercises: [
    germanChoice('Co znaczy Guten Morgen?', [pl('Co znaczy'), de('Guten Morgen?')], ['Dobry wieczór', 'Dzień dobry rano', 'Dobranoc'], 1, [pl('Dzień dobry rano')], [de('Guten Morgen'), pl('mówimy rano.')]),
    germanChoice('Jak po niemiecku powiesz „Pa!”?', [pl('Jak po niemiecku powiesz „Pa!”?')], ['Tschüss!', 'Guten Abend!', 'Danke!'], 0, [de('Tschüss!')], [de('Tschüss'), pl('znaczy „Pa!”.')]),
    germanExercise('Wpisz po niemiecku: Dzień dobry!', [pl('Wpisz po niemiecku: Dzień dobry!')], ['Guten Tag!', 'Guten Tag'], [de('Guten Tag!')]),
    germanExercise('Uzupełnij: Auf Wieder____! (Do widzenia)', [pl('Uzupełnij: Do widzenia po niemiecku to'), de('Auf Wieder'), pl('____!')], ['sehen', 'Auf Wiedersehen', 'Auf Wiedersehen!'], [de('Auf Wiedersehen!')]),
    germanChoice('Które pytanie znaczy „Jak masz na imię?”?', [pl('Które pytanie znaczy „Jak masz na imię?”?')], ['Wie heißt du?', 'Wo wohnst du?', 'Wie geht’s?'], 0, [de('Wie heißt du?')], [de('Wie heißt du?'), pl('pyta o imię.')]),
    germanExercise('Odpowiedz: „Mam na imię Mia.”', [pl('Odpowiedz: „Mam na imię Mia.”')], ['Ich heiße Mia.', 'Ich heiße Mia'], [de('Ich heiße Mia.')]),
    germanChoice('Co znaczy Woher kommst du?', [pl('Co znaczy'), de('Woher kommst du?')], ['Gdzie mieszkasz?', 'Skąd jesteś?', 'Ile masz lat?'], 1, [pl('Skąd jesteś?')], [de('Woher kommst du?'), pl('pytamy o pochodzenie.')]),
    germanExercise('Uzupełnij: Ich komme ___ Polen.', [de('Ich komme ___ Polen.'), pl(' (Pochodzę z Polski.)')], ['aus'], [de('aus')]),
    germanChoice('Jak zapytasz „Gdzie mieszkasz?”?', [pl('Jak zapytasz „Gdzie mieszkasz?”?')], ['Wo wohnst du?', 'Wer bist du?', 'Wie alt bist du?'], 0, [de('Wo wohnst du?')], [de('Wo wohnst du?'), pl('pytamy o miejsce zamieszkania.')]),
    germanExercise('Napisz po niemiecku: Mieszkam w Berlinie.', [pl('Napisz po niemiecku: Mieszkam w Berlinie.')], ['Ich wohne in Berlin.', 'Ich wohne in Berlin'], [de('Ich wohne in Berlin.')]),
    germanChoice('Która odpowiedź znaczy „Bardzo dobrze”?', [pl('Która odpowiedź znaczy „Bardzo dobrze”?')], ['Es geht.', 'Sehr gut!', 'Nicht so gut.'], 1, [de('Sehr gut!')], [de('Sehr gut'), pl('to „bardzo dobrze”.')]),
    germanExercise('Wpisz po niemiecku: Jak się masz?', [pl('Wpisz po niemiecku: Jak się masz?')], ['Wie geht’s?', 'Wie geht es dir?', 'Wie gehts?'], [de('Wie geht es dir?')]),
    germanChoice('Jak jest po niemiecku „dwanaście”?', [pl('Jak jest po niemiecku „dwanaście”?')], ['zwölf', 'zwanzig', 'zehn'], 0, [de('zwölf')], [de('zwölf'), pl('to dwanaście.')]),
    germanExercise('Wpisz liczbę 17 po niemiecku.', [pl('Wpisz liczbę siedemnaście po niemiecku.')], ['siebzehn'], [de('siebzehn')]),
    germanChoice('Jak zapytasz o wiek?', [pl('Jak zapytasz o wiek?')], ['Wie alt bist du?', 'Wie heißt du?', 'Woher kommst du?'], 0, [de('Wie alt bist du?')], [de('Wie alt bist du?'), pl('znaczy „Ile masz lat?”.')]),
    germanExercise('Uzupełnij odpowiedź: Ich ___ elf Jahre alt.', [de('Ich ___ elf Jahre alt.')], ['bin'], [de('bin')]),
    germanChoice('Do kogo zwykle mówimy du?', [pl('Do kogo zwykle mówimy'), de('du?')], ['Do kolegi lub koleżanki', 'Zawsze do dyrektora', 'Do kilku dorosłych'], 0, [pl('Do kolegi lub koleżanki')], [de('du'), pl('jest formą nieoficjalną.')]),
    germanChoice('Który zapis jest grzecznościowy?', [pl('Który zapis jest grzecznościowy?')], ['du', 'Sie', 'ich'], 1, [de('Sie')], [de('Sie'), pl('to grzecznościowe „Pan / Pani”.')]),
    germanExercise('Uzupełnij odmianę sein: du ___.', [pl('Uzupełnij odmianę'), de('sein:'), de('du ___.')], ['bist'], [de('bist')]),
    germanChoice('Jak jest „my jesteśmy” po niemiecku?', [pl('Jak jest „my jesteśmy” po niemiecku?')], ['wir sind', 'ihr seid', 'sie sind'], 0, [de('wir sind')], [de('wir sind'), pl('znaczy „my jesteśmy”.')]),
    germanExercise('Jak po niemiecku jest „nazywać się”?', [pl('Jak po niemiecku jest „nazywać się”?')], ['heißen', 'heissen'], [de('heißen')]),
    germanChoice('Co znaczy Ich habe ein Buch?', [pl('Co znaczy'), de('Ich habe ein Buch?')], ['Mam książkę.', 'Jestem książką.', 'Mieszkam z książką.'], 0, [pl('Mam książkę.')], [de('Ich habe'), pl('to „mam”, a'), de('ein Buch'), pl('to „książkę”.')]),
    germanExercise('Połącz kraj i pochodzenie: Polen = ___ (po polsku)', [de('Polen'), pl('po polsku to…')], ['Polska'], [pl('Polska')]),
  ],
  quizQuestions: [
    germanQuizChoice('Co znaczy Guten Abend?', [pl('Co znaczy'), de('Guten Abend?')], ['Dobry wieczór', 'Dzień dobry rano', 'Do widzenia', 'Dobranoc'], 0, [pl('Dobry wieczór')], [de('Guten Abend'), pl('mówimy wieczorem.')], 'Łatwe'),
    germanQuizChoice('Jakie pożegnanie mówimy przed snem?', [pl('Jakie pożegnanie mówimy przed snem?')], ['Guten Tag!', 'Gute Nacht!', 'Bis bald!', 'Hallo!'], 1, [de('Gute Nacht!')], [de('Gute Nacht'), pl('znaczy „Dobranoc”.')], 'Łatwe'),
    germanQuizChoice('Jak zapytasz o imię kolegi?', [pl('Jak zapytasz o imię kolegi?')], ['Wie heißt du?', 'Wo wohnst du?', 'Wie geht’s?', 'Wie alt bist du?'], 0, [de('Wie heißt du?')], [de('Wie heißt du?'), pl('znaczy „Jak masz na imię?”.')], 'Łatwe'),
    germanQuizChoice('Wybierz poprawne: „Mam na imię Aleksander.”', [pl('Wybierz poprawne zdanie po niemiecku: „Mam na imię Aleksander.”')], ['Ich heiße Aleksander.', 'Ich komme Aleksander.', 'Ich bin heißen Aleksander.', 'Ich wohne Aleksander.'], 0, [de('Ich heiße Aleksander.')], [de('Ich heiße'), pl('znaczy „Mam na imię”.')], 'Łatwe'),
    germanQuizChoice('Co znaczy Woher kommst du?', [pl('Co znaczy'), de('Woher kommst du?')], ['Gdzie mieszkasz?', 'Skąd jesteś?', 'Jak się masz?', 'Ile masz lat?'], 1, [pl('Skąd jesteś?')], [de('Woher kommst du?'), pl('pytamy o pochodzenie.')], 'Łatwe'),
    germanQuizChoice('Uzupełnij: Ich komme ___ Polen.', [de('Uzupełnij: Ich komme ___ Polen.')], ['aus', 'in', 'bin', 'heiße'], 0, [de('aus')], [de('Ich komme aus Polen.'), pl('znaczy „Pochodzę z Polski”.')], 'Średnie'),
    germanQuizChoice('Jak zapytasz „Gdzie mieszkasz?”?', [pl('Jak zapytasz „Gdzie mieszkasz?”?')], ['Wo wohnst du?', 'Woher kommst du?', 'Wer bist du?', 'Wie heißt du?'], 0, [de('Wo wohnst du?')], [de('Wo wohnst du?'), pl('pytamy o miejsce zamieszkania.')], 'Łatwe'),
    germanQuizChoice('Która odpowiedź znaczy „Jakoś leci”?', [pl('Która odpowiedź znaczy „Jakoś leci”?')], ['Sehr gut.', 'Es geht.', 'Nicht so gut.', 'Guten Morgen.'], 1, [de('Es geht.')], [de('Es geht'), pl('znaczy „Jakoś leci”.')], 'Średnie'),
    germanQuizChoice('Co znaczy zwölf?', [pl('Co znaczy'), de('zwölf?')], ['Dwanaście', 'Szesnaście', 'Dwadzieścia', 'Dwa'], 0, [pl('Dwanaście')], [de('zwölf'), pl('to dwanaście.')], 'Łatwe'),
    germanQuizChoice('Jak jest 17 po niemiecku?', [pl('Jak jest siedemnaście po niemiecku?')], ['sieben', 'siebzehn', 'siebzig', 'sechzehn'], 1, [de('siebzehn')], [de('siebzehn'), pl('to siedemnaście.')], 'Średnie'),
    germanQuizChoice('Jak zapytasz o wiek?', [pl('Jak zapytasz o wiek?')], ['Wie alt bist du?', 'Wo wohnst du?', 'Wie geht es dir?', 'Woher kommst du?'], 0, [de('Wie alt bist du?')], [de('Wie alt bist du?'), pl('znaczy „Ile masz lat?”.')], 'Łatwe'),
    germanQuizChoice('Wybierz „Mam 10 lat.”', [pl('Wybierz zdanie „Mam 10 lat.”')], ['Ich bin zehn Jahre alt.', 'Ich habe zehn Jahre.', 'Ich heiße zehn.', 'Ich wohne zehn.'], 0, [de('Ich bin zehn Jahre alt.')], [pl('Wiek wyrażamy zwrotem'), de('Ich bin … Jahre alt.'), pl('.')], 'Średnie'),
    germanQuizChoice('Która forma znaczy „ty jesteś”?', [pl('Która forma znaczy „ty jesteś”?')], ['ich bin', 'du bist', 'er ist', 'wir sind'], 1, [de('du bist')], [de('du bist'), pl('znaczy „ty jesteś”.')], 'Średnie'),
    germanQuizChoice('Jak jest „wy jesteście” w odmianie sein?', [pl('Jak jest „wy jesteście” w odmianie'), de('sein?')], ['ihr seid', 'wir sind', 'sie sind', 'du bist'], 0, [de('ihr seid')], [de('ihr seid'), pl('znaczy „wy jesteście”.')], 'Średnie'),
    germanQuizChoice('Które zdanie oznacza „Mam książkę”?', [pl('Które zdanie oznacza „Mam książkę”?')], ['Ich habe ein Buch.', 'Ich bin ein Buch.', 'Ich wohne ein Buch.', 'Ich heiße ein Buch.'], 0, [de('Ich habe ein Buch.')], [de('haben'), pl('znaczy „mieć”.')], 'Trudniejsze'),
    germanQuizChoice('Z kim zwykle używamy du?', [pl('Z kim zwykle używamy'), de('du?')], ['Z kolegą', 'Z nieznanym dorosłym w oficjalnej rozmowie', 'Z grupą dorosłych zawsze', 'Tylko z nauczycielem'], 0, [pl('Z kolegą')], [de('du'), pl('jest formą nieformalną.')], 'Średnie'),
    germanQuizChoice('Co oznacza wielkie Sie?', [pl('Co oznacza wielkie'), de('Sie?')], ['Grzeczne Pan / Pani / Państwo', 'Tylko „ona”', '„Ty” do kolegi', '„Ja”'], 0, [pl('Grzeczne Pan / Pani / Państwo')], [de('Sie'), pl('z wielkiej litery to forma grzecznościowa.')], 'Średnie'),
    germanQuizChoice('Która para jest poprawna?', [pl('Która para jest poprawna?')], ['Polen — Polska', 'Deutschland — Austria', 'Österreich — Polska', 'Schweiz — Niemcy'], 0, [de('Polen —'), pl('Polska')], [de('Polen'), pl('to Polska.')], 'Średnie'),
    germanQuizOpen('Wpisz po niemiecku: Cześć!', [pl('Wpisz po niemiecku: Cześć!')], ['Hallo!', 'Hallo'], [de('Hallo!')], [de('Hallo!'), pl('znaczy „Cześć!”.')], 'Łatwe'),
    germanQuizOpen('Uzupełnij: Ich heiße ___. Wpisz swoje imię: Aleksander.', [de('Uzupełnij: Ich heiße ___. '), pl('Wpisz imię Aleksander.')], ['Aleksander', 'Aleksander.'], [de('Aleksander')], [de('Ich heiße Aleksander.'), pl('znaczy „Mam na imię Aleksander”.')], 'Łatwe'),
    germanQuizOpen('Napisz po niemiecku: Pochodzę z Polski.', [pl('Napisz po niemiecku: Pochodzę z Polski.')], ['Ich komme aus Polen.', 'Ich komme aus Polen'], [de('Ich komme aus Polen.')], [de('Ich komme aus Polen.'), pl('to „Pochodzę z Polski”.')], 'Średnie'),
    germanQuizOpen('Wpisz po niemiecku: Dobrze, dziękuję.', [pl('Wpisz po niemiecku: Dobrze, dziękuję.')], ['Gut, danke.', 'Gut danke', 'Gut, danke'], [de('Gut, danke.')], [de('Gut, danke.'), pl('to „Dobrze, dziękuję”.')], 'Średnie'),
    germanQuizOpen('Wpisz liczbę 20 po niemiecku.', [pl('Wpisz liczbę dwadzieścia po niemiecku.')], ['zwanzig'], [de('zwanzig')], [de('zwanzig'), pl('to dwadzieścia.')], 'Łatwe'),
    germanQuizOpen('Uzupełnij: wir ___. (sein – my jesteśmy)', [de('Uzupełnij: wir ___.'), pl('(sein – my jesteśmy)')], ['sind'], [de('sind')], [de('wir sind'), pl('znaczy „my jesteśmy”.')], 'Trudniejsze'),
  ],
};

// Stare testy zostają w quiz.questions. Tu dokładamy brakujące pytania, tak
// aby po połączeniu nadal było 12–14 zamkniętych oraz 6–8 otwartych.
const expandedLessons = window.NaukaZMamaExpandedContent;
const numbersLesson = expandedLessons['Porównywanie i zapisywanie liczb'];
numbersLesson.quizQuestions.splice(0, 2); // te dwa pytania już są w teście lekcji
numbersLesson.quizQuestions.splice(10, 2); // tak samo dwa dotychczasowe pytania otwarte

const englishLesson = expandedLessons['Step 2 – Warm up your brain! Powtórzenie nazw przedmiotów w klasie, produktów spożywczych, ubrań, miejsc w mieście'];
const extraEnglishQuestions = englishLesson.quizQuestions;
const englishQuizSpeech = {
  'Co znaczy cheese?': {
    speechSegments: speech(pl('Co znaczy'), en('cheese?')),
    answerSpeechSegments: speech(pl('ser')),
    explanationSpeechSegments: speech(en('Cheese'), pl('to ser.')),
  },
  'Wybierz poprawne zdanie: „Moje buty są niebieskie”.': {
    speechSegments: speech(pl('Wybierz poprawne zdanie: „Moje buty są niebieskie”.')),
    answerSpeechSegments: speech(en('My shoes are blue.')),
    explanationSpeechSegments: speech(en('Shoes'), pl('to liczba mnoga, więc mówimy'), en('are.')),
  },
  'Jak przetłumaczysz „I like milk”?': {
    speechSegments: speech(pl('Jak przetłumaczysz'), en('„I like milk”?')),
    answerSpeechSegments: speech(pl('Lubię mleko.')),
    explanationSpeechSegments: speech(en('I like'), pl('znaczy „Lubię”.')),
  },
  'Które zdanie znaczy „To jest moja książka”?': {
    speechSegments: speech(pl('Które zdanie znaczy „To jest moja książka”?')),
    answerSpeechSegments: speech(en('This is my book.')),
    explanationSpeechSegments: speech(en('This is…'), pl('znaczy „To jest…”.')),
  },
  'Wpisz po angielsku: banan.': {
    speechSegments: speech(pl('Wpisz po angielsku: banan.')),
    answerSpeechSegments: speech(en('banana')),
    explanationSpeechSegments: speech(en('Banana'), pl('to banan.')),
  },
  'Wpisz po angielsku: kino.': {
    speechSegments: speech(pl('Wpisz po angielsku: kino.')),
    answerSpeechSegments: speech(en('cinema')),
    explanationSpeechSegments: speech(en('Cinema'), pl('to kino.')),
  },
};
englishLesson.quizQuestions = [extraEnglishQuestions[2], extraEnglishQuestions[3], extraEnglishQuestions[12], extraEnglishQuestions[17], extraEnglishQuestions[5], extraEnglishQuestions[11]]
  .map((question) => ({ ...question, promptLanguage: 'pl-PL', explanationLanguage: 'pl-PL', ...englishQuizSpeech[question.question] }));
