// ============================================================================ 
// Toetsanalyse — inhoud
// ============================================================================
// Werkt hetzelfde als oefenmateriaal-data.js: voeg per klas een regel toe met
// een titel en een verwijzing naar het bestand van de toetsanalyse.
// ----------------------------------------------------------------------------
var KEUZE_DATA = [
  { niveau: "MAVO", klassen: [
    { naam: "3 MAVO", items: [] },
    { naam: "4 MAVO", items: [] }
  ] },
  { niveau: "HAVO", klassen: [
    { naam: "4 HAVO eco", items: [
      { titel: "PW M1 (H1 + H2) \u00b7 schaarste en ruil", bron: "feedbacktool.html?v=10&toets=4h-m1-h1h2" },
      { titel: "PW M2 (H2 + H3) \u00b7 vraag en aanbod", bron: "feedbacktool.html?v=10&toets=4h-m2-h2h3" }
    ] }
  ] },
  { niveau: "VWO", klassen: [
    { naam: "4 VWO beco", items: [] }
  ] }
];
var KEUZE_LEEG = "Nog geen toetsanalyse. Dit onderdeel volgt binnenkort.";
