# LearnWithUs v3.4.0 — Release quality and visual regression report

**Baseline:** complete LearnWithUs v3.3.0 production ZIP. **Target:** v3.4.0. **Scope:** presentation consistency, navigation and independent lesson pages; no existing content removed.

## Root cause and fix

Science & Discovery was created with `.kids-activity-grid`, while the existing Kids Corner component and responsive rules target `.kids-category-links` and `.kids-activity-card`. Without the correct grid wrapper, Science cards did not receive the same column sizing, spacing, icon alignment and mobile breakpoints as English and Maths. The existing Science markup now uses the same `.kids-category-links` grid and the shared card structure. The fix reuses the current green/yellow/neutral design rather than creating a competing component.

## Page and branch structure

- **Core Learning Journey:** unchanged at 18 steps.
- **Science:** 11 existing topics retained; all lessons and quizzes keep their original topic deep links. Practice now requests three questions before moving to the topic quiz.
- **Smarter Maths:** 10 existing topics retained; practice now requests three questions. Previous/Next references stay in the correct Maths branch.
- **World Explorer:** separate Continents & Oceans, World Flags, Famous Landmarks and Geography Challenge pages. Country flag search and schematic map are preserved from v3.3.0.
- **Smart Learning:** separate Mistakes Notebook, Adaptive Practice, Targeted Revision, Mastery Levels, Quiz Review pages.
- **Motivation:** separate Continue Learning, Daily Challenge, Weekly Missions, Weekly Report, Certificates and Favourites pages.
- **Coding:** separate visual coding and logic/sequencing pages, using the existing robot maze implementation.
- **Learner Profiles:** dedicated Profiles & Preferences page with its original profile logic.
- **Everyday Knowledge:** six independent Community Helpers, Transport, Kids Dictionary, Listening, Conversation and Everyday Situations pages.
- **Learning Tools:** separate Worksheets, Flashcards, Homework, Learning Search, Focus/Accessibility and Offline Indicator pages.
- **Learning Support & Parents:** new ninth expandable branch; previous profiles/support links no longer appear misleadingly under Languages or Games. Gameplay remains under Games.
- **Old URLs:** preserved as landing hubs or working compatibility aliases.

## Standard journey contract for new topic pages

1. **Learn:** title, useful explanations and subject-specific examples, reusing any interactive v3.3 controls.
2. **Practise:** three individually answered multiple-choice questions, disabled after submission and showing correct/wrong feedback plus an explanation. New topic quiz engines speak the feedback when speech synthesis is available.
3. **Quiz:** a separate topic-specific 10-question quiz with review-answer recording, scorecard and existing quiz history hooks.
4. **Navigation:** Previous / Start topic Quiz / Next, with descriptive topic names. No standalone triple-link Kids Corner / Quiz Hub / My Learning action strip.

## Automated checks and acceptance criteria

| ID | Test | Pass condition |
| --- | --- | --- |
| VIS-01 | Science card grid, 1280 px desktop | 4 tiles in row one, matching row heights, no overlaps, no horizontal overflow |
| VIS-02 | Science card grid, 800 px tablet | 3 tiles in row one, matching row heights, no overlaps |
| VIS-03 | Science card grid, 390 px mobile | 1 full-width card, no overlaps or sideways overflow |
| VIS-04 | World Flags original filter and new topic flow on mobile | One visible World panel, search `India` excludes Japan, focused practice and quiz link visible |
| UI-01 | 30 focused lessons | Correct title, four interactive choice buttons, answer feedback, unlocked Next, correct topic quiz link |
| UI-02 | 30 focused lesson presentations | Only the requested topic panel is visible (Profiles also retains related preferences), no desktop overflow |
| QUIZ-01 | Full 10-question Continents quiz | 10 answer records, final score screen, shared scorecard called once, quiz-history hook called |
| QUIZ-02 | Full 10-question Offline Indicator quiz | Same end-to-end completion and history checks |
| CONTENT-01 | 30 quiz banks | Each topic has at least 10 questions; every answer is present among 4 different choices, with an explanation |
| ROUTES-01 | Original and new URLs | All legacy redirects/canonical pages, recursive links, HTML language, scripts and assets resolve |
| DATA-01 | Progress profiles/revision | Existing v3.3 profile-isolation, quiz-history, answer-review, Score Cards and tracking tests remain passing |
| REG-01 | Previous versions | Existing Letters, Numbers, Hindi/Telugu, English, Science, Maths, Currencies, PWA and server checks remain passing |
| DIST-01 | Deployment folders | `public/` and `dist/` contain byte-identical published assets |
| ZIP-01 | Production package | ZIP integrity valid and extracted files byte-identical to the frozen release tree |

### Visual captures

- `docs/v340-visuals/science-1280.png` — actual headless Chromium desktop render of the fixed Science category.
- `docs/v340-visuals/science-390.png` — actual headless Chromium mobile render of the fixed Science category.
- `docs/v340-visuals/world-flags-mobile.png` — headless Chromium mobile render after executing the existing World Explorer script and new focused-page script together.

### Execution and limitations

Run `npm test` and `npm run test:browser-ui` from the extracted project root. The complete frozen release test matrix is executed twice prior to packaging. Automated browser tests use in-memory Chromium documents, not a cloud-hosted deployed browser; **the site has not been published or verified on Azure/ChatGPT Sites**. Real microphone capture, platform text-to-speech voices, mobile-device touch hardware and cross-device synchronization cannot be fully validated in this headless environment. A browser/device manual acceptance pass is recommended before main production deployment.

Use this report with `docs/LEARNING-PAGE-STANDARD.md` for future releases.

## Final frozen-run results

| Suite | Run 1 | Run 2 |
| --- | ---: | ---: |
| Source, file, HTML, routing, compatibility and server | 10,305 / 10,305 | 10,305 / 10,305 |
| Chromium UI, new lessons, responsive cards and interactions | 576 / 576 | 576 / 576 |
| **Total** | **10,881 / 10,881** | **10,881 / 10,881** |

**21,762/21,762 checks passed across two consecutive runs.** New v3.4.0 test modules alone contributed 679 source assertions and 208 Chromium assertions per run. The previous v3.3.0 browser tests also passed 50/50 each run. The report's visual captures are retained inside the ZIP.
