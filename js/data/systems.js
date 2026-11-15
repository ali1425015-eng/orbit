/* SYSTEMS MODEL — the five coupled subsystems, units, mission profiles, game modes,
   coupling rules, crew roster and the medical kit. Numbers carry a source id. */
(function (OT) {
  'use strict';
  var T = OT.T;

  /* ---------- The four station stocks (0–100 %) + display units ---------- */
  OT.data.systems = {
    power: { icon: '⚡', color: '#ffd23f', name: T('Power (EPS)', 'الطاقة (EPS)'), short: T('Power', 'طاقة'),
      unit: 'kW', max: 120,
      info: T('Electrical Power System: solar arrays, batteries and fuel cells. Every other system needs it: scrubbers, pumps, heaters, grow lights and medical devices.',
              'نظام الطاقة الكهربائية: ألواح شمسية وبطاريات وخلايا وقود. كل الأنظمة الأخرى تحتاجها: منقيات الهواء والمضخات والسخانات وإضاءة الزراعة والأجهزة الطبية.') },
    prot:  { icon: '🛡️', color: '#b388ff', name: T('Protection (TCS + Shielding)', 'الحماية (حرارة + إشعاع)'), short: T('Protection', 'حماية'),
      unit: 'K', max: 295,
      info: T('Thermal Control and radiation/debris shielding. Keeps cabin temperature stable and lowers the crew radiation dose. When it drops, the dose rate rises.',
              'التحكم الحراري والتدريع ضد الإشعاع والحطام. يحافظ على حرارة المقصورة ويقلل جرعة الإشعاع على الطاقم. عند انخفاضه ترتفع الجرعة اليومية.') },
    air:   { icon: '💨', color: '#3fd0ff', name: T('Atmosphere (ECLSS)', 'الغلاف الجوي (ECLSS)'), short: T('Air', 'هواء'),
      unit: 'kPa', max: 101.3,
      info: T('Environmental Control and Life Support: oxygen generation, CO2 removal and cabin pressure. Low values mean less O2 and more CO2 for the crew.',
              'نظام التحكم البيئي ودعم الحياة: توليد الأكسجين وإزالة ثاني أكسيد الكربون وضغط المقصورة. انخفاضه يعني أكسجين أقل وثاني أكسيد كربون أكثر للطاقم.') },
    bio:   { icon: '🌱', color: '#3dff8f', name: T('Food & Bioregeneration', 'الغذاء والزراعة الحيوية'), short: T('Food', 'غذاء'),
      unit: 'kg', max: 500,
      info: T('Hydroponic greenhouse and food stores. Plants make food AND oxygen and absorb CO2, the same idea as ESA\'s MELiSSA closed loop.',
              'الصوبة المائية ومخزون الطعام. النباتات تنتج الغذاء والأكسجين وتمتص ثاني أكسيد الكربون، وهي نفس فكرة الحلقة المغلقة MELiSSA لوكالة الفضاء الأوروبية.'), src: 'esa_melissa' }
  };

  /* ---------- Mission profiles: where the habitat is ---------- */
  OT.data.profiles = {
    leo:      { name: T('Low Earth Orbit station', 'محطة في مدار أرضي منخفض'), icon: '🛰️',
                dose: 0.73, doseSrc: 'change4_rad', telemetryDelay: T('near real-time', 'شبه فوري'),
                note: T('Inside Earth\'s magnetic field. Crew dose ~0.73 mSv/day (ISS, 2019 measurement).', 'داخل المجال المغناطيسي للأرض. جرعة الطاقم ~0.73 ملي سيفرت/يوم (قياس المحطة 2019).') },
    cislunar: { name: T('Cislunar outpost (beyond the magnetosphere)', 'محطة بين الأرض والقمر'), icon: '🌗',
                dose: 1.8, doseSrc: 'springer_rad', telemetryDelay: T('~1.3 s each way', '~1.3 ثانية في كل اتجاه'),
                note: T('No magnetic shield. Deep-space dose rate ~75 µSv/h (~1.8 mSv/day).', 'لا يوجد درع مغناطيسي. جرعة الفضاء العميق ~75 ميكروسيفرت/ساعة (~1.8 ملي سيفرت/يوم).') },
    moon:     { name: T('Lunar south-pole base', 'قاعدة القطب الجنوبي للقمر'), icon: '🌕',
                dose: 1.37, doseSrc: 'change4_rad', telemetryDelay: T('~1.3 s; far side needs a relay', '~1.3 ثانية؛ الجانب البعيد يحتاج قمر ترحيل'),
                note: T('Chang\'e 4 measured 1,369 µSv/day on the surface: about 1.9× the ISS total (731 µSv/day) and 2.6× its cosmic-ray part (523 µSv/day).', 'مسبار تشانغ-إي 4 قاس 1369 ميكروسيفرت/يوم على السطح: حوالي 1.9 ضعف إجمالي المحطة الدولية (731) و2.6 ضعف جزء الأشعة الكونية منها (523).') }
  };

  /* ---------- Game modes ----------
     kit = share of the full pharmacy stock carried (v7): Training 100%, Expedition 75% (+1 resupply per sector),
     Realistic 50% — scarcity makes careless treatment costly. Every item keeps at least 1 unit. */
  OT.data.modes = {
    training:   { days: 10, costMult: 1.0, hints: true,  timer: 0,  medP: 0.35, passive: 1.0,  kit: 1.0, name: T('Training', 'تدريب') },
    realistic:  { days: 10, costMult: 1.3, hints: false, timer: 60, medP: 0.45, passive: 1.0,  kit: 0.5, name: T('Realistic', 'واقعي') },
    expedition: { days: 5,  costMult: 1.0, hints: false, timer: 75, medP: 0.40, passive: 0.9,  kit: 0.75, name: T('Expedition (30 sectors)', 'رحلة استكشافية (30 قطاع)') }
  };
  /* Expedition sectors: 1–10 LEO, 11–20 cislunar, 21–30 lunar surface */
  OT.data.sectorProfile = function (lvl) { return lvl <= 10 ? 'leo' : (lvl <= 20 ? 'cislunar' : 'moon'); };

  /* ---------- Nightly dynamics (design assumptions, tuned by tools/montecarlo.js) ---------- */
  OT.data.passive = {
    /* Per night, before mode scale. Tuned so every system can fail (see research/montecarlo-summary.json).
       Air and protection drain faster because cabin leakage, CO2 build-up and MMOD/thermal wear never stop;
       power drains slower because most crisis responses already cost power. */
    drain: { power: 1.5, prot: 5.5, air: 6.5, bio: 4.5 },
    profileAdj: { moon: { power: -0.5, prot: 0.5 }, cislunar: { prot: 1 } }, // added to drain per profile (v7: Moon power drain 0 → 1/night: dust on arrays, heaters)
    greenhouseO2: 2,                                            // bio >= 70  -> air +2
    bone: { noExercise: 0.05, exercise: 0.03, src: 'jbmr_bone' } // % bone mineral density per day (hip ~1.4–1.5 %/month)
  };

  /* ---------- Coupling rules: the "system of systems" ---------- */
  /* Each rule: when `from` is below `below`, it pulls on `to`. Shown as glowing arrows.
     v6 (design iteration): strengths ×1.5 and thresholds +5 after the reasoning-ablation study showed that
     in v5 a myopic player survived as often as a systems thinker (tools/ablation.js, docs/CHANGELOG.md). */
  OT.data.couplings = [
    { id: 'p_a', from: 'power', to: 'air',  below: 40, eff: { air: -6 },
      why: T('Low power throttles CO2 scrubbers and O2 electrolysis.', 'الطاقة المنخفضة تبطئ منقيات CO2 والتحليل الكهربائي للأكسجين.') },
    { id: 'p_b', from: 'power', to: 'bio',  below: 40, eff: { bio: -4 },
      why: T('Grow lights are dimmed to save power.', 'إضاءة الزراعة تُخفَّض لتوفير الطاقة.') },
    { id: 's_b', from: 'prot',  to: 'bio',  below: 40, eff: { bio: -4 },
      why: T('Thermal control drifts; plants suffer heat/cold stress.', 'التحكم الحراري يختل؛ النباتات تتعرض لإجهاد حراري.') },
    { id: 's_c', from: 'prot',  to: 'crew', below: 40, dose: 2,
      why: T('Weaker shielding doubles the crew\'s daily radiation dose.', 'ضعف التدريع يضاعف جرعة الإشعاع اليومية للطاقم.') },
    { id: 'a_c', from: 'air',   to: 'crew', below: 50, health: -3,
      why: T('CO2 rises and O2 falls: headaches, fatigue, low SpO2.', 'يرتفع CO2 وينخفض O2: صداع وإرهاق وانخفاض تشبع الأكسجين.') },
    { id: 'b_a', from: 'bio',   to: 'air',  below: 40, eff: { air: -4 },
      why: T('Fewer plants means less oxygen made and less CO2 absorbed.', 'نباتات أقل تعني أكسجين أقل وامتصاص أقل لـ CO2.') },
    { id: 'b_c', from: 'bio',   to: 'crew', below: 40, health: -4,
      why: T('Food shortage: lower calories, slower healing.', 'نقص الغذاء: سعرات أقل وشفاء أبطأ.') },
    { id: 'c_b', from: 'crew',  to: 'bio',  below: 60, eff: { bio: -3, power: -3 },
      why: T('Sick or tired crew cannot maintain the greenhouse and equipment.', 'الطاقم المريض أو المرهق لا يستطيع صيانة الصوبة والمعدات.') }
  ];
  /* positive coupling */
  OT.data.positiveCoupling = { id: 'b_a_plus', from: 'bio', to: 'air', above: 70, eff: { air: 2 },
    why: T('A healthy greenhouse adds oxygen (photosynthesis).', 'الصوبة السليمة تضيف أكسجين (البناء الضوئي).') };

  /* ---------- Crew (fictional, international) ---------- */
  OT.data.crew = [
    { id: 'laila', name: T('Cmdr. Laila Hassan', 'القائدة ليلى حسن'), role: T('Commander', 'قائدة'), flag: '🇪🇬', age: 41 },
    { id: 'kenji', name: T('Kenji Sato', 'كنجي ساتو'), role: T('Flight engineer', 'مهندس طيران'), flag: '🇯🇵', age: 38 },
    { id: 'ana',   name: T('Dr. Ana Ribeiro', 'د. آنا ريبيرو'), role: T('Crew medical officer', 'الطبيبة المسؤولة'), flag: '🇧🇷', age: 44 },
    { id: 'marc',  name: T('Marc Dubois', 'مارك دوبوا'), role: T('Bio-systems scientist', 'عالم الأنظمة الحيوية'), flag: '🇫🇷', age: 35 }
  ];

  /* ---------- Medical kit (limited stock teaches scarcity) ---------- */
  OT.data.medkit = {
    analgesic:   { n: 8, icon: '💊', name: T('Analgesic (pain relief)', 'مسكن ألم') },
    antiemetic:  { n: 4, icon: '💉', name: T('Antiemetic injection', 'حقنة مضادة للقيء') },
    antihist:    { n: 5, icon: '🧴', name: T('Antihistamine', 'مضاد هيستامين') },
    antibiotic:  { n: 4, icon: '🦠', name: T('Antibiotic course', 'مضاد حيوي') },
    antiviral:   { n: 3, icon: '🧬', name: T('Antiviral', 'مضاد فيروسات') },
    anticoag:    { n: 3, icon: '🩸', name: T('Anticoagulant (enoxaparin)', 'مضاد تجلط (إينوكسابارين)') },
    iv:          { n: 4, icon: '🧪', name: T('IV fluids', 'محاليل وريدية') },
    oxygen:      { n: 3, icon: '😷', name: T('Oxygen mask set', 'قناع أكسجين') },
    sleepaid:    { n: 4, icon: '🌙', name: T('Sleep aid', 'منوّم') },
    kcitrate:    { n: 3, icon: '🧂', name: T('Potassium citrate', 'سيترات البوتاسيوم') },
    lens:        { n: 2, icon: '👓', name: T('Plus-lens glasses', 'نظارة عدسات موجبة') },
    labkit:      { n: 4, icon: '🧫', name: T('Blood/urine test kit', 'عدة تحليل دم/بول') }
  };

  /* ---------- Diagnostic tools ---------- */
  OT.data.tools = {
    vitals:     { icon: '📟', cost: {}, name: T('Vital signs', 'العلامات الحيوية'), free: true },
    ultrasound: { icon: '🩻', cost: { power: -2 }, name: T('Ultrasound', 'سونار'),
                  info: T('Portable ultrasound is the main imaging tool on a station; experts on Earth can guide it remotely.', 'السونار المحمول هو أداة التصوير الأساسية في المحطة؛ ويمكن لخبراء على الأرض توجيهه عن بُعد.') },
    lab:        { icon: '🧫', cost: {}, kit: { labkit: 1 }, name: T('Lab test', 'تحليل معملي') },
    eye:        { icon: '👁️', cost: { power: -1 }, name: T('Eye exam (OCT)', 'فحص العين (OCT)') },
    tele:       { icon: '📡', cost: { power: -3 }, name: T('Telemedicine consult', 'استشارة طبية عن بُعد'), needsComms: true }
  };
})(window.OT);
