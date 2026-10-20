# LearnWithUs v4.0.0 — Full codebase quality and navigation audit

**Audit date:** 20 October 2026  
**Input:** LearnWithUs v3.20.0 Option B Clean Structure (the most recent supplied project ZIP)  
**Scope:** Corrected editable `src/`, build output `public/` and `dist/`, compatibility redirects, automated tests, responsive behavior, quiz interaction, speech-output contracts, PWA and data-preservation behavior. **Not deployed to a live website.**

## Executive findings

- **446 HTML pages** audited: **243 canonical pages** and **203 old-URL compatibility/redirect pages**.
- **3,002 static hyperlinks** counted, of which **3,001 are internal**. They resolve to **414 distinct local HTML/file destinations**. The remaining static hyperlink uses an external destination.
- **8,006 total `href`, `src`, `poster` and `action` attributes** encountered in HTML; after excluding `base` declarations, **7,773 internal references**, **4 external resource/link references** and **1 special-protocol reference** were checked/classified.
- **1,991 local references use preserved old URLs** backed by the 203 compatibility redirects. Keeping these stubs is deliberate: removing them would break existing bookmarks and internal links.
- **141 static fragment links** validated against their final target elements, following legacy redirects where necessary. **0 missing local files, 0 missing target IDs** after the fixes.
- **782 served files**, generated identically into `public/` and `dist/` from a single editable `src/` source; **1,564/1,564 build-parity comparisons** pass.
- **150 PWA pre-cache URLs**, all referring to existing local files; 35 CSS files have no broken local `url(...)` references.
- No HTML routes, learning topics, compatibility aliases or browser learning-progress storage keys were intentionally removed.

## Confirmed issues resolved

| Issue | Before | v4.0.0 fix | After |
|---|---:|---|---:|
| In-page anchors resolving incorrectly because of `<base href>` | **102 affected pages** | Changed links such as `#main` to base-safe page-relative URLs; fixed `#lw-family-tools` in the same way | **0 unresolved fragments** |
| Recent interactive quiz speech only saying generic “try again” without giving the correct choice | 13 v3.19/v3.20 activities share this behavior | Spoken messages now say **“Correct answer! [answer]”** or **“Wrong answer. The correct answer is [answer]”**; on-screen wrong-choice feedback explicitly gives the answer | **82/82 new speech-contract assertions pass** |
| Current release identification scattered across metadata/cache | 3.20.0 | Synchronized `VERSION`, `package.json`, `package-lock.json`, generated `public/VERSION`, active version stamp, PWA cache key and newer-topic version labels | **4.0.0** |
| Regression testing missed `<base>`-relative fragment errors | No dedicated complete-fragment check | Added `tests/quality/v400-navigation-test.js` to `npm test` | Fails the build if broken local targets/fragments reappear |

**Why the anchor problem occurred:** Many canonical pages use `<base href="../../">` or `<base href="../">`, so a plain `href="#main"` resolves against the shared base (the site homepage), **not** the current lesson URL. Those anchors existed, making older file-only checks look successful. The repaired links now include the current page's canonical URL, e.g. `learn/food/balanced-plate.html#main`, which works under the same base and preserves the site-relative prefix used by VS Code Live Server.

## Tests and what they check

| Area | Coverage | Result |
|---|---|---|
| Build/source integrity | Every entry in `config/site-files.json`, generated `public/` / `dist/` mirrors | **1,564/1,564 pass** |
| Local hyperlink, image, script, CSS and HTML resource locations | All 446 HTML pages; static URLs resolved with effective `<base>` | **3,002 hyperlinks; 0 missing targets** |
| Hash links and in-page navigation | All 141 static fragments, with legacy redirect resolution | **141/141 valid** |
| Legacy compatibility | All 203 legacy URL files plus query/hash-preservation contract | **203/203 present and mapped** |
| HTTP server | Real Node HTTP routes, MIME types, security headers, 404 response and route crawl | **446/446 HTML routes covered by existing live-route tests** |
| JavaScript/HTML syntax, IDs, structure | JS syntax, HTML doctypes, tag structure, duplicate IDs, local links and assets | **Existing `npm test` suite passes** |
| Responsive layout | Chromium DOM and computed-CSS tests at 390, 800 and 1280 px; hubs, lessons, navigation, flags, quizzes | **Existing and v4 browser suites pass** |
| Maths, Science and Languages | Lessons, interactive models, 10-question quiz completion, explanations, score cards, Hindi/Telugu Level 2 | **v3.13: 459/459; v3.17: 372/372 browser checks pass** |
| Food, Health and Life Skills v3.19–20 | 13 interactive topics, three responsive widths, complete quizzes, labs, family tools | **82/82 v3.20 browser checks pass** |
| Speech correctness logic | 13 new quiz topics × correct/wrong, exact correct answer in message; locale assignment; matching Hindi/Telugu voice requirements | **82/82 v4 voice-contract checks pass** |
| Family profiles/goals/backups | Profile-scoped goals, quiz trends, complete all-profile JSON backup, malformed-JSON rejection | **Included in v3.20 browser suite** |
| PWA/offline file availability | PWA manifest, service worker version, 150 cached file names | **150/150 paths present** |
| Quiz certificates and flags | Score card download/share contracts, 48 illustration files and full quiz flows | **Existing Chromium regression checks pass** |

Automated test commands to reproduce:

```powershell
npm ci
npm run build
npm run check:build
npm test
npm run test:browser-ui
npm run test:v400
```

`test:browser-ui` requires Chromium at `/usr/bin/chromium` by default (some tests support `CHROMIUM_PATH`). Tests that use the DevTools protocol create temporary profiles; no separate npm browser package is required.

## Coverage limitations — what is **not** guaranteed

This is a broad **automated QA audit, not a certification that every possible action works on every device**.

1. **Real spoken sound / accents:** tests check the text and language sent to `SpeechSynthesisUtterance`. They cannot hear actual output, detect a mispronouncing operating-system voice or prove physical microphone-recognition accuracy. Hindi/Telugu speech is deliberately disabled when a matching voice is unavailable.
2. **Live-end-to-end website browsing:** this execution environment blocked local HTTP navigation inside Chromium, although Node's HTTP route tests worked and the Chromium DOM/CSS/JavaScript tests passed. Real deployed origin and devices should still be checked manually.
3. **External websites:** four static external resource references were classified; live availability and full JavaScript-generated outgoing-link reachability were not independently established.
4. **All possible learner data:** restore accepts valid backup JSON with confirmation; simulated profiles and corrupted-file checks ran, but no real family data was provided for migration testing. Weekly historical lesson completions lacking dates cannot be reconstructed into accurate weekly totals.
5. **Visual inspection:** automated mobile/tablet/desktop layout tests cover many representative pages, but this was not a pixel-by-pixel human review of all 446 pages.
6. **System audio and permissions:** browser speech recognition, platform voices and permissions depend on the real operating system, installed voices, browser version and device.

## Release smoke checklist for your PC

1. Run `npm ci`, `npm run build`, `npm test` and `npm run test:browser-ui` in the project root.
2. Open Live Server on `public/index.html`, or use `npm start` and `http://localhost:8080`.
3. Open **Food → Build a Balanced Plate**. Click **Skip to learning**; it must remain on Balanced Plate and scroll to its main content.
4. Open **Kids → Parent Dashboard → Family Learning Tools**. Click its shortcut; it must open `/account/dashboard.html#lw-family-tools`, not the homepage.
5. Test a correct and a wrong answer in **Balanced Plate Quiz** and **First Aid Awareness Quiz**. The spoken phrase, when English synthesis is available, should correctly state the answer.
6. Try Hindi and Telugu letters. A matching system voice should speak the selected character; without one, a visible warning should appear and the button should be disabled.
7. Create two learners, add different quiz results/goals, download a family backup, and separately try a malformed backup and a valid backup with cancellation/confirmation. Use fresh test-only browser profiles.
8. On a 390 px phone viewport, open Kids, Food, Health, a Science lesson, Life Skills, Quiz Hub and My Learning. Look for unexpected horizontal scrolling or overlapping menus.
9. Revisit a bookmarked older root URL such as `/food.html` and confirm it redirects to the canonical page, preserving query and fragment.
10. Test PWA installation and offline behavior **only on a supported HTTPS origin**; Live Server alone does not prove production service-worker behavior.

## Development rules after this release

- Edit **only `src/`** and register new served files in `config/site-files.json`. Do not edit generated `public/` or `dist/`.
- Keep `route-map.json` aliases for backward compatibility.
- With any `<base href>`, **never use `href="#section"`** to navigate to the current page. Use a site-root-based path relative to the base (e.g. `account/dashboard.html#lw-family-tools`).
- Do not rename `learnwithus.platform.v1`, profile storage keys or the family backup JSON format without a tested migration.
- Increase the service-worker cache name after deployment updates, to avoid stale offline assets.

**Result:** v4.0.0 is a navigation, quiz-feedback and QA-hardening release. It is ready for local review and staging, not claimed to have been deployed or physically voice-tested.
