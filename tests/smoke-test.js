'use strict';
const fs=require('node:fs'),path=require('node:path');
const projectRoot=path.resolve(__dirname,'..'),root=path.join(projectRoot,'public');
const routeMap=JSON.parse(fs.readFileSync(path.join(projectRoot,'route-map.json'),'utf8'));
let checks=0;const verify=(v,m)=>{checks++;if(!v)throw new Error(m)};
verify(fs.existsSync(path.join(root,'index.html')),'Missing root index.html');
for(const [legacy,canonical] of Object.entries(routeMap)){
  const legacyPath=path.join(root,legacy),canonicalPath=path.join(root,canonical);
  verify(fs.existsSync(legacyPath),'Missing compatibility route '+legacy);
  verify(fs.existsSync(canonicalPath),'Missing canonical page '+canonical);
  const full=fs.readFileSync(canonicalPath,'utf8');
  if(!['system/offline.html','learn/kids/languages.html'].includes(canonical))verify(full.includes('assets/site-shell.js'),'Canonical page does not load shared shell: '+canonical);
  const stub=fs.readFileSync(legacyPath,'utf8'); verify(stub.includes('location.replace'),'Legacy route is not a compatibility redirect: '+legacy);
}
for(const file of ['server.js','package.json','VERSION','route-map.json','docs/ROUTES.md'])verify(fs.existsSync(path.join(projectRoot,file)),'Missing '+file);
console.log(`Smoke tests passed: ${checks}/${checks} assertions across ${Object.keys(routeMap).length} canonical routes plus compatibility redirects.`);
