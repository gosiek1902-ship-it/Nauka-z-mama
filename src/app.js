(function startNaukaZMama() {
const subjects = window.NaukaZMamaSubjects;
const expandedContent = window.NaukaZMamaExpandedContent ?? {};
subjects.forEach((subject) => subject.lessons.forEach((lesson) => Object.assign(lesson, expandedContent[lesson.title] ?? {})));

const STORAGE_KEY = 'nauka-z-mama-progress-v1';
const subjectList = document.querySelector('#subject-list');
const mobileSubjectSelect = document.querySelector('#mobile-subject-select');
const panel = document.querySelector('#panel');
const tabs = [...document.querySelectorAll('.tab')];
let activeSubject = subjects.find((subject) => subject.id === 'matematyka') ?? subjects[0];
let activeTab = 'notes';
let lessonIndex = activeSubject.lessons.length - 1;
let quizAnswers = {};
let quizGraded = false;
let reviewAnswers = {};
let reviewResults = {};
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
  mobileSubjectSelect.innerHTML = '<option value="" selected disabled>Wybierz przedmiot ▼</option>' + subjects.map((subject) => `<option value="${escapeHTML(subject.id)}">${escapeHTML(subject.icon)} ${escapeHTML(subject.name)}</option>`).join('');
  mobileSubjectSelect.value = '';
  subjectList.querySelectorAll('[data-subject]').forEach((button) => {
    button.addEventListener('click', () => selectSubject(button.dataset.subject));
  });
}

mobileSubjectSelect.addEventListener('change', () => {
  if (mobileSubjectSelect.value) selectSubject(mobileSubjectSelect.value);
});

function selectSubject(id) {
  activeSubject = subjects.find((subject) => subject.id === id) ?? subjects[0];
  lessonIndex = activeSubject.lessons.length - 1;
  quizAnswers = {};
  quizGraded = false;
  reviewAnswers = {};
  reviewResults = {};
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

function quizQuestions(lesson) {
  const existing = lesson?.quiz?.questions ?? (lesson?.quiz ? [{ ...lesson.quiz, type: 'choice' }] : []);
  return [...existing, ...(lesson?.quizQuestions ?? [])];
}

function questionCountLabel(count) {
  if (count === 1) return 'pytanie';
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  return lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14) ? 'pytania' : 'pytań';
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function renderLessonNotes(lesson, index) {
  const sections = (lesson.detailedNotes ?? []).map((section) => `
    <section class="study-section"><h5>${escapeHTML(section.title)}</h5>${section.points?.length ? `<ul>${section.points.map((point) => `<li>${escapeHTML(point)}</li>`).join('')}</ul>` : ''}${section.example ? `<p class="study-example"><strong>Przykład:</strong> ${escapeHTML(section.example)}</p>` : ''}${section.remember ? `<p class="remember-callout"><strong>🧠 Zapamiętaj</strong><br>${escapeHTML(section.remember)}</p>` : ''}</section>`).join('');
  const definitions = (lesson.definitions ?? []).map((definition) => `<div class="definition-card"><strong>${escapeHTML(definition.term)}</strong><p>${escapeHTML(definition.meaning)}</p>${definition.example ? `<small>Przykład: ${escapeHTML(definition.example)}</small>` : ''}</div>`).join('');
  const vocabSections = (lesson.sections ?? []).map((section) => `
    <section class="vocab-section"><h5>${escapeHTML(section.title)}</h5>
      <div class="vocabulary-list">${section.vocabulary.map(({ en, pl }) => `<div class="vocabulary-pair"><strong>${escapeHTML(en)}</strong><span>${escapeHTML(pl)}</span></div>`).join('')}</div>
      <div class="sentence-examples"><strong>Proste zdania</strong>${section.examples.map(({ en, pl }) => `<div><span>${escapeHTML(en)}</span><small>${escapeHTML(pl)}</small></div>`).join('')}</div>
    </section>`).join('');
  const oldNotes = !sections && !vocabSections && lesson.examples ? `<p class="study-example"><strong>Przykład:</strong> ${escapeHTML(lesson.examples)}</p>` : '';
  const topicNumber = String(index + 1).padStart(2, '0');
  const contentId = `study-topic-content-${activeSubject.id}-${index}`;
  return `<article class="topic-card study-lesson-card" data-note-topic="${index}"><button class="study-lesson-toggle" type="button" data-note-toggle="${index}" aria-expanded="false" aria-controls="${contentId}"><span class="study-toggle-icons" aria-hidden="true">▶️</span><span class="topic-number">${topicNumber}</span><span class="study-lesson-title">${escapeHTML(lesson.title)}</span></button><div class="study-lesson-content study-topic-content" id="${contentId}" hidden><p class="language-lesson-intro">${escapeHTML(lesson.summary ?? '')}</p>${oldNotes}<div class="study-sections">${sections}</div>${definitions ? `<section class="definitions-section"><h5>📚 Ważne pojęcia</h5><div class="definition-grid">${definitions}</div></section>` : ''}${vocabSections ? `<div class="vocab-sections">${vocabSections}</div>` : ''}${lesson.importantFacts?.length ? `<section class="summary-card"><h5>✅ Podsumowanie</h5><ul>${lesson.importantFacts.map((fact) => `<li>${escapeHTML(fact)}</li>`).join('')}</ul></section>` : ''}</div></article>`;
}

function renderNotes() {
  const items = lessons();
  const doneCount = items.filter((_, index) => progress.done[lessonKey(index)]).length;
  const progressCard = `<div class="subject-progress"><div class="subject-progress-label"><strong>Twój postęp</strong><span>Ukończone tematy: ${doneCount}/${items.length}</span></div><div class="subject-progress-track" role="progressbar" aria-label="Ukończone tematy" aria-valuemin="0" aria-valuemax="${items.length}" aria-valuenow="${doneCount}"><span style="width:${items.length ? Math.round(doneCount / items.length * 100) : 0}%"></span></div></div>`;
  if (!items.length) return `
    <div class="panel-head"><div><h3>Moje notatki</h3><p class="panel-subtitle">Tutaj zbieramy najważniejsze rzeczy z lekcji.</p></div><span class="topic-badge">${activeSubject.icon} ${activeSubject.name}</span></div>
    ${progressCard}${emptyState('Miejsce na nowe lekcje!', 'Ten przedmiot czeka na pierwsze tematy. Dodamy tu notatki, przykłady i ćwiczenia, kiedy będziesz gotowy.', '📒')}`;
  return `
    <div class="panel-head"><div><h3>Moje notatki</h3><p class="panel-subtitle">Krótkie wyjaśnienia i przykłady, które pomagają zapamiętać.</p></div><span class="topic-badge">${items.length} ${items.length === 1 ? 'temat' : 'tematy'}</span></div>
    ${progressCard}<div class="topic-grid notes-accordion-list">${items.map(renderLessonNotes).join('')}</div>`;
}

function renderQuiz() {
  const available = lessons().map((lesson, index) => ({ lesson, index })).filter(({ lesson }) => quizQuestions(lesson).length);
  if (!available.length) return `<div class="panel-head"><div><h3>Mały test</h3><p class="panel-subtitle">Sprawdź, co już pamiętasz. Bez stresu — pomyłki też uczą!</p></div><span class="topic-badge">🎯 Quiz</span></div>${emptyState('Quiz pojawi się z kolejnymi tematami', 'Do każdej lekcji możemy dodać krótkie pytanie i wyjaśnienie odpowiedzi. Wybierz temat w zakładce Notatki, aby zacząć.', '🧩')}`;
  const picked = available.find(({ index }) => index === lessonIndex) ?? available[available.length - 1];
  const questions = quizQuestions(picked.lesson);
  return `<div class="panel-head"><div><h3>Mały test</h3><p class="panel-subtitle">${picked.lesson.title} · Odpowiedz na pytania, a potem sprawdź wynik.</p></div><span class="quiz-meta">${questions.length} ${questionCountLabel(questions.length)}</span></div>
    <div class="quiz-topic-picker" aria-label="Wybierz temat testu">${available.map(({ lesson, index }) => `<button type="button" class="quiz-topic-button ${index === picked.index ? 'active' : ''}" data-quiz-lesson="${index}" aria-pressed="${index === picked.index}">${escapeHTML(lesson.title)}</button>`).join('')}</div>
    <div class="quiz-question-list">${questions.map((question, questionIndex) => {
      const isOpen = question.type === 'open';
      const response = quizAnswers[questionIndex] ?? '';
      const answers = isOpen ? `<div class="open-answer-block"><label class="open-answer-row"><span>Twoja odpowiedź</span><input type="text" data-open-answer="${questionIndex}" value="${escapeHTML(response)}" placeholder="Wpisz odpowiedź" autocomplete="off" /></label><button type="button" class="open-answer-check" data-check-open="${questionIndex}">Sprawdź</button></div>`
        : `<div class="answer-list">${question.answers.map((answer, answerIndex) => `<button type="button" class="answer-option ${response === answerIndex ? 'selected' : ''}" data-choice="${questionIndex}" data-value="${answerIndex}" ${quizGraded ? 'disabled' : ''}>${String.fromCharCode(65 + answerIndex)}. &nbsp;${escapeHTML(answer)}</button>`).join('')}</div>`;
      const level = question.level ?? ['Łatwe', 'Średnie', 'Trudniejsze'][questionIndex % 3];
      return `<article class="quiz-question-card"><p class="quiz-question"><span class="question-number">${questionIndex + 1}.</span> ${escapeHTML(question.question)} <small class="question-level">${escapeHTML(level)}</small></p>${answers}<div id="quiz-feedback-${questionIndex}" class="feedback" role="status"></div></article>`;
    }).join('')}</div>
    <div class="quiz-submit-row"><button class="action-button quiz-submit" type="button" data-check-quiz ${quizGraded ? 'disabled' : ''}>Sprawdź odpowiedzi <span>✓</span></button><div id="quiz-score" class="quiz-score" role="status"></div></div>`;
}

function renderCheatsheet() {
  const sheet = currentLesson()?.cheatSheet;
  if (sheet?.length) return `<div class="panel-head"><div><h3>💡 Ściąga: ${escapeHTML(currentLesson().title)}</h3><p class="panel-subtitle">Szybka karta przed sprawdzianem.</p></div><span class="topic-badge">Powtórz w 2 minuty</span></div><div class="cheat-grid">${sheet.map((section) => `<section class="cheat-card"><h4>${escapeHTML(section.title)}</h4>${section.items?.length ? `<dl>${section.items.map((item) => `<div><dt>${escapeHTML(item.label)}</dt><dd>${escapeHTML(item.text)}</dd></div>`).join('')}</dl>` : ''}${section.rule ? `<p class="cheat-rule"><strong>Reguła:</strong> ${escapeHTML(section.rule)}</p>` : ''}${section.example ? `<p class="study-example"><strong>Przykład:</strong> ${escapeHTML(section.example)}</p>` : ''}${section.remember ? `<p class="remember-callout"><strong>🧠 Zapamiętaj</strong><br>${escapeHTML(section.remember)}</p>` : ''}</section>`).join('')}</div>`;
  const facts = currentLesson()?.cheatFacts;
  if (!facts?.length) return `<div class="panel-head"><div><h3>Ściąga do zapamiętania</h3><p class="panel-subtitle">Najważniejsze zasady w jednym miejscu.</p></div><span class="topic-badge">💡 Przydatne!</span></div>${emptyState('Najważniejsze wskazówki będą tutaj', 'Gdy dodamy tematy lekcji, zbierzemy tu krótkie reguły, definicje i sposoby na zapamiętanie.', '✨')}`;
  return `<div class="panel-head"><div><h3>Ściąga: ${currentLesson().title}</h3><p class="panel-subtitle">Krótko i na temat — rzuć okiem przed powtórką.</p></div><span class="topic-badge">💡 Zapamiętaj</span></div><div class="fact-list">${facts.map((fact, index) => `<div class="fact-row"><b>${index + 1}.</b><span>${fact}</span></div>`).join('')}</div>`;
}

function renderReview() {
  const items = lessons();
  if (!items.length) return `<div class="panel-head"><div><h3>Powtórka</h3><p class="panel-subtitle">Zaznacz temat po przypomnieniu go sobie.</p></div><span class="topic-badge">🔁 Utrwalamy</span></div>${emptyState('Powtórka czeka na pierwsze tematy', 'Kiedy pojawią się lekcje, znajdziesz tu ich listę. Odhaczaj tematy, które już powtórzyłeś!', '🌼')}`;
  const doneCount = items.filter((_, index) => progress.done[lessonKey(index)]).length;
  const reviewExercises = currentLesson()?.reviewExercises ?? [];
  const topicPicker = items.length > 1 ? `<div class="quiz-topic-picker" aria-label="Wybierz temat powtórki">${items.map((lesson, index) => `<button type="button" class="quiz-topic-button ${index === lessonIndex ? 'active' : ''}" data-review-lesson="${index}" aria-pressed="${index === lessonIndex}">${escapeHTML(lesson.title)}</button>`).join('')}</div>` : '';
  const exercises = reviewExercises.length ? `<div class="review-exercises"><h4>Krótka powtórka: ${escapeHTML(currentLesson().title)}</h4>${reviewExercises.map((exercise, index) => {
    const key = `${activeSubject.id}:${lessonIndex}:${index}`;
    const result = reviewResults[key];
    const isChoice = exercise.type === 'choice' || exercise.type === 'truefalse';
    const feedback = result === undefined ? '' : result
      ? 'Brawo! To dobra odpowiedź! 🌟'
      : `Spróbuj jeszcze raz. ${escapeHTML(exercise.hint ?? '')} ${isChoice ? `Odpowiedź: ${escapeHTML(exercise.options?.[exercise.correct] ?? (exercise.correct === 0 ? 'Prawda' : 'Fałsz'))}.` : exercise.acceptedAnswers?.length ? `Odpowiedź: ${escapeHTML(exercise.acceptedAnswers.join(' lub '))}.` : ''}`;
    const field = isChoice
      ? `<div class="review-choice-list">${(exercise.options ?? ['Prawda', 'Fałsz']).map((option, optionIndex) => `<button type="button" class="review-choice ${reviewAnswers[key] === optionIndex ? 'selected' : ''}" data-review-choice="${index}" data-review-value="${optionIndex}">${escapeHTML(option)}</button>`).join('')}</div><button type="button" class="review-check-answer" data-check-review="${index}">Sprawdź</button>`
      : `<div class="review-answer-controls"><input id="review-answer-${index}" type="text" data-review-answer="${index}" value="${escapeHTML(reviewAnswers[key] ?? '')}" placeholder="${exercise.type === 'open' ? 'Odpowiedz własnymi słowami' : 'Wpisz odpowiedź'}" autocomplete="off" /><button type="button" class="review-check-answer" data-check-review="${index}">Sprawdź</button></div>`;
    const knownAnswer = isChoice ? exercise.options?.[exercise.correct] ?? (exercise.correct === 0 ? 'Prawda' : 'Fałsz') : exercise.acceptedAnswers?.join(' lub ');
    const answerReveal = knownAnswer ? `<details class="review-answer-reveal"><summary>▶️ Pokaż odpowiedź</summary><p>${escapeHTML(knownAnswer)}</p></details>` : '';
    return `<div class="review-exercise"><label ${isChoice ? '' : `for="review-answer-${index}"`}>${exercise.type === 'translate' ? '🌐 ' : ''}${escapeHTML(exercise.prompt)}</label>${field}<div class="feedback ${result === false ? 'wrong' : ''}" role="status">${feedback}</div>${answerReveal}</div>`;
  }).join('')}</div>` : '';
  return `<div class="panel-head"><div><h3>Powtórka</h3><p class="panel-subtitle">Przypomnij sobie temat i zaznacz go jako powtórzony.</p></div><span class="topic-badge">🔁 Małe kroki!</span></div>
    ${topicPicker}${exercises}
    ${items.map((lesson, index) => `<label class="review-row"><span><strong>${lesson.title}</strong><small>Otwórz Notatki, jeśli chcesz przeczytać je jeszcze raz.</small></span><input class="review-check" type="checkbox" data-review="${index}" ${progress.done[lessonKey(index)] ? 'checked' : ''} aria-label="Oznacz ${lesson.title} jako powtórzony" /></label>`).join('')}
    <div class="review-progress">🌟 Powtórzone tematy: ${doneCount} z ${items.length}</div>`;
}

function renderPanel() {
  panel.innerHTML = ({ notes: renderNotes, quiz: renderQuiz, cheatsheet: renderCheatsheet, review: renderReview })[activeTab]();
  panel.querySelectorAll('[data-note-toggle]').forEach((button) => button.addEventListener('click', () => {
    const topicIndex = button.dataset.noteToggle;
    const isOpening = button.getAttribute('aria-expanded') !== 'true';
    panel.querySelectorAll('[data-note-topic]').forEach((topic) => {
      const topicButton = topic.querySelector('[data-note-toggle]');
      const content = topic.querySelector('.study-topic-content');
      const shouldOpen = topic.dataset.noteTopic === topicIndex && isOpening;
      topicButton.setAttribute('aria-expanded', String(shouldOpen));
      topicButton.querySelector('.study-toggle-icons').textContent = shouldOpen ? '🔽' : '▶️';
      topic.classList.toggle('is-open', shouldOpen);
      content.hidden = !shouldOpen;
    });
  }));
  panel.querySelectorAll('[data-quiz-lesson]').forEach((button) => button.addEventListener('click', () => {
    lessonIndex = Number(button.dataset.quizLesson);
    quizAnswers = {};
    quizGraded = false;
    renderPanel();
  }));
  panel.querySelectorAll('[data-choice]').forEach((button) => button.addEventListener('click', () => {
    const questionIndex = Number(button.dataset.choice);
    quizAnswers[questionIndex] = Number(button.dataset.value);
    panel.querySelectorAll(`[data-choice="${questionIndex}"]`).forEach((choice) => {
      choice.classList.remove('selected', 'correct', 'wrong');
      if (choice === button) choice.classList.add('selected');
    });
    const feedback = panel.querySelector(`#quiz-feedback-${questionIndex}`);
    feedback.textContent = '';
    feedback.classList.remove('wrong');
  }));
  panel.querySelectorAll('[data-open-answer]').forEach((input) => input.addEventListener('input', () => {
    const questionIndex = Number(input.dataset.openAnswer);
    quizAnswers[questionIndex] = input.value;
    quizGraded = false;
    const feedback = panel.querySelector(`#quiz-feedback-${questionIndex}`);
    feedback.textContent = '';
    feedback.classList.remove('wrong');
    input.classList.remove('correct', 'wrong');
    const submit = panel.querySelector('[data-check-quiz]');
    if (submit) submit.disabled = false;
  }));
  panel.querySelectorAll('[data-check-open]').forEach((button) => button.addEventListener('click', () => gradeOpenQuestion(Number(button.dataset.checkOpen))));
  panel.querySelector('[data-check-quiz]')?.addEventListener('click', gradeQuiz);
  panel.querySelectorAll('[data-review-lesson]').forEach((button) => button.addEventListener('click', () => {
    lessonIndex = Number(button.dataset.reviewLesson);
    renderPanel();
  }));
  panel.querySelectorAll('[data-review-answer]').forEach((input) => input.addEventListener('input', () => {
    const key = `${activeSubject.id}:${lessonIndex}:${input.dataset.reviewAnswer}`;
    reviewAnswers[key] = input.value;
    delete reviewResults[key];
    const feedback = panel.querySelector(`[data-check-review="${input.dataset.reviewAnswer}"]`)?.closest('.review-exercise')?.querySelector('.feedback');
    if (feedback) { feedback.textContent = ''; feedback.classList.remove('wrong'); }
    input.classList.remove('correct', 'wrong');
  }));
  panel.querySelectorAll('[data-check-review]').forEach((button) => button.addEventListener('click', () => {
    const exerciseIndex = Number(button.dataset.checkReview);
    const exercise = currentLesson()?.reviewExercises?.[exerciseIndex];
    const key = `${activeSubject.id}:${lessonIndex}:${exerciseIndex}`;
    const answer = reviewAnswers[key] ?? '';
    const isChoice = exercise?.type === 'choice' || exercise?.type === 'truefalse';
    const expected = isChoice ? exercise.correct : exercise?.acceptedAnswers ?? [];
    reviewResults[key] = isChoice ? Number(answer) === Number(expected) : expected.some((candidate) => normalizeAnswer(candidate) === normalizeAnswer(answer));
    renderPanel();
  }));
  panel.querySelectorAll('[data-review-choice]').forEach((button) => button.addEventListener('click', () => {
    const key = `${activeSubject.id}:${lessonIndex}:${button.dataset.reviewChoice}`;
    reviewAnswers[key] = Number(button.dataset.reviewValue);
    delete reviewResults[key];
    renderPanel();
  }));
  panel.querySelectorAll('[data-review]').forEach((checkbox) => checkbox.addEventListener('change', () => {
    const index = Number(checkbox.dataset.review);
    progress.done[lessonKey(index)] = checkbox.checked;
    saveProgress();
    renderPanel();
  }));
  document.querySelector('#back-to-subjects')?.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 680px)').matches) {
      mobileSubjectSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
      mobileSubjectSelect.focus({ preventScroll: true });
    } else {
      subjectList.querySelector('[data-subject]')?.focus();
    }
  });
}

function normalizeAnswer(value) {
  return String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('pl-PL').replace(/[\s\u00a0]/g, '');
}

function questionExplanation(question) {
  return question.explanation || 'Sprawdź poprawną odpowiedź i porównaj ją ze swoją.';
}

function gradeOpenQuestion(questionIndex) {
  const question = quizQuestions(currentLesson()).at(questionIndex);
  if (!question || question.type !== 'open') return;
  const answer = quizAnswers[questionIndex] ?? '';
  const acceptedAnswers = question.acceptedAnswers ?? [];
  const correct = acceptedAnswers.some((candidate) => normalizeAnswer(candidate) === normalizeAnswer(answer));
  const input = panel.querySelector(`[data-open-answer="${questionIndex}"]`);
  const feedback = panel.querySelector(`#quiz-feedback-${questionIndex}`);
  if (!String(answer).trim()) {
    feedback.textContent = 'Wpisz odpowiedź, a potem kliknij „Sprawdź”.';
    feedback.classList.add('wrong');
    input.focus();
    return;
  }
  feedback.textContent = correct
    ? `Dobrze! 🎉 ${questionExplanation(question)}`
    : `Jeszcze raz do tego wróć 🌱 Prawidłowa odpowiedź: ${acceptedAnswers.join(' lub ')}. ${questionExplanation(question)}`;
  feedback.classList.toggle('wrong', !correct);
  input.classList.toggle('correct', correct);
  input.classList.toggle('wrong', !correct);
}

function gradeQuiz() {
  const questions = quizQuestions(currentLesson());
  if (!questions.length || quizGraded) return;
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
    const explanation = questionExplanation(question);

    if (!answered) {
      feedback.textContent = 'Wybierz albo wpisz odpowiedź, aby sprawdzić to pytanie.';
      feedback.classList.add('wrong');
      return;
    }

    answeredCount += 1;
    if (correct) correctCount += 1;
    feedback.textContent = isOpen
      ? (correct
        ? `Dobrze! 🎉 ${explanation}`
        : `Jeszcze raz do tego wróć 🌱 Prawidłowa odpowiedź: ${(question.acceptedAnswers ?? []).join(' lub ')}. ${explanation}`)
      : `${correct ? 'Dobrze! 🎉' : 'Jeszcze raz do tego wróć 🌱'} ${explanation}`;
    feedback.classList.toggle('wrong', !correct);
    if (isOpen) {
      const input = panel.querySelector(`[data-open-answer="${questionIndex}"]`);
      input.classList.add(correct ? 'correct' : 'wrong');
    } else {
      panel.querySelectorAll(`[data-choice="${questionIndex}"]`).forEach((button) => {
        const selected = Number(button.dataset.value);
        button.disabled = true;
        button.classList.remove('correct', 'wrong');
        if (selected === Number(rawAnswer)) button.classList.add(correct ? 'correct' : 'wrong');
        else if (!correct && selected === question.correct) button.classList.add('correct');
      });
    }
  });

  quizGraded = answeredCount === questions.length;
  const score = panel.querySelector('#quiz-score');
  score.innerHTML = answeredCount < questions.length
    ? `Na razie: ${correctCount} poprawnych z ${answeredCount} sprawdzonych. Uzupełnij pozostałe odpowiedzi.`
    : `<strong>TWÓJ WYNIK</strong><span>${correctCount}/${questions.length} · ${Math.round(correctCount / questions.length * 100)}%</span><small>${correctCount === questions.length ? 'Brawo, świetna robota! 🌟' : 'Każda odpowiedź to okazja do nauki! 💛'}</small>${questions.some((question, index) => {
      const answer = quizAnswers[index];
      return !(question.type === 'open' ? (question.acceptedAnswers ?? []).some((candidate) => normalizeAnswer(candidate) === normalizeAnswer(answer)) : Number(answer) === question.correct);
    }) ? `<div class="quiz-review-list"><strong>Warto jeszcze powtórzyć:</strong> ${questions.map((question, index) => {
      const answer = quizAnswers[index];
      const correct = question.type === 'open' ? (question.acceptedAnswers ?? []).some((candidate) => normalizeAnswer(candidate) === normalizeAnswer(answer)) : Number(answer) === question.correct;
      return correct ? '' : index + 1;
    }).filter(Boolean).join(', ')}</div>` : ''}`;
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
