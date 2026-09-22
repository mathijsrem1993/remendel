// ============================================================================ 
// Toetsanalyse — inhoud
// ============================================================================
// Werkt hetzelfde als oefenmateriaal-data.js: voeg per klas een regel toe met
// een titel en een verwijzing naar het bestand van de toetsanalyse.
// ----------------------------------------------------------------------------
var KEUZE_DATA = [
  { niveau: "MAVO", klassen: [
    { naam: "3 MAVO", items: [] },
    { naam: "4 MAVO", items: [
      // Eén toets, twee versies. De versiekeuze is de laatste stap in het menu
      // (zie keuzemenu.js); "herkenning" helpt de leerling kiezen.
      { titel: "SE 1 (H1 + H2)",
        herkenning: "Rechtsboven op je toets staat V1 of V2. Weet je het niet zeker? Bij versie 1 gaat vraag 1 over Sanne, bij versie 2 over Femke.",
        versies: [
          { label: "Versie 1", bron: "feedbacktool.html?v=1&toets=4m-se1-h1h2-v1" },
          { label: "Versie 2", bron: "feedbacktool.html?v=1&toets=4m-se1-h1h2-v2" }
        ] }
    ] }
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
