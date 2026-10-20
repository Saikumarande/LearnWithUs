# v4.0.0 Release Quality Audit

## Current release: v4.0.0

Navigation and QA hardening of the v3.20.0 source-first codebase. All existing learning URLs and progress storage keys retained. See `docs/V400-RELEASE-QA.md` for testing and limitations.

# Source-first project structure (v3.20.0)

**Edit files in `src/`, not `public/` or `dist/`.** Run `npm run build` before opening `public/index.html` in Live Server, or before `npm start`. Existing URLs, redirects and learning-progress storage keys have not changed.

Full folder map, build commands, deployment and migration notes: **[docs/SOURCE-STRUCTURE.md](docs/SOURCE-STRUCTURE.md)**.

---

## Previous release: v3.20.0 — Family Learning, Interactive Food & Health, and Life Skills

## Previous release: v3.19.0 — Family Learning, Interactive Food & Health, and Life Skills

## Previous release: v3.18.0 — Family Learning, Interactive Food & Health, and Life Skills

## Previous release: v3.17.0 — Science, Maths and Indian Languages Level 2

Based on complete v3.10.0 production. No existing learning topics or routes removed.

- v3.11.0 Science: States of Matter, Light & Shadows, Sound & Vibrations, Electricity & Circuits, Food Chains (S16–S20).
- v3.12.0 Maths: Decimals, Percentages, Area & Perimeter, Introduction to Algebra, Coordinates (M22–M26).
- v3.13.0 Languages: Hindi Matras, Hindi Everyday Words, Hindi Sentences, Telugu Gunintalu, Telugu Everyday Words and Telugu Sentences (L3–L8).
- Each topic has its own learning HTML and quiz HTML, three explained practice questions, ten explained quiz questions, score-card and local learning progress.
- Concept simulators cover matter, light, sound, circuits, food chains, decimal tenths, percentages, rectangle area/perimeter, algebra balancing and coordinates. Hindi and Telugu audio uses a matching browser voice only, never an English voice substitute.
- Original 18 Core learning steps, nine branch identities, all earlier routes, profile storage and achievement systems are retained.

## Current release: v3.10.0

Expanded category scrolling (60% of viewport), gentler menu auto-hide, flag images in flag/geography quiz questions and answers.

## Previous release: v3.9.0

## v3.9.0 — Navigation, achievements, Planets and 48 real illustrated flags

- Compact (~38px) sticky topic navigation: returns on upward scroll anywhere, full-page visibility, right-aligned Search and Expand.
- Responsive Quiz Certificates buttons made equal-width with no overlaps.
- Planets now uses explicit Web Animations play/pause instead of competing CSS media rules, with visible status and reduced-motion initial preference.
- All 48 taught countries now have distinct bundled Noto Color Emoji flag-illustration PNGs, referenced in both the Countries & Capitals and World Flags selectors. No font binaries distributed. The artwork is stylized, not official government imagery.
- Existing quiz questions, progress, 18-step Core Journey, and URLs retained.

# LearnWithUs v3.8.0 — Website Bug Fixes & Per-Page Versions

## Current release: v3.8.0

### v3.8.0 navigation and quiz follow-up fixes (14 October 2026)

Fixed old duplicate category menus; implemented nine expandable searchable branches and equal-sized horizontal topic tabs with wheel scrolling. Same-branch Previous/Next across Creativity, English, Maths, Science and focused lessons; preserves existing Quiz links. Added parent-controlled tracing Next/Previous, quiz attempt certificates on My Learning, interactive flags and varied quiz questions, equal-width country panels, and a stronger planets animation toggle. Removed redundant Hindi and Creativity content. Footer uses a compact left-aligned per-page version. See `docs/V370-TEST-REPORT.md`.



Based on the complete v3.5.0 production archive. All existing lessons, branch codes, routes, saved progress and the 18-step Core Journey remain in place.

### v3.8.0 corrections
- Added a footer **page version** on all pages with a standard footer; the homepage shows the latest **release version**. Internal pages keep their last-modified version until changed again. New page updates must be registered in `assets/release-version.js`.
- Removed redundant Telugu instructions and word-card category labels.
- Separated A–Z Phonics (26 words) from 100 unique Picture Words (no overlap).
- Replaced typed Phonics and 100-word spelling with separate five-choice picture quizzes and spoken correct/wrong answers.
- Letter recognition quizzes show selected capitals/small/cursive style; tracing has a separate Hear row and its own 10-question parent-reviewed drawing quiz.
- Removed YouTube embeds from Poems while retaining a Play placeholder; removed unrelated Quiz Hub actions from Poems and Creativity.
- Added Animal Names Quiz (five choices), linked from Kids Corner and Quiz Hub.
- Improved planet animation controls and Country/Capital selectable list/detail layout.
- Moved the Time & Calendar Kids category card to Life Skills without changing Core step 17.
- Creativity uses a single visible activity with a compact C1–C12 topic strip; Print & Share is available.
- Times Tables keeps Previous → Quiz → Next ordering.

Tests: `npm test`, `npm run test:browser-ui`. See `docs/V360-TEST-REPORT.md` for exact coverage, screenshots and limitations.

# LearnWithUs v3.4.0 — Full Learning Platform Expansion

This release upgrades the v2.6.0 codebase **without removing existing lessons or quizzes**. Seven new release groups are included: v2.7 Smart Learning, v2.8 Motivation, v2.9 Coding, v3.0 Profiles, v3.1 World, v3.2 Everyday Knowledge, v3.3 Learning Tools. The existing 18-step Core Learning Journey remains unchanged.

**Compatibility:** `learnwithus.platform.v1` is retained and mirrored to the currently selected profile. The original default profile is saved at `learnwithus.profile.default.v1`. Question-level mistakes and mastery data are saved under `learnwithus.smart.v1.<profileId>`. Previous quiz score histories are kept even where historic quiz answers were not recorded.


### Final v3.3.0 verification
- Core/source/server assertions: **5,947 / 5,947** per run.
- Chromium/browser interactive assertions: **368 / 368** per run.
- Full frozen-release suite: **6,315 / 6,315** per run, executed twice without production edits between runs.
- No live preview or production deployment is included; this archive is ready for your review and deployment.

### Feature locations after deployment
- Kids Corner → **Explore by learning area** remains eight branches with the original **18 Core steps**.
- **Games & Challenges**: Smart Learning, Missions, Coding & Logic, Learning Tools.
- **World & India**: World Explorer, Flags, Landmarks.
- **English & Reading**: Kids Dictionary, Listening Comprehension, Conversation.
- **Life Skills**: Community Helpers, Transport & Vehicles, Everyday Situations.
- **Languages**: Child Profiles and preference settings.
- Parent Dashboard: `parent-dashboard.html`; Smart Learning: `smart-learning.html`; Learning Tools: `learning-tools.html`.
- Scores and question-level review are available for Science, Smarter Maths and supported English quizzes. Older saved quiz scores are retained, but missing historical question answers cannot be reconstructed.
- Hindi/Telugu preferences provide short curated introductory hints for selected newer lessons, not complete translations of every prior page.

**Important constraints:** No backend cloud sync, emailing, or real authentication. Profiles are separate only within the same browser/device. The world map is deliberately schematic. Reading Coach speech recognition depends on browser support. Certificates verify participation in local activities, not school accreditation.

## Current release: v3.3.0

### v2.6.0 verification
- Science + Maths new topics tested with existing suite.
- 210 new subject questions in v2.6.0 (110 in v2.5.0), each with four unique choices.
- Tests checked every new lesson and quiz view in Chromium, plus full quiz completion and saved score-card integration.
- See `docs/NEW-COURSES.md` for website navigation and future-change rules.

### v2.6.0 — Science & Discovery + Smarter Maths (2026-10-14)
The 18-step Core Journey, English E1–E14, prior topics and progress storage remain unchanged. New Science topics appear as S5–S15 in the Science branch, in a dedicated Kids Corner Science category and in Quiz Hub. New Maths topics appear as M12–M21 in the existing Maths branch, Maths activity cards and Maths Quiz Hub section.

Each new topic has a concept-first learning page, ten factual or numeracy examples, practice questions, a focused ten-question quiz, existing spoken correct/wrong feedback and a shared score card. New routes are stable, with no existing pages deleted.

### v2.4.0 — Reading & English Upgrade (2026-10-14)
- Added Sight Words, Word Families, Rhyming Words, Opposites, Sentence Builder, Basic Grammar, Reading Comprehension, Dictation / Listen & Type, and Reading Coach.
- Expanded only the English & Reading branch from E1–E5 to E1–E14; the 18-step Core Learning Journey remains unchanged.
- Added focused quizzes for every new topic using the shared learner name, score card, progress and spoken correct/wrong feedback.
- Added a microphone-based Reading Coach when browser speech recognition is available; LearnWithUs does not save voice recordings.
- Added Kids Corner, Quiz Hub, routing, sitemap and PWA/offline discovery for the new English features.

### v2.4.0 final validation
- Core/source/server matrix: **4,698 / 4,698** assertions per run.
- Chromium/runtime matrix: **248 / 248** assertions per run.
- Complete frozen-release matrix: **4,946 / 4,946** checks per run; executed twice after final synchronization.


### v2.3.0 — Future-ready Kids learning journeys (2026-10-14)
- Replaced the single 40-stop numbered roadmap with a shorter 18-step **Core Learning Journey** containing only the foundation sequence.
- Added eight expandable branch journeys: English & Reading, Maths & Numbers, Languages, Science & Discovery, World & India, Stories/Sports/Creativity, Life Skills, and Games & Challenges.
- Existing learning destinations remain available; branch codes (E1, M1, L1, S1, W1, C1, LS1, G1) allow future topics to be added without renumbering the Core Journey.
- Added branch progress meters and a separate **Recommended next** card, both powered by the existing `learnwithus.platform.v1` visited data. No storage migration or URL changes were introduced.
- The journey system remains visible only on the base Kids Corner; existing `?mode=` learning views continue to hide it.

### How to identify v2.3.0 on the website
Open **Kids Corner**. Near the top you should see **Core Learning Journey**, an 18-stop road, a separate **Recommended next** card, then **Explore by learning area** with eight expandable journey cards. Open a journey card to see stable branch labels such as E1 or M1 and its progress count.

### v2.3.0 final validation
- Core/source/server matrix: **4,553 / 4,553** assertions per run.
- Chromium/runtime matrix: **162 / 162** assertions per run.
- Complete frozen-release matrix: **4,715 / 4,715** checks per run; run twice after final synchronization.

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

# LearnWithUs v2.4.0

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


## v2.4.0 — Reading & English Upgrade
Adds Sight Words, Word Families, Rhyming Words, Opposites, Sentence Builder, Basic Grammar, Reading Comprehension, Dictation / Listen & Type, and Reading Coach. The Core Journey remains unchanged; the English & Reading branch expands from E1–E5 to E1–E14. Existing progress storage (`learnwithus.platform.v1`) is preserved.

### Future development compatibility policy

Read `docs/LEARNING-PAGE-STANDARD.md` **before adding a Kids feature**. All new category cards must use the existing responsive component and each new topic must be independently addressable, with three practice questions, topic quiz and Previous/Next. Do not change the Core 18-step roadmap or the existing device/profile storage keys. The acceptance checklist, screenshot evidence and complete regression matrix are in `docs/V340-TEST-REPORT.md`.

## v3.5.0 — responsive category/navigation fix (2026-10-14)
- Fixed missing `focused-topics.css` on five subject hub pages, the root cause of unstyled inline cards.
- Added mandatory shared `branch-layout.css` and single-row `branch-topic-strip` navigation based directly on stable roadmap step URLs. No roadmap renumbering.
- Added visible, equally sized colourful cards for all topic selection hubs, including Smart Learning, Motivation, Coding, Profiles, Everyday and Learning Tools.
- Preserved original lesson/quiz URLs, logic, score cards, profiles, local progress and 18-step Core Journey.
- Added release regression contracts specifically asserting stylesheet inclusion, category navigation, DOM layout and responsive geometry.


## v3.8.0 — Bug fixes (2026-10-14)
- New page-version labels, phonics/word-bank separation, five-choice spelling quizzes, parent-guided tracing, animal quiz, interactive countries, planet animation override, poem recording placeholders, category and creativity navigation corrections.
- All existing pages retained; local progress key unchanged.


### v3.8.0 focused fixes
Compact and aligned category bar, consistent score-card certificates, rendered national flag images, World Flags practice imagery, Planets explicit pause/play with visible status, brighter country cards, and cache-key updates.



## 3.17.0 additions
- Punctuation Mastery (english) — dedicated lesson, practice and quiz.
- Syllables & Silent Letters (english) — dedicated lesson, practice and quiz.
- Paragraph Writing (english) — dedicated lesson, practice and quiz.
- Reading Fluency Plus (english) — dedicated lesson, practice and quiz.
- Kids Sudoku 4×4 (games) — dedicated lesson, practice and quiz.
- Tangram Puzzle Maker (games) — dedicated lesson, practice and quiz.
- Visual Coding: If / Else (games) — dedicated lesson, practice and quiz.
- Logic Escape Room (games) — dedicated lesson, practice and quiz.
- Pattern Detective (games) — dedicated lesson, practice and quiz.
- Physical Geography (world) — dedicated lesson, practice and quiz.
- World Time Zones (world) — dedicated lesson, practice and quiz.
- Natural Wonders (world) — dedicated lesson, practice and quiz.
- Latitude & Longitude (world) — dedicated lesson, practice and quiz.
- Climate Zones (world) — dedicated lesson, practice and quiz.
- Comic Strip Creator (creative) — dedicated lesson, practice and quiz.
- Flipbook Animation Lab (creative) — dedicated lesson, practice and quiz.
- Digital Poster Maker (creative) — dedicated lesson, practice and quiz.
- Music Beat Composer (creative) — dedicated lesson, practice and quiz.
- My Art Gallery (creative) — dedicated lesson, practice and quiz.
