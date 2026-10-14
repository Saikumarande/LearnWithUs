"use strict";
(()=>{
 const motion=document.getElementById('solarMotion'),button=document.getElementById('togglePlanetMotion');
 if(!motion||!button||motion.dataset.orbitController)return;
 motion.dataset.orbitController='waapi';
 const orbits=[...motion.querySelectorAll('.orbit')];
 let paused=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches||false;
 const status=document.getElementById('solarMotionStatus')||document.createElement('p');
 status.id='solarMotionStatus';status.className='solar-motion-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 if(!status.isConnected)button.after(status);
 const speeds=[5000,7000,9000,12000,16000,20000,25000,30000];
 const animations=[];
 orbits.forEach((orbit,i)=>{
  orbit.style.animation='none'; // turn OFF CSS keyframes, which previously fought with JS playback
  orbit.style.transform='translate(-50%,-50%) rotate(0deg)';
  if(orbit.animate){
   const animation=orbit.animate([
    {transform:'translate(-50%,-50%) rotate(0deg)'},
    {transform:'translate(-50%,-50%) rotate(360deg)'}
   ],{duration:speeds[i]||10000,iterations:Infinity,easing:'linear',fill:'both'});
   animations.push(animation);
  }
 });
 // A CSS-only fallback remains for browsers without the Web Animations API.
 if(!animations.length){motion.dataset.orbitController='css';orbits.forEach(orbit=>orbit.style.animation='')}
 function apply(){
  motion.classList.toggle('is-paused',paused);motion.dataset.motion=paused?'paused':'running';
  motion.style.setProperty('--orbit-play-state',paused?'paused':'running');
  if(animations.length){animations.forEach(anim=>paused?anim.pause():anim.play())}
  button.textContent=paused?'▶ Play animation':'⏸ Pause animation';
  button.setAttribute('aria-pressed',String(paused));
  button.setAttribute('aria-label',paused?'Play orbit animation':'Pause orbit animation');
  status.textContent=paused?'Orbit animation paused. Press Play to continue.':'Orbit animation running. Press Pause to stop.';
 }
 button.addEventListener('click',()=>{paused=!paused;apply()});apply();
})();
