# FINAL poster text (v8): all sections, rubric-aligned

This tab is the **final version**. It replaces v6 and v7 (kept as "old"). Part A is the poster text, with each section labelled by the ISEF engineering rubric item it scores on. Part B is for the team: a statistics guide, where the numbers come from, what changed from the first app, and judge questions. Every number matches app v7 and `research/*.json`.

# Part A: Poster sections

## 1. Abstract (239 words; ISEF limit 250)

Space education often forces a choice between models that are easy to follow and models that are physically realistic. We developed ORBITAL TRADE-OFFS, a lightweight, offline, bilingual (Arabic/English) browser simulation in which students command a habitat for 10 days and keep five coupled systems alive: power, radiation and thermal protection, life support, a greenhouse that supplies food and oxygen, and the crew, treated in a Medical Bay where engineering decisions can cause illness. The model holds 69 sourced trade-offs, 17 clinical cases, nine nightly coupling rules and delayed consequences. We then tested whether the simulator actually rewards systems thinking, using 105,000 paired simulated missions played by seven player models, each lacking one kind of reasoning. The first version failed this test: a myopic player that considered only today survived 98.3% of missions, as often as a full systems thinker. After two documented redesign iterations, myopic play fell to 52.8% in low Earth orbit and 73.4% on the Moon, while the systems thinker kept 96.7% and 94.6% (random play: under 12% everywhere). Knowing about delayed consequences alone added 40.7 percentage points of survival (McNemar p < 0.001), and correct medical decisions raised mean crew health from 74.9 to 89.8. Finally, we trained a machine-learning model on 6,000 simulated missions to forecast survival from the station state. On 2,000 unseen missions it reached an AUC of 0.86 with well-calibrated probabilities, and it runs inside the app as an "AI Flight Director".

## 2. Problem statement (rubric I: practical need)

A critical limitation in engineering education is the persistent disconnect between abstract theory and practical systems engineering. While aerospace curricula should integrate theoretical formulas with dynamic systems thinking, many programs rely on static models that treat components in isolation. Grounded in Cognitive Load Theory (Sweller, 1988), educational research shows that working memory is limited, so presenting many isolated elements at once can overload learners and hinder integrated reasoning. The severity of this gap was shown by Booth Sweeney and Sterman in the System Dynamics Review (2000), who found poor understanding of basic stock-and-flow relationships even among graduate students at an elite university. In a follow-up task, 94% of graduate students read inflow and outflow graphs correctly, but only 42% correctly worked out how the stock itself changed (Cronin & Gonzalez, 2007). Later work showed that this "stock-flow failure" is not explained by weak graph-reading skills, lack of context, low motivation or limited cognitive capacity (Cronin, Gonzalez & Sterman, 2009). Because learners struggle with multi-variable trade-off reasoning, graduates may enter the workforce less prepared for high-stakes operational decision-making, a gap that can raise training costs and the risk of costly errors in complex engineering sectors.

## 3. Previous solutions and their limits (rubric I and II: need and alternatives)

Previous attempts to address this gap used educational software and virtual simulators, yet many remain limited by structural and economic flaws. Many conventional platforms simplify learning through quiz-style, right-or-wrong evaluation, which does not capture the non-linear interactions among vital spacecraft subsystems: the Electrical Power System (EPS), Thermal Control System (TCS), Environmental Control and Life Support System (ECLSS), Bioregenerative Hydroponics and crew health. On the other hand, high-fidelity simulation solutions exist, but they often rely on resource-heavy game engines or specialised hardware. This creates financial and accessibility barriers for under-resourced schools and universities, and points to a need for a lightweight, accessible and interactive engineering learning platform. A meta-analysis of 39 studies found that serious games improved learning (d = 0.29) and retention (d = 0.36) compared with conventional instruction (Wouters et al., 2013). However, few educational simulators are tested to show that winning actually *requires* the reasoning they claim to teach.

## 4. Background: "Space is a deadly environment"

Space is a deadly environment. To survive, astronauts rely on ECLSS (Environmental Control and Life Support Systems) to constantly recycle air, purify water and control temperature; the ISS now recovers about 98% of its water. Spaceflight dangers are usually grouped into five hazards: radiation, isolation and confinement, distance from Earth, altered gravity, and closed or hostile environments. During real emergencies, crews have had to make fast trade-offs between systems: the 1997 oxygen-candle fire on Mir, the 2018 Soyuz MS-09 air leak, and the 2021 debris cloud that forced the ISS crew to shelter in their spacecraft. In our model, for example, boosting radiation protection during a solar storm costs power, and low power then slows CO2 removal and weakens the greenhouse.

Training for these crises traditionally relies on high-fidelity physical mock-ups and simulators at space-agency facilities, which most schools cannot access. Our project brings the core logic into an accessible tool: a dynamic software simulator (a serious engineering game) with an immersive interface, real-time telemetry, coupled subsystems, a Medical Bay and an AI Flight Director, where every choice has immediate and delayed, measurable consequences. Our theoretical foundation combines two fields:

- **Scientific principles:**
  - **Systems engineering:** aerospace systems engineering, where changing one parameter causes cascading impacts across a resource network.
  - **Stock-and-flow dynamics:** quantities such as radiation dose, bone loss and postponed repairs accumulate over time.
  - **"Fixes that fail":** systems-thinking research names quick fixes whose costs arrive later as a pattern people routinely miss (Senge, 1990; Sterman, 1989), so our quick-fix options carry delayed costs.
  - **Pressure:** human performance under pressure (the Yerkes-Dodson relationship) motivates the optional decision timer; we measure decision time rather than assume an effect.
- **Testing and results:**
  - **Validation:** 40,000 Monte Carlo missions. A systems thinker survives 94.6–99.5% of Realistic missions; random play survives 7.8–11.8%.
  - **Reasoning ablation:** 105,000 paired missions. It showed that our earlier version rewarded common sense rather than systems thinking, which led to two documented redesigns.

## 5. Data collected to build the application (rubric II and poster: supporting documentation)

**To make the simulation realistic and balanced, we built the game's logic around four main rules:**

- **Baseline metrics:** you start with four connected station systems at 100% (Power, Protection, Atmosphere and Food) and a crew of four. Each crew member's health, radiation dose (mSv) and bone loss (%) are tracked as a fifth system. The bars show each system's operating margin; the units (kW, K, kPa, kg) show what 100% represents on an ISS-class station.
- **The trade-offs:** all systems are linked, so if you boost one, another takes a hit. We mapped out 23 crises with 3 decisions each (69 trade-offs) and 17 medical cases, each linked to a published source. For example, taping a cabin leak gives +18% air now and costs 6% power, but then loses 24% air the next day (a "fix that fails").
- **The coupling rules:** every night, weak systems drag others down. For example, power below 40% removes 6% air (slower CO2 scrubbing), while a healthy greenhouse (food above 70%) adds 2% air.
- **The difficulty settings:**

| Setting | Training | Realistic | Expedition |
| --- | --- | --- | --- |
| Cost multiplier | ×1.0 | ×1.3 | ×1.0 → ×1.45 over 30 sectors, from low Earth orbit to the Moon |
| Decision timer | none (hints shown) | 60 seconds | 75 seconds |
| Pharmacy stock | full | half | 75%, plus a resupply each sector |

**Where the numbers come from:**

- **Measured values, used as published:** radiation dose rates (0.73 mSv/day on the ISS and 1.37 on the Moon, Zhang et al., 2020; 1.8 in deep space), bone loss (0.05%/day, Lang et al., 2004), CO2 limits (Law et al., 2014), and all event facts and medical cases.
- **Design values:** the size of each decision's effect. The direction and ranking of each effect follow the source; the exact percentage was set by us on a 0–100 scale and then tested by simulation (Section 8).

**Table 1: Programmed input data and cross-system impact matrix (values taken from the code)**

| Crisis scenario | Decision / resource trade-off (input) | System impact (output) | Damage multiplier (Realistic Mode, ×1.3 on costs) | Source |
| --- | --- | --- | --- | --- |
| Solar radiation storm (S3) | Boost active protection, keep working | +10% Protection / −20% Power / +8 mSv crew dose | −26% Power | NOAA S-scale |
| Cabin pressure leak (2 mm) | Tape it now, top up from O2/N2 tanks | +18% Air / −6% Power, then −24% Air next day | −8% Power, −31% Air next day | Soyuz MS-09, 2018 |
| CO2 scrubber failure | Start backup scrubber | +16% Air / −16% Power | −21% Power | Law et al., 2014 |
| Lunar dust on solar panels | Spacewalk cleaning run | +14% Protection / +8% Power, then −24% Air next day (dust carried inside) / +3 mSv / 15% risk of decompression sickness | −31% Air next day | ESA, 2018 |
| Lunar night | Run heaters at full power | +8% Protection / −20% Power | −26% Power | ESA, 2017 |
| Medical: decompression sickness | Re-pressurise in suit + 100% O2 | Patient +15 health / −1 oxygen mask / −4% Air / −4% Power | same | Canadian Space Agency |

This table breaks down the core rules the game uses during a crisis and shows exactly what you have to sacrifice to survive. For example, boosting protection during a solar storm adds 10% protection but drains 20% of your power (26% in Realistic Mode), and the crew still absorb 8 mSv. It also shows the hidden cost of quick fixes: a spacewalk to clean lunar dust off the panels looks free today (+22% in total) but brings dust inside and costs 24% air tomorrow. By making every cost hit 30% harder, halving the pharmacy and adding a timer, Realistic Mode recreates the pressure of high-stakes decisions.

## 6. Purpose, criteria and constraints (rubric I: criteria and constraints)

**Engineering goal.** Build a low-cost simulator that teaches systems thinking about space habitats and can be shown, by testing, to reward that skill.

**Design criteria (set before coding):**

1. It runs offline in any browser with no installation, and the app is under 300 KB zipped.
2. It works fully in Arabic and English.
3. Every number is traceable to a source or labelled as a design value.
4. Every system, including the crew, can fail.
5. In Realistic mode, a systems thinker survives at least 50 points more often than random play.
6. In every location, a systems thinker survives significantly more often than a myopic player.

**Constraints:**

- No budget and no special hardware: it must run on old school computers.
- Weak or missing internet.
- Two languages, including right-to-left Arabic.
- No access to real station data on the "cost" of decisions.
- No time or approval for a human-subjects study, so validation had to be computational.

**Research questions:**

1. Does the simulator reward systems thinking, or can simpler reasoning win as often?
2. Which reasoning matters most: delayed consequences, couplings or medical decisions?
3. Can a machine-learning model forecast mission survival early enough to warn the player?

**Hypotheses:**

- **H1:** a systems thinker survives significantly more often than random play.
- **H2:** removing knowledge of delays or couplings lowers performance compared with the full systems thinker.
- **H3:** an AI model forecasts survival on unseen missions better than a "weakest system" rule, with AUC > 0.80.

## 7. Methods & Procedures (rubric II: alternatives, solution, prototype)

### Left column: Phase A, design and build

1. **Alternatives considered.**

| Decision | Options weighed | Chosen, and why |
| --- | --- | --- |
| Platform | game engine (Unity) or plain web page | Plain HTML/JavaScript, because it runs offline on any computer |
| Structure | one big file or modular files | 25 modular files, with all the science kept in data files |
| How to validate | student study, or simulated players | Simulated players (no participants needed, fully reproducible); a classroom study is next |
| The "systems thinker" bot | hand-written rule, or mental simulation | Mental simulation, because the hand-written rule from v5 failed: only 60.0% survival |
| AI in the app | gradient-boosted trees or logistic regression | Logistic regression: almost as accurate (AUC 0.863 vs 0.870), small and explainable, runs in the browser |

2. **Collect data.** 37 sources: ESA, the Canadian Space Agency, CNSA/CAS, NOAA, the Belgian STCE, and journals including NEJM, JAMA Network Open, The Lancet Neurology, PNAS and npj Microgravity (NASA is 5 of the 37).
3. **Build the model.** A stock-and-flow model with 4 station stocks and 4 crew members, and one decision per day from 3 options. Each night the following steps run in order:
   1. passive drains;
   2. delayed effects;
   3. 8 negative and 1 positive coupling rules;
   4. crew physiology (dose by location; bone loss);
   5. medical triggers.
4. **Medical Bay.** Examine with tools that cost power or test kits, diagnose from 4 options, and treat from a limited pharmacy. Cases are triggered by risky choices, by station state or at random.
5. **Iterate.** Each test result fed back into the design: v5 → v6 → v7 (Section 8).

### Right column: Phase B, testing in multiple conditions

**Controlled variables:**

- the same engine code as the app;
- fixed random seeds, so every player faces identical crises (a paired design);
- the same mode settings.

**Experiment 1: validation.**

- **Players:** a random player and a systems thinker.
- **Conditions:** 4 (Training LEO, and Realistic LEO, cislunar and Moon).
- **Sample:** 5,000 missions each, 40,000 in total.
- **Test:** two-proportion z-test.

**Experiment 2: reasoning ablation.**

- **The systems thinker:** for each option, it copies the station and runs the real night model three nights ahead, then picks the best result.
- **Ablated players:** each one removes one piece of knowledge:
  - **Myopic:** looks only at today.
  - **No delays:** does not know about delayed consequences.
  - **No couplings:** does not know that systems pull on each other.
  - **Random medicine:** full engineering reasoning, random diagnosis and treatment.
  - **Random:** picks any option.
  - **v5 rule:** a hand-written rule of thumb.
- **Design:** 7 models × 3 locations × 5,000 paired missions (105,000 in total), run on v5 and on the final version.
- **Dependent variables:** survival, the failed system, the day of failure, crew health and dose.
- **Tests:** exact McNemar test for survival and paired t-test for crew health, with 95% confidence intervals and α = 0.05.

**Experiment 3: AI Flight Director.**

- **Data:** missions played by a systems thinker who makes a random move with probability ε (drawn per mission from 0 to 1, from expert to novice). ε is hidden from the model.
- **Snapshots:** after every night, we save 17 features of the station; the label is whether the mission survived.
- **Split by mission:** training uses 6,000 missions (51,351 snapshots); testing uses 2,000 different missions (17,100 snapshots).
- **Models:** logistic regression (5-fold cross-validation) and gradient-boosted trees, compared with 2 baselines.
- **Metrics:** AUC, accuracy, Brier score, calibration and feature importance.

## 8. Results & Data analysis (rubric III: tested in multiple conditions)

**Table 2: Experiment 1, systems thinker vs random play (5,000 missions each)**

| Condition | Systems thinker (95% CI) | Random (95% CI) | Difference | z | Cohen's h |
| --- | --- | --- | --- | --- | --- |
| Training, LEO | 99.7% (99.5–99.9) | 38.3% (37.0–39.6) | +61.4 pts | 66.4 | 1.70 |
| Realistic, LEO | 96.7% (96.2–97.2) | 8.3% (7.5–9.1) | +88.4 pts | 88.5 | 2.19 |
| Realistic, cislunar | 99.5% (99.4–99.7) | 11.8% (10.9–12.7) | +87.8 pts | 88.3 | 2.31 |
| Realistic, Moon | 94.6% (94.0–95.3) | 7.8% (7.0–8.5) | +86.9 pts | 86.9 | 2.11 |

**Table 3: Experiment 2, reasoning ablation (Realistic mode; % of missions survived; 5,000 paired missions per cell)**

| Player model | Knows delays | Knows couplings | v5, LEO | Final, LEO | Final, cislunar | Final, Moon | Final LEO crew health |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Random | — | — | 24.2 | 8.3 | 11.8 | 7.8 | 75.3 |
| Myopic (today only) | ✗ | ✗ | 98.3 | 52.8 | 82.8 | 73.4 | 85.1 |
| Lookahead, no delays | ✗ | ✓ | 97.6 | 56.0 | 86.9 | 76.5 | 86.3 |
| Lookahead, no couplings | ✓ | ✗ | 99.2 | 96.1 | 97.9 | 94.9 | 86.6 |
| **Full systems thinker** | ✓ | ✓ | 98.9 | **96.7** | **99.5** | **94.6** | **89.8** |
| Full, random medicine | ✓ | ✓ | 96.3 | 93.9 | 95.5 | 94.2 | 74.9 |
| v5 hand-written rule | partly | partly | 96.0 | 60.0 | 77.4 | 67.8 | 82.7 |

**Table 4: Experiment 3, AI model on 2,000 unseen missions**

| Model | AUC | Accuracy | Brier score (lower is better) |
| --- | --- | --- | --- |
| Always guess "survives" | 0.50 | 58.8% | — |
| Weakest system only | 0.601 | 64.1% | 0.233 |
| **Logistic regression (in the app)** | **0.863** | **78.3%** | **0.148** |
| Gradient-boosted trees | 0.870 | 79.1% | 0.143 |

Cross-validated AUC of the logistic model: 0.861 ± 0.004.

**Figures:**

- **Figure 1:** reasoning ladder, v5 vs final.
- **Figure 2:** systems thinker vs random in 4 conditions.
- **Figure 3:** AI calibration and early warning.
- **Figure 4:** which system failed first, and when.
- **Figure 5:** the reasoning ladder in all three locations.

**Analysis.**

1. **H1 supported.** In every condition the systems thinker beat random play by 61–88 points (all p < 0.001; h = 1.70–2.31, very large effects). Criterion 5 is met.
2. **Version 5 failed criterion 6.** A myopic player survived 98.3% of missions, as often as the systems thinker (98.9%). Only 9 of 69 options had delayed costs, and the couplings were weak, so the game rewarded common sense, not systems thinking.
3. **The redesign worked (H2).**
   - **v6:** stronger couplings (×1.5, thresholds 35 → 40%) and doubled delayed costs.
   - **v7:** delayed costs added to 7 lunar quick fixes, a power drain on the Moon, and a harder Training mode.
   - **Result:** the myopic player now loses in every location (52.8% LEO, 82.8% cislunar, 73.4% Moon; all p < 0.001 vs the systems thinker), so criterion 6 is met.
4. **Delay knowledge is the largest single factor.** Removing it cost 40.7 points in LEO (2,069 vs 37 discordant missions, p < 0.001), 18.1 on the Moon and 12.6 in cislunar space. This matches research showing that people misjudge delays (Sterman, 1989).
5. **Couplings and medicine mainly protect the crew.**
   - **Couplings:** without coupling knowledge, crew health fell from 89.8 to 86.6 (paired t = 35.5, p < 0.001); survival also fell in cislunar space (97.9 vs 99.5%, p < 0.001).
   - **Medicine:** with random medicine, crew health fell from 89.8 to 74.9 (t = 80.4, p < 0.001) and LEO survival fell from 96.7 to 93.9% (p < 0.001).
6. **H3 supported.**
   - **Accuracy:** the AI reached an AUC of 0.863 on unseen missions, against 0.601 for the weakest-system rule, and its probabilities are well calibrated (Figure 3A).
   - **Early warning:** on day 5 it flags 70.8% of the missions that will fail, and 81.4% of its warnings are correct.
   - **What it learned:** its top inputs were the day, the weakest system, power, food and pending delayed costs. On its own, it found the same factor as Experiment 2.
7. **Failures build up late.** 78.3% of failed random missions ended on days 8–10, and only 0.3% before day 5: the slow accumulation that stock-and-flow research says people miss.

## 9. Applications

- **Schools:** a free, offline, bilingual tool for physics, biology and engineering classes; it runs from a USB stick on any computer.
- **Checking educational games:** our ablation method (removing one kind of reasoning from a player model) can test whether any educational game really requires the skill it claims to teach, before students use it.
- **AI as a teaching aid:** the AI Flight Director shows the survival chance after each night and names the main concerns, so students see the effect of their decisions before failure arrives.
- **Medical education:** the Medical Bay practises clinical reasoning with limited resources, which also applies on Earth in remote clinics, ships, Antarctic stations and disaster zones.
- **Research:** telemetry (one row per decision, plus the AI forecast) allows future studies to compare each student's decisions with the player models.

## 10. Conclusion

We built an accessible simulator and tested it in multiple conditions until it could not be won by luck or by simple common sense:

- **Criteria met:** all six design criteria are met (Table 2 and Figure 5).
- **Testing caught our own flaw:** the first version could be won without systems thinking. After two documented redesigns, a myopic player loses in every location, while a player who understands delays and couplings survives 94.6–99.5% of missions.
- **Delays matter most:** knowing about delayed consequences is the single most valuable skill (+40.7 points of survival), which is exactly the skill the research says learners lack.
- **Medicine matters:** medical decisions decide crew health.
- **The AI works:** a machine-learning model forecasts mission survival on unseen missions (AUC 0.86) and runs inside the app.

**Limitations:**

- **Players are not students:** the player models show what the simulator *rewards*, not yet what students *learn*.
- **Design values:** effect sizes are design values (Section 5). We limited this risk by changing only global settings and reporting every version.
- **AI training data:** the AI was trained on simulated players, so it must be checked against real students.
- **Medical content:** it is simplified for education.

**Future work:**

- A classroom pre/post study with IRB approval, using the built-in test and telemetry.
- Classifying students' decision styles against the player models.
- A Mars profile.

## 11. References

Auñón-Chancellor, S. M., Pattarini, J. M., Moll, S., & Sargsyan, A. (2020). Venous thrombosis during spaceflight. *New England Journal of Medicine, 382*(1), 89–90.

Booth Sweeney, L., & Sterman, J. D. (2000). Bathtub dynamics: Initial results of a systems thinking inventory. *System Dynamics Review, 16*(4), 249–286.

Cronin, M. A., & Gonzalez, C. (2007). Understanding the building blocks of dynamic systems. *System Dynamics Review, 23*(1), 1–17.

Cronin, M. A., Gonzalez, C., & Sterman, J. D. (2009). Why don't well-educated adults understand accumulation? *Organizational Behavior and Human Decision Processes, 108*(1), 116–130.

European Space Agency. (2017). *Surviving the long dark night of the Moon.* ESA.

European Space Agency. (2018). *The toxic side of the Moon.* ESA.

Lang, T., LeBlanc, A., Evans, H., Lu, Y., Genant, H., & Yu, A. (2004). Cortical and trabecular bone mineral loss from the spine and hip in long-duration spaceflight. *Journal of Bone and Mineral Research, 19*(6), 1006–1012.

Law, J., Van Baalen, M., Foy, M., Mason, S. S., Mendez, C., Wear, M. L., Meyers, V. E., & Alexander, D. (2014). Relationship between carbon dioxide levels and reported headaches on the International Space Station. *Journal of Occupational and Environmental Medicine, 56*(5), 477–483.

Marshall-Goebel, K., Laurie, S. S., Alferova, I. V., et al. (2019). Assessment of jugular venous blood flow stasis and thrombosis during spaceflight. *JAMA Network Open, 2*(11), e1915011.

McNemar, Q. (1947). Note on the sampling error of the difference between correlated proportions or percentages. *Psychometrika, 12*(2), 153–157.

NOAA Space Weather Prediction Center. (2020). *NOAA space weather scales: Solar radiation storms (S1–S5).*

Pedregosa, F., Varoquaux, G., Gramfort, A., et al. (2011). Scikit-learn: Machine learning in Python. *Journal of Machine Learning Research, 12*, 2825–2830.

Senge, P. M. (1990). *The fifth discipline: The art and practice of the learning organization.* Doubleday.

Sterman, J. D. (1989). Modeling managerial behavior: Misperceptions of feedback in a dynamic decision making experiment. *Management Science, 35*(3), 321–339.

Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. *Cognitive Science, 12*(2), 257–285.

Wouters, P., van Nimwegen, C., van Oostendorp, H., & van der Spek, E. D. (2013). A meta-analysis of the cognitive and motivational effects of serious games. *Journal of Educational Psychology, 105*(2), 249–265.

Zhang, S., Wimmer-Schweingruber, R. F., Yu, J., et al. (2020). First measurements of the radiation dose on the lunar surface. *Science Advances, 6*(39), eaaz1334.

*The full list of 37 data sources is in the app's Handbook and in `docs/DATA_TABLE.md`.*

# Part B: For the team (not for the poster)

## B1. Every statistic: where it comes from, how it was computed, and why

| Statistic | Where (file) | How it was computed | Why we use it |
| --- | --- | --- | --- |
| Survival % | `research/montecarlo-runs.csv`, `ablation-runs.csv` | Missions survived ÷ missions played (5,000 per cell), using the same game engine as the app | The main outcome: did the station survive 10 days? |
| 95% confidence interval | the same files | p ± 1.96 × √(p(1−p)/n) | Shows how precise each % is; with n = 5,000 it is about ±1 point |
| z (two-proportion test) | Experiment 1 | (p₁ − p₂) ÷ √(p̄(1−p̄)·2/n) | Tests whether the two players differ by more than chance (independent groups) |
| Cohen's h | Experiment 1 | 2·asin√p₁ − 2·asin√p₂ | Effect size for proportions: 0.2 small, 0.5 medium, 0.8 large |
| McNemar exact test | Experiment 2 | Only discordant pairs count (missions that one player survived and the other didn't); binomial test | The correct test for paired yes/no data (same seeds = same crises) |
| Paired t-test (crew health) | Experiment 2 | Difference in final mean crew health for the same seed | Health is a number, not yes/no, and the design is paired |
| AUC | `research/ml-results.json` | The probability that the model ranks a surviving mission above a failing one (0.5 = guessing) | Standard measure for yes/no prediction that does not depend on a cut-off |
| Accuracy | the same file | % of test snapshots predicted correctly at 50% | Easy to explain; compare with the 58.8% from always guessing |
| Brier score | the same file | Mean of (predicted probability − outcome)² | Checks probability quality; lower is better |
| Calibration | the same file, Figure 3A | Groups the predictions into 10 bins and compares predicted vs observed survival | Shows the % the AI displays can be trusted |
| Cross-validation | the same file | 5 folds, grouped by mission, so no mission is split across folds | Shows the result is stable (± 0.004), not luck |
| Day-5 warning recall / precision | the same file | Recall = failing missions flagged ÷ all failing missions; precision = correct warnings ÷ all warnings | Shows how early and how reliably it warns |
| Failure-day distribution | `montecarlo-runs.csv` | The day each failed random mission ended | Shows that failures build up slowly (stock-and-flow) |

Everything is reproducible: the same five commands in the README produce the same numbers, because every mission has a fixed seed.

## B2. Where do the game's percentages come from?

Short answer: they are **not random, and not measured**.

- **From research:** the event itself, the options, which systems each option affects, and which option costs more. For example, a full-power restart of the oxygen generator costs more power than drawing on stored tanks.
- **Set by us:** the exact size, on a 0–100 scale.
- **Tested:** Experiments 1 and 2 check that the sizes produce a fair game, where every system can fail and reasoning beats luck and common sense.

Values that *are* used exactly as measured include the radiation dose rates, bone loss, CO2 limits, and the medical cases and treatments. The full list is in `docs/DATA_PROVENANCE.md`.

## B3. From the first app to the final version

| Area | First app (single file) | Final version |
| --- | --- | --- |
| Code | 1 file, about 1,320 lines | 25 modular files; the science sits in data files; research tools in Node and Python |
| Sources | Mostly NASA, including a "LIVE NASA" badge that stayed on even when the connection failed | 37 sources (NASA 5) |
| Crises | 15, some fictional (alien signal, AI rebellion, artificial gravity) | 23 real, documented crises × 3 options (69 trade-offs) |
| Systems | 4, with no links between them | 5 (crew included), 9 nightly coupling rules, delayed consequences |
| Medical | none | Medical Bay: 17 cases, examine → diagnose → treat, limited pharmacy (varies by mode) |
| Known bugs | Shields could never fail; Training also cut the gains; labels could contradict the numbers; facts attached to the wrong events; biased shuffle | All fixed |
| Testing | Claimed results that were never measured | 40,000 + 105,000 simulated missions, with statistics |
| AI | none | Trained model (AUC 0.86) running in the app |
| Research tools | none | Pre/post test, telemetry export, reproducible pipeline |

## B4. Difficulty: is the game too easy?

**No, but Training was, and we fixed it.**

- **Training:** random clicking used to survive 84% of missions. It is now 38%, while thinking carefully still works (99.7%).
- **Realistic:** random clicking survives only 8–12%, and even a player who thinks only about today loses 17–47% of missions.

We recommend not making it harder, for three reasons:

1. **The bot is stronger than any student.** Our systems thinker knows the exact rules and simulates them perfectly, yet it still fails up to 5% of Realistic missions. A student does not know the rules, so they will fail much more often.
2. **The game is for learning, not for punishment.** If Realistic were made harder, even good students would lose most of the time and learn little.
3. **There are already three difficulty levels**, and Expedition gets harder step by step across 30 sectors.

## B5. Questions judges may ask

- **"Why no students?"** We first had to prove the tool rewards the skill. Our ablation showed v5 didn't, so testing students on it would have measured the wrong thing. A classroom study is the next phase, and the pre/post test and telemetry are already built in.
- **"Are the percentages real?"** The events, the treatments and the physiology numbers are real. The size of each decision's effect is a design value, tested by simulation. See B2.
- **"Did you tune the game so your bot wins?"** We changed only global settings: coupling strength, delayed costs and drains. The goal was that understanding delays and couplings matters, as research says it should. We report the "before" version too.
- **"Is the AI just predicting your bots?"** Yes, it was trained and tested on simulated players with skill levels from novice to expert. On missions it never saw, it is well calibrated and far better than a simple rule. Testing it on students is future work.
- **ISEF category:** Systems Software (SOFT). There are no human participants, so no IRB is needed.

## B6. Rubric checklist (ISEF engineering)

- **Research Problem (10):** need → Sections 2–3; criteria and constraints → Section 6.
- **Design & Methodology (15):** alternatives → Methods, left column, table; solution and prototype → Methods steps and the app.
- **Execution (20):** tested in multiple conditions (3 locations × 2 modes × 7 players, 145,000 missions) → Section 8.
- **Creativity (20):** testing an educational game with "ablated" player models, plus a medical system and an AI built into the game.
- **Poster (10):** 5 figures with legends and sample sizes; data provenance in Section 5.
