# LearnWithUs wiki

LearnWithUs is a Node.js website with food discoveries, kids learning activities,
health guides, quizzes and Google Analytics 4 tracking.

## Local verification

Requires Node.js 24 LTS.

```powershell
npm test
npm start
```

Then open `http://localhost:8080`.

## Azure App Service deployment

The application must be deployed from the repository root. The root contains
`package.json`, `server.js`, the HTML pages and the `assets` directory.

Use Azure App Service Deployment Center with GitHub and select the `main` branch.
Deployment Center creates the workflow under `.github/workflows` automatically.

