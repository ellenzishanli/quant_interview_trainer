/* Quant Interview Trainer — main app (vanilla JS, hash-routed SPA). */
(function () {
  const DATA = window.QUANT_DATA;
  const Store = window.Store;

  // ---------- helpers ----------
  const STATUS_META = {
    unseen:     { label: "Not started", short: "—",  cls: "st-unseen" },
    attempting: { label: "Attempting",  short: "◐",  cls: "st-attempting" },
    solved:     { label: "Solved",      short: "✓",  cls: "st-solved" },
    review:     { label: "Review",      short: "↻",  cls: "st-review" }
  };
  const DIFF_META = {
    easy:   { label: "Easy",   cls: "d-easy" },
    medium: { label: "Medium", cls: "d-medium" },
    hard:   { label: "Hard",   cls: "d-hard" }
  };

  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function md(s) {
    if (!s) return "";
    if (window.marked) return window.marked.parse(s);
    return "<p>" + esc(s).replace(/\n\n+/g, "</p><p>").replace(/\n/g, "<br>") + "</p>";
  }
  function typeset(el) {
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(el, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ],
          throwOnError: false
        });
      } catch (e) {}
    }
  }

  // ---------- build a flat index of problems ----------
  const INDEX = [];          // ordered flat list
  const BY_ID = {};
  DATA.chapters.forEach((ch) => {
    ch.topics.forEach((tp) => {
      tp.problems.forEach((pr) => {
        const id = tp.id + ":" + slug(pr.title);
        const entry = { id, problem: pr, topic: tp, chapter: ch };
        INDEX.push(entry);
        BY_ID[id] = entry;
      });
    });
  });

  function isReal(pr) {
    return !pr.placeholder;
  }

  // ---------- stats ----------
  function chapterStats(ch) {
    let total = 0, solved = 0, attempting = 0, review = 0, available = 0;
    ch.topics.forEach((tp) =>
      tp.problems.forEach((pr) => {
        total++;
        if (isReal(pr)) available++;
        const id = tp.id + ":" + slug(pr.title);
        const st = Store.get(id).status;
        if (st === "solved") solved++;
        else if (st === "attempting") attempting++;
        else if (st === "review") review++;
      })
    );
    return { total, solved, attempting, review, available };
  }

  function globalStats() {
    let total = 0, solved = 0, attempting = 0, review = 0, starred = 0, available = 0;
    INDEX.forEach((e) => {
      total++;
      if (isReal(e.problem)) available++;
      const p = Store.get(e.id);
      if (p.status === "solved") solved++;
      else if (p.status === "attempting") attempting++;
      else if (p.status === "review") review++;
      if (p.starred) starred++;
    });
    return { total, solved, attempting, review, starred, available };
  }

  // ---------- small render bits ----------
  function diffBadge(d) {
    if (!d) return "";
    const m = DIFF_META[d];
    return `<span class="badge ${m.cls}">${m.label}</span>`;
  }
  function statusDot(id) {
    const st = Store.get(id).status;
    const m = STATUS_META[st];
    return `<span class="status-dot ${m.cls}" title="${m.label}">${m.short}</span>`;
  }
  function progressBar(done, total) {
    const pct = total ? Math.round((done / total) * 100) : 0;
    return `<div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>`;
  }

  // ---------- sidebar ----------
  function renderSidebar() {
    const route = parseHash();
    const html = DATA.chapters
      .map((ch) => {
        const s = chapterStats(ch);
        const topicsHtml = ch.topics
          .map((tp) => {
            const active = route.name === "topic" && route.id === tp.id ? " active" : "";
            const real = tp.problems.filter(isReal).length;
            return `<a class="side-topic${active}" href="#/topic/${encodeURIComponent(tp.id)}">
              <span class="side-topic-id">${tp.id}</span>
              <span class="side-topic-title">${esc(tp.title)}</span>
              ${real ? `<span class="side-topic-count">${real}</span>` : `<span class="side-topic-soon">soon</span>`}
            </a>`;
          })
          .join("");
        return `<div class="side-chapter">
          <div class="side-chapter-head">
            <span class="side-ch-num">Ch ${ch.num}</span>
            <span class="side-ch-title">${esc(ch.title)}</span>
          </div>
          <div class="side-ch-prog">${progressBar(s.solved, s.total)}<span class="side-ch-pct">${s.solved}/${s.total}</span></div>
          <div class="side-topics">${topicsHtml}</div>
        </div>`;
      })
      .join("");
    document.getElementById("sidebar-chapters").innerHTML = html;
  }

  // ---------- views ----------
  function viewDashboard() {
    const g = globalStats();
    const streak = Store.getStreak();
    const pct = g.total ? Math.round((g.solved / g.total) * 100) : 0;

    const cards = `
      <div class="stat-cards">
        <div class="stat-card"><div class="stat-num">${g.solved}</div><div class="stat-lbl">Solved</div></div>
        <div class="stat-card"><div class="stat-num">${g.attempting}</div><div class="stat-lbl">Attempting</div></div>
        <div class="stat-card"><div class="stat-num">${g.review}</div><div class="stat-lbl">To review</div></div>
        <div class="stat-card"><div class="stat-num">${g.starred}</div><div class="stat-lbl">Starred</div></div>
        <div class="stat-card accent"><div class="stat-num">${streak}🔥</div><div class="stat-lbl">Day streak</div></div>
      </div>`;

    const overall = `
      <div class="overall">
        <div class="overall-top"><span>Overall progress</span><span>${g.solved} / ${g.total} solved · ${g.available} with full solutions</span></div>
        ${progressBar(g.solved, g.total)}
        <div class="overall-pct">${pct}%</div>
      </div>`;

    const chapters = DATA.chapters
      .map((ch) => {
        const s = chapterStats(ch);
        return `<a class="dash-chapter" href="#/topic/${encodeURIComponent(ch.topics[0].id)}">
          <div class="dash-ch-head"><b>Chapter ${ch.num} · ${esc(ch.title)}</b><span>${s.solved}/${s.total}</span></div>
          <p class="dash-ch-blurb">${esc(ch.blurb)}</p>
          ${progressBar(s.solved, s.total)}
          <div class="dash-ch-meta">${s.available} solvable now${s.available < s.total ? ` · ${s.total - s.available} coming soon` : ""}${s.review ? ` · ${s.review} flagged for review` : ""}</div>
        </a>`;
      })
      .join("");

    // a few suggested next problems: attempting/review first, then unseen real ones
    const next = INDEX.filter((e) => isReal(e.problem))
      .map((e) => ({ e, st: Store.get(e.id).status }))
      .sort((a, b) => {
        const order = { review: 0, attempting: 1, unseen: 2, solved: 3 };
        return order[a.st] - order[b.st];
      })
      .filter((x) => x.st !== "solved")
      .slice(0, 5)
      .map((x) => problemRow(x.e))
      .join("");

    const main = document.getElementById("main");
    main.innerHTML = `
      <div class="view-pad">
        <h1>Your dashboard</h1>
        <p class="subtle">Tracking progress through <i>${esc(DATA.meta.source)}</i>. Everything is saved in this browser.</p>
        ${cards}
        ${overall}
        <h2>Pick up where you left off</h2>
        <div class="prob-list">${next || '<p class="subtle">All caught up — nice. Browse a chapter to keep going.</p>'}</div>
        <h2>Chapters</h2>
        <div class="dash-chapters">${chapters}</div>
      </div>`;
    typeset(main);
  }

  function problemRow(e) {
    const pr = e.problem;
    const p = Store.get(e.id);
    if (!isReal(pr)) {
      return `<div class="prob-row soon">
        ${statusDot(e.id)}
        <span class="prob-row-title">${esc(pr.title)}</span>
        <span class="prob-row-meta">${e.chapter.num}.${e.topic.id.split(".")[1]} ${esc(e.topic.title)}</span>
        <span class="badge soon-badge">coming soon</span>
      </div>`;
    }
    return `<a class="prob-row" href="#/problem/${encodeURIComponent(e.id)}">
      ${statusDot(e.id)}
      <span class="prob-row-title">${p.starred ? "★ " : ""}${esc(pr.title)}</span>
      <span class="prob-row-meta">Ch ${e.chapter.num} · ${esc(e.topic.title)}</span>
      ${diffBadge(pr.difficulty)}
    </a>`;
  }

  function viewTopic(topicId) {
    let found = null;
    DATA.chapters.forEach((ch) => ch.topics.forEach((tp) => { if (tp.id === topicId) found = { ch, tp }; }));
    const main = document.getElementById("main");
    if (!found) { main.innerHTML = '<div class="view-pad"><p>Topic not found.</p></div>'; return; }
    const { ch, tp } = found;
    const rows = tp.problems
      .map((pr) => problemRow(BY_ID[tp.id + ":" + slug(pr.title)]))
      .join("");
    main.innerHTML = `
      <div class="view-pad">
        <div class="breadcrumb"><a href="#/">Dashboard</a> › Chapter ${ch.num} · ${esc(ch.title)}</div>
        <h1>${tp.id} ${esc(tp.title)}</h1>
        ${tp.note ? `<div class="topic-note">${md(tp.note)}</div>` : ""}
        <div class="prob-list">${rows}</div>
      </div>`;
    typeset(main);
  }

  function viewBrowse() {
    const main = document.getElementById("main");
    main.innerHTML = `
      <div class="view-pad">
        <h1>Browse all problems</h1>
        <div class="filters">
          <input id="f-search" class="f-search" type="text" placeholder="Search problems, tags…">
          <div class="f-group" id="f-diff">
            <span class="f-label">Difficulty:</span>
            <label><input type="checkbox" value="easy">Easy</label>
            <label><input type="checkbox" value="medium">Medium</label>
            <label><input type="checkbox" value="hard">Hard</label>
          </div>
          <div class="f-group" id="f-status">
            <span class="f-label">Status:</span>
            <label><input type="checkbox" value="unseen">Not started</label>
            <label><input type="checkbox" value="attempting">Attempting</label>
            <label><input type="checkbox" value="solved">Solved</label>
            <label><input type="checkbox" value="review">Review</label>
          </div>
          <label class="f-toggle"><input type="checkbox" id="f-star">★ Starred only</label>
          <label class="f-toggle"><input type="checkbox" id="f-real" checked>Solvable only</label>
        </div>
        <div class="browse-count" id="browse-count"></div>
        <div class="prob-list" id="browse-list"></div>
      </div>`;

    function apply() {
      const q = document.getElementById("f-search").value.trim().toLowerCase();
      const diffs = [...document.querySelectorAll("#f-diff input:checked")].map((c) => c.value);
      const stats = [...document.querySelectorAll("#f-status input:checked")].map((c) => c.value);
      const starOnly = document.getElementById("f-star").checked;
      const realOnly = document.getElementById("f-real").checked;

      const matches = INDEX.filter((e) => {
        const pr = e.problem;
        if (realOnly && !isReal(pr)) return false;
        if (diffs.length && !diffs.includes(pr.difficulty)) return false;
        const p = Store.get(e.id);
        if (stats.length && !stats.includes(p.status)) return false;
        if (starOnly && !p.starred) return false;
        if (q) {
          const hay = (pr.title + " " + (pr.tags || []).join(" ") + " " + e.topic.title + " " + e.chapter.title).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
      document.getElementById("browse-count").textContent = matches.length + " problem" + (matches.length === 1 ? "" : "s");
      document.getElementById("browse-list").innerHTML = matches.map(problemRow).join("") || '<p class="subtle">No matches.</p>';
    }

    main.querySelectorAll(".filters input").forEach((el) => {
      el.addEventListener("input", apply);
      el.addEventListener("change", apply);
    });
    apply();
  }

  function viewProblem(id) {
    const e = BY_ID[id];
    const main = document.getElementById("main");
    if (!e) { main.innerHTML = '<div class="view-pad"><p>Problem not found.</p></div>'; return; }
    const pr = e.problem;
    const p = Store.get(id);

    // neighbors within the flat index
    const realList = INDEX;
    const pos = realList.findIndex((x) => x.id === id);
    const prev = pos > 0 ? realList[pos - 1] : null;
    const nextN = pos < realList.length - 1 ? realList[pos + 1] : null;

    if (!isReal(pr)) {
      main.innerHTML = `<div class="view-pad">
        <div class="breadcrumb"><a href="#/">Dashboard</a> › <a href="#/topic/${encodeURIComponent(e.topic.id)}">${e.topic.id} ${esc(e.topic.title)}</a></div>
        <h1>${esc(pr.title)}</h1>
        <div class="soon-panel">📋 This problem is scaffolded from the book's table of contents but not transcribed yet.<br>It belongs to <b>Chapter ${e.chapter.num} · ${esc(e.topic.title)}</b>.</div>
        ${navButtons(prev, nextN)}
      </div>`;
      return;
    }

    const tags = (pr.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("");
    const statusBtns = Store.STATUSES.map((s) => {
      const m = STATUS_META[s];
      return `<button class="status-btn ${m.cls}${p.status === s ? " on" : ""}" data-status="${s}">${m.label}</button>`;
    }).join("");

    main.innerHTML = `
      <div class="view-pad problem-view">
        <div class="breadcrumb"><a href="#/">Dashboard</a> › <a href="#/topic/${encodeURIComponent(e.topic.id)}">${e.topic.id} ${esc(e.topic.title)}</a></div>
        <div class="problem-head">
          <h1>${esc(pr.title)}</h1>
          <button id="star-btn" class="star-btn${p.starred ? " on" : ""}" title="Star">${p.starred ? "★" : "☆"}</button>
        </div>
        <div class="problem-meta">${diffBadge(pr.difficulty)} ${tags}</div>

        <div class="status-row"><span class="status-row-lbl">Mark as:</span>${statusBtns}</div>

        <section class="block statement">
          <h3>Problem</h3>
          ${md(pr.statement)}
        </section>

        ${pr.hint ? `
        <details class="block reveal hint">
          <summary>💡 Show hint</summary>
          <div class="reveal-body">${md(pr.hint)}</div>
        </details>` : ""}

        <details class="block reveal solution">
          <summary>🔑 Show solution</summary>
          <div class="reveal-body">${md(pr.solution)}</div>
        </details>

        ${pr.keyIdea ? `
        <section class="block key-idea">
          <h3>Key idea / takeaway</h3>
          ${md(pr.keyIdea)}
        </section>` : ""}

        <section class="block notes">
          <h3>Your notes</h3>
          <textarea id="notes" placeholder="Jot down your approach, where you got stuck, the trick to remember…">${esc(p.notes || "")}</textarea>
          <div class="notes-saved" id="notes-saved"></div>
        </section>

        ${navButtons(prev, nextN)}
      </div>`;

    // wire up interactions
    main.querySelectorAll(".status-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const newStatus = btn.dataset.status;
        const cur = Store.get(id).status;
        Store.set(id, { status: cur === newStatus ? "unseen" : newStatus });
        renderSidebar();
        main.querySelectorAll(".status-btn").forEach((b) => b.classList.remove("on"));
        if (Store.get(id).status === newStatus) btn.classList.add("on");
      });
    });
    const starBtn = main.querySelector("#star-btn");
    starBtn.addEventListener("click", () => {
      const v = !Store.get(id).starred;
      Store.set(id, { starred: v });
      starBtn.classList.toggle("on", v);
      starBtn.textContent = v ? "★" : "☆";
    });
    const notes = main.querySelector("#notes");
    let t;
    notes.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        Store.set(id, { notes: notes.value });
        const s = main.querySelector("#notes-saved");
        s.textContent = "Saved ✓";
        setTimeout(() => (s.textContent = ""), 1500);
      }, 500);
    });

    // typeset only the static content (not the textarea)
    main.querySelectorAll(".block.statement, .reveal-body, .key-idea").forEach(typeset);

    // typeset solution/hint when first opened (KaTeX already ran, but re-run is cheap & safe)
    main.querySelectorAll("details.reveal").forEach((d) =>
      d.addEventListener("toggle", () => { if (d.open) typeset(d); })
    );
  }

  function navButtons(prev, nextN) {
    return `<div class="nav-buttons">
      ${prev ? `<a class="nav-btn" href="#/problem/${encodeURIComponent(prev.id)}">← ${esc(prev.problem.title)}</a>` : "<span></span>"}
      ${nextN ? `<a class="nav-btn next" href="#/problem/${encodeURIComponent(nextN.id)}">${esc(nextN.problem.title)} →</a>` : "<span></span>"}
    </div>`;
  }

  // ---------- routing ----------
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, "");
    if (!h || h === "dashboard") return { name: "dashboard" };
    const parts = h.split("/");
    if (parts[0] === "browse") return { name: "browse" };
    if (parts[0] === "topic") return { name: "topic", id: decodeURIComponent(parts[1] || "") };
    if (parts[0] === "problem") return { name: "problem", id: decodeURIComponent(parts[1] || "") };
    return { name: "dashboard" };
  }

  function route() {
    const r = parseHash();
    if (r.name === "browse") viewBrowse();
    else if (r.name === "topic") viewTopic(r.id);
    else if (r.name === "problem") viewProblem(r.id);
    else viewDashboard();
    renderSidebar();
    // highlight top nav
    document.querySelectorAll(".topnav a").forEach((a) => a.classList.remove("active"));
    const navId = r.name === "browse" ? "nav-browse" : "nav-dash";
    const navEl = document.getElementById(navId);
    if (navEl) navEl.classList.add("active");
    document.getElementById("main").scrollTop = 0;
    window.scrollTo(0, 0);
  }

  // ---------- export / import / reset ----------
  function wireToolbar() {
    document.getElementById("btn-export").addEventListener("click", () => {
      const blob = new Blob([Store.exportData()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quant-trainer-progress.json";
      a.click();
      URL.revokeObjectURL(url);
    });
    document.getElementById("btn-import").addEventListener("click", () => {
      document.getElementById("import-file").click();
    });
    document.getElementById("import-file").addEventListener("change", (ev) => {
      const file = ev.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try { Store.importData(reader.result); route(); alert("Progress imported."); }
        catch (e) { alert("Could not read that file."); }
      };
      reader.readAsText(file);
    });
    document.getElementById("btn-reset").addEventListener("click", () => {
      if (confirm("Reset all progress and notes? This cannot be undone.")) { Store.reset(); route(); }
    });
  }

  // ---------- boot ----------
  window.addEventListener("hashchange", route);
  window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("brand-title").textContent = DATA.meta.title;
    wireToolbar();
    route();
  });
})();
