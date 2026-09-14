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
      { titel: "Proefwerk M1 (H1 + H2)", bron: "feedbacktool.html?v=1&toets=4h-pw-m1-h1h2" }
    ] }
  ] },
  { niveau: "VWO", klassen: [
    { naam: "4 VWO beco", items: [] }
  ] }
];
var KEUZE_LEEG = "Nog geen toetsanalyse. Dit onderdeel volgt binnenkort.";
