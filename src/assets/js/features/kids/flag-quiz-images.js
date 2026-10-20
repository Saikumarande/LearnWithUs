"use strict";
(()=>{
 const scope=document.body.dataset.focusTopic;if(scope!=='flags'&&scope!=='geography')return;
 const root=document.getElementById('subjectRoot');if(!root)return;
 const emoji=/[\u{1F1E6}-\u{1F1FF}]{2}/gu;
 const isoOf=s=>{const cp=Array.from(s).map(c=>c.codePointAt(0));return cp.length===2?cp.map(n=>String.fromCharCode(n-0x1F1E6+97)).join(''):null};
 const image=(iso,alt)=>{const img=document.createElement('img');img.className='country-flag-image';img.alt=alt;img.src='assets/country-flags/'+iso+'.png';img.decoding='async';return img};
 function enhance(){
  root.querySelectorAll('.subject-quiz-panel h2').forEach(h=>{
    if(h.dataset.flagEnhanced)return;h.dataset.flagEnhanced='true';
    const value=h.textContent||'';const matches=[...value.matchAll(emoji)];if(!matches.length)return;
    const fragment=document.createDocumentFragment();let offset=0;
    matches.forEach(m=>{fragment.append(document.createTextNode(value.slice(offset,m.index)));const iso=isoOf(m[0]);
      if(iso)fragment.append(image(iso,'Flag to identify'));else fragment.append(document.createTextNode(m[0]));offset=m.index+m[0].length});
    fragment.append(document.createTextNode(value.slice(offset)));h.replaceChildren(fragment);
  });
  root.querySelectorAll('.focused-choice').forEach(button=>{
    if(button.dataset.flagEnhanced)return;button.dataset.flagEnhanced='true';
    const original=button.dataset.answer||button.textContent.trim();const found=original.match(emoji);
    if(!found||found[0]!==original.trim())return;
    const iso=isoOf(found[0]);if(!iso)return;
    button.replaceChildren(image(iso,'Flag choice'),document.createTextNode(original));
  });
 }
 new MutationObserver(enhance).observe(root,{childList:true,subtree:true});enhance();
})();
