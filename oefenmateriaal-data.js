// ============================================================================
// Oefenmateriaal — inhoud
// ============================================================================
// Nieuw materiaal toevoegen? Zet het HTML-bestand in de map "oefenmateriaal"
// en voeg bij de juiste klas hieronder een regel toe tussen de blokhaken [ ]:
//
//     { titel: "Naam die de leerling ziet", bron: "oefenmateriaal/mijn-spel.html" }
//
// "bron" is het pad naar het bestand, of een volledige https-link naar een
// spel dat ergens anders online staat. De rest gaat vanzelf.
// ----------------------------------------------------------------------------
var KEUZE_DATA = [
  { niveau: "MAVO", klassen: [
    { naam: "3 MAVO", items: [] },
    { naam: "4 MAVO", items: [] }
  ] },
  { niveau: "HAVO", klassen: [
    { naam: "4 HAVO eco", items: [
      { titel: "Voorbeeld (zo werkt het)", bron: "oefenmateriaal/voorbeeld.html" }
    ] }
  ] },
  { niveau: "VWO", klassen: [
    { naam: "4 VWO beco", items: [] }
  ] }
];
var KEUZE_LEEG = "Nog geen oefenmateriaal. Dit vullen we aan zodra er iets klaarstaat.";
