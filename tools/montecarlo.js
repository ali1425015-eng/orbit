#!/usr/bin/env node
/* MONTE CARLO VALIDATION (Phase A).
   Loads the SAME engine and data files the browser uses (via tools/sim-common.js) and plays
   thousands of missions with two players:
     random  : picks any option, any diagnosis/treatment
     systems : "systems thinker" — mentally simulates each option through the real night model
               (drains, couplings, delayed effects) for 3 nights, picks the best; correct medicine
   Usage:  node tools/montecarlo.js [missions=5000] [--csv out.csv]  */
'use strict';
var S = require('./sim-common'), fs = require('fs'), path = require('path');
var N = parseInt(process.argv[2], 10) || 5000;
var csvIdx = process.argv.indexOf('--csv'), csvPath = csvIdx > 0 ? process.argv[csvIdx + 1] : null;
var rows = [], out = [];
[['training', 'leo'], ['realistic', 'leo'], ['realistic', 'cislunar'], ['realistic', 'moon']].forEach(function (cb) {
  ['random', 'systems'].forEach(function (bot) {
    var wins = 0, fails = { power: 0, prot: 0, air: 0, bio: 0, crew: 0 }, dose = 0, cases = 0;
    for (var i = 0; i < N; i++) {
      var r = S.run(cb[0], cb[1], S.MODELS[bot], 1000 + i, 0);
      if (r.win) wins++; else fails[S.failKey(r)]++;
      dose += r.st.crew.reduce(function (a, c) { return a + c.dose; }, 0) / 4;
      cases += r.st.medHistory.length;
      if (csvPath) rows.push([cb[0], cb[1], bot, 1000 + i, r.win ? 1 : 0, S.failKey(r), r.day].join(','));
    }
    var line = { mode: cb[0], profile: cb[1], bot: bot, survival: +(100 * wins / N).toFixed(1) };
    Object.keys(fails).forEach(function (k) { line['fail_' + k] = +(100 * fails[k] / N).toFixed(1); });
    line.meanDose_mSv = +(dose / N).toFixed(1); line.medCases = +(cases / N).toFixed(2);
    out.push(line);
  });
});
console.table(out);
if (csvPath) { fs.writeFileSync(csvPath, 'mode,profile,bot,seed,win,fail,day\n' + rows.join('\n')); console.log('CSV written: ' + csvPath); }
fs.writeFileSync(path.join(S.root, 'research', 'montecarlo-summary.json'), JSON.stringify({ missions: N, version: 'v7', date: new Date().toISOString(), results: out }, null, 2));
