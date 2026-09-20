/* Yana Girdhar — portfolio: projects / achievements listing pages */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Missing images handler (same as main.js)
  document.querySelectorAll('.photo img').forEach(function (img) {
    function hide() { img.style.display = 'none'; }
    img.addEventListener('error', hide);
    if (img.complete && img.naturalWidth === 0) hide();
  });

  // Reveal each row as it scrolls into view
  var rows = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    rows.forEach(function (row) { row.classList.add('is-inview'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    var n = 0;                                    // stagger rows that appear together
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.style.transitionDelay = (n++ * 120) + 'ms';
      entry.target.classList.add('is-inview');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

  rows.forEach(function (row) { observer.observe(row); });
})();
