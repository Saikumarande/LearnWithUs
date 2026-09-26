# Changelog

## 1.10.0 — 2026-09-27
- Expanded Creativity Studio with many more lessons, selectors, scoring and shareable print sheets.
- Added Life Skills learning page with 12 topics.
- Added Learning Games page with 12 mini-games.
- Updated Kids Corner, quick navigation, Quiz Hub and offline cache.

## 1.9.0 — 2026-09-26
- Added Stories with seven categories, page-by-page local illustrations, narration, vocabulary, lessons and comprehension.
- Added Sports & Games learning and a 10-question spoken-feedback Sports Quiz.
- Added Creativity Studio with ten interactive/printable creative activities.
- Added the new areas to Kids Corner, shared Kids navigation, Quiz Hub, sitemap and offline cache.
- Preserved existing storage/progress and current learning/quiz models.

## 1.8.1 — 2026-09-26
- Changed Multiplication Tables 1–20 to one vertical fact per row and standardized learning/quiz coverage to ×1–×10.
- Added one consistent compact Kids quick-navigation strip across every Kids learning and quiz page.
- Added scroll-direction behavior: the Kids quick nav hides on downward scrolling and reappears on upward scrolling.
- Preserved existing Food/Health section navigation and all v1.8.0 learning, quiz, progress, score-card and PWA models.
- Updated service-worker cache entries, README and regression documentation.

## 1.8.0 — 2026-09-26
- Aligned Maths learning-journey action buttons consistently across arithmetic and extended maths lessons.
- Added Multiplication Tables 1–20 learning and a table-specific 10-question quiz with automatic table handoff and selectable table changes.
- Added review guidance when a table-quiz score is below 8/10.
- Expanded Time & Calendar with Days of the Week, Months of the Year and Seasons.
- Added Planets learning/quiz and Countries & Capitals learning/quiz.
- Reworked India Map Activities into Map Hunt typed answers plus five-choice capital/region interactions.
- Added a dedicated India States & Capitals quiz with five choices per question, voice feedback and score card.
- Added achievement symbols to the shared score-card artwork without changing existing score-card behavior.
- Updated Kids Corner, Quiz Hub, PWA cache, sitemap, README and tests while preserving the existing progress/storage model.

## 1.7.4 — 2026-09-26
- Fixed the Kids Corner Letters first-open render so A–Z cards appear immediately before any style switch.
- Rebuilt Kids Corner activity links as larger descriptive tiles with three columns on desktop and responsive two/one-column layouts.
- Separated India & General Knowledge from World Around Us and kept all existing activities in clearer subject categories.
- Updated Kids activity search for the new tile/category structure.
- Added a shared responsive score-card stylesheet to every quiz using the reusable score-card component, preventing oversized or off-screen results.
- Updated offline cache entries for the changed Kids Corner and score-card assets.
- Preserved existing quiz scoring, progress storage, URLs, PWA behavior and unrelated learning content.
- Added dedicated v1.7.4 regression checks for Kids categories, first-open Letters rendering, shared score-card consumers and public/dist parity.

## 1.7.3 — 2026-09-26
- Replaced the rough India-map presentation with a real labelled India state/UT reference map while retaining an offline local fallback.
- Moved all 28 state and 8 union-territory choices below the map; selections now update the right-side details panel in place without navigation.
- Fixed Letter Tracing so a selected letter renders immediately on input/change and Next Letter stays synchronized.
- Added complete spoken feedback to the four original maths lesson practice blocks and the six newer maths lesson practice blocks.
- Preserved quiz scoring, progress storage, score cards, PWA behavior, navigation and unrelated learning content.

## 1.7.2 — 2026-09-26
- Added direct Learn → Practise → Quiz continuation across existing maths lessons and applicable Kids learning activities.
- Added full 10-question quizzes for Place Value, Odd & Even, Fractions, Time & Calendar, Indian Money and Measurement using the existing score-card and saved-progress model.
- Restored the complete Kids Quiz Hub inventory across English, Maths, India/languages and Food.
- Replaced the previous rough India diagram with a locally bundled geographic India outline, real-coordinate state/UT markers, interactive detail cards and map activities.
- Removed redundant “Back to Kids Corner” actions where a direct quiz or quiz-discovery action is more useful.
- Kept existing storage, progress, PWA, server and original four-operation learning/quiz behavior intact.

## 1.7.1 — 2026-09-26
- Replaced external India map/directory redirects with an internal interactive India learning map and clickable state/UT details.
- Added map-based find-state, capital and region activities.
- Removed outbound website links from user-facing HTML and generated food source links.
- Simplified Kids Corner visual hierarchy with stronger category headings and quieter inner activity styling.
- Fixed quiz speech so wrong answers say the complete phrase: “Wrong answer. The correct answer is …”.
- Improved Letter Tracing with larger letter selection and a direct Next letter button.
- Replaced old poem audio controls with click-to-load in-page child-friendly song players.
- Preserved existing local progress, score-card, PWA and server models.

## 1.7.0 — 2026-09-26

- Reorganised Kids Corner into colourful learning categories and removed duplicate quiz links from learning navigation.
- Redesigned Quiz Hub with visual subject groups and clearer activity names.
- Replaced poem speech synthesis with recorded Wikimedia Commons audio and larger readable rhyme text.
- Standardised quiz feedback so wrong answers explicitly say they are wrong before revealing the correct answer.
- Added Place Value, Odd & Even, Fractions, Time & Calendar, Indian Money, and Measurement learning pages.
- Added India & Maps with all 28 states, 8 union territories, capitals, regions, major languages, national symbols and the official Survey of India political map.
- Enlarged the letter-tracing selector and updated offline cache/search discovery.

## 1.6.0 — 2026-09-26

- Corrected Picture Quiz to score one choice, announce correct and wrong answers, reveal the correct option, always enable Next, and show the reusable downloadable/shareable score card.
- Added six familiar public-domain children’s poems with Play buttons for spoken sing-along practice.
- Removed the duplicate Phonics card and renamed the existing A-for-Apple activity Phonics Starters.
- Added a separate 100 Picture Words learning page reused by spelling and missing-letter quizzes.
- Replaced the combined learning-games screen with dedicated routes for tracing, counting, missing letters, spelling, addition, subtraction, multiplication and division.
- Added 10-question Counting, Missing Letters, Picture Spelling and Maths quizzes with local progress and shared score cards.
- Added a Kids Quiz Hub grouped into English, Maths, Indian languages and Food.
- Explained that tracing is guided freehand practice and does not automatically judge handwriting.

## 1.5.0 — 2026-09-26

- Separated Colours and Shapes into their own activities with 25 colour swatches and 15 shapes.
- Enlarged the Picture Quiz image, moved the question below it and added clear correct/wrong feedback with spoken answers.
- Added Picture Quiz to the Kids quizzes section.
- Renamed Nursery Rhymes to Poems and expanded the original poem set.
- Removed underlines from Kids Corner activity-card text.
- Added working Phonics, Letter Tracing, Counting Objects, Missing Letters, Reading and Spelling, Addition and Subtraction, and Multiplication and Division categories.
- Preserved local progress tracking, active-category highlighting, audio, search, dashboards and all existing learning routes.

## 1.4.0 — 2026-09-26

- Added separate preschool activities for colours and shapes, picture matching and short original nursery rhymes.
- Added Kids Corner activity search and age 2–4 learning routes while preserving existing activities.
- Made the selected category a clear, bold, filled tab across Kids and Food navigation.
- Added a visible 5, 10, 15, 20 or 30 minute goal selector even when the enhanced dashboard cannot load.
- Added resilient local quiz saving so progress, completed activities and achievements update after quizzes.
- Emphasised Share with a friend while keeping the other score-card actions standard.
- Added offline caching, recent-history details and automated checks for the new activities.

## 1.3.3 — 2026-09-26

- Kept the global header and category navigation visible while scrolling, including anchored Food Data Sources content.
- Made locally saved progress resilient to incomplete or older browser-storage records.
- Isolated feature startup so search, settings or another optional tool cannot prevent My Learning from rendering.
- Kept Continue Learning, selectable goals, rotating daily challenges, progress and achievements active on the dashboard.
- Restyled quiz score-card actions as large, clear buttons on desktop and mobile.
- Preserved all existing learning content and routes.

## 1.3.2 — 2026-09-26

- Restored the complete My Learning dashboard instead of leaving a loading-only screen.
- Added a useful static dashboard fallback that remains visible if browser JavaScript is delayed or unavailable.
- Loaded the shared learning platform directly on every page for more reliable progress, search, settings and dashboard behavior.
- Preserved every existing food, kids, language, health, quiz, PWA and privacy feature.

## 1.3.1 — 2026-09-26

- Removed the unnecessary online/offline status label from the website tools menu.
- Kept service-worker caching and the offline fallback page working without displaying connection status.
- Prepared the same verified learning experience for ChatGPT Sites publication under the LearnWithUs name.

## 1.3.0 — 2026-09-26

- Kept Home, Food discoveries, Kids Corner, Health guides and Contact me visible as the primary navigation.
- Added a dedicated top-right `☰` tools menu for Search, My learning, Settings, install availability and online status.
- Combined all 26 Picture Words into one page while preserving direct letter links and audio controls.
- Improved small-screen navigation with a scrollable primary-link row and an accessible tools popup.
- Preserved all existing routes, progress storage, PWA behavior, quizzes and learning activities.

## 1.2.1 — 2026-09-26

- Moved display and accessibility controls into a simple three-line site menu available from every page.
- Moved global search and My Learning access into the same menu to reduce header clutter.
- Added Privacy & analytics and local-data reset access to Settings.
- Simplified the learning dashboard so its primary actions stay visible while detailed progress is grouped under More progress & saved items.
- Kept age/language choices on the home learning hub and page-specific Save actions on learning pages.
- Preserved all existing routes, PWA behavior, local-only learning data and analytics consent behavior.


## 1.2.0 — 2026-09-26

- Improved analytics consent wording to make the choice friendly, clear and non-alarming while keeping the optional nature of analytics visible.
- Added clearer device-only learning privacy language across the dashboard and kids guidance.
- Added progress by category and learning statistics.
- Added quick-learning activity suggestions using existing learning content.
- Added learning milestones for completed activities and answered questions.
- Added search category filters.
- Added display and accessibility preferences for larger text, higher contrast and reduced motion.
- Added an online/offline learning status indicator.
- Preserved the existing local-storage, PWA, privacy, language, food, kids, health and quiz flows.


## 1.1.0 — 2026-09-26

- Added Continue Learning and daily learning goals.
- Added device-only learning streak tracking based on learning activity.
- Added dashboard recommendations and a deterministic daily challenge.
- Added achievement badges for lessons, quizzes, questions and streaks.
- Added quiz mistake tracking for the food quiz and a dashboard review section.
- Preserved the existing local-storage, PWA, privacy, language, food, kids and health flows.

## 1.0.0 — 2026-09-26

- Established the first structured production release.
- Moved all website pages and browser assets into `public/`.
- Moved automated verification into `tests/`.
- Moved supporting documentation into `docs/`.
- Restricted the Node.js server to serving only `public/`.
- Preserved food, kids, health, quizzes, dashboard, PWA, privacy and analytics features.
- Preserved separate Hindi and Telugu letter pages and strict matching-language speech checks.

## Version increments

- Patch: `1.0.1`, `1.0.2` for fixes and corrections.
- Minor: `1.1.0`, `1.2.0` for new backward-compatible features.
- Major: `2.0.0` for breaking changes.
