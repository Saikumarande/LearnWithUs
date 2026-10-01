'use strict';

(() => {
  const query = selector => document.querySelector(selector);
  const colouringStage = query('#colouringStage');
  const colouringSelect = query('#colouringItem');

  if (!colouringStage) return;

  const activityModules = [...document.querySelectorAll('.creative-module')];
  const showSelectedActivity = () => {
    const requestedId = decodeURIComponent(location.hash.slice(1));
    const selected = activityModules.find(module => module.id === requestedId);
    activityModules.forEach(module => { module.hidden = Boolean(selected) && module !== selected; });
  };
  showSelectedActivity();
  window.addEventListener('hashchange', showSelectedActivity);

  const makeColourable = () => {
    colouringStage.querySelectorAll('path,rect,circle,ellipse,polygon,polyline').forEach(shape => {
      shape.setAttribute('data-colourable', '');
      shape.addEventListener('click', () => {
        const active = document.querySelector('#colourPalette .active');
        const colour = active?.style.backgroundColor;
        if (!colour) return;
        if (shape.tagName === 'path' && shape.getAttribute('fill') === 'none') shape.setAttribute('stroke', colour);
        else shape.setAttribute('fill', colour);
      });
    });
  };

  const extraColouring = {
    bee: '<svg class="colouring-svg" viewBox="0 0 600 360"><ellipse cx="300" cy="190" rx="105" ry="70" fill="#fff" stroke="#444" stroke-width="4"/><ellipse cx="250" cy="110" rx="58" ry="42" fill="#fff" stroke="#444" stroke-width="4"/><ellipse cx="350" cy="110" rx="58" ry="42" fill="#fff" stroke="#444" stroke-width="4"/><path d="M270 128v124M320 122v135" fill="none" stroke="#444" stroke-width="15"/><circle cx="440" cy="170" r="9" fill="#444"/><path d="M400 215q35 25 68 0" fill="none" stroke="#444" stroke-width="4"/></svg>',
    rainbow: '<svg class="colouring-svg" viewBox="0 0 600 360"><path d="M90 300a210 210 0 0 1 420 0M140 300a160 160 0 0 1 320 0M190 300a110 110 0 0 1 220 0M240 300a60 60 0 0 1 120 0" fill="none" stroke="#444" stroke-width="24"/><path d="M65 300h470" stroke="#444" stroke-width="4"/><ellipse cx="78" cy="275" rx="38" ry="24" fill="#fff" stroke="#444" stroke-width="4"/><ellipse cx="522" cy="275" rx="38" ry="24" fill="#fff" stroke="#444" stroke-width="4"/></svg>',
    farm: '<svg class="colouring-svg" viewBox="0 0 600 360"><rect x="160" y="155" width="280" height="165" fill="#fff" stroke="#444" stroke-width="4"/><polygon points="135,165 300,60 465,165" fill="#fff" stroke="#444" stroke-width="4"/><rect x="265" y="225" width="70" height="95" fill="#fff" stroke="#444" stroke-width="4"/><rect x="190" y="190" width="55" height="50" fill="#fff" stroke="#444" stroke-width="4"/><rect x="355" y="190" width="55" height="50" fill="#fff" stroke="#444" stroke-width="4"/><path d="M90 320h420M120 285v55m80-55v55m80-55v55m80-55v55m80-55v55" fill="none" stroke="#444" stroke-width="5"/></svg>',
    elephant: '<svg class="colouring-svg" viewBox="0 0 600 360"><ellipse cx="285" cy="190" rx="130" ry="92" fill="#fff" stroke="#444" stroke-width="4"/><circle cx="410" cy="160" r="70" fill="#fff" stroke="#444" stroke-width="4"/><ellipse cx="380" cy="160" rx="42" ry="58" fill="#fff" stroke="#444" stroke-width="4"/><path d="M455 195q55 20 30 80q-10 24-30 5" fill="none" stroke="#444" stroke-width="24"/><rect x="205" y="245" width="42" height="78" fill="#fff" stroke="#444" stroke-width="4"/><rect x="330" y="245" width="42" height="78" fill="#fff" stroke="#444" stroke-width="4"/><circle cx="430" cy="145" r="7" fill="#444"/></svg>',
    peacock: '<svg class="colouring-svg" viewBox="0 0 600 360"><circle cx="300" cy="95" r="48" fill="#fff" stroke="#444" stroke-width="4"/><circle cx="210" cy="135" r="48" fill="#fff" stroke="#444" stroke-width="4"/><circle cx="390" cy="135" r="48" fill="#fff" stroke="#444" stroke-width="4"/><circle cx="160" cy="215" r="48" fill="#fff" stroke="#444" stroke-width="4"/><circle cx="440" cy="215" r="48" fill="#fff" stroke="#444" stroke-width="4"/><ellipse cx="300" cy="235" rx="48" ry="75" fill="#fff" stroke="#444" stroke-width="4"/><circle cx="318" cy="215" r="6" fill="#444"/><path d="M280 310l-20 28m55-28 20 28" stroke="#444" stroke-width="5"/></svg>',
    village: '<svg class="colouring-svg" viewBox="0 0 600 360"><rect x="75" y="190" width="130" height="125" fill="#fff" stroke="#444" stroke-width="4"/><polygon points="60,200 140,125 220,200" fill="#fff" stroke="#444" stroke-width="4"/><rect x="255" y="155" width="145" height="160" fill="#fff" stroke="#444" stroke-width="4"/><polygon points="235,165 328,80 420,165" fill="#fff" stroke="#444" stroke-width="4"/><rect x="450" y="205" width="95" height="110" fill="#fff" stroke="#444" stroke-width="4"/><polygon points="435,215 498,155 560,215" fill="#fff" stroke="#444" stroke-width="4"/><path d="M0 315h600" stroke="#444" stroke-width="5"/></svg>',
    garden: '<svg class="colouring-svg" viewBox="0 0 600 360"><path d="M300 180v145M170 205v120m260-120v120" stroke="#444" stroke-width="8"/><g fill="#fff" stroke="#444" stroke-width="4"><circle cx="300" cy="120" r="34"/><circle cx="300" cy="65" r="25"/><circle cx="350" cy="105" r="25"/><circle cx="330" cy="155" r="25"/><circle cx="270" cy="155" r="25"/><circle cx="250" cy="105" r="25"/><circle cx="170" cy="155" r="28"/><circle cx="430" cy="155" r="28"/></g><circle cx="300" cy="120" r="14" fill="#fff" stroke="#444" stroke-width="4"/><path d="M300 255q-55-40-75 5m75 20q50-40 75 5M170 260q-40-30-55 5m315-5q40-30 55 5" fill="#fff" stroke="#444" stroke-width="4"/></svg>'
  };

  let renderedExtraColouring = '';
  const applyExtraColouring = () => {
    const key = colouringSelect?.value;
    const template = extraColouring[key];
    if (!template) {
      renderedExtraColouring = '';
      return false;
    }
    if (renderedExtraColouring === key) return false;
    renderedExtraColouring = key;
    colouringStage.innerHTML = template;
    makeColourable();
    return true;
  };

  const colouringObserver = new MutationObserver(() => {
    if (!applyExtraColouring()) makeColourable();
  });
  colouringObserver.observe(colouringStage, { childList: true, subtree: true });
  applyExtraColouring();
  makeColourable();
  colouringSelect?.addEventListener('change', () => window.setTimeout(() => {
    if (!applyExtraColouring()) makeColourable();
  }, 0));

  const dotsSvg = query('#dotsSvg');
  const dotsStatus = query('#dotsStatus');
  const announceDotStatus = () => {
    const message = dotsStatus?.textContent.trim();
    if (!message || !('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) return;
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(message);
    utterance.lang = 'en-IN';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const finishDotShape = message => {
    if (!message.startsWith('Great! You joined all the dots')) return;
    const dots = [...dotsSvg.querySelectorAll('g circle')];
    if (dots.length > 1) {
      const first = [dots[0].getAttribute('cx'), dots[0].getAttribute('cy')];
      const last = [dots[dots.length - 1].getAttribute('cx'), dots[dots.length - 1].getAttribute('cy')];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        const closingLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        closingLine.setAttribute('x1', last[0]);
        closingLine.setAttribute('y1', last[1]);
        closingLine.setAttribute('x2', first[0]);
        closingLine.setAttribute('y2', first[1]);
        closingLine.setAttribute('stroke', '#704a84');
        closingLine.setAttribute('stroke-width', '5');
        dotsSvg.insertBefore(closingLine, dotsSvg.firstChild);
      }
    }
    if (!message.endsWith('fish.') || dotsSvg.querySelector('[data-fish-detail]')) return;
    const createFishPart = (tag, attributes) => {
      const part = document.createElementNS('http://www.w3.org/2000/svg', tag);
      Object.entries(attributes).forEach(([name, value]) => part.setAttribute(name, value));
      part.setAttribute('data-fish-detail', '');
      return part;
    };
    dotsSvg.insertBefore(createFishPart('polygon', {
      points: '68,138 132,180 68,222', fill: '#ffd166', stroke: '#704a84', 'stroke-width': '4'
    }), dotsSvg.firstChild);
    dotsSvg.insertBefore(createFishPart('polygon', {
      points: '280,126 322,84 360,126', fill: '#9ad9e8', stroke: '#704a84', 'stroke-width': '4'
    }), dotsSvg.firstChild);
    dotsSvg.append(createFishPart('circle', { cx: '420', cy: '165', r: '8', fill: '#263238' }));
  };

  if (dotsStatus && dotsSvg) {
    const dotStatusObserver = new MutationObserver(() => {
      const message = dotsStatus.textContent.trim();
      finishDotShape(message);
      announceDotStatus();
    });
    dotStatusObserver.observe(dotsStatus, { childList: true, characterData: true, subtree: true });
  }
})();

