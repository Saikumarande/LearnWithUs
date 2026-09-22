'use strict';
(() => {
 const {DV,foods,nutrientMeta}=window.LEARNWITHUS_DATA;
 const ui=Object.fromEntries(['title','search','sort','summary','grid','modal','detail','allTab','fruitTab','vegTab','close'].map(id=>[id,document.getElementById(id)]));
 const params=new URLSearchParams(location.search);
 const category=['fruit','vegetable','all'].includes(params.get('category'))?params.get('category'):'all';
 const labels={iron:['Iron','mg'],calcium:['Calcium','mg'],potassium:['Potassium','mg'],magnesium:['Magnesium','mg'],vitc:['Vitamin C','mg'],vita:['Vitamin A','µg RAE'],folate:['Folate','µg DFE'],fiber:['Fiber','g'],protein:['Protein','g'],carbs:['Carbohydrates','g'],fat:['Fat','g'],water:['Water','g']};
 const aliases={iron:['iron'],calcium:['calcium'],potassium:['potassium'],magnesium:['magnesium'],vitc:['vitamin c','vit c','ascorbic acid'],vita:['vitamin a','vit a'],folate:['folate','vitamin b9'],fiber:['fiber','fibre'],protein:['protein'],carbs:['carbohydrate','carbohydrates','carbs'],fat:['fat'],water:['water','hydration']};
 ui.search.value=params.get('q')||'';
 let lastFocus;
 function detected(q){return Object.keys(aliases).find(k=>aliases[k].some(a=>new RegExp('(^|\\W)'+a+'($|\\W)','i').test(q)))||null;}
 function render(){
  ui.title.textContent=category==='all'?'Explore all foods':category==='fruit'?'Explore all fruits':'Explore all vegetables';
  const q=ui.search.value.trim().toLowerCase(),nutrient=detected(q);
  [['allTab','all'],['fruitTab','fruit'],['vegTab','vegetable']].forEach(([id,type])=>{
   ui[id].classList.toggle('active',category===type);
   if(category===type)ui[id].setAttribute('aria-current','page');else ui[id].removeAttribute('aria-current');
   ui[id].href='catalog.html?'+new URLSearchParams({category:type,...(q?{q}: {})});
  });
  let list=foods.filter(f=>category==='all'||f.type===category);
  if(nutrient)list=list.filter(f=>Number.isFinite(f[nutrient])&&f[nutrient]>0);
  else if(q)list=list.filter(f=>(f.name+' '+f.sci+' '+f.fact+' '+f.benefits.join(' ')).toLowerCase().includes(q));
  const key=nutrient||ui.sort.value;
  list.sort((a,b)=>key==='name'?a.name.localeCompare(b.name):(b[key]??-1)-(a[key]??-1));
  ui.sort.disabled=!!nutrient;ui.sort.title=nutrient?'Nutrient searches rank by the searched nutrient.':'';
  const group=category==='all'?'foods':category==='fruit'?'fruits':'vegetables';
  ui.summary.textContent=nutrient?list.length+' '+group+' with reported '+labels[nutrient][0]+', ranked per 100 g. Even small amounts are included.':list.length+' '+group+' shown.';
  ui.grid.innerHTML=list.map(f=>card(f,nutrient||(key!=='name'?key:null))).join('')||'<p>No matching foods in this dataset. Try a food name or iron, calcium, magnesium or potassium.</p>';
 }
 function card(f,nutrient){
  const key=nutrient||'vitc',label=labels[key],value=f[key],max=DV[key]||Math.max(...foods.map(x=>x[key]||0),1);
  return '<button class="card" data-id="'+f.id+'"><span class="type">'+f.type+'</span><span class="icon" aria-hidden="true">'+f.icon+'</span><h2>'+f.name+'</h2><p>'+f.fact+'</p><div class="meta"><span>'+f.cal+' kcal</span><span>'+(Number.isFinite(value)?value+' '+label[1]:'Not reported')+' '+label[0]+'</span></div><div class="bar" aria-hidden="true"><i style="width:'+Math.min((value||0)/max*100,100)+'%"></i></div></button>';
 }
 function openFood(id){
  const f=foods.find(x=>x.id===id);if(!f)return;lastFocus=document.activeElement;
  ui.detail.innerHTML='<div class="detail-head"><span class="icon" aria-hidden="true">'+f.icon+'</span><div><h1 id="detailTitle">'+f.name+'</h1><em>'+f.sci+'</em> · '+(f.record||'raw')+', per 100 g'+(f.fdcId?' · <a href="https://fdc.nal.usda.gov/fdc-app.html#/food-details/'+f.fdcId+'/nutrients" target="_blank" rel="noopener"><u>USDA record '+f.fdcId+'</u></a>':'')+'</div></div><div class="stats">'+[['Calories',f.cal,'kcal'],['Carbs',f.carbs,'g'],['Protein',f.protein,'g'],['Fiber',f.fiber,'g']].map(x=>'<div class="stat"><small>'+x[0]+'</small><strong>'+x[1]+' '+x[2]+'</strong></div>').join('')+'</div><div class="nutrients">'+Object.entries(nutrientMeta).map(([k,v])=>{if(!DV[k]||!Number.isFinite(f[k]))return '<div class="nutrient"><div class="nutrient-head"><strong>'+v[0]+'</strong><span>Not reported</span></div></div>';const p=f[k]/DV[k]*100;return '<div class="nutrient"><div class="nutrient-head"><strong>'+v[0]+'</strong><span>'+f[k]+' '+v[1]+' · <b>'+p.toFixed(1)+'%</b> DV</span></div><div class="bar" role="progressbar" aria-label="'+v[0]+' '+p.toFixed(1)+' percent of Daily Value" aria-valuenow="'+Math.min(p,100).toFixed(1)+'" aria-valuetext="'+p.toFixed(1)+'% of Daily Value" aria-valuemin="0" aria-valuemax="100"><i style="width:'+Math.min(p,100)+'%;background:'+v[3]+'"></i></div><small class="nutrient-explainer">'+v[2]+'</small></div>';}).join('')+'<p class="dv-note">Bars show the percentage of a general adult Daily Value per 100 g. A bar stops visually at 100%, while its number can correctly be higher.</p></div><p class="source">Source basis: USDA FoodData Central raw-food records. Daily Value percentages use FDA references and are not personal dietary targets. <a href="food.html#data-reading"><u>Read the data guide</u></a>.</p>';
  ui.modal.classList.add('open');document.body.style.overflow='hidden';ui.close.focus();
 }
 function closeFood(){ui.modal.classList.remove('open');document.body.style.overflow='';lastFocus?.focus();}
 ui.search.addEventListener('input',()=>{
  const url=new URL(location.href);url.searchParams.set('category',category);
  if(ui.search.value.trim())url.searchParams.set('q',ui.search.value.trim());else url.searchParams.delete('q');
  history.replaceState(null,'',url);render();
 });
 ui.sort.addEventListener('change',render);
 ui.grid.addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(b)openFood(b.dataset.id);});
 ui.close.addEventListener('click',closeFood);
 ui.modal.addEventListener('click',e=>{if(e.target===ui.modal)closeFood();});
 document.addEventListener('keydown',e=>{
  if(!ui.modal.classList.contains('open'))return;
  if(e.key==='Escape')closeFood();
  if(e.key==='Tab'){
   const focusable=ui.modal.querySelectorAll('button,a[href]'),first=focusable[0],last=focusable[focusable.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
 });
 render();
})();
