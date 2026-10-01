/**
 * Katalog treści aplikacji. Dodawaj kolejne lekcje jako obiekty w tablicy
 * lessons danego przedmiotu. Pola quiz i cheatFacts są opcjonalne.
 */
const subjectCatalog = [
  { id: 'polski', name: 'Język polski', speechLanguage: 'pl-PL', icon: '📖', color: '#eaa27d', lessons: [] },
  { id: 'angielski', name: 'Język angielski', speechLanguage: 'en-GB', icon: '🔤', color: '#7da8d8', lessons: [
    {
      title: 'Step 2 – Warm up your brain! Powtórzenie nazw przedmiotów w klasie, produktów spożywczych, ubrań, miejsc w mieście',
      speechLanguage: 'en-GB',
      titleSpeechSegments: [
        { text: 'Step 2 – Warm up your brain!', lang: 'en-GB' },
        { text: 'Powtórzenie nazw przedmiotów w klasie, produktów spożywczych, ubrań, miejsc w mieście', lang: 'pl-PL' },
      ],
      summary: 'Powtórz nazwy rzeczy w klasie, jedzenia, ubrań i miejsc w mieście. Czytaj słówko na głos i powiedz, co znaczy po polsku.',
      summarySpeechSegments: [{ text: 'Powtórz nazwy rzeczy w klasie, jedzenia, ubrań i miejsc w mieście. Czytaj słówko na głos i powiedz, co znaczy po polsku.', lang: 'pl-PL' }],
      sections: [
        {
          title: 'Classroom objects — rzeczy w klasie',
          titleSpeechSegments: [{ text: 'Classroom objects —', lang: 'en-GB' }, { text: 'rzeczy w klasie', lang: 'pl-PL' }],
          vocabulary: [
            { en: 'book', pl: 'książka' }, { en: 'pen', pl: 'długopis' }, { en: 'pencil', pl: 'ołówek' },
            { en: 'ruler', pl: 'linijka' }, { en: 'rubber', pl: 'gumka' }, { en: 'school bag', pl: 'plecak szkolny' },
          ],
          examples: [
            { en: 'This is my book.', pl: 'To jest moja książka.' },
            { en: 'I have a blue pen.', pl: 'Mam niebieski długopis.' },
          ],
        },
        {
          title: 'Food — jedzenie',
          titleSpeechSegments: [{ text: 'Food —', lang: 'en-GB' }, { text: 'jedzenie', lang: 'pl-PL' }],
          vocabulary: [
            { en: 'apple', pl: 'jabłko' }, { en: 'banana', pl: 'banan' }, { en: 'bread', pl: 'chleb' },
            { en: 'cheese', pl: 'ser' }, { en: 'milk', pl: 'mleko' }, { en: 'sandwich', pl: 'kanapka' },
          ],
          examples: [
            { en: 'I like apples and bananas.', pl: 'Lubię jabłka i banany.' },
            { en: 'I have a cheese sandwich.', pl: 'Mam kanapkę z serem.' },
          ],
        },
        {
          title: 'Clothes — ubrania',
          titleSpeechSegments: [{ text: 'Clothes —', lang: 'en-GB' }, { text: 'ubrania', lang: 'pl-PL' }],
          vocabulary: [
            { en: 'T-shirt', pl: 'koszulka' }, { en: 'trousers', pl: 'spodnie' }, { en: 'shoes', pl: 'buty' },
            { en: 'jacket', pl: 'kurtka' }, { en: 'dress', pl: 'sukienka' }, { en: 'socks', pl: 'skarpetki' },
          ],
          examples: [
            { en: 'My T-shirt is green.', pl: 'Moja koszulka jest zielona.' },
            { en: 'Put on your jacket.', pl: 'Załóż swoją kurtkę.' },
          ],
        },
        {
          title: 'Places in town — miejsca w mieście',
          titleSpeechSegments: [{ text: 'Places in town —', lang: 'en-GB' }, { text: 'miejsca w mieście', lang: 'pl-PL' }],
          vocabulary: [
            { en: 'school', pl: 'szkoła' }, { en: 'park', pl: 'park' }, { en: 'shop', pl: 'sklep' },
            { en: 'library', pl: 'biblioteka' }, { en: 'cinema', pl: 'kino' }, { en: 'bus stop', pl: 'przystanek autobusowy' },
          ],
          examples: [
            { en: 'The park is near my school.', pl: 'Park jest blisko mojej szkoły.' },
            { en: 'I borrow books at the library.', pl: 'Wypożyczam książki w bibliotece.' },
          ],
        },
      ],
      cheatFacts: [
        'book — książka · pen — długopis · pencil — ołówek · ruler — linijka · rubber — gumka',
        'apple — jabłko · bread — chleb · cheese — ser · milk — mleko · sandwich — kanapka',
        'T-shirt — koszulka · trousers — spodnie · shoes — buty · jacket — kurtka · socks — skarpetki',
        'park — park · shop — sklep · library — biblioteka · cinema — kino · bus stop — przystanek autobusowy',
      ],
      cheatFactSpeechSegments: [
        [{ text: 'book —', lang: 'en-GB' }, { text: 'książka ·', lang: 'pl-PL' }, { text: 'pen —', lang: 'en-GB' }, { text: 'długopis ·', lang: 'pl-PL' }, { text: 'pencil —', lang: 'en-GB' }, { text: 'ołówek ·', lang: 'pl-PL' }, { text: 'ruler —', lang: 'en-GB' }, { text: 'linijka ·', lang: 'pl-PL' }, { text: 'rubber —', lang: 'en-GB' }, { text: 'gumka', lang: 'pl-PL' }],
        [{ text: 'apple —', lang: 'en-GB' }, { text: 'jabłko ·', lang: 'pl-PL' }, { text: 'bread —', lang: 'en-GB' }, { text: 'chleb ·', lang: 'pl-PL' }, { text: 'cheese —', lang: 'en-GB' }, { text: 'ser ·', lang: 'pl-PL' }, { text: 'milk —', lang: 'en-GB' }, { text: 'mleko ·', lang: 'pl-PL' }, { text: 'sandwich —', lang: 'en-GB' }, { text: 'kanapka', lang: 'pl-PL' }],
        [{ text: 'T-shirt —', lang: 'en-GB' }, { text: 'koszulka ·', lang: 'pl-PL' }, { text: 'trousers —', lang: 'en-GB' }, { text: 'spodnie ·', lang: 'pl-PL' }, { text: 'shoes —', lang: 'en-GB' }, { text: 'buty ·', lang: 'pl-PL' }, { text: 'jacket —', lang: 'en-GB' }, { text: 'kurtka ·', lang: 'pl-PL' }, { text: 'socks —', lang: 'en-GB' }, { text: 'skarpetki', lang: 'pl-PL' }],
        [{ text: 'park —', lang: 'en-GB' }, { text: 'park ·', lang: 'pl-PL' }, { text: 'shop —', lang: 'en-GB' }, { text: 'sklep ·', lang: 'pl-PL' }, { text: 'library —', lang: 'en-GB' }, { text: 'biblioteka ·', lang: 'pl-PL' }, { text: 'cinema —', lang: 'en-GB' }, { text: 'kino ·', lang: 'pl-PL' }, { text: 'bus stop —', lang: 'en-GB' }, { text: 'przystanek autobusowy', lang: 'pl-PL' }],
      ],
      reviewExercises: [
        { prompt: 'Jak powiesz po angielsku „ołówek”?', promptLanguage: 'pl-PL', acceptedAnswers: ['pencil'], hint: 'Zaczyna się na literę p.' },
        { prompt: 'Jak powiesz po angielsku „jabłko”?', promptLanguage: 'pl-PL', acceptedAnswers: ['apple'], hint: 'To owoc, który często jest czerwony lub zielony.' },
        { prompt: 'Jak powiesz po angielsku „kurtka”?', promptLanguage: 'pl-PL', acceptedAnswers: ['jacket'], hint: 'Zakładasz ją, gdy jest chłodno.' },
        { prompt: 'Jak powiesz po angielsku „biblioteka”?', promptLanguage: 'pl-PL', acceptedAnswers: ['library'], hint: 'To miejsce, gdzie można wypożyczyć książki.' },
      ],
      quiz: {
        questions: [
          { type: 'choice', question: 'Co znaczy ruler?', promptLanguage: 'pl-PL', speechSegments: [{ text: 'Co znaczy', lang: 'pl-PL' }, { text: 'ruler?', lang: 'en-GB' }], answers: ['linijka', 'plecak', 'książka', 'gumka'], correct: 0, answerSpeechSegments: [{ text: 'linijka', lang: 'pl-PL' }], explanation: 'Ruler to linijka.', explanationSpeechSegments: [{ text: 'Ruler', lang: 'en-GB' }, { text: 'to linijka.', lang: 'pl-PL' }] },
          { type: 'choice', question: 'Czym piszesz w zeszycie?', promptLanguage: 'pl-PL', answers: ['a banana', 'a pencil', 'a shop', 'a jacket'], correct: 1, answerSpeechSegments: [{ text: 'a pencil', lang: 'en-GB' }], explanationSpeechSegments: [{ text: 'A pencil', lang: 'en-GB' }, { text: 'to ołówek — możesz nim pisać w zeszycie.', lang: 'pl-PL' }] },
          { type: 'open', question: 'Wpisz po angielsku: ołówek.', promptLanguage: 'pl-PL', acceptedAnswers: ['pencil'], answerSpeechSegments: [{ text: 'pencil', lang: 'en-GB' }], explanation: 'Ołówek po angielsku to pencil.', explanationSpeechSegments: [{ text: 'Ołówek po angielsku to', lang: 'pl-PL' }, { text: 'pencil.', lang: 'en-GB' }] },
          { type: 'open', question: 'Wpisz po angielsku: plecak szkolny.', promptLanguage: 'pl-PL', acceptedAnswers: ['school bag', 'backpack'], answerSpeechSegments: [{ text: 'school bag albo backpack', lang: 'en-GB' }], explanation: 'Możesz powiedzieć school bag albo backpack.', explanationSpeechSegments: [{ text: 'Możesz powiedzieć', lang: 'pl-PL' }, { text: 'school bag albo backpack.', lang: 'en-GB' }] },
          { type: 'choice', question: 'Które słówko oznacza chleb?', promptLanguage: 'pl-PL', answers: ['milk', 'cheese', 'bread', 'apple'], correct: 2, answerSpeechSegments: [{ text: 'bread', lang: 'en-GB' }], explanation: 'Bread to chleb.', explanationSpeechSegments: [{ text: 'Bread', lang: 'en-GB' }, { text: 'to chleb.', lang: 'pl-PL' }] },
          { type: 'open', question: 'Wpisz po angielsku: chleb.', promptLanguage: 'pl-PL', acceptedAnswers: ['bread'], answerSpeechSegments: [{ text: 'bread', lang: 'en-GB' }], explanation: 'Chleb po angielsku to bread.', explanationSpeechSegments: [{ text: 'Chleb po angielsku to', lang: 'pl-PL' }, { text: 'bread.', lang: 'en-GB' }] },
          { type: 'choice', question: 'Co znaczy jacket?', promptLanguage: 'pl-PL', speechSegments: [{ text: 'Co znaczy', lang: 'pl-PL' }, { text: 'jacket?', lang: 'en-GB' }], answers: ['skarpetki', 'kurtka', 'sukienka', 'buty'], correct: 1, answerSpeechSegments: [{ text: 'kurtka', lang: 'pl-PL' }], explanation: 'Jacket to kurtka.', explanationSpeechSegments: [{ text: 'Jacket', lang: 'en-GB' }, { text: 'to kurtka.', lang: 'pl-PL' }] },
          { type: 'choice', question: 'Które słówko oznacza spodnie?', promptLanguage: 'pl-PL', answers: ['shoes', 'T-shirt', 'trousers', 'dress'], correct: 2, answerSpeechSegments: [{ text: 'trousers', lang: 'en-GB' }], explanation: 'Trousers to spodnie.', explanationSpeechSegments: [{ text: 'Trousers', lang: 'en-GB' }, { text: 'to spodnie.', lang: 'pl-PL' }] },
          { type: 'open', question: 'Wpisz po angielsku: sukienka.', promptLanguage: 'pl-PL', acceptedAnswers: ['dress'], answerSpeechSegments: [{ text: 'dress', lang: 'en-GB' }], explanation: 'Sukienka po angielsku to dress.', explanationSpeechSegments: [{ text: 'Sukienka po angielsku to', lang: 'pl-PL' }, { text: 'dress.', lang: 'en-GB' }] },
          { type: 'choice', question: 'Gdzie wypożyczysz książkę?', promptLanguage: 'pl-PL', answers: ['at the library', 'at the bus stop', 'at the cinema', 'at the shop'], correct: 0, answerSpeechSegments: [{ text: 'at the library', lang: 'en-GB' }], explanation: 'W bibliotece — at the library — można wypożyczyć książkę.', explanationSpeechSegments: [{ text: 'W bibliotece —', lang: 'pl-PL' }, { text: 'at the library', lang: 'en-GB' }, { text: '— można wypożyczyć książkę.', lang: 'pl-PL' }] },
          { type: 'choice', question: 'Co znaczy bus stop?', promptLanguage: 'pl-PL', speechSegments: [{ text: 'Co znaczy', lang: 'pl-PL' }, { text: 'bus stop?', lang: 'en-GB' }], answers: ['park', 'przystanek autobusowy', 'kino', 'sklep'], correct: 1, answerSpeechSegments: [{ text: 'przystanek autobusowy', lang: 'pl-PL' }], explanation: 'Bus stop to przystanek autobusowy.', explanationSpeechSegments: [{ text: 'Bus stop', lang: 'en-GB' }, { text: 'to przystanek autobusowy.', lang: 'pl-PL' }] },
          { type: 'open', question: 'Wpisz po angielsku: park.', promptLanguage: 'pl-PL', acceptedAnswers: ['park'], answerSpeechSegments: [{ text: 'park', lang: 'en-GB' }], explanation: 'Park po angielsku to park.', explanationSpeechSegments: [{ text: 'Park po angielsku to', lang: 'pl-PL' }, { text: 'park.', lang: 'en-GB' }] },
          { type: 'choice', question: 'Co znaczy rubber?', promptLanguage: 'pl-PL', speechSegments: [{ text: 'Co znaczy', lang: 'pl-PL' }, { text: 'rubber?', lang: 'en-GB' }], answers: ['gumka', 'książka', 'mleko', 'buty'], correct: 0, answerSpeechSegments: [{ text: 'gumka', lang: 'pl-PL' }], explanation: 'Rubber to gumka do ścierania.', explanationSpeechSegments: [{ text: 'Rubber', lang: 'en-GB' }, { text: 'to gumka do ścierania.', lang: 'pl-PL' }] },
          { type: 'open', question: 'Wpisz po angielsku: przystanek autobusowy.', promptLanguage: 'pl-PL', acceptedAnswers: ['bus stop'], answerSpeechSegments: [{ text: 'bus stop', lang: 'en-GB' }], explanation: 'Przystanek autobusowy po angielsku to bus stop.', explanationSpeechSegments: [{ text: 'Przystanek autobusowy po angielsku to', lang: 'pl-PL' }, { text: 'bus stop.', lang: 'en-GB' }] },
        ],
      },
    },
  ] },
  { id: 'niemiecki', name: 'Język niemiecki', speechLanguage: 'de-DE', icon: '💬', color: '#dda85c', lessons: [] },
  { id: 'matematyka', name: 'Matematyka', speechLanguage: 'pl-PL', icon: '🔢', color: '#7fb79a', lessons: [
    {
      title: 'Ułamki zwykłe',
      summary: 'Ułamek pokazuje, na ile równych części podzielono całość i ile z nich bierzemy. Licznik jest na górze, a mianownik na dole.',
      examples: 'W ułamku ¾ mianownik 4 mówi o czterech równych częściach, a licznik 3 — że bierzemy trzy z nich.',
      quiz: { question: 'Który ułamek oznacza połowę?', answers: ['⅓', '½', '⅔', '¼'], correct: 1, explanation: 'Połowa to jedna z dwóch równych części, czyli ½.' },
      cheatFacts: ['Mianownik mówi, na ile równych części podzielono całość.', 'Licznik mówi, ile części bierzemy.', 'Ułamek ½ to połowa, a ¼ to jedna czwarta.'],
    },
    {
      title: 'Kolejność działań',
      summary: 'Najpierw wykonujemy działania w nawiasach. Potem mnożenie i dzielenie, a na końcu dodawanie i odejmowanie.',
      examples: 'W działaniu 3 + 2 × 4 najpierw mnożymy: 2 × 4 = 8. Potem dodajemy 3. Wynik to 11.',
      quiz: { question: 'Ile wynosi 3 + 2 × 4?', answers: ['20', '11', '14', '24'], correct: 1, explanation: 'Najpierw mnożenie: 2 × 4 = 8, a potem 3 + 8 = 11.' },
      cheatFacts: ['1. Nawiasy', '2. Mnożenie i dzielenie (od lewej do prawej)', '3. Dodawanie i odejmowanie (od lewej do prawej)'],
    },
    {
      title: 'Porównywanie i zapisywanie liczb',
      summary: 'Liczby możemy zapisywać cyframi albo słowami. Żeby je porównać, najpierw sprawdź, ile mają cyfr. Jeśli tyle samo — porównuj cyfry od lewej strony, czyli od największego rzędu. Znak < oznacza „mniejsze”, > — „większe”, a = — „równe”.',
      examples: '508 321 > 508 123, bo obie liczby mają sześć cyfr, a w setkach 3 jest większe niż 1. „Trzysta dwa tysiące pięćdziesiąt cztery” zapisujemy cyframi jako 302 054.',
      cheatFacts: ['Więcej cyfr oznacza większą liczbę: 98 765 > 9 876.', 'Gdy liczby mają tyle samo cyfr, porównuj je od lewej do prawej.', 'Znak < czytamy „mniejsze”, > — „większe”, a = — „równe”.', 'Dla czytelności oddzielaj grupy trzech cyfr spacją, licząc od prawej strony.'],
      quiz: {
        questions: [
          {
            type: 'choice',
            question: 'Która liczba jest największa?',
            answers: ['405 612', '450 612', '405 621', '450 621'],
            correct: 3,
            explanation: '450 621 jest największa. Ma tyle samo cyfr co 450 612, ale w setkach 6 jest większe niż 1.',
          },
          {
            type: 'choice',
            question: 'Wybierz prawidłowy znak: 73 405 __ 73 450',
            answers: ['<', '>', '=', 'Nie da się porównać'],
            correct: 0,
            explanation: '73 405 jest mniejsze niż 73 450, więc wstawiamy znak <.',
          },
          {
            type: 'open',
            question: 'Zapisz cyframi: „dwieście czterdzieści tysięcy siedemnaście”.',
            acceptedAnswers: ['240 017', '240017'],
            explanation: 'To 240 017: po 240 tysiącach zapisujemy jeszcze 17.',
          },
          {
            type: 'open',
            question: 'Wpisz znak <, > albo =: 82 099 __ 82 100',
            acceptedAnswers: ['<'],
            explanation: '82 099 jest o 1 mniejsze od 82 100, więc poprawny znak to <.',
          },
        ],
      },
    },
  ] },
  { id: 'historia', name: 'Historia', speechLanguage: 'pl-PL', icon: '🏰', color: '#bd9a78', lessons: [] },
  { id: 'geografia', name: 'Geografia', speechLanguage: 'pl-PL', icon: '🌍', color: '#65b6b3', lessons: [] },
  { id: 'biologia', name: 'Biologia', speechLanguage: 'pl-PL', icon: '🌿', color: '#7cb879', lessons: [] },
  { id: 'technika', name: 'Technika', speechLanguage: 'pl-PL', icon: '🛠️', color: '#8a9ab7', lessons: [] },
  { id: 'plastyka', name: 'Plastyka', speechLanguage: 'pl-PL', icon: '🎨', color: '#ce85a7', lessons: [] },
];

// Dane są globalne, aby aplikacja działała także po otwarciu index.html z dysku.
window.NaukaZMamaSubjects = subjectCatalog;
