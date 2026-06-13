# Quant Interview Trainer

A personal study site for **_A Practical Guide to Quantitative Finance Interviews_** (Xinfeng Zhou, the "Green Book"). Practice problems, reveal solutions & key takeaways, and **track your progress** — all in the browser, no backend.

## Features
- **Browse / filter** problems by chapter, topic, difficulty, status, tags, or full-text search.
- **Per-problem page**: problem statement, collapsible hint, collapsible full solution, a "key idea / takeaway", and a personal **notes** box (auto-saved).
- **Progress tracking**: mark each problem *Attempting / Solved / Review*, star favorites. A dashboard shows totals, per-chapter bars, and a **day-streak**.
- **Math** rendered with KaTeX; text is Markdown.
- **Export / Import** your progress as a JSON file to back it up or move between devices.

## Content status
- **Chapter 2 — Brain Teasers**: fully transcribed (all ~37 problems with solutions & takeaways).
- **Chapters 3–7** (Calculus/Linear Algebra, Probability, Stochastic Calculus, Finance, Algorithms): every topic and problem title is scaffolded from the book's table of contents and shows as *"coming soon"*, ready to be filled in.

## Run it locally
**Option A — just open the file.** Double-click `index.html`. (Needs internet the first time for the KaTeX/Markdown CDN scripts.)

**Option B — run a tiny local server** (avoids any browser file:// quirks):
```bash
cd quant-trainer
python3 serve.py     # then open http://127.0.0.1:4173
```

## Share it with others (deploy free)
The whole site is static, so any static host works:

- **Netlify Drop** — go to https://app.netlify.com/drop and drag the `quant-trainer` folder in. Instant public URL.
- **GitHub Pages** — push this folder to a repo, then *Settings → Pages → Deploy from branch → root*. Site appears at `https://<user>.github.io/<repo>/`.
- **Vercel** — `vercel` in the folder, accept defaults.

> Note: progress is stored in each visitor's own browser (localStorage), so everyone gets their own independent tracking. Use **Export/Import** to carry your progress between browsers or devices.

## Add more problems
All content lives in [`data/problems.js`](data/problems.js). To turn a "coming soon" entry into a real problem, replace the `ph("Title")` placeholder with a full object:

```js
{
  title: "Monty Hall Problem",
  difficulty: "medium",            // "easy" | "medium" | "hard"
  tags: ["conditional probability", "Bayes"],
  statement: "…markdown, with $LaTeX$ math…",
  hint: "…optional…",
  solution: "…markdown, supports $$display math$$…",
  keyIdea: "…one-line takeaway…"
}
```
Problem IDs are derived from the topic id + the title slug, so progress stays attached as long as the title doesn't change.

## Files
```
quant-trainer/
├── index.html          # shell + CDN includes
├── css/styles.css      # dark theme
├── js/
│   ├── app.js          # routing, views, rendering
│   └── storage.js      # localStorage progress + streaks
├── data/problems.js    # all problem content (edit here)
└── serve.py            # optional local server
```
