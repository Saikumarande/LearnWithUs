# LearnWithUs v1.0.0

LearnWithUs is a Node.js educational website covering food discoveries, kids learning activities, Hindi and Telugu letters, health guides and quizzes.

## Project structure

```text
LearnWithUs-v1.0.0/
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
