"use strict";
(()=>{
 const root=document.querySelector('[data-focus-topic="flags"]');if(!root)return;
 const codes=window.LWU_COUNTRY_FLAG_CODES||{};
 const flagFor=item=>{const img=document.createElement('img');img.className='country-flag-image';img.alt='Flag of '+item.country;img.src='assets/country-flags/'+codes[item.country]+'.png';img.loading='lazy';return img};
 function createExplorer(){
  const list=root.querySelector('#flagList');if(!list||list.dataset.enhanced)return;
  const countries=window.LEARNWITHUS_COUNTRIES||[];
  if(!countries.length)return;
  list.dataset.enhanced='true';list.hidden=true;
  const panel=document.createElement('div');panel.className='flag-explorer';const menu=document.createElement('div');menu.className='flag-menu';menu.setAttribute('aria-label','Select a country');const selected=document.createElement('article');selected.className='flag-detail';selected.setAttribute('aria-live','polite');panel.append(menu,selected);list.before(panel);let chosen=countries[0];
  const search=root.querySelector('#flagSearch');
  function render(){
   const q=(search?.value||'').trim().toLowerCase();const matches=countries.filter(c=>[c.country,c.region,c.capital].join(' ').toLowerCase().includes(q));
   menu.replaceChildren();if(matches.length&&!matches.includes(chosen))chosen=matches[0];
   matches.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='flag-choice'+(c===chosen?' selected':'');b.setAttribute('aria-pressed',String(c===chosen));b.append(flagFor(c),document.createTextNode(' '+c.country));b.onclick=()=>{chosen=c;render()};menu.append(b)});
   selected.replaceChildren();if(!matches.length){selected.textContent='No matching flags.';return}
   const image=flagFor(chosen);image.classList.add('country-flag-hero');image.loading='eager';const h=document.createElement('h3');h.textContent=chosen.country;const p=document.createElement('p');p.textContent='Capital: '+chosen.capital+' · '+chosen.region;selected.append(image,h,p);
  }
  search?.addEventListener('input',render);render();
 }
 function practiceFlags(){
  const wrapper=root.parentElement?.querySelector('#focusedQuestion');if(!wrapper)return;
  wrapper.querySelectorAll('.focused-choice').forEach(b=>{
   if(b.dataset.flagEnhanced)return;const value=(b.dataset.answer||b.textContent).trim();
   // Flag options use emoji as the answer key, but show reliable image artwork.
   const matched=Object.keys(codes).find(name=>{const iso=codes[name].toUpperCase();return [...iso].map(ch=>String.fromCodePoint(127397+ch.charCodeAt(0))).join('')===value});
   if(!matched)return;
   b.dataset.flagEnhanced='true';b.textContent='';b.append(flagFor({country:matched}));
  });
 }
 const init=()=>{createExplorer();practiceFlags();const target=root.parentElement?.querySelector('#focusedQuestion');if(target)new MutationObserver(practiceFlags).observe(target,{childList:true,subtree:true})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
