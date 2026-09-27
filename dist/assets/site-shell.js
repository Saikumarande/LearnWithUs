'use strict';

(() => {
  const header=document.querySelector('.fl-header'),menu=document.getElementById('fl-menu'),toggle=document.querySelector('.fl-menu-toggle');
  if(!header||!menu||!toggle)return;
  const tools=document.createElement('div');
  tools.id='fl-utility-menu';tools.className='fl-utility-menu';tools.setAttribute('aria-label','Website tools');tools.hidden=true;
  toggle.setAttribute('aria-controls',tools.id);toggle.setAttribute('aria-label','Open website tools');toggle.setAttribute('aria-haspopup','true');
  header.querySelector('.fl-topbar').append(tools);
  const dedicatedKids=['word-bank.html','letter-tracing.html','addition.html','subtraction.html','multiplication.html','division.html','quiz-hub.html','counting-quiz.html','missing-letters-quiz.html','spelling-quiz.html','math-quiz.html','place-value.html','odd-even.html','fractions.html','time-calendar.html','indian-money.html','measurement.html','multiplication-tables.html','multiplication-tables-quiz.html','india.html','india-quiz.html','planets.html','countries-capitals.html','world-quiz.html','stories.html','story.html','sports.html','sports-quiz.html','creativity.html','life-skills.html','life-skills-quiz.html','games.html','games-quiz.html'];
  const pageName=location.pathname.split('/').pop()||'index.html';
  const isKidsPage=document.body.dataset.area==='kids'||['children.html','kids-quiz.html','early-learning.html','kids-skills.html','languages.html','hindi.html','telugu.html',...dedicatedKids].includes(pageName);
  let kidsQuickNav=null;
  if(isKidsPage){
    kidsQuickNav=document.querySelector('.fl-section-nav[aria-label="Kids activities"]');
    if(!kidsQuickNav){kidsQuickNav=document.createElement('nav');header.after(kidsQuickNav);}
    kidsQuickNav.classList.add('fl-section-nav','fl-kids-quick-nav');
    kidsQuickNav.setAttribute('aria-label','Kids activities');
    kidsQuickNav.innerHTML='<div class="fl-container fl-kids-nav-shell"><div class="fl-kids-nav-summary" aria-label="Kids learning categories"><a href="children.html#english-learning">English</a><a href="children.html#maths-learning">Maths</a><a href="children.html#world-india-learning">World &amp; India</a><a href="children.html#explore-learning">Explore</a><button class="fl-kids-nav-expand" type="button" aria-expanded="false" aria-controls="fl-kids-nav-details">Expand to view more ↓</button></div><div class="fl-kids-nav-details" id="fl-kids-nav-details" hidden><div class="fl-kids-mega"><section><strong>English</strong><div><a class="fl-section-label" href="children.html">Kids Corner</a><a href="children.html?mode=letters">Letters</a><a href="children.html?mode=words">Phonics</a><a href="word-bank.html">Words</a><a href="letter-tracing.html">Tracing</a><a href="early-learning.html?topic=poems">Poems</a></div></section><section><strong>Maths</strong><div><a href="children.html?mode=numbers">Numbers</a><a href="addition.html">Addition</a><a href="subtraction.html">Subtraction</a><a href="multiplication.html">Multiplication</a><a href="division.html">Division</a><a href="multiplication-tables.html">Tables</a><a href="fractions.html">Fractions</a><a href="time-calendar.html">Time</a></div></section><section><strong>World &amp; India</strong><div><a href="children.html?mode=animals">Animals</a><a href="early-learning.html?topic=colours">Colours</a><a href="early-learning.html?topic=shapes">Shapes</a><a href="planets.html">Planets</a><a href="countries-capitals.html">Countries</a><a href="india.html">India</a><a href="hindi.html">Hindi</a><a href="telugu.html">Telugu</a></div></section><section><strong>Explore</strong><div><a href="stories.html">Stories</a><a href="sports.html">Sports</a><a href="creativity.html">Creativity</a><a href="life-skills.html">Life Skills</a><a href="games.html">Games</a><a href="quiz-hub.html">Quiz Hub</a></div></section></div><button class="fl-kids-nav-collapse" type="button">Collapse ↑</button></div></div>';
    const expandKidsNav=kidsQuickNav.querySelector('.fl-kids-nav-expand'),kidsNavDetails=kidsQuickNav.querySelector('.fl-kids-nav-details'),collapseKidsNav=kidsQuickNav.querySelector('.fl-kids-nav-collapse');
    let lastScrollY=window.scrollY,scrollTicking=false;
    const setKidsNavExpanded=expanded=>{
      expandKidsNav.setAttribute('aria-expanded',String(expanded));kidsNavDetails.hidden=!expanded;expandKidsNav.textContent=expanded?'Expanded':'Expand to view more ↓';
      if(expanded){kidsQuickNav.classList.remove('is-scroll-hidden');lastScrollY=window.scrollY;requestAnimationFrame(()=>{kidsQuickNav.classList.remove('is-scroll-hidden');lastScrollY=window.scrollY;height();});}
      else height();
    };
    expandKidsNav.addEventListener('click',()=>setKidsNavExpanded(expandKidsNav.getAttribute('aria-expanded')!=='true'));
    collapseKidsNav.addEventListener('click',()=>{setKidsNavExpanded(false);expandKidsNav.focus();});
    const updateKidsQuickNav=()=>{
      const y=Math.max(0,window.scrollY),delta=y-lastScrollY;
      // Requested behavior: scrolling DOWN hides the grouped Kids menu; scrolling UP reveals it.
      if(y<96)kidsQuickNav.classList.remove('is-scroll-hidden');
      else if(delta>0)kidsQuickNav.classList.add('is-scroll-hidden');
      else if(delta<0)kidsQuickNav.classList.remove('is-scroll-hidden');
      lastScrollY=y;scrollTicking=false;
    };
    window.addEventListener('scroll',()=>{if(!scrollTicking){scrollTicking=true;requestAnimationFrame(updateKidsQuickNav);}},{passive:true});
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
    if(['counting-quiz.html','missing-letters-quiz.html','spelling-quiz.html','math-quiz.html','kids-quiz.html','multiplication-tables-quiz.html','india-quiz.html','world-quiz.html','sports-quiz.html','life-skills-quiz.html','games-quiz.html'].includes(current))selected='quiz-hub.html';
    else if(current==='story.html')selected='stories.html';
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
  const footer=document.querySelector('.fl-footer');
  if(footer){footer.innerHTML='<div class="fl-container fl-footer-grid"><div class="fl-footer-about"><a class="fl-footer-brand" href="index.html">LearnWithUs</a><p>A little learning, every day.</p><p>Discover food, practise letters, numbers and animal names, play quizzes together, and get to know your body.</p></div><nav aria-label="Footer learning choices"><h3>Choose what to learn</h3><a href="food.html">Food discoveries</a><a href="children.html">Kids Corner</a><a href="health.html">Health guides</a><a href="contact.html">Contact me</a></nav></div><div class="fl-container"><p class="fl-fine">© 2026 LearnWithUs · Created by A. Sai Kumar · Nutrient data is educational and should be verified before clinical use.</p></div>';}
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
