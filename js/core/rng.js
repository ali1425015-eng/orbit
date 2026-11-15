/* Seeded random number generator (mulberry32).
   A seed makes every mission reproducible: the same seed + the same choices
   give the same mission. The seed is saved in the telemetry export so a
   researcher can replay any student's run. */
(function (OT) {
  'use strict';
  OT.makeRng = function (seed) {
    var a = seed >>> 0;
    var rng = function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    rng.pick = function (arr) { return arr[Math.floor(rng() * arr.length)]; };
    rng.shuffle = function (arr) {
      var a2 = arr.slice();
      for (var i = a2.length - 1; i > 0; i--) {
        var j = Math.floor(rng() * (i + 1)); var tmp = a2[i]; a2[i] = a2[j]; a2[j] = tmp;
      }
      return a2;
    };
    rng.range = function (lo, hi) { return lo + rng() * (hi - lo); };
    return rng;
  };
  OT.newSeed = function () { return (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0; };
})(window.OT);
