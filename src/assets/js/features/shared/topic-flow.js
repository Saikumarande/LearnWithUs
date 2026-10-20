'use strict';
(()=>{
 const db=window.LWU_FOCUSED_TOPICS,root=document.getElementById('smartPage'),slug=document.body.dataset.focusTopic;
 if(!db||!root||!db.registry[slug])return;
 const current=db.registry[slug],names=Object.keys(db.registry).filter(k=>db.registry[k].group===current.group),idx=names.indexOf(slug);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const quiz=db.quizzes[slug]||[];
 const title=document.getElementById('smartTitle');if(title)title.textContent=current.icon+' '+current.title;
 document.title=current.title+' | LearnWithUs';
 const intro=document.querySelector('.studio-lead');if(intro)intro.textContent=current.description;
 const panels=[...root.querySelectorAll('section.studio-panel')];
 const focus=panels.find(p=>p.querySelector('h2')?.textContent.toLowerCase().includes(current.panel.toLowerCase()));
 if(focus){panels.forEach(p=>{if(p!==focus&&slug!=='profiles'){p.hidden=true;p.style.display='none'}});root.classList.add('focused-one-topic');
 // Some existing panels contain two small tools. Focus the requested tool without deleting controls or their event listeners.
 const parts=[...focus.children],matchHeading=(el,text)=>/^H[2-4]$/.test(el.tagName)&&el.textContent.toLowerCase().includes(text.toLowerCase());
 const indexOfHeading=text=>parts.findIndex(el=>matchHeading(el,text));
 if(slug==='weekly'||slug==='daily'){const cut=indexOfHeading('Weekly missions');if(cut>=0)parts.forEach((el,i)=>{if(slug==='weekly'&&i<cut||slug==='daily'&&i>=cut)el.style.display='none'})}
 if(slug==='favorites'||slug==='continue'){const cut=indexOfHeading('Favourite topics');if(cut>=0)parts.forEach((el,i)=>{if(slug==='favorites'&&i<cut||slug==='continue'&&i>=cut)el.style.display='none'})}
 if(['search','focus','offline'].includes(slug)){const cutFocus=indexOfHeading('Focus Mode'),cutOffline=indexOfHeading('Offline status');parts.forEach((el,i)=>{const show=slug==='search'?i<cutFocus:slug==='focus'?i>=cutFocus&&i<cutOffline:i>=cutOffline;if(!show)el.style.display='none'})}
 }
 const nav=document.createElement('nav');nav.className='focused-topic-nav';nav.setAttribute('aria-label',current.group+' learning topics');
 nav.innerHTML=names.map(k=>`<a class="focused-topic-link" href="${k}-lesson.html" ${k===slug?'aria-current="page"':''}>${esc(db.registry[k].icon)} ${esc(db.registry[k].title)}</a>`).join('');root.before(nav);
 const learn=document.createElement('section');learn.className='focused-learn';learn.innerHTML=`<p class="eyebrow">Learn</p><h2>Understand ${esc(current.title)}</h2><p>${esc(current.description)}</p><div class="focused-facts">${(slug==='flags'?[]:current.facts).map(([term,detail])=>`<article><strong>${esc(term)}</strong><p>${esc(detail)}</p></article>`).join('')}</div>`;root.before(learn);
 const pane=document.createElement('section');pane.className='focused-practice';pane.id='focusedPractice';pane.innerHTML='<p class="eyebrow">Practise</p><h2>Try three practice questions</h2><div id="focusedQuestion"></div><p id="focusedProgress" aria-live="polite"></p>';root.after(pane);
 let n=0,answered=false,answeredCount=0;
 function practice(){if(n>=3){pane.querySelector('#focusedQuestion').innerHTML='<p class="focused-success">✓ Three practice questions completed. Continue to the quiz below.</p>';pane.querySelector('#focusedProgress').textContent='3/3 completed';return}
  const q=quiz[n%quiz.length];if(!q)return;answered=false;
  pane.querySelector('#focusedQuestion').innerHTML=`<h3>${esc(q.q)}</h3><div class="focused-choices">${q.o.map(o=>`<button type="button" class="focused-choice" data-answer="${esc(o)}">${esc(o)}</button>`).join('')}</div><p class="focused-feedback" role="status" aria-live="polite"></p><button type="button" class="focused-next" id="focusedNext" hidden>${n===2?'Finish practice →':'Next question →'}</button>`;
  pane.querySelector('#focusedProgress').textContent=`Question ${n+1} of 3`;
  const buttons=[...pane.querySelectorAll('[data-answer]')],msg=pane.querySelector('.focused-feedback'),next=pane.querySelector('#focusedNext');buttons.forEach(btn=>btn.onclick=()=>{if(answered)return;answered=true;answeredCount++;const ok=btn.dataset.answer===q.a;buttons.forEach(b=>{b.disabled=true;if(b.dataset.answer===q.a)b.classList.add('correct')});if(!ok)btn.classList.add('wrong');msg.textContent=ok?'Correct answer! It is '+q.a+'.':'Wrong answer. The correct answer is '+q.a+'. '+q.explanation;if(window.speechSynthesis&&window.SpeechSynthesisUtterance){window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(ok?'Correct answer! It is '+q.a+'.':'Wrong answer. The correct answer is '+q.a+'.');utterance.lang='en-IN';utterance.rate=.83;window.speechSynthesis.speak(utterance)}window.LWUSmart?.recordAnswer?.(q.q,btn.dataset.answer,q.a,{title:current.title,url:slug+'-lesson.html',category:current.group,explanation:q.explanation});next.hidden=false;});next.onclick=()=>{n++;practice()};
 }practice();
 const branchRoutes=window.LWU_BRANCH_ROUTE_DATA||{};
 const allBranchSteps=Object.values(branchRoutes);
 const currentStepList=allBranchSteps.find(steps=>steps.some(step=>step.href===slug+'-lesson.html'));
 const stableIndex=currentStepList?.findIndex(step=>step.href===slug+'-lesson.html')??-1;
 const previousTopic=currentStepList&&stableIndex>0?currentStepList[stableIndex-1]:null;
 const followingTopic=currentStepList&&stableIndex>=0&&stableIndex<currentStepList.length-1?currentStepList[stableIndex+1]:null;
 const footer=document.createElement('section');footer.className='focused-journey';footer.innerHTML=`<p class="eyebrow">Learn → Practise → Quiz</p><h2>🎯 Ready for the ${esc(current.title)} challenge?</h2><p>Use what you just practised in a focused quiz and keep your learning progress moving.</p><nav class="focused-actions" aria-label="Learning journey">${previousTopic?`<a class="focused-button" href="${esc(previousTopic.href)}">← Previous: ${esc(previousTopic.label)}</a>`:'<span aria-hidden="true"></span>'}<a class="focused-button focused-primary" href="${slug}-quiz.html">Start ${esc(current.title)} Quiz →</a>${followingTopic?`<a class="focused-button" href="${esc(followingTopic.href)}">Next: ${esc(followingTopic.label)} →</a>`:'<span aria-hidden="true"></span>'}</nav></section>`;

 pane.after(footer);
})();
