'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),pub=path.join(root,'public');
const routeMap=JSON.parse(fs.readFileSync(path.join(root,'route-map.json'),'utf8'));
const readRel=f=>fs.readFileSync(path.join(pub,f),'utf8');
const readLegacy=f=>readRel(routeMap[f]||f);
let checks=0,passed=0;const failures=[];
const ok=(v,m)=>{checks++;if(v)passed++;else failures.push(m)};

ok(fs.readFileSync(path.join(root,'VERSION'),'utf8').trim()==='2.1.0','VERSION is not 2.1.0');
ok(JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version==='2.1.0','package.json is not 2.1.0');
ok(readRel('service-worker.js').includes("CACHE='learnwithus-v2.1.0'"),'Service worker cache is not v2.1.0');
ok(readRel('service-worker.js').includes("'./assets/learning-journey.css'"),'Shared journey stylesheet is not pre-cached');

const journeyCss=readRel('assets/learning-journey.css');
[
  '.topic-quiz-journey',
  'grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr))',
  'min-height:58px',
  '.journey-primary',
  '.journey-secondary',
  '@media(max-width:600px)',
  'outline:3px solid #f1b93b'
].forEach(token=>ok(journeyCss.includes(token),'Shared journey CSS missing '+token));

const canonicalKids=fs.readdirSync(path.join(pub,'learn','kids')).filter(f=>f.endsWith('.html')).sort();
ok(canonicalKids.length>=28,'Expected canonical Kids HTML pages are missing');
canonicalKids.forEach(f=>{
  const html=readRel('learn/kids/'+f);
  ok(html.includes('assets/learning-journey.css?v=20260927a'),f+' does not load shared journey CSS');
  ok(html.includes('<base href="../../"')||html.includes("<base href='../../'"),f+' has wrong/missing base href');
});

for(const [legacy,canonical] of Object.entries(routeMap)){
  ok(fs.existsSync(path.join(pub,canonical)),'Missing canonical page '+canonical);
  const stub=readRel(legacy);
  ok(stub.includes('location.search+location.hash'),'Legacy route does not preserve query/hash: '+legacy);
  ok(stub.length<1500,'Legacy root file is not a small compatibility redirect: '+legacy);
}

const allowed=[/^quiz\//,/^learn\/kids\//,/^learn\/food\//,/^learn\/health\//,/^account\//,/^info\//,/^system\//];
Object.values(routeMap).forEach(canonical=>ok(allowed.some(rx=>rx.test(canonical)),'Canonical HTML is outside an approved folder: '+canonical));

const children=readRel('assets/children.js');
ok(children.includes("words:{title:'Picture Spelling'"),'Phonics completion journey missing');
ok(children.includes("secondary:'missing-letters-quiz.html'"),'Missing Letters action missing from Phonics completion');
ok(children.includes("next:'word-bank.html',nextLabel:'Picture Words'"),'Phonics next-topic action is wrong');
ok(children.includes('class="practice-button journey-primary"'),'Children primary journey button missing');
ok(children.includes('class="practice-button journey-secondary"'),'Children secondary journey buttons missing');

const learningJourney=readRel('assets/learning-journey.js');
[
  "'word-bank.html':{title:'Picture Words'",
  "next:'letter-tracing.html',nextLabel:'Letter Tracing'",
  "'letter-tracing.html':{title:'Letter Tracing'",
  "next:'early-learning.html?topic=poems',nextLabel:'Poems'",
  "'odd-even.html':{title:'Odd & Even',quiz:'math-quiz.html?topic=odd-even',next:'addition.html'",
  "'multiplication.html':{title:'Multiplication',quiz:'math-quiz.html?topic=multiplication',next:'multiplication-tables.html?table=2'",
  "'division.html':{title:'Division',quiz:'math-quiz.html?topic=division',next:'fractions.html'",
  "if(topic==='colours')",
  "if(topic==='shapes')"
].forEach(token=>ok(learningJourney.includes(token),'Learning sequence missing '+token));

const topicPages=[
  'addition.html','subtraction.html','multiplication.html','division.html','place-value.html','odd-even.html','fractions.html','time-calendar.html','indian-money.html','measurement.html',
  'letter-tracing.html','word-bank.html','early-learning.html','india.html','hindi.html','telugu.html','stories.html','sports.html','creativity.html','life-skills.html','games.html','multiplication-tables.html','planets.html','countries-capitals.html','kids-skills.html','story.html'
];
topicPages.forEach(f=>{
  const html=readLegacy(f);
  ok(html.includes('learning-journey.js')||html.includes('topic-quiz-journey')||html.includes('journey-actions'),f+' has no end-of-topic journey');
  ok(html.includes('learning-journey.css'),f+' does not load shared journey styling');
});

const staticJourney=['sports.html','life-skills.html','games.html','multiplication-tables.html','planets.html','countries-capitals.html'];
staticJourney.forEach(f=>{
  const html=readLegacy(f);
  ok(html.includes('Learn → practise → quiz'),f+' journey kicker missing');
  ok(html.includes('journey-primary'),f+' primary quiz action missing');
  ok(html.includes('journey-secondary'),f+' secondary/next action missing');
});

ok(readLegacy('multiplication-tables.html').includes('Next: Division →'),'Times Tables next-topic action should be Division');
ok(readLegacy('countries-capitals.html').includes('Next: India &amp; Maps →'),'Countries page next-topic label is not standardized');

if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log(`v2.1.0 journey/folder checks passed: ${passed}/${checks} assertions across ${canonicalKids.length} canonical Kids HTML pages.`);
