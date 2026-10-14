'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');const root=path.resolve(__dirname,'..'),pub=path.join(root,'public');
const dataSrc=fs.readFileSync(path.join(pub,'assets','new-learning-data.js'),'utf8');const payload=dataSrc.slice(dataSrc.indexOf('=')+1).trim().replace(/;$/,'');const D=JSON.parse(payload);
const version=fs.readFileSync(path.join(root,'VERSION'),'utf8').trim();
let checks=0;function ok(val,why){checks++;if(!val)throw Error(why)};
ok(['2.5.0','2.6.0','3.10.0'].includes(version),'Unexpected version');ok(Object.keys(D.science).length===11,'Missing science topics');ok(Object.keys(D.maths).length===(version==='3.10.0'?10:0),'Wrong Maths stage');
const lessons=fs.readFileSync(path.join(pub,'learn/kids/children.html'),'utf8'),hub=fs.readFileSync(path.join(pub,'quiz/quiz-hub.html'),'utf8'),sw=fs.readFileSync(path.join(pub,'service-worker.js'),'utf8');
ok(lessons.includes('S5')&&lessons.includes('S15'),'Science branch links missing');ok(lessons.includes('M12')&&lessons.includes('M21'),'Maths branch links missing');ok(lessons.includes('kids-category-science-discovery'),'Science Kids Corner category missing');ok((lessons.match(/class="roadmap-step roadmap-stop core-roadmap-step"/g)||[]).length===18,'Core length changed');
ok(sw.includes("CACHE='learnwithus-v"+version+"'"),'PWA version mismatched');
for(const [kind,items] of Object.entries(D)){for(const [key,x] of Object.entries(items)){ok(x.questions.length===10,'Not 10 questions '+key);for(const q of x.questions)ok(q.o.length===4&&new Set(q.o).size===4&&q.o.includes(q.a),'Invalid options '+key);const prefix=kind==='science'?'science-discovery':'smarter-maths';ok(lessons.includes(prefix+'.html?topic='+key),'Missing branch link '+key);ok(hub.includes(prefix+'-quiz.html?topic='+key),'Missing Quiz Hub card '+key);ok(lessons.includes('href="'+prefix+'.html?topic='+key+'"'),'Missing Kids topic card '+key)}}
for(const file of ['new-learning.js','new-learning-data.js'])new vm.Script(fs.readFileSync(path.join(pub,'assets',file),'utf8'),file);
for(const file of ['assets/new-learning.js','assets/new-learning.css','assets/new-learning-data.js'])ok(fs.readFileSync(path.join(pub,file)).equals(fs.readFileSync(path.join(root,'dist',file))),'Public/dist differs '+file);
console.log(`New Science/Maths v${version} regression passed: ${checks}/${checks}`);
