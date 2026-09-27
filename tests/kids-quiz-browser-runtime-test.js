'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),pub=path.join(root,'public');
const DEBUG=9345;let checks=0;const failures=[];
const ok=(v,m)=>{checks++;if(!v)failures.push(m)};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function waitJson(url,timeout=10000){const end=Date.now()+timeout;while(Date.now()<end){try{const r=await fetch(url);if(r.ok)return await r.json()}catch{}await sleep(100)}throw new Error('Timed out waiting for '+url)}
class CDP{
  constructor(url){this.url=url;this.id=0;this.pending=new Map()}
  async connect(){this.ws=new WebSocket(this.url);await new Promise((resolve,reject)=>{this.ws.onopen=resolve;this.ws.onerror=reject});this.ws.onmessage=e=>{const msg=JSON.parse(e.data);if(msg.id&&this.pending.has(msg.id)){const {resolve,reject}=this.pending.get(msg.id);this.pending.delete(msg.id);msg.error?reject(new Error(JSON.stringify(msg.error))):resolve(msg.result||{})}}}
  cmd(method,params={}){const id=++this.id;return new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}))})}
  async eval(expression){const r=await this.cmd('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error('Browser JS: '+JSON.stringify(r.exceptionDetails));return r.result?.value}
  close(){try{this.ws.close()}catch{}}
}
const body=`<!doctype html><html><body>
<div class="kids-quiz-heading"><h1>Kids quizzes</h1><p class="page-deck">A little challenge. A lot to discover.</p><p>Name what you see, then let a grown-up mark your answer.</p></div>
<section id="kidSetup"><h2 id="kidSetupTitle" tabindex="-1">Which quiz would you like?</h2>
<div class="kids-quiz-links"><button data-kid-category="letters"><strong>Letter quiz</strong></button><button data-kid-category="numbers"><strong>Number quiz</strong></button></div>
<div id="kidOptions" hidden><h3 id="kidOptionsTitle" tabindex="-1"></h3><label id="kidStyleLabel"><select id="kidStyle"><option value="upper">upper</option><option value="lower">lower</option><option value="cursive-upper">cu</option><option value="cursive-lower">cl</option></select></label><label id="kidRangeLabel" hidden><select id="kidRange"><option value="1-25">1-25</option><option value="26-50">26-50</option><option value="51-75">51-75</option><option value="76-100">76-100</option></select></label><button id="kidStart"></button></div></section>
<section id="kidRound" hidden><span id="kidCategoryName"></span><span id="kidCounter"></span><span id="kidScoreCount"></span><progress id="kidProgress" max="10"></progress><p id="kidPromptLabel"></p><h2 id="kidPrompt" tabindex="-1"></h2><div id="kidFeedback" hidden><p id="kidAnswerStatus"></p><button id="kidHear"></button><select id="kidAccent"><option value="en-GB">GB</option></select></div><button data-judge="correct"></button><button data-judge="practice"></button><button id="kidNext"></button><button id="kidChange"></button></section>
<section id="kidResults" hidden><p id="kidResultScore"></p><h2 id="kidResultTitle" tabindex="-1"></h2><p id="kidResultMessage"></p><div id="kidScoreCard"></div><h3 id="kidReviewTitle"></h3><div id="kidStudyLinks"></div><button id="kidRetry"></button><button id="kidChooseAnother"></button></section>
<div id="kidAudioBar" hidden><p id="kidAudioStatus"></p><button id="kidStopAudio"></button></div><p id="kidCursiveNotice" hidden></p>
</body></html>`;
(async()=>{let chrome,cdp,tmp,htmlFile;try{
  const chromium=process.env.CHROMIUM_PATH||'/usr/bin/chromium';if(!fs.existsSync(chromium))throw new Error('Chromium not found at '+chromium);
  tmp=fs.mkdtempSync(path.join(os.tmpdir(),'lwu-kids-quiz-chrome-'));htmlFile=path.join(tmp,'page.html');fs.writeFileSync(htmlFile,body);
  chrome=spawn(chromium,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-allow-origins=*',`--remote-debugging-port=${DEBUG}`,`--user-data-dir=${path.join(tmp,'profile')}`,'about:blank'],{stdio:'ignore'});
  await waitJson(`http://127.0.0.1:${DEBUG}/json/version`);const target=await (await fetch(`http://127.0.0.1:${DEBUG}/json/new?about:blank`,{method:'PUT'})).json();cdp=new CDP(target.webSocketDebuggerUrl);await cdp.connect();await cdp.cmd('Page.enable');await cdp.cmd('Runtime.enable');
  async function load(query=''){
    await cdp.cmd('Page.navigate',{url:'about:blank'+query});await sleep(50);
    await cdp.eval(`document.open();document.write(${JSON.stringify(body)});document.close();HTMLElement.prototype.scrollIntoView=function(){};HTMLElement.prototype.focus=function(){};window.createKidsAudio=()=>({stop(){},speak(){}});window.renderLearnWithUsScoreCard=()=>{};window.LearnWithUs={recordQuiz(){}};true`);
    const missing=await cdp.eval(`['kidSetup','kidSetupTitle','kidOptions','kidOptionsTitle','kidStyleLabel','kidRangeLabel','kidStyle','kidRange','kidStart','kidRound','kidCategoryName','kidCounter','kidScoreCount','kidProgress','kidPromptLabel','kidPrompt','kidFeedback','kidAnswerStatus','kidHear','kidAccent','kidNext','kidChange','kidResults','kidResultScore','kidResultTitle','kidResultMessage','kidScoreCard','kidReviewTitle','kidStudyLinks','kidRetry','kidChooseAnother','kidAudioBar','kidAudioStatus','kidStopAudio','kidCursiveNotice'].filter(id=>!document.getElementById(id))`);if(missing.length)throw new Error('Runtime fixture missing IDs: '+missing.join(','));
    await cdp.eval(fs.readFileSync(path.join(pub,'assets','kids-data.js'),'utf8')+'\ntrue');
    await cdp.eval(fs.readFileSync(path.join(pub,'assets','kids-quiz.js'),'utf8')+'\ntrue');
    await sleep(20);
  }
  await load('?category=letters&style=upper');
  let s=await cdp.eval(`(()=>({heading:document.querySelector('.kids-quiz-heading h1').textContent,setupHidden:document.querySelector('#kidSetup').hidden,roundHidden:document.querySelector('#kidRound').hidden,category:document.querySelector('#kidCategoryName').textContent,counter:document.querySelector('#kidCounter').textContent,prompt:document.querySelector('#kidPrompt').textContent,visibleText:document.body.innerText,changeHidden:document.querySelector('#kidChange').hidden,resultBack:document.querySelector('#kidChooseAnother').textContent}))()`);
  ok(s.heading==='Letter quiz','Letter deep link does not retitle the page');ok(s.setupHidden,'Letter deep link leaves the generic chooser visible');ok(!s.roundHidden,'Letter deep link does not start the letter round');ok(s.category==='Letter quiz','Letter deep link started the wrong category');ok(s.counter==='Question 1 of 10','Letter quiz did not create a 10-question deck');ok(/^[A-Z]$/.test(s.prompt),'Letter quiz first prompt is not a letter');ok(!s.visibleText.includes('Number quiz'),'Letter deep link visibly exposes Number quiz content');ok(s.changeHidden,'Letter deep link still exposes the generic change-category button');ok(s.resultBack==='Back to Quiz Hub','Dedicated Letter quiz result navigation is not quiz-focused');

  await load('?category=numbers&range=51-75');
  s=await cdp.eval(`(()=>({heading:document.querySelector('.kids-quiz-heading h1').textContent,setupHidden:document.querySelector('#kidSetup').hidden,roundHidden:document.querySelector('#kidRound').hidden,category:document.querySelector('#kidCategoryName').textContent,counter:document.querySelector('#kidCounter').textContent,prompt:Number(document.querySelector('#kidPrompt').textContent),visibleText:document.body.innerText}))()`);
  ok(s.heading==='Number quiz','Number deep link does not retitle the page');ok(s.setupHidden&&!s.roundHidden,'Number deep link does not start directly');ok(s.category==='Number quiz · 51–75','Number deep link did not preserve the requested set');ok(s.counter==='Question 1 of 10','Number quiz did not create a 10-question deck');ok(s.prompt>=51&&s.prompt<=75,'Number quiz first prompt is outside the requested set');ok(!s.visibleText.includes('Letter quiz'),'Number deep link visibly exposes Letter quiz content');

  await load('');
  s=await cdp.eval(`(()=>({setupHidden:document.querySelector('#kidSetup').hidden,roundHidden:document.querySelector('#kidRound').hidden,choices:[...document.querySelectorAll('[data-kid-category]')].map(x=>x.textContent.trim())}))()`);
  ok(!s.setupHidden&&s.roundHidden,'Generic Kids quiz chooser no longer opens normally');ok(s.choices.length===2&&s.choices.some(x=>x.includes('Letter quiz'))&&s.choices.some(x=>x.includes('Number quiz')),'Generic Kids quiz chooser lost its two intentional choices');
  if(failures.length){console.error(failures.join('\n'));process.exitCode=1}else console.log(`Kids quiz deep-link browser runtime checks passed: ${checks}/${checks} assertions using actual kids-data.js + kids-quiz.js.`)
}catch(e){console.error(e.stack||e);process.exitCode=1}finally{cdp?.close();if(chrome){chrome.kill('SIGTERM');await sleep(100)}if(tmp)fs.rmSync(tmp,{recursive:true,force:true})}})();
