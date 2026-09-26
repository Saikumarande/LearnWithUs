'use strict';
(() => {
  const input=document.getElementById('kidsActivitySearch'),status=document.getElementById('kidsSearchStatus');
  if(!input||!status)return;
  const cards=[...document.querySelectorAll('.kids-learning-choices .choice')];
  function filter(){
    const query=input.value.trim().toLocaleLowerCase();let shown=0;
    cards.forEach(card=>{const match=!query||card.textContent.toLocaleLowerCase().includes(query);card.hidden=!match;if(match)shown++;});
    status.textContent=query?shown+' activit'+(shown===1?'y':'ies')+' found':'';
  }
  input.addEventListener('input',filter);
})();
