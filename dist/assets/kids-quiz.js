'use strict';
(() => {
  function saveQuiz(title,score,total,url){
    if(window.LearnWithUs?.recordQuiz){window.LearnWithUs.recordQuiz(title,score,total,url);return;}
    try{const key='learnwithus.platform.v1',state=JSON.parse(localStorage.getItem(key)||'{}')||{};state.quizHistory=Array.isArray(state.quizHistory)?state.quizHistory:[];state.completed=Array.isArray(state.completed)?state.completed:[];state.quizHistory.unshift({title,score,total,url,time:new Date().toISOString()});state.quizHistory=state.quizHistory.slice(0,30);if(!state.completed.includes(url))state.completed.push(url);localStorage.setItem(key,JSON.stringify(state));}catch{}
  }
  const {letters,ranges,letterName,numberName,lessonLink,letterStyles,normalizeLetterStyle}=window.LEARNWITHUS_KIDS;
  const ids=['kidSetup','kidSetupTitle','kidOptions','kidOptionsTitle','kidStyleLabel','kidRangeLabel','kidStyle','kidRange','kidStart','kidRound','kidCategoryName','kidCounter','kidScoreCount','kidProgress','kidPromptLabel','kidPrompt','kidFeedback','kidAnswerStatus','kidHear','kidAccent','kidNext','kidChange','kidResults','kidResultScore','kidResultTitle','kidResultMessage','kidScoreCard','kidReviewTitle','kidStudyLinks','kidRetry','kidChooseAnother','kidAudioBar','kidAudioStatus','kidStopAudio','kidCursiveNotice'];
  const ui=Object.fromEntries(ids.map(id=>[id,document.getElementById(id)]));
  const audio=window.createKidsAudio({status:ui.kidAudioStatus,stopButton:ui.kidStopAudio});
  const judgeButtons=[...document.querySelectorAll('[data-judge]')];
  let category=null,stage='setup',style='upper',range='0-20',deck=[],answers=[],index=0,fontReady=false;
  function focus(el){el.focus({preventScroll:true});el.scrollIntoView({block:'start',behavior:'auto'});}
  function score(){return answers.filter(answer=>answer.correct).length;}
  function choose(value,move=true){
    if(!['letters','numbers'].includes(value))return;
    category=value;audio.stop();
    document.querySelectorAll('[data-kid-category]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.kidCategory===value)));
    ui.kidOptions.hidden=false;ui.kidStyleLabel.hidden=value!=='letters';ui.kidRangeLabel.hidden=value!=='numbers';
    ui.kidOptionsTitle.textContent=value==='letters'?'Choose your letter style':'Choose your number range';
    ui.kidStart.textContent='Start the '+(value==='letters'?'letter':'number')+' quiz →';
    if(move){const url=new URL(location.href);url.searchParams.set('category',value);history.replaceState({},'',url);window.dispatchEvent(new Event('learning-view-change'));focus(ui.kidOptionsTitle);}
  }
  function shuffle(items){
    const result=[...items];
    for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result.slice(0,10);
  }
  function start(){
    if(!category||stage==='round')return;
    style=normalizeLetterStyle(ui.kidStyle.value);
    range=ranges.includes(ui.kidRange.value)?ui.kidRange.value:'0-20';
    const [min,max]=range.split('-').map(Number);
    deck=shuffle(category==='letters'?letters.map(item=>item.letter):Array.from({length:max-min+1},(_,i)=>min+i));
    answers=[];index=0;stage='round';ui.kidSetup.hidden=true;ui.kidResults.hidden=true;ui.kidRound.hidden=false;renderQuestion();
  }
  function renderQuestion(){
    audio.stop();const value=deck[index],isLetter=category==='letters';
    ui.kidCategoryName.textContent=isLetter?'Letter quiz':'Number quiz · '+range.replace('-','–');
    ui.kidCounter.textContent='Question '+(index+1)+' of '+deck.length;ui.kidScoreCount.textContent='Recognised: '+score();ui.kidProgress.value=answers.length;
    ui.kidPromptLabel.textContent=isLetter?'Which letter is this?':'Which number is this?';
    ui.kidPrompt.textContent=isLetter&&letterStyles[style].lower?value.toLowerCase():String(value);
    ui.kidPrompt.className='kid-prompt'+(isLetter&&letterStyles[style].cursive?' cursive-prompt':'');
    ui.kidCursiveNotice.hidden=!(isLetter&&letterStyles[style].cursive&&!fontReady);
    ui.kidFeedback.hidden=true;ui.kidAudioBar.hidden=true;ui.kidAnswerStatus.textContent='';ui.kidNext.disabled=true;
    ui.kidNext.textContent=index===deck.length-1?'See our progress →':'Next one →';judgeButtons.forEach(button=>button.disabled=false);focus(ui.kidPrompt);
  }
  function judge(correct){
    if(stage!=='round'||answers.length!==index)return;
    const value=deck[index];answers.push({value,correct});judgeButtons.forEach(button=>button.disabled=true);
    ui.kidScoreCount.textContent='Recognised: '+score();ui.kidProgress.value=answers.length;
    const name=category==='letters'?value:String(value)+' ('+numberName(value)+')';
    ui.kidAnswerStatus.textContent=(correct?'You knew this one! ':'Every try helps. This is ')+name+'. '+(correct?'Keep that curiosity going.':'Hear it together, then have another go out loud.');
    ui.kidFeedback.hidden=false;ui.kidAudioBar.hidden=false;ui.kidNext.disabled=false;
  }
  function studyCard(title,text,links){
    const article=document.createElement('article'),heading=document.createElement('h4'),p=document.createElement('p'),row=document.createElement('div');
    heading.textContent=title;p.textContent=text;row.className='kid-practice-links';
    for(const [label,href] of links){const a=document.createElement('a');a.textContent=label+' →';a.href=href;a.target='_blank';a.rel='noopener';row.append(a);}
    article.append(heading,p,row);return article;
  }
  function results(){
    stage='results';audio.stop();ui.kidRound.hidden=true;ui.kidResults.hidden=false;ui.kidAudioBar.hidden=true;
    const total=deck.length,correct=score(),band=correct>=8?'high':correct>=5?'middle':'starting',noun=category==='letters'?'letters':'numbers';
    ui.kidResults.dataset.band=band;ui.kidResultScore.textContent=correct+'/'+total;
    ui.kidResultTitle.textContent=band==='high'?'Wonderful work, curious learner!':band==='middle'?'You’re getting there, one step at a time.':'Every try is a new beginning.';
    ui.kidResultMessage.textContent='Your grown-up marked '+correct+' of '+total+' '+noun+' as recognised. '+(band==='high'?'Revisit any tricky ones, then explore something new together.':band==='middle'?'You already know some of these. Practise the cards below, say them aloud, and try another round when you feel ready.':'Pick just two or three cards below. Look, listen and say them together. Small, relaxed practice sessions are a good next step.');
    window.renderLearnWithUsScoreCard({container:ui.kidScoreCard,score:correct,total,title:(category==='letters'?'Letter':'Number')+' quiz complete!',subtitle:ui.kidResultTitle.textContent,filename:'learnwithus-kids-quiz-score.svg',url:'kids-quiz.html?category='+category});
    saveQuiz((category==='letters'?'Letter':'Number')+' quiz',correct,total,'kids-quiz.html?category='+category);
    const missed=answers.filter(answer=>!answer.correct);ui.kidReviewTitle.textContent=missed.length?'Let’s practise these together':'Ready for your next discovery?';ui.kidStudyLinks.replaceChildren();
    for(const {value} of missed){
      const letter=category==='letters';
      const links=letter?[['Hear '+value+' and practise',lessonLink('letters',value,style)],['See its picture word',lessonLink('words',value)]]:[['Hear '+value+' and count',lessonLink('numbers',value,'upper',range)]];
      ui.kidStudyLinks.append(studyCard(letter?'Let’s revisit '+value:'Let’s revisit '+value+' · '+numberName(value),letter?'The link opens this exact letter in the alphabet.':'The link opens this number with its name and counting aid.',links));
    }
    if(category==='letters'){
      ui.kidStudyLinks.append(studyCard(correct>=8?'Next: letters become picture words':'A friendly place to begin','Look at an apple, hear “A for Apple,” and connect the letter to its picture.',[['Open A for Apple',lessonLink('words','A')],['Practise the alphabet',lessonLink('letters','A',style)]]));
    }else{
      const next=correct>=8?(range==='0-20'?'21-50':range==='21-50'?'51-100':range):range;
      const startNumber=Number(next.split('-')[0]);
      ui.kidStudyLinks.append(studyCard(next!==range?'Next: a new number range':'Keep counting together',next!==range?'Take a look at the next group of numbers before trying another quiz.':'Point to each counting aid and say the number name together.',[['Open '+next.replace('-','–')+' number cards',lessonLink('numbers',startNumber,'upper',next)]]));
    }
    focus(ui.kidResultTitle);
  }
  function reset(){
    audio.stop();stage='setup';category=null;answers=[];deck=[];index=0;ui.kidSetup.hidden=false;ui.kidRound.hidden=true;ui.kidResults.hidden=true;ui.kidAudioBar.hidden=true;ui.kidOptions.hidden=true;
    document.querySelectorAll('[data-kid-category]').forEach(button=>button.setAttribute('aria-pressed','false'));
    const url=new URL(location.href);['category','range','style'].forEach(key=>url.searchParams.delete(key));history.replaceState({},'',url);window.dispatchEvent(new Event('learning-view-change'));focus(ui.kidSetupTitle);
  }
  document.querySelectorAll('[data-kid-category]').forEach(button=>button.addEventListener('click',()=>{if(stage==='setup')choose(button.dataset.kidCategory);}));
  judgeButtons.forEach(button=>button.addEventListener('click',()=>judge(button.dataset.judge==='correct')));
  ui.kidStart.addEventListener('click',start);ui.kidRetry.addEventListener('click',start);
  ui.kidNext.addEventListener('click',()=>{if(stage!=='round'||answers.length!==index+1)return;if(index===deck.length-1)results();else{index++;renderQuestion();}});
  ui.kidChange.addEventListener('click',reset);ui.kidChooseAnother.addEventListener('click',reset);
  ui.kidHear.addEventListener('click',()=>{if(stage!=='round'||answers.length!==index+1)return;const value=deck[index];audio.speak(category==='letters'?letterName(value,ui.kidAccent.value):numberName(value),String(value),ui.kidAccent.value);});
  ui.kidAccent.addEventListener('change',()=>audio.stop());
  const params=new URLSearchParams(location.search);
  ui.kidStyle.value=normalizeLetterStyle(params.get('style'));
  if(ranges.includes(params.get('range')))ui.kidRange.value=params.get('range');
  choose(params.get('category'),false);
  if(document.fonts){document.fonts.load('40px Playwrite','Aa').then(faces=>{fontReady=faces.length>0;if(fontReady)ui.kidCursiveNotice.hidden=true;else ui.kidCursiveNotice.textContent='The handwriting font could not load. Choose Capitals or Small letters to practise, or reload for cursive.';}).catch(()=>{ui.kidCursiveNotice.textContent='The handwriting font could not load. Choose another letter style or reload for cursive.';});}
  else ui.kidCursiveNotice.textContent='This browser cannot confirm the handwriting font. Choose another letter style if cursive does not appear.';
})();
