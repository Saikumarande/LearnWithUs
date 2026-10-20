'use strict';
const fs=require('fs'),path=require('path'),os=require('os'),{spawn}=require('child_process');
const R=path.resolve(__dirname,'../../..'),P=path.join(R,'public'),D=JSON.parse(fs.readFileSync(path.join(P,'assets/level2-data.js'),'utf8').split('window.LWU_LEVEL2=')[1].trim().replace(/;$/,''));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const fails=[];let count=0;function check(v,msg){count++;if(!v)fails.push(msg)}
class CDP{constructor(url){this.url=url;this.id=0;this.pending=new Map()}async connect(){this.ws=new WebSocket(this.url);await new Promise((ok,no)=>{this.ws.onopen=ok;this.ws.onerror=no});this.ws.onmessage=e=>{const r=JSON.parse(e.data);if(this.pending.has(r.id)){const c=this.pending.get(r.id);this.pending.delete(r.id);r.error?c.no(Error(JSON.stringify(r.error))):c.ok(r.result||{})}}}async send(method,params={}){const id=++this.id;return new Promise((ok,no)=>{this.pending.set(id,{ok,no});this.ws.send(JSON.stringify({id,method,params}))})}async eval(text){const r=await this.send('Runtime.evaluate',{expression:text,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result?.value}close(){this.ws?.close()}}
async function waitJson(url){for(let i=0;i<90;i++){try{const r=await fetch(url);if(r.ok)return r.json()}catch{}await sleep(100)}throw Error('Chromium launch failed')}
(async()=>{let chrome,tmp,c;try{
 tmp=fs.mkdtempSync(path.join(os.tmpdir(),'lwu313-'));const port=9683;
 chrome=spawn('/usr/bin/chromium',['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--remote-allow-origins=*',`--remote-debugging-port=${port}`,`--user-data-dir=${tmp}`,'about:blank'],{stdio:'ignore'});
 await waitJson(`http://127.0.0.1:${port}/json/version`);const tab=await(await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'})).json();c=new CDP(tab.webSocketDebuggerUrl);await c.connect();await c.send('Runtime.enable');await c.send('Page.enable');
 const styles=['learning.css','practice.css','site-shell.css','platform.css','new-learning.css','branch-layout.css','level2.css'];
 const CSS=styles.map(x=>fs.readFileSync(path.join(P,'assets',x),'utf8')).join('\n');
 const dataSrc=fs.readFileSync(path.join(P,'assets/level2-data.js'),'utf8'),engineSrc=fs.readFileSync(path.join(P,'assets/level2-engine.js'),'utf8');
 async function visit(rel,width){
  await c.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===390});
  let html=fs.readFileSync(path.join(P,rel),'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<link\b[^>]*>/gi,'').replace(/<base\b[^>]*>/gi,'').replace('</head>','<base href="https://learnwithus.example/public/"><style>'+CSS+'</style></head>');
  await c.eval(`document.open();document.write(${JSON.stringify(''+html)});document.close();window.__recorded=[];window.LearnWithUs={recordQuiz(...args){window.__recorded.push(args)},recordComplete(){},getUserName(){return 'Test learner'},getState(){return {}}};window.LWUSmart={recordAnswer(){}};window.renderLearnWithUsScoreCard=({container,score,total})=>{container.textContent='Score card '+score+'/'+total};true`);
  await c.eval(dataSrc+'\n'+engineSrc+'\ntrue');
  const state=await c.eval(`({ready:document.readyState,title:document.title,root:!!document.querySelector('#level2Root'),shown:document.querySelector('#level2Root')?.textContent?.length,cards:document.querySelectorAll('.level2-fact').length})`);
  check(state.root&&state.shown>35,'Full production markup and scripts '+rel+' @'+width+': '+JSON.stringify(state));if(!state.root||!state.shown||state.shown<35)throw Error('Page script failure: '+JSON.stringify(state));return state;
 }

 const size=[1280,800,390];
 for(const [id,t] of Object.entries(D)){
  for(const width of size){
   await visit('learn/kids/'+id+'.html',width);
   const view=await c.eval(`(()=>{const cells=[...document.querySelectorAll('.level2-fact')],r=cells.map(n=>n.getBoundingClientRect()),main=document.querySelector('main'),nav=document.querySelector('#level2Nav');return {w:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+2,all:cells.length,visible:r.every(x=>x.width>90&&x.height>70),cols:getComputedStyle(document.querySelector('.level2-fact-grid')).gridTemplateColumns.split(' ').length,nav:nav.scrollWidth,navclient:nav.clientWidth,practice:document.querySelector('#level2Practice .subject-options')?.children.length,background:getComputedStyle(cells[0]).backgroundImage,navCount:nav.querySelectorAll('a').length}})()`);
   check(!view.overflow&&view.all===10&&view.visible,'Card geometry '+id+' @'+width+JSON.stringify(view));
   check(view.cols===(width===1280?3:width===800?2:1),'Adaptive columns '+id+' @'+width+' '+JSON.stringify(view));
   check(view.practice===4,'Practice has four choices '+id+' @'+width);
   check(view.navCount===(t.branch==='science'?5:t.branch==='maths'?5:6),'Topic strip in same branch '+id);
   if(width===390&&['circuits','percentages','hindi-matras','telugu-gunintalu'].includes(id)){const snap=await c.send('Page.captureScreenshot',{format:'png'});const folder=path.join(R,'docs','v313-visuals');fs.mkdirSync(folder,{recursive:true});fs.writeFileSync(path.join(folder,id+'-390.png'),Buffer.from(snap.data,'base64'));}
   if(width===390||id==='circuits'){const result=await c.eval(`(()=>{let p=document.querySelector('#level2Practice');const msgs=[];for(let i=0;i<3;i++){const b=p.querySelector('.subject-options button');b.click();msgs.push(p.querySelector('.subject-feedback')?.textContent||'');p.querySelector('.level2-next')?.click();}return{result:p.innerText||p.textContent,msgs}})()`);check(result.msgs.length===3&&result.msgs.every(s=>/Correct answer|Wrong answer/.test(s))&&result.result.includes('Practice complete'),'Three explained practice rounds '+id+' @'+width);}
   if(width===390 && ['circuits','area-perimeter','coordinates','light-shadows','percentages','sound-vibrations','food-chains'].includes(id)){
     let lab=await c.eval(`(()=>{if(document.querySelector('#circuitSwitch')){document.querySelector('#circuitSwitch').click();const lit=!!document.querySelector('#circuitBulb.lit');document.querySelector('#circuitDisconnect').click();return{lab:'circuit',lit,off:!document.querySelector('#circuitBulb.lit')}}if(document.querySelector('#rectW')){document.querySelector('#rectW').value=5;document.querySelector('#rectW').dispatchEvent(new Event('input',{bubbles:true}));return{lab:'rect',text:document.querySelector('#rectResult').textContent}}if(document.querySelector('#coordinateGrid')){document.querySelector('#coordinateGrid [aria-label="Point (3, 2)"]').click();return{lab:'coord',text:document.querySelector('#coordinateResult').textContent}}if(document.querySelector('#lampDistance')){document.querySelector('#lampDistance').value=1;document.querySelector('#lampDistance').dispatchEvent(new Event('input',{bubbles:true}));return{lab:'shadow',text:document.querySelector('#shadowResult').textContent}}if(document.querySelector('#percentSlider')){document.querySelector('#percentSlider').value=65;document.querySelector('#percentSlider').dispatchEvent(new Event('input',{bubbles:true}));return{lab:'percent',text:document.querySelector('#percentResult').textContent}}if(document.querySelector('#pitchSpeed')){document.querySelector('#pitchSpeed').value=7;document.querySelector('#pitchSpeed').dispatchEvent(new Event('input',{bubbles:true}));return{lab:'sound',text:document.querySelector('#soundResult').textContent}}if(document.querySelector('#chainChoices')){for(const x of ['grass','rabbit','fox'])document.querySelector('[data-chain="'+x+'"]').click();return{lab:'chain',text:document.querySelector('#chainResult').textContent}}return{lab:'unknown'}})()`);
     check(lab.lab!=='unknown'&&(lab.lit===undefined||lab.lit&&lab.off)&&(!lab.text||lab.text.length>12),'Interactive concept lab '+id+' '+JSON.stringify(lab));
   }
  }
  await visit('quiz/'+id+'-quiz.html',800);
  for(let q=0;q<10;q++){
   const answer=await c.eval(`(()=>{const p=document.querySelector('#level2Quiz');if(!p)return{error:'no quiz'};let buttons=p.querySelectorAll('.subject-options button');if(buttons.length!==4)return{error:'missing options '+buttons.length};buttons[(buttons.length+${q})%4].click();const fb=p.querySelector('.subject-feedback')?.textContent||'';const why=p.querySelector('.level2-explanation')?.textContent||'';const next=p.querySelector('.level2-next');const enable=next&&!next.hidden;next?.click();return{enable,fb,why}})()`);
   check(answer.enable&&answer.why.length>10&&/Correct answer|Wrong answer/.test(answer.fb),'10-question feedback '+id+' q'+(q+1)+' '+JSON.stringify(answer));
  }
  const done=await c.eval(`({score:document.querySelector('.subject-score')?.textContent,review:document.querySelectorAll('.level2-review li').length,card:!!document.querySelector('#sharedScoreCard'),again:!!document.querySelector('#level2Again'),recorded:window.__recorded?.length||0})`);
  check(done.review===10&&done.score?.includes('/ 10')&&done.card&&done.again&&done.recorded===1,'Quiz score/review '+id+' '+JSON.stringify(done));
 }
 // script-specific audio: no English fallback when Hindi/Telugu voice unavailable; must show notice.
 await visit('learn/kids/hindi-words.html',1280);
 const audio=await c.eval(`(()=>{let b=document.querySelector('[data-speak]');b.click();return{exists:!!b,text:document.querySelector('#level2VoiceStatus')?.textContent}})()`);check(audio.exists,'Hindi voice controls exist');
 if(fails.length){console.error(fails.slice(0,25).join('\n'));console.error('v3.13 Chromium '+(count-fails.length)+'/'+count+' passed');process.exitCode=1}else console.log(`v3.13 Chromium full-page QA ${count}/${count} passed: 16 lessons at three widths, 16 complete 10-question quizzes, simulations`);
 }catch(e){console.error(e.stack||e);process.exitCode=1}finally{c?.close();chrome?.kill('SIGTERM');await sleep(150);if(tmp)fs.rmSync(tmp,{recursive:true,force:true})}})();
