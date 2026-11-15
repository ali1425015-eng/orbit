/* PRE/POST ASSESSMENT (research instrument).
   Same 12 items before and after the lesson; no feedback is shown, so the test
   does not teach. Items 1–6: systems thinking (stock-and-flow, delays, feedback),
   adapted in spirit from the "bathtub dynamics" tasks (Booth Sweeney & Sterman, 2000)
   to a habitat context. Items 7–12: content knowledge.
   a = index of the correct option. Pilot these items with 5 students before use. */
(function (OT) {
  'use strict';
  var T = OT.T;
  OT.data.assessment = [
    { k: 'systems', q: T('A habitat gains 3 units of O2 per hour and loses 5 per hour. What happens to the O2 stored?', 'محطة تكسب 3 وحدات O2 في الساعة وتفقد 5. ماذا يحدث للأكسجين المخزن؟'),
      o: { en: ['It keeps falling by 2 units per hour', 'It stays the same', 'It rises because O2 is being produced'], ar: ['يستمر في الانخفاض بمقدار وحدتين في الساعة', 'يبقى كما هو', 'يرتفع لأن الأكسجين يُنتج'] }, a: 0 },
    { k: 'systems', q: T('O2 production rises from 3 to 4 units/h while loss stays at 5. Is the O2 stock now rising?', 'ارتفع إنتاج O2 من 3 إلى 4 وحدات/ساعة والفقد ثابت عند 5. هل المخزون يرتفع الآن؟'),
      o: { en: ['No, it still falls, just more slowly', 'Yes, because production went up', 'It stops changing'], ar: ['لا، ما زال ينخفض لكن أبطأ', 'نعم لأن الإنتاج زاد', 'يتوقف عن التغير'] }, a: 0 },
    { k: 'systems', q: T('A crew\'s radiation dose rate falls after a storm ends. What happens to their total dose?', 'انخفض معدل جرعة الإشعاع بعد انتهاء العاصفة. ماذا يحدث للجرعة الكلية؟'),
      o: { en: ['It keeps increasing, only more slowly', 'It decreases', 'It returns to zero'], ar: ['تستمر في الزيادة لكن أبطأ', 'تنخفض', 'تعود للصفر'] }, a: 0 },
    { k: 'systems', q: T('You cut greenhouse lighting to save power. Which effect may arrive LATER?', 'خفضت إضاءة الصوبة لتوفير الطاقة. أي أثر قد يظهر لاحقاً؟'),
      o: { en: ['Less food and less oxygen from plants', 'More radiation', 'Higher cabin pressure'], ar: ['غذاء أقل وأكسجين أقل من النباتات', 'إشعاع أكثر', 'ضغط مقصورة أعلى'] }, a: 0 },
    { k: 'systems', q: T('Low power slows CO2 scrubbers; high CO2 makes crew tired; tired crew skip maintenance; that lowers power. This is a…', 'طاقة منخفضة تبطئ منقيات CO2؛ وCO2 المرتفع يرهق الطاقم؛ والطاقم المرهق يهمل الصيانة؛ مما يخفض الطاقة. هذه…'),
      o: { en: ['Reinforcing (vicious) feedback loop', 'Balancing loop', 'Random event'], ar: ['حلقة تغذية راجعة معززة (مفرغة)', 'حلقة موازنة', 'حدث عشوائي'] }, a: 0 },
    { k: 'systems', q: T('Two options both fix today\'s problem. Option A costs 10 now; option B costs 0 now and 15 in two days. Which keeps more resources over 3 days?', 'خياران يحلان مشكلة اليوم. الخيار أ يكلف 10 الآن؛ والخيار ب يكلف 0 الآن و15 بعد يومين. أيهما يحفظ موارد أكثر خلال 3 أيام؟'),
      o: { en: ['Option A', 'Option B', 'They are equal'], ar: ['الخيار أ', 'الخيار ب', 'متساويان'] }, a: 0 },
    { k: 'content', q: T('Why do stations use external radiators with ammonia loops?', 'لماذا تستخدم المحطات مشعات خارجية بدوائر أمونيا؟'),
      o: { en: ['In vacuum, heat leaves only by radiation', 'To make oxygen', 'To produce food'], ar: ['في الفراغ تخرج الحرارة بالإشعاع فقط', 'لصنع الأكسجين', 'لإنتاج الغذاء'] }, a: 0 },
    { k: 'content', q: T('What do greenhouse plants provide in a closed habitat?', 'ماذا توفر نباتات الصوبة في مسكن مغلق؟'),
      o: { en: ['Food, oxygen and CO2 removal', 'Only food', 'Radiation shielding only'], ar: ['غذاء وأكسجين وإزالة CO2', 'غذاء فقط', 'تدريع إشعاعي فقط'] }, a: 0 },
    { k: 'content', q: T('Why do astronauts lose bone in microgravity?', 'لماذا يفقد الرواد العظام في انعدام الجاذبية؟'),
      o: { en: ['Bones are no longer loaded by body weight', 'Radiation dissolves bone', 'Space food lacks calcium only'], ar: ['العظام لم تعد تحمل وزن الجسم', 'الإشعاع يذيب العظام', 'طعام الفضاء ينقصه الكالسيوم فقط'] }, a: 0 },
    { k: 'content', q: T('What causes decompression sickness after a spacewalk?', 'ما سبب مرض تخفيف الضغط بعد السير في الفضاء؟'),
      o: { en: ['Nitrogen bubbles forming at low suit pressure', 'Cold temperatures', 'Too much oxygen'], ar: ['تكون فقاعات نيتروجين عند ضغط البدلة المنخفض', 'البرد', 'أكسجين زائد'] }, a: 0 },
    { k: 'content', q: T('Where is the radiation dose rate highest?', 'أين يكون معدل جرعة الإشعاع أعلى؟'),
      o: { en: ['Deep space outside Earth\'s magnetic field', 'Low Earth orbit', 'Earth\'s surface'], ar: ['الفضاء العميق خارج المجال المغناطيسي للأرض', 'المدار الأرضي المنخفض', 'سطح الأرض'] }, a: 0 },
    { k: 'content', q: T('Which tool found the first blood clot in orbit?', 'أي أداة كشفت أول جلطة في المدار؟'),
      o: { en: ['Ultrasound', 'X-ray', 'Thermometer'], ar: ['السونار', 'الأشعة السينية', 'مقياس الحرارة'] }, a: 0 }
  ];
})(window.OT);
