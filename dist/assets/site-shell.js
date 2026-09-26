'use strict';

(() => {
  const header=document.querySelector('.fl-header'),menu=document.getElementById('fl-menu'),toggle=document.querySelector('.fl-menu-toggle');
  if(!header||!menu||!toggle)return;
  const tools=document.createElement('div');
  tools.id='fl-utility-menu';tools.className='fl-utility-menu';tools.setAttribute('aria-label','Website tools');tools.hidden=true;
  toggle.setAttribute('aria-controls',tools.id);toggle.setAttribute('aria-label','Open website tools');toggle.setAttribute('aria-haspopup','true');
  header.querySelector('.fl-topbar').append(tools);
  const dedicatedKids=['word-bank.html','letter-tracing.html','addition.html','subtraction.html','multiplication.html','division.html','quiz-hub.html','counting-quiz.html','missing-letters-quiz.html','spelling-quiz.html','math-quiz.html'];
  const pageName=location.pathname.split('/').pop()||'index.html';
  if(dedicatedKids.includes(pageName)&&!document.querySelector('.fl-section-nav')){
    const category=document.createElement('nav');category.className='fl-section-nav';category.setAttribute('aria-label','Kids learning categories');category.innerHTML='<div class="fl-container"><a class="fl-section-label" href="children.html">Kids Corner</a><a href="children.html?mode=words">Phonics</a><a href="word-bank.html">Picture Words</a><a href="letter-tracing.html">Letter Tracing</a><a href="addition.html">Addition</a><a href="subtraction.html">Subtraction</a><a href="multiplication.html">Multiplication</a><a href="division.html">Division</a><a href="place-value.html">More Maths</a><a href="india.html">India & Maps</a><a href="quiz-hub.html">Quiz Hub</a></div>';header.after(category);
  }
  function height(){document.documentElement.style.setProperty('--fl-header-height',header.getBoundingClientRect().height+'px');}
  function closeMenu(){tools.classList.remove('is-open');tools.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open website tools');height();}
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close website tools':'Open website tools');tools.hidden=!open;tools.classList.toggle('is-open',open);height();});
  header.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
  header.addEventListener('click',e=>{if(e.target.closest('.fl-utility-menu a')||e.target.closest('.fl-menu-action'))closeMenu();});
  document.addEventListener('click',e=>{if(toggle.getAttribute('aria-expanded')==='true'&&!header.contains(e.target))closeMenu();});
  const current=location.pathname.split('/').pop()||'index.html';
  const area=['food.html','catalog.html','mysteries.html','journeys.html','quiz.html'].includes(current)?'food.html':['children.html','kids-quiz.html','early-learning.html','kids-skills.html','languages.html','hindi.html','telugu.html',...dedicatedKids].includes(current)?'children.html':current;
  document.querySelectorAll('.fl-menu a,.fl-footer nav a').forEach(a=>{if(new URL(a.href).pathname.split('/').pop()===area)a.setAttribute('aria-current',area===current?'page':'true');else a.removeAttribute('aria-current');});
  function categoryState(){
    const here=new URL(location.href);
    const mode=here.searchParams.get('mode'),category=here.searchParams.get('category');
    let selected=current;
    if(['counting-quiz.html','missing-letters-quiz.html','spelling-quiz.html','math-quiz.html'].includes(current))selected='quiz-hub.html';
    else if(current==='children.html'&&['letters','words','numbers','animals'].includes(mode))selected+='?mode='+mode;
    else if(current==='early-learning.html'&&['colours','shapes','matching','poems'].includes(here.searchParams.get('topic')))selected+='?topic='+here.searchParams.get('topic');
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
  setTimeout(()=>{
    if(window.LearnWithUs||['404.html','privacy.html'].includes(location.pathname.split('/').pop()))return;
    try{const key='learnwithus.platform.v1',state=JSON.parse(localStorage.getItem(key)||'{}')||{},url=(location.pathname.split('/').pop()||'index.html')+location.search,title=document.title.split('—')[0].split('|')[0].trim(),now=new Date().toISOString();state.recent=Array.isArray(state.recent)?state.recent:[];state.visited=state.visited&&typeof state.visited==='object'&&!Array.isArray(state.visited)?state.visited:{};state.visited[url]={title,detail:'Learning activity on LearnWithUs',url,last:now,count:(state.visited[url]?.count||0)+1};state.recent=[{title,detail:'Learning activity on LearnWithUs',url,time:now},...state.recent.filter(item=>item&&item.url!==url)].slice(0,8);localStorage.setItem(key,JSON.stringify(state));}catch{}
  },1500);
  if(!document.querySelector('link[rel="manifest"]')){const manifest=document.createElement('link');manifest.rel='manifest';manifest.href='manifest.webmanifest';document.head.append(manifest);}
  if(!document.querySelector('meta[name="theme-color"]')){const theme=document.createElement('meta');theme.name='theme-color';theme.content='#0b3d2e';document.head.append(theme);}
  if(document.querySelector('script[data-learnwithus-platform]'))return;
  const style=document.createElement('link');
  style.rel='stylesheet';style.href='assets/platform.css?v=20260926g';
  document.head.append(style);
  const script=document.createElement('script');
  script.src='assets/platform.js?v=20260926g';script.defer=true;
  script.dataset.learnwithusPlatform='true';document.head.append(script);
})();
