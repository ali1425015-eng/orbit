/* EVENT TERMINAL — renders a crisis, its 3 decisions, the timer and the science card. */
(function (OT) {
  'use strict';
  var FX = OT.FX, $ = FX.$, esc = FX.esc, D = OT.data;
  var EV = OT.EventView = { timerId: null, t0: 0, hint: false, card: false, locked: false };
  var CAT = { eng: ['🔧', { en: 'Engineering', ar: 'هندسي' }], env: ['☀️', { en: 'Space environment', ar: 'بيئة الفضاء' }], bio: ['🌱', { en: 'Bio-systems', ar: 'أنظمة حيوية' }], human: ['🧠', { en: 'Human factors', ar: 'عوامل بشرية' }] };

  function crewChips(c) {
    var cr = c.crew || {}, out = '';
    var L = OT.lang === 'ar';
    if (cr.dose) out += '<span class="chip down" data-tip="' + (L ? 'جرعة إشعاع إضافية لكل فرد (أو لفرد السير الفضائي)' : 'Extra radiation dose per crew member (or the spacewalker)') + '">☢ +' + cr.dose + ' mSv</span>';
    if (cr.health) out += '<span class="chip ' + (cr.health > 0 ? 'up' : 'down') + '">❤️ ' + (cr.health > 0 ? '+' : '') + cr.health + '</span>';
    if (cr.stress) out += '<span class="chip ' + (cr.stress < 0 ? 'up' : 'down') + '">💭 ' + (cr.stress > 0 ? '+' : '') + cr.stress + '</span>';
    if (cr.risk) out += '<span class="chip med" data-tip="' + (L ? 'احتمال حالة طبية غداً' : 'Chance of a medical case tomorrow') + '">🩺 ' + Math.round(cr.risk.p * 100) + '%</span>';
    if (cr.eva) out += '<span class="chip info">🧑‍🚀 EVA</span>';
    if (cr.noExercise) out += '<span class="chip down">🦴 ' + (L ? 'بلا تمارين' : 'no exercise') + '</span>';
    (c.later || []).forEach(function (l) {
      Object.keys(l.eff).forEach(function (k) { var v = l.eff[k]; out += '<span class="chip ' + (v > 0 ? 'up' : 'down') + '" data-tip="' + (L ? 'أثر مؤجل' : 'Delayed effect') + '">⏳ ' + D.systems[k].icon + ' ' + (v > 0 ? '+' : '') + v + ' (+' + l.in + (L ? ' يوم' : 'd') + ')</span>'; });
    });
    if (c.kit) Object.keys(c.kit).forEach(function (k) { out += '<span class="chip med">' + D.medkit[k].icon + ' −' + c.kit[k] + '</span>'; });
    if (c.flag && c.flag.commsDown) out += '<span class="chip down">📡 ✕ ' + c.flag.commsDown + (L ? ' يوم' : 'd') + '</span>';
    return out;
  }

  EV.render = function (st, sc, onPick, resume) {
    var mode = OT.Engine.modeCfg(st), src = D.sources[sc.src] || {};
    if (!resume) { EV.hint = false; EV.card = false; }
    EV.locked = false;
    $('term-h').textContent = OT.t('incoming');
    $('terminal').classList.remove('medbay');
    var cat = CAT[sc.cat] || CAT.eng;
    $('ev-icon').textContent = cat[0];
    $('term-cat').textContent = OT.tx(cat[1]);
    $('ev-title').textContent = OT.tx(sc.title);
    $('ev-meta').innerHTML = '<span class="chip info">' + D.profiles[st.profile].icon + ' ' + esc(OT.tx(D.profiles[st.profile].name)) + '</span>' +
      '<span class="chip" data-tip="' + esc(src.title || '') + '">📚 ' + esc(src.org || '') + '</span>';
    var box = $('terminal').querySelector('.panel-b'); box.classList.remove('ev-in'); void box.offsetWidth; box.classList.add('ev-in');
    FX.type($('ev-desc'), OT.tx(sc.desc));

    // hint (Training only)
    var hb = $('hintbox'); hb.classList.add('hidden'); hb.textContent = '💡 ' + OT.tx(sc.hint);
    $('btn-hint').classList.toggle('hidden', !mode.hints);
    $('btn-hint').onclick = function () { EV.hint = true; hb.classList.remove('hidden'); };

    // choices
    $('choices').innerHTML = sc.choices.map(function (c, i) {
      var ok = OT.Engine.kitOk(st, c.kit);
      return '<button class="choice ' + (c.idle ? 'idle' : '') + '" data-i="' + i + '" ' + (ok ? '' : 'disabled') + ' data-idle="' + (OT.lang === 'ar' ? 'عند انتهاء الوقت' : 'if time runs out') + '">' +
        '<span class="k">' + (i + 1) + '</span><span><span class="ct">' + esc(OT.tx(c.t)) + '</span>' +
        '<span class="fx">' + OT.HUD.chips(OT.Engine.preview(st, c), crewChips(c)) + (ok ? '' : '<span class="chip down">' + OT.t('outOfStock') + '</span>') + '</span></span></button>';
    }).join('');
    $('choices').querySelectorAll('.choice').forEach(function (b) {
      b.onmouseenter = function () { OT.Audio.hover(); };
      b.onclick = function () { EV.pick(st, +b.getAttribute('data-i'), false, onPick); };
    });

    // science card
    $('flip').classList.remove('on');
    $('flip-front-t').textContent = OT.lang === 'ar' ? 'اقلب البطاقة' : 'Flip the card';
    $('flip-front-s').textContent = OT.lang === 'ar' ? 'الترابط والمقايضة والحقيقة الموثقة والمصدر' : 'Coupling, trade-off, verified fact and source';
    $('flip-back').innerHTML = '<h4>🔗 ' + OT.t('sysLbl') + '</h4><div>' + esc(OT.tx(sc.sys)) + '</div><h4>⚖️ ' + OT.t('tradeLbl') + '</h4><div>' + esc(OT.tx(sc.trade)) +
      '</div><h4>✅ ' + OT.t('factLbl') + '</h4><div>' + esc(OT.tx(sc.fact)) + '</div><div class="src">' + OT.t('srcLbl') + ': ' +
      (src.url ? '<a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + esc(src.org + ' — ' + src.title) + '</a>' : esc(src.org || '')) + '</div>';
    $('flip').onclick = function (e) { if (e.target.tagName === 'A') return; $('flip').classList.toggle('on'); EV.card = true; };

    // timer (a language switch resumes the same deadline instead of restarting it)
    EV.startTimer(st, sc, onPick, resume);
    if (!resume) EV.t0 = performance.now();
    if (resume && EV.hint) hb.classList.remove('hidden');
  };

  EV.startTimer = function (st, sc, onPick, resume) {
    clearInterval(EV.timerId);
    var mode = OT.Engine.modeCfg(st), secs = OT.store.get('timer', true) ? mode.timer : 0, tm = $('timer');
    if (!secs) { tm.classList.add('hidden'); return; }
    tm.classList.remove('hidden', 'urgent');
    if (!resume || !EV.deadline) EV.deadline = Date.now() + secs * 1000;
    var end = EV.deadline, arc = $('timer-arc'), C = 144.5;
    EV.timerId = setInterval(function () {
      var left = Math.max(0, (end - Date.now()) / 1000);
      $('timer-t').textContent = Math.ceil(left);
      arc.style.strokeDashoffset = (C * (1 - left / secs)).toFixed(1);
      arc.style.stroke = left < 10 ? '#ff4d6d' : left < 20 ? '#ffd23f' : '#3fd0ff';
      tm.classList.toggle('urgent', left < 10);
      if (left < 10 && Math.abs(left - Math.round(left)) < 0.06) OT.Audio.tick(true);
      if (left <= 0) {
        clearInterval(EV.timerId);
        var idx = sc.choices.findIndex(function (c) { return c.idle; }); if (idx < 0) idx = sc.choices.length - 1;
        FX.toast('⏱️ ' + OT.t('timeout'), 'bad'); EV.pick(st, idx, true, onPick);
      }
    }, 100);
  };

  EV.pick = function (st, idx, timedOut, onPick) {
    if (EV.locked) return; EV.locked = true; EV.deadline = null;
    clearInterval(EV.timerId); $('timer').classList.add('hidden');
    var btns = $('choices').querySelectorAll('.choice');
    btns.forEach(function (b, i) { b.disabled = true; if (i === idx) b.classList.add('picked'); });
    onPick(idx, { timeMs: Math.round(performance.now() - EV.t0), timedOut: timedOut, hint: EV.hint, card: EV.card });
  };

  EV.keys = function (e) {
    if (document.querySelector('.modal-bg') || $('game').classList.contains('hidden')) return;
    if (/^[1-3]$/.test(e.key)) { var b = $('choices').querySelector('[data-i="' + (+e.key - 1) + '"]'); if (b && !b.disabled) b.click(); }
    if (e.key === 'h' || e.key === 'H') $('btn-hint').click();
    if (e.key === 'f' || e.key === 'F') $('flip').click();
  };
})(window.OT);
