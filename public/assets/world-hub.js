'use strict';
(()=>{
 const root=document.getElementById('smartPage');if(!root||!window.LWU_FOCUSED_TOPICS)return;
 const db=window.LWU_FOCUSED_TOPICS.registry;root.innerHTML=`<section class="studio-panel"><p class="eyebrow">World & India</p><h2>🌍 Choose a World Explorer topic</h2><p>Each subject now has its own learning page, three practice questions and a focused quiz.</p><div class="focused-hub">${['continents','flags','landmarks','geography'].map(k=>`<a href="${k}-lesson.html" class="focused-hub-card"><span>${db[k].icon}</span><strong>${db[k].title}</strong><small>${db[k].description}</small></a>`).join('')}</div></section>`;
 document.getElementById('smartTitle').textContent='🌍 World Explorer';
})();
