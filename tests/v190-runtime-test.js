'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const project=path.resolve(__dirname,'..'),pub=path.join(project,'public'),read=f=>fs.readFileSync(path.join(pub,f),'utf8');
let checks=0,passed=0;const fail=[];function ok(v,m){checks++;if(v)passed++;else fail.push(m)}
const storyCtx={window:{}};vm.runInNewContext(read('assets/story-data.js'),storyCtx);const stories=storyCtx.window.LEARNWITHUS_STORIES||[];
ok(stories.length===7,'Expected seven story categories');
const expectedCats=['Panchatantra-inspired','Tenali Raman','Akbar and Birbal','Moral story','Animal story','Science story','Bedtime story'];
expectedCats.forEach(c=>ok(stories.some(s=>s.category===c),'Missing story category '+c));
stories.forEach(story=>{
  ok(story.pages.length===4,story.id+' must have four pages');
  ok(story.vocab.length===4,story.id+' must have four vocabulary cards');
  ok(story.questions.length===3,story.id+' must have three comprehension questions');
  story.pages.forEach((_,i)=>ok(fs.existsSync(path.join(pub,'assets','story-art',story.id+'-'+(i+1)+'.svg')),story.id+' missing illustration '+(i+1)));
  story.questions.forEach((q,i)=>{ok(q[1].length===4,story.id+' question '+(i+1)+' should have four choices');ok(q[1].includes(q[2]),story.id+' question '+(i+1)+' answer missing from choices')});
});
const sportCtx={window:{}};vm.runInNewContext(read('assets/sports-data.js'),sportCtx);const sports=sportCtx.window.LEARNWITHUS_SPORTS||[];
ok(sports.length===12,'Expected 12 sports/games');ok(new Set(sports.map(s=>s.name)).size===12,'Sports names must be unique');
sports.forEach(s=>{ok(!!s.equipment&&!!s.players&&!!s.goal,s.name+' facts incomplete');ok(fs.existsSync(path.join(pub,s.image)),s.name+' local illustration missing')});
const creativity=read('creativity.html'),creativeJs=read('assets/creativity.js');
['drawingCanvas','colourPalette','dotsSvg','playRhythm','newDanceMove','buildStory','buildPoem','printActivity'].forEach(id=>ok(creativity.includes('id="'+id+'"'),'Creativity UI missing '+id));
['pointerdown','data-colourable','hitDot','AudioContext','window.print()'].forEach(token=>ok(creativeJs.includes(token),'Creativity behavior missing '+token));
const shell=read('assets/site-shell.js');['stories.html','story.html','sports.html','sports-quiz.html','creativity.html'].forEach(route=>ok(shell.includes("'"+route+"'"),'Shared shell missing '+route));
ok(shell.includes("current==='story.html'")&&shell.includes("selected='stories.html'"),'Story reader active navigation state missing');
const sw=read('service-worker.js');
stories.forEach(story=>story.pages.forEach((_,i)=>ok(sw.includes("'./assets/story-art/"+story.id+'-'+(i+1)+".svg'"),'Story art not precached')));
sports.forEach(s=>ok(sw.includes("'./"+s.image+"'"),'Sport art not precached'));
const kidsPages=fs.readdirSync(pub).filter(f=>f.endsWith('.html')&&read(f).includes('data-area="kids"'));
kidsPages.forEach(f=>ok(read(f).includes('assets/site-shell.js?v=20260926q'),f+' is not on current shared Kids shell'));
if(fail.length){console.error(fail.join('\n'));process.exit(1)}
console.log(`v1.9.0 runtime/data checks passed: ${passed}/${checks} assertions.`);
