/**
 * Katalog treści aplikacji. Dodawaj kolejne lekcje jako obiekty w tablicy
 * lessons danego przedmiotu. Pola quiz i cheatFacts są opcjonalne.
 */
const subjectCatalog = [
  { id: 'polski', name: 'Język polski', icon: '📖', color: '#eaa27d', lessons: [] },
  { id: 'angielski', name: 'Język angielski', icon: '🔤', color: '#7da8d8', lessons: [] },
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
