/* ============================================================
   COMMON — script yang dipakai semua halaman
   ============================================================ */

/* ---------------- mobile menu ---------------- */
(function () {
  var btn = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  var iconMenu = document.getElementById('icon-menu');
  var iconClose = document.getElementById('icon-close');
  if (!btn || !menu) return;

  function setOpen(open) {
    menu.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    iconMenu.style.display = open ? 'none' : '';
    iconClose.style.display = open ? '' : 'none';
  }
  btn.addEventListener('click', function () { setOpen(!menu.classList.contains('is-open')); });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
})();
