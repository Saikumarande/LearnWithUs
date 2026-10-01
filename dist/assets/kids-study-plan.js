'use strict';

(() => {
  const root = document.getElementById('kidsStudyPlan');
  const ageSelect = document.getElementById('kidsPlanAge');
  const taskList = document.getElementById('kidsPlanTasks');
  const progressText = document.getElementById('kidsPlanProgress');
  const reviewBox = document.getElementById('kidsPlanReview');
  if (!root || !ageSelect || !taskList || !progressText) return;

  const storeKey = 'learnwithus.platform.v1';
  const plans = {
    preschool: {
      title: 'Preschool learning path',
      description: 'Short, repeatable activities for early language and number confidence.',
      tasks: [['1. Learn letters', 'children.html?mode=letters', '🔤'], ['2. Practise picture words', 'children.html?mode=words', '🖼️'], ['3. Count numbers', 'children.html?mode=numbers', '🔢']]
    },
    primary: {
      title: 'Primary learning path',
      description: 'Build reading, vocabulary and Maths skills before checking understanding.',
      tasks: [['1. Learn picture words', 'word-bank.html', '🖼️'], ['2. Practise addition', 'addition.html', '➕'], ['3. Check your learning', 'quiz-hub.html', '🏆']]
    },
    teens: {
      title: 'Growing learner path',
      description: 'Strengthen practical Maths and use quizzes to find topics worth revising.',
      tasks: [['1. Learn fractions', 'fractions.html', '🍕'], ['2. Practise measurement', 'measurement.html', '📏'], ['3. Review with quizzes', 'quiz-hub.html', '🏆']]
    },
    all: {
      title: 'Starter learning path',
      description: 'Choose a short lesson, practise a core skill and then check what you remember.',
      tasks: [['1. Learn letters', 'children.html?mode=letters', '🔤'], ['2. Practise numbers', 'children.html?mode=numbers', '🔢'], ['3. Check your learning', 'quiz-hub.html', '🏆']]
    }
  };

  const readState = () => {
    try { return JSON.parse(localStorage.getItem(storeKey) || '{}') || {}; } catch { return {}; }
  };
  const saveAge = age => {
    const state = readState();
    state.preferences = Object.assign({age: 'all', language: 'en'}, state.preferences || {}, {age});
    localStorage.setItem(storeKey, JSON.stringify(state));
  };
  const render = () => {
    const plan = plans[ageSelect.value] || plans.all;
    const state = readState();
    const minutes = Number(state.dailyProgressMinutes) || 0;
    const goal = Number(state.dailyGoalMinutes) || 10;
    progressText.textContent = 'Today: ' + minutes + ' / ' + goal + ' learning minutes';
    root.querySelector('#kidsPlanTitle').textContent = plan.title;
    root.querySelector('#kidsPlanDescription').textContent = plan.description;
    taskList.innerHTML = plan.tasks.map(task => { const completed = Array.isArray(state.completed) && state.completed.includes(task[1]); return '<a class="kids-plan-task' + (completed ? ' is-complete' : '') + '" href="' + task[1] + '"><span class="kids-plan-icon" aria-hidden="true">' + task[2] + '</span><span><strong>' + task[0] + '</strong><small>' + (completed ? 'Completed on this device' : 'Open focused activity') + '</small></span><span aria-hidden="true">' + (completed ? '✓' : '→') + '</span></a>'; }).join('');
    const mistakes = Array.isArray(state.mistakes) ? state.mistakes.slice(0, 3) : [];
    if (reviewBox) reviewBox.innerHTML = mistakes.length ? '<h3>Review before moving on</h3><p>These quiz topics are worth another look.</p><div class="kids-plan-review-list">' + mistakes.map(item => '<a href="' + (item.url || 'quiz-hub.html') + '"><strong>' + (item.tag || item.title || 'Quiz topic') + '</strong><small>Missed ' + (item.count || 1) + ' time' + ((item.count || 1) === 1 ? '' : 's') + ' · Review now →</small></a>').join('') + '</div>' : '';
  };

  const state = readState();
  ageSelect.value = plans[state.preferences?.age] ? state.preferences.age : 'all';
  ageSelect.addEventListener('change', () => { saveAge(ageSelect.value); render(); });
  render();
})();
