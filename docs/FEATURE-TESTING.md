## 1.10.0 targeted checks
- Creativity Studio expanded controls and selectors.
- Life Skills page routes and practice questions.
- Learning Games route and interactions.
- Kids Corner links, quick navigation and service-worker cache coverage.

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
| Analytics consent | Clear site data, reload, and choose **Keep analytics off** | No `googletagmanager.com` request appears in Network |
| Analytics allowed | Open Privacy, allow analytics, reload | A `gtag/js?id=G-14CDXN6DDM` request appears; Realtime may take a few minutes |
| Progress reset | My learning → **Clear local learning progress** | Recent items, scores, bookmarks and counts clear after confirmation |
| Breadcrumbs | Open a food, kids or health detail page | Home and category links appear above the page content |
| 404 | Visit `/this-page-does-not-exist` | Custom LearnWithUs page appears and the HTTP status is 404 |
| Sitemap/robots | Open `/sitemap.xml` and `/robots.txt` | Both files load as text/XML and robots points to the sitemap |
| Responsive layout | Developer Tools → device toolbar; test 390 px and 768 px | No horizontal page overflow; cards reflow and the menu remains usable |
| Reduced motion | Enable “Reduce motion” in the operating system, then reload | Smooth/animated motion is suppressed |

Audio uses the browser and operating-system speech voices. The website intentionally refuses an English or wrong-language fallback. On Windows, install available Hindi or Telugu speech features in **Settings → Time & language → Language & region → Language options**, then restart the browser. Some browser/OS combinations do not expose a Telugu voice to websites; in that case the page keeps sound disabled instead of risking incorrect teaching.


## v1.7.4 focused regression checks

- Kids Corner → Letters: first click must render all 26 capital-letter cards immediately; no second style click is required.
- Switch Capitals → Small letters → Capitals: card count remains 26 and glyph case updates correctly.
- Kids Corner activity tiles: desktop layout uses up to three tiles per row; tablet/mobile reduces without horizontal overflow.
- Kids activity search: searches the new descriptive tiles and hides category groups with no matching activities.
- Category placement: India & Maps appears under India & General Knowledge; Animals/Colours/Shapes remain under World Around Us; Hindi/Telugu remain under Indian Languages.
- Shared score cards: Food, Letters/Numbers, Picture Matching, Counting, Missing Letters, Picture Spelling and Maths results remain centered and within the viewport.
- Score-card action buttons: three-column desktop layout and one-column mobile layout.
- Existing quiz URLs, saved progress, score-card downloads/sharing, PWA cache and custom 404 continue to work.

## v1.8.1 focused regression checks

- Multiplication Tables: select each table 1–20; exactly 10 facts render vertically from ×1 to ×10; the quiz link preserves the selected table.
- Multiplication Tables Quiz: selected table is preserved and the 10 questions use factors 1 through 10 only.
- Kids quick navigation: every page with `data-area="kids"` loads the shared shell and receives the same 11-link Kids strip.
- Scroll behavior: the Kids strip hides after downward scrolling and returns after upward scrolling; it remains visible near the top of the page.
- Navigation scope: Food and Health section navigation is not replaced by the Kids quick navigation.

## v1.8.0 focused regression checks

- Maths journey buttons: Start Quiz / secondary learning action / Next Topic are equal-width and aligned on desktop and stack on mobile.
- Multiplication Tables: select each table 1–20; facts update to ×1–×10; quiz link preserves the selected table.
- Tables Quiz: query-string table auto-selects, dropdown can change the table, ten questions render, spoken correct/wrong feedback is complete, and scores below 8/10 link back to the same table.
- Time & Calendar: Days, Months and Seasons learning sections render in the existing page; calendar quiz includes the new learning.
- India Map Hunt: a target marker is shown and typed state/UT answers are checked with spoken feedback.
- India Capital/Region activities: five choices render and correct/wrong feedback is spoken.
- India States & Capitals Quiz: ten questions, five capital options, score card and review link work.
- Planets and Countries & Capitals pages render with direct quiz continuation; both new quiz topics use complete spoken feedback and shared score cards.
- Kids Corner and Quiz Hub expose all new learning/quiz routes in their correct subject categories.
- Shared score-card remains responsive and now includes achievement symbols.
- Existing Letters first-open, tracing, old/new maths, food/English quizzes, language audio, local progress, PWA/offline, 404 and server checks remain green.



## v1.9.0 regression additions
- Stories library contains all seven requested story categories.
- Every story has exactly four illustrated pages, vocabulary, a moral/lesson and three comprehension questions.
- Story narration uses browser speech and comprehension uses full correct/wrong spoken feedback.
- Sports learning contains 12 local illustrated sport/game cards and Sports Quiz contains 10 questions with five choices.
- Creativity Studio exposes drawing, colouring, dots, crafts, origami, rhythm, dance, story, poem and print functionality.
- Stories, Sports and Creativity appear in Kids Corner and shared Kids quick navigation.
- New pages/assets are cached for offline use.

- `tests/v190-runtime-test.js` validates story/sports data integrity, all 40 local illustrations, Creativity controls, shared navigation coverage and offline pre-cache coverage.
