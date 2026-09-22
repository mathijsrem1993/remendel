// ============================================================================
// Gedeelde boeklabel-logica
// ============================================================================
// Gebruikt door feedbacktool.html (het label voor de lesboek-regels in het
// oefenadvies) en controle.html (dat het label toont, zodat je vóór
// publicatie ziet wat leerlingen te lezen krijgen).
//
// Bepaalt, gegeven het "boek"-blok uit index-<boek>.json, hoe het lesboek in
// leerlingtekst genoemd wordt:
//   1. staat er een expliciet `lesboeklabel`, dan wint dat — zo houdt
//      Praktische Economie zijn vertrouwde "PE-boek";
//   2. anders wordt het afgeleid uit `titel` en `niveau`: de boeknaam (het
//      deel vóór de "·", zonder los jaartal) met de niveau-afkorting
//      erachter, dus leerjaar plus de beginletter van de schoolsoort.
//      "Pincode 4 · vmbo GL/TL" met niveau "4 mavo (GL/TL)" wordt zo
//      "Pincode 4M", en een latere 3-mavo-index vanzelf "Pincode 3M".
//
// De afleiding is een vangnet, geen norm: het label is leerlingtekst, dus
// zet bij een nieuw boek `lesboeklabel` in de index en kijk in
// controle.html of er staat wat je wilt. Zonder boek wordt het "Lesboek".
// ----------------------------------------------------------------------------
const NIVEAU_LETTERS = [[/vwo|atheneum|gymnasium/i, "V"], [/havo/i, "H"], [/mavo|vmbo/i, "M"]];

function lesboekLabelVan(boek) {
  if (!boek) return "Lesboek";
  const expliciet = typeof boek.lesboeklabel === "string" ? boek.lesboeklabel.trim() : "";
  if (expliciet) return expliciet;
  // Boeknaam: "Pincode 4 · vmbo GL/TL" -> "Pincode"
  const naam = String(boek.titel || "").split("·")[0].replace(/\s+\d+\s*$/, "").trim();
  // Niveau: "4 mavo (GL/TL)" -> "4M"
  const niveau = String(boek.niveau || "");
  const jaar = (/\d+/.exec(niveau) || [""])[0];
  const soort = (NIVEAU_LETTERS.find(([re]) => re.test(niveau)) || [null, ""])[1];
  const kort = jaar + soort;
  if (naam && kort) return `${naam} ${kort}`;
  return naam || "Lesboek";
}

// Of het label uit de index komt of is afgeleid — controle.html meldt dat
// erbij, zodat een ontbrekend lesboeklabel opvalt.
function lesboekLabelIsExpliciet(boek) {
  return !!(boek && typeof boek.lesboeklabel === "string" && boek.lesboeklabel.trim());
}

// Heeft dit boek een oefenboekje naast het lesboek? Dat bepaalt welk label er
// bij een oefenverwijzing hoort. Met oefenboekje zijn er twee bronnen die uit
// elkaar gehouden moeten worden ("Oefenboekje:" naast "PE-boek:"), en is de
// boeknaam nodig. Zonder oefenboekje valt er niets te onderscheiden en is
// "Oefenen:" duidelijker voor een leerling dan de naam van het boek dat toch
// al voor zich ligt.
function boekHeeftOefenboekje(indexData) {
  return !!(indexData && (indexData.rijen || []).some(r => r.bron === "oefenboekje"));
}

function oefenLabelVan(indexData) {
  return boekHeeftOefenboekje(indexData) ? lesboekLabelVan(indexData && indexData.boek) : "Oefenen";
}
