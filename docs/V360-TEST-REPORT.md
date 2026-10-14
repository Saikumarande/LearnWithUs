# LearnWithUs v3.6.0 — Bug Fixes & Validation

## Baseline and scope
Based on the exact v3.5.0 production ZIP. Current website code version is 3.6.0. 18 issues from the uploaded bug report have been addressed, including the additional sitewide page-version display requirement.

## Source, server and compatibility tests
`npm test` checks 267 HTML paths; internal links, asset dependencies, JavaScript syntax, canonical and compatibility routes, HTML structure, server responses, scoring/profile compatibility, PWA cache, roadmap architecture and the 18-step Core Journey. `tests/v360-runtime-test.js` additionally checks 100 unique Picture Words separate from 26 Phonics items, the five-choice quizzes, card design, new animal and tracing quizzes, category placement, country browser, creativity navigation, version labels and `public/`–`dist/` byte parity.

## Browser and interactive tests
`npm run test:browser-ui` includes older regression suites for Letters, Numbers, English, Science, Maths, profiles, countries/currencies, focused topics, score cards and shared branch layouts.

The new `tests/v360-browser-test.js` uses **actual production HTML, CSS and JavaScript in Chromium in-memory fixtures** at viewport widths **1280 / 800 / 390 px**. It covers word-bank card count and duplicate labels, country list/detail selection, one-at-a-time Creativity display, five-option spelling/phonics/animals quizzes, drawing controls, no unwanted horizontal overflow, and Play/Pause animation state. It completes **three separate 10-question quizzes**, checking correct/wrong feedback, next-question transitions and recorded score callbacks. It tests one parent-judged tracing answer and preserves the Life Skills category placement and 18 Core steps. Four screenshots are captured under `docs/v360-visuals/`.

**Limitations:** The embedded Chromium runtime in this workspace rejects direct navigation to both local HTTP and local file URLs. Browser checks therefore use in-memory production-markup fixtures rather than full end-to-end HTTP browser navigation. HTTP paths are separately checked by the server and link tests. Physical touch, actual microphone/voice playback, printer dialogs, PWA installation and your deployed website are not tested by this method. Manual acceptance testing is still recommended.

## Suggested manual review after deployment
1. Open Phonics and Picture Words quizzes; verify five choices and distinct content.
2. Trace a letter with finger/stylus and choose parent-correct/wrong, then view final score.
3. Open Animals Quiz and complete the ten questions.
4. Switch all four letter styles and verify the quiz heading.
5. Check planet pause/play visually, choose multiple countries and view capital changes.
6. Open all Creativity C1–C12 links, including Print & Share, on mobile.
7. Check desktop/tablet/mobile card alignment, Poems play placeholder, footer versions and unchanged old learning progress.

## Change-control guardrail
The project release version is 3.6.0. Internal page-version labels update only when their page/behavior changes; update the manifest before every release. Reuse existing green/yellow theme and Learn → Practise → Quiz structure whenever a quiz is relevant.
