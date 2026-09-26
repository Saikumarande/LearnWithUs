'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const projectRoot = path.resolve(__dirname, '..');
const root = path.join(projectRoot, 'public');
const htmlFiles = fs.readdirSync(root).filter(file => file.endsWith('.html'));
const failures = [];

function cleanReference(reference) {
  return reference.replace(/[?#].*$/, '');
}

for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(path.join(root, htmlFile), 'utf8');
  const references = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map(match => match[1]);
  for (const reference of references) {
    if (!reference || reference.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(reference)) continue;
    const local = cleanReference(reference);
    if (!local) continue;
    const target = path.resolve(root, local);
    if (!target.startsWith(root + path.sep) || !fs.existsSync(target)) failures.push(`${htmlFile}: missing ${reference}`);
  }
}

const scripts = [
  ...fs.readdirSync(path.join(root, 'assets')).filter(file => file.endsWith('.js')).map(file => path.join(root, 'assets', file)),
  path.join(projectRoot, 'server.js'),
  path.join(root, 'service-worker.js')
];
for (const script of scripts) {
  try { new vm.Script(fs.readFileSync(script, 'utf8'), {filename: script}); }
  catch (error) { failures.push(`${path.relative(root, script)}: ${error.message}`); }
}

for (const [base,json] of [[projectRoot,'package.json'],[root,'manifest.webmanifest']]) {
  try { JSON.parse(fs.readFileSync(path.join(base, json), 'utf8')); }
  catch (error) { failures.push(`${json}: ${error.message}`); }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Link and syntax checks passed for ${htmlFiles.length} HTML pages and ${scripts.length} JavaScript files.`);
