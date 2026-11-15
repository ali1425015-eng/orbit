#!/usr/bin/env node
/* AI MODEL DATASET — "Will this mission survive?"
   Plays missions with players of mixed skill: a systems thinker who makes a random move with
   probability eps (eps drawn per mission from 0..1), so the data covers expert to novice play.
   After every survived night it saves a snapshot of the station (features) and, at the end, labels
   every snapshot of that mission with the outcome (1 = survived all 10 days).
   Train and test missions use different seed ranges, so the model is tested on missions it never saw.
   Usage: node tools/ml-dataset.js [trainMissions=6000] [testMissions=2000]
   Output: research/ml-train.csv, research/ml-test.csv */
'use strict';
var S = require('./sim-common'), fs = require('fs'), path = require('path');
var NTR = parseInt(process.argv[2], 10) || 6000, NTE = parseInt(process.argv[3], 10) || 2000;
var combos = [['realistic', 'leo'], ['realistic', 'cislunar'], ['realistic', 'moon'], ['training', 'leo']];
var header = null;
function build(n, seed0) {
  var lines = [], wins = 0;
  for (var i = 0; i < n; i++) {
    var seed = seed0 + i, cb = combos[i % combos.length];
    var eps = ((seed * 2654435761) >>> 0) / 4294967296;          // reproducible skill level per mission
    var snaps = [];
    var r = S.run(cb[0], cb[1], S.MODELS.systems, seed, eps, function (st) { snaps.push(S.features(st)); });
    if (r.win) wins++;
    snaps.forEach(function (f) {
      if (!header) header = Object.keys(f);
      lines.push([seed, eps.toFixed(3)].concat(header.map(function (k) { return +(+f[k]).toFixed(2); })).concat([r.win ? 1 : 0]).join(','));
    });
  }
  return { lines: lines, survival: wins / n };
}
var tr = build(NTR, 100000), te = build(NTE, 200000);
var head = ['mission_seed', 'eps_hidden'].concat(header).concat(['survived']).join(',');
fs.writeFileSync(path.join(S.root, 'research', 'ml-train.csv'), head + '\n' + tr.lines.join('\n'));
fs.writeFileSync(path.join(S.root, 'research', 'ml-test.csv'), head + '\n' + te.lines.join('\n'));
console.log('train rows', tr.lines.length, 'mission survival', (100 * tr.survival).toFixed(1) + '%');
console.log('test rows', te.lines.length, 'mission survival', (100 * te.survival).toFixed(1) + '%');
