# LearnWithUs v4.0.0 — User-Requested UI Cleanup and QA

## Scope
Source: latest v4.0.0 full-QA fixed project. Keeps source-first layout (`src/`), generated `public/`/`dist/` and release version **4.0.0**.

## Changes

1. **Removed 38 redundant lower cards** from Kids Corner: 5 Maths, 6 Hindi/Telugu, 4 English additions, 5 World/Geography additions, 5 Creativity additions, 5 Games additions, and 8 repeated cards already listed in their own category (Dictionary, Listening, Conversation, Helpers, Transport, Situations, Flags, Landmarks). The original lesson links remain in the numbered branches or the retained original category card.
2. **Removed Targeted Revision from visible navigation**: deleted its journey step and category tile, removed the Quiz Hub entry, removed it from the dropdown branch list and Smart Learning module, and excluded its legacy topic from the Smart Learning Hub. The existing direct legacy lesson and quiz routes remain available; no stored progress or prior links are deleted. The support branch now has 17 steps rather than 18.
3. **Quiz Hub shortcut**: added to the shared Kids category toolbar, immediately to the **left** of Search, and tested responsive layout. The site shell resolves the shortcut to canonical `/quiz/quiz-hub.html`.
4. **Quiz Hub alignment**: converted 8 Food/Health interactive quiz links from a special inline `<ul>` into the existing responsive `.quiz-section > .quiz-grid > .quiz-card` layout (4 desktop, 3 tablet, 1 mobile columns in the tested widths). All quiz destinations remain unchanged.
5. **Service worker refresh**: updated service-worker script bytes to trigger reinstallation and recache UI changes without changing the existing v4.0.0 storage keys or cache name.
6. Updated the historical tests that previously required repeated UI cards or counted the removed step. No quiz questions, scoring logic, voice logic, learning progress serialization, backend routing, or unrelated feature code was intentionally changed.

## Verification completed

- `npm run build`: **passed**, 782 generated served URL paths.
- `npm run check:build`: **passed**, 1564/1564 source-output byte comparisons.
- `npm test`: **passed**, all smoke, link, HTML, route, PWA, feature and release regressions.
- Internal link audit: **2963 static HTML hyperlinks, 2962 local**, zero missing local targets; **446 HTML pages**; **141 fragments** validated.
- `npm run test:ui-cleanup`: **passed**, 94/94 static assertions and 6/6 Chromium responsive layout checks at 1280, 800 and 390 px.
- Remaining full-browser tests run individually and **passed**: v3.13 459/459, v3.17 372/372, v3.20 82/82, voice-feedback 82/82.
- Combined Chromium suite exceeded its invocation time limit after multiple earlier suites passed. This is not recorded as a complete uninterrupted single-command pass.
- Device-specific real microphone/audio pronunciation and live production deployment not revalidated in this UI cleanup; original app logic was kept.

## Where to verify in Live Server

- Kids Corner: `/public/learn/kids/children.html` — expand subject categories to see numbered M1–M26, L1–L8, G1–G10; lower duplicate cards removed.
- Kids toolbar on any kids page: Quiz Hub immediately left of Search.
- Quiz Hub: `/public/quiz/quiz-hub.html` — new Food/Health interactive quizzes now display in equal-sized card grid.

## Editable files

- `src/pages/kids/early-learning/children.html`
- `src/pages/quizzes/quiz-hub.html`
- `src/assets/data/kids/branch-nav-data.js`
- `src/assets/js/features/kids/kids-nav-upgrade.js`
- `src/assets/css/features/kids/kids-nav-upgrade.css`
- `src/assets/js/core/smart-pages.js`
- `src/assets/js/features/shared/topic-hub.js`
- `src/pwa/service-worker.js`

## Safety and deployment

Use `npm ci`, `npm run build`, `npm test` and `npm run test:ui-cleanup`. Start with `npm run dev` or Live Server on `public/index.html`. Edit `src/` only, not `public/`/`dist/`; those copies are generated. After deployment, allow the updated service worker to activate and refresh (Ctrl+Shift+R). Do not clear site storage if preserving learner progress.
