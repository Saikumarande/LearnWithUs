'use strict';
/* Shared additive revision and motivation API; no network transfer of child progress. */
(()=>{
 const KEY='learnwithus.smart.v1',PROFILE='learnwithus.profiles.v1',MAIN='learnwithus.platform.v1';
 const profile=()=>{try{return JSON.parse(localStorage.getItem(PROFILE)||'{}').active||'default'}catch{return 'default'}};
 const storeKey=()=>KEY+'.'+profile();
 const empty=()=>({attempts:[],mistakes:[],favorites:[],missions:{},assignments:[],mastery:{},settings:{focus:false,speechRate:.85},activities:[]});
 const read=()=>{try{return Object.assign(empty(),JSON.parse(localStorage.getItem(storeKey())||'{}'))}catch{return empty()}};
 const write=v=>{try{localStorage.setItem(storeKey(),JSON.stringify(v))}catch{}};
 const simplify=s=>String(s||'').replace(/\s+/g,' ').trim().slice(0,320);
 const topicOf=(url,title)=>{let path=url||location.pathname.split('/').pop();let t='English';if(/science|planet|body|weather/i.test(path+' '+title))t='Science';else if(/math|numbers|addition|subtraction|division|fractions|counting|geometry|tables/i.test(path+' '+title))t='Maths';else if(/india|world|currency|capital|geography|flag/i.test(path+' '+title))t='World';else if(/life|safety|habits/i.test(path+' '+title))t='Life Skills';else if(/games|coding|logic/i.test(path+' '+title))t='Games';return t};
 function recordAnswer(q,chosen,correct,meta={}){if(!q||!correct)return;const v=read(),url=simplify(meta.url||location.pathname.split('/').pop()+location.search),title=simplify(meta.title||document.title),question=simplify(q),answer=simplify(chosen),truth=simplify(correct),ok=answer.toLowerCase()===truth.toLowerCase();const item={id:Date.now()+'-'+Math.random().toString(36).slice(2,7),question,answer,correct:truth,explanation:simplify(meta.explanation||('The correct answer is '+truth+'.')),url,title,category:meta.category||topicOf(url,title),ok,time:new Date().toISOString()};v.attempts.unshift(item);v.attempts=v.attempts.slice(0,700);if(!ok){const id=url+'|'+question;const exists=v.mistakes.find(x=>x.key===id);if(exists){exists.count++;exists.answer=answer;exists.time=item.time}else v.mistakes.unshift({...item,key:id,count:1});v.mistakes=v.mistakes.slice(0,200)}const key=item.category+'|'+url;const all=v.attempts.filter(x=>x.category+'|'+x.url===key).slice(0,20),ratio=all.filter(x=>x.ok).length/(all.length||1);v.mastery[key]={category:item.category,url,title,correct:all.filter(x=>x.ok).length,total:all.length,level:all.length<3?'Learning':ratio<.6?'Practising':ratio<.85?'Good':'Mastered',updated:item.time};write(v);return item;}
 function recordAggregate(title,score,total,url){const v=read();v.activities.unshift({title:simplify(title),score,total,url,time:new Date().toISOString(),category:topicOf(url,title)});v.activities=v.activities.slice(0,120);write(v)}
 function toggleFavorite(title,url){const v=read(),idx=v.favorites.findIndex(x=>x.url===url);if(idx<0)v.favorites.unshift({title,url});else v.favorites.splice(idx,1);write(v);return idx<0}
 function missionDay(){return new Date().toLocaleDateString('en-CA')}
 function markMission(id){const v=read(),date=missionDay(),items=v.missions[date]||[];if(!items.includes(id))items.push(id);v.missions[date]=items;write(v);return items.length}
 function levelFor(url){const v=read();return Object.values(v.mastery).find(x=>x.url===url)||null}
 window.LWUSmart={read,write,profile,recordAnswer,recordAggregate,toggleFavorite,markMission,missionDay,levelFor,topicOf};
 // Keep the established quiz history API untouched; record aggregate score separately.
 const wrap=()=>{const api=window.LearnWithUs;if(!api||api.__smartWrapped)return;const original=api.recordQuiz;api.recordQuiz=function(title,score,total,url,...rest){const result=original.call(api,title,score,total,url,...rest);recordAggregate(title,score,total,url||location.pathname.split('/').pop());markMission('quiz');return result};api.__smartWrapped=true};
 wrap();document.addEventListener('DOMContentLoaded',wrap);
})();
