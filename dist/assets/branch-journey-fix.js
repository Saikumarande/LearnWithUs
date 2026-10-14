'use strict';
(()=>{
 const routes=window.LWU_BRANCH_ROUTE_DATA;if(!routes)return;
 function update(){const path=location.pathname.split('/').pop();const here=new URL(location.href);const suffix=path+here.search+here.hash;
  let found=null;for(const [branch,steps] of Object.entries(routes))for(let i=0;i<steps.length;i++){
   const u=steps[i].href;
   if(u===suffix || (!here.search&&!here.hash && !u.includes('?')&&!u.includes('#')&&u===path)){
    if(!found||u===suffix)found={branch,steps,i,exact:u===suffix}
   }
  }
  if(!found)return;
  // Keep original quiz targets untouched: this modifies only navigation anchors.
  const actions=document.querySelector('.topic-quiz-journey .journey-actions');
  if(actions){const [prev,next]=[actions.querySelector('.journey-previous'),actions.querySelector('.journey-next')];if(prev&&found.i>0){const step=found.steps[found.i-1];prev.href=step.href;prev.textContent='← Previous: '+step.label} else if(prev)prev.hidden=true;
   if(next&&found.i<found.steps.length-1){const step=found.steps[found.i+1];next.href=step.href;next.textContent='Next: '+step.label+' →'}else if(next)next.hidden=true;
  }
  // The creativity activity is selected by hash, so also refresh on hashchange.
  if(found.branch==='creative'&&path==='creativity.html'){
   document.querySelectorAll('.branch-topic-strip .branch-strip-link').forEach((a,i)=>{if(i===found.i)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
   // Eliminate duplicate in-page topic lists while retaining the shared branch bar.
   document.querySelectorAll('nav.creative-subjects').forEach(n=>n.remove());
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update);else update();addEventListener('hashchange',update)
})();
