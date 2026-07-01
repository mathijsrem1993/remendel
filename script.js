// reMendel — menugedrag
// Opent en sluit het zijmenu. Klik op de knop, op de overlay of Escape sluit het.
// De fade gebeurt in CSS (via de klasse menu-open); hier zetten we alleen die klasse.
(function () {
  var page = document.getElementById('page');
  var toggle = document.getElementById('menuToggle');
  var scrim = document.getElementById('scrim');
  if (!page || !toggle) return;

  function open() {
    page.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Menu sluiten');
  }
  function close() {
    page.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menu openen');
  }
  function isOpen() { return page.classList.contains('menu-open'); }

  toggle.addEventListener('click', function () { isOpen() ? close() : open(); });
  if (scrim) scrim.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) { close(); toggle.focus(); }
  });
})();
