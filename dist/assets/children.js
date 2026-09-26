'use strict';
(() => {
  const {letters,animals,ranges,numberName,letterName,letterStyles,normalizeLetterStyle}=window.LEARNWITHUS_KIDS;
  const ids=['choices','chooseTitle','practice','practiceTitle','backChoices','letterControls','numberControls','numberRange','accent','learningGrid','practiceHint','fontStatus','previous','nextPage','pageStatus','learningPager','audioStatus','stopAudio','finishNote','cardCount','practiceQuiz'];
  const ui=Object.fromEntries(ids.map(id=>[id,document.getElementById(id)]));
  const speaker='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/></svg>';
  const audio=window.createKidsAudio({status:ui.audioStatus,stopButton:ui.stopAudio});
  let mode='letters',style='upper',page=0,cards=[],cursiveReady=false;
  function items(){
    if(mode==='animals')return animals;
    if(mode!=='numbers')return letters;
    const [start,end]=ui.numberRange.value.split('-').map(Number);
    return Array.from({length:end-start+1},(_,i)=>start+i);
  }
  function batches(){
    const all=items();
    if(mode==='words')return [all];
    if(mode==='numbers')return Array.from({length:Math.ceil(all.length/20)},(_,i)=>all.slice(i*20,i*20+20));
    return [all];
  }
  function pageForIndex(index){return mode==='numbers'?Math.floor(index/20):0;}
  function focus(el){if(!el)return;el.focus({preventScroll:true});el.scrollIntoView({block:'start',behavior:'auto'});}
  function quantity(n){
    if(n===0)return '<span class="place-value">Zero means none</span>';
    if(n<=10)return '<span class="quantity" role="img" aria-label="'+n+' counting dots">'+Array.from({length:n},()=>'<i class="dot" aria-hidden="true"></i>').join('')+'</span>';
    return '<span class="place-value">'+(n===100?'1 hundred':Math.floor(n/10)+' tens + '+n%10+' ones')+'</span>';
  }
  function render(){
    audio.stop();
    const pages=batches(),letterStyle=letterStyles[style];
    page=Math.max(0,Math.min(page,pages.length-1));cards=pages[page];
    ui.letterControls.hidden=mode!=='letters';ui.numberControls.hidden=mode!=='numbers';
    ui.practiceTitle.textContent=mode==='letters'?'Let’s learn letters':mode==='words'?'Letters become picture words':mode==='animals'?'Meet the animals':'Let’s learn numbers';
    ui.cardCount.textContent=mode==='letters'?'All 26 letters':mode==='words'?'All 26 picture words':mode==='animals'?animals.length+' animals together':'20 numbers per page';
    ui.letterControls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.style===style)));
    ui.practiceHint.textContent=mode==='animals'?'Look at each picture. Tap the speaker to hear only the animal’s name, then say it together.':mode==='numbers'?'Hear the number name, say it aloud, then explore how many it means.':mode==='words'?'Look at the picture, then hear and say the full phrase: A for Apple.':letterStyle.cursive?'Practise cursive '+(letterStyle.lower?'small letters':'capitals')+', one letter per card. Hear just the letter name.':'All letters from A to Z are here. Hear just the letter name, then say it yourself.';
    ui.fontStatus.hidden=mode!=='letters'||!letterStyle.cursive||cursiveReady;
    ui.learningGrid.className='learning-grid '+(mode==='letters'?'alphabet-grid':mode==='words'?'picture-words':mode==='animals'?'animal-cards':'number-cards');
    ui.learningGrid.innerHTML=cards.map((item,i)=>{
      if(mode==='animals')return '<article id="animal-'+item.id+'" class="learning-card animal-card" tabindex="-1"><img class="animal-picture" src="'+item.image+'" alt="'+item.name+'" width="150" height="150"><h3 class="animal-name">'+item.name+'</h3><button type="button" class="hear-button" data-hear="'+i+'" aria-label="Hear '+item.name+'">'+speaker+'<span>Hear the name</span></button></article>';
      const number=mode==='numbers',wordMode=mode==='words';
      const glyph=number?item:letterStyle.lower&&!wordMode?item.letter.toLowerCase():item.letter;
      const label=number?'Number':wordMode?'Picture word':letterStyle.label;
      const id=number?'number-'+item:(wordMode?'word-':'letter-')+item.letter;
      const picture=wordMode?'<img class="word-picture" src="'+item.image+'" alt="'+item.word+'" width="150" height="150">':'';
      const description=number?'<p class="card-word">'+numberName(item)+'</p><div class="quantity">'+quantity(item)+'</div>':wordMode?'<p class="card-word">'+item.letter+' for '+item.word+'</p>':'';
      return '<article id="'+id+'" class="learning-card" tabindex="-1"><span class="card-label">'+label+'</span><h3 class="glyph '+(number?'number':wordMode?'word-letter':letterStyle.cursive?'cursive':'')+'">'+glyph+'</h3>'+picture+description+'<button type="button" class="hear-button" data-hear="'+i+'" aria-label="Hear '+(number?item:wordMode?item.letter+' for '+item.word:item.letter)+'">'+speaker+'<span>'+(wordMode?'Hear the phrase':'Hear it')+'</span></button></article>';
    }).join('');
    const first=cards[0],last=cards[cards.length-1];
    const span=mode==='numbers'?first+'–'+last:mode==='animals'?first.name+'–'+last.name:first.letter+'–'+last.letter;
    ui.pageStatus.textContent=span+' · Page '+(page+1)+' of '+pages.length;
    ui.learningPager.hidden=pages.length===1;
    ui.previous.disabled=page===0;ui.nextPage.disabled=page===pages.length-1;
    ui.nextPage.textContent=mode==='numbers'&&page<pages.length-1?'Next '+pages[page+1].length+' numbers →':'Next →';
    ui.finishNote.hidden=page!==pages.length-1;
    ui.finishNote.innerHTML=mode==='letters'?'<strong>From A all the way to Z!</strong><p>Ready to match letters with pictures?</p><button type="button" class="primary-button" data-next-mode="words">Next: A for Apple →</button>':mode==='words'?'<strong>Wonderful exploring!</strong><p>Say your favourite picture words again, or try naming letters with a grown-up.</p>':mode==='animals'?'<strong>You’ve met '+animals.length+' animals!</strong><p>Choose your favourite. Can you remember its name before tapping the speaker?</p>':'<strong>Look how far you’ve counted!</strong><p>Practise a favourite number again, or try a number quiz together.</p>';
    ui.practiceQuiz.parentElement.hidden=mode==='animals';
    ui.practiceQuiz.href='kids-quiz.html?category='+(mode==='numbers'?'numbers':'letters')+(mode==='numbers'?'&range='+ui.numberRange.value:'&style='+style);
    ui.practiceQuiz.textContent=mode==='numbers'?'Try the number quiz →':'Try the letter quiz →';
  }
  function setURL(choices=false){
    const url=new URL(location.href);['mode','style','letter','number','range','animal'].forEach(key=>url.searchParams.delete(key));
    if(choices){url.hash='choices';}
    else{
      url.searchParams.set('mode',mode);
      if(mode==='numbers'){url.searchParams.set('range',ui.numberRange.value);url.searchParams.set('number',String(cards[0]));}
      else if(mode==='animals'){url.searchParams.set('animal',cards[0].id);}
      else{url.searchParams.set('letter',cards[0].letter);if(mode==='letters')url.searchParams.set('style',style);}
      url.hash='practice';
    }
    if(url.href!==location.href)history.pushState({},'',url);
    window.dispatchEvent(new Event('learning-view-change'));
  }
  function showChoices(changeURL=false){
    audio.stop();ui.practice.hidden=true;ui.choices.hidden=false;document.querySelector('.kids-intro').hidden=false;
    document.getElementById('kids-quiz-choices').hidden=false;if(changeURL){setURL(true);focus(ui.chooseTitle);}
  }
  function openMode(value,changeURL=true){
    mode=value;page=0;ui.choices.hidden=true;ui.practice.hidden=false;document.querySelector('.kids-intro').hidden=true;
    document.getElementById('kids-quiz-choices').hidden=true;render();if(changeURL){setURL();focus(ui.practiceTitle);}
  }
  function fromURL(){
    const params=new URLSearchParams(location.search),value=params.get('mode');
    if(!['letters','words','numbers','animals'].includes(value)){showChoices();return;}
    style=normalizeLetterStyle(params.get('style'));
    ui.numberRange.value=ranges.includes(params.get('range'))?params.get('range'):'0-100';openMode(value,false);
    let target=null;
    if(mode==='numbers'){
      const raw=params.get('number'),n=raw&&/^\d{1,3}$/.test(raw)?Number(raw):null,index=items().indexOf(n);
      if(index>=0){page=pageForIndex(index);target='number-'+n;}
    }else if(mode==='animals'){
      const animal=animals.find(item=>item.id===params.get('animal'));
      if(animal)target='animal-'+animal.id;
    }else{
      const letter=(params.get('letter')||'').toUpperCase(),index=letters.findIndex(item=>item.letter===letter);
      if(index>=0){page=pageForIndex(index);target=(mode==='words'?'word-':'letter-')+letter;}
    }
    render();focus(target?document.getElementById(target):ui.practiceTitle);
  }
  document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>openMode(button.dataset.mode)));
  ui.backChoices.addEventListener('click',()=>showChoices(true));
  ui.letterControls.addEventListener('click',e=>{const b=e.target.closest('[data-style]');if(!b)return;style=b.dataset.style;render();setURL();});
  ui.numberRange.addEventListener('change',()=>{page=0;render();setURL();});
  function changePage(delta){const pages=batches();if(page+delta<0||page+delta>=pages.length)return;page+=delta;render();setURL();focus(ui.practiceTitle);}
  ui.previous.addEventListener('click',()=>changePage(-1));ui.nextPage.addEventListener('click',()=>changePage(1));
  ui.accent.addEventListener('change',()=>audio.stop());
  ui.finishNote.addEventListener('click',e=>{const button=e.target.closest('[data-next-mode]');if(button)openMode(button.dataset.nextMode);});
  ui.learningGrid.addEventListener('click',e=>{
    const button=e.target.closest('[data-hear]');if(!button)return;
    const item=cards[Number(button.dataset.hear)],accent=ui.accent.value;
    if(mode==='animals'){audio.speak(item.name.toLowerCase(),item.name,accent,button.closest('.learning-card'));return;}
    const number=mode==='numbers',word=mode==='words';
    const spoken=number?numberName(item):letterName(item.letter,accent)+(word?' for '+item.word+'.':'');
    const label=number?numberName(item):item.letter+(word?' for '+item.word:'');
    audio.speak(spoken,label,accent,button.closest('.learning-card'));
  });
  window.addEventListener('popstate',fromURL);
  if(document.fonts){
    document.fonts.load('40px Playwrite','Aa').then(faces=>{cursiveReady=faces.length>0;ui.fontStatus.hidden=mode!=='letters'||!letterStyles[style].cursive||cursiveReady;if(!cursiveReady)ui.fontStatus.textContent='The handwriting font could not load. These are fallback letters; reload to see cursive.';}).catch(()=>{ui.fontStatus.textContent='The handwriting font could not load. Reload to see cursive.';});
  }else{ui.fontStatus.textContent='This browser cannot confirm the handwriting font. Use Capitals or Small letters if cursive does not appear.';}
  fromURL();
})();
