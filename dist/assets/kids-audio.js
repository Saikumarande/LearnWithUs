'use strict';
/* One speech controller per learning page; never starts audio automatically. */
window.createKidsAudio=({status,stopButton,onStart=()=>{},onEnd=()=>{}})=>{
  const speech=window.speechSynthesis,supported=!!speech&&typeof window.SpeechSynthesisUtterance==='function';
  let token=0,utterance=null,active=null;
  function stop(reset=true){token++;if(supported)speech.cancel();utterance=null;active?.classList.remove('speaking');active=null;stopButton.disabled=true;if(reset)status.textContent=supported?'Tap a speaker when you’re ready.':'Audio is unavailable in this browser. You can still read and practise together.';}
  function speak(text,label,accent='en-GB',card=null){
    stop(false);
    if(!supported){status.textContent='Audio is unavailable here. Try a browser with English text-to-speech voices, or read together.';return;}
    const voices=speech.getVoices(),english=voices.filter(v=>/^en(?:[-_]|$)/i.test(v.lang));
    if(voices.length&&!english.length){status.textContent='No English voice is installed. Add an English speech voice in your device settings, then reopen this page.';return;}
    const voice=english.find(v=>v.lang.toLowerCase()===accent.toLowerCase())||english.find(v=>v.default)||english[0],current=token;
    utterance=new SpeechSynthesisUtterance(text);utterance.lang=accent;utterance.rate=.82;utterance.pitch=1;if(voice)utterance.voice=voice;
    active=card;stopButton.disabled=false;status.textContent='Getting the sound ready…';
    utterance.onstart=()=>{if(token!==current)return;active?.classList.add('speaking');status.textContent='Listening: '+label+'.';onStart();};
    utterance.onend=()=>{if(token!==current)return;active?.classList.remove('speaking');active=null;stopButton.disabled=true;status.textContent='Your turn! Say '+label+' out loud.';utterance=null;onEnd();};
    utterance.onerror=()=>{if(token!==current)return;active?.classList.remove('speaking');active=null;stopButton.disabled=true;status.textContent='The sound could not play. Check device sound and English speech voices, then tap again.';utterance=null;};
    try{speech.resume();speech.speak(utterance);}catch{stop(false);status.textContent='The sound could not play in this browser. You can still read together.';}
  }
  stopButton.addEventListener('click',()=>stop());
  window.addEventListener('pagehide',()=>stop(false));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  return {speak,stop};
};
