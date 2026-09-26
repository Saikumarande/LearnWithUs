# LearnWithUs v1.8.1

LearnWithUs is a Node.js educational website covering food discoveries, kids learning activities, Hindi and Telugu letters, health guides and quizzes.


## Current release: v1.8.1

This patch release improves multiplication-table readability and makes the Kids learning navigation consistent across every Kids learning and quiz page while preserving the v1.8.0 feature set and saved-progress model.

### Updated in v1.8.1

- Changed **Multiplication Tables 1–20** so the selected table is displayed as one vertical fact per row instead of a three-column grid.
- Standardized every table to **×1 through ×10** for both learning and the table-specific quiz.
- Kept the existing single 1–20 dropdown, per-fact audio, whole-table audio and automatic selected-table quiz handoff.
- Added the same compact Kids quick-navigation strip to every Kids learning and Kids quiz page: Kids Corner, Letters, Hindi, Telugu, Phonics, Numbers, Animals, Colours, Shapes, Poems and Quiz Hub.
- Made that Kids quick navigation a single horizontal row that hides while scrolling down and reappears when scrolling upward, while preserving Food and Health navigation unchanged.
- Updated offline/PWA cache entries, regression checks, README, changelog and feature-testing notes for the patch.

### Validation for v1.8.1

Final production validation covers **1,289 automated assertions per full run**: 68 smoke checks, 990 link/asset/JavaScript checks, 159 feature checks, 46 v1.8.1 targeted regression checks and 26 server/MIME/404 checks. The complete suite is required to pass twice from the final release tree. An additional **8/8 runtime simulation checks** verify the 1–20 table selector, vertical ×1–×10 rendering, table switching and selected-table quiz handoff.

### Release discipline

For every future LearnWithUs code change, update **README.md**, `docs/CHANGELOG.md`, `VERSION`, `package.json`, service-worker cache entries when relevant, tests for the changed behavior, and the versioned production ZIP. Run the complete automated suite twice after final cleanup.

## Project structure

```text
LearnWithUs-v1.8.1/
├── public/                  # Every browser-accessible page and asset
│   ├── assets/             # CSS, JavaScript, images and fonts
│   ├── index.html          # Home page
│   ├── *.html              # All other website pages
│   ├── manifest.webmanifest
│   ├── service-worker.js
│   ├── robots.txt
│   └── sitemap.xml
├── tests/                   # Automated checks
├── docs/                    # Testing and release documentation
├── config/                  # Optional platform-specific configuration
├── server.js                # Node.js static web server
├── package.json             # Commands and Node.js version
├── VERSION                  # Current release number
└── README.md
```

Only `public/` is exposed by the Node.js server. Application code, tests and documentation cannot be requested as website files.

## Run and verify

Requires Node.js 24 LTS.

```powershell
npm test
npm start
```

`npm test` runs smoke, link/syntax, feature, release-regression and server-route checks.

Open `http://localhost:8080`.

## Azure App Service deployment

Deploy the complete project root—not only `public/`. Azure needs `package.json` and `server.js` at the root. The server automatically publishes the contents of `public/`.

For GitHub CI/CD, connect the repository and `main` branch in Azure App Service Deployment Center. Every successful push to `main` can then deploy automatically.

## Versioning rule

LearnWithUs follows Semantic Versioning:

- `1.0.1`: bug fix, content correction or small compatible improvement.
- `1.1.0`: new compatible feature, page, category or learning activity.
- `2.0.0`: breaking change to URLs, saved progress, deployment or major architecture.

For future prompts, update `package.json`, `VERSION`, the changelog and the ZIP filename together.
