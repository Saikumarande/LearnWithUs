'use strict';

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const root = path.join(projectRoot, 'public');
let checks=0;
const verify=(condition,message)=>{checks++;if(!condition)throw new Error(message);};

const pages = [
  'index.html',
  'food.html',
  'catalog.html',
  'children.html',
  'early-learning.html',
  'kids-skills.html',
  'word-bank.html',
  'letter-tracing.html',
  'counting-quiz.html',
  'missing-letters-quiz.html',
  'spelling-quiz.html',
  'addition.html',
  'subtraction.html',
  'multiplication.html',
  'division.html',
  'math-quiz.html',
  'quiz-hub.html',
  'kids-quiz.html',
  'health.html',
  'mysteries.html',
  'journeys.html',
  'quiz.html',
  'contact.html',
  'dashboard.html',
  'languages.html',
  'hindi.html',
  'telugu.html',
  'privacy.html',
  '404.html',
  'offline.html'
];

for (const page of pages) {
  const file = path.join(root, page);
  verify(fs.existsSync(file),`Missing required page: ${page}`);
  const html = fs.readFileSync(file, 'utf8');
  if (!['offline.html','languages.html'].includes(page)) verify(html.includes('assets/site-shell.js'),`${page} does not load the shared site shell`);
}

const shell = fs.readFileSync(path.join(root, 'assets', 'site-shell.js'), 'utf8');
const platform = fs.readFileSync(path.join(root, 'assets', 'platform.js'), 'utf8');
verify(platform.includes('G-14CDXN6DDM'),'Consent-managed Google Analytics measurement ID is missing');

for (const file of ['server.js', 'package.json', 'VERSION']) {
  verify(fs.existsSync(path.join(projectRoot, file)),`Missing ${file}`);
}

for(const file of ['multiplication-tables.html','multiplication-tables-quiz.html','planets.html','countries-capitals.html','world-quiz.html','india-quiz.html']) verify(fs.existsSync(path.join(root,file)),`${file} must exist`);

console.log(`Smoke tests passed: ${checks}/${checks} assertions across ${pages.length+6} pages.`);

