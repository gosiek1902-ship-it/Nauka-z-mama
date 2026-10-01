(function startNaukaZMama() {
const subjects = window.NaukaZMamaSubjects;

const STORAGE_KEY = 'nauka-z-mama-progress-v1';
const subjectList = document.querySelector('#subject-list');
const panel = document.querySelector('#panel');
const tabs = [...document.querySelectorAll('.tab')];
let activeSubject = subjects.find((subject) => subject.id === 'matematyka') ?? subjects[0];
let activeTab = 'notes';
let lessonIndex = activeSubject.lessons.length - 1;
let quizAnswers = {};
let quizGraded = false;
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
  lessonIndex = activeSubject.lessons.length - 1;
  quizAnswers = {};
  quizGraded = false;
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

function quizQuestions(quiz) {
  return quiz.questions ?? [{ ...quiz, type: 'choice' }];
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
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
  const picked = available.find(({ index }) => index === lessonIndex) ?? available[available.length - 1];
  const quiz = picked.lesson.quiz;
  const questions = quizQuestions(quiz);
  return `<div class="panel-head"><div><h3>Mały test</h3><p class="panel-subtitle">${picked.lesson.title} · Odpowiedz na pytania, a potem sprawdź wynik.</p></div><span class="quiz-meta">${questions.length} ${questions.length === 1 ? 'pytanie' : 'pytania'}</span></div>
    <div class="quiz-topic-picker" aria-label="Wybierz temat testu">${available.map(({ lesson, index }) => `<button type="button" class="quiz-topic-button ${index === picked.index ? 'active' : ''}" data-quiz-lesson="${index}" aria-pressed="${index === picked.index}">${escapeHTML(lesson.title)}</button>`).join('')}</div>
    <div class="quiz-question-list">${questions.map((question, questionIndex) => {
      const isOpen = question.type === 'open';
      const response = quizAnswers[questionIndex] ?? '';
      const answers = isOpen ? `<label class="open-answer-row"><span>Twoja odpowiedź</span><input type="text" data-open-answer="${questionIndex}" value="${escapeHTML(response)}" placeholder="Wpisz odpowiedź" autocomplete="off" ${quizGraded ? 'disabled' : ''} /></label>`
        : `<div class="answer-list">${question.answers.map((answer, answerIndex) => `<button type="button" class="answer-option ${response === answerIndex ? 'selected' : ''}" data-choice="${questionIndex}" data-value="${answerIndex}" ${quizGraded ? 'disabled' : ''}>${String.fromCharCode(65 + answerIndex)}. &nbsp;${escapeHTML(answer)}</button>`).join('')}</div>`;
      return `<article class="quiz-question-card"><p class="quiz-question"><span class="question-number">${questionIndex + 1}.</span> ${escapeHTML(question.question)}</p>${answers}<div id="quiz-feedback-${questionIndex}" class="feedback" role="status"></div></article>`;
    }).join('')}</div>
    <div class="quiz-submit-row"><button class="action-button quiz-submit" type="button" data-check-quiz ${quizGraded ? 'disabled' : ''}>Sprawdź odpowiedzi <span>✓</span></button><div id="quiz-score" class="quiz-score" role="status"></div></div>`;
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
  panel.querySelectorAll('[data-quiz-lesson]').forEach((button) => button.addEventListener('click', () => {
    lessonIndex = Number(button.dataset.quizLesson);
    quizAnswers = {};
    quizGraded = false;
    renderPanel();
  }));
  panel.querySelectorAll('[data-choice]').forEach((button) => button.addEventListener('click', () => {
    const questionIndex = Number(button.dataset.choice);
    quizAnswers[questionIndex] = Number(button.dataset.value);
    panel.querySelectorAll(`[data-choice="${questionIndex}"]`).forEach((choice) => choice.classList.toggle('selected', choice === button));
  }));
  panel.querySelectorAll('[data-open-answer]').forEach((input) => input.addEventListener('input', () => {
    quizAnswers[Number(input.dataset.openAnswer)] = input.value;
  }));
  panel.querySelector('[data-check-quiz]')?.addEventListener('click', gradeQuiz);
  panel.querySelectorAll('[data-review]').forEach((checkbox) => checkbox.addEventListener('change', () => {
    const index = Number(checkbox.dataset.review);
    progress.done[lessonKey(index)] = checkbox.checked;
    saveProgress();
    renderPanel();
  }));
}

function normalizeAnswer(value) {
  return String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('pl-PL').replace(/[\s\u00a0]/g, '');
}

function gradeQuiz() {
  const quiz = currentLesson()?.quiz;
  if (!quiz || quizGraded) return;
  const questions = quizQuestions(quiz);
  let correctCount = 0;
  let answeredCount = 0;

  questions.forEach((question, questionIndex) => {
    const isOpen = question.type === 'open';
    const rawAnswer = quizAnswers[questionIndex];
    const answered = rawAnswer !== undefined && String(rawAnswer).trim() !== '';
    const correct = answered && (isOpen
      ? (question.acceptedAnswers ?? []).some((answer) => normalizeAnswer(answer) === normalizeAnswer(rawAnswer))
      : Number(rawAnswer) === question.correct);
    const feedback = panel.querySelector(`#quiz-feedback-${questionIndex}`);
    const explanation = question.explanation ?? '';

    if (!answered) {
      feedback.textContent = 'Wybierz albo wpisz odpowiedź, aby sprawdzić to pytanie.';
      feedback.classList.add('wrong');
      return;
    }

    answeredCount += 1;
    if (correct) correctCount += 1;
    feedback.textContent = `${correct ? 'Dobrze! 🎉' : 'Jeszcze raz do tego wróć 🌱'} ${explanation}`;
    feedback.classList.toggle('wrong', !correct);
    if (isOpen) {
      const input = panel.querySelector(`[data-open-answer="${questionIndex}"]`);
      input.disabled = true;
      input.classList.add(correct ? 'correct' : 'wrong');
    } else {
      panel.querySelectorAll(`[data-choice="${questionIndex}"]`).forEach((button) => {
        const selected = Number(button.dataset.value);
        button.disabled = true;
        if (selected === question.correct) button.classList.add('correct');
        else if (selected === Number(rawAnswer)) button.classList.add('wrong');
      });
    }
  });

  quizGraded = answeredCount === questions.length;
  const score = panel.querySelector('#quiz-score');
  score.textContent = answeredCount < questions.length
    ? `Na razie: ${correctCount} poprawnych z ${answeredCount} sprawdzonych. Uzupełnij pozostałe odpowiedzi.`
    : `Twój wynik: ${correctCount} z ${questions.length}. ${correctCount === questions.length ? 'Brawo, świetna robota! 🌟' : 'Każda odpowiedź to okazja do nauki! 💛'}`;
  const submit = panel.querySelector('[data-check-quiz]');
  submit.disabled = quizGraded;
}

tabs.forEach((tab) => tab.addEventListener('click', () => {
  activeTab = tab.dataset.tab;
  quizAnswers = {};
  quizGraded = false;
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
