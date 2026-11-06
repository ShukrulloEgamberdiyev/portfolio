/* AMINA GROUP CRM — PWA (1-bosqich: login + lidlar) */
(function () {
  'use strict';
  var CFG = window.CRM_CONFIG || {};
  var DEMO = /[?&]demo(=|&|$)/.test(location.search);
  var DEMO_ROLE = /demo=op/.test(location.search) ? 'operator' : 'rahbar';
  var PAGE = 60;

  var S = { token: null, me: null, leads: [], filter: 'ish', q: '', operator: '', shown: PAGE, open: null, loading: false };

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };

  /* ---------- Holatlar guruhi ---------- */
  var WARM = ["Bog'lanildi", 'Qiziqish bildirdi', "O'ylayapti", "Ko'tarmadi", 'Sexga/ofisga keldi'];
  var GOOD = ['Zakaz oldi', 'Sotildi'];
  var NO_NOTE_OK = ["Yangi", "Ko'tarmadi", 'Xato raqam'];
  var NEED_DATE = ["Bog'lanildi", 'Qiziqish bildirdi', "O'ylayapti"];
  function hGroup(h) {
    if (!h || h === 'Yangi') return 'new';
    if (WARM.indexOf(h) >= 0) return 'warm';
    if (GOOD.indexOf(h) >= 0) return 'good';
    return 'bad';
  }

  /* ---------- Sana ---------- */
  function parseDT(s) {
    var m = String(s || '').match(/(\d{1,2})[./](\d{1,2})[./](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
    if (!m) return null;
    return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0));
  }
  function today0() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function ago(s) {
    var d = parseDT(s); if (!d) return '';
    var min = Math.round((Date.now() - d.getTime()) / 60000);
    if (min < 1) return 'hozir';
    if (min < 60) return min + ' daq';
    var h = Math.round(min / 60); if (h < 24) return h + ' soat';
    var dd = Math.round(h / 24); if (dd < 30) return dd + ' kun';
    return s.slice(0, 10);
  }

  /* ---------- Telefon va ism (ba'zi qatorlarda ustunlar surilgan) ---------- */
  function digits(s) { return String(s || '').replace(/\D/g, ''); }
  function normPhone(s) {
    var d = digits(s);
    if (d.length === 9) return '+998' + d;
    if (d.length === 12 && d.indexOf('998') === 0) return '+' + d;
    if (d.length >= 10 && d.length <= 13) return '+' + d;
    return null;
  }
  function phones(l) {
    var out = [];
    ['Telefon-2', 'Telefon', 'Shahar', 'Ism'].forEach(function (k) {
      var p = normPhone(l[k]); if (p && out.indexOf(p) < 0) out.push(p);
    });
    return out;
  }
  function looksPhone(s) { return digits(s).length >= 9; }
  function displayName(l) {
    var n = String(l['Ism'] || '').trim();
    if (n && !looksPhone(n) && n.indexOf('<test') !== 0) return n;
    var t = String(l['Telefon'] || '').trim();
    if (t && !looksPhone(t) && t.length < 40) return t;
    return 'Ismsiz mijoz';
  }
  function fmtPhone(p) { var m = p.match(/^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/); return m ? '+998 ' + m[1] + ' ' + m[2] + ' ' + m[3] + ' ' + m[4] : p; }

  /* ---------- Qizil belgilar ---------- */
  function flags(l) {
    var f = [], h = l['Holat'] || 'Yangi', g = hGroup(h);
    if (g === 'new') {
      var d = parseDT(l['Kelgan vaqt']);
      if (d && Date.now() - d.getTime() > 30 * 60000) f.push('Javob kutmoqda');
    }
    if (h !== 'Yangi' && NO_NOTE_OK.indexOf(h) < 0 && !String(l['Izoh'] || '').trim()) f.push("Izoh yo'q");
    if (g === 'warm') {
      var k = parseDT(l['Keyingi qadam sanasi']);
      if (!k && NEED_DATE.indexOf(h) >= 0) f.push("Keyingi qadam yo'q");
      else if (k && k < today0()) f.push("Muddati o'tdi");
    }
    return f;
  }
  function isTodayWork(l) {
    if (hGroup(l['Holat']) !== 'warm') return false;
    var k = parseDT(l['Keyingi qadam sanasi']);
    return !!k && k <= today0();
  }

  /* ---------- API ---------- */
  function api(action, data) {
    if (DEMO) return Demo.api(action, data);
    var body = Object.assign({ action: action, idToken: S.token }, data || {});
    return fetch(CFG.API_URL, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'text/plain;charset=utf-8' } })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.ok) { var e = new Error(j.error || 'Xato'); e.code = j.code; throw e; }
        return j;
      });
  }
  function onApiError(e) {
    // 401: token eskirgan — avtomatik qayta kirish (One Tap)
    if (e.code === 401) { signOut('expired'); return; }
    // 403: bu Gmail'ga ruxsat yo'q — avtomatik kirishni o'chirib, xabar ko'rsatamiz
    if (e.code === 403) { signOut('denied'); showLoginError(e.message); return; }
    toast(e.message === 'Failed to fetch' ? "Internet yo'q yoki server javob bermadi" : e.message);
  }

  /* ---------- Google login ---------- */
  function tokenExp(t) {
    try { var p = JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); return p.exp * 1000; } catch (e) { return 0; }
  }
  function store(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  function initGoogle(cb) {
    if (window.google && google.accounts && google.accounts.id) return cb();
    var s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.onload = cb;
    s.onerror = function () { showLoginError("Google bilan bog'lanib bo'lmadi. Internetni tekshiring."); };
    document.head.appendChild(s);
  }
  function showLogin(prompt) {
    $('app').classList.add('hidden'); $('login').classList.remove('hidden');
    if (DEMO) return;
    initGoogle(function () {
      google.accounts.id.initialize({
        client_id: CFG.CLIENT_ID, callback: onCredential, auto_select: true,
        cancel_on_tap_outside: false, use_fedcm_for_prompt: true
      });
      $('gbtn').innerHTML = '';
      google.accounts.id.renderButton($('gbtn'), { theme: 'filled_black', size: 'large', shape: 'pill', text: 'signin_with', locale: 'uz', width: 280 });
      if (prompt) google.accounts.id.prompt();
    });
  }
  function showLoginError(msg) { var el = $('loginErr'); el.textContent = msg; el.classList.remove('hidden'); }
  function onCredential(resp) {
    S.token = resp.credential; store('crm_token', S.token);
    $('loginErr').classList.add('hidden');
    start();
  }
  function signOut(reason) {
    store('crm_token', null); S.token = null; S.me = null;
    if (reason !== 'expired' && !DEMO && window.google && google.accounts) google.accounts.id.disableAutoSelect();
    if (reason === 'denied' || reason === 'manual') { store('crm_me', null); store('crm_leads', null); }
    showLogin(reason === 'expired');
  }

  /* ---------- Boshlash ---------- */
  function start() {
    $('login').classList.add('hidden'); $('app').classList.remove('hidden');
    var cachedMe = load('crm_me');
    if (cachedMe) { try { S.me = JSON.parse(cachedMe); renderHeader(); } catch (e) {} }
    var cached = load('crm_leads');
    if (cached) { try { S.leads = JSON.parse(cached); render(); } catch (e) {} }
    api('me').then(function (j) {
      S.me = j; store('crm_me', JSON.stringify(j));
      renderHeader(); return refresh();
    }).catch(onApiError);
  }

  function refresh() {
    if (S.loading) return Promise.resolve();
    S.loading = true; $('refresh').classList.add('spin');
    return api('leads', { operator: S.operator }).then(function (j) {
      S.leads = j.leads || [];
      if (!S.operator || S.me.user.role !== 'rahbar') store('crm_leads', JSON.stringify(S.leads));
      render();
    }).catch(onApiError).then(function () { S.loading = false; $('refresh').classList.remove('spin'); });
  }

  /* ---------- Render ---------- */
  function renderHeader() {
    var u = S.me.user;
    var h = new Date().getHours();
    $('hi').textContent = (h < 12 ? 'Xayrli tong' : h < 18 ? 'Xayrli kun' : 'Xayrli kech') + (u.role === 'rahbar' ? ' · Rahbar' : '');
    $('nm').textContent = u.name || u.email;
    var sel = $('opsel');
    if (u.role === 'rahbar') {
      sel.classList.remove('hidden');
      sel.innerHTML = '<option value="">Barcha lidlar</option>' + S.me.operatorlar.map(function (o) {
        return '<option value="' + esc(o) + '"' + (o === S.operator ? ' selected' : '') + '>' + esc(o) + '</option>';
      }).join('');
    } else sel.classList.add('hidden');
  }

  var FILTERS = [
    ['ish', 'Ishdagi'], ['yangi', 'Yangi'], ['bugun', 'Bugungi ish'], ['qizil', 'Qizil'],
    ['Qiziqish bildirdi', 'Qiziqish'], ["O'ylayapti", "O'ylayapti"], ["Ko'tarmadi", "Ko'tarmadi"],
    ['sotuv', 'Sotuv'], ['yopiq', 'Yopilgan'], ['hammasi', 'Hammasi']
  ];
  function matchFilter(l, f) {
    var h = l['Holat'] || 'Yangi', g = hGroup(h);
    switch (f) {
      case 'hammasi': return true;
      case 'ish': return g === 'new' || g === 'warm';
      case 'yangi': return g === 'new';
      case 'bugun': return isTodayWork(l);
      case 'qizil': return flags(l).length > 0;
      case 'sotuv': return g === 'good';
      case 'yopiq': return g === 'bad';
      default: return h === f;
    }
  }
  function matchQ(l) {
    if (!S.q) return true;
    var q = S.q.toLowerCase(), qd = digits(S.q);
    var hay = [l['Ism'], l['Telefon'], l['Telefon-2'], l['Shahar'], l['Izoh']].join(' ').toLowerCase();
    if (hay.indexOf(q) >= 0) return true;
    return qd.length >= 3 && digits(hay).indexOf(qd) >= 0;
  }

  function render() {
    if (!S.me) return;
    var L = S.leads;
    var cnt = function (f) { return L.filter(function (l) { return matchFilter(l, f); }).length; };
    var tiles = [['yangi', 'Yangi', 'blue'], ['bugun', 'Bugun', 'amber'], ['qizil', 'Qizil', 'red'], ['sotuv', 'Sotuv', 'green']];
    $('stats').innerHTML = tiles.map(function (t) {
      return '<button class="stat ' + t[2] + (S.filter === t[0] ? ' on' : '') + '" data-f="' + t[0] + '"><b>' + cnt(t[0]) + '</b><span>' + t[1] + '</span></button>';
    }).join('');
    $('chips').innerHTML = FILTERS.map(function (f) {
      return '<button class="chip' + (S.filter === f[0] ? ' on' : '') + '" data-f="' + esc(f[0]) + '">' + esc(f[1]) + '<i>' + cnt(f[0]) + '</i></button>';
    }).join('');

    var items = L.filter(function (l) { return matchFilter(l, S.filter) && matchQ(l); });
    if (S.filter === 'bugun') items.sort(function (a, b) { return (parseDT(a['Keyingi qadam sanasi']) || 0) - (parseDT(b['Keyingi qadam sanasi']) || 0); });
    if (!items.length) { $('list').innerHTML = '<div class="empty">Bu bo\'limda lid yo\'q</div>'; return; }
    var html = items.slice(0, S.shown).map(cardHTML).join('');
    if (items.length > S.shown) html += '<button class="more" id="more">Yana ko\'rsatish (' + (items.length - S.shown) + ')</button>';
    $('list').innerHTML = html;
  }

  function brandCls(b) { b = String(b || '').toLowerCase(); return b.indexOf('amina') >= 0 ? 'b-amina' : b.indexOf('krovat') >= 0 ? 'b-krovat' : b.indexOf('grand') >= 0 ? 'b-grand' : ''; }
  var PHONE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>';

  function cardHTML(l) {
    var h = l['Holat'] || 'Yangi', fl = flags(l), ph = phones(l);
    var sub = [l['Shahar'] && !looksPhone(l['Shahar']) ? l['Shahar'] : '', l['Soni']].filter(Boolean).join(' · ');
    var k = l['Keyingi qadam sanasi'];
    return '<article class="card' + (fl.length ? ' flag' : '') + '" data-id="' + esc(l['lead_id']) + '">' +
      '<div class="row1"><div class="name">' + esc(displayName(l)) + '</div><div class="time">' + esc(ago(l['Kelgan vaqt'])) + '</div>' +
      (ph[0] ? '<a class="callbtn" href="tel:' + ph[0] + '" data-call="1" aria-label="Qo\'ng\'iroq">' + PHONE_SVG + '</a>' : '') + '</div>' +
      '<div class="row2"><span class="pill h-' + hGroup(h) + '">' + esc(h) + '</span>' +
      (l['Brend'] ? '<span class="pill ' + brandCls(l['Brend']) + '">' + esc(l['Brend']) + '</span>' : '') +
      (S.me.user.role === 'rahbar' && !S.operator && l['Operator'] ? '<span class="pill">' + esc(l['Operator']) + '</span>' : '') +
      (k ? '<span class="meta">→ ' + esc(k) + '</span>' : '') +
      (sub ? '<span class="meta">' + esc(sub) + '</span>' : '') + '</div>' +
      (l['Izoh'] ? '<div class="note">' + esc(l['Izoh']) + '</div>' : '') +
      (fl.length ? '<div class="flags">' + fl.map(function (f) { return '<span class="flagpill">● ' + esc(f) + '</span>'; }).join('') + '</div>' : '') +
      '</article>';
  }

  /* ---------- Lid oynasi ---------- */
  function openLead(id) {
    var l = S.leads.find(function (x) { return String(x['lead_id']) === String(id); });
    if (!l) return;
    S.open = { lead: l, holat: l['Holat'] || 'Yangi', izoh: l['Izoh'] || '', keyingi: '', sifat: l['Sifat'] || '' };
    var kd = parseDT(l['Keyingi qadam sanasi']); if (kd) S.open.keyingi = iso(kd);
    S.open.orig = { holat: S.open.holat, izoh: S.open.izoh, keyingi: S.open.keyingi, sifat: S.open.sifat };
    renderSheet();
    $('scrim').classList.remove('hidden'); $('sheet').classList.remove('hidden');
    requestAnimationFrame(function () { $('scrim').classList.add('show'); $('sheet').classList.add('show'); });
    history.pushState({ sheet: 1 }, '');
  }
  function closeSheet(fromPop) {
    if (!S.open) return;
    S.open = null;
    $('scrim').classList.remove('show'); $('sheet').classList.remove('show');
    setTimeout(function () { $('scrim').classList.add('hidden'); $('sheet').classList.add('hidden'); }, 250);
    if (!fromPop && history.state && history.state.sheet) history.back();
  }

  function renderSheet() {
    var o = S.open, l = o.lead, isR = S.me.user.role === 'rahbar', ph = phones(l);
    var kv = [['Kelgan', l['Kelgan vaqt']], ['Shahar', looksPhone(l['Shahar']) ? '' : l['Shahar']], ['Soni', l['Soni']], ['Manba', l['Manba']],
      ['Operator', isR ? l['Operator'] : ''], ['Birinchi aloqa', l['Birinchi aloqa']], ['Javob tezligi', l['Javob tezligi (min)'] ? l['Javob tezligi (min)'] + ' daq' : ''],
      ['Sotuv sanasi', l['Sotuv sanasi']], ['Summa', l['Summa']], ['Takroriy', l['Takroriy']]];
    if (isR) kv = kv.concat([['Kampaniya', l['Kampaniya']], ['Reklama', l['Reklama']], ['Forma', l['Forma']]]);
    var holatlar = (S.me.holatlar || []).map(function (h) { return h.nom; });
    var t0 = today0(), add = function (n) { var d = new Date(t0); d.setDate(d.getDate() + n); return iso(d); };

    $('sheet').innerHTML = '<div class="grab"></div><div class="sh">' +
      '<div class="row2" style="margin:0"><span class="pill ' + brandCls(l['Brend']) + '">' + esc(l['Brend'] || '—') + '</span>' +
      flags(l).map(function (f) { return '<span class="flagpill">● ' + esc(f) + '</span>'; }).join('') + '</div>' +
      '<h2>' + esc(displayName(l)) + '</h2>' +
      (ph.length ? '<div class="calls">' + ph.map(function (p, i) { return '<a class="' + (i ? 'alt' : '') + '" href="tel:' + p + '">' + PHONE_SVG + esc(fmtPhone(p)) + '</a>'; }).join('') + '</div>'
        : '<div class="err" style="margin-top:12px">Telefon raqami topilmadi — jadvalni tekshiring</div>') +
      '<dl class="kv">' + kv.filter(function (r) { return String(r[1] || '').trim(); }).map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl>' +

      '<div class="lbl">Holat</div><div class="hgrid" id="hgrid">' + holatlar.map(function (h) {
        return '<button class="hopt' + (h === o.holat ? ' on' : '') + '" data-h="' + esc(h) + '">' + esc(h) + '</button>'; }).join('') + '</div>' +

      '<div class="lbl">Izoh</div><textarea id="izoh" placeholder="Mijoz nima dedi? Nima kelishildi?">' + esc(o.izoh) + '</textarea>' +

      '<div class="lbl">Keyingi qadam sanasi</div><div class="daterow">' +
        '<input type="date" id="keyingi" value="' + esc(o.keyingi) + '">' +
        [['Bugun', add(0)], ['Ertaga', add(1)], ['+3 kun', add(3)], ['+1 hafta', add(7)]].map(function (b) {
          return '<button class="hopt' + (o.keyingi === b[1] ? ' on' : '') + '" data-d="' + b[1] + '">' + b[0] + '</button>'; }).join('') +
        (o.keyingi ? '<button class="hopt" data-d="">Tozalash</button>' : '') + '</div>' +

      ((S.me.sifatlar || []).length ? '<div class="lbl">Sifat</div><div class="hgrid">' + S.me.sifatlar.map(function (s) {
        return '<button class="hopt' + (s === o.sifat ? ' on' : '') + '" data-s="' + esc(s) + '">' + esc(s) + '</button>'; }).join('') + '</div>' : '') +
      '</div>' +
      '<div class="save"><button class="btn ghost" id="cancel">Yopish</button><button class="btn" id="save">Saqlash</button></div>';
  }

  function saveLead() {
    var o = S.open; if (!o) return;
    o.izoh = $('izoh').value.trim(); o.keyingi = $('keyingi').value;
    var ch = {};
    ['holat', 'izoh', 'keyingi', 'sifat'].forEach(function (k) { if (o[k] !== o.orig[k]) ch[k] = o[k]; });
    if (!Object.keys(ch).length) { closeSheet(); return; }
    if (o.holat !== 'Yangi' && NO_NOTE_OK.indexOf(o.holat) < 0 && !o.izoh) { toast('Izoh yozing — mijoz nima dedi?'); $('izoh').focus(); return; }
    if (NEED_DATE.indexOf(o.holat) >= 0 && !o.keyingi) { toast('Keyingi qadam sanasini tanlang'); return; }

    var btn = $('save'); btn.disabled = true; btn.textContent = 'Saqlanmoqda…';
    var lead = o.lead;
    api('update', Object.assign({ leadId: lead['lead_id'], sheet: lead._sheet }, ch)).then(function (j) {
      var fresh = j.lead || Object.assign({}, lead, {
        'Holat': o.holat, 'Izoh': o.izoh, 'Sifat': o.sifat,
        'Keyingi qadam sanasi': o.keyingi ? o.keyingi.split('-').reverse().join('.') : ''
      });
      var i = S.leads.indexOf(lead); if (i >= 0) S.leads[i] = fresh;
      store('crm_leads', JSON.stringify(S.leads));
      closeSheet(); render(); toast('Saqlandi ✓');
    }).catch(function (e) { btn.disabled = false; btn.textContent = 'Saqlash'; onApiError(e); });
  }

  /* ---------- Toast ---------- */
  var tt;
  function toast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('show'); }, 2600); }

  /* ---------- Hodisalar ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-f],[data-id],[data-h],[data-d],[data-s],#more,#cancel,#save,#scrim,[data-call]');
    if (!t) return;
    if (t.dataset.call) return; // qo'ng'iroq tugmasi — kartani ochmaydi
    if (t.id === 'more') { S.shown += PAGE; render(); return; }
    if (t.id === 'cancel' || t.id === 'scrim') { closeSheet(); return; }
    if (t.id === 'save') { saveLead(); return; }
    if (t.dataset.f !== undefined) { S.filter = t.dataset.f; S.shown = PAGE; render(); window.scrollTo({ top: 0 }); return; }
    if (t.dataset.id !== undefined) { openLead(t.dataset.id); return; }
    if (!S.open) return;
    S.open.izoh = $('izoh').value; S.open.keyingi = $('keyingi').value;
    if (t.dataset.h !== undefined) S.open.holat = t.dataset.h;
    if (t.dataset.d !== undefined) S.open.keyingi = t.dataset.d;
    if (t.dataset.s !== undefined) S.open.sifat = S.open.sifat === t.dataset.s ? '' : t.dataset.s;
    var st = $('sheet').scrollTop; renderSheet(); $('sheet').scrollTop = st;
  });
  $('scrim').addEventListener('click', function () { closeSheet(); });
  window.addEventListener('popstate', function () { closeSheet(true); });
  $('q').addEventListener('input', function (e) { S.q = e.target.value.trim(); S.shown = PAGE; render(); });
  $('opsel').addEventListener('change', function (e) { S.operator = e.target.value; S.leads = []; render(); refresh(); });
  $('refresh').addEventListener('click', function () { refresh(); });
  $('logout').addEventListener('click', function () { if (confirm('Akkauntdan chiqasizmi?')) signOut('manual'); });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && S.me && !S.open) refresh();
  });
  setInterval(function () { if (S.me && !S.open && document.visibilityState === 'visible') refresh(); }, 3 * 60000);

  /* ---------- Service worker ---------- */
  if ('serviceWorker' in navigator && !DEMO && location.protocol === 'https:') {
    navigator.serviceWorker.register('/amina-crm/sw.js', { scope: '/amina-crm' }).catch(function () {});
  }

  /* ---------- Demo rejim (?demo=1 yoki ?demo=op) ---------- */
  var Demo = {
    data: null,
    api: function (action, d) {
      var self = this;
      return new Promise(function (res) {
        setTimeout(function () {
          if (!self.data) self.data = self.make();
          if (action === 'me') return res({ ok: true, user: DEMO_ROLE === 'rahbar' ? { name: 'Bonu', role: 'rahbar', email: 'demo' } : { name: 'Marjona', role: 'operator', email: 'demo' },
            holatlar: ['Yangi', "Ko'tarmadi", "Aloqa yo'q", 'Xato raqam', "Bog'lanildi", 'Qiziqish bildirdi', "O'ylayapti", 'Sexga/ofisga keldi', 'Zakaz oldi', 'Sotildi', 'Rad etdi — narx', 'Rad etdi — keyinroq', 'Viloyatdan — yetkazib bermaymiz'].map(function (n) { return { nom: n }; }),
            sifatlar: ['Issiq', 'Iliq', 'Sovuq'], operatorlar: DEMO_ROLE === 'rahbar' ? ['Marjona', 'Charos', 'Umida'] : ['Marjona'] });
          if (action === 'leads') {
            var op = DEMO_ROLE === 'rahbar' ? d.operator : 'Marjona';
            return res({ ok: true, leads: self.data.filter(function (l) { return !op || l['Operator'] === op; }) });
          }
          if (action === 'update') {
            var l = self.data.find(function (x) { return x['lead_id'] === d.leadId; });
            if (d.holat !== undefined) l['Holat'] = d.holat;
            if (d.izoh !== undefined) l['Izoh'] = d.izoh;
            if (d.sifat !== undefined) l['Sifat'] = d.sifat;
            if (d.keyingi !== undefined) l['Keyingi qadam sanasi'] = d.keyingi ? d.keyingi.split('-').reverse().join('.') : '';
            return res({ ok: true, lead: Object.assign({}, l) });
          }
        }, 250);
      });
    },
    make: function () {
      var names = ['Dilnoza Karimova', 'Sardor Toshmatov', 'Gulnora', 'Jasur aka', 'Malika Rasulova', 'Bekzod', 'Nodira opa', 'Aziz Yusupov', 'Shahnoza', 'Otabek', 'Madina', 'Rustam Aliyev', 'Zarina', 'Ulug\'bek', 'Feruza'];
      var hs = ['Yangi', 'Yangi', 'Yangi', "Ko'tarmadi", 'Qiziqish bildirdi', "O'ylayapti", "Bog'lanildi", 'Sotildi', 'Rad etdi — narx', 'Qiziqish bildirdi', 'Yangi', 'Zakaz oldi', "O'ylayapti", "Ko'tarmadi", 'Viloyatdan — yetkazib bermaymiz'];
      var notes = ['', '', '', '', '2 ta krovat, ertaga qayta tel qilaman', 'Turmush o\'rtog\'i bilan maslahatlashadi', '', 'Yetkazib berildi, 1 dona', 'Qimmat dedi', 'Sexga kelmoqchi shanba', '', '2 ta shkaf kupe 1.80', '', '', 'Samarqand'];
      var brands = ['Krovat1', 'Amina Mebel', 'Krovat1', 'Grand Mebel', 'Amina Mebel'];
      var ops = ['Marjona', 'Charos', 'Umida'];
      var now = Date.now(), out = [];
      function f(d, t) { var p = function (n) { return String(n).padStart(2, '0'); }; return p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear() + (t ? ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) : ''); }
      names.forEach(function (n, i) {
        var mins = [12, 48, 95, 300, 1500, 2900, 4300, 7300, 8600, 2000, 20, 9900, 5800, 1600, 14000][i];
        var keyd = null;
        if (['Qiziqish bildirdi', "O'ylayapti", "Bog'lanildi"].indexOf(hs[i]) >= 0 && i !== 6) { keyd = new Date(); keyd.setDate(keyd.getDate() + [0, -1, 2, 0, 1, -2][i % 6]); }
        out.push({ lead_id: String(1000 + i), 'Kelgan vaqt': f(new Date(now - mins * 60000), true), 'Ism': n, 'Telefon': '+9989' + (10000000 + i * 7311913 % 89999999), 'Telefon-2': '',
          'Shahar': i === 14 ? 'Samarqand' : 'Toshkent', 'Brend': brands[i % 5], 'Manba': i % 4 === 0 ? 'Instagram DM' : 'Lead forma', 'Soni': ['1 ta', '2-5 ta', '1-3_dona'][i % 3],
          'Sifat': ['Issiq', 'Iliq', 'Sovuq', ''][i % 4], 'Operator': ops[i % 3], 'Holat': hs[i], 'Izoh': notes[i], 'Keyingi qadam sanasi': keyd ? f(keyd) : '',
          'Kampaniya': 'Krovat1 | Lead | 15$', 'Reklama': 'Krovat 193/80 | 740k', 'Forma': 'Krovat | Lead', _sheet: ops[i % 3] });
      });
      return out;
    }
  };

  /* ---------- Ishga tushirish ---------- */
  if (DEMO) {
    document.body.insertAdjacentHTML('beforeend', '<div class="demo-badge">DEMO</div>');
    S.token = 'demo'; start();
  } else {
    var t = load('crm_token');
    if (t && tokenExp(t) > Date.now() + 60000) { S.token = t; start(); }
    else { store('crm_token', null); showLogin(true); }
  }
})();
