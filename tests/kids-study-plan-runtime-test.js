'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const project = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(project, 'public/assets/kids-study-plan.js'), 'utf8');
let checks = 0;
const failures = [];
const check = (condition, message) => {
  checks += 1;
  if (!condition) failures.push(message);
};

function loadPlan(initialState) {
  const elements = new Map();
  const createElement = id => {
    const element = { id, value: 'all', innerHTML: '', textContent: '', handlers: {} };
    element.addEventListener = (name, handler) => { element.handlers[name] = handler; };
    elements.set(id, element);
    return element;
  };
  const root = createElement('kidsStudyPlan');
  const ageSelect = createElement('kidsPlanAge');
  const taskList = createElement('kidsPlanTasks');
  const progressText = createElement('kidsPlanProgress');
  const reviewBox = createElement('kidsPlanReview');
  const title = createElement('kidsPlanTitle');
  const description = createElement('kidsPlanDescription');
  root.querySelector = selector => elements.get(selector.slice(1));

  let stored = JSON.stringify(initialState);
  const localStorage = {
    getItem: key => key === 'learnwithus.platform.v1' ? stored : null,
    setItem: (key, value) => { if (key === 'learnwithus.platform.v1') stored = value; }
  };
  const document = { getElementById: id => elements.get(id) || null };
  vm.runInNewContext(source, { document, localStorage });
  return { ageSelect, taskList, progressText, reviewBox, title, description, readStored: () => JSON.parse(stored) };
}

const initialState = {
  preferences: { age: 'primary', language: 'te-IN' },
  dailyProgressMinutes: 7,
  dailyGoalMinutes: 20,
  completed: ['word-bank.html', 'fractions.html'],
  mistakes: [{ url: 'addition-quiz.html?topic=addition', tag: 'Addition', count: 2 }]
};
const plan = loadPlan(initialState);

check(plan.ageSelect.value === 'primary', 'Saved primary path was not restored');
check(plan.title.textContent === 'Primary learning path', 'Primary path title did not render');
check(plan.description.textContent.includes('Build reading'), 'Primary path description did not render');
check(plan.progressText.textContent === 'Today: 7 / 20 learning minutes', 'Daily progress or goal did not render');
check(plan.taskList.innerHTML.includes('href="word-bank.html"'), 'Primary picture-word task link is missing');
check(plan.taskList.innerHTML.includes('Completed on this device'), 'Completed task label did not render');
check(plan.taskList.innerHTML.includes('href="addition.html"') && plan.taskList.innerHTML.includes('Open focused activity'), 'Incomplete task label or link did not render');
check(plan.reviewBox.innerHTML.includes('href="addition-quiz.html?topic=addition"'), 'Mistake review link did not render');
check(plan.reviewBox.innerHTML.includes('Missed 2 times'), 'Mistake count did not render');

const expectedPaths = {
  preschool: ['Preschool learning path', 'children.html?mode=letters'],
  primary: ['Primary learning path', 'word-bank.html'],
  teens: ['Growing learner path', 'fractions.html'],
  all: ['Starter learning path', 'children.html?mode=letters']
};
for (const [age, [title, firstTask]] of Object.entries(expectedPaths)) {
  plan.ageSelect.value = age;
  plan.ageSelect.handlers.change();
  check(plan.title.textContent === title, age + ' path title did not update');
  check(plan.taskList.innerHTML.includes('href="' + firstTask + '"'), age + ' path task link did not update');
  check(plan.readStored().preferences.age === age, age + ' path selection was not saved');
}

const savedState = plan.readStored();
check(savedState.preferences.language === 'te-IN', 'Changing age overwrote the saved language preference');
check(savedState.dailyProgressMinutes === 7 && savedState.dailyGoalMinutes === 20, 'Changing age overwrote progress data');
check(savedState.mistakes[0].tag === 'Addition', 'Changing age overwrote quiz mistakes');
const reloaded = loadPlan(savedState);
check(reloaded.ageSelect.value === 'all', 'Most recently saved path was not restored after reload');
check(reloaded.title.textContent === 'Starter learning path', 'Reloaded path content did not match saved choice');

const noMistakes = loadPlan({ preferences: { age: 'all' }, mistakes: [] });
check(noMistakes.reviewBox.innerHTML === '', 'Empty mistake history should not show stale review links');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Kids study-plan runtime checks passed: ${checks}/${checks} assertions.`);