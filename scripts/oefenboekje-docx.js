// ============================================================================
// Bouwt Index_<boek>_Oefenboekje.docx uit index-<boek>.json
// ============================================================================
// Gebruik:  node scripts/oefenboekje-docx.js [boek-id]   (standaard PE-M1)
//
// Dit script leest alleen; het schrijft uitsluitend het Word-bestand.
// ----------------------------------------------------------------------------
const fs = require("fs");
const d = require("docx");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, TableOfContents,
        Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, PageBreak } = d;

// Per boek: de secties van het boekje, in de volgorde van het boekje, met de
// beginpagina in de kop. Paginanummers gecontroleerd tegen de pdf.
const BOEKEN = {
  "PE-M1": {
    bestand: "Index_M1_Oefenboekje.docx",
    titel: "Index oefenboekje 4H Module 1 · Schaarste, geld en handel",
    laatste: 21,
    secties: [
      ["theorievragen", "Theorievragen · blz. 6", "begrippen"],
      ["gemengd H1", "Hoofdstuk 1 · Gemengde opgaven · blz. 7", "begrippen"],
      ["H2 §3", "Hoofdstuk 2 · §3 Scholing en specialisatie · blz. 8", "begrippen"],
      ["gemengd M1", "Module 1 · Gemengde opgaven · blz. 10", "begrippen"],
      ["procenten", "Basisvaardigheden · Rekenen met procenten · blz. 12", "vaardigheid"],
      ["grafieken", "Basisvaardigheden · Grafieken, tabellen en diagrammen aflezen · blz. 14", "vaardigheid"],
    ],
    noten: [],
  },
  "PE-M2": {
    bestand: "Index_M2_Oefenboekje.docx",
    titel: "Index oefenboekje 4H Module 2 · Vraag en aanbod",
    laatste: 53,
    secties: [
      ["1.1 Verschuiving vraaglijn en consumentensurplus", "Hoofdstuk 1 · §1.1 Verschuiving vraaglijn en consumentensurplus · blz. 7", "begrippen"],
      ["1.2 De collectieve vraag", "Hoofdstuk 1 · §1.2 De collectieve vraag · blz. 10", "begrippen"],
      ["1.3 Prijselasticiteit", "Hoofdstuk 1 · §1.3 Prijselasticiteit · blz. 12", "begrippen"],
      ["1.4 Inkomenselasticiteit", "Hoofdstuk 1 · §1.4 Inkomenselasticiteit · blz. 14", "begrippen"],
      ["gemengd H1", "Hoofdstuk 1 · Gemengde opgaven · blz. 15", "begrippen"],
      ["2.2 Kosten", "Hoofdstuk 2 · §2.2 Kosten · blz. 17", "begrippen"],
      ["2.3 Opbrengsten en winst", "Hoofdstuk 2 · §2.3 Opbrengsten en winst · blz. 22", "begrippen"],
      ["gemengd H2", "Hoofdstuk 2 · Gemengde opgaven · blz. 28", "begrippen"],
      ["gemengd H3", "Hoofdstuk 3 · Gemengde opgaven · blz. 32", "begrippen"],
    ],
    noten: [
      "Dit boekje heeft geen sectie Basisvaardigheden. Paragraaf 2.1, paragraaf 2.4 en de paragrafen van hoofdstuk 3 hebben geen eigen sectie; die stof komt terug in de gemengde opgaven.",
      "Op opgave 26a na vallen alle opgaven in dit boekje binnen de toetsstof. Die opgave vraagt naar de meeropbrengst: een ondersteunend begrip dat niet in de begrippenlijst staat en niet getoetst wordt.",
    ],
  },
};

const BOEK = process.argv[2] || "PE-M1";
const cfg = BOEKEN[BOEK];
if (!cfg) { console.error(`Onbekend boek: ${BOEK}. Bekend: ${Object.keys(BOEKEN).join(", ")}`); process.exit(1); }

const index = JSON.parse(fs.readFileSync(`index-${BOEK}.json`, "utf8"));

const TW = 9638, ZWART = "000000", KOPKLEUR = "DCE8F4";
const rand = (sz) => ({ style: BorderStyle.SINGLE, size: sz, color: ZWART });
const BUITEN = { top: rand(8), bottom: rand(8), left: rand(8), right: rand(8),
                 insideHorizontal: rand(4), insideVertical: rand(4) };
const CELRAND = { top: rand(4), bottom: rand(4), left: rand(4), right: rand(4) };
const CELMARGE = { top: 60, bottom: 60, left: 100, right: 100 };

const tekst = (t, bold) => new Paragraph({ spacing: { before: 20, after: 20 },
  children: [new TextRun({ text: String(t ?? ""), size: 18, font: "Calibri", bold: !!bold })] });
const cel = (t, b, kop) => new TableCell({ width: { size: b, type: WidthType.DXA },
  borders: CELRAND, margins: CELMARGE,
  shading: kop ? { type: ShadingType.CLEAR, color: "auto", fill: KOPKLEUR } : undefined,
  children: [tekst(t, kop)] });
const tabel = (koppen, br, rijen) => new Table({
  width: { size: TW, type: WidthType.DXA }, columnWidths: br, borders: BUITEN,
  rows: [new TableRow({ tableHeader: true, children: koppen.map((k, i) => cel(k, br[i], true)) }),
         ...rijen.map((r) => new TableRow({ cantSplit: true, children: r.map((c, i) => cel(c, br[i])) }))] });
const kop = (t, n) => new Paragraph({ text: t, heading: n, spacing: { before: 240, after: 120 } });
const alinea = (t) => new Paragraph({ spacing: { after: 120 },
  children: [new TextRun({ text: t, size: 20, font: "Calibri" })] });
const wdsTag = (r) => r.wds + (r.tags.includes("rekenen") ? "*" : "") + (r.tags.includes("tekenen") ? "^" : "");

const INLEIDING = [
  `Deze index hoort bij het oefenboekje, niet bij het lesboek. De opgavenummering loopt hier door van 1 tot en met ${cfg.laatste}, dus het opgavenummer is al uniek en een paginanummer per opgave is niet nodig. Bij elke sectie staat wel de beginpagina.`,
  "Deelvragen (a, b, c, ...) staan als aparte regels, zodat het onderscheid tussen W, D en S per deelvraag te maken is.",
  "W = Weten: een begrip, feit of definitie ophalen of herkennen (uit tekst of parate kennis).",
  "D = Doen: een vaardigheid uitvoeren, zoals rekenen, een tabel of schema invullen, een grafiek tekenen of aflezen, of een gegeven regel of definitie toepassen op een concreet geval.",
  "S = Snappen: uitleggen, verklaren of beredeneren waarom iets zo is, een gevolg inschatten, een verband leggen of een onderbouwd oordeel geven.",
  "Achter het WDS-niveau staat soms een teken. Een * betekent dat er gerekend moet worden, een ^ dat er getekend moet worden.",
  "De kolom Begrippen noemt de begrippen uit de begrippenlijst die de opgave toetst. De kolom Code verwijst naar de onderwerpenlijst uit de index van het lesboek, zodat een fout op een toets direct aan oefenmateriaal uit dit boekje gekoppeld kan worden. De kolom Verwijzing geeft aan waar in het lesboek de bijbehorende theorie staat.",
  "Bij de Basisvaardigheden vervangt de kolom Vaardigheid de kolom Begrippen. Die opgaven toetsen geen begrippen maar vaardigheden uit Domein A, en die horen bij de stof van de hele module.",
  ...cfg.noten,
  `Dit document is gegenereerd uit index-${BOEK}.json. Wijzigingen horen in dat bestand thuis, niet in dit document.`,
];

const kinderen = [
  new Paragraph({ spacing: { after: 240 }, children: [new TextRun({
    text: cfg.titel, bold: true, size: 32, font: "Calibri" })] }),
  ...INLEIDING.map(alinea),
  new Paragraph({ children: [new PageBreak()] }),
  kop("Inhoud", HeadingLevel.HEADING_1),
  new TableOfContents("Inhoud", { hyperlinks: true, headingStyleRange: "1-2" }),
  new Paragraph({ children: [new PageBreak()] }),
];

for (const [sec, titel, kolom] of cfg.secties) {
  const rijen = index.rijen.filter((r) => r.bron === "oefenboekje" && r.sectie === sec);
  if (!rijen.length) { console.warn(`Let op: geen regels voor sectie "${sec}"`); continue; }
  kinderen.push(kop(titel, HeadingLevel.HEADING_1));
  kinderen.push(tabel(
    ["Opgave", "Onderwerp van de opgave", kolom === "begrippen" ? "Begrippen" : "Vaardigheid", "Code", "WDS", "Verwijzing"],
    [800, 3000, 2100, 2038, 700, 1000],
    rijen.map((r) => [r.opgave, r.omschrijving, r.begrippen_of_vaardigheid,
                      r.onderwerpen.join(", ") || "-", wdsTag(r), r.verwijzing || "-"])));
}

const doc = new Document({
  styles: { default: { document: { run: { font: "Calibri", size: 20 } } } },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 },
    margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } }, children: kinderen }],
  features: { updateFields: true },
});

Packer.toBuffer(doc).then((b) => {
  fs.writeFileSync(cfg.bestand, b);
  console.log(`${cfg.bestand} geschreven ·`,
    index.rijen.filter((r) => r.bron === "oefenboekje").length, "opgaveregels");
});
