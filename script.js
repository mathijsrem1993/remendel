// reMendel — menugedrag
// Opent en sluit het zijmenu. Klik op de knop, op de overlay of Escape sluit het.
(function () {
  var page = document.getElementById('page');
  var toggle = document.getElementById('menuToggle');
  var scrim = document.getElementById('scrim');
  if (!page || !toggle) return;

  function open() {
    page.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Menu sluiten');
    if (scrim) scrim.hidden = false;
  }
  function close() {
    page.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menu openen');
    if (scrim) scrim.hidden = true;
  }
  function isOpen() { return page.classList.contains('menu-open'); }

  toggle.addEventListener('click', function () { isOpen() ? close() : open(); });
  if (scrim) scrim.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) { close(); toggle.focus(); }
  });
})();
