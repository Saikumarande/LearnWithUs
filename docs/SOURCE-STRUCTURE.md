# LearnWithUs v3.20.0 — Source-first project structure

## Fast start

1. Install Node.js (the Azure workflow uses Node 24).
2. `npm install` (no additional runtime packages are required).
3. `npm run build` — creates `public/` and `dist/` from `src/`.
4. `npm run dev` — builds and serves **only** `public/` at http://localhost:8080. Re-run the build after source edits; there is no automatic watch/reload.
5. `npm test` — builds again and runs the existing regression suite. `npm run test:browser-v320` runs the v3.20.0 browser cases.

For VS Code Live Server, open **public/index.html** only *after* running `npm run build`.

## Source tree

- `src/pages/home/` — home page
- `src/pages/kids/` — early learning, English, languages, maths, science, geography, life skills, creativity, games and learning tools; quiz HTML next to its subject
- `src/pages/food/` — food catalog, lessons, activities and quizzes
- `src/pages/health/` — body topics, activities and quizzes
- `src/pages/family/dashboard.html` — Family Learning Tools, backup, learning reports and goals
- `src/pages/info/`, `src/pages/system/` — information, not-found, offline
- `src/pages/legacy-urls/` — historic flat URLs and JavaScript redirects, categorized by kids/food/health/family; **not to be deleted**
- `src/assets/css/`, `src/assets/js/`, `src/assets/data/`, `src/assets/images/`, `src/assets/icons/`, `src/assets/fonts/`, `src/assets/licenses/`
- `src/pwa/` — original service worker and manifest
- `src/site-root/` — robots, sitemap, version
- `config/site-files.json` — explicit mapping from each editable source path to its **unchanged existing URL**
- `scripts/build.js` — copies original source file bytes into both existing output trees
- `scripts/check-build.js` — validates all file lists and SHA-256 byte parity
- `tests/smoke/`, `tests/quality/`, `tests/features/`, `tests/browser/`, `tests/regression/` — unchanged existing tests, relocated with relative paths adjusted
- `public/`, `dist/` — generated artifacts; neither is the source of truth

## Do not change any existing website URLs

The build script does **not** rewrite, minify or template source HTML, CSS or JavaScript. It copies bytes exactly to the old web paths, such as:

| Editable source | Served unchanged as |
|---|---|
| `src/pages/home/index.html` | `/index.html` |
| `src/pages/food/activities/balanced-plate.html` | `/learn/food/balanced-plate.html` |
| `src/pages/kids/life-skills/first-aid-awareness.html` | `/learn/kids/first-aid-awareness.html` |
| `src/pages/family/dashboard.html` | `/account/dashboard.html` |
| `src/assets/js/features/family/family-tools.js` | `/assets/family-tools.js` |
| `src/pages/legacy-urls/balanced-plate.html` | `/balanced-plate.html` |

The existing `<base>`, asset references, service worker cache paths, route aliases, URLs and `localStorage` keys remain unchanged.

## Adding a new file

1. Add the page or asset beneath the appropriate folder in `src/`.
2. Add exactly one `{ "source": "...", "urlPath": "..." }` record to `config/site-files.json`.
3. Run `npm run build && npm run check:build`.
4. Run affected feature tests, then `npm test` and browser regression tests.

The build fails if any source file is unmapped, any URL is duplicated, or any manifest path is unsafe.

## Deployment and GitHub

The existing `.github/workflows/main_learnwithus.yml` already runs `npm run build --if-present` **before** the tests and deployment. The produced artifact includes `public/` and `dist/` as previously expected. The Node server still serves only `public/`.

`public/` and `dist/` are `.gitignore`d generated artifacts. If moving this release into an existing Git repo where these outputs were previously committed, run `git rm -r --cached public dist` once **after** confirming that `src/` and `config/site-files.json` are staged and validated. This removes them from Git tracking but leaves local files in place. Do not delete existing pages or change URLs to tidy the generated output.

## Progress and privacy

The migration changes filesystem organization only. Browser storage keys remain the same. A user's existing learning progress will survive a redeployment **as long as the origin stays the same and browser storage is not cleared**. Switching origins (e.g., 127.0.0.1 to localhost, or domain changes) does not carry localStorage automatically; use Family Backup first where appropriate.

## Baseline regression note

The uploaded pre-migration v3.20.0 ZIP failed the full `npm test` suite at `v370-runtime-test.js` (`version text only`). Its assertion was out of date: the existing v3.20.0 runtime includes per-page version selection. **Only that test assertion** was adjusted to match the already-existing source string; website HTML/CSS/JS remained byte-identical. With that correction, the full `npm test` suite passes. The latest v3.20.0 browser suite passes 82/82.
