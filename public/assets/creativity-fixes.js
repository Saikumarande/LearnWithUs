'use strict';

(() => {
  const query = selector => document.querySelector(selector);
  const canvas = query('#drawingCanvas');
  const checkDrawing = query('#checkDrawing');
  const clearDrawing = query('#clearDrawing');
  const colouringStage = query('#colouringStage');
  const colouringSelect = query('#colouringItem');

  if (!canvas || !checkDrawing || !colouringStage) return;

  const activityModules = [...document.querySelectorAll('.creative-module')];
  const showSelectedActivity = () => {
    const requestedId = decodeURIComponent(location.hash.slice(1));
    const selected = activityModules.find(module => module.id === requestedId);
    activityModules.forEach(module => { module.hidden = Boolean(selected) && module !== selected; });
  };
  showSelectedActivity();
  window.addEventListener('hashchange', showSelectedActivity);

  const drawingContext = canvas.getContext('2d');
  let drawing = false;
  let points = [];
  let strokeCount = 0;

  const pointFor = event => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width / rect.width,
      y: (event.clientY - rect.top) * canvas.height / rect.height
    };
  };

  const resetDrawingScore = () => {
    points = [];
    strokeCount = 0;
  };

  canvas.addEventListener('pointerdown', event => {
    drawing = true;
    strokeCount += 1;
    points.push(pointFor(event));
  });
  canvas.addEventListener('pointermove', event => {
    if (drawing) points.push(pointFor(event));
  });
  window.addEventListener('pointerup', () => { drawing = false; });
  clearDrawing.addEventListener('click', resetDrawingScore);

  checkDrawing.addEventListener('click', () => {
    if (points.length < 2) return;
    const xs = points.map(point => point.x);
    const ys = points.map(point => point.y);
    const width = Math.max(...xs) - Math.min(...xs);
    const height = Math.max(...ys) - Math.min(...ys);
    const area = Math.min(1, (width * height) / (canvas.width * canvas.height));
    const pathLength = points.reduce((total, point, index) => {
      if (!index) return total;
      const previous = points[index - 1];
      return total + Math.hypot(point.x - previous.x, point.y - previous.y);
    }, 0);
    const effort = Math.min(1, pathLength / 1400);
    const variety = Math.min(1, strokeCount / 8);
    const coverage = Math.min(1, area * 3);
    const score = Math.max(5, Math.min(95, Math.round(coverage * 25 + effort * 35 + variety * 40)));
    const message = score < 35 ? 'Keep going — add a little more drawing to the page.' : score < 65 ? 'Nice effort! Your picture is taking shape.' : 'Great work! Your drawing looks full and confident.';
    const scoreElement = query('#drawingScore');
    scoreElement.innerHTML = 'Drawing score: <span class="pill-score">' + score + ' / 100</span> · ' + message;
  });

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

  makeColourable();
  colouringSelect?.addEventListener('change', () => window.setTimeout(makeColourable, 0));
})();

