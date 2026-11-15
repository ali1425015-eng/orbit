#!/usr/bin/env node
/* Exports the game's dataset to Markdown + CSV so the poster's
   "Data collected to train the application" table always matches the code.
   Usage: node tools/export-data.js */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm'), root = path.join(__dirname, '..');
global.window = global;
['js/core/namespace.js', 'js/core/rng.js', 'js/data/sources.js', 'js/data/systems.js', 'js/data/scenarios-station.js', 'js/data/scenarios-lunar.js', 'js/data/medical-cases.js']
  .forEach(function (f) { vm.runInThisContext(fs.readFileSync(path.join(root, f), 'utf8')); });
var D = global.OT.data, SYS = global.OT.SYS;
var lab = { power: 'Power', prot: 'Protection', air: 'Air', bio: 'Food' };
function eff(c) {
  var parts = SYS.filter(function (k) { return c.eff[k]; }).map(function (k) { return (c.eff[k] > 0 ? '+' : '') + c.eff[k] + '% ' + lab[k]; });
  (c.later || []).forEach(function (l) { Object.keys(l.eff).forEach(function (k) { parts.push('later(+' + l.in + 'd) ' + (l.eff[k] > 0 ? '+' : '') + l.eff[k] + '% ' + lab[k]); }); });
  var cr = c.crew || {};
  if (cr.dose) parts.push('+' + cr.dose + ' mSv dose');
  if (cr.health) parts.push((cr.health > 0 ? '+' : '') + cr.health + ' crew health');
  if (cr.stress) parts.push((cr.stress > 0 ? '+' : '') + cr.stress + ' stress');
  if (cr.risk) parts.push(Math.round(cr.risk.p * 100) + '% risk: ' + cr.risk.case);
  return parts.join('; ') || '—';
}
var md = ['# Dataset — ORBITAL TRADE-OFFS', '', 'Generated from the code by `node tools/export-data.js`. Negative values are multiplied by the mode cost multiplier (Training ×1.0, Realistic ×1.3, Expedition ×1.0→1.45).', '',
  '## 1. Station crises (' + D.scenarios.length + ' scenarios × 3 decisions = ' + D.scenarios.length * 3 + ' trade-offs)', '',
  '| # | Crisis | Where | Decision | Effect (input → output) | Source |', '| --- | --- | --- | --- | --- | --- |'];
var csv = ['id,crisis,where,decision,power,prot,air,bio,later,dose_mSv,crew_health,stress,risk_case,risk_p,source_org,source_url'];
var n = 0;
D.scenarios.forEach(function (s) {
  s.choices.forEach(function (c, i) {
    n++; var src = D.sources[s.src];
    md.push('| ' + n + ' | ' + (i === 0 ? '**' + s.title.en + '**' : '') + ' | ' + (i === 0 ? s.where.join(', ') : '') + ' | ' + c.t.en + ' | ' + eff(c) + ' | ' + (i === 0 ? '[' + src.org + '](' + src.url + ')' : '') + ' |');
    var cr = c.crew || {};
    csv.push([s.id, '"' + s.title.en + '"', s.where.join('|'), '"' + c.t.en + '"', c.eff.power || 0, c.eff.prot || 0, c.eff.air || 0, c.eff.bio || 0,
      '"' + (c.later || []).map(function (l) { return JSON.stringify(l); }).join(' ').replace(/"/g, "'") + '"', cr.dose || 0, cr.health || 0, cr.stress || 0,
      cr.risk ? cr.risk.case : '', cr.risk ? cr.risk.p : '', '"' + src.org + '"', src.url].join(','));
  });
});
md.push('', '## 2. Medical cases (' + D.medical.length + ')', '', '| Case | Trigger | Correct diagnosis | Best treatment (kit) | Verified fact | Source |', '| --- | --- | --- | --- | --- | --- |');
D.medical.forEach(function (m) {
  var dx = m.dx.filter(function (d) { return d.ok; })[0], tx = m.tx.filter(function (t) { return t.q === 2; })[0], src = D.sources[m.src];
  var trig = m.trigger.type === 'state' ? 'Air < ' + m.trigger.air + '%' : m.trigger.type === 'risk' ? 'Earlier decision (risk)' : 'Random' + (m.trigger.minDay ? ' from day ' + m.trigger.minDay : '') + (m.trigger.maxDay ? ' until day ' + m.trigger.maxDay : '');
  md.push('| ' + m.title.en + ' | ' + trig + ' | ' + dx.t.en + ' | ' + tx.t.en + ' (' + (Object.keys(tx.kit).join(', ') || '—') + ') | ' + m.fact.en + ' | [' + src.org + '](' + src.url + ') |');
});
md.push('', '## 3. Coupling rules (system of systems)', '', '| From | To | Active when | Effect | Why |', '| --- | --- | --- | --- | --- |');
D.couplings.concat([D.positiveCoupling]).forEach(function (c) {
  var e = c.eff ? Object.keys(c.eff).map(function (k) { return (c.eff[k] > 0 ? '+' : '') + c.eff[k] + '% ' + lab[k] + '/night'; }).join(', ') : c.dose ? 'dose ×' + c.dose : 'crew health ' + c.health + '/night';
  md.push('| ' + c.from + ' | ' + c.to + ' | ' + (c.below ? '< ' + c.below + '%' : '≥ ' + c.above + '%') + ' | ' + e + ' | ' + c.why.en + ' |');
});
md.push('', '## 4. Physiology constants', '', '| Quantity | Value | Source |', '| --- | --- | --- |');
Object.keys(D.profiles).forEach(function (k) { var p = D.profiles[k], s = D.sources[p.doseSrc]; md.push('| Crew dose rate, ' + p.name.en + ' | ' + p.dose + ' mSv/day | [' + s.org + '](' + s.url + ') |'); });
md.push('| Bone loss without / with exercise | ' + D.passive.bone.noExercise + ' / ' + D.passive.bone.exercise + ' % per day | [' + D.sources.jbmr_bone.org + '](' + D.sources.jbmr_bone.url + ') |');
md.push('| Headache odds per +1 mmHg CO2 | ×2 (game-scaled probability) | [' + D.sources.law_co2.org + '](' + D.sources.law_co2.url + ') |');
md.push('| Nightly drains (power/prot/air/bio) | ' + SYS.map(function (k) { return D.passive.drain[k]; }).join(' / ') + ' % | Design assumption, tuned by Monte Carlo |');
md.push('', '## 5. Sources (' + Object.keys(D.sources).length + ')', '');
Object.keys(D.sources).forEach(function (k) { var s = D.sources[k]; md.push('- **' + s.org + '** (' + s.year + ') — ' + s.title + (s.url ? ' — ' + s.url : '')); });
fs.writeFileSync(path.join(root, 'docs', 'DATA_TABLE.md'), md.join('\n') + '\n');
fs.writeFileSync(path.join(root, 'research', 'dataset-tradeoffs.csv'), csv.join('\n') + '\n');
console.log('scenarios', D.scenarios.length, 'decisions', n, 'medical', D.medical.length, 'sources', Object.keys(D.sources).length);
