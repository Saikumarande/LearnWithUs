'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const projectRoot=path.resolve(__dirname,'..'),root=path.join(projectRoot,'public');
const failures=[];let checks=0;
const walk=(dir,ext)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name),ext):(e.name.endsWith(ext)?[path.join(dir,e.name)]:[]));
const htmlFiles=walk(root,'.html');
const clean=s=>s.replace(/[?#].*$/,'');
for(const file of htmlFiles){
  const html=fs.readFileSync(file,'utf8'),rel=path.relative(root,file).replace(/\\/g,'/');
  const baseMatch=html.match(/<base\s+href=["']([^"']+)["']/i);
  const baseDir=baseMatch?path.resolve(path.dirname(file),baseMatch[1]):path.dirname(file);
  const refs=[...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map(m=>m[1]);
  for(const ref of refs){
    if(baseMatch&&ref===baseMatch[1])continue;
    if(!ref||ref.startsWith('#')||/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(ref))continue;
    const local=clean(ref);if(!local)continue;
    const target=path.resolve(baseDir,local);checks++;
    if(!target.startsWith(root+path.sep)&&target!==root)failures.push(`${rel}: escapes public root: ${ref}`);
    else if(!fs.existsSync(target))failures.push(`${rel}: missing ${ref}`);
  }
}
const scripts=[...walk(path.join(root,'assets'),'.js'),path.join(projectRoot,'server.js'),path.join(root,'service-worker.js')];
for(const script of scripts){checks++;try{new vm.Script(fs.readFileSync(script,'utf8'),{filename:script});}catch(e){failures.push(`${path.relative(root,script)}: ${e.message}`)}}
for(const [base,json] of [[projectRoot,'package.json'],[projectRoot,'route-map.json'],[root,'manifest.webmanifest']]){checks++;try{JSON.parse(fs.readFileSync(path.join(base,json),'utf8'));}catch(e){failures.push(`${json}: ${e.message}`)}}
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log(`Link and syntax checks passed: ${checks}/${checks} assertions across ${htmlFiles.length} HTML pages and ${scripts.length} JavaScript files.`);
