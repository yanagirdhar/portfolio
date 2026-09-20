/* Yana Girdhar — portfolio
   1. Plays the hero intro on load
   2. Adds a light pointer parallax to the hero photos once the intro has settled
   3. Keeps the dark placeholder clean if an image file is missing */

(function () {
  'use strict';

  var root = document.documentElement;
  var hero = document.querySelector('.hero');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var started = false;

  // 1. Hero intro — wait for fonts so the outline/fill text doesn't jump.
  function start() {
    if (started) return;
    started = true;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { root.classList.add('is-loaded'); });
    });
    // 2. Enable parallax after the intro transitions (~2s) have finished.
    if (!reduceMotion) {
      setTimeout(function () { root.classList.add('is-settled'); }, 2200);
    }
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
    setTimeout(start, 1200); // safety net if fonts are slow
  } else {
    window.addEventListener('load', start);
  }

  // Pointer parallax (mouse/pen only)
  if (hero && !reduceMotion) {
    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5) * 2);
      hero.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5) * 2);
    });
    hero.addEventListener('pointerleave', function () {
      hero.style.setProperty('--mx', 0);
      hero.style.setProperty('--my', 0);
    });
  }

  // 3. Missing images: hide the broken icon and keep the dark placeholder.
  document.querySelectorAll('.photo img').forEach(function (img) {
    function hide() { img.style.display = 'none'; }
    img.addEventListener('error', hide);
    if (img.complete && img.naturalWidth === 0) hide();   // already failed before this script ran
  });
})();
