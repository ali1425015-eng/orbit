/* HUD RENDERING — resources, cabin readout, crew, pharmacy, coupling map, log. */
(function (OT) {
  'use strict';
  var FX = OT.FX, $ = FX.$, esc = FX.esc, D = OT.data, SYS = OT.SYS;
  var H = OT.HUD = {};

  function barColor(v, base) { return v <= 30 ? 'var(--red)' : v <= 50 ? 'var(--orange)' : base; }

  H.applyLang = function () {
    var html = document.documentElement; html.lang = OT.lang; html.dir = OT.lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i]').forEach(function (el) { el.textContent = OT.t(el.getAttribute('data-i')); });
    $('kbd-help').textContent = OT.t('keyboard');
  };

  H.meta = function (st) {
    var prof = D.profiles[st.profile], mode = D.modes[st.mode];
    $('meta').innerHTML = '<span class="chip info">' + esc(OT.tx(mode.name)) + '</span>' +
      '<span class="chip" data-tip="' + esc(OT.tx(prof.note)) + '">' + prof.icon + ' ' + esc(OT.tx(prof.name)) + '</span>' +
      (st.mode === 'expedition' ? '<span class="chip num">' + OT.t('sector') + ' ' + st.level + '/30</span>' : '') +
      '<span class="chip num" data-tip="' + esc(OT.t('costMult')) + '">×' + OT.Engine.costMult(st).toFixed(2) + '</span>' +
      (st.reserveActive ? '<span class="chip up">🛡️ ' + OT.t('reserve') + '</span>' : '');
    var dots = ''; for (var d = 1; d <= st.maxDays; d++) dots += '<i class="' + (d < st.day ? 'done' : d === st.day ? 'now' : '') + '"></i>';
    $('daydots').innerHTML = '<span class="tag">' + OT.t('day') + ' ' + Math.min(st.day, st.maxDays) + '/' + st.maxDays + '</span>' + dots;
    var em = $('btn-emergency'); em.disabled = st.emergencyUsed; em.textContent = '⚡ ' + OT.t(st.emergencyUsed ? 'emergencyUsed' : 'emergency');
  };

  H.cabin = function (st) {
    var c = OT.Engine.cabin(st);
    var cls = function (bad, warn) { return bad ? 'bad' : warn ? 'warn' : ''; };
    $('cabin').innerHTML =
      '<span class="chip ' + cls(c.co2 > 6, c.co2 > 4) + '" data-tip="' + esc(OT.lang === 'ar' ? 'ثاني أكسيد الكربون بالمقصورة. قاعدة المحطة: ≤ 4 مم زئبق (Law 2014).' : 'Cabin CO2. ISS flight rule: ≤ 4 mmHg (Law 2014).') + '">CO₂ ' + c.co2 + ' mmHg</span>' +
      '<span class="chip ' + cls(c.spo2 < 90, c.spo2 < 94) + '" data-tip="' + esc(OT.lang === 'ar' ? 'الضغط الجزئي للأكسجين وتشبع الدم المتوقع.' : 'Oxygen partial pressure and expected blood saturation.') + '">pO₂ ' + c.ppo2 + ' kPa · SpO₂ ' + c.spo2 + '%</span>' +
      '<span class="chip ' + cls(c.temp < 19, c.temp < 21) + '">🌡 ' + c.temp + '°C</span>';
  };

  H.resources = function (st, deltas) {
    var box = $('resources');
    if (!box.children.length) {
      box.innerHTML = SYS.map(function (k) {
        var s = D.systems[k];
        return '<div class="panel res" id="res-' + k + '" data-tip="<b>' + esc(OT.tx(s.name)) + '</b><br>' + esc(OT.tx(s.info)) + '">' +
          '<div class="top"><span class="name">' + s.icon + ' <span class="rn"></span></span><span><span class="pct num"></span> <span class="unit"></span></span></div>' +
          '<div class="bar"><i class="ghost"></i><i class="fill"></i><div class="ticks"></div></div></div>';
      }).join('');
    }
    SYS.forEach(function (k) {
      var s = D.systems[k], v = st.res[k], el = $('res-' + k);
      el.setAttribute('data-tip', '<b>' + esc(OT.tx(s.name)) + '</b><br>' + esc(OT.tx(s.info)));
      el.querySelector('.rn').textContent = OT.tx(s.short);
      el.querySelector('.pct').textContent = v + '%';
      el.querySelector('.unit').textContent = (k === 'air' ? (v / 100 * s.max).toFixed(1) : Math.round(v / 100 * s.max)) + ' ' + s.unit;
      var fill = el.querySelector('.fill'), ghost = el.querySelector('.ghost');
      fill.style.width = v + '%'; fill.style.background = barColor(v, s.color);
      ghost.style.width = v + '%';
      el.classList.toggle('low', v <= 30);
      if (deltas && deltas[k]) FX.floatNum(el, deltas[k]);
    });
    $('vignette').classList.toggle('on', SYS.some(function (k) { return st.res[k] <= 20; }));
  };

  H.crew = function (st) {
    var tot = 0;
    $('crew').innerHTML = st.crew.map(function (c, i) {
      var r = D.crew[i]; tot += c.dose;
      var conds = c.conditions.map(function (cd) { var mc = OT.Engine.caseById(cd.id); return '<span class="chip med" data-tip="' + esc(OT.tx(mc.title)) + '">🩺 ' + esc(OT.tx(mc.title)).slice(0, 18) + '</span>'; }).join('');
      return '<div class="crew-card ' + (c.conditions.length ? 'sick ' : '') + (c.health <= 30 ? 'crit' : '') + '" id="crew-' + i + '">' +
        '<div class="avatar">' + r.flag + '</div><div>' +
        '<div class="nm"><span>' + esc(OT.tx(r.name)) + '</span><span class="num small">' + Math.round(c.health) + '%</span></div>' +
        '<div class="role">' + esc(OT.tx(r.role)) + '</div>' +
        '<div class="bar"><i style="width:' + c.health + '%;background:' + barColor(c.health, 'var(--crew)') + '"></i></div>' +
        '<div class="crew-stats"><span data-tip="' + esc(OT.t('dose')) + ' (mSv)">☢ ' + c.dose.toFixed(1) + '</span><span data-tip="' + esc(OT.t('bone')) + '">🦴 ' + (c.bone > 0.004 ? '−' + c.bone.toFixed(2) : '0.00') + '%</span><span data-tip="' + esc(OT.t('stress')) + '">💭 ' + Math.round(c.stress) + '</span></div>' +
        (conds ? '<div class="conds">' + conds + '</div>' : '') + '</div></div>';
    }).join('');
    $('crew-dose-avg').textContent = '☢ ' + (tot / st.crew.length).toFixed(1) + ' mSv';
  };

  H.kit = function (st) {
    $('kit').innerHTML = Object.keys(D.medkit).map(function (k) {
      var n = st.kit[k] || 0, it = D.medkit[k];
      return '<div class="kit ' + (n === 0 ? 'zero' : n <= 1 ? 'low' : '') + '" data-tip="' + esc(OT.tx(it.name)) + '">' + it.icon + '<b>' + n + '</b></div>';
    }).join('');
  };

  /* ---------- coupling map (SVG network of the 5 subsystems) ---------- */
  var POS = { power: [150, 32], prot: [266, 100], air: [222, 205], bio: [78, 205], crew: [34, 100] };
  var NODE = { power: '⚡', prot: '🛡️', air: '💨', bio: '🌱', crew: '👩‍🚀' };
  function path(a, b, bend) {
    var p = POS[a], q = POS[b], dx = q[0] - p[0], dy = q[1] - p[1], L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L, r = 25;
    var x1 = p[0] + ux * r, y1 = p[1] + uy * r, x2 = q[0] - ux * (r + 4), y2 = q[1] - uy * (r + 4);
    var mx = (x1 + x2) / 2 - uy * bend, my = (y1 + y2) / 2 + ux * bend;
    return 'M' + x1.toFixed(1) + ',' + y1.toFixed(1) + ' Q' + mx.toFixed(1) + ',' + my.toFixed(1) + ' ' + x2.toFixed(1) + ',' + y2.toFixed(1);
  }
  H.cmap = function (st) {
    var on = st.lastCoupling || [], crewAvg = Math.round(st.crew.reduce(function (a, c) { return a + c.health; }, 0) / st.crew.length);
    var val = { power: st.res.power, prot: st.res.prot, air: st.res.air, bio: st.res.bio, crew: crewAvg };
    var col = { power: 'var(--power)', prot: 'var(--prot)', air: 'var(--air)', bio: 'var(--bio)', crew: 'var(--crew)' };
    var links = D.couplings.map(function (c) { return '<path class="link ' + (on.indexOf(c.id) >= 0 ? 'on' : '') + '" d="' + path(c.from, c.to, 14) + '"><title>' + esc(OT.tx(c.why)) + '</title></path>'; }).join('');
    var pc = D.positiveCoupling; links += '<path class="link pos ' + (on.indexOf(pc.id) >= 0 ? 'on' : '') + '" d="' + path(pc.from, pc.to, -26) + '"><title>' + esc(OT.tx(pc.why)) + '</title></path>';
    var nodes = Object.keys(POS).map(function (k) {
      var lbl = k === 'crew' ? OT.t('crewPanel') : OT.tx(D.systems[k].short);
      return '<g class="node" transform="translate(' + POS[k][0] + ',' + POS[k][1] + ')"><circle r="24" stroke="' + (val[k] < 40 ? 'var(--red)' : col[k]) + '"/>' +
        '<text y="-2">' + NODE[k] + '</text><text class="v" y="12">' + val[k] + '%</text><text y="40" style="font-size:10px;fill:var(--mut)">' + esc(lbl) + '</text></g>';
    }).join('');
    var defs = '<defs>' + [['arr', 'rgba(150,170,200,.4)'], ['arrR', '#ff4d6d'], ['arrG', '#3dff8f']].map(function (m) {
      return '<marker id="' + m[0] + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + m[1] + '"/></marker>'; }).join('') + '</defs>';
    var why = on.map(function (id) {
      var c = D.couplings.filter(function (x) { return x.id === id; })[0] || (id === pc.id ? pc : null);
      return c ? '<div class="why ' + (id === pc.id ? 'pos' : '') + '">' + (id === pc.id ? '🌿 ' : '⚠️ ') + esc(OT.tx(c.why)) + '</div>' : '';
    }).join('') || '<div class="legend">' + OT.t('couplingNone') + '</div>';
    $('cmap').innerHTML = '<svg viewBox="0 0 300 250" role="img" aria-label="coupling map">' + defs + links + nodes + '</svg>' + why;
  };

  H.log = function (html) {
    var l = $('log'), t = new Date().toTimeString().slice(0, 5);
    l.insertBefore(FX.h('<div><span class="dim">' + t + '</span> ' + html + '</div>'), l.firstChild);
    while (l.children.length > 60) l.removeChild(l.lastChild);
  };

  /* AI Flight Director: forecast gauge + trend + top concerns */
  H.ai = function (st) {
    var box = $('ai'); if (!box) return;
    if (!OT.AI.ready()) { $('ai-panel').style.display = 'none'; return; }
    var M = OT.AI.model;
    $('ai-tag').setAttribute('data-tip', esc(OT.t('aiTip').replace('{tr}', M.train_missions.toLocaleString('en')).replace('{te}', M.test_missions.toLocaleString('en'))
      .replace('{acc}', (M.test_accuracy * 100).toFixed(1)).replace('{auc}', M.test_auc.toFixed(2))));
    if (!st.ai) { box.innerHTML = '<div class="small muted">' + OT.t('aiWait') + '</div>'; return; }
    var p = Math.round(st.ai.p * 100), hist = st.aiHist || [p], prev = hist.length > 1 ? hist[hist.length - 2] : null;
    var col = p >= 70 ? 'var(--green)' : p >= 40 ? 'var(--yellow)' : 'var(--red)';
    var R = 30, C = 2 * Math.PI * R, arc = C * p / 100;
    var trend = prev === null ? '' : '<span class="chip ' + (p >= prev ? 'up' : 'down') + ' num">' + (p >= prev ? '▲ +' : '▼ ') + (p - prev) + '</span>';
    var w = 120, h = 30, pts = hist.map(function (v, i) { return (hist.length === 1 ? w : i * w / (hist.length - 1)).toFixed(1) + ',' + (h - v / 100 * h).toFixed(1); }).join(' ');
    var L = OT.lang === 'ar' ? 1 : 0;
    var why = st.ai.risks.length ? '<div class="tiny muted">' + OT.t('aiWhy') + '</div>' + st.ai.risks.map(function (r) { return '<div class="small ai-risk">⚠ ' + esc(OT.AI.label[r.k][L]) + '</div>'; }).join('') : '<div class="small" style="color:var(--green)">✓ ' + OT.t('aiOk') + '</div>';
    box.innerHTML = '<div class="ai-row"><svg class="ai-gauge" viewBox="0 0 76 76" aria-label="' + p + '%"><circle cx="38" cy="38" r="' + R + '" class="trk"/>' +
      '<circle cx="38" cy="38" r="' + R + '" class="val" style="stroke:' + col + ';stroke-dasharray:' + arc.toFixed(1) + ' ' + C.toFixed(1) + '"/>' +
      '<text x="38" y="43" text-anchor="middle" class="num">' + p + '%</text></svg>' +
      '<div class="ai-txt"><div class="tiny muted">' + OT.t('aiForecast') + ' ' + trend + '</div>' +
      '<svg class="ai-spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none"><polyline points="' + pts + '" style="stroke:' + col + '"/></svg>' + why + '</div></div>';
  };

  H.all = function (st, deltas) { H.meta(st); H.cabin(st); H.resources(st, deltas); H.ai(st); H.crew(st); H.kit(st); H.cmap(st); };

  /* effect chips used by choices, reports, medbay */
  H.chips = function (eff, extra) {
    var out = SYS.filter(function (k) { return eff && eff[k]; }).map(function (k) {
      var v = eff[k]; return '<span class="chip ' + (v > 0 ? 'up' : 'down') + '">' + D.systems[k].icon + ' ' + (v > 0 ? '+' : '') + v + '%</span>';
    });
    return out.join('') + (extra || '');
  };
})(window.OT);
