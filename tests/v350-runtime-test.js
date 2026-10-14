'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const R=path.resolve(__dirname,'..'),P=path.join(R,'public');const rd=n=>fs.readFileSync(path.join(P,n),'utf8');let count=0;const ok=(c,m)=>{count++;assert.ok(c,m)};
const pages=[];function walk(dir){for(const x of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,x.name);if(x.isDirectory())walk(f);else if(f.endsWith('.html'))pages.push(f)}}walk(P);
const branch=JSON.parse(rd('assets/branch-nav-data.js').slice(rd('assets/branch-nav-data.js').indexOf('=')+1).trim().replace(/;$/,''));
ok(pages.length===267,'HTML count changed unexpectedly: '+pages.length);
ok(Object.keys(branch).length===9,'Expected stable nine roadmap branches');ok(branch.english.length===17,'English E1-E17 missing');ok(branch.maths.length===21,'Maths 21 missing');ok(branch.science.length===15,'Science 15 missing');ok(branch.world.length===7,'World 7 missing');ok(branch.support.length===18,'Support 18 missing');
const kids=rd('learn/kids/children.html');ok((kids.match(/class="roadmap-step roadmap-stop core-roadmap-step"/g)||[]).length===18,'Core Journey changed');
for(const p of pages){const s=fs.readFileSync(p,'utf8'),name=path.relative(P,p).replace(/\\/g,'/');if(s.includes('class="fl-header"')&&name.startsWith('learn/kids/')||s.includes('class="fl-header"')&&name.startsWith('quiz/')){
 ok(s.includes('assets/branch-layout.css'),'Missing shared visual CSS '+name);
 if(name.startsWith('learn/kids/'))ok(s.includes('assets/branch-nav.js')&&s.includes('assets/branch-nav-data.js'),'Missing branch navigation script '+name);
 }}
for(const hub of ['smart-learning','parent-dashboard','coding-lab','learner-profiles','learning-tools','everyday-explorer','world-explorer']){
 const s=rd('learn/kids/'+hub+'.html');ok(s.includes('assets/focused-topics.css'),'Missing hub grid CSS '+hub);ok(s.includes('assets/branch-layout.css'),'Missing standardized hub CSS '+hub);ok(s.includes('assets/topic-hub.js')||s.includes('assets/world-hub.js'),'Missing dynamic hub source '+hub);
}
for(const topic of ['dictionary','listening','conversation','helpers','transport','situations']){ok(kids.includes('href="'+topic+'-lesson.html"'),'Roadmap should go straight to separate '+topic+' lesson');ok(fs.existsSync(path.join(P,'learn/kids/'+topic+'-lesson.html')),'Missing dedicated lesson '+topic)}
for(const [group,steps] of Object.entries(branch))for(const x of steps){ok(/^[A-Z]+\d+$/.test(x.code),'Broken stable code '+x.code);ok(!x.href.startsWith('http'),'External branch step '+group);ok(x.label.length>1,'Empty branch label');}
const css=rd('assets/branch-layout.css');ok(css.includes('.focused-hub{display:grid!important'),'Hub cards must not turn into unstyled inline links');ok(css.includes('repeat(3,minmax(0,1fr))'),'Desktop hub grid missing');ok(css.includes('repeat(2,minmax(0,1fr))'),'Tablet hub grid missing');ok(css.includes('grid-template-columns:1fr'),'Mobile hub grid missing');ok(css.includes('.branch-strip-scroll{display:flex!important'),'One-row branch strip missing');ok(css.includes('overflow-x:auto'),'Keyboard-accessible horizontal nav missing');ok(css.includes('[aria-current=page]'),'Active state missing');
for(const x of ['branch-layout.css?v=20261014d','branch-nav-data.js?v=20261014d','branch-nav.js?v=20261014d'])ok(rd('service-worker.js').includes('./assets/'+x),'New asset not cached '+x);
const dirs=['public','dist'];const list=dir=>{const out=[];(function go(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){const f=path.join(p,e.name);if(e.isDirectory())go(f);else out.push(path.relative(path.join(R,dir),f))}})(path.join(R,dir));return out.sort()};const a=list('public'),b=list('dist');ok(JSON.stringify(a)===JSON.stringify(b),'public/dist file list different');for(const p of a)ok(fs.readFileSync(path.join(R,'public',p)).equals(fs.readFileSync(path.join(R,'dist',p))),'public/dist mismatch: '+p);
console.log(`v3.10.0 source visual-contract audit passed: ${count}/${count} assertions across ${pages.length} HTML pages, ${a.length} production files and nine branches.`);
