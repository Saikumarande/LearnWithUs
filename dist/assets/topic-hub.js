'use strict';
(()=>{
 const root=document.getElementById('smartPage'),data=window.LWU_FOCUSED_TOPICS;if(!root||!data)return;
 const area=document.body.dataset.studio;
 const groups={smart:['smart'],parent:['parent'],coding:['coding'],profiles:['profiles'],tools:['tools'],everyday:['everyday']};
 const selected=Object.entries(data.registry).filter(([,r])=>(groups[area]||[]).includes(r.group));
 const title=document.getElementById('smartTitle');if(title)title.textContent=({smart:'🧠 Smart Learning & Revision',parent:'🏆 Motivation & Parent Dashboard',coding:'💻 Coding & Logic for Kids',profiles:'👨‍👩‍👧 Learner Profiles & Preferences',tools:'📚 Learning Tools & Accessibility',everyday:'🌱 Everyday Knowledge & Communication'})[area]||'Choose a learning topic';
 root.innerHTML=`<section class="studio-panel"><p class="eyebrow">Explore by learning area</p><h2>Choose a topic</h2><p>Every activity now has its own page, three practice questions, a focused quiz, and Previous / Next navigation. Open the topic you want to explore.</p><div class="focused-hub">${selected.map(([k,r])=>`<a class="focused-hub-card" href="${k}-lesson.html"><span>${r.icon}</span><strong>${r.title}</strong><small>${r.description}</small></a>`).join('')}</div></section>`;
})();
