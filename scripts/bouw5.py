#!/usr/bin/env python3
"""Bouwt index-PE-M1.json en onderwerpen-PE-M1.json. Hele module: H1, H2, H3 en Domein A."""
import json, collections, re

RE_REKEN = re.compile(r'ereken', re.I)      # berekenen, berekening
RE_TEKEN = re.compile(r'\bteken', re.I)      # tekenen, teken

# De index zegt bij een paar opgaven 'bepalen' waar 'berekenen' bedoeld is.
EXTRA_REKENEN = {(3,"§5","1a"), (3,"§5","1b"), (3,"§5","1c"),
                 (3,"§5","5d"), (3,"§5","5f"), (3,"§5","7f")}

def tags(oms):
    t = []
    if RE_REKEN.search(oms): t.append('rekenen')
    if RE_TEKEN.search(oms): t.append('tekenen')
    return t

PE = open("Index_M1_PE.md", encoding="utf-8").read().splitlines()
OB = open("Index_M1_Oefenboekje.md", encoding="utf-8").read().splitlines()


def parse(lines, wanted):
    out = collections.OrderedDict((k, []) for k in wanted)
    cur = None
    for ln in lines:
        s = ln.strip()
        if s.startswith("#"):
            kop = s.lstrip("#").strip().strip("*").strip()
            cur = kop if kop in wanted else None
            continue
        if cur and s.startswith("|") and not s.startswith("| ---"):
            cells = [c.strip().strip("*").strip() for c in s.strip("|").split("|")]
            if cells[0].lower() == "opgave":
                continue
            out[cur].append(cells)
    return out


# (kop -> hoofdstuk, paragraaflabel)
PE_SECTIES = {
    "§1 Kiezen is kostbaar":                     (1, "§1"),
    "§2 Kiezen of delen":                        (1, "§2"),
    "§3 Toepassen":                              (1, "§3"),
    "§1 Wederzijds voordeel en eigendomsrechten":(2, "§1"),
    "§2 Transactiekosten en instituties":        (2, "§2"),
    "§3 Scholing en specialisatie":              (2, "§3"),
    "§4 Toepassen":                              (2, "§4"),
    "§1 De uitvinding van geld":                 (3, "§1"),
    "§2 De verschijningsvormen van geld":        (3, "§2"),
    "§3 De waarde van geld":                     (3, "§3"),
    "§4 De creatie van geld":                    (3, "§4"),
    "§5 Toepassen":                              (3, "§5"),
}
pe = parse(PE, PE_SECTIES)
# "§3 Toepassen" is uniek voor H1; H2 gebruikt "§4 Toepassen", H3 "§5 Toepassen".
pe["§3 Toepassen"] = [r for r in pe["§3 Toepassen"] if r[3].isdigit() and int(r[3]) < 30]

OB_SECTIES = {
    "Theorievragen · blz. 6": "theorievragen",
    "Gemengde opgaven hoofdstuk 1 · blz. 7": "gemengd H1",
    "Hoofdstuk 2 · §3 Scholing en specialisatie · blz. 9": "H2 §3",
    "Gemengde opgaven Module 1 · blz. 12": "gemengd M1",
    "Basisvaardigheden · Rekenen met procenten · blz. 14": "procenten",
    "Basisvaardigheden · Grafieken, tabellen en diagrammen aflezen · blz. 15": "grafieken",
}
ob = parse(OB, OB_SECTIES)

A1, A2 = "M1-A-01", "M1-A-02"
def H1(n): return f"M1-H1-{n:02d}"
def H2(n): return f"M1-H2-{n:02d}"
def H3(n): return f"M1-H3-{n:02d}"

# ---------------- koppeling lesboek ----------------
MAP = {
 (1, "§1"): {"1a":[H1(1)],"1b":[H1(2)],"1c":[H1(4)],"2-I":[H1(3)],"2-III":[H1(4)],
   "2-IV":[H1(1)],"2-V":[H1(1)],"3a":[H1(1)],"3b":[H1(2)],"3c":[H1(2)],"4a":[H1(1)],
   "4b":[H1(1)],"5a":[H1(3)],"5b":[H1(3)],"5j":[H1(3)],"6":[H1(1),H1(2)],"7a":[H1(3)],
   "7b":[H1(3)],"7c":[H1(3)],"7d":[H1(3)],"8a":[H1(4)],"8b":[H1(4)],"8c":[H1(4)],
   "9a":[H1(3)],"9b":[H1(3)],"10a":[H1(4)],"10b":[H1(4)],"10c":[H1(4)]},
 (1, "§2"): {"1-I":[H1(5)],"1-II":[H1(5)],"1-III":[H1(7)],"1-V":[H1(5)],"2a":[H1(6)],
   "2b":[H1(6)],"2c":[H1(6)],"3a":[H1(5)],"3b":[H1(5),H1(6)],"3c":[H1(5)],"4a":[H1(1)],
   "4b":[H1(1)],"4c":[H1(1)],"5a":[H1(6)],"5b":[H1(7)],"5c":[H1(7)],"5d":[H1(7)],
   "5e":[H1(7)],"6a":[H1(5)],"6b":[H1(5)],"7b":[H1(7)],"7d":[H1(6)],"8":[H1(7)],
   "9a":[H1(6)],"9b":[H1(6)],"9c":[H1(7)],"9d":[H1(6)],"10":[H1(7)]},
 (1, "§3"): {"1a":[H1(5)],"1b":[H1(7)],"1c":[H1(1)],"1d":[H1(1)],"2a":[H1(3)],
   "3a":[H1(2)],"3b":[H1(2)],"3c":[H1(3)],"4a":[H1(6)],"4b":[H1(6)],"4c":[H1(5),H1(6)],
   "5a":[H1(6)],"5b":[H1(3)],"6b":[H1(4)],"6c":[H1(1)],"7a":[H1(7)],"7b":[H1(7)],
   "7c":[H1(7)],"7d":[H1(7)],"8b":[H1(4)],"9a":[H1(2)],"9b":[H1(3)],"9c":[H1(3)],
   "10a":[H1(3)],"10b":[A1],"10c":[A1],"10d":[H1(3)]},

 (2, "§1"): {"1a":[H2(1)],"1b":[H2(1)],"1c":[H2(2)],"1d":[H2(1)],"1e":[H2(1),H2(2)],
   "2-I":[H2(2)],"2-II":[H2(3)],"2-III":[H2(1)],"2-IV":[H2(4)],"3a":[H2(1),H2(2)],
   "3b":[H2(1)],"3c":[H2(1)],"3d":[H2(1)],"3e":[H2(1)],"4a":[H2(2)],"4b":[H2(1)],
   "5a":[H2(2)],"5b":[H2(1)],"5c":[H2(1)],"6a":[H2(3)],"6b":[H2(3)],"7c":[H2(3)],
   "8a":[H2(1)],"8b":[H2(1)],"8c":[H2(1)],"8d":[H2(1)],"8e":[H2(1)],"8f":[H2(1)],
   "8g":[H2(1)],"8h":[H2(2)],"9a":[H2(4)],"9b":[H2(4)],"9d":[H2(4)],"10a":[H2(3)],
   "10b":[H2(3)],"10c":[H2(3)],"10d":[H2(3)]},
 (2, "§2"): {"1-I":[H2(5)],"1-II":[H2(5)],"1-III":[H2(5)],"1-V":[H2(7)],"2a":[H2(6)],
   "2b":[H2(5)],"2c":[H2(5)],"2d":[H2(5)],"3a":[H2(5)],"3b":[H2(5)],"3c":[H2(5)],
   "4a":[H2(5)],"4b":[H2(5),H2(7)],"4c":[H2(5)],"5a":[H2(1)],"5b":[H2(5)],"5c":[H2(5)],
   "5d":[H2(5)],"6":[H2(6)],"7a":[H2(7)],"7b":[H2(7)],"7c":[H2(5),H2(7)],"7d":[H2(7)],
   "8a":[H2(7)],"8b":[H2(5),H2(7)],"8c":[H2(7)],"9a":[H2(6)],"9b":[H2(5)],
   "9c":[H2(7)],"9d":[H2(5)]},
 (2, "§3"): {"1-I":[H2(8)],"1-II":[H2(9)],"1-III":[H2(11)],"1-IV":[H2(10)],
   "2a":[H2(8)],"2b":[H2(8)],"2c":[H2(8)],"2d":[H2(8)],"2e":[H2(8)],"2f":[H2(8)],
   "3a":[H2(10)],"3b":[H2(9)],"3c":[H2(9)],"4a":[H2(9)],"4b":[H2(9)],"4c":[H2(9)],
   "5a":[H2(9)],"5b":[H2(9)],"5c":[H2(9),A1],"6a":[H2(9),H2(11)],"6b":[H2(11)],
   "6c":[H2(9)],"7a":[H2(11)],"7b":[H2(11)],"7c":[H2(9)],"8a":[H2(10)],"8b":[H2(10)],
   "9a":[H2(10)],"9b":[H2(9),H2(10)],"9c":[H2(10)],"10b":[H2(10)],"10c":[H2(10)]},
 (2, "§4"): {"1a":[H2(5),H2(7)],"1b":[H2(9)],"2a":[H2(1)],"2b":[H2(5)],
   "2c":[H2(5),H2(7)],"2d":[H1(3)],"3a":[H2(1)],"3b":[H2(5)],"3c":[H2(7)],
   "3d":[H2(5)],"4a":[H2(1)],"4b":[H2(1)],"4c":[H2(6)],"5a":[H2(9)],"5b":[H2(9)],
   "5c":[H2(9)],"6a":[H2(5),H2(7)],"6b":[H2(7)],"7a":[H2(1)],"7b":[H2(5)],
   "7c":[H2(1),H2(5)],"7d":[H2(5)],"7e":[H2(10)],"8a":[H2(1)],"8b":[H2(6)],
   "8c":[H2(5)],"8d":[H1(1)],"8e":[H2(1)],"9a":[A2],"9b":[H2(9),H2(11)],
   "9c":[H2(9)],"10a":[H2(9)],"10b":[H2(9)],"10c":[H2(9)],"10d":[H2(9)]},
 (3, "§1"): {"1a":[H3(2)],"1b":[H3(2)],"1c":[H3(2)],"2-I":[H3(2)],"2-II":[H3(1)],
   "2-III":[H3(2)],"2-IV":[H3(2)],"2-V":[H3(1)],"3a":[H3(2)],"3b":[H3(2)],
   "3c":[H3(5)],"3d":[H3(5)],"3e":[H3(5)],"4":[H3(2)],"5a":[H3(1)],"5b":[H3(1)],
   "6a":[H3(1)],"6b":[H3(1)],"6c":[H3(1),H3(2)],"6d":[H3(1)],"7b":[H3(1)],
   "8a":[H3(1),H3(2)],"8b":[H3(1)],"8c":[H3(1)],"9a":[H3(2)],"9b":[H3(2)],
   "9c":[H3(2)],"9d":[H3(2)],"10a":[H3(2)],"10b":[H3(1)]},
 (3, "§2"): {"1-I":[H3(4)],"1-II":[H3(5)],"1-III":[H3(6)],"1-IV":[H3(6)],
   "2a":[H3(3)],"2b":[H3(3)],"2c":[H3(3)],"3":[H3(5)],"4a":[H3(5)],"4b":[H3(5)],
   "4c":[H3(5)],"5a":[H3(5)],"5b":[H3(5)],"5c":[H3(5)],"5d":[H3(5)],"5e":[H3(5),A1],
   "5f":[H3(5)],"6a":[H3(12)],"6b":[H3(12),H3(5)],"6c":[H3(12)],"7a":[H3(6)],
   "7b":[H3(6),H2(5)],"7c":[H3(6),H2(5)],"7d":[H3(6)],"8a":[H3(4)],"8b":[H3(4)],
   "8c":[H3(4),A1],"8d":[H3(4),A1],"8e":[H3(4)],"8f":[H3(4)],"9a":[H3(4)],
   "9b":[H3(4)],"9c":[H3(4)],"9d":[H3(4),H3(2)],"10a":[H3(5)],"10b":[H3(5)]},
 (3, "§3"): {"1-I":[H3(7)],"1-II":[H3(7)],"1-III":[H3(9)],"1-IV":[H3(8),H3(10)],
   "1-V":[H3(7)],"2a":[H3(7)],"2b":[H3(7)],"2c":[H3(8)],"3a":[H3(7)],"3b":[H3(7)],
   "3c":[H3(7)],"3d":[H3(7)],"3e":[H3(7),H3(5)],"3f":[H3(7)],"3g":[H3(7)],
   "4":[H3(9)],"5a":[H3(7),H3(9)],"5b":[H3(7),H3(9)],"5c":[H3(9)],"5d":[H3(9)],
   "5e":[H3(9)],"5f":[H3(9)],"6a":[H3(9)],"6b":[H3(9)],"7a":[H3(7),H3(9)],
   "7b":[H3(4),H3(9)],"7c":[H3(4),H3(7)],"8a":[H3(7)],"8b":[H3(8)],
   "8c":[H3(7),H3(8)],"9a":[H3(8),H3(10)],"9b":[H3(10)],"9c":[H3(10)],
   "10a":[H3(12)],"10b":[H3(12)],"10c":[H3(12),H3(7)],"10d":[H3(12)],
   "10e":[H3(12),H3(7)]},
 (3, "§4"): {"1-I":[H3(11),H3(10)],"1-II":[H3(12)],"2":[H3(5),H3(11)],"3a":[H3(2)],
   "3b":[H3(2)],"3c":[H3(2)],"3d":[H3(11)],"4a":[H3(10),A1],"4b":[H3(10),A1],
   "4c":[H3(10),A1],"4d":[H3(10),H3(8)],"5a":[H3(12),H3(8)],"5c":[H3(4)],
   "5d":[H3(4),H3(5)],"5e":[H3(10),A1],"5f":[H3(10),A1],"5g":[H3(10)],
   "6a":[H3(11),H3(12)],"6b":[H3(11)],"6c":[H3(10)],"6d":[H3(10)],
   "6e":[H3(10),H3(7)],"7a":[H3(13)],"7b":[H3(8),H3(13)],"7c":[H3(13)],
   "7d":[H3(1),H2(5)],"7e":[H3(5)]},
 (3, "§5"): {"1a":[H3(7)],"1b":[H3(8)],"1c":[H3(7)],"1d":[H3(9)],"2a":[H3(2)],
   "2b":[H3(2)],"2c":[H1(3)],"2d":[H3(7)],"3a":[H3(5),H3(2)],"3b":[H3(12),H3(5)],
   "3c":[H3(5)],"3d":[H2(5)],"3e":[H3(5)],"4a":[H3(10)],"4b":[H3(8)],"4c":[H3(10)],
   "5a":[H3(2)],"5b":[H3(4)],"5c":[H3(4)],"5d":[H3(7)],"5e":[H3(7)],"5f":[H3(8)],
   "5g":[H3(2),H3(8)],"5h":[H3(11)],"6a":[H3(7)],"6b":[H3(7),H3(10)],"6c":[H3(7)],
   "6d":[H1(2)],"7a":[H3(7)],"7b":[H3(7)],"7c":[H3(7)],"7d":[H3(7)],
   "7e":[H3(7),H3(9)],"7f":[H3(8)],"7g":[H3(9)],"8a":[H3(7)],"8b":[H3(8)],
   "8c":[H2(2)],"8d":[H3(4)],"9a":[H3(7)],"9b":[H3(8)],"9c":[H3(7)]},
}

MAP_OB = {
 "theorievragen": {"1a":[H2(9),H2(10)],"1b":[H1(3),H1(6)],"1c":[H3(10)],"1d":[H3(4)]},
 "gemengd H1": {"2a":[H1(6)],"2b":[H1(6)],"2c":[H1(5),H1(6)],"3a":[H1(5)],"3b":[H1(5)],
   "4a":[H1(4)],"4b":[H1(4)],"5a":[H1(6)],"5b":[H1(7)]},
 "H2 §3": {"6a":[H2(9)],"6b":[H2(8),H2(9)],"6c":[H2(9)],"7a":[H2(9)],"7b":[H2(8),H2(9)],
   "7c":[H2(9)],"8a":[H2(9),H2(10)],"8b":[H2(9),H2(10)],"8c":[H2(8),H2(9)],"8d":[H2(9)]},
 "gemengd M1": {"9a":[H1(6)],"9b":[H1(6)],"9c":[H1(7)],"10a":[H1(2),H1(4)],
   "10b":[H1(4)],"10c":[H1(4)],"11a":[H1(2),H1(3),H2(2),H2(3),H2(5),H2(9),H3(4),H3(5),H3(10),H3(11)],
   "11b":[H3(5)],"12":[H2(4),H3(2),H3(7),H3(9)],"13a":[H3(3)],"13b":[H3(11),H3(4)],
   "13c":[H1(3),H1(5)],"13d":[H1(7)]},
}

# Op aangeven van Mathijs uit het programma gehaald.
GESCHRAPT = {(1, "§3", "6a"),
             # De vier voorwaarden om tot een ruil te komen zijn geen toetsstof (jouw keuze).
             (2, "§2", "2a"), (2, "§2", "6"), (2, "§2", "9a"),
             (2, "§4", "4c"), (2, "§4", "8b")}

# ---------------- index opbouwen ----------------
rijen = []
for kop, (h, par) in PE_SECTIES.items():
    for opg, ond, wds, blz, stof in pe[kop]:
        is_stof = stof == "Ja" and (h, par, opg) not in GESCHRAPT
        rijen.append({"bron": "lesboek", "hoofdstuk": h, "paragraaf": par, "opgave": opg,
                      "omschrijving": ond, "wds": wds, "tags": sorted(set(tags(ond)) | ({"rekenen"} if (h, par, opg) in EXTRA_REKENEN else set())), "blz": int(blz), "stof": is_stof,
                      "onderwerpen": MAP.get((h, par), {}).get(opg, []) if is_stof else []})

for kop, sec in OB_SECTIES.items():
    for cells in ob[kop]:
        opg, ond, extra, wds, stof = cells[:5]
        verw = cells[5] if len(cells) > 5 else ""
        ids = [A1] if sec == "procenten" else [A2] if sec == "grafieken" \
              else MAP_OB.get(sec, {}).get(opg, [])
        rijen.append({"bron": "oefenboekje", "sectie": sec, "opgave": opg,
                      "omschrijving": ond, "begrippen_of_vaardigheid": extra, "wds": wds, "tags": tags(ond),
                      "blz": None, "stof": stof == "Ja", "verwijzing": verw,
                      "onderwerpen": ids})

# ---------------- onderwerpen ----------------
#  (id, label, hoofdstuk, paragrafen, begrippen, alleen-via-presentatie, synoniemen)
DEF = [
 (H1(1),"Behoeften en middelen",1,["§1","§2"],
  ["behoefte","middel","goederen","diensten"],["tijd als derde soort middel","voorkeuren"],
  ["behoeften","middelen","goed of dienst","soorten middelen","tijd als middel"]),
 (H1(2),"Aanwendingsrichting en alternatief aanwendbaar",1,["§1"],
  ["aanwendingsrichting","alternatief aanwendbaar"],[],
  ["aanwendingsrichtingen","alternatieve aanwendbaarheid"]),
 (H1(3),"Schaarste en het economisch keuzeprobleem",1,["§1"],
  ["schaarste","economie"],["keuzeprobleem"],
  ["schaars","economisch keuzeprobleem","keuzeprobleem","economische wetenschap"]),
 (H1(4),"Baten, kosten en nettobaten",1,["§1"],
  ["baten","geregistreerde baten","niet-geregistreerde baten","kosten",
   "daadwerkelijke kosten","kosten van ongerief","netto-baten"],[],
  ["nettobaten","netto baten","baten en kosten","kosten van ongerief"]),
 (H1(5),"Budget en productcombinatie",1,["§2"],["budget","productcombinatie"],[],
  ["productcombinaties","budgetbesteding"]),
 (H1(6),"De budgetlijn opstellen en tekenen",1,["§2"],
  ["budgetlijn","vergelijking van de budgetlijn"],[],
  ["budgetfunctie","vergelijking budgetlijn","budgetlijn tekenen","snijpunten budgetlijn"]),
 (H1(7),"Verschuivingen van de budgetlijn",1,["§2"],["budgetlijn","budget"],[],
  ["verschuiving budgetlijn","draaiing budgetlijn","budgetlijn verschuiven"]),

 (H2(1),"Ruil, vrager en aanbieder, wederzijds voordeel",2,["§1"],
  ["ruil","vrager","aanbieder","wederzijds voordeel"],[],
  ["ruilen","wederzijds voordelige ruil","vraag en aanbod bij ruil","directe ruil"]),
 (H2(2),"Ruilverhouding",2,["§1"],["ruilverhouding"],[],["ruilwaarde","ruilverhoudingen"]),
 (H2(3),"Autarkie",2,["§1"],["autarkie"],[],["zelfvoorziening","deglobalisering"]),
 (H2(4),"Eigendomsrechten, patenten en contracten",2,["§1"],
  ["eigendomsrecht","intellectueel eigendomsrecht","auteursrecht","patent / octrooi","contract"],[],
  ["patent","octrooi","auteursrecht","intellectueel eigendom","eigendomsrechten"]),
 (H2(5),"Transactiekosten",2,["§2"],["transactiekosten"],[],
  ["zoekkosten","onderhandelingskosten","kosten van een ruil"]),
 (H2(7),"Instituties",2,["§2"],["institutie"],[],
  ["instituties","institutie","organisaties die ruil vergemakkelijken"]),
 (H2(8),"Productie, consumptie en arbeid",2,["§3"],
  ["productie","consument / consumptie","arbeid"],[],
  ["produceren","consumeren","producent","loonkosten"]),
 (H2(9),"Arbeidsproductiviteit",2,["§3"],["arbeidsproductiviteit"],[],
  ["APT","arbeidsproductiviteit per uur","productiviteit"]),
 (H2(10),"Arbeidsdeling en specialisatie",2,["§3"],["arbeidsdeling","specialisatie"],[],
  ["deeltaken","specialiseren","taakverdeling"]),
 (H2(11),"Scholing",2,["§3"],["scholing"],[],["opleiding","informeel leren","bijscholing"]),

 (H3(1),"Directe en indirecte ruil",3,["§1"],["directe ruil","indirecte ruil"],[],
  ["ruilhandel","directe ruil","indirecte ruil","ruilen zonder geld"]),
 (H3(2),"De functies van geld",3,["§1"],
  ["betaalmiddel / geld","ruilmiddel","oppotmiddel","rekenmiddel / waardemiddel"],[],
  ["functies van geld","spaarmiddel","waardemeter","drie functies van geld","betaalmiddel"]),
 (H3(3),"De technische eisen aan geld",3,["§2"],["technische eisen aan geld"],[],
  ["technische eisen","eisen aan geld","deelbaar duurzaam schaars"]),
 (H3(4),"Chartaal en giraal geld",3,["§2"],["chartaal geld","giraal geld"],[],
  ["contant geld","cash","pinnen","chartaal","giraal"]),
 (H3(5),"Fiduciair geld en het vertrouwen in geld",3,["§1","§2"],
  ["fiduciair geld","geldwissel"],[],
  ["vertrouwen in geld","bankbiljet","valsmunterij","vals geld","geldvervalsing"]),
 (H3(6),"Valuta, de euro en de eurozone",3,["§2"],
  ["valuta"],["eurozone en EMU"],
  ["euro","eurozone","EMU","muntsoort","wisselkoers"]),
 (H3(7),"Nominale en intrinsieke waarde van geld",3,["§3"],
  ["denominatie / nominale of extrinsieke waarde","intrinsieke waarde van geld"],[],
  ["nominale waarde","extrinsieke waarde","denominatie","intrinsieke waarde"]),
 (H3(8),"Reële waarde en koopkracht",3,["§3"],
  ["interne / reële waarde van geld","koopkracht van het geld"],[],
  ["reële waarde","interne waarde","koopkracht","ruilwaarde van geld"]),
 (H3(9),"De wet van Gresham",3,["§3"],["wet van Gresham"],[],
  ["Gresham","wet van Gresham"]),
 (H3(10),"Inflatie en geldontwaarding",3,["§3","§4"],
  ["inflatie","geldontwaarding","algemeen prijspeil"],[],
  ["inflatie","geldontwaarding","hyperinflatie","prijspeil","prijsstijging"]),
 (H3(11),"Geldschepping en de maatschappelijke geldhoeveelheid",3,["§4"],
  ["geldschepping","maatschappelijke geldhoeveelheid"],[],
  ["geldschepping","geldhoeveelheid","maatschappelijke geldhoeveelheid"]),
 (H3(13),"Wisselkoers en de externe waarde van geld",3,["§3","§4"],
  ["wisselkoers","externe waarde van het geld"],[],
  ["wisselkoers","externe waarde","koers","valutakoers"]),
 (H3(12),"De centrale bank, DNB en de ECB",3,["§2","§4"],
  ["centrale bank","De Nederlandsche Bank (DNB)","Europese Centrale Bank (ECB)",
   "monetair beleid","handelsbank"],[],
  ["DNB","ECB","centrale bank","De Nederlandsche Bank","Europese Centrale Bank"]),
]

DOMEIN_A = [
 (A1,"Rekenen met procenten",["procenten","procentuele verandering","procentpunt","aandeel in procenten"]),
 (A2,"Grafieken, tabellen en diagrammen aflezen",["grafiek aflezen","diagram lezen","tabel aflezen"]),
]

tel, wds_per = collections.Counter(), collections.defaultdict(set)
for r in rijen:
    for oid in r["onderwerpen"]:
        tel[oid] += 1
        wds_per[oid].add(r["wds"])

onderwerpen = [{"id": i, "label": l, "hoofdstuk": h, "paragrafen": p, "begrippen": b,
                "begrippen_via_presentatie": pr, "synoniemen": s,
                "wds": sorted(wds_per[i]), "aantal_opgaven": tel[i]}
               for i, l, h, p, b, pr, s in DEF]
onderwerpen += [{"id": i, "label": l, "hoofdstuk": None, "paragrafen": ["Domein A"],
                 "begrippen": [], "begrippen_via_presentatie": [], "synoniemen": s,
                 "wds": sorted(wds_per[i]), "aantal_opgaven": tel[i],
                 "toelichting": "Basisvaardigheid. Hoort bij de stof van de hele module "
                                "en van alle volgende modules."}
                for i, l, s in DOMEIN_A]

BUITEN = [
 (1,"Opofferingskosten","H1 §1 blz. 11, §2 blz. 17, leerdoel blz. 7","Staat niet in de begrippenlijst van hoofdstuk 1"),
 (1,"Praktijkonderzoek 'Wie krijgt een donororgaan?'","H1 §1 blz. 9 en 10, bron 8 blz. 13","Praktijkonderzoek; de begrippen horen niet tot de leerstof"),
 (1,"Vacature","H1 §3 blz. 26","Op jouw aangeven uit het programma gehaald; staat niet in de begrippenlijst"),
 (2,"Monopolie","H2 §1 blz. 33","Nog geen vereiste voor deze leerlingen"),
 (2,"ACM en NVWA","H2 §2 blz. 43, bron 11 blz. 47","Nog geen vereiste voor deze leerlingen"),
 (2,"Praktijkonderzoek 'Het handelsembargo van president Jefferson'","H2 §1 blz. 32","Praktijkonderzoek; de begrippen horen niet tot de leerstof"),
 (2,"Thuiskopievergoeding","H2 §1 blz. 34, bron 5","Staat niet in de begrippenlijst van hoofdstuk 2. Twijfelgeval, jouw keuze"),
 (2,"Kenniseconomie","H2 §4 bron 12 en 13, blz. 62","Staat niet in de begrippenlijst van hoofdstuk 2. Twijfelgeval, jouw keuze"),
 (2,"Organisatievorm","H2 §3 blz. 51, leerdoel blz. 48","Nog geen vereiste voor deze leerlingen"),
 (2,"Managers en generalisten","H2 §3 blz. 51","Nog geen vereiste voor deze leerlingen"),

 (3,"Concreet en abstract geld","H3 §1 blz. 68","Volgens jouw opgave niet in de stof"),
 (3,"Praktijkonderzoek 'Ruilhandel in Rusland'","H3 §1 blz. 66 en 67","Praktijkonderzoek; de begrippen horen niet tot de leerstof"),
 (3,"Geldschepping via geldautomaten, kredietkanaal, beleidsrente, kapitaalreserve, gewenste inflatie en monetair beleid","H3 §4 blz. 88 t/m 90","Van §4 worden alleen blz. 86 en 87 besproken"),
 (3,"In context 'Muntjes tellen'","H3 §4 blz. 88","Valt buiten blz. 86 en 87"),
 (2,"De vier voorwaarden om tot een ruil te komen","H2 §1, leertekst. De expliciete opgaven staan pas in §2 (2a, 6, 9a) en §4 (4c, 8b)","Op jouw aangeven niet opgenomen in de begrippenlijst"),
]

data = {
  "schema": "remendel-onderwerpen/1",
  "boek": {"id": "PE-M1", "titel": "Praktische Economie · Module 1: Schaarste, geld en handel",
    "niveau": "4 havo",
    "toetsstofcriterium": "De begrippenlijst per hoofdstuk uit het oefenboekje 4H Module 1, "
                          "aangevuld met de begrippen die alleen via de presentatie worden behandeld.",
    "status": "compleet: hoofdstuk 1, 2 en 3 plus Domein A"},
  "onderwerpen": onderwerpen,
  "buiten_toetsstof": [{"hoofdstuk": h, "label": l, "waar": w, "reden": r} for h, l, w, r in BUITEN],
  "aandachtspunten": [
    {"onderwerp": H3(6), "punt": "'Eurozone' en 'EMU' staan niet in de begrippenlijst, terwijl §2 "
      "opgave 1-III, 1-IV en 7a t/m 7d erover gaan. Wel opgenomen: 'valuta'."},
    {"onderwerp": H2(1), "punt": "De vier voorwaarden worden uitgelegd in §1 maar pas in §2 en §4 "
      "expliciet bevraagd. In §1 staan wel zeven verwante opgaven (5a t/m 5c, 8b t/m 8d, 8g) over het "
      "wel of niet tot stand komen van een ruil. Die blijven binnen de toetsstof onder dit onderwerp."},
    {"onderwerp": H3(2), "punt": "Het boek gebruikt op blz. 67 de term 'spaarmiddel' voor wat de "
      "begrippenlijst 'oppotmiddel' noemt. Beide woorden staan als synoniem in dit bestand, zodat de "
      "koppeling niet breekt. Raakt §1 opgave 1b, 2-I, 4 en 9d."},
    {"onderwerp": H3(13), "punt": "Wisselkoers en externe waarde worden als extra bij §3 besproken, "
      "maar de leertekst staat op blz. 88. Er zijn maar drie opgaven binnen de toetsstof, alle drie in "
      "de Zimbabwe-casus van §4."},
    {"onderwerp": H3(12), "punt": "'Monetair beleid' blijft als extra in de stof, maar de leertekst "
      "staat op blz. 90 en er is geen enkele opgave binnen de toetsstof om het mee te oefenen."},
    {"onderwerp": H3(5), "punt": "27 opgaven, veruit het grootste onderwerp van hoofdstuk 3. Wordt nog "
      "ingekort zodra de lijst met te zwakke opgaven er is."},
    {"onderwerp": H3(7), "punt": "38 opgaven, het grootste onderwerp van de module. Splitsbaar in "
      "nominaal tegenover intrinsiek als het te grof blijkt."},
  ],
}

index = {"schema": "remendel-index/1",
  "boek": {"id": "PE-M1", "titel": "Praktische Economie · Module 1: Schaarste, geld en handel",
    "niveau": "4 havo",
    "status": "compleet: hoofdstuk 1, 2 en 3 plus Domein A"},
  "legenda": {"W": "Weten", "D": "Doen", "S": "Snappen",
    "stof": "true = hoort tot de toetsstof, gemeten aan de begrippenlijst van het oefenboekje"},
  "rijen": rijen}

json.dump(index, open("index-PE-M1.json","w",encoding="utf-8"), ensure_ascii=False, indent=2)
json.dump(data,  open("onderwerpen-PE-M1.json","w",encoding="utf-8"), ensure_ascii=False, indent=2)

# ---------------- controle ----------------
print(f"index: {len(rijen)} rijen")
ja = [r for r in rijen if r["stof"]]
zonder = [r for r in ja if not r["onderwerpen"]]
print(f"  toetsstof {len(ja)}, zonder onderwerp {len(zonder)}")
for r in zonder:
    plek = f"lesboek H{r['hoofdstuk']} {r['paragraaf']}" if r["bron"]=="lesboek" else f"oefenboekje {r['sectie']}"
    print("   -", plek, r["opgave"], "·", r["omschrijving"][:58])
print("  buiten stof maar gekoppeld:", sum(1 for r in rijen if not r["stof"] and r["onderwerpen"]))
print("  tag rekenen:", sum(1 for r in rijen if r["stof"] and "rekenen" in r["tags"]),
      "· tag tekenen:", sum(1 for r in rijen if r["stof"] and "tekenen" in r["tags"]))
print()
for o in onderwerpen:
    ster = "  <-- weinig" if o["aantal_opgaven"] < 6 else ""
    print(f"  {o['id']}  {o['label']:<48}{o['aantal_opgaven']:>3}  {'/'.join(o['wds'])}{ster}")
