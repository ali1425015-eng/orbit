/* MEDICAL BAY — examine → diagnose → treat, with a live ECG monitor. */
(function (OT) {
  'use strict';
  var FX = OT.FX, $ = FX.$, esc = FX.esc, D = OT.data, E = OT.Engine;
  var MB = OT.MedBay = { raf: null };

  function ecg(canvas, hr, spo2) {
    var g = canvas.getContext('2d'), W = canvas.width = canvas.offsetWidth * 2, H = canvas.height = 140, x = 0, t = 0, last = -1;
    g.lineWidth = 3; g.lineCap = 'round';
    var beat = 60 / hr;
    function v(tt) { // PQRST
      var p = (tt % beat) / beat;
      if (p < .08) return Math.sin(p / .08 * Math.PI) * .12;
      if (p > .16 && p < .19) return -.15;
      if (p >= .19 && p < .22) return 1;
      if (p >= .22 && p < .25) return -.3;
      if (p > .38 && p < .52) return Math.sin((p - .38) / .14 * Math.PI) * .25;
      return 0;
    }
    var prevY = H / 2;
    (function loop() {
      for (var s = 0; s < 3; s++) {
        t += 1 / 120; x = (x + 2) % W;
        var y = H * .55 - v(t) * H * .4;
        g.clearRect(x, 0, 14, H);
        g.strokeStyle = spo2 < 90 ? '#ff4d6d' : '#3dff8f';
        g.beginPath(); g.moveTo(x - 2 < 0 ? 0 : x - 2, prevY); g.lineTo(x, y); g.stroke(); prevY = y;
        var beatN = Math.floor(t / beat); if (beatN !== last) { last = beatN; if (OT.store.get('ecgbeep', true)) OT.Audio.beep(); }
      }
      MB.raf = requestAnimationFrame(loop);
    })();
  }

  MB.open = function (st, inst, onDone) {
    var mc = E.caseById(inst.caseId), crew = D.crew[inst.crewIdx], L = OT.lang;
    var dxSel = null, phase = 1, t0 = performance.now();
    OT.Audio.med();
    var bg = FX.modal(
      '<div class="panel-h"><span>🩺 ' + OT.t('medTitle') + ' — ' + OT.t('medAlert') + '</span><span class="tag">' + esc(D.sources[mc.src].org) + '</span></div>' +
      '<div class="panel-b"><div class="med-grid">' +
        '<div><div class="row"><div class="avatar">' + crew.flag + '</div><div><b>' + esc(OT.tx(crew.name)) + '</b><div class="small muted">' + esc(OT.tx(crew.role)) + '</div></div></div>' +
        '<div class="monitor" style="margin-top:10px"><div class="tiny" style="color:#6fd8a0">ECG · II</div><canvas id="ecg"></canvas><div class="vit" id="vit"></div></div>' +
        '<div class="small muted" style="margin-top:8px">' + (L === 'ar' ? 'محتوى تعليمي مبسط، ليس إرشاداً طبياً.' : 'Simplified educational content, not clinical guidance.') + '</div></div>' +
        '<div><h3 style="margin-bottom:6px">' + esc(OT.tx(mc.title)) + '</h3><p class="muted" style="margin-top:0">' + esc(OT.tx(mc.complaint)) + '</p>' +
        '<div class="steps" id="steps"><span class="on">' + OT.t('step1') + '</span><span>' + OT.t('step2') + '</span><span>' + OT.t('step3') + '</span></div>' +
        '<div id="medbody"></div></div>' +
      '</div></div>', 'wide medbay');
    var v = E.vitals(st, inst.crewIdx, inst);
    var vc = function (bad, warn) { return bad ? 'bad' : warn ? 'warn' : ''; };
    $('vit').innerHTML = '<div class="' + vc(v.hr > 110, v.hr > 95) + '"><span>HR bpm</span><b>' + v.hr + '</b></div><div class="' + vc(v.spo2 < 90, v.spo2 < 94) + '"><span>SpO₂ %</span><b>' + v.spo2 + '</b></div>' +
      '<div class="' + vc(v.sbp > 150, v.sbp > 135) + '"><span>BP sys</span><b>' + v.sbp + '</b></div><div class="' + vc(v.temp >= 38, v.temp >= 37.5) + '"><span>T °C</span><b>' + v.temp + '</b></div>' +
      '<div class="' + vc(v.rr > 24, v.rr > 20) + '"><span>RR /min</span><b>' + v.rr + '</b></div><div><span>☢ mSv</span><b>' + st.crew[inst.crewIdx].dose.toFixed(1) + '</b></div>';
    ecg($('ecg'), v.hr, v.spo2);

    function steps() { $('steps').querySelectorAll('span').forEach(function (s, i) { s.className = i + 1 < phase ? 'done' : i + 1 === phase ? 'on' : ''; }); }

    function renderExam() {
      var tools = Object.keys(D.tools).filter(function (k) { return k !== 'vitals'; });
      $('medbody').innerHTML = '<div class="tag" style="margin-bottom:6px">' + OT.t('tools') + '</div><div class="tools">' + tools.map(function (k) {
        var t = D.tools[k], av = E.toolAvailable(st, k), used = inst.tools.indexOf(k) >= 0;
        var cost = Object.keys(t.cost || {}).map(function (c) { return D.systems[c].icon + t.cost[c] + '%'; }).concat(Object.keys(t.kit || {}).map(function (c) { return D.medkit[c].icon + '−' + t.kit[c]; })).join(' ') || (L === 'ar' ? 'مجاني' : 'free');
        return '<button class="tool ' + (used ? 'used' : '') + '" data-t="' + k + '" ' + (av.ok && !used ? '' : 'disabled') + (t.info ? ' data-tip="' + esc(OT.tx(t.info)) + '"' : '') + '><div class="tn">' + t.icon + ' ' + esc(OT.tx(t.name)) + '</div><div class="tc">' +
          (used ? '✓ ' + OT.t('used') : !av.ok ? (av.why === 'comms' ? '📡 ' + OT.t('commsDown') : OT.t('outOfStock')) : OT.t('cost') + ': ' + cost) + '</div></button>';
      }).join('') + '</div><div class="findings" id="findings">' + inst.tools.map(function (k) { return '<div class="finding"><b>' + D.tools[k].icon + ' ' + esc(OT.tx(D.tools[k].name)) + ':</b> ' + esc(OT.tx(mc.findings[k])) + '</div>'; }).join('') + '</div>' +
        '<div class="row" style="margin-top:12px;justify-content:flex-end"><button class="btn primary" id="to-dx">' + OT.t('next') + ' → ' + OT.t('diagnosis') + '</button></div>';
      $('medbody').querySelectorAll('.tool').forEach(function (b) {
        b.onclick = function () { var r = E.useTool(st, inst, b.getAttribute('data-t')); if (r && r.ok) { OT.Audio.beep(); OT.HUD.all(st); renderExam(); } };
      });
      $('to-dx').onclick = function () { phase = 2; steps(); renderDx(); };
    }
    function renderDx() {
      var order = st.rng.shuffle(mc.dx.map(function (d, i) { return i; }));
      $('medbody').innerHTML = '<div class="tag" style="margin-bottom:6px">' + OT.t('diagnosis') + '</div><div class="opts">' + order.map(function (i) {
        return '<button class="opt" data-d="' + i + '">' + esc(OT.tx(mc.dx[i].t)) + '</button>'; }).join('') + '</div>' +
        '<div class="findings">' + inst.tools.map(function (k) { return '<div class="finding small"><b>' + D.tools[k].icon + '</b> ' + esc(OT.tx(mc.findings[k])) + '</div>'; }).join('') + '</div>' +
        '<div class="row" style="margin-top:12px;justify-content:space-between"><button class="btn ghost" id="back-ex">← ' + OT.t('step1') + '</button><button class="btn primary" id="to-tx" disabled>' + OT.t('next') + ' → ' + OT.t('treatment') + '</button></div>';
      $('medbody').querySelectorAll('.opt').forEach(function (b) { b.onclick = function () { dxSel = +b.getAttribute('data-d'); $('medbody').querySelectorAll('.opt').forEach(function (x) { x.classList.toggle('sel', x === b); }); $('to-tx').disabled = false; }; });
      $('back-ex').onclick = function () { phase = 1; steps(); renderExam(); };
      $('to-tx').onclick = function () { phase = 3; steps(); renderTx(); };
    }
    function renderTx() {
      $('medbody').innerHTML = '<div class="tag" style="margin-bottom:6px">' + OT.t('treatment') + '</div><div class="opts">' + mc.tx.map(function (t, i) {
        var ok = E.kitOk(st, t.kit);
        var kit = Object.keys(t.kit || {}).map(function (k) { return '<span class="chip med">' + D.medkit[k].icon + ' −' + t.kit[k] + ' (' + (st.kit[k] || 0) + ')</span>'; }).join('');
        return '<button class="opt" data-x="' + i + '" ' + (ok ? '' : 'disabled') + '><div>' + esc(OT.tx(t.t)) + '</div><div class="row wrap" style="margin-top:4px;gap:4px">' + kit + OT.HUD.chips(t.eff || {}) + (ok ? '' : '<span class="chip down">' + OT.t('outOfStock') + '</span>') + '</div></button>';
      }).join('') + '</div>';
      $('medbody').querySelectorAll('.opt').forEach(function (b) { b.onclick = function () { finish(+b.getAttribute('data-x')); }; });
    }
    function finish(txIdx) {
      inst.timeMs = Math.round(performance.now() - t0);
      var res = E.resolveCase(st, inst, dxSel, txIdx);
      OT.Telemetry.medical(st, inst, res);
      var cls = res.q === 2 ? 'good' : res.q === 1 ? 'mid' : 'bad';
      if (res.q === 2 && res.dxOk) { OT.Audio.good(); FX.flash('green'); } else if (res.q === 0) { OT.Audio.bad(); FX.flash('red'); }
      var src = D.sources[mc.src];
      $('medbody').innerHTML = '<div class="outcome ' + cls + '"><b>' + (res.dxOk ? '✅ ' + OT.t('dxRight') : '❌ ' + OT.t('dxWrong') + ': ' + esc(OT.tx(mc.dx.filter(function (d) { return d.ok; })[0].t))) + '</b><br><b>' +
        (res.q === 2 ? '💚 ' + OT.t('txBest') : res.q === 1 ? '🟡 ' + OT.t('txOk') : '🔴 ' + OT.t('txBad')) + '</b>' +
        '<p><b>' + OT.t('whyLbl') + '</b> ' + esc(OT.tx(mc.explain)) + '</p><p><b>' + OT.t('preventLbl') + ':</b> ' + esc(OT.tx(mc.prevent)) + '</p><p><b>🌍 ' + OT.t('earthLbl') + ':</b> ' + esc(OT.tx(mc.earth)) + '</p>' +
        '<p class="small"><b>✅ ' + OT.t('factLbl') + ':</b> ' + esc(OT.tx(mc.fact)) + '<br><span class="muted">' + OT.t('srcLbl') + ': <a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + esc(src.org + ' — ' + src.title) + '</a></span></p></div>' +
        '<div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn primary" id="med-done">' + OT.t('continueBtn') + '</button></div>';
      OT.HUD.all(st);
      $('med-done').onclick = function () { cancelAnimationFrame(MB.raf); bg.remove(); onDone(res); };
    }
    renderExam();
  };
})(window.OT);
