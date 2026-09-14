// ============================================================================
// Gedeelde aftrekking-logica
// ============================================================================
// Gebruikt door zowel feedbacktool.html (stap 4: "Niet alle stof is
// getoetst") als controle.html (de interne controleweergave). Bepaalt,
// gegeven de stofafbakening van een toets, de vragen van die toets, en de
// twee stofdata-bestanden (onderwerpen-<boek>.json / index-<boek>.json):
//   - welke onderwerp-codes binnen de stofafbakening vallen,
//   - welke daarvan in deze toets zijn getoetst (en of dat uitsluitend via
//     een vraag met geenOefenadvies:true was),
//   - hoeveel opgaven (PE/oefenboekje/totaal) elke code heeft.
// Puur rekenwerk, geen tekstopmaak — dat blijft de eigen verantwoordelijkheid
// van elke pagina (feedbacktool.html maakt er leesbare zinnen van met
// grondnummer-samenvoeging, controle.html toont kale telling per code).
// ----------------------------------------------------------------------------
function berekenStofafbakening(stofafbakening, vragen, onderwerpenData, indexData) {
  const hoofdstukken = Array.isArray(stofafbakening.hoofdstukken) ? stofafbakening.hoofdstukken : [];
  const extra = Array.isArray(stofafbakening.extra) ? stofafbakening.extra : [];
  const uitgesloten = Array.isArray(stofafbakening.uitgesloten) ? stofafbakening.uitgesloten : [];

  // Alle codes van de getoetste hoofdstukken, plus 'extra', min 'uitgesloten'
  // (uitgesloten verwacht codes; een lijst met vrije tekst is dus een no-op).
  const stofCodes = new Set();
  (onderwerpenData.onderwerpen || []).forEach(o => { if (hoofdstukken.includes(o.hoofdstuk)) stofCodes.add(o.id); });
  extra.forEach(c => stofCodes.add(c));
  uitgesloten.forEach(c => stofCodes.delete(c));

  // Per code: komt hij voor in een gewone vraag, en/of alleen in een
  // vraag met geenOefenadvies:true?
  const perCode = {};
  (vragen || []).forEach(v => {
    (v.onderwerpen || []).forEach(c => {
      if (!perCode[c]) perCode[c] = { gewoon: false, geenAdvies: false };
      if (v.geenOefenadvies) perCode[c].geenAdvies = true; else perCode[c].gewoon = true;
    });
  });
  const getoetst = new Set(Object.keys(perCode));
  const alleenGeenAdvies = Object.keys(perCode).filter(c => perCode[c].geenAdvies && !perCode[c].gewoon).sort();

  // Binnen de stofafbakening, maar niet getoetst (huidige logica: een code
  // telt al als getoetst zodra hij in een vraag voorkomt, ongeacht
  // geenOefenadvies) — gesorteerd op code, niet op volgorde in het bestand.
  const nietGetoetstCodes = [...stofCodes].filter(c => !getoetst.has(c)).sort();

  // Strengere variant, puur ter vergelijking: ook de alleen-geenOefenadvies-
  // codes meetellen als "niet echt getoetst".
  const strengNietGetoetstCodes = [...stofCodes].filter(c => !getoetst.has(c) || alleenGeenAdvies.includes(c)).sort();

  function telOpgaven(code) {
    const rijen = (indexData.rijen || []).filter(r => r.stof === true && Array.isArray(r.onderwerpen) && r.onderwerpen.includes(code));
    const pe = rijen.filter(r => r.bron === "lesboek").length;
    const boekje = rijen.filter(r => r.bron === "oefenboekje").length;
    return { pe, boekje, totaal: pe + boekje };
  }

  function somVan(codes) {
    const t = { pe: 0, boekje: 0, totaal: 0 };
    codes.forEach(c => { const r = telOpgaven(c); t.pe += r.pe; t.boekje += r.boekje; t.totaal += r.totaal; });
    return t;
  }

  return { stofCodes, getoetst, perCode, alleenGeenAdvies, nietGetoetstCodes, strengNietGetoetstCodes, telOpgaven, somVan };
}
