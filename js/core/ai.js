/* AI FLIGHT DIRECTOR — DOM-free (also loaded by the Node research tools).
   features(st): the station snapshot the model reads (the SAME function builds the training data).
   predict(st) : survival probability from the logistic model in js/core/ai-model.js, plus the
                 factors pulling it down most (weight × distance from the average training snapshot). */
(function (OT) {
  'use strict';
  var AI = OT.AI = OT.AI || {};
  var SYS = OT.SYS;

  AI.features = function (st) {
    var crewH = st.crew.map(function (c) { return c.health; });
    var pend = 0;
    st.pending.forEach(function (p) { SYS.forEach(function (k) { if ((p.eff[k] || 0) < 0) pend += p.eff[k]; }); });
    var kitLeft = Object.keys(st.kit).reduce(function (a, k) { return a + st.kit[k]; }, 0);
    return {
      day: st.day, days_left: st.maxDays - st.day,
      power: st.res.power, prot: st.res.prot, air: st.res.air, bio: st.res.bio,
      min_sys: Math.min(st.res.power, st.res.prot, st.res.air, st.res.bio),
      n_low: SYS.filter(function (k) { return st.res[k] < 40; }).length,
      crew_mean: crewH.reduce(function (a, b) { return a + b; }, 0) / crewH.length,
      crew_min: Math.min.apply(null, crewH),
      conditions: st.crew.reduce(function (a, c) { return a + c.conditions.length; }, 0),
      pending_neg: pend,
      kit_left: kitLeft,
      dose_mean: st.crew.reduce(function (a, c) { return a + c.dose; }, 0) / st.crew.length,
      couplings_active: (st.lastCoupling || []).filter(function (id) { return id !== 'b_a_plus'; }).length,
      profile_cislunar: st.profile === 'cislunar' ? 1 : 0, profile_moon: st.profile === 'moon' ? 1 : 0,
      realistic: st.mode === 'realistic' ? 1 : 0
    };
  };

  /* factors a player can act on (day, mode and location are context, not advice) */
  var ACTIONABLE = { power: 1, prot: 1, air: 1, bio: 1, min_sys: 1, n_low: 1, crew_min: 1, crew_mean: 1, conditions: 1, pending_neg: 1, couplings_active: 1 };
  var HIGHER_IS_WORSE = { n_low: 1, conditions: 1, couplings_active: 1 };
  AI.label = {
    power: ['Power is below average', 'الطاقة أقل من المتوسط'], prot: ['Protection is below average', 'الحماية أقل من المتوسط'], air: ['Air is below average', 'الهواء أقل من المتوسط'],
    bio: ['Food is below average', 'الغذاء أقل من المتوسط'], min_sys: ['Weakest system is too low', 'أضعف نظام منخفض جداً'],
    n_low: ['Several systems in the coupling zone (<40%)', 'أنظمة كثيرة في منطقة الترابط (<40%)'],
    crew_min: ['A crew member is in poor health', 'أحد أفراد الطاقم صحته ضعيفة'], crew_mean: ['Crew health is falling', 'صحة الطاقم تنخفض'],
    conditions: ['Untreated medical conditions', 'حالات طبية غير معالجة'], pending_neg: ['Delayed costs are coming', 'تكاليف مؤجلة قادمة'],
    couplings_active: ['Couplings are draining the station', 'الترابطات تستنزف المحطة']
  };

  AI.ready = function () { return !!(AI.model && AI.model.weights); };
  AI.predict = function (st) {
    if (!AI.ready()) return null;
    var m = AI.model, f = AI.features(st), z = m.intercept, contrib = [];
    Object.keys(m.weights).forEach(function (k) {
      var x = +f[k] || 0, w = m.weights[k];
      z += w * x;
      if (ACTIONABLE[k] && m.mean) {
        var worse = HIGHER_IS_WORSE[k] ? x > m.mean[k] : x < m.mean[k];   // only flag a factor that is actually in its bad direction
        if (worse) contrib.push({ k: k, c: w * (x - m.mean[k]) });
      }
    });
    var p = 1 / (1 + Math.exp(-z));
    contrib.sort(function (a, b) { return a.c - b.c; });
    return { p: p, risks: p >= 0.85 ? [] : contrib.filter(function (c) { return c.c < -0.15; }).slice(0, 2) };
  };
})(window.OT);
