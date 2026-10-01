'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),pub=path.join(root,'public');
const routeMap=JSON.parse(fs.readFileSync(path.join(root,'route-map.json'),'utf8'));
const read=f=>fs.readFileSync(path.join(pub,routeMap[f]||f),'utf8');
let checks=0,passed=0;const failures=[];const ok=(v,m)=>{checks++;if(v)passed++;else failures.push(m)};

ok(fs.readFileSync(path.join(root,'VERSION'),'utf8').trim()==='2.2.0','VERSION is not 2.2.0');
ok(JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version==='2.2.0','package.json is not 2.2.0');
ok(read('service-worker.js').includes("CACHE='learnwithus-v2.2.0'"),'Service worker cache is not v2.2.0');

// 1 & 3. Main-only Kids panels: study plan + roadmap never remain in a learning mode.
const childrenJs=read('assets/children.js'),study=read('assets/kids-study-plan.js');
ok(childrenJs.includes("const studyPlan=document.getElementById('kidsStudyPlan')"),'Children runtime does not track Today’s study plan');
ok(childrenJs.includes('setMainOnlyPanelsVisible(false)'),'Learning modes do not explicitly hide main-only Kids panels');
ok(childrenJs.includes('setMainOnlyPanelsVisible(true)'),'Base Kids Corner does not explicitly restore main-only Kids panels');
ok(study.includes("new URLSearchParams(location.search).has('mode')")&&study.includes('root.hidden = true'),'Study plan does not self-hide when a learning mode query is present');

// 2. Learner name is local and reused by greetings, dashboard and score cards.
const platform=read('assets/platform.js'),score=read('assets/score-card.js');
ok(platform.includes("preferences:{age:'all',language:'en',name:''}"),'Learner name is not part of existing local preferences state');
ok(platform.includes('function ensureLearnerName()')&&platform.includes('Welcome to LearnWithUs!'),'First-run learner-name prompt is missing');
ok(platform.includes('Your name stays only on this browser'),'Name prompt does not explain local-only storage');
ok(platform.includes("Hi, '+name+'! Ready for your next discovery?"),'Kids Corner learner greeting is missing');
ok(platform.includes("Hi, '+safe(userName())+'! 👋"),'Dashboard learner greeting is missing');
ok(score.includes("Learner: '+esc(learnerName)"),'Score-card SVG does not include the learner name');
ok(score.includes("learnerName+' scored':'I scored'"),'Score-card share text does not include the learner name');

// 4 & 5. Separate A-Z phonics and 100 Picture Words spelling quizzes, full voice feedback.
const practice=read('assets/practice.js');
ok(routeMap['phonics-spelling-quiz.html']==='quiz/phonics-spelling-quiz.html','A-Z Phonics spelling canonical route is missing');
ok(read('phonics-spelling-quiz.html').includes('data-activity="phonics-spelling"'),'A-Z Phonics spelling page has the wrong activity');
ok(read('spelling-quiz.html').includes('data-activity="spelling"'),'100 Picture Words spelling page has the wrong activity');
ok(practice.includes("source:bank.slice(0,26)")&&practice.includes("title:'A–Z phonics spelling quiz'"),'A-Z Phonics quiz is not restricted to the first 26 phonics words');
ok(practice.includes("source:bank,title:'100 Picture Words spelling quiz'")||practice.includes("spellingQuiz({source:bank,title:'100 Picture Words"),'100 Picture Words quiz is not based on the full word bank');
ok(practice.includes("Correct answer! It is '+item.word+'.'"),'Picture spelling correct feedback does not speak the complete answer');
ok(practice.includes("Wrong answer. The correct answer is '+item.word+'.'"),'Picture spelling wrong feedback does not speak the complete answer');
ok(childrenJs.includes("quiz:'phonics-spelling-quiz.html'"),'Phonics completion does not open its dedicated A-Z spelling quiz');
ok(read('assets/learning-journey.js').includes("'word-bank.html':{title:'100 Picture Words'")&&read('assets/learning-journey.js').includes("quiz:'spelling-quiz.html'"),'100 Picture Words does not open its dedicated full-bank spelling quiz');

// 6 & 7. Letter tracing previous control + dedicated quiz.
ok(practice.includes('id="previousTrace"')&&practice.includes("document.getElementById('previousTrace').onclick=()=>move(-1)"),'Letter Tracing Previous letter control is missing');
ok(routeMap['letter-tracing-quiz.html']==='quiz/letter-tracing-quiz.html','Letter Tracing quiz canonical route is missing');
ok(read('letter-tracing-quiz.html').includes('Letter Tracing &amp; Order Quiz')||read('letter-tracing-quiz.html').includes('Letter Tracing & Order Quiz'),'Letter Tracing quiz page is missing');
ok(read('quiz-hub.html').includes('letter-tracing-quiz.html')&&read('quiz-hub.html').includes('Letter Tracing'),'Quiz Hub does not expose the separate Letter Tracing quiz');
ok(childrenJs.includes("quiz:'kids-quiz.html?category=letters"),'Letter recognition still does not use its own Letter Quiz');

// 9, 10 & 11. Maths content and quiz relevance.
const extraQuiz=read('assets/math-extra-quiz.js'),extraLearn=read('assets/math-extra.js');
const pvBlock=(extraQuiz.match(/"place-value":\[([\s\S]*?)\],\n"odd-even"/)||[])[1]||'';
ok(pvBlock.length>100,'Place Value quiz question set is missing');
ok(!/\d\s*\+\s*\d/.test(pvBlock),'Place Value quiz still contains arithmetic-looking addition questions');
ok(/place value|hundreds|tens|ones|thousands/i.test(pvBlock),'Place Value quiz does not focus on place-value concepts');
ok(read('odd-even.html').includes('Understand the idea first')&&read('odd-even.html').includes('concept-guide'),'Odd & Even lacks concept-first learning');
['addition','subtraction','multiplication','division'].forEach(topic=>{
  ok(practice.includes(`${topic}:{title:`),topic+' concept-first guide is missing');
  ok(read(topic+'.html').includes(`data-activity="${topic}"`),topic+' learning page is not connected to its activity');
});
ok(extraLearn.includes('Correct answer! It is ')&&extraLearn.includes('Wrong answer. The correct answer is '),'Extra maths practice lacks full spoken correct/wrong feedback');
ok(extraQuiz.includes('Correct answer! It is ')&&extraQuiz.includes('Wrong answer. The correct answer is '),'Extra maths quizzes lack full spoken correct/wrong feedback');
ok(read('assets/tables-quiz.js').includes('Correct answer!')&&read('assets/tables-quiz.js').includes('Wrong answer. The correct answer is'),'Table quiz lacks full spoken correct/wrong feedback');

// 12 & 13. Multiplication tables audio control and journey cleanup.
const tablePage=read('multiplication-tables.html'),tableJs=read('assets/tables.js');
ok(tablePage.includes('⏹ Stop audio')&&tablePage.includes('id="stopWholeTable"'),'Multiplication Tables Stop Audio control is missing');
ok(tableJs.includes('speechSynthesis.cancel')||tableJs.includes('synth.cancel'),'Multiplication Tables does not cancel whole-table audio');
ok(!tablePage.includes('Review Multiplication'),'Review Multiplication still appears in the table journey');
ok(tablePage.includes('← Previous: Multiplication')&&tablePage.includes('Next: Division'),'Multiplication Tables Previous/Next journey is incomplete');

// 14, 15 & 17. Every shared learning journey has Previous + Quiz + Next; duplicate CTAs removed.
const journey=read('assets/learning-journey.js');
const expectedJourneyPages=['place-value.html','odd-even.html','addition.html','subtraction.html','multiplication.html','division.html','fractions.html','time-calendar.html','measurement.html','letter-tracing.html','word-bank.html','planets.html','countries-capitals.html','india.html','hindi.html','telugu.html','stories.html','sports.html','creativity.html','life-skills.html','world-currencies.html','games.html'];
for(const page of expectedJourneyPages){
  const idx=journey.indexOf("'"+page+"':{");ok(idx>=0,'Shared journey route missing: '+page);
  if(idx>=0){const chunk=journey.slice(idx,journey.indexOf('},',idx)+2);ok(chunk.includes('prev:'),page+' is missing Previous concept');ok(chunk.includes('quiz:'),page+' is missing Quiz action');ok(chunk.includes('next:'),page+' is missing Next concept');}
}
ok(!read('time-calendar.html').includes('🎯 Start Time &amp; Calendar Quiz')&&!read('time-calendar.html').includes('🎯 Start Time & Calendar Quiz'),'Time & Calendar still contains duplicate static Start Quiz CTA');
ok(!read('measurement.html').includes('🎯 Start Measurement Quiz'),'Measurement still contains duplicate static Start Quiz CTA');

// 16. World Currencies replaces the old maths-only Indian Money concept.
ok(routeMap['world-currencies.html']==='learn/kids/world-currencies.html','World Currencies learning route missing');
ok(routeMap['world-currencies-quiz.html']==='quiz/world-currencies-quiz.html','World Currencies quiz route missing');
ok(routeMap['indian-money.html']==='learn/kids/world-currencies.html','Legacy Indian Money route is not safely redirected to World Currencies');
const currencySource=read('assets/world-currencies-data.js');
const currencyContext={window:{}};vm.createContext(currencyContext);vm.runInContext(currencySource,currencyContext);const currencies=currencyContext.window.LEARNWITHUS_WORLD_CURRENCIES;
ok(Array.isArray(currencies)&&currencies.length===195,'World Currencies does not cover 195 countries');
ok(currencies.every(x=>x.country&&x.region&&Array.isArray(x.currencies)&&x.currencies.length),'One or more countries lacks currency data');
ok(currencies.find(x=>x.country==='Bulgaria')?.currencies?.some(x=>x.code==='EUR'),'Bulgaria current EUR currency update is missing');
ok(read('children.html').includes('World Currencies')&&read('children.html').includes('kids-category-life-skills'),'Kids Corner does not expose World Currencies with Life Skills');
ok(!read('children.html').includes('Indian Money'),'Kids Corner still exposes retired Indian Money');
ok(!read('quiz-hub.html').includes('Indian Money')&&read('quiz-hub.html').includes('World Currencies'),'Quiz Hub currency migration is incomplete');
ok(read('assets/world-currencies-quiz.js').includes('Correct answer!')&&read('assets/world-currencies-quiz.js').includes('Wrong answer. The correct answer is'),'World Currencies quiz lacks complete voice feedback');

// 18 & 19. Colours and Shapes have dedicated related quizzes.
ok(routeMap['early-learning-quiz.html']==='quiz/early-learning-quiz.html','Colours/Shapes quiz canonical route missing');
ok(journey.includes("topic==='colours'")&&journey.includes("quiz:'colours-quiz.html'"),'Colours does not link to its dedicated quiz');
ok(journey.includes("topic==='shapes'")&&journey.includes("quiz:'shapes-quiz.html'"),'Shapes does not link to its dedicated quiz');
ok(read('assets/early-learning-quiz.js').includes('renderLearnWithUsScoreCard'),'Colours/Shapes quiz does not use the shared score card');
ok(read('assets/early-learning-quiz.js').includes('Correct answer!')&&read('assets/early-learning-quiz.js').includes('Wrong answer. The correct answer is'),'Colours/Shapes quiz lacks full voice feedback');

// 20. Planets whole-system visual and animation.
const planets=read('planets.html'),planetCss=read('assets/practice.css');
ok(planets.includes('solar-system-eight-planets.svg'),'Planets page lacks the all-eight-planets visual');
ok(fs.existsSync(path.join(pub,'assets','solar-system-eight-planets.svg')),'Solar-system visual asset is missing');
ok((planets.match(/class="orbit orbit-/g)||[]).length===8,'Planet motion model does not contain all eight planets');
ok(planets.includes('not to scale')&&planets.includes('togglePlanetMotion'),'Planet animation lacks teaching disclaimer or pause/play control');
ok(planetCss.includes('@keyframes orbit-spin')&&planetCss.includes('prefers-reduced-motion'),'Planet animation/reduced-motion styling is incomplete');

// 21. Roadmap order: languages immediately after Letters/Numbers.
const kidsHtml=read('children.html');
const roadmap=[...kidsHtml.matchAll(/class="[^"]*roadmap-stop[^"]*"[^>]*>[\s\S]*?<span class="roadmap-number">(\d+)<\/span>[\s\S]*?<strong>([^<]+)<\/strong>/g)].map(m=>[Number(m[1]),m[2].trim()]);
const firstEight=roadmap.slice(0,8).map(x=>x[1]);
ok(JSON.stringify(firstEight)===JSON.stringify(['Letters','Numbers','Hindi','Telugu','Phonics','Picture Words','Letter Tracing','Poems']),'Roadmap first eight steps are not in the requested order');
ok(roadmap.length===40&&roadmap.at(-3)?.[1]==='World Currencies'&&roadmap.at(-2)?.[1]==='Learning Games'&&roadmap.at(-1)?.[1]==='Quiz Hub','Roadmap numbering/end sequence is incomplete');

// 22 & 23. Hindi/Telugu go directly to their own letter quizzes.
ok(journey.includes("'hindi.html':{title:'Hindi Letters'")&&journey.includes("quiz:'language-quiz.html?lang=hi'"),'Hindi journey does not open Hindi Letters Quiz directly');
ok(journey.includes("'telugu.html':{title:'Telugu Letters'")&&journey.includes("quiz:'language-quiz.html?lang=te'"),'Telugu journey does not open Telugu Letters Quiz directly');
ok(read('quiz-hub.html').includes('language-quiz.html?lang=hi')&&read('quiz-hub.html').includes('language-quiz.html?lang=te'),'Quiz Hub is missing direct Hindi/Telugu letter quizzes');
ok(read('assets/language-quiz.js').includes('renderLearnWithUsScoreCard')&&read('assets/language-quiz.js').includes('Wrong answer. The correct answer is'),'Language quizzes lack score card or full spoken feedback');

// Cross-site voice consistency: answer-based learning/quiz modules say the answer on both correct and wrong feedback.
['life-skills-quiz.js','life-skills.js','games-quiz.js','games.js','sports-quiz.js','world-quiz.js','india-quiz.js','story.js','india.js'].forEach(file=>{
  const src=read('assets/'+file);
  ok(src.includes('Correct answer! It is ')&&src.includes('Wrong answer. The correct answer is '),file+' does not use complete spoken correct/wrong answer feedback');
});

// Integration: all new routes and assets are offline-capable and visible URLs resolve through route map.
const sw=read('service-worker.js');
['quiz/phonics-spelling-quiz.html','quiz/letter-tracing-quiz.html','quiz/language-quiz.html','quiz/early-learning-quiz.html','quiz/colours-quiz.html','quiz/shapes-quiz.html','learn/kids/world-currencies.html','quiz/world-currencies-quiz.html','assets/world-currencies-data.js','assets/solar-system-eight-planets.svg'].forEach(x=>ok(sw.includes("'./"+x+"'")||sw.includes("'./"+x+"?"),'Offline cache missing '+x));

if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log(`v2.2.0 requested-fixes regression passed: ${passed}/${checks} assertions.`);
