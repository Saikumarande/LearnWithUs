'use strict';
// In-memory Chromium audit of only the v4.0.0 category-toolbar and Quiz Hub cleanup.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawn}=require('node:child_process');
const R=path.resolve(__dirname,'../..'),P=path.join(R,'public'),port=9507;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const read=x=>fs.readFileSync(path.join(P,x),'utf8');
let count=0;const errors=[];function check(x,msg){count++;if(!x)errors.push(msg)}
class CDP{constructor(url){this.url=url;this.id=0;this.waiting=new Map()}async open(){this.ws=new WebSocket(this.url);await new Promise((ok,no)=>{this.ws.onopen=ok;this.ws.onerror=no});this.ws.onmessage=e=>{const d=JSON.parse(e.data);const w=this.waiting.get(d.id);if(w){this.waiting.delete(d.id);d.error?w.no(Error(JSON.stringify(d.error))):w.ok(d.result||{})}}}send(method,params={}){const id=++this.id;return new Promise((ok,no)=>{this.waiting.set(id,{ok,no});this.ws.send(JSON.stringify({id,method,params}))})}async eval(code){const r=await this.send('Runtime.evaluate',{expression:code,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result?.value}close(){this.ws?.close()}}
async function waitChrome(){for(let i=0;i<100;i++){try{const r=await fetch(`http://127.0.0.1:${port}/json/version`);if(r.ok)return}catch{}await sleep(100)}throw Error('Chromium launch timed out')}
(async()=>{let chrome,c,tmp;try{
 tmp=fs.mkdtempSync(path.join(os.tmpdir(),'lwu-cleanup-'));
 chrome=spawn(process.env.CHROMIUM_PATH||'/usr/bin/chromium',['--headless=new','--disable-gpu','--no-sandbox','--disable-dev-shm-usage','--remote-allow-origins=*',`--remote-debugging-port=${port}`,`--user-data-dir=${tmp}`,'about:blank'],{stdio:'ignore'});
 await waitChrome();const target=await(await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'})).json();c=new CDP(target.webSocketDebuggerUrl);await c.open();await c.send('Runtime.enable');
 const kidsCss=['learning.css','site-shell.css','kids.css','learning-journey.css','kids-nav-upgrade.css','branch-layout.css','practice.css'].map(x=>read('assets/'+x)).join('\n');
 const hubCss=['learning.css','site-shell.css','practice.css'].map(x=>read('assets/'+x)).join('\n');
 async function load(page,css,width){await c.send('Emulation.setDeviceMetricsOverride',{width,height:950,deviceScaleFactor:1,mobile:width<600});const html=read(page).replace(/<base\b[^>]*>/gi,'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<link\b[^>]*>/gi,'').replace('</head>','<base href="https://learnwithus.example/public/"><style>'+css+'</style></head>');await c.eval(`document.open();document.write(${JSON.stringify(html)});document.close();true`)}
 for(const width of [1280,800,390]){
   await load('learn/kids/children.html',kidsCss,width);
   for(const name of ['branch-nav-data.js','site-shell.js','kids-nav-upgrade.js'])await c.eval(read('assets/'+name)+'\ntrue');await sleep(40);
   const nav=await c.eval(`(()=>{const b=document.querySelector('.lwu-quiz-hub-shortcut'),s=document.querySelector('.lwu-category-search-label'),t=document.querySelector('#lwuCategoryToggle'),bar=document.querySelector('.lwu-category-toolbar'),rect=x=>x?.getBoundingClientRect();const a=rect(b),z=rect(s),c=rect(t),d=rect(bar);return {present:!!b&&!!s&&!!t,href:b?.getAttribute('href'),sameRow:Math.abs(a.top-z.top)<=5&&Math.abs(z.top-c.top)<=5,correctOrder:a.right<=z.left+2&&z.right<=c.left+2,inside:a.left>=d.left-2&&c.right<=d.right+3,overflow:document.documentElement.scrollWidth>innerWidth+3,shortcutHeight:a.height,barHeight:d.height}})()`);
   check(nav.present&&nav.href==='quiz/quiz-hub.html'&&nav.sameRow&&nav.correctOrder&&nav.inside&&!nav.overflow&&nav.barHeight<=45,'Kids Quiz Hub shortcut geometry at '+width+': '+JSON.stringify(nav));
   await load('quiz/quiz-hub.html',hubCss,width);
   const quiz=await c.eval(`(()=>{const section=document.querySelector('.quiz-section-interactive'),cards=[...section.querySelectorAll('.quiz-card')],grid=section.querySelector('.quiz-grid'),r=cards.map(x=>x.getBoundingClientRect()),c=getComputedStyle(grid).gridTemplateColumns.split(' ').length;return{eight:cards.length===8,cardClass:cards.every(x=>x.classList.contains('quiz-card')),columns:c,cardSize:r.every(x=>x.height>=90&&x.width>=100),aligned:Math.max(...r.slice(0,c).map(x=>x.top))-Math.min(...r.slice(0,c).map(x=>x.top))<3,overflow:document.documentElement.scrollWidth>innerWidth+3,anchorCount:cards.filter(x=>x.getAttribute('href')?.startsWith('quiz/')).length}})()`);
   const expected=width===1280?4:width===800?3:1;
   check(quiz.eight&&quiz.cardClass&&quiz.columns===expected&&quiz.cardSize&&quiz.aligned&&!quiz.overflow&&quiz.anchorCount===8,'Quiz Hub card layout '+width+': '+JSON.stringify(quiz));
 }
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1}else console.log(`v4.0.0 UI cleanup browser geometry: ${count}/${count} passed across 1280/800/390 widths`);
}catch(e){console.error(e.stack||e);process.exitCode=1}finally{c?.close();chrome?.kill('SIGTERM');await sleep(100);if(tmp)fs.rmSync(tmp,{recursive:true,force:true})}})();
