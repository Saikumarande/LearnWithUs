'use strict';
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const publicDir=path.join(root,'public');
const port=19000+Math.floor(Math.random()*700);
const child=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const pages=walk(publicDir).filter(f=>f.endsWith('.html')).map(f=>'/'+path.relative(publicDir,f).split(path.sep).join('/')).sort();
let passed=0;
(async()=>{
  try{
    let ready=false;
    for(let i=0;i<40;i++){try{const r=await fetch(`http://127.0.0.1:${port}/`);if(r.ok){ready=true;break;}}catch{}await wait(100);}
    if(!ready)throw new Error('Server did not become ready for live HTML crawl.');
    for(const url of pages){
      const r=await fetch(`http://127.0.0.1:${port}${url}`,{redirect:'manual'});
      if(r.status!==200)throw new Error(`${url}: expected HTTP 200, got ${r.status}`); passed++;
      const ct=r.headers.get('content-type')||'';
      if(!ct.includes('text/html'))throw new Error(`${url}: expected text/html, got ${ct}`); passed++;
      const body=await r.text();
      if(!/<!doctype html>|<html[\s>]/i.test(body))throw new Error(`${url}: response is not an HTML document`); passed++;
    }
    console.log(`Live HTML route crawl passed: ${passed}/${pages.length*3} assertions across ${pages.length} HTML routes.`);
  } finally { child.kill('SIGTERM'); }
})().catch(e=>{console.error(e.message);process.exitCode=1;});
