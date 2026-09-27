'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),pub=path.join(root,'public');
const routeMap=JSON.parse(fs.readFileSync(path.join(root,'route-map.json'),'utf8'));
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):(e.name.endsWith('.html')?[path.join(d,e.name)]:[]));
let checks=0;const failures=[];const ok=(v,m)=>{checks++;if(!v)failures.push(m)};
const files=walk(pub);
for(const file of files){
  const rel=path.relative(pub,file).replace(/\\/g,'/'),html=fs.readFileSync(file,'utf8');
  ok(/<!doctype html>/i.test(html),rel+' missing doctype');
  ok(/<html\b[^>]*lang=/i.test(html),rel+' missing html lang');
  ok(/<head\b/i.test(html)&&/<\/head>/i.test(html)&&/<body\b/i.test(html)&&/<\/body>/i.test(html),rel+' missing basic head/body structure');
  const ids=[...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(m=>m[1]),dups=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];
  ok(dups.length===0,rel+' duplicate IDs: '+dups.join(', '));
  ok(!/https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?/i.test(html),rel+' contains a localhost URL');
  ok(!/learnwithus-[a-z0-9-]+\.centralindia-01\.azurewebsites\.net/i.test(html),rel+' contains a deployment-specific Azure URL');
}
for(const [legacy,canonical] of Object.entries(routeMap)){
  const rootFile=path.join(pub,legacy),canonicalFile=path.join(pub,canonical);
  ok(fs.existsSync(rootFile),legacy+' compatibility page missing');
  ok(fs.existsSync(canonicalFile),canonical+' canonical page missing');
  const stub=fs.readFileSync(rootFile,'utf8');
  ok(stub.length<1500&&stub.includes('location.search+location.hash'),legacy+' is not a small query/hash-preserving compatibility redirect');
}
ok(fs.existsSync(path.join(pub,'index.html')),'Root index.html missing');
ok(files.length===103,'Unexpected HTML page count; expected 103, got '+files.length);
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log(`HTML structure/folder audit passed: ${checks}/${checks} assertions across ${files.length} HTML pages and ${Object.keys(routeMap).length} legacy→canonical routes.`);
