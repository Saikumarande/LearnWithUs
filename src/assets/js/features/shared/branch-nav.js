"use strict";
(()=>{
 const branches=window.LWU_BRANCH_ROUTE_DATA;
 if(!branches||!document.body||document.body.dataset.area!=='kids')return;
 const path=location.pathname.split('/').pop(),search=location.search||'',full=path+search+(location.hash||'');
 // Keep the Kids Corner landing page free of a branch bar.
 if(path==='children.html'&&!search)return;
 // This uses the existing branch URLs; a more specific query wins over the shared HTML path.
 let matches=[];
 Object.entries(branches).forEach(([name,steps])=>steps.forEach((step,index)=>{
   const src=step.href,exact=src===full,same=src.split('?')[0].split('#')[0]===path;
   if(exact||same&&!search&&!(location.hash||'')&&!src.includes('?')&&!src.includes('#'))matches.push({name,steps,index,exact});
 }));
 // No guessing for different topics that share a URL and differ by query.
 matches.sort((a,b)=>(Number(b.exact)-Number(a.exact)));
 if(!matches.length)return;
 const active=matches[0],main=document.querySelector('main');if(!main||document.querySelector('.branch-topic-strip'))return;
 const nav=document.createElement('nav');nav.className='branch-topic-strip';nav.setAttribute('aria-label','Topics in '+active.name+' learning branch');
 const title=document.createElement('div');title.className='branch-strip-heading';title.textContent=({english:'📚 English & Reading',maths:'🧮 Maths & Numbers',science:'🔬 Science & Discovery',world:'🌍 World & India',languages:'🗣️ Indian Languages',creative:'🎨 Stories, Sports & Creativity',life:'🌱 Life Skills',games:'🎮 Games & Challenges',support:'🧠 Learning Support & Parents'})[active.name]||'Explore this branch';
 nav.appendChild(title);
 const scroll=document.createElement('div');scroll.className='branch-strip-scroll';scroll.setAttribute('tabindex','0');scroll.setAttribute('role','group');scroll.setAttribute('aria-label','Scroll horizontally to explore all topics');
 active.steps.forEach((step,index)=>{
   const a=document.createElement('a');a.className='branch-strip-link';a.href=step.href;
   // Use DOM textContent (not innerHTML) to keep labels escaped and accessible.
   const label=document.createElement('span');label.textContent=step.code+' '+step.icon+' '+step.label;a.appendChild(label);
   if(index===active.index)a.setAttribute('aria-current','page');scroll.appendChild(a);
 });nav.appendChild(scroll);
 // Do not display two different topic strips above one learning page.
 for(const selector of ['.focused-topic-nav','.english-topic-nav','.subject-nav']){
  document.querySelectorAll(selector).forEach(node=>{node.hidden=true;node.setAttribute('aria-hidden','true')});
 }
 const intro=main.querySelector('.practice-head,.subject-intro,.studio-lead,.kids-intro,.page-intro,.topic-intro,h1');
 if(intro){const insertion=intro.closest('.practice-head,.subject-intro,.kids-intro,.page-intro,.topic-intro')||intro;
  if(insertion===main)main.prepend(nav);else insertion.insertAdjacentElement('afterend',nav);
 }else main.prepend(nav);
 const selected=scroll.querySelector('[aria-current="page"]');
 if(selected)requestAnimationFrame(()=>{scroll.scrollLeft=Math.max(0,selected.offsetLeft-scroll.offsetLeft-30)});
})();
