'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),pub=path.join(root,'public');
const read=f=>fs.readFileSync(path.join(pub,f),'utf8');
let checks=0,passed=0;const failures=[];
const ok=(v,m)=>{checks++;if(v)passed++;else failures.push(m)};

ok(fs.readFileSync(path.join(root,'VERSION'),'utf8').trim()==='2.2.0','VERSION is not 2.2.0');
ok(JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version==='2.2.0','package.json is not 2.2.0');
ok(read('service-worker.js').includes("CACHE='learnwithus-v2.2.0'"),'Service worker cache is not v2.1.1');

const ranges=['1-25','26-50','51-75','76-100'];
const data=read('assets/kids-data.js'),children=read('assets/children.js'),childHtml=read('learn/kids/children.html'),quizHtml=read('quiz/kids-quiz.html'),quizJs=read('assets/kids-quiz.js');
ok(data.includes("const ranges=['1-25','26-50','51-75','76-100']"),'Shared number ranges are not the four 25-number sets');

const sandbox={window:{},URLSearchParams};vm.createContext(sandbox);vm.runInContext(data,sandbox);
const kidData=sandbox.window.LEARNWITHUS_KIDS;
ok(JSON.stringify([...kidData.ranges])===JSON.stringify(ranges),'Executed Kids data ranges do not match source contract');
ok(kidData.numberRange(1)==='1-25'&&kidData.numberRange(25)==='1-25','1–25 boundary mapping is wrong');
ok(kidData.numberRange(26)==='26-50'&&kidData.numberRange(50)==='26-50','26–50 boundary mapping is wrong');
ok(kidData.numberRange(51)==='51-75'&&kidData.numberRange(75)==='51-75','51–75 boundary mapping is wrong');
ok(kidData.numberRange(76)==='76-100'&&kidData.numberRange(100)==='76-100','76–100 boundary mapping is wrong');
ok(kidData.normalizeNumberRange('0-20',20)==='1-25','Old 0–20 deep link does not normalize to Set 1');
ok(kidData.normalizeNumberRange('21-50',21)==='1-25','Old 21–50 deep link with number 21 should normalize by the actual number');
ok(kidData.normalizeNumberRange('51-100',90)==='76-100','Old 51–100 deep link with number 90 should normalize to Set 4');
ok(kidData.lessonLink('numbers',76,'upper','76-100').includes('range=76-100')&&kidData.lessonLink('numbers',76,'upper','76-100').includes('number=76'),'Number lessonLink does not preserve set and target number');
ranges.forEach(r=>{
  ok(childHtml.includes(`value="${r}"`),`Numbers learning dropdown missing ${r}`);
  ok(quizHtml.includes(`value="${r}"`),`Number quiz dropdown missing ${r}`);
});
ok((childHtml.match(/id="numberRange"/g)||[]).length===1,'Numbers learning should use one dropdown');
ok((quizHtml.match(/id="kidRange"/g)||[]).length===1,'Number quiz should use one range dropdown');
ok(childHtml.includes('1–25 · Set 1')&&childHtml.includes('76–100 · Set 4'),'Numbers dropdown labels are incomplete');
ok(!childHtml.includes('0–100 · All numbers')&&!childHtml.includes('20 numbers per page'),'Old Numbers range/paging copy remains in canonical page');
ok(children.includes("if(mode==='numbers')return [all]"),'Numbers are still internally paginated');
ok(children.includes("'25 numbers in this set'"),'Numbers card count does not say 25');
ok(children.includes("mode==='numbers'?span+' · 25 numbers'"),'Numbers status does not report 25 numbers');
ok(children.includes("const expected=mode==='letters'?letters.length:mode==='words'?letters.length:mode==='animals'?animals.length:25"),'Numbers rendered-card expectation is not 25');
ok(children.includes("quiz:'kids-quiz.html?category=numbers&range='+ui.numberRange.value"),'Numbers completion quiz does not preserve selected set');
ok(children.includes("quizLabel:'Start Numbers Quiz'"),'Numbers completion Start Quiz button missing');
ok(children.includes("next:'hindi.html',nextLabel:'Hindi'"),'Numbers completion Next: Hindi action missing');
ok(data.includes("n<=25?'1-25':n<=50?'26-50':n<=75?'51-75':'76-100'"),'numberRange helper does not cover the new four sets');
ok(data.includes("function normalizeNumberRange"),'Legacy number-range normalization is missing');
ok(quizJs.includes("range==='1-25'?'26-50':range==='26-50'?'51-75':range==='51-75'?'76-100'"),'Quiz next-range progression does not follow all four sets');
ok(read('assets/platform.js').includes('Count from 1 to 100 in four sets'),'Platform Numbers description was not updated');
ok(fs.readFileSync(path.join(root,'README.md'),'utf8').includes('## Current release: v2.2.0'),'README current release missing');
ok(fs.readFileSync(path.join(root,'docs','CHANGELOG.md'),'utf8').includes('## 2.2.0 — 2026-10-02'),'Changelog v2.1.1 entry missing');

// Pure data contract: each range has exactly 25 integers and together they cover 1..100 once.
const values=[];
for(const r of ranges){const [a,b]=r.split('-').map(Number),set=Array.from({length:b-a+1},(_,i)=>a+i);ok(set.length===25,`${r} does not contain 25 values`);values.push(...set)}
ok(values.length===100,'Four number sets do not contain 100 total values');
ok(new Set(values).size===100,'Number sets overlap');
ok(values[0]===1&&values.at(-1)===100,'Number sets do not cover 1 through 100');

if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log(`v2.2.0-compatible Numbers checks passed: ${passed}/${checks} assertions.`);
