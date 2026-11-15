#!/usr/bin/env node
/* PHASE A+ — REASONING-ABLATION STUDY
   Question: which kinds of systems reasoning does the simulation actually reward?
   Seven player models × 3 locations × N missions, Realistic mode, identical seeds for every model
   (so every model faces exactly the same crises: a paired design).
   Usage: node tools/ablation.js [N=5000]
   Output: research/ablation-summary.json, research/ablation-runs.csv */
'use strict';
var S = require('./sim-common'), fs = require('fs'), path = require('path');
var N = parseInt(process.argv[2], 10) || 5000;
var profiles = ['leo', 'cislunar', 'moon'];
var ORDER = ['random', 'myopic', 'lookNoDelay', 'lookNoCouple', 'systems', 'systemsBadMed', 'full'];
var rows = ['profile,model,seed,win,fail,day,mean_crew_health,mean_dose_mSv,min_final_stock'], out = [];
profiles.forEach(function (pr) {
  ORDER.forEach(function (mk) {
    var m = S.MODELS[mk], wins = 0, fails = { power: 0, prot: 0, air: 0, bio: 0, crew: 0 }, dose = 0, crew = 0, minStock = 0;
    for (var i = 0; i < N; i++) {
      var seed = 1000 + i, r = S.run('realistic', pr, m, seed, 0);
      var st = r.st, ch = st.crew.reduce(function (a, c) { return a + c.health; }, 0) / 4, ds = st.crew.reduce(function (a, c) { return a + c.dose; }, 0) / 4;
      var mn = Math.min.apply(null, S.SYS.map(function (k) { return st.res[k]; }));
      if (r.win) wins++; else fails[S.failKey(r)]++;
      dose += ds; crew += ch; minStock += Math.max(0, mn);
      rows.push([pr, mk, seed, r.win ? 1 : 0, S.failKey(r), r.day, ch.toFixed(1), ds.toFixed(2), Math.max(0, mn)].join(','));
    }
    var line = { profile: pr, model: mk, label: m.label, survival: +(100 * wins / N).toFixed(1) };
    Object.keys(fails).forEach(function (k) { line['fail_' + k] = +(100 * fails[k] / N).toFixed(1); });
    line.mean_crew_health = +(crew / N).toFixed(1); line.mean_dose_mSv = +(dose / N).toFixed(1); line.mean_min_stock = +(minStock / N).toFixed(1);
    out.push(line);
  });
});
console.table(out);
fs.writeFileSync(path.join(S.root, 'research', 'ablation-runs.csv'), rows.join('\n'));
fs.writeFileSync(path.join(S.root, 'research', 'ablation-summary.json'), JSON.stringify({ missions_per_cell: N, mode: 'realistic', date: new Date().toISOString(), results: out }, null, 2));
