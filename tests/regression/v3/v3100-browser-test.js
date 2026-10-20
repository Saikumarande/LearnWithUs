'use strict';
const fs=require('fs'),path=require('path'),os=require('os'),{spawn}=require('child_process');
const R=path.resolve(__dirname,'../../..'),P=path.join(R,'public'),PORT=9462;let count=0;const fails=[];const check=(v,m)=>{count++;if(!v)fails.push(m)};const sleep=ms=>new Promise(r=>setTimeout(r,ms));
class CDP{constructor(url){this.url=url;this.id=0;this.waiting=new Map()}async connect(){this.ws=new WebSocket(this.url);await new Promise((resolve,reject)=>{this.ws.onopen=resolve;this.ws.onerror=reject});this.ws.onmessage=e=>{const msg=JSON.parse(e.data);if(this.waiting.has(msg.id)){const q=this.waiting.get(msg.id);this.waiting.delete(msg.id);msg.error?q.reject(Error(JSON.stringify(msg.error))):q.resolve(msg.result||{})}}}async send(method,params={}){const id=++this.id;return new Promise((resolve,reject)=>{this.waiting.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}))})}async eval(js){const r=await this.send('Runtime.evaluate',{expression:js,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result?.value}close(){this.ws?.close()}}
async function waitJson(url){for(let i=0;i<120;i++){try{const r=await fetch(url);if(r.ok)return r.json()}catch{}await sleep(100)}throw Error('Chromium startup timeout')}
const read=p=>fs.readFileSync(path.join(P,p),'utf8');const styles=['site-shell.css','learning.css','practice.css','creativity.css','world-learning.css','learning-journey.css','kids.css','platform.css','branch-layout.css','kids-nav-upgrade.css','release-version.css','focused-topics.css','flag-images.css','score-card.css'];const CSS=styles.map(f=>read('assets/'+f)).join('\n');
function rawDoc(name){return read(name).replace(/<base\b[^>]*>/gi,'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<link\b[^>]*>/gi,'').replace('</head>','<base href="https://learnwithus.example/public/learn/kids/"><style>'+CSS+'</style></head>')}
(async()=>{let chrome,tmp,cdp;try{
 tmp=fs.mkdtempSync(path.join(os.tmpdir(),'lwu-3100-'));
 chrome=spawn('/usr/bin/chromium',['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-allow-origins=*',`--remote-debugging-port=${PORT}`,`--user-data-dir=${tmp}`,'about:blank'],{stdio:'ignore'});
 await waitJson(`http://127.0.0.1:${PORT}/json/version`);
 const target=await(await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`,{method:'PUT'})).json();cdp=new CDP(target.webSocketDebuggerUrl);await cdp.connect();await cdp.send('Runtime.enable');
 async function page(name,width=1280){await cdp.send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===390});await cdp.eval(`document.open();document.write(${JSON.stringify(rawDoc(name))});document.close();window.__spoken=[];window.__recorded=[];window.SpeechSynthesisUtterance=function(t){this.text=t};Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},speak(x){window.__spoken.push(x.text)}},configurable:true});window.LearnWithUs={recordQuiz(...a){window.__recorded.push(a)},recordComplete(){},getUserName(){return 'Test learner'},getState(){return{visited:{},quizHistory:[{title:'A–Z Phonics Spelling Quiz',score:9,total:10,url:'phonics-spelling-quiz.html',time:'2026-10-14T12:30:00Z'}]}}};true`)}
 async function run(script){const src=read('assets/'+script);return cdp.eval(`(()=>{const location={href:'https://learnwithus.example/public/learn/kids/children.html',pathname:'/public/learn/kids/children.html',search:'',hash:'',host:'learnwithus.example'};${src}\nreturn true})()`) }
 const out=path.join(R,'docs/v3100-visuals');fs.mkdirSync(out,{recursive:true});
 for(const width of [1280,800,390]){
  await page('learn/kids/children.html',width);await run('branch-nav-data.js');await run('site-shell.js');await run('kids-nav-upgrade.js');await sleep(100);
  const state=await cdp.eval(`(()=>{const n=document.querySelector('.lwu-category-nav'),p=document.querySelector('#lwuCategoryPanel');document.querySelector('#lwuCategoryToggle').click();document.querySelectorAll('.lwu-category-entry').forEach(x=>x.open=true);return{display:getComputedStyle(p).display,overflow:getComputedStyle(p).overflowY,height:p.clientHeight,maxHeight:getComputedStyle(p).maxHeight,scrollHeight:p.scrollHeight,viewport:innerHeight,open:document.querySelector('#lwuCategoryToggle').getAttribute('aria-expanded'),scrollbar:p.scrollWidth>p.clientWidth? 'horizontal':'vertical'}})()`);
  check(state.open==='true'&&state.overflow==='auto'&&state.height<=state.viewport*.60+2&&state.scrollHeight>state.height+30&&state.scrollbar==='vertical','expanded panel has internal 60vh scroll area '+width+': '+JSON.stringify(state));
  const scroll=await cdp.eval(`(async()=>{const p=document.querySelector('#lwuCategoryPanel');p.scrollTop=180;await new Promise(r=>setTimeout(r,45));const initial=p.scrollTop;document.body.style.minHeight='6000px';window.scrollTo(0,1750);await new Promise(r=>setTimeout(r,170));const n=document.querySelector('.lwu-category-nav'),h=document.querySelector('.fl-header');return{initial,after:p.scrollTop,hidden:n.classList.contains('is-scroll-hidden'),top:n.getBoundingClientRect().top,header:h.getBoundingClientRect().height}})()`);
  check(scroll.initial>80&&scroll.after>=80&&!scroll.hidden&&Math.abs(scroll.top-scroll.header)<10,'scroll panel independently; expanded menu remains visible '+width+': '+JSON.stringify(scroll));
  const screenshot=await cdp.send('Page.captureScreenshot',{format:'png'});if(width===390||width===1280)fs.writeFileSync(path.join(out,'expanded-'+width+'.png'),Buffer.from(screenshot.data,'base64'));
  await cdp.eval(`(async()=>{window.scrollTo(0,0);document.querySelector('#lwuCategoryToggle').click();document.querySelector('.lwu-category-nav').blur?.()})()`);
  const motion=await cdp.eval(`(()=>{const n=document.querySelector('.lwu-category-nav');return{duration:parseFloat(getComputedStyle(n).transitionDuration),collapsed:document.querySelector('#lwuCategoryPanel').hidden}})()`);
  check(motion.collapsed&&motion.duration>=.55,'closed panel and gentle hide >=550ms '+width);
 }
 for(const slug of ['flags','geography'])for(const width of [1280,390]){
  await page('quiz/'+slug+'-quiz.html',width);await run('focused-topics-data.js');await run('topic-quiz.js');await run('flag-quiz-images.js');await sleep(45);
  let pages=0,flagged=0,optionFlags=0;
  for(let i=0;i<10;i++){
   const x=await cdp.eval(`(()=>{const h=document.querySelector('#subjectRoot h2'),opts=[...document.querySelectorAll('#subjectRoot button.focused-choice')],img=h?.querySelector('img.country-flag-image'),images=opts.filter(o=>o.querySelector('img.country-flag-image')).length;return{prompt:h?.textContent,hasQuestionFlag:!!img,src:img?.getAttribute('src'),n:opts.length,images,values:opts.map(o=>o.dataset.answer)}})()`);
   const expected=await cdp.eval(`(()=>{const q=window.LWU_FOCUSED_TOPICS.quizzes[document.body.dataset.focusTopic][${i}];return{q:q.q,optionEmojis:q.o.filter(o=>/[\u{1F1E6}-\u{1F1FF}]{2}/u.test(o)).length}})()`);
   const expectsQuestion=/[\u{1F1E6}-\u{1F1FF}]{2}/u.test(expected.q);
   check(x.n===4&&x.hasQuestionFlag===expectsQuestion,'quiz '+slug+' visual question '+i+' '+width);
   check(x.images===expected.optionEmojis,'quiz '+slug+' image options '+i+' '+width);
   if(expectsQuestion){flagged++;check(x.src?.startsWith('assets/country-flags/'),'question has local flag image '+slug+' '+i)}
   if(expected.optionEmojis)optionFlags++;
   if(i===0&&(x.src||x.images)){
    const f=await cdp.eval(`(()=>document.querySelector('#subjectRoot .country-flag-image')?.getAttribute('src'))()`);
    const iso=f?.match(/\/([a-z]{2})\.png$/)?.[1];if(iso){const b64=fs.readFileSync(path.join(P,'assets/country-flags',iso+'.png')).toString('base64');const good=await cdp.eval(`(async()=>{const im=document.querySelector('#subjectRoot .country-flag-image');im.src='data:image/png;base64,${b64}';await im.decode();return im.naturalWidth>10&&im.naturalHeight>10})()`);check(good,'flag bitmap actually decodes '+slug+' '+width)}
   }
   await cdp.eval(`document.querySelector('#subjectRoot button.focused-choice').click();document.querySelector('#nextFocusedQuiz')?.click()`);await sleep(25);pages++;
  }
  check(pages===10&&flagged>=2,'full ten-question '+slug+' quiz with flag questions '+width);
  check(Boolean(await cdp.eval(`document.querySelector('#sharedScoreCard')!==null`)),'quiz reaches final score card '+slug+' '+width);
  if(width===390){const screen=await cdp.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,slug+'-completed.png'),Buffer.from(screen.data,'base64'))}
 }
 if(fails.length){console.error(fails.join('\n'));console.error('v4.0.0 browser '+(count-fails.length)+'/'+count+' passed');process.exitCode=1}else console.log('v4.0.0 browser QA passed '+count+'/'+count+' checks (1280/800/390; both 10-question flag quizzes)');
 }catch(e){console.error(e.stack||e);process.exitCode=1}finally{cdp?.close();chrome?.kill('SIGTERM');await sleep(100);if(tmp)fs.rmSync(tmp,{recursive:true,force:true})}})();
