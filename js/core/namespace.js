/* ORBITAL TRADE-OFFS — global namespace and small helpers.
   Classic <script> files (no ES modules) so the app opens by double-clicking
   index.html, even offline and from file://. Every file adds to window.OT. */
(function (root) {
  'use strict';
  var OT = root.OT = root.OT || {};
  OT.version = '7.0.0';
  OT.data = OT.data || {};
  OT.ui = OT.ui || {};

  /* Bilingual text: T('English', 'العربية') */
  OT.T = function (en, ar) { return { en: en, ar: ar }; };

  OT.clamp = function (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };
  OT.round1 = function (v) { return Math.round(v * 10) / 10; };

  /* The four station systems (keys used everywhere) */
  OT.SYS = ['power', 'prot', 'air', 'bio'];

  /* Safe localStorage (can throw in private mode / sandboxed frames) */
  OT.store = {
    get: function (k, d) {
      try { var v = root.localStorage.getItem('ot5_' + k); return v === null ? d : JSON.parse(v); }
      catch (e) { return d; }
    },
    set: function (k, v) {
      try { root.localStorage.setItem('ot5_' + k, JSON.stringify(v)); } catch (e) { /* ignore */ }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
