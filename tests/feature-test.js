'use strict';

const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const projectRoot=path.resolve(__dirname,'..');
const root=path.join(projectRoot,'public');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const failures=[];let checks=0,passed=0;
const expect=(value,message)=>{checks++;if(!value)failures.push(message);else passed++;};

const children=read('children.html');
const hindi=read('hindi.html');
const telugu=read('telugu.html');
const languageJs=read('assets/languages.js');
const platform=read('assets/platform.js');
const shell=read('assets/site-shell.js');
const shellCss=read('assets/site-shell.css');
const earlyJs=read('assets/early-learning.js');
const childrenJs=read('assets/children.js');
const manifest=JSON.parse(read('manifest.webmanifest'));
const packageJson=JSON.parse(fs.readFileSync(path.join(projectRoot,'package.json'),'utf8'));
const enhancedPages=['index.html','food.html','catalog.html','mysteries.html','journeys.html','quiz.html','children.html','early-learning.html','kids-skills.html','word-bank.html','letter-tracing.html','counting-quiz.html','missing-letters-quiz.html','spelling-quiz.html','addition.html','subtraction.html','multiplication.html','division.html','math-quiz.html','quiz-hub.html','kids-quiz.html','hindi.html','telugu.html','health.html','dashboard.html','contact.html','privacy.html','404.html'];
const wordContext={window:{}};vm.runInNewContext(read('assets/word-bank.js'),wordContext);

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
expect(read('service-worker.js').includes("CACHE='learnwithus-v1.8.1'"),'Service-worker cache version must match release 1.8.1');
expect(read('robots.txt').includes('Sitemap:'),'robots.txt must advertise the sitemap');
expect(fs.readFileSync(path.join(projectRoot,'server.js'),'utf8').includes("path.join(__dirname, 'public')"),'Server must expose only the public folder');
expect(fs.readFileSync(path.join(projectRoot,'server.js'),'utf8').includes('404.html'),'Server must use the custom 404 page');
expect(fs.readFileSync(path.join(projectRoot,'VERSION'),'utf8').trim()==='1.8.1','VERSION must match release 1.8.1');
expect(packageJson.version==='1.8.1','package.json must be version 1.8.1 for this release');
expect(platform.includes('dailyGoalMinutes')&&platform.includes('learningStreak'),'Daily goal and streak state are missing');
expect(platform.includes('dailyChallenge')&&platform.includes('achievements'),'Daily challenge and achievements are missing');
expect(platform.includes('mistakes')&&platform.includes('Review quiz mistakes'),'Quiz mistake review is missing');
expect(platform.includes('learningTimer')&&platform.includes('Continue learning'),'Learning activity tracking is missing');
expect(platform.includes('categoryStats')&&platform.includes('Progress by category'),'Category progress feature is missing');
expect(platform.includes('milestones')&&platform.includes('Learning milestone'),'Learning milestones feature is missing');
expect(platform.includes('lw-search-category')&&platform.includes('category.addEventListener'),'Search category filters are missing');
expect(platform.includes('accessibilityPanel')&&platform.includes('lw-large-text')&&platform.includes('lw-high-contrast'),'Display accessibility controls are missing');
expect(!platform.includes('offlineStatus')&&!platform.includes('lw-online-status'),'Online/offline status indicator should be removed');
expect(platform.includes('Quick learning')&&platform.includes('Learning statistics'),'Quick-learning and statistics sections are missing');
expect(platform.includes('Help us make learning better')&&platform.includes('Yes, help improve LearnWithUs'),'Friendly analytics consent wording is missing');
expect(read('privacy.html').includes('Your learning progress remains on this browser'),'Privacy page must explain device-only learning clearly');
expect(platform.includes('Your learning overview stays private on this browser'),'Dashboard privacy reassurance is missing');
expect(shell.includes("tools.id='fl-utility-menu'")&&shell.includes("toggle.setAttribute('aria-controls',tools.id)"),'The right-hand website tools menu is missing');
expect(shellCss.includes('.fl-menu{display:flex')&&shellCss.includes('.fl-utility-menu[hidden]'),'Primary navigation must remain visible and tools must use a separate popup');
expect(shellCss.includes('.fl-section-nav{position:sticky')&&shellCss.includes('top:var(--fl-header-height)'),'Category navigation must remain visible below the global header');
expect(shellCss.includes('.fl-section-nav a[aria-current]')&&shellCss.includes('font-weight:900'),'Selected category must be displayed as a bold boxed tab');
expect(platform.includes('lw-settings-open')&&platform.includes('Display & accessibility'),'Settings menu access for display controls is missing');
expect(platform.includes('Privacy & analytics')&&platform.includes('Clear local learning data'),'Privacy and local-data controls must live in Settings');
expect(platform.includes('lw-dashboard-more')&&platform.includes('More progress & saved items'),'Dashboard detail grouping is missing');
expect(platform.includes('lw-search-open')&&platform.includes('lw-learning-link'),'Search and My Learning must be available from the site menu');
expect(platform.includes("getElementById('fl-utility-menu')"),'Header utilities must be placed inside the right-hand tools menu');
expect(platform.includes("startFeature('dashboard',dashboard)")&&platform.indexOf("startFeature('dashboard',dashboard)")<platform.indexOf("startFeature('header tools',injectHeader)"),'Dashboard must render before optional shared features');
expect(platform.includes("if(!Array.isArray(merged[key]))merged[key]=[]"),'Saved learning data must be normalised before use');
expect(childrenJs.includes("if(mode==='words')return [all]")&&childrenJs.includes("'All 26 picture words'"),'All Picture Words must appear together on one page');
expect(enhancedPages.every(file=>read(file).includes('data-learnwithus-platform')),'Every interactive page must load the learning platform directly');
expect(!platform.includes('class=\"lw-header-tools\"'),'Legacy separate header tools should not be injected');

expect(platform.includes('continueItem=recent[0]'),'Continue Learning must use the latest recent activity');
expect(read('dashboard.html').includes('Choose an activity →')&&read('dashboard.html').includes('Achievements'),'Dashboard must have useful content before JavaScript enhancement');
expect(shellCss.includes('.score-card-actions>a,.score-card-actions>button'),'Score-card actions must be styled as buttons');
expect(shellCss.includes('.score-card-actions>.score-share')&&shellCss.includes('font-weight:900'),'Share with a friend must receive the strongest score-card emphasis');
expect(read('dashboard.html').includes('id="lw-fallback-goal"')&&read('assets/dashboard-recovery.js').includes('[5,10,15,20,30]'),'Selectable dashboard goals must work in enhanced and fallback modes');
expect(read('assets/kids-quiz.js').includes('function saveQuiz')&&read('assets/quiz.js').includes('function saveQuiz'),'Both quiz systems need resilient local progress saving');
expect(children.includes('id="kidsActivitySearch"')&&read('assets/kids-search.js').includes('.kids-activity-card')&&read('assets/kids-search.js').includes('.kids-category-card'),'Kids activity search must filter the descriptive activity tiles and category groups');
expect(read('early-learning.html').includes('topic=colours')&&read('early-learning.html').includes('topic=shapes')&&read('early-learning.html').includes('id="matchingPanel"')&&read('early-learning.html').includes('topic=poems'),'Preschool activity navigation is incomplete');
expect(read('assets/early-learning.js').includes("['Turquoise','#40e0d0']")&&read('assets/early-learning.js').includes("['Semi-circle','◒']")&&read('assets/early-learning.js').includes('speechSynthesis'),'The 25 colours, 15 shapes or audio support are missing');
expect(['Red','Orange','Yellow','Green','Blue','Purple','Pink','Brown','Black','White','Grey','Light blue','Navy blue','Teal','Lime green','Olive green','Maroon','Violet','Indigo','Gold','Silver','Beige','Cream','Coral','Turquoise'].every(name=>earlyJs.includes("['"+name+"',")),'All 25 named colour cards must be present');
expect(['Circle','Square','Triangle','Rectangle','Oval','Star','Heart','Diamond','Pentagon','Hexagon','Octagon','Crescent','Cross','Arrow','Semi-circle'].every(name=>earlyJs.includes("['"+name+"',")),'All 15 named shape cards must be present');
expect(read('assets/early-learning.js').includes('Wrong answer. The correct answer is ')&&read('assets/early-learning.js').includes('Correct answer! It is '),'Picture quiz feedback is incomplete');
expect(earlyJs.includes("recordQuiz?.('Picture quiz'")&&earlyJs.includes("'Question '+(round+1)+' of '"),'Picture Quiz must track score and record quiz progress');
expect(earlyJs.includes('renderLearnWithUsScoreCard')&&earlyJs.includes('next.hidden=false'),'Picture Quiz must always enable Next and reuse the shared score card');
expect(wordContext.window.LEARNWITHUS_WORD_BANK.length===100,'Picture Words must contain exactly 100 learning words');
expect(new Set(wordContext.window.LEARNWITHUS_WORD_BANK.map(item=>item.word.toLowerCase())).size===100,'All 100 Picture Words must be different');
expect(read('assets/practice.js').includes('Array.from({length:10}')&&read('assets/practice.js').includes('.slice(0,4),pool=shuffle([item.count,...other])'),'Counting quiz must contain 10 questions with exactly five answer choices');
expect(read('assets/practice.js').includes("['Apple','Cat','Dog','Fish','Sun','Hat','Cup','Cap','Book','Moon']"),'Missing Letters must contain the requested 10 picture-guided questions');
expect(read('letter-tracing.html').includes('data-activity="tracing"')&&read('assets/practice.js').includes('does not automatically judge handwriting'),'Tracing must explain its guide-based behavior');
expect(['addition.html','subtraction.html','multiplication.html','division.html'].every(file=>read(file).includes('data-activity=')),'Each maths concept must have a dedicated lesson page');
expect(read('quiz-hub.html').includes('<h2>English</h2>')&&read('quiz-hub.html').includes('<h2>Maths</h2>')&&read('quiz-hub.html').includes('Telugu Letters'),'Quiz Hub subject groups are incomplete');
expect(read('assets/practice.js').includes('renderLearnWithUsScoreCard')&&read('assets/practice.js').includes('recordQuiz'),'New quizzes must reuse score-card sharing and progress recording');
expect(!children.includes('kids-skills.html?topic=phonics')&&children.includes('word-bank.html')&&children.includes('letter-tracing.html'),'Kids activities must use separate routes without a duplicate Phonics card');
expect(read('assets/kids.css').includes('.kids-learning-choices a.choice')&&read('assets/kids.css').includes('text-decoration:none'),'Kids activity card underlines must be removed');
expect(fs.readFileSync(path.join(projectRoot,'docs','CHANGELOG.md'),'utf8').includes('## 1.8.1'),'CHANGELOG must document release 1.8.1');
expect(fs.readFileSync(path.join(projectRoot,'package.json'),'utf8').includes('\"version\": \"1.8.1\"'),'package.json release version is missing');

expect(['place-value.html','odd-even.html','fractions.html','time-calendar.html','indian-money.html','measurement.html','india.html'].every(file=>fs.existsSync(path.join(root,file))),'v1.7 learning pages are missing');
expect(!read('children.html').includes('Picture quiz</span>')&&!read('children.html').includes('Letter quiz</a>'),'Kids Corner must not duplicate quiz activities outside Quiz Hub');
expect(read('children.html').includes('English &amp; Reading')&&read('children.html').includes('India &amp; Maps'),'Kids Corner learning categories are incomplete');
expect(read('quiz-hub.html').includes('quiz-hub-colourful')&&read('quiz-hub.html').includes('Picture Matching')&&read('quiz-hub.html').includes('Measurement'),'Quiz Hub visual redesign is missing');
expect(read('assets/early-learning.js').includes('youtube-nocookie.com/embed/')&&read('assets/early-learning.js').includes("document.createElement('iframe')"),'Poems must use click-to-load in-page song embeds');
expect(read('assets/practice.css').includes('#traceLetterSelect{font-size:1.35rem')&&read('assets/practice.js').includes('id="nextTrace"'),'Tracing selector and Next letter control are missing');
expect(read('india.html').includes('India map')&&read('india.html').includes('India_-_administrative_map.png')&&read('india.html').includes('data-map-game'),'Interactive India map and activities are missing');
expect(read('service-worker.js').includes('learnwithus-v1.8.1')&&read('service-worker.js').includes("'./india.html'"),'v1.8.1 offline cache is incomplete');

expect(read('assets/practice.js').includes("Wrong answer. The correct answer is '+answer+'.'"),'Wrong-answer speech must say the complete feedback sentence');
expect((read('assets/india-data.js').match(/\"name\":/g)||[]).length===36,'India map must include all 28 states and 8 union territories');
expect(!Array.from(fs.readdirSync(root)).filter(f=>f.endsWith('.html')).some(f=>/<a\b[^>]*href=["']https?:\/\//i.test(read(f))),'Public HTML must not contain outbound website links');
expect(['place-value','odd-even','fractions','time-calendar','indian-money','measurement'].every(topic=>read('quiz-hub.html').includes('math-quiz.html?topic='+topic)),'Quiz Hub is missing one or more extended maths quizzes');
expect(read('math-quiz.html').includes('assets/math-extra-quiz.js')&&read('assets/math-extra-quiz.js').includes('QUESTION_SETS'),'Extended maths quiz engine is not wired');
expect(['place-value','odd-even','fractions','time-calendar','indian-money','measurement'].every(topic=>read('assets/math-extra-quiz.js').includes('\"'+topic+'\"')),'Extended maths quiz question sets are incomplete');
expect(['addition.html','subtraction.html','multiplication.html','division.html','place-value.html','odd-even.html','fractions.html','time-calendar.html','indian-money.html','measurement.html','letter-tracing.html','word-bank.html'].every(file=>read(file).includes('assets/learning-journey.js')),'Direct learning-to-quiz journey is missing from one or more learning pages');
expect(!['place-value.html','odd-even.html','fractions.html','time-calendar.html','indian-money.html','measurement.html'].some(file=>read(file).includes('← Back to Kids Corner')),'Extended maths lessons must not end with Back to Kids Corner');
expect(!read('kids-quiz.html').includes('Back to Kids Corner')&&read('kids-quiz.html').includes('Explore more quizzes'),'Kids quiz result navigation is not quiz-focused');
expect(read('assets/children.js').includes("ui.practiceQuiz.href='spelling-quiz.html'")&&read('assets/children.js').includes("ui.practiceQuiz.href='early-learning.html?topic=matching'"),'Phonics and Animals must continue directly into their matching quizzes');
expect(read('india.html').includes('stateSelector')&&!read('india.html').includes('mapPointLayer')&&read('assets/india.js').includes('LEARNWITHUS_INDIA_PLACES'),'India state/UT interaction layer is incomplete');

expect(read('assets/practice.js').includes("select.addEventListener('input',showTraceLetter)")&&read('assets/practice.js').includes("select.addEventListener('change',showTraceLetter)")&&read('assets/practice.js').includes("showTraceLetter();document.getElementById('nextTrace')"),'Tracing must render a selected letter immediately and keep Next letter synchronized');
expect(read('assets/practice.js').includes("const msg='Wrong answer. The correct answer is '+answer+'.'")&&read('assets/practice.js').includes('speak(msg);next();'),'Original maths lesson practice must speak complete answer feedback');
expect(read('assets/math-extra.js').includes("const msg=ok?'Correct answer!':'Wrong answer. The correct answer is '+q[2]+'.'")&&read('assets/math-extra.js').includes('speak(msg)'),'Extended maths lesson practice must speak complete answer feedback');
expect(read('assets/math-extra-quiz.js').includes("const msg=ok?'Correct answer!':'Wrong answer. The correct answer is '+q[2]+'.'")&&read('assets/math-extra-quiz.js').includes('speak(msg)'),'Extended maths quizzes must speak complete answer feedback');
expect(read('assets/india.js').includes("buildGroup('States'")&&read('assets/india.js').includes("buildGroup('Union territories'")&&read('assets/india.js').includes("setAttribute('aria-pressed'"),'India selector must render states and union territories below the map with in-place selection state');


expect(read('children.html').includes('kids-category-india')&&read('children.html').includes('India &amp; General Knowledge'),'India & Maps must have its own clear Kids Corner category');
expect((read('children.html').match(/class="[^"]*kids-activity-card/g)||[]).length>=20,'Kids Corner must expose the full learning set as descriptive activity tiles');
expect(read('assets/kids.css').includes('grid-template-columns:repeat(3,minmax(0,1fr))')&&read('assets/kids.css').includes('.activity-copy small'),'Kids Corner tiles must use a three-column desktop layout with descriptions');
expect(read('assets/children.js').includes('requestAnimationFrame(ensureModeRendered)')&&read('assets/children.js').includes("mode==='letters'?letters.length"),'Letters first-open render guard is missing');
expect(read('assets/children.js').includes('ui.learningGrid.replaceChildren()')&&read('assets/children.js').includes('ui.learningGrid.hidden=false'),'Letters mode must clear stale content and reveal the learning grid before rendering');
const childrenLiteralIds=[...childrenJs.matchAll(/getElementById\('([^']+)'\)/g)].map(match=>match[1]);
expect(childrenLiteralIds.every(id=>children.includes('id=\"'+id+'\"')),'Kids Corner script references a DOM id that no longer exists in children.html');
expect(!childrenJs.includes("getElementById('kids-quiz-choices')"),'Removed Kids quiz placeholder must not remain in the Kids Corner script');
expect(fs.existsSync(path.join(root,'assets','score-card.css'))&&read('assets/score-card.css').includes('width:min(100%,780px)')&&read('assets/score-card.css').includes('grid-template-columns:repeat(3,minmax(0,1fr))'),'Shared score-card responsive layout is missing');
const scorePages=fs.readdirSync(root).filter(file=>file.endsWith('.html')&&read(file).includes('score-card.js'));
expect(scorePages.every(file=>read(file).includes('assets/score-card.css')),'Every shared score-card consumer must load the responsive score-card stylesheet');
expect(read('assets/score-card.css').includes('@media(max-width:720px)')&&read('assets/score-card.css').includes('grid-template-columns:1fr'),'Score-card actions must stack on smaller screens');
expect(read('service-worker.js').includes("'./assets/score-card.css?v=20260926m'")&&read('service-worker.js').includes("'./assets/children.js?v=20260926m'"),'v1.8.1 offline cache must preload the corrected Kids and score-card assets');
expect(fs.readFileSync(path.join(projectRoot,'README.md'),'utf8').includes('## Current release: v1.8.1'),'README must document the current release changes');


expect(fs.existsSync(path.join(root,'multiplication-tables.html'))&&fs.existsSync(path.join(root,'multiplication-tables-quiz.html')),'Multiplication tables feature routes are missing');
expect(read('assets/tables-quiz.js').includes('score<8')&&read('assets/tables-quiz.js').includes('Wrong answer. The correct answer is '),'Table quiz review and spoken feedback are incomplete');
expect(read('time-calendar.html').includes('Days of the week')&&read('time-calendar.html').includes('Months of the year')&&read('time-calendar.html').includes('Seasons'),'Days/months/seasons learning is incomplete');
expect(fs.existsSync(path.join(root,'planets.html'))&&fs.existsSync(path.join(root,'countries-capitals.html'))&&fs.existsSync(path.join(root,'world-quiz.html')),'Planets/countries learning routes are missing');
expect((read('assets/world-data.js').match(/"country":/g)||[]).length===48,'Countries & Capitals data should contain 48 starter countries');
expect(read('india.html').includes('Map Hunt')&&read('assets/india.js').includes('mapTargetMarker')&&read('assets/india-quiz.js').includes('slice(0,10)'),'India interactive activities/quiz are incomplete');
expect(read('assets/score-card.js').includes('★ ★ ★ ★ ★')&&read('assets/score-card.js').includes('🏆'),'Score-card achievement symbols are missing');
expect(read('assets/practice.css').includes('.topic-quiz-journey .journey-actions')&&read('assets/practice.css').includes('grid-template-columns:repeat(auto-fit,minmax(220px,1fr))'),'Learning journey button alignment rules are missing');

for(const file of fs.readdirSync(root).filter(x=>x.endsWith('.html'))){expect(!/<a\b[^>]*href=["']https?:\/\//i.test(read(file)),'Outbound website link remains in '+file)}

if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log(`Feature checks passed: ${passed}/${checks} assertions. Language/audio, Kids rendering, score cards, active states, dashboard, PWA and server-file checks are green.`);
