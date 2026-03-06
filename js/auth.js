// YTArchive - Authentication
const Auth = {

  async _hash(password) {
    const enc = new TextEncoder();
    const buf = await crypto.subtle.digest('SHA-256', enc.encode(password + '__yta__'));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  },

  async register(email, nickname, password) {
    if (!email || !nickname || !password)      throw new Error('모든 필드를 입력해주세요.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('올바른 이메일 형식이 아닙니다.');
    if (password.length < 8)                   throw new Error('비밀번호는 8자 이상이어야 합니다.');
    if (nickname.length < 2 || nickname.length > 12) throw new Error('닉네임은 2~12자이어야 합니다.');
    if (DB.getUserByEmail(email))              throw new Error('이미 사용 중인 이메일입니다.');

    const users = DB.getUsers();
    const user = { id: DB.uid(), email, nickname, password: await this._hash(password), createdAt: DB.now() };
    users.push(user);
    DB.saveUsers(users);
    return user;
  },

  async login(email, password, remember = false) {
    // Lock check
    const lockUntil = DB.getLockUntil(email);
    if (lockUntil > Date.now()) {
      const mins = Math.ceil((lockUntil - Date.now()) / 60000);
      throw new Error(`계정이 잠겨 있습니다. ${mins}분 후 다시 시도해 주세요.`);
    }

    const user = DB.getUserByEmail(email);
    const hashed = await this._hash(password);

    if (!user || user.password !== hashed) {
      const count = DB.getFailCount(email) + 1;
      DB.setFailCount(email, count);
      if (count >= 5) {
        DB.setLockUntil(email, Date.now() + 30 * 60 * 1000);
        throw new Error('5회 실패로 계정이 30분간 잠겼습니다.');
      }
      throw new Error(`이메일 또는 비밀번호가 올바르지 않습니다. (${count}/5회)`);
    }

    DB.clearLoginAttempts(email);

    const session = {
      userId:   user.id,
      email:    user.email,
      nickname: user.nickname,
      expiresAt: remember
        ? Date.now() + 30 * 24 * 60 * 60 * 1000  // 30일
        : Date.now() + 24 * 60 * 60 * 1000,       // 24시간
    };
    DB.setSession(session);
    return session;
  },

  logout() {
    DB.clearSession();
    window.location.href = 'index.html';
  },

  getSession() {
    const s = DB.getSession();
    if (!s) return null;
    if (s.expiresAt < Date.now()) { DB.clearSession(); return null; }
    return s;
  },

  requireAuth() {
    const s = this.getSession();
    if (!s) { window.location.href = 'login.html'; return null; }
    return s;
  },

  redirectIfAuth() {
    if (this.getSession()) window.location.href = 'dashboard.html';
  },
};
