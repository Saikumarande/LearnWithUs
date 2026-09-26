'use strict';

const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const pub=path.join(root,'public');
const dist=path.join(root,'dist');
const read=file=>fs.readFileSync(path.join(pub,file),'utf8');
let passed=0;
const failures=[];
function check(value,name){if(value)passed++;else failures.push(name);}
function section(html,title){const start=html.indexOf(`<h3>${title}</h3>`);if(start<0)return '';const next=html.indexOf('<section class="kids-category-card',start+1);return html.slice(start,next<0?html.length:next);}

const children=read('children.html');
const childrenJs=read('assets/children.js');
const kidsCss=read('assets/kids.css');
const searchJs=read('assets/kids-search.js');
const scoreCss=read('assets/score-card.css');
const sw=read('service-worker.js');
const english=section(children,'English &amp; Reading');
const maths=section(children,'Maths &amp; Numbers');
const world=section(children,'World Around Us');
const india=section(children,'India &amp; General Knowledge');
const languages=section(children,'Indian Languages');
const quiz=section(children,'Quiz Hub');

check(fs.readFileSync(path.join(root,'VERSION'),'utf8').trim()==='1.8.1','VERSION is not 1.8.1');
check(JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version==='1.8.1','package.json is not 1.8.1');
check((children.match(/kids-activity-card/g)||[]).length>=23,'Kids Corner does not contain the complete activity tile set');
check(['data-mode="letters"','data-mode="words"','word-bank.html','letter-tracing.html','topic=poems'].every(x=>english.includes(x)),'English & Reading grouping is incomplete');
check(['data-mode="numbers"','place-value.html','odd-even.html','addition.html','subtraction.html','multiplication.html','division.html','fractions.html','time-calendar.html','indian-money.html','measurement.html'].every(x=>maths.includes(x)),'Maths & Numbers grouping is incomplete');
check(['data-mode="animals"','topic=colours','topic=shapes'].every(x=>world.includes(x))&&!world.includes('india.html'),'World Around Us grouping is incorrect');
check(india.includes('india.html')&&!india.includes('data-mode="animals"'),'India & General Knowledge grouping is incorrect');
check(languages.includes('hindi.html')&&languages.includes('telugu.html'),'Indian Languages grouping is incomplete');
check(quiz.includes('quiz-hub.html'),'Quiz Hub tile is missing');
check(kidsCss.includes('grid-template-columns:repeat(3,minmax(0,1fr))')&&kidsCss.includes('.activity-copy small'),'Three-column descriptive activity tile layout is missing');
check(searchJs.includes("querySelectorAll('.kids-activity-card')")&&searchJs.includes("querySelectorAll('.kids-category-card')"),'Kids activity search is not wired to the new tiles');
check(!childrenJs.includes("getElementById('kids-quiz-choices')"),'Stale Kids Corner DOM reference remains');
check(childrenJs.includes('requestAnimationFrame(ensureModeRendered)')&&childrenJs.includes("mode==='letters'?letters.length"),'Letters first-open render guard is missing');
check(childrenJs.includes('ui.learningGrid.replaceChildren()')&&childrenJs.includes('ui.learningGrid.hidden=false'),'Letters grid is not explicitly reset/revealed before first render');
check(scoreCss.includes('width:min(100%,780px)')&&scoreCss.includes('max-width:744px'),'Score card is not constrained to the viewport');
check(scoreCss.includes('grid-template-columns:repeat(3,minmax(0,1fr))')&&scoreCss.includes('@media(max-width:720px)')&&scoreCss.includes('grid-template-columns:1fr'),'Score-card actions are not responsive');
const scorePages=fs.readdirSync(pub).filter(file=>file.endsWith('.html')&&read(file).includes('score-card.js'));
check(scorePages.length===10,'Unexpected number of shared score-card consumers');
check(scorePages.every(file=>read(file).includes('score-card.css?v=20260926m')),'One or more quizzes do not load the shared score-card stylesheet');
check(sw.includes("CACHE='learnwithus-v1.8.1'")&&sw.includes("'./assets/children.js?v=20260926m'")&&sw.includes("'./assets/kids-search.js?v=20260926m'"),'PWA cache does not include corrected Kids assets');
check(sw.includes("'./assets/score-card.css?v=20260926m'"),'PWA cache does not include score-card CSS');
check(fs.readFileSync(path.join(root,'README.md'),'utf8').includes('## Current release: v1.8.1'),'README release notes are missing');
check(fs.readFileSync(path.join(root,'docs','CHANGELOG.md'),'utf8').includes('## 1.8.1 — 2026-09-26'),'Changelog release entry is missing');

// public and dist must be byte-identical for browser-facing files.
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)).map(x=>path.join(entry.name,x)):[entry.name]);
const pubFiles=walk(pub).sort(),distFiles=walk(dist).sort();
check(JSON.stringify(pubFiles)===JSON.stringify(distFiles),'public and dist file lists differ');
const same=pubFiles.every(file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(pub,file))).digest('hex')===crypto.createHash('sha256').update(fs.readFileSync(path.join(dist,file))).digest('hex'));
check(same,'public and dist browser files are not byte-identical');


check(read('assets/practice.css').includes('grid-template-columns:repeat(auto-fit,minmax(220px,1fr))')&&read('assets/practice.css').includes('.journey-actions>a'),'Maths journey buttons are not using the aligned shared layout');
check(fs.existsSync(path.join(pub,'multiplication-tables.html'))&&fs.existsSync(path.join(pub,'multiplication-tables-quiz.html')),'Multiplication tables routes are missing');
check(read('assets/tables.js').includes('for(let n=1;n<=20;n++')&&read('assets/tables.js').includes('i<=10')&&!read('assets/tables.js').includes('i<=12'),'Tables learning page does not cover 1–20 and x1–x10');
check(read('assets/tables-quiz.js').includes("new URLSearchParams(location.search).get('table')")&&read('assets/tables-quiz.js').includes('score<8'),'Table quiz handoff/review logic is missing');
check(read('time-calendar.html').includes('Days of the week')&&read('time-calendar.html').includes('Months of the year')&&read('time-calendar.html').includes('Seasons'),'Time & Calendar additions are missing');
check(fs.existsSync(path.join(pub,'planets.html'))&&fs.existsSync(path.join(pub,'countries-capitals.html'))&&fs.existsSync(path.join(pub,'world-quiz.html')),'World learning routes are missing');
check((read('assets/world-data.js').match(/"country":/g)||[]).length===48,'Countries & Capitals starter set must contain 48 countries');
check(read('assets/world-quiz.js').includes("Wrong answer. The correct answer is ")&&read('assets/world-quiz.js').includes('renderLearnWithUsScoreCard'),'World quizzes must use spoken feedback and score cards');
check(read('india.html').includes('Map Hunt')&&read('india.html').includes('Start State &amp; Capital Quiz'),'India interactive activities or quiz CTA are missing');
check(read('assets/india.js').includes('mapTargetMarker')&&read('assets/india.js').includes('optionsFor(field,correct)')&&read('assets/india.js').includes('spelling-input'),'India Map Hunt/five-choice activities are incomplete');
check(read('assets/india-quiz.js').includes('slice(0,10)')&&read('assets/india-quiz.js').includes('slice(0,4)')&&read('assets/india-quiz.js').includes('renderLearnWithUsScoreCard'),'India capital quiz must have ten questions, five choices and score card');
check(read('assets/score-card.js').includes('★ ★ ★ ★ ★')&&read('assets/score-card.js').includes('🏆'),'Score cards are missing child-friendly achievement symbols');
check(children.includes('multiplication-tables.html')&&world.includes('planets.html')&&world.includes('countries-capitals.html'),'Kids Corner is missing new features in the correct categories');
check(read('quiz-hub.html').includes('multiplication-tables-quiz.html')&&read('quiz-hub.html').includes('india-quiz.html')&&read('quiz-hub.html').includes('world-quiz.html?topic=planets')&&read('quiz-hub.html').includes('world-quiz.html?topic=countries'),'Quiz Hub is missing new quizzes');

const siteShell=read('assets/site-shell.js');
const siteShellCss=read('assets/site-shell.css');
const practiceCss=read('assets/practice.css');
check(practiceCss.includes('.table-facts{display:grid;grid-template-columns:1fr')&&!practiceCss.includes('.table-facts{display:grid;grid-template-columns:repeat(3'),'Multiplication facts are not forced into one vertical column');
check(read('assets/tables.js').includes('Array.from({length:10}')&&read('assets/tables.js').includes('from one to ten.'),'Whole-table audio does not stop at x10');
check(read('assets/tables-quiz.js').includes('Array.from({length:10}')&&!read('assets/tables-quiz.js').includes('Array.from({length:12}'),'Table quiz still includes factors above 10');
const quickLinks=['Kids Corner','Letters','Hindi','Telugu','Phonics','Numbers','Animals','Colours','Shapes','Poems','Quiz Hub'];
check(quickLinks.every(label=>siteShell.includes('>'+label+'</a>')),'Shared Kids quick navigation is missing one or more required links');
check(siteShell.includes("classList.add('fl-section-nav','fl-kids-quick-nav')")&&siteShell.includes("classList.add('is-scroll-hidden')")&&siteShell.includes("classList.remove('is-scroll-hidden')"),'Kids quick-nav injection or scroll-direction behavior is missing');
check(siteShellCss.includes('.fl-kids-quick-nav .fl-container')&&siteShellCss.includes('flex-wrap:nowrap!important')&&siteShellCss.includes('overflow-x:auto')&&siteShellCss.includes('.fl-kids-quick-nav.is-scroll-hidden'),'Kids quick-nav is not compact, horizontal and hideable');
const kidsPages=fs.readdirSync(pub).filter(file=>file.endsWith('.html')&&read(file).includes('data-area="kids"'));
check(kidsPages.length>=30&&kidsPages.every(file=>read(file).includes('assets/site-shell.js?v=20260926p')),'One or more Kids pages do not load the current shared quick-nav shell');
check(sw.includes("CACHE='learnwithus-v1.8.1'")&&sw.includes("'./assets/site-shell.js?v=20260926p'")&&sw.includes("'./assets/tables.js?v=20260926p'")&&sw.includes("'./assets/tables-quiz.js?v=20260926p'"),'v1.8.1 offline cache is missing current quick-nav/table assets');
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log(`v1.8.1 targeted regression checks passed: ${passed}/${passed} cases.`);
