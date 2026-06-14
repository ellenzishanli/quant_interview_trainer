# Backend setup — sign-in + discussion forum

The trainer works fully as a static site without any backend: problems, progress,
starred **My List**, language toggle, and themes all run in the browser.

**Sign-in (Google) and the per-problem discussion forum** are the only features that
need a backend. They're powered by **Firebase** (Google's free tier is generous —
plenty for a community study site). Until you complete the steps below, the site shows
a disabled "Sign in" button and a "Discussion coming soon" note — nothing breaks.

---

## One-time setup (~10 minutes)

### 1. Create a Firebase project
1. Go to <https://console.firebase.google.com> → **Add project**.
2. Name it (e.g. `quant-trainer`). Google Analytics is optional — you can skip it.

### 2. Register a Web app
1. In the project, click the **`</>`** (Web) icon → register an app (any nickname).
2. Firebase shows a `firebaseConfig` object. Copy it.
3. Open [`js/firebase-config.js`](js/firebase-config.js) and replace `null` with it:

   ```js
   window.FIREBASE_CONFIG = {
     apiKey: "AIza…",
     authDomain: "quant-trainer.firebaseapp.com",
     projectId: "quant-trainer",
     appId: "1:…:web:…"
   };
   ```
   > These values are **not secrets** — they're designed to ship in client code.
   > Real protection comes from the Firestore rules in step 4.

### 3. Enable Google sign-in
1. **Build → Authentication → Get started**.
2. **Sign-in method → Google → Enable**, pick a support email, **Save**.
3. **Authentication → Settings → Authorized domains**: add the domain you'll deploy to
   (e.g. `yourname.github.io`). `localhost` is allowed by default for testing.

### 4. Create Firestore + paste the rules
1. **Build → Firestore Database → Create database** → **Production mode** → pick a region.
2. Open the **Rules** tab, paste the contents of [`firestore.rules`](firestore.rules),
   click **Publish**.

That's it. Reload the site — the **Sign in** button activates and each problem gains a
**Discussion** section.

---

## How it works

- **Auth**: `js/auth.js` — Google popup sign-in; shows avatar + name in the toolbar.
- **Forum**: `js/forum.js` — comments stored at
  `discussions/{problemId}/comments/{commentId}`; live-updates via Firestore snapshots.
  Signed-in users can post and delete their own comments; anyone can read; a **Report**
  button writes to a `reports` collection you review in the console.
- **Guidelines**: a "友好交流，文明用语 / be kind and constructive" banner sits above the
  composer (text in `js/i18n.js` under the `forum.*` keys).
- **Leaderboard**: `js/leaderboard.js` — each signed-in user has a public doc at
  `users/{uid}` = `{ name, photo, solved }`. Your solved count is published whenever you
  mark a problem solved; the **Leaderboard** tab lists the top solvers (you're
  highlighted). Anyone can read it; you can only write your own row. *(Solved counts come
  from this browser's localStorage, so the count reflects the device you solve on — full
  cross-device progress sync would be a later add-on.)*

## Moderation
- Reported comments land in the **`reports`** collection (Firestore console). They're not
  readable from the client by design.
- To delete any comment as an admin, do it from the Firestore console, or add an
  `admins/{uid}` allowlist to the rules and grant yourself delete rights.

## Costs
Firebase's free **Spark** plan covers ~50K reads / 20K writes per day — far beyond a
study community's needs. Monetization later (e.g. premium tiers) can layer on top
without changing this setup.
