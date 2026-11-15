# Telemetry columns (research data export)

One CSV row per event. `type` = `decision`, `night`, `medical` or `summary`.

| Column | Meaning |
| --- | --- |
| participant, group | Code and group typed in Research mode (never a real name) |
| mode, profile, seed, version | Game mode, mission location, random seed (replay), app version |
| level, day | Expedition sector (1 otherwise) and mission day |
| event, category | Scenario or medical case id; engineering / environment / bio / human |
| choice | Option index picked (0–2) |
| time_ms | Decision time in milliseconds (decision-making under pressure) |
| timed_out | 1 if the timer ran out and "no action" was applied |
| hint_viewed, card_flipped | Did the student open the hint / the science card? (engagement) |
| *_before, *_after | Power, protection, air, food (%) before and after the decision |
| crew_health | Mean crew health after the event |
| ai_p_survive | AI Flight Director survival forecast (%) after each night (v6) |
| tools | Diagnostic tools used in a medical case (e.g. `ultrasound|lab`) |
| dx_correct, tx_quality | Diagnosis right (1/0); treatment quality 2 best, 1 partial, 0 harmful |
| score_total, grade, dx_accuracy, mean_decision_s, mean_dose_mSv, quiz_score | Mission summary row |

## Useful analyses
- **Learning inside the game:** does the minimum resource level per day rise from Day 1 to Day 10?
- **Engagement:** do students who flip the science card score higher on the post-test?
- **Pressure:** compare `time_ms` and choice quality in Realistic (timer) vs Training (no timer).
- **Diagnostics:** does using more tools raise `dx_correct`?

Assessment export columns: participant, group, phase (pre/post/delayed), date, score (0–12), systems_score (0–6),
content_score (0–6), time_s, q1…q12 (index of the option chosen; the correct option is index 0 in `js/data/assessment.js`).
