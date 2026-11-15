# ORBITAL TRADE-OFFS v5.0 — مقايضات مدارية

A browser-based simulator for learning **coupled-systems engineering trade-offs**, **closed-loop life support** and **space medicine**.
محاكي يعمل في المتصفح لتعلم المقايضات الهندسية بين الأنظمة المترابطة، ودعم الحياة المغلق، وطب الفضاء.

## Run it / التشغيل
- Double-click `index.html`. Works in Chrome, Edge, Firefox and Safari, on laptops and phones.
- **No internet needed** (only the fonts load online; system fonts are used offline).
- افتح `index.html` بالضغط مرتين. يعمل بدون إنترنت.

## Folder structure / هيكل الملفات
```
orbital-tradeoffs/
├─ index.html                 page shell only (no logic)
├─ css/
│  ├─ base.css                theme colours, buttons, panels, tooltips, toasts
│  ├─ hud.css                 resources, crew, event terminal, coupling map
│  ├─ screens.css             menu, map, medical bay, report, handbook, tutorial
│  └─ effects.css             all animations (shake, flash, day transition…)
├─ js/
│  ├─ core/
│  │  ├─ namespace.js         global OT object + helpers
│  │  ├─ rng.js               seeded random numbers (reproducible missions)
│  │  ├─ i18n.js              Arabic / English interface text
│  │  ├─ engine.js            THE SIMULATION (pure logic, no DOM)
│  │  └─ telemetry.js         research data → CSV / JSON
│  ├─ data/                   ← edit these to change the science
│  │  ├─ sources.js           37 sources (ESA, CSA, CNSA, NOAA, journals…)
│  │  ├─ systems.js           units, profiles, modes, couplings, crew, medkit
│  │  ├─ scenarios-station.js 18 orbital/general crises
│  │  ├─ scenarios-lunar.js   5 lunar-surface crises
│  │  ├─ medical-cases.js     17 clinical cases for the Medical Bay
│  │  └─ assessment.js        12-item pre/post test (research instrument)
│  ├─ ui/                     audio, effects, HUD, event view, medical bay, screens
│  └─ main.js                 game flow controller
├─ tools/
│  ├─ sim-common.js           loads the real engine in Node + the player models
│  ├─ montecarlo.js           balance validation: node tools/montecarlo.js 5000 --csv research/montecarlo-runs.csv
│  ├─ ablation.js             reasoning-ablation study (7 player models): node tools/ablation.js 5000
│  ├─ ml-dataset.js           AI training/test data: node tools/ml-dataset.js 6000 2000
│  ├─ train-model.py          trains + tests the AI, writes js/core/ai-model.js: python3 tools/train-model.py
│  ├─ make-figures.py         poster figures: python3 tools/make-figures.py
│  └─ export-data.js          regenerates docs/DATA_TABLE.md from the data files
├─ research/                  all study data, results (JSON/CSV) and figures (PNG)
└─ docs/                      CHANGELOG, DATA_TABLE, DATA_PROVENANCE, TELEMETRY, POSTER_FINAL
```

## How to add a new crisis / إضافة أزمة جديدة
Copy one object in `js/data/scenarios-station.js`, change the text (en + ar), the three `choices`, and the `src` id
(add the source to `sources.js` first). Then run:
```
node tools/montecarlo.js 3000      # check the game is still balanced
node tools/export-data.js          # update the poster data table
```

## Research mode / وضع البحث
1. On the menu, open **Research mode**, type a participant code (e.g. `S-014`) and group (`sim` / `control`).
2. **Pre/Post test**: 12 questions, no feedback; results saved on the device → *Export CSV*.
3. Play a mission; the 📥 button exports one row per decision (see `docs/TELEMETRY.md`).
4. Nothing is uploaded anywhere. Get IRB approval before collecting student data (ISEF rule).

## Requirements for tools
Node.js 16+ for `tools/*.js`; Python 3 with numpy, pandas, scikit-learn, scipy and matplotlib for the AI and figures.
The game itself needs only a browser.

## Reproduce the whole computational study (≈3 minutes)
```
node tools/montecarlo.js 5000 --csv research/montecarlo-runs.csv
node tools/ablation.js 5000
node tools/ml-dataset.js 6000 2000
python3 tools/train-model.py
python3 tools/make-figures.py
```
Every mission uses a fixed seed, so the numbers come out identical every time.
