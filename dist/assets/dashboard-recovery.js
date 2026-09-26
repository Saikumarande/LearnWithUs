'use strict';
(() => {
  const goal=document.getElementById('lw-fallback-goal');
  if(!goal)return; // The full dashboard already replaced the fallback.
  const key='learnwithus.platform.v1';
  let state={};try{state=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch{}
  const save=()=>{try{localStorage.setItem(key,JSON.stringify(state));}catch{}};
  goal.value=String([5,10,15,20,30].includes(Number(state.dailyGoalMinutes))?state.dailyGoalMinutes:10);
  goal.addEventListener('change',()=>{state.dailyGoalMinutes=Number(goal.value);save();});
  const recent=Array.isArray(state.recent)?state.recent.find(item=>item&&item.url&&item.url!=='dashboard.html'):null;
  if(recent){const card=document.getElementById('lw-fallback-continue');card.querySelector('p').textContent=recent.detail||'Continue your latest activity.';const link=card.querySelector('a');link.href=recent.url;link.textContent=(recent.title||'Continue learning')+' →';}
  const challenges=[['Discover a food mystery','mysteries.html'],['Learn Picture Words','word-bank.html'],['Explore how the body works','health.html'],['Try a food quiz','quiz.html'],['Open the Kids Quiz Hub','quiz-hub.html']];
  const today=new Date(),challenge=challenges[(today.getFullYear()*372+today.getMonth()*31+today.getDate())%challenges.length],challengeLink=document.querySelector('#lw-fallback-challenge a');challengeLink.textContent=challenge[0]+' →';challengeLink.href=challenge[1];
  const counts=[Object.keys(state.visited||{}).length,Array.isArray(state.quizHistory)?state.quizHistory.length:0,Array.isArray(state.completed)?state.completed.length:0];
  document.querySelectorAll('#lw-fallback-progress .lw-stat b').forEach((node,index)=>node.textContent=String(counts[index]||0));
  const achievement=document.querySelector('#lw-fallback-achievements p');
  if(counts[2]>0||counts[1]>0)achievement.textContent='🏆 First Discovery unlocked! Keep learning to earn more achievements.';
})();
