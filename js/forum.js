/*
 * Per-problem discussion forum, backed by Firestore (compat SDK).
 * Data model:
 *   discussions/{problemId}/comments/{commentId}
 *     { uid, name, photo, text, createdAt }
 *   reports/{reportId}
 *     { problemId, commentId, byUid, createdAt }
 *
 * Degrades gracefully: if Auth isn't enabled, mount() renders a teaser.
 */
(function () {
  const t = (k, v) => (window.I18n ? window.I18n.t(k, v) : k);
  const MAX_LEN = 4000;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function fmtTime(ms) {
    if (!ms) return "";
    const d = new Date(ms);
    const diff = (Date.now() - ms) / 1000;
    if (diff < 60) return t("forum.title") && "just now";
    return d.toLocaleString(window.I18n && window.I18n.lang === "zh" ? "zh-CN" : "en-US",
      { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }
  function avatar(name, photo) {
    return photo
      ? `<img class="cm-avatar" src="${esc(photo)}" alt="" referrerpolicy="no-referrer">`
      : `<span class="cm-avatar cm-avatar-fallback">${esc((name[0] || "?").toUpperCase())}</span>`;
  }

  let activeUnsub = null;

  const Forum = {
    // Renders the whole discussion section into `container` for `problemId`.
    mount(container, problemId) {
      if (activeUnsub) { try { activeUnsub(); } catch (e) {} activeUnsub = null; }

      const Auth = window.Auth;
      const enabled = Auth && Auth.enabled;

      container.innerHTML = `
        <section class="block forum">
          <h3>${t("forum.title")}</h3>
          <div class="forum-guidelines">${t("forum.guidelines")}</div>
          <div class="forum-composer" id="forum-composer"></div>
          <div class="forum-list" id="forum-list">${enabled ? `<p class="subtle">${t("forum.loading")}</p>` : `<p class="subtle">${t("forum.notConfigured")}</p>`}</div>
        </section>`;

      if (!enabled) return;

      const composer = container.querySelector("#forum-composer");
      const list = container.querySelector("#forum-list");

      renderComposer(composer, problemId, list);

      // live comments
      const db = firebase.firestore();
      activeUnsub = db.collection("discussions").doc(problemId).collection("comments")
        .orderBy("createdAt", "asc")
        .onSnapshot(
          (snap) => {
            if (snap.empty) {
              list.innerHTML = `<p class="subtle">${t("forum.empty")}</p>`;
              return;
            }
            const me = window.Auth.user;
            list.innerHTML = snap.docs.map((doc) => {
              const c = doc.data();
              const ms = c.createdAt && c.createdAt.toMillis ? c.createdAt.toMillis() : null;
              const mine = me && me.uid === c.uid;
              return `<div class="cm" data-id="${doc.id}">
                <div class="cm-head">
                  ${avatar(c.name || "?", c.photo)}
                  <span class="cm-name">${esc(c.name || "Anonymous")}</span>
                  <span class="cm-time">${fmtTime(ms)}</span>
                </div>
                <div class="cm-body">${esc(c.text || "").replace(/\n/g, "<br>")}</div>
                <div class="cm-actions">
                  ${mine ? `<button class="cm-link cm-del" data-id="${doc.id}">${t("forum.delete")}</button>` : `<button class="cm-link cm-report" data-id="${doc.id}">${t("forum.report")}</button>`}
                </div>
              </div>`;
            }).join("");

            list.querySelectorAll(".cm-del").forEach((b) =>
              b.addEventListener("click", () => deleteComment(problemId, b.dataset.id)));
            list.querySelectorAll(".cm-report").forEach((b) =>
              b.addEventListener("click", () => reportComment(problemId, b.dataset.id, b)));
          },
          (err) => {
            console.warn("Discussion load failed:", err);
            list.innerHTML = `<p class="subtle">${t("forum.notConfigured")}</p>`;
          }
        );
    },

    unmount() {
      if (activeUnsub) { try { activeUnsub(); } catch (e) {} activeUnsub = null; }
    }
  };

  function renderComposer(composer, problemId, list) {
    const Auth = window.Auth;
    if (!Auth.user) {
      composer.innerHTML = `<div class="forum-signin">
        <span>${t("forum.signinPrompt")}</span>
        <button class="tool-btn auth-signin" id="forum-signin-btn">${t("auth.signinGoogle")}</button>
      </div>`;
      const btn = composer.querySelector("#forum-signin-btn");
      btn.addEventListener("click", () => Auth.signIn());
      return;
    }
    composer.innerHTML = `
      <textarea id="forum-text" class="forum-text" placeholder="${t("forum.placeholder")}" maxlength="${MAX_LEN}"></textarea>
      <div class="forum-composer-row">
        <button class="post-btn" id="forum-post">${t("forum.post")}</button>
      </div>`;
    const ta = composer.querySelector("#forum-text");
    const btn = composer.querySelector("#forum-post");
    btn.addEventListener("click", async () => {
      const text = ta.value.trim();
      if (!text) return;
      if (text.length > MAX_LEN) { alert(t("forum.tooLong")); return; }
      btn.disabled = true;
      btn.textContent = t("forum.posting");
      try {
        const u = Auth.user;
        await firebase.firestore()
          .collection("discussions").doc(problemId).collection("comments").add({
            uid: u.uid,
            name: u.name,
            photo: u.photo || "",
            text: text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        ta.value = "";
      } catch (e) {
        console.warn("Post failed:", e);
      } finally {
        btn.disabled = false;
        btn.textContent = t("forum.post");
      }
    });
  }

  async function deleteComment(problemId, commentId) {
    if (!confirm(t("forum.confirmDelete"))) return;
    try {
      await firebase.firestore()
        .collection("discussions").doc(problemId).collection("comments").doc(commentId).delete();
    } catch (e) { console.warn("Delete failed:", e); }
  }

  async function reportComment(problemId, commentId, btn) {
    try {
      const u = window.Auth.user;
      await firebase.firestore().collection("reports").add({
        problemId, commentId,
        byUid: u ? u.uid : null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      if (btn) { btn.textContent = "✓"; btn.disabled = true; }
      alert(t("forum.reported"));
    } catch (e) { console.warn("Report failed:", e); }
  }

  window.Forum = Forum;
})();
