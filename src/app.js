(function startNaukaZMama() {
const subjects = window.NaukaZMamaSubjects;

const STORAGE_KEY = 'nauka-z-mama-progress-v1';
const subjectList = document.querySelector('#subject-list');
const panel = document.querySelector('#panel');
const tabs = [...document.querySelectorAll('.tab')];
let activeSubject = subjects.find((subject) => subject.id === 'matematyka') ?? subjects[0];
let activeTab = 'notes';
let lessonIndex = 0;
let quizAnswered = false;
let progress = loadProgress();

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? { done: {} }; }
  catch { return { done: {} }; }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function renderSubjects() {
  subjectList.innerHTML = subjects.map((subject) => `
    <button class="subject-link ${subject.id === activeSubject.id ? 'active' : ''}" data-subject="${subject.id}" aria-current="${subject.id === activeSubject.id ? 'page' : 'false'}">
      <span class="subject-icon">${subject.icon}</span><span>${subject.name}</span>
    </button>`).join('');
  subjectList.querySelectorAll('[data-subject]').forEach((button) => {
    button.addEventListener('click', () => selectSubject(button.dataset.subject));
  });
}

function selectSubject(id) {
  activeSubject = subjects.find((subject) => subject.id === id) ?? subjects[0];
  lessonIndex = 0;
  quizAnswered = false;
  document.querySelector('#subject-title').textContent = activeSubject.name;
  document.querySelector('#current-subject-crumb').textContent = activeSubject.name;
  renderSubjects();
  renderPanel();
}

function lessonKey(index = lessonIndex) { return `${activeSubject.id}:${index}`; }
function lessons() { return activeSubject.lessons; }
function currentLesson() { return lessons()[lessonIndex]; }

function emptyState(heading, text, icon = '🌱') {
  return `<div class="empty-state"><div class="empty-emoji">${icon}</div><h3>${heading}</h3><p>${text}</p></div>`;
}

function renderNotes() {
  const items = lessons();
  if (!items.length) return `
    <div class="panel-head"><div><h3>Moje notatki</h3><p class="panel-subtitle">Tutaj zbieramy najważniejsze rzeczy z lekcji.</p></div><span class="topic-badge">${activeSubject.icon} ${activeSubject.name}</span></div>
    ${emptyState('Miejsce na nowe lekcje!', 'Ten przedmiot czeka na pierwsze tematy. Dodamy tu notatki, przykłady i ćwiczenia, kiedy będziesz gotowa.', '📒')}`;
  return `
    <div class="panel-head"><div><h3>Moje notatki</h3><p class="panel-subtitle">Krótkie wyjaśnienia i przykłady, które pomagają zapamiętać.</p></div><span class="topic-badge">${items.length} ${items.length === 1 ? 'temat' : 'tematy'}</span></div>
    <div class="topic-grid">${items.map((lesson, index) => `<article class="topic-card"><h4><span class="topic-number">${String(index + 1).padStart(2, '0')}</span>${lesson.title}</h4><p>${lesson.summary}</p><p style="margin-top:8px;color:#5d8066"><strong>Przykład:</strong> ${lesson.examples}</p></article>`).join('')}</div>`;
}

function renderQuiz() {
  const available = lessons().map((lesson, index) => ({ lesson, index })).filter(({ lesson }) => lesson.quiz);
  if (!available.length) return `<div class="panel-head"><div><h3>Mały test</h3><p class="panel-subtitle">Sprawdź, co już pamiętasz. Bez stresu — pomyłki też uczą!</p></div><span class="topic-badge">🎯 Quiz</span></div>${emptyState('Quiz pojawi się z kolejnymi tematami', 'Do każdej lekcji możemy dodać krótkie pytanie i wyjaśnienie odpowiedzi. Wybierz temat w zakładce Notatki, aby zacząć.', '🧩')}`;
  const picked = available[lessonIndex % available.length];
  const quiz = picked.lesson.quiz;
  return `<div class="panel-head"><div><h3>Mały test</h3><p class="panel-subtitle">${picked.lesson.title} · Wybierz jedną odpowiedź.</p></div><span class="quiz-meta">Pytanie 1 z 1</span></div>
    <p class="quiz-question">${quiz.question}</p><div class="answer-list">${quiz.answers.map((answer, index) => `<button class="answer-option" data-answer="${index}">${String.fromCharCode(65 + index)}. &nbsp;${answer}</button>`).join('')}</div><div id="quiz-feedback" class="feedback" role="status"></div>`;
}

function renderCheatsheet() {
  const facts = currentLesson()?.cheatFacts;
  if (!facts?.length) return `<div class="panel-head"><div><h3>Ściąga do zapamiętania</h3><p class="panel-subtitle">Najważniejsze zasady w jednym miejscu.</p></div><span class="topic-badge">💡 Przydatne!</span></div>${emptyState('Najważniejsze wskazówki będą tutaj', 'Gdy dodamy tematy lekcji, zbierzemy tu krótkie reguły, definicje i sposoby na zapamiętanie.', '✨')}`;
  return `<div class="panel-head"><div><h3>Ściąga: ${currentLesson().title}</h3><p class="panel-subtitle">Krótko i na temat — rzuć okiem przed powtórką.</p></div><span class="topic-badge">💡 Zapamiętaj</span></div><div class="fact-list">${facts.map((fact, index) => `<div class="fact-row"><b>${index + 1}.</b><span>${fact}</span></div>`).join('')}</div>`;
}

function renderReview() {
  const items = lessons();
  if (!items.length) return `<div class="panel-head"><div><h3>Powtórka</h3><p class="panel-subtitle">Zaznacz temat po przypomnieniu go sobie.</p></div><span class="topic-badge">🔁 Utrwalamy</span></div>${emptyState('Powtórka czeka na pierwsze tematy', 'Kiedy pojawią się lekcje, znajdziesz tu ich listę. Odhaczaj tematy, które już powtórzyłaś!', '🌼')}`;
  const doneCount = items.filter((_, index) => progress.done[lessonKey(index)]).length;
  return `<div class="panel-head"><div><h3>Powtórka</h3><p class="panel-subtitle">Przypomnij sobie temat i zaznacz go jako powtórzony.</p></div><span class="topic-badge">🔁 Małe kroki!</span></div>
    ${items.map((lesson, index) => `<label class="review-row"><span><strong>${lesson.title}</strong><small>Otwórz Notatki, jeśli chcesz przeczytać je jeszcze raz.</small></span><input class="review-check" type="checkbox" data-review="${index}" ${progress.done[lessonKey(index)] ? 'checked' : ''} aria-label="Oznacz ${lesson.title} jako powtórzony" /></label>`).join('')}
    <div class="review-progress">🌟 Powtórzone tematy: ${doneCount} z ${items.length}</div>`;
}

function renderPanel() {
  panel.innerHTML = ({ notes: renderNotes, quiz: renderQuiz, cheatsheet: renderCheatsheet, review: renderReview })[activeTab]();
  panel.querySelectorAll('[data-answer]').forEach((button) => button.addEventListener('click', () => answerQuiz(Number(button.dataset.answer))));
  panel.querySelectorAll('[data-review]').forEach((checkbox) => checkbox.addEventListener('change', () => {
    const index = Number(checkbox.dataset.review);
    progress.done[lessonKey(index)] = checkbox.checked;
    saveProgress();
    renderPanel();
  }));
}

function answerQuiz(selected) {
  if (quizAnswered) return;
  quizAnswered = true;
  const available = lessons().filter((lesson) => lesson.quiz);
  const quiz = available[lessonIndex % available.length].quiz;
  const correct = selected === quiz.correct;
  panel.querySelectorAll('[data-answer]').forEach((button) => {
    const index = Number(button.dataset.answer);
    button.disabled = true;
    if (index === quiz.correct) button.classList.add('correct');
    else if (index === selected) button.classList.add('wrong');
  });
  const feedback = panel.querySelector('#quiz-feedback');
  feedback.textContent = `${correct ? 'Brawo! 🎉' : 'Spróbuj zapamiętać! 🌱'} ${quiz.explanation}`;
  if (!correct) feedback.classList.add('wrong');
}

tabs.forEach((tab) => tab.addEventListener('click', () => {
  activeTab = tab.dataset.tab;
  quizAnswered = false;
  tabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
  });
  renderPanel();
}));

renderSubjects();
renderPanel();
})();
