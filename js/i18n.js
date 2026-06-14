/*
 * Lightweight i18n for the UI chrome (English / 简体中文).
 * Problem content (statements/solutions) stays in its source language;
 * this only translates the interface. Choice persists in localStorage.
 */
(function () {
  const LANG_KEY = "qt_lang";

  const DICT = {
    en: {
      "brand.title": "Quant Interview Trainer",
      "nav.dashboard": "Dashboard",
      "nav.browse": "Browse",
      "nav.list": "My List",
      "nav.leaderboard": "Leaderboard",
      "tool.export": "Export",
      "tool.import": "Import",
      "tool.reset": "Reset",
      "tool.export.title": "Download your progress",
      "tool.import.title": "Load progress from a file",
      "tool.reset.title": "Erase all progress",
      "lang.title": "切换中文",
      "theme.toDark": "Switch to dark mode",
      "theme.toLight": "Switch to light mode",

      "auth.signin": "Sign in",
      "auth.signout": "Sign out",
      "auth.signinGoogle": "Sign in with Google",
      "auth.signingIn": "Signing in…",
      "auth.notConfigured": "Sign-in isn't set up yet.",

      "status.unseen": "Not started",
      "status.attempting": "Attempting",
      "status.solved": "Solved",
      "status.review": "Review",
      "diff.easy": "Easy",
      "diff.medium": "Medium",
      "diff.hard": "Hard",

      "dash.title": "Your dashboard",
      "dash.subtitle": "Tracking progress through {source}. Your progress is saved in this browser.",
      "dash.solved": "Solved",
      "dash.attempting": "Attempting",
      "dash.toReview": "To review",
      "dash.starred": "Starred",
      "dash.streak": "Day streak",
      "dash.overall": "Overall progress",
      "dash.overallMeta": "{solved} / {total} solved · {available} with full solutions",
      "dash.pickUp": "Pick up where you left off",
      "dash.allCaught": "All caught up — nice. Browse a chapter to keep going.",
      "dash.chapters": "Chapters",
      "dash.chapter": "Chapter {num} · {title}",
      "dash.solvableNow": "{n} solvable now",
      "dash.comingSoon": "{n} coming soon",
      "dash.flaggedReview": "{n} flagged for review",

      "browse.title": "Browse all problems",
      "browse.search": "Search problems, tags…",
      "browse.difficulty": "Difficulty:",
      "browse.status": "Status:",
      "browse.starredOnly": "★ Starred only",
      "browse.solvableOnly": "Solvable only",
      "browse.count": "{n} problem",
      "browse.countPlural": "{n} problems",
      "browse.noMatches": "No matches.",

      "list.title": "My List",
      "list.subtitle": "Your starred problems and anything flagged for review — your personal study set.",
      "list.starred": "Starred",
      "list.review": "Flagged for review",
      "list.emptyStar": "No starred problems yet. Tap the ☆ on any problem to save it here.",
      "list.emptyReview": "Nothing flagged for review.",

      "topic.notFound": "Topic not found.",
      "prob.notFound": "Problem not found.",
      "prob.problem": "Problem",
      "prob.showHint": "💡 Show hint",
      "prob.showSolution": "🔑 Show solution",
      "prob.keyIdea": "Key idea / takeaway",
      "prob.yourNotes": "Your notes",
      "prob.notesPlaceholder": "Jot down your approach, where you got stuck, the trick to remember…",
      "prob.saved": "Saved ✓",
      "prob.markAs": "Mark as:",
      "prob.scaffolded": "📋 This problem is scaffolded from the book's table of contents but not transcribed yet.",
      "prob.belongsTo": "It belongs to",

      "forum.title": "Discussion",
      "forum.guidelines": "友好交流，文明用语 · Be kind and constructive. Share your reasoning, not just answers. No spam, harassment, or hate.",
      "forum.placeholder": "Share how you approached this problem…",
      "forum.post": "Post",
      "forum.posting": "Posting…",
      "forum.signinPrompt": "Sign in to join the discussion and share your solution.",
      "forum.empty": "No comments yet — be the first to share your approach.",
      "forum.delete": "Delete",
      "forum.report": "Report",
      "forum.reported": "Reported. Thanks for keeping things civil.",
      "forum.confirmDelete": "Delete this comment?",
      "forum.loading": "Loading discussion…",
      "forum.notConfigured": "Discussion is coming soon — sign-in and comments need to be configured first.",
      "forum.tooLong": "Comment is too long (max 4000 characters).",

      "lb.title": "Leaderboard",
      "lb.subtitle": "Who's grinding the most problems. Sign in to appear here — your solved count syncs when you mark problems solved.",
      "lb.rank": "Rank",
      "lb.user": "User",
      "lb.solved": "Solved",
      "lb.you": "you",
      "lb.empty": "No one's on the board yet. Be the first — sign in and start solving.",
      "lb.loading": "Loading leaderboard…",
      "lb.signinPrompt": "Sign in to join the leaderboard and track your rank.",
      "lb.notConfigured": "Leaderboard is coming soon — it needs sign-in to be configured first.",

      "common.dashboard": "Dashboard",
      "common.soon": "coming soon"
    },

    zh: {
      "brand.title": "量化面试训练营",
      "nav.dashboard": "总览",
      "nav.browse": "题库",
      "nav.list": "我的清单",
      "nav.leaderboard": "排行榜",
      "tool.export": "导出",
      "tool.import": "导入",
      "tool.reset": "重置",
      "tool.export.title": "下载你的进度",
      "tool.import.title": "从文件载入进度",
      "tool.reset.title": "清除全部进度",
      "lang.title": "Switch to English",
      "theme.toDark": "切换到深色模式",
      "theme.toLight": "切换到浅色模式",

      "auth.signin": "登录",
      "auth.signout": "退出登录",
      "auth.signinGoogle": "使用 Google 登录",
      "auth.signingIn": "登录中…",
      "auth.notConfigured": "登录功能尚未配置。",

      "status.unseen": "未开始",
      "status.attempting": "尝试中",
      "status.solved": "已解决",
      "status.review": "待复习",
      "diff.easy": "简单",
      "diff.medium": "中等",
      "diff.hard": "困难",

      "dash.title": "我的总览",
      "dash.subtitle": "正在学习《{source}》。你的进度保存在本浏览器中。",
      "dash.solved": "已解决",
      "dash.attempting": "尝试中",
      "dash.toReview": "待复习",
      "dash.starred": "已收藏",
      "dash.streak": "连续天数",
      "dash.overall": "总体进度",
      "dash.overallMeta": "已解决 {solved} / {total} 题 · {available} 题含完整解答",
      "dash.pickUp": "继续上次的进度",
      "dash.allCaught": "全部完成 —— 很棒！浏览任意章节继续练习。",
      "dash.chapters": "章节",
      "dash.chapter": "第 {num} 章 · {title}",
      "dash.solvableNow": "{n} 题可练习",
      "dash.comingSoon": "{n} 题即将上线",
      "dash.flaggedReview": "{n} 题待复习",

      "browse.title": "浏览全部题目",
      "browse.search": "搜索题目、标签…",
      "browse.difficulty": "难度：",
      "browse.status": "状态：",
      "browse.starredOnly": "★ 仅收藏",
      "browse.solvableOnly": "仅可练习",
      "browse.count": "{n} 题",
      "browse.countPlural": "{n} 题",
      "browse.noMatches": "没有匹配的题目。",

      "list.title": "我的清单",
      "list.subtitle": "你收藏的题目以及标记待复习的题目 —— 你的专属复习集。",
      "list.starred": "已收藏",
      "list.review": "待复习",
      "list.emptyStar": "还没有收藏的题目。点击任意题目的 ☆ 即可保存到这里。",
      "list.emptyReview": "没有标记待复习的题目。",

      "topic.notFound": "未找到该专题。",
      "prob.notFound": "未找到该题目。",
      "prob.problem": "题目",
      "prob.showHint": "💡 显示提示",
      "prob.showSolution": "🔑 显示解答",
      "prob.keyIdea": "核心思路 / 要点",
      "prob.yourNotes": "我的笔记",
      "prob.notesPlaceholder": "记下你的思路、卡住的地方、需要记住的技巧…",
      "prob.saved": "已保存 ✓",
      "prob.markAs": "标记为：",
      "prob.scaffolded": "📋 本题已从书的目录中列出，但尚未录入内容。",
      "prob.belongsTo": "归属于",

      "forum.title": "讨论区",
      "forum.guidelines": "友好交流，文明用语 · 分享你的推理过程，而不只是答案。禁止灌水、骚扰与仇恨言论。",
      "forum.placeholder": "分享你是怎么解这道题的…",
      "forum.post": "发表",
      "forum.posting": "发表中…",
      "forum.signinPrompt": "登录后即可参与讨论、分享你的解法。",
      "forum.empty": "还没有评论 —— 来做第一个分享思路的人吧。",
      "forum.delete": "删除",
      "forum.report": "举报",
      "forum.reported": "已举报，感谢你维护友好氛围。",
      "forum.confirmDelete": "确定删除这条评论吗？",
      "forum.loading": "正在加载讨论…",
      "forum.notConfigured": "讨论功能即将上线 —— 需要先配置登录与评论后端。",
      "forum.tooLong": "评论过长（最多 4000 字）。",

      "lb.title": "排行榜",
      "lb.subtitle": "看看谁刷的题最多。登录后即可上榜 —— 你标记「已解决」时，已解决题数会自动同步。",
      "lb.rank": "排名",
      "lb.user": "用户",
      "lb.solved": "已解决",
      "lb.you": "你",
      "lb.empty": "榜单还没有人。来做第一个吧 —— 登录后开始刷题。",
      "lb.loading": "正在加载排行榜…",
      "lb.signinPrompt": "登录后即可上榜并查看你的排名。",
      "lb.notConfigured": "排行榜即将上线 —— 需要先配置登录功能。",

      "common.dashboard": "总览",
      "common.soon": "即将上线"
    }
  };

  function detect() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "en" || saved === "zh") return saved;
    } catch (e) {}
    const nav = (navigator.language || "").toLowerCase();
    return nav.startsWith("zh") ? "zh" : "en";
  }

  const listeners = [];

  const I18n = {
    lang: detect(),
    LANGS: ["en", "zh"],

    t(key, vars) {
      const table = DICT[this.lang] || DICT.en;
      let s = table[key];
      if (s == null) s = DICT.en[key];
      if (s == null) return key;
      if (vars) {
        s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
      }
      return s;
    },

    set(lang) {
      if (lang !== "en" && lang !== "zh") return;
      this.lang = lang;
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
      document.documentElement.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
      listeners.forEach((cb) => { try { cb(lang); } catch (e) {} });
    },

    toggle() {
      this.set(this.lang === "en" ? "zh" : "en");
    },

    onChange(cb) { listeners.push(cb); }
  };

  document.documentElement.setAttribute("lang", I18n.lang === "zh" ? "zh-CN" : "en");
  window.I18n = I18n;
})();
