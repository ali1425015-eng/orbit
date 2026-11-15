/* GAME CONTROLLER — mission flow:
   day starts → (medical case?) → crisis → decision → end-of-day dynamics → night report → next day.
   After the last day: debrief quiz → mission report. */
(function (OT) {
  'use strict';
  var FX = OT.FX, $ = FX.$, E = OT.Engine, D = OT.data, H = OT.HUD, SYS = OT.SYS;
  var G = OT.Game = { st: null, exp: null };

  function show(id) { ['boot', 'map', 'game'].forEach(function (s) { $(s).classList.toggle('hidden', s !== id); }); }
  function markSeen(id) { var s = OT.store.get('seen', {}) || {}; s[id] = 1; OT.store.set('seen', s); }

  G.menu = function () {
    clearInterval(OT.EventView.timerId); FX.closeModals(); G.st = null;
    $('vignette').classList.remove('on'); show('boot'); OT.Screens.boot(G);
  };
  G.toggleLang = function () {
    OT.lang = OT.lang === 'ar' ? 'en' : 'ar'; OT.store.set('lang', OT.lang); H.applyLang();
    if (!$('boot').classList.contains('hidden')) OT.Screens.boot(G);
    else if (!$('map').classList.contains('hidden')) OT.Screens.map(G, G.exp.level, G.exp.reserve);
    else if (G.st) { H.all(G.st); if (G.st.current && !OT.EventView.locked) OT.EventView.render(G.st, G.st.current, G.onPick, true); }
  };

  /* ---------- starting missions ---------- */
  G.startMode = function (mode) {
    if (mode === 'expedition') {
      var lvl = OT.store.get('expLevel', 1) || 1;
      G.exp = { level: lvl, carryCrew: null, carryKit: null, reserve: false };
      show('map'); OT.Screens.map(G, lvl, false); return;
    }
    G.startMission({ mode: mode, profile: OT.store.get('profile', 'leo') });
  };
  G.startSector = function () {
    G.exp.snapshot = { crew: G.exp.carryCrew, kit: G.exp.carryKit };
    G.startMission({ mode: 'expedition', level: G.exp.level, carryCrew: G.exp.carryCrew, carryKit: G.exp.carryKit, reserveActive: G.exp.reserve });
  };
  G.nextSector = function () {
    var st = G.st;
    G.exp.reserve = SYS.every(function (k) { return st.res[k] >= 60; });
    G.exp.level = Math.min(30, st.level + 1); G.exp.carryCrew = st.crew; G.exp.carryKit = st.kit;
    // partial resupply between sectors (+1 of each item, capped at the starting stock)
    Object.keys(D.medkit).forEach(function (k) { G.exp.carryKit[k] = Math.min(D.medkit[k].n, (G.exp.carryKit[k] || 0) + 1); });
    OT.store.set('expLevel', G.exp.level);
    show('map'); OT.Screens.map(G, G.exp.level, G.exp.reserve);
  };
  G.retrySector = function () {
    G.exp.carryCrew = G.exp.snapshot ? G.exp.snapshot.crew : null; G.exp.carryKit = G.exp.snapshot ? G.exp.snapshot.kit : null; G.exp.reserve = false;
    show('map'); OT.Screens.map(G, G.exp.level, false);
  };

  G.startMission = function (opts) {
    FX.closeModals();
    var st = G.st = E.newMission(opts);
    OT.Telemetry.start(st, { participant: OT.store.get('pcode', ''), group: OT.store.get('pgroup', '') });
    show('game'); $('log').innerHTML = ''; $('resources').innerHTML = '';
    H.applyLang(); H.all(st);
    H.log('<b>▶</b> ' + OT.tx(D.modes[st.mode].name) + ' · ' + OT.tx(D.profiles[st.profile].name) + ' · seed ' + st.seed);
    var first = function () {
      FX.dayWipe((OT.lang === 'ar' ? 'اليوم ' : 'DAY ') + st.day, OT.tx(D.profiles[st.profile].name), function () { G.nextDay(); });
    };
    if (st.mode === 'training' && !OT.store.get('tutDone', false)) {
      // show a first scenario under the spotlight tutorial
      G.nextDay(true); setTimeout(function () { OT.Screens.tutorial(function () { OT.EventView.t0 = performance.now(); }); }, 500);
    } else first();
  };

  /* ---------- the day loop ---------- */
  G.nextDay = function () {
    var st = G.st; if (!st) return;
    H.meta(st);
    if (st.openCase) {
      var inst = st.openCase; FX.toast('🚨 ' + OT.t('medAlert') + ': ' + OT.tx(D.crew[inst.crewIdx].name), 'med');
      markSeen(inst.caseId);
      OT.MedBay.open(st, inst, function (res) {
        H.all(st);
        H.log('🩺 <b>' + OT.tx(E.caseById(inst.caseId).title) + '</b> · ' + (res.dxOk ? '✓' : '✗') + ' dx · tx ' + res.q + '/2');
        if (res.fail) { st.fail = res.fail; return G.end('fail'); }
        G.nextDay();
      });
      return;
    }
    var sc = E.nextScenario(st); markSeen(sc.id);
    OT.EventView.render(st, sc, G.onPick);
    if (D.modes[st.mode].hints) H.log('📡 ' + OT.tx(sc.title));
  };

  G.onPick = function (idx, meta) {
    var st = G.st, sc = st.current;
    var res = E.applyChoice(st, idx, meta);
    OT.Telemetry.decision(st, res.row);
    var loss = SYS.reduce(function (a, k) { return a + Math.min(0, res.real[k] || 0); }, 0);
    H.all(st, res.real);
    if (loss <= -20) { FX.shake($('game')); FX.flash('red'); OT.Audio.bad(); } else if (loss === 0) { OT.Audio.good(); }
    if (meta.reserveUsed) FX.toast('🛡️ ' + OT.t('reserve'), 'good');
    H.log('<b>' + OT.tx(sc.title) + '</b> → ' + OT.tx(sc.choices[idx].t) + ' ' + H.chips(res.real));
    if (res.fail) { st.fail = res.fail; return setTimeout(function () { G.end('fail'); }, 900); }
    setTimeout(function () {
      var rep = E.endOfDay(st);
      if (OT.AI.ready() && !rep.fail) { st.ai = OT.AI.predict(st); (st.aiHist = st.aiHist || []).push(Math.round(st.ai.p * 100)); }
      OT.Telemetry.night(st, rep);
      H.all(st, rep.passive);
      if (rep.fail) { st.fail = rep.fail; return G.end('fail'); }
      OT.Screens.night(st, rep, function () {
        st.day++;
        if (st.day > st.maxDays) return G.finish();
        FX.dayWipe((OT.lang === 'ar' ? 'اليوم ' : 'DAY ') + st.day, rep.med ? '🚨 ' + OT.t('medAlert') : '', function () { H.all(st); G.nextDay(); });
      });
    }, 1100);
  };

  /* ---------- emergency reserves ---------- */
  G.emergency = function () {
    var st = G.st; if (!st || st.emergencyUsed) return;
    var d = E.emergency(st); OT.Audio.alarm(); FX.flash('green'); H.all(st, d);
    st.history.length && (st.history[st.history.length - 1].emergencyAfter = true);
    FX.toast('⚡ ' + OT.t('emergency') + ' ' + H.chips(d), 'good'); H.log('⚡ ' + OT.t('emergency') + ' ' + H.chips(d));
  };

  /* ---------- ending ---------- */
  G.finish = function () {
    var st = G.st;
    var lastExp = st.mode === 'expedition' && st.level < 30;
    if (lastExp) return G.end('win');
    OT.Screens.quiz(st, function (q) { G.quizRes = q; G.end(q.pass ? 'win' : 'quiz', q); });
  };
  G.end = function (outcome, quiz) {
    var st = G.st; clearInterval(OT.EventView.timerId);
    var sc = E.score(st);
    OT.Telemetry.end(st, outcome, sc, quiz);
    if (outcome === 'win' && st.mode !== 'expedition') { var b = OT.store.get('best', {}) || {}; b[st.mode] = Math.max(b[st.mode] || 0, sc.total); OT.store.set('best', b); }
    if (outcome === 'win' && st.mode === 'expedition' && st.level === 30) OT.store.set('expLevel', 1);
    OT.Screens.report(G, st, outcome, quiz);
  };

  /* ---------- boot ---------- */
  function init() {
    var html = document.documentElement;
    if (OT.store.get('crt', true) === false) html.classList.add('no-crt');
    if (OT.store.get('motion', false)) html.classList.add('reduce-motion');
    if (OT.store.get('hc', false)) html.classList.add('hc');
    html.style.setProperty('--fs', (OT.store.get('fs', 15) || 15) + 'px');
    FX.stars(); FX.bindRipple(); FX.bindTips(); H.applyLang();
    $('btn-emergency').onclick = G.emergency;
    $('btn-handbook').onclick = function () { OT.Screens.handbook(); };
    $('btn-export').onclick = OT.Telemetry.exportCsv;
    $('btn-settings').onclick = function () { OT.Screens.settings(G); };
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var x = document.querySelector('#s-x, #hb-x, #as-x');
        if (x) x.click(); else if (G.st && !document.querySelector('.modal-bg')) OT.Screens.settings(G);
        return;
      }
      OT.EventView.keys(e);
    });
    document.addEventListener('pointerdown', function once() { OT.Audio.unlock(); document.removeEventListener('pointerdown', once); });
    G.menu();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(window.OT);
