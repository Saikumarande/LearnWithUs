"use strict";
(()=>{
  const path=location.pathname.split('/').pop()||'index.html';
  const qs=new URLSearchParams(location.search);
  const routes={
    'addition.html':{title:'Addition',quiz:'math-quiz.html?topic=addition',next:'subtraction.html',nextLabel:'Subtraction'},
    'subtraction.html':{title:'Subtraction',quiz:'math-quiz.html?topic=subtraction',next:'multiplication.html',nextLabel:'Multiplication'},
    'multiplication.html':{title:'Multiplication',quiz:'math-quiz.html?topic=multiplication',secondary:'multiplication-tables.html?table=2',secondaryLabel:'Times Tables 1–20',next:'division.html',nextLabel:'Division'},
    'division.html':{title:'Division',quiz:'math-quiz.html?topic=division',next:'place-value.html',nextLabel:'Place value'},
    'place-value.html':{title:'Place Value',quiz:'math-quiz.html?topic=place-value',next:'odd-even.html',nextLabel:'Odd & even'},
    'odd-even.html':{title:'Odd & Even',quiz:'math-quiz.html?topic=odd-even',next:'fractions.html',nextLabel:'Fractions'},
    'fractions.html':{title:'Fractions',quiz:'math-quiz.html?topic=fractions',next:'time-calendar.html',nextLabel:'Time & calendar'},
    'time-calendar.html':{title:'Time & Calendar',quiz:'math-quiz.html?topic=time-calendar',next:'indian-money.html',nextLabel:'Indian money'},
    'indian-money.html':{title:'Indian Money',quiz:'math-quiz.html?topic=indian-money',next:'measurement.html',nextLabel:'Measurement'},
    'measurement.html':{title:'Measurement',quiz:'math-quiz.html?topic=measurement',next:'quiz-hub.html',nextLabel:'More quizzes'},
    'letter-tracing.html':{title:'Letters',quiz:'kids-quiz.html?category=letters',next:'children.html?mode=words',nextLabel:'Phonics'},
    'word-bank.html':{title:'Picture Spelling',quiz:'spelling-quiz.html',secondary:'missing-letters-quiz.html',secondaryLabel:'Missing Letters Quiz',next:'children.html?mode=words',nextLabel:'Phonics'}
  };
  let route=routes[path];
  if(path==='early-learning.html'){
    const topic=qs.get('topic');
    if(topic==='colours'||topic==='shapes') route={title:'Picture Matching',quiz:'early-learning.html?topic=matching',next:'quiz-hub.html',nextLabel:'More quizzes'};
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
  box.innerHTML='<p class="eyebrow">Learn → practise → quiz</p><h2>🎯 Ready for the '+route.title+' challenge?</h2><p>Use what you just practised in a focused quiz and keep your learning progress moving.</p><div class="journey-actions"><a class="practice-button journey-primary" href="'+route.quiz+'">Start '+route.title+' Quiz →</a>'+secondary+'<a class="practice-button journey-secondary" href="'+route.next+'">Next: '+route.nextLabel+' →</a></div>';
  main.append(box);
})();
