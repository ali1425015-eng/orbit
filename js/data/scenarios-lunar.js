/* LUNAR SURFACE SCENARIOS — only in the 'moon' profile (Expedition sectors 21–30 or a Moon mission). */
(function (OT) {
  'use strict';
  var T = OT.T, MOON = ['moon'];

  OT.data.scenarios = (OT.data.scenarios || []).concat([
    {
      id: 'lunarnight', where: MOON, cat: 'env', src: 'esa_night',
      title: T('Lunar Night Begins', 'بداية الليل القمري'),
      desc: T('The Sun is setting on the base. About 14 Earth days of darkness are coming, with surface temperatures below −170 °C.',
              'الشمس تغرب عن القاعدة. نحو 14 يوماً أرضياً من الظلام قادمة، مع حرارة سطح أقل من −170 °م.'),
      hint: T('No sunlight means no solar power and no free heat. Something must give.', 'لا ضوء شمس يعني لا طاقة شمسية ولا حرارة مجانية. لا بد من التضحية بشيء.'),
      sys: T('The lunar day–night cycle turns power into a stock that must last two weeks, coupling it to heating and the greenhouse.', 'دورة النهار والليل القمرية تجعل الطاقة مخزوناً يجب أن يكفي أسبوعين، فترتبط بالتدفئة والصوبة.'),
      trade: T('Shed loads (food), run heaters (power), or shrink the heated volume (crew comfort, air).', 'تخفيف الأحمال (غذاء)، تشغيل السخانات (طاقة)، أو تصغير الحجم المدفأ (راحة الطاقم والهواء).'),
      fact: T('ESA notes that future lunar settlers must survive about 14 days of darkness, when surface temperatures dip below −170 °C.', 'تشير ESA إلى أن مستوطني القمر يجب أن ينجوا من نحو 14 يوماً من الظلام حين تنخفض الحرارة لأقل من −170 °م.'),
      quiz: { q: T('How long does a lunar night last?', 'كم يستمر الليل القمري؟'),
              o: { en: ['About 14 Earth days', 'About 12 hours', 'About 3 days'], ar: ['نحو 14 يوماً أرضياً', 'نحو 12 ساعة', 'نحو 3 أيام'] } },
      choices: [
        { t: T('Fuel cells + shed greenhouse loads', 'خلايا الوقود + تخفيف أحمال الصوبة'), eff: { power: -8, bio: -14 }, later: [{ in: 2, eff: { power: -12 } }] },
        { t: T('Run heaters at full power', 'تشغيل السخانات بكامل الطاقة'), eff: { power: -20, prot: 8 } },
        { t: T('Retreat to one small heated module', 'الانسحاب إلى وحدة صغيرة مدفأة'), eff: { prot: -10, air: -6 }, crew: { stress: 12 }, later: [{ in: 2, eff: { prot: -12 } }], idle: true }
      ]
    },
    {
      id: 'dust', where: MOON, cat: 'env', src: 'esa_dust',
      title: T('Lunar Dust Inside the Habitat', 'غبار القمر داخل المسكن'),
      desc: T('Sharp, electrostatically charged dust has come in on the suits. The crew report sore throats and watery eyes.', 'دخل غبار حاد مشحون كهربائياً مع البدلات. الطاقم يشكو التهاب الحلق ودموع العين.'),
      hint: T('Lunar dust is abrasive and clings to everything; filters fill up fast.', 'غبار القمر كاشط ويلتصق بكل شيء؛ الفلاتر تمتلئ بسرعة.'),
      sys: T('Dust links EVA operations to air quality, crew lungs and the life of seals and filters.', 'الغبار يربط عمليات السير على السطح بجودة الهواء ورئات الطاقم وعمر الأختام والفلاتر.'),
      trade: T('Electrostatic cleaning (power), filter swap (crew time), or ignore (crew health).', 'تنظيف كهروستاتيكي (طاقة)، تغيير الفلاتر (وقت الطاقم)، أو التجاهل (صحة الطاقم).'),
      fact: T('Apollo astronauts\' throats got sore and eyes watered from lunar dust; ESA says it is sharp, abrasive and electrostatically charged.', 'تعرض رواد أبولو لالتهاب الحلق ودموع العين من غبار القمر؛ وتقول ESA إنه حاد وكاشط ومشحون كهربائياً.'),
      quiz: { q: T('Why is lunar dust more harmful than Earth dust?', 'لماذا غبار القمر أضر من غبار الأرض؟'),
              o: { en: ['No erosion: grains stay sharp and abrasive', 'It is radioactive', 'It is wet'], ar: ['لا تعرية: تظل الحبيبات حادة وكاشطة', 'مشع', 'رطب'] } },
      choices: [
        { t: T('Electrostatic cleaning of suits and airlock', 'تنظيف كهروستاتيكي للبدلات وغرفة الضغط'), eff: { power: -12, air: 6 } },
        { t: T('Swap all HEPA filters', 'تغيير كل فلاتر HEPA'), eff: { bio: -4, air: 14 }, later: [{ in: 2, eff: { air: -18 } }] },
        { t: T('Carry on', 'المواصلة'), eff: { air: -8 }, crew: { risk: { case: 'hayfever', p: 0.7 } }, later: [{ in: 1, eff: { air: -14 } }], idle: true }
      ]
    },
    {
      id: 'dustpanels', where: MOON, cat: 'eng', src: 'esa_dust',
      title: T('Dust on Radiators and Panels', 'غبار على المشعات والألواح'),
      desc: T('A rover kicked up dust that settled on radiators and solar panels. Heat rejection and power output are both down.', 'مركبة جوالة أثارت غباراً استقر على المشعات والألواح الشمسية. فقد التبريد والطاقة معاً.'),
      hint: T('One dust layer hits two systems at once.', 'طبقة غبار واحدة تضرب نظامين في آن واحد.'),
      sys: T('Dust couples power generation and heat rejection: a dirty radiator makes electronics run hot.', 'الغبار يربط توليد الطاقة بطرد الحرارة: المشع المتسخ يجعل الإلكترونيات تسخن.'),
      trade: T('EVA cleaning (crew risk), robot brushing (power), or accept double losses.', 'تنظيف بالسير (خطر على الطاقم)، فرشاة آلية (طاقة)، أو قبول خسارة مزدوجة.'),
      fact: T('ESA reports lunar dust is so abrasive it ate through layers of Apollo boots and broke vacuum seals on sample boxes.', 'تذكر ESA أن غبار القمر كاشط لدرجة أنه أكل طبقات من أحذية أبولو وأتلف أختام صناديق العينات.'),
      quiz: { q: T('Dust on a radiator mainly causes…', 'الغبار على المشع يسبب أساساً…'),
              o: { en: ['Less heat rejection, so equipment overheats', 'More oxygen', 'Lower radiation'], ar: ['طرد حرارة أقل فتسخن المعدات', 'أكسجين أكثر', 'إشعاع أقل'] } },
      choices: [
        { t: T('EVA cleaning run', 'تنظيف بالسير على السطح'), eff: { prot: 14, power: 8 }, crew: { eva: true, dose: 3, risk: { case: 'dcs', p: 0.15 } }, later: [{ in: 1, eff: { air: -24 } }] },
        { t: T('Robotic brushing', 'تنظيف بفرشاة آلية'), eff: { power: -10, prot: 10 } },
        { t: T('Accept the losses', 'قبول الخسائر'), eff: { prot: -12, power: -8 }, later: [{ in: 2, eff: { power: -10 } }], idle: true }
      ]
    },
    {
      id: 'impact', where: MOON, cat: 'env', src: 'esa_neliota',
      title: T('Meteoroid Impact Near the Base', 'اصطدام نيزكي قرب القاعدة'),
      desc: T('Sensors recorded an impact flash 400 m away. Ejecta may have hit the habitat shell.', 'رصدت المجسات وميض اصطدام على بعد 400 م. قد تكون الشظايا أصابت غلاف المسكن.'),
      hint: T('The Moon has no atmosphere to burn up small rocks. Regolith makes good shielding.', 'القمر بلا غلاف جوي يحرق الصخور الصغيرة. التربة القمرية تدريع جيد.'),
      sys: T('Impacts link structure, pressure and shielding; covering the habitat with regolith also cuts radiation.', 'الاصطدامات تربط الهيكل والضغط والتدريع؛ وتغطية المسكن بالتربة تقلل الإشعاع أيضاً.'),
      trade: T('Drone inspection (power), regolith berm (more power, more protection), or carry on.', 'فحص بطائرة مسيرة (طاقة)، ساتر من التربة (طاقة أكثر وحماية أكثر)، أو المواصلة.'),
      fact: T('ESA\'s NELIOTA project has recorded more than 190 confirmed impact flashes on the Moon since 2017.', 'سجل مشروع NELIOTA التابع لـ ESA أكثر من 190 وميض اصطدام مؤكد على القمر منذ 2017.'),
      quiz: { q: T('Why do small meteoroids reach the lunar surface?', 'لماذا تصل النيازك الصغيرة لسطح القمر؟'),
              o: { en: ['The Moon has no atmosphere to burn them up', 'The Moon attracts them magnetically', 'They are too cold to burn'], ar: ['القمر بلا غلاف جوي يحرقها', 'القمر يجذبها مغناطيسياً', 'باردة جداً لتحترق'] } },
      choices: [
        { t: T('Drone inspection and seal check', 'فحص بطائرة مسيرة وفحص الأختام'), eff: { power: -10, prot: 8 } },
        { t: T('Build a regolith berm with the robot', 'بناء ساتر من التربة بالروبوت'), eff: { power: -18, prot: 18 } },
        { t: T('Log it and continue', 'التسجيل والمواصلة'), eff: { prot: -12 }, later: [{ in: 1, eff: { air: -20 } }], idle: true }
      ]
    },
    {
      id: 'regolithfarm', where: MOON, cat: 'bio', src: 'lunar_soil',
      title: T('Expand the Farm into Regolith?', 'توسيع المزرعة في التربة القمرية؟'),
      desc: T('Hydroponic nutrients are running low. The botanist proposes growing in processed lunar soil.', 'مغذيات الزراعة المائية تنفد. يقترح عالم النبات الزراعة في تربة قمرية معالجة.'),
      hint: T('Plants can grow in lunar soil, but they are stressed and slower.', 'النباتات تنمو في التربة القمرية، لكنها مجهدة وأبطأ.'),
      sys: T('Local resources (ISRU) cut resupply needs, but the biology adds delays: a classic delayed-feedback system.', 'استخدام الموارد المحلية يقلل الحاجة للإمداد، لكن البيولوجيا تضيف تأخيراً: نظام تغذية راجعة مؤجلة كلاسيكي.'),
      trade: T('Imported hydroponics (power), regolith beds (slow, delayed gain), or pause (food loss).', 'زراعة مائية مستوردة (طاقة)، أحواض تربة (بطيئة بمكسب مؤجل)، أو التوقف (خسارة غذاء).'),
      fact: T('In 2022, University of Florida scientists grew Arabidopsis in Apollo lunar soil; it sprouted, but the plants showed stress genes.', 'في 2022 زرع علماء جامعة فلوريدا نبات الأرابيدوبسيس في تربة أبولو القمرية؛ نبت لكنه أظهر جينات إجهاد.'),
      quiz: { q: T('What happened to plants grown in real lunar soil (2022)?', 'ماذا حدث للنباتات المزروعة في تربة قمرية حقيقية (2022)؟'),
              o: { en: ['They grew but showed stress', 'They could not sprout', 'They grew faster than on Earth'], ar: ['نمت لكنها أظهرت إجهاداً', 'لم تنبت', 'نمت أسرع من الأرض'] } },
      choices: [
        { t: T('Stay hydroponic, run more lights', 'البقاء على الزراعة المائية مع إضاءة أكثر'), eff: { power: -14, bio: 10 } },
        { t: T('Start regolith beds (slow payoff)', 'بدء أحواض التربة (عائد بطيء)'), eff: { bio: 2, power: -4 }, later: [{ in: 2, eff: { bio: 28 } }] },
        { t: T('Pause farm expansion', 'إيقاف توسيع المزرعة'), eff: { bio: -10 }, later: [{ in: 2, eff: { bio: -8 } }], idle: true }
      ]
    }
  ]);
})(window.OT);
