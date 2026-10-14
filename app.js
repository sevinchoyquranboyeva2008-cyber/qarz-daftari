'use strict';
/* ---------- helpers ---------- */
const pad = n => String(n).padStart(2, '0');
const fmt = n => String(Math.round(+n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const DAYS = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'];
const MONTHS = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const parse = s => { const [y, m, d] = s.split('-'); return new Date(+y, m - 1, +d); };
const dstr = d => pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear();
const dshort = d => pad(d.getDate()) + '.' + pad(d.getMonth() + 1);
const dfull = d => dstr(d) + ', ' + DAYS[d.getDay()];
const diff = (a, b) => Math.round((a - b) / 864e5);
const addD = n => { const d = today(); d.setDate(d.getDate() + n); return d; };
const addM = n => { const d = today(); d.setMonth(d.getMonth() + n); return d; };
const initials = n => n.trim().split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
const fmtPhone = p => '+998 ' + p.replace(/^(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4');
const money = (n, cur) => cur === 'usd' ? '$' + fmt(n) : fmt(n) + " so'm";
const ST = { late: ['#CD2B31', '#E5484D'], soon: ['#8F5A00', '#F5A524'], ok: ['#555555', '#9A9A9A'], paid: ['#1F7A4D', '#30A46C'] };
const AV = [['#F6DCD3', '#7A2E1E'], ['#F3E3C3', '#6B4A0E'], ['#D8E6F3', '#1E4466'], ['#DCEBDD', '#24502E'], ['#E7DDF1', '#4B2C6B']];
const avc = n => AV[[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % AV.length];

const ic = (d, s = 24, w = 2.2) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const P = {
  plus: '<path d="M12 5v14M5 12h14"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  next: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  del: '<path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z"/><path d="m16 9-5 6M11 9l5 6"/>',
  home: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
  paid: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  set: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  edit: '<path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  chev: '<path d="m9 6 6 6-6 6"/>',
  out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  up: '<path d="M12 19V5M5 12l7-7 7 7"/>'
};

/* ---------- storage ---------- */
const KEY = 'qarz-daftari-v1';
let db;
try { db = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { db = {}; }
db.debts = db.debts || [];
db.settings = Object.assign({ token: '', chat: '', mins: 540, t1: true, t2: true, lastSent: '' }, db.settings);
db.pin = db.pin || '';
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { toast("Saqlab bo'lmadi"); } };
const unlocked = () => { try { return sessionStorage.getItem('qd-ok') === '1'; } catch { return false; } };
const setUnlocked = v => { try { v ? sessionStorage.setItem('qd-ok', '1') : sessionStorage.removeItem('qd-ok'); } catch { } };

/* ---------- debt logic ---------- */
const paidSum = d => d.payments.reduce((a, p) => a + p.amount, 0);
const left = d => Math.max(0, d.amount - paidSum(d));
const active = () => db.debts.filter(d => !d.paidAt).sort((a, b) => a.due.localeCompare(b.due));
const paidList = () => db.debts.filter(d => d.paidAt).sort((a, b) => b.paidAt.localeCompare(a.paidAt));
const byId = id => db.debts.find(d => d.id === id);
function status(d) {
  if (d.paidAt) return { st: 'paid', date: '', text: "To'landi · " + dstr(parse(d.paidAt)) };
  const due = parse(d.due), n = diff(due, today());
  if (n < 0) return { st: 'late', date: dshort(due), text: -n + ' kun kechikdi', n };
  if (n === 0) return { st: 'soon', date: '', text: 'Bugun qaytarish kuni', n };
  if (n === 1) return { st: 'soon', date: '', text: 'Ertaga', n };
  if (n < 30) return { st: 'ok', date: dshort(due), text: n + ' kun qoldi', n };
  return { st: 'ok', date: dshort(due), text: Math.floor(n / 30) + ' oy qoldi', n };
}

/* ---------- state ---------- */
const S = { screen: 'pin', tab: 'home', filter: 'all', menu: false, q: '', pin: '', pinStage: '', pinErr: '', newPin: '', pinFrom: '', add: null, detail: null, sheet: null };
const app = document.getElementById('app');

function render(top) {
  const y = window.scrollY;
  app.innerHTML = VIEWS[S.screen]();
  window.scrollTo(0, top ? 0 : y);
}
function toTab(tab) { S.screen = 'tab'; S.tab = tab || S.tab; S.menu = false; S.sheet = null; render(true); }
function openSub(screen) { S.screen = screen; history.pushState({ sub: 1 }, ''); render(true); }
function closeSub() { if (history.state && history.state.sub) history.back(); else toTab(); }
window.addEventListener('popstate', () => {
  if (S.sheet) { S.sheet = null; return render(); }
  if (S.screen === 'add' && S.add.step > 1) { S.add.step--; history.pushState({ sub: 1 }, ''); return render(true); }
  if (S.screen === 'add' && S.add.id && byId(S.add.id)) { S.screen = 'detail'; history.pushState({ sub: 1 }, ''); return render(true); }
  if (S.screen === 'pin' && S.pinFrom) { S.pinFrom = ''; return toTab('settings'); }
  if (S.screen !== 'pin') toTab();
});

let toastT;
function toast(msg, undo) {
  const el = document.getElementById('toast');
  el.innerHTML = `<span>${esc(msg)}</span>${undo ? '<button data-act="undo">Bekor qilish</button>' : ''}`;
  el.hidden = false; toast.undo = undo;
  clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; toast.undo = null; }, undo ? 6000 : 3000);
}

function ask(msg, yes, fn) {
  const el = document.getElementById('dlg');
  el.innerHTML = `<div class="shade" data-act="askNo"></div><div class="sheet" role="alertdialog"><div class="grab"></div>
    <div style="font-size:22px;font-weight:700;line-height:1.35;margin:18px 4px 20px;text-wrap:balance">${esc(msg)}</div>
    <div style="display:flex;flex-direction:column;gap:10px"><button class="btn" style="background:#CD2B31;color:#fff" data-act="askYes">${esc(yes)}</button><button class="btn g" data-act="askNo">Yo'q, qaytish</button></div></div>`;
  el.hidden = false; ask.fn = fn;
}
function closeAsk() { const el = document.getElementById('dlg'); el.hidden = true; el.innerHTML = ''; ask.fn = null; }

/* ---------- shared pieces ---------- */
const keypad = (kind, h = 60) => `<div class="keypad">${['1', '2', '3', '4', '5', '6', '7', '8', '9', kind === 'pin' ? '' : '000', '0', 'del'].map(k =>
  k === '' ? '<div></div>' : k === 'del'
    ? `<button class="key del" style="height:${h}px" data-act="key" data-arg="${kind}|del" aria-label="O'chirish">${ic(P.del, 24, 2)}<span>O'chirish</span></button>`
    : `<button class="key" style="height:${h}px" data-act="key" data-arg="${kind}|${k}">${k}</button>`).join('')}</div>`;

const nav = () => `<nav class="nav">${[['home', 'Asosiy', P.home], ['paid', "To'langanlar", P.paid], ['settings', 'Sozlamalar', P.set]].map(([t, l, p]) =>
  `<button class="${S.tab === t ? 'on' : ''}" data-act="tab" data-arg="${t}">${ic(p)}<span>${l}</span></button>`).join('')}</nav>`;

function rowInner(d) {
  const s = status(d), c = d.paidAt ? ['#E2E2E2', '#555'] : avc(d.name);
  const partial = d.payments.length && !d.paidAt;
  const n = d.paidAt ? d.amount : left(d);
  const amt = d.cur === 'usd' ? '$' + fmt(n) : fmt(n);
  const unit = d.cur === 'usd' ? 'dollar' : partial ? "so'm qoldiq" : "so'm";
  const sub = d.paidAt
    ? `<div class="rsub" style="color:#1F7A4D;font-weight:700"><i class="dot" style="background:#30A46C"></i>To'landi</div><div class="rsub">${dstr(parse(d.paidAt))}</div>`
    : `<div class="rsub"><i class="dot" style="background:${ST[s.st][1]}"></i>${s.date ? `<span>${s.date} ·</span>` : ''}<b style="color:${ST[s.st][0]}">${s.text}</b></div>`;
  return `<div class="av" style="background:${c[0]};color:${c[1]}">${esc(initials(d.name))}</div>
    <div class="rmid"><div class="rname">${esc(d.name)}</div>${sub}</div>
    <div class="ramt"><b style="color:${d.paidAt ? '#6F6F6F' : '#000'}">${amt}</b><small>${unit}</small></div>`;
}
const row = d => d.paidAt
  ? `<div class="row" data-act="open" data-arg="${d.id}">${rowInner(d)}</div>`
  : `<div class="swipe"><button class="act" data-act="pay" data-arg="${d.id}">${ic(P.check, 30, 2.6)}To'landi</button><div class="row" data-act="open" data-arg="${d.id}">${rowInner(d)}</div></div>`;

/* ---------- views ---------- */
const VIEWS = {
  pin() {
    const msg = S.pinErr || (S.pinStage === 'new' ? "Yangi PIN-kod o'ylab toping" : S.pinStage === 'confirm' ? 'PIN-kodni yana bir marta kiriting' : 'PIN-kodni kiriting');
    return `<div class="scr" style="padding-bottom:calc(20px + var(--safeB))">
      ${S.pinFrom ? `<div class="top"><button class="back" data-act="pinBack">${ic(P.back, 26, 2.4)}Orqaga</button></div>` : ''}
      <div style="display:flex;flex-direction:column;align-items:center;padding-top:${S.pinFrom ? 16 : 56}px;gap:14px">
        <div class="pinlogo">Q</div>
        <div style="font-size:32px;font-weight:800;letter-spacing:-.02em;margin-top:6px">Qarz daftari</div>
        <div style="font-size:19px;color:${S.pinErr ? '#CD2B31' : '#444'};font-weight:${S.pinErr ? 700 : 400};text-align:center;padding:0 16px">${msg}</div>
        <div class="dots ${S.pinErr ? 'shake' : ''}">${[0, 1, 2, 3].map(i => `<i class="${i < S.pin.length ? 'on' : ''}"></i>`).join('')}</div>
      </div>
      <div style="margin-top:auto;padding:24px 20px 0;display:flex;flex-direction:column;gap:8px">
        <div class="pinpad">${keypad('pin', 72)}</div>
        ${S.pinStage === 'enter' ? `<button data-act="forgot" style="height:56px;font-size:18px;font-weight:600;text-decoration:underline;text-underline-offset:4px">PIN-kodni unutdingizmi?</button>` : '<div style="height:8px"></div>'}
      </div></div>`;
  },

  tab() {
    return (S.tab === 'home' ? homeView() : S.tab === 'paid' ? paidView() : settingsView()) + nav();
  },

  add() {
    const a = S.add;
    const top = `<div class="top"><button class="back" data-act="addBack">${ic(P.back, 26, 2.4)}Orqaga</button><div class="step">${a.step}/3</div></div>
      <div class="prog">${[1, 2, 3].map(i => `<i class="${i <= a.step ? 'on' : ''}"></i>`).join('')}</div>`;
    if (a.step === 1) {
      const seen = new Set(), prev = [];
      for (const d of [...db.debts].reverse()) if (!seen.has(d.name)) { seen.add(d.name); prev.push(d); if (prev.length === 6) break; }
      return `<div class="scr">${top}
        <div class="h1">Kim qarz oldi?</div>
        <div style="padding:16px 16px 0"><input class="inp" data-in="name" value="${esc(a.name)}" placeholder="Ism familiya" autocomplete="off" autocapitalize="words"></div>
        ${a.err ? `<div class="err">${a.err}</div>` : ''}
        ${prev.length ? `<div class="lbl">Avval qarz olganlar</div><div class="chips">${prev.map(d => { const c = avc(d.name); return `<button class="chip ${a.name === d.name ? 'on' : ''}" data-act="pickPerson" data-arg="${d.id}"><span class="av" style="background:${c[0]};color:${c[1]}">${esc(initials(d.name))}</span>${esc(d.name)}</button>`; }).join('')}</div>` : ''}
        <div class="lbl">Telefon raqami <em>(ixtiyoriy)</em></div>
        <div style="padding:0 16px;display:flex;flex-direction:column;gap:10px">
          <div class="phone"><b>+998</b><input data-in="phone" type="tel" inputmode="numeric" maxlength="12" value="${esc(a.phone)}" placeholder="90 123 45 67"></div>
          <button class="btn o" data-act="contact">${ic(P.user)}Kontaktlardan tanlash</button>
        </div>
        <div class="foot"><button class="btn k" data-act="addNext">Keyingi${ic(P.next, 24, 2.4)}</button></div></div>`;
    }
    if (a.step === 2) {
      const som = a.cur === 'som', num = som ? fmt(a.amt || 0) : '$' + fmt(a.amt || 0);
      const q = som ? [[100000, '+100 ming'], [500000, '+500 ming'], [1000000, '+1 mln']] : [[10, '+$10'], [50, '+$50'], [100, '+$100']];
      return `<div class="scr">${top}
        <div class="h1">Qancha?</div>
        <div class="amt"><span style="font-size:${num.length > 11 ? 40 : 52}px">${num}</span>${som ? "<span>so'm</span>" : ''}</div>
        ${a.err ? `<div class="err" style="text-align:center">${a.err}</div>` : ''}
        <div class="seg"><button class="${som ? 'on' : ''}" data-act="cur" data-arg="som">so'm</button><button class="${som ? '' : 'on'}" data-act="cur" data-arg="usd">$ dollar</button></div>
        <div class="quick">${q.map(([v, l]) => `<button data-act="quick" data-arg="${v}">${l}</button>`).join('')}</div>
        <div class="foot" style="gap:14px">${keypad('amt')}<button class="btn k" data-act="addNext">Keyingi${ic(P.next, 24, 2.4)}</button></div></div>`;
    }
    const opts = dueOpts(), sel = dueDate();
    return `<div class="scr">${top}
      <div class="h1" style="padding-top:24px">Qachon qaytaradi?</div>
      <div class="due">${opts.map(o => `<button class="${o.id === a.due ? 'on' : ''} ${o.other ? 'w' : ''}" data-act="due" data-arg="${o.id}">
        <span class="t">${o.other ? ic(P.cal) : ''}${o.label}</span>${o.id === a.due && sel ? `<span class="d">${dfull(sel)}</span>` : ''}
        ${o.other ? `<input type="date" class="hidden-date" id="otherDate" data-in="otherDate" min="${iso(today())}" value="${a.custom || ''}" tabindex="-1" aria-hidden="true">` : ''}</button>`).join('')}</div>
      ${a.err ? `<div class="err">${a.err}</div>` : ''}
      <div style="padding:12px 16px 0">${a.noteOpen
        ? `<textarea class="note" data-in="note" placeholder="Masalan: mashina ta'miri uchun">${esc(a.note)}</textarea><button data-act="note" style="height:56px;padding:0 4px;font-size:17px;font-weight:600;text-decoration:underline">Izohni yopish</button>`
        : `<button class="addnote" data-act="note">${ic(P.plus, 24, 2.4)}${a.note ? esc(a.note) : `Izoh qo'shish<em>(ixtiyoriy)</em>`}</button>`}</div>
      <div class="foot">
        <div class="sum"><div class="av">${esc(initials(a.name))}</div><div style="min-width:0"><div style="font-size:18px;font-weight:700">${esc(a.name)}</div><div class="a">${money(+a.amt, a.cur)}${sel ? ' · ' + dstr(sel) : ''}</div></div></div>
        <button class="btn k" data-act="addSave">${ic(P.check, 24, 2.6)}Saqlash</button>
      </div></div>`;
  },

  saved() {
    const d = byId(S.savedId);
    if (!d) return '';
    const due = parse(d.due);
    return `<div class="scr">
      <div class="ok">
        <div class="okc">${ic(P.check, 68, 2.8)}</div>
        <div class="okt">${S.savedEdit ? 'Qarz yangilandi' : 'Qarz saqlandi'}</div>
        <div class="card">
          <div class="ir"><span>Kim</span><span style="font-weight:700">${esc(d.name)}</span></div>
          <div class="ir"><span>Qancha</span><span style="font-size:20px;font-weight:800">${money(left(d), d.cur)}</span></div>
          <div class="ir"><span>Qaytarish</span><span style="font-weight:700">${dfull(due)}</span></div>
        </div>
        <div class="tgline"><i>${ic(P.send, 22)}</i><span>${tgOn() ? `${dstr(due)} kuni Telegram orqali eslatamiz` : "Telegram ulanmagan — eslatma kelishi uchun Sozlamalarda ulang"}</span></div>
      </div>
      <div class="foot" style="gap:14px"><div style="display:flex;flex-direction:column;gap:8px;align-items:center"><div class="bar"><i></i></div><span class="hint">3 soniyadan keyin asosiy sahifa ochiladi</span></div>
        <button class="btn k" data-act="home">Asosiy sahifaga qaytish</button></div></div>`;
  },

  detail() {
    const d = byId(S.detail);
    if (!d) { setTimeout(() => toTab('home')); return ''; }
    const s = status(d), c = avc(d.name), L = left(d), paid = paidSum(d), pct = Math.round(paid / d.amount * 100);
    const big = d.cur === 'usd' ? ['$' + fmt(d.paidAt ? d.amount : L), ''] : [fmt(d.paidAt ? d.amount : L), "so'm"];
    const hist = [...d.payments].sort((a, b) => b.date.localeCompare(a.date)).map(p =>
      `<div class="hist"><i style="color:#1F7A4D">${ic(P.check, 22, 2.6)}</i><div><div style="font-size:18px;font-weight:600">${dstr(parse(p.date))}</div><small>${p.full ? "To'liq to'lov" : "Qisman to'lov"}</small></div><b style="font-size:18px">${money(p.amount, d.cur)}</b></div>`).join('')
      + `<div class="hist"><i>${ic(P.up, 22, 2.4)}</i><div><div style="font-size:18px;font-weight:600">${dstr(parse(d.given))}</div><small>Qarz berildi</small></div><b style="font-size:18px">${money(d.amount, d.cur)}</b></div>`;
    return `<div class="scr" style="padding-bottom:calc(40px + var(--safeB))">
      <div class="hero dhero">
        <div class="hrow"><button class="dback glass" data-act="back">${ic(P.back, 24, 2.4)}Orqaga</button><span style="font-size:17px;font-weight:600;color:#C4C4C4">Qarz tafsiloti</span></div>
        <div class="who"><div class="av" style="background:${c[0]};color:${c[1]}">${esc(initials(d.name))}</div><div style="min-width:0"><div class="n">${esc(d.name)}</div>${d.phone ? `<div class="p">${fmtPhone(d.phone)}</div>` : ''}</div></div>
        <div><div style="font-size:16px;color:#BDBDBD;font-weight:500">${d.paidAt ? 'Jami qarz' : paid ? 'Qoldiq' : 'Qarz'}</div>
          <div class="total" style="margin-top:2px"><span class="n gtext">${big[0]}</span>${big[1] ? `<span class="u gtext" style="font-size:24px">${big[1]}</span>` : ''}</div></div>
        <div class="spill glass" style="align-self:flex-start;padding:0 16px"><i class="dot" style="background:${ST[s.st][1]}"></i>${s.date ? s.date + ' · ' : ''}${s.text}</div>
        ${paid && !d.paidAt ? `<div style="display:flex;flex-direction:column;gap:10px"><div style="display:flex;justify-content:space-between;font-size:15px;font-weight:600;color:#D0D0D0"><span>To'langan ${fmt(paid)} / ${fmt(d.amount)}</span><span>${pct}%</span></div><div class="pbar"><i style="width:${pct}%"></i></div></div>` : ''}
      </div>
      <div class="stack">
        ${d.phone ? `<a class="btn gr" href="tel:+998${d.phone}">${ic(P.phone)}Qo'ng'iroq qilish</a>` : ''}
        ${d.paidAt ? `<button class="btn g" data-act="reopen">Qayta ochish (to'lanmagan)</button>` : `
        <button class="btn k" data-act="payFull">${ic(P.check, 24, 2.6)}To'liq to'landi</button>
        <button class="btn g" data-act="partOpen">Qisman to'lov</button>`}
        <div class="two">
          <button class="btn g s" data-act="edit">${ic(P.edit, 20)}Tahrirlash</button>
          <button class="btn g s" style="color:#CD2B31;font-weight:700" data-act="remove">${ic(P.trash, 20)}O'chirish</button>
        </div>
      </div>
      <div class="card" style="margin:22px 12px 0;width:auto;padding:0 16px">
        <div class="ir"><span>Berilgan sana</span><span>${dstr(parse(d.given))}</span></div>
        <div class="ir"><span>Qaytarish sanasi</span><span>${dstr(parse(d.due))}</span></div>
        <div class="ir"><span>Izoh</span><span>${d.note ? esc(d.note) : '—'}</span></div>
      </div>
      <div style="padding:28px 20px 12px;font-size:22px;font-weight:800;letter-spacing:-.01em">To'lovlar tarixi</div>
      <div class="list">${hist}</div>
      ${S.sheet ? partSheet(d) : ''}
    </div>`;
  }
};

function partSheet(d) {
  const L = left(d), v = +S.sheet.amt || 0, pd = parse(S.sheet.date), isToday = S.sheet.date === iso(today());
  const usd = d.cur === 'usd';
  return `<div class="shade" data-act="partClose"></div><div class="sheet" role="dialog" aria-label="Qisman to'lov">
    <div class="grab"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px"><div style="font-size:26px;font-weight:800;letter-spacing:-.02em">Qisman to'lov</div><button class="back" style="padding:0 18px;font-size:17px" data-act="partClose">Yopish</button></div>
    <div style="font-size:16px;color:#555;margin-top:2px">${esc(d.name)} · qoldiq ${money(L, d.cur)}</div>
    <div style="display:flex;align-items:baseline;justify-content:center;gap:10px;margin-top:18px"><span style="font-size:46px;font-weight:800;letter-spacing:-.03em">${usd ? '$' : ''}${fmt(v)}</span>${usd ? '' : `<span style="font-size:24px;font-weight:700;color:#555">so'm</span>`}</div>
    <div style="text-align:center;font-size:16px;color:#444;font-weight:500;margin-top:2px">${v > L ? `<b style="color:#CD2B31">Qoldiqdan ko'p</b>` : `To'lovdan keyin qoladi: <b>${money(L - v, d.cur)}</b>`}</div>
    <button class="datebtn">${ic(P.cal, 22)}<span style="color:#555">Sana</span><span style="margin-left:auto;font-weight:700;font-size:18px">${isToday ? 'Bugun, ' : ''}${dstr(pd)}</span>
      <input type="date" class="hidden-date" id="partDate" data-in="partDate" max="${iso(today())}" value="${S.sheet.date}" tabindex="-1" aria-hidden="true"></button>
    <div style="margin-top:14px">${keypad('part', 58)}</div>
    <button class="btn k" style="margin-top:14px" data-act="partSave">${ic(P.check, 24, 2.6)}Saqlash</button>
  </div>`;
}

const tgOn = () => !!(db.settings.token && db.settings.chat);

function homeView() {
  const act = active(), t = today();
  const som = act.filter(d => d.cur === 'som').reduce((a, d) => a + left(d), 0);
  const usd = act.filter(d => d.cur === 'usd').reduce((a, d) => a + left(d), 0);
  const late = act.filter(d => status(d).st === 'late').length;
  const tod = act.filter(d => diff(parse(d.due), t) === 0).length;
  const people = new Set(act.map(d => d.name)).size;
  const sub = act.length ? `${usd ? '+ $' + fmt(usd) + ' · ' : ''}${people} ta qarzdor` : "Hali qarzdor yo'q";
  const pill = (f, n, color, label) => `<button class="pill glass ${S.filter === f ? 'on' : ''}" data-act="filter" data-arg="${f}"><span class="c"><i class="dot" style="background:${color}"></i>${n}</span><span class="l">${label}</span></button>`;
  const hero = `<div class="hero">
    <div class="hrow"><div style="display:flex;align-items:center;gap:12px"><div class="logo">Q</div><span style="font-size:18px;font-weight:700">Qarz daftari</span></div>
      <button class="bell glass" data-act="filter" data-arg="late" aria-label="Kechikkan qarzlar: ${late}">${ic(P.bell, 26, 2)}${late ? `<span class="badge">${late}</span>` : ''}</button></div>
    <div class="hlabel">Sizga qaytarilishi kerak</div>
    <div class="total"><span class="n gtext">${fmt(som)}</span><span class="u gtext">so'm</span></div>
    <div class="hsub">${sub}</div>
    <div class="actions">${pill('late', late, '#E5484D', 'Kechikkan')}
      <button class="bigplus" data-act="add"><span class="o">${ic(P.plus, 40, 2.6)}</span><span>Qarz qo'shish</span></button>
      ${pill('today', tod, '#F5A524', 'Bugun')}</div>
    <div class="status">${tgOn()
      ? `<div class="spill glass"><i class="dot" style="background:#30A46C;box-shadow:0 0 0 4px rgba(48,164,108,.25)"></i>Telegram ulangan</div>`
      : `<button class="spill off" data-act="tab" data-arg="settings"><i class="dot" style="background:#E5484D;box-shadow:0 0 0 4px rgba(229,72,77,.25)"></i>Telegram ulanmagan<span style="font-weight:600;color:#FFC9CA">· Ulash</span></button>`}</div>
  </div>`;

  if (!act.length && S.filter === 'all') {
    return `<div class="scr pad-nav">${hero}<div class="empty">
      <div class="arrow-h"></div><div class="arrow-s"></div>
      <div class="t">${db.debts.length ? "Hozir qarzdor yo'q — yangi qarz uchun + tugmasini bosing" : 'Hali qarz yozilmagan — + tugmasini bosing'}</div>
      <div class="ill"><div class="b"></div><div class="p"><i style="background:#000;width:70%"></i><i></i><i style="width:80%"></i><i style="width:55%"></i></div><div class="rings"><i></i><i></i><i></i></div><div class="plus">${ic(P.plus, 24, 3)}</div></div>
    </div></div>`;
  }
  const FL = [['all', 'Hammasi'], ['late', 'Kechikkan'], ['today', 'Bugun'], ['paid', "To'langan"]];
  return `<div class="scr pad-nav">${hero}
    <div class="lhead"><div class="h2">Qarzdorlar</div>
      <button class="fbtn" data-act="menu">${FL.find(f => f[0] === S.filter)[1]}${ic(P.down, 22, 2.4)}</button>
      ${S.menu ? `<div class="menu">${FL.map(([id, l]) => `<button class="${S.filter === id ? 'on' : ''}" data-act="filterSet" data-arg="${id}">${l}${S.filter === id ? ic(P.check, 22, 2.6) : ''}</button>`).join('')}</div>` : ''}
    </div>
    <label class="search">${ic(P.search)}<input type="search" data-in="q" value="${esc(S.q)}" placeholder="Ism bo'yicha qidirish" enterkeyhint="search"></label>
    <div class="list" id="list">${homeList()}</div></div>`;
}
function homeList() {
  const t = today(), q = S.q.trim().toLowerCase();
  let l = S.filter === 'paid' ? paidList() : active().filter(d => S.filter === 'all' || (S.filter === 'late' && status(d).st === 'late') || (S.filter === 'today' && diff(parse(d.due), t) === 0));
  if (q) l = l.filter(d => d.name.toLowerCase().includes(q));
  if (!l.length) return `<div class="none">${q ? 'Bu ism topilmadi' : S.filter === 'late' ? "Kechikkan qarz yo'q 👍" : S.filter === 'today' ? "Bugun qaytariladigan qarz yo'q" : "Hali to'langan qarz yo'q"}</div>`;
  return l.map(row).join('');
}

function paidView() {
  const l = paidList(), q = S.q.trim().toLowerCase();
  const som = l.filter(d => d.cur === 'som').reduce((a, d) => a + d.amount, 0), usd = l.filter(d => d.cur === 'usd').reduce((a, d) => a + d.amount, 0);
  return `<div class="scr pad-nav">
    <div class="title">To'langanlar</div>
    <div style="padding:6px 20px 0;font-size:17px;color:#444;font-weight:500">${l.length ? `${l.length} ta qarz qaytarildi · ${fmt(som)} so'm${usd ? ' + $' + fmt(usd) : ''}` : "Hali to'langan qarz yo'q"}</div>
    ${l.length ? `<label class="search" style="margin-top:18px">${ic(P.search)}<input type="search" data-in="q" value="${esc(S.q)}" placeholder="Ism bo'yicha qidirish"></label>
    <div id="list">${paidGroups(l, q)}</div>` : ''}</div>`;
}
function paidGroups(l, q) {
  if (q) l = l.filter(d => d.name.toLowerCase().includes(q));
  if (!l.length) return `<div class="none">Bu ism topilmadi</div>`;
  let out = '', cur = '';
  for (const d of l) {
    const p = parse(d.paidAt), g = MONTHS[p.getMonth()] + (p.getFullYear() !== today().getFullYear() ? ' ' + p.getFullYear() : '');
    if (g !== cur) { out += `${cur ? '</div>' : ''}<div style="padding:8px 20px;font-size:16px;font-weight:700;color:#555">${g}</div><div class="list" style="margin-bottom:8px">`; cur = g; }
    out += row(d);
  }
  return out + '</div>';
}

function settingsView() {
  const s = db.settings, on = tgOn(), h = Math.floor(s.mins / 60), m = s.mins % 60;
  const tog = (k, label) => `<button class="tog" data-act="tog" data-arg="${k}"><div style="flex:1"><div style="font-size:18px;font-weight:600;line-height:1.3">${label}</div><div style="font-size:15px;color:#555;margin-top:2px">${s[k] ? 'Yoqilgan' : "O'chirilgan"}</div></div><div class="sw ${s[k] ? 'on' : ''}"><i></i></div></button>`;
  const step = (n, html) => `<div class="stp"><i>${n}</i><div>${html}</div></div>`;
  return `<div class="scr pad-nav">
    <div class="title">Sozlamalar</div>
    <div class="tgcard">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 4px"><div style="font-size:22px;font-weight:800;letter-spacing:-.01em;line-height:1.2">Telegram eslatmalari</div>
        <div style="height:36px;padding:0 14px;border-radius:18px;background:#fff;display:flex;align-items:center;gap:8px;font-size:15px;font-weight:700;color:${on ? '#1F7A4D' : '#CD2B31'};flex:none"><i class="dot" style="background:${on ? '#30A46C' : '#E5484D'}"></i>${on ? 'Ulangan' : 'Ulanmagan'}</div></div>
      <div style="font-size:17px;color:#444;line-height:1.4;padding:0 4px 4px">Qarz muddati kelganda bot sizga Telegramda xabar yuboradi. Ulash uchun 4 qadam:</div>
      ${step(1, '<b>@BotFather</b> ni oching va <b>/newbot</b> yuboring')}
      ${step(2, 'Bot bergan <b>tokenni</b> pastdagi maydonga joylang')}
      ${step(3, "O'z botingizni oching va <b>START</b> tugmasini bosing")}
      ${step(4, '<b>“Aniqlash”</b> tugmasini bosing')}
      <div style="display:flex;flex-direction:column;gap:8px;padding-top:6px"><div class="flbl">Bot token</div><input class="sinp" data-in="token" value="${esc(s.token)}" placeholder="1234567890:AA..." autocomplete="off" autocapitalize="off" spellcheck="false"></div>
      <div style="display:flex;flex-direction:column;gap:8px"><div class="flbl">Chat ID</div><div style="display:flex;gap:8px"><input class="sinp" style="flex:1;min-width:0;font-size:18px;font-weight:600" data-in="chat" inputmode="numeric" value="${esc(s.chat)}" placeholder="—"><button data-act="detect" style="height:60px;padding:0 20px;border-radius:16px;background:#000;color:#fff;font-size:18px;font-weight:700;flex:none">Aniqlash</button></div></div>
    </div>
    <div style="padding:30px 20px 12px;font-size:22px;font-weight:800;letter-spacing:-.01em">Eslatma vaqti</div>
    <div style="display:flex;flex-direction:column;gap:10px;padding:0 12px">
      <div class="time"><button data-act="time" data-arg="-30" aria-label="Kamaytirish">−</button><div style="text-align:center"><div style="font-size:46px;font-weight:800;letter-spacing:-.02em;line-height:1.1">${pad(h)}:${pad(m)}</div><div style="font-size:15px;color:#555;font-weight:500">har kuni shu vaqtda</div></div><button data-act="time" data-arg="30" aria-label="Oshirish">+</button></div>
      ${tog('t1', "Muddati o'tganlarni har kuni eslatish")}
      ${tog('t2', '1 kun oldin ham eslatish')}
      <button class="btn o" style="margin-top:4px" data-act="test">${ic(P.send, 22)}Sinov xabari yuborish</button>
      <button class="btn k" data-act="saveSettings">Saqlash</button>
    </div>
    <div style="padding:30px 20px 12px;font-size:22px;font-weight:800;letter-spacing:-.01em">Xavfsizlik</div>
    <div style="display:flex;flex-direction:column;gap:8px;padding:0 12px">
      <button class="lrow" data-act="changePin">${ic(P.lock, 22)}PIN-kodni o'zgartirish<span style="margin-left:auto">${ic(P.chev, 22, 2.4)}</span></button>
      <button class="lrow" style="color:#CD2B31;font-weight:700" data-act="logout">${ic(P.out, 22)}Chiqish</button>
    </div></div>`;
}

/* ---------- add flow ---------- */
function dueOpts() {
  const a = S.add;
  return [{ id: '1h', label: '1 hafta', d: addD(7) }, { id: '2h', label: '2 hafta', d: addD(14) }, { id: '1oy', label: '1 oy', d: addM(1) }, { id: '3oy', label: '3 oy', d: addM(3) },
    { id: 'other', label: 'Boshqa sana', d: a.custom ? parse(a.custom) : null, other: true }];
}
const dueDate = () => (dueOpts().find(o => o.id === S.add.due) || {}).d || null;
function startAdd(d) {
  S.add = d
    ? { id: d.id, step: 1, name: d.name, phone: d.phone || '', amt: String(d.amount), cur: d.cur, due: 'other', custom: d.due, note: d.note || '', noteOpen: false, err: '' }
    : { step: 1, name: '', phone: '', amt: '', cur: 'som', due: '1oy', custom: null, note: '', noteOpen: false, err: '' };
  openSub('add');
}
function addSave() {
  const a = S.add, due = dueDate();
  if (!due) { a.err = 'Sanani tanlang'; return render(); }
  const data = { name: a.name.trim(), phone: a.phone.replace(/\D/g, '').slice(-9), amount: +a.amt, cur: a.cur, due: iso(due), note: a.note.trim() };
  let d;
  if (a.id && (d = byId(a.id))) {
    Object.assign(d, data);
    if (paidSum(d) >= d.amount && !d.paidAt) d.paidAt = iso(today());
    if (paidSum(d) < d.amount) d.paidAt = null;
  } else {
    d = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), given: iso(today()), payments: [], paidAt: null, ...data };
    db.debts.push(d);
  }
  save();
  S.savedId = d.id; S.savedEdit = !!a.id; S.screen = 'saved'; S.filter = 'all'; render(true);
  clearTimeout(S.savedT); S.savedT = setTimeout(() => { if (S.screen === 'saved') closeSub(); }, 3000);
}

/* ---------- payments ---------- */
function markPaid(id) {
  const d = byId(id); if (!d) return;
  const snap = JSON.stringify(d);
  const L = left(d);
  if (L > 0) d.payments.push({ date: iso(today()), amount: L, full: true });
  d.paidAt = iso(today()); save(); render();
  toast(`${d.name} — to'landi deb belgilandi`, () => { Object.assign(d, JSON.parse(snap)); save(); render(); });
}

/* ---------- pin ---------- */
function pinKey(k) {
  if (S.pinBusy) return;
  S.pinErr = '';
  if (k === 'del') { S.pin = S.pin.slice(0, -1); return render(); }
  if (S.pin.length >= 4) return;
  S.pin += k; render();
  if (S.pin.length === 4) { S.pinBusy = true; setTimeout(pinDone, 220); }
}
function pinDone() {
  const p = S.pin; S.pin = ''; S.pinBusy = false;
  if (S.pinStage === 'enter') {
    if (p === db.pin) { setUnlocked(true); afterUnlock(); return toTab('home'); }
    S.pinErr = "Noto'g'ri PIN-kod. Qaytadan kiriting"; navigator.vibrate && navigator.vibrate(200); return render();
  }
  if (S.pinStage === 'new') { S.newPin = p; S.pinStage = 'confirm'; return render(); }
  if (p !== S.newPin) { S.pinStage = 'new'; S.pinErr = "Mos kelmadi. Yangi PIN-kodni qaytadan kiriting"; return render(); }
  db.pin = p; save(); setUnlocked(true);
  if (S.pinFrom) { history.back(); toast("PIN-kod o'zgartirildi"); return; }
  afterUnlock(); toTab('home');
}
function lockScreen() {
  S.screen = 'pin'; S.pin = ''; S.pinErr = ''; S.pinFrom = '';
  S.pinStage = db.pin ? 'enter' : 'new'; render(true);
}

/* ---------- telegram ---------- */
async function tg(method, body) {
  const r = await fetch(`https://api.telegram.org/bot${db.settings.token.trim()}/${method}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
  const j = await r.json();
  if (!j.ok) throw new Error(j.description || 'xato');
  return j.result;
}
async function checkReminders() {
  const s = db.settings;
  if (!tgOn() || !unlocked()) return;
  const now = new Date(), t = iso(today());
  if (s.lastSent === t || now.getHours() * 60 + now.getMinutes() < s.mins) return;
  const items = [];
  for (const d of active()) {
    const n = diff(parse(d.due), today());
    const w = n === 0 ? 'bugun qaytarish kuni' : n < 0 && s.t1 ? -n + ' kun kechikdi' : n === 1 && s.t2 ? 'ertaga qaytarish kuni' : null;
    if (w) items.push(`${n === 1 ? '⏰' : '⚠️'} ${d.name}ning qarzi bor edi — ${w}\n💰 ${money(left(d), d.cur)}${d.phone ? ' · 📞 ' + fmtPhone(d.phone) : ''}`);
  }
  s.lastSent = t; save();
  if (!items.length) return;
  try { await tg('sendMessage', { chat_id: s.chat, text: `🔔 Qarz eslatmasi · ${dstr(today())}\n\n` + items.join('\n\n') }); }
  catch { s.lastSent = ''; save(); }
}
function afterUnlock() { checkReminders(); }

/* ---------- actions ---------- */
const ACT = {
  key(arg) {
    const [kind, k] = arg.split('|');
    if (kind === 'pin') return pinKey(k);
    const o = kind === 'amt' ? S.add : S.sheet;
    let v = o.amt;
    v = k === 'del' ? v.slice(0, -1) : (v + k).replace(/^0+/, '');
    if (v.length > (kind === 'amt' && o.cur === 'usd' ? 7 : 10)) return;
    o.amt = v; o.err = ''; render();
  },
  forgot() {
    ask("PIN-kodni tiklash uchun barcha yozuvlar o'chiriladi. Davom etasizmi?", "Ha, o'chirish", () => {
      try { localStorage.removeItem(KEY); } catch { }
      db = { debts: [], settings: { token: '', chat: '', mins: 540, t1: true, t2: true, lastSent: '' }, pin: '' }; lockScreen();
    });
  },
  askNo() { closeAsk(); },
  askYes() { const f = ask.fn; closeAsk(); f && f(); },
  pinBack() { history.back(); },
  tab(t) { if (S.screen !== 'tab') { S.screen = 'tab'; } S.q = ''; S.menu = false; toTab(t); },
  filter(f) { S.filter = S.filter === f ? 'all' : f; S.menu = false; render(); },
  filterSet(f) { S.filter = f; S.menu = false; render(); },
  menu() { S.menu = !S.menu; render(); },
  add() { startAdd(); },
  open(id, el) {
    if (swMoved) return;
    if (el._x) { el._x = 0; el.style.transform = ''; return; }
    S.detail = id; S.sheet = null; openSub('detail');
  },
  pay(id) { markPaid(id); },
  undo() { const u = toast.undo; document.getElementById('toast').hidden = true; toast.undo = null; u && u(); },
  back() { closeSub(); },
  home() { clearTimeout(S.savedT); closeSub(); },

  addBack() { if (S.add.step > 1) { S.add.step--; S.add.err = ''; render(true); } else closeSub(); },
  addNext() {
    const a = S.add;
    if (a.step === 1 && !a.name.trim()) { a.err = 'Iltimos, ismni yozing'; return render(); }
    if (a.step === 2 && !(+a.amt > 0)) { a.err = 'Iltimos, summani kiriting'; return render(); }
    a.err = ''; a.step++; render(true);
  },
  addSave,
  pickPerson(id) { const d = byId(id); S.add.name = d.name; S.add.phone = d.phone || ''; S.add.err = ''; render(); },
  async contact() {
    if (!('contacts' in navigator && 'select' in navigator.contacts)) return toast("Bu telefonda kontaktlardan tanlab bo'lmaydi. Raqamni qo'lda yozing");
    try {
      const [c] = await navigator.contacts.select(['name', 'tel'], { multiple: false });
      if (!c) return;
      if (c.name && c.name[0]) S.add.name = c.name[0];
      let t = ((c.tel && c.tel[0]) || '').replace(/\D/g, '');
      if (t.startsWith('998')) t = t.slice(3);
      S.add.phone = t.slice(-9); S.add.err = ''; render();
    } catch { }
  },
  cur(c) { if (S.add.cur !== c) { S.add.cur = c; S.add.amt = ''; render(); } },
  quick(v) { S.add.amt = String((+S.add.amt || 0) + +v); S.add.err = ''; render(); },
  due(id) {
    S.add.due = id; S.add.err = ''; render();
  },
  note() { S.add.noteOpen = !S.add.noteOpen; render(); },

  payFull() { markPaid(S.detail); },
  partOpen() { S.sheet = { amt: '', date: iso(today()) }; history.pushState({ sub: 1 }, ''); render(); },
  partClose() { history.back(); },
  partSave() {
    const d = byId(S.detail), v = +S.sheet.amt || 0, L = left(d);
    if (!v) return toast('Summani kiriting');
    if (v > L) return toast("Summa qoldiqdan ko'p");
    d.payments.push({ date: S.sheet.date, amount: v, full: v === L });
    if (v === L) d.paidAt = S.sheet.date;
    save(); history.back();
    toast(v === L ? "Qarz to'liq to'landi" : `${money(v, d.cur)} to'lov saqlandi`);
  },
  reopen() { const d = byId(S.detail); d.paidAt = null; d.payments = d.payments.filter(p => !p.full); save(); render(); toast("Qarz qayta ochildi"); },
  edit() { startAdd(byId(S.detail)); },
  remove() {
    const d = byId(S.detail);
    ask(`${d.name} qarzini o'chirasizmi?`, "Ha, o'chirish", () => {
      const i = db.debts.indexOf(d); db.debts.splice(i, 1); save(); closeSub();
      toast("Qarz o'chirildi", () => { db.debts.splice(i, 0, d); save(); render(); });
    });
  },

  async detect() {
    if (!db.settings.token.trim()) return toast('Avval bot tokenni kiriting');
    toast('Qidirilmoqda…');
    try {
      const u = await tg('getUpdates');
      const m = u.reverse().map(x => x.message || x.my_chat_member || x.edited_message).find(Boolean);
      if (!m) throw 0;
      db.settings.chat = String(m.chat.id); save(); render(); toast('Chat ID topildi ✓');
    } catch { toast("Topilmadi. Token to'g'riligini tekshiring va botingizda START ni bosing"); }
  },
  time(v) { db.settings.mins = (db.settings.mins + +v + 1440) % 1440; db.settings.lastSent = ''; save(); render(); },
  tog(k) { db.settings[k] = !db.settings[k]; save(); render(); },
  async test() {
    if (!tgOn()) return toast('Avval token va Chat ID ni kiriting');
    try {
      await tg('sendMessage', { chat_id: db.settings.chat, text: `✅ Sinov xabari\nQarz daftari ulandi. Eslatmalar har kuni ${pad(Math.floor(db.settings.mins / 60))}:${pad(db.settings.mins % 60)} da keladi.` });
      toast('Xabar yuborildi. Telegramni tekshiring');
    } catch (e) { toast('Yuborilmadi: ' + e.message); }
  },
  saveSettings() { save(); render(); toast('Saqlandi'); checkReminders(); },
  changePin() { S.screen = 'pin'; S.pin = ''; S.pinErr = ''; S.pinStage = 'new'; S.pinFrom = 'settings'; history.pushState({ sub: 1 }, ''); render(true); },
  logout() { setUnlocked(false); lockScreen(); }
};

document.addEventListener('click', e => {
  if (e.target.matches('input[type=date]')) return;
  const el = e.target.closest('[data-act]');
  if (!el) { if (S.menu && !e.target.closest('.menu')) { S.menu = false; render(); } return; }
  if (S.menu && el.dataset.act !== 'menu' && el.dataset.act !== 'filterSet') S.menu = false;
  const f = ACT[el.dataset.act];
  if (f) f(el.dataset.arg, el);
});
const onIn = e => {
  const k = e.target.dataset.in; if (!k) return;
  const v = e.target.value;
  if (k === 'q') { S.q = v; const l = document.getElementById('list'); if (l) l.innerHTML = S.tab === 'paid' ? paidGroups(paidList(), v.trim().toLowerCase()) : homeList(); }
  else if (k === 'name') { S.add.name = v; if (S.add.err) { S.add.err = ''; document.querySelector('.err')?.remove(); } }
  else if (k === 'phone') { S.add.phone = v.replace(/[^\d ]/g, ''); if (e.target.value !== S.add.phone) e.target.value = S.add.phone; }
  else if (k === 'note') S.add.note = v;
  else if (k === 'otherDate') { if (v && v !== S.add.custom) { S.add.custom = v; S.add.due = 'other'; render(); } }
  else if (k === 'partDate') { if (v && v !== S.sheet.date) { S.sheet.date = v; render(); } }
  else if (k === 'token' || k === 'chat') { db.settings[k] = v.trim(); save(); }
};
document.addEventListener('input', onIn);
document.addEventListener('change', e => { if (e.target.type === 'date') onIn(e); });

/* ---------- swipe to pay ---------- */
let sw = null, swMoved = false;
document.addEventListener('pointerdown', e => {
  const f = e.target.closest('.swipe .row'); if (!f) return;
  document.querySelectorAll('.swipe .row').forEach(r => { if (r !== f && r._x) { r._x = 0; r.style.transform = ''; } });
  sw = { f, x: e.clientX, y: e.clientY, base: f._x || 0, dir: null, cur: f._x || 0 };
});
document.addEventListener('pointermove', e => {
  if (!sw) return;
  const dx = e.clientX - sw.x, dy = e.clientY - sw.y;
  if (!sw.dir) { if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) sw.dir = 'x'; else if (Math.abs(dy) > 10) { sw = null; return; } else return; }
  sw.cur = Math.min(0, Math.max(-150, sw.base + dx));
  sw.f.style.transition = 'none'; sw.f.style.transform = `translateX(${sw.cur}px)`;
});
const swEnd = () => {
  if (!sw) return;
  if (sw.dir) {
    const x = sw.cur < -60 ? -128 : 0;
    sw.f.style.transition = ''; sw.f.style.transform = x ? `translateX(${x}px)` : ''; sw.f._x = x;
    swMoved = true; setTimeout(() => { swMoved = false; }, 80);
  }
  sw = null;
};
document.addEventListener('pointerup', swEnd);
document.addEventListener('pointercancel', swEnd);

/* ---------- boot ---------- */
if (unlocked()) { S.screen = 'tab'; render(true); afterUnlock(); } else lockScreen();
setInterval(checkReminders, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { checkReminders(); if (S.screen === 'tab') render(); } });
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => { });
