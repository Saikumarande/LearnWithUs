# v3.20.0 Option B — Migration audit

## Scope and unchanged runtime guarantees

Original input: `LearnWithUs-v3.20.0-family-breadcrumb-fixed.zip`.

- 782 original files under `public/` migrated into readable, subject-organized `src/` paths.
- **0 original website file bytes changed**: every regenerated `public/` file matches the original uploaded ZIP SHA-256 hashes.
- The 782 regenerated `dist/` files mirror `public/` exactly for backwards-compatible tests and delivery.
- 446 original HTML files preserved, including 216 historic flat-route compatibility pages and the direct site index.
- Existing routes, JS/CSS links, relative `<base>` URLs, service worker cache paths, browser `localStorage` keys, profile isolation and restore features unchanged.
- Family tools remain served at `/account/dashboard.html#lw-family-tools`, with the Kids Parent Dashboard navigation preserved.
- The shared breadcrumb deduplication fix from the input ZIP is preserved verbatim.

## What changed

- Created feature-organized `src/pages/` and `src/assets/` directories, plus `src/pwa/` and `src/site-root/`.
- Added `config/site-files.json`, mapping each new source path to the existing served file URL.
- Added `scripts/build.js` and `scripts/check-build.js`; `npm run build` recreates public and dist, `npm run check:build` verifies all 1,564 generated files are byte-identical to `src/`.
- Organized 58 test scripts in `tests/smoke`, `tests/quality`, `tests/features`, `tests/browser`, `tests/regression`; adjusted test-relative root references and their npm command paths, but **not website runtime files**.
- Fixed **one old v3.7 test string assertion** to match the v3.20 per-page version-label logic, without editing the runtime that it tests.
- Added source-first instructions to `README.md` and `docs/SOURCE-STRUCTURE.md`.
- Marked `public/` and `dist/` as ignored generated outputs for future repository commits; the ZIP includes both generated outputs for immediate local testing.

## Test results

- Original release baseline: `npm test` failed at `v370-runtime-test.js` because the hardcoded expected version text was stale.
- Post-migration: `npm test` **passed**, including smoke, 7,769 link/syntax, 3,287 HTML structure, features, route crawl and all release-contract assertions in the npm test chain.
- `npm run build`: PASS — 782 served URLs regenerated without rewritten content.
- `npm run check:build`: PASS — 1,564/1,564 generated files match source byte-for-byte.
- `npm run test:browser-v320`: PASS — 82/82 v3.20.0 browser cases.
- `node tests/regression/v3/v313-browser-test.js`: PASS — 459/459.
- `node tests/regression/v3/v317-browser-test.js`: PASS — 372/372.
- `node tests/regression/v3/v3100-browser-test.js`: PASS — 127/127.
- Composite `npm run test:browser-ui` passed 19 consecutive browser suites but exceeded the execution-time limit before running the remaining suites in the chain. The remaining v3.13/v3.17/v3.20 Chromium suites were then run separately and passed. No browser assertion failures were observed.

## Editing and deployment

Edit **only `src/`**, add records for any new pages to `config/site-files.json`, rebuild with `npm run build`, then test from `public/` or `npm run dev`. For GitHub Azure CI, the existing workflow already runs `npm run build --if-present` before tests and deployment. Public site behavior is intentionally frozen at the supplied input revision.

Browser-local progress is keyed by origin and device. Deploying to the same domain does not erase it, provided the browser cache/storage is not manually cleared. Using `localhost` instead of `127.0.0.1` is a different browser origin and won't show the same local progress without backup/restore.
