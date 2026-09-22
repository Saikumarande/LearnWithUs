# LearnWithUs

LearnWithUs is a Node.js website with food discoveries, kids learning activities,
health guides, quizzes and Google Analytics 4 tracking.

## Platform foundation included

- Global search across Food, Kids, Health, quizzes and core learning pages
- Device-only bookmarks, recently viewed topics, progress and quiz history
- Age-based daily recommendations and guided paths for children, parents,
  students and teachers
- Separate Hindi and Telugu letter pages in traditional reading rows, with strict matching-language browser speech
- Installable Progressive Web App with an offline fallback
- Consent-controlled Google Analytics, privacy choices and local-data reset
- Custom 404 page, sitemap, robots file and automated local-link checks

No public user profile or backend database is used in this phase. Progress is
stored in the current browser with `localStorage`.

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
