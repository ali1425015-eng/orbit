#!/usr/bin/env python3
"""Poster figures (v6). Run from the project root: python3 tools/make-figures.py
Reads research/*.json|csv, writes research/fig*.png (white background, print-ready)."""
import csv, json, math, collections, os
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
R = 'research'
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 12, 'axes.spines.top': False, 'axes.spines.right': False,
                     'axes.edgecolor': '#9a9a95', 'axes.labelcolor': '#333', 'xtick.color': '#444', 'ytick.color': '#666'})
B, O, INK, MUT, GRID = '#2a78d6', '#eb6834', '#1f1f1e', '#6b6b66', '#e6e6e2'
def ci(p, n): se = math.sqrt(p * (1 - p) / n); return 196 * se
def grid(ax): ax.yaxis.grid(True, color=GRID, lw=0.8); ax.set_axisbelow(True)

# ---- Fig 1: reasoning ladder, v5 vs v6 (LEO, Realistic) ----
v5 = {r['model']: r['survival'] for r in json.load(open(f'{R}/ablation-v5-summary.json'))['results'] if r['profile'] == 'leo'}
v6 = {r['model']: r['survival'] for r in json.load(open(f'{R}/ablation-summary.json'))['results'] if r['profile'] == 'leo'}
order = [('random', 'Random'), ('myopic', 'Myopic\n(today only)'), ('lookNoDelay', 'Lookahead,\nno delays'), ('lookNoCouple', 'Lookahead,\nno couplings'), ('systems', 'Full systems\nthinker')]
fig, ax = plt.subplots(figsize=(9, 4.8), dpi=220); w = 0.36
for j, (src, c, name) in enumerate([(v5, O, 'Version 5 (before)'), (v6, B, 'Final version (after redesign)')]):
    for i, (k, _) in enumerate(order):
        p = src[k]; x = i + (j - 0.5) * (w + 0.03)
        ax.bar(x, p, w, color=c, label=name if i == 0 else None, yerr=ci(p / 100, 5000), error_kw=dict(ecolor=INK, capsize=3, lw=1))
        ax.text(x, p + 2.5, f'{p:.1f}', ha='center', fontsize=10, color=INK)
ax.set_xticks(range(len(order))); ax.set_xticklabels([o[1] for o in order], fontsize=11)
ax.set_ylim(0, 112); ax.set_yticks(range(0, 101, 20)); ax.set_ylabel('Missions survived (%)'); grid(ax)
ax.legend(frameon=False, loc='upper center', ncol=2, bbox_to_anchor=(0.5, 1.1))
fig.text(0.01, 0.005, 'Realistic mode, low Earth orbit. n = 5,000 paired missions per bar (same seeds). Error bars = 95% CI.', fontsize=9, color=MUT)
fig.tight_layout(rect=(0, 0.03, 1, 1)); fig.savefig(f'{R}/fig1_reasoning_ladder.png'); plt.close()

# ---- Fig 2: random vs systems thinker, 4 conditions (v6) ----
d = collections.defaultdict(list)
for r in csv.DictReader(open(f'{R}/montecarlo-runs.csv')): d[(r['mode'], r['profile'], r['bot'])].append(int(r['win']))
conds = [('training', 'leo', 'Training\n(LEO)'), ('realistic', 'leo', 'Realistic\n(LEO)'), ('realistic', 'cislunar', 'Realistic\n(Cislunar)'), ('realistic', 'moon', 'Realistic\n(Moon)')]
fig, ax = plt.subplots(figsize=(8, 4.6), dpi=220)
for i, (m, pr, lab) in enumerate(conds):
    for j, (bot, c, name) in enumerate([('systems', B, 'Systems thinker'), ('random', O, 'Random play')]):
        v = d[(m, pr, bot)]; p = sum(v) / len(v); x = i + (j - 0.5) * (w + 0.03)
        ax.bar(x, 100 * p, w, color=c, label=name if i == 0 else None, yerr=ci(p, len(v)), error_kw=dict(ecolor=INK, capsize=3, lw=1))
        ax.text(x, 100 * p + 2.5, f'{100*p:.1f}', ha='center', fontsize=10.5, color=INK)
ax.set_xticks(range(4)); ax.set_xticklabels([c[2] for c in conds]); ax.set_ylim(0, 112); ax.set_yticks(range(0, 101, 20)); ax.set_ylabel('Missions survived (%)'); grid(ax)
ax.legend(frameon=False, loc='upper center', ncol=2, bbox_to_anchor=(0.5, 1.1))
fig.text(0.01, 0.005, 'Final version. n = 5,000 missions per bar (40,000 total). Error bars = 95% CI.', fontsize=9, color=MUT)
fig.tight_layout(rect=(0, 0.03, 1, 1)); fig.savefig(f'{R}/fig2_survival.png'); plt.close()

# ---- Fig 3: AI model — calibration + early warning ----
ml = json.load(open(f'{R}/ml-results.json'))
fig, (a1, a2) = plt.subplots(1, 2, figsize=(9.5, 4.2), dpi=220, gridspec_kw={'width_ratios': [1, 1.15]})
cal = ml['calibration_logistic']
a1.plot([0, 100], [0, 100], color='#b5b5ae', lw=1.2, ls='--', label='Perfect calibration')
a1.plot([100 * c['predicted'] for c in cal], [100 * c['observed'] for c in cal], color=B, lw=2, marker='o', ms=7, mec='white', mew=1.5, label='AI model')
a1.set_xlim(0, 100); a1.set_ylim(0, 100); a1.set_xlabel('Predicted survival chance (%)'); a1.set_ylabel('Missions that actually survived (%)')
a1.set_title('A. Are the forecasts honest?', loc='left', fontsize=12, color=INK); a1.legend(frameon=False, loc='upper left', fontsize=10); grid(a1)
days = list(ml['by_day'].keys()); labs = ['Days 1–3', 'Days 4–6', 'Days 7–9']
for j, (key, c, name) in enumerate([('logistic_auc', B, 'AI model (17 features)'), ('weakest_only_auc', O, 'Weakest system only')]):
    vals = [ml['by_day'][k][key] for k in days]
    xs = [i + (j - 0.5) * 0.38 for i in range(3)]
    a2.bar(xs, vals, 0.35, color=c, label=name)
    for x, v in zip(xs, vals): a2.text(x, v + 0.01, f'{v:.2f}', ha='center', fontsize=10, color=INK)
a2.set_xticks(range(3)); a2.set_xticklabels(labs); a2.set_ylim(0.5, 1.02); a2.set_ylabel('AUC (0.5 = guessing, 1 = perfect)')
a2.set_title('B. How early can it warn?', loc='left', fontsize=12, color=INK); a2.legend(frameon=False, loc='upper left', fontsize=10); grid(a2)
fig.text(0.01, 0.005, f"Test set: {ml['n_test_rows']:,} snapshots from {ml['n_test_missions']:,} missions never seen in training.", fontsize=9, color=MUT)
fig.tight_layout(rect=(0, 0.04, 1, 1)); fig.savefig(f'{R}/fig3_ai_model.png'); plt.close()

# ---- Fig 4: when and how random missions fail (v6) ----
rows = [r for r in csv.DictReader(open(f'{R}/montecarlo-runs.csv')) if r['mode'] == 'realistic' and r['profile'] == 'leo' and r['bot'] == 'random']
n = len(rows); lost = [r for r in rows if r['win'] == '0']
names = {'power': 'Power', 'bio': 'Food', 'prot': 'Protection', 'air': 'Air', 'crew': 'Crew health'}
cause = collections.Counter(r['fail'] for r in lost); items = sorted(((names[k], 100 * c / n) for k, c in cause.items()), key=lambda t: -t[1])
dc = collections.Counter(int(r['day']) for r in lost)
fig, (a1, a2) = plt.subplots(1, 2, figsize=(9, 4), dpi=220, gridspec_kw={'width_ratios': [1, 1.2]})
a1.barh([t[0] for t in items][::-1], [t[1] for t in items][::-1], color=O, height=0.6)
for y, (nm, val) in enumerate(items[::-1]): a1.text(val + 0.8, y, f'{val:.1f}%', va='center', fontsize=10.5, color=INK)
a1.set_xlim(0, 45); a1.set_xlabel('% of all random missions'); a1.set_title('A. Which system failed first', loc='left', fontsize=12, color=INK)
dd = list(range(1, 11)); vals = [100 * dc.get(k, 0) / len(lost) for k in dd]
a2.bar(dd, vals, color=O, width=0.7)
for k, val in zip(dd, vals):
    if val >= 5: a2.text(k, val + 0.8, f'{val:.0f}%', ha='center', fontsize=10, color=INK)
a2.set_xticks(dd); a2.set_xlabel('Mission day'); a2.set_ylabel('% of failed missions'); a2.set_title('B. When failed missions ended', loc='left', fontsize=12, color=INK); grid(a2)
fig.text(0.01, 0.005, f'Final version, Realistic mode, low Earth orbit, random play (n = {n:,}; {len(lost):,} failed).', fontsize=9, color=MUT)
fig.tight_layout(rect=(0, 0.04, 1, 1)); fig.savefig(f'{R}/fig4_failures.png'); plt.close()
print('figures written')

# ---- Fig 5: reasoning ladder in all three locations (final version) ----
ab = json.load(open(f'{R}/ablation-summary.json'))['results']
locs = [('leo', 'Low Earth orbit', B), ('cislunar', 'Cislunar', '#1baf7a'), ('moon', 'Moon', '#eda100')]
fig, ax = plt.subplots(figsize=(9, 4.6), dpi=220); w = 0.26
for j, (pr, name, c) in enumerate(locs):
    vals = {r['model']: r['survival'] for r in ab if r['profile'] == pr}
    for i, (k, _) in enumerate(order):
        x = i + (j - 1) * (w + 0.02); p = vals[k]
        ax.bar(x, p, w, color=c, label=name if i == 0 else None, yerr=ci(p / 100, 5000), error_kw=dict(ecolor=INK, capsize=2, lw=0.8))
        ax.text(x, p + 2, f'{p:.0f}', ha='center', fontsize=9, color=INK)
ax.set_xticks(range(len(order))); ax.set_xticklabels([o[1] for o in order], fontsize=11)
ax.set_ylim(0, 112); ax.set_yticks(range(0, 101, 20)); ax.set_ylabel('Missions survived (%)'); grid(ax)
ax.legend(frameon=False, loc='upper center', ncol=3, bbox_to_anchor=(0.5, 1.1))
fig.text(0.01, 0.005, 'Final version, Realistic mode. n = 5,000 paired missions per bar. Error bars = 95% CI.', fontsize=9, color=MUT)
fig.tight_layout(rect=(0, 0.03, 1, 1)); fig.savefig(f'{R}/fig5_ladder_by_location.png'); plt.close()
print('fig5 written')
