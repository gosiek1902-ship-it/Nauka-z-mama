/* Rozszerzenia lekcji. Klucze są pełnymi tytułami, a dotychczasowe dane
   w subjects.js pozostają nienaruszone i są łączone z tym materiałem. */
let nextDifficulty = 0;
const difficulty = () => ['Łatwe', 'Średnie', 'Trudniejsze'][nextDifficulty++ % 3];
const choice = (question, answers, correct, explanation, level = difficulty()) => ({ type: 'choice', question, answers, correct, explanation, level });
const open = (question, acceptedAnswers, explanation, level = difficulty()) => ({ type: 'open', question, acceptedAnswers, explanation, level });

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
    detailedNotes: [
      { title: '1. Rzeczy w klasie — classroom objects', points: ['book — książka; pen — długopis; pencil — ołówek.', 'ruler — linijka; rubber — gumka; school bag — plecak szkolny.', 'Mówimy a przed wyrazem zaczynającym się od spółgłoski, np. a book.'], example: 'This is my book. — To jest moja książka. I have a blue pen. — Mam niebieski długopis.', remember: 'Pencil to ołówek, a pen to długopis.' },
      { title: '2. Jedzenie — food', points: ['apple — jabłko; banana — banan; bread — chleb.', 'cheese — ser; milk — mleko; sandwich — kanapka.', 'I like… znaczy „Lubię…”. Do apple w liczbie mnogiej dodajemy -s: apples.'], example: 'I like apples. — Lubię jabłka. I have a cheese sandwich. — Mam kanapkę z serem.' },
      { title: '3. Ubrania — clothes', points: ['T-shirt — koszulka; trousers — spodnie; shoes — buty.', 'jacket — kurtka; dress — sukienka; socks — skarpetki.', 'Nazwy trousers i shoes zwykle występują w liczbie mnogiej.', 'My … is … opisuje jedną rzecz: My T-shirt is green.'], example: 'Put on your jacket. — Załóż kurtkę. My shoes are blue. — Moje buty są niebieskie.', remember: 'Przy trousers i shoes używamy are, np. My trousers are black.' },
      { title: '4. Miejsca w mieście — places in town', points: ['school — szkoła; park — park; shop — sklep.', 'library — biblioteka; cinema — kino; bus stop — przystanek autobusowy.', 'near znaczy „blisko”, at the library — „w bibliotece”.'], example: 'The park is near my school. — Park jest blisko mojej szkoły. I read at the library. — Czytam w bibliotece.' },
      { title: '5. Krótkie zdania', points: ['This is… — To jest…', 'I have… — Mam…', 'I like… — Lubię…', 'My … is… — Mój/Moja… jest…', 'Where is…? — Gdzie jest…?'], example: 'Where is the bus stop? — Gdzie jest przystanek autobusowy? It is near the shop. — Jest blisko sklepu.', remember: 'Ułóż zdanie z osobą/rzeczą, czasownikiem i resztą informacji. Czytaj je na głos.' },
    ],
    definitions: [
      { term: 'Classroom objects', meaning: 'Przedmioty, których używamy w klasie.', example: 'book, pencil, ruler' },
      { term: 'Food', meaning: 'Jedzenie i produkty spożywcze.', example: 'apple, bread, milk' },
      { term: 'Clothes', meaning: 'Ubrania i rzeczy, które nosimy.', example: 'jacket, dress, shoes' },
      { term: 'Places in town', meaning: 'Miejsca, które można znaleźć w mieście.', example: 'park, shop, library' },
      { term: 'Near', meaning: 'Po angielsku „blisko”.', example: 'The park is near my school.' },
    ],
    importantFacts: ['pencil = ołówek, pen = długopis.', 'bread = chleb, cheese = ser, milk = mleko.', 'trousers = spodnie, shoes = buty; używamy z nimi are.', 'library = biblioteka, bus stop = przystanek autobusowy.', 'I like… = Lubię…, I have… = Mam…'],
    cheatSheet: [
      { title: 'Classroom objects · klasa', items: [{ label: 'book', text: 'książka' }, { label: 'pen / pencil', text: 'długopis / ołówek' }, { label: 'ruler / rubber', text: 'linijka / gumka' }, { label: 'school bag', text: 'plecak szkolny' }], remember: 'Pen to długopis, pencil to ołówek.' },
      { title: 'Food · jedzenie', items: [{ label: 'apple / banana', text: 'jabłko / banan' }, { label: 'bread / cheese', text: 'chleb / ser' }, { label: 'milk / sandwich', text: 'mleko / kanapka' }], example: 'I like apples. — Lubię jabłka.' },
      { title: 'Clothes · ubrania', items: [{ label: 'T-shirt / jacket', text: 'koszulka / kurtka' }, { label: 'trousers / shoes', text: 'spodnie / buty' }, { label: 'dress / socks', text: 'sukienka / skarpetki' }], remember: 'Trousers i shoes łączymy z are.' },
      { title: 'Places in town · miasto', items: [{ label: 'school / park', text: 'szkoła / park' }, { label: 'shop / library', text: 'sklep / biblioteka' }, { label: 'cinema / bus stop', text: 'kino / przystanek autobusowy' }], example: 'The park is near my school. — Park jest blisko mojej szkoły.' },
      { title: 'Przydatne konstrukcje', items: [{ label: 'This is…', text: 'To jest…' }, { label: 'I have…', text: 'Mam…' }, { label: 'I like…', text: 'Lubię…' }, { label: 'near', text: 'blisko' }] },
    ],
    reviewExercises: [
      { type: 'choice', prompt: 'Co znaczy ruler?', options: ['linijka', 'plecak', 'książka'], correct: 0, hint: 'To przyrząd do mierzenia i rysowania prostych linii.' },
      { type: 'blank', prompt: 'Uzupełnij: apple — ____.', acceptedAnswers: ['jabłko'], hint: 'To owoc czerwony lub zielony.' },
      { type: 'truefalse', prompt: 'Trousers znaczy „spodnie”.', correct: 0, options: ['Prawda', 'Fałsz'], hint: 'To ubranie noszone na nogach.' },
      { type: 'translate', prompt: 'Przetłumacz na angielski: biblioteka.', acceptedAnswers: ['library'], hint: 'Można tam wypożyczyć książki.' },
      { type: 'complete', prompt: 'Uzupełnij zdanie: The park is ___ my school. (blisko)', acceptedAnswers: ['near'], hint: 'To krótkie słowo oznacza „blisko”.' },
      { type: 'open', prompt: 'Napisz po angielsku jedno zdanie z I like i nazwą jedzenia.', acceptedAnswers: ['i like apples', 'i like bananas', 'i like bread', 'i like cheese', 'i like milk'], hint: 'I like znaczy „Lubię”.' },
      { type: 'translate', prompt: 'Przetłumacz: I have a blue pen.', acceptedAnswers: ['mam niebieski długopis', 'mam niebieskie pióro'], hint: 'I have znaczy „Mam”.' },
      { type: 'choice', prompt: 'Które słowo oznacza miejsce w mieście?', options: ['socks', 'library', 'cheese'], correct: 1, hint: 'To miejsce, gdzie wypożyczamy książki.' },
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

// Stare testy zostają w quiz.questions. Tu dokładamy brakujące pytania, tak
// aby po połączeniu nadal było 12–14 zamkniętych oraz 6–8 otwartych.
const expandedLessons = window.NaukaZMamaExpandedContent;
const numbersLesson = expandedLessons['Porównywanie i zapisywanie liczb'];
numbersLesson.quizQuestions.splice(0, 2); // te dwa pytania już są w teście lekcji
numbersLesson.quizQuestions.splice(10, 2); // tak samo dwa dotychczasowe pytania otwarte

const englishLesson = expandedLessons['Step 2 – Warm up your brain! Powtórzenie nazw przedmiotów w klasie, produktów spożywczych, ubrań, miejsc w mieście'];
const extraEnglishQuestions = englishLesson.quizQuestions;
englishLesson.quizQuestions = [extraEnglishQuestions[2], extraEnglishQuestions[3], extraEnglishQuestions[12], extraEnglishQuestions[17], extraEnglishQuestions[5], extraEnglishQuestions[11]];
