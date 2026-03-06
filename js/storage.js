// YTArchive - Storage Layer (LocalStorage)
const DB = {
  KEYS: {
    USERS:      'yta_users',
    SESSION:    'yta_session',
    VIDEOS:     'yta_videos',
    MEMOS:      'yta_memos',
    TIMESTAMPS: 'yta_timestamps',
    THEMES:     'yta_themes',
    POSTS:      'yta_posts',
    COMMENTS:   'yta_comments',
  },

  _get(key, defaultVal = []) {
    try { return JSON.parse(localStorage.getItem(key)) ?? defaultVal; }
    catch { return defaultVal; }
  },
  _set(key, data) { localStorage.setItem(key, JSON.stringify(data)); },

  uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); },
  now() { return new Date().toISOString(); },

  // ── Users ──────────────────────────────────────
  getUsers()           { return this._get(this.KEYS.USERS); },
  saveUsers(u)         { this._set(this.KEYS.USERS, u); },
  getUserById(id)      { return this.getUsers().find(u => u.id === id); },
  getUserByEmail(e)    { return this.getUsers().find(u => u.email === e); },

  // ── Session ────────────────────────────────────
  getSession()         { return this._get(this.KEYS.SESSION, null); },
  setSession(s)        { this._set(this.KEYS.SESSION, s); },
  clearSession()       { localStorage.removeItem(this.KEYS.SESSION); },

  // ── Videos ─────────────────────────────────────
  getVideos(userId = null) {
    const all = this._get(this.KEYS.VIDEOS).filter(v => !v.deletedAt);
    return userId ? all.filter(v => v.userId === userId) : all;
  },
  getPublicVideos()    { return this._get(this.KEYS.VIDEOS).filter(v => !v.deletedAt && v.isPublic); },
  getVideoById(id)     { return this._get(this.KEYS.VIDEOS).find(v => v.id === id && !v.deletedAt); },
  addVideo(video) {
    const list = this._get(this.KEYS.VIDEOS);
    const v = { ...video, id: this.uid(), createdAt: this.now(), deletedAt: null };
    list.push(v);
    this._set(this.KEYS.VIDEOS, list);
    return v;
  },
  updateVideo(id, data) {
    const list = this._get(this.KEYS.VIDEOS);
    const i = list.findIndex(v => v.id === id);
    if (i !== -1) { list[i] = { ...list[i], ...data, updatedAt: this.now() }; this._set(this.KEYS.VIDEOS, list); }
    return list[i];
  },
  deleteVideo(id) {
    const list = this._get(this.KEYS.VIDEOS);
    const i = list.findIndex(v => v.id === id);
    if (i !== -1) { list[i].deletedAt = this.now(); this._set(this.KEYS.VIDEOS, list); }
  },

  // ── Memos ──────────────────────────────────────
  getMemos(videoId) { return this._get(this.KEYS.MEMOS).filter(m => m.videoId === videoId && !m.deletedAt); },
  addMemo(memo) {
    const list = this._get(this.KEYS.MEMOS);
    const m = { ...memo, id: this.uid(), createdAt: this.now(), updatedAt: this.now(), deletedAt: null };
    list.push(m); this._set(this.KEYS.MEMOS, list); return m;
  },
  updateMemo(id, content) {
    const list = this._get(this.KEYS.MEMOS);
    const i = list.findIndex(m => m.id === id);
    if (i !== -1) { list[i].content = content; list[i].updatedAt = this.now(); this._set(this.KEYS.MEMOS, list); }
  },
  deleteMemo(id) {
    const list = this._get(this.KEYS.MEMOS);
    const i = list.findIndex(m => m.id === id);
    if (i !== -1) { list[i].deletedAt = this.now(); this._set(this.KEYS.MEMOS, list); }
  },

  // ── Timestamps ─────────────────────────────────
  getTimestamps(videoId) {
    return this._get(this.KEYS.TIMESTAMPS)
      .filter(t => t.videoId === videoId && !t.deletedAt)
      .sort((a, b) => a.seconds - b.seconds);
  },
  addTimestamp(ts) {
    const list = this._get(this.KEYS.TIMESTAMPS);
    const t = { ...ts, id: this.uid(), createdAt: this.now(), deletedAt: null };
    list.push(t); this._set(this.KEYS.TIMESTAMPS, list); return t;
  },
  deleteTimestamp(id) {
    const list = this._get(this.KEYS.TIMESTAMPS);
    const i = list.findIndex(t => t.id === id);
    if (i !== -1) { list[i].deletedAt = this.now(); this._set(this.KEYS.TIMESTAMPS, list); }
  },

  // ── Themes ─────────────────────────────────────
  getThemes(userId)    { return this._get(this.KEYS.THEMES).filter(t => t.userId === userId); },
  getThemeById(id)     { return this._get(this.KEYS.THEMES).find(t => t.id === id); },
  addTheme(theme) {
    const list = this._get(this.KEYS.THEMES);
    const t = { ...theme, id: this.uid(), createdAt: this.now() };
    list.push(t); this._set(this.KEYS.THEMES, list); return t;
  },
  updateTheme(id, data) {
    const list = this._get(this.KEYS.THEMES);
    const i = list.findIndex(t => t.id === id);
    if (i !== -1) { list[i] = { ...list[i], ...data }; this._set(this.KEYS.THEMES, list); }
  },
  deleteTheme(id)      { this._set(this.KEYS.THEMES, this._get(this.KEYS.THEMES).filter(t => t.id !== id)); },

  // ── Posts ──────────────────────────────────────
  getPosts() {
    return this._get(this.KEYS.POSTS).filter(p => !p.deletedAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getPostById(id)      { return this._get(this.KEYS.POSTS).find(p => p.id === id && !p.deletedAt); },
  getPostsByUser(uid)  { return this.getPosts().filter(p => p.userId === uid); },
  getBookmarkedPosts(uid) { return this.getPosts().filter(p => (p.bookmarks || []).includes(uid)); },
  addPost(post) {
    const list = this._get(this.KEYS.POSTS);
    const p = { ...post, id: this.uid(), likes: [], bookmarks: [], createdAt: this.now(), deletedAt: null };
    list.push(p); this._set(this.KEYS.POSTS, list); return p;
  },
  updatePost(id, data) {
    const list = this._get(this.KEYS.POSTS);
    const i = list.findIndex(p => p.id === id);
    if (i !== -1) { list[i] = { ...list[i], ...data, updatedAt: this.now() }; this._set(this.KEYS.POSTS, list); }
  },
  deletePost(id) {
    const list = this._get(this.KEYS.POSTS);
    const i = list.findIndex(p => p.id === id);
    if (i !== -1) { list[i].deletedAt = this.now(); this._set(this.KEYS.POSTS, list); }
  },
  toggleLike(postId, userId) {
    const list = this._get(this.KEYS.POSTS);
    const i = list.findIndex(p => p.id === postId);
    if (i === -1) return null;
    const idx = list[i].likes.indexOf(userId);
    if (idx === -1) list[i].likes.push(userId);
    else list[i].likes.splice(idx, 1);
    this._set(this.KEYS.POSTS, list); return list[i];
  },
  toggleBookmark(postId, userId) {
    const list = this._get(this.KEYS.POSTS);
    const i = list.findIndex(p => p.id === postId);
    if (i === -1) return null;
    const idx = (list[i].bookmarks || []).indexOf(userId);
    if (idx === -1) list[i].bookmarks.push(userId);
    else list[i].bookmarks.splice(idx, 1);
    this._set(this.KEYS.POSTS, list); return list[i];
  },

  // ── Comments ───────────────────────────────────
  getComments(postId) {
    return this._get(this.KEYS.COMMENTS)
      .filter(c => c.postId === postId && !c.deletedAt)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  },
  addComment(comment) {
    const list = this._get(this.KEYS.COMMENTS);
    const c = { ...comment, id: this.uid(), createdAt: this.now(), deletedAt: null };
    list.push(c); this._set(this.KEYS.COMMENTS, list); return c;
  },
  updateComment(id, content) {
    const list = this._get(this.KEYS.COMMENTS);
    const i = list.findIndex(c => c.id === id);
    if (i !== -1) { list[i].content = content; list[i].updatedAt = this.now(); this._set(this.KEYS.COMMENTS, list); }
  },
  deleteComment(id) {
    const list = this._get(this.KEYS.COMMENTS);
    const i = list.findIndex(c => c.id === id);
    if (i !== -1) { list[i].deletedAt = this.now(); this._set(this.KEYS.COMMENTS, list); }
  },

  // ── Login Attempt Guard ────────────────────────
  getFailCount(email)       { return parseInt(localStorage.getItem('yta_fc_' + email) || '0'); },
  setFailCount(email, n)    { localStorage.setItem('yta_fc_' + email, n); },
  getLockUntil(email)       { return parseInt(localStorage.getItem('yta_lk_' + email) || '0'); },
  setLockUntil(email, t)    { localStorage.setItem('yta_lk_' + email, t); },
  clearLoginAttempts(email) {
    localStorage.removeItem('yta_fc_' + email);
    localStorage.removeItem('yta_lk_' + email);
  },
};
