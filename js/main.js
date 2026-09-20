/* Yana Girdhar — portfolio */

(function () {
  'use strict';

  var root = document.documentElement;
  var hero = document.querySelector('.hero');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var started = false;

  // 1. Hero intro — wait for fonts
  function start() {
    if (started) return;
    started = true;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { root.classList.add('is-loaded'); });
    });
    if (!reduceMotion) {
      setTimeout(function () { root.classList.add('is-settled'); }, 2200);
    }
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
    setTimeout(start, 1200);
  } else {
    window.addEventListener('load', start);
  }

  // Pointer parallax
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

  // Missing images handler
  document.querySelectorAll('.photo img').forEach(function (img) {
    function hide() { img.style.display = 'none'; }
    img.addEventListener('error', hide);
    if (img.complete && img.naturalWidth === 0) hide();
  });

  // 2. Section scroll animations
  //
  // A section's animations play only once the user has scrolled and the top of
  // that section has moved up past the trigger line. Nothing plays on page load,
  // and nothing plays while a section is still below the line.
  //
  // TRIGGER is a fraction of the viewport height, measured from the top:
  //   0.5 = when the section's top edge reaches the middle of the screen
  //   0.2 = later, when it is close to the top of the screen
  //   0.8 = earlier, as soon as it peeks in from the bottom
  var TRIGGER = 0.5;

  var pending = Array.prototype.slice.call(
    document.querySelectorAll('#about, #projects, #achievements, #experience, #extracurriculars, #contact')
  );

  function revealAll() {
    pending.forEach(function (section) { section.classList.add('is-inview'); });
    pending = [];
  }

  var ticking = false;

  function check() {
    ticking = false;
    if (window.scrollY < 10) return;              // not scrolled yet: play nothing

    var line = window.innerHeight * TRIGGER;
    pending = pending.filter(function (section) {
      if (section.getBoundingClientRect().top <= line) {
        section.classList.add('is-inview');
        return false;                             // done, stop tracking it
      }
      return true;
    });

    if (!pending.length) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(check);
    }
  }

  if (reduceMotion) {
    revealAll();
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();                                   // covers a reload part-way down the page
  }
})();
