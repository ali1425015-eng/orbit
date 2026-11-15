/* INTERFACE TEXT (Arabic / English). Content text lives in js/data. */
(function (OT) {
  'use strict';
  OT.i18n = {
    ar: {
      appName: 'مقايضات مدارية', tagline: 'محاكي قرارات الأنظمة المترابطة ودعم الحياة وطب الفضاء',
      langBtn: 'English', start: 'ابدأ', back: 'رجوع', close: 'إغلاق', next: 'التالي', skip: 'تخطي', confirm: 'تأكيد',
      modeTraining: 'تدريب', modeTrainingD: 'تلميحات وشرح لكل قرار، بدون مؤقت، تكلفة عادية، صيدلية كاملة.',
      modeRealistic: 'واقعي', modeRealisticD: 'تكلفة ×1.3، بلا تلميحات، مؤقت قرار 60 ثانية، نصف مخزون الصيدلية.',
      modeExpedition: 'رحلة استكشافية', modeExpeditionD: '30 قطاعاً: مدار منخفض ← بين الأرض والقمر ← سطح القمر. 75% من الصيدلية + إمداد كل قطاع.',
      profile: 'موقع المهمة', participant: 'رمز المشارك (للبحث، اختياري)', group: 'المجموعة',
      howTo: 'كيف ألعب؟', handbook: 'الدليل العلمي', assessment: 'الاختبار القبلي/البعدي', settings: 'الإعدادات', research: 'وضع البحث',
      day: 'اليوم', sector: 'القطاع', of: 'من', costMult: 'معامل التكلفة', cabin: 'المقصورة',
      incoming: 'بلاغ وارد', medAlert: 'إنذار طبي', hint: 'تلميح', science: 'العلم وراء القرار',
      sysLbl: 'ترابط الأنظمة', tradeLbl: 'المقايضة', factLbl: 'حقيقة موثقة', srcLbl: 'المصدر',
      chooseOpt: 'اختر قراراً', timeLeft: 'الوقت المتبقي', timeout: 'انتهى الوقت! تم تطبيق "عدم التصرف".',
      emergency: 'احتياطي الطوارئ', emergencyUsed: 'تم استخدام الاحتياطي', reserve: 'درع احتياطي نشط',
      couplingMap: 'خريطة الترابط', aiTitle: 'مدير الطيران الذكي', aiTip: 'نموذج ذكاء اصطناعي (انحدار لوجستي) تدرّب على {tr} مهمة محاكاة واختُبر على {te} مهمة أخرى لم يرها (دقة {acc}%، AUC {auc}). يتوقع فرصة نجاة المهمة من حالة المحطة بعد كل ليلة. هو احتمال وليس يقيناً.', aiWait: 'أول توقع بعد الليلة الأولى.', aiForecast: 'فرصة نجاة المهمة', aiWhy: 'أكثر ما يقلقه:', aiOk: 'لا توجد مخاطر كبيرة الآن.', couplingNone: 'لا يوجد ترابط سلبي نشط الليلة.', crewPanel: 'الطاقم', medkit: 'الصيدلية',
      log: 'سجل الأحداث', dose: 'الجرعة', bone: 'العظام', stress: 'التوتر', health: 'الصحة',
      nightReport: 'تقرير نهاية اليوم', passive: 'استهلاك ثابت', delayed: 'نتائج مؤجلة وصلت', couplingsFired: 'تأثيرات الترابط',
      continueBtn: 'متابعة', medTitle: 'العيادة الطبية', patient: 'المريض', complaint: 'الشكوى', vitals: 'العلامات الحيوية',
      step1: '1. افحص', step2: '2. شخّص', step3: '3. عالج', tools: 'أدوات التشخيص', diagnosis: 'التشخيص', treatment: 'العلاج',
      outOfStock: 'نفد المخزون', commsDown: 'الاتصال مقطوع', used: 'تم', cost: 'التكلفة',
      dxRight: 'تشخيص صحيح', dxWrong: 'تشخيص غير دقيق', txBest: 'علاج مثالي', txOk: 'علاج جزئي', txBad: 'علاج ضار أو غير مفيد',
      whyLbl: 'لماذا؟', preventLbl: 'الوقاية', earthLbl: 'فائدة على الأرض',
      quizTitle: 'استجواب ما بعد المهمة', quizSub: 'أسئلة من الأحداث التي عشتها فعلاً في هذه المهمة.', score: 'النتيجة',
      winTitle: 'نجاح المهمة', loseTitle: 'فشل المهمة', quizFail: 'نجت المحطة، لكن الاستجواب العلمي لم يُجتز.',
      failSys: 'انهيار النظام: ', failCrew: 'إخلاء طبي طارئ: ', report: 'تقرير المهمة', grade: 'التقدير',
      kpiSys: 'الأنظمة', kpiCrew: 'صحة الطاقم', kpiMed: 'الأداء الطبي', kpiDx: 'دقة التشخيص', kpiTime: 'متوسط زمن القرار',
      extrapolate: 'لو استمرت المهمة 6 أشهر بنفس المعدل:', doseProj: 'جرعة متوقعة', boneProj: 'فقد عظام متوقع',
      decisionLog: 'سجل القرارات', costliest: 'أغلى قرار', exportCsv: 'تصدير CSV', exportJson: 'تصدير JSON',
      retry: 'إعادة القطاع', menu: 'القائمة الرئيسية', nextSector: 'القطاع التالي', engage: 'انطلاق',
      sourcesUsed: 'المصادر المستخدمة في هذه المهمة', handbookSys: 'الأنظمة والأحداث', handbookMed: 'طب الفضاء', search: 'بحث…',
      locked: 'لم يُكتشف بعد', soundLbl: 'الصوت', musicLbl: 'الموسيقى المحيطة', crtLbl: 'تأثير الشاشة القديمة', motionLbl: 'تقليل الحركة',
      timerLbl: 'مؤقت القرار (واقعي/رحلة)', textLbl: 'حجم الخط', contrastLbl: 'تباين عالٍ', resetProgress: 'مسح التقدم',
      assessIntro: 'اختبار من 12 سؤالاً بدون تصحيح فوري. يُستخدم قبل الدرس وبعده لقياس التعلم.', pre: 'قبلي', post: 'بعدي',
      assessDone: 'تم حفظ الإجابات.', keyboard: 'اختصارات: 1/2/3 للاختيار، H للتلميح، F لقلب البطاقة، Esc للإعدادات',
      tut: [
        ['أنت قائد الموئل', 'هدفك: إبقاء الطاقم حياً 10 أيام. كل يوم أزمة جديدة، وكل حل له ثمن في نظام آخر.'],
        ['الأنظمة الأربعة', 'الطاقة، الحماية، الغلاف الجوي، الغذاء. إذا وصل أي منها إلى 0% تفشل المهمة.'],
        ['الطاقم هو النظام الخامس', 'تابع صحة كل فرد وجرعة الإشعاع والعظام. إذا وصلت صحة أي فرد إلى 0 يلزم إخلاء طبي.'],
        ['خريطة الترابط', 'الأسهم تضيء عندما يسحب نظام ضعيف نظاماً آخر للأسفل. راقبها كل ليلة.'],
        ['القرار', 'كل خيار يعرض أثره بالأرقام. اقلب البطاقة لتعرف العلم وراءه والمصدر.'],
        ['العيادة', 'عند الإنذار الطبي: افحص بالأدوات، ثم شخّص، ثم عالج بأدوية محدودة.']
      ]
    },
    en: {
      appName: 'ORBITAL TRADE-OFFS', tagline: 'A coupled-systems decision simulator for life support and space medicine',
      langBtn: 'العربية', start: 'Start', back: 'Back', close: 'Close', next: 'Next', skip: 'Skip', confirm: 'Confirm',
      modeTraining: 'Training', modeTrainingD: 'Hints and explanations, no timer, normal costs, full pharmacy.',
      modeRealistic: 'Realistic', modeRealisticD: 'Costs ×1.3, no hints, 60-second timer, half the pharmacy stock.',
      modeExpedition: 'Expedition', modeExpeditionD: '30 sectors: Low orbit → cislunar → lunar surface. 75% pharmacy + resupply each sector.',
      profile: 'Mission location', participant: 'Participant code (research, optional)', group: 'Group',
      howTo: 'How to play', handbook: 'Science handbook', assessment: 'Pre/Post test', settings: 'Settings', research: 'Research mode',
      day: 'Day', sector: 'Sector', of: 'of', costMult: 'Cost multiplier', cabin: 'Cabin',
      incoming: 'Incoming report', medAlert: 'Medical alert', hint: 'Hint', science: 'Science behind the decision',
      sysLbl: 'Coupled systems', tradeLbl: 'Trade-off', factLbl: 'Verified fact', srcLbl: 'Source',
      chooseOpt: 'Choose a decision', timeLeft: 'Time left', timeout: 'Time is up! "No action" was applied.',
      emergency: 'Emergency reserves', emergencyUsed: 'Reserves used', reserve: 'Reserve buffer active',
      couplingMap: 'Coupling map', aiTitle: 'AI Flight Director', aiTip: 'A machine-learning model (logistic regression) trained on {tr} simulated missions and tested on {te} different ones it never saw ({acc}% accuracy, AUC {auc}). After each night it estimates the chance that this mission survives. It is a probability, not a certainty.', aiWait: 'First forecast after the first night.', aiForecast: 'Mission survival chance', aiWhy: 'Main concerns:', aiOk: 'No major risks right now.', couplingNone: 'No negative couplings active tonight.', crewPanel: 'Crew', medkit: 'Pharmacy',
      log: 'Event log', dose: 'Dose', bone: 'Bone', stress: 'Stress', health: 'Health',
      nightReport: 'End-of-day report', passive: 'Constant consumption', delayed: 'Delayed consequences arrived', couplingsFired: 'Coupling effects',
      continueBtn: 'Continue', medTitle: 'Medical Bay', patient: 'Patient', complaint: 'Complaint', vitals: 'Vital signs',
      step1: '1. Examine', step2: '2. Diagnose', step3: '3. Treat', tools: 'Diagnostic tools', diagnosis: 'Diagnosis', treatment: 'Treatment',
      outOfStock: 'Out of stock', commsDown: 'Comms down', used: 'Done', cost: 'Cost',
      dxRight: 'Correct diagnosis', dxWrong: 'Inaccurate diagnosis', txBest: 'Best-practice treatment', txOk: 'Partly helpful treatment', txBad: 'Harmful or useless treatment',
      whyLbl: 'Why?', preventLbl: 'Prevention', earthLbl: 'Benefit on Earth',
      quizTitle: 'Post-mission debrief', quizSub: 'Questions drawn from events you actually lived in this mission.', score: 'Score',
      winTitle: 'MISSION ACCOMPLISHED', loseTitle: 'MISSION FAILED', quizFail: 'The station survived, but the science debrief was not passed.',
      failSys: 'System collapse: ', failCrew: 'Emergency medical evacuation: ', report: 'Mission report', grade: 'Grade',
      kpiSys: 'Systems', kpiCrew: 'Crew health', kpiMed: 'Medical performance', kpiDx: 'Diagnostic accuracy', kpiTime: 'Mean decision time',
      extrapolate: 'If the mission lasted 6 months at this rate:', doseProj: 'Projected dose', boneProj: 'Projected bone loss',
      decisionLog: 'Decision log', costliest: 'Costliest decision', exportCsv: 'Export CSV', exportJson: 'Export JSON',
      retry: 'Retry sector', menu: 'Main menu', nextSector: 'Next sector', engage: 'Engage',
      sourcesUsed: 'Sources used in this mission', handbookSys: 'Systems & events', handbookMed: 'Space medicine', search: 'Search…',
      locked: 'Not discovered yet', soundLbl: 'Sound', musicLbl: 'Ambient music', crtLbl: 'Retro screen effect', motionLbl: 'Reduce motion',
      timerLbl: 'Decision timer (Realistic/Expedition)', textLbl: 'Text size', contrastLbl: 'High contrast', resetProgress: 'Reset progress',
      assessIntro: 'A 12-question test with no instant feedback. Use it before and after the lesson to measure learning.', pre: 'Pre', post: 'Post',
      assessDone: 'Answers saved.', keyboard: 'Shortcuts: 1/2/3 choose, H hint, F flip card, Esc settings',
      tut: [
        ['You command the habitat', 'Goal: keep the crew alive for 10 days. Each day brings a crisis, and every fix costs another system.'],
        ['Four station systems', 'Power, Protection, Atmosphere, Food. If any reaches 0%, the mission fails.'],
        ['The crew is the fifth system', 'Watch each person\'s health, radiation dose and bone. If anyone\'s health reaches 0, a medical evacuation ends the mission.'],
        ['Coupling map', 'Arrows light up when a weak system drags another one down. Check it every night.'],
        ['Decisions', 'Every option shows its effect in numbers. Flip the card to see the science and the source.'],
        ['Medical Bay', 'On a medical alert: examine with tools, diagnose, then treat with a limited pharmacy.']
      ]
    }
  };
  OT.lang = OT.store.get('lang', 'ar');
  OT.t = function (k) { return (OT.i18n[OT.lang] && OT.i18n[OT.lang][k]) || OT.i18n.en[k] || k; };
  OT.tx = function (obj) { return obj ? (obj[OT.lang] || obj.en || '') : ''; };
})(window.OT);
