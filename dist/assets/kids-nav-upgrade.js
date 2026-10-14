'use strict';
(()=>{
 const branches=window.LWU_BRANCH_ROUTE_DATA;
 if(!branches||document.body.dataset.area!=='kids')return;
 const nav=document.querySelector('.fl-kids-quick-nav');if(!nav)return;
 const labels={english:['📚','English & Reading','From letters to reading and speaking'],maths:['🧮','Maths & Numbers','Numbers and maths activities'],languages:['🗣️','Languages','Hindi and Telugu'],science:['🔬','Science & Discovery','Body, weather, nature and experiments'],world:['🌍','World & India','Maps, countries, flags and currencies'],creative:['🎨','Stories, Sports & Creativity','Stories, sports and creative activities'],life:['🌱','Life Skills','Everyday skills and safety'],games:['🧠','Games & Challenges','Games, quizzes and coding'],support:['🧭','Learning Support & Parents','Progress, revision, certificates and tools']};
 nav.innerHTML='';nav.classList.add('lwu-category-nav');nav.classList.remove('is-scroll-hidden');
 const shell=document.createElement('div');shell.className='fl-container lwu-category-shell';
 const start=document.createElement('div');start.className='lwu-category-toolbar';start.innerHTML='<span class="lwu-category-toolbar-title" aria-label="Learning categories">📚 Explore learning topics</span><label class="lwu-category-search-label">🔎 <input type="search" id="lwuCategorySearch" placeholder="Search topics" aria-label="Search all learning topics" autocomplete="off"></label><button type="button" id="lwuCategoryToggle" aria-expanded="false" aria-controls="lwuCategoryPanel">Expand to view more ↓</button>';
 const panel=document.createElement('div');panel.id='lwuCategoryPanel';panel.className='lwu-category-panel';panel.hidden=true;
 const results=document.createElement('div');results.id='lwuCategoryResults';results.className='lwu-category-results';results.hidden=true;results.setAttribute('aria-label','Search results');
 Object.entries(branches).forEach(([key,steps])=>{
  const entry=document.createElement('details');entry.className='lwu-category-entry';
  const heading=document.createElement('summary');heading.innerHTML='<span class="lwu-category-icon">'+labels[key][0]+'</span><span class="lwu-category-heading"><strong>'+labels[key][1]+'</strong><small>'+labels[key][2]+'</small></span><span class="lwu-category-count">'+(steps.filter(step=>{try{return Object.keys(window.LearnWithUs?.getState?.()?.visited||{}).some(url=>url.includes(step.href.split('?')[0].split('#')[0]))}catch{return false}}).length)+'/'+steps.length+'</span>';entry.append(heading);
  const links=document.createElement('div');links.className='lwu-category-steps';steps.forEach(step=>{const a=document.createElement('a');a.href=step.href;a.textContent=step.code+' '+step.icon+' '+step.label;links.append(a)});entry.append(links);panel.append(entry)
 });
 shell.append(start,results,panel);nav.append(shell);
 const button=start.querySelector('button'),input=start.querySelector('input');
 function open(value){panel.hidden=!value;button.setAttribute('aria-expanded',String(value));button.textContent=value?'Collapse categories ↑':'Expand to view more ↓';nav.classList.toggle('lwu-menu-open',value);if(value){nav.classList.remove('is-scroll-hidden');panel.scrollTop=0}}
 button.addEventListener('click',()=>open(panel.hidden));
 input.addEventListener('input',()=>{const q=input.value.trim().toLocaleLowerCase();results.replaceChildren();if(!q){results.hidden=true;return}const matched=[];for(const [key,steps] of Object.entries(branches)){for(const step of steps)if((step.label+' '+step.code+' '+labels[key][1]).toLocaleLowerCase().includes(q))matched.push(step)}for(const step of matched.slice(0,40)){const a=document.createElement('a');a.href=step.href;a.textContent=step.code+' '+step.icon+' '+step.label;results.append(a)}if(!matched.length)results.textContent='No topics found.';results.hidden=false;open(false)});
 // Use vertical mouse wheel as horizontal strip movement when the strip can scroll.
 const wireStrip=strip=>{if(strip.dataset.wheelEnabled)return;strip.dataset.wheelEnabled='true';strip.addEventListener('wheel',event=>{if(!strip.matches(':hover'))return;if(strip.scrollWidth<=strip.clientWidth+2)return;const motion=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;
  // Let the user scroll vertically when the strip has reached an end.
  if(motion<0&&strip.scrollLeft<=0||motion>0&&strip.scrollLeft>=strip.scrollWidth-strip.clientWidth-1)return;
  event.preventDefault();strip.scrollLeft+=motion;
 },{passive:false})};
 const refresh=()=>document.querySelectorAll('.branch-strip-scroll,.creative-subject-row,.focused-topic-nav,.english-topic-nav').forEach(wireStrip);
 refresh();new MutationObserver(refresh).observe(document.body,{childList:true,subtree:true});
})();
