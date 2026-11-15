# CHANGELOG — v4.5 (single file, NASA-branded) → v5.0 ORBITAL TRADE-OFFS

Every change, big and small. سجل كل التعديلات الجذرية والبسيطة.

---

## A. Radical changes / تعديلات جذرية

| # | Before (v4.5) | After (v5.0) | Why it matters for ISEF |
| --- | --- | --- | --- |
| A1 | One 1,320-line HTML file | 23 files (index.html + `css/` (4), `js/core` (5), `js/data` (6), `js/ui` (6), `main.js`, tools, docs | Judges and mentors can read it; each file has one job |
| A2 | Tailwind loaded from a CDN (needs internet; not meant for production) | Hand-written CSS, no framework, works offline | Matches the "lightweight, low-resource schools" claim |
| A3 | "NASA app": live NASA API panels, "NASA brief" card, NASA badges | Neutral brand; 37 sources from ESA, CSA, CNSA/CAS, NOAA, the Belgian STCE, Springer, NEJM, JAMA, Lancet, PNAS, npj Microgravity… (NASA is 5 of 37) | Moves the project away from the NASA challenge |
| A4 | 15 scenarios × 2 options = 30 trade-offs | 23 scenarios × 3 options = **69 trade-offs** + **17 medical cases** + 8 coupling rules | Much larger, documented dataset |
| A5 | Fantasy events: alien SOS, AI rebellion, "artificial gravity glitch", gas-giant eclipse, dust storm in orbit | All replaced by documented real events: Mir fire 1997, Soyuz MS-09 leak 2018, 2021 debris shelter, 2013 ammonia leak, Parmitano helmet water 2013, Starlink storm 2022, cargo losses 2014-15, Chang'e 4 radiation… | Scientific credibility |
| A6 | Facts were attached by index (`NASA[i % 15]`), so the Dust Storm showed a *Mars Trek* fact and the AI malfunction showed an unrelated biology fact | Each scenario carries its own fact + source id | No more mismatched science |
| A7 | No links between systems except inside one choice | **Coupling engine**: 8 rules fire every night (e.g. power < 35% slows CO2 scrubbers → air −4). Shown as glowing arrows on a live network map | The "system of systems" claim is now real and visible |
| A8 | No delayed effects | **Delayed consequences** (`later`): e.g. taping a leak gives +18% air now, −12% tomorrow | Teaches stock-and-flow and delays (Sterman's research gap) |
| A9 | Medical content = a sentence in one card | **Medical Bay** (see section C): crew of 4 with vitals, dose and bone; 17 cases; diagnostic tools; limited pharmacy | The medical part is now a full second layer of the game |
| A10 | Crew existed only as "O2 %" | Crew is the **5th system**: health, stress, cumulative radiation dose (mSv), bone loss (%). Any crew member at 0 = medical evacuation | Human body as part of the engineering system |
| A11 | Balance never tested; shields could never fail (net +83 points over all options) and power caused 53% of failures | Balance tested by **Monte Carlo** (`tools/montecarlo.js`, 40,000 missions). Realistic LEO: strategic 96.0% vs random 24.2%; every system fails sometimes (power 33.6%, food 18.1%, protection 13.3%, air 9.8%, crew 1.0%) | An engineering result for the poster (before/after) |
| A12 | Telemetry = a plain text log | **Research telemetry**: CSV/JSON, one row per decision, 34 columns (decision time, hint/card use, resources before/after, diagnosis accuracy…) | Your Phase B study data comes straight from the app |
| A13 | No research instruments | **Pre/Post test** (12 items, 6 systems-thinking + 6 content, no feedback, shuffled per participant, CSV export) | Ready for the controlled study |
| A14 | Random, unrepeatable missions; biased shuffle `sort(() => 0.5 - Math.random())` | Seeded RNG (mulberry32) + Fisher–Yates shuffle; seed saved in the report and the CSV | Any mission can be replayed exactly |
| A15 | 3 locations implied (station, Moon map, Mars Trek) mixed together | 3 explicit **mission profiles**: LEO station, cislunar outpost, lunar south-pole base, each with its own measured dose rate and its own events | Correct science per location |

## B. Bugs fixed / أخطاء تم إصلاحها

1. **Training mode reduced gains too**: the 0.9–1.0 multiplier was applied to positive effects. Now only costs are scaled.
2. **Effect labels could contradict the numbers**: pros/cons were typed by hand (e.g. "Max Shields: +18% O2"). Now every chip is generated from the effect numbers, so text and maths always match.
3. **Poster table did not match the code**: the poster said Solar Flare = +30% shield / −40% power, but the code had +20 / −25. The new `docs/DATA_TABLE.md` is generated from the code.
4. **Misleading "LIVE" badge**: when the NASA API call failed (offline, or the shared DEMO_KEY limit), the app still showed "NASA RADLAB & OSDR: ACTIVE". Removed.
5. **Inconsistent radiation numbers**: 0.62 mSv/day in one place, 0.5–1.0 in another. Now one sourced value per profile (0.73 / 1.8 / 1.37 mSv/day).
6. v4.2: the "Engage" button showed `undefined` (`t.btnEasyTitle` did not exist). Gone.
7. Quiz pass mark was fixed at 2 of 3; now 60% of questions drawn from the events actually played.
8. Expedition did not keep anything between sectors; now radiation dose and bone loss **carry over** (they are stocks), with a partial pharmacy resupply.
9. Hypoxia could trigger repeatedly; now only when no crew member already has it.
10. Arabic title: letter-spacing broke the joins between Arabic letters (مقا يضات). Fixed for RTL.
11. Phone screens: the menu was cut off at the top when content was taller than the screen. Fixed.
12. The page background stopped partway down when scrolling. Fixed.

## C. The new Medical Bay / العيادة الطبية الجديدة

- **Crew**: 4 fictional international astronauts (Egypt, Japan, Brazil, France) with health, stress, dose and bone.
- **Live monitor**: animated ECG, HR, SpO₂, blood pressure, temperature, breathing rate, dose. Vitals are computed from the station state (low air → lower SpO₂ and higher CO₂ → faster breathing).
- **3-step clinical flow**: Examine (ultrasound, lab test, OCT eye exam, telemedicine; each costs power or a test kit) → Diagnose (4 options) → Treat (3 options, using a **limited pharmacy** of 12 drug types).
- **Cases are caused by the engineering decisions** (the core idea):
  - *State-triggered*: Air < 50% → CO₂ headache (probability doubles per +1 mmHg, Law 2014); SpO₂ ≤ 92% → hypoxia.
  - *Risk-triggered*: a spacewalk → decompression sickness; ignoring a radiation storm → "Am I radiation sick?"; fire or oxygen candles → smoke inhalation; lunar dust → "lunar hay fever"; skipping rest → insomnia.
  - *Background*: space motion sickness (days 1–3), back pain, kidney stone, jugular clot (2020 case), SANS vision change, rash, viral reactivation.
- **After each case**: correct answer, why, prevention, **benefit on Earth**, verified fact and link to the paper.
- **Comms matter**: if the antenna is down, telemedicine is unavailable, so the crew must diagnose alone.
- **6-month projection** in the report: dose and bone loss extrapolated to 180 days, compared with NASA (600 mSv) and ESA (1,000 mSv) career limits.

## D. Design, effects and small details / التصميم والمؤثرات والتفاصيل الصغيرة

| Area | Detail |
| --- | --- |
| Start screen | Animated orbit logo, mission-location selector, mode cards with best score, research panel, data-source credits |
| Guided tutorial | 6-step spotlight tour on first Training mission (dims the screen, highlights each panel) |
| Typewriter | Crisis text types in with soft keyboard ticks; click to skip |
| Floating numbers | +12 / −18 float up from the resource card that changed |
| Screen shake + red flash | When one decision costs 20% or more |
| Red vignette | Pulses around the screen while any system is ≤ 20% |
| Low-system glow | Resource cards turn red and glow at ≤ 30% |
| Day transition | Full-screen "DAY 3" sweep with a whoosh sound |
| End-of-day report | Constant drains, delayed consequences, coupling effects, crew dose; alarm sound if a coupling fired |
| Coupling map | SVG network of the 5 systems; active links turn red and animate ("flowing" dashes); green when the greenhouse adds O₂ |
| Decision timer | Circular countdown (green → yellow → red), ticking in the last 10 s; time-out applies the "no action" option |
| Science card | 3D flip card: coupling, trade-off, verified fact, clickable source |
| Button feedback | Ripple on click, hover glow, click sound |
| Toasts | Small pop-up messages (medical alert, reserves used, time-out) |
| Tooltips | Hover any resource, chip or crew stat for an explanation |
| Cabin readout | Live CO₂ (mmHg), pO₂ (kPa), SpO₂ (%), temperature, colour-coded |
| ECG | Heartbeat trace with optional beep in the Medical Bay |
| Mission report | Grade S/A/B/C/D/F, 5 KPIs, line chart of all stocks over days with a 30% danger line, decision log with the costliest decision highlighted, sources used |
| Confetti | On mission success |
| Sound | All synthesised (no files): clicks, alarms, success/fail jingles, typing, whoosh, optional ambient music |
| Starfield | Parallax twinkling stars and rare shooting stars |
| Handbook | Searchable: systems and events, space medicine, coupling model, all sources; entries unlock as you meet them |
| Settings | Language, volume, music, ECG beep, timer on/off, retro-screen effect, reduce motion, high contrast, text size, reset progress |
| Keyboard | 1/2/3 choose · H hint · F flip card · Esc settings |
| Accessibility | Reduced-motion support, high-contrast mode, text size, focus outlines, ARIA labels |
| Mobile | Responsive layout down to 390 px wide; full RTL for Arabic |
| Expedition map | 30 sectors in 3 coloured zones; animated rocket; performance bonus banner |

## E. Test results / نتائج الاختبار
- Automated browser play-throughs (Playwright, Chrome): English Training, Arabic Realistic with a 3-second timer, the Expedition map → sector 2, handbook, settings, pre/post test, phone size. **0 console errors.**
- Monte Carlo: see `research/montecarlo-summary.json` and `research/montecarlo-runs.csv`.

---

# Version 6.0 — computational study + AI Flight Director

## Why
The team had no time for a human-subjects study. Instead of predicting student scores (which would be invented data),
v6 runs a **computational study**: real experiments on the simulator with player models and a trained AI model.

## C1. Reasoning-ablation study (`tools/ablation.js`, `tools/sim-common.js`)
Seven player models, each removing one kind of systems reasoning, 5,000 paired missions (same seeds) per model × 3 locations:
random · myopic (today only) · lookahead without delay knowledge · lookahead without coupling knowledge ·
full systems thinker (mentally simulates 3 nights with the real model) · systems thinker with random medicine · v5 heuristic bot.

## C2. Finding that forced a redesign
In v5 a **myopic** player survived 98.3% of Realistic LEO missions, the same as a full systems thinker (98.9%).
The game rewarded common sense, not systems thinking. Only 9 of 69 options had delayed effects, and couplings were mild.

## C3. Balance changes (design iteration v6)
| Rule | v5 | v6 |
|---|---|---|
| Coupling thresholds | below 35% (air→crew 45%, crew→food 55%) | +5: below 40% (50%, 60%) |
| Coupling strengths | air −4 / food −3 / health −2…−3 / crew→food −2,−2 | ×1.5: −6 / −4 / −3…−4 / −3,−3 |
| Delayed effects (9 options) | e.g. taped leak −12 air next day | ×2: e.g. −24 air next day; regolith beds +28 food |
| HUD node turns red | ≤ 35% | < 40% (matches coupling zone) |
Result (LEO): myopic 98.3% → 53.5%, systems thinker 98.9% → 96.6%, random 24.2% → 8.4%.
Values are labelled design assumptions; the original v5 data are kept in the research files for comparison.

## C4. AI Flight Director (`js/core/ai.js`, `js/core/ai-model.js`, `tools/ml-dataset.js`, `tools/train-model.py`)
- Logistic-regression model trained on 52,083 nightly snapshots from 6,000 simulated missions of mixed skill,
  tested on 17,389 snapshots from 2,000 different missions: AUC 0.891, accuracy 82.8%, well calibrated.
- The same `OT.AI.features()` function builds the training data and runs in the browser.
- New HUD panel: survival-chance gauge, trend line and the two main concerns; also shown in the night report.
- Concerns are only shown when the factor is actually in its bad direction and the chance is below 85%.
- Telemetry: new column `ai_p_survive` on night rows (35 columns).

## C5. Figures (`tools/make-figures.py`)
fig1 reasoning ladder (v5 vs v6) · fig2 survival by condition · fig3 AI calibration and early warning · fig4 failure cause and day.

## Known open issue
On the Moon, a myopic player still survives 99.6% (the lunar scenario set has only 2 delayed-effect options).
Next iteration: add delayed consequences to lunar scenarios.

---

# Version 7.0 — Moon fixed, harder Training, pharmacy by mode

| Change | v6 | v7 | Why |
|---|---|---|---|
| Lunar quick fixes with delayed costs | 2 | 9 (+7: fuel cells, retreat to one module, carry on in dust, EVA panel cleaning, accept dust losses, pause farm, swap all HEPA filters) | Moon: myopic play survived 99.6% (no reasoning needed) |
| Moon nightly power drain | 0 | 1.0 | dust on arrays + heater load |
| Training nightly drain | ×0.75 | ×1.0 | random clicking survived 84% of Training missions |
| Pharmacy stock | same in all modes | Training 100%, Expedition 75% (+1 resupply/sector), Realistic 50% (min. 1 per item) | scarcity makes careless medicine costly |
| AI tooltip | fixed text | reads accuracy/AUC from the trained model | numbers always match the model |
| Moon dose note | "2.6× ISS" | "1.9× ISS total, 2.6× its cosmic-ray part" | matches Zhang et al. 2020 exactly |

Results after v7 (Realistic): systems thinker vs myopic vs random — LEO 96.7 / 52.8 / 8.3, cislunar 99.5 / 82.8 / 11.8,
Moon 94.6 / 73.4 / 7.8. Training: systems 99.7, random 38.3. AI: test AUC 0.863, accuracy 78.3%.
New: `docs/DATA_PROVENANCE.md` (where every number comes from), `research/fig5_ladder_by_location.png`.
