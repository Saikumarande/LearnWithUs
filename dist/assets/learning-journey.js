"use strict";
(()=>{
  const path=location.pathname.split('/').pop()||'index.html';
  const qs=new URLSearchParams(location.search);
  const routes={
    'addition.html':{title:'Addition',quiz:'math-quiz.html?topic=addition',next:'subtraction.html',nextLabel:'Subtraction'},
    'subtraction.html':{title:'Subtraction',quiz:'math-quiz.html?topic=subtraction',next:'multiplication.html',nextLabel:'Multiplication'},
    'multiplication.html':{title:'Multiplication',quiz:'math-quiz.html?topic=multiplication',next:'multiplication-tables.html?table=2',nextLabel:'Times Tables'},
    'division.html':{title:'Division',quiz:'math-quiz.html?topic=division',next:'fractions.html',nextLabel:'Fractions'},
    'place-value.html':{title:'Place Value',quiz:'math-quiz.html?topic=place-value',next:'odd-even.html',nextLabel:'Odd & Even'},
    'odd-even.html':{title:'Odd & Even',quiz:'math-quiz.html?topic=odd-even',next:'addition.html',nextLabel:'Addition'},
    'fractions.html':{title:'Fractions',quiz:'math-quiz.html?topic=fractions',next:'time-calendar.html',nextLabel:'Time & Calendar'},
    'time-calendar.html':{title:'Time & Calendar',quiz:'math-quiz.html?topic=time-calendar',next:'indian-money.html',nextLabel:'Indian Money'},
    'indian-money.html':{title:'Indian Money',quiz:'math-quiz.html?topic=indian-money',next:'measurement.html',nextLabel:'Measurement'},
    'measurement.html':{title:'Measurement',quiz:'math-quiz.html?topic=measurement',next:'children.html?mode=animals',nextLabel:'Animals'},
    'letter-tracing.html':{title:'Letter Tracing',quiz:'kids-quiz.html?category=letters',next:'early-learning.html?topic=poems',nextLabel:'Poems'},
    'word-bank.html':{title:'Picture Words',quiz:'spelling-quiz.html',secondary:'missing-letters-quiz.html',secondaryLabel:'Missing Letters Quiz',next:'letter-tracing.html',nextLabel:'Letter Tracing'},
    'india.html':{title:'India & Maps',quiz:'india-quiz.html',quizLabel:'Start State & Capital Quiz →',next:'hindi.html',nextLabel:'Hindi'},
    'hindi.html':{title:'Hindi Letters',quiz:'quiz-hub.html',quizLabel:'Open Quiz Hub →',next:'telugu.html',nextLabel:'Telugu'},
    'telugu.html':{title:'Telugu Letters',quiz:'quiz-hub.html',quizLabel:'Open Quiz Hub →',next:'stories.html',nextLabel:'Stories'},
    'stories.html':{title:'Story Comprehension',quiz:'story.html?story=clever-rabbit',quizLabel:'Start a Story & Questions →',next:'sports.html',nextLabel:'Sports & Games'},
    'creativity.html':{title:'Creativity',quiz:'quiz-hub.html',quizLabel:'Open Quiz Hub →',next:'life-skills.html',nextLabel:'Life Skills'},
    'kids-skills.html':{title:'Kids Learning Games',quiz:'quiz-hub.html',quizLabel:'Open Quiz Hub →',next:'games.html',nextLabel:'Learning Games'}
  };
  let route=routes[path];
  if(path==='early-learning.html'){
    const topic=qs.get('topic');
    if(topic==='colours') route={title:'Colours',quiz:'early-learning.html?topic=matching',quizLabel:'Start Picture Matching Quiz →',next:'early-learning.html?topic=shapes',nextLabel:'Shapes'};
    if(topic==='shapes') route={title:'Shapes',quiz:'early-learning.html?topic=matching',quizLabel:'Start Picture Matching Quiz →',next:'planets.html',nextLabel:'Planets'};
    if(topic==='poems') route={title:'Poems',quiz:'quiz-hub.html',quizLabel:'Open Quiz Hub →',next:'children.html?mode=numbers',nextLabel:'Numbers'};
  }
  if(!route)return;
  document.querySelectorAll('a').forEach(a=>{
    if(/back to kids corner/i.test(a.textContent||'')){
      const wrap=a.closest('p');
      if(wrap)wrap.remove(); else a.remove();
    }
  });
  const existing=[...document.querySelectorAll('a[href]')].find(a=>a.getAttribute('href')===route.quiz);
  if(existing){
    existing.classList.add('journey-button','journey-primary');
    const parent=existing.closest('p'); if(parent)parent.classList.add('journey-inline');
  }
  const main=document.querySelector('main');
  if(!main||document.querySelector('.topic-quiz-journey'))return;
  const box=document.createElement('section');box.className='practice-box topic-quiz-journey';
  const secondary=route.secondary?'<a class="practice-button journey-secondary" href="'+route.secondary+'">Try '+route.secondaryLabel+' →</a>':'';
  box.innerHTML='<p class="eyebrow">Learn → practise → quiz</p><h2>🎯 Ready for the '+route.title+' challenge?</h2><p>Use what you just practised in a focused quiz and keep your learning progress moving.</p><div class="journey-actions"><a class="practice-button journey-primary" href="'+route.quiz+'">'+(route.quizLabel||('Start '+route.title+' Quiz →'))+'</a>'+secondary+'<a class="practice-button journey-secondary" href="'+route.next+'">Next: '+route.nextLabel+' →</a></div>';
  main.append(box);
})();
