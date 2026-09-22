'use strict';
(() => {
  const STORE='learnwithus.platform.v1';
  const empty=()=>({preferences:{age:'all',language:'en'},recent:[],bookmarks:[],visited:{},quizHistory:[],completed:[],analytics:null});
  function read(){try{return Object.assign(empty(),JSON.parse(localStorage.getItem(STORE)||'{}'));}catch{return empty();}}
  function write(data){try{localStorage.setItem(STORE,JSON.stringify(data));}catch{}}
  let state=read();
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
    ['Picture words','A for Apple picture learning','children.html?mode=words','Kids','🖼️'],
    ['Numbers','Count from 0 to 100','children.html?mode=numbers','Kids','🔢'],
    ['Animals','Pictures and spoken animal names','children.html?mode=animals','Kids','🦁'],
    ['Hindi letters','See and hear a Devanagari letter grid','hindi.html','Kids','अ'],
    ['Telugu letters','See and hear a Telugu letter grid','telugu.html','Kids','అ'],
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
      if(mode==='words')return {title:letter?'Picture words · Letter '+letter.toUpperCase():'Picture words',detail:letter?'A picture-word card beginning with '+letter.toUpperCase():'Pictures, letters and spoken words'};
      if(mode==='numbers')return {title:'Numbers',detail:'Number names and counting practice'};
      if(mode==='animals')return {title:'Animals',detail:'Animal pictures and spoken names'};
    }
    if(page==='hindi.html')return {title:'Hindi letters',detail:'Hindi letters in familiar reading rows with matching Hindi speech'};
    if(page==='telugu.html')return {title:'Telugu letters',detail:'Telugu letters in familiar reading rows with matching Telugu speech'};
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
    const top=document.querySelector('.fl-topbar');if(!top)return;
    const tools=document.createElement('div');tools.className='lw-header-tools';tools.innerHTML='<button class="lw-tool" id="lw-search-open" type="button" aria-label="Search all learning topics">⌕ <span>Search</span></button><a class="lw-tool lw-learning-link" href="dashboard.html" aria-label="Open my learning dashboard"'+(page==='dashboard.html'?' aria-current="page"':'')+'>📊 <span>My learning</span></a>';
    top.insertBefore(tools,document.querySelector('.fl-menu-toggle'));
  }
  function injectBookmark(){if(['index.html','dashboard.html','contact.html','privacy.html','404.html'].includes(page))return;const bar=document.createElement('div');bar.className='lw-bookmark-bar';bar.innerHTML='<button id="lw-bookmark" type="button" aria-pressed="false">☆ <span>Save</span></button>';document.body.append(bar);bar.querySelector('button').addEventListener('click',saveBookmark);updateBookmark();}
  function injectBreadcrumb(){if(['index.html','dashboard.html','404.html'].includes(page))return;const main=document.querySelector('main');if(!main)return;const area=document.body.dataset.area||'';const parent=area==='kids'?['Kids Corner','children.html']:area==='health'?['Health guides','health.html']:area==='food'||['catalog.html','mysteries.html','journeys.html','quiz.html'].includes(page)?['Food discoveries','food.html']:null;const nav=document.createElement('nav');nav.className='lw-breadcrumb';nav.setAttribute('aria-label','Breadcrumb');nav.innerHTML='<a href="index.html">Home</a>'+(parent?'<span>›</span><a href="'+parent[1]+'">'+parent[0]+'</a>':'')+'<span>›</span><strong>'+safe(labelForCurrent())+'</strong>';main.before(nav);}
  function searchModal(){
    const modal=document.createElement('div');modal.className='lw-modal';modal.hidden=true;modal.innerHTML='<section class="lw-modal-panel" role="dialog" aria-modal="true" aria-labelledby="lw-search-title"><div class="lw-modal-head"><label id="lw-search-title" class="sr-only" for="lw-global-search">Search all learning topics</label><input id="lw-global-search" type="search" autocomplete="off" placeholder="Search food, letters, health, quizzes…"><button class="lw-close" type="button" aria-label="Close search">×</button></div><p class="lw-search-help">Try “iron”, “animals”, “heart”, “banana” or “quiz”.</p><div class="lw-results" id="lw-results"></div></section>';document.body.append(modal);
    const input=modal.querySelector('input'),results=modal.querySelector('.lw-results');
    function render(){const q=normal(input.value.trim()),tokens=q.split(/\s+/).filter(Boolean);let rows=records.filter(row=>tokens.every(token=>normal(row.slice(0,4).join(' ')).includes(token))).slice(0,18);if(!q)rows=records.slice(0,10);results.innerHTML=rows.map(row=>'<a class="lw-result" href="'+row[2]+'"><span class="lw-result-icon" aria-hidden="true">'+row[4]+'</span><span><strong>'+row[0]+'</strong><small>'+row[1]+'</small></span><span class="lw-result-type">'+row[3]+'</span></a>').join('')||'<p class="lw-empty">No result yet. Try a shorter word or another spelling.</p>';}
    function open(){modal.hidden=false;render();setTimeout(()=>input.focus(),0);document.documentElement.style.overflow='hidden';}
    function close(){modal.hidden=true;document.documentElement.style.overflow='';document.getElementById('lw-search-open')?.focus();}
    document.getElementById('lw-search-open')?.addEventListener('click',open);modal.querySelector('.lw-close').addEventListener('click',close);modal.addEventListener('click',e=>{if(e.target===modal)close();});input.addEventListener('input',render);document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open();}if(e.key==='Escape'&&!modal.hidden)close();});
  }
  function loadAnalytics(){
    if(document.querySelector('script[data-learnwithus-ga]'))return;
    const id='G-14CDXN6DDM';window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};window.gtag('js',new Date());window.gtag('config',id,{anonymize_ip:true});
    const tag=document.createElement('script');tag.async=true;tag.src='https://www.googletagmanager.com/gtag/js?id='+id;tag.dataset.learnwithusGa=id;document.head.append(tag);
  }
  function consent(){
    if(state.analytics==='granted'){loadAnalytics();return;}if(state.analytics==='denied')return;
    const box=document.createElement('aside');box.className='lw-consent';box.innerHTML='<h2>Your privacy choices</h2><p>Allow anonymous Google Analytics to help us understand which learning pages are useful. Learning progress stays only on this device. No names, quiz answers or voice recordings are sent.</p><div class="lw-consent-actions"><button class="accept" type="button">Allow anonymous analytics</button><button class="decline" type="button">Not now</button><a href="privacy.html">Learn more</a></div>';document.body.append(box);
    box.querySelector('.accept').addEventListener('click',()=>{state.analytics='granted';write(state);loadAnalytics();box.remove();toast('Analytics preference saved');});box.querySelector('.decline').addEventListener('click',()=>{state.analytics='denied';write(state);box.remove();toast('Analytics remains off');});
  }
  function recommendations(){
    const age=state.preferences.age;
    const map={preschool:[['Hear animal names','children.html?mode=animals','🦁'],['Explore picture words','children.html?mode=words','🍎'],['Practise English letters','children.html?mode=letters','🔤'],['Count the first numbers','children.html?mode=numbers','🔢']],primary:[['Practise numbers','children.html?mode=numbers','🔢'],['Solve a food mystery','mysteries.html','🧪'],['Try a kids letter quiz','kids-quiz.html?category=letters','⭐'],['Learn how digestion works','journeys.html','🧭']],teens:[['Try the medium food quiz','quiz.html?level=medium','🏆'],['Follow digestion','journeys.html','🧭'],['Compare two foods','food.html#compare','⚖️'],['Explore a body guide','health.html','🫀']],adults:[['Compare foods','food.html#compare','⚖️'],['Explore health guides','health.html','🫀'],['Read food data carefully','food.html#sources','📚'],['Test food knowledge','quiz.html?level=medium','🏆']],all:[['Discover a food mystery','mysteries.html','🧪'],['Explore your body','health.html','🧠'],['Learn with picture words','children.html?mode=words','🍎'],['Compare foods','food.html#compare','⚖️']]};return map[age]||map.all;
  }
  function homeHub(){
    if(page!=='index.html')return;const paths=document.querySelector('.home-paths');if(!paths)return;const rec=recommendations(),last=state.recent.find(x=>x.url!=='index.html');const visited=Object.keys(state.visited).length,quizCount=state.quizHistory.length,completed=state.completed.length;
    const ageNames={all:'everyone',preschool:'preschool learners',primary:'primary learners',teens:'teen learners',adults:'adult learners'},today=new Date(),daily=rec[(today.getFullYear()*372+today.getMonth()*31+today.getDate())%rec.length];
    const hub=document.createElement('section');hub.className='lw-home-hub';hub.setAttribute('aria-label','Your learning hub');hub.innerHTML='<div class="lw-hub-top"><article class="lw-panel"><h2>'+(last?'Continue learning':'Start your first discovery')+'</h2><p>'+(last?'Pick up where you left off: '+safe(last.title)+'. '+safe(last.detail||''):'Choose a short activity and build your learning one step at a time.')+'</p><a class="lw-primary-link" href="'+(last?safe(last.url):daily[1])+'">'+(last?'Continue →':'Open activity →')+'</a></article><article class="lw-panel lw-today"><p class="lw-panel-kicker">Daily recommendation</p><h2>Today’s idea for '+ageNames[state.preferences.age]+'</h2><h3>'+daily[2]+' '+daily[0]+'</h3><p>This choice changes with the selected learner and rotates on each new calendar day.</p><a class="lw-primary-link" href="'+daily[1]+'">Open activity →</a></article></div><article class="lw-panel"><h2>Choose the learner</h2><p>Select an age group to receive suitable starting topics and quizzes. The choice changes Today’s idea and Recommended next on My learning.</p><div class="lw-pref-row"><label>Age group<select id="lw-age"><option value="all">Everyone</option><option value="preschool">Preschool · 2–4</option><option value="primary">Primary · 5–12</option><option value="teens">Teens</option><option value="adults">Adults</option></select></label><label>Language<select id="lw-language"><option value="en">English</option><option value="hi">हिन्दी · Hindi</option><option value="te">తెలుగు · Telugu</option></select></label></div><div class="lw-recommendation-list">'+rec.map(x=>'<a href="'+x[1]+'"><span>'+x[2]+'</span><strong>'+x[0]+'</strong></a>').join('')+'</div></article><article class="lw-panel"><h2>Your progress preview</h2><div class="lw-progress-grid"><div class="lw-stat"><b>'+visited+'</b>topics explored</div><div class="lw-stat"><b>'+quizCount+'</b>quiz attempts</div><div class="lw-stat"><b>'+completed+'</b>activities completed</div></div><p><a href="dashboard.html">Open full learning dashboard →</a></p></article>';
    paths.after(hub);const age=hub.querySelector('#lw-age'),language=hub.querySelector('#lw-language');age.value=state.preferences.age;language.value=state.preferences.language;age.addEventListener('change',()=>{state.preferences.age=age.value;write(state);location.reload();});language.addEventListener('change',()=>{state.preferences.language=language.value;write(state);if(language.value==='hi')location.href='hindi.html';if(language.value==='te')location.href='telugu.html';});
  }
  function dashboard(){
    if(page!=='dashboard.html')return;const root=document.getElementById('learningDashboard');if(!root)return;const recent=state.recent.filter(x=>x.url!=='dashboard.html'),bookmarks=state.bookmarks,quiz=state.quizHistory.slice(0,10),rec=recommendations();
    const list=items=>items.length?'<div class="lw-mini-list">'+items.map(x=>'<a href="'+safe(x.url)+'"><strong>'+safe(x.title)+'</strong><small>'+safe(x.detail||'Open this learning activity')+(x.time?' · '+new Date(x.time).toLocaleDateString():'')+'</small><span aria-hidden="true">→</span></a>').join('')+'</div>':'<p>Nothing here yet. Explore a topic and it will appear automatically.</p>';
    root.innerHTML='<h1>My learning</h1><p>Your private learning overview is stored only in this browser. No account or public profile is required.</p><div class="lw-dashboard-grid"><article class="lw-panel"><h2>Recommended next</h2>'+list(rec.map(x=>({title:x[2]+' '+x[0],url:x[1]})))+'</article><article class="lw-panel"><h2>Progress</h2><div class="lw-progress-grid"><div class="lw-stat"><b>'+Object.keys(state.visited).length+'</b>topics</div><div class="lw-stat"><b>'+state.quizHistory.length+'</b>quizzes</div><div class="lw-stat"><b>'+state.completed.length+'</b>completed</div></div></article><article class="lw-panel"><h2>Recently viewed</h2>'+list(recent)+'</article><article class="lw-panel"><h2>Saved for later</h2>'+list(bookmarks)+'</article><article class="lw-panel wide"><h2>Quiz history</h2>'+(quiz.length?'<div class="lw-mini-list">'+quiz.map(x=>'<a href="'+x.url+'">'+x.title+': '+x.score+'/'+x.total+' · '+new Date(x.time).toLocaleDateString()+'</a>').join('')+'</div>':'<p>Your food and kids quiz results will appear here after the next completed quiz.</p>')+'</article><article class="lw-panel wide" id="parents"><h2>For parents</h2><p>Choose short practice sessions, let the child answer aloud and use encouragement rather than pressure. This device-only dashboard avoids public child profiles.</p><a class="lw-primary-link" href="children.html">Choose a kids activity →</a></article><article class="lw-panel" id="students"><h2>For students</h2><p>Use mysteries for predictions, journeys for sequences and quizzes to review what you missed.</p><a class="lw-primary-link" href="mysteries.html">Start a mystery →</a></article><article class="lw-panel" id="teachers"><h2>For teachers</h2><p>Project a mystery, ask learners to predict first, reveal the explanation and finish with a related quiz. Printable worksheets and assignment tools are planned next.</p><a class="lw-primary-link" href="quiz.html">Choose a quiz →</a></article><article class="lw-panel wide"><h2>Privacy and reset</h2><p>Clearing progress removes bookmarks, history, preferences and scores stored by LearnWithUs on this browser. It does not delete Google Analytics data already collected with consent.</p><button class="lw-clear" id="lw-clear-progress" type="button">Clear local learning progress</button></article></div>';
    document.getElementById('lw-clear-progress').addEventListener('click',()=>{if(confirm('Clear all LearnWithUs progress saved on this device?')){const analytics=state.analytics;state=empty();state.analytics=analytics;write(state);location.reload();}});
  }
  function recordQuiz(title,score,total,url=relative){state.quizHistory.unshift({title,score,total,url,time:new Date().toISOString()});state.quizHistory=state.quizHistory.slice(0,30);if(!state.completed.includes(url))state.completed.push(url);write(state);}
  function recordComplete(id){if(!state.completed.includes(id)){state.completed.push(id);write(state);}}
  function activityHooks(){document.addEventListener('click',e=>{const mystery=e.target.closest('.item button');if(mystery&&page==='mysteries.html')recordComplete('mystery:'+mystery.closest('.item').id);const journey=e.target.closest('#foodList [data-id]');if(journey)recordComplete('journey:'+journey.dataset.id);});}
  function pwa(){if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js').catch(()=>{}));let prompt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();prompt=e;const tools=document.querySelector('.lw-header-tools');if(!tools||document.getElementById('lw-install'))return;const button=document.createElement('button');button.id='lw-install';button.className='lw-tool';button.innerHTML='⬇ <span>Install</span>';tools.append(button);button.addEventListener('click',async()=>{if(!prompt)return;await prompt.prompt();prompt=null;button.remove();});});}
  window.LearnWithUs={recordQuiz,recordComplete,getState:()=>JSON.parse(JSON.stringify(state))};
  injectHeader();injectBookmark();injectBreadcrumb();searchModal();recordVisit();homeHub();dashboard();activityHooks();consent();pwa();
})();
