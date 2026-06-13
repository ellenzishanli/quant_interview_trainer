/*
 * Progress storage — everything lives in the browser's localStorage.
 * No backend needed, so the site works offline and when deployed statically.
 */
(function () {
  const PROGRESS_KEY = "qt_progress_v1";
  const ACTIVITY_KEY = "qt_activity_v1";

  function load(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || {};
    } catch (e) {
      return {};
    }
  }
  function save(key, obj) {
    try {
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {
      console.warn("Could not save progress:", e);
    }
  }

  function todayStr() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  const Store = {
    STATUSES: ["unseen", "attempting", "solved", "review"],

    getAll() {
      return load(PROGRESS_KEY);
    },

    get(id) {
      const all = load(PROGRESS_KEY);
      return all[id] || { status: "unseen", starred: false, notes: "" };
    },

    set(id, patch) {
      const all = load(PROGRESS_KEY);
      const cur = all[id] || { status: "unseen", starred: false, notes: "" };
      all[id] = Object.assign({}, cur, patch, { updatedAt: Date.now() });
      save(PROGRESS_KEY, all);
      this.markActivity();
      return all[id];
    },

    // --- daily activity, used for streaks ---
    markActivity() {
      const act = load(ACTIVITY_KEY);
      act[todayStr()] = (act[todayStr()] || 0) + 1;
      save(ACTIVITY_KEY, act);
    },

    getActivity() {
      return load(ACTIVITY_KEY);
    },

    // current consecutive-day streak ending today (or yesterday)
    getStreak() {
      const act = load(ACTIVITY_KEY);
      let streak = 0;
      const d = new Date();
      // allow the streak to count if today not yet active but yesterday was
      if (!act[todayStr()]) d.setDate(d.getDate() - 1);
      for (;;) {
        const key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
        if (act[key]) {
          streak++;
          d.setDate(d.getDate() - 1);
        } else {
          break;
        }
      }
      return streak;
    },

    exportData() {
      return JSON.stringify({ progress: load(PROGRESS_KEY), activity: load(ACTIVITY_KEY) }, null, 2);
    },

    importData(json) {
      const data = JSON.parse(json);
      if (data.progress) save(PROGRESS_KEY, data.progress);
      if (data.activity) save(ACTIVITY_KEY, data.activity);
    },

    reset() {
      localStorage.removeItem(PROGRESS_KEY);
      localStorage.removeItem(ACTIVITY_KEY);
    }
  };

  window.Store = Store;
})();
