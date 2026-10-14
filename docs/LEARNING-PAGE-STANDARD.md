# LearnWithUs learning-page standard — required for future features

## Reuse, do not reinvent

New Kids Corner cards **must** be inside `.kids-category-card > .kids-category-links` and must use `.kids-activity-card`, `.activity-icon`, `.activity-copy`, `strong`, `small` — not a custom class such as `.kids-activity-grid` with no matching layout CSS. Verify 1280, 800 and 390 px widths. Maintain existing green/yellow Kids styles and accessibility focus states.

Each subject belongs to its existing learning branch. Keep the 18 Core Journey steps stable. New parental/revision tools belong to Learning Support & Parents, not Languages or Games. All new links must be added to root redirects, `route-map.json`, both production directories, sitemap if canonical, Quiz Hub if relevant and service-worker cache.

## Required lesson progression

**Learn → Practise → Quiz**. Show a title, understandable explanations and original examples; provide **three individually answered practice questions** with spoken/displayed correct or wrong feedback (when voice APIs exist); then link to a **separate topic-specific quiz** and a three-action footer: **← Previous: Exact Topic | Start [Topic] Quiz → | Next: Exact Topic →**. Do not replace this with generic buttons to Kids Corner, Quiz Hub and My Learning. Store quiz attempts and explanations using existing shared APIs.

Individual topics must have their own URLs and focused visible content. An overview page should be a topic-selection hub, not a long multi-topic scroll. Reuse original interactive module logic instead of deleting/reimplementing working features. Do not copy Science topics into Maths, or Maths into Life Skills. Preserve `learnwithus.platform.v1` and profile-specific data.

## Test requirements before declaring production ready

Run both full suites **twice on an unchanged frozen tree**; assert canonical/compatibility routes; check real source/DOM interactions, quiz completion/scorecard, learner profile separation, page-specific content, desktop/tablet/mobile overflow and card layout, PWA assets, `public`/`dist` parity, extracted-ZIP SHA-256 equality. Save readable report and screenshot evidence; distinguish browser simulation from manual real-device and deployed-site checks.


### v3.5.0 — Mandatory branch navigation and card-grid contract
- Every subject hub **must** include `assets/focused-topics.css` and `assets/branch-layout.css`. Never render `.focused-hub` without the stylesheet.
- Every Kids lesson uses the **existing roadmap data** for the single-line horizontally scrollable `.branch-topic-strip` and its active topic.
- Topic hub cards are full-height, equal columns: 3 desktop / 2 tablet / 1 mobile, with green/yellow styling.
- Do not declare visual QA complete using link/HTML assertions alone: verify computed `display:grid`, card dimensions, spacing, no overlaps and viewport overflow, at 1280/800/390 widths.
- Existing older JS-driven navigation is hidden (not removed), preserving compatibility.


## Release/version metadata (v3.6+)
- Keep one main release version in `VERSION`, `package.json`, `package-lock.json`, and the service-worker cache.
- Add the shared `assets/release-version.js` and `.css` footer renderer to every real page. Only skip immediate redirect-only pages that do not remain visible.
- The homepage displays the active release version. Every internal page displays its last-changed page version, which stays unchanged on unrelated releases.
- When a page or its behavior changes, add that canonical page to the updated-page set in `assets/release-version.js`; do not bump unrelated page labels.
- Test visible version labels, not just the code string; check the footer appears after copyright.

## Interactive quizzes and focused lessons
- Keep Phonics (26 A–Z) and 100 Picture Words separate; use their distinct quiz datasets, not `slice(0,26)` of unrelated words.
- Five picture choices and spoken full correct/wrong explanations for Phonics, Picture Words and Animal Names.
- For handwriting, show a traceable canvas and let a parent judge the result. Never claim automatic handwriting scoring.
- Topic navigation should remain one row with readable labels and active state; one chosen creative module should be visible at a time.
- For intentional quiz-free lessons such as Poems, do not substitute a generic Quiz Hub button. Keep balanced Previous / empty center / Next spacing.
- Test computed CSS, real interactions and final score persistence at 1280 px, 800 px and 390 px, with in-browser screenshots for representative flows.


## v3.7.0 additional required regression contracts

- Build category menus from `branch-nav-data.js` only. No second hard-coded four-group mega-menu.
- Reuse the same branch data for visible topic strips, same-branch Previous/Next and current-page highlighting, including query and hash routes.
- Keep topic tabs equal-sized, one row, with horizontal scrollbar, keyboard access and wheel scrolling when hovered.
- Shared CSS/JS revision changes must bust the PWA cache and be referenced from pages, not merely change test expectations.
- Quiz certificates must come from recorded per-learner `quizHistory`; never manufacture historical scores.
- Use Chromium computed CSS/geometry and real interaction tests at 1280, 800 and 390 pixels in addition to source/route checks.

## Compact navigation, certificate controls and movement (v3.9.0 onward)
- The collapsed Kids learning category selector must remain **one compact row (max 44px)**, sticky beneath the real header, and return when the user scrolls upward at any depth. Search and Expand stay right-aligned. Verify this with computed rectangles and browser scroll events at 1280, 800 and 390px—not HTML checks only.
- Dashboard certificate actions use the existing shared score-card artwork. Download certificate and Try again must be two non-overlapping, equal-height controls inside each result card (one column on narrow mobile screens).
- Test interactive animation by comparing rendered transforms over time during Play, Pause and resumed Play, including reduced-motion initial settings. A button-label assertion alone is insufficient.
- Every country shown in a selectable country list must map to its own working image file, shown beside the country and in the country detail. Test actual image decode and country flag identity; never rely on unsupported platform emoji presentation.
