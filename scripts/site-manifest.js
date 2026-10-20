'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const entries = require('../config/site-files.json').files;
function filesIn(folder) {
  if (!fs.existsSync(folder)) return [];
  const result = [];
  function walk(dir) {
    for (const item of fs.readdirSync(dir,{withFileTypes:true})) {
      const full=path.join(dir,item.name);
      if (item.isSymbolicLink()) throw Error('Symlinks are not allowed in the site source: '+full);
      if (item.isDirectory()) walk(full);
      else if (item.isFile()) result.push(path.relative(folder,full).split(path.sep).join('/'));
    }
  }
  walk(folder);
  return result.sort();
}
function checkManifest() {
  const actual=filesIn(path.join(root,'src'));
  const seenSources=new Set(),seenOutputs=new Set();
  for(const e of entries) {
    if(typeof e.source!=='string'||typeof e.urlPath!=='string')throw Error('Invalid site-files.json entry');
    for(const name of [e.source,e.urlPath]) {
      if(!name||name.startsWith('/')||name.includes('\\')||name.split('/').some(x=>!x||x==='.'||x==='..'))throw Error('Unsafe manifest path '+name);
    }
    if(seenSources.has(e.source))throw Error('Duplicate source file '+e.source);
    if(seenOutputs.has(e.urlPath))throw Error('Duplicate served URL '+e.urlPath);
    seenSources.add(e.source);seenOutputs.add(e.urlPath);
    if(!fs.statSync(path.join(root,'src',e.source),{throwIfNoEntry:false})?.isFile())throw Error('Source file missing: '+e.source);
  }
  if(seenSources.size!==actual.length||actual.some(f=>!seenSources.has(f))) {
    throw Error('src/ contains unmapped files. Register all new pages or assets in config/site-files.json. Extra files: '+actual.filter(f=>!seenSources.has(f)).join(', '));
  }
  return {root,entries,filesIn};
}
module.exports={root,entries,filesIn,checkManifest};
