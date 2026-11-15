/* RESEARCH TELEMETRY — every decision becomes one row of data for the study.
   Columns are documented in docs/TELEMETRY.md. Nothing is sent anywhere: files are
   downloaded locally, so no personal data leaves the device (ISEF/IRB friendly). */
(function (OT) {
  'use strict';
  var TM = OT.Telemetry = { rows: [], meta: {} };

  TM.start = function (st, extra) {
    TM.meta = { participant: (extra && extra.participant) || '', group: (extra && extra.group) || '', mode: st.mode, profile: st.profile,
                seed: st.seed, version: OT.version, started: new Date().toISOString() };
    TM.rows = [];
  };
  TM.decision = function (st, row) {
    TM.rows.push({ type: 'decision', level: row.level, day: row.day, event: row.id, category: row.cat, choice: row.choice,
      time_ms: row.timeMs, timed_out: row.timedOut ? 1 : 0, hint_viewed: row.hint ? 1 : 0, card_flipped: row.card ? 1 : 0,
      power_before: row.before.power, prot_before: row.before.prot, air_before: row.before.air, bio_before: row.before.bio,
      power_after: row.after.power, prot_after: row.after.prot, air_after: row.after.air, bio_after: row.after.bio,
      crew_health: Math.round(st.crew.reduce(function (a, c) { return a + c.health; }, 0) / st.crew.length) });
  };
  TM.night = function (st, rep) {
    TM.rows.push({ type: 'night', level: st.level, day: st.day, event: 'couplings:' + rep.couplings.join('|'),
      power_after: st.res.power, prot_after: st.res.prot, air_after: st.res.air, bio_after: st.res.bio,
      crew_health: Math.round(st.crew.reduce(function (a, c) { return a + c.health; }, 0) / st.crew.length),
      ai_p_survive: st.ai ? Math.round(st.ai.p * 100) : '' });
  };
  TM.medical = function (st, inst, res) {
    TM.rows.push({ type: 'medical', level: st.level, day: inst.day, event: inst.caseId, choice: inst.tx,
      tools: inst.tools.join('|'), dx_correct: res.dxOk ? 1 : 0, tx_quality: res.q, time_ms: inst.timeMs || 0 });
  };
  TM.end = function (st, outcome, score, quiz) {
    TM.rows.push({ type: 'summary', level: st.level, day: st.day, event: outcome, score_total: score.total, grade: score.grade,
      dx_accuracy: score.dxAcc === null ? '' : score.dxAcc, mean_decision_s: score.avgTime, mean_dose_mSv: score.dose,
      quiz_score: quiz ? quiz.score + '/' + quiz.n : '' });
  };

  var COLS = ['participant', 'group', 'mode', 'profile', 'seed', 'version', 'type', 'level', 'day', 'event', 'category', 'choice', 'time_ms', 'timed_out',
    'hint_viewed', 'card_flipped', 'power_before', 'prot_before', 'air_before', 'bio_before', 'power_after', 'prot_after', 'air_after', 'bio_after',
    'crew_health', 'tools', 'dx_correct', 'tx_quality', 'score_total', 'grade', 'dx_accuracy', 'mean_decision_s', 'mean_dose_mSv', 'quiz_score', 'ai_p_survive'];
  function esc(v) { v = v === undefined || v === null ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  TM.csv = function () {
    var m = TM.meta;
    return COLS.join(',') + '\n' + TM.rows.map(function (r) {
      return COLS.map(function (c) { return esc(r[c] !== undefined ? r[c] : m[c]); }).join(',');
    }).join('\n');
  };
  TM.download = function (name, text, type) {
    try {
      var blob = new Blob(['﻿' + text], { type: type || 'text/plain;charset=utf-8' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    } catch (e) { /* ignore */ }
  };
  TM.stamp = function () { return (TM.meta.participant || 'anon') + '_' + TM.meta.mode + '_' + new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-'); };
  TM.exportCsv = function () { TM.download('orbital_' + TM.stamp() + '.csv', TM.csv(), 'text/csv;charset=utf-8'); };
  TM.exportJson = function () { TM.download('orbital_' + TM.stamp() + '.json', JSON.stringify({ meta: TM.meta, rows: TM.rows }, null, 2), 'application/json'); };

  /* assessment results (pre/post test) */
  TM.saveAssessment = function (rec) {
    var all = OT.store.get('assess', []); all.push(rec); OT.store.set('assess', all);
  };
  TM.exportAssessment = function () {
    var all = OT.store.get('assess', []);
    var cols = ['participant', 'group', 'phase', 'date', 'score', 'systems_score', 'content_score', 'time_s'].concat(OT.data.assessment.map(function (q, i) { return 'q' + (i + 1); }));
    var csv = cols.join(',') + '\n' + all.map(function (r) {
      return [r.participant, r.group, r.phase, r.date, r.score, r.sys, r.content, r.time].concat(r.answers).map(esc).join(',');
    }).join('\n');
    TM.download('orbital_assessment_' + new Date().toISOString().slice(0, 10) + '.csv', csv, 'text/csv;charset=utf-8');
  };
})(window.OT);
