"use strict";
(()=>{
  const coreSteps=[...document.querySelectorAll('.core-roadmap-step')];
  const journeyCards=[...document.querySelectorAll('.journey-card')];
  if(!coreSteps.length&&!journeyCards.length)return;

  const getRouteKey=el=>{
    const href=el.href||el.getAttribute('href')||el.dataset.roadmapUrl||'';
    const target=new URL(href,document.baseURI||location.href);
    return (target.pathname.split('/').pop()||'index.html')+target.search+target.hash;
  };
  const loadVisited=()=>{
    try{
      const state=JSON.parse(localStorage.getItem('learnwithus.platform.v1')||'{}')||{};
      return state.visited&&typeof state.visited==='object'&&!Array.isArray(state.visited)?state.visited:{};
    }catch{return {}}
  };
  const visited=loadVisited();
  const visitedKeys=Object.keys(visited);
  const isVisited=el=>{
    const key=getRouteKey(el),base=key.split('#')[0];
    return visitedKeys.some(v=>v===key||v===base||v.startsWith(base+'#'));
  };

  let firstUnvisited=null;
  coreSteps.forEach(step=>{
    if(isVisited(step)){
      step.classList.add('is-visited');
      step.setAttribute('data-route-state','visited');
    }else if(!firstUnvisited){firstUnvisited=step}
  });

  const recommendedTitle=document.querySelector('#roadmapRecommendedTitle');
  const recommendedCopy=document.querySelector('#roadmapRecommendedCopy');
  const recommendedLink=document.querySelector('#roadmapRecommendedLink');
  if(firstUnvisited){
    firstUnvisited.classList.add('is-next');
    firstUnvisited.setAttribute('data-route-state','next');
    firstUnvisited.setAttribute('aria-current','step');
    const label=firstUnvisited.querySelector('strong')?.textContent?.trim()||'the next lesson';
    if(recommendedTitle)recommendedTitle.textContent='Continue with '+label;
    if(recommendedCopy)recommendedCopy.textContent='This is the next unfinished step in your Core Learning Journey.';
    if(recommendedLink){recommendedLink.href=firstUnvisited.getAttribute('href');recommendedLink.textContent='Open '+label+' →'}
  }else{
    if(recommendedTitle)recommendedTitle.textContent='Core Journey complete!';
    if(recommendedCopy)recommendedCopy.textContent='Choose any branch below or try a mixed challenge in Quiz Hub.';
    if(recommendedLink){recommendedLink.href='quiz-hub.html';recommendedLink.textContent='Open Quiz Hub →'}
  }

  journeyCards.forEach(card=>{
    const steps=[...card.querySelectorAll('.journey-step')];
    let complete=0,branchNext=null;
    steps.forEach(step=>{
      if(isVisited(step)){
        complete++;
        step.classList.add('is-visited');
        step.setAttribute('data-route-state','visited');
      }else if(!branchNext){branchNext=step}
    });
    if(branchNext){branchNext.classList.add('is-next');branchNext.setAttribute('data-route-state','next')}
    const text=card.querySelector('[data-journey-progress-text]');
    const fill=card.querySelector('[data-journey-progress-fill]');
    if(text)text.textContent=complete+'/'+steps.length;
    if(fill)fill.style.width=(steps.length?Math.round(complete/steps.length*100):0)+'%';
    card.style.setProperty('--journey-progress',(steps.length?complete/steps.length*100:0)+'%');
    if(complete===steps.length&&steps.length)card.classList.add('is-complete');
  });
})();
