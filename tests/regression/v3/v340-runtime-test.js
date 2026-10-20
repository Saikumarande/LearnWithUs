'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const R=path.resolve(__dirname,'../../..'),P=path.join(R,'public');const read=p=>fs.readFileSync(path.join(P,p),'utf8');
let n=0;const ok=(v,m)=>{n++;assert.ok(v,m)};
const raw=read('assets/focused-topics-data.js');const data=JSON.parse(raw.substring(raw.indexOf('=')+1).trim().replace(/;$/,''));const entries=Object.entries(data.registry);
const kids=read('learn/kids/children.html');
ok(fs.readFileSync(path.join(R,'VERSION'),'utf8').trim()==='4.0.0','VERSION');ok(JSON.parse(fs.readFileSync(path.join(R,'package.json'))).version==='4.0.0','package');ok(read('service-worker.js').includes("CACHE='learnwithus-v4.0.0'"),'PWA');
ok((kids.match(/class="roadmap-step roadmap-stop core-roadmap-step"/g)||[]).length===18,'Core 18');ok((kids.match(/class="journey-card"/g)||[]).length===9,'nine branches');ok(kids.includes('data-journey="support"'),'Parent/support branch missing');
const science=kids.match(/<section class="kids-category-card kids-category-science-discovery"[\s\S]*?<\/section>/)?.[0]||'';
ok(science.includes('class="kids-category-links"'),'Science grid did not adopt the existing card component');ok(!science.includes('class="kids-activity-grid"'),'Science uses obsolete grid');ok((science.match(/class="kids-activity-card"/g)||[]).length===16,'All 16 Science cards still accessible');
const css=read('assets/kids.css'),focusedCss=read('assets/focused-topics.css');ok(css.includes('.kids-category-links{display:grid'),'Existing canonical card grid missing');ok(focusedCss.includes('.focused-journey')&&focusedCss.includes('.focused-choices'),'Shared component stylesheet missing');
for(const [slug,topic] of entries){
 const lesson='learn/kids/'+slug+'-lesson.html',quiz='quiz/'+slug+'-quiz.html';
 ok(fs.existsSync(path.join(P,lesson)),'Missing lesson '+lesson);ok(fs.existsSync(path.join(P,quiz)),'Missing quiz '+quiz);
 ok(read(lesson).includes('data-focus-topic="'+slug+'"'),'Lesson identity '+slug);ok(read(lesson).includes('assets/topic-flow.js'),'Lesson journey '+slug);
 ok(read(quiz).includes('data-focus-topic="'+slug+'"'),'Quiz identity '+slug);ok(read(quiz).includes('assets/topic-quiz.js'),'Quiz runtime '+slug);
 ok(fs.existsSync(path.join(P,slug+'-lesson.html'))&&fs.existsSync(path.join(P,slug+'-quiz.html')),'Root aliases '+slug);
 ok((data.quizzes[slug]||[]).length>=10,'At least ten questions '+slug);
 data.quizzes[slug].forEach((q,i)=>{ok(q.q&&q.a&&q.explanation&&q.o.length===4&&new Set(q.o).size===4&&q.o.includes(q.a),'Correct-answer/uniqueness '+slug+' '+i)});
}
ok(kids.includes('flags-lesson.html')&&kids.includes('landmarks-lesson.html')&&kids.includes('continents-lesson.html')&&kids.includes('geography-lesson.html'),'World categories not separated');
ok(!kids.includes('world-explorer.html#flags')&&!kids.includes('world-explorer.html#landmarks'),'Old World anchor links remain');
const world=read('learn/kids/world-explorer.html');ok(world.includes('assets/world-hub.js')&&!world.includes('assets/world-expansion.js'),'World hub still renders every world topic');
for(const p of ['smart-learning','parent-dashboard','coding-lab','learner-profiles','learning-tools','everyday-explorer']){let s=read('learn/kids/'+p+'.html');ok(s.includes('assets/topic-hub.js')&&!s.includes('assets/smart-pages.js')&&!s.includes('assets/learning-tools.js')&&!s.includes('assets/coding-lab.js')&&!s.includes('assets/everyday-explorer.js'),'Combined page still renders every subject '+p);ok(!s.includes('aria-label="Next learning areas"'),'Generic three links remain '+p)}
const flow=read('assets/topic-flow.js'),quizJs=read('assets/topic-quiz.js');ok(flow.includes('Learn → Practise → Quiz')&&flow.includes('Try three practice questions'),'Shared journey wording and practice');ok(quizJs.includes('renderLearnWithUsScoreCard')&&quizJs.includes('recordQuiz')&&quizJs.includes('recordAnswer'),'Quiz integration');
ok(read('assets/new-learning.js').includes('Question 1 of 3'),'Existing Science/Maths now show three practices');
const routes=JSON.parse(fs.readFileSync(path.join(R,'route-map.json')));for(const [slug] of entries){ok(routes[slug+'-lesson.html']==='learn/kids/'+slug+'-lesson.html','Lesson route map '+slug);ok(routes[slug+'-quiz.html']==='quiz/'+slug+'-quiz.html','Quiz route map '+slug)}
console.log(`v4.0.0 focused lessons, Science alignment, category + quiz contracts passed: ${n}/${n} assertions for ${entries.length} distinct topics.`);
