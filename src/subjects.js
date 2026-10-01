/**
 * Katalog treści aplikacji. Dodawaj kolejne lekcje jako obiekty w tablicy
 * lessons danego przedmiotu. Pola quiz i cheatFacts są opcjonalne.
 */
const subjectCatalog = [
  { id: 'polski', name: 'Język polski', icon: '📖', color: '#eaa27d', lessons: [] },
  { id: 'angielski', name: 'Język angielski', icon: '🔤', color: '#7da8d8', lessons: [
    {
      title: 'Step 2 – Warm up your brain! Powtórzenie nazw przedmiotów w klasie, produktów spożywczych, ubrań, miejsc w mieście',
      summary: 'Powtórz nazwy rzeczy w klasie, jedzenia, ubrań i miejsc w mieście. Czytaj słówko na głos i powiedz, co znaczy po polsku.',
      sections: [
        {
          title: 'Classroom objects — rzeczy w klasie',
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
      reviewExercises: [
        { prompt: 'Jak powiesz po angielsku „ołówek”?', acceptedAnswers: ['pencil'], hint: 'Zaczyna się na literę p.' },
        { prompt: 'Jak powiesz po angielsku „jabłko”?', acceptedAnswers: ['apple'], hint: 'To owoc, który często jest czerwony lub zielony.' },
        { prompt: 'Jak powiesz po angielsku „kurtka”?', acceptedAnswers: ['jacket'], hint: 'Zakładasz ją, gdy jest chłodno.' },
        { prompt: 'Jak powiesz po angielsku „biblioteka”?', acceptedAnswers: ['library'], hint: 'To miejsce, gdzie można wypożyczyć książki.' },
      ],
      quiz: {
        questions: [
          { type: 'choice', question: 'Co znaczy ruler?', answers: ['linijka', 'plecak', 'książka', 'gumka'], correct: 0, explanation: 'Ruler to linijka.' },
          { type: 'choice', question: 'Czym piszesz w zeszycie?', answers: ['a banana', 'a pencil', 'a shop', 'a jacket'], correct: 1, explanation: 'A pencil to ołówek — możesz nim pisać w zeszycie.' },
          { type: 'open', question: 'Wpisz po angielsku: ołówek.', acceptedAnswers: ['pencil'], explanation: 'Ołówek po angielsku to pencil.' },
          { type: 'open', question: 'Wpisz po angielsku: plecak szkolny.', acceptedAnswers: ['school bag', 'backpack'], explanation: 'Możesz powiedzieć school bag albo backpack.' },
          { type: 'choice', question: 'Które słówko oznacza chleb?', answers: ['milk', 'cheese', 'bread', 'apple'], correct: 2, explanation: 'Bread to chleb.' },
          { type: 'open', question: 'Wpisz po angielsku: chleb.', acceptedAnswers: ['bread'], explanation: 'Chleb po angielsku to bread.' },
          { type: 'choice', question: 'Co znaczy jacket?', answers: ['skarpetki', 'kurtka', 'sukienka', 'buty'], correct: 1, explanation: 'Jacket to kurtka.' },
          { type: 'choice', question: 'Które słówko oznacza spodnie?', answers: ['shoes', 'T-shirt', 'trousers', 'dress'], correct: 2, explanation: 'Trousers to spodnie.' },
          { type: 'open', question: 'Wpisz po angielsku: sukienka.', acceptedAnswers: ['dress'], explanation: 'Sukienka po angielsku to dress.' },
          { type: 'choice', question: 'Gdzie wypożyczysz książkę?', answers: ['at the library', 'at the bus stop', 'at the cinema', 'at the shop'], correct: 0, explanation: 'W bibliotece — at the library — można wypożyczyć książkę.' },
          { type: 'choice', question: 'Co znaczy bus stop?', answers: ['park', 'przystanek autobusowy', 'kino', 'sklep'], correct: 1, explanation: 'Bus stop to przystanek autobusowy.' },
          { type: 'open', question: 'Wpisz po angielsku: park.', acceptedAnswers: ['park'], explanation: 'Park po angielsku to park.' },
          { type: 'choice', question: 'Co znaczy rubber?', answers: ['gumka', 'książka', 'mleko', 'buty'], correct: 0, explanation: 'Rubber to gumka do ścierania.' },
          { type: 'open', question: 'Wpisz po angielsku: przystanek autobusowy.', acceptedAnswers: ['bus stop'], explanation: 'Przystanek autobusowy po angielsku to bus stop.' },
        ],
      },
    },
  ] },
  { id: 'niemiecki', name: 'Język niemiecki', icon: '💬', color: '#dda85c', lessons: [] },
  { id: 'matematyka', name: 'Matematyka', icon: '🔢', color: '#7fb79a', lessons: [
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
  { id: 'historia', name: 'Historia', icon: '🏰', color: '#bd9a78', lessons: [] },
  { id: 'geografia', name: 'Geografia', icon: '🌍', color: '#65b6b3', lessons: [] },
  { id: 'biologia', name: 'Biologia', icon: '🌿', color: '#7cb879', lessons: [] },
  { id: 'technika', name: 'Technika', icon: '🛠️', color: '#8a9ab7', lessons: [] },
  { id: 'plastyka', name: 'Plastyka', icon: '🎨', color: '#ce85a7', lessons: [] },
];

// Dane są globalne, aby aplikacja działała także po otwarciu index.html z dysku.
window.NaukaZMamaSubjects = subjectCatalog;
