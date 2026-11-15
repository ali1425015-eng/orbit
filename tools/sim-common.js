/* Shared loader + player models for the computational study (Phase A+).
   Loads the SAME engine and data files the browser uses (no copy of the rules).
   Player models are "ablations" of one decision rule: each level adds one kind of
   systems reasoning on top of the previous one, so the effect of each kind can be measured.

     score = 0.2·Σ(stocks after)                         ← every model (except random)
           + 3·min(stocks after)                         ← "weakest link / coupling" reasoning
           + 0.8·Σ(delayed negative effects)             ← "delay / stock-and-flow" reasoning
           − 0.3·dose − 10·p(medical risk)               ← "crew / human" reasoning
*/
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var root = path.join(__dirname, '..');
global.window = global;
['js/core/namespace.js', 'js/core/rng.js', 'js/data/sources.js', 'js/data/systems.js', 'js/data/scenarios-station.js',
 'js/data/scenarios-lunar.js', 'js/data/medical-cases.js', 'js/data/assessment.js', 'js/core/engine.js', 'js/core/ai.js']
  .forEach(function (f) { vm.runInThisContext(fs.readFileSync(path.join(root, f), 'utf8'), { filename: f }); });

var OT = global.OT, E = OT.Engine, SYS = OT.SYS;
var HORIZON = +(process.env.HORIZON || 3);

/* weights per player model: [weakest-link, delays, crew] ; medical: 'correct' | 'random' */
var MODELS = {
  random:    { label: 'Random',                         random: true,  med: 'random' },
  myopic:    { label: 'Myopic (today only)',            w: [0, 0, 0], med: 'correct' },
  delays:    { label: '+ Delays',                       w: [0, 1, 0], med: 'correct' },
  weakest:   { label: '+ Weakest link',                 w: [1, 0, 0], med: 'correct' },
  nocrew:    { label: '+ Weakest link + Delays',        w: [1, 1, 0], med: 'correct' },
  full:      { label: 'Heuristic (v5 strategic bot)',   w: [1, 1, 1], med: 'correct' },
  lookNoCouple: { label: 'Lookahead, no coupling knowledge', look: { couplings: false, delays: true }, med: 'correct' },
  lookNoDelay:  { label: 'Lookahead, no delay knowledge',    look: { couplings: true, delays: false }, med: 'correct' },
  systems:   { label: 'Systems thinker (full lookahead)', look: { couplings: true, delays: true }, med: 'correct' },
  systemsBadMed: { label: 'Systems thinker, random medicine', look: { couplings: true, delays: true }, med: 'random' }
};

function choiceScore(st, c, w) {
  var e = E.preview(st, c), after = {};
  SYS.forEach(function (k) { after[k] = Math.min(100, st.res[k] + (e[k] || 0)); });
  var later = 0; (c.later || []).forEach(function (l) { SYS.forEach(function (k) { if ((l.eff[k] || 0) < 0) later += l.eff[k]; }); });
  var dose = c.crew && c.crew.dose ? c.crew.dose : 0, risk = c.crew && c.crew.risk ? c.crew.risk.p * 10 : 0;
  var minv = Math.min.apply(null, SYS.map(function (k) { return after[k]; }));
  var sum = SYS.reduce(function (a, k) { return a + after[k]; }, 0);
  return sum * 0.2 + w[0] * minv * 3 + w[1] * later * 0.8 + w[2] * (-dose * 0.3 - risk);
}
/* LOOKAHEAD ("mental simulation"): copy the station, apply the option, then run the real
   night update twice (tonight + tomorrow night, no new decision) and value the result.
   Knowledge ablations remove one part of the model from the player's mental copy:
     know.couplings = false → the player does not know systems pull on each other
     know.delays    = false → the player does not know about delayed consequences  */
function cloneState(st, salt) {
  var c = JSON.parse(JSON.stringify(st, function (k, v) { return k === 'rng' ? undefined : v; }));
  c.rng = OT.makeRng((st.seed * 31 + st.day * 7 + salt) >>> 0);
  c.openCase = null;
  return c;
}
function lookValue(st, sc, idx, know) {
  var D = OT.data, savedC = D.couplings, savedP = D.positiveCoupling;
  var c = cloneState(st, idx), v;
  if (!know.couplings) { D.couplings = []; D.positiveCoupling = { from: 'bio', above: 1e9, eff: {} }; }
  try {
    var hist = c.history.length;
    var res = E.applyChoice(c, idx, {});
    if (!know.delays) c.pending = c.pending.filter(function (p) { return !(p.from === sc.id && p.due > c.day); });
    if (res.fail) return -1000;
    for (var n = 0; n < HORIZON && c.day <= c.maxDays; n++) {
      var rep = E.endOfDay(c);
      if (rep.fail) return -1000 + n * 100;
      c.day++;
    }
    var crew = c.crew.reduce(function (a, x) { return a + x.health; }, 0) / c.crew.length;
    var minv = Math.min.apply(null, SYS.map(function (k) { return c.res[k]; }));
    v = SYS.reduce(function (a, k) { return a + c.res[k]; }, 0) + 0.5 * crew;
  } finally { D.couplings = savedC; D.positiveCoupling = savedP; }
  return v;
}
function pickChoice(st, sc, model, eps) {
  var n = sc.choices.length;
  if (model.random || (eps && st.rng() < eps)) return Math.floor(st.rng() * n);
  if (model.look) {
    var b = 0, bs = -1e9;
    sc.choices.forEach(function (c, i) { if (!E.kitOk(st, c.kit)) return; var s = lookValue(st, sc, i, model.look); if (s > bs) { bs = s; b = i; } });
    return b;
  }
  var best = 0, bestScore = -1e9;
  sc.choices.forEach(function (c, i) {
    if (!E.kitOk(st, c.kit)) return;
    var s = choiceScore(st, c, model.w);
    if (s > bestScore) { bestScore = s; best = i; }
  });
  return best;
}
function pickMedical(st, inst, medMode, eps) {
  var mc = E.caseById(inst.caseId);
  if (medMode === 'random' || (eps && st.rng() < eps)) {
    var ok = mc.tx.map(function (t, i) { return i; }).filter(function (i) { return E.kitOk(st, mc.tx[i].kit); });
    return [Math.floor(st.rng() * mc.dx.length), ok.length ? ok[Math.floor(st.rng() * ok.length)] : 0];
  }
  var dx = mc.dx.findIndex(function (d) { return d.ok; });
  var order = mc.tx.map(function (t, i) { return i; }).sort(function (a, b) { return mc.tx[b].q - mc.tx[a].q; });
  var tx = order.filter(function (i) { return E.kitOk(st, mc.tx[i].kit); })[0];
  return [dx, tx === undefined ? order[order.length - 1] : tx];
}

/* Snapshot of the station after each night = the AI model's input features.
   Defined once in js/core/ai.js so the app and the training data use the same function. */
function features(st) { return OT.AI.features(st); }

/* One full mission. onNight(st) is called after every survived night (for the dataset). */
function run(mode, profile, model, seed, eps, onNight) {
  var st = E.newMission({ mode: mode, profile: profile, seed: seed });
  var decisions = [];
  while (st.day <= st.maxDays) {
    if (st.openCase) {
      var pick = pickMedical(st, st.openCase, model.med, eps);
      var r = E.resolveCase(st, st.openCase, pick[0], pick[1]);
      if (r.fail) return { win: false, fail: r.fail, day: st.day, st: st };
    }
    var sc = E.nextScenario(st);
    var idx = pickChoice(st, sc, model, eps);
    if (!E.kitOk(st, sc.choices[idx].kit)) idx = sc.choices.findIndex(function (c) { return E.kitOk(st, c.kit); });
    decisions.push(sc.id + ':' + idx);
    var res = E.applyChoice(st, idx, {});
    if (res.fail) return { win: false, fail: res.fail, day: st.day, st: st };
    var rep = E.endOfDay(st);
    if (rep.fail) return { win: false, fail: rep.fail, day: st.day, st: st };
    if (onNight && st.day < st.maxDays) onNight(st);
    st.day++;
  }
  return { win: true, st: st, day: st.maxDays };
}
function failKey(r) { return r.win ? '' : (r.fail.type === 'crew' ? 'crew' : r.fail.key); }

module.exports = { OT: OT, E: E, SYS: SYS, MODELS: MODELS, run: run, features: features, failKey: failKey, root: root };
