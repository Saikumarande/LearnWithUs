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
const shellCss=read('assets/site-shell.css');
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
expect(platform.includes("learning.setAttribute('aria-current','page')")&&platform.includes("page==='dashboard.html'"),'My learning active state is missing');
expect(manifest.display==='standalone','PWA manifest should use standalone display');
expect(read('service-worker.js').includes("CACHE='learnwithus-v1.2.1'"),'Service-worker cache version must match release 1.2.1');
expect(read('robots.txt').includes('Sitemap:'),'robots.txt must advertise the sitemap');
expect(fs.readFileSync(path.join(projectRoot,'server.js'),'utf8').includes("path.join(__dirname, 'public')"),'Server must expose only the public folder');
expect(fs.readFileSync(path.join(projectRoot,'server.js'),'utf8').includes('404.html'),'Server must use the custom 404 page');
expect(fs.readFileSync(path.join(projectRoot,'VERSION'),'utf8').trim()==='1.2.1','VERSION must match release 1.2.1');
expect(packageJson.version==='1.2.1','package.json must be version 1.2.1 for this feature release');
expect(fs.readFileSync(path.join(projectRoot,'VERSION'),'utf8').trim()==='1.2.1','VERSION must be 1.2.1 for this feature release');
expect(platform.includes('dailyGoalMinutes')&&platform.includes('learningStreak'),'Daily goal and streak state are missing');
expect(platform.includes('dailyChallenge')&&platform.includes('achievements'),'Daily challenge and achievements are missing');
expect(platform.includes('mistakes')&&platform.includes('Review quiz mistakes'),'Quiz mistake review is missing');
expect(platform.includes('learningTimer')&&platform.includes('Continue learning'),'Learning activity tracking is missing');
expect(platform.includes('categoryStats')&&platform.includes('Progress by category'),'Category progress feature is missing');
expect(platform.includes('milestones')&&platform.includes('Learning milestone'),'Learning milestones feature is missing');
expect(platform.includes('lw-search-category')&&platform.includes('category.addEventListener'),'Search category filters are missing');
expect(platform.includes('accessibilityPanel')&&platform.includes('lw-large-text')&&platform.includes('lw-high-contrast'),'Display accessibility controls are missing');
expect(platform.includes('offlineStatus')&&platform.includes('Offline · saved learning still works'),'Offline learning indicator is missing');
expect(platform.includes('Quick learning')&&platform.includes('Learning statistics'),'Quick-learning and statistics sections are missing');
expect(platform.includes('Help us make learning better')&&platform.includes('Yes, help improve LearnWithUs'),'Friendly analytics consent wording is missing');
expect(read('privacy.html').includes('Your learning progress remains on this browser'),'Privacy page must explain device-only learning clearly');
expect(platform.includes('Your learning overview stays private on this browser'),'Dashboard privacy reassurance is missing');
expect(shell.includes('fl-menu-toggle')&&shellCss.includes('.fl-menu.is-open'),'Three-line site menu behavior is missing');
expect(platform.includes('lw-settings-open')&&platform.includes('Display & accessibility'),'Settings menu access for display controls is missing');
expect(platform.includes('Privacy & analytics')&&platform.includes('Clear local learning data'),'Privacy and local-data controls must live in Settings');
expect(platform.includes('lw-dashboard-more')&&platform.includes('More progress & saved items'),'Dashboard detail grouping is missing');
expect(platform.includes('lw-search-open')&&platform.includes('lw-learning-link'),'Search and My Learning must be available from the site menu');
expect(!platform.includes('class=\"lw-header-tools\"'),'Legacy separate header tools should not be injected');

expect(platform.includes('continueItem=recent[0]'),'Continue Learning must use the latest recent activity');
expect(fs.readFileSync(path.join(projectRoot,'docs','CHANGELOG.md'),'utf8').includes('## 1.2.1'),'CHANGELOG must document release 1.2.1');
expect(fs.readFileSync(path.join(projectRoot,'package.json'),'utf8').includes('\"version\": \"1.2.1\"'),'package.json release version is missing');

if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log('Feature checks passed: language grids/audio hooks, active states, dashboard history, recommendations, PWA and server files.');
