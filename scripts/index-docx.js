// ============================================================================
// Bouwt Index_<boek>_PE.docx uit index-<boek>.json en onderwerpen-<boek>.json
// ============================================================================
// Gebruik:  node scripts/index-docx.js [boek-id]        (standaard PE-M1)
// Voorbeeld: node scripts/index-docx.js PE-M2
//
// Dit script leest alleen; het schrijft uitsluitend het Word-bestand. De
// JSON-bestanden en alles wat de feedbacktool gebruikt blijven ongemoeid.
// ----------------------------------------------------------------------------
const fs = require("fs");
const d = require("docx");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, TableOfContents,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, PageBreak,
} = d;

// ---------------------------------------------------------------- boekgegevens
// Hoofdstuk- en paragraafnamen staan hier en niet in de JSON, zodat de
// databestanden die de feedbacktool inleest niet hoeven te veranderen.
const BOEKEN = {
  "PE-M1": {
    bestand: "Index_M1_PE.docx",
    titel: "Index Praktische Economie · Module 1 · Schaarste, geld en handel",
    boekje: "oefenboekje 4H Module 1",
    hoofdstukken: { 1: "Hoofdstuk 1 · Voor niks gaat de zon op",
                    2: "Hoofdstuk 2 · Van ruilen komt geen huilen",
                    3: "Hoofdstuk 3 · Geld" },
    paragrafen: {
      "1§1": "§1 Kiezen is kostbaar", "1§2": "§2 Kiezen of delen", "1§3": "§3 Toepassen",
      "2§1": "§1 Wederzijds voordeel en eigendomsrechten", "2§2": "§2 Transactiekosten en instituties",
      "2§3": "§3 Scholing en specialisatie", "2§4": "§4 Toepassen",
      "3§1": "§1 De uitvinding van geld", "3§2": "§2 De verschijningsvormen van geld",
      "3§3": "§3 De waarde van geld", "3§4": "§4 De creatie van geld", "3§5": "§5 Toepassen",
    },
    // Losse toelichting boven een paragraaftabel, als de afbakening dat vraagt.
    paragraafnoot: {
      "3§4": "Van deze paragraaf worden alleen blz. 86 en 87 besproken: het vertrouwen in geld, de geldschepping, de centrale bank, de maatschappelijke geldhoeveelheid, de handelsbanken, DNB en de ECB, plus In context “Hyperinflatie in Zimbabwe”.",
    },
    domeinA: "Domein A · basisvaardigheden",
  },
  "PE-M2": {
    bestand: "Index_M2_PE.docx",
    titel: "Index Praktische Economie · Module 2 · Vraag en aanbod",
    boekje: "oefenboekje 4H Module 2",
    hoofdstukken: { 1: "Hoofdstuk 1 · De vraag naar producten",
                    2: "Hoofdstuk 2 · Het aanbod van producten",
                    3: "Hoofdstuk 3 · De prijs van producten" },
    paragrafen: {
      "1§1": "§1 De individuele vraag", "1§2": "§2 De collectieve vraag",
      "1§3": "§3 Prijselasticiteit", "1§4": "§4 Inkomenselasticiteit", "1§5": "§5 Toepassen",
      "2§1": "§1 Productie", "2§2": "§2 Kosten", "2§3": "§3 Opbrengsten en winst",
      "2§4": "§4 Individueel aanbod en collectief aanbod", "2§5": "§5 Toepassen",
      "3§1": "§1 Prijsvorming", "3§2": "§2 Prijsveranderingen", "3§3": "§3 Toepassen",
    },
    paragraafnoot: {},
    domeinA: "Domein A · basisvaardigheden",
  },
};

const BOEK = process.argv[2] || "PE-M1";
const cfg = BOEKEN[BOEK];
if (!cfg) { console.error(`Onbekend boek: ${BOEK}. Bekend: ${Object.keys(BOEKEN).join(", ")}`); process.exit(1); }

const index = JSON.parse(fs.readFileSync(`index-${BOEK}.json`, "utf8"));
const ond = JSON.parse(fs.readFileSync(`onderwerpen-${BOEK}.json`, "utf8"));

const WDSORDE = { W: 0, D: 1, S: 2 };
const niveaus = (w) => [...w].sort((a, b) => WDSORDE[a] - WDSORDE[b]).join("/");
const LABEL = Object.fromEntries(ond.onderwerpen.map((o) => [o.id, o.label]));

// ---------------------------------------------------------------- opmaak
const TW = 9638;
const ZWART = "000000";
const KOPKLEUR = "DCE8F4";
const rand = (sz) => ({ style: BorderStyle.SINGLE, size: sz, color: ZWART });
const BUITEN = { top: rand(8), bottom: rand(8), left: rand(8), right: rand(8),
                 insideHorizontal: rand(4), insideVertical: rand(4) };
const CELRAND = { top: rand(4), bottom: rand(4), left: rand(4), right: rand(4) };
const CELMARGE = { top: 60, bottom: 60, left: 100, right: 100 };

const tekst = (t, opt = {}) =>
  new Paragraph({ spacing: { before: 20, after: 20 }, ...opt.par,
    children: [new TextRun({ text: String(t ?? ""), size: 18, font: "Calibri", ...opt.run })] });

const cel = (t, breedte, opt = {}) =>
  new TableCell({ width: { size: breedte, type: WidthType.DXA }, borders: CELRAND,
    margins: CELMARGE, shading: opt.kop ? { type: ShadingType.CLEAR, color: "auto", fill: KOPKLEUR } : undefined,
    children: [tekst(t, { run: { bold: !!opt.kop }, par: opt.par })] });

function tabel(koppen, breedtes, rijen) {
  return new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: breedtes, borders: BUITEN,
    rows: [
      new TableRow({ tableHeader: true,
        children: koppen.map((k, i) => cel(k, breedtes[i], { kop: true })) }),
      ...rijen.map((r) => new TableRow({ cantSplit: true,
        children: r.map((c, i) => cel(c, breedtes[i])) })),
    ],
  });
}

const kop = (t, niveau) => new Paragraph({ text: t, heading: niveau,
  spacing: { before: 240, after: 120 } });
const alinea = (t) => new Paragraph({ spacing: { after: 120 },
  children: [new TextRun({ text: t, size: 20, font: "Calibri" })] });

// WDS plus de tags, compact: D* = rekenen, D^ = tekenen
const wdsTag = (r) =>
  r.wds + (r.tags.includes("rekenen") ? "*" : "") + (r.tags.includes("tekenen") ? "^" : "");

// Verdeelt de beschikbare breedte naar rato over een aantal kolommen.
const verdeel = (delen) => {
  const som = delen.reduce((a, b) => a + b, 0);
  const br = delen.map((x) => Math.round((x / som) * TW));
  br[br.length - 1] += TW - br.reduce((a, b) => a + b, 0);
  return br;
};

// ---------------------------------------------------------------- inleiding
const INLEIDING = [
  "Deze index bevat alle opgaven uit de lopende paragrafen en uit de rubriek Toepassen van hoofdstuk 1, 2 en 3.",
  "De opgavenummering herstart bij elke nieuwe paragraaf bij 1, ook bij de paragraaf Toepassen. Daarom staat bij elke opgave het gedrukte paginanummer uit het boek, zodat elke opgave uniek terug te vinden is. Paginanummer = het gedrukte paginanummer in het boek, niet het pdf-paginanummer.",
  "Deelvragen (a, b, c, ...) staan als aparte regels in de index, zodat het onderscheid tussen W, D en S per deelvraag te maken is. Romeinse subitems (I, II, III, ...) staan ook als aparte regels wanneer ze over verschillende begrippen gaan, en zijn samengevoegd wanneer het steeds dezelfde opdracht op een andere situatie is.",
  "W = Weten: een begrip, feit of definitie ophalen of herkennen (uit tekst of parate kennis).",
  "D = Doen: een vaardigheid uitvoeren, zoals rekenen, een tabel of schema invullen, een grafiek tekenen of aflezen, of een gegeven regel of definitie toepassen op een concreet geval.",
  "S = Snappen: uitleggen, verklaren of beredeneren waarom iets zo is, een gevolg inschatten, een verband leggen of een onderbouwd oordeel geven.",
  "Achter het WDS-niveau staat soms een teken. Een * betekent dat er gerekend moet worden, een ^ dat er getekend moet worden. Daarmee is het brede niveau D verder te verfijnen.",
  `De kolom Stof geeft aan of de opgave tot de toetsstof hoort. De maatstaf voor de theorie is de begrippenlijst van het betreffende hoofdstuk uit het ${cfg.boekje}. Een opgave krijgt Nee als het antwoord staat of valt met een begrip of een context die daar niet onder valt.`,
  "De kolom Code koppelt elke opgave binnen de toetsstof aan een of meer onderwerpen uit de onderwerpenlijst hieronder. Die koppeling maakt het mogelijk om na een toets automatisch te bepalen welke onderwerpen niet aan bod zijn gekomen, en welke opgaven daarbij horen. Een opgave kan aan meerdere onderwerpen hangen, ook aan een onderwerp uit een ander hoofdstuk. Regels buiten de toetsstof krijgen geen code en komen dus nooit als oefenadvies terug.",
  "Elk hoofdstuk sluit af met twee overzichten: wat er buiten de toetsstof valt en waarom, en welke begrippen het boek wel behandelt maar die niet in de begrippenlijst staan. Bij dat laatste blijven de opgaven op Ja.",
  `Dit document is gegenereerd uit index-${BOEK}.json en onderwerpen-${BOEK}.json. Wijzigingen horen in die bestanden thuis, niet in dit document.`,
];

// ---------------------------------------------------------------- onderwerpen
function onderwerpenSectie() {
  if (!ond.onderwerpen.length) return [];
  const uit = [kop("Onderwerpenlijst", HeadingLevel.HEADING_1),
    alinea(`De ${ond.onderwerpen.length} onderwerpen van deze module. Elk onderwerp heeft een vaste code die in de kolom Code van de opgaventabellen terugkomt. Onder Begrippen staan de termen uit de begrippenlijst van het oefenboekje die eronder vallen. Begrippen tussen haakjes staan niet in de begrippenlijst maar komen via de presentatie aan bod. De codes zijn vast: een vervallen onderwerp laat een gat achter en een code wordt nooit hergebruikt.`)];
  const groepen = [...Object.entries(cfg.hoofdstukken).map(([h, t]) => [Number(h), t]),
                   [null, cfg.domeinA]];
  for (const [h, titel] of groepen) {
    const lijst = ond.onderwerpen.filter((o) => o.hoofdstuk === h)
      .sort((a, b) => a.id.localeCompare(b.id));
    if (!lijst.length) continue;
    uit.push(kop(titel, HeadingLevel.HEADING_2));
    uit.push(tabel(["Code", "Onderwerp", "Begrippen", "Niveaus", "Opgaven"],
      [1100, 2500, 4038, 1000, 1000],
      lijst.map((o) => {
        const b = [...o.begrippen, ...(o.begrippen_via_presentatie || []).map((x) => `(${x})`)];
        return [o.id, o.label, b.join(", ") || "-", niveaus(o.wds), String(o.aantal_opgaven)];
      })));
    for (const o of lijst.filter((x) => x.feedback))
      uit.push(alinea(`${o.id} · vaste feedback: \u201c${o.feedback}\u201d Voor deze code worden geen oefenopgaven uit deze module gesuggereerd.`));
  }
  return uit;
}

// ---------------------------------------------------------------- hoofdstukken
function buitenTabel(h) {
  const rijen = (ond.buiten_toetsstof || []).filter((b) => b.hoofdstuk === h);
  if (!rijen.length) return [];
  // Raakt opgaven en Advies zijn optioneel: staan ze nergens ingevuld, dan
  // vervallen die kolommen en blijft de smalle variant over.
  const heeftRaakt = rijen.some((b) => b.raakt);
  const heeftAdvies = rijen.some((b) => b.advies);
  const koppen = ["Onderwerp of begrip", "Waar in het boek", "Waarom buiten de stof"];
  const delen = [26, 18, 24];
  if (heeftRaakt) { koppen.push("Raakt opgaven"); delen.push(24); }
  if (heeftAdvies) { koppen.push("Advies"); delen.push(18); }
  return [
    kop("Buiten de toetsstof", HeadingLevel.HEADING_2),
    alinea("Het boek behandelt meer dan de begrippenlijst van het oefenboekje voorschrijft. Deze onderwerpen vallen buiten de toetsstof."),
    tabel(koppen, verdeel(delen), rijen.map((b) => {
      const r = [b.label, b.waar, b.reden];
      if (heeftRaakt) r.push(b.raakt || "Geen opgaven");
      if (heeftAdvies) r.push(b.advies || "-");
      return r;
    })),
  ];
}

function welTabel(h) {
  const rijen = (ond.wel_behandeld || []).filter((b) => b.hoofdstuk === h);
  if (!rijen.length) return [];
  return [
    kop("Wel behandeld, niet in de begrippenlijst", HeadingLevel.HEADING_2),
    alinea("Deze begrippen behandelt het boek wel, maar ze staan niet in de begrippenlijst. De bijbehorende opgaven staan op Ja."),
    tabel(["Begrip", "Waar in het boek", "Raakt opgaven", "Toelichting"],
      verdeel([20, 17, 27, 36]),
      rijen.map((b) => [b.begrip, b.waar, b.raakt || "Geen opgaven rechtstreeks", b.toelichting])),
  ];
}

function hoofdstukSectie(h) {
  const uit = [new Paragraph({ children: [new PageBreak()] }),
               kop(cfg.hoofdstukken[h], HeadingLevel.HEADING_1)];
  const pars = [...new Set(index.rijen
    .filter((r) => r.bron === "lesboek" && r.hoofdstuk === h).map((r) => r.paragraaf))];
  for (const p of pars) {
    uit.push(kop(cfg.paragrafen[h + p] || p, HeadingLevel.HEADING_2));
    if (cfg.paragraafnoot[h + p]) uit.push(alinea(cfg.paragraafnoot[h + p]));
    const rijen = index.rijen.filter((r) => r.bron === "lesboek" && r.hoofdstuk === h && r.paragraaf === p);
    uit.push(tabel(["Opgave", "Onderwerp van de opgave", "Code", "WDS", "Blz.", "Stof"],
      [800, 4638, 2200, 700, 650, 650],
      rijen.map((r) => [r.opgave, r.omschrijving, r.onderwerpen.join(", ") || "-",
                        wdsTag(r), String(r.blz), r.stof ? "Ja" : "Nee"])));
  }
  uit.push(...buitenTabel(h), ...welTabel(h));
  return uit;
}

// ---------------------------------------------------------------- aandachtspunten
function aandachtSectie() {
  const punten = ond.aandachtspunten || [];
  if (!punten.length) return [];
  return [new Paragraph({ children: [new PageBreak()] }),
    kop("Aandachtspunten", HeadingLevel.HEADING_1),
    alinea("Punten waarop de begrippenlijst, het boek en de afbakening van de stof niet helemaal op elkaar aansluiten."),
    tabel(["Betreft", "Toelichting"], [2400, 7238],
      [...punten].sort((x, y) =>
        String(x.onderwerp || x.opgave).localeCompare(String(y.onderwerp || y.opgave)))
        .map((a) => {
          const id = a.onderwerp || a.opgave || "";
          return [id + (LABEL[id] ? ` · ${LABEL[id]}` : ""), a.punt];
        }))];
}

// ---------------------------------------------------------------- document
const doc = new Document({
  styles: { default: { document: { run: { font: "Calibri", size: 20 } } } },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 },
      margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
    children: [
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun({
        text: cfg.titel, bold: true, size: 32, font: "Calibri" })] }),
      ...INLEIDING.map(alinea),
      new Paragraph({ children: [new PageBreak()] }),
      kop("Inhoud", HeadingLevel.HEADING_1),
      new TableOfContents("Inhoud", { hyperlinks: true, headingStyleRange: "1-2" }),
      new Paragraph({ children: [new PageBreak()] }),
      ...onderwerpenSectie(),
      ...Object.keys(cfg.hoofdstukken).map(Number).flatMap(hoofdstukSectie),
      ...aandachtSectie(),
    ],
  }],
  features: { updateFields: true },
});

Packer.toBuffer(doc).then((b) => {
  fs.writeFileSync(cfg.bestand, b);
  const n = index.rijen.filter((r) => r.bron === "lesboek").length;
  console.log(`${cfg.bestand} geschreven · ${n} opgaveregels · ${ond.onderwerpen.length} onderwerpen`);
});
