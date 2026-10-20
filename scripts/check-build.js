'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {checkManifest,filesIn}=require('./site-manifest');
const {root,entries}=checkManifest();
const expected=entries.map(x=>x.urlPath).sort();
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
let checked=0;
for(const output of ['public','dist']) {
  const found=filesIn(path.join(root,output));
  if(JSON.stringify(expected)!==JSON.stringify(found))throw Error(`Unexpected/missing generated files in ${output}: ${found.length} vs ${expected.length}`);
  for(const {source,urlPath} of entries) {
    const a=hash(path.join(root,'src',source));
    const b=hash(path.join(root,output,urlPath));
    if(a!==b)throw Error(`Generated output does not match editable source: ${output}/${urlPath}`);
    checked++;
  }
}
console.log(`Build parity passed: ${checked}/${checked} generated files match src byte-for-byte; ${entries.length} preserved URLs.`);
