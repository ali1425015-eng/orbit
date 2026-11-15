/* SCREENS & MODALS — boot menu, expedition map, night report, debrief quiz,
   mission report (charts), handbook, settings, guided tutorial, pre/post assessment. */
(function (OT) {
  'use strict';
  var FX = OT.FX, $ = FX.$, esc = FX.esc, D = OT.data, E = OT.Engine, SYS = OT.SYS;
  var S = OT.Screens = {};
  function L() { return OT.lang === 'ar'; }

  /* ================= BOOT ================= */
  S.boot = function (G) {
    var best = OT.store.get('best', {}), prof = OT.store.get('profile', 'leo'), exp = OT.store.get('expLevel', 1);
    var profBtns = Object.keys(D.profiles).map(function (k) { return '<button data-p="' + k + '" class="' + (k === prof ? 'on' : '') + '">' + D.profiles[k].icon + ' ' + esc(OT.tx(D.profiles[k].name)) + '</button>'; }).join('');
    var orgs = {}; Object.keys(D.sources).forEach(function (k) { if (k !== 'design') orgs[D.sources[k].org.split(' (')[0]] = 1; });
    $('boot').innerHTML = '<div class="wrap">' +
      '<div class="orbit-art"><div class="ring"></div><div class="planet"></div></div>' +
      '<div class="logo">' + (L() ? 'مقايضات مدارية' : 'ORBITAL TRADE-OFFS') + '</div>' +
      '<p class="logo-sub">' + OT.t('tagline') + '</p>' +
      '<div class="boot-opts"><span class="tag">' + OT.t('profile') + '</span><div class="seg" id="prof">' + profBtns + '</div></div>' +
      '<div class="modes">' +
        '<div class="mode-card t" data-m="training" tabindex="0"><span class="best">' + (best.training ? '★ ' + best.training : '') + '</span><div class="mi">🎓</div><h3>' + OT.t('modeTraining') + '</h3><p>' + OT.t('modeTrainingD') + '</p></div>' +
        '<div class="mode-card r" data-m="realistic" tabindex="0"><span class="best">' + (best.realistic ? '★ ' + best.realistic : '') + '</span><div class="mi">🔥</div><h3>' + OT.t('modeRealistic') + '</h3><p>' + OT.t('modeRealisticD') + '</p></div>' +
        '<div class="mode-card e" data-m="expedition" tabindex="0"><span class="best">' + (exp > 1 ? OT.t('sector') + ' ' + exp + '/30' : '') + '</span><div class="mi">🚀</div><h3>' + OT.t('modeExpedition') + '</h3><p>' + OT.t('modeExpeditionD') + '</p></div>' +
      '</div>' +
      '<details style="margin-top:16px;text-align:start" class="panel"><summary class="panel-h" style="cursor:pointer">🔬 ' + OT.t('research') + '</summary><div class="panel-b row wrap">' +
        '<label class="small">' + OT.t('participant') + '<br><input type="text" id="pcode" maxlength="20" value="' + esc(OT.store.get('pcode', '')) + '" placeholder="S-014"></label>' +
        '<label class="small">' + OT.t('group') + '<br><select id="pgroup"><option value="">—</option><option value="sim">simulator</option><option value="control">control</option></select></label>' +
        '<button class="btn sm" id="b-assess">📝 ' + OT.t('assessment') + '</button><button class="btn sm" id="b-assess-exp">📥 ' + OT.t('exportCsv') + ' (' + OT.t('assessment') + ')</button></div></details>' +
      '<div class="boot-links" style="margin-top:14px"><button class="btn" id="b-how">❓ ' + OT.t('howTo') + '</button><button class="btn" id="b-hb">📖 ' + OT.t('handbook') + '</button>' +
        '<button class="btn" id="b-set">⚙️ ' + OT.t('settings') + '</button><button class="btn" id="b-lang">🌐 ' + OT.t('langBtn') + '</button></div>' +
      '<div class="credit">' + (L() ? 'البيانات من: ' : 'Data from: ') + Object.keys(orgs).slice(0, 12).join(' · ') + ' …<br>v' + OT.version + '</div></div>';
    $('pgroup').value = OT.store.get('pgroup', '');
    $('prof').querySelectorAll('button').forEach(function (b) { b.onclick = function () { OT.store.set('profile', b.getAttribute('data-p')); $('prof').querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); }); }; });
    var saveP = function () { OT.store.set('pcode', $('pcode').value.trim()); OT.store.set('pgroup', $('pgroup').value); };
    $('boot').querySelectorAll('.mode-card').forEach(function (c) {
      var go = function () { saveP(); G.startMode(c.getAttribute('data-m')); };
      c.onclick = go; c.onkeydown = function (e) { if (e.key === 'Enter') go(); };
      c.onmouseenter = function () { OT.Audio.hover(); };
    });
    $('b-how').onclick = function () { saveP(); OT.store.set('tutDone', false); G.startMode('training'); };
    $('b-hb').onclick = function () { S.handbook(); };
    $('b-set').onclick = function () { S.settings(G); };
    $('b-lang').onclick = function () { G.toggleLang(); };
    $('b-assess').onclick = function () { saveP(); S.assessment(); };
    $('b-assess-exp').onclick = function () { OT.Telemetry.exportAssessment(); };
  };

  /* ================= EXPEDITION MAP ================= */
  S.map = function (G, level, reserve) {
    var W = 800, Hh = 460, pts = [];
    for (var i = 0; i < 30; i++) { var p = i / 29; pts.push([60 + p * 680, Hh - 50 - p * (Hh - 110) + Math.sin(p * Math.PI * 6) * 55]); }
    var path = pts.map(function (q, i) { return (i ? 'L' : 'M') + q[0].toFixed(0) + ',' + q[1].toFixed(0); }).join(' ');
    var zoneCol = function (i) { return i < 10 ? '#3fd0ff' : i < 20 ? '#b388ff' : '#d8d8e8'; };
    var dots = pts.map(function (q, i) {
      var st = i < level - 1 ? 'done' : i === level - 1 ? 'now' : '';
      return '<circle class="node-dot" cx="' + q[0] + '" cy="' + q[1] + '" r="' + (st === 'now' ? 10 : 6) + '" fill="' + (st === 'done' ? '#3dff8f' : st === 'now' ? zoneCol(i) : '#0c1428') + '" stroke="' + zoneCol(i) + '" stroke-width="2">' + (st === 'now' ? '<animate attributeName="r" values="9;13;9" dur="1.4s" repeatCount="indefinite"/>' : '') + '</circle>';
    }).join('');
    var prof = D.profiles[D.sectorProfile(level)];
    $('map').innerHTML = '<div class="wrap"><h2 class="logo" style="font-size:2.2rem">' + (L() ? 'خريطة الرحلة' : 'EXPEDITION ROUTE') + '</h2>' +
      '<p class="muted">' + OT.t('sector') + ' <b class="num">' + level + '</b>/30 · ' + prof.icon + ' ' + esc(OT.tx(prof.name)) + '</p>' +
      (reserve ? '<p class="chip up" style="margin-bottom:10px">🛡️ ' + (L() ? 'مكافأة الأداء: الدرع الاحتياطي يمتص 50% من أول خسارة' : 'Performance bonus: reserve absorbs 50% of the first loss') + '</p>' : '') +
      '<div class="mapbox"><svg viewBox="0 0 ' + W + ' ' + Hh + '" preserveAspectRatio="none"><path d="' + path + '" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="2" stroke-dasharray="6 6"/>' + dots +
      '<text class="zone" x="40" y="' + (Hh - 14) + '">◉ LEO 1–10</text><text class="zone" x="300" y="' + (Hh - 14) + '">◉ CISLUNAR 11–20</text><text class="zone" x="580" y="' + (Hh - 14) + '">◉ LUNAR SURFACE 21–30</text></svg><div id="rocket">🚀</div></div>' +
      '<p class="small muted">' + esc(OT.tx(prof.note)) + '</p>' +
      '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn" id="m-back">← ' + OT.t('menu') + '</button><button class="btn primary" id="m-go">🚀 ' + OT.t('engage') + '</button></div></div>';
    var r = $('rocket'), q = pts[Math.max(0, level - 2)], q2 = pts[level - 1];
    r.style.left = (q[0] / W * 100) + '%'; r.style.top = (q[1] / Hh * 100) + '%';
    setTimeout(function () { r.style.left = (q2[0] / W * 100) + '%'; r.style.top = (q2[1] / Hh * 100) + '%'; if (level > 1) OT.Audio.whoosh(); }, 250);
    $('m-back').onclick = function () { G.menu(); };
    $('m-go').onclick = function () { G.startSector(); };
  };

  /* ================= NIGHT REPORT ================= */
  S.night = function (st, rep, onNext) {
    var cp = rep.couplings.map(function (id) {
      var c = D.couplings.filter(function (x) { return x.id === id; })[0] || (id === D.positiveCoupling.id ? D.positiveCoupling : null);
      return c ? '<div class="small" style="margin-bottom:4px">' + (id === D.positiveCoupling.id ? '🌿' : '⚠️') + ' ' + esc(OT.tx(c.why)) + ' ' + OT.HUD.chips(c.eff || {}) + '</div>' : '';
    }).join('') || '<div class="small muted">' + OT.t('couplingNone') + '</div>';
    var pend = rep.pending.map(function (p) { var sc = D.scenarios.filter(function (s) { return s.id === p.from; })[0]; return '<div class="small">⏳ ' + esc(sc ? OT.tx(sc.title) : p.from) + ' ' + OT.HUD.chips(p.d) + '</div>'; }).join('');
    var prof = D.profiles[st.profile], dosex = st.lastCoupling.indexOf('s_c') >= 0 ? 2 : 1;
    var bg = FX.modal('<div class="panel-h"><span>🌙 ' + OT.t('nightReport') + '</span><span class="tag">' + OT.t('day') + ' ' + st.day + '</span></div><div class="panel-b">' +
      '<div class="night-hero"><span class="sun">🌘</span><h3>' + (L() ? 'نهاية اليوم ' : 'End of day ') + st.day + '</h3></div><div class="rep-grid">' +
      '<div class="rep-box"><h4>🔋 ' + OT.t('passive') + '</h4>' + OT.HUD.chips(rep.passive) + '<div class="tiny muted" style="margin-top:6px">' + (L() ? 'تسرب الهواء، تآكل الدروع، استهلاك الطعام… لا تتوقف أبداً.' : 'Air leakage, shield wear, food use… never stop.') + '</div></div>' +
      '<div class="rep-box"><h4>🔗 ' + OT.t('couplingsFired') + '</h4>' + cp + '</div>' +
      '<div class="rep-box"><h4>⏳ ' + OT.t('delayed') + '</h4>' + (pend || '<div class="small muted">—</div>') + '</div>' +
      (st.ai ? '<div class="rep-box"><h4>🤖 ' + OT.t('aiTitle') + '</h4><div class="small">' + OT.t('aiForecast') + ': <b class="num" style="color:' + (st.ai.p >= 0.7 ? 'var(--green)' : st.ai.p >= 0.4 ? 'var(--yellow)' : 'var(--red)') + '">' + Math.round(st.ai.p * 100) + '%</b></div>' +
        st.ai.risks.map(function (r) { return '<div class="tiny">⚠ ' + esc(OT.AI.label[r.k][L() ? 1 : 0]) + '</div>'; }).join('') + '</div>' : '') +
      '<div class="rep-box"><h4>👩‍🚀 ' + OT.t('crewPanel') + '</h4><div class="small">☢ +' + (prof.dose * dosex).toFixed(2) + ' mSv ' + (L() ? 'لكل فرد اليوم' : 'per person today') + (dosex > 1 ? ' <span class="chip down">×2</span>' : '') + '</div>' +
        (rep.med ? '<div class="chip med" style="margin-top:6px">🚨 ' + OT.t('medAlert') + ': ' + esc(OT.tx(D.crew[rep.med.crewIdx].name)) + '</div>' : '') + '</div>' +
      '</div><div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn primary" id="n-next">' + OT.t('continueBtn') + ' →</button></div></div>', 'narrow');
    if (rep.couplings.some(function (id) { return id !== D.positiveCoupling.id; })) OT.Audio.alarm();
    $('n-next').focus(); $('n-next').onclick = function () { bg.remove(); onNext(); };
  };

  /* ================= DEBRIEF QUIZ ================= */
  S.quiz = function (st, onDone) {
    var items = E.buildQuiz(st, OT.lang), i = 0, score = 0, marks = [];
    if (!items.length) { onDone({ score: 0, n: 0, pass: true }); return; }
    var bg = FX.modal('<div class="panel-h"><span>🎓 ' + OT.t('quizTitle') + '</span><span class="tag" id="qs"></span></div><div class="panel-b" id="qb"></div>', 'narrow');
    function draw() {
      $('qs').textContent = OT.t('score') + ' ' + score + '/' + items.length;
      var it = items[i];
      var prog = items.map(function (_, k) { return '<i class="' + (k < i ? marks[k] : k === i ? 'now' : '') + '"></i>'; }).join('');
      $('qb').innerHTML = '<p class="muted small">' + OT.t('quizSub') + '</p><div class="qprog">' + prog + '</div><h3 style="margin:10px 0">' + esc(it.q) + '</h3><div class="opts">' +
        it.opts.map(function (o, k) { return '<button class="opt" data-k="' + k + '">' + esc(o) + '</button>'; }).join('') + '</div><div id="qfb"></div>';
      $('qb').querySelectorAll('.opt').forEach(function (b) {
        b.onclick = function () {
          var k = +b.getAttribute('data-k'), ok = k === it.ans; if (ok) score++; marks[i] = ok ? 'ok' : 'no';
          $('qb').querySelectorAll('.opt').forEach(function (x, j) { x.disabled = true; if (j === it.ans) x.classList.add('right'); else if (j === k) x.classList.add('wrong'); });
          ok ? OT.Audio.good() : OT.Audio.bad();
          var src = D.sources[it.src];
          $('qfb').innerHTML = '<div class="outcome ' + (ok ? 'good' : 'bad') + '">' + esc(it.fact) + '<div class="tiny muted">' + OT.t('srcLbl') + ': ' + esc(src.org) + '</div></div><div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn primary" id="qn">' + OT.t('next') + ' →</button></div>';
          $('qn').onclick = function () { i++; if (i < items.length) draw(); else { bg.remove(); onDone({ score: score, n: items.length, pass: score >= Math.ceil(items.length * 0.6) }); } };
        };
      });
    }
    draw();
  };

  /* ================= MISSION REPORT ================= */
  function chart(st) {
    var W = 640, H = 220, pad = 30, n = st.series.power.length, keys = ['power', 'prot', 'air', 'bio', 'crew'];
    var col = { power: '#ffd23f', prot: '#b388ff', air: '#3fd0ff', bio: '#3dff8f', crew: '#ff6b9a' };
    var x = function (i) { return pad + (n <= 1 ? 0 : i / (n - 1) * (W - pad * 2)); }, y = function (v) { return H - pad - v / 100 * (H - pad * 2); };
    var grid = [0, 30, 50, 100].map(function (v) { return '<line x1="' + pad + '" x2="' + (W - pad) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="' + (v === 30 ? 'rgba(255,77,109,.5)' : 'rgba(255,255,255,.08)') + '" ' + (v === 30 ? 'stroke-dasharray="5 4"' : '') + '/><text x="4" y="' + (y(v) + 4) + '" fill="#93a4bd" font-size="10">' + v + '%</text>'; }).join('');
    var lines = keys.map(function (k) {
      var s = st.series[k]; var d = s.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(v).toFixed(1); }).join(' ');
      return '<path d="' + d + '" fill="none" stroke="' + col[k] + '" stroke-width="2.5" stroke-linejoin="round"><title>' + k + '</title></path><circle cx="' + x(s.length - 1) + '" cy="' + y(s[s.length - 1]) + '" r="3.5" fill="' + col[k] + '"/>';
    }).join('');
    var xl = ''; for (var i = 0; i < n; i++) xl += '<text x="' + x(i) + '" y="' + (H - 8) + '" fill="#93a4bd" font-size="10" text-anchor="middle">' + i + '</text>';
    var leg = keys.map(function (k, i) { return '<g transform="translate(' + (pad + i * 110) + ',12)"><rect width="12" height="4" y="-4" fill="' + col[k] + '"/><text x="16" fill="#cfe0f5" font-size="11">' + (k === 'crew' ? OT.t('crewPanel') : OT.tx(D.systems[k].short)) + '</text></g>'; }).join('');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="stocks over days">' + grid + lines + xl + leg + '<text x="' + (W - pad) + '" y="' + (y(30) - 4) + '" fill="#ff8fa3" font-size="10" text-anchor="end">' + (L() ? 'منطقة الخطر' : 'danger zone') + '</text></svg>';
  }
  S.report = function (G, st, outcome, quiz) {
    var sc = E.score(st), win = outcome === 'win';
    var title = win ? OT.t('winTitle') : OT.t('loseTitle'), reason = '';
    if (outcome === 'quiz') reason = OT.t('quizFail');
    else if (st.fail && st.fail.type === 'system') reason = OT.t('failSys') + OT.tx(D.systems[st.fail.key].name);
    else if (st.fail && st.fail.type === 'crew') reason = OT.t('failCrew') + OT.tx(D.crew[st.fail.idx].name);
    if (!win) sc.grade = 'F';
    var worst = st.history.reduce(function (a, h) { var l = SYS.reduce(function (s, k) { return s + Math.min(0, h.d[k] || 0); }, 0); return !a || l < a.l ? { h: h, l: l } : a; }, null);
    var dlog = st.history.map(function (h) {
      var s = D.scenarios.filter(function (x) { return x.id === h.id; })[0];
      return '<div class="r ' + (worst && worst.h === h ? 'worst' : '') + '"><span class="num tiny">' + (st.mode === 'expedition' ? 'S' + h.level + ' ' : '') + 'D' + h.day + '</span><b>' + esc(OT.tx(s.title)) + '</b><span class="muted">' + esc(OT.tx(s.choices[h.choice].t)) + '</span>' + OT.HUD.chips(h.d) + (h.timedOut ? '<span class="chip down">⏱</span>' : '') + '</div>';
    }).join('') + st.medHistory.map(function (m) { var mc = E.caseById(m.id); return '<div class="r"><span class="num tiny">D' + m.day + '</span><span class="chip med">🩺 ' + esc(OT.tx(mc.title)) + '</span><span class="chip ' + (m.dxOk ? 'up' : 'down') + '">' + (m.dxOk ? '✓ dx' : '✗ dx') + '</span><span class="chip ' + (m.q === 2 ? 'up' : m.q === 1 ? 'info' : 'down') + '">tx ' + m.q + '/2</span></div>'; }).join('');
    var used = {}; st.history.forEach(function (h) { var s = D.scenarios.filter(function (x) { return x.id === h.id; })[0]; used[s.src] = 1; }); st.medHistory.forEach(function (m) { used[E.caseById(m.id).src] = 1; }); used[D.profiles[st.profile].doseSrc] = 1;
    var srcs = Object.keys(used).filter(function (k) { return D.sources[k] && D.sources[k].url; }).map(function (k) { var s = D.sources[k]; return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.org) + '</a> — ' + esc(s.title) + ' (' + s.year + ')</li>'; }).join('');
    var expWin = st.mode === 'expedition' && outcome === 'win';
    var bg = FX.modal('<div class="panel-h"><span>📋 ' + OT.t('report') + '</span><span class="tag">seed ' + st.seed + '</span></div><div class="panel-b">' +
      '<div class="rep-top"><div class="gradebig g-' + sc.grade + '">' + sc.grade + '</div><div class="grow"><h2 style="color:' + (win ? 'var(--green)' : 'var(--red)') + '">' + title + '</h2><p class="muted">' + esc(reason) + '</p>' +
        (quiz && quiz.n ? '<span class="chip info">🎓 ' + quiz.score + '/' + quiz.n + '</span>' : '') + ' <span class="chip">' + OT.t('score') + ' ' + sc.total + '/100</span></div></div>' +
      '<div class="kpis"><div class="kpi"><b>' + sc.sys + '%</b><span>' + OT.t('kpiSys') + '</span></div><div class="kpi"><b>' + sc.crew + '%</b><span>' + OT.t('kpiCrew') + '</span></div>' +
        '<div class="kpi"><b>' + sc.med + '</b><span>' + OT.t('kpiMed') + '</span></div><div class="kpi"><b>' + (sc.dxAcc === null ? '—' : sc.dxAcc + '%') + '</b><span>' + OT.t('kpiDx') + '</span></div><div class="kpi"><b>' + sc.avgTime + 's</b><span>' + OT.t('kpiTime') + '</span></div></div>' +
      '<div class="chartbox panel" style="padding:10px">' + chart(st) + '</div>' +
      '<div class="rep-box" style="margin-top:10px"><h4>📈 ' + OT.t('extrapolate') + '</h4><div class="row wrap"><span class="chip down">☢ ' + OT.t('doseProj') + ': ~' + sc.dose180 + ' mSv</span><span class="chip down">🦴 ' + OT.t('boneProj') + ': ~' + sc.bone180 + '%</span>' +
        '<span class="tiny muted">' + (L() ? 'حد الجرعة المهنية: ناسا 600، ESA 1000 ملي سيفرت. المخزون يتراكم: هذا درس المخزون والتدفق.' : 'Career limits: NASA 600, ESA 1000 mSv. Stocks accumulate: that is the stock-and-flow lesson.') + '</span></div></div>' +
      '<details style="margin-top:10px" open><summary class="tag" style="cursor:pointer">🧾 ' + OT.t('decisionLog') + (worst ? ' · ' + OT.t('costliest') + ': D' + worst.h.day : '') + '</summary><div class="dlog">' + dlog + '</div></details>' +
      '<details style="margin-top:10px"><summary class="tag" style="cursor:pointer">📚 ' + OT.t('sourcesUsed') + '</summary><ul class="srcs">' + srcs + '</ul></details>' +
      '<div class="row wrap" style="justify-content:flex-end;margin-top:14px"><button class="btn sm" id="r-csv">📥 ' + OT.t('exportCsv') + '</button><button class="btn sm" id="r-json">📥 ' + OT.t('exportJson') + '</button>' +
        (st.mode === 'expedition' && !win ? '<button class="btn warn" id="r-retry">↻ ' + OT.t('retry') + '</button>' : '') +
        (expWin && st.level < 30 ? '<button class="btn primary" id="r-next">🚀 ' + OT.t('nextSector') + '</button>' : '') +
        '<button class="btn ' + (expWin ? '' : 'primary') + '" id="r-menu">' + OT.t('menu') + '</button></div></div>', 'wide');
    $('r-csv').onclick = OT.Telemetry.exportCsv; $('r-json').onclick = OT.Telemetry.exportJson;
    $('r-menu').onclick = function () { bg.remove(); G.menu(); };
    if ($('r-retry')) $('r-retry').onclick = function () { bg.remove(); G.retrySector(); };
    if ($('r-next')) $('r-next').onclick = function () { bg.remove(); G.nextSector(); };
    if (win) { OT.Audio.win(); FX.confetti(); } else { OT.Audio.lose(); FX.flash('red'); FX.shake(); }
  };

  /* ================= HANDBOOK ================= */
  S.handbook = function () {
    var seen = OT.store.get('seen', {}), tab = 'sys', all = false;
    var bg = FX.modal('<div class="panel-h"><span>📖 ' + OT.t('handbook') + '</span><button class="btn sm ghost" id="hb-x">✕</button></div><div class="panel-b">' +
      '<div class="hb-tabs"><button class="btn sm" data-t="sys">🔧 ' + OT.t('handbookSys') + '</button><button class="btn sm" data-t="med">🩺 ' + OT.t('handbookMed') + '</button><button class="btn sm" data-t="model">🔗 ' + OT.t('couplingMap') + '</button><button class="btn sm" data-t="src">📚 ' + OT.t('srcLbl') + '</button>' +
      '<input type="text" id="hb-q" placeholder="' + OT.t('search') + '" class="grow"><label class="small row"><input type="checkbox" id="hb-all"> ' + (L() ? 'عرض الكل' : 'show all') + '</label></div><div id="hb-body"></div></div>', 'wide');
    function draw() {
      var q = ($('hb-q').value || '').toLowerCase(), html = '';
      var match = function (txt) { return !q || txt.toLowerCase().indexOf(q) >= 0; };
      if (tab === 'sys') html = '<div class="hb-list">' + D.scenarios.filter(function (s) { return match(OT.tx(s.title) + OT.tx(s.fact)); }).map(function (s) {
        var open = all || seen[s.id]; var src = D.sources[s.src];
        return '<div class="hb-item ' + (open ? '' : 'locked') + '"><h4>' + esc(OT.tx(s.title)) + '</h4>' + (open ? '<div>' + esc(OT.tx(s.sys)) + '</div><p class="small"><b>✅</b> ' + esc(OT.tx(s.fact)) + '</p><div class="tiny muted">' + esc(src.org) + '</div>' : '<div class="muted small">🔒 ' + OT.t('locked') + '</div>') + '</div>';
      }).join('') + '</div>';
      if (tab === 'med') html = '<div class="hb-list">' + D.medical.filter(function (m) { return match(OT.tx(m.title) + OT.tx(m.explain)); }).map(function (m) {
        var open = all || seen[m.id]; var src = D.sources[m.src]; var dx = m.dx.filter(function (d) { return d.ok; })[0];
        return '<div class="hb-item ' + (open ? '' : 'locked') + '"><h4>🩺 ' + esc(open ? OT.tx(dx.t) : OT.tx(m.title)) + '</h4>' + (open ? '<div class="small">' + esc(OT.tx(m.explain)) + '</div><p class="small"><b>' + OT.t('preventLbl') + ':</b> ' + esc(OT.tx(m.prevent)) + '<br><b>🌍</b> ' + esc(OT.tx(m.earth)) + '</p><p class="small">✅ ' + esc(OT.tx(m.fact)) + '</p><div class="tiny muted">' + esc(src.org) + '</div>' : '<div class="muted small">🔒 ' + OT.t('locked') + '</div>') + '</div>';
      }).join('') + '</div>';
      if (tab === 'model') html = '<div class="hb-list">' + D.couplings.concat([D.positiveCoupling]).map(function (c) {
        var nm = function (k) { return k === 'crew' ? OT.t('crewPanel') : OT.tx(D.systems[k].short); };
        return '<div class="hb-item"><h4>' + esc(nm(c.from)) + ' → ' + esc(nm(c.to)) + '</h4><div class="small">' + esc(OT.tx(c.why)) + '</div><div class="tiny muted">' + (c.below ? (L() ? 'يعمل عندما يقل المصدر عن ' : 'Active when source < ') + c.below + '%' : (L() ? 'يعمل عندما يزيد عن ' : 'Active when source ≥ ') + c.above + '%') + '</div></div>';
      }).join('') + Object.keys(D.systems).map(function (k) { var s = D.systems[k]; return '<div class="hb-item"><h4>' + s.icon + ' ' + esc(OT.tx(s.name)) + '</h4><div class="small">' + esc(OT.tx(s.info)) + '</div></div>'; }).join('') + '</div>';
      if (tab === 'src') html = '<ul class="srcs">' + Object.keys(D.sources).map(function (k) { var s = D.sources[k]; return match(s.org + s.title) ? '<li>' + (s.url ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.org) + '</a>' : esc(s.org)) + ' — ' + esc(s.title) + ' (' + s.year + ')</li>' : ''; }).join('') + '</ul>';
      $('hb-body').innerHTML = html;
      bg.querySelectorAll('[data-t]').forEach(function (b) { b.classList.toggle('primary', b.getAttribute('data-t') === tab); });
    }
    bg.querySelectorAll('[data-t]').forEach(function (b) { b.onclick = function () { tab = b.getAttribute('data-t'); draw(); }; });
    $('hb-q').oninput = draw; $('hb-all').onchange = function () { all = this.checked; draw(); };
    $('hb-x').onclick = function () { bg.remove(); };
    bg.onclick = function (e) { if (e.target === bg) bg.remove(); };
    draw();
  };

  /* ================= SETTINGS ================= */
  S.settings = function (G) {
    var html = document.documentElement;
    var sw = function (id, lbl, on) { return '<label class="switch"><span>' + lbl + '</span><input type="checkbox" id="' + id + '" ' + (on ? 'checked' : '') + '></label>'; };
    var bg = FX.modal('<div class="panel-h"><span>⚙️ ' + OT.t('settings') + '</span><button class="btn sm ghost" id="s-x">✕</button></div><div class="panel-b">' +
      '<label class="switch"><span>🌐 Language / اللغة</span><button class="btn sm" id="s-lang">' + OT.t('langBtn') + '</button></label>' +
      '<label class="switch"><span>🔊 ' + OT.t('soundLbl') + '</span><input type="range" id="s-vol" min="0" max="1" step="0.05" value="' + OT.Audio.vol + '" style="max-width:180px"></label>' +
      sw('s-music', '🎵 ' + OT.t('musicLbl'), OT.Audio.music) + sw('s-ecg', '💓 ECG beep', OT.store.get('ecgbeep', true)) +
      sw('s-timer', '⏱ ' + OT.t('timerLbl'), OT.store.get('timer', true)) + sw('s-crt', '📺 ' + OT.t('crtLbl'), !html.classList.contains('no-crt')) +
      sw('s-motion', '🧘 ' + OT.t('motionLbl'), html.classList.contains('reduce-motion')) + sw('s-hc', '◐ ' + OT.t('contrastLbl'), html.classList.contains('hc')) +
      '<label class="switch"><span>🔠 ' + OT.t('textLbl') + '</span><input type="range" id="s-fs" min="13" max="19" step="1" value="' + OT.store.get('fs', 15) + '" style="max-width:180px"></label>' +
      '<div class="row wrap" style="margin-top:14px;justify-content:space-between">' + (G.st ? '<button class="btn danger" id="s-quit">🚪 ' + OT.t('menu') + '</button>' : '<span></span>') + '<button class="btn sm danger" id="s-reset">' + OT.t('resetProgress') + '</button></div></div>', 'narrow');
    $('s-x').onclick = function () { bg.remove(); };
    bg.onclick = function (e) { if (e.target === bg) bg.remove(); };
    $('s-lang').onclick = function () { bg.remove(); G.toggleLang(); };
    $('s-vol').oninput = function () { OT.Audio.setVol(this.value); };
    $('s-music').onchange = function () { OT.Audio.setMusic(this.checked); };
    $('s-ecg').onchange = function () { OT.store.set('ecgbeep', this.checked); };
    $('s-timer').onchange = function () { OT.store.set('timer', this.checked); };
    $('s-crt').onchange = function () { html.classList.toggle('no-crt', !this.checked); OT.store.set('crt', this.checked); };
    $('s-motion').onchange = function () { html.classList.toggle('reduce-motion', this.checked); OT.store.set('motion', this.checked); };
    $('s-hc').onchange = function () { html.classList.toggle('hc', this.checked); OT.store.set('hc', this.checked); };
    $('s-fs').oninput = function () { document.documentElement.style.setProperty('--fs', this.value + 'px'); OT.store.set('fs', +this.value); };
    $('s-reset').onclick = function () { ['best', 'expLevel', 'seen', 'tutDone'].forEach(function (k) { OT.store.set(k, null); }); FX.toast('✓', 'good'); };
    if ($('s-quit')) $('s-quit').onclick = function () { bg.remove(); G.menu(); };
  };

  /* ================= GUIDED TUTORIAL (spotlight) ================= */
  S.tutorial = function (onEnd) {
    var steps = OT.t('tut'), targets = ['.topbar', '#resources', '#crew-panel', '.cmap', '#choices', '#kit'], i = 0, tut = $('tut');
    tut.classList.remove('hidden');
    function place() {
      var el = document.querySelector(targets[i]); if (!el) { end(); return; }
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setTimeout(function () {
        var r = el.getBoundingClientRect(), hole = tut.querySelector('.hole'), card = tut.querySelector('.card');
        hole.style.left = (r.left - 6) + 'px'; hole.style.top = (r.top - 6) + 'px'; hole.style.width = (r.width + 12) + 'px'; hole.style.height = (r.height + 12) + 'px';
        card.innerHTML = '<div class="tag">' + (i + 1) + ' / ' + steps.length + '</div><h3>' + esc(steps[i][0]) + '</h3><p>' + esc(steps[i][1]) + '</p><div class="row between"><button class="btn sm ghost" id="tu-skip">' + OT.t('skip') + '</button><button class="btn sm primary" id="tu-next">' + (i === steps.length - 1 ? OT.t('start') : OT.t('next')) + '</button></div>';
        var top = r.bottom + 14; if (top + 200 > innerHeight) top = Math.max(10, r.top - 210);
        card.style.top = top + 'px'; card.style.left = Math.min(innerWidth - card.offsetWidth - 10, Math.max(10, r.left)) + 'px';
        $('tu-next').onclick = function () { i++; if (i < steps.length) place(); else end(); };
        $('tu-skip').onclick = end;
      }, 280);
    }
    function end() { tut.classList.add('hidden'); OT.store.set('tutDone', true); if (onEnd) onEnd(); }
    place();
  };

  /* ================= PRE/POST ASSESSMENT ================= */
  S.assessment = function () {
    var items = D.assessment, ans = [], i = 0, t0 = 0, phase = 'pre';
    var bg = FX.modal('<div class="panel-h"><span>📝 ' + OT.t('assessment') + '</span><button class="btn sm ghost" id="as-x">✕</button></div><div class="panel-b" id="as-b"></div>', 'narrow');
    $('as-x').onclick = function () { bg.remove(); };
    var pcode = OT.store.get('pcode', ''), group = OT.store.get('pgroup', '');
    function seedOf(s) { var h = 2166136261; for (var k = 0; k < s.length; k++) { h ^= s.charCodeAt(k); h = Math.imul(h, 16777619); } return h >>> 0; }
    $('as-b').innerHTML = '<p>' + OT.t('assessIntro') + '</p><div class="row wrap"><label class="small">' + OT.t('participant') + '<br><input type="text" id="as-p" value="' + esc(pcode) + '"></label>' +
      '<label class="small">' + OT.t('group') + '<br><select id="as-g"><option value="">—</option><option value="sim">simulator</option><option value="control">control</option></select></label>' +
      '<div class="seg" id="as-ph"><button data-v="pre" class="on">' + OT.t('pre') + '</button><button data-v="post">' + OT.t('post') + '</button><button data-v="delayed">' + (L() ? 'مؤجل' : 'Delayed') + '</button></div></div>' +
      '<div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn primary" id="as-go">' + OT.t('start') + '</button></div>';
    $('as-g').value = group;
    $('as-ph').querySelectorAll('button').forEach(function (b) { b.onclick = function () { phase = b.getAttribute('data-v'); $('as-ph').querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); }); }; });
    $('as-go').onclick = function () { pcode = $('as-p').value.trim(); group = $('as-g').value; t0 = Date.now(); draw(); };
    function draw() {
      var it = items[i], rng = OT.makeRng(seedOf(pcode + '#' + i)), order = rng.shuffle(it.o.en.map(function (_, k) { return k; }));
      $('as-b').innerHTML = '<div class="qprog">' + items.map(function (_, k) { return '<i class="' + (k < i ? 'ok' : k === i ? 'now' : '') + '"></i>'; }).join('') + '</div><div class="tag">' + (i + 1) + '/' + items.length + '</div><h3 style="margin:8px 0 12px">' + esc(OT.tx(it.q)) + '</h3><div class="opts">' +
        order.map(function (k) { return '<button class="opt" data-k="' + k + '">' + esc(it.o[OT.lang][k]) + '</button>'; }).join('') + '</div>';
      $('as-b').querySelectorAll('.opt').forEach(function (b) { b.onclick = function () { ans.push(+b.getAttribute('data-k')); i++; if (i < items.length) draw(); else done(); }; });
    }
    function done() {
      var sc = 0, sys = 0, con = 0; ans.forEach(function (a, k) { if (a === items[k].a) { sc++; if (items[k].k === 'systems') sys++; else con++; } });
      OT.Telemetry.saveAssessment({ participant: pcode, group: group, phase: phase, date: new Date().toISOString(), score: sc, sys: sys, content: con, time: Math.round((Date.now() - t0) / 1000), answers: ans });
      $('as-b').innerHTML = '<div class="outcome good"><b>✓ ' + OT.t('assessDone') + '</b><p>' + pcode + ' · ' + phase + '</p></div><div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn" id="as-exp">📥 ' + OT.t('exportCsv') + '</button><button class="btn primary" id="as-close">' + OT.t('close') + '</button></div>';
      $('as-exp').onclick = OT.Telemetry.exportAssessment; $('as-close').onclick = function () { bg.remove(); };
    }
  };
})(window.OT);
