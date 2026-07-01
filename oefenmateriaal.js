// ============================================================================
// Oefenmateriaal
// ============================================================================
// Al het oefenmateriaal staat in de lijst hieronder. Wil je iets toevoegen?
// Zet dan bij de juiste klas een regel tussen de blokhaken [ ] bij, zo:
//
//     { titel: "Naam die de leerling ziet", bron: "oefenmateriaal/mijn-spel.html" }
//
// "bron" is het pad naar het HTML-bestand van het materiaal (in deze repo),
// of een volledige https-link naar een spel dat ergens anders online staat.
// De pagina bouwt de menu's en de weergave verder vanzelf op.
// ----------------------------------------------------------------------------

const OEFENMATERIAAL = [
  {
    niveau: "MAVO",
    klassen: [
      { naam: "3 MAVO", items: [] },
      { naam: "4 MAVO", items: [] }
    ]
  },
  {
    niveau: "HAVO",
    klassen: [
      { naam: "4 HAVO eco", items: [
        // Voorbeeld zodat je ziet hoe een ingevuld item werkt. Verwijder gerust.
        { titel: "Voorbeeld (zo werkt het)", bron: "oefenmateriaal/voorbeeld.html" }
      ] }
    ]
  },
  {
    niveau: "VWO",
    klassen: [
      { naam: "4 VWO beco", items: [] }
    ]
  }
];

// ----------------------------------------------------------------------------
// Vanaf hier hoef je niets meer aan te passen.
// ----------------------------------------------------------------------------
(function () {
  var grid = document.getElementById("oefGrid");
  var viewer = document.getElementById("oefViewer");
  var viewerTitel = document.getElementById("oefViewerTitel");
  var viewerFrame = document.getElementById("oefViewerFrame");
  var viewerSluit = document.getElementById("oefViewerSluit");
  if (!grid) return;

  var actiefItem = null;

  function maakKop(label, klasse) {
    var btn = document.createElement("button");
    btn.className = "oef-kop";
    btn.type = "button";
    btn.setAttribute("aria-expanded", "false");
    var tekst = document.createElement("span");
    tekst.textContent = label;
    var caret = document.createElement("span");
    caret.className = "caret";
    caret.setAttribute("aria-hidden", "true");
    caret.textContent = "\u25B8"; // ▸
    btn.appendChild(tekst);
    btn.appendChild(caret);
    btn.addEventListener("click", function () {
      var open = klasse.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    return btn;
  }

  function toonMateriaal(item, knop) {
    if (actiefItem) actiefItem.classList.remove("actief");
    knop.classList.add("actief");
    actiefItem = knop;
    viewerTitel.textContent = item.titel;
    viewerFrame.src = item.bron;
    viewer.hidden = false;
    viewer.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function sluitMateriaal() {
    viewer.hidden = true;
    viewerFrame.removeAttribute("src");
    if (actiefItem) { actiefItem.classList.remove("actief"); actiefItem = null; }
  }

  OEFENMATERIAAL.forEach(function (niveau) {
    var kolom = document.createElement("div");
    kolom.className = "oef-niveau";
    kolom.appendChild(maakKop(niveau.niveau, kolom));

    var uit = document.createElement("div");
    uit.className = "oef-uitklap";
    var klassenWrap = document.createElement("div");
    klassenWrap.className = "oef-klassen";

    niveau.klassen.forEach(function (klas) {
      var klasEl = document.createElement("div");
      klasEl.className = "oef-klas";
      klasEl.appendChild(maakKop(klas.naam, klasEl));

      var klasUit = document.createElement("div");
      klasUit.className = "oef-uitklap";
      var items = document.createElement("div");
      items.className = "oef-items";

      if (klas.items && klas.items.length) {
        klas.items.forEach(function (item) {
          var b = document.createElement("button");
          b.className = "oef-item";
          b.type = "button";
          b.textContent = item.titel;
          b.addEventListener("click", function () { toonMateriaal(item, b); });
          items.appendChild(b);
        });
      } else {
        var leeg = document.createElement("p");
        leeg.className = "oef-leeg";
        leeg.textContent = "Nog geen oefenmateriaal. Dit vullen we aan zodra er iets klaarstaat.";
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

  if (viewerSluit) viewerSluit.addEventListener("click", sluitMateriaal);
})();
