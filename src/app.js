(function startNaukaZMama() {
const subjects = window.NaukaZMamaSubjects;
const expandedContent = window.NaukaZMamaExpandedContent ?? {};
subjects.forEach((subject) => subject.lessons.forEach((lesson) => Object.assign(lesson, expandedContent[lesson.title] ?? {})));

const STORAGE_KEY = 'nauka-z-mama-progress-v1';
const APP_DATA_KEY = 'aleksander-learning-tools-v1';
const subjectList = document.querySelector('#subject-list');
const mobileSubjectSelect = document.querySelector('#mobile-subject-select');
const panel = document.querySelector('#panel');
const homeDashboard = document.querySelector('#home-dashboard');
const resetDialog = document.querySelector('#reset-confirmation');
const resetDialogTitle = document.querySelector('#reset-dialog-title');
const resetDialogMessage = document.querySelector('#reset-dialog-message');
const resetConfirmButton = document.querySelector('.reset-confirm');
const resetCancelButton = document.querySelector('.reset-cancel');
const modeDialog = document.querySelector('#mode-selection');
const modeSwitchButton = document.querySelector('#switch-mode');
const modeCancelButton = document.querySelector('.mode-cancel');
const appToast = document.querySelector('#app-toast');
let activeSubject = subjects.find((subject) => subject.id === 'matematyka') ?? subjects[0];
let activeTab = 'notes';
let activeView = 'topics';
let showDashboard = true;
let lessonIndex = 0;
let quizAnswers = {};
let quizGraded = false;
let reviewAnswers = {};
let reviewResults = {};
let oralIndex = 0;
let oralSessionDone = 0;
let oralSessionStartedAt = 0;
let appData = loadAppData();
let progress = appData.progress;
let pendingResetAction = null;
let toastTimer = null;
let speechQueue = [];
let speechQueueIndex = 0;
let speechRunId = 0;
let speechPaused = false;
let speechVoicesWaitCleanup = null;
let speechVoiceWaitedLanguages = new Set();

function loadProgress() {
  try { return { done: {}, topics: {}, exerciseResults: {}, ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}) }; }
  catch { return { done: {}, topics: {}, exerciseResults: {} }; }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  appData.progress = progress;
  persistUserData();
  renderHomeDashboard();
}

function loadAppData() {
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(APP_DATA_KEY)) ?? {}; } catch { stored = {}; }
  const legacyProgress = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}; } catch { return {}; } })();
  const migratedProgress = { done: {}, topics: {}, exerciseResults: {}, ...(stored.progress ?? legacyProgress) };
  const testResults = stored.testResults ?? {};
  const testScores = stored.testScores ?? Object.fromEntries(Object.entries(testResults).map(([key, value]) => [key, typeof value === 'object' ? value.lastScore ?? value.score : value]));
  const mistakes = stored.mistakes ?? stored.errors ?? [];
  return {
    schemaVersion: stored.schemaVersion ?? 1,
    profile: { name: 'Aleksander Kozdra', ...(stored.profile ?? {}) },
    mode: stored.mode ?? null,
    progress: migratedProgress,
    testResults,
    mistakes,
    favorites: [],
    errors: mistakes,
    testScores,
    testHistory: [],
    motherSessions: [],
    settings: {},
    recentTopics: [],
    ...(stored.settings ? { settings: stored.settings } : {}),
    ...(stored.motherSessions ? { motherSessions: stored.motherSessions } : {}),
    ...(stored.testHistory ? { testHistory: stored.testHistory } : {}),
    ...(stored.favorites ? { favorites: stored.favorites } : {}),
    ...(stored.recentTopics ? { recentTopics: stored.recentTopics } : {}),
  };
}

function saveAppData() {
  persistUserData();
  renderHomeDashboard();
}

function persistUserData() {
  appData.schemaVersion = 1;
  appData.updatedAt = Date.now();
  appData.progress = progress;
  appData.mistakes = appData.errors;
  localStorage.setItem(APP_DATA_KEY, JSON.stringify(appData));
}

function topicRef(subjectId = activeSubject.id, index = lessonIndex) { return `${subjectId}:${index}`; }
function isFavorite(subjectId, index) { return appData.favorites.includes(topicRef(subjectId, index)); }
function toggleFavorite() {
  const ref = topicRef();
  appData.favorites = isFavorite(activeSubject.id, lessonIndex)
    ? appData.favorites.filter((item) => item !== ref)
    : [...appData.favorites, ref];
  saveAppData();
}

function saveError({ subjectId = activeSubject.id, index = lessonIndex, itemId, prompt, answer, correctAnswer, explanation, source }) {
  const id = `${topicRef(subjectId, index)}:${itemId}`;
  const existing = appData.errors.find((item) => item.id === id);
  if (existing) {
    const answerChanged = existing.lastAnswer !== String(answer ?? '');
    existing.lastAnswer = String(answer ?? '');
    if (answerChanged) existing.attempts = (existing.attempts ?? 1) + 1;
    existing.questionNumber = existing.questionNumber ?? questionNumberFromId(itemId);
    existing.mastered = false;
    existing.updatedAt = Date.now();
  } else {
    appData.errors.push({ id, subjectId, lessonIndex: index, itemId, questionNumber: questionNumberFromId(itemId), prompt, lastAnswer: String(answer ?? ''), correctAnswer, explanation, source, attempts: 1, mastered: false, updatedAt: Date.now() });
  }
  persistUserData();
}

function resolveSavedError(itemId, subjectId = activeSubject.id, index = lessonIndex) {
  const id = `${topicRef(subjectId, index)}:${itemId}`;
  const saved = appData.errors.find((item) => item.id === id && !item.mastered);
  if (saved) { saved.mastered = true; saved.masteredAt = Date.now(); persistUserData(); }
}

function canManageTestData() {
  return appData.mode === 'mama';
}

function questionNumberFromId(itemId) {
  const match = String(itemId ?? '').match(/(?:quiz|exercise)-(\d+)/);
  return match ? Number(match[1]) + 1 : null;
}

function trackTopic(update = {}) {
  const ref = topicRef();
  const previous = progress.topics[ref] ?? {};
  progress.topics[ref] = { ...previous, started: true, startedAt: previous.startedAt ?? Date.now(), lastStudiedAt: Date.now(), ...update };
  appData.progress = progress;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  persistUserData();
}

function recordExerciseResult(index, correct) {
  const key = `${topicRef()}:exercise:${index}`;
  const firstSuccessful = correct && !progress.exerciseResults[key];
  progress.exerciseResults[key] = Boolean(correct);
  const topic = progress.topics[topicRef()] ?? { started: true, startedAt: Date.now() };
  topic.lastStudiedAt = Date.now();
  topic.exerciseAttempts = (topic.exerciseAttempts ?? 0) + 1;
  if (firstSuccessful) topic.exercisesCompleted = (topic.exercisesCompleted ?? 0) + 1;
  progress.topics[topicRef()] = topic;
  appData.progress = progress;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  persistUserData();
}

function setMode(mode) {
  if (!['mama', 'aleksander'].includes(mode)) return;
  appData.mode = mode;
  appData.settings = { ...(appData.settings ?? {}), lastModeChangedAt: Date.now() };
  persistUserData();
  modeSwitchButton.textContent = mode === 'mama' ? '👩 Mama' : '👦 Aleksander';
  if (modeDialog.open) modeDialog.close();
  activeView = mode === 'mama' ? 'mother' : 'topics';
  showDashboard = mode !== 'mama';
  renderPanel();
}

document.querySelectorAll('[data-mode-choice]').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.modeChoice)));
modeSwitchButton.addEventListener('click', () => {
  modeCancelButton.hidden = !appData.mode;
  if (typeof modeDialog.showModal === 'function') modeDialog.showModal();
  else modeDialog.setAttribute('open', '');
});
modeCancelButton.addEventListener('click', () => modeDialog.close());
modeDialog.addEventListener('cancel', (event) => {
  if (!appData.mode) event.preventDefault();
});

function showAppToast(message) {
  appToast.textContent = message;
  appToast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => appToast.classList.remove('visible'), 5000);
}

function askResetConfirmation({ title, message, confirmLabel, action, successMessage }) {
  if (!canManageTestData()) return;
  resetDialogTitle.textContent = title;
  resetDialogMessage.textContent = message;
  resetConfirmButton.textContent = confirmLabel;
  pendingResetAction = () => {
    action();
    renderPanel();
    showAppToast(successMessage);
  };
  if (typeof resetDialog.showModal === 'function') resetDialog.showModal();
  else resetDialog.setAttribute('open', '');
}

resetCancelButton.addEventListener('click', () => {
  pendingResetAction = null;
  resetDialog.close();
});

resetConfirmButton.addEventListener('click', () => {
  const action = pendingResetAction;
  pendingResetAction = null;
  resetDialog.close();
  action?.();
});

function clearSavedErrors() {
  if (!canManageTestData()) return;
  appData.errors = [];
  persistUserData();
}

function resetResultsAndProgress() {
  if (!canManageTestData()) return;
  appData.errors = [];
  appData.testScores = {};
  appData.testResults = {};
  appData.mistakes = appData.errors;
  appData.testHistory = [];
  progress = { done: {}, topics: {}, exerciseResults: {} };
  quizAnswers = {};
  quizGraded = false;
  reviewAnswers = {};
  reviewResults = {};
  oralIndex = 0;
  oralSessionDone = 0;
  persistUserData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function clearAllUserData() {
  if (!canManageTestData()) return;
  const { mode, profile, settings } = appData;
  progress = { done: {}, topics: {}, exerciseResults: {} };
  appData = { schemaVersion: 1, profile, mode, settings, progress, testResults: {}, mistakes: [], testScores: {}, errors: [], testHistory: [], favorites: [], recentTopics: [], motherSessions: [] };
  quizAnswers = {};
  quizGraded = false;
  reviewAnswers = {};
  reviewResults = {};
  oralIndex = 0;
  oralSessionDone = 0;
  persistUserData();
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

document.querySelector('#back-to-subjects')?.addEventListener('click', () => {
  activeView = 'topics';
  showDashboard = true;
  renderPanel();
  if (window.matchMedia('(max-width: 680px)').matches) {
    mobileSubjectSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    mobileSubjectSelect.focus({ preventScroll: true });
  } else {
    subjectList.querySelector('[data-subject]')?.focus();
  }
});

function selectSubject(id) {
  activeSubject = subjects.find((subject) => subject.id === id) ?? subjects[0];
  lessonIndex = 0;
  activeView = 'topics';
  showDashboard = false;
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

function resolveTopic(ref) {
  const [subjectId, rawIndex] = String(ref).split(':');
  const subject = subjects.find((item) => item.id === subjectId);
  const index = Number(rawIndex);
  return subject?.lessons[index] ? { subject, lesson: subject.lessons[index], index } : null;
}

function renderHomeDashboard() {
  if (!homeDashboard) return;
  if (appData.mode === 'mama') {
    homeDashboard.hidden = true;
    homeDashboard.innerHTML = '';
    return;
  }
  const favoriteCount = appData.favorites.length;
  const errorCount = appData.errors.filter((item) => !item.mastered).length;
  const todayRefs = [...new Set([...(appData.recentTopics ?? []), ...appData.favorites])].slice(0, 3);
  const today = (todayRefs.length ? todayRefs : subjects.flatMap((subject) => subject.lessons.map((_, index) => topicRef(subject.id, index))).slice(0, 3))
    .map(resolveTopic).filter(Boolean);
  const subjectProgress = subjects.map((subject) => {
    const completed = subject.lessons.filter((_, index) => progress.done[topicRef(subject.id, index)]).length;
    return `<div class="dashboard-progress-row"><span>${escapeHTML(subject.icon)} ${escapeHTML(subject.name)}</span><span>${completed}/${subject.lessons.length}</span><i><b style="width:${subject.lessons.length ? Math.round(completed / subject.lessons.length * 100) : 0}%"></b></i></div>`;
  }).join('');
  const hidden = activeView !== 'topics' || !showDashboard;
  homeDashboard.hidden = hidden;
  homeDashboard.innerHTML = `<div class="dashboard-actions"><button type="button" data-home-action="subjects">📚 PRZEDMIOTY</button><button type="button" data-home-action="today">🏠 DZISIAJ SIĘ UCZĘ</button><button type="button" data-home-action="favorites">⭐ MOJE DO NAUKI <span>${favoriteCount}</span></button><button type="button" data-home-action="errors">🔄 POWTÓRZ MOJE BŁĘDY <span>${errorCount}</span></button><button type="button" data-home-action="progress">📊 MOJE POSTĘPY</button><button type="button" data-home-action="motherStudy">🎯 NAUKA Z MAMĄ</button></div><div class="dashboard-today"><h3>🏠 Dzisiaj się uczę</h3><p>Mały krok też jest krokiem.</p><div class="today-topic-list">${today.map(({subject,lesson,index})=>`<button type="button" data-direct-topic="${subject.id}:${index}">${escapeHTML(subject.icon)} ${escapeHTML(lesson.title)} <small>${escapeHTML(subject.name)}</small></button>`).join('')}</div></div><div class="dashboard-progress"><h3>📊 Moje postępy</h3>${subjectProgress}</div>`;
  homeDashboard.querySelectorAll('[data-home-action]').forEach((button) => button.addEventListener('click', () => {
    activeView = button.dataset.homeAction;
    renderPanel();
  }));
  homeDashboard.querySelectorAll('[data-direct-topic]').forEach((button) => button.addEventListener('click', () => {
    const found = resolveTopic(button.dataset.directTopic);
    if (!found) return;
    activeSubject = found.subject;
    lessonIndex = found.index;
    showDashboard = false;
    appData.recentTopics = [topicRef(), ...(appData.recentTopics ?? []).filter((ref) => ref !== topicRef())].slice(0, 10);
    persistUserData();
    trackTopic();
    document.querySelector('#subject-title').textContent = activeSubject.name;
    document.querySelector('#current-subject-crumb').textContent = activeSubject.name;
    renderSubjects();
    activeView = 'materials';
    renderPanel();
  }));
}

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

function renderSpeechText(value, fallbackLanguage = defaultSpeechLanguage()) {
  if (!Array.isArray(value)) return `<span lang="${escapeHTML(normalizeSpeechLanguage(fallbackLanguage))}">${escapeHTML(value ?? '')}</span>`;
  return value.map((fragment) => `<span lang="${escapeHTML(normalizeSpeechLanguage(fragment.lang, fallbackLanguage))}">${escapeHTML(fragment.text ?? '')}</span>`).join(' ');
}

const SPEECH_BLOCK_TAGS = new Set(['ARTICLE', 'DIV', 'H2', 'H3', 'H4', 'H5', 'LI', 'P', 'SECTION']);
const SPEECH_SKIP_TAGS = new Set(['BUTTON', 'INPUT', 'NAV', 'PROGRESS', 'SELECT', 'SUMMARY', 'TEXTAREA', 'SCRIPT', 'STYLE', 'SVG']);
const SPEECH_SKIP_CLASSES = new Set(['learning-tools', 'panel-subtitle', 'topic-badge', 'question-level', 'question-number', 'quiz-meta', 'feedback', 'oral-counter', 'open-answer-row', 'topic-learning-progress', 'review-row', 'review-progress', 'quiz-score', 'quiz-submit-row', 'subject-progress']);

function defaultSpeechLanguage() {
  const declared = currentLesson()?.speechLanguage ?? currentLesson()?.language
    ?? activeSubject.speechLanguage ?? activeSubject.language;
  const declaredLanguage = String(declared ?? '').trim().toLowerCase().replace('_', '-');
  if (/^(pl|polish|polski)/.test(declaredLanguage)) return 'pl-PL';
  if (/^(en|english)/.test(declaredLanguage)) return 'en-GB';
  if (/^(de|german|deutsch|niemiecki)/.test(declaredLanguage)) return 'de-DE';
  if (activeSubject.id === 'angielski') return 'en-GB';
  if (activeSubject.id === 'niemiecki') return 'de-DE';
  return 'pl-PL';
}

function normalizeSpeechLanguage(language, fallback = defaultSpeechLanguage()) {
  const value = String(language ?? '').trim().toLowerCase().replace('_', '-');
  if (/^(pl|polish|polski)/.test(value)) return 'pl-PL';
  if (value.startsWith('en')) return 'en-GB';
  if (/^(de|german|deutsch|niemiecki)/.test(value)) return 'de-DE';
  return fallback;
}

function cleanSpeechText(text) {
  return String(text ?? '')
    .replace(/[#*0-9]\uFE0F?\u20E3/gu, '')
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Regional_Indicator}\p{So}\uFE0E\uFE0F\u200D\u20E3]/gu, '')
    .replace(/[\u2022\u25AA-\u25AB\u25B6-\u25B7\u25CB\u25CF\u2190-\u21FF]/gu, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function splitSpeechText(text, fallbackLanguage) {
  const clean = cleanSpeechText(text);
  const parts = clean.match(/[^.!?;:\n]+[.!?;:]?|[.!?;:]+/g) ?? [];
  return parts.map((part) => ({ text: part.replace(/\s+/g, ' ').trim(), lang: fallbackLanguage })).filter((part) => part.text);
}

function collectSpeechFragments(root) {
  if (!root) return [];
  const fallbackLanguage = defaultSpeechLanguage();
  const fragments = [];
  const append = (text, language) => {
    const clean = cleanSpeechText(text).replace(/\s+/g, ' ');
    if (!clean) return;
    const lang = normalizeSpeechLanguage(language, fallbackLanguage);
    const previous = fragments.at(-1);
    if (previous?.lang === lang) previous.text = `${previous.text} ${clean}`;
    else fragments.push({ text: clean, lang });
  };
  const visit = (node, inheritedLanguage = '') => {
    if (node.nodeType === 3) {
      const text = node.nodeValue ?? '';
      if (inheritedLanguage) append(text, inheritedLanguage);
      else splitSpeechText(text, fallbackLanguage).forEach(({ text: part, lang }) => append(part, lang));
      return;
    }
    if (node.nodeType !== 1) return;
    const tag = node.tagName;
    if (SPEECH_SKIP_TAGS.has(tag)) return;
    if (tag === 'DETAILS' && !node.open) return;
    if (node.getAttribute?.('aria-hidden') === 'true') return;
    if ([...SPEECH_SKIP_CLASSES].some((name) => node.classList?.contains(name))) return;
    const explicitLanguage = node.getAttribute?.('lang') || inheritedLanguage;
    if (SPEECH_BLOCK_TAGS.has(tag) && fragments.length) append('', explicitLanguage || fallbackLanguage);
    for (const child of node.childNodes ?? []) visit(child, explicitLanguage);
  };
  (Array.isArray(root) ? root : [root]).filter(Boolean).forEach((node) => visit(node));
  return fragments;
}

function getVoiceForLanguage(language, availableVoices = window.speechSynthesis.getVoices()) {
  const requested = normalizeSpeechLanguage(language);
  const baseLanguage = requested.slice(0, 2);
  const voices = availableVoices;
  const matching = voices.filter((voice) => voice.lang?.toLowerCase().replace('_', '-').startsWith(`${baseLanguage}-`));
  const normalizedVoiceLang = (voice) => voice.lang.toLowerCase().replace('_', '-');
  const exact = matching.find((voice) => normalizedVoiceLang(voice) === requested.toLowerCase())
    ?? matching.find((voice) => normalizedVoiceLang(voice).startsWith(`${requested.toLowerCase()}-`));
  if (exact) return exact;
  if (baseLanguage === 'en') {
    return matching.find((voice) => normalizedVoiceLang(voice).startsWith('en-us')) ?? matching[0]
      ?? voices.find((voice) => voice.lang?.toLowerCase() === 'en');
  }
  return matching[0] ?? voices.find((voice) => voice.lang?.toLowerCase() === baseLanguage);
}

function waitForSpeechVoice(language, runId, onReady) {
  const synthesis = window.speechSynthesis;
  const normalizedLanguage = normalizeSpeechLanguage(language);
  let completed = false;
  let timer;
  const finish = () => {
    if (completed) return;
    completed = true;
    clearTimeout(timer);
    synthesis.removeEventListener?.('voiceschanged', onVoicesChanged);
    if (speechVoicesWaitCleanup === cancelWait) speechVoicesWaitCleanup = null;
    if (runId === speechRunId) onReady();
  };
  const onVoicesChanged = () => {
    if (getVoiceForLanguage(normalizedLanguage)) finish();
  };
  const cancelWait = () => {
    if (completed) return;
    completed = true;
    clearTimeout(timer);
    synthesis.removeEventListener?.('voiceschanged', onVoicesChanged);
  };
  speechVoicesWaitCleanup = cancelWait;
  synthesis.addEventListener?.('voiceschanged', onVoicesChanged);
  timer = setTimeout(finish, 1200);
}

function speakNextFragment(runId = speechRunId) {
  if (runId !== speechRunId || speechPaused || speechQueueIndex >= speechQueue.length) return;
  const fragment = speechQueue[speechQueueIndex];
  const text = cleanSpeechText(fragment.text);
  if (!text) return speakNextFragment(runId);
  const baseLanguage = normalizeSpeechLanguage(fragment.lang).slice(0, 2);
  const voices = window.speechSynthesis.getVoices();
  const voice = getVoiceForLanguage(fragment.lang, voices);
  const availableForLanguage = voices.some((item) => item.lang?.toLowerCase().replace('_', '-').startsWith(`${baseLanguage}-`));
  if (!voice && !availableForLanguage && !speechVoiceWaitedLanguages.has(fragment.lang)) {
    speechVoiceWaitedLanguages.add(fragment.lang);
    waitForSpeechVoice(fragment.lang, runId, () => speakNextFragment(runId));
    return;
  }
  speechQueueIndex += 1;
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = fragment.lang;
  utterance.voice = voice;
  utterance.onend = () => speakNextFragment(runId);
  utterance.onerror = (event) => {
    if (event.error !== 'canceled' && event.error !== 'interrupted') speakNextFragment(runId);
  };
  window.speechSynthesis.speak(utterance);
}

function stopSpeechPlayback() {
  speechRunId += 1;
  speechVoicesWaitCleanup?.();
  speechVoicesWaitCleanup = null;
  speechQueue = [];
  speechQueueIndex = 0;
  speechPaused = false;
  speechVoiceWaitedLanguages = new Set();
  window.speechSynthesis?.cancel();
}

function startSpeechPlayback() {
  if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) return;
  stopSpeechPlayback();
  const body = panel.querySelector('.learning-content-body');
  speechQueue = collectSpeechFragments([body]);
  speechQueueIndex = 0;
  speakNextFragment(speechRunId);
}

function pauseSpeechPlayback() {
  if (!('speechSynthesis' in window)) return;
  speechPaused = true;
  window.speechSynthesis.pause();
}

function resumeSpeechPlayback() {
  if (!('speechSynthesis' in window)) return;
  speechPaused = false;
  window.speechSynthesis.resume();
  if (!window.speechSynthesis.speaking && speechQueueIndex < speechQueue.length) speakNextFragment(speechRunId);
}

function renderLessonNotes(lesson, index) {
  const sections = (lesson.detailedNotes ?? []).map((section) => `
    <section class="study-section"><h5>${renderSpeechText(section.titleSpeechSegments ?? section.title)}</h5>${section.points?.length ? `<ul>${section.points.map((point, pointIndex) => `<li>${renderSpeechText(section.pointSpeechSegments?.[pointIndex] ?? point)}</li>`).join('')}</ul>` : ''}${section.example ? `<p class="study-example"><strong lang="pl-PL">Przykład:</strong> ${renderSpeechText(section.exampleSpeechSegments ?? section.example)}</p>` : ''}${section.remember ? `<p class="remember-callout"><strong lang="pl-PL">🧠 Zapamiętaj</strong><br>${renderSpeechText(section.rememberSpeechSegments ?? section.remember)}</p>` : ''}</section>`).join('');
  const definitions = (lesson.definitions ?? []).map((definition) => `<div class="definition-card"><strong>${renderSpeechText(definition.termSpeechSegments ?? definition.term)}</strong><p>${renderSpeechText(definition.meaningSpeechSegments ?? definition.meaning)}</p>${definition.example ? `<small><span lang="pl-PL">Przykład:</span> ${renderSpeechText(definition.exampleSpeechSegments ?? definition.example)}</small>` : ''}</div>`).join('');
  const vocabSections = (lesson.sections ?? []).map((section) => `
    <section class="vocab-section"><h5>${renderSpeechText(section.titleSpeechSegments ?? section.title)}</h5>
      <div class="vocabulary-list">${section.vocabulary.map(({ en, pl }) => `<div class="vocabulary-pair"><strong lang="en">${escapeHTML(en)}</strong><span lang="pl">${escapeHTML(pl)}</span></div>`).join('')}</div>
      <div class="sentence-examples"><strong lang="pl-PL">Proste zdania</strong>${section.examples.map(({ en, pl }) => `<div><span lang="en">${escapeHTML(en)}</span><small lang="pl">${escapeHTML(pl)}</small></div>`).join('')}</div>
    </section>`).join('');
  const oldNotes = !sections && !vocabSections && lesson.examples ? `<p class="study-example"><strong lang="pl-PL">Przykład:</strong> ${renderSpeechText(lesson.examplesSpeechSegments ?? lesson.examples)}</p>` : '';
  return `<div class="study-lesson-content"><p class="language-lesson-intro">${renderSpeechText(lesson.summarySpeechSegments ?? lesson.summary ?? '')}</p>${oldNotes}<div class="study-sections">${sections}</div>${definitions ? `<section class="definitions-section"><h5 lang="pl-PL">📚 Ważne pojęcia</h5><div class="definition-grid">${definitions}</div></section>` : ''}${vocabSections ? `<div class="vocab-sections">${vocabSections}</div>` : ''}${lesson.importantFacts?.length ? `<section class="summary-card"><h5 lang="pl-PL">✅ Podsumowanie</h5><ul>${lesson.importantFacts.map((fact, index) => `<li>${renderSpeechText(lesson.importantFactsSpeechSegments?.[index] ?? fact)}</li>`).join('')}</ul></section>` : ''}</div>`;
}

function renderNotes() {
  const lesson = currentLesson();
  if (!lesson) return emptyState('Miejsce na nowe lekcje!', 'Ten przedmiot czeka na pierwsze tematy. Dodamy tu notatki, przykłady i ćwiczenia, kiedy będziesz gotowy.', '📒');
  return renderLessonNotes(lesson, lessonIndex);
}

function renderTopicList() {
  const items = lessons();
  const doneCount = items.filter((_, index) => progress.done[lessonKey(index)]).length;
  const progressCard = `<div class="subject-progress"><div class="subject-progress-label"><strong>Twój postęp</strong><span>Ukończone tematy: ${doneCount}/${items.length}</span></div><div class="subject-progress-track" role="progressbar" aria-label="Ukończone tematy" aria-valuemin="0" aria-valuemax="${items.length}" aria-valuenow="${doneCount}"><span style="width:${items.length ? Math.round(doneCount / items.length * 100) : 0}%"></span></div></div>`;
  const cards = items.map((lesson, index) => `<button type="button" class="lesson-topic-card" data-open-topic="${index}"><span class="lesson-topic-icon">📘</span><span class="lesson-topic-number">${String(index + 1).padStart(2, '0')}</span><span class="lesson-topic-name">${escapeHTML(lesson.title)}</span><span class="lesson-topic-arrow" aria-hidden="true">›</span></button>`).join('');
  return `${canManageTestData() ? motherBackButton() : ''}<div class="panel-head"><div><h3>Wybierz temat</h3><p class="panel-subtitle">Wybierz lekcję, której chcesz się pouczyć.</p></div><span class="topic-badge">${items.length} ${items.length === 1 ? 'temat' : 'tematy'}</span></div>${progressCard}${items.length ? `<div class="lesson-topic-grid">${cards}</div>` : emptyState('Miejsce na nowe lekcje!', 'Ten przedmiot czeka na pierwsze tematy. Dodamy tu nowe tematy, gdy będziesz gotowy.', '📒')}`;
}

function renderMaterialMenu() {
  const lesson = currentLesson();
  if (!lesson) return renderTopicList();
  const score = appData.testResults?.[topicRef()]?.lastScore ?? appData.testScores?.[topicRef()];
  const unresolvedErrors = appData.errors.filter((item) => item.subjectId === activeSubject.id && item.lessonIndex === lessonIndex && !item.mastered).length;
  const topicProgress = `<div class="topic-learning-progress"><span>Notatki 📖</span><span>${lesson.reviewExercises?.length ? 'Ćwiczenia ✏️' : 'Ćwiczenia do dodania'}</span><span>Powtórka ${progress.done[lessonKey()] ? '✅' : 'do zrobienia'}</span><span>Sprawdzian ${score === undefined ? '—' : `${score}%`}</span>${unresolvedErrors ? `<span>Do powtórzenia: ${unresolvedErrors}</span>` : ''}</div>`;
  const options = [
    ['notes', '📖', 'NOTATKI', 'Krótkie i jasne opracowanie tematu'],
    ['cheatsheet', '🧠', 'ŚCIĄGA', 'Najważniejsze rzeczy do zapamiętania'],
    ['practice', '✏️', 'ĆWICZENIA', 'Poćwicz i sprawdź odpowiedzi'],
    ['review', '🔄', 'POWTÓRKA', 'Ćwiczenia utrwalające temat'],
    ['quiz', '📝', 'SPRAWDZIAN', 'Sprawdź, ile już umiesz'],
    ['oral', '🎯', 'NAUKA Z MAMĄ', 'Pytania i odpowiedzi ustne'],
  ];
  return `${canManageTestData() ? motherBackButton() : ''}<div class="learning-nav"><button type="button" class="learning-back-button" data-nav="topics">← Wróć do tematów</button><button type="button" class="learning-back-button secondary" data-nav="subjects">← Wszystkie przedmioty</button></div><div class="panel-head topic-screen-heading"><div><h3>📘 ${escapeHTML(lesson.title)}</h3><p class="panel-subtitle">Czego chcesz się teraz uczyć?</p></div></div>${topicProgress}<button type="button" class="favorite-topic-button" data-toggle-favorite>${isFavorite(activeSubject.id, lessonIndex) ? '⭐ Usuń z „Moje do nauki”' : '⭐ Dodaj do „Moje do nauki”'}</button><div class="material-choice-grid">${options.map(([id, icon, title, description]) => `<button type="button" class="material-choice-card" data-open-material="${id}"><span class="material-choice-icon">${icon}</span><span class="material-choice-title">${title}</span><span class="material-choice-description">${description}</span><span class="material-choice-arrow" aria-hidden="true">›</span></button>`).join('')}</div>`;
}

function renderMaterialContent() {
  const lesson = currentLesson();
  if (!lesson) return renderTopicList();
  const titles = { notes: '📖 NOTATKI', cheatsheet: '🧠 ŚCIĄGA', practice: '✏️ ĆWICZENIA', review: '🔄 POWTÓRKA', quiz: '📝 SPRAWDZIAN', oral: '🎯 NAUKA Z MAMĄ' };
  const renderers = { notes: renderNotes, cheatsheet: renderCheatsheet, practice: renderPractice, review: renderReview, quiz: renderQuiz, oral: renderOral };
  const tools = `<div class="learning-tools"><button type="button" data-read-notes>🔊 Przeczytaj</button><button type="button" data-pause-reading>⏸ Pauza</button><button type="button" data-resume-reading>▶ Wznów</button><button type="button" data-stop-reading>⏹ Zatrzymaj</button><button type="button" data-print-material>🖨 Drukuj</button></div>`;
  return `${canManageTestData() ? motherBackButton() : ''}<div class="learning-nav"><button type="button" class="learning-back-button" data-nav="materials">← ${escapeHTML(lesson.title)}</button><button type="button" class="learning-back-button secondary" data-nav="topics">← Wróć do tematów</button><button type="button" class="learning-back-button secondary" data-nav="subjects">← Wszystkie przedmioty</button></div><div class="learning-material-heading"><h3>${titles[activeTab]}</h3><p>${escapeHTML(lesson.title)}</p></div>${tools}<div class="learning-content-body">${renderers[activeTab]()}</div>`;
}

function renderQuiz() {
  const lesson = currentLesson();
  const questions = quizQuestions(lesson);
  if (!questions.length) return `<div class="panel-head"><div><h3>Sprawdzian</h3><p class="panel-subtitle">Sprawdź, co już pamiętasz. Bez stresu — pomyłki też uczą!</p></div><span class="topic-badge">🎯 Test</span></div>${emptyState('Sprawdzian pojawi się z kolejnymi materiałami', 'Do tego tematu dodamy pytania, gdy będą gotowe.', '🧩')}`;
  return `<div class="panel-head"><div><h3>${renderSpeechText(lesson.titleSpeechSegments ?? lesson.title)}</h3><p class="panel-subtitle" lang="pl-PL">Odpowiedz na pytania, a potem sprawdź wynik.</p></div><span class="quiz-meta">${questions.length} ${questionCountLabel(questions.length)}</span></div>
    <div class="quiz-question-list">${questions.map((question, questionIndex) => {
      const isOpen = question.type === 'open';
      const response = quizAnswers[questionIndex] ?? '';
      const answers = isOpen ? `<div class="open-answer-block"><label class="open-answer-row"><span>Twoja odpowiedź</span><input type="text" data-open-answer="${questionIndex}" value="${escapeHTML(response)}" placeholder="Wpisz odpowiedź" autocomplete="off" /></label><button type="button" class="open-answer-check" data-check-open="${questionIndex}">Sprawdź</button></div>`
        : `<div class="answer-list">${question.answers.map((answer, answerIndex) => `<button type="button" class="answer-option ${response === answerIndex ? 'selected' : ''}" data-choice="${questionIndex}" data-value="${answerIndex}" ${quizGraded ? 'disabled' : ''}>${String.fromCharCode(65 + answerIndex)}. &nbsp;${escapeHTML(answer)}</button>`).join('')}</div>`;
      const level = question.level ?? ['Łatwe', 'Średnie', 'Trudniejsze'][questionIndex % 3];
      const promptSpeech = question.speechSegments ?? [{ text: question.question, lang: question.promptLanguage ?? defaultSpeechLanguage() }];
      return `<article class="quiz-question-card" id="quiz-question-${questionIndex}"><p class="quiz-question"><span class="question-number">${questionIndex + 1}.</span> ${renderSpeechText(promptSpeech)} <small class="question-level">${escapeHTML(level)}</small></p>${answers}<div id="quiz-feedback-${questionIndex}" class="feedback" role="status"></div></article>`;
    }).join('')}</div>
    <div class="quiz-submit-row"><button class="action-button quiz-submit" type="button" data-check-quiz ${quizGraded ? 'disabled' : ''}>Sprawdź odpowiedzi <span>✓</span></button><div id="quiz-score" class="quiz-score" role="status"></div></div>`;
}

function renderCheatsheet() {
  const sheet = currentLesson()?.cheatSheet;
  if (sheet?.length) return `<div class="panel-head"><div><h3><span lang="pl-PL">💡 Ściąga:</span> ${renderSpeechText(currentLesson().titleSpeechSegments ?? currentLesson().title)}</h3><p class="panel-subtitle" lang="pl-PL">Szybka karta przed sprawdzianem.</p></div><span class="topic-badge">Powtórz w 2 minuty</span></div><div class="cheat-grid">${sheet.map((section) => `<section class="cheat-card"><h4>${renderSpeechText(section.titleSpeechSegments ?? section.title)}</h4>${section.items?.length ? `<dl>${section.items.map((item) => `<div><dt>${renderSpeechText(item.labelSpeechSegments ?? item.label)}</dt><dd>${renderSpeechText(item.textSpeechSegments ?? item.text)}</dd></div>`).join('')}</dl>` : ''}${section.rule ? `<p class="cheat-rule"><strong lang="pl-PL">Reguła:</strong> ${renderSpeechText(section.ruleSpeechSegments ?? section.rule)}</p>` : ''}${section.example ? `<p class="study-example"><strong lang="pl-PL">Przykład:</strong> ${renderSpeechText(section.exampleSpeechSegments ?? section.example)}</p>` : ''}${section.remember ? `<p class="remember-callout"><strong lang="pl-PL">🧠 Zapamiętaj</strong><br>${renderSpeechText(section.rememberSpeechSegments ?? section.remember)}</p>` : ''}</section>`).join('')}</div>`;
  const facts = currentLesson()?.cheatFacts;
  if (!facts?.length) return `<div class="panel-head"><div><h3>Ściąga do zapamiętania</h3><p class="panel-subtitle">Najważniejsze zasady w jednym miejscu.</p></div><span class="topic-badge">💡 Przydatne!</span></div>${emptyState('Ten materiał będzie dostępny po dodaniu treści.', 'Wróć do wyboru innego materiału albo tematu.', '✨')}`;
  return `<div class="panel-head"><div><h3><span lang="pl-PL">Ściąga:</span> ${renderSpeechText(currentLesson().titleSpeechSegments ?? currentLesson().title)}</h3><p class="panel-subtitle" lang="pl-PL">Krótko i na temat — rzuć okiem przed powtórką.</p></div><span class="topic-badge">💡 Zapamiętaj</span></div><div class="fact-list">${facts.map((fact, index) => `<div class="fact-row"><b>${index + 1}.</b><span>${renderSpeechText(currentLesson().cheatFactSpeechSegments?.[index] ?? fact)}</span></div>`).join('')}</div>`;
}

function renderReview(isPractice = false) {
  const items = lessons();
  const lesson = currentLesson();
  if (!lesson) return emptyState('Powtórka czeka na pierwsze tematy', 'Kiedy pojawią się lekcje, dodamy tu ćwiczenia.', '🌼');
  const doneCount = items.filter((_, index) => progress.done[lessonKey(index)]).length;
  const reviewExercises = lesson.reviewExercises ?? [];
  const exercises = reviewExercises.length ? `<div class="review-exercises"><h4>Krótka powtórka: ${escapeHTML(currentLesson().title)}</h4>${reviewExercises.map((exercise, index) => {
    const key = `${activeSubject.id}:${lessonIndex}:${index}`;
    const result = reviewResults[key];
    const isChoice = exercise.type === 'choice' || exercise.type === 'truefalse';
    const feedback = result === undefined ? '' : result
      ? 'Brawo! To dobra odpowiedź! 🌟'
      : `Spróbuj jeszcze raz. ${renderSpeechText(exercise.hint ?? '')} ${isChoice ? `Odpowiedź: ${escapeHTML(exercise.options?.[exercise.correct] ?? (exercise.correct === 0 ? 'Prawda' : 'Fałsz'))}.` : exercise.acceptedAnswers?.length ? `Odpowiedź: ${escapeHTML(exercise.acceptedAnswers.join(' lub '))}.` : ''}`;
    const field = isChoice
      ? `<div class="review-choice-list">${(exercise.options ?? ['Prawda', 'Fałsz']).map((option, optionIndex) => `<button type="button" class="review-choice ${reviewAnswers[key] === optionIndex ? 'selected' : ''}" data-review-choice="${index}" data-review-value="${optionIndex}">${escapeHTML(option)}</button>`).join('')}</div><button type="button" class="review-check-answer" data-check-review="${index}">Sprawdź</button>`
      : `<div class="review-answer-controls"><input id="review-answer-${index}" type="text" data-review-answer="${index}" value="${escapeHTML(reviewAnswers[key] ?? '')}" placeholder="${exercise.type === 'open' ? 'Odpowiedz własnymi słowami' : 'Wpisz odpowiedź'}" autocomplete="off" /><button type="button" class="review-check-answer" data-check-review="${index}">Sprawdź</button></div>`;
    const knownAnswer = isChoice ? exercise.options?.[exercise.correct] ?? (exercise.correct === 0 ? 'Prawda' : 'Fałsz') : exercise.acceptedAnswers?.join(' lub ');
    const answerReveal = knownAnswer ? `<details class="review-answer-reveal"><summary>▶️ Pokaż odpowiedź</summary><p>${renderSpeechText(exercise.answerSpeechSegments ?? knownAnswer)}</p></details>` : '';
    const promptSpeech = exercise.speechSegments ?? [{ text: exercise.prompt, lang: exercise.promptLanguage ?? defaultSpeechLanguage() }];
    return `<div class="review-exercise"><label ${isChoice ? '' : `for="review-answer-${index}"`}>${exercise.type === 'translate' ? '🌐 ' : ''}${renderSpeechText(promptSpeech)}</label>${field}<div class="feedback ${result === false ? 'wrong' : ''}" role="status">${feedback}</div>${answerReveal}</div>`;
  }).join('')}</div>` : '';
  const quickFacts = [...(lesson.importantFacts ?? []), ...(lesson.definitions ?? []).map((definition) => `${definition.term}: ${definition.meaning}`)];
  return `<div class="panel-head"><div><h3>${renderSpeechText(lesson.titleSpeechSegments ?? lesson.title)}</h3><p class="panel-subtitle" lang="pl-PL">${isPractice ? 'Poćwicz bez presji. Każda próba pomaga.' : 'Krótkie pytania, pojęcia i zasady do utrwalenia.'}</p></div><span class="topic-badge">${isPractice ? '✏️ Ćwiczenia' : '🔁 Powtórka'}</span></div>
    ${!isPractice && quickFacts.length ? `<section class="review-key-facts"><h4 lang="pl-PL">Najważniejsze do powtórzenia</h4>${quickFacts.map((fact) => `<p>${renderSpeechText(fact)}</p>`).join('')}</section>` : ''}${exercises || emptyState('Ćwiczenia pojawią się po dodaniu materiału', 'W tym temacie nie ma jeszcze ćwiczeń do sprawdzenia.', '🌱')}
    <label class="review-row"><span><strong>Oznacz temat jako powtórzony</strong><small>${escapeHTML(lesson.title)}</small></span><input class="review-check" type="checkbox" data-review="${lessonIndex}" ${progress.done[lessonKey(lessonIndex)] ? 'checked' : ''} aria-label="Oznacz ${escapeHTML(lesson.title)} jako powtórzony" /></label>
    <div class="review-progress">🌟 Powtórzone tematy: ${doneCount} z ${items.length}</div><p class="gentle-message">Co jeszcze trzeba powtórzyć?</p>`;
}

function renderPractice() { return renderReview(true); }

function oralQuestions() {
  const lesson = currentLesson();
  return [...quizQuestions(lesson).map((question, index) => ({
    prompt: question.question,
    answer: question.type === 'open' ? (question.acceptedAnswers ?? []).join(' lub ') : question.answers?.[question.correct],
    answerSpeechSegments: question.answerSpeechSegments,
    explanation: question.explanation,
    speechSegments: question.speechSegments,
    promptLanguage: question.promptLanguage,
    explanationSpeechSegments: question.explanationSpeechSegments ?? (question.explanation ? [{ text: question.explanation, lang: question.explanationLanguage ?? 'pl-PL' }] : []),
    id: `oral-quiz-${index}`,
  })), ...(lesson?.reviewExercises ?? []).map((exercise, index) => ({
    prompt: exercise.prompt,
    answer: exercise.type === 'choice' || exercise.type === 'truefalse' ? exercise.options?.[exercise.correct] ?? (exercise.correct === 0 ? 'Prawda' : 'Fałsz') : exercise.acceptedAnswers?.join(' lub '),
    answerSpeechSegments: exercise.answerSpeechSegments,
    explanation: exercise.hint,
    speechSegments: exercise.speechSegments,
    promptLanguage: exercise.promptLanguage,
    explanationSpeechSegments: exercise.hintSpeechSegments ?? (exercise.hint ? [{ text: exercise.hint, lang: exercise.hintLanguage ?? 'pl-PL' }] : []),
    id: `oral-review-${index}`,
  }))].filter((item) => item.prompt);
}

function renderOral() {
  const questions = oralQuestions();
  if (!questions.length) return emptyState('Pytania ustne pojawią się po dodaniu materiału', 'Możecie wtedy spokojnie ćwiczyć razem.', '🎯');
  if (oralIndex >= questions.length) return `<div class="oral-session-end"><h3>Gotowe! 🌱</h3><p>Dzisiaj przećwiczyliście ${oralSessionDone} pytań.</p><p>Do powtórzenia zostało ${appData.errors.filter((item) => !item.mastered).length}.</p><button type="button" data-reset-oral>Jeszcze raz</button></div>`;
  const item = questions[oralIndex];
  const promptSpeech = item.speechSegments ?? [{ text: item.prompt, lang: item.promptLanguage ?? defaultSpeechLanguage() }];
  return `<section class="oral-session"><p class="oral-counter">Pytanie ${oralIndex + 1} z ${questions.length}</p><h4>${renderSpeechText(promptSpeech)}</h4>${item.answer ? `<details class="oral-answer"><summary>Pokaż przykładową odpowiedź</summary><p>${renderSpeechText(item.answerSpeechSegments ?? item.answer)} ${renderSpeechText(item.explanationSpeechSegments ?? item.explanation ?? '')}</p></details>` : ''}<p class="gentle-message">Mama pyta, Aleksander odpowiada — spokojnie, bez pośpiechu.</p><div class="oral-actions"><button type="button" data-oral-result="know">✅ UMIEM</button><button type="button" data-oral-result="repeat">🔁 MUSZĘ POWTÓRZYĆ</button></div></section>`;
}

function renderTopicLinks(entries, emptyText) {
  if (!entries.length) return emptyState('Na razie pusto', emptyText, '🌱');
  return `<div class="personal-topic-list">${entries.map(({subject,lesson,index,extra=''})=>`<article><button type="button" data-direct-topic="${subject.id}:${index}">▶ Ucz się: ${escapeHTML(lesson.title)} <small>${escapeHTML(subject.name)}</small></button>${extra}</article>`).join('')}</div>`;
}

function renderFavorites() {
  const entries = appData.favorites.map(resolveTopic).filter(Boolean);
  return `${motherBackButton()}<h3>⭐ Moje do nauki</h3>${renderTopicLinks(entries, 'Dodaj gwiazdkę przy temacie, do którego chcesz wrócić.')}`;
}

function renderErrors() {
  const entries = appData.errors.filter((item) => !item.mastered);
  const cards = entries.map((item) => { const found=resolveTopic(topicRef(item.subjectId,item.lessonIndex)); return `<article class="saved-error"><p>${item.questionNumber ? `<b>Pytanie ${item.questionNumber}.</b> ` : ''}${escapeHTML(item.prompt)}</p><small>${found?`${escapeHTML(found.lesson.title)} · ${escapeHTML(found.subject.name)}`:'Temat'} · ${item.attempts ?? 1} prób</small><details><summary>Pokaż odpowiedź</summary><p>Twoja odpowiedź: ${escapeHTML(item.lastAnswer)}</p><p>Poprawna odpowiedź: ${escapeHTML(item.correctAnswer ?? '')}</p><p>${escapeHTML(item.explanation ?? '')}</p></details>${canManageTestData() ? `<button type="button" data-error-mastered="${escapeHTML(item.id)}">Oznacz jako opanowane</button>` : ''}${found?`<button type="button" data-direct-topic="${found.subject.id}:${found.index}">Wróć do tematu</button>`:''}</article>`; }).join('');
  return `${motherBackButton()}<h3>❌ ${appData.mode === 'mama' ? 'Błędy Aleksandra' : 'Powtórz moje błędy'}</h3><p>Masz ${entries.length} rzeczy do powtórzenia. Spokojnie, każda próba pomaga.</p>${cards?`<div class="personal-topic-list">${cards}</div>`:emptyState('Na razie nie ma błędów do powtórzenia.', 'Świetnie, możesz wybrać kolejny temat. 🌱')}${canManageTestData() ? '<div class="data-reset-tools"><button type="button" class="data-reset-button" data-reset="errors">🧹 Wyczyść moje błędy</button></div>' : ''}`;
}

function renderFiveMinutes() {
  const errors = appData.errors.filter((item) => !item.mastered).slice(0, 5);
  const entries = errors.length ? errors.map((item) => ({ prompt:item.prompt, answer:item.correctAnswer, explanation:item.explanation, ref:topicRef(item.subjectId,item.lessonIndex) })) : subjects.flatMap((subject) => subject.lessons.flatMap((lesson,index) => quizQuestions(lesson).slice(0,1).map((question) => ({prompt:question.question,answer:question.type==='open'?(question.acceptedAnswers??[]).join(' lub '):question.answers?.[question.correct],explanation:question.explanation,ref:topicRef(subject.id,index)})))).slice(0,5);
  const flashFacts = subjects.flatMap((subject) => subject.lessons.flatMap((lesson,index) => (lesson.importantFacts ?? []).slice(0,1).map((fact) => ({fact, title:lesson.title, subject:subject.name, ref:topicRef(subject.id,index)})))).slice(0,3);
  return `<div class="learning-nav"><button type="button" class="learning-back-button" data-nav="topics">← Przedmiot i tematy</button></div><h3>⚡ Mam 5 minut</h3><p>Krótka, spokojna sesja. Zacznij od rzeczy, które warto powtórzyć.</p><section class="review-key-facts"><h4>Najważniejsze wskazówki</h4>${flashFacts.map((item)=>`<p>${escapeHTML(item.fact)} <small>(${escapeHTML(item.title)} · ${escapeHTML(item.subject)})</small></p>`).join('')}</section><section class="five-minute-questions"><h4>${errors.length?'Pytania wymagające powtórki':'Krótkie pytania'}</h4>${entries.length?entries.map((item,index)=>`<article><p>${index+1}. ${escapeHTML(item.prompt)}</p><details><summary>Pokaż odpowiedź</summary><p>${escapeHTML(item.answer??'')}${item.explanation?` — ${escapeHTML(item.explanation)}`:''}</p></details><button type="button" data-direct-topic="${escapeHTML(item.ref)}">Otwórz temat</button></article>`).join(''):emptyState('Dodajemy krótkie pytania', 'Skorzystaj z listy tematów i wybierz materiał do nauki.', '📝')}</section>`;
}

function renderProgress() {
  const detailRows = subjects.flatMap((subject) => subject.lessons.map((lesson, index) => {
    const ref = topicRef(subject.id, index);
    const item = progress.topics[ref] ?? {};
    const score = appData.testResults?.[ref] ?? appData.testScores?.[ref];
    const completedExercises = item.exercisesCompleted ?? 0;
    const totalExercises = lesson.reviewExercises?.length ?? 0;
    const percent = progress.done[ref] ? 100 : Math.min(95, Math.round((item.started ? 20 : 0) + (totalExercises ? completedExercises / totalExercises * 40 : 0) + (score !== undefined ? 40 : 0)));
    const errorNumbers = appData.errors.filter((error) => error.subjectId === subject.id && error.lessonIndex === index && error.source === 'quiz' && !error.mastered).map((error) => error.questionNumber).filter(Boolean);
    return `<article class="topic-progress-card"><div class="topic-progress-heading"><strong>${escapeHTML(subject.name)} · ${escapeHTML(lesson.title)}</strong><span>${percent}%</span></div><div class="subject-progress-track"><b style="width:${percent}%"></b></div><p>${item.started ? 'Rozpoczęty' : 'Jeszcze nieotwarty'} · ćwiczenia: ${completedExercises}/${totalExercises}${score !== undefined ? ` · ostatni sprawdzian: ${typeof score === 'object' ? `${score.correct}/${score.total}` : `${score}%`}` : ' · sprawdzian: brak wyniku'}</p>${typeof score === 'object' && score.bestScore !== undefined ? `<small>Najlepszy wynik: ${score.bestScore}%</small>` : ''}<p>Do powtórki: ${errorNumbers.length ? `pytania ${[...new Set(errorNumbers)].join(', ')}` : 'brak zapisanych błędów'}</p><small>Ostatnia nauka: ${item.lastStudiedAt ? new Date(item.lastStudiedAt).toLocaleString('pl-PL') : 'brak danych'}</small></article>`;
  })).join('');
  const resultRows = (appData.testHistory ?? []).slice().reverse().slice(0, 12).map((result) => `<article class="result-history-row"><strong>${escapeHTML(result.subjectName)} · ${escapeHTML(result.lessonTitle)}</strong><span>${result.correct}/${result.total} poprawnych (${result.score}%)</span><small>${new Date(result.completedAt).toLocaleString('pl-PL')} · błędne pytania: ${(result.wrongNumbers ?? []).length ? result.wrongNumbers.join(', ') : 'brak'}</small></article>`).join('');
  return `${motherBackButton()}<h3>📊 ${canManageTestData() ? 'Postępy Aleksandra' : 'Moje postępy'}</h3><div class="progress-topic-list">${detailRows}</div>${canManageTestData() ? `<section class="mother-report-section"><h4>📝 Wyniki sprawdzianów</h4>${resultRows || '<p>Nie ma jeszcze zapisanych sprawdzianów.</p>'}</section><div class="data-reset-tools"><button type="button" class="data-reset-button" data-reset="results">♻️ Wyzeruj moje wyniki</button><button type="button" class="data-reset-button quiet" data-reset="all">🧹 Wyczyść wszystkie dane testowe</button></div>` : ''}`;
}

function motherBackButton() {
  return canManageTestData() ? '<div class="learning-nav"><button type="button" class="learning-back-button" data-nav="mother">← Panel Mamy</button></div>' : '<div class="learning-nav"><button type="button" class="learning-back-button" data-nav="topics">← Przedmiot i tematy</button></div>';
}

function renderMotherPanel() {
  const visited = [...new Set(appData.recentTopics ?? [])].map(resolveTopic).filter(Boolean);
  const allTopics = subjects.flatMap((subject) => subject.lessons.map((lesson, index) => ({ subject, lesson, index })));
  const stats = (appData.testHistory ?? []).reduce((total, result) => ({ correct: total.correct + result.correct, wrong: total.wrong + result.wrong }), { correct: 0, wrong: 0 });
  const commonErrors = Object.values(appData.errors.filter((item) => !item.mastered).reduce((counts, item) => {
    const key = `${item.subjectId}:${item.lessonIndex}:${item.prompt}`;
    counts[key] ??= { prompt: item.prompt, count: 0, subjectId: item.subjectId, lessonIndex: item.lessonIndex };
    counts[key].count += item.attempts ?? 1;
    return counts;
  }, {})).sort((a, b) => b.count - a.count).slice(0, 5);
  const topicRows = allTopics.map(({ subject, lesson, index }) => {
    const ref = topicRef(subject.id, index);
    const item = progress.topics[ref] ?? {};
    const score = appData.testResults?.[ref] ?? appData.testScores?.[ref];
    const mistakes = appData.errors.filter((error) => error.subjectId === subject.id && error.lessonIndex === index && !error.mastered);
    const pct = progress.done[ref] ? 100 : Math.min(95, Math.round((item.started ? 20 : 0) + ((lesson.reviewExercises?.length ?? 0) ? (item.exercisesCompleted ?? 0) / lesson.reviewExercises.length * 40 : 0) + (score !== undefined ? 40 : 0)));
    return `<article class="mother-topic-row"><div class="topic-progress-heading"><strong>${escapeHTML(subject.name)} · ${escapeHTML(lesson.title)}</strong><span>${pct}%</span></div><div class="subject-progress-track"><b style="width:${pct}%"></b></div><small>${progress.done[ref] ? 'Ukończony' : item.started ? 'Rozpoczęty' : 'Jeszcze nieotwierany'} · ćwiczenia ${item.exercisesCompleted ?? 0}/${lesson.reviewExercises?.length ?? 0} (prób: ${item.exerciseAttempts ?? 0}) · sprawdzian ${score === undefined ? 'brak wyniku' : typeof score === 'object' ? `${score.correct}/${score.total} (${score.lastScore}%, najlepszy: ${score.bestScore}%)` : `${score}%`} · błędne pytania ${mistakes.filter((error) => error.source === 'quiz').map((error) => error.questionNumber).filter(Boolean).join(', ') || 'brak'}${item.lastStudiedAt ? ` · ${new Date(item.lastStudiedAt).toLocaleDateString('pl-PL')}` : ''}</small></article>`;
  }).join('');
  const errorList = appData.errors.filter((item) => !item.mastered);
  const resultRows = (appData.testHistory ?? []).slice().reverse().slice(0, 8).map((item) => `<li>${escapeHTML(item.subjectName)} · ${escapeHTML(item.lessonTitle)}: ${item.correct}/${item.total} (${item.score}%), błędy: ${(item.wrongNumbers ?? []).join(', ') || 'brak'}</li>`).join('');
  const favoriteEntries = appData.favorites.map(resolveTopic).filter(Boolean);
  const oralChoices = allTopics.map(({ subject, lesson, index }) => `<button type="button" data-start-mother-oral="${subject.id}:${index}">🎯 ${escapeHTML(subject.name)} · ${escapeHTML(lesson.title)}</button>`).join('');
  const completedSessions = (appData.motherSessions ?? []).slice().reverse().slice(0, 8).map((session) => `<li>${escapeHTML(session.subjectName)} · ${escapeHTML(session.lessonTitle)} — ${session.questions} pytań, ${new Date(session.completedAt).toLocaleString('pl-PL')}</li>`).join('');
  return `<section class="mother-dashboard"><div class="mother-panel-heading"><span>👩 PANEL MAMY</span><p>Wspieraj naukę Aleksandra spokojnie, krok po kroku.</p></div><div class="mother-summary-grid"><article><strong>${visited.length}</strong><span>ostatnio otwieranych tematów</span></article><article><strong>${(appData.testHistory ?? []).length}</strong><span>ukończonych sprawdzianów</span></article><article><strong>${stats.correct}</strong><span>poprawnych odpowiedzi</span></article><article><strong>${stats.wrong}</strong><span>błędnych odpowiedzi</span></article></div>
  <details open class="mother-report-section"><summary>📊 Postępy Aleksandra i tematy</summary><div class="mother-topic-list">${topicRows || '<p>Dodajemy tematy do nauki.</p>'}</div></details>
  <details class="mother-report-section"><summary>📝 Wyniki sprawdzianów</summary><ul class="mother-result-list">${resultRows || '<li>Nie ma jeszcze zakończonych sprawdzianów.</li>'}</ul></details>
  <details class="mother-report-section"><summary>❌ Moje błędy (${errorList.length})</summary>${errorList.length ? `<div class="personal-topic-list">${errorList.slice(0, 10).map((item) => { const found = resolveTopic(topicRef(item.subjectId, item.lessonIndex)); return `<article class="saved-error"><p>${item.questionNumber ? `Pytanie ${item.questionNumber}. ` : ''}${escapeHTML(item.prompt)}</p><small>${found ? `${escapeHTML(found.subject.name)} · ${escapeHTML(found.lesson.title)}` : ''}</small><details><summary>Pokaż odpowiedź</summary><p>Odpowiedź Aleksandra: ${escapeHTML(item.lastAnswer)}</p><p>Poprawna odpowiedź: ${escapeHTML(item.correctAnswer ?? '')}</p><p>${escapeHTML(item.explanation ?? '')}</p></details><button type="button" data-error-mastered="${escapeHTML(item.id)}">Oznacz jako opanowane</button>${found ? `<button type="button" data-direct-topic="${found.subject.id}:${found.index}">Wróć do tematu</button>` : ''}</article>`; }).join('')}</div>` : '<p>Nie ma zapisanych błędów.</p>'}</details>
  <details class="mother-report-section"><summary>🔄 Tematy do powtórzenia</summary>${renderTopicLinks([...new Map(errorList.map((item) => { const found = resolveTopic(topicRef(item.subjectId, item.lessonIndex)); return found ? [topicRef(item.subjectId, item.lessonIndex), found] : []; }).filter(([key]) => key).map(([key, value]) => [key, value])).values()], 'Nie ma tematów do pilnej powtórki.')}</details>
  <details class="mother-report-section"><summary>📌 Najczęściej powtarzające się błędy</summary>${commonErrors.length ? `<ol>${commonErrors.map((item) => `<li>${escapeHTML(item.prompt)} <small>(${item.count} prób)</small></li>`).join('')}</ol>` : '<p>Brak powtarzających się błędów.</p>'}</details>
  <details class="mother-report-section"><summary>🎯 Nauka z mamą — wybierz temat</summary><p>Wybierz temat, a potem pytaj i odpowiadajcie na zmianę.</p><div class="mother-topic-choices">${oralChoices || '<p>Wybierz przedmiot i dodaj temat.</p>'}</div><h4>Zakończone sesje</h4><ul class="mother-result-list">${completedSessions || '<li>Nie ma jeszcze zakończonych sesji.</li>'}</ul></details>
  <details class="mother-report-section"><summary>⭐ Moje do nauki (${favoriteEntries.length})</summary>${renderTopicLinks(favoriteEntries, 'Dodaj gwiazdkę przy temacie, do którego chcecie wrócić.')}</details>
  <details class="mother-report-section"><summary>📚 Przedmioty</summary><div class="mother-topic-choices">${subjects.map((subject) => `<button type="button" data-mother-subject="${subject.id}">${escapeHTML(subject.icon)} ${escapeHTML(subject.name)}</button>`).join('')}</div></details>
  <div class="data-reset-tools"><button type="button" class="data-reset-button" data-reset="errors">🧹 Wyczyść moje błędy</button><button type="button" class="data-reset-button" data-reset="results">♻️ Wyzeruj moje wyniki</button><button type="button" class="data-reset-button quiet" data-reset="all">🧹 Wyczyść wszystkie dane testowe</button></div></section>`;
}

function renderToday() {
  const refs=[...(appData.recentTopics??[]),...appData.favorites,...appData.errors.filter((item)=>!item.mastered).map((item)=>topicRef(item.subjectId,item.lessonIndex))];
  const unique=[...new Set(refs)].map(resolveTopic).filter(Boolean).slice(0,5);
  const entries=unique.length?unique:subjects.flatMap((subject)=>subject.lessons.map((lesson,index)=>({subject,lesson,index}))).slice(0,5);
  return `${motherBackButton()}<h3>🏠 Dzisiaj się uczę</h3><p>Wybierz jedną małą rzecz na dziś. 🌱</p>${renderTopicLinks(entries,'Wybierz temat i zrób mały krok.')}`;
}

function renderMotherStudySelection() {
  const entries = subjects.flatMap((subject) => subject.lessons.map((lesson, index) => ({ subject, lesson, index })));
  const choices = entries.map(({ subject, lesson, index }) => `<button type="button" data-start-mother-oral="${subject.id}:${index}">🎯 ${escapeHTML(subject.name)} · ${escapeHTML(lesson.title)}</button>`).join('');
  return `<h3>🎯 Nauka z mamą</h3><p>Wybierz temat. Mama zadaje pytanie, Aleksander odpowiada, a potem przechodzicie dalej.</p><div class="mother-topic-choices">${choices || emptyState('Brak tematów', 'Wybierz przedmiot i dodaj materiały.', '📚')}</div>`;
}

function renderPanel() {
  stopSpeechPlayback();
  const screens = { mother: renderMotherPanel, motherStudy: renderMotherStudySelection, topics: renderTopicList, materials: renderMaterialMenu, content: renderMaterialContent, today: renderToday, favorites: renderFavorites, errors: renderErrors, fiveMinutes: renderFiveMinutes, progress: renderProgress };
  panel.innerHTML = (screens[activeView] ?? renderTopicList)();
  renderHomeDashboard();
  panel.querySelectorAll('[data-open-topic]').forEach((button) => button.addEventListener('click', () => {
    lessonIndex = Number(button.dataset.openTopic);
    activeView = 'materials';
    trackTopic();
    appData.recentTopics = [topicRef(), ...(appData.recentTopics ?? []).filter((ref) => ref !== topicRef())].slice(0, 10);
    persistUserData();
    renderHomeDashboard();
    quizAnswers = {};
    quizGraded = false;
    reviewAnswers = {};
    reviewResults = {};
    renderPanel();
  }));
  panel.querySelectorAll('[data-open-material]').forEach((button) => button.addEventListener('click', () => {
    activeTab = button.dataset.openMaterial;
    activeView = 'content';
    if (activeTab === 'oral') { oralIndex = 0; oralSessionDone = 0; oralSessionStartedAt = Date.now(); }
    quizAnswers = {};
    quizGraded = false;
    renderPanel();
  }));
  panel.querySelector('[data-toggle-favorite]')?.addEventListener('click', () => {
    toggleFavorite();
    renderPanel();
  });
  panel.querySelectorAll('[data-nav]').forEach((button) => button.addEventListener('click', () => {
    if (button.dataset.nav === 'mother') {
      activeView = 'mother';
      renderPanel();
      return;
    }
    if (button.dataset.nav === 'subjects') {
      activeView = 'topics';
      showDashboard = true;
      renderPanel();
      if (window.matchMedia('(max-width: 680px)').matches) {
        mobileSubjectSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
        mobileSubjectSelect.focus({ preventScroll: true });
      } else {
        subjectList.querySelector('[data-subject]')?.focus();
      }
      return;
    }
    activeView = button.dataset.nav;
    renderPanel();
  }));
  panel.querySelectorAll('[data-direct-topic]').forEach((button) => button.addEventListener('click', () => {
    const [subjectId, rawIndex] = button.dataset.directTopic.split(':');
    const foundSubject = subjects.find((subject) => subject.id === subjectId);
    if (!foundSubject?.lessons[Number(rawIndex)]) return;
    activeSubject = foundSubject;
    lessonIndex = Number(rawIndex);
    showDashboard = false;
    activeView = 'materials';
    trackTopic();
    document.querySelector('#subject-title').textContent = activeSubject.name;
    document.querySelector('#current-subject-crumb').textContent = activeSubject.name;
    appData.recentTopics = [topicRef(), ...(appData.recentTopics ?? []).filter((ref) => ref !== topicRef())].slice(0, 10);
    persistUserData();
    renderSubjects();
    renderPanel();
  }));
  panel.querySelectorAll('[data-mother-subject]').forEach((button) => button.addEventListener('click', () => {
    selectSubject(button.dataset.motherSubject);
  }));
  panel.querySelectorAll('[data-start-mother-oral]').forEach((button) => button.addEventListener('click', () => {
    const [subjectId, rawIndex] = button.dataset.startMotherOral.split(':');
    const found = subjects.find((subject) => subject.id === subjectId);
    if (!found?.lessons[Number(rawIndex)]) return;
    activeSubject = found;
    lessonIndex = Number(rawIndex);
    document.querySelector('#subject-title').textContent = found.name;
    document.querySelector('#current-subject-crumb').textContent = found.name;
    renderSubjects();
    trackTopic();
    appData.recentTopics = [topicRef(), ...(appData.recentTopics ?? []).filter((ref) => ref !== topicRef())].slice(0, 10);
    persistUserData();
    activeTab = 'oral';
    activeView = 'content';
    oralIndex = 0;
    oralSessionDone = 0;
    oralSessionStartedAt = Date.now();
    renderPanel();
  }));
  panel.querySelectorAll('[data-error-mastered]').forEach((button) => button.addEventListener('click', () => {
    if (!canManageTestData()) return;
    const item = appData.errors.find((error) => error.id === button.dataset.errorMastered);
    if (item) { item.mastered = true; item.masteredAt = Date.now(); saveAppData(); renderPanel(); }
  }));
  panel.querySelectorAll('[data-reset]').forEach((button) => button.addEventListener('click', () => {
    const resetType = button.dataset.reset;
    const config = {
      errors: {
        title: 'Wyczyść zapisane błędy?',
        message: 'Czy na pewno chcesz usunąć wszystkie zapisane błędy?',
        confirmLabel: 'TAK, WYCZYŚĆ',
        action: clearSavedErrors,
        successMessage: 'Gotowe! Lista błędów została wyczyszczona.',
      },
      results: {
        title: 'Wyzeruj wyniki i postępy?',
        message: 'Czy na pewno chcesz wyzerować wyniki i postępy?',
        confirmLabel: 'TAK, WYZERUJ',
        action: resetResultsAndProgress,
        successMessage: 'Gotowe! Wyniki i postępy zostały wyzerowane.',
      },
      all: {
        title: 'Wyzerować wyniki Aleksandra?',
        message: 'Czy na pewno chcesz wyzerować wyniki Aleksandra? Usunięte zostaną tylko zapisane postępy, wyniki, błędy i historia korzystania. Materiały edukacyjne pozostaną bez zmian.',
        confirmLabel: 'WYZERUJ',
        action: clearAllUserData,
        successMessage: 'Gotowe! Dane użytkownika zostały wyczyszczone.',
      },
    };
    if (config[resetType]) askResetConfirmation(config[resetType]);
  }));
  panel.querySelector('[data-print-material]')?.addEventListener('click', () => window.print());
  panel.querySelector('[data-read-notes]')?.addEventListener('click', startSpeechPlayback);
  panel.querySelector('[data-pause-reading]')?.addEventListener('click', pauseSpeechPlayback);
  panel.querySelector('[data-resume-reading]')?.addEventListener('click', resumeSpeechPlayback);
  panel.querySelector('[data-stop-reading]')?.addEventListener('click', stopSpeechPlayback);
  panel.querySelectorAll('[data-oral-result]').forEach((button) => button.addEventListener('click', () => {
    const item = oralQuestions()[oralIndex];
    if (!item) return;
    oralSessionDone += 1;
    if (button.dataset.oralResult === 'repeat') saveError({ itemId: item.id, prompt: item.prompt, answer: 'Odpowiedź ustna do powtórzenia', correctAnswer: item.answer, explanation: item.explanation, source: 'oral' });
    oralIndex += 1;
    if (oralIndex >= oralQuestions().length) {
      appData.motherSessions.push({ subjectId: activeSubject.id, subjectName: activeSubject.name, lessonIndex, lessonTitle: currentLesson()?.title ?? '', questions: oralSessionDone, completedAt: Date.now(), durationMs: oralSessionStartedAt ? Date.now() - oralSessionStartedAt : null });
      trackTopic({ lastMotherSessionAt: Date.now() });
      persistUserData();
    }
    renderPanel();
  }));
  panel.querySelector('[data-reset-oral]')?.addEventListener('click', () => { oralIndex = 0; oralSessionDone = 0; oralSessionStartedAt = Date.now(); renderPanel(); });
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
    recordExerciseResult(exerciseIndex, reviewResults[key]);
    if (reviewResults[key]) resolveSavedError(`exercise-${exerciseIndex}`);
    if (!reviewResults[key]) saveError({ itemId: `exercise-${exerciseIndex}`, prompt: exercise?.prompt, answer: isChoice ? exercise?.options?.[Number(answer)] : answer, correctAnswer: isChoice ? exercise?.options?.[exercise.correct] ?? (exercise.correct === 0 ? 'Prawda' : 'Fałsz') : expected.join(' lub '), explanation: exercise?.hint, source: 'exercise' });
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
    trackTopic({ completed: checkbox.checked, completedAt: checkbox.checked ? Date.now() : null });
    saveProgress();
    renderPanel();
  }));
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
  trackTopic();
  if (correct) resolveSavedError(`quiz-${questionIndex}`);
  if (!correct && String(answer).trim()) saveError({ itemId: `quiz-${questionIndex}`, prompt: question.question, answer, correctAnswer: acceptedAnswers.join(' lub '), explanation: questionExplanation(question), source: 'quiz' });
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
  const wrongNumbers = [];

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
    else wrongNumbers.push(questionIndex + 1);
    if (correct) resolveSavedError(`quiz-${questionIndex}`);
    if (!correct) saveError({ itemId: `quiz-${questionIndex}`, prompt: question.question, answer: isOpen ? rawAnswer : question.answers?.[Number(rawAnswer)], correctAnswer: isOpen ? (question.acceptedAnswers ?? []).join(' lub ') : question.answers?.[question.correct], explanation, source: 'quiz' });
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
  trackTopic({ lastTestAt: Date.now() });
  if (quizGraded) {
    const scorePercent = Math.round(correctCount / questions.length * 100);
    const prior = appData.testResults[topicRef()] ?? {};
    appData.testScores[topicRef()] = scorePercent;
    appData.testResults[topicRef()] = { lastScore: scorePercent, bestScore: Math.max(prior.bestScore ?? 0, scorePercent), correct: correctCount, wrong: questions.length - correctCount, total: questions.length, wrongNumbers, completedAt: Date.now() };
    appData.testHistory.push({ subjectId: activeSubject.id, subjectName: activeSubject.name, lessonIndex, lessonTitle: currentLesson()?.title ?? '', correct: correctCount, wrong: questions.length - correctCount, total: questions.length, score: scorePercent, wrongNumbers, completedAt: Date.now() });
    if (progress.topics[topicRef()]) progress.topics[topicRef()].completedTestCount = (progress.topics[topicRef()].completedTestCount ?? 0) + 1;
  }
  persistUserData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  renderHomeDashboard();
  const score = panel.querySelector('#quiz-score');
  score.innerHTML = answeredCount < questions.length
    ? `Na razie: ${correctCount} poprawnych z ${answeredCount} sprawdzonych. Uzupełnij pozostałe odpowiedzi.`
    : `<strong>TWÓJ WYNIK</strong><span>${correctCount}/${questions.length} · ${Math.round(correctCount / questions.length * 100)}%</span><small>${correctCount === questions.length ? 'Brawo, świetna robota! 🌟' : 'Każda odpowiedź to okazja do nauki! 💛'}</small>${questions.some((question, index) => {
      const answer = quizAnswers[index];
      return !(question.type === 'open' ? (question.acceptedAnswers ?? []).some((candidate) => normalizeAnswer(candidate) === normalizeAnswer(answer)) : Number(answer) === question.correct);
    }) ? `<div class="quiz-review-list"><strong>Warto jeszcze powtórzyć:</strong> ${questions.map((question, index) => {
      const answer = quizAnswers[index];
      const correct = question.type === 'open' ? (question.acceptedAnswers ?? []).some((candidate) => normalizeAnswer(candidate) === normalizeAnswer(answer)) : Number(answer) === question.correct;
      return correct ? '' : `<a href="#quiz-question-${index}">${index + 1}</a>`;
    }).filter(Boolean).join(', ')}</div>` : ''}`;
  const submit = panel.querySelector('[data-check-quiz]');
  submit.disabled = quizGraded;
}

renderSubjects();
modeSwitchButton.textContent = appData.mode === 'mama' ? '👩 Mama' : '👦 Aleksander';
activeView = appData.mode === 'mama' ? 'mother' : 'topics';
showDashboard = appData.mode !== 'mama';
renderPanel();
if (!appData.mode) {
  modeCancelButton.hidden = true;
  if (typeof modeDialog.showModal === 'function') modeDialog.showModal();
  else modeDialog.setAttribute('open', '');
}
})();
