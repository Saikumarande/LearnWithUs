/* Six sourced guides with shareable URLs. Video requests start only when a player is opened. */
(() => {
  'use strict';
  const parts=window.LEARNWITHUS_BODY;
  const chooser=document.getElementById('body-chooser');
  const grid=document.getElementById('body-grid');
  const detail=document.getElementById('organ-detail');
  const legacy=new Set(['hydration','kidney-function','stone-prevention','fluid-needs','kidney-video']);
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const external=([label,url])=>`<a href="${escape(url)}" target="_blank" rel="noopener">${escape(label)} ↗</a>`;
  const sources=items=>`<div class="body-sources">${items.map(external).join('')}</div>`;
  let selected=null,lastURL='';

  grid.innerHTML=parts.map(part=>`<a class="body-card" data-part="${part.id}" data-theme="${part.theme}" href="health.html?part=${part.id}#organ-detail"><div class="body-card-media"><img src="${part.image}" alt="" loading="lazy" width="300" height="174"></div><div class="body-card-copy"><span class="body-card-category">${escape(part.category)}</span><h3>${escape(part.name)}</h3><p>${escape(part.tagline)}</p><strong>Explore the ${part.id==='kidneys'?'kidneys':part.name.toLowerCase()} <span aria-hidden="true">→</span></strong></div></a>`).join('');

  function moveFocus(target){
    if(!target)return;
    target.focus({preventScroll:true});
    target.scrollIntoView({block:'start',behavior:'auto'});
  }
  function go(id){
    const url=new URL(location.href);
    if(id){url.searchParams.set('part',id);url.hash='organ-detail';}
    else{url.searchParams.delete('part');url.hash='body-chooser';}
    if(url.href!==location.href)history.pushState({},'',url);
    render(true);
  }
  function videoPanel(part){
    if(part.video){const v=part.video;return `<section class="body-video" aria-labelledby="video-title"><p class="eyebrow">See it in motion</p><h3 id="video-title">${escape(v.title)}</h3><p>${escape(v.description)} This is an explanatory animation.</p><div class="body-video-actions"><button class="primary-button" id="load-body-video" type="button" aria-controls="body-player" aria-expanded="false">▶ Open animation</button><button class="text-button" id="close-body-video" type="button" hidden>Close video</button></div><div class="body-player" id="body-player" hidden></div><div class="body-video-links">${external(['Animation and written guide on NHLBI',v.source])}${external(['Watch on YouTube','https://www.youtube.com/watch?v='+v.id])}</div><p class="body-video-credit">The player loads from YouTube only after you choose to open it. If it is unavailable, use the links above. Medical Animation Copyright © Nucleus Medical Media. All rights reserved.</p></section>`;}
    if(part.id==='kidneys')return `<section class="body-video" id="kidney-video" tabindex="-1"><p class="eyebrow">Prefer to watch?</p><h3>See what the kidneys do</h3><p>NIDDK’s guide includes a video under “Why are the kidneys important?” and a written explanation of the filtering process.</p>${external(['Open NIDDK’s kidney video guide',part.functionSources[0][1]])}</section>`;
    return '';
  }
  function render(focus=false){
    if(!focus&&lastURL===location.href)return;
    lastURL=location.href;
    const url=new URL(location.href),hash=url.hash.slice(1);
    const id=legacy.has(hash)?'kidneys':url.searchParams.get('part');
    selected=parts.find(part=>part.id===id)||null;
    // Replacing the detail removes any old iframe, stopping playback on a part change.
    detail.replaceChildren();
    detail.hidden=!selected;chooser.hidden=!!selected;
    if(!selected){document.title='Explore Your Body — LearnWithUs';if(focus)moveFocus(document.getElementById('body-choice-title'));return;}
    const p=selected,kidney=p.id==='kidneys';
    document.title=p.name+' · Health Guides — LearnWithUs';
    detail.dataset.theme=p.theme;
    detail.innerHTML=`<div class="body-toolbar"><button type="button" class="text-button" id="all-body-parts">← All body parts</button><label for="body-select">Explore another part<select id="body-select">${parts.map(item=>`<option value="${item.id}"${p.id===item.id?' selected':''}>${escape(item.name)}</option>`).join('')}</select></label></div>
      <div class="body-overview"><div class="body-summary"><p class="eyebrow">${escape(p.category)} · About 3 min</p><h2 id="body-title" tabindex="-1">Your ${p.name.toLowerCase()}.</h2><p class="body-tagline">${escape(p.tagline)}</p><p>${escape(p.intro)}</p></div><figure class="body-image"><a href="${p.image}" target="_blank" rel="noopener" aria-label="Enlarge the ${escape(p.name.toLowerCase())} illustration"><img src="${p.image}" alt="${escape(p.alt)}" width="600" height="450"></a><a class="body-enlarge" href="${p.image}" target="_blank" rel="noopener">Enlarge illustration ↗</a><figcaption>${escape(p.imageCredit)}. ${external([p.imageCredit.startsWith('LearnWithUs')?'Health information source':'Original illustration',p.imageSource])}</figcaption></figure></div>
      <section class="body-section" id="${kidney?'kidney-function':'body-function'}" tabindex="-1"><h3>${escape(p.focusTitle)}</h3><ol class="body-steps">${p.facts.map(([title,text])=>`<li><h4>${escape(title)}</h4><p>${escape(text)}</p></li>`).join('')}</ol>${sources(p.functionSources)}</section>
      <section class="body-section body-food" id="${kidney?'stone-prevention':'body-food'}" tabindex="-1"><p class="eyebrow">Food & everyday habits</p><h3>${escape(p.foodTitle)}</h3><p>${escape(p.foodText)}</p><div class="body-example"><strong>One way to start</strong>${escape(p.examples)}</div>${sources(p.foodSources)}</section>
      <section class="body-note" id="${kidney?'fluid-needs':'body-notes'}" tabindex="-1"><h3>${escape(p.noteTitle)}</h3><p>${escape(p.note)}</p>${p.noteSource?sources([p.noteSource]):''}</section>
      ${kidney?`<section class="body-hydration" id="hydration" tabindex="-1"><p class="eyebrow">A common question</p><h3>${escape(p.extraTitle)}</h3><p>${escape(p.extra)}</p>${sources([...p.foodSources,p.noteSource])}</section>`:''}
      ${videoPanel(p)}
      <section class="body-related"><h3>Keep learning in LearnWithUs</h3><div class="body-related-links">${p.related.map(([label,href])=>`<a href="${escape(href)}">${escape(label)} →</a>`).join('')}</div></section>`;
    if(focus||url.hash){const target=hash&&hash!=='organ-detail'?document.getElementById(hash):null;moveFocus(target||document.getElementById('body-title'));}
  }
  grid.addEventListener('click',event=>{
    const link=event.target.closest('[data-part]');
    if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button>0)return;
    event.preventDefault();go(link.dataset.part);
  });
  detail.addEventListener('change',event=>{if(event.target.id==='body-select')go(event.target.value);});
  detail.addEventListener('click',event=>{
    const control=event.target.closest('button');if(!control)return;
    if(control.id==='all-body-parts'){go(null);return;}
    if(control.id==='load-body-video'&&selected?.video){
      const player=document.getElementById('body-player');if(player.firstChild)return;
      const frame=document.createElement('iframe');
      frame.src='https://www.youtube.com/embed/'+selected.video.id+'?autoplay=0&mute=0&rel=0&start=0';
      frame.title=selected.video.title+' — educational animation';
      frame.allow='encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
      player.append(frame);player.hidden=false;control.hidden=true;control.setAttribute('aria-expanded','true');
      const close=document.getElementById('close-body-video');close.hidden=false;close.focus();
    }
    if(control.id==='close-body-video'){
      const player=document.getElementById('body-player');player.replaceChildren();player.hidden=true;control.hidden=true;
      const open=document.getElementById('load-body-video');open.hidden=false;open.setAttribute('aria-expanded','false');open.focus();
    }
  });
  window.addEventListener('popstate',()=>render(true));
  window.addEventListener('hashchange',()=>render());
  render();
})();
