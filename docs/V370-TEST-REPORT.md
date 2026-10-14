# LearnWithUs v3.7.0 — Testing and release verification

**Baseline:** v3.6.0. All previous file paths are retained; the 18-step Core Journey and nine existing branches are unchanged.

## Changes

- Replaced the old Kids mega-menu with nine expandable branch groups, category search and shared links.
- Same-sized topic tabs with vertical mousewheel-to-horizontal scroll when a topic strip is hovered.
- Previous/Next now stay within the current branch, including Creativity C3–C12, English E14–E15, and the final Science/Maths items. Existing quiz URLs are left intact.
- Removed redundant Hindi page cross-promotion and the duplicate Creativity subnavigation.
- Footer shows compact left-aligned `v3.7.0` on updated pages; unchanged pages keep their last-update release.
- Tracing quiz supports parent marking, explicit Previous/Next, revisiting handwriting, and spoken feedback.
- Quiz Certificates & Results section on My Learning lists recorded attempts, scores and dates, with downloadable SVG learning certificates. Existing generic Achievements are retained.
- Planets orbit toggle controls CSS animation; country explorer is 50/50 on tablet/desktop; World Flags is an interactive flag/details view with a ten-question varied quiz.

## Test types

1. Legacy source regression (smoke/links/HTML/feature/route/server, English, Maths, Science, Currency and progress compatibility).
2. Existing Chromium suites (widgets, phone/tablet/desktop rendering, legacy interaction and complete quizzes).
3. v3.7.0 contract audit covering all roadmap links and public/dist byte-for-byte parity.
4. New Chromium checks for category-search and 9 groups at 1280/800/390px, Creativity branch adjacency, horizontal wheel scrolling, Planets computed animation state, countries pane widths and selection, parent-scored tracing navigation, dashboard certificates, World Flags selection and full quiz.
5. Production ZIP integrity and extraction/hash comparison against frozen tested files.

**Limitations:** Chromium fixture tests are not a substitute for a real deployed site, touch screen, voice hardware or an offline device. Learner data is stored per browser profile; existing quiz attempts lack per-question details if the original quiz never recorded them. Certificates are personal participation keepsakes, not accredited qualifications.

## Final tested release counts (two complete runs)

| Suite | Run 1 | Run 2 | Coverage |
|---|---:|---:|---|
| Source, routing, compatibility, server, and release contracts | 14,509 / 14,509 | 14,509 / 14,509 | 267 HTML pages, 133 canonical routes plus redirects, nine branch maps, 519 published files |
| Chromium UI, visual geometry and interactions | 1,413 / 1,413 | 1,413 / 1,413 | Desktop 1280px, tablet 800px, phone 390px; quizzes, navigation, score cards, certificates, country/flag panes and planet animation |
| **Total** | **15,922 / 15,922** | **15,922 / 15,922** | **31,844 / 31,844 combined assertions** |

The 267-page figure is a source/route audit, **not** a claim of 267 individual screenshots. New v3.7 browser tests exercised 40 specific high-level assertions; prior Chromium regressions continued to cover existing learning activities. The generated screenshots for the category menu are in `docs/v370-visuals/`.

**Packaging audit:** 0 original v3.6.0 file paths removed; 519 files in each of `public/` and `dist/`, byte-identical. The final ZIP was extracted and every included file SHA-256-compared with the project source.
