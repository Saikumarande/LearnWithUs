'use strict';
// Every URL remains exactly the same: organize editable sources, never rewrite HTML URLs.
const fs=require('node:fs');
const path=require('node:path');
const {checkManifest}=require('./site-manifest');
const {root,entries}=checkManifest();
const tempPublic=path.join(root,'.public-build-stage');
const tempDist=path.join(root,'.dist-build-stage');
const backupPublic=path.join(root,'.public-build-backup');
const backupDist=path.join(root,'.dist-build-backup');
const clean=p=>fs.rmSync(p,{recursive:true,force:true});
function stage() {
  clean(tempPublic);clean(tempDist);
  for(const entry of entries) {
    const dest=path.join(tempPublic,entry.urlPath);
    fs.mkdirSync(path.dirname(dest),{recursive:true});
    fs.copyFileSync(path.join(root,'src',entry.source),dest);
  }
  fs.cpSync(tempPublic,tempDist,{recursive:true});
}
function commit() {
  const destinations=[['public',tempPublic,backupPublic],['dist',tempDist,backupDist]];
  let complete=0;
  try {
    for(const [name,,backup] of destinations) {
      clean(backup);
      if(fs.existsSync(path.join(root,name)))fs.renameSync(path.join(root,name),backup);
    }
    for(const [name,tmp] of destinations) {
      fs.renameSync(tmp,path.join(root,name));complete++;
    }
    for(const [,,backup] of destinations)clean(backup);
  } catch(error) {
    for(const [name,,backup] of destinations) {
      const dest=path.join(root,name);
      if(fs.existsSync(backup)) {clean(dest);fs.renameSync(backup,dest);}
    }
    throw error;
  } finally {clean(tempPublic);clean(tempDist);}
}
try {stage();commit();console.log(`Built ${entries.length} unchanged served paths into public/ and dist/ from src/.`);}
catch(error){clean(tempPublic);clean(tempDist);console.error(error);process.exitCode=1;}
