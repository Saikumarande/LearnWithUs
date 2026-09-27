## Current release: v2.1.0
### v2.1.0 highlights
- Reworked Numbers into one learning view with exactly four dropdown sets: **1–25, 26–50, 51–75, 76–100**.
- Each selected set renders all **25 number cards together** with spoken number names and counting/place-value aids; the old internal 20-number pager is removed for Numbers.
- Number Quiz uses the same four sets and keeps 10-question random practice, spoken feedback, score cards and saved progress.
- The Numbers completion area keeps the shared **Learn → practise → quiz** interface with **Start Numbers Quiz** and **Next: Place Value** buttons.
- Added v2.1.0 number-range, UI-source, compatibility and browser-render regression checks; full release validation remains mandatory twice.

### v2.1.0 final validation target
- Smoke/canonical routes: **208** assertions
- Recursive links/assets/JavaScript syntax: **1,521** assertions
- Whole-site HTML structure/folder audit: **773** assertions
- Feature regression: **168** assertions
- Release regression: **68** assertions
- v1.12 compatibility UI/runtime: **38** assertions
- v2.0.0 structure/UI compatibility: **161** assertions
- Shared journey/folder regression: **358** assertions
- v2.1.0 Numbers runtime/source regression: **45** assertions
- Server/MIME/custom 404: **42** assertions
- Core automated suite: **3,382 assertions per run**
- Rendered Chromium UI + actual Numbers browser runtime: **88 assertions per run**
- Complete release validation: **3,470 assertions per run**, required twice after final cleanup.

# LearnWithUs v2.1.0

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
LearnWithUs-v2.1.0/
├── public/
│   ├── index.html                    # Home page
│   ├── quiz/                         # Canonical quiz HTML
│   │   ├── quiz-hub.html
│   │   ├── kids-quiz.html
│   │   ├── counting-quiz.html
│   │   ├── missing-letters-quiz.html
│   │   ├── spelling-quiz.html
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
