# LearnWithUs feature testing

## One-command automated check

From the project folder, run:

```powershell
npm test
```

This checks required pages, local links and assets, JavaScript syntax, Hindi/Telugu lesson wiring, language active states, speech hooks, rich recent-history data, age recommendations, PWA files, MIME types, key server routes and the custom 404 response.

## Quick manual checks after deployment

Use a private browser window so old local progress does not affect the result.

| Feature | How to check | Expected result |
| --- | --- | --- |
| Device-only progress | Visit three lessons, then open **My learning** | Topic count increases and recent items include a title plus a useful description |
| Food and kids quiz history | Finish one food quiz and one kids quiz | Both attempts appear under **Quiz history** with score and date |
| Private dashboard | Open Developer Tools → Application → Local Storage | `learnwithus.platform.v1` stores progress on this device; no child name is requested |
| No leaderboard | Search the site for “leaderboard” and use all quiz pages | No public ranking or child profile appears |
| Hindi/Telugu pages | Open `/hindi.html` and `/telugu.html` separately | Each URL shows only its own language in the requested row order |
| Hindi/Telugu audio | Open each language page and check the message above the rows | Hear buttons enable only when the browser exposes the matching `hi-IN` or `te-IN` voice; tapping speaks only the chosen letter |
| Hindi/Telugu active link | Move between Hindi and Telugu pages | The current language link is outlined and bold in the Kids navigation |
| PWA installation | Open the deployed HTTPS site in Chrome or Edge | Browser install icon or the site’s Install control appears when browser criteria are met |
| Offline fallback | Visit once, enable Offline in Developer Tools → Network, then reload a page not cached | The friendly offline page appears |
| Analytics consent | Clear site data, reload, and choose **Not now** | No `googletagmanager.com` request appears in Network |
| Analytics allowed | Open Privacy, allow analytics, reload | A `gtag/js?id=G-14CDXN6DDM` request appears; Realtime may take a few minutes |
| Progress reset | My learning → **Clear local learning progress** | Recent items, scores, bookmarks and counts clear after confirmation |
| Breadcrumbs | Open a food, kids or health detail page | Home and category links appear above the page content |
| 404 | Visit `/this-page-does-not-exist` | Custom LearnWithUs page appears and the HTTP status is 404 |
| Sitemap/robots | Open `/sitemap.xml` and `/robots.txt` | Both files load as text/XML and robots points to the sitemap |
| Responsive layout | Developer Tools → device toolbar; test 390 px and 768 px | No horizontal page overflow; cards reflow and the menu remains usable |
| Reduced motion | Enable “Reduce motion” in the operating system, then reload | Smooth/animated motion is suppressed |

Audio uses the browser and operating-system speech voices. The website intentionally refuses an English or wrong-language fallback. On Windows, install available Hindi or Telugu speech features in **Settings → Time & language → Language & region → Language options**, then restart the browser. Some browser/OS combinations do not expose a Telugu voice to websites; in that case the page keeps sound disabled instead of risking incorrect teaching.
