// ============================================================================
// Keuzemenu (niveau -> klas -> onderwerp -> weergave)
// ============================================================================
// Deze logica is gedeeld door de pagina's Oefenmateriaal en Toetsanalyse.
// De inhoud komt uit een apart databestand dat vóór dit bestand wordt geladen
// en de variabelen KEUZE_DATA (de lijst) en KEUZE_LEEG (tekst bij lege klas)
// beschikbaar maakt. Aan dit bestand hoef je niets te wijzigen.
// ----------------------------------------------------------------------------
(function () {
  var grid = document.getElementById("oefGrid");
  var viewer = document.getElementById("oefViewer");
  var viewerTitel = document.getElementById("oefViewerTitel");
  var viewerFrame = document.getElementById("oefViewerFrame");
  var viewerSluit = document.getElementById("oefViewerSluit");
  if (!grid || typeof KEUZE_DATA === "undefined") return;

  var leegTekst = (typeof KEUZE_LEEG !== "undefined")
    ? KEUZE_LEEG
    : "Nog niets beschikbaar. Dit vullen we aan zodra er iets klaarstaat.";
  var actiefItem = null;

  function sluit(el) {
    el.classList.remove("open");
    // Een niveau en een klas hebben een .oef-kop; de versiestap gebruikt een
    // .oef-item als knop, met dezelfde aria-expanded erop.
    var kop = el.querySelector(":scope > .oef-kop, :scope > .oef-item[aria-expanded]");
    if (kop) kop.setAttribute("aria-expanded", "false");
  }

  function sluitAlles() {
    var open = grid.querySelectorAll(".oef-niveau.open, .oef-klas.open, .oef-versies.open");
    for (var i = 0; i < open.length; i++) sluit(open[i]);
  }

  function maakKop(label, klasse, groepSelector) {
    var btn = document.createElement("button");
    btn.className = "oef-kop";
    btn.type = "button";
    btn.setAttribute("aria-expanded", "false");
    var tekst = document.createElement("span");
    tekst.textContent = label;
    var caret = document.createElement("span");
    caret.className = "caret";
    caret.setAttribute("aria-hidden", "true");
    caret.textContent = "\u25B8"; // driehoekje
    btn.appendChild(tekst);
    btn.appendChild(caret);
    btn.addEventListener("click", function () {
      var gaatOpen = !klasse.classList.contains("open");
      if (gaatOpen && groepSelector) {
        // Broertjes op hetzelfde niveau sluiten: klik op VWO sluit HAVO, enz.
        var broers = klasse.parentNode.querySelectorAll(":scope > " + groepSelector + ".open");
        for (var i = 0; i < broers.length; i++) {
          if (broers[i] !== klasse) sluit(broers[i]);
        }
      }
      klasse.classList.toggle("open", gaatOpen);
      btn.setAttribute("aria-expanded", gaatOpen ? "true" : "false");
    });
    return btn;
  }

  // Heeft de leerling in de geopende weergave al punten ingevuld? De
  // feedbacktool zet daarvoor window.heeftIngevuldePunten klaar. Staat er iets
  // anders in het venster, of blokkeert de browser de toegang, dan gaan we er
  // vanuit dat er niets is ingevuld en vragen we niets.
  function frameHeeftInvoer() {
    try {
      const w = viewerFrame.contentWindow;
      return !!(w && typeof w.heeftIngevuldePunten === "function" && w.heeftIngevuldePunten());
    } catch (e) { return false; }
  }

  function toonItem(item, knop) {
    // Nogmaals op dezelfde knop klikken mag de weergave niet herladen: dat zou
    // de ingevulde punten wissen zonder dat er iets verandert.
    if (actiefItem === knop && viewerFrame.getAttribute("src") === item.bron) {
      viewer.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // Van versie wisselen laadt de weergave wél opnieuw en wist dus de
    // ingevulde punten. Dat mag, maar niet zonder het te vragen.
    if (actiefItem && actiefItem !== knop && frameHeeftInvoer() &&
        !window.confirm("Je hebt al punten ingevuld. Als je een andere versie kiest, worden die gewist en begin je opnieuw.\n\nWil je doorgaan?")) {
      return;
    }
    if (actiefItem) actiefItem.classList.remove("actief");
    knop.classList.add("actief");
    actiefItem = knop;
    viewerTitel.textContent = item.titel;
    viewerFrame.src = item.bron;
    viewer.hidden = false;
    viewer.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Een gewone toets: één knop die de weergave opent.
  function maakEnkelItem(item) {
    var b = document.createElement("button");
    b.className = "oef-item";
    b.type = "button";
    b.textContent = item.titel;
    b.addEventListener("click", function () { toonItem(item, b); });
    return b;
  }

  // Een toets die in meerdere versies is afgenomen. De toets staat als één
  // regel in de lijst; daaronder klapt de versiekeuze uit, met de
  // herkenpunten erboven zodat de leerling weet welke versie hij had.
  function maakVersieItem(item) {
    var wrap = document.createElement("div");
    wrap.className = "oef-versies";

    var kop = document.createElement("button");
    kop.className = "oef-item";
    kop.type = "button";
    kop.setAttribute("aria-expanded", "false");
    var tekst = document.createElement("span");
    tekst.textContent = item.titel;
    var caret = document.createElement("span");
    caret.className = "caret";
    caret.setAttribute("aria-hidden", "true");
    caret.textContent = "\u25B8";
    kop.appendChild(tekst);
    kop.appendChild(caret);
    kop.addEventListener("click", function () {
      var gaatOpen = !wrap.classList.contains("open");
      wrap.classList.toggle("open", gaatOpen);
      kop.setAttribute("aria-expanded", gaatOpen ? "true" : "false");
    });
    wrap.appendChild(kop);

    var uit = document.createElement("div");
    uit.className = "oef-uitklap";
    var lijst = document.createElement("div");
    lijst.className = "oef-versie-lijst";

    if (item.herkenning) {
      var hint = document.createElement("p");
      hint.className = "oef-herkenning";
      hint.textContent = item.herkenning;
      lijst.appendChild(hint);
    }

    item.versies.forEach(function (versie) {
      var vb = document.createElement("button");
      vb.className = "oef-item";
      vb.type = "button";
      vb.textContent = versie.label;
      // De titel boven de weergave noemt de toets én de versie.
      var doel = { titel: item.titel + " — " + versie.label, bron: versie.bron };
      vb.addEventListener("click", function () { toonItem(doel, vb); });
      lijst.appendChild(vb);
    });

    uit.appendChild(lijst);
    wrap.appendChild(uit);
    return wrap;
  }

  function sluitItem() {
    viewer.hidden = true;
    viewerFrame.removeAttribute("src");
    if (actiefItem) { actiefItem.classList.remove("actief"); actiefItem = null; }
  }

  KEUZE_DATA.forEach(function (niveau) {
    var kolom = document.createElement("div");
    kolom.className = "oef-niveau";
    kolom.appendChild(maakKop(niveau.niveau, kolom, ".oef-niveau"));

    var uit = document.createElement("div");
    uit.className = "oef-uitklap";
    var klassenWrap = document.createElement("div");
    klassenWrap.className = "oef-klassen";

    niveau.klassen.forEach(function (klas) {
      var klasEl = document.createElement("div");
      klasEl.className = "oef-klas";
      klasEl.appendChild(maakKop(klas.naam, klasEl, ".oef-klas"));

      var klasUit = document.createElement("div");
      klasUit.className = "oef-uitklap";
      var items = document.createElement("div");
      items.className = "oef-items";

      if (klas.items && klas.items.length) {
        klas.items.forEach(function (item) {
          if (item.versies && item.versies.length) { items.appendChild(maakVersieItem(item)); }
          else { items.appendChild(maakEnkelItem(item)); }
        });
      } else {
        var leeg = document.createElement("p");
        leeg.className = "oef-leeg";
        leeg.textContent = leegTekst;
        items.appendChild(leeg);
      }

      klasUit.appendChild(items);
      klasEl.appendChild(klasUit);
      klassenWrap.appendChild(klasEl);
    });

    uit.appendChild(klassenWrap);
    kolom.appendChild(uit);
    grid.appendChild(kolom);
  });

  if (viewerSluit) viewerSluit.addEventListener("click", sluitItem);

  // Klik buiten het keuzemenu (waar dan ook op de pagina) sluit alle open menu's.
  document.addEventListener("click", function (e) {
    if (grid.contains(e.target)) return;
    sluitAlles();
  });
})();
