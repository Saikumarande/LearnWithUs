'use strict';
(() => {
  const lessons={
    te:{name:'Telugu',locale:'te-IN',rows:[
      [['అ','a'],['ఆ','ā'],['ఇ','i'],['ఈ','ī'],['ఉ','u'],['ఊ','ū'],['ఋ','r̥'],['ౠ','r̥̄']],
      [['ఎ','e'],['ఏ','ē'],['ఐ','ai'],['ఒ','o'],['ఓ','ō'],['ఔ','au'],['అం','aṁ'],['అః','aḥ']],
      [['క','ka'],['ఖ','kha'],['గ','ga'],['ఘ','gha'],['ఙ','ṅa']],
      [['చ','ca'],['ఛ','cha'],['జ','ja'],['ఝ','jha'],['ఞ','ña']],
      [['ట','ṭa'],['ఠ','ṭha'],['డ','ḍa'],['ఢ','ḍha'],['ణ','ṇa']],
      [['త','ta'],['థ','tha'],['ద','da'],['ధ','dha'],['న','na']],
      [['ప','pa'],['ఫ','pha'],['బ','ba'],['భ','bha'],['మ','ma']],
      [['య','ya'],['ర','ra'],['ల','la'],['వ','va'],['ళ','ḷa']],
      [['శ','śa'],['ష','ṣa'],['స','sa'],['హ','ha'],['ఱ','ṟa']]
    ]},
    hi:{name:'Hindi',locale:'hi-IN',rows:[
      [['अ','a'],['आ','ā'],['इ','i'],['ई','ī'],['उ','u'],['ऊ','ū'],['ऋ','r̥']],
      [['ए','e'],['ऐ','ai'],['ओ','o'],['औ','au'],['अं','aṁ'],['अः','aḥ']],
      [['क','ka'],['ख','kha'],['ग','ga'],['घ','gha'],['ङ','ṅa']],
      [['च','ca'],['छ','cha'],['ज','ja'],['झ','jha'],['ञ','ña']],
      [['ट','ṭa'],['ठ','ṭha'],['ड','ḍa'],['ढ','ḍha'],['ण','ṇa']],
      [['त','ta'],['थ','tha'],['द','da'],['ध','dha'],['न','na']],
      [['प','pa'],['फ','pha'],['ब','ba'],['भ','bha'],['म','ma']],
      [['य','ya'],['र','ra'],['ल','la'],['व','va'],['श','śa']],
      [['ष','ṣa'],['स','sa'],['ह','ha'],['क्ष','kṣa'],['त्र','tra'],['ज्ञ','jña'],['श्र','śra']]
    ]}
  };
  const key=document.body.dataset.language;
  const lesson=lessons[key];
  const grid=document.getElementById('languageGrid');
  const status=document.getElementById('languageStatus');
  const stop=document.getElementById('stopLanguageAudio');
  const help=document.getElementById('voiceHelp');
  const synth=window.speechSynthesis;
  const supported=Boolean(synth&&window.SpeechSynthesisUtterance);
  let voice=null,active=null,voiceTimer=null;
  if(!lesson||!grid||!status||!stop)return;

  function findVoice(){
    if(!supported)return null;
    const voices=synth.getVoices();
    return voices.find(item=>item.lang.toLowerCase()===lesson.locale.toLowerCase())||voices.find(item=>item.lang.toLowerCase().startsWith(key+'-'))||voices.find(item=>item.lang.toLowerCase()===key)||null;
  }
  function setButtons(enabled){grid.querySelectorAll('[data-letter]').forEach(button=>{button.disabled=!enabled;button.setAttribute('aria-disabled',String(!enabled));});}
  function voiceHelp(){
    help.hidden=false;
    help.innerHTML='<p><strong>'+lesson.name+' voice is not installed or exposed by this browser.</strong></p><ol><li>Use current Microsoft Edge or Google Chrome.</li><li>In Windows, open <strong>Settings → Time &amp; language → Language &amp; region</strong>.</li><li>Add '+lesson.name+', open <strong>Language options</strong>, and install available speech features.</li><li>Close and reopen the browser, then reload this page.</li></ol>';
  }
  function updateVoiceState(){
    voice=findVoice();
    if(voice){setButtons(true);help.hidden=true;status.textContent=lesson.name+' voice ready: '+voice.name+'. Tap “Hear” on a letter.';return true;}
    setButtons(false);status.textContent='A matching '+lesson.name+' voice was not found. Sound is disabled to avoid incorrect pronunciation.';voiceHelp();return false;
  }
  function halt(message=true){if(supported)synth.cancel();active?.classList.remove('speaking');active=null;stop.disabled=true;if(message)status.textContent='Sound stopped. Tap another letter when ready.';}
  function speak(button){
    if(!updateVoiceState())return;
    halt(false);const letter=button.dataset.letter;const utterance=new SpeechSynthesisUtterance(letter);
    utterance.lang=lesson.locale;utterance.voice=voice;utterance.rate=.62;utterance.pitch=1;utterance.volume=1;
    active=button.closest('.language-card');active.classList.add('speaking');stop.disabled=false;status.textContent='Listening: '+letter;
    utterance.onend=()=>{active?.classList.remove('speaking');active=null;stop.disabled=true;status.textContent='Your turn! Say '+letter+', or choose another letter.';};
    utterance.onerror=event=>{active?.classList.remove('speaking');active=null;stop.disabled=true;status.textContent=event.error==='canceled'?'Sound stopped.':'The '+lesson.name+' voice could not play. Restart the browser after checking the device speech settings.';};
    synth.cancel();synth.resume();synth.speak(utterance);
  }
  grid.innerHTML=lesson.rows.map((row,rowIndex)=>'<div class="language-row" role="group" aria-label="Row '+(rowIndex+1)+'">'+row.map(([letter,roman])=>'<article class="language-card"><strong lang="'+key+'">'+letter+'</strong><span class="language-sound">'+roman+'</span><button type="button" data-letter="'+letter+'" disabled aria-label="Hear '+letter+'">🔊 <span>Hear</span></button></article>').join('')+'</div>').join('');
  grid.addEventListener('click',event=>{const button=event.target.closest('[data-letter]');if(button&&!button.disabled)speak(button);});
  stop.addEventListener('click',()=>halt(true));
  if(supported){synth.addEventListener?.('voiceschanged',updateVoiceState);voiceTimer=setInterval(()=>{if(updateVoiceState())clearInterval(voiceTimer);},400);setTimeout(()=>clearInterval(voiceTimer),5000);}else{setButtons(false);status.textContent='Speech is not supported in this browser.';voiceHelp();}
  updateVoiceState();
})();
