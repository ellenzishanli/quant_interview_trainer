/*
 * Leaderboard, backed by Firestore (compat SDK).
 * Each signed-in user has a doc at users/{uid} = { name, photo, solved, updatedAt }.
 * `publish(solved)` upserts the current user's solved count; `render(el)` lists
 * the top solvers. Degrades gracefully when Firebase isn't configured.
 */
(function () {
  const t = (k, v) => (window.I18n ? window.I18n.t(k, v) : k);
  const TOP_N = 100;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function avatar(name, photo) {
    return photo
      ? `<img class="lb-avatar" src="${esc(photo)}" alt="" referrerpolicy="no-referrer">`
      : `<span class="lb-avatar lb-avatar-fallback">${esc((String(name)[0] || "?").toUpperCase())}</span>`;
  }

  let lastPublished = -1;

  const Leaderboard = {
    // Upsert the signed-in user's solved count (skips redundant writes).
    async publish(solved) {
      const Auth = window.Auth;
      if (!Auth || !Auth.enabled || !Auth.user) return;
      if (solved === lastPublished) return;
      lastPublished = solved;
      try {
        const u = Auth.user;
        await firebase.firestore().collection("users").doc(u.uid).set({
          name: u.name,
          photo: u.photo || "",
          solved: solved,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      } catch (e) {
        console.warn("Leaderboard publish failed:", e);
        lastPublished = -1; // allow retry
      }
    },

    // Reset the publish cache (e.g. on sign-out).
    resetCache() { lastPublished = -1; },

    render(container) {
      const Auth = window.Auth;
      const enabled = Auth && Auth.enabled;
      container.innerHTML = enabled
        ? `<p class="subtle">${t("lb.loading")}</p>`
        : `<p class="subtle">${t("lb.notConfigured")}</p>`;
      if (!enabled) return;

      const me = Auth.user;
      firebase.firestore().collection("users")
        .orderBy("solved", "desc").limit(TOP_N).get()
        .then((snap) => {
          const rows = snap.docs.filter((d) => (d.data().solved || 0) > 0);
          if (!rows.length) {
            container.innerHTML = `<p class="subtle">${t("lb.empty")}</p>`;
            return;
          }
          const body = rows.map((d, i) => {
            const u = d.data();
            const mine = me && me.uid === d.id;
            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : (i + 1);
            return `<tr class="${mine ? "lb-me" : ""}">
              <td class="lb-rank">${medal}</td>
              <td class="lb-userc">${avatar(u.name, u.photo)}<span class="lb-name">${esc(u.name || "Anonymous")}</span>${mine ? `<span class="lb-youtag">${t("lb.you")}</span>` : ""}</td>
              <td class="lb-solved">${u.solved || 0}</td>
            </tr>`;
          }).join("");
          container.innerHTML = `
            <table class="lb-table">
              <thead><tr>
                <th class="lb-rank">${t("lb.rank")}</th>
                <th>${t("lb.user")}</th>
                <th class="lb-solved">${t("lb.solved")}</th>
              </tr></thead>
              <tbody>${body}</tbody>
            </table>`;
        })
        .catch((err) => {
          console.warn("Leaderboard load failed:", err);
          container.innerHTML = `<p class="subtle">${t("lb.notConfigured")}</p>`;
        });
    }
  };

  window.Leaderboard = Leaderboard;
})();
