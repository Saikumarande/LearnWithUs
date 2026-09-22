'use strict';
(() => {
const sets={
easy:[
{q:'Which food is well known for its bright orange beta-carotene pigment?',o:['Carrot','Cucumber','Pear','Coconut'],a:0,e:'Carrots contain abundant beta-carotene, which contributes their orange color and can be converted into vitamin A.',tag:'colors'},
{q:'Which food is about 95% water by mass?',o:['Avocado','Cucumber','Banana','Green peas'],a:1,e:'Raw cucumber is about 95.2 g water per 100 g in this dataset.',tag:'water'},
{q:'Why does a banana usually taste sweeter as it ripens?',o:['It absorbs sugar from the air','Some starch is converted into sugars','Its potassium becomes sugar','Water turns into glucose'],a:1,e:'Ripening enzymes convert part of the banana’s starch into smaller sugars.',tag:'ripening'},
{q:'Which fruit provides the most vitamin C among these choices?',o:['Apple','Guava','Banana','Watermelon'],a:1,e:'Guava provides about 228.3 mg of vitamin C per 100 g in this dataset.',tag:'vitamins'},
{q:'What causes much of a lemon’s sour taste?',o:['Calcium','Citric acid','Fiber','Potassium'],a:1,e:'Citric acid activates sour-taste receptors in the mouth.',tag:'food science'},
{q:'Which food is botanically a fruit but commonly cooked as a vegetable?',o:['Tomato','Carrot','Spinach','Broccoli'],a:0,e:'A tomato develops from a flower and contains seeds, so botanically it is a fruit.',tag:'botany'},
{q:'What does dietary fiber mainly support?',o:['Normal bowel function','Blue eye color','Instant muscle growth','Food sweetness'],a:0,e:'Fiber supports bowel function, and some types can be fermented by gut microbes.',tag:'digestion'},
{q:'Why does spinach become much smaller when cooked?',o:['It loses minerals instantly','Heat releases water and collapses leaf structure','Its fiber disappears','It changes into protein'],a:1,e:'Heat damages the leaf structure and releases trapped water, reducing its volume.',tag:'cooking'}],
medium:[
{q:'Which food contains the most iron per 100 g among these?',o:['Apple','Spinach','Orange','Watermelon'],a:1,e:'Raw spinach provides about 2.71 mg iron per 100 g in this dataset.',tag:'minerals'},
{q:'Which comparison uses the fairest basis?',o:['One apple vs one grape','100 g vs 100 g','One plate vs one cup','Any serving shown on a package'],a:1,e:'Using the same mass, such as 100 g, controls serving-size differences.',tag:'comparison'},
{q:'Why can a little dietary fat help with carrots?',o:['It turns fiber into sugar','It can support carotenoid absorption','It creates vitamin C','It removes all water'],a:1,e:'Carotenoids are fat-soluble compounds, so dietary fat can help form structures needed for absorption.',tag:'absorption'},
{q:'What does a 20% Daily Value bar mean?',o:['The food is 20% nutrient by weight','One serving contributes 20% of the reference Daily Value','Everyone needs exactly five servings','The nutrient is 20% absorbed'],a:1,e:'%DV compares the amount in one serving with a standardized reference; it is not a composition or absorption percentage.',tag:'daily values'},
{q:'Which food is most energy-dense among these?',o:['Cucumber','Watermelon','Coconut meat','Strawberry'],a:2,e:'Coconut meat contains substantial fat and about 354 kcal per 100 g.',tag:'macronutrients'},
{q:'Why can whole orange be more filling than filtered juice?',o:['It is always colder','It generally retains more intact fiber','Juice has no water','Orange pulp contains caffeine'],a:1,e:'Whole orange retains more intact fiber and requires chewing, both of which can affect fullness.',tag:'fiber'},
{q:'What happens during enzymatic browning in cut apple?',o:['Oxygen participates in enzyme-driven reactions','The apple freezes','Protein becomes iron','All vitamin C disappears'],a:0,e:'Cutting brings oxygen, enzymes and phenolic compounds together, producing brown-colored compounds.',tag:'food science'},
{q:'Why should raw and cooked spinach data not be treated as identical?',o:['Cooking changes water content and some nutrient availability','Cooked food has no nutrients','Raw food has no water','Cooking creates minerals'],a:0,e:'Cooking changes water, volume and the availability or retention of some nutrients.',tag:'cooking'}],
tough:[
{q:'Why can spinach contain calcium yet provide less absorbable calcium than the number alone suggests?',o:['Its chlorophyll destroys calcium','Oxalates can bind some calcium','Calcium evaporates at room temperature','Fiber converts calcium to iron'],a:1,e:'Oxalates can bind calcium and reduce the fraction available for absorption.',tag:'bioavailability'},
{q:'A nutrient bar stops visually at 100%, but its label says 254%. Why?',o:['The calculation is wrong','The bar is capped for design while the numerical percentage remains accurate','The nutrient becomes toxic at 100%','The serving changed to zero'],a:1,e:'The interface caps width to preserve layout but must still display the true calculated percentage.',tag:'daily values'},
{q:'Which statement about non-heme iron is most accurate?',o:['Vitamin C in the meal can support its absorption','It exists only in meat','It is always absorbed completely','Cooking turns it into calcium'],a:0,e:'Vitamin C can improve absorption of non-heme iron from plant foods eaten in the same meal.',tag:'absorption'},
{q:'What makes greener and riper bananas metabolically different?',o:['Greener bananas generally contain more resistant starch','Ripe bananas contain no carbohydrate','Green bananas contain no fiber','Ripe bananas contain vitamin B12'],a:0,e:'As bananas ripen, some starch—including resistant starch—is converted into more readily available sugars.',tag:'ripening'},
{q:'Why should missing nutrient data not automatically be displayed as zero?',o:['Missing means the food is unsafe','The source may not have measured or reported it','Zero is illegal','All foods contain equal nutrients'],a:1,e:'A missing value means unavailable information; zero should be used only when the source explicitly supports it.',tag:'data literacy'},
{q:'For a macronutrient energy chart, which approach is scientifically coherent?',o:['Compare raw grams as if each gram gives equal energy','Apply appropriate energy conversion factors and label the chart as energy contribution','Mix minerals and protein in one gram scale','Use Daily Values as calories'],a:1,e:'Energy contribution requires conversion factors; raw grams and energy percentages are different concepts.',tag:'macronutrients'},
{q:'Why can anthocyanin-rich red cabbage change color with acidity?',o:['Anthocyanin molecular structures respond to pH','Its iron becomes blue','Fiber reflects only red light','Water creates chlorophyll'],a:0,e:'Anthocyanin structure and light absorption shift with pH, changing the visible color.',tag:'food chemistry'},
{q:'Why may avocado slow the movement of a meal compared with a watery fruit?',o:['Its fat and fiber can affect gastric emptying and digestion','It contains no water','It stops digestion completely','Its potassium blocks enzymes'],a:0,e:'Avocado’s fat and fiber make its digestive profile different from that of a low-fat, high-water fruit.',tag:'digestion'}]
};

const names={easy:'🌱 Curious Starter',medium:'🔬 Food Explorer',tough:'🧠 Nutrition Detective'};
const ids=['levelScreen','quizScreen','resultScreen','levelName','counter','scoreText','progress','question','options','feedback','submit','next','resultScore','resultTitle','resultMessage','scoreCard','learning','quit','levels','retry'];
const ui=Object.fromEntries(ids.map(id=>[id,document.getElementById(id)]));
let level,current,index=0,score=0,selected=null,answered=false,missed=[];
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));}
function start(chosen){
 if(!Object.hasOwn(sets,chosen))return;
 level=chosen;current=sets[level];index=0;score=0;missed=[];
 const url=new URL(location.href);url.searchParams.set('level',level);history.replaceState(null,'',url);
 show('quizScreen');renderQuestion();
}
function renderQuestion(){
 const x=current[index];selected=null;answered=false;
 ui.levelName.textContent=names[level];ui.counter.textContent='Question '+(index+1)+' of '+current.length;
 ui.scoreText.textContent='Score: '+score;ui.progress.style.width=(index/current.length*100)+'%';
 ui.question.textContent=x.q;
 ui.options.replaceChildren(...x.o.map((value,i)=>{
  const b=document.createElement('button');b.className='option';b.dataset.i=i;b.setAttribute('aria-pressed','false');
  b.textContent=String.fromCharCode(65+i)+'. '+value;return b;
 }));
 ui.feedback.className='feedback';ui.feedback.textContent='';ui.submit.disabled=true;
 ui.submit.classList.remove('hidden');ui.next.classList.add('hidden');ui.question.focus();
}
ui.options.addEventListener('click',e=>{
 const b=e.target.closest('[data-i]');if(!b||answered)return;selected=Number(b.dataset.i);
 ui.options.querySelectorAll('button').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b));});
 ui.submit.disabled=false;
});
ui.submit.addEventListener('click',()=>{
 if(selected===null||answered||!current)return;answered=true;const x=current[index];
 ui.options.querySelectorAll('button').forEach((b,i)=>{
  b.disabled=true;b.classList.remove('selected');b.classList.toggle('correct',i===x.a);b.classList.toggle('wrong',i===selected&&i!==x.a);
 });
 if(selected===x.a){score++;ui.feedback.innerHTML='<strong>Correct!</strong> '+x.e;}
 else{missed.push(x.tag);ui.feedback.innerHTML='<strong>Not quite.</strong> The correct answer is <strong>'+x.o[x.a]+'</strong>. '+x.e;}
 ui.feedback.classList.add('show');ui.scoreText.textContent='Score: '+score;ui.progress.style.width=((index+1)/current.length*100)+'%';
 ui.submit.classList.add('hidden');ui.next.classList.remove('hidden');
 ui.next.textContent=index===current.length-1?'See my result →':'Next question →';ui.next.focus();
});
ui.next.addEventListener('click',()=>{
 if(!answered||!ui.quizScreen.classList.contains('active'))return;
 if(index<current.length-1){index++;renderQuestion();}else showResult();
});
function link(label,href){
 const a=document.createElement('a');a.textContent=label+' →';a.href=href;a.target='_blank';a.rel='noopener';return a;
}
function adviceCard(title,text,links){
 const card=document.createElement('article'),h=document.createElement('h3'),p=document.createElement('p');
 h.textContent=title;p.textContent=text;card.append(h,p,...links.map(([label,href])=>link(label,href)));return card;
}
function showResult(){
 show('resultScreen');const pct=Math.round(score/current.length*100),counts={};
 missed.forEach(tag=>counts[tag]=(counts[tag]||0)+1);
 const tags=Object.keys(counts).sort((a,b)=>counts[b]-counts[a]);
 ui.resultScore.textContent=score+'/'+current.length;
 if(pct>=75){
  ui.resultTitle.textContent='Great work. Keep that curiosity growing!';
  ui.resultMessage.textContent='You scored '+pct+'%. '+(tags.length?'A little practice with the topics below will make your next round even stronger.':'You answered every question correctly. Try these related ideas to take your understanding further.');
 }else if(pct>=50){
  ui.resultTitle.textContent='A good start. Let’s connect the details.';
  ui.resultMessage.textContent='You scored '+pct+'%. Start with the topics you missed most, explore the examples, then try this level again.';
 }else{
  ui.resultTitle.textContent='Your next discovery starts here.';
  ui.resultMessage.textContent='You scored '+pct+'%. Take one topic at a time. Read a short explanation, say it in your own words, and come back when you feel ready.';
 }
 const defaults={easy:['colors','vitamins','digestion'],medium:['comparison','absorption','daily values'],tough:['bioavailability','data literacy','macronutrients']};
 // Link every missed concept; perfect scores receive level-specific extensions.
 const cards=(tags.length?tags:defaults[level]).map(tag=>{
  const guide=window.LEARNWITHUS_GUIDES[tag];if(!guide)throw new Error('Missing quiz guide: '+tag);
  return adviceCard((tags.length?'Review: ':'Explore: ')+tag,guide.text,guide.links);
 });
 if(pct>=75){
  const nextLevel=level==='easy'?'medium':level==='medium'?'tough':null;
  cards.push(adviceCard(nextLevel?'Ready for your next challenge?':'Put your knowledge to work',
   nextLevel?'Take your new ideas into the next difficulty level.':'Compare two foods and explain the differences in your own words.',
   nextLevel?[[names[nextLevel],'quiz.html?level='+nextLevel]]:[['Compare two foods','food.html#compare']]));
 }else if(pct>=50){
  cards.push(adviceCard('Make it practical','Predict the nutrient differences between two foods before checking the numbers.',[['Try a food comparison','food.html#compare']]));
 }else{
  cards.push(adviceCard('Build confidence, one idea at a time','Start with a short food mystery, then come back for another try.',[['Explore a simple color mystery','mysteries.html#carrot-color'],['Try Curious Starter','quiz.html?level=easy']]));
 }
 ui.learning.replaceChildren(...cards);window.renderLearnWithUsScoreCard({container:ui.scoreCard,score,total:current.length,title:names[level]+' complete!',subtitle:ui.resultTitle.textContent,filename:'learnwithus-food-quiz-score.svg',url:'quiz.html?level='+level});ui.resultScore.focus();
}
document.querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>start(b.dataset.level)));
function chooseLevels(){const url=new URL(location.href);url.searchParams.delete('level');history.replaceState(null,'',url);show('levelScreen');document.querySelector('[data-level]').focus();}
ui.quit.addEventListener('click',chooseLevels);ui.levels.addEventListener('click',chooseLevels);ui.retry.addEventListener('click',()=>start(level));
const requested=new URLSearchParams(location.search).get('level');
if(requested&&Object.hasOwn(sets,requested))start(requested);

})();
