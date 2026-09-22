'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
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
  'contact.html'
];

for (const page of pages) {
  const file = path.join(root, page);
  if (!fs.existsSync(file)) throw new Error(`Missing required page: ${page}`);
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('assets/site-shell.js')) {
    throw new Error(`${page} does not load the shared site shell`);
  }
}

const shell = fs.readFileSync(path.join(root, 'assets', 'site-shell.js'), 'utf8');
if (!shell.includes('G-14CDXN6DDM')) {
  throw new Error('Google Analytics measurement ID is missing');
}

for (const file of ['server.js', 'package.json']) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing ${file}`);
}

console.log(`Smoke tests passed for ${pages.length} pages.`);

