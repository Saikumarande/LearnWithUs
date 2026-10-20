"use strict";
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const R=path.resolve(__dirname,'../../..'),P=path.join(R,'public'),D=path.join(R,'dist');let checked=0,fail=[];
const check=(ok,label)=>{checked++;if(!ok)fail.push(label)};
const read=p=>fs.readFileSync(path.join(P,p),'utf8');
const codes=JSON.parse(read('assets/country-flag-codes.js').split('=',2)[1].trim().replace(/;$/,''));
const countries=JSON.parse(read('assets/world-data.js').split('=',2)[1].trim().replace(/;$/,''));
check(countries.length===48,'original 48 Countries & Capitals are preserved');check(Object.keys(codes).length===48,'all 48 country to ISO mappings');
const seen=new Set();
for(const c of countries){const iso=codes[c.country];const file=path.join(P,'assets/country-flags',iso+'.png');check(/^[a-z]{2}$/.test(iso||'')&&fs.existsSync(file),'country has local flag '+c.country);if(fs.existsSync(file)){const b=fs.readFileSync(file);seen.add(crypto.createHash('sha256').update(b).digest('hex'));check(b.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex'))&&b.length>300,'valid flag PNG '+iso);check(read('service-worker.js').includes('./assets/country-flags/'+iso+'.png'),'flag offline '+iso);}}
check(seen.size===48,'every country has visually distinct flag artwork');
for(const [p,asset] of [['learn/kids/countries-capitals.html','countries.js'],['learn/kids/flags-lesson.html','world-flags-select.js']]){const h=read(p);check(h.includes('country-flag-codes.js')&&h.includes(asset)&&h.includes('flag-images.css'),'page loads flag data+styles '+p)}
const nav=read('assets/kids-nav-upgrade.css');check(nav.includes('position:sticky!important')&&nav.includes('top:var(--fl-header-height'),'sticky branch toolbar follows header');check(nav.includes('height:34px'),'compact collapsed toolbar');
const planets=read('assets/planets.js');check(planets.includes('orbit.animate(')&&planets.includes('anim.pause()')&&planets.includes('anim.play()'),'native planet controller can pause & resume');
check(read('assets/platform.css').includes('#lwQuizCertificates .lw-quiz-cert-actions'),'certificate pair uses scoped grid styling');
check(JSON.parse(fs.readFileSync(path.join(R,'package.json'))).version==='4.0.0'&&fs.readFileSync(path.join(R,'VERSION'),'utf8').trim()==='4.0.0','version synchronized');
check(read('service-worker.js').includes("CACHE='learnwithus-v4.0.0'"),'cache upgraded');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name)).map(t=>x.name+'/'+t):[x.name]);const a=walk(P).sort(),b=walk(D).sort();check(JSON.stringify(a)===JSON.stringify(b),'all public and dist file lists match');for(const f of a){check(crypto.createHash('sha256').update(fs.readFileSync(path.join(P,f))).digest('hex')===crypto.createHash('sha256').update(fs.readFileSync(path.join(D,f))).digest('hex'),'distribution parity '+f)}
if(fail.length){console.error(fail.join('\n'));process.exit(1)}console.log('v4.0.0 targeted release checks passed '+checked+'/'+checked+' assertions; '+a.length+' production files and 48 source-matched country flags');
