'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');const R=path.resolve(__dirname,'../../..'),P=path.join(R,'public');let n=0;const ok=(v,m)=>{n++;if(!v)throw Error(m)};const read=f=>fs.readFileSync(path.join(P,f),'utf8');
const data=JSON.parse(read('assets/level2-data.js').split('window.LWU_LEVEL2=')[1].trim().replace(/;$/,''));const branch=JSON.parse(read('assets/branch-nav-data.js').split('window.LWU_BRANCH_ROUTE_DATA=')[1].trim().replace(/;$/,''));
ok(Object.keys(data).length===16,'All 16 topics');ok(branch.science.length===20&&branch.maths.length===26&&branch.languages.length===8,'Branch totals');ok(Object.keys(branch).length===9,'All 9 branch groups');ok((read('learn/kids/children.html').match(/class="roadmap-step roadmap-stop core-roadmap-step"/g)||[]).length===18,'Core journey preserved');
const code=new Set();for(const b of ['science','maths','languages'])for(const step of branch[b]){ok(!code.has(step.code),'No duplicated code '+step.code);code.add(step.code);}
const kids=read('learn/kids/children.html'),hub=read('quiz/quiz-hub.html'),cache=read('service-worker.js');
for(const t of Object.values(data)){
 ok(t.questions.length===10&&t.facts.length===10,'Ten examples and questions '+t.id);
 ok(kids.includes('data-roadmap-url="'+t.id+'.html"'),'Numbered Kids journey '+t.id);
 ok(kids.includes('href="'+t.id+'.html"'),'Roadmap '+t.id);
 ok(hub.includes('data-level2-topic="'+t.id+'"'),'Quiz hub '+t.id);
 const lesson=read('learn/kids/'+t.id+'.html'),quiz=read('quiz/'+t.id+'-quiz.html');ok(lesson.includes('data-level2-quiz="false"')&&quiz.includes('data-level2-quiz="true"'),'Dedicated pages '+t.id);
 ok(lesson.includes('assets/level2.css')&&quiz.includes('assets/level2.css'),'Shared CSS '+t.id);
 ok(lesson.includes('assets/level2-engine.js')&&quiz.includes('assets/level2-engine.js'),'Shared engine '+t.id);
 ok(lesson.includes('assets/platform.js')&&quiz.includes('assets/smart-core.js'),'Score/progress integration '+t.id);
 ok(read(t.id+'.html').includes('learn/kids/'+t.id+'.html')&&read(t.id+'-quiz.html').includes('quiz/'+t.id+'-quiz.html'),'Redirect preserved '+t.id);
 for(const q of t.questions){ok(q.answer===q.options.find(s=>s===q.answer)&&new Set(q.options).size===4&&q.options.length===4,'Options valid '+t.id);ok(q.explanation.length>10,'Explained answer '+t.id);}
 for(const part of ['learn/kids/'+t.id+'.html','quiz/'+t.id+'-quiz.html',t.id+'.html',t.id+'-quiz.html'])ok(cache.includes('./'+part),'Offline route '+part);
 }
for(const x of ['level2-data.js','level2-engine.js']){new vm.Script(read('assets/'+x),{filename:x});ok(cache.includes('./assets/'+x),'Offline asset '+x)}
for(const r of ['science','maths','languages']){const items=Object.values(data).filter(t=>t.branch===r);ok(items.every(t=>branch[r].some(x=>x.href===t.id+'.html')),'Branch membership '+r);}
const layout=read('assets/level2.css');for(const selector of ['.level2-fact-grid','.level2-topic-strip','@media(max-width:850px)','@media(max-width:590px)'])ok(layout.includes(selector),'Responsive CSS '+selector);
ok(cache.includes('learnwithus-v'+require('../../../package.json').version),'Release cache match');ok(fs.readFileSync(path.join(R,'VERSION'),'utf8').trim()===require('../../../package.json').version,'Version match');
console.log('v3.13 Level 2 source/compatibility '+n+'/'+n+' passed, 16 topics, 160 explained questions');
