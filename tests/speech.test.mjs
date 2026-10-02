import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
function harness({ native = true, voices = [], fail, unsupported = false } = {}) {
  const calls = [];
  let diagnostic;
  const plugin = {
    stop: async () => {},
    speak: async (fragment) => { calls.push({ ...fragment }); if (fail) throw Error(fail); },
  };
  const window = {
    Capacitor: { isNativePlatform: () => native, isPluginAvailable: () => native, Plugins: { AndroidSpeech: plugin } },
    SpeechSynthesisUtterance: function(text) { this.text = text; },
    speechSynthesis: {
      getVoices: () => voices, cancel() {}, resume() {}, pause() {},
      speak(utterance) { calls.push(utterance); utterance.onstart(); queueMicrotask(utterance.onend); },
      addEventListener() {}, removeEventListener() {},
    },
  };
  if (unsupported) { delete window.speechSynthesis; delete window.SpeechSynthesisUtterance; }
  const panel = { querySelector: (selector) => selector === '[data-speech-diagnostic]' ? diagnostic
    : selector === '.learning-tools' ? { after: (node) => { diagnostic = node; } } : null };
  const context = vm.createContext({ window, panel, document: { createElement: () => ({ setAttribute() {} }) },
    setTimeout, clearTimeout, Set, console });
  vm.runInContext(`let speechQueue=[], speechQueueIndex=0, speechRunId=0, speechPaused=false,
    speechVoicesWaitCleanup=null, speechVoiceWaitedLanguages=new Set(), speechActiveUtterance=null,
    speechStartTimer=null, nativeSpeechPending=false;
    const activeSubject={id:'matematyka'}; function currentLesson(){return null;}
    ${app.slice(app.indexOf('const SPEECH_BLOCK_TAGS'), app.indexOf('function renderLessonNotes'))}
    function run(fragments){stopSpeechPlayback();speechQueue=fragments.flatMap(chunkSpeechFragment);speakNextFragment();}
    globalThis.api={run,collectSpeechFragments,cleanSpeechText,chunkSpeechFragment,pauseSpeechPlayback,resumeSpeechPlayback,stopSpeechPlayback,startSpeechPlayback};`, context);
  return { ...context.api, calls, diagnostic: () => diagnostic?.textContent, plugin };
}
const settle = () => new Promise((resolve) => setImmediate(resolve));
for (const [lang, text] of [['pl-PL','Czytam po polsku.'],['en-GB','I read in English.'],['de-DE','Ich lese Deutsch.']]) {
  test(`native bridge passes real text with explicit ${lang}`, async () => {
    const h = harness(); h.run([{text,lang}]); await settle();
    assert.deepEqual(h.calls, [{text,lang}]); assert.equal(h.diagnostic(), undefined);
  });
}
test('mixed PL + EN and successive DE/PL remain ordered and explicitly tagged', async () => {
  const fragments = [{text:'Kot',lang:'pl-PL'},{text:'A cat',lang:'en-GB'},{text:'Eine Katze',lang:'de-DE'},{text:'Koniec',lang:'pl-PL'}];
  const h = harness(); h.run(fragments); await settle(); assert.deepEqual(h.calls, fragments);
});
test('native initialization/language failure is visible instead of advancing silently', async () => {
  const h = harness({fail:'Brak dostępnego głosu dla języka de.'});
  h.run([{text:'Hallo',lang:'de-DE'},{text:'Dalej',lang:'pl-PL'}]); await settle();
  assert.equal(h.calls.length,1); assert.match(h.diagnostic(),/Brak dostępnego głosu/);
});
test('pause/resume replays current native fragment and ignores stale completion', async () => {
  const h=harness(); let finish;
  h.plugin.speak=(fragment)=>{h.calls.push({...fragment});return new Promise(resolve=>{finish=resolve;});};
  h.run([{text:'Hello',lang:'en-GB'}]); h.pauseSpeechPlayback(); finish(); await settle();
  assert.equal(h.calls.length,1); h.resumeSpeechPlayback(); assert.equal(h.calls.length,2);
  finish(); await settle(); h.stopSpeechPlayback();
});
test('new playback ignores completion of previously stopped playback', async () => {
  const h=harness(); let finish;
  h.plugin.speak=(fragment)=>{h.calls.push({...fragment});return new Promise(resolve=>{finish=resolve;});};
  h.run([{text:'Old',lang:'en-GB'}]); const old=finish;
  h.run([{text:'Nowy',lang:'pl-PL'}]); old(); await settle();
  assert.equal(h.calls.length,2); finish(); await settle(); h.stopSpeechPlayback();
});
test('emoji and UI are omitted while explicit DOM lang survives', () => {
  const h=harness(); const text=(value)=>({nodeType:3,nodeValue:value});
  const element=(tag,lang,children)=>({nodeType:1,tagName:tag,getAttribute:(name)=>name==='lang'?lang:null,childNodes:children});
  const result=h.collectSpeechFragments(element('DIV',null,[element('SPAN','pl',[text('🐱 Kot')]),element('BUTTON',null,[text('Przeczytaj')]),element('SPAN','en',[text('A cat')])]));
  assert.deepEqual(JSON.parse(JSON.stringify(result)),[{text:'Kot',lang:'pl-PL'},{text:'A cat',lang:'en-GB'}]);
});
test('long fragments preserve every word and language in bounded TTS inputs', () => {
  const h=harness(); const text='Słowo '.repeat(1000).trim(); const chunks=h.chunkSpeechFragment({text,lang:'pl-PL'});
  assert.ok(chunks.every(c=>c.text.length<=1500&&c.lang==='pl-PL'));
  assert.equal(chunks.map(c=>c.text).join(' '),text);
});
for (const lang of ['pl-PL','en-GB','de-DE']) test(`browser voice fallback stays in ${lang} language`, async () => {
  const voice={lang:lang==='en-GB'?'en-US':lang}; const h=harness({native:false,voices:[voice]});
  h.run([{text:'Test',lang}]); await settle();
  assert.equal(h.calls[0].voice,voice); assert.equal(h.calls[0].lang,lang); assert.equal(h.calls[0].volume,1);
});
test('unsupported speech API gives visible diagnostic', () => {
  const h=harness({native:false,unsupported:true}); h.startSpeechPlayback();
  assert.match(h.diagnostic(),/Nie udało się uruchomić czytania/);
});
test('browser engine error gives visible diagnostic', async () => {
  const h=harness({native:false,voices:[{lang:'pl-PL'}]});
  h.run([{text:'Tekst',lang:'pl-PL'}]); h.calls[0].onerror({error:'synthesis-failed'}); await settle();
  assert.match(h.diagnostic(),/synthesis-failed/);
});
test('missing browser language stops with a diagnostic, never a voice of another language', async () => {
  const h=harness({native:false,voices:[{lang:'en-US'}]});
  h.run([{text:'Polski tekst',lang:'pl-PL'}]);
  await new Promise(resolve=>setTimeout(resolve,1300));
  assert.equal(h.calls.length,0); assert.match(h.diagnostic(),/Brak dostępnego głosu.*pl-PL/);
});
