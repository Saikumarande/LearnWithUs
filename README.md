

## 1.10.0
- Expanded Creativity Studio with 20 drawing lessons, drawing score, 30 colouring pages, 20-colour palette, 20 join-the-dots pictures, 10 paper crafts, 10 origami projects, 10 instrument sounds, improved dance poses, 10-option story builder, 10-option poem builder, and printable/shareable creativity sheets.
- Added Life Skills learning page with 12 topics and quick practice questions.
- Added Learning Games page with 12 mini-games.
- Updated Kids Corner, Kids quick navigation, Quiz Hub, offline cache and release tests.
- Release validation standard: run the full suite twice before packaging a production ZIP.

# LearnWithUs v1.9.0

LearnWithUs is a Node.js educational website covering food discoveries, kids learning activities, Hindi and Telugu letters, health guides and quizzes.


### v1.9.0 — Stories, Sports & Creativity
- Added seven story collections with page-by-page local illustrations, browser read-aloud narration, vocabulary cards, moral/lesson and comprehension questions.
- Added Sports & Games learning with 12 locally illustrated activities covering equipment, players and game goals.
- Added a 10-question Sports & Games Quiz with five choices, spoken feedback, progress recording and the shared score card.
- Added Creativity Studio with drawing practice, interactive colouring, join-the-dots, paper craft and origami instructions, rhythm, dance prompts, story creation, poem building and a printable activity sheet.
- Added Stories, Sports and Creativity to Kids Corner and the shared scroll-aware Kids quick navigation.
- Added new routes and assets to the PWA offline cache and sitemap.
- Preserved existing progress/storage, quizzes, score cards, language learning, Food, Health and server behavior.

## Current release: v1.9.0

This compatible feature release expands Kids Corner with complete **Stories**, **Sports & Games**, and **Creativity Studio** learning areas while preserving the v1.8.1 progress/storage model, existing quizzes, score cards, navigation, PWA behavior and server structure.

### Added in v1.9.0

- **Stories:** seven requested story categories, each with a four-page illustrated story, page narration, vocabulary cards, a moral/lesson and three comprehension questions with spoken answer feedback.
- **Sports & Games:** 12 locally illustrated sports/games with equipment, player setup and goal explanations plus read-aloud facts.
- **Sports & Games Quiz:** ten randomized five-choice questions with the same complete correct/wrong spoken feedback used by existing quizzes, saved quiz progress and responsive score cards.
- **Creativity Studio:** drawing lessons and canvas, interactive colouring, join-the-dots, paper craft instructions, origami, music/rhythm, dance prompts, story creation, build-your-own poem and a printable activity sheet.
- **Discoverability:** Stories, Sports and Creativity were added to Kids Corner and the shared scroll-aware Kids quick-navigation strip. Sports Quiz and story comprehension are linked from Quiz Hub.
- **Offline support:** all new routes, scripts, styles and locally bundled illustration assets are part of the production build and PWA release.
- **Release discipline:** README, changelog, feature-testing documentation, version metadata, automated tests and production ZIP are updated together.

### Validation for v1.9.0

Final production validation runs the complete suite twice from the final release tree. Each full run passes **1,649/1,649 assertions**: 83 smoke checks, 1,095 links/assets/JavaScript checks, 164 feature checks, 62 v1.9.0 targeted regression checks, 219 v1.9.0 runtime/data checks, and 26 server/MIME/404 checks. Across the two required runs that is **3,298/3,298 assertions passed**.

### Release discipline

For every future LearnWithUs code change, update **README.md**, `docs/CHANGELOG.md`, `VERSION`, `package.json`, service-worker cache entries when relevant, tests for the changed behavior, and the versioned production ZIP. Run the complete automated suite twice after final cleanup.

## Project structure

```text
LearnWithUs-v1.9.0/
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
