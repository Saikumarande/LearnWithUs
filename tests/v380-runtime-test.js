'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),pub=path.join(root,'public'),dist=path.join(root,'dist');let count=0;const failures=[];
const check=(ok,label)=>{count++;if(!ok)failures.push(label)};const read=x=>fs.readFileSync(path.join(pub,x),'utf8');
check(fs.readFileSync(path.join(root,'VERSION'),'utf8').trim()==='3.10.0','release VERSION');
check(JSON.parse(fs.readFileSync(path.join(root,'package.json'))).version==='3.10.0','package version');
check(read('service-worker.js').includes("CACHE='learnwithus-v3.10.0'"),'PWA cache');
const nav=read('assets/kids-nav-upgrade.js'),style=read('assets/kids-nav-upgrade.css');
check(!nav.includes('class="lwu-category-home"'),'removed obsolete Kids Corner top link');
check(nav.includes('lwuCategorySearch')&&nav.includes('lwuCategoryToggle'),'category search and expand');
check(style.includes('display:block!important')&&style.includes('fl-section-nav:not(.lwu-category-nav)'),'inherited flex and old quick-nav hidden');
const core=read('assets/branch-nav-data.js');check(['english','maths','languages','science','world','creative','life','games','support'].every(k=>core.includes('"'+k+'":')),'all nine branch names');
const dashboard=read('assets/dashboard-quiz-certificates.js');check(dashboard.includes('window.learnWithUsScoreCardSvg'),'dashboard reuses shared score-card SVG');check(!dashboard.includes('Review or try again'),'dashboard uses Try again only');
check(read('account/dashboard.html').includes('score-card.js?v=20261014e'),'dashboard loads shared score card');
const planets=read('assets/planets.js');check(planets.includes('anim.pause()')&&planets.includes('anim.play()')&&planets.includes('solarMotionStatus'),'explicit planet play/pause and visible feedback');
const flags=read('assets/world-flags-select.js');check(flags.includes('country-flag-image')&&flags.includes('country-flag-hero')&&flags.includes('assets/country-flags/'),'World Flag learning uses local imagery');check(read('assets/flag-quiz-images.js').includes('isoOf')&&read('assets/flag-quiz-images.js').includes('subject-quiz-panel h2'),'World Flag quiz images');
for(const iso of 'in jp cn kr fr gb de it br ar ca us mx eg za ke au nz'.split(' ')){
 const f=path.join(pub,'assets/flags',iso+'.png');check(fs.existsSync(f)&&fs.readFileSync(f).subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')),'valid PNG flag '+iso);
 check(read('service-worker.js').includes('./assets/flags/'+iso+'.png'),'offline flag '+iso);
}
check(read('assets/world-learning.css').includes('.country-explorer .country-selected'),'country colours');
const walk=(dir)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)).map(x=>e.name+'/'+x):[e.name]);
const pubFiles=walk(pub).sort(),distFiles=walk(dist).sort();check(JSON.stringify(pubFiles)===JSON.stringify(distFiles),'public/dist file names match');
for(const f of pubFiles)check(crypto.createHash('sha256').update(fs.readFileSync(path.join(pub,f))).digest('hex')===crypto.createHash('sha256').update(fs.readFileSync(path.join(dist,f))).digest('hex'),'public/dist content '+f);
if(failures.length){console.error(failures.join('\n'));process.exit(1)}console.log(`v3.10.0 navigation/certificates/flags/animation regression passed ${count}/${count} assertions across ${pubFiles.length} production files`);
