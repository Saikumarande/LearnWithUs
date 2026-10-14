# LearnWithUs v3.9.0 — Bug-fix testing and acceptance report

**Baseline:** v3.8.0 full production ZIP. **Release:** v3.9.0 full production ZIP.

## Resolved requests

1. Replaced the oversized learning selector with a compact, 34px toolbar inside a sticky ~38px navigation bar. Search remains usable. The navigation returns beneath the header on upward scrolling, regardless of how far down the page the user is.
2. Styled dashboard quiz results as separate, equal-height **Download certificate** and **Try again** actions. The download reuses the established score-card renderer.
3. Replaced the previous CSS animation playback-state race with explicit native Web Animations on the eight planet orbits; initial reduced-motion preference is honored, and Play can override it.
4. Generated and locally bundled unique flag illustration PNGs for **all 48 countries already in the LearnWithUs Countries & Capitals dataset**. Both Countries & Capitals and World Flags show country-matched artwork. Existing ten-question World Flags quiz and three-question practice still use image choices.

### Note on flag art

These 48 images are **recognizable stylized flag renderings** from Noto Color Emoji's open-source artwork, not official photographic or government-issued flag files. No font files are bundled. The website does not claim to cover every country in the world; the current country collection has 48 entries. Source and attribution: `public/assets/country-flags/SOURCE.md`.

## Regression methodology

- `npm test`: existing HTML/JavaScript syntax, internal link and canonical route audits for all 267 HTML pages; feature regressions for earlier releases; PWA cache entries, source/distribution parity; newly added country-code mapping and 48 local flag-file checks.
- `npm run test:browser-ui`: original end-to-end learner/quiz completion scenarios and Chromium visual tests across the existing subjects; new v3.9 Chromium cases at 1280, 800 and 390px.
- v3.9 specific browser checks **actually scroll down to 1800px and upward to 1450px** after disabling smooth scrolling in the test fixture; measure rendered header/navbar positions and verify visibility. Verify the 9-category expanded grid has no rectangle overlaps.
- Render dashboard certificates and inspect the button rectangles for height, width, containment, and overlap at three viewport widths; verify Try again link destination.
- For planets: ensure reduce-motion initially pauses; click Play, compare orbit transforms after 320ms; click Pause and verify transforms remain exactly unchanged after 320ms; click Play again and confirm active animation. Exercise desktop and mobile viewports.
- For flags: validate all 48 two-letter codes, distinct PNG hashes and bundled asset paths, select Samoa in the World Flags page, decode its actual flag image in Chromium, verify picture-based practice options, and confirm Singapore shows the correct image in Countries & Capitals.
- Inspect screenshots under `docs/v390-visuals/` for collapsed/expanded navigation, certificate cards and World Flags.

The browser suite runs production HTML/CSS/JS in an in-memory Chromium fixture because browser navigation to loopback HTTP is restricted in this environment. It does not prove performance on every physical device or after a remote deployment. Real-site cache refresh, touchscreen and hardware audio still require post-deployment acceptance checks.

## Release verification

The two final, consecutive frozen source/server and browser runs and the production ZIP extraction/file-parity audit must pass before release. See included test commands in `package.json`.

### Results (frozen release, two successive executions)

| Suite | Run 1 | Run 2 |
|---|---:|---:|
| Source, compatibility, route, server, PWA and package parity | 16,187 / 16,187 | 16,187 / 16,187 |
| Chromium learning, quiz, layout and v3.9 regressions | 1,494 / 1,494 | 1,494 / 1,494 |
| **Combined** | **17,681 / 17,681** | **17,681 / 17,681** |

Total **35,362 / 35,362 assertions passed** across the two frozen executions. This count sums the `passed / total` results from each individual test script and excludes numbers describing viewport dimensions. Source route/HTML audits cover 267 pages; screenshot-based inspection covers the affected pages only, not a separate visual image for every page.
