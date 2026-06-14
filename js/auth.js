/*
 * Authentication (Google sign-in via Firebase Auth, compat SDK).
 * Degrades gracefully: if FIREBASE_CONFIG is null or the SDK didn't load,
 * Auth.enabled stays false and the UI shows a "not set up yet" state.
 */
(function () {
  const t = (k, v) => (window.I18n ? window.I18n.t(k, v) : k);

  const listeners = [];
  const Auth = {
    enabled: false,
    ready: false,
    user: null, // { uid, name, photo, email }

    onChange(cb) { listeners.push(cb); if (this.ready) cb(this.user); },

    _emit() { listeners.forEach((cb) => { try { cb(this.user); } catch (e) {} }); },

    async signIn() {
      if (!this.enabled) { alert(t("auth.notConfigured")); return; }
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        await firebase.auth().signInWithPopup(provider);
      } catch (e) {
        console.warn("Sign-in failed:", e);
      }
    },

    async signOut() {
      if (!this.enabled) return;
      try { await firebase.auth().signOut(); } catch (e) {}
    },

    init() {
      const cfg = window.FIREBASE_CONFIG;
      if (!cfg || typeof firebase === "undefined") {
        this.enabled = false;
        this.ready = true;
        this._emit();
        return;
      }
      try {
        if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(cfg);
        this.enabled = true;
        firebase.auth().onAuthStateChanged((u) => {
          this.user = u
            ? { uid: u.uid, name: u.displayName || "Anonymous", photo: u.photoURL || "", email: u.email || "" }
            : null;
          this.ready = true;
          this._emit();
        });
      } catch (e) {
        console.warn("Firebase init failed:", e);
        this.enabled = false;
        this.ready = true;
        this._emit();
      }
    }
  };

  // ---- toolbar UI ----
  function renderSlot(slot) {
    if (!slot) return;
    if (!Auth.enabled) {
      slot.innerHTML = `<button class="tool-btn" id="auth-btn" title="${t("auth.notConfigured")}" disabled style="opacity:.55;cursor:not-allowed;">${t("auth.signin")}</button>`;
      return;
    }
    if (Auth.user) {
      const u = Auth.user;
      const avatar = u.photo
        ? `<img class="auth-avatar" src="${u.photo}" alt="" referrerpolicy="no-referrer">`
        : `<span class="auth-avatar auth-avatar-fallback">${(u.name[0] || "?").toUpperCase()}</span>`;
      slot.innerHTML = `
        <span class="auth-user">${avatar}<span class="auth-name">${escapeHtml(u.name)}</span></span>
        <button class="tool-btn" id="auth-btn">${t("auth.signout")}</button>`;
      slot.querySelector("#auth-btn").addEventListener("click", () => Auth.signOut());
    } else {
      slot.innerHTML = `<button class="tool-btn auth-signin" id="auth-btn">${t("auth.signin")}</button>`;
      slot.querySelector("#auth-btn").addEventListener("click", () => Auth.signIn());
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  Auth.renderSlot = renderSlot;
  window.Auth = Auth;
})();
