'use strict';
(()=>{
 if(document.body.dataset.area!=='dashboard')return;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function mount(){const dashboard=document.querySelector('#learningDashboard'),state=window.LearnWithUs?.getState?.();if(!dashboard||!state||document.querySelector('#lwQuizCertificates'))return;
  const quizzes=(state.quizHistory||[]).filter(q=>Number.isFinite(+q.score)&&Number.isFinite(+q.total)&&+q.total>0);
  const section=document.createElement('section');section.className='lw-panel lw-quiz-certificates';section.id='lwQuizCertificates';
  const title=document.createElement('h2');title.textContent='🏅 Quiz Certificates & Results';const description=document.createElement('p');description.textContent='Every completed quiz appears here with its score, date and a downloadable participation certificate. These certificates are learning keepsakes, not school qualifications.';section.append(title,description);
  const grid=document.createElement('div');grid.className='lw-quiz-cert-grid';
  if(!quizzes.length){const p=document.createElement('p');p.textContent='No completed quizzes recorded yet. Finish a quiz to earn your first learning certificate.';grid.append(p)}
  quizzes.forEach((q,i)=>{const item=document.createElement('article');item.className='lw-quiz-cert';const h=document.createElement('h3');h.textContent=q.title||'Learning Quiz';const score=document.createElement('p');score.className='lw-quiz-score';score.textContent=q.score+' / '+q.total+' · '+Math.round(q.score/q.total*100)+'%';const date=document.createElement('small');const time=new Date(q.time);date.textContent=Number.isNaN(+time)?'Date unavailable':time.toLocaleDateString();const actions=document.createElement('div');actions.className='lw-quiz-cert-actions';const download=document.createElement('button');download.type='button';download.textContent='⬇ Download certificate';download.onclick=()=>{const learner=window.LearnWithUs?.getUserName?.()||'LearnWithUs learner';const svg=window.learnWithUsScoreCardSvg?.({score:Number(q.score),total:Number(q.total),title:String(q.title||'Learning Quiz'),subtitle:'Completed '+date.textContent,siteName:'LearnWithUs',learnerName:learner})||'';const blob=new Blob([svg],{type:'image/svg+xml'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='LearnWithUs-'+String(q.title||'quiz').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+i+'.svg';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)};const go=document.createElement('a');go.href=q.url||'quiz-hub.html';go.textContent='Try again →';actions.append(download,go);item.append(h,score,date,actions);grid.append(item)});
  section.append(grid);dashboard.append(section);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,0));else setTimeout(mount,0);
})();
