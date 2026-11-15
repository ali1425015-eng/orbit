# Dataset — ORBITAL TRADE-OFFS

Generated from the code by `node tools/export-data.js`. Negative values are multiplied by the mode cost multiplier (Training ×1.0, Realistic ×1.3, Expedition ×1.0→1.45).

## 1. Station crises (23 scenarios × 3 decisions = 69 trade-offs)

| # | Crisis | Where | Decision | Effect (input → output) | Source |
| --- | --- | --- | --- | --- | --- |
| 1 | **Solar Radiation Storm (S3)** | leo, cislunar, moon | Shelter crew behind the water wall | -4% Power; -14% Food; +2 mSv dose | [NOAA SWPC (via UNDRR)](https://undrr.org/quick/78528) |
| 2 |  |  | Boost active protection, keep working | -20% Power; +10% Protection; +8 mSv dose |  |
| 3 |  |  | Continue normal operations | -10% Protection; +6% Food; +30 mSv dose; 80% risk: radexpo |  |
| 4 | **Cabin Pressure Leak (2 mm hole)** | leo, cislunar | Isolate modules, then epoxy patch | -3% Power; +12% Air; -12% Food | [Spaceflight Now](https://spaceflightnow.com/2018/08/30/cosmonauts-plug-small-air-leak-on-the-international-space-station/) |
| 5 |  |  | Tape it now, top up from O2/N2 tanks | -6% Power; +18% Air; later(+1d) -24% Air |  |
| 6 |  |  | Monitor only, keep schedule | +4% Power; -10% Air; later(+1d) -16% Air |  |
| 7 | **Debris Cloud Conjunction** | leo | Debris-avoidance burn | -14% Power; +10% Protection | [SpacePolicyOnline](https://spacepolicyonline.com/news/russian-asat-test-creates-thousands-of-pieces-of-space-debris-imperils-iss) |
| 8 |  |  | Shelter crew in return vehicles | +4% Protection; -4% Air; -12% Food |  |
| 9 |  |  | Accept the risk | -22% Protection; 40% risk: eyefb |  |
| 10 | **CO2 Scrubber Failure** | leo, cislunar, moon | Start backup scrubber | -16% Power; +16% Air | [J. Occupational & Environmental Medicine (Law et al.)](https://aminer.org/pub/55a6638365ce054aad65f738/relationship-between-carbon-dioxide-levels-and-reported-headaches-on-the-international-space) |
| 11 |  |  | Extend grow-light hours (plants absorb CO2) | -12% Power; +10% Air; +6% Food |  |
| 12 |  |  | Cancel exercise to lower CO2 output | +7% Air; -4 crew health |  |
| 13 | **Oxygen Generator Down** | leo, cislunar, moon | Light oxygen candles | -6% Protection; +20% Air; 25% risk: smoke | [NASA APPEL Knowledge Services](https://appel.nasa.gov/wp-content/uploads/2013/04/602090main_44s_international_life_support.pdf) |
| 14 |  |  | Draw on stored O2 tanks | -3% Power; +14% Air; later(+2d) -16% Air |  |
| 15 |  |  | Full-power restart of electrolysis | -18% Power; +18% Air |  |
| 16 | **Smoke in the Lab Module** | leo, cislunar, moon | Seal and vent the module to vacuum | -20% Air; -6% Food | [NASA APPEL Knowledge Services](https://appel.nasa.gov/wp-content/uploads/2013/04/602090main_44s_international_life_support.pdf) |
| 17 |  |  | Masks on, fight with extinguishers | -6% Power; -8% Air; 55% risk: smoke |  |
| 18 |  |  | Cut power to the module and wait | -14% Power; -6% Air; -8% Food |  |
| 19 | **Ammonia Coolant Leak** | leo, cislunar | Emergency spacewalk: replace pump | -6% Power; +18% Protection; +3 mSv dose; 30% risk: dcs | [ESA](https://www.esa.int/ESA_Multimedia/Images/2013/05/Spacewalk_repairing_ammonia_leak) |
| 20 |  |  | Shut the loop, move loads to another channel | -20% Power; -4% Protection |  |
| 21 |  |  | Keep running, refill ammonia later | -14% Protection; later(+1d) -16% Protection |  |
| 22 | **Battery Stress in Orbital Night** | leo | Dim greenhouse LEDs at night | +12% Power; -14% Food | [The Lancet Neurology (Barger et al.)](https://www.eurekalert.org/news-releases/541449) |
| 23 |  |  | Deep-discharge the batteries | +18% Power; later(+2d) -28% Power |  |
| 24 |  |  | Turn off heaters in empty modules | +12% Power; -14% Protection |  |
| 25 | **Solar Array Degradation** | leo, cislunar | Robotic-arm inspection and string reroute | +14% Power; -4% Protection; -8% Food | [NOAA SWPC (via UNDRR)](https://undrr.org/quick/78528) |
| 26 |  |  | Spacewalk repair | +22% Power; -4% Air; +3 mSv dose; 25% risk: dcs |  |
| 27 |  |  | Accept reduced output | -14% Power |  |
| 28 | **Water Processor Failure** | leo, cislunar, moon | Ration greenhouse irrigation | +4% Power; -16% Food | [NASA (via phys.org)](https://phys.org/news/2023-06-nasa-recovery-milestone-international-space.html) |
| 29 |  |  | Power-heavy distillation restart | -18% Power; +6% Food |  |
| 30 |  |  | Manual repair shift | -6% Air; -6% Food; -3 crew health; +6 stress |  |
| 31 | **Mold in the Greenhouse** | leo, cislunar, moon | Run chamber fans at maximum | -12% Power; -4% Food | [ScienceDaily (NASA Goddard)](https://www.sciencedaily.com/releases/2016/01/160119143038.htm) |
| 32 |  |  | Trim infected leaves, reduce watering | -2% Air; -8% Food; +4 stress |  |
| 33 |  |  | UV-C sterilization cycle | -18% Power; +6% Food |  |
| 34 | **Cargo Ship Lost at Launch** | leo, cislunar | Ration calories by 10% | +6% Food; -5 crew health; +6 stress | [SpacePolicyOnline](https://spacepolicyonline.com/news/iss-operations-ok-despite-cargo-losses-but-whats-the-future/) |
| 35 |  |  | Harvest the greenhouse early | -4% Air; +14% Food; later(+2d) -24% Food |  |
| 36 |  |  | Cut experiments, power down labs | +8% Power; -10% Food |  |
| 37 | **Geomagnetic Storm Raises Drag** | leo | Reboost now | -14% Power; +6% Protection | [NOAA / AGU Space Weather](https://repository.library.noaa.gov/view/noaa/53091/noaa_53091_DS1.pdf) |
| 38 |  |  | Fly edge-on to cut drag | -10% Power; -4% Food |  |
| 39 |  |  | Wait for the storm to pass | -8% Protection; later(+1d) -28% Power |  |
| 40 | **Water Inside a Spacesuit Helmet** | leo, cislunar, moon | Abort the spacewalk now | -10% Protection | [ESA](https://www.esa.int/ESA_Multimedia/Videos/2013/09/Spacewalks) |
| 41 |  |  | Finish a shortened task | +8% Protection; +2 mSv dose; 60% risk: evawater |  |
| 42 |  |  | Hand the task to the robotic arm | -16% Power; +6% Protection |  |
| 43 | **Ground Link Lost** | leo, cislunar, moon | Autonomous operations for 2 days | +4% Power | [Chinese Academy of Sciences / CNSA](https://english.cas.cn/newsroom/news/201901/t20190107_203642.shtml) |
| 44 |  |  | Power the backup antenna | -14% Power |  |
| 45 |  |  | Re-point the station for a relay link | -4% Power; -10% Protection |  |
| 46 | **Crew Tension and Monotony** | leo, cislunar, moon | Free day and video calls home | -4% Power; -8% Food; -20 stress | [PNAS (Basner et al.)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3574912) |
| 47 |  |  | Keep the schedule | +6% Food; +18 stress; 60% risk: stress |  |
| 48 |  |  | Team greenhouse sessions | -8% Power; +4% Food; -10 stress |  |
| 49 | **Crew Sleep Deficit** | leo, cislunar, moon | Circadian lighting schedule | -10% Power; +4 crew health; -8 stress | [The Lancet Neurology (Barger et al.)](https://www.eurekalert.org/news-releases/541449) |
| 50 |  |  | Issue sleep aids | +3 crew health; -4 stress |  |
| 51 |  |  | Push through the workload | +6% Food; -6 crew health; +10 stress; 50% risk: insomnia |  |
| 52 | **Deep-Space Dose Budget Review** | cislunar | Restow water and food around sleep stations | +14% Protection; -8% Food | [Springer (Handbook of Space Medicine)](https://link.springer.com/10.1007/978-3-030-16996-1_20) |
| 53 |  |  | Power active dosimetry and alerts | -12% Power; +8% Protection |  |
| 54 |  |  | Accept the higher rate | +12 mSv dose |  |
| 55 | **Lunar Night Begins** | moon | Fuel cells + shed greenhouse loads | -8% Power; -14% Food; later(+2d) -12% Power | [ESA](https://www.esa.int/Enabling_Support/Space_Engineering_Technology/Surviving_the_long_dark_night_of_the_Moon) |
| 56 |  |  | Run heaters at full power | -20% Power; +8% Protection |  |
| 57 |  |  | Retreat to one small heated module | -10% Protection; -6% Air; later(+2d) -12% Protection; +12 stress |  |
| 58 | **Lunar Dust Inside the Habitat** | moon | Electrostatic cleaning of suits and airlock | -12% Power; +6% Air | [ESA](https://www.esa.int/Our_Activities/Human_and_Robotic_Exploration/The_toxic_side_of_the_Moon) |
| 59 |  |  | Swap all HEPA filters | +14% Air; -4% Food; later(+2d) -18% Air |  |
| 60 |  |  | Carry on | -8% Air; later(+1d) -14% Air; 70% risk: hayfever |  |
| 61 | **Dust on Radiators and Panels** | moon | EVA cleaning run | +8% Power; +14% Protection; later(+1d) -24% Air; +3 mSv dose; 15% risk: dcs | [ESA](https://www.esa.int/Our_Activities/Human_and_Robotic_Exploration/The_toxic_side_of_the_Moon) |
| 62 |  |  | Robotic brushing | -10% Power; +10% Protection |  |
| 63 |  |  | Accept the losses | -8% Power; -12% Protection; later(+2d) -10% Power |  |
| 64 | **Meteoroid Impact Near the Base** | moon | Drone inspection and seal check | -10% Power; +8% Protection | [ESA / National Observatory of Athens](https://www.esa.int/Space_Safety/ESA_s_new_project_to_keep_an_eye_on_Moon_strikes) |
| 65 |  |  | Build a regolith berm with the robot | -18% Power; +18% Protection |  |
| 66 |  |  | Log it and continue | -12% Protection; later(+1d) -20% Air |  |
| 67 | **Expand the Farm into Regolith?** | moon | Stay hydroponic, run more lights | -14% Power; +10% Food | [Communications Biology (Paul et al.)](https://www.sci.news/space/lunar-soil-plants-10803.html) |
| 68 |  |  | Start regolith beds (slow payoff) | -4% Power; +2% Food; later(+2d) +28% Food |  |
| 69 |  |  | Pause farm expansion | -10% Food; later(+2d) -8% Food |  |

## 2. Medical cases (17)

| Case | Trigger | Correct diagnosis | Best treatment (kit) | Verified fact | Source |
| --- | --- | --- | --- | --- | --- |
| Nausea After Arrival | Random until day 3 | Space motion sickness | Antiemetic injection + rest, slow head movements (antiemetic) | Space motion sickness affects about 73% of first-time flyers; injected promethazine had about a 90% initial response. | [J. Vestibular Research (Jennings)](https://content.iospress.com:443/articles/journal-of-vestibular-research/ves8-1-10) |
| Pounding Headache | Air < 50% | CO2-related headache | Boost CO2 scrubbing + move to a ventilated module (—) | On the ISS, headache odds doubled per 1 mmHg of CO2; keeping a 7-day average below about 2.5 mmHg kept risk under 1%. | [J. Occupational & Environmental Medicine (Law et al.)](https://aminer.org/pub/55a6638365ce054aad65f738/relationship-between-carbon-dioxide-levels-and-reported-headaches-on-the-international-space) |
| Short of Breath, Lips Bluish | Air < 30% | Hypoxemia from low cabin O2 | Supplemental oxygen mask + restore O2 generation (oxygen) | Closed and hostile environments are one of five spaceflight hazards linked to 30+ documented health risks. | [npj Microgravity (Patel et al.)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7645687) |
| Joint Pain After a Spacewalk | Earlier decision (risk) | Decompression sickness ("the bends") | Re-pressurize in the suit + 100% oxygen (oxygen) | Stations keep 14.7 psi but the US suit runs at 4.3 psi (like Everest's summit), so crews prebreathe oxygen to avoid DCS. | [Canadian Space Agency](https://www.asc-csa.gc.ca/eng/astronauts/space-medicine/decomp.asp) |
| Routine Neck Scan Shows Something | Random from day 4 | Jugular vein thrombosis (clot) | Anticoagulant injections with telemedicine follow-up (anticoag) | In 11 ISS astronauts, 6 had stagnant or reversed jugular flow and 1 had a clot; it was treated in orbit with enoxaparin, then apixaban. | [New England Journal of Medicine (Auñón-Chancellor et al.)](https://www.eurekalert.org/news-releases/824124) |
| Severe Flank Pain | Random from day 4 | Kidney stone | Pain relief + IV fluids + potassium citrate (analgesic, iv, kcitrate) | Spaceflight raises urinary calcium and lowers urine volume and citrate; potassium citrate was tested on the ISS to reduce stone risk. | [NASA Technical Reports (Whitson et al.)](https://ntrs.nasa.gov/citations/20000020539) |
| Lower Back Ache | Random until day 5 | Space adaptation back pain | Knees-to-chest "fetal tuck" stretch + pain reliever (analgesic) | A review of 728 astronauts found 52% had space adaptation back pain; most cases were mild. | [Aviat. Space Environ. Med. (Kerstman et al.)](https://www.peeref.com/works/7344683) |
| Blurry Near Vision | Random from day 5 | Neuro-ocular syndrome (SANS) | Plus-lens glasses + weekly OCT monitoring (lens) | SANS includes optic disc edema, globe flattening, choroidal folds and hyperopic shifts in long-duration astronauts. | [npj Microgravity (Lee et al.)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7005826/) |
| Itchy Red Rash | Random | Skin hypersensitivity (allergic rash) | Antihistamine + gentle skin care (antihist) | In 46 long-duration ISS crew members, skin rashes were the most reported clinical event (1.12 per flight-year). | [Int. J. General Medicine (Crucian et al.)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5098747) |
| Cold Sores and Sore Throat | Random from day 3 | Latent virus reactivation | Antiviral + rest (antiviral) | Upper-respiratory symptoms were the second most common event on long ISS missions (0.97 per flight-year). | [Int. J. General Medicine (Crucian et al.)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5098747) |
| Cannot Sleep, Making Errors | Earlier decision (risk) | Sleep deficiency (circadian disruption) | Fixed sleep window + dimmed blue light in the evening (—) | Three-quarters of ISS crew members used sleep medication at some point; average sleep was just over 6 hours. | [The Lancet Neurology (Barger et al.)](https://www.eurekalert.org/news-releases/541449) |
| Coughing After the Fire | Earlier decision (risk) | Smoke inhalation injury | Oxygen mask + clean module + monitor (oxygen) | After the 1997 Mir fire the crew wore respirators until life support cleared the smoke. | [NASA APPEL Knowledge Services](https://appel.nasa.gov/wp-content/uploads/2013/04/602090main_44s_international_life_support.pdf) |
| "Am I Radiation Sick?" | Earlier decision (risk) | No acute radiation sickness; stress + cumulative dose | Record dose, remove from spacewalk roster, reassure (—) | Career radiation limits are 600 mSv (NASA) and 1,000 mSv (ESA); a 6-month ISS stay gives about 80–160 mSv. | [Springer (Handbook of Space Medicine)](https://link.springer.com/10.1007/978-3-030-16996-1_20) |
| Near-Drowning in a Helmet | Earlier decision (risk) | Water aspiration (near-drowning) | Oxygen, monitor lungs 24 h, no EVA for a week (oxygen) | In 2013 ESA's Luca Parmitano faced water building up inside his helmet during a spacewalk. | [ESA](https://www.esa.int/ESA_Multimedia/Videos/2013/09/Spacewalks) |
| "Lunar Hay Fever" | Earlier decision (risk) | Lunar dust irritation | Antihistamine + eye rinse + clean filters (antihist) | Apollo 17's Harrison Schmitt described sneezing, watery eyes and a sore throat as "lunar hay fever". | [ESA](https://www.esa.int/Our_Activities/Human_and_Robotic_Exploration/The_toxic_side_of_the_Moon) |
| Withdrawn and Irritable | Earlier decision (risk) | Isolation and confinement stress | Private psychologist call + lighter schedule (—) | Mars-500 showed large differences between crew members in how they reacted to 520 days of isolation. | [PNAS (Basner et al.)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3574912) |
| Something in My Eye | Earlier decision (risk) | Corneal foreign body | Irrigate, remove flake, antibiotic drops (antibiotic) | Closed environments are one of the five spaceflight hazards studied for crew health. | [npj Microgravity (Patel et al.)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7645687) |

## 3. Coupling rules (system of systems)

| From | To | Active when | Effect | Why |
| --- | --- | --- | --- | --- |
| power | air | < 40% | -6% Air/night | Low power throttles CO2 scrubbers and O2 electrolysis. |
| power | bio | < 40% | -4% Food/night | Grow lights are dimmed to save power. |
| prot | bio | < 40% | -4% Food/night | Thermal control drifts; plants suffer heat/cold stress. |
| prot | crew | < 40% | dose ×2 | Weaker shielding doubles the crew's daily radiation dose. |
| air | crew | < 50% | crew health -3/night | CO2 rises and O2 falls: headaches, fatigue, low SpO2. |
| bio | air | < 40% | -4% Air/night | Fewer plants means less oxygen made and less CO2 absorbed. |
| bio | crew | < 40% | crew health -4/night | Food shortage: lower calories, slower healing. |
| crew | bio | < 60% | -3% Food/night, -3% Power/night | Sick or tired crew cannot maintain the greenhouse and equipment. |
| bio | air | ≥ 70% | +2% Air/night | A healthy greenhouse adds oxygen (photosynthesis). |

## 4. Physiology constants

| Quantity | Value | Source |
| --- | --- | --- |
| Crew dose rate, Low Earth Orbit station | 0.73 mSv/day | [Science Advances (Zhang et al.)](https://www.sci.news/space/radiation-dose-rates-lunar-surface-08893.html) |
| Crew dose rate, Cislunar outpost (beyond the magnetosphere) | 1.8 mSv/day | [Springer (Handbook of Space Medicine)](https://link.springer.com/10.1007/978-3-030-16996-1_20) |
| Crew dose rate, Lunar south-pole base | 1.37 mSv/day | [Science Advances (Zhang et al.)](https://www.sci.news/space/radiation-dose-rates-lunar-surface-08893.html) |
| Bone loss without / with exercise | 0.05 / 0.03 % per day | [J. Bone and Mineral Research (Lang et al.)](https://pubmed.ncbi.nlm.nih.gov/15125798/) |
| Headache odds per +1 mmHg CO2 | ×2 (game-scaled probability) | [J. Occupational & Environmental Medicine (Law et al.)](https://aminer.org/pub/55a6638365ce054aad65f738/relationship-between-carbon-dioxide-levels-and-reported-headaches-on-the-international-space) |
| Nightly drains (power/prot/air/bio) | 1.5 / 5.5 / 6.5 / 4.5 % | Design assumption, tuned by Monte Carlo |

## 5. Sources (37)

- **ESA** (2009) — MELiSSA closed-loop life support project — https://www.esa.int/Our_Activities/Space_Engineering_Technology/MELiSSA_life_support_project_an_innovation_network_in_support_to_space_exploration
- **ESA** (2018) — The toxic side of the Moon (lunar dust) — https://www.esa.int/Our_Activities/Human_and_Robotic_Exploration/The_toxic_side_of_the_Moon
- **ESA** (2017) — Surviving the long dark night of the Moon — https://www.esa.int/Enabling_Support/Space_Engineering_Technology/Surviving_the_long_dark_night_of_the_Moon
- **ESA / National Observatory of Athens** (2025) — NELIOTA: lunar impact flashes — https://www.esa.int/Space_Safety/ESA_s_new_project_to_keep_an_eye_on_Moon_strikes
- **ESA** (2013) — Spacewalks: water in Luca Parmitano's helmet — https://www.esa.int/ESA_Multimedia/Videos/2013/09/Spacewalks
- **ESA** (2013) — Spacewalk repairing ammonia leak — https://www.esa.int/ESA_Multimedia/Images/2013/05/Spacewalk_repairing_ammonia_leak
- **Canadian Space Agency** (2020) — Decompression sickness and spacewalks — https://www.asc-csa.gc.ca/eng/astronauts/space-medicine/decomp.asp
- **Canadian Space Agency** (2022) — TBone: effects of microgravity on astronauts' bones — https://www.asc-csa.gc.ca/eng/sciences/tbone.asp
- **Chinese Academy of Sciences / CNSA** (2019) — Relay satellite Queqiao for the lunar far side — https://english.cas.cn/newsroom/news/201901/t20190107_203642.shtml
- **NASA Human Research Program** (2024) — The five hazards of human spaceflight — https://www.nasa.gov/hrp/hazards
- **NASA (via phys.org)** (2023) — ISS reaches 98% water recovery — https://phys.org/news/2023-06-nasa-recovery-milestone-international-space.html
- **NASA APPEL Knowledge Services** (2011) — International life support: the 1997 Mir oxygen-candle fire — https://appel.nasa.gov/wp-content/uploads/2013/04/602090main_44s_international_life_support.pdf
- **NOAA SWPC (via UNDRR)** (2020) — Solar radiation storm scale S1–S5 — https://undrr.org/quick/78528
- **NOAA / AGU Space Weather** (2022) — Space weather during the Starlink loss (Feb 2022) — https://repository.library.noaa.gov/view/noaa/53091/noaa_53091_DS1.pdf
- **Solar-Terrestrial Centre of Excellence (Belgium)** (2025) — Radiation dose of ISS astronauts — https://stce.be/news/756/welcome.html
- **Springer (Handbook of Space Medicine)** (2019) — Space radiation dose rates: ISS, Mars, deep space — https://link.springer.com/10.1007/978-3-030-16996-1_20
- **Science Advances (Zhang et al.)** (2020) — First radiation dose measurements on the lunar surface (Chang'e 4) — https://www.sci.news/space/radiation-dose-rates-lunar-surface-08893.html
- **Spaceflight Now** (2018) — Cosmonauts plug a 2 mm air leak (Soyuz MS-09) — https://spaceflightnow.com/2018/08/30/cosmonauts-plug-small-air-leak-on-the-international-space-station/
- **SpacePolicyOnline** (2021) — ASAT debris forces ISS crew to shelter — https://spacepolicyonline.com/news/russian-asat-test-creates-thousands-of-pieces-of-space-debris-imperils-iss
- **SpacePolicyOnline** (2015) — Three cargo ships lost in 8 months — https://spacepolicyonline.com/news/iss-operations-ok-despite-cargo-losses-but-whats-the-future/
- **ScienceDaily (NASA Goddard)** (2016) — Mold on space-station zinnias — https://www.sciencedaily.com/releases/2016/01/160119143038.htm
- **Communications Biology (Paul et al.)** (2022) — Plants grown in Apollo lunar regolith — https://www.sci.news/space/lunar-soil-plants-10803.html
- **PNAS (Basner et al.)** (2013) — Mars-520 simulation: hypokinesis and sleep changes — https://pmc.ncbi.nlm.nih.gov/articles/PMC3574912
- **J. Occupational & Environmental Medicine (Law et al.)** (2014) — CO2 levels and headaches on the ISS — https://aminer.org/pub/55a6638365ce054aad65f738/relationship-between-carbon-dioxide-levels-and-reported-headaches-on-the-international-space
- **New England Journal of Medicine (Auñón-Chancellor et al.)** (2020) — Venous thrombosis during spaceflight — https://www.eurekalert.org/news-releases/824124
- **JAMA Network Open (Marshall-Goebel et al.)** (2019) — Jugular venous flow stasis and thrombosis in spaceflight — https://pmc.ncbi.nlm.nih.gov/articles/PMC6902784
- **Int. J. General Medicine (Crucian et al.)** (2016) — Clinical symptoms during long-duration orbital flight — https://pmc.ncbi.nlm.nih.gov/articles/PMC5098747
- **The Lancet Neurology (Barger et al.)** (2014) — Sleep deficiency and hypnotic use in astronauts — https://www.eurekalert.org/news-releases/541449
- **J. Vestibular Research (Jennings)** (1998) — Managing space motion sickness — https://content.iospress.com:443/articles/journal-of-vestibular-research/ves8-1-10
- **Aviat. Space Environ. Med. (Kerstman et al.)** (2012) — Space adaptation back pain — https://www.peeref.com/works/7344683
- **npj Microgravity (Lee et al.)** (2020) — Spaceflight associated neuro-ocular syndrome (SANS) — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7005826/
- **NASA Technical Reports (Whitson et al.)** (2000) — Renal stone risk during spaceflight — https://ntrs.nasa.gov/citations/20000020539
- **J. Bone and Mineral Research (Lang et al.)** (2004) — Bone loss from spine and hip in long-duration flight — https://pubmed.ncbi.nlm.nih.gov/15125798/
- **npj Microgravity (Patel et al.)** (2020) — Red risks for a journey to the red planet — https://pmc.ncbi.nlm.nih.gov/articles/PMC7645687
- **Org. Behavior & Human Decision Processes (Cronin, Gonzalez & Sterman)** (2009) — Why don't well-educated adults understand accumulation? — https://mitmgmtfaculty.mit.edu/jsterman/whydontwelleducatedadultsunderstand/
- **J. Educational Psychology (Wouters et al.)** (2013) — Meta-analysis of serious games — https://pmc.ncbi.nlm.nih.gov/articles/PMC4748544
- **Design assumption** (2026) — Educational scaling chosen by the team and tested by Monte Carlo
