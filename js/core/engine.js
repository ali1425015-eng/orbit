/* SIMULATION ENGINE — pure logic, no DOM.
   The same file is loaded by the browser and by tools/montecarlo.js (Node),
   so the balance test checks exactly the code that students play. */
(function (OT) {
  'use strict';
  var D = OT.data, SYS = OT.SYS, clamp = OT.clamp;

  function crewFrom(roster) {
    return roster.map(function (c) {
      return { id: c.id, health: 100, stress: 20, dose: 0, bone: 0, conditions: [], noExercise: 0 };
    });
  }

  var E = OT.Engine = {};

  /* ---------- mission setup ---------- */
  E.newMission = function (opts) {
    var mode = D.modes[opts.mode];
    var seed = opts.seed || OT.newSeed();
    var st = {
      seed: seed, rng: OT.makeRng(seed), mode: opts.mode, level: opts.level || 1,
      profile: opts.profile || (opts.mode === 'expedition' ? D.sectorProfile(opts.level || 1) : 'leo'),
      day: 1, maxDays: mode.days,
      res: { power: 100, prot: 100, air: 100, bio: 100 },
      crew: opts.carryCrew ? JSON.parse(JSON.stringify(opts.carryCrew)) : crewFrom(D.crew),
      kit: opts.carryKit ? JSON.parse(JSON.stringify(opts.carryKit)) : (function () { var km = (D.modes[opts.mode] && D.modes[opts.mode].kit) || 1, k = {}; Object.keys(D.medkit).forEach(function (i) { k[i] = Math.max(1, Math.round(D.medkit[i].n * km)); }); return k; })(),
      flags: { commsDown: 0 }, pending: [], risks: [], used: {}, usedMed: {},
      history: [], medHistory: [], events: [],
      series: { power: [100], prot: [100], air: [100], bio: [100], crew: [100] },
      lastCoupling: [], emergencyUsed: false, reserveActive: !!opts.reserveActive,
      stats: { decisions: 0, timeSum: 0, timeouts: 0, hints: 0, cards: 0, dxRight: 0, dxTotal: 0, txSum: 0, tools: 0 }
    };
    if (opts.carryCrew) {
      st.crew.forEach(function (c) { c.health = clamp(c.health + 30, 0, 100); c.conditions = []; c.stress = clamp(c.stress - 15, 0, 100); });
    }
    return st;
  };

  E.modeCfg = function (st) { return D.modes[st.mode]; };
  E.costMult = function (st) {
    var m = D.modes[st.mode].costMult;
    if (st.mode === 'expedition') m = Math.min(1.45, 1.0 + (st.level - 1) * 0.016);
    return m;
  };

  /* ---------- effects ---------- */
  E.scaledEff = function (st, eff, mult) {
    var out = {}, m = mult || E.costMult(st);
    SYS.forEach(function (k) {
      var v = (eff && eff[k]) || 0;
      if (v < 0) v = Math.round(v * m);
      if (v) out[k] = v;
    });
    return out;
  };
  E.applyEff = function (st, eff) {
    var real = {};
    SYS.forEach(function (k) {
      if (!eff[k]) return;
      var before = st.res[k];
      st.res[k] = clamp(Math.round(st.res[k] + eff[k]), 0, 100);
      real[k] = st.res[k] - before;
    });
    return real;
  };
  E.kitOk = function (st, kit) {
    if (!kit) return true;
    return Object.keys(kit).every(function (i) { return (st.kit[i] || 0) >= kit[i]; });
  };
  E.useKit = function (st, kit) { if (kit) Object.keys(kit).forEach(function (i) { st.kit[i] = Math.max(0, (st.kit[i] || 0) - kit[i]); }); };

  /* ---------- scenario selection ---------- */
  E.pool = function (st) {
    return D.scenarios.filter(function (s) { return s.where.indexOf(st.profile) >= 0; });
  };
  E.survivable = function (st, sc) {
    var m = E.costMult(st);
    return sc.choices.some(function (c) {
      var e = E.scaledEff(st, c.eff, m);
      return SYS.every(function (k) { return st.res[k] + (e[k] || 0) > 0; }) && E.kitOk(st, c.kit);
    });
  };
  E.nextScenario = function (st) {
    var pool = E.pool(st).filter(function (s) { return !st.used[s.id]; });
    if (!pool.length) { st.used = {}; pool = E.pool(st); }
    pool = st.rng.shuffle(pool);
    var lastCat = st.history.slice(-2).map(function (h) { return h.cat; });
    var pick = null;
    for (var i = 0; i < pool.length; i++) {
      var s = pool[i];
      if (!E.survivable(st, s)) continue;               // safety filter: never deal an impossible day
      if (lastCat.length === 2 && lastCat[0] === s.cat && lastCat[1] === s.cat) continue; // variety
      pick = s; break;
    }
    if (!pick) pick = pool[0];
    st.used[pick.id] = true;
    st.current = pick;
    return pick;
  };

  /* ---------- decisions ---------- */
  E.preview = function (st, choice) { return E.scaledEff(st, choice.eff, E.costMult(st)); };

  E.applyChoice = function (st, idx, meta) {
    meta = meta || {};
    var sc = st.current, ch = sc.choices[idx], m = E.costMult(st);
    if (st.reserveActive && ch.eff && SYS.some(function (k) { return (ch.eff[k] || 0) < 0; })) { m *= 0.5; st.reserveActive = false; meta.reserveUsed = true; }
    var before = JSON.parse(JSON.stringify(st.res));
    var real = E.applyEff(st, E.scaledEff(st, ch.eff, m));
    E.useKit(st, ch.kit);

    var cr = ch.crew || {}, prof = D.profiles[st.profile];
    var doseFactor = st.profile === 'leo' ? 1 : (st.profile === 'moon' ? 1.4 : 1.6);
    var evaIdx = Math.floor(st.rng() * st.crew.length);
    if (cr.dose) {
      st.crew.forEach(function (c, i) { if (!cr.eva || i === evaIdx) c.dose += cr.dose * doseFactor; });
    }
    if (cr.health) st.crew.forEach(function (c) { c.health = clamp(c.health + cr.health, 0, 100); });
    if (cr.stress) st.crew.forEach(function (c) { c.stress = clamp(c.stress + cr.stress, 0, 100); });
    if (cr.noExercise) st.crew.forEach(function (c) { c.noExercise = Math.max(c.noExercise, cr.noExercise); });
    if (cr.risk) st.risks.push({ caseId: cr.risk.case, p: cr.risk.p, crewIdx: cr.eva ? evaIdx : Math.floor(st.rng() * st.crew.length) });
    (ch.later || []).forEach(function (l) { st.pending.push({ due: st.day + l.in, eff: l.eff, from: sc.id }); });
    if (ch.flag && ch.flag.commsDown) st.flags.commsDown = Math.max(st.flags.commsDown, ch.flag.commsDown);

    st.stats.decisions++; st.stats.timeSum += meta.timeMs || 0;
    if (meta.timedOut) st.stats.timeouts++;
    var row = { day: st.day, level: st.level, id: sc.id, cat: sc.cat, choice: idx, d: real, before: before, after: JSON.parse(JSON.stringify(st.res)),
                timeMs: meta.timeMs || 0, timedOut: !!meta.timedOut, hint: !!meta.hint, card: !!meta.card, reserveUsed: !!meta.reserveUsed };
    st.history.push(row);
    return { real: real, row: row, fail: E.checkFail(st) };
  };

  /* ---------- cabin physiology (educational approximations) ---------- */
  E.cabin = function (st) {
    var a = st.res.air;
    var co2 = 1.5 + (100 - a) * 0.08;                    // mmHg (ISS range 1–9; Law et al. 2014)
    var ppo2 = 21.2 * (0.70 + 0.30 * a / 100);           // kPa (sea level ≈ 21.2)
    var spo2 = ppo2 >= 21 ? 98 : ppo2 >= 19 ? 97 : ppo2 >= 17.5 ? 95 : ppo2 >= 16.5 ? 93 : ppo2 >= 15.5 ? 90 : 87;
    var temp = st.res.prot >= 50 ? 22 : 22 - (50 - st.res.prot) * 0.09;
    return { co2: OT.round1(co2), ppo2: OT.round1(ppo2), spo2: spo2, temp: OT.round1(temp) };
  };
  E.vitals = function (st, i, caseInst) {
    var c = st.crew[i], cab = E.cabin(st), v = caseInst ? (D.medical.filter(function (m) { return m.id === caseInst.caseId; })[0] || {}).vitals || {} : {};
    return {
      hr: Math.round(66 + c.stress * 0.15 + (100 - c.health) * 0.12 + (v.hr || 0)),
      sbp: Math.round(118 + c.stress * 0.08 + (v.sbp || 0)),
      spo2: clamp(cab.spo2 + (v.spo2 || 0), 70, 100),
      temp: OT.round1(36.7 + (v.temp || 0)),
      rr: Math.round(14 + (v.rr || 0) + (cab.co2 > 6 ? 2 : 0))
    };
  };

  /* ---------- end of day: passive flows, couplings, crew physiology, medical triggers ---------- */
  E.endOfDay = function (st) {
    var mode = D.modes[st.mode], P = D.passive, rep = { passive: {}, couplings: [], pending: [], crew: {}, med: null };
    // 1. passive drains
    var drain = {};
    var adj = (P.profileAdj && P.profileAdj[st.profile]) || {};
    SYS.forEach(function (k) { drain[k] = -Math.max(0, Math.round((P.drain[k] + (adj[k] || 0)) * mode.passive * (st.mode === 'expedition' ? (1 + (st.level - 1) * 0.01) : 1))); });
    rep.passive = E.applyEff(st, drain);
    // 2. delayed consequences
    st.pending = st.pending.filter(function (p) {
      if (p.due <= st.day) { rep.pending.push({ from: p.from, d: E.applyEff(st, E.scaledEff(st, p.eff)) }); return false; }
      return true;
    });
    // 3. couplings (system of systems)
    var crewAvg = st.crew.reduce(function (a, c) { return a + c.health; }, 0) / st.crew.length;
    var lvl = function (k) { return k === 'crew' ? crewAvg : st.res[k]; };
    var fired = [], dosex = 1, crewHealth = 0;
    D.couplings.forEach(function (cp) {
      if (lvl(cp.from) < cp.below) {
        fired.push(cp.id);
        if (cp.eff) E.applyEff(st, cp.eff);
        if (cp.dose) dosex = cp.dose;
        if (cp.health) crewHealth += cp.health;
      }
    });
    var pc = D.positiveCoupling;
    if (st.res[pc.from] >= pc.above) { E.applyEff(st, pc.eff); fired.push(pc.id); }
    st.lastCoupling = fired; rep.couplings = fired;
    // 4. crew physiology
    var prof = D.profiles[st.profile];
    st.crew.forEach(function (c) {
      c.dose += prof.dose * dosex;
      var exercise = st.res.power >= 40 && c.health >= 40 && c.noExercise <= 0;
      c.bone += exercise ? P.bone.exercise : P.bone.noExercise;
      if (c.noExercise > 0) c.noExercise--;
      var h = crewHealth;
      c.conditions.forEach(function (cd) { h -= cd.sev; if (cd.left !== undefined) { cd.left--; } });
      c.conditions = c.conditions.filter(function (cd) { return cd.left === undefined || cd.left > 0; });
      if (!c.conditions.length && st.res.bio >= 50 && st.res.air >= 50) h += 2;
      if (c.stress > 70) h -= 2;
      c.health = clamp(c.health + h, 0, 100);
      c.stress = clamp(c.stress + (st.res.bio >= 50 ? -3 : 2), 0, 100);
    });
    if (st.flags.commsDown > 0) st.flags.commsDown--;
    // 5. series for charts
    SYS.forEach(function (k) { st.series[k].push(st.res[k]); });
    st.series.crew.push(Math.round(st.crew.reduce(function (a, c) { return a + c.health; }, 0) / st.crew.length));
    // 6. medical case for tomorrow morning
    rep.med = E.pickMedical(st);
    rep.fail = E.checkFail(st);
    return rep;
  };

  /* ---------- medical triggers ---------- */
  E.caseById = function (id) { return D.medical.filter(function (m) { return m.id === id; })[0]; };
  E.pickMedical = function (st) {
    var rng = st.rng, cab = E.cabin(st), mode = D.modes[st.mode];
    var risks = st.risks; st.risks = [];
    // a) consequences of earlier engineering choices
    for (var i = 0; i < risks.length; i++) {
      var r = risks[i], mc = E.caseById(r.caseId);
      if (mc && mc.where.indexOf(st.profile) >= 0 && rng() < r.p) return E.openCase(st, mc, r.crewIdx);
    }
    // b) state-triggered (coupling between station systems and the body)
    var hasHypoxia = st.crew.some(function (c) { return c.conditions.some(function (cd) { return cd.id === 'hypoxia'; }); });
    if (cab.spo2 <= 92 && !hasHypoxia && rng() < 0.8) return E.openCase(st, E.caseById('hypoxia'));
    if (st.res.air < 50 && !st.usedMed.co2head) {
      var p = Math.min(0.85, 0.15 * Math.pow(2, cab.co2 - 4));   // odds double per +1 mmHg (Law 2014), game-scaled
      if (rng() < p) return E.openCase(st, E.caseById('co2head'));
    }
    // c) background illness
    if (rng() < mode.medP) {
      var day = st.day;
      var pool = D.medical.filter(function (m) {
        return m.trigger.type === 'random' && m.where.indexOf(st.profile) >= 0 && !st.usedMed[m.id] &&
               (m.trigger.minDay === undefined || day >= m.trigger.minDay) && (m.trigger.maxDay === undefined || day <= m.trigger.maxDay);
      });
      if (pool.length) return E.openCase(st, rng.pick(pool));
    }
    return null;
  };
  E.openCase = function (st, mc, crewIdx) {
    if (!mc) return null;
    var idx = crewIdx !== undefined ? crewIdx : Math.floor(st.rng() * st.crew.length);
    var healthy = st.crew.map(function (c, i) { return i; }).filter(function (i) { return st.crew[i].health > 0; });
    if (healthy.indexOf(idx) < 0) idx = healthy[0] || 0;
    st.usedMed[mc.id] = true;
    st.crew[idx].conditions.push({ id: mc.id, sev: mc.sev });
    var inst = { caseId: mc.id, crewIdx: idx, day: st.day + 1, tools: [], dx: null, tx: null };
    st.openCase = inst;
    return inst;
  };
  E.toolAvailable = function (st, tool) {
    var t = D.tools[tool];
    if (t.needsComms && st.flags.commsDown > 0) return { ok: false, why: 'comms' };
    if (t.kit && !E.kitOk(st, t.kit)) return { ok: false, why: 'kit' };
    return { ok: true };
  };
  E.useTool = function (st, inst, tool) {
    if (inst.tools.indexOf(tool) >= 0) return null;
    var av = E.toolAvailable(st, tool); if (!av.ok) return av;
    var t = D.tools[tool];
    E.applyEff(st, t.cost || {}); E.useKit(st, t.kit);
    inst.tools.push(tool); st.stats.tools++;
    var mc = E.caseById(inst.caseId);
    return { ok: true, finding: tool === 'vitals' ? null : mc.findings[tool] };
  };
  E.resolveCase = function (st, inst, dxIdx, txIdx) {
    var mc = E.caseById(inst.caseId), c = st.crew[inst.crewIdx], tx = mc.tx[txIdx];
    var dxOk = !!mc.dx[dxIdx].ok;
    E.useKit(st, tx.kit); if (tx.eff) E.applyEff(st, tx.eff);
    var cond = c.conditions.filter(function (cd) { return cd.id === mc.id; })[0];
    if (tx.q === 2) { c.health = clamp(c.health + 15, 0, 100); c.conditions = c.conditions.filter(function (cd) { return cd !== cond; }); }
    else if (tx.q === 1) { c.health = clamp(c.health + 4, 0, 100); if (cond) { cond.sev = Math.ceil(cond.sev / 2); cond.left = 2; } }
    else { c.health = clamp(c.health - 10, 0, 100); }
    st.stats.dxTotal++; if (dxOk) st.stats.dxRight++; st.stats.txSum += tx.q;
    inst.dx = dxIdx; inst.tx = txIdx; inst.dxOk = dxOk; inst.q = tx.q;
    st.medHistory.push({ day: inst.day, level: st.level, id: mc.id, crew: inst.crewIdx, tools: inst.tools.slice(), dxOk: dxOk, q: tx.q, kitShort: false });
    st.openCase = null;
    return { dxOk: dxOk, q: tx.q, fail: E.checkFail(st) };
  };

  /* ---------- emergency contingency (once per mission) ---------- */
  E.emergency = function (st) {
    if (st.emergencyUsed) return null;
    st.emergencyUsed = true;
    var low = SYS.filter(function (k) { return st.res[k] < 50; }), eff = {};
    (low.length ? low : SYS).forEach(function (k) { eff[k] = low.length ? 20 : 10; });
    return E.applyEff(st, eff);
  };

  /* ---------- failure & scoring ---------- */
  E.checkFail = function (st) {
    for (var i = 0; i < SYS.length; i++) if (st.res[SYS[i]] <= 0) return { type: 'system', key: SYS[i] };
    for (var j = 0; j < st.crew.length; j++) if (st.crew[j].health <= 0) return { type: 'crew', idx: j };
    return null;
  };
  E.score = function (st) {
    var sys = SYS.reduce(function (a, k) { return a + st.res[k]; }, 0) / 4;
    var crew = st.crew.reduce(function (a, c) { return a + c.health; }, 0) / st.crew.length;
    var s = st.stats, med = s.dxTotal ? (s.dxRight / s.dxTotal) * 60 + (s.txSum / (2 * s.dxTotal)) * 40 : 100;
    var total = Math.round(0.4 * sys + 0.3 * crew + 0.3 * med);
    var grade = total >= 90 ? 'S' : total >= 80 ? 'A' : total >= 65 ? 'B' : total >= 50 ? 'C' : 'D';
    var days = Math.max(1, st.series.power.length - 1);
    var dose = st.crew.reduce(function (a, c) { return a + c.dose; }, 0) / st.crew.length;
    var bone = st.crew.reduce(function (a, c) { return a + c.bone; }, 0) / st.crew.length;
    return { total: total, grade: grade, sys: Math.round(sys), crew: Math.round(crew), med: Math.round(med),
             dxAcc: s.dxTotal ? Math.round(100 * s.dxRight / s.dxTotal) : null,
             avgTime: s.decisions ? Math.round(s.timeSum / s.decisions / 100) / 10 : 0,
             dose: OT.round1(dose), dose180: Math.round(dose / days * 180), bone: OT.round1(bone), bone180: OT.round1(bone / days * 180) };
  };

  /* ---------- debrief quiz from what this crew actually lived through ---------- */
  E.buildQuiz = function (st, lang) {
    var rng = st.rng, items = [];
    var seen = {};
    st.history.forEach(function (h) { var sc = D.scenarios.filter(function (s) { return s.id === h.id; })[0]; if (sc && sc.quiz && !seen[sc.id]) { seen[sc.id] = 1; items.push({ q: sc.quiz, src: sc.src, fact: sc.fact }); } });
    st.medHistory.forEach(function (h) { var mc = E.caseById(h.id); if (mc && mc.quiz && !seen[mc.id]) { seen[mc.id] = 1; items.push({ q: mc.quiz, src: mc.src, fact: mc.fact }); } });
    items = rng.shuffle(items).slice(0, 8);
    return items.map(function (it) {
      var opts = it.q.o[lang].map(function (x, i) { return { x: x, ok: i === 0 }; });
      opts = rng.shuffle(opts);
      return { q: it.q.q[lang], opts: opts.map(function (o) { return o.x; }), ans: opts.findIndex(function (o) { return o.ok; }), fact: it.fact[lang], src: it.src };
    });
  };
})(window.OT);
