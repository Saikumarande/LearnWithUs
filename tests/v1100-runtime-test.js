'use strict';
const fs=require('node:fs'),path=require('node:path');
const project=path.resolve(__dirname,'..'),pub=path.join(project,'public'),read=f=>fs.readFileSync(path.join(pub,f),'utf8');
let checks=0,passed=0;const fail=[]; const ok=(v,m)=>{checks++; if(v)passed++; else fail.push(m)};
ok(fs.existsSync(path.join(pub,'life-skills.html')),'life-skills.html missing'); ok(fs.existsSync(path.join(pub,'games.html')),'games.html missing');
const creative=read('creativity.html'),creativeJs=read('assets/creativity.js');
['drawingLesson','colouringItem','dotsLesson','paperCraft','origamiCraft','instrumentSelect','danceSelect','storyCharacter','poemNoun','sheetTheme'].forEach(id=>ok(creative.includes('id="'+id+'"'),'Creativity page missing '+id));
ok(creativeJs.includes('colourItems')&&creativeJs.includes('DOTS=')&&creativeJs.includes('INSTRUMENTS')&&creativeJs.includes('THEMES={'),'Creativity selectors and datasets were not expanded enough');
ok(creativeJs.includes('Drawing score')&&creativeJs.includes('shareActivity'),'Creativity scoring or sharing is missing');
const life=read('assets/life-skills.js'); ok((life.match(/\['/g)||[]).length>=12,'Life skills dataset too small'); ok(life.includes('Wrong answer. The correct answer is '),'Life skills spoken feedback missing');
const games=read('assets/games.js'); ['Alphabet matching','Memory cards','Sequence games'].forEach(name=>ok(games.includes(name),'Games dataset missing '+name));
const shell=read('assets/site-shell.js'); ok(shell.includes('Life Skills')&&shell.includes('Games'),'Kids shell missing new navigation labels');
if(fail.length){console.error(fail.join('\n'));process.exit(1)}
console.log(`v1.10.0 runtime/data checks passed: ${passed}/${checks} assertions.`);
