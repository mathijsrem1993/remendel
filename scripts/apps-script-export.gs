/* ======================================================================
   EXPORT VOOR DE FEEDBACKBUNDEL
   ======================================================================
   Plak deze functie onderaan het bestaande ontvangstscript in Apps Script
   (hetzelfde bestand waar doPost en schrijfNaarSheet in staan, zodat de
   constante SPREADSHEET_ID gewoon bruikbaar is). Staat daar al een oudere
   versie van exporteerVoorBundel, haal die dan eerst weg.

   Wat het doet: de inzendingen van ALLE toetsen (tabbladen) uit de
   docentensheet halen en als één json-bestand in je Drive zetten, in de
   vorm die bundel.html verwacht. Het leest alleen; er wordt niets
   gewijzigd of gemaild. Er valt niets in te stellen: kies de functie
   exporteerVoorBundel, klik Uitvoeren, en open de link in het logboek.
   Welke toets en welke docent je wilt, kies je daarna in bundel.html.

   Tabbladen zonder kolom "Print gewenst" (toetsen van voor die kolom
   bestond) of zonder inzendingen worden overgeslagen en genoemd in het
   bestand, zodat je ziet waarom een toets ontbreekt.

   De json bevat leerlingnummers, cijfers en eigen voornemens. Laat het
   bestand niet in een gedeelde map staan.
   ====================================================================== */

function exporteerVoorBundel() {
  const bladen = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets();
  const toetsen = [];
  const overgeslagen = [];

  bladen.forEach(function (blad) {
    const naam = blad.getName();
    const alles = blad.getDataRange().getValues();
    if (alles.length < 2) { overgeslagen.push(naam + " (nog geen inzendingen)"); return; }

    const koppen = alles.shift();
    const idx = function (k) { return koppen.indexOf(k); };
    const kDatum = idx("Datum"), kNaam = idx("Leerlingnummer"), kDocent = idx("Docent"),
          kPrint = idx("Print gewenst"), kFouten = idx("Fouttypen per vraag"),
          kVoornemens = idx("Eigen voornemens");
    if (kNaam === -1 || kDocent === -1 || kFouten === -1) { overgeslagen.push(naam + " (geen toetstabblad)"); return; }
    if (kPrint === -1) { overgeslagen.push(naam + " (geen kolom Print gewenst)"); return; }

    // De vraagkolommen heten "V1a (2p)" — daar halen we het vraagnummer uit.
    const vraagKolommen = [];
    koppen.forEach(function (k, i) {
      const m = /^V(.+?)\s*\(([\d.,]+)p\)$/.exec(String(k));
      if (m) vraagKolommen.push({ index: i, nr: m[1] });
    });
    if (!vraagKolommen.length) { overgeslagen.push(naam + " (geen vraagkolommen)"); return; }

    const leerlingen = alles
      .filter(function (r) { return String(r[kNaam]).trim(); })
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
          voornemens: kVoornemens === -1 ? "" : String(r[kVoornemens] || ""),
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

    if (!leerlingen.length) { overgeslagen.push(naam + " (nog geen inzendingen)"); return; }
    toetsen.push({ toets: naam, leerlingen: leerlingen });
  });

  if (!toetsen.length) throw new Error("Geen enkel tabblad met bruikbare inzendingen. Overgeslagen: " + overgeslagen.join(" | "));

  const uit = JSON.stringify({ toetsen: toetsen, overgeslagen: overgeslagen }, null, 1);
  const datum = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
  const bestand = DriveApp.createFile("bundel-export-" + datum + ".json", uit, MimeType.PLAIN_TEXT);

  Logger.log(toetsen.map(function (t) { return t.toets + ": " + t.leerlingen.length; }).join(" | "));
  if (overgeslagen.length) Logger.log("Overgeslagen: " + overgeslagen.join(" | "));
  Logger.log("Bestand: " + bestand.getUrl());
  return bestand.getUrl();
}
