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

  // 2. Scroll animations
  //
  // Nothing plays until the page has been scrolled.
  //  - Desktop: each 1440 x 768 slide plays when its top edge passes the middle
  //    of the screen (TRIGGER).
  //  - Phones/tablets: a section is taller than the screen, so each animated
  //    element plays on its own as it scrolls into view (TRIGGER_EL). Otherwise
  //    the lower cards would animate off-screen before you reach them.
  //
  // Both triggers are fractions of the viewport height, measured from the top:
  // a smaller number plays later, a bigger one plays earlier.
  var TRIGGER = 0.5;
  var TRIGGER_EL = 0.88;

  var phone = window.matchMedia('(max-width: 991.98px)');
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('#about, #projects, #achievements, #experience, #extracurriculars, #contact')
  );
  var elements = Array.prototype.slice.call(document.querySelectorAll('[class*="anim-"]'));

  function revealAll() {
    sections.concat(elements).forEach(function (el) { el.classList.add('is-inview'); });
    sections = [];
    elements = [];
  }

  var ticking = false;

  function reveal(list, line) {
    return list.filter(function (el) {
      if (el.getBoundingClientRect().top <= line) {
        el.classList.add('is-inview');
        return false;                             // done, stop tracking it
      }
      return true;
    });
  }

  function check() {
    ticking = false;
    if (window.scrollY < 10) return;              // not scrolled yet: play nothing

    var vh = window.innerHeight;
    if (phone.matches) elements = reveal(elements, vh * TRIGGER_EL);
    else sections = reveal(sections, vh * TRIGGER);
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
