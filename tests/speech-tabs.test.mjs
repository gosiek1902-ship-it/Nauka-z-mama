import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = new URL('../', import.meta.url);
const capacitorBridge = await readFile(new URL('node_modules/@capacitor/android/capacitor/src/main/assets/native-bridge.js', root), 'utf8');
const segments = [{text:'Polskie polecenie',lang:'pl-PL'},{text:'English instruction',lang:'en-GB'},{text:'Deutsche Aufgabe',lang:'de-DE'}];
const lesson = {
  title:'Test czytania', summarySpeechSegments:segments,
  cheatSheet:[{title:'Reguła',items:[{label:'Treść',textSpeechSegments:segments}]}],
  importantFacts:['Ważna zasada'],
  reviewExercises:[{type:'choice',prompt:'Pytanie',speechSegments:segments,options:['Odpowiedź wyboru','Inna odpowiedź'],correct:0},
    {type:'open',prompt:'Otwarte polecenie',acceptedAnswers:['Wzorcowa odpowiedź']}],
  quizQuestions:[{question:'Pytanie',speechSegments:segments,answers:['Odpowiedź wyboru','Inna odpowiedź'],correct:0},
    {type:'open',question:'Otwarte polecenie',acceptedAnswers:['Wzorcowa odpowiedź']}],
};
test('clicking Read in all six rendered tabs uses the Notes handler and sends educational text to the same TTS', async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  try {
    const page=await browser.newPage();
    await page.addInitScript({ content: `
      window.spoken=[];window.printed=[];window.bridgeCalls=[];
      window.androidBridge={postMessage(message){
        const call=JSON.parse(message);window.bridgeCalls.push(call);
        if(call.pluginId==='AndroidSpeech'&&call.methodName==='speak')window.spoken.push(call.options);
        if(call.pluginId==='AndroidPrint'&&call.methodName==='print')window.printed.push(call.options);
        queueMicrotask(()=>window.Capacitor.fromNative({callbackId:call.callbackId,pluginId:call.pluginId,methodName:call.methodName,success:true,data:{}}));
      }};
      window.Capacitor={Plugins:{}};
      ${capacitorBridge}
      window.Capacitor.Plugins.AndroidSpeech={
        speak:options=>window.Capacitor.nativePromise('AndroidSpeech','speak',options),
        stop:options=>window.Capacitor.nativePromise('AndroidSpeech','stop',options)
      };
      window.Capacitor.Plugins.AndroidPrint={print:options=>window.Capacitor.nativePromise('AndroidPrint','print',options)};
      window.print=()=>{throw Error('Android must not use window.print');};
    ` });
    await page.addInitScript(() => {
      const add=EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener=function(type,handler,...rest){
        if(type==='click'&&this.hasAttribute?.('data-read-notes')) this.readHandler=handler;
        return add.call(this,type,handler,...rest);
      };
    });
    await page.route('https://speech.test/**',async route=>{
      const path=new URL(route.request().url()).pathname.slice(1)||'index.html';
      try {
        let body=await readFile(new URL(path,root));
        if(path==='src/app.js') body=Buffer.from(body.toString().replace(/\}\)\(\);\s*$/,`
          window.speechTabTest={startSpeechPlayback,open(tab,lesson){
            activeSubject={id:'matematyka',name:'Matematyka',lessons:[lesson]};lessonIndex=0;
            activeTab=tab;activeView='content';oralIndex=0;quizAnswers={};reviewAnswers={};
            modeDialog.close();renderPanel();window.spoken=[];
            window.printed=[];window.bridgeCalls=[];
          }};
        })();`));
        await route.fulfill({body,contentType:path.endsWith('.js')?'application/javascript':path.endsWith('.css')?'text/css':'text/html'});
      } catch {await route.fulfill({status:404,body:''});}
    });
    await page.goto('https://speech.test/');
    await page.waitForFunction(()=>window.speechTabTest);
    for(const tab of ['notes','cheatsheet','practice','review','quiz','oral']) {
      await page.evaluate(({tab,lesson})=>window.speechTabTest.open(tab,lesson),{tab,lesson});
      assert.equal(await page.locator('[data-read-notes]').evaluate(button=>button.readHandler===window.speechTabTest.startSpeechPlayback),true,`${tab}: same handler as Notes`);
      for (const [phrase,lang] of [['English instruction','en-GB'],['Deutsche Aufgabe','de-DE']]) {
        await page.evaluate(()=>{window.spoken=[];});
        await page.getByRole('button',{name:`Przeczytaj: ${phrase}`,exact:true}).first().click();
        await page.waitForFunction(()=>window.spoken.length>0);
        assert.deepEqual(await page.evaluate(()=>window.spoken),[{text:phrase,lang}],`${tab}: word icon reads only its own phrase`);
      }
      assert.equal(await page.getByRole('button',{name:'Przeczytaj: Polskie polecenie',exact:true}).count(),0,`${tab}: Polish has no icon`);
      await page.evaluate(()=>{window.spoken=[];});
      await page.locator('.learning-content-body input[type=text]').evaluateAll(inputs=>inputs.forEach(input=>input.value='ODPOWIEDZ_UZYTKOWNIKA_NIE_CZYTAJ'));
      await page.locator('[data-read-notes]').click();
      await page.waitForFunction(()=>window.spoken.some(f=>f.text.includes('Deutsche Aufgabe')));
      const spoken=await page.evaluate(()=>window.spoken);
      for(const segment of segments) assert.ok(spoken.some(f=>f.lang===segment.lang&&f.text.includes(segment.text)),`${tab}: ${segment.lang} reaches TTS`);
      const text=spoken.map(f=>f.text).join(' ');
      assert.doesNotMatch(text,/ODPOWIEDZ_UZYTKOWNIKA|Przeczytaj|Pokaż odpowiedź|quiz-question-|oral-quiz-/);
      assert.doesNotMatch(text,/\p{Extended_Pictographic}/u);
      if(['practice','review','quiz'].includes(tab)) {
        assert.match(text,/Odpowiedź wyboru/); assert.match(text,/Otwarte polecenie/);
      }
      if(tab==='oral') assert.match(text,/Odpowiedź wyboru/,'closed model answer is educational content');
      await page.locator('[data-print-material]').click();
      await page.waitForFunction(()=>window.printed.length===1);
      const print=await page.evaluate(()=>window.printed[0]);
      assert.match(print.html,/Polskie polecenie/);assert.match(print.html,/English instruction/);assert.match(print.html,/Deutsche Aufgabe/);
      assert.doesNotMatch(print.html,/ODPOWIEDZ_UZYTKOWNIKA|data-choice=|<input|<button/);
      if(['practice','review','quiz','oral'].includes(tab)) assert.match(print.html,/Odpowiedź wyboru/);
      const calls=await page.evaluate(()=>window.bridgeCalls);
      assert.ok(calls.some(call=>call.pluginId==='AndroidSpeech'&&call.methodName==='speak'&&call.options.text.length>0),`${tab}: native bridge TTS`);
      assert.ok(calls.some(call=>call.pluginId==='AndroidPrint'&&call.methodName==='print'&&call.options.html.length>0),`${tab}: native bridge print`);
    }
    await page.evaluate(lesson=>window.speechTabTest.open('notes',lesson),{
      ...lesson, summarySpeechSegments:[{text:'jabłko',lang:'pl-PL'},{text:'apple',lang:'en-GB'},{text:'der Tisch',lang:'de-DE'},
        {text:'These five words belong together.',lang:'en-GB'}],
    });
    for(const [text,lang] of [['apple','en-GB'],['der Tisch','de-DE'],['five','en-GB']]) {
      await page.evaluate(()=>{window.spoken=[];});
      await page.getByRole('button',{name:`Przeczytaj: ${text}`,exact:true}).click();
      await page.waitForFunction(()=>window.spoken.length>0);
      assert.deepEqual(await page.evaluate(()=>window.spoken),[{text,lang}]);
    }
    assert.equal(await page.getByRole('button',{name:'Przeczytaj: jabłko',exact:true}).count(),0);
    await page.evaluate(()=>{window.spoken=[];});
    await page.locator('[data-read-notes]').click();
    await page.waitForFunction(()=>window.spoken.some(f=>f.text.includes('These five words belong together.')));
  } finally {await browser.close();}
});
