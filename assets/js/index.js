/* ============================================================
   INDEX — script khusus halaman utama (index.html)
   Isi: konfirmasi peta, slider galeri, reveal saat scroll,
        dropdown keunggulan
   ============================================================ */

/* ---------------- peta: konfirmasi sebelum datang ---------------- */
(function () {
  var dlg = document.getElementById('visit-notice');
  var openBtn = document.getElementById('map-open');
  if (!dlg || !openBtn) return;

  function show() {
    if (typeof dlg.showModal === 'function') { dlg.showModal(); }
    else { dlg.setAttribute('open', ''); }
  }
  function hide() {
    if (typeof dlg.close === 'function' && dlg.open) { dlg.close(); }
    else { dlg.removeAttribute('open'); }
  }

  openBtn.addEventListener('click', show);
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) hide();
    if (e.target.closest && e.target.closest('[data-close]')) hide();
  });
})();

/* ---------------- galeri: slide horizontal ---------------- */
(function () {
  var viewport = document.querySelector('[data-gal-viewport]');
  if (!viewport) return;

  var scroller = viewport.querySelector('[data-gal-scroller]');
  var cards = Array.prototype.slice.call(scroller.querySelectorAll('.gal-card'));
  var prev = document.querySelector('[data-gal-prev]');
  var next = document.querySelector('[data-gal-next]');
  var fillEl = document.querySelector('[data-gal-fill]');
  var curEl = document.querySelector('[data-gal-current]');
  var totEl = document.querySelector('[data-gal-total]');
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var smooth = reduce ? 'auto' : 'smooth';

  totEl.textContent = pad(cards.length);

  function metrics() {
    var gap = parseFloat(getComputedStyle(scroller).columnGap || '20') || 20;
    return { step: cards[0].getBoundingClientRect().width + gap };
  }
  function maxScroll() { return scroller.scrollWidth - scroller.clientWidth; }

  var ticking = false;
  function sync() {
    ticking = false;
    var max = maxScroll();
    var atEnd = scroller.scrollLeft >= max - 2;

    /* kartu yang terlihat minimal 50% -> "01-03 / 07" */
    var box = scroller.getBoundingClientRect();
    var first = cards.length - 1;
    var last = 0;
    cards.forEach(function (c, i) {
      var b = c.getBoundingClientRect();
      var overlap = Math.min(b.right, box.right) - Math.max(b.left, box.left);
      if (overlap > b.width * 0.5) {
        first = Math.min(first, i);
        last = Math.max(last, i);
      }
    });
    curEl.textContent = first === last
      ? pad(first + 1)
      : pad(first + 1) + '\u2013' + pad(last + 1);

    var p = max > 0 ? Math.min(1, Math.max(0.08, scroller.scrollLeft / max)) : 1;
    fillEl.style.transform = 'scaleX(' + p.toFixed(4) + ')';

    prev.disabled = scroller.scrollLeft <= 2;
    next.disabled = atEnd;
    viewport.classList.toggle('is-end', atEnd);
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(sync); }
  }
  scroller.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', sync);
  if ('ResizeObserver' in window) {
    new ResizeObserver(function () { sync(); }).observe(scroller);
  }

  function go(dir) {
    scroller.scrollBy({ left: dir * metrics().step, behavior: smooth });
  }
  prev.addEventListener('click', function () { go(-1); });
  next.addEventListener('click', function () { go(1); });

  scroller.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });

  var down = false, startX = 0, startLeft = 0, moved = 0;
  scroller.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse') return;
    down = true; moved = 0;
    startX = e.clientX; startLeft = scroller.scrollLeft;
    viewport.classList.add('is-dragging');
    scroller.setPointerCapture(e.pointerId);
  });
  scroller.addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    scroller.scrollLeft = startLeft - dx;
  });
  function endDrag(e) {
    if (!down) return;
    down = false;
    viewport.classList.remove('is-dragging');
    if (scroller.hasPointerCapture && scroller.hasPointerCapture(e.pointerId)) {
      scroller.releasePointerCapture(e.pointerId);
    }
    var step = metrics().step;
    var target = Math.round(scroller.scrollLeft / step) * step;
    scroller.scrollTo({ left: Math.min(target, maxScroll()), behavior: smooth });
  }
  scroller.addEventListener('pointerup', endDrag);
  scroller.addEventListener('pointercancel', endDrag);
  scroller.addEventListener('click', function (e) { if (moved > 6) e.preventDefault(); }, true);

  sync();
})();

/* ---------------- reveal saat discroll ---------------- */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(els, function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  var groups = new Map();
  Array.prototype.forEach.call(els, function (el) {
    var parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, {});
    var tops = groups.get(parent);
    if (!tops[el.offsetTop]) tops[el.offsetTop] = 0;
    el.style.transitionDelay = tops[el.offsetTop] * 80 + 'ms';
    tops[el.offsetTop]++;
    io.observe(el);
  });
})();

// Keunggulan: dropdown alasan
(function () {
  var toggles = Array.prototype.slice.call(document.querySelectorAll('.trust-toggle'));
  if (!toggles.length) return;
  var panels = Array.prototype.slice.call(document.querySelectorAll('.trust-panel'));

  function closeAll(except) {
    toggles.forEach(function (btn) {
      if (btn !== except) btn.setAttribute('aria-expanded', 'false');
    });
    panels.forEach(function (panel) {
      if (except && panel.id === except.getAttribute('aria-controls')) return;
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
    });
  }

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      closeAll(null);
      if (open) return;
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', 'true');
      if (panel) {
        panel.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll(null);
  });
})();
