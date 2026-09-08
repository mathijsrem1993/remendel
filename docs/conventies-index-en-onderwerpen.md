# Conventies · index- en onderwerpenbestanden

Dit document beschrijft hoe de index- en onderwerpenbestanden voor de feedbackwebsite worden opgebouwd. Lever het mee aan het begin van elke nieuwe sessie, samen met de brondocumenten van het boek dat aan de beurt is. Zonder dit document krijgt elk boek een andere indeling en werkt de vergelijking tussen boeken niet meer.

Referentie-implementatie: Praktische Economie Module 1, afgerond september 2026. Bij twijfel: kijk hoe het daar is opgelost.

---

## 1. Wat we maken en waarom

Per boek worden twee bestanden gemaakt:

| Bestand | Inhoud |
|---|---|
| `index-<boek>.json` | Elke opgave als losse regel, met niveau, paginanummer, of het toetsstof is, en naar welk onderwerp het verwijst |
| `onderwerpen-<boek>.json` | De onderwerpen zelf, met begrippen, synoniemen en wat buiten de toetsstof valt |

De koppeling loopt één kant op: de index verwijst naar een onderwerp, nooit andersom. Zo staat elke opgave op precies één plek en hoeft er bij een wijziging maar één bestand bij.

Het doel is een aftrekking. Van alle onderwerpen die tot de toetsstof horen, halen we de onderwerpen af die op een toets voorkwamen. Wat overblijft zijn de onderwerpen die de leerling niet getoetst heeft gekregen, inclusief de oefenopgaven die erbij horen en het niveau waarop die staan.

**De JSON is de bron, de docx is een afdruk.** Wijzigingen gaan altijd in de JSON. De Word-documenten worden daaruit gegenereerd. Nooit rechtstreeks in de docx knippen, want die wijziging is bij de eerstvolgende generatie weg.

---

## 2. Wat de toetsstof bepaalt

Dit verschilt per boek en moet aan het begin van een sessie worden vastgelegd in het veld `toetsstofcriterium`.

- **Praktische Economie**: de begrippenlijst per hoofdstuk uit het bijbehorende oefenboekje, aangevuld met begrippen die alleen via de presentatie worden behandeld.
- **Pincode**: leunt op de syllabus van het centraal examen. Nog vast te leggen wanneer dat boek aan de beurt is.

Een opgave krijgt `stof: false` als het antwoord staat of valt met een begrip of context die daar niet onder valt. Regels blijven altijd in de index staan, ook als ze buiten de stof vallen. Zo is over een jaar nog te zien dat een opgave bewust geschrapt is en niet per ongeluk gemist.

---

## 3. Codes

Vorm: `<boek>-<hoofdstuk>-<volgnummer>`, bijvoorbeeld `M1-H2-05`. Basisvaardigheden krijgen `<boek>-A-<volgnummer>`, bijvoorbeeld `M1-A-01`.

Regels:

- Codes zijn vast. Een code verwijst voor altijd naar hetzelfde onderwerp.
- Een code wordt **nooit hergebruikt**. Vervalt een onderwerp, dan blijft er een gat. In M1 ontbreekt `M1-H2-06` omdat de vier voorwaarden om te ruilen uit de stof zijn gehaald.
- Nieuwe onderwerpen krijgen het eerstvolgende vrije nummer, ook als dat de logische volgorde doorbreekt. In M1 staat `M1-H3-13` inhoudelijk bij §3, maar kreeg het nummer 13 omdat het later is toegevoegd. Sorteer bij het weergeven op code, niet op de volgorde in het bestand.

---

## 4. Hoe fijn is een onderwerp

Richtlijn: **ongeveer twee tot drie begrippen per onderwerp**. In M1 leverde dat 7 onderwerpen voor hoofdstuk 1, 11 voor hoofdstuk 2 en 13 voor hoofdstuk 3, bij respectievelijk 19, 20 en 27 begrippen.

Splits wanneer twee dingen **een verschillend type fout** opleveren. Voorbeelden uit M1:

- De budgetlijn opstellen en tekenen (`M1-H1-06`) staat los van verschuivingen van de budgetlijn (`M1-H1-07`). Een leerling die de vergelijking niet kan opstellen heeft een ander probleem dan een leerling die de verschuiving niet kan verklaren.
- Nominale en intrinsieke waarde staan samen, want dat is één vergelijking die je in één adem maakt. Reële waarde en koopkracht staan apart, want die hangen aan inflatie.

Splits niet op basis van de handeling. "Berekenen" en "herkennen" zijn geen onderwerpen maar niveaus, en daar zijn WDS en de tags voor. Zie punt 6.

Praktische controle achteraf: een onderwerp met minder dan vijf opgaven is verdacht, en een onderwerp met meer dan dertig is een splitsingskandidaat. Beide zijn geen harde regel maar wel een signaal om even naar te kijken.

Een onderwerp mag bestaan zonder begrip uit de begrippenlijst, maar dat is een uitzondering en moet altijd als aandachtspunt worden vastgelegd. In M1 gold dat voor de technische eisen aan geld, waar een opgave op W-niveau naar vroeg terwijl het begrip niet in de lijst stond.

---

## 5. Velden

### `onderwerpen-<boek>.json`

```
boek
  id, titel, niveau, toetsstofcriterium, status
onderwerpen[]
  id                        vaste code
  label                     nette naam, ook zichtbaar voor leerlingen
  hoofdstuk                 nummer, of null bij basisvaardigheden
  paragrafen[]              waar het onderwerp behandeld wordt
  begrippen[]               termen uit de begrippenlijst die eronder vallen
  begrippen_via_presentatie[]  wel behandeld, niet in de begrippenlijst
  synoniemen[]              alternatieve schrijfwijzen, zodat matching niet breekt
  wds[]                     welke niveaus voorkomen (afgeleid, niet handmatig)
  aantal_opgaven            afgeleid, niet handmatig
buiten_toetsstof[]          hoofdstuk, label, waar, reden
aandachtspunten[]           onderwerp of opgave, punt
```

### `index-<boek>.json`

```
boek        id, titel, niveau, status
legenda     uitleg van W, D, S en van het veld stof
rijen[]
  bron                      "lesboek" of "oefenboekje"
  hoofdstuk, paragraaf      bij lesboek
  sectie                    bij oefenboekje
  opgave                    "1a", "2-III", "10"
  omschrijving              wat de opgave vraagt, in eigen woorden
  wds                       "W", "D" of "S"
  tags[]                    "rekenen", "tekenen"
  blz                       gedrukt paginanummer, null bij oefenboekje
  stof                      true of false
  verwijzing                bij oefenboekje: waar de theorie staat
  onderwerpen[]             codes; leeg als stof false is
```

---

## 6. WDS en tags

- **W = Weten**: een begrip, feit of definitie ophalen of herkennen.
- **D = Doen**: een vaardigheid uitvoeren, zoals rekenen, een tabel invullen, een grafiek tekenen of aflezen, of een regel toepassen op een concreet geval.
- **S = Snappen**: uitleggen, verklaren, beredeneren, een verband leggen of een onderbouwd oordeel geven.

Het toepassen van een definitie op een concreet geval is **D, niet W**. Gevolg: lesboeken leveren bijna geen W-opgaven, omdat vrijwel elke vraag in een context staat. In M1 hoofdstuk 1 was er precies één. Herclassificeer daar niet omheen. De oplossing is dat W-feedback verwijst naar de begrippenlijst en naar zelfgemaakte theorievragen, niet naar boekopgaven. Een begrip leer je niet door nog een contextopgave te maken.

Omdat D te breed is, verfijnen twee tags dat niveau:

- `rekenen`: er moet gerekend worden
- `tekenen`: er moet getekend worden

Automatisch toekennen op de omschrijving werkt, maar controleer handmatig. Indexomschrijvingen wisselen soms tussen "berekenen" en "bepalen" voor dezelfde handeling. In M1 stond bij één opgavenreeks bij a tot en met e "berekenen" en bij f "bepalen", terwijl het dezelfde reeks was.

---

## 7. Werkwijze per boek

1. **Brondocumenten inlezen.** Index van het lesboek, index van het oefenboekje, en het oefenboekje zelf voor de begrippenlijst.
2. **Onderwerpen ontwerpen per hoofdstuk**, met punt 4 als richtlijn. Eerst voorleggen, dan pas doorwerken.
3. **Elke opgave koppelen.** Een opgave mag aan meerdere onderwerpen hangen, ook aan een onderwerp uit een ander hoofdstuk. In M1 raakten negen opgaven uit hoofdstuk 2 en 3 stof uit een eerder hoofdstuk. Die kruisverbanden zijn waardevol: zonder die koppeling zou een leerling met een gat bij schaarste de bijbehorende oefening uit hoofdstuk 3 nooit te zien krijgen.
4. **Valideren.** Drie controles die altijd moeten slagen:
   - elke code die in de index voorkomt bestaat in het onderwerpenbestand
   - elk onderwerp wordt door minstens één opgave gebruikt
   - elke regel met `stof: true` heeft minstens één onderwerp
5. **Controleoverzicht genereren** als leesbaar markdownbestand. Een JSON is niet te controleren, een tabel per onderwerp met de opgaven eronder wel.
6. **Voorleggen per hoofdstuk**, niet pas aan het eind.
7. **Docx genereren** uit de JSON, pas als alles klaar is.

---

## 8. Opmaak van de gegenereerde documenten

Gebaseerd op de bestaande indexen, zodat alle boeken er hetzelfde uitzien.

- A4 staand, marges 1134 dxa (2 cm) rondom
- Calibri; tekst in tabellen 9 pt, lopende tekst 10 pt
- Tabelbreedte 9638 dxa; zowel `columnWidths` op de tabel als `width` op elke cel, beide in DXA
- Randen zwart. Buitenrand 1 pt (`size: 8`), binnenlijnen 0,5 pt (`size: 4`). **Nooit dunne grijze randen**, die verdwijnen bij het printen
- Kopcellen met arcering `DCE8F4`, type `CLEAR` (nooit `SOLID`, dat rendert zwart)
- Celmarges: boven en onder 60, links en rechts 100
- Automatische inhoudsopgave met de `TableOfContents`-klasse, `headingStyleRange: "1-2"` en `updateFields: true`
- Sorteer op code, en toon niveaus in de volgorde W/D/S, niet alfabetisch

### Bouwen en controleren

```bash
export NODE_PATH=/usr/local/lib/node_modules_global
node index-docx.js
```

Voor de visuele controle moet `updateFields` uit een kopie worden gestript, anders blijft LibreOffice hangen op de vraag of het veld bijgewerkt moet worden:

```bash
mkdir chk && cd chk && unzip -q ../Index.docx
python3 -c "import re; p='word/settings.xml'; x=open(p,encoding='utf-8').read(); open(p,'w',encoding='utf-8').write(re.sub(r'<w:updateFields[^/]*/>','',x))"
zip -Xrq ../check.docx . && cd ..
soffice --headless --convert-to pdf --outdir . check.docx
pdftoppm -jpeg -r 80 check.pdf p
```

Bekijk de afbeeldingen daarna echt. Renderen zonder kijken telt niet als controle.

---

## 9. Val niet in deze kuilen

Geleerd tijdens M1.

**Verzin nooit een gegeven dat niet in de bron staat.** Bij het vastleggen van een vindplaats stond er "blz. 41" terwijl dat nergens uit de documenten bleek. Staat het er niet, schrijf dan op dat het ontbreekt en vraag het na. Een geschat paginanummer is niet te onderscheiden van een gecontroleerd paginanummer zodra het eenmaal in het bestand staat.

**Controleer paginanummers tegen de inhoudsopgave.** In de oefenboekje-index van M1 stonden vier paginanummers verkeerd, en dat bleek pas veel later. De door Word berekende inhoudsopgave in het document zelf is de betrouwbaarste bron, en een conversie naar PDF bevestigt het.

**Let op synoniemen tussen boek en begrippenlijst.** Het boek gebruikte "spaarmiddel" waar de begrippenlijst "oppotmiddel" zegt. Zonder synoniem breekt de koppeling zodra iemand de boekterm gebruikt in een toetsvraag. Loop de begrippenlijst en de leertekst hierop na.

**Neem de aandachtspunten uit de bestaande index over.** Die bevatten vaak al de botsingen tussen begrippenlijst en boek. In M1 stonden er vier die anders opnieuw ontdekt hadden moeten worden.

**Schrijf aandachtspunten neutraal.** Deze documenten worden door collega's gelezen. Geen namen, geen "Mathijs gaat nog".

**Bedenk wat een schrapping raakt.** Toen de vier voorwaarden om te ruilen uit de stof gingen, vervielen vijf opgaven, waaronder twee casussen die verder prima waren. Meld dat expliciet in plaats van het stil door te voeren.

**Signaleer onderwerpen zonder oefenmateriaal.** In M1 hadden twaalf van de 32 onderwerpen geen enkele rekenopgave, en had "monetair beleid" helemaal geen opgave binnen de toetsstof. Dat is precies het soort gat dat je vóór een toets wilt weten in plaats van erna.
