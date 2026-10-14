'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..'),pub=path.join(root,'public');
const DEBUG=9341;let checks=0;const failures=[];
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
(async()=>{let chrome,cdp,tmp;try{
  const chromium=process.env.CHROMIUM_PATH||'/usr/bin/chromium';if(!fs.existsSync(chromium))throw new Error('Chromium not found at '+chromium);
  tmp=fs.mkdtempSync(path.join(os.tmpdir(),'lwu-number-chrome-'));
  chrome=spawn(chromium,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-allow-origins=*',`--remote-debugging-port=${DEBUG}`,`--user-data-dir=${tmp}`,'about:blank'],{stdio:'ignore'});
  await waitJson(`http://127.0.0.1:${DEBUG}/json/version`);
  const target=await (await fetch(`http://127.0.0.1:${DEBUG}/json/new?about:blank`,{method:'PUT'})).json();cdp=new CDP(target.webSocketDebuggerUrl);await cdp.connect();await cdp.cmd('Runtime.enable');
  const doc=`<!doctype html><html><body>
  <section class="kids-intro"></section><section class="kids-roadmap"></section>
  <button data-mode="numbers" id="openNumbers">Numbers</button>
  <section id="choices"><h2 id="chooseTitle" tabindex="-1"></h2></section>
  <section id="practice" hidden><h2 id="practiceTitle" tabindex="-1"></h2><button id="backChoices"></button>
  <div id="letterControls"><button data-style="upper"></button><button data-style="lower"></button><button data-style="cursive-upper"></button><button data-style="cursive-lower"></button></div>
  <label id="numberControls"><select id="numberRange"><option value="1-25">1–25</option><option value="26-50">26–50</option><option value="51-75">51–75</option><option value="76-100">76–100</option></select></label>
  <select id="accent"><option value="en-GB">GB</option></select><div id="learningGrid"></div><p id="practiceHint"></p><p id="fontStatus"></p>
  <button id="previous"></button><button id="nextPage"></button><p id="pageStatus"></p><div id="learningPager"></div><p id="audioStatus"></p><button id="stopAudio"></button>
  <section id="finishNote"></section><span id="cardCount"></span><p><a id="practiceQuiz"></a></p></section>
  </body></html>`;
  await cdp.eval(`document.open();document.write(${JSON.stringify(doc)});document.close();history.pushState=()=>{};history.replaceState=()=>{};window.createKidsAudio=()=>({stop(){},speak(){}});true`);
  await cdp.eval(fs.readFileSync(path.join(pub,'assets','kids-data.js'),'utf8')+'\ntrue');
  await cdp.eval(fs.readFileSync(path.join(pub,'assets','children.js'),'utf8')+'\ntrue');
  await cdp.eval(`document.querySelector('#openNumbers').click();true`);
  let state=await cdp.eval(`(()=>({practiceHidden:document.querySelector('#practice').hidden,roadmapHidden:document.querySelector('.kids-roadmap').hidden,options:[...document.querySelector('#numberRange').options].map(o=>o.value),count:document.querySelectorAll('#learningGrid .learning-card').length,first:document.querySelector('#learningGrid .learning-card')?.id,last:[...document.querySelectorAll('#learningGrid .learning-card')].at(-1)?.id,pagerHidden:document.querySelector('#learningPager').hidden,cardCount:document.querySelector('#cardCount').textContent,status:document.querySelector('#pageStatus').textContent,finishHidden:document.querySelector('#finishNote').hidden,finish:document.querySelector('#finishNote').textContent,quizHref:document.querySelector('#finishNote .journey-primary')?.getAttribute('href'),actionHrefs:[...document.querySelectorAll('#finishNote .journey-actions a')].map(a=>a.getAttribute('href'))}))()`);
  ok(!state.practiceHidden,'Numbers mode did not open');ok(state.roadmapHidden,'Roadmap should hide inside Numbers mode');ok(JSON.stringify(state.options)===JSON.stringify(['1-25','26-50','51-75','76-100']),'Numbers runtime dropdown options are wrong');ok(state.count===25,'Set 1 runtime did not render 25 cards');ok(state.first==='number-1'&&state.last==='number-25','Set 1 runtime boundaries are wrong');ok(state.pagerHidden,'Numbers internal pager should be hidden');ok(state.cardCount==='25 numbers in this set','Numbers card-count pill is wrong');ok(state.status.includes('1–25')&&state.status.includes('25 numbers'),'Numbers status is wrong');ok(!state.finishHidden,'Numbers journey should appear below the selected set');ok(state.finish.includes('Start Numbers Quiz')&&state.finish.includes('Previous: Letters')&&state.finish.includes('Next: Hindi'),'Numbers bottom journey buttons are missing');ok(state.quizHref==='kids-quiz.html?category=numbers&range=1-25','Set 1 quiz link does not preserve range');ok(state.actionHrefs.includes('children.html?mode=letters'),'Numbers previous-topic link is not Letters');ok(state.actionHrefs.includes('hindi.html'),'Numbers next-topic link is not Hindi');
  for(const [range,first,last] of [['26-50',26,50],['51-75',51,75],['76-100',76,100]]){
    const s=await cdp.eval(`(()=>{const q=document.querySelector('#numberRange');q.value='${range}';q.dispatchEvent(new Event('change',{bubbles:true}));const c=[...document.querySelectorAll('#learningGrid .learning-card')];return{count:c.length,first:c[0]?.id,last:c.at(-1)?.id,quiz:document.querySelector('#finishNote .journey-primary')?.getAttribute('href'),pager:document.querySelector('#learningPager').hidden}})()`);
    ok(s.count===25,range+' runtime did not render 25 cards');ok(s.first==='number-'+first&&s.last==='number-'+last,range+' runtime boundaries are wrong');ok(s.quiz==='kids-quiz.html?category=numbers&range='+range,range+' quiz handoff is wrong');ok(s.pager,range+' unexpectedly shows internal pager');
  }
  if(failures.length){console.error(failures.join('\n'));process.exitCode=1}else console.log(`Numbers browser runtime checks passed: ${checks}/${checks} assertions using the actual kids-data.js + children.js runtime.`)
}catch(e){console.error(e.stack||e);process.exitCode=1}finally{cdp?.close();if(chrome){chrome.kill('SIGTERM');await sleep(100)}if(tmp)fs.rmSync(tmp,{recursive:true,force:true})}})();
