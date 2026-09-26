'use strict';

const {spawn}=require('node:child_process');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const port=18080+Math.floor(Math.random()*1000);
const child=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

(async()=>{
  try{
    for(let i=0;i<30;i++){try{const response=await fetch(`http://127.0.0.1:${port}/`);if(response.ok)break;}catch{}await wait(100);}
    const checks=[
      ['/',200,'text/html'],['/children.html?mode=letters',200,'text/html'],['/hindi.html',200,'text/html'],['/telugu.html',200,'text/html'],['/dashboard.html',200,'text/html'],['/manifest.webmanifest',200,'application/manifest+json'],['/service-worker.js',200,'text/javascript'],['/robots.txt',200,'text/plain'],['/sitemap.xml',200,'application/xml'],['/missing-learning-page',404,'text/html'],['/package.json',404,'text/html'],['/README.md',404,'text/html'],['/tests/smoke-test.js',404,'text/html']
    ];
    for(const [url,status,type] of checks){const response=await fetch(`http://127.0.0.1:${port}${url}`);if(response.status!==status)throw new Error(`${url}: expected ${status}, received ${response.status}`);if(!response.headers.get('content-type')?.includes(type))throw new Error(`${url}: expected ${type}, received ${response.headers.get('content-type')}`);}
    console.log(`Server route checks passed for ${checks.length} URLs, MIME types and custom 404.`);
  }finally{child.kill('SIGTERM');}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
