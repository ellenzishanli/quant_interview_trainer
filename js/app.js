/* Quant Interview Trainer — main app (vanilla JS, hash-routed SPA). */
(function () {
  const DATA = window.QUANT_DATA;
  const Store = window.Store;
  const t = (k, v) => (window.I18n ? window.I18n.t(k, v) : k);

  // ---------- helpers ----------
  // status/difficulty meta: labels are resolved through i18n at render time.
  const STATUS_META = {
    unseen:     { key: "status.unseen",     short: "—",  cls: "st-unseen" },
    attempting: { key: "status.attempting", short: "◐",  cls: "st-attempting" },
    solved:     { key: "status.solved",      short: "✓",  cls: "st-solved" },
    review:     { key: "status.review",      short: "↻",  cls: "st-review" }
  };
  const DIFF_META = {
    easy:   { key: "diff.easy",   cls: "d-easy" },
    medium: { key: "diff.medium", cls: "d-medium" },
    hard:   { key: "diff.hard",   cls: "d-hard" }
  };

  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  // Render markdown + LaTeX. Math is extracted and KaTeX-rendered BEFORE markdown
  // runs, so currency like "\$100" (which markdown turns into a literal "$") is
  // never mistaken for a math delimiter.
  function md(s) {
    if (!s) return "";
    const store = [];
    function stash(tex, display) {
      const token = "XMATHX" + store.length + "XENDX";
      store.push({ tex: tex, display: display });
      return token;
    }
    s = s.replace(/(^|[^\\])\$\$([\s\S]+?)\$\$/g, (m, pre, tex) => pre + stash(tex, true));
    s = s.replace(/(^|[^\\])\$([^$\n]+?)\$/g, (m, pre, tex) => pre + stash(tex, false));

    let html = window.marked
      ? window.marked.parse(s)
      : "<p>" + esc(s).replace(/\n\n+/g, "</p><p>").replace(/\n/g, "<br>") + "</p>";

    html = html.replace(/XMATHX(\d+)XENDX/g, (m, i) => {
      const item = store[i];
      if (window.katex) {
        try {
          return window.katex.renderToString(item.tex, { displayMode: item.display, throwOnError: false });
        } catch (e) {
          return esc(item.tex);
        }
      }
      return (item.display ? "$$" : "$") + esc(item.tex) + (item.display ? "$$" : "$");
    });
    return html;
  }
  function typeset(el) {}

  // ---------- build a flat index of problems ----------
  const INDEX = [];
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
    return `<span class="badge ${m.cls}">${t(m.key)}</span>`;
  }
  function statusDot(id) {
    const st = Store.get(id).status;
    const m = STATUS_META[st];
    return `<span class="status-dot ${m.cls}" title="${t(m.key)}">${m.short}</span>`;
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
        <div class="stat-card"><div class="stat-num">${g.solved}</div><div class="stat-lbl">${t("dash.solved")}</div></div>
        <div class="stat-card"><div class="stat-num">${g.attempting}</div><div class="stat-lbl">${t("dash.attempting")}</div></div>
        <div class="stat-card"><div class="stat-num">${g.review}</div><div class="stat-lbl">${t("dash.toReview")}</div></div>
        <div class="stat-card"><div class="stat-num">${g.starred}</div><div class="stat-lbl">${t("dash.starred")}</div></div>
        <div class="stat-card accent"><div class="stat-num">${streak}🔥</div><div class="stat-lbl">${t("dash.streak")}</div></div>
      </div>`;

    const overall = `
      <div class="overall">
        <div class="overall-top"><span>${t("dash.overall")}</span><span>${t("dash.overallMeta", { solved: g.solved, total: g.total, available: g.available })}</span></div>
        ${progressBar(g.solved, g.total)}
        <div class="overall-pct">${pct}%</div>
      </div>`;

    const chapters = DATA.chapters
      .map((ch) => {
        const s = chapterStats(ch);
        const meta = [t("dash.solvableNow", { n: s.available })];
        if (s.available < s.total) meta.push(t("dash.comingSoon", { n: s.total - s.available }));
        if (s.review) meta.push(t("dash.flaggedReview", { n: s.review }));
        return `<a class="dash-chapter" href="#/topic/${encodeURIComponent(ch.topics[0].id)}">
          <div class="dash-ch-head"><b>${t("dash.chapter", { num: ch.num, title: esc(ch.title) })}</b><span>${s.solved}/${s.total}</span></div>
          <p class="dash-ch-blurb">${esc(ch.blurb)}</p>
          ${progressBar(s.solved, s.total)}
          <div class="dash-ch-meta">${meta.join(" · ")}</div>
        </a>`;
      })
      .join("");

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
        <h1>${t("dash.title")}</h1>
        <p class="subtle">${t("dash.subtitle", { source: "<i>" + esc(DATA.meta.source) + "</i>" })}</p>
        ${cards}
        ${overall}
        <h2>${t("dash.pickUp")}</h2>
        <div class="prob-list">${next || '<p class="subtle">' + t("dash.allCaught") + "</p>"}</div>
        <h2>${t("dash.chapters")}</h2>
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
        <span class="badge soon-badge">${t("common.soon")}</span>
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
    if (!found) { main.innerHTML = `<div class="view-pad"><p>${t("topic.notFound")}</p></div>`; return; }
    const { ch, tp } = found;
    const rows = tp.problems
      .map((pr) => problemRow(BY_ID[tp.id + ":" + slug(pr.title)]))
      .join("");
    main.innerHTML = `
      <div class="view-pad">
        <div class="breadcrumb"><a href="#/">${t("common.dashboard")}</a> › Ch ${ch.num} · ${esc(ch.title)}</div>
        <h1>${tp.id} ${esc(tp.title)}</h1>
        ${tp.note ? `<div class="topic-note">${md(tp.note)}</div>` : ""}
        <div class="prob-list">${rows}</div>
      </div>`;
    typeset(main);
  }

  function viewList() {
    const main = document.getElementById("main");
    const starred = INDEX.filter((e) => Store.get(e.id).starred);
    const review = INDEX.filter((e) => Store.get(e.id).status === "review");

    const starHtml = starred.length
      ? `<div class="prob-list">${starred.map(problemRow).join("")}</div>`
      : `<p class="subtle">${t("list.emptyStar")}</p>`;
    const reviewHtml = review.length
      ? `<div class="prob-list">${review.map(problemRow).join("")}</div>`
      : `<p class="subtle">${t("list.emptyReview")}</p>`;

    main.innerHTML = `
      <div class="view-pad">
        <h1>${t("list.title")}</h1>
        <p class="subtle">${t("list.subtitle")}</p>
        <h2>★ ${t("list.starred")} <span class="count-chip">${starred.length}</span></h2>
        ${starHtml}
        <h2>↻ ${t("list.review")} <span class="count-chip">${review.length}</span></h2>
        ${reviewHtml}
      </div>`;
    typeset(main);
  }

  function viewLeaderboard() {
    const main = document.getElementById("main");
    main.innerHTML = `
      <div class="view-pad">
        <h1>${t("lb.title")}</h1>
        <p class="subtle">${t("lb.subtitle")}</p>
        <div id="leaderboard-body"></div>
      </div>`;
    if (window.Leaderboard) window.Leaderboard.render(main.querySelector("#leaderboard-body"));
  }

  // publish the signed-in user's solved count for the leaderboard
  function publishMyStats() {
    if (window.Leaderboard) window.Leaderboard.publish(globalStats().solved);
  }

  function viewBrowse() {
    const main = document.getElementById("main");
    main.innerHTML = `
      <div class="view-pad">
        <h1>${t("browse.title")}</h1>
        <div class="filters">
          <input id="f-search" class="f-search" type="text" placeholder="${t("browse.search")}">
          <div class="f-group" id="f-diff">
            <span class="f-label">${t("browse.difficulty")}</span>
            <label><input type="checkbox" value="easy">${t("diff.easy")}</label>
            <label><input type="checkbox" value="medium">${t("diff.medium")}</label>
            <label><input type="checkbox" value="hard">${t("diff.hard")}</label>
          </div>
          <div class="f-group" id="f-status">
            <span class="f-label">${t("browse.status")}</span>
            <label><input type="checkbox" value="unseen">${t("status.unseen")}</label>
            <label><input type="checkbox" value="attempting">${t("status.attempting")}</label>
            <label><input type="checkbox" value="solved">${t("status.solved")}</label>
            <label><input type="checkbox" value="review">${t("status.review")}</label>
          </div>
          <label class="f-toggle"><input type="checkbox" id="f-star">${t("browse.starredOnly")}</label>
          <label class="f-toggle"><input type="checkbox" id="f-real" checked>${t("browse.solvableOnly")}</label>
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
      document.getElementById("browse-count").textContent =
        matches.length === 1 ? t("browse.count", { n: 1 }) : t("browse.countPlural", { n: matches.length });
      document.getElementById("browse-list").innerHTML = matches.map(problemRow).join("") || `<p class="subtle">${t("browse.noMatches")}</p>`;
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
    if (!e) { main.innerHTML = `<div class="view-pad"><p>${t("prob.notFound")}</p></div>`; return; }
    const pr = e.problem;
    const p = Store.get(id);

    const realList = INDEX;
    const pos = realList.findIndex((x) => x.id === id);
    const prev = pos > 0 ? realList[pos - 1] : null;
    const nextN = pos < realList.length - 1 ? realList[pos + 1] : null;

    if (!isReal(pr)) {
      main.innerHTML = `<div class="view-pad">
        <div class="breadcrumb"><a href="#/">${t("common.dashboard")}</a> › <a href="#/topic/${encodeURIComponent(e.topic.id)}">${e.topic.id} ${esc(e.topic.title)}</a></div>
        <h1>${esc(pr.title)}</h1>
        <div class="soon-panel">${t("prob.scaffolded")}<br>${t("prob.belongsTo")} <b>Ch ${e.chapter.num} · ${esc(e.topic.title)}</b>.</div>
        ${navButtons(prev, nextN)}
      </div>`;
      return;
    }

    const tags = (pr.tags || []).map((tg) => `<span class="tag">${esc(tg)}</span>`).join("");
    const statusBtns = Store.STATUSES.map((s) => {
      const m = STATUS_META[s];
      return `<button class="status-btn ${m.cls}${p.status === s ? " on" : ""}" data-status="${s}">${t(m.key)}</button>`;
    }).join("");

    main.innerHTML = `
      <div class="view-pad problem-view">
        <div class="breadcrumb"><a href="#/">${t("common.dashboard")}</a> › <a href="#/topic/${encodeURIComponent(e.topic.id)}">${e.topic.id} ${esc(e.topic.title)}</a></div>
        <div class="problem-head">
          <h1>${esc(pr.title)}</h1>
          <button id="star-btn" class="star-btn${p.starred ? " on" : ""}" title="Star">${p.starred ? "★" : "☆"}</button>
        </div>
        <div class="problem-meta">${diffBadge(pr.difficulty)} ${tags}</div>

        <div class="status-row"><span class="status-row-lbl">${t("prob.markAs")}</span>${statusBtns}</div>

        <section class="block statement">
          <h3>${t("prob.problem")}</h3>
          ${md(pr.statement)}
        </section>

        ${pr.hint ? `
        <details class="block reveal hint">
          <summary>${t("prob.showHint")}</summary>
          <div class="reveal-body">${md(pr.hint)}</div>
        </details>` : ""}

        <details class="block reveal solution">
          <summary>${t("prob.showSolution")}</summary>
          <div class="reveal-body">${md(pr.solution)}</div>
        </details>

        ${pr.keyIdea ? `
        <section class="block key-idea">
          <h3>${t("prob.keyIdea")}</h3>
          ${md(pr.keyIdea)}
        </section>` : ""}

        <section class="block notes">
          <h3>${t("prob.yourNotes")}</h3>
          <textarea id="notes" placeholder="${t("prob.notesPlaceholder")}">${esc(p.notes || "")}</textarea>
          <div class="notes-saved" id="notes-saved"></div>
        </section>

        <div id="discussion"></div>

        ${navButtons(prev, nextN)}
      </div>`;

    main.querySelectorAll(".status-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const newStatus = btn.dataset.status;
        const cur = Store.get(id).status;
        Store.set(id, { status: cur === newStatus ? "unseen" : newStatus });
        renderSidebar();
        publishMyStats();
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
    let tmr;
    notes.addEventListener("input", () => {
      clearTimeout(tmr);
      tmr = setTimeout(() => {
        Store.set(id, { notes: notes.value });
        const s = main.querySelector("#notes-saved");
        s.textContent = t("prob.saved");
        setTimeout(() => (s.textContent = ""), 1500);
      }, 500);
    });

    main.querySelectorAll(".block.statement, .reveal-body, .key-idea").forEach(typeset);
    main.querySelectorAll("details.reveal").forEach((d) =>
      d.addEventListener("toggle", () => { if (d.open) typeset(d); })
    );

    // discussion forum (no-op teaser if Firebase isn't configured)
    if (window.Forum) window.Forum.mount(main.querySelector("#discussion"), id);
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
    if (parts[0] === "list") return { name: "list" };
    if (parts[0] === "leaderboard") return { name: "leaderboard" };
    if (parts[0] === "topic") return { name: "topic", id: decodeURIComponent(parts[1] || "") };
    if (parts[0] === "problem") return { name: "problem", id: decodeURIComponent(parts[1] || "") };
    return { name: "dashboard" };
  }

  function route() {
    if (window.Forum) window.Forum.unmount();
    const r = parseHash();
    if (r.name === "browse") viewBrowse();
    else if (r.name === "list") viewList();
    else if (r.name === "leaderboard") viewLeaderboard();
    else if (r.name === "topic") viewTopic(r.id);
    else if (r.name === "problem") viewProblem(r.id);
    else viewDashboard();
    renderSidebar();
    document.querySelectorAll(".topnav a").forEach((a) => a.classList.remove("active"));
    const navId = r.name === "browse" ? "nav-browse" : r.name === "list" ? "nav-list"
      : r.name === "leaderboard" ? "nav-leaderboard" : "nav-dash";
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
        try { Store.importData(reader.result); route(); publishMyStats(); }
        catch (e) { alert("Could not read that file."); }
      };
      reader.readAsText(file);
    });
    document.getElementById("btn-reset").addEventListener("click", () => {
      if (confirm("Reset all progress and notes? This cannot be undone.")) { Store.reset(); route(); publishMyStats(); }
    });
  }

  // ---------- theme ----------
  function syncThemeButton() {
    const tt = document.documentElement.getAttribute("data-theme") || "dark";
    const btn = document.getElementById("btn-theme");
    if (!btn) return;
    btn.textContent = tt === "light" ? "🌙" : "☀️";
    btn.title = tt === "light" ? t("theme.toDark") : t("theme.toLight");
  }
  function wireTheme() {
    const btn = document.getElementById("btn-theme");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") || "dark";
      const next = cur === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("qt_theme", next); } catch (e) {}
      syncThemeButton();
    });
    syncThemeButton();
  }

  // ---------- language ----------
  function applyStaticI18n() {
    document.getElementById("brand-title").textContent = t("brand.title");
    document.getElementById("nav-dash").textContent = t("nav.dashboard");
    document.getElementById("nav-browse").textContent = t("nav.browse");
    document.getElementById("nav-list").textContent = t("nav.list");
    document.getElementById("btn-export").textContent = t("tool.export");
    document.getElementById("btn-export").title = t("tool.export.title");
    document.getElementById("btn-import").textContent = t("tool.import");
    document.getElementById("btn-import").title = t("tool.import.title");
    document.getElementById("btn-reset").textContent = t("tool.reset");
    document.getElementById("btn-reset").title = t("tool.reset.title");
    document.getElementById("btn-lang").title = t("lang.title");
    document.title = t("brand.title");
    syncThemeButton();
  }
  function wireLang() {
    const btn = document.getElementById("btn-lang");
    if (!btn || !window.I18n) return;
    btn.addEventListener("click", () => window.I18n.toggle());
    window.I18n.onChange(() => {
      applyStaticI18n();
      if (window.Auth) window.Auth.renderSlot(document.getElementById("auth-slot"));
      route();
    });
  }

  // ---------- auth ----------
  function wireAuth() {
    if (!window.Auth) return;
    const slot = document.getElementById("auth-slot");
    window.Auth.onChange((user) => {
      window.Auth.renderSlot(slot);
      if (user) publishMyStats();
      else if (window.Leaderboard) window.Leaderboard.resetCache();
      // refresh views that depend on sign-in state
      const r = parseHash().name;
      if (r === "problem" || r === "leaderboard") route();
    });
    window.Auth.init();
  }

  // ---------- boot ----------
  window.addEventListener("hashchange", route);
  window.addEventListener("DOMContentLoaded", () => {
    applyStaticI18n();
    wireTheme();
    wireLang();
    wireToolbar();
    wireAuth();
    route();
  });
})();
