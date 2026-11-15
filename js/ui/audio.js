/* AUDIO — all sounds are synthesised with the Web Audio API (no files, works offline). */
(function (OT) {
  'use strict';
  var ctx = null, master = null, drone = null;
  var A = OT.Audio = { vol: OT.store.get('vol', 0.5), music: OT.store.get('music', false) };

  function init() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      ctx = new AC(); master = ctx.createGain(); master.gain.value = A.vol; master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }
  function tone(f, type, dur, vol, delay, slideTo) {
    if (!init() || A.vol <= 0) return;
    var t0 = ctx.currentTime + (delay || 0), o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol || 0.15, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + dur + 0.02);
  }
  function noise(dur, vol) {
    if (!init() || A.vol <= 0) return;
    var b = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    var s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 900; g.gain.value = vol || 0.2; s.buffer = b; s.connect(f); f.connect(g); g.connect(master); s.start();
  }

  A.setVol = function (v) { A.vol = +v; OT.store.set('vol', A.vol); if (master) master.gain.value = A.vol; };
  A.click = function () { tone(880, 'square', 0.06, 0.06); };
  A.hover = function () { tone(1400, 'sine', 0.03, 0.02); };
  A.type = function () { tone(1800 + Math.random() * 400, 'square', 0.015, 0.012); };
  A.good = function () { [523, 659, 784].forEach(function (f, i) { tone(f, 'triangle', 0.18, 0.1, i * 0.08); }); };
  A.bad = function () { tone(220, 'sawtooth', 0.35, 0.12, 0, 110); noise(0.25, 0.08); };
  A.alarm = function () { [0, 0.3, 0.6].forEach(function (d) { tone(760, 'square', 0.16, 0.08, d, 520); }); };
  A.med = function () { [0, 0.18].forEach(function (d) { tone(1046, 'sine', 0.12, 0.1, d); }); };
  A.beep = function () { tone(1200, 'sine', 0.05, 0.05); };
  A.whoosh = function () { tone(180, 'sine', 0.6, 0.08, 0, 900); noise(0.5, 0.05); };
  A.win = function () { [523, 659, 784, 1046, 1318].forEach(function (f, i) { tone(f, 'triangle', 0.3, 0.12, i * 0.11); }); };
  A.lose = function () { [392, 330, 262, 196].forEach(function (f, i) { tone(f, 'sawtooth', 0.4, 0.1, i * 0.22); }); };
  A.tick = function (urgent) { tone(urgent ? 1500 : 1000, 'square', 0.03, urgent ? 0.06 : 0.03); };

  /* ambient drone: two detuned low oscillators through a slow filter sweep */
  A.setMusic = function (on) {
    A.music = on; OT.store.set('music', on);
    if (!init()) return;
    if (on && !drone) {
      var g = ctx.createGain(); g.gain.value = 0.035; var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 400;
      var lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.05; lg.gain.value = 250; lfo.connect(lg); lg.connect(f.frequency); lfo.start();
      var os = [55, 55.4, 82.5].map(function (fr) { var o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = fr; o.connect(f); o.start(); return o; });
      f.connect(g); g.connect(master); drone = { os: os, lfo: lfo, g: g };
    } else if (!on && drone) { drone.os.forEach(function (o) { o.stop(); }); drone.lfo.stop(); drone = null; }
  };
  A.unlock = function () { init(); if (A.music && !drone) A.setMusic(true); };
})(window.OT);
