# LearnWithUs v3.5.0 — Layout & Navigation Release Test Report

## Root cause and action

The pages `smart-learning.html`, `parent-dashboard.html`, `coding-lab.html`, `learner-profiles.html`, `learning-tools.html` had generated `<div class="focused-hub">` card grids but omitted `assets/focused-topics.css`. As a result, the browser rendered the anchors inline even though all their URLs were valid. Link checks and JavaScript assertions could not detect the missing computed styles. Hub styling was also inconsistent with the canonical green/yellow card design, and some roadmap links still targeted the older combined Everyday Explorer page.

**Fix:** attach the correct styles to all seven topic hubs and all canonical Kids lesson/quiz pages; use the shared `branch-layout.css` for equal-height colored 3/2/1 hub grids, visible focus states and a single horizontally scrollable topic strip. Add `branch-nav-data.js` generated from the existing stable nine-branch roadmap so links and order match the current branch identifiers; attach `branch-nav.js` to canonical Kids lessons and hide duplicate old strips where a new one is shown. Point E15–E17 and LS2–LS4 directly to their dedicated lesson URLs, keep legacy hub URLs working, and provide one helpful Everyday Topics hub link.

## Release scope and coverage

| Area | Checked | Approach |
|---|---:|---|
| Every HTML file | **265/265** | Source/route/link/syntax/HTML audit and local HTTP route crawl |
| Legacy URL redirects | **132** | Canonical redirect/route audit |
| Kids canonical learning + quiz pages receiving the shared design CSS | **118** | Source assertion for stylesheet references; 84 Kids lesson pages also load branch navigation scripts |
| Topic selection hubs | **7 hubs × 3 widths = 21 renderings** | Chromium, actual production `topic-hub.js` / `world-hub.js`, inline production CSS; geometry checks |
| Roadmap branch navigation | **9 branches × 3 widths = 27 renderings** | Chromium, production generated data and branch navigation JS; one-row, active state, no overflow |
| Dedicated post-v3.3 activities | **30 topics × 2 widths = 60 renderings** | Chromium, actual production topic-flow JS; practice, explanations, nav, responsive layout |
| Science activity tiles | **11**, at 1280, 800 and 390 px | Existing v3.4 test: row count, heights, overlap, viewport overflow |
| Full quiz completion | **Science, Maths and two focused topics** | Existing Chromium tests: 10 answers, score cards, saved hooks |
| Existing old features | All existing suites | Letters, Numbers, English, Science, Maths, World Currencies, quiz data, profiles, offline, server routes |

**Important distinction:** Every HTML page was checked statically and via route audit. Visual geometry tests targeted all seven affected hubs, nine roadmap strips, 30 focused-topic renderers and Science cards. It would be inaccurate to claim that all 265 pages were individually photographed or manually verified on a deployed domain.

## Visual fixture artifacts

Chromium screenshots captured from the real production CSS and JavaScript rendered into isolated page fixtures. Because this environment blocks navigation to localhost and `file:` in Chromium, these are browser fixture renderings, not screenshots from an Azure/ChatGPT-deployed website.

- `docs/v350-visuals/smart-learning-1280.png` and `smart-learning-390.png`
- `docs/v350-visuals/learning-tools-1280.png` and `learning-tools-390.png`
- `docs/v350-visuals/world-explorer-1280.png` and `world-explorer-390.png`
- `docs/v350-visuals/branch-english-390.png`, `branch-world-390.png`, `branch-support-390.png`

## Automated test contract

`npm test` — complete source, link, HTML, routing, server, PWA, v2.4–v3.4 regression tests plus `v350-runtime-test.js`. `npm run test:browser-ui` — all existing Chromium suites plus `v350-browser-test.js`. Both run twice with the same frozen production tree before packaging.

### What new tests actually assert

1. A topic hub's computed CSS layout is `display: grid`, not inline anchor text; card backgrounds use a colored gradient and gaps have real spacing.
2. First-row cards have equal heights, have adequate tap targets, do not collide, and form exactly 3 columns (1280px), 2 columns (800px), 1 column (390px).
3. The page never becomes horizontally scrollable; only the category topic strip may scroll horizontally.
4. Each branch's stable codes, labels and links are drawn from the actual Kids roadmap, exactly one current item is active, and all buttons occupy one row.
5. Old duplicate topic bars are hidden when shared branch navigation is present.
6. Thirty focused topic pages preserve their original explanations, three-question practice, correct/wrong feedback, prior/quiz/next, and show no viewport overflow in the tested fixture.
7. The original 18 Core Learning Journey stops remain untouched; the other nine branch codes and all prior source files remain available.

## Manual acceptance checks after deploying

- On `children.html`, open **Learning Support & Parents**, then Smart Learning and Learning Tools; confirm coloured cards with desktop/tablet/mobile wrapping.
- Open **Mistakes Notebook** or **World Flags**; the full selected branch now appears as one horizontally scrollable row above the learning content. Tap several adjacent topics and verify highlighted active state.
- Open E15 Kids Dictionary and LS2 Community Helpers from the roadmap; they should open the dedicated lesson immediately (not the combined hub).
- Complete practice and a 10-question quiz and inspect the score card, quiz review and child-profile isolation.
- On mobile, swipe the topic strip horizontally but verify the *page* itself does not scroll sideways.
- Verify cache updates after deployment; old service workers may need a refresh to pick up v3.5.0.

## Frozen full-suite results

| Run | Source/server | Chromium/browser | Combined |
|---|---:|---:|---:|
| A | 11,614/11,614 | 1,287/1,287 | 12,901/12,901 |
| B | 11,614/11,614 | 1,287/1,287 | 12,901/12,901 |
| **Total** | **23,228/23,228** | **2,574/2,574** | **25,802/25,802** |

The production-facing file set contains 509 files under `public/` and the same 509 byte-identical files under `dist/`. The total HTML count is 265, including redirect wrappers. Source comparison with the v3.4.0 ZIP found 0 removed file paths.
