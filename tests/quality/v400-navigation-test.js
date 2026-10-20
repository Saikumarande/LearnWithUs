'use strict';
/* v4.0.0: validates every static hyperlink and asset reference using the browser's
 * effective <base> URL, canonicalizes legacy redirects, then validates #fragment IDs.
 * Requires Node only. Also prevents reintroduction of the 102 broken skip links.
 */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),pub=path.join(root,'public');
const aliases=JSON.parse(fs.readFileSync(path.join(root,'route-map.json'),'utf8'));
const pages=[];function walk(d){for(const x of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,x.name);if(x.isDirectory())walk(f);else if(x.isFile()&&f.endsWith('.html'))pages.push(f)}}walk(pub);
const rel=f=>path.relative(pub,f).replace(/\\/g,'/');
const attrs=(s,k)=>[...s.matchAll(new RegExp('(?:\\s|<)'+k+'\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\')','gi'))].map(x=>x[1]??x[2]);
const decode=x=>x.replace(/&amp;/g,'&').replace(/&#(?:35|x23);/gi,'#').replace(/&quot;/g,'"');
const map=new Map(),idSet=new Map();
for(const f of pages){const html=fs.readFileSync(f,'utf8'),name=rel(f);map.set(name,html);idSet.set(name,new Set([...attrs(html,'id'),...attrs(html,'name')]))}
const fail=[],counts={pages:pages.length,hyperlinks:0,localHyperlinks:0,staticUrlAttributes:0,internalReferences:0,externalReferences:0,legacyLinks:0,fragmentLinks:0,missingLocalTargets:0,missingFragments:0,misbasedSamePageFragments:0};
const allTargets=new Set();
for(const [name,html] of map){
 const firstBase=html.match(/<base\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/i);
 const pageUrl='https://learnwithus.invalid/'+name,base=new URL(firstBase?decode(firstBase[1]):pageUrl,pageUrl);
 for(const tag of html.match(/<[a-zA-Z][^>]*>/g)||[]){
   const tagName=tag.match(/^<([a-zA-Z][\w-]*)/)?.[1]?.toLowerCase()||'';
   for(const k of ['href','src','poster','action'])for(const attr of attrs(tag,k)){
     const raw=decode(attr);if(!raw)continue;
     counts.staticUrlAttributes++;
     if(tagName==='a'&&k==='href')counts.hyperlinks++;
     if(firstBase&&tagName==='base'&&k==='href')continue;
     let u;try{u=new URL(raw,base)}catch{continue}
     if(!['https:','http:'].includes(u.protocol))continue;
     if(u.hostname!=='learnwithus.invalid'){counts.externalReferences++;continue}
     counts.internalReferences++;
     if(tagName==='a'&&k==='href')counts.localHyperlinks++;
     let target=decodeURIComponent(u.pathname).replace(/^\//,'')||'index.html';
     if(!fs.statSync(path.join(pub,target),{throwIfNoEntry:false})?.isFile()){
       counts.missingLocalTargets++;fail.push(`${name}: missing ${target} from ${raw}`);continue;
     }
     if(tagName==='a'&&k==='href')allTargets.add(target);
     if(aliases[target]){counts.legacyLinks++;target=aliases[target]}
     if(u.hash&&target.endsWith('.html')){
       counts.fragmentLinks++;
       const fragment=decodeURIComponent(u.hash.slice(1));
       if(!idSet.get(target)?.has(fragment)){
         counts.missingFragments++;fail.push(`${name}: #${fragment} missing on ${target}, from ${raw}`)
       }
     }
     if(raw.startsWith('#')&&target!==name){
       counts.misbasedSamePageFragments++;fail.push(`${name}: local fragment ${raw} resolves to ${target}`);
     }
   }
 }
}
counts.uniqueHyperlinkDestinations=allTargets.size;
if(pages.length!==446)fail.push('Unexpected HTML count; previously 446, now '+pages.length);
const out={version:'4.0.0',counts,failures:fail.slice(0,100),failureCount:fail.length,explanation:'Static HTML references and fragments resolved using <base>; includes redirect aliases. JavaScript-generated links and external reachability are separate checks.'};
fs.mkdirSync(path.join(root,'docs'),{recursive:true});
fs.writeFileSync(path.join(root,'docs','V400-NAVIGATION-RESULTS.json'),JSON.stringify(out,null,2)+'\n');
if(fail.length){console.error(fail.slice(0,40).join('\n'));console.error('v4 navigation FAIL:',JSON.stringify(counts));process.exitCode=1}
else console.log(`v4 navigation PASS: ${counts.hyperlinks} static hyperlinks, ${counts.localHyperlinks} local hyperlinks, ${counts.internalReferences} local HTML references, ${counts.fragmentLinks} fragments, ${counts.legacyLinks} legacy redirects across ${pages.length} pages, 0 missing targets.`)
