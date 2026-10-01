"use strict";
(()=>{
  const path=location.pathname.split('/').pop()||'index.html',qs=new URLSearchParams(location.search);
  const routes={
    'place-value.html':{title:'Place Value',prev:'early-learning.html?topic=poems',prevLabel:'Poems',quiz:'math-quiz.html?topic=place-value',next:'odd-even.html',nextLabel:'Odd & Even'},
    'odd-even.html':{title:'Odd & Even',prev:'place-value.html',prevLabel:'Place Value',quiz:'math-quiz.html?topic=odd-even',next:'addition.html',nextLabel:'Addition'},
    'addition.html':{title:'Addition',prev:'odd-even.html',prevLabel:'Odd & Even',quiz:'math-quiz.html?topic=addition',next:'subtraction.html',nextLabel:'Subtraction'},
    'subtraction.html':{title:'Subtraction',prev:'addition.html',prevLabel:'Addition',quiz:'math-quiz.html?topic=subtraction',next:'multiplication.html',nextLabel:'Multiplication'},
    'multiplication.html':{title:'Multiplication',prev:'subtraction.html',prevLabel:'Subtraction',quiz:'math-quiz.html?topic=multiplication',next:'multiplication-tables.html?table=2',nextLabel:'Times Tables'},
    'division.html':{title:'Division',prev:'multiplication-tables.html?table=2',prevLabel:'Times Tables',quiz:'math-quiz.html?topic=division',next:'fractions.html',nextLabel:'Fractions'},
    'fractions.html':{title:'Fractions',prev:'division.html',prevLabel:'Division',quiz:'math-quiz.html?topic=fractions',next:'time-calendar.html',nextLabel:'Time & Calendar'},
    'time-calendar.html':{title:'Time & Calendar',prev:'fractions.html',prevLabel:'Fractions',quiz:'math-quiz.html?topic=time-calendar',next:'measurement.html',nextLabel:'Measurement'},
    'measurement.html':{title:'Measurement',prev:'time-calendar.html',prevLabel:'Time & Calendar',quiz:'math-quiz.html?topic=measurement',next:'children.html?mode=animals',nextLabel:'Animals'},
    'letter-tracing.html':{title:'Letter Tracing',prev:'word-bank.html',prevLabel:'Picture Words',quiz:'letter-tracing-quiz.html',quizLabel:'Start Letter Tracing & Order Quiz →',next:'early-learning.html?topic=poems',nextLabel:'Poems'},
    'word-bank.html':{title:'100 Picture Words',prev:'children.html?mode=words',prevLabel:'Phonics',quiz:'spelling-quiz.html',quizLabel:'Start 100 Picture Words Spelling Quiz →',next:'letter-tracing.html',nextLabel:'Letter Tracing'},
    'planets.html':{title:'Planets',prev:'early-learning.html?topic=shapes',prevLabel:'Shapes',quiz:'world-quiz.html?topic=planets',quizLabel:'Start Planets Quiz →',next:'countries-capitals.html',nextLabel:'Countries & Capitals'},
    'countries-capitals.html':{title:'Countries & Capitals',prev:'planets.html',prevLabel:'Planets',quiz:'world-quiz.html?topic=countries',next:'india.html',nextLabel:'India & Maps'},
    'india.html':{title:'India & Maps',prev:'countries-capitals.html',prevLabel:'Countries & Capitals',quiz:'india-quiz.html',quizLabel:'Start State & Capital Quiz →',next:'stories.html',nextLabel:'Stories'},
    'hindi.html':{title:'Hindi Letters',prev:'children.html?mode=numbers',prevLabel:'Numbers',quiz:'language-quiz.html?lang=hi',quizLabel:'Start Hindi Letters Quiz →',next:'telugu.html',nextLabel:'Telugu'},
    'telugu.html':{title:'Telugu Letters',prev:'hindi.html',prevLabel:'Hindi',quiz:'language-quiz.html?lang=te',quizLabel:'Start Telugu Letters Quiz →',next:'children.html?mode=words',nextLabel:'Phonics'},
    'stories.html':{title:'Story Comprehension',prev:'india.html',prevLabel:'India & Maps',quiz:'story.html?story=clever-rabbit',quizLabel:'Start a Story & Questions →',next:'sports.html',nextLabel:'Sports & Games'},
    'sports.html':{title:'Sports & Games',prev:'stories.html',prevLabel:'Stories',quiz:'sports-quiz.html',next:'creativity.html',nextLabel:'Creativity'},
    'creativity.html':{title:'Creativity',prev:'sports.html',prevLabel:'Sports & Games',quiz:'quiz-hub.html',quizLabel:'Open Quiz Hub →',next:'life-skills.html',nextLabel:'Life Skills'},
    'life-skills.html':{title:'Life Skills',prev:'creativity.html',prevLabel:'Creativity',quiz:'life-skills-quiz.html?topic=all',quizLabel:'Start All Life Skills Quiz →',next:'world-currencies.html',nextLabel:'World Currencies'},
    'world-currencies.html':{title:'World Currencies',prev:'life-skills.html',prevLabel:'Life Skills',quiz:'world-currencies-quiz.html',quizLabel:'Start World Currencies Quiz →',next:'games.html',nextLabel:'Learning Games'},
    'games.html':{title:'Learning Games',prev:'world-currencies.html',prevLabel:'World Currencies',quiz:'games-quiz.html?game=all',quizLabel:'Start All Learning Games Quiz →',next:'quiz-hub.html',nextLabel:'Quiz Hub'},
    'kids-skills.html':{title:'Kids Learning Games',prev:'life-skills.html',prevLabel:'Life Skills',quiz:'quiz-hub.html',quizLabel:'Open Quiz Hub →',next:'games.html',nextLabel:'Learning Games'}
  };
  let route=routes[path];
  if(path==='early-learning.html'){
    const topic=qs.get('topic');
    if(topic==='colours')route={title:'Colours',prev:'children.html?mode=animals',prevLabel:'Animals',quiz:'colours-quiz.html',quizLabel:'Start Colours Quiz →',next:'early-learning.html?topic=shapes',nextLabel:'Shapes'};
    if(topic==='shapes')route={title:'Shapes',prev:'early-learning.html?topic=colours',prevLabel:'Colours',quiz:'shapes-quiz.html',quizLabel:'Start Shapes Quiz →',next:'planets.html',nextLabel:'Planets'};
    if(topic==='poems')route={title:'Poems',prev:'letter-tracing.html',prevLabel:'Letter Tracing',quiz:'quiz-hub.html',quizLabel:'Open Quiz Hub →',next:'place-value.html',nextLabel:'Place Value'};
  }
  if(!route)return;
  // Remove old one-off quiz buttons so there is exactly one shared journey section.
  document.querySelectorAll('.journey-inline').forEach(el=>el.remove());
  document.querySelectorAll('a').forEach(a=>{if(/back to kids corner/i.test(a.textContent||'')){const wrap=a.closest('p');if(wrap)wrap.remove();else a.remove();}});
  const previous='<a class="practice-button journey-secondary journey-previous" href="'+route.prev+'">← Previous: '+route.prevLabel+'</a>';
  const primary='<a class="practice-button journey-primary" href="'+route.quiz+'">'+(route.quizLabel||('Start '+route.title+' Quiz →'))+'</a>';
  const next='<a class="practice-button journey-secondary journey-next" href="'+route.next+'">Next: '+route.nextLabel+' →</a>';
  const existing=document.querySelector('.topic-quiz-journey');
  if(existing){
    const actions=existing.querySelector('.journey-actions');
    if(actions){actions.innerHTML=previous+primary+next;}
    return;
  }
  const main=document.querySelector('main');if(!main)return;
  const box=document.createElement('section');box.className='practice-box topic-quiz-journey';
  box.innerHTML='<p class="eyebrow">Learn → practise → quiz</p><h2>🎯 Ready for the '+route.title+' challenge?</h2><p>Use what you just practised in a focused quiz and keep your learning progress moving.</p><div class="journey-actions">'+previous+primary+next+'</div>';
  main.append(box);
})();
