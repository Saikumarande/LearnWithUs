## Current release: v2.2.0

### v2.2.0 — World Currencies in-place explorer fix (2026-10-02)
- Fixed the World Currencies country click behavior that previously called `scrollIntoView()` and pulled the page upward.
- The explorer now mirrors the India States & Capitals interaction: countries stay in an internally scrollable viewport-sized panel while selected country/currency details remain visible alongside it.
- Desktop uses a side-by-side explorer; smaller screens keep the selected detail panel visible above the internally scrolling country list.
- Country clicks update in place without changing document scroll position or resetting the country-list scroll position.

### v2.2.0 final validation
- Core/source/server matrix: **4,502 / 4,502** assertions per run.
- Chromium/runtime matrix: **151 / 151** assertions per run.
- Complete frozen-release matrix: **4,653 / 4,653** checks per run, executed twice after final cleanup.

### v2.2.0 baseline highlights
- Built on the user-supplied `LearnWIthUs-2.1.3.zip` baseline without reverting the two Copilot fixes.
- Restricted Today’s Study Plan and the Kids Learning Roadmap to the base Kids Corner only; learning modes hide both.
- Added a first-run learner-name prompt stored inside the existing local LearnWithUs state. The name is reused in Kids greetings, Dashboard messaging, score cards, achievement cards and sharing copy.
- Split English checks into dedicated Letter Recognition, A–Z Phonics Spelling, 100 Picture Words Spelling and Letter Tracing & Order quizzes, each wired to the matching learning page and Quiz Hub.
- Standardized spelling, Maths, language, colour/shape and other updated quiz feedback to speak full correct/wrong answer sentences.
- Added Previous Letter to tracing and Previous Topic actions to the shared Learn → practise → quiz journeys.
- Reworked Place Value questions to test digit/place/value/composition concepts rather than arithmetic-looking expanded sums, and expanded Odd & Even plus core arithmetic lessons with concept-first explanations and examples.
- Added Stop Audio to whole-table playback and removed the unnecessary Review Multiplication action.
- Removed duplicate Time & Calendar and Measurement quiz CTAs so those pages end in one shared journey.
- Replaced Indian Money as a Maths topic with World Currencies: 195 countries, region/search learning, country→currency practice/quiz and backward-compatible Indian Money redirects.
- Added dedicated Colours and Shapes quizzes with shared voice feedback and score cards.
- Added a local eight-planet Solar System overview plus an accessible, pausable orbit teaching animation (conceptual, not to scale).
- Reordered the Kids roadmap so Hindi and Telugu follow Letters and Numbers, and linked Hindi/Telugu directly to their own letter quizzes.

### v2.2.0 baseline validation
The release includes dedicated v2.2.0 regressions for every requested fix plus recursive link/syntax, whole-site HTML/folder, live HTTP route crawl, feature/release, server, rendered-browser and runtime suites. The frozen release matrix contains **4,339 core assertions + 126 Chromium/runtime assertions = 4,465 checks per run** and must pass twice without production changes between runs.

# LearnWithUs v2.2.0

LearnWithUs is a Node.js educational website covering food discoveries, kids learning activities, Hindi and Telugu letters, health guides and quizzes.

## 1.12.0
- Aligned Life Skills and Learning Games quiz cards into equal-height responsive grids.
- Made Kids Corner category panels visually distinct with light section colours while preserving inner activity-card styling.
- Restricted the Kids Learning Roadmap to the base Kids Corner view; letter, phonics, number and animal learning modes hide it.
- Converted end-of-mode quiz links into real buttons and paired them with a clear Next Topic action.
- Extended shared Quiz + Next Topic journeys to India, languages, Stories, Creativity, Kids Skills, Life Skills and Learning Games where appropriate.
- Removed the redundant Dashboard “View more progress” link.
- Achievements are now clickable prize cards with detail, download and share actions.
- Added v1.12.0 UI/runtime regression coverage and retained full two-run release validation.

### v1.12.0 final validation
- Smoke: 93 assertions
- Links/assets/JavaScript syntax: 1,439 assertions
- Feature regression: 168 assertions
- Release regression: 68 assertions
- v1.12.0 UI/runtime: 38 assertions
- Server/MIME/404: 26 assertions
- Total: **1,832 automated assertions per complete run**
- The complete final suite must pass twice before the production ZIP is created.


## 1.11.4
- Roadmap START/FINISH labels now have reserved visual space and stronger standalone badges.
- Roadmap is slightly larger and uses a bright fixed hover/focus highlight without icon movement.
- Main header is slightly shorter again.
- Expanding the Kids category navigation now immediately reveals and keeps the expanded panel visible; Collapse is aligned to the bottom-right.

### v1.11.4 final validation
The final release tree is validated twice. Each full run passes **1,800/1,800 assertions**: 93 smoke checks, 1,430 links/assets/JavaScript checks, 168 feature checks, 68 release regressions, 15 v1.11.4 runtime/UI checks, and 26 server/MIME/404 assertions. Across both required runs: **3,600/3,600 assertions passed**.


### v1.9.0 — Stories, Sports & Creativity
- Added seven story collections with page-by-page local illustrations, browser read-aloud narration, vocabulary cards, moral/lesson and comprehension questions.
- Added Sports & Games learning with 12 locally illustrated activities covering equipment, players and game goals.
- Added a 10-question Sports & Games Quiz with five choices, spoken feedback, progress recording and the shared score card.
- Added Creativity Studio with drawing practice, interactive colouring, join-the-dots, paper craft and origami instructions, rhythm, dance prompts, story creation, poem building and a printable activity sheet.
- Added Stories, Sports and Creativity to Kids Corner and the shared scroll-aware Kids quick navigation.
- Added new routes and assets to the PWA offline cache and sitemap.
- Preserved existing progress/storage, quizzes, score cards, language learning, Food, Health and server behavior.

## Historical release: v1.11.4

This compatible feature release expands Kids Corner with complete **Stories**, **Sports & Games**, and **Creativity Studio** learning areas while preserving the v1.8.1 progress/storage model, existing quizzes, score cards, navigation, PWA behavior and server structure.

### Added in v1.9.0

- **Stories:** seven requested story categories, each with a four-page illustrated story, page narration, vocabulary cards, a moral/lesson and three comprehension questions with spoken answer feedback.
- **Sports & Games:** 12 locally illustrated sports/games with equipment, player setup and goal explanations plus read-aloud facts.
- **Sports & Games Quiz:** ten randomized five-choice questions with the same complete correct/wrong spoken feedback used by existing quizzes, saved quiz progress and responsive score cards.
- **Creativity Studio:** drawing lessons and canvas, interactive colouring, join-the-dots, paper craft instructions, origami, music/rhythm, dance prompts, story creation, build-your-own poem and a printable activity sheet.
- **Discoverability:** Stories, Sports and Creativity were added to Kids Corner and the shared scroll-aware Kids quick-navigation strip. Sports Quiz and story comprehension are linked from Quiz Hub.
- **Offline support:** all new routes, scripts, styles and locally bundled illustration assets are part of the production build and PWA release.
- **Release discipline:** README, changelog, feature-testing documentation, version metadata, automated tests and production ZIP are updated together.

### Validation for v1.9.0

Final production validation runs the complete suite twice from the final release tree. Each full run passes **1,649/1,649 assertions**: 83 smoke checks, 1,095 links/assets/JavaScript checks, 164 feature checks, 62 v1.9.0 targeted regression checks, 219 v1.9.0 runtime/data checks, and 26 server/MIME/404 checks. Across the two required runs that is **3,298/3,298 assertions passed**.

### Release discipline

For every future LearnWithUs code change, update **README.md**, `docs/CHANGELOG.md`, `VERSION`, `package.json`, service-worker cache entries when relevant, tests for the changed behavior, and the versioned production ZIP. Run the complete automated suite twice after final cleanup.

## Project structure

```text
LearnWithUs-v2.2.0/
├── public/
│   ├── index.html                    # Home page
│   ├── quiz/                         # Canonical quiz HTML
│   │   ├── quiz-hub.html
│   │   ├── kids-quiz.html
│   │   ├── counting-quiz.html
│   │   ├── phonics-spelling-quiz.html
│   │   ├── spelling-quiz.html
│   │   ├── letter-tracing-quiz.html
│   │   ├── language-quiz.html
│   │   ├── early-learning-quiz.html
│   │   ├── world-currencies-quiz.html
│   │   ├── math-quiz.html
│   │   ├── multiplication-tables-quiz.html
│   │   ├── india-quiz.html
│   │   ├── world-quiz.html
│   │   ├── sports-quiz.html
│   │   ├── life-skills-quiz.html
│   │   ├── games-quiz.html
│   │   └── quiz.html
│   ├── learn/
│   │   ├── kids/                     # Kids learning/UI pages
│   │   ├── food/                     # Food learning/UI pages
│   │   └── health/                   # Health learning/UI pages
│   ├── account/
│   │   └── dashboard.html
│   ├── info/
│   │   ├── contact.html
│   │   └── privacy.html
│   ├── system/
│   │   ├── 404.html
│   │   └── offline.html
│   ├── assets/                       # Shared CSS, JS, images, fonts and local art
│   ├── *.html                        # Legacy compatibility redirect pages only
│   ├── manifest.webmanifest
│   ├── service-worker.js
│   ├── robots.txt
│   └── sitemap.xml
├── docs/
│   ├── CHANGELOG.md
│   ├── FEATURE-TESTING.md
│   ├── FOLDER-STRUCTURE.md
│   ├── ROUTES.md
│   └── VERSIONING.md
├── tests/
├── config/
├── route-map.json
├── server.js
├── package.json
├── VERSION
└── README.md
```

Root HTML files other than `index.html` are intentionally tiny compatibility redirects so previously saved v1.x URLs continue to work. Full canonical content lives in the folders above.


Only `public/` is exposed by the Node.js server. Application code, tests and documentation cannot be requested as website files.

## Run and verify

Requires Node.js 24 LTS.

```powershell
npm test
npm start
```

`npm test` runs smoke, link/syntax, feature, release-regression and server-route checks.

Open `http://localhost:8080`.

## Azure App Service deployment

Deploy the complete project root—not only `public/`. Azure needs `package.json` and `server.js` at the root. The server automatically publishes the contents of `public/`.

For GitHub CI/CD, connect the repository and `main` branch in Azure App Service Deployment Center. Every successful push to `main` can then deploy automatically.

## Versioning rule

LearnWithUs follows Semantic Versioning:

- `1.0.1`: bug fix, content correction or small compatible improvement.
- `1.1.0`: new compatible feature, page, category or learning activity.
- `2.0.0`: breaking change to URLs, saved progress, deployment or major architecture.

For future prompts, update `package.json`, `VERSION`, the changelog and the ZIP filename together.
