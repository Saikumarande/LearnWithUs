'use strict';

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const root = path.join(projectRoot, 'public');
const pages = [
  'index.html',
  'food.html',
  'catalog.html',
  'children.html',
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
  if (!fs.existsSync(file)) throw new Error(`Missing required page: ${page}`);
  const html = fs.readFileSync(file, 'utf8');
  if (!['offline.html','languages.html'].includes(page) && !html.includes('assets/site-shell.js')) {
    throw new Error(`${page} does not load the shared site shell`);
  }
}

const shell = fs.readFileSync(path.join(root, 'assets', 'site-shell.js'), 'utf8');
const platform = fs.readFileSync(path.join(root, 'assets', 'platform.js'), 'utf8');
if (!platform.includes('G-14CDXN6DDM')) {
  throw new Error('Consent-managed Google Analytics measurement ID is missing');
}

for (const file of ['server.js', 'package.json', 'VERSION']) {
  if (!fs.existsSync(path.join(projectRoot, file))) throw new Error(`Missing ${file}`);
}

console.log(`Smoke tests passed for ${pages.length} pages.`);
