'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),pub=path.join(root,'public');
const get=x=>fs.readFileSync(path.join(pub,x),'utf8');
const kids=get('learn/kids/children.html'),hub=get('quiz/quiz-hub.html'),toolbar=get('assets/kids-nav-upgrade.js'),css=get('assets/kids-nav-upgrade.css'),branches=get('assets/branch-nav-data.js'),smart=get('assets/smart-pages.js'),topicHub=get('assets/topic-hub.js');
const routeData=JSON.parse(branches.split('window.LWU_BRANCH_ROUTE_DATA=')[1].trim().replace(/;$/,''));
let count=0;const check=(v,msg)=>{count++;assert.ok(v,msg)};
const lower=kids.split('<div class="kids-category-stack">')[1];check(!!lower,'Lower activity area exists');
const recent=['decimals','percentages','area-perimeter','intro-algebra','coordinates','hindi-matras','hindi-words','hindi-sentences','telugu-gunintalu','telugu-words','telugu-sentences','punctuation-mastery','syllables-silent-letters','paragraph-writing','reading-fluency-plus','physical-geography','world-time-zones','natural-wonders','latitude-longitude','climate-zones','comic-strip-creator','flipbook-animation','digital-poster-maker','music-composer','art-gallery','mini-sudoku','tangram-maker','coding-conditions','logic-escape-room','pattern-detective'];
for(const id of recent){check(kids.includes('data-roadmap-url="'+id+'.html"'),'Top numbered journey lost '+id);check(!lower.includes('href="'+id+'.html"'),'Duplicate lower card remains '+id)}
for(const id of ['dictionary','listening','conversation','helpers','transport','situations','flags','landmarks']){const hits=[...lower.matchAll(new RegExp('href="'+id+'-lesson.html"','g'))];check(hits.length===1,'Duplicate lower card still present '+id+' ('+hits.length+')')}
check(!kids.includes('Targeted Revision')&&!hub.includes('Targeted Revision')&&!smart.includes('Targeted revision'),'Unwanted UI wording remains');
check(routeData.support.length===17&&!routeData.support.some(x=>x.href==='targeted-lesson.html'),'Retired item still in branch navigation');
check(topicHub.includes("key!=='targeted'"),'Retired item still in smart hub');
check(kids.includes('data-roadmap-url="quiz-hub.html"')&&routeData.games.some(x=>x.href==='quiz-hub.html'),'G2 Quiz Hub journey missing');
check(toolbar.indexOf('lwu-quiz-hub-shortcut')>0&&toolbar.indexOf('lwu-quiz-hub-shortcut')<toolbar.indexOf('lwu-category-search-label'),'Quiz Hub shortcut not before search');
check(css.includes('lwu-quiz-hub-shortcut')&&css.includes('max-width:620px'),'Quiz Hub responsive styles missing');
const section=hub.match(/<section class="quiz-section quiz-section-interactive">([\s\S]*?)<\/section>/)?.[1];check(!!section,'Interactive quiz cards not using standard section');
check((section.match(/class="quiz-card"/g)||[]).length===8,'Interactive quiz cards incomplete');
const ids=['balanced-plate','food-label-detective','seasonal-foods','food-storage','sleep-science','heart-and-movement','dental-health','germs-prevention'];
for(const id of ids){check(section.includes('href="quiz/'+id+'-quiz.html"'),'Interactive quiz missing '+id);check(fs.existsSync(path.join(pub,'quiz',id+'-quiz.html')),'Quiz destination missing '+id)}
check(!hub.includes('class="lw-family-level2"')&&!hub.includes('style="columns:2;line-height:2"'),'Old inline quiz list remains');
console.log(`v4.0.0 UI dedupe/navigation contract: ${count}/${count} assertions passed, 38 duplicate lower activity cards removed, 8 interactive quiz cards aligned.`);
