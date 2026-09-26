'use strict';
(() => {
  const STORE='learnwithus.platform.v1';
  const empty=()=>({preferences:{age:'all',language:'en'},recent:[],bookmarks:[],visited:{},quizHistory:[],completed:[],analytics:null,dailyGoalMinutes:10,dailyProgressMinutes:0,learningStreak:0,lastLearningDate:null,learningMinutes:0,achievements:[],mistakes:[],accessibility:{largeText:false,highContrast:false,reducedMotion:false}});
  function read(){
    const base=empty();
    try{
      const saved=JSON.parse(localStorage.getItem(STORE)||'{}')||{},merged=Object.assign(base,saved);
      merged.preferences=Object.assign({age:'all',language:'en'},saved.preferences||{});
      merged.accessibility=Object.assign({largeText:false,highContrast:false,reducedMotion:false},saved.accessibility||{});
      ['recent','bookmarks','quizHistory','completed','achievements','mistakes'].forEach(key=>{if(!Array.isArray(merged[key]))merged[key]=[];});
      if(!merged.visited||typeof merged.visited!=='object'||Array.isArray(merged.visited))merged.visited={};
      return merged;
    }catch{return base;}
  }
  function write(data){try{localStorage.setItem(STORE,JSON.stringify(data));}catch{}}
  let state=read();

  function localDay(){return new Date().toLocaleDateString('en-CA');}
  function ensureDay(){const today=localDay();if(state.goalDay!==today){state.goalDay=today;state.dailyProgressMinutes=0;}return today;}
  function markLearningActivity(){const today=ensureDay();if(state.lastLearningDate!==today){const previous=new Date(Date.now()-86400000).toLocaleDateString('en-CA');state.learningStreak=state.lastLearningDate===previous?(state.learningStreak||0)+1:1;state.lastLearningDate=today;}write(state);}
  function addLearningMinute(){if(['404.html','privacy.html'].includes(page))return;ensureDay();state.learningMinutes=(state.learningMinutes||0)+1;state.dailyProgressMinutes=(state.dailyProgressMinutes||0)+1;markLearningActivity();}
  function learningTimer(){if(['404.html','privacy.html'].includes(page))return;let active=document.visibilityState==='visible';const timer=setInterval(()=>{if(active)addLearningMinute();},60000);document.addEventListener('visibilitychange',()=>{active=document.visibilityState==='visible';});window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});}
  function dailyChallenge(){const rec=recommendations();if(!rec.length)return null;const day=new Date(),seed=day.getFullYear()*372+day.getMonth()*31+day.getDate();return rec[seed%rec.length];}
  function achievements(){const lessons=state.completed.length,quizzes=state.quizHistory.length,questions=state.quizHistory.reduce((n,x)=>n+(Number(x.total)||0),0),streak=state.learningStreak||0;return [lessons>=1&&['first-lesson','First Discovery','Complete your first learning activity'],quizzes>=1&&['first-quiz','Quiz Starter','Complete your first quiz'],lessons>=10&&['ten-lessons','Curious Learner','Complete 10 activities'],questions>=100&&['hundred-questions','Question Explorer','Answer 100 quiz questions'],streak>=3&&['three-day-streak','Getting Started','Learn for 3 days in a row'],streak>=7&&['seven-day-streak','Learning Habit','Learn for 7 days in a row']].filter(Boolean);}
  function persistAchievements(){const ids=achievements().map(x=>x[0]);if(JSON.stringify(state.achievements)!==JSON.stringify(ids)){state.achievements=ids;write(state);}}
  function applyAccessibility(){
    const a=state.accessibility||{};document.documentElement.classList.toggle('lw-large-text',!!a.largeText);document.documentElement.classList.toggle('lw-high-contrast',!!a.highContrast);document.documentElement.classList.toggle('lw-reduced-motion',!!a.reducedMotion);
  }
  function setAccessibility(key,value){state.accessibility=Object.assign({},state.accessibility||{}, {[key]:!!value});write(state);applyAccessibility();}
  function categoryStats(){
    const cats={Food:0,Kids:0,Health:0,Languages:0,Quizzes:0};
    const totals={Food:0,Kids:0,Health:0,Languages:0,Quizzes:0};
    records.forEach(row=>{const c=row[3];if(c==='Food')totals.Food++;else if(c==='Kids')totals.Kids++;else if(c==='Health')totals.Health++;else if(c==='Quiz')totals.Quizzes++;});
    Object.values(state.visited||{}).forEach(item=>{const match=records.find(row=>row[2]===item.url);if(!match)return;const c=match[3];if(c==='Food')cats.Food++;else if(c==='Kids')cats.Kids++;else if(c==='Health')cats.Health++;else if(c==='Quiz')cats.Quizzes++;});
    totals.Languages=2; cats.Languages=(state.visited['hindi.html']?1:0)+(state.visited['telugu.html']?1:0);
    Object.keys(cats).forEach(k=>cats[k]=Math.min(cats[k],totals[k]||1));
    return {cats,totals};
  }
  function milestones(){
    const lessons=state.completed.length,questions=state.quizHistory.reduce((n,x)=>n+(Number(x.total)||0),0);
    return [5,10,25,50].filter(n=>lessons>=n).map(n=>['milestone-lessons-'+n,'Learning milestone','Complete '+n+' activities']).concat([25,50,100].filter(n=>questions>=n).map(n=>['milestone-questions-'+n,'Question milestone','Answer '+n+' quiz questions']));
  }
  function accessibilityPanel(){
    const button=document.getElementById('lw-settings-open');if(!button||document.getElementById('lw-settings-modal'))return;
    const modal=document.createElement('div');modal.className='lw-modal';modal.id='lw-settings-modal';modal.hidden=true;modal.innerHTML='<section class="lw-modal-panel lw-settings-panel" role="dialog" aria-modal="true" aria-labelledby="lw-settings-title"><div class="lw-modal-head"><h2 id="lw-settings-title">Settings</h2><button class="lw-close" type="button" aria-label="Close settings">×</button></div><div class="lw-settings-body"><h3>Display & accessibility</h3><label><input id="lw-large-text" type="checkbox"> Larger text</label><label><input id="lw-high-contrast" type="checkbox"> Higher contrast</label><label><input id="lw-reduced-motion" type="checkbox"> Reduce motion</label><p>These display choices stay on this browser and can be changed anytime.</p><h3>Privacy</h3><p>Your learning progress stays on this browser. You can review analytics choices or clear local learning data whenever you want.</p><div class="lw-settings-links"><a class="lw-primary-link" href="privacy.html">Privacy & analytics</a><button class="lw-clear" id="lw-clear-settings" type="button">Clear local learning data</button></div></div></section>';document.body.append(modal);
    const close=()=>{modal.hidden=true;document.documentElement.style.overflow='';button.focus();};button.addEventListener('click',()=>{modal.hidden=false;const a=state.accessibility||{};modal.querySelector('#lw-large-text').checked=!!a.largeText;modal.querySelector('#lw-high-contrast').checked=!!a.highContrast;modal.querySelector('#lw-reduced-motion').checked=!!a.reducedMotion;document.documentElement.style.overflow='hidden';modal.querySelector('#lw-large-text').focus();});modal.querySelector('.lw-close').addEventListener('click',close);modal.addEventListener('click',e=>{if(e.target===modal)close();});modal.querySelector('#lw-large-text').addEventListener('change',e=>setAccessibility('largeText',e.target.checked));modal.querySelector('#lw-high-contrast').addEventListener('change',e=>setAccessibility('highContrast',e.target.checked));modal.querySelector('#lw-reduced-motion').addEventListener('change',e=>setAccessibility('reducedMotion',e.target.checked));modal.querySelector('#lw-clear-settings').addEventListener('click',()=>{if(confirm('Clear your LearnWithUs learning data saved on this browser?')){const analytics=state.analytics;state=empty();state.analytics=analytics;write(state);location.reload();}});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close();});
  }
  const page=location.pathname.split('/').pop()||'index.html';
  const relative=page+location.search+location.hash;
  const pageTitle=document.title.split('—')[0].split('|')[0].trim();
  const foodNames='Apple,Banana,Orange,Mango,Guava,Watermelon,Kiwi,Pear,Pineapple,Grapes,Strawberry,Papaya,Peach,Blueberries,Sweet cherries,Pomegranate,Avocado,Lemon,Coconut,Plum,Apricot,Raspberries,Blackberries,Cantaloupe,Lychee,Carrot,Broccoli,Spinach,Tomato,Potato,Cucumber,Green peas,Cabbage,Cauliflower,Onion,Garlic,Eggplant,Okra,Red bell pepper,Beetroot,Radish,Celery,Asparagus,Sweet potato,Pumpkin,Zucchini,Green beans,Romaine lettuce,Sweet corn,Turnip'.split(',');
  const records=[
    ['Home','Choose Food, Kids or Health','index.html','Home','🏠'],
    ['My learning dashboard','Bookmarks, recent topics and quiz progress','dashboard.html','Progress','📊'],
    ['Food discoveries','Explore and compare foods','food.html','Food','🍎'],
    ['All fruits','Nutrition records and mineral search','catalog.html?category=fruit','Food','🍓'],
    ['All vegetables','Nutrition records and mineral search','catalog.html?category=vegetable','Food','🥦'],
    ['Food comparison','Compare two foods','food.html#compare','Food','⚖️'],
    ['Food mysteries','50 everyday food questions','mysteries.html','Science','🧪'],
    ['Food journeys','Follow food through digestion','journeys.html','Science','🧭'],
    ['Food quiz','Easy, medium and tough quizzes','quiz.html','Quiz','🏆'],
    ['Kids Corner','Letters, words, numbers and animals','children.html','Kids','🧸'],
    ['English letters','Capital, small and cursive letters','children.html?mode=letters','Kids','🔤'],
    ['Phonics starters','Connect letters with beginning words','children.html?mode=words','Kids','🔊'],
    ['Numbers','Count from 0 to 100','children.html?mode=numbers','Kids','🔢'],
    ['Animals','Pictures and spoken animal names','children.html?mode=animals','Kids','🦁'],
    ['Hindi letters','See and hear a Devanagari letter grid','hindi.html','Kids','अ'],
    ['Telugu letters','See and hear a Telugu letter grid','telugu.html','Kids','అ'],
    ['Colours','See and hear 25 colour cards','early-learning.html?topic=colours','Kids','🎨'],
    ['Shapes','See and hear 15 different shapes','early-learning.html?topic=shapes','Kids','▲'],
    ['Picture quiz','Match familiar pictures and words','early-learning.html?topic=matching','Quiz','🧩'],
    ['Poems','Short original poems to hear and repeat','early-learning.html?topic=poems','Kids','🎵'],
    ['Picture Words','Learn 100 words with pictures and sound','word-bank.html','Kids','🖼️'],
    ['Letter tracing','Trace over a pale letter using touch, mouse or stylus','letter-tracing.html','Kids','✍️'],
    ['Counting objects quiz','10 counting questions with five choices','counting-quiz.html','Quiz','🍎'],
    ['Missing letters quiz','10 picture-guided missing-letter questions','missing-letters-quiz.html','Quiz','C_T'],
    ['Picture spelling quiz','Look at a large picture and spell its word','spelling-quiz.html','Quiz','📖'],
    ['Addition','Learn joining groups with examples','addition.html','Kids','➕'],
    ['Subtraction','Learn taking away with examples','subtraction.html','Kids','➖'],
    ['Multiplication','Learn equal groups with examples','multiplication.html','Kids','✖️'],
    ['Division','Learn equal sharing with examples','division.html','Kids','➗'],
    ['Kids Quiz Hub','Choose English, Maths, language or food quizzes','quiz-hub.html','Quiz','🏆'],
    ['Place value','Understand ones, tens, hundreds and thousands','place-value.html','Kids','🏠'],['Odd and even','Learn number pairs','odd-even.html','Kids','2️⃣'],['Fractions','Learn equal parts of a whole','fractions.html','Kids','🍕'],['Time and calendar','Read clocks, days, weeks and months','time-calendar.html','Kids','🕐'],['Indian money','Learn rupees and simple totals','indian-money.html','Kids','₹'],['Measurement','Length, weight and capacity','measurement.html','Kids','📏'],['India and Maps','States, capitals, regions and national symbols','india.html','Kids','🇮🇳'],
    ['Letter quiz','Parent-guided letter practice','kids-quiz.html?category=letters','Quiz','A'],
    ['Number quiz','Parent-guided number practice','kids-quiz.html?category=numbers','Quiz','7'],
    ['Health guides','Explore body parts and healthy habits','health.html','Health','🫀'],
    ['Heart','How the heart pumps blood','health.html?part=heart','Health','❤️'],
    ['Brain','How the brain guides the body','health.html?part=brain','Health','🧠'],
    ['Lungs','How breathing works','health.html?part=lungs','Health','🫁'],
    ['Liver','Processing nutrients and making bile','health.html?part=liver','Health','🟤'],
    ['Kidneys','Filtering blood and fluid balance','health.html?part=kidneys','Health','💧'],
    ['Stomach','Mixing food during digestion','health.html?part=stomach','Health','🥣'],
    ['Eyes','How vision works','health.html?part=eyes','Health','👁️'],
    ['Bones','Support, protection and movement','health.html?part=bones','Health','🦴'],
    ['Intestines','Digestion and nutrient absorption','health.html?part=intestines','Health','〰️'],
    ['Privacy choices','Analytics and local learning data','privacy.html','Help','🔒'],
    ['Contact','About the creator','contact.html','Help','✉️']
  ];
  foodNames.forEach(name=>records.push([name,'Nutrition, minerals and food facts','catalog.html?category=all&q='+encodeURIComponent(name),'Food','🍽️']));

  function normal(value){return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
  function safe(value){return String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));}
  function currentInfo(){
    const params=new URLSearchParams(location.search),match=records.find(row=>row[2]===relative||row[2]===page);
    if(page==='children.html'){
      const mode=params.get('mode'),letter=params.get('letter');
      if(mode==='letters')return {title:'English letters',detail:'Capital, small and cursive letter practice'};
      if(mode==='words')return {title:letter?'Phonics starter · Letter '+letter.toUpperCase():'Phonics starters',detail:letter?'A beginning-word card for '+letter.toUpperCase():'Connect letters with beginning words'};
      if(mode==='numbers')return {title:'Numbers',detail:'Number names and counting practice'};
      if(mode==='animals')return {title:'Animals',detail:'Animal pictures and spoken names'};
    }
    if(page==='hindi.html')return {title:'Hindi letters',detail:'Hindi letters in familiar reading rows with matching Hindi speech'};
    if(page==='telugu.html')return {title:'Telugu letters',detail:'Telugu letters in familiar reading rows with matching Telugu speech'};
    if(page==='early-learning.html'){
      const topic=params.get('topic');
      if(topic==='matching')return {title:'Picture matching',detail:'Preschool picture and word matching practice'};
      if(topic==='shapes')return {title:'Shapes',detail:'See and hear 15 different shapes'};
      if(topic==='poems'||topic==='rhymes')return {title:'Poems',detail:'Short original poems to hear and repeat'};
      return {title:'Colours',detail:'See and hear 25 colour cards'};
    }
    if(page==='kids-skills.html'){const topic=params.get('topic')||'phonics',names={'phonics':'Phonics','tracing':'Letter tracing','counting':'Counting objects','missing':'Missing letters','spelling':'Reading and spelling','add-subtract':'Addition and subtraction','multiply-divide':'Multiplication and division'};return {title:names[topic]||'Kids learning games',detail:'Interactive practice that stays on this device'};}
    const dedicated={'word-bank.html':['Picture Words','Learn 100 useful words with pictures and sound'],'letter-tracing.html':['Letter Tracing','Follow a pale letter using touch, mouse or stylus'],'counting-quiz.html':['Counting Objects Quiz','10 questions with five choices'],'missing-letters-quiz.html':['Missing Letters Quiz','10 picture-guided word questions'],'spelling-quiz.html':['Picture Spelling Quiz','Spell the word shown by a large picture'],'addition.html':['Addition','Learn joining groups with examples and practice'],'subtraction.html':['Subtraction','Learn taking away with examples and practice'],'multiplication.html':['Multiplication','Learn equal groups with examples and practice'],'division.html':['Division','Learn equal sharing with examples and practice'],'math-quiz.html':['Maths Quiz','10 questions with a downloadable score card'],'quiz-hub.html':['Kids Quiz Hub','Choose a subject and an exact quiz']};if(dedicated[page])return {title:dedicated[page][0],detail:dedicated[page][1]};
    if(page==='catalog.html'){const category=params.get('category'),query=params.get('q');return {title:query?'Food search · '+query:category==='fruit'?'Fruit catalogue':category==='vegetable'?'Vegetable catalogue':'Food catalogue',detail:'Nutrition facts, minerals and percentage bars'};}
    if(page==='health.html'&&params.get('part')){const part=params.get('part').replace(/-/g,' ');return {title:part.charAt(0).toUpperCase()+part.slice(1),detail:'Body-part guide and everyday healthy habits'};}
    return {title:match?match[0]:pageTitle,detail:match?match[1]:'Learning activity on LearnWithUs'};
  }
  function labelForCurrent(){return currentInfo().title;}
  function recordVisit(){
    if(['404.html','privacy.html'].includes(page))return;
    const now=new Date().toISOString(),key=page+location.search;
    const info=currentInfo();state.visited[key]={title:info.title,detail:info.detail,url:key,last:now,count:(state.visited[key]?.count||0)+1};
    state.recent=[{title:info.title,detail:info.detail,url:key,time:now},...state.recent.filter(x=>x.url!==key)].slice(0,8);write(state);
  }
  function toast(message){
    let el=document.querySelector('.lw-toast');if(!el){el=document.createElement('div');el.className='lw-toast';el.setAttribute('role','status');document.body.append(el);}
    el.textContent=message;el.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.hidden=true,2300);
  }
  function saveBookmark(){
    const key=page+location.search+location.hash,index=state.bookmarks.findIndex(x=>x.url===key);
    if(index>=0){state.bookmarks.splice(index,1);toast('Removed from saved topics');}
    else{state.bookmarks.unshift({title:labelForCurrent(),url:key,time:new Date().toISOString()});toast('Saved for later');}
    state.bookmarks=state.bookmarks.slice(0,40);write(state);updateBookmark();
  }
  function updateBookmark(){const button=document.getElementById('lw-bookmark');if(!button)return;const saved=state.bookmarks.some(x=>x.url===page+location.search+location.hash);button.setAttribute('aria-pressed',String(saved));button.innerHTML=saved?'★ <span>Saved</span>':'☆ <span>Save</span>';}
  function injectHeader(){
    const menu=document.getElementById('fl-utility-menu');if(!menu)return;
    if(!document.getElementById('lw-search-open')){const search=document.createElement('button');search.className='fl-menu-action';search.id='lw-search-open';search.type='button';search.innerHTML='⌕ Search';search.setAttribute('aria-label','Search all learning topics');menu.append(search);}
    if(!document.querySelector('.lw-learning-link')){const learning=document.createElement('a');learning.className='fl-menu-action lw-learning-link';learning.href='dashboard.html';learning.innerHTML='📊 My learning';learning.setAttribute('aria-label','Open my learning dashboard');if(page==='dashboard.html')learning.setAttribute('aria-current','page');menu.append(learning);}
    if(!document.getElementById('lw-settings-open')){const settings=document.createElement('button');settings.className='fl-menu-action';settings.id='lw-settings-open';settings.type='button';settings.innerHTML='⚙ Settings';settings.setAttribute('aria-label','Open LearnWithUs settings');menu.append(settings);}
  }
  function injectBookmark(){if(['index.html','dashboard.html','contact.html','privacy.html','404.html'].includes(page))return;const bar=document.createElement('div');bar.className='lw-bookmark-bar';bar.innerHTML='<button id="lw-bookmark" type="button" aria-pressed="false">☆ <span>Save</span></button>';document.body.append(bar);bar.querySelector('button').addEventListener('click',saveBookmark);updateBookmark();}
  function injectBreadcrumb(){if(['index.html','dashboard.html','404.html'].includes(page))return;const main=document.querySelector('main');if(!main)return;const area=document.body.dataset.area||'';const parent=area==='kids'?['Kids Corner','children.html']:area==='health'?['Health guides','health.html']:area==='food'||['catalog.html','mysteries.html','journeys.html','quiz.html'].includes(page)?['Food discoveries','food.html']:null;const nav=document.createElement('nav');nav.className='lw-breadcrumb';nav.setAttribute('aria-label','Breadcrumb');nav.innerHTML='<a href="index.html">Home</a>'+(parent?'<span>›</span><a href="'+parent[1]+'">'+parent[0]+'</a>':'')+'<span>›</span><strong>'+safe(labelForCurrent())+'</strong>';main.before(nav);}
  function searchModal(){
    const modal=document.createElement('div');modal.className='lw-modal';modal.hidden=true;modal.innerHTML='<section class="lw-modal-panel" role="dialog" aria-modal="true" aria-labelledby="lw-search-title"><div class="lw-modal-head"><label id="lw-search-title" class="sr-only" for="lw-global-search">Search all learning topics</label><input id="lw-global-search" type="search" autocomplete="off" placeholder="Search food, letters, health, quizzes…"><button class="lw-close" type="button" aria-label="Close search">×</button></div><div class="lw-search-filters"><label>Category<select id="lw-search-category"><option value="all">Everything</option><option>Food</option><option>Kids</option><option>Health</option><option>Quiz</option></select></label></div><p class="lw-search-help">Try “iron”, “animals”, “heart”, “banana” or “quiz”.</p><div class="lw-results" id="lw-results"></div></section>';document.body.append(modal);
    const input=modal.querySelector('#lw-global-search'),category=modal.querySelector('#lw-search-category'),results=modal.querySelector('.lw-results');
    function render(){const q=normal(input.value.trim()),tokens=q.split(/\s+/).filter(Boolean),cat=category.value;let rows=records.filter(row=>(cat==='all'||row[3]===cat)&&tokens.every(token=>normal(row.slice(0,4).join(' ')).includes(token))).slice(0,18);if(!q)rows=records.filter(row=>cat==='all'||row[3]===cat).slice(0,10);results.innerHTML=rows.map(row=>'<a class="lw-result" href="'+row[2]+'"><span class="lw-result-icon" aria-hidden="true">'+row[4]+'</span><span><strong>'+row[0]+'</strong><small>'+row[1]+'</small></span><span class="lw-result-type">'+row[3]+'</span></a>').join('')||'<p class="lw-empty">No result yet. Try a shorter word or another spelling.</p>';}
    function open(){modal.hidden=false;render();setTimeout(()=>input.focus(),0);document.documentElement.style.overflow='hidden';}
    function close(){modal.hidden=true;document.documentElement.style.overflow='';document.getElementById('lw-search-open')?.focus();}
    document.getElementById('lw-search-open')?.addEventListener('click',open);modal.querySelector('.lw-close').addEventListener('click',close);modal.addEventListener('click',e=>{if(e.target===modal)close();});input.addEventListener('input',render);category.addEventListener('change',render);document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open();}if(e.key==='Escape'&&!modal.hidden)close();});
  }
  function loadAnalytics(){
    if(document.querySelector('script[data-learnwithus-ga]'))return;
    const id='G-14CDXN6DDM';window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};window.gtag('js',new Date());window.gtag('config',id,{anonymize_ip:true});
    const tag=document.createElement('script');tag.async=true;tag.src='https://www.googletagmanager.com/gtag/js?id='+id;tag.dataset.learnwithusGa=id;document.head.append(tag);
  }
  function consent(){
    if(['privacy.html','404.html'].includes(page))return;
    if(state.analytics==='granted'){loadAnalytics();return;}if(state.analytics==='denied')return;
    const box=document.createElement('aside');box.className='lw-consent';box.innerHTML='<h2>Help us make learning better</h2><p>If you’re comfortable, anonymous usage analytics helps us understand which learning pages are useful and improve the experience. Your learning progress stays on this device.</p><div class="lw-consent-actions"><button class="accept" type="button">Yes, help improve LearnWithUs</button><button class="decline" type="button">Keep analytics off</button><a href="privacy.html">See how this works</a></div>';document.body.append(box);
    box.querySelector('.accept').addEventListener('click',()=>{state.analytics='granted';write(state);loadAnalytics();box.remove();toast('Analytics preference saved');});box.querySelector('.decline').addEventListener('click',()=>{state.analytics='denied';write(state);box.remove();toast('Analytics remains off');});
  }
  function recommendations(){
    const age=state.preferences.age;
    const map={preschool:[['Hear animal names','children.html?mode=animals','🦁'],['Explore Phonics Starters','children.html?mode=words','🍎'],['Practise English letters','children.html?mode=letters','🔤'],['Count the first numbers','children.html?mode=numbers','🔢']],primary:[['Learn 100 Picture Words','word-bank.html','🖼️'],['Practise numbers','children.html?mode=numbers','🔢'],['Open the Kids Quiz Hub','quiz-hub.html','⭐'],['Learn addition','addition.html','➕']],teens:[['Try the medium food quiz','quiz.html?level=medium','🏆'],['Follow digestion','journeys.html','🧭'],['Compare two foods','food.html#compare','⚖️'],['Explore a body guide','health.html','🫀']],adults:[['Compare foods','food.html#compare','⚖️'],['Explore health guides','health.html','🫀'],['Read food data carefully','food.html#sources','📚'],['Test food knowledge','quiz.html?level=medium','🏆']],all:[['Discover a food mystery','mysteries.html','🧪'],['Explore your body','health.html','🧠'],['Learn 100 Picture Words','word-bank.html','🖼️'],['Compare foods','food.html#compare','⚖️']]};return map[age]||map.all;
  }
  function homeHub(){
    if(page!=='index.html')return;const paths=document.querySelector('.home-paths');if(!paths)return;const rec=recommendations(),last=state.recent.find(x=>x.url!=='index.html');const visited=Object.keys(state.visited).length,quizCount=state.quizHistory.length,completed=state.completed.length;
    const ageNames={all:'everyone',preschool:'preschool learners',primary:'primary learners',teens:'teen learners',adults:'adult learners'},today=new Date(),daily=rec[(today.getFullYear()*372+today.getMonth()*31+today.getDate())%rec.length];
    const hub=document.createElement('section');hub.className='lw-home-hub';hub.setAttribute('aria-label','Your learning hub');hub.innerHTML='<div class="lw-hub-top"><article class="lw-panel"><h2>'+(last?'Continue learning':'Start your first discovery')+'</h2><p>'+(last?'Pick up where you left off: '+safe(last.title)+'. '+safe(last.detail||''):'Choose a short activity and build your learning one step at a time.')+'</p><a class="lw-primary-link" href="'+(last?safe(last.url):daily[1])+'">'+(last?'Continue →':'Open activity →')+'</a></article><article class="lw-panel lw-today"><p class="lw-panel-kicker">Daily recommendation</p><h2>Today’s idea for '+ageNames[state.preferences.age]+'</h2><h3>'+daily[2]+' '+daily[0]+'</h3><p>This choice changes with the selected learner and rotates on each new calendar day.</p><a class="lw-primary-link" href="'+daily[1]+'">Open activity →</a></article></div><article class="lw-panel"><h2>Choose the learner</h2><p>Select an age group to receive suitable starting topics and quizzes. The choice changes Today’s idea and Recommended next on My learning.</p><div class="lw-pref-row"><label>Age group<select id="lw-age"><option value="all">Everyone</option><option value="preschool">Preschool · 2–4</option><option value="primary">Primary · 5–12</option><option value="teens">Teens</option><option value="adults">Adults</option></select></label><label>Language<select id="lw-language"><option value="en">English</option><option value="hi">हिन्दी · Hindi</option><option value="te">తెలుగు · Telugu</option></select></label></div><div class="lw-recommendation-list">'+rec.map(x=>'<a href="'+x[1]+'"><span>'+x[2]+'</span><strong>'+x[0]+'</strong></a>').join('')+'</div></article><article class="lw-panel"><h2>Your progress preview</h2><div class="lw-progress-grid"><div class="lw-stat"><b>'+visited+'</b>topics explored</div><div class="lw-stat"><b>'+quizCount+'</b>quiz attempts</div><div class="lw-stat"><b>'+completed+'</b>activities completed</div></div><p><a href="dashboard.html">Open full learning dashboard →</a></p></article>';
    paths.after(hub);const age=hub.querySelector('#lw-age'),language=hub.querySelector('#lw-language');age.value=state.preferences.age;language.value=state.preferences.language;age.addEventListener('change',()=>{state.preferences.age=age.value;write(state);location.reload();});language.addEventListener('change',()=>{state.preferences.language=language.value;write(state);if(language.value==='hi')location.href='hindi.html';if(language.value==='te')location.href='telugu.html';});
  }
  function dashboard(){
    if(page!=='dashboard.html')return;
    const root=document.getElementById('learningDashboard');if(!root)return;
    ensureDay();persistAchievements();
    const recent=state.recent.filter(x=>x.url!=='dashboard.html'),rec=recommendations(),continueItem=recent[0]||null,challenge=dailyChallenge(),earned=achievements(),mistakes=state.mistakes||[];
    const list=items=>items.length?'<div class="lw-mini-list">'+items.map(x=>'<a href="'+safe(x.url)+'"><strong>'+safe(x.title)+'</strong><small>'+safe(x.detail||'Open this learning activity')+'</small><span aria-hidden="true">→</span></a>').join('')+'</div>':'<p>Nothing here yet. Explore a topic and it will appear automatically.</p>';
    const progress=Math.min(100,Math.round(((state.dailyProgressMinutes||0)/(state.dailyGoalMinutes||10))*100));
    const cats=categoryStats();
    const categoryList='<div class="lw-category-grid">'+Object.keys(cats.cats).map(k=>{const total=cats.totals[k]||1,done=cats.cats[k]||0,p=Math.round(done/total*100);return '<div><div class="lw-category-head"><strong>'+k+'</strong><span>'+p+'%</span></div><div class="lw-category-bar"><i style="width:'+p+'%"></i></div><small>'+done+' of '+total+' explored</small></div>';}).join('')+'</div>';
    const achievementList=earned.length?'<div class="lw-achievements">'+earned.slice(0,4).map(x=>'<article><span aria-hidden="true">🏆</span><strong>'+safe(x[1])+'</strong><small>'+safe(x[2])+'</small></article>').join('')+'</div>':'<p>Complete a lesson or quiz to start earning badges.</p>';
    const mistakeList=mistakes.length?list(mistakes.slice(0,4).map(x=>({title:'Review: '+(x.tag||x.title||'quiz topic'),url:x.url||'quiz.html',detail:'Missed '+(x.count||1)+' time'+((x.count||1)===1?'':'s')}))):'<p>No quiz mistakes to review yet.</p>';
    root.innerHTML='<h1>My learning</h1><p>Your learning overview stays private on this browser. No account or public profile is needed.</p><div class="lw-dashboard-grid lw-simple-dashboard">'+
      '<article class="lw-panel lw-today"><p class="lw-panel-kicker">Today</p><h2>Learning goal</h2><div class="lw-goal-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+progress+'"><span style="width:'+progress+'%"></span></div><p><strong>'+state.dailyProgressMinutes+' / '+state.dailyGoalMinutes+' minutes</strong> · 🔥 '+(state.learningStreak||0)+' day streak</p><label class="lw-goal-select">Daily goal <select id="lw-daily-goal"><option value="5">5 minutes</option><option value="10">10 minutes</option><option value="15">15 minutes</option><option value="20">20 minutes</option><option value="30">30 minutes</option></select></label></article>'+ 
      '<article class="lw-panel"><h2>Continue learning</h2>'+(continueItem?list([continueItem]):'<p>Start a lesson and your latest activity will appear here.</p>')+'</article>'+ 
      '<article class="lw-panel"><h2>Today’s challenge</h2>'+(challenge?'<p>One focused activity for today.</p><a class="lw-primary-link" href="'+safe(challenge[1])+'">'+safe(challenge[2])+' '+safe(challenge[0])+' →</a>':'<p>Explore a topic to unlock your first challenge.</p>')+'</article>'+ 
      '<article class="lw-panel"><h2>Recommended next</h2>'+list(rec.slice(0,3).map(x=>({title:x[2]+' '+x[0],url:x[1],detail:'Suggested for your learner preference'})))+'</article>'+ 
      '<article class="lw-panel"><h2>Your progress</h2><div class="lw-progress-grid"><div class="lw-stat"><b>'+Object.keys(state.visited).length+'</b>topics</div><div class="lw-stat"><b>'+state.quizHistory.length+'</b>quizzes</div><div class="lw-stat"><b>'+state.completed.length+'</b>completed</div></div><p><a href="#more-progress">View more progress ↓</a></p></article>'+ 
      '<article class="lw-panel"><h2>Achievements</h2>'+achievementList+'</article>'+ 
      '<details class="lw-dashboard-more" id="more-progress"><summary>More progress & saved items</summary><div class="lw-dashboard-grid">'+
      '<article class="lw-panel"><h2>Review quiz mistakes</h2>'+mistakeList+'</article>'+ 
      '<article class="lw-panel"><h2>Recently viewed</h2>'+list(recent.slice(0,5))+'</article>'+ 
      '<article class="lw-panel"><h2>Saved for later</h2>'+list(state.bookmarks.slice(0,5))+'</article>'+ 
      '<article class="lw-panel"><h2>Progress by category</h2>'+categoryList+'</article>'+
      '<article class="lw-panel"><h2>Quick learning</h2><p>Short activities are a simple way to build a learning habit.</p>'+list(rec.slice(0,2).map(x=>({title:x[2]+" "+x[0],url:x[1],detail:"A quick 3–5 minute activity"})))+'</article>'+
      '<article class="lw-panel"><h2>Learning statistics</h2><div class="lw-progress-grid"><div class="lw-stat"><b>'+state.learningMinutes+'</b>minutes</div><div class="lw-stat"><b>'+state.quizHistory.reduce((n,x)=>n+(Number(x.total)||0),0)+'</b>questions</div><div class="lw-stat"><b>'+state.bookmarks.length+'</b>saved</div></div></article>'+ 
      '</div></details></div>';
    const goalSelect=document.getElementById('lw-daily-goal');goalSelect.value=String(state.dailyGoalMinutes||10);goalSelect.addEventListener('change',()=>{state.dailyGoalMinutes=Number(goalSelect.value)||10;write(state);dashboard();});
  }
  function recordQuiz(title,score,total,url=relative,mistakes=[]){
    state.quizHistory.unshift({title,score,total,url,time:new Date().toISOString()});state.quizHistory=state.quizHistory.slice(0,30);if(!state.completed.includes(url))state.completed.push(url);
    mistakes.forEach(tag=>{if(!tag)return;const existing=state.mistakes.find(x=>x.tag===tag);if(existing)existing.count=(existing.count||1)+1;else state.mistakes.push({tag,title,url,count:1,time:new Date().toISOString()});});
    state.mistakes=state.mistakes.slice(0,40);markLearningActivity();write(state);
  }
  function recordComplete(id){if(!state.completed.includes(id)){state.completed.push(id);markLearningActivity();write(state);}}
  function activityHooks(){document.addEventListener('click',e=>{const mystery=e.target.closest('.item button');if(mystery&&page==='mysteries.html')recordComplete('mystery:'+mystery.closest('.item').id);const journey=e.target.closest('#foodList [data-id]');if(journey)recordComplete('journey:'+journey.dataset.id);});}
  function pwa(){if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js').catch(()=>{}));let prompt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();prompt=e;const tools=document.getElementById('fl-utility-menu');if(!tools||document.getElementById('lw-install'))return;const button=document.createElement('button');button.id='lw-install';button.className='fl-menu-action';button.innerHTML='⬇ Install';tools.append(button);button.addEventListener('click',async()=>{if(!prompt)return;await prompt.prompt();prompt=null;button.remove();});});}
  window.LearnWithUs={recordQuiz,recordComplete,getState:()=>JSON.parse(JSON.stringify(state)),getRecommendations:()=>recommendations().map(x=>({title:x[0],url:x[1],icon:x[2]})),getDailyChallenge:()=>{const x=dailyChallenge();return x?{title:x[0],url:x[1],icon:x[2]}:null}};
  function startFeature(name,feature){try{feature();}catch(error){console.error('LearnWithUs '+name+' could not start:',error);}}
  // Render progress first so an unrelated optional feature can never leave the
  // dashboard on its static fallback. Each feature then starts independently.
  startFeature('accessibility',applyAccessibility);
  startFeature('dashboard',dashboard);
  startFeature('header tools',injectHeader);
  startFeature('settings',accessibilityPanel);
  startFeature('bookmarks',injectBookmark);
  startFeature('breadcrumbs',injectBreadcrumb);
  startFeature('search',searchModal);
  startFeature('visit history',recordVisit);
  startFeature('home learning hub',homeHub);
  startFeature('activity tracking',activityHooks);
  startFeature('analytics consent',consent);
  startFeature('install support',pwa);
  startFeature('learning timer',learningTimer);
})();
