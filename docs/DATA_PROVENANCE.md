# Where every number comes from (data provenance) — v7

## Short answer
The percentages a decision adds to or removes from a system (for example **"Start backup scrubber: −16% Power, +16% Air"**)
are **not measured values and not random**. For every one of them:

1. **The event, the options and which systems each option affects** come from a cited source
   (for example: a CO2 scrubber failure is real; a backup scrubber needs electricity; that is why it costs Power and restores Air).
2. **The relative size** follows the physics/operations described in the source
   (for example: a full-power electrolysis restart costs more power than drawing on stored O2 tanks).
3. **The exact percentage** is a **design value** on a 0–100% game scale, chosen by us and then **tested by simulation**
   (Monte Carlo + reasoning ablation) so that every system can fail and reasoning beats luck.

No space agency publishes "percent of station power per decision", so these values cannot be copied from research.
This is normal for serious games and system-dynamics models: structure from evidence, magnitudes calibrated and tested.

> **Note for judges:** the bars show each system's **operating margin (0–100%)**. The units next to them
> (kW, K, kPa, kg) only show what 100% represents (reference capacities of an ISS-class station). A "−16% Power" effect is a
> drop in margin (load + repair work + reserve use), not a literal 19 kW device.

## The three kinds of numbers

| Kind | What | How many | How we got them | How we checked them |
|---|---|---|---|---|
| **A. Measured (from a source)** | radiation dose rates, bone loss, CO2 limits and headache relation, normal O2 pressure, real event facts, medical cases and treatments | 3 dose rates, 2 bone-loss rates, CO2 rules, 23 crisis contexts, 17 clinical cases, 37 sources | Copied from peer-reviewed papers and agency reports | Each value is linked to its source in the app (Handbook) and in `docs/DATA_TABLE.md` |
| **B. Design (scaled for the game)** | the % effect of each option, delayed effects, nightly drains, coupling rules, difficulty settings, medical risk probabilities, pharmacy stock | 122 option effects, 16 delayed effects, 11 medical-risk probabilities, 4 drains, 9 coupling rules, mode settings | Direction and order from the source; size chosen by us | Experiments 1 and 2 (every system can fail; reasoning wins; myopic play loses) |
| **C. Computed (our results)** | survival rates, confidence intervals, p-values, AI accuracy | — | Our simulations and analysis | Fixed seeds: identical results every run |

## A. Measured values used directly

| Value in the app | Used for | Source |
|---|---|---|
| 0.73 mSv/day (LEO) | crew dose per night in orbit | ISS dose equivalent 731 µSv/day, same period as Chang'e 4 (Zhang et al., 2020, *Science Advances*) |
| 1.37 mSv/day (Moon) | crew dose per night on the Moon | Chang'e 4 LND: 1,369 µSv/day (Zhang et al., 2020) |
| 1.8 mSv/day (cislunar) | crew dose per night beyond the magnetosphere | ~75 µSv/h deep-space GCR dose rate (Handbook of Space Medicine, Springer) |
| 0.05 %/day bone loss without exercise | crew bone panel | hip loss ~1.4–1.5 %/month (Lang et al., 2004, *JBMR*) |
| CO2 flight rule ≤ 4 mmHg; headache odds ×2 per +1 mmHg | cabin readout; CO2 headache trigger | Law et al., 2014 |
| 21.2 kPa normal O2 partial pressure | cabin readout | sea-level physiology |
| 2 mm leak (Soyuz MS-09), Mir fire 1997, ASAT debris 2021, 3 cargo losses 2015, zinnia mold 2016, 98% water recovery, 14-day lunar night below −170 °C, >190 lunar impact flashes, Apollo dust effects, plants in Apollo soil | crisis texts, facts and quizzes | see `docs/DATA_TABLE.md` |
| 17 clinical cases: symptoms, diagnostic tools, treatments (e.g. enoxaparin for the jugular clot, oxygen + re-pressurisation for DCS, potassium citrate for kidney-stone risk) | Medical Bay | NEJM 2020, JAMA Netw Open 2019, CSA, npj Microgravity, Lancet Neurology, etc. |

## B. Design values and their rules

| Parameter | Value (v7) | Rule used to choose it |
|---|---|---|
| Option effects | −24 … +22 % per decision | The bigger the real resource draw (power-hungry restart, spacewalk, robot work), the bigger the cost; every option has at least one cost (a system, crew health or stress, or a pharmacy item) |
| Delayed effects ("fixes that fail") | 16 options, e.g. taped leak −24% air next day | Quick fixes that postpone the real repair carry a later cost larger than their immediate gain (Senge, 1990; Sterman, 1989) |
| Nightly drains | power 1.5, protection 5.5, air 6.5, food 4.5 % (Moon: power 1.0, protection 6.0; cislunar: protection 6.5) | Leakage, CO2 build-up, wear and food use never stop; tuned so every system can fail |
| Coupling rules | below 40% (air → crew below 50%, crew → food below 60%), −3 … −6 per night | Physical direction from the systems (low power slows scrubbers, etc.); strength set by the ablation study |
| Realistic mode | costs ×1.3, 60-second timer, 50% pharmacy | Harder version of the same model |
| Training mode | costs ×1.0, no timer, hints, full pharmacy | Learning mode: random clicking usually fails (38%), sensible play survives |
| Expedition | costs ×1.0 → ×1.45 over 30 sectors, 75% pharmacy + 1 resupply per sector | Gradual difficulty |
| Medical risk probabilities | e.g. spacewalk → decompression sickness 30% | Game-scaled likelihood, so that risky choices sometimes have consequences within a 10-day mission |

## What changed in the design values (and why)

| Version | Change | Evidence that forced it |
|---|---|---|
| v5 | Shields given real costs; per-system drains | Monte Carlo: shields could never fail |
| v6 | Couplings ×1.5, thresholds 35 → 40%; delayed costs ×2 | Ablation: a myopic player survived 98.3%, as often as a systems thinker |
| v7 | 7 lunar quick fixes given delayed costs; Moon power drain 0 → 1; Training drain 0.75 → 1.0; pharmacy by mode | Ablation: on the Moon myopic play still survived 99.6%; random play survived 84% of Training missions |
