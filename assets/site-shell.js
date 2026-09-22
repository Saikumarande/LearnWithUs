'use strict';
// Google Analytics 4 — loaded once for every page that uses the shared site shell.
(() => {
  const measurementId='G-14CDXN6DDM';
  if(document.querySelector(`script[data-learnwithus-ga="${measurementId}"]`))return;
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
  window.gtag('js',new Date());
  window.gtag('config',measurementId);
  const googleTag=document.createElement('script');
  googleTag.async=true;
  googleTag.src=`https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  googleTag.dataset.learnwithusGa=measurementId;
  document.head.prepend(googleTag);
})();

(() => {
  const header=document.querySelector('.fl-header'),menu=document.getElementById('fl-menu'),toggle=document.querySelector('.fl-menu-toggle');
  if(!header||!menu||!toggle)return;
  function height(){document.documentElement.style.setProperty('--fl-header-height',header.getBoundingClientRect().height+'px');}
  function closeMenu(){menu.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');height();}
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));menu.classList.toggle('is-open',open);height();});
  header.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
  header.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
  const current=location.pathname.split('/').pop()||'index.html';
  const area=['food.html','catalog.html','mysteries.html','journeys.html','quiz.html'].includes(current)?'food.html':['children.html','kids-quiz.html'].includes(current)?'children.html':current;
  document.querySelectorAll('.fl-menu a,.fl-footer nav a').forEach(a=>{if(new URL(a.href).pathname.split('/').pop()===area)a.setAttribute('aria-current',area===current?'page':'true');else a.removeAttribute('aria-current');});
  function categoryState(){
    const here=new URL(location.href);
    const mode=here.searchParams.get('mode'),category=here.searchParams.get('category');
    let selected=current;
    if(current==='children.html'&&['letters','words','numbers','animals'].includes(mode))selected+='?mode='+mode;
    else if(current==='kids-quiz.html'&&['letters','numbers'].includes(category))selected+='?category='+category;
    else if(current==='catalog.html')selected+='?category='+(['fruit','vegetable'].includes(category)?category:'all');
    else if(current==='food.html'){
      const hash=here.hash.slice(1);
      selected+='#'+(hash==='compare'?'compare':['sources','daily-values','data-reading','macro-energy'].includes(hash)?'sources':'explore');
    }
    document.querySelectorAll('.fl-section-nav a').forEach(a=>{
      const url=new URL(a.href),key=url.pathname.split('/').pop()+url.search+url.hash;
      if(key===selected)a.setAttribute('aria-current',current==='food.html'?'location':'page');else a.removeAttribute('aria-current');
    });
  }
  categoryState();window.addEventListener('popstate',categoryState);window.addEventListener('hashchange',categoryState);window.addEventListener('learning-view-change',categoryState);
  if(typeof ResizeObserver==='function')new ResizeObserver(height).observe(header);else window.addEventListener('resize',height);
  height();
})();
