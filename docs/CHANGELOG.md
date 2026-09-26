# Changelog

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
