# LearnWithUs v3.8.0 — Regression report

**Baseline:** v3.7.0. **Changes:** compact and aligned nine-branch menu; obsolete Kids topic strip suppressed; dashboard certificate uses existing score-card SVG; new bundled graphic flags and picture-based practice/quiz choices; Planets user-controlled animation; colourful Countries & Capitals panes.

## Critical behavioral tests

- **Category header:** 1280/800/390 viewport widths. The collapsed row is <=61px high, with Search and Expand on its right, no redundant Home link, no horizontal overflow. Upon expansion all nine branches are grid-aligned below toolbar; do not overlap; have expected 3/2/1 columns. Old links hidden.
- **World Flags:** 18 valid bundled PNG country-flag graphics; clickable country selection changes the hero flag and country name/capital; multiple-choice flags display image artwork; ten-question quiz completion is exercised by existing tests.
- **Planets:** CSS transforms change while playing and remain unchanged after Pausing; re-enable control changes state and visible status. In addition to checking CSS labels, the browser tests measure actual transform movement after a timed delay.
- **Dashboard:** shared score-card artwork reused for certificates; aligned Download certificate and Try again controls; no inoperable Review entry.
- **Compatibility:** existing 18-step Core Journey, nine branches, old URLs, local progress, complete quiz completion, source/file routes, PWA and previous release tests retained.

## Automation entry points

`npm test` (source/server/legacy compatibility plus v3.8 contracts), `npm run test:browser-ui` (Chromium interaction + visual geometry + motion). Both are run on an unmodified frozen source tree, repeated twice; reports must be based on actual stdout.

## Browser limitations

The Chromium automated visual fixtures load production HTML, CSS, JS in-memory because this environment restricts loopback HTTP access. Flag image loading is checked from bundled bytes and by decoding a bundled image in Chromium. Real-device audio/touch and deployment cache behaviors require acceptance tests after publishing.
