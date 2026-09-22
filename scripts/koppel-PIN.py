# -*- coding: utf-8 -*-
"""Koppelt de indexregels van hoofdstuk 1 en 2 aan onderwerpcodes, valideert en
schrijft een controleoverzicht. De JSON is de bron; dit script vult alleen het
veld onderwerpen en de afgeleide velden wds en aantal_opgaven."""
import json, sys, collections
sys.path.insert(0, __file__.rsplit("/", 1)[0])
from importlib import import_module
H1 = import_module("koppeling-h1".replace("-", "_")) if False else None

import runpy
_h1 = runpy.run_path(__file__.rsplit("/",1)[0] + "/koppeling-h1.py")
_h2 = runpy.run_path(__file__.rsplit("/",1)[0] + "/koppeling-h2.py")
KOPPELING = {1: _h1["H1"], 2: _h2["H2"]}
WDS_VOLGORDE = {"W": 0, "D": 1, "S": 2}

def main(index_pad, onderwerpen_pad, overzicht_pad):
    idx = json.load(open(index_pad, encoding="utf-8"))
    ond = json.load(open(onderwerpen_pad, encoding="utf-8"))
    bekend = {o["id"]: o for o in ond["onderwerpen"]}
    fouten, gekoppeld = [], 0

    for rij in idx["rijen"]:
        h = rij["hoofdstuk"]
        if h not in KOPPELING:
            continue
        tabel = KOPPELING[h].get(rij["paragraaf"])
        if tabel is None:
            fouten.append(f"geen koppeltabel voor H{h} {rij['paragraaf']}"); continue
        codes = tabel.get(rij["opgave"])
        if codes is None:
            fouten.append(f"opgave zonder koppeling: H{h} {rij['paragraaf']} {rij['opgave']}"); continue
        rij["onderwerpen"] = ["PIN-" + c for c in codes.split()]
        gekoppeld += 1

    # controle 1: elke gebruikte code bestaat
    for rij in idx["rijen"]:
        for c in rij["onderwerpen"]:
            if c not in bekend:
                fouten.append(f"onbekende code {c} bij H{rij['hoofdstuk']} {rij['paragraaf']} {rij['opgave']}")
    # controle 3: elke stof-regel van H1/H2 heeft een onderwerp
    for rij in idx["rijen"]:
        if rij["hoofdstuk"] in KOPPELING and rij["stof"] and not rij["onderwerpen"]:
            fouten.append(f"stof zonder onderwerp: H{rij['hoofdstuk']} {rij['paragraaf']} {rij['opgave']}")

    # afgeleide velden
    per = collections.defaultdict(list)
    for rij in idx["rijen"]:
        for c in rij["onderwerpen"]:
            per[c].append(rij)
    for o in ond["onderwerpen"]:
        rijen = per.get(o["id"], [])
        o["aantal_opgaven"] = len(rijen)
        o["wds"] = sorted({r["wds"] for r in rijen}, key=lambda w: WDS_VOLGORDE[w])

    # controle 2: elk onderwerp wordt gebruikt
    ongebruikt = [o["id"] for o in ond["onderwerpen"] if o["aantal_opgaven"] == 0]

    idx["boek"]["status"] = ("alle acht hoofdstukken omgezet uit de Word-indexen; "
        "hoofdstuk 1 en 2 gekoppeld aan onderwerpen, hoofdstuk 3 t/m 8 nog niet")
    json.dump(idx, open(index_pad, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    json.dump(ond, open(onderwerpen_pad, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

    # controleoverzicht
    regels = ["# Controleoverzicht Pincode 4 · hoofdstuk 1 en 2", "",
              "Per onderwerp de opgaven die eraan gekoppeld zijn. Gesorteerd op code.",
              "Kolom W/D/S geeft het niveau, Blz. het gedrukte paginanummer.", ""]
    for o in ond["onderwerpen"]:
        rijen = per.get(o["id"], [])
        begr = ", ".join(o["begrippen"]) or "—"
        regels += [f"## {o['id']} · {o['label']}", "",
                   f"Begrippen: {begr}  ",
                   f"Paragrafen: {', '.join(o['paragrafen'])} · niveaus: {'/'.join(o['wds']) or '—'} · "
                   f"{o['aantal_opgaven']} opgaven", ""]
        if o["begrippen_via_presentatie"]:
            regels += [f"Wel behandeld, niet in de begrippenlijst: {', '.join(o['begrippen_via_presentatie'])}", ""]
        if not rijen:
            regels += ["> Geen enkele opgave. Wel leren, nergens oefenen.", ""]
            continue
        regels += ["| Waar | Opgave | Niveau | Blz. | Omschrijving |", "|---|---|---|---|---|"]
        for r in sorted(rijen, key=lambda r: (r["hoofdstuk"], r["blz"], r["opgave"])):
            oms = r["omschrijving"].replace("|", "/")
            tag = " ·" + "·".join(r["tags"]) if r["tags"] else ""
            regels.append(f"| H{r['hoofdstuk']} {r['paragraaf']} | {r['opgave']} | {r['wds']}{tag} | {r['blz']} | {oms} |")
        regels.append("")
    open(overzicht_pad, "w", encoding="utf-8").write("\n".join(regels) + "\n")

    print(f"gekoppeld: {gekoppeld} regels")
    print(f"fouten: {len(fouten)}")
    for f in fouten[:40]: print("   !", f)
    print(f"onderwerpen zonder opgave: {ongebruikt}")
    dekking = collections.Counter(len(r['onderwerpen']) for r in idx['rijen'] if r['hoofdstuk'] in KOPPELING)
    print("codes per regel:", dict(sorted(dekking.items())))

if __name__ == "__main__":
    main(*sys.argv[1:4])
