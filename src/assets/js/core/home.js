'use strict';
// Keep previously shared section bookmarks useful after moving their content.
(() => {
  const foodSections=new Set(['explore','mysteries','compare','sources','daily-values','data-reading','macro-energy']);
  function followBookmark(){
    if(location.hash==='#contact')location.replace('contact.html');
    else if(foodSections.has(location.hash.slice(1)))location.replace('food.html'+location.hash);
  }
  followBookmark();
  window.addEventListener('hashchange',followBookmark);
})();
