/* VISUAL EFFECTS & small UI helpers: starfield, ripple, flash, shake, toasts,
   tooltips, floating numbers, confetti, day transition, typewriter text. */
(function (OT) {
  'use strict';
  var FX = OT.FX = {};
  FX.$ = function (id) { return document.getElementById(id); };
  FX.h = function (html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; };
  FX.esc = function (s) { return String(s === undefined ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  FX.reduced = function () { return document.documentElement.classList.contains('reduce-motion') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };

  /* ---------- starfield (parallax, twinkle, rare shooting star) ---------- */
  FX.stars = function () {
    var c = FX.$('stars'), g = c.getContext('2d'), stars = [], w, h, shoot = null;
    function size() { w = c.width = innerWidth; h = c.height = innerHeight; stars = []; for (var i = 0; i < Math.min(260, w * h / 5000); i++) stars.push({ x: Math.random() * w, y: Math.random() * h, z: Math.random() * 1.6 + .2, p: Math.random() * 6.28 }); }
    size(); addEventListener('resize', size);
    (function loop(t) {
      g.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i]; if (!FX.reduced()) { s.y += s.z * 0.06; if (s.y > h) s.y = 0; }
        g.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(s.p + t / 1400 * s.z)); g.fillStyle = '#fff'; g.fillRect(s.x, s.y, s.z, s.z);
      }
      if (!shoot && Math.random() < 0.002 && !FX.reduced()) shoot = { x: Math.random() * w, y: Math.random() * h * 0.4, l: 0 };
      if (shoot) { g.globalAlpha = 1 - shoot.l / 60; g.strokeStyle = '#9fe8ff'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(shoot.x, shoot.y); g.lineTo(shoot.x - 60, shoot.y - 25); g.stroke(); shoot.x += 9; shoot.y += 4; if (++shoot.l > 60) shoot = null; }
      g.globalAlpha = 1; requestAnimationFrame(loop);
    })(0);
  };

  /* ---------- button ripple + click sound (event delegation) ---------- */
  FX.bindRipple = function () {
    document.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('.btn, .choice, .mode-card, .tool, .opt'); if (!b || b.disabled) return;
      OT.Audio.unlock(); OT.Audio.click();
      if (FX.reduced()) return;
      var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), sp = document.createElement('span');
      sp.className = 'ripple'; sp.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
      if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
      b.appendChild(sp); setTimeout(function () { sp.remove(); }, 600);
    });
  };

  FX.flash = function (kind) { var f = FX.$('flash'); f.className = ''; void f.offsetWidth; f.className = kind; };
  FX.shake = function (el) { el = el || document.body; if (FX.reduced()) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); };

  FX.toast = function (html, kind, ms) {
    var t = FX.h('<div class="toast ' + (kind || '') + '">' + html + '</div>'); FX.$('toasts').appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 300); }, ms || 3600);
  };

  /* ---------- tooltips: any element with data-tip (html) ---------- */
  FX.bindTips = function () {
    var tip = FX.$('tip');
    document.addEventListener('mouseover', function (e) {
      var el = e.target.closest('[data-tip],[data-tip-k]'); if (!el) return;
      tip.innerHTML = el.getAttribute('data-tip') || OT.t(el.getAttribute('data-tip-k'));
      var r = el.getBoundingClientRect(); tip.classList.add('on');
      var tw = tip.offsetWidth, th = tip.offsetHeight;
      var x = Math.min(innerWidth - tw - 8, Math.max(8, r.left + r.width / 2 - tw / 2)), y = r.bottom + 8;
      if (y + th > innerHeight) y = r.top - th - 8;
      tip.style.left = x + 'px'; tip.style.top = y + 'px';
    });
    document.addEventListener('mouseout', function (e) { if (e.target.closest('[data-tip],[data-tip-k]')) tip.classList.remove('on'); });
  };

  /* ---------- floating +/- number over a resource card ---------- */
  FX.floatNum = function (el, v) {
    if (!el || !v) return;
    var s = document.createElement('span'); s.className = 'delta-float ' + (v > 0 ? 'up' : 'down'); s.textContent = (v > 0 ? '+' : '') + v;
    el.appendChild(s); setTimeout(function () { s.remove(); }, 1700);
  };

  /* ---------- confetti / sparks on a full-screen canvas ---------- */
  FX.confetti = function (n, colors) {
    if (FX.reduced()) return;
    var c = FX.$('fx'), g = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
    colors = colors || ['#3fd0ff', '#3dff8f', '#ffd23f', '#b388ff', '#ff6b9a'];
    var ps = []; for (var i = 0; i < (n || 160); i++) ps.push({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - .5) * 16, vy: Math.random() * -14 - 2, s: Math.random() * 6 + 3, c: colors[i % colors.length], r: Math.random() * 6 });
    var f = 0;
    (function loop() {
      g.clearRect(0, 0, c.width, c.height);
      ps.forEach(function (p) { p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.r += 0.2; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); });
      if (++f < 140) requestAnimationFrame(loop); else g.clearRect(0, 0, c.width, c.height);
    })();
  };

  /* ---------- day transition ---------- */
  FX.dayWipe = function (big, small, cb) {
    var w = FX.$('daywipe'); FX.$('dw-d').textContent = big; FX.$('dw-s').textContent = small || '';
    var sc = w.querySelector('.scan'); sc.style.animation = 'none'; void sc.offsetWidth; sc.style.animation = '';
    w.classList.add('on'); OT.Audio.whoosh();
    setTimeout(function () { if (cb) cb(); }, 650);
    setTimeout(function () { w.classList.remove('on'); }, FX.reduced() ? 400 : 1300);
  };

  /* ---------- typewriter (skippable by click) ---------- */
  FX.typeTimer = null;
  FX.type = function (el, text, done) {
    clearInterval(FX.typeTimer);
    if (FX.reduced()) { el.textContent = text; if (done) done(); return; }
    var i = 0; el.innerHTML = '<span></span><i class="caret"></i>'; var sp = el.firstChild;
    var finish = function () { clearInterval(FX.typeTimer); sp.textContent = text; var c = el.querySelector('.caret'); if (c) c.remove(); el.onclick = null; if (done) done(); };
    el.onclick = finish;
    FX.typeTimer = setInterval(function () { i += 2; sp.textContent = text.slice(0, i); if (i % 6 === 0) OT.Audio.type(); if (i >= text.length) finish(); }, 16);
  };

  /* ---------- modal helper ---------- */
  FX.modal = function (html, cls) {
    var root = FX.$('modal-root'); var bg = FX.h('<div class="modal-bg"><div class="panel modal ' + (cls || '') + '">' + html + '</div></div>');
    root.appendChild(bg); return bg;
  };
  FX.closeModals = function () { FX.$('modal-root').innerHTML = ''; };
})(window.OT);
