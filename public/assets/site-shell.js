'use strict';

(() => {
  const header=document.querySelector('.fl-header'),menu=document.getElementById('fl-menu'),toggle=document.querySelector('.fl-menu-toggle');
  if(!header||!menu||!toggle)return;
  function height(){document.documentElement.style.setProperty('--fl-header-height',header.getBoundingClientRect().height+'px');}
  function closeMenu(){menu.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');height();}
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));menu.classList.toggle('is-open',open);height();});
  header.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
  header.addEventListener('click',e=>{if(e.target.closest('a')||e.target.closest('.fl-menu-action'))closeMenu();});
  const current=location.pathname.split('/').pop()||'index.html';
  const area=['food.html','catalog.html','mysteries.html','journeys.html','quiz.html'].includes(current)?'food.html':['children.html','kids-quiz.html','languages.html','hindi.html','telugu.html'].includes(current)?'children.html':current;
  document.querySelectorAll('.fl-menu a,.fl-footer nav a').forEach(a=>{if(new URL(a.href).pathname.split('/').pop()===area)a.setAttribute('aria-current',area===current?'page':'true');else a.removeAttribute('aria-current');});
  function categoryState(){
    const here=new URL(location.href);
    const mode=here.searchParams.get('mode'),category=here.searchParams.get('category');
    let selected=current;
    if(current==='children.html'&&['letters','words','numbers','animals'].includes(mode))selected+='?mode='+mode;
    else if(current==='kids-quiz.html'&&['letters','numbers'].includes(category))selected+='?category='+category;
    else if(current==='catalog.html')selected+='?category='+(['fruit','vegetable'].includes(category)?category:'all');
    else if(current==='hindi.html'||current==='telugu.html')selected=current;
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

// Shared learning tools are loaded here so every existing and future page gets
// search, bookmarks, progress, preferences, PWA support and consent controls.
(() => {
  if(!document.querySelector('link[rel="manifest"]')){const manifest=document.createElement('link');manifest.rel='manifest';manifest.href='manifest.webmanifest';document.head.append(manifest);}
  if(!document.querySelector('meta[name="theme-color"]')){const theme=document.createElement('meta');theme.name='theme-color';theme.content='#0b3d2e';document.head.append(theme);}
  if(document.querySelector('script[data-learnwithus-platform]'))return;
  const style=document.createElement('link');
  style.rel='stylesheet';style.href='assets/platform.css?v=20260925';
  document.head.append(style);
  const script=document.createElement('script');
  script.src='assets/platform.js?v=20260925';script.defer=true;
  script.dataset.learnwithusPlatform='true';document.head.append(script);
})();
