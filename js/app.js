// YTArchive - Common Utilities

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = 9999;
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `toast align-items-center text-white bg-${type} border-0`;
  el.setAttribute('role', 'alert');
  el.innerHTML = `<div class="d-flex">
    <div class="toast-body">${escapeHtml(message)}</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
  </div>`;
  container.appendChild(el);
  const t = new bootstrap.Toast(el, { delay: 3000 });
  t.show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────
function showConfirm(message, onConfirm, confirmLabel = '삭제', type = 'danger') {
  let modal = document.getElementById('_confirmModal');
  if (!modal) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal fade" id="_confirmModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-sm">
          <div class="modal-content rounded-3">
            <div class="modal-body p-4 text-center">
              <p class="mb-0 fw-semibold" id="_confirmMsg"></p>
            </div>
            <div class="modal-footer border-0 justify-content-center gap-2 pt-0 pb-3">
              <button class="btn btn-secondary btn-sm px-4" data-bs-dismiss="modal">취소</button>
              <button class="btn btn-sm px-4" id="_confirmOk"></button>
            </div>
          </div>
        </div>
      </div>`);
    modal = document.getElementById('_confirmModal');
  }
  document.getElementById('_confirmMsg').textContent = message;
  const okBtn = document.getElementById('_confirmOk');
  okBtn.textContent = confirmLabel;
  okBtn.className = `btn btn-${type} btn-sm px-4`;
  const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
  const clone = okBtn.cloneNode(true);
  okBtn.parentNode.replaceChild(clone, okBtn);
  clone.addEventListener('click', () => { bsModal.hide(); onConfirm(); });
  bsModal.show();
}

// ── XSS Guard ─────────────────────────────────────────────────────────────────
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── YouTube Utilities ─────────────────────────────────────────────────────────
const YTUtil = {
  extractId(url) {
    const m = url.match(
      /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );
    return m ? m[1] : null;
  },

  isValid(url) { return !!this.extractId(url); },

  thumb(videoId) { return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`; },

  embedUrl(videoId) { return `https://www.youtube.com/embed/${videoId}`; },

  deepLink(videoId, seconds) { return `https://youtu.be/${videoId}?t=${seconds}`; },

  async fetchMeta(url) {
    const videoId = this.extractId(url);
    if (!videoId) throw new Error('유효하지 않은 유튜브 URL입니다.');
    try {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      return { videoId, title: data.title, channel: data.author_name, thumbnail: this.thumb(videoId) };
    } catch {
      return { videoId, title: '제목을 불러올 수 없음', channel: '채널 정보 없음', thumbnail: this.thumb(videoId) };
    }
  },
};

// ── Time Utilities ────────────────────────────────────────────────────────────
function timeToSeconds(str) {
  const parts = str.split(':').map(Number);
  if (parts.some(isNaN) || parts.length < 2 || parts.length > 3) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

function secondsToTime(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function formatRelative(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000), min = Math.floor(sec / 60),
        hr  = Math.floor(min / 60),  day = Math.floor(hr / 24);
  if (sec < 60)  return '방금 전';
  if (min < 60)  return `${min}분 전`;
  if (hr  < 24)  return `${hr}시간 전`;
  if (day < 7)   return `${day}일 전`;
  return formatDate(iso);
}

// ── Password Strength ─────────────────────────────────────────────────────────
function pwStrength(pw) {
  let s = 0;
  if (pw.length >= 8)  s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { label: '약함',  color: 'danger',  pct: 33  };
  if (s <= 3) return { label: '보통',  color: 'warning', pct: 66  };
  return         { label: '강함',  color: 'success', pct: 100 };
}

// ── Header Init ───────────────────────────────────────────────────────────────
function initHeader(session) {
  const gNav = document.getElementById('guestNav');
  const mNav = document.getElementById('memberNav');
  const nick = document.getElementById('userNickname');
  if (session) {
    gNav?.classList.add('d-none');
    mNav?.classList.remove('d-none');
    if (nick) nick.textContent = session.nickname;
  } else {
    gNav?.classList.remove('d-none');
    mNav?.classList.add('d-none');
  }
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function showSpinner() {
  let el = document.getElementById('_spinner');
  if (!el) {
    el = document.createElement('div');
    el.id = '_spinner';
    el.className = 'spinner-overlay';
    el.innerHTML = '<div class="spinner-border text-primary" style="width:3rem;height:3rem;"></div>';
    document.body.appendChild(el);
  }
  el.style.display = 'flex';
}
function hideSpinner() {
  const el = document.getElementById('_spinner');
  if (el) el.style.display = 'none';
}

// ── URL Query Params ──────────────────────────────────────────────────────────
function getParam(key) { return new URLSearchParams(window.location.search).get(key); }

// ── Theme Color Palette ───────────────────────────────────────────────────────
const THEME_COLORS = [
  '#F5AFAF','#e89090','#d46868','#c04040','#F9DFDF',
  '#FBEFEF','#f4a0c0','#e87878','#c87878','#a05050',
];

function colorPicker(selected, name) {
  return THEME_COLORS.map(c =>
    `<label class="me-1" style="cursor:pointer">
      <input type="radio" name="${name}" value="${c}" class="d-none" ${c === selected ? 'checked' : ''}>
      <span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:${c};
        border:3px solid ${c === selected ? '#000' : 'transparent'};"></span>
    </label>`
  ).join('');
}
