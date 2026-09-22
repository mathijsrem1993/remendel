/* ======================================================================
   EXPORT VOOR DE FEEDBACKBUNDEL
   ======================================================================
   Plak deze functie onderaan het bestaande ontvangstscript in Apps Script
   (hetzelfde bestand waar doPost en schrijfNaarSheet in staan, zodat de
   constante SPREADSHEET_ID gewoon bruikbaar is).

   Wat het doet: de inzendingen van één tabblad en één docent uit de
   docentensheet halen en als json wegschrijven, in de vorm die bundel.html
   verwacht. Het leest alleen; er wordt niets gewijzigd of gemaild.

   Gebruik:
     1. Zet TABBLAD en DOCENT hieronder goed.
        TABBLAD is de titel van de toets zoals hij als tabbladnaam in de
        sheet staat, bijvoorbeeld "Proefwerk Module 1, hoofdstuk 1 en 2".
        DOCENT leeg laten betekent: alle docenten.
     2. Kies in de editor de functie exporteerVoorBundel en klik Uitvoeren.
        De eerste keer vraagt Google opnieuw om toestemming, omdat dit
        script nu ook een bestand in Drive aanmaakt.
     3. In het uitvoervenster staat een link naar het json-bestand in je
        Drive. Open dat, kopieer de inhoud, en plak hem in bundel.html.
        Of download het en kies het daar met "Bestand kiezen".

   De json bevat leerlingnummers, cijfers en eigen voornemens. Laat het
   bestand niet in een gedeelde map staan.
   ====================================================================== */

function exporteerVoorBundel() {
  const TABBLAD = "Proefwerk Module 1, hoofdstuk 1 en 2";
  const DOCENT = "Kers"; // leeg laten voor alle docenten

  const blad = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TABBLAD);
  if (!blad) {
    const namen = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets().map(function (b) { return b.getName(); });
    throw new Error('Tabblad "' + TABBLAD + '" niet gevonden. Aanwezig: ' + namen.join(" | "));
  }

  const alles = blad.getDataRange().getValues();
  if (alles.length < 2) throw new Error('Tabblad "' + TABBLAD + '" bevat nog geen inzendingen.');

  const koppen = alles.shift();
  const kol = function (naam) {
    const i = koppen.indexOf(naam);
    if (i === -1) throw new Error('Kolom "' + naam + '" ontbreekt in ' + TABBLAD + ".");
    return i;
  };

  // De vraagkolommen heten "V1a (2p)" — daar halen we het vraagnummer uit.
  const vraagKolommen = [];
  koppen.forEach(function (k, i) {
    const m = /^V(.+?)\s*\(([\d.,]+)p\)$/.exec(String(k));
    if (m) vraagKolommen.push({ index: i, nr: m[1] });
  });
  if (!vraagKolommen.length) throw new Error("Geen vraagkolommen gevonden in " + TABBLAD + ".");

  const kDatum = kol("Datum");
  const kNaam = kol("Leerlingnummer");
  const kDocent = kol("Docent");
  const kPrint = kol("Print gewenst");
  const kFouten = kol("Fouttypen per vraag");
  const kVoornemens = kol("Eigen voornemens");

  const gewenst = String(DOCENT).trim().toLowerCase();

  const leerlingen = alles
    .filter(function (r) {
      if (!String(r[kNaam]).trim()) return false;
      if (!gewenst) return true;
      return String(r[kDocent]).trim().toLowerCase() === gewenst;
    })
    .map(function (r) {
      // "1a: Rekenfout/Leesfout; 2: Begripsfout" uit elkaar halen.
      const perVraag = {};
      String(r[kFouten] || "").split(";").forEach(function (deel) {
        const punt = deel.indexOf(":");
        if (punt === -1) return;
        const nr = deel.slice(0, punt).trim();
        if (!nr) return;
        perVraag[nr] = deel.slice(punt + 1).split("/")
          .map(function (x) { return x.trim(); })
          .filter(function (x) { return x; });
      });

      return {
        naam: String(r[kNaam]).trim(),
        docent: String(r[kDocent] || "").trim(),
        datum: (r[kDatum] instanceof Date) ? r[kDatum].toISOString() : String(r[kDatum] || ""),
        printWens: String(r[kPrint] || "").trim(),
        voornemens: String(r[kVoornemens] || ""),
        vragen: vraagKolommen.map(function (v) {
          const waarde = r[v.index];
          return {
            nr: v.nr,
            behaald: (waarde === "" || waarde === null || waarde === undefined) ? null : Number(waarde),
            fouten: perVraag[v.nr] || []
          };
        })
      };
    });

  if (!leerlingen.length) {
    const aanwezig = alles.map(function (r) { return String(r[kDocent]).trim(); })
      .filter(function (d, i, a) { return d && a.indexOf(d) === i; });
    throw new Error('Geen inzendingen voor docent "' + DOCENT + '". Wel aanwezig: ' + aanwezig.join(", "));
  }

  const uit = JSON.stringify({ toets: TABBLAD, docent: DOCENT, leerlingen: leerlingen }, null, 1);
  const bestandsnaam = "bundel-" + TABBLAD.replace(/[^\w]+/g, "-").toLowerCase() +
                       (gewenst ? "-" + gewenst : "") + ".json";
  const bestand = DriveApp.createFile(bestandsnaam, uit, MimeType.PLAIN_TEXT);

  Logger.log(leerlingen.length + " inzending(en) geexporteerd.");
  Logger.log("Bestand: " + bestand.getUrl());
  return bestand.getUrl();
}
