# -*- coding: utf-8 -*-
"""Zet de acht Word-indexen van Pincode 4 (vmbo GL/TL) om naar index-PIN.json.

De docx-bestanden bevatten markdown-tabellen als gewone alinea's:
    # Index Pincode 4 (vmbo GL/TL) - Hoofdstuk 1 Inkomen en welvaart
    ## 1.1 Hoe besteed jij je geld?
    | Opgave | Onderwerp | WDS | Blz. |
Dit script leest die structuur en schrijft de index als JSON.
Conventie: de JSON is de bron, de docx is een afdruk.
"""
import re, json, sys, glob, os

import docx

RUBRIEKEN = {
    "Weet je het nog?": "weet-je-het-nog",
    "Herhalingsopdrachten": "herhaling",
    "Plusopdrachten": "plus",
    "Rekenen": "rekenen",
    "Examentraining": "examentraining",
}

def tags_van(oms, soort=None):
    t = []
    laag = oms.lower()
    # De rubriek "Rekenen" is per definitie rekenwerk. Nodig omdat de
    # omschrijving daar soms "bepalen" zegt waar "berekenen" bedoeld is.
    if soort == "rekenen":
        t.append("rekenen")
        laag = ""
    if laag.startswith("rekenen:") or re.search(r"\bbereken|\bberekening|\buitrekenen", laag):
        t.append("rekenen")
    if re.search(r"\btekenen\b|\bteken\b|\bintekenen\b", oms.lower()):
        t.append("tekenen")
    return t

def lees_hoofdstuk(pad):
    doc = docx.Document(pad)
    regels = [p.text.strip() for p in doc.paragraphs]
    hoofdstuk = titel = None
    paragraaf = soort = None
    paragraaftitels, rijen = {}, []
    examentraining_bron = None
    for r in regels:
        if not r:
            continue
        m = re.match(r"^#\s+Index Pincode 4 \(vmbo GL/TL\)\s*·\s*Hoofdstuk\s*(\d+)\s+(.+)$", r)
        if m:
            hoofdstuk, titel = int(m.group(1)), m.group(2).strip()
            continue
        if r.startswith("## "):
            kop = r[3:].strip()
            m = re.match(r"^(\d+\.\d+)\s+(.*)$", kop)
            if m:
                paragraaf, soort = m.group(1), "paragraaf"
                paragraaftitels[paragraaf] = m.group(2).strip()
            elif kop in RUBRIEKEN:
                paragraaf, soort = kop, RUBRIEKEN[kop]
            else:
                sys.exit(f"Onbekende kop in {pad}: {kop!r}")
            continue
        if r.startswith("*Uit:"):
            examentraining_bron = r.strip("*").strip()
            continue
        if not r.startswith("|"):
            continue
        if "---" in r or r.startswith("| Opgave"):
            continue
        cel = [c.strip() for c in r.strip("|").split("|")]
        if len(cel) != 4:
            sys.exit(f"Rij met {len(cel)} kolommen in {pad}: {r!r}")
        opgave, oms, wds, blz = cel
        if wds not in ("W", "D", "S"):
            sys.exit(f"Onbekend WDS-niveau {wds!r} in {pad}: {r!r}")
        if not re.fullmatch(r"\d+", blz):
            sys.exit(f"Paginanummer niet numeriek in {pad}: {r!r}")
        rijen.append({
            "bron": "lesboek",
            "hoofdstuk": hoofdstuk,
            "paragraaf": paragraaf,
            "soort": soort,
            "opgave": opgave,
            "omschrijving": oms,
            "wds": wds,
            "tags": tags_van(oms, soort),
            "blz": int(blz),
            "stof": True,
            "onderwerpen": [],
        })
    meta = {"nummer": hoofdstuk, "titel": titel, "paragrafen": paragraaftitels}
    if examentraining_bron:
        meta["examentraining_bron"] = examentraining_bron
    return meta, rijen

def main(bronmap, uit):
    paden = sorted(glob.glob(os.path.join(bronmap, "*Index_Pincode_Hoofdstuk*.docx")),
                   key=lambda p: int(re.search(r"Hoofdstuk(\d+)", p).group(1)))
    if len(paden) != 8:
        sys.exit(f"Verwacht 8 hoofdstukbestanden, gevonden {len(paden)}")
    hoofdstukken, rijen = [], []
    for p in paden:
        meta, rs = lees_hoofdstuk(p)
        hoofdstukken.append(meta)
        rijen.extend(rs)
    data = {
        "schema": "remendel-index/1",
        "boek": {
            "id": "PIN",
            "titel": "Pincode 4 · vmbo GL/TL",
            "niveau": "4 mavo (GL/TL)",
            "status": "alle acht hoofdstukken omgezet uit de Word-indexen; koppeling aan onderwerpen nog leeg",
        },
        "legenda": {
            "W": "Weten",
            "D": "Doen",
            "S": "Snappen",
            "stof": "true = hoort tot de toetsstof, gemeten aan de stof uit het boek plus de begrippenlijst",
            "paragraaf": "§-nummer (1.1 t/m x.4) of de naam van de rubriek waarin de opgave staat",
            "soort": "paragraaf, weet-je-het-nog, herhaling, plus, rekenen of examentraining",
            "blz": "het gedrukte paginanummer in het boek, niet het pdf-paginanummer",
            "opgavenummering": "Nummers herstarten per paragraaf en per rubriek; alleen binnen de Herhalingsopdrachten loopt de nummering door over het hele hoofdstuk. Hoofdstuk + paragraaf + opgave maakt een regel uniek.",
        },
        "hoofdstukken": hoofdstukken,
        "rijen": rijen,
    }
    with open(uit, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    return data

if __name__ == "__main__":
    d = main(sys.argv[1], sys.argv[2])
    print(f"{len(d['rijen'])} regels weggeschreven naar {sys.argv[2]}")
