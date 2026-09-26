'use strict';

const fs=require('node:fs');
const path=require('node:path');
const projectRoot=path.resolve(__dirname,'..');
const root=path.join(projectRoot,'public');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const failures=[];
const expect=(value,message)=>{if(!value)failures.push(message);};

const children=read('children.html');
const hindi=read('hindi.html');
const telugu=read('telugu.html');
const languageJs=read('assets/languages.js');
const platform=read('assets/platform.js');
const shell=read('assets/site-shell.js');
const manifest=JSON.parse(read('manifest.webmanifest'));
const packageJson=JSON.parse(fs.readFileSync(path.join(projectRoot,'package.json'),'utf8'));

expect(children.includes('hindi.html')&&children.includes('telugu.html'),'Kids navigation must have separate Hindi and Telugu pages');
expect(hindi.includes('id="languageGrid"')&&telugu.includes('id="languageGrid"')&&hindi.includes('aria-live="polite"')&&telugu.includes('aria-live="polite"'),'Both language pages must provide an accessible grid and live audio status');
expect(languageJs.includes("'hi-IN'")&&languageJs.includes("'te-IN'"),'Hindi and Telugu speech locales are missing');
expect(languageJs.includes('findVoice')&&languageJs.includes('voiceschanged')&&languageJs.includes('Sound is disabled to avoid incorrect pronunciation'),'Strict matching-language voice protection is missing');
expect(languageJs.includes("[['అ','a'],['ఆ','ā'],['ఇ','i'],['ఈ','ī'],['ఉ','u'],['ఊ','ū'],['ఋ','r̥'],['ౠ','r̥̄']]")&&languageJs.includes("[['శ','śa'],['ష','ṣa'],['స','sa'],['హ','ha'],['ఱ','ṟa']]"),'Telugu letter rows are missing or out of order');
expect(languageJs.includes("[['अ','a'],['आ','ā'],['इ','i'],['ई','ī'],['उ','u'],['ऊ','ū'],['ऋ','r̥']]")&&languageJs.includes("[['ष','ṣa'],['स','sa'],['ह','ha'],['क्ष','kṣa'],['त्र','tra'],['ज्ञ','jña'],['श्र','śra']]"),'Hindi letter rows are missing or out of order');
expect(shell.includes("current==='hindi.html'||current==='telugu.html'"),'Separate language-page active-state handling is missing');
expect(platform.includes('currentInfo()')&&platform.includes('detail:info.detail'),'Rich recently-viewed metadata is missing');
expect(platform.includes('Daily recommendation')&&platform.includes('changes with the selected learner'),'Age-based recommendation explanation is missing');
expect(platform.includes('getFullYear()*372')&&platform.includes('new calendar day'),'Daily recommendation must rotate using the local calendar day');
expect(!platform.includes('<h2>Start here</h2>')&&!platform.includes('lw-path-card'),'Removed Start here section is still present');
expect(platform.includes("page==='dashboard.html'?' aria-current=\"page\""),'My learning active state is missing');
expect(manifest.display==='standalone','PWA manifest should use standalone display');
expect(read('service-worker.js').includes("CACHE='learnwithus-v20260925'"),'Service-worker cache version was not updated');
expect(read('robots.txt').includes('Sitemap:'),'robots.txt must advertise the sitemap');
expect(fs.readFileSync(path.join(projectRoot,'server.js'),'utf8').includes("path.join(__dirname, 'public')"),'Server must expose only the public folder');
expect(fs.readFileSync(path.join(projectRoot,'server.js'),'utf8').includes('404.html'),'Server must use the custom 404 page');
expect(fs.readFileSync(path.join(projectRoot,'VERSION'),'utf8').trim()==='1.0.0','VERSION must match release 1.0.0');
expect(packageJson.version===fs.readFileSync(path.join(projectRoot,'VERSION'),'utf8').trim(),'package.json and VERSION must match');

if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log('Feature checks passed: language grids/audio hooks, active states, dashboard history, recommendations, PWA and server files.');
