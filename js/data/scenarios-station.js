/* STATION SCENARIOS — orbital and general habitat crises.
   where: profiles the event can happen in ('leo','cislunar','moon').
   eff: change to station stocks (%). Negative values are multiplied by the mode's cost multiplier.
   crew: { dose: mSv to every crew member, health, stress, risk:{case, p} (medical case next day), eva: true }
   later: delayed effects (stock-and-flow lesson: consequences arrive later).
   idle: the option applied if the decision timer runs out (doing nothing is also a decision). */
(function (OT) {
  'use strict';
  var T = OT.T;
  var ALL = ['leo', 'cislunar', 'moon'], ORBIT = ['leo', 'cislunar'];

  OT.data.scenarios = (OT.data.scenarios || []).concat([
    {
      id: 'spe', where: ALL, cat: 'env', src: 'noaa_sscale',
      title: T('Solar Radiation Storm (S3)', 'عاصفة إشعاع شمسي (S3)'),
      desc: T('Proton flux is climbing past the S3 "strong" level on the NOAA scale. High-energy protons can reach the habitat within an hour.',
              'تدفق البروتونات يتجاوز المستوى S3 "قوي" على مقياس NOAA. البروتونات عالية الطاقة قد تصل للمحطة خلال ساعة.'),
      hint: T('Water and hydrogen-rich materials are the best shields. Sheltering costs work time, not power.', 'الماء والمواد الغنية بالهيدروجين أفضل دروع. الاحتماء يكلف وقت عمل وليس طاقة.'),
      sys: T('Radiation protection is linked to the crew stock (dose accumulates day by day) and to the greenhouse (no one tends the plants while sheltering).',
             'الحماية من الإشعاع مرتبطة بمخزون الطاقم (الجرعة تتراكم يوماً بعد يوم) وبالصوبة (لا أحد يرعى النباتات أثناء الاحتماء).'),
      trade: T('Shelter = low dose but lost greenhouse work. Active protection = power drain. Ignoring = a large dose that never "goes away".',
               'الاحتماء = جرعة منخفضة مع خسارة عمل الصوبة. الحماية النشطة = استنزاف طاقة. التجاهل = جرعة كبيرة لا "تختفي" أبداً.'),
      fact: T('NOAA grades solar radiation storms S1–S5 using proton flux measured by GOES satellites; strong storms affect ISS crew operations.',
              'تصنف NOAA عواصف الإشعاع الشمسي من S1 إلى S5 حسب تدفق البروتونات الذي تقيسه أقمار GOES؛ والعواصف القوية تؤثر على عمليات طاقم المحطة.'),
      quiz: { q: T('Why does a radiation dose matter even after the storm ends?', 'لماذا تظل جرعة الإشعاع مهمة حتى بعد انتهاء العاصفة؟'),
              o: { en: ['Dose is a stock: it accumulates and never drains back', 'Radiation stays trapped in the air', 'Shields stop working after storms'],
                   ar: ['الجرعة مخزون: تتراكم ولا تنقص', 'الإشعاع يبقى محبوساً في الهواء', 'الدروع تتوقف بعد العواصف'] } },
      choices: [
        { t: T('Shelter crew behind the water wall', 'احتماء الطاقم خلف جدار المياه'), eff: { bio: -14, power: -4 }, crew: { dose: 2 } },
        { t: T('Boost active protection, keep working', 'رفع الحماية النشطة ومواصلة العمل'), eff: { power: -20, prot: 10 }, crew: { dose: 8 } },
        { t: T('Continue normal operations', 'استمرار العمل الطبيعي'), eff: { bio: 6, prot: -10 }, crew: { dose: 30, risk: { case: 'radexpo', p: 0.8 } }, idle: true }
      ]
    },
    {
      id: 'leak', where: ORBIT, cat: 'eng', src: 'soyuz_leak',
      title: T('Cabin Pressure Leak (2 mm hole)', 'تسرب ضغط المقصورة (ثقب 2 مم)'),
      desc: T('Cabin pressure is falling slowly. The leak is too small to see; the crew must find it module by module.',
              'ضغط المقصورة ينخفض ببطء. التسرب صغير جداً لا يُرى؛ على الطاقم البحث عنه وحدة تلو الأخرى.'),
      hint: T('A temporary patch is fast but may fail later. Closing hatches finds the leak but costs crew time.', 'الرقعة المؤقتة سريعة لكنها قد تفشل لاحقاً. إغلاق الأبواب يحدد التسرب لكنه يستهلك وقت الطاقم.'),
      sys: T('Cabin air is a stock with an outflow (the leak). Every hour of delay drains it further and makes the O2 system work harder.',
             'هواء المقصورة مخزون له تدفق خارج (التسرب). كل ساعة تأخير تستنزفه أكثر وتجهد نظام الأكسجين.'),
      trade: T('Systematic search costs greenhouse work; a quick tape fix saves time now but adds a delayed loss.', 'البحث المنهجي يكلف عمل الصوبة؛ الإصلاح السريع بشريط لاصق يوفر الوقت الآن لكنه يضيف خسارة مؤجلة.'),
      fact: T('In August 2018 the ISS crew traced a slow leak to a 2 mm hole in a docked Soyuz and sealed it with an epoxy-soaked wipe.',
              'في أغسطس 2018 تتبع طاقم المحطة الدولية تسرباً بطيئاً إلى ثقب 2 مم في مركبة سويوز ملتحمة وأغلقوه بقطعة مشبعة بالإيبوكسي.'),
      quiz: { q: T('How did the 2018 ISS crew find a leak they could not see?', 'كيف وجد طاقم المحطة 2018 تسرباً لم يتمكنوا من رؤيته؟'),
              o: { en: ['By closing hatches module by module and watching pressure', 'By looking for frost on the hull', 'By listening for whistling'],
                   ar: ['بإغلاق الأبواب وحدة تلو الأخرى ومراقبة الضغط', 'بالبحث عن الصقيع على الهيكل', 'بالاستماع إلى صفير'] } },
      choices: [
        { t: T('Isolate modules, then epoxy patch', 'عزل الوحدات ثم رقعة إيبوكسي'), eff: { air: 12, bio: -12, power: -3 } },
        { t: T('Tape it now, top up from O2/N2 tanks', 'شريط لاصق الآن وتعويض من خزانات O2/N2'), eff: { air: 18, power: -6 }, later: [{ in: 1, eff: { air: -24 } }] },
        { t: T('Monitor only, keep schedule', 'المراقبة فقط والالتزام بالجدول'), eff: { air: -10, power: 4 }, later: [{ in: 1, eff: { air: -16 } }], idle: true }
      ]
    },
    {
      id: 'debris', where: ['leo'], cat: 'env', src: 'asat_2021',
      title: T('Debris Cloud Conjunction', 'اقتراب سحابة حطام'),
      desc: T('A satellite break-up has created a cloud of fragments crossing your orbit every 90 minutes.',
              'تحطم قمر صناعي أنتج سحابة شظايا تعبر مدارك كل 90 دقيقة.'),
      hint: T('Sheltering protects people; a maneuver protects the whole station but costs power.', 'الاحتماء يحمي الأفراد؛ المناورة تحمي المحطة كلها لكنها تكلف طاقة.'),
      sys: T('Orbital mechanics couples to power (thruster control, computers) and to protection (hull damage).', 'ميكانيكا المدارات ترتبط بالطاقة (التحكم بالمحركات والحواسيب) وبالحماية (أضرار الهيكل).'),
      trade: T('Maneuvering costs power; sheltering costs a day of work; accepting the risk costs shielding.', 'المناورة تكلف طاقة؛ الاحتماء يكلف يوم عمل؛ قبول الخطر يكلف التدريع.'),
      fact: T('On 15 Nov 2021 an anti-satellite test created 1,500+ trackable fragments, and the ISS crew sheltered in their Soyuz and Crew Dragon spacecraft.',
              'في 15 نوفمبر 2021 أنتج اختبار مضاد للأقمار أكثر من 1500 شظية قابلة للتتبع، واحتمى طاقم المحطة داخل مركبتي سويوز وكرو دراجون.'),
      quiz: { q: T('Where did the ISS crew shelter during the 2021 debris event?', 'أين احتمى طاقم المحطة أثناء حادث الحطام 2021؟'),
              o: { en: ['Inside their docked return spacecraft', 'In the airlock', 'Outside on the robotic arm'], ar: ['داخل مركبات العودة الملتحمة', 'في غرفة معادلة الضغط', 'خارج المحطة على الذراع الآلي'] } },
      choices: [
        { t: T('Debris-avoidance burn', 'مناورة تفادي الحطام'), eff: { power: -14, prot: 10 } },
        { t: T('Shelter crew in return vehicles', 'احتماء الطاقم في مركبات العودة'), eff: { bio: -12, air: -4, prot: 4 } },
        { t: T('Accept the risk', 'قبول المخاطرة'), eff: { prot: -22 }, crew: { risk: { case: 'eyefb', p: 0.4 } }, idle: true }
      ]
    },
    {
      id: 'co2', where: ALL, cat: 'eng', src: 'law_co2',
      title: T('CO2 Scrubber Failure', 'عطل منقي ثاني أكسيد الكربون'),
      desc: T('The main CO2 removal assembly has stopped. Cabin CO2 is rising toward 6 mmHg.', 'جهاز إزالة CO2 الرئيسي توقف. نسبة CO2 في المقصورة ترتفع نحو 6 مم زئبق.'),
      hint: T('Plants absorb CO2 too, but they need light. Less exercise means less CO2 but hurts bones.', 'النباتات تمتص CO2 أيضاً لكنها تحتاج ضوءاً. تقليل التمارين يقلل CO2 لكنه يضر العظام.'),
      sys: T('CO2 links ECLSS to crew health directly: higher CO2 means more headaches and lower performance.', 'ثاني أكسيد الكربون يربط نظام دعم الحياة بصحة الطاقم مباشرة: ارتفاعه يعني صداعاً أكثر وأداءً أقل.'),
      trade: T('Backup scrubber = power; more photosynthesis = power but helps food; less activity = health cost.', 'منقي احتياطي = طاقة؛ بناء ضوئي أكثر = طاقة لكنه يفيد الغذاء؛ نشاط أقل = تكلفة صحية.'),
      fact: T('An ISS study found the odds of a crew headache doubled for each 1 mmHg rise in CO2 (ISS range: 1–9 mmHg).',
              'وجدت دراسة على المحطة أن احتمال الصداع يتضاعف مع كل زيادة 1 مم زئبق في CO2 (مدى المحطة: 1–9 مم زئبق).'),
      quiz: { q: T('What happened to headache odds per +1 mmHg of CO2 on the ISS?', 'ماذا حدث لاحتمال الصداع مع كل +1 مم زئبق من CO2 في المحطة؟'),
              o: { en: ['They doubled', 'They fell by half', 'No change'], ar: ['تضاعفت', 'انخفضت للنصف', 'لم تتغير'] } },
      choices: [
        { t: T('Start backup scrubber', 'تشغيل المنقي الاحتياطي'), eff: { power: -16, air: 16 } },
        { t: T('Extend grow-light hours (plants absorb CO2)', 'زيادة ساعات إضاءة الزراعة (النباتات تمتص CO2)'), eff: { power: -12, air: 10, bio: 6 } },
        { t: T('Cancel exercise to lower CO2 output', 'إلغاء التمارين لتقليل إنتاج CO2'), eff: { air: 7 }, crew: { health: -4, noExercise: 2 }, idle: true }
      ]
    },
    {
      id: 'o2gen', where: ALL, cat: 'eng', src: 'mir_fire',
      title: T('Oxygen Generator Down', 'توقف مولد الأكسجين'),
      desc: T('The water-electrolysis oxygen generator has tripped offline.', 'مولد الأكسجين بالتحليل الكهربائي للماء توقف عن العمل.'),
      hint: T('Oxygen candles work without power but burn hot. Tanks are safe but finite.', 'شموع الأكسجين تعمل بلا طاقة لكنها شديدة الحرارة. الخزانات آمنة لكنها محدودة.'),
      sys: T('O2 production links air, water (electrolysis splits water) and power.', 'إنتاج الأكسجين يربط الهواء والماء (التحليل الكهربائي يفصل الماء) والطاقة.'),
      trade: T('Chemical O2 = fire risk; stored O2 = later shortage; restart = big power draw.', 'أكسجين كيميائي = خطر حريق؛ أكسجين مخزن = نقص لاحق؛ إعادة التشغيل = سحب طاقة كبير.'),
      fact: T('In Feb 1997 a solid-fuel oxygen candle on the Mir station caught fire; the crew needed three extinguishers to put it out.',
              'في فبراير 1997 اشتعلت شمعة أكسجين صلبة في محطة مير؛ واحتاج الطاقم ثلاث طفايات لإطفائها.'),
      quiz: { q: T('What started the 1997 Mir fire?', 'ما سبب حريق مير عام 1997؟'),
              o: { en: ['A solid-fuel oxygen candle', 'A solar array short circuit', 'A kitchen heater'], ar: ['شمعة أكسجين صلبة', 'ماس كهربائي في لوح شمسي', 'سخان المطبخ'] } },
      choices: [
        { t: T('Light oxygen candles', 'إشعال شموع الأكسجين'), eff: { air: 20, prot: -6 }, crew: { risk: { case: 'smoke', p: 0.25 } } },
        { t: T('Draw on stored O2 tanks', 'السحب من خزانات الأكسجين'), eff: { air: 14, power: -3 }, later: [{ in: 2, eff: { air: -16 } }] },
        { t: T('Full-power restart of electrolysis', 'إعادة تشغيل التحليل الكهربائي بكامل الطاقة'), eff: { power: -18, air: 18 }, idle: true }
      ]
    },
    {
      id: 'fire', where: ALL, cat: 'eng', src: 'mir_fire',
      title: T('Smoke in the Lab Module', 'دخان في وحدة المختبر'),
      desc: T('Smoke detectors are alarming in the lab. In microgravity, smoke does not rise; it spreads in every direction.',
              'أجهزة الكشف عن الدخان تنطلق في المختبر. في انعدام الجاذبية لا يصعد الدخان لأعلى؛ بل ينتشر في كل اتجاه.'),
      hint: T('Venting kills the fire fast but throws away air. Fighting it risks the crew\'s lungs.', 'التفريغ يقضي على الحريق بسرعة لكنه يهدر الهواء. مكافحته تعرض رئات الطاقم للخطر.'),
      sys: T('A fire couples air quality, power (cutting circuits) and crew health (smoke inhalation).', 'الحريق يربط جودة الهواء والطاقة (فصل الدوائر) وصحة الطاقم (استنشاق الدخان).'),
      trade: T('Vent = air loss; extinguishers = smoke exposure; power cut = lost equipment.', 'التفريغ = خسارة هواء؛ الطفايات = تعرض للدخان؛ قطع الطاقة = خسارة معدات.'),
      fact: T('During the 1997 Mir fire, extinguishers added clouds of steam to the smoke; the crew wore masks until the air was safe.',
              'أثناء حريق مير 1997 أضافت الطفايات سحب بخار إلى الدخان؛ وارتدى الطاقم الأقنعة حتى أصبح الهواء آمناً.'),
      quiz: { q: T('How does smoke behave in microgravity?', 'كيف يتصرف الدخان في انعدام الجاذبية؟'),
              o: { en: ['It spreads in all directions instead of rising', 'It rises to the ceiling', 'It sinks to the floor'], ar: ['ينتشر في كل الاتجاهات بدلاً من الصعود', 'يصعد للسقف', 'يهبط للأرض'] } },
      choices: [
        { t: T('Seal and vent the module to vacuum', 'عزل الوحدة وتفريغها للفراغ'), eff: { air: -20, bio: -6 } },
        { t: T('Masks on, fight with extinguishers', 'ارتداء الأقنعة والمكافحة بالطفايات'), eff: { air: -8, power: -6 }, crew: { risk: { case: 'smoke', p: 0.55 } } },
        { t: T('Cut power to the module and wait', 'قطع الطاقة عن الوحدة والانتظار'), eff: { power: -14, bio: -8, air: -6 }, idle: true }
      ]
    },
    {
      id: 'ammonia', where: ORBIT, cat: 'eng', src: 'esa_ammonia',
      title: T('Ammonia Coolant Leak', 'تسرب أمونيا التبريد'),
      desc: T('Flakes of frozen ammonia are drifting from an external cooling loop near a solar array.', 'رقائق أمونيا متجمدة تنجرف من دائرة تبريد خارجية قرب أحد الألواح الشمسية.'),
      hint: T('A spacewalk fixes it but puts a person outside. Shutting the loop costs power channels.', 'السير في الفضاء يصلحه لكنه يضع إنساناً بالخارج. إغلاق الدائرة يكلف قنوات طاقة.'),
      sys: T('In vacuum, heat can only leave by radiation, so the ammonia radiator loop links power electronics to thermal protection.', 'في الفراغ تخرج الحرارة بالإشعاع فقط، لذا تربط دائرة الأمونيا إلكترونيات الطاقة بالحماية الحرارية.'),
      trade: T('EVA = crew risk (DCS, dose); shutdown = power loss; waiting = growing thermal deficit.', 'السير بالفضاء = خطر على الطاقم (مرض تخفيف الضغط وجرعة)؛ الإغلاق = خسارة طاقة؛ الانتظار = عجز حراري متزايد.'),
      fact: T('On 11 May 2013 two astronauts made a quickly planned spacewalk to replace a leaking ammonia pump on the ISS truss.',
              'في 11 مايو 2013 قام رائدان بسير فضائي سريع التخطيط لاستبدال مضخة أمونيا مسربة على هيكل المحطة.'),
      quiz: { q: T('Why do stations pump ammonia through external radiators?', 'لماذا تضخ المحطات الأمونيا عبر مشعات خارجية؟'),
              o: { en: ['Heat can only leave a spacecraft by radiation', 'To make oxygen', 'To block radiation'], ar: ['الحرارة لا تخرج من المركبة إلا بالإشعاع', 'لصنع الأكسجين', 'لحجب الإشعاع'] } },
      choices: [
        { t: T('Emergency spacewalk: replace pump', 'سير فضائي طارئ: استبدال المضخة'), eff: { prot: 18, power: -6 }, crew: { dose: 3, eva: true, risk: { case: 'dcs', p: 0.3 } } },
        { t: T('Shut the loop, move loads to another channel', 'إغلاق الدائرة ونقل الأحمال لقناة أخرى'), eff: { power: -20, prot: -4 } },
        { t: T('Keep running, refill ammonia later', 'الاستمرار وإعادة التعبئة لاحقاً'), eff: { prot: -14 }, later: [{ in: 1, eff: { prot: -16 } }], idle: true }
      ]
    },
    {
      id: 'eclipse', where: ['leo'], cat: 'eng', src: 'lancet_sleep',
      title: T('Battery Stress in Orbital Night', 'إجهاد البطاريات في الليل المداري'),
      desc: T('In low orbit the station enters Earth\'s shadow about 16 times a day. Aging batteries are struggling through each dark pass.',
              'في المدار المنخفض تدخل المحطة ظل الأرض نحو 16 مرة يومياً. البطاريات القديمة تعاني في كل مرور مظلم.'),
      hint: T('Deep discharge gives power now but wears the batteries (delayed cost).', 'التفريغ العميق يعطي طاقة الآن لكنه يُتلف البطاريات (تكلفة مؤجلة).'),
      sys: T('Battery charge is a stock filled in sunlight and drained in shadow. Wear lowers the stock\'s capacity for the rest of the mission.', 'شحن البطارية مخزون يمتلئ في الضوء ويُستنزف في الظل. التآكل يقلل سعته لبقية المهمة.'),
      trade: T('Shed greenhouse lights (food) or heaters (protection), or borrow from the future.', 'إطفاء إضاءة الصوبة (غذاء) أو السخانات (حماية) أو الاقتراض من المستقبل.'),
      fact: T('Orbiting every ~90 minutes, a low-orbit station passes through about 16 sunrises and sunsets per day.', 'تدور المحطة كل ~90 دقيقة، فتمر بنحو 16 شروقاً وغروباً يومياً.'),
      quiz: { q: T('Why can deep battery discharge be a bad trade?', 'لماذا قد يكون التفريغ العميق للبطارية مقايضة سيئة؟'),
              o: { en: ['It gives power now but reduces capacity later', 'It has no cost at all', 'It increases radiation'], ar: ['يعطي طاقة الآن لكنه يقلل السعة لاحقاً', 'ليس له أي تكلفة', 'يزيد الإشعاع'] } },
      choices: [
        { t: T('Dim greenhouse LEDs at night', 'خفض إضاءة الصوبة ليلاً'), eff: { bio: -14, power: 12 } },
        { t: T('Deep-discharge the batteries', 'تفريغ البطاريات تفريغاً عميقاً'), eff: { power: 18 }, later: [{ in: 2, eff: { power: -28 } }] },
        { t: T('Turn off heaters in empty modules', 'إطفاء السخانات في الوحدات الفارغة'), eff: { prot: -14, power: 12 }, idle: true }
      ]
    },
    {
      id: 'arrays', where: ORBIT, cat: 'eng', src: 'noaa_sscale',
      title: T('Solar Array Degradation', 'تدهور الألواح الشمسية'),
      desc: T('After weeks of proton exposure, two array strings are producing far less power than expected.', 'بعد أسابيع من التعرض للبروتونات، صفان من الألواح ينتجان طاقة أقل بكثير من المتوقع.'),
      hint: T('A spacewalk restores the most power but adds medical risk.', 'السير في الفضاء يستعيد أكبر قدر من الطاقة لكنه يضيف خطراً طبياً.'),
      sys: T('Energetic protons degrade solar cells, so the space-weather history of the mission sets today\'s power budget.', 'البروتونات النشطة تُتلف الخلايا الشمسية، فتاريخ طقس الفضاء أثناء المهمة يحدد ميزانية الطاقة اليوم.'),
      trade: T('Robot reroute = crew time; EVA = risk; accept = permanent power loss.', 'إعادة التوجيه بالروبوت = وقت الطاقم؛ السير بالفضاء = خطر؛ القبول = خسارة طاقة دائمة.'),
      fact: T('Strong solar radiation storms degrade satellite solar-panel output and imaging systems, according to the NOAA S-scale impacts.', 'العواصف الإشعاعية الشمسية القوية تخفض إنتاج الألواح الشمسية للأقمار وأنظمة التصوير، وفق تأثيرات مقياس NOAA.'),
      quiz: { q: T('What can strong proton storms do to solar arrays?', 'ماذا تفعل عواصف البروتونات القوية بالألواح الشمسية؟'),
              o: { en: ['Reduce their power output', 'Make them produce more power', 'Nothing'], ar: ['تقلل إنتاجها من الطاقة', 'تجعلها تنتج طاقة أكثر', 'لا شيء'] } },
      choices: [
        { t: T('Robotic-arm inspection and string reroute', 'فحص بالذراع الآلية وإعادة توجيه الصفوف'), eff: { power: 14, bio: -8, prot: -4 } },
        { t: T('Spacewalk repair', 'إصلاح بالسير في الفضاء'), eff: { power: 22, air: -4 }, crew: { dose: 3, eva: true, risk: { case: 'dcs', p: 0.25 } } },
        { t: T('Accept reduced output', 'قبول الإنتاج المنخفض'), eff: { power: -14 }, idle: true }
      ]
    },
    {
      id: 'water', where: ALL, cat: 'eng', src: 'nasa_water',
      title: T('Water Processor Failure', 'عطل معالج المياه'),
      desc: T('The water recovery system is offline. Urine and condensate are piling up unprocessed.', 'نظام استعادة المياه متوقف. البول والتكثيف يتراكمان دون معالجة.'),
      hint: T('Water feeds both the crew and the greenhouse, and it is also the raw material for oxygen.', 'الماء يغذي الطاقم والصوبة، وهو أيضاً المادة الخام للأكسجين.'),
      sys: T('Water links the greenhouse, O2 electrolysis and crew hydration: one pump failure hits three systems.', 'الماء يربط الصوبة والتحليل الكهربائي للأكسجين وترطيب الطاقم: عطل مضخة واحدة يصيب ثلاثة أنظمة.'),
      trade: T('Ration irrigation (food), power-heavy restart (power) or manual repair (crew fatigue).', 'تقنين الري (غذاء)، إعادة تشغيل ثقيلة الطاقة (طاقة)، أو إصلاح يدوي (إرهاق الطاقم).'),
      fact: T('With its Brine Processor Assembly, the ISS now recovers about 98% of its water, up from 93–94% before.', 'مع وحدة معالجة المحلول الملحي تستعيد المحطة الآن نحو 98% من مياهها، بعد أن كانت 93–94%.'),
      quiz: { q: T('What share of water does the ISS recover today?', 'ما نسبة المياه التي تستعيدها المحطة اليوم؟'),
              o: { en: ['About 98%', 'About 50%', 'About 75%'], ar: ['نحو 98%', 'نحو 50%', 'نحو 75%'] } },
      choices: [
        { t: T('Ration greenhouse irrigation', 'تقنين ري الصوبة'), eff: { bio: -16, power: 4 } },
        { t: T('Power-heavy distillation restart', 'إعادة تشغيل التقطير بطاقة عالية'), eff: { power: -18, bio: 6 } },
        { t: T('Manual repair shift', 'نوبة إصلاح يدوي'), eff: { bio: -6, air: -6 }, crew: { health: -3, stress: 6 }, idle: true }
      ]
    },
    {
      id: 'mold', where: ALL, cat: 'bio', src: 'zinnia_mold',
      title: T('Mold in the Greenhouse', 'عفن في الصوبة'),
      desc: T('Humidity spiked in the plant chamber. Leaves are wilting and white mold is spreading.', 'ارتفعت الرطوبة في غرفة النباتات. الأوراق تذبل وعفن أبيض ينتشر.'),
      hint: T('Too much drying also harms plants. Cutting infected leaves is cheap but slow.', 'التجفيف الزائد يضر النباتات أيضاً. قص الأوراق المصابة رخيص لكنه بطيء.'),
      sys: T('Plants share cabin air with the crew: mold threatens food, oxygen production and crew allergies at once.', 'النباتات تتشارك هواء المقصورة مع الطاقم: العفن يهدد الغذاء وإنتاج الأكسجين وحساسية الطاقم معاً.'),
      trade: T('Max fans = power and dry plants; manual cleanup = crew time; UV-C = high power.', 'مراوح قصوى = طاقة وجفاف النباتات؛ تنظيف يدوي = وقت الطاقم؛ أشعة UV-C = طاقة عالية.'),
      fact: T('In 2015–16, zinnias in a station plant chamber got moldy after excess water; an astronaut saved them by trimming leaves and adjusting care himself.',
              'في 2015–2016 أصاب العفن أزهار الزينيا في غرفة نباتات بالمحطة بسبب الماء الزائد؛ وأنقذها رائد فضاء بقص الأوراق وتعديل الرعاية بنفسه.'),
      quiz: { q: T('What caused mold on space-grown zinnias in 2015?', 'ما سبب العفن على أزهار الزينيا في الفضاء عام 2015؟'),
              o: { en: ['Too much water and humidity', 'Radiation', 'Too much light'], ar: ['ماء ورطوبة زائدة', 'الإشعاع', 'ضوء زائد'] } },
      choices: [
        { t: T('Run chamber fans at maximum', 'تشغيل مراوح الغرفة بأقصى سرعة'), eff: { power: -12, bio: -4 } },
        { t: T('Trim infected leaves, reduce watering', 'قص الأوراق المصابة وتقليل الري'), eff: { bio: -8, air: -2 }, crew: { stress: 4 } },
        { t: T('UV-C sterilization cycle', 'دورة تعقيم بالأشعة فوق البنفسجية'), eff: { power: -18, bio: 6 }, idle: true }
      ]
    },
    {
      id: 'cargo', where: ORBIT, cat: 'human', src: 'cargo_2015',
      title: T('Cargo Ship Lost at Launch', 'فقدان سفينة شحن عند الإطلاق'),
      desc: T('The next resupply rocket failed minutes after launch. Food, spare parts and medicine are gone.', 'صاروخ الإمداد التالي فشل بعد دقائق من الإطلاق. الطعام وقطع الغيار والأدوية ضاعت.'),
      hint: T('Harvesting early gives food now but less later and less oxygen from plants.', 'الحصاد المبكر يعطي طعاماً الآن لكن أقل لاحقاً وأكسجين أقل من النباتات.'),
      sys: T('Resupply is an inflow to every stock. When it stops, the stocks with the biggest outflow fail first.', 'الإمداد تدفق داخل لكل المخزونات. عندما يتوقف، تنهار أولاً المخزونات ذات التدفق الخارج الأكبر.'),
      trade: T('Ration (crew health), harvest early (future food and O2), or re-plan operations (power).', 'التقنين (صحة الطاقم)، الحصاد المبكر (غذاء وأكسجين مستقبلي)، أو إعادة التخطيط (طاقة).'),
      fact: T('Between Oct 2014 and Jun 2015 three ISS cargo ships were lost: Cygnus Orb-3, Progress M-27M and SpaceX CRS-7.', 'بين أكتوبر 2014 ويونيو 2015 فُقدت ثلاث سفن شحن للمحطة: سيغنوس Orb-3 وبروغرس M-27M وسبيس إكس CRS-7.'),
      quiz: { q: T('How many ISS cargo ships were lost in 2014–2015?', 'كم سفينة شحن للمحطة فُقدت في 2014–2015؟'),
              o: { en: ['Three', 'One', 'None'], ar: ['ثلاث', 'واحدة', 'لا شيء'] } },
      choices: [
        { t: T('Ration calories by 10%', 'تقنين السعرات بنسبة 10%'), eff: { bio: 6 }, crew: { health: -5, stress: 6 } },
        { t: T('Harvest the greenhouse early', 'حصاد الصوبة مبكراً'), eff: { bio: 14, air: -4 }, later: [{ in: 2, eff: { bio: -24 } }] },
        { t: T('Cut experiments, power down labs', 'إلغاء التجارب وإطفاء المختبرات'), eff: { power: 8, bio: -10 }, idle: true }
      ]
    },
    {
      id: 'geostorm', where: ['leo'], cat: 'env', src: 'noaa_starlink',
      title: T('Geomagnetic Storm Raises Drag', 'عاصفة مغناطيسية ترفع مقاومة الهواء'),
      desc: T('A geomagnetic storm is heating and puffing up the upper atmosphere. Drag on the station has jumped.', 'عاصفة مغناطيسية تسخن الغلاف الجوي العلوي وتمدده. مقاومة الهواء على المحطة قفزت.'),
      hint: T('Reboosting now costs power; waiting makes the orbit decay further.', 'الرفع الآن يكلف طاقة؛ الانتظار يجعل المدار ينخفض أكثر.'),
      sys: T('Space weather links the Sun to orbital altitude, which links to propellant, power and debris risk.', 'طقس الفضاء يربط الشمس بارتفاع المدار، المرتبط بدوره بالوقود والطاقة وخطر الحطام.'),
      trade: T('Reboost now (power), fly edge-on (less sunlight), or wait (delayed bigger cost).', 'الرفع الآن (طاقة)، الطيران بزاوية حادة (ضوء أقل)، أو الانتظار (تكلفة أكبر مؤجلة).'),
      fact: T('In Feb 2022 a geomagnetic storm increased drag so much that 38 of 49 newly launched Starlink satellites re-entered the atmosphere.', 'في فبراير 2022 زادت عاصفة مغناطيسية مقاومة الهواء حتى عاد 38 من 49 قمراً جديداً من ستارلينك إلى الغلاف الجوي.'),
      quiz: { q: T('How can a geomagnetic storm bring satellites down?', 'كيف تُسقط عاصفة مغناطيسية الأقمار الصناعية؟'),
              o: { en: ['It heats the upper atmosphere and increases drag', 'It pulls them with magnetism', 'It blocks their radio'], ar: ['تسخن الغلاف الجوي العلوي وتزيد مقاومة الهواء', 'تجذبها مغناطيسياً', 'تحجب إشاراتها'] } },
      choices: [
        { t: T('Reboost now', 'رفع المدار الآن'), eff: { power: -14, prot: 6 } },
        { t: T('Fly edge-on to cut drag', 'الطيران بالحافة لتقليل المقاومة'), eff: { power: -10, bio: -4 } },
        { t: T('Wait for the storm to pass', 'انتظار مرور العاصفة'), eff: { prot: -8 }, later: [{ in: 1, eff: { power: -28 } }], idle: true }
      ]
    },
    {
      id: 'helmet', where: ALL, cat: 'human', src: 'esa_eva23',
      title: T('Water Inside a Spacesuit Helmet', 'ماء داخل خوذة بدلة الفضاء'),
      desc: T('During a spacewalk, an astronaut reports water floating behind their head, and the amount is increasing.', 'أثناء سير في الفضاء، أبلغ رائد عن ماء يطفو خلف رأسه، والكمية تزداد.'),
      hint: T('In microgravity water sticks to the face; it can block the nose and ears.', 'في انعدام الجاذبية يلتصق الماء بالوجه؛ وقد يسد الأنف والأذنين.'),
      sys: T('The suit\'s cooling-water loop is life support in miniature: one leak links thermal control to breathing.', 'دائرة مياه التبريد في البدلة هي نظام دعم حياة مصغر: تسرب واحد يربط التحكم الحراري بالتنفس.'),
      trade: T('Abort (unfinished repair), continue (medical risk) or use the robotic arm (power).', 'الإلغاء (إصلاح غير مكتمل)، الاستمرار (خطر طبي)، أو الذراع الآلية (طاقة).'),
      fact: T('On 16 July 2013, ESA astronaut Luca Parmitano\'s helmet filled with water during a spacewalk, which was ended early.', 'في 16 يوليو 2013 امتلأت خوذة رائد ESA لوكا بارميتانو بالماء أثناء سير فضائي، فأُنهي مبكراً.'),
      quiz: { q: T('Why is water in a helmet so dangerous in space?', 'لماذا يكون الماء في الخوذة خطيراً جداً في الفضاء؟'),
              o: { en: ['It clings to the face and can block nose and ears', 'It freezes instantly', 'It conducts electricity'], ar: ['يلتصق بالوجه وقد يسد الأنف والأذنين', 'يتجمد فوراً', 'يوصل الكهرباء'] } },
      choices: [
        { t: T('Abort the spacewalk now', 'إلغاء السير في الفضاء فوراً'), eff: { prot: -10 } },
        { t: T('Finish a shortened task', 'إنهاء مهمة مختصرة'), eff: { prot: 8 }, crew: { eva: true, dose: 2, risk: { case: 'evawater', p: 0.6 } }, idle: true },
        { t: T('Hand the task to the robotic arm', 'تسليم المهمة للذراع الآلية'), eff: { power: -16, prot: 6 } }
      ]
    },
    {
      id: 'comms', where: ALL, cat: 'human', src: 'cnsa_queqiao',
      title: T('Ground Link Lost', 'انقطاع الاتصال بالأرض'),
      desc: T('The main antenna has failed. Mission control and telemedicine are unavailable.', 'الهوائي الرئيسي تعطل. مركز التحكم والطب عن بُعد غير متاحين.'),
      hint: T('Without comms, the crew must diagnose medical problems alone.', 'بدون اتصال، على الطاقم تشخيص المشكلات الطبية وحده.'),
      sys: T('Communication is an invisible subsystem: it links the crew to expert help, which links to medical outcomes.', 'الاتصال نظام فرعي غير مرئي: يربط الطاقم بمساعدة الخبراء، المرتبطة بالنتائج الطبية.'),
      trade: T('Operate autonomously (no telemedicine), power the backup antenna, or re-point the station (protection).', 'العمل باستقلالية (بلا طب عن بُعد)، تشغيل الهوائي الاحتياطي، أو إعادة توجيه المحطة (حماية).'),
      fact: T('A lander on the Moon\'s far side cannot see Earth; China placed the relay satellite Queqiao near the Earth-Moon L2 point to link Chang\'e 4.', 'المسبار على الجانب البعيد للقمر لا يرى الأرض؛ لذا وضعت الصين قمر الترحيل "تشياوتشياو" قرب نقطة L2 لربط تشانغ-إي 4.'),
      quiz: { q: T('Why did Chang\'e 4 need a relay satellite?', 'لماذا احتاج تشانغ-إي 4 قمر ترحيل؟'),
              o: { en: ['The Moon blocks direct signals from the far side', 'Its batteries were too small', 'Earth was too bright'], ar: ['القمر يحجب الإشارات المباشرة من الجانب البعيد', 'بطارياته صغيرة', 'الأرض شديدة السطوع'] } },
      choices: [
        { t: T('Autonomous operations for 2 days', 'عمليات مستقلة لمدة يومين'), eff: { power: 4 }, flag: { commsDown: 2 } },
        { t: T('Power the backup antenna', 'تشغيل الهوائي الاحتياطي'), eff: { power: -14 } },
        { t: T('Re-point the station for a relay link', 'إعادة توجيه المحطة لرابط ترحيل'), eff: { prot: -10, power: -4 }, idle: true }
      ]
    },
    {
      id: 'isolation', where: ALL, cat: 'human', src: 'mars500',
      title: T('Crew Tension and Monotony', 'توتر الطاقم والرتابة'),
      desc: T('After weeks in a small volume, arguments are rising and two crew members have stopped talking.', 'بعد أسابيع في مساحة صغيرة، تزداد الخلافات وتوقف اثنان من الطاقم عن الحديث.'),
      hint: T('People are a subsystem too: a stressed crew makes more mistakes.', 'البشر نظام فرعي أيضاً: الطاقم المتوتر يرتكب أخطاء أكثر.'),
      sys: T('Psychological state links to sleep, activity and maintenance quality, which feed every other system.', 'الحالة النفسية ترتبط بالنوم والنشاط وجودة الصيانة، التي تغذي كل الأنظمة الأخرى.'),
      trade: T('Rest and calls home (work time), push on (stress), or shared greenhouse work (power).', 'الراحة والاتصال بالأهل (وقت عمل)، المواصلة (توتر)، أو عمل مشترك في الصوبة (طاقة).'),
      fact: T('In the 520-day Mars-500 isolation study, the crew became steadily less active and their sleep timing shifted.', 'في دراسة العزل Mars-500 لمدة 520 يوماً أصبح الطاقم أقل نشاطاً تدريجياً وتغيرت مواعيد نومهم.'),
      quiz: { q: T('What did Mars-500 show about long isolation?', 'ماذا أظهرت تجربة Mars-500 عن العزل الطويل؟'),
              o: { en: ['Crew activity fell and sleep timing changed', 'Crew became more active', 'No effects at all'], ar: ['قل نشاط الطاقم وتغيرت مواعيد النوم', 'أصبح الطاقم أكثر نشاطاً', 'لا تأثيرات إطلاقاً'] } },
      choices: [
        { t: T('Free day and video calls home', 'يوم حر ومكالمات فيديو مع الأهل'), eff: { bio: -8, power: -4 }, crew: { stress: -20 } },
        { t: T('Keep the schedule', 'الالتزام بالجدول'), eff: { bio: 6 }, crew: { stress: 18, risk: { case: 'stress', p: 0.6 } }, idle: true },
        { t: T('Team greenhouse sessions', 'جلسات عمل جماعية في الصوبة'), eff: { power: -8, bio: 4 }, crew: { stress: -10 } }
      ]
    },
    {
      id: 'sleep', where: ALL, cat: 'human', src: 'lancet_sleep',
      title: T('Crew Sleep Deficit', 'عجز نوم الطاقم'),
      desc: T('Actigraphy shows the crew sleeping about 6 hours a night. Alertness scores are dropping.', 'أجهزة رصد الحركة تظهر أن الطاقم ينام نحو 6 ساعات ليلاً. مؤشرات اليقظة تنخفض.'),
      hint: T('Medication works but a drugged crew wakes slowly in an emergency.', 'الأدوية تعمل لكن الطاقم تحت تأثيرها يستيقظ ببطء في الطوارئ.'),
      sys: T('Sleep is a stock that is drained by noise, light and stress; its deficit spreads to every decision.', 'النوم مخزون يستنزفه الضجيج والضوء والتوتر؛ وعجزه ينتشر لكل قرار.'),
      trade: T('Circadian lighting (power), sleep aids (medical stock, alertness risk), or push through (health).', 'إضاءة الساعة البيولوجية (طاقة)، المنومات (مخزون طبي وخطر اليقظة)، أو التحمل (صحة).'),
      fact: T('A 10-year study found astronauts slept just over 6 hours a night on the ISS, despite 8.5 hours scheduled.', 'وجدت دراسة على مدى 10 سنوات أن رواد المحطة ناموا ما يزيد قليلاً عن 6 ساعات ليلاً رغم جدولة 8.5 ساعة.'),
      quiz: { q: T('How long did ISS astronauts sleep on average (8.5 h scheduled)?', 'كم نام رواد المحطة في المتوسط (مع جدولة 8.5 ساعة)؟'),
              o: { en: ['About 6 hours', 'About 9 hours', 'About 4 hours'], ar: ['نحو 6 ساعات', 'نحو 9 ساعات', 'نحو 4 ساعات'] } },
      choices: [
        { t: T('Circadian lighting schedule', 'جدول إضاءة يحاكي الساعة البيولوجية'), eff: { power: -10 }, crew: { health: 4, stress: -8 } },
        { t: T('Issue sleep aids', 'صرف المنومات'), eff: {}, kit: { sleepaid: 2 }, crew: { health: 3, stress: -4 } },
        { t: T('Push through the workload', 'تحمل عبء العمل'), eff: { bio: 6 }, crew: { health: -6, stress: 10, risk: { case: 'insomnia', p: 0.5 } }, idle: true }
      ]
    },
    {
      id: 'gcr', where: ['cislunar'], cat: 'env', src: 'springer_rad',
      title: T('Deep-Space Dose Budget Review', 'مراجعة ميزانية الجرعة في الفضاء العميق'),
      desc: T('Outside Earth\'s magnetic field, the crew dose rate is more than twice the ISS level. The flight surgeon wants action.', 'خارج المجال المغناطيسي للأرض، معدل جرعة الطاقم أكثر من ضعف مستوى المحطة. الطبيب يطلب إجراءً.'),
      hint: T('Food and water bags around sleeping quarters are free shielding.', 'أكياس الطعام والماء حول أماكن النوم تدريع مجاني.'),
      sys: T('Mass is shielding: moving stores changes both the dose budget and how easily the crew can reach their food.', 'الكتلة تدريع: نقل المخزون يغير ميزانية الجرعة وسهولة وصول الطاقم لطعامه.'),
      trade: T('Restow stores (food access), power active monitoring, or accept the higher rate.', 'إعادة ترتيب المخزون (الوصول للطعام)، مراقبة نشطة بالطاقة، أو قبول المعدل الأعلى.'),
      fact: T('Typical dose rates: ~20 µSv/h on the ISS (~200× Earth) and ~75 µSv/h in deep space (~750× Earth).', 'معدلات الجرعة النموذجية: ~20 ميكروسيفرت/ساعة في المحطة (~200 ضعف الأرض) و~75 في الفضاء العميق (~750 ضعفاً).'),
      quiz: { q: T('Compared with the ISS, deep-space dose rate is about…', 'مقارنة بالمحطة، معدل الجرعة في الفضاء العميق تقريباً…'),
              o: { en: ['3–4 times higher', 'The same', 'Lower'], ar: ['أعلى 3–4 مرات', 'نفسه', 'أقل'] } },
      choices: [
        { t: T('Restow water and food around sleep stations', 'نقل الماء والطعام حول أماكن النوم'), eff: { bio: -8, prot: 14 } },
        { t: T('Power active dosimetry and alerts', 'تشغيل قياس الجرعة النشط والتنبيهات'), eff: { power: -12, prot: 8 } },
        { t: T('Accept the higher rate', 'قبول المعدل الأعلى'), eff: {}, crew: { dose: 12 }, idle: true }
      ]
    }
  ]);
})(window.OT);
