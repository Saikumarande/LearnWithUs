'use strict';
(() => {
  const input=document.getElementById('kidsActivitySearch'),status=document.getElementById('kidsSearchStatus');
  if(!input||!status)return;
  const tiles=[...document.querySelectorAll('.kids-activity-card')];
  const groups=[...document.querySelectorAll('.kids-category-card')];
  function filter(){
    const query=input.value.trim().toLocaleLowerCase();let shown=0;
    tiles.forEach(tile=>{const match=!query||tile.textContent.toLocaleLowerCase().includes(query);tile.hidden=!match;if(match)shown++;});
    groups.forEach(group=>{group.hidden=!!query&&!group.querySelector('.kids-activity-card:not([hidden])');});
    status.textContent=query?shown+' activit'+(shown===1?'y':'ies')+' found':'';
  }
  input.addEventListener('input',filter);
})();
