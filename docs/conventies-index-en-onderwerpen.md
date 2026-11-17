# Conventies · index- en onderwerpenbestanden

Dit document beschrijft hoe de index- en onderwerpenbestanden voor de feedbackwebsite worden opgebouwd. Lever het mee aan het begin van elke nieuwe sessie, samen met de brondocumenten van het boek dat aan de beurt is. Zonder dit document krijgt elk boek een andere indeling en werkt de vergelijking tussen boeken niet meer.

Referentie-implementaties: Praktische Economie Module 1 (september 2026) en Module 2 (november 2026). Bij twijfel: kijk hoe het daar is opgelost. M2 is de meest complete: dat is het eerste boek met onderwerpcodes in de Word-index, met de overzichten "Buiten de toetsstof" en "Wel behandeld", en met codes voor Domein A.

---

## 1. Wat we maken en waarom

Per boek worden twee bestanden gemaakt:

| Bestand | Inhoud |
|---|---|
| `index-<boek>.json` | Elke opgave als losse regel, met niveau, paginanummer, of het toetsstof is, en naar welk onderwerp het verwijst |
| `onderwerpen-<boek>.json` | De onderwerpen zelf, met begrippen, synoniemen, wat buiten de toetsstof valt en wat wel behandeld wordt maar niet in de begrippenlijst staat |

De koppeling loopt één kant op: de index verwijst naar een onderwerp, nooit andersom. Zo staat elke opgave op precies één plek en hoeft er bij een wijziging maar één bestand bij.

Het doel is een aftrekking. Van alle onderwerpen die tot de toetsstof horen, halen we de onderwerpen af die op een toets voorkwamen. Wat overblijft zijn de onderwerpen die de leerling niet getoetst heeft gekregen, inclusief de oefenopgaven die erbij horen en het niveau waarop die staan.

**De JSON is de bron, de docx is een afdruk.** Wijzigingen gaan altijd in de JSON. De Word-documenten worden daaruit gegenereerd en staan niet in de repository. Nooit rechtstreeks in de docx knippen, want die wijziging is bij de eerstvolgende generatie weg.

---

## 2. Welke bestanden de site leest

Belangrijk om te weten voordat je iets aanpast. De feedbacktool en de controleweergave lezen alleen:

- `index-<boek>.json` en `onderwerpen-<boek>.json`
- `scripts/stofafbakening.js`
- `toetsen/<naam>.json`

De bouwscripts in `scripts/` die Word-documenten maken, en dit conventiedocument, worden door de site niet ingeladen. Je kunt ze dus aanpassen zonder dat de feedback die leerlingen krijgen verandert. Zodra je aan een van de vier bestanden hierboven komt, verandert er wél iets voor leerlingen: test dat dan eerst in `controle.html`.

---

## 3. Wat de toetsstof bepaalt

Dit verschilt per boek en moet aan het begin van een sessie worden vastgelegd in het veld `toetsstofcriterium`.

- **Praktische Economie**: de begrippenlijst per hoofdstuk uit het bijbehorende oefenboekje, aangevuld met begrippen die alleen via de presentatie worden behandeld.
- **Pincode**: de stof uit het boek, aangevuld met de begrippenlijst bij het vak. Die begrippenlijst is op de syllabus van het centraal examen gebaseerd. Begrippen die wel in het boek worden behandeld maar niet in de begrippenlijst staan, komen in `begrippen_via_presentatie`.

Een opgave krijgt `stof: false` als het antwoord staat of valt met een begrip of context die daar niet onder valt. Regels blijven altijd in de index staan, ook als ze buiten de stof vallen. Zo is over een jaar nog te zien dat een opgave bewust geschrapt is en niet per ongeluk gemist.

Een regel met `stof: false` krijgt geen onderwerpcodes. Gevolg: die opgave komt nooit als oefenadvies terug wanneer een leerling een fout maakt. Dat is precies de bedoeling, maar reken bij het schrappen van een onderwerp wel na wat er allemaal aan vastzit — zie het laatste hoofdstuk.

---

## 4. Codes

Vorm: `<boek>-<hoofdstuk>-<volgnummer>`, bijvoorbeeld `M1-H2-05`. Basisvaardigheden krijgen `<boek>-A-<volgnummer>`, bijvoorbeeld `M1-A-01`.

Het voorvoegsel is per boek vastgelegd. Praktische Economie Module 1 gebruikt `M1`, Pincode gebruikt `PIN`: `PIN-H1-01`, `PIN-A-01`. Het boek-id dat in de toets-JSON (`"boek"`) en in de bestandsnamen `index-<boek>.json` en `onderwerpen-<boek>.json` staat is voor Pincode dus `PIN`.

Regels:

- Codes zijn vast. Een code verwijst voor altijd naar hetzelfde onderwerp.
- Een code wordt **nooit hergebruikt**. Vervalt een onderwerp, dan blijft er een gat. In M1 ontbreekt `M1-H2-06` omdat de vier voorwaarden om te ruilen uit de stof zijn gehaald.
- Nieuwe onderwerpen krijgen het eerstvolgende vrije nummer, ook als dat de logische volgorde doorbreekt. In M1 staat `M1-H3-13` inhoudelijk bij §3, maar kreeg het nummer 13 omdat het later is toegevoegd. Sorteer bij het weergeven op code, niet op de volgorde in het bestand.

### Basisvaardigheden (Domein A)

Een A-code krijgt `hoofdstuk: null`. Hij wordt alleen aangemaakt voor een rekenvaardigheid die **niet** aan een vakinhoudelijk onderwerp van dat boek vastzit. Een procentsom die een tussenstap is in een elasticiteitsopgave hoort bij de elasticiteit, niet bij Domein A; alleen een som die los staat van elk onderwerp krijgt een A-code.

Een A-code mag een veld `feedback` hebben met een vaste tekst. Bedoeling: wanneer een module te weinig losse rekenopgaven bevat om zinnig naar te verwijzen, krijgt de leerling die tekst in plaats van oefenopgaven. M2 heeft er zes, verdeeld over twee codes, en verwijst daarom in de feedbacktekst naar het oefenboekje van M1 op Classroom.

**Let op: de feedbacktool leest dit veld nog niet.** Alleen het bouwscript van de Word-index drukt de tekst af. Koppel zo'n A-code daarom niet aan een toetsvraag en zet hem niet in `extra` van de stofafbakening, anders krijgt de leerling toch de enkele losse opgave aangeraden, of ziet hij de code terug in de lijst met niet-getoetste stof. Wil je bij een rekenvraag de vaste tekst tonen, geef die vraag dan `geenOefenadvies: true` en zet de tekst in `algemeneFeedback`. Zo is het bij PW M2 H1 gedaan: geen enkele vraag draagt een M2-A-code.

---

## 5. Hoe fijn is een onderwerp

Richtlijn: **ongeveer twee tot drie begrippen per onderwerp**. In M1 leverde dat 7 onderwerpen voor hoofdstuk 1, 11 voor hoofdstuk 2 en 13 voor hoofdstuk 3, bij respectievelijk 19, 20 en 27 begrippen. In M2 werden het er 11, 12 en 5, plus 2 voor Domein A.

Splits wanneer twee dingen **een verschillend type fout** opleveren. Voorbeelden uit M1:

- De budgetlijn opstellen en tekenen (`M1-H1-06`) staat los van verschuivingen van de budgetlijn (`M1-H1-07`). Een leerling die de vergelijking niet kan opstellen heeft een ander probleem dan een leerling die de verschuiving niet kan verklaren.
- Nominale en intrinsieke waarde staan samen, want dat is één vergelijking die je in één adem maakt. Reële waarde en koopkracht staan apart, want die hangen aan inflatie.

Splits niet op basis van de handeling. "Berekenen" en "herkennen" zijn geen onderwerpen maar niveaus, en daar zijn WDS en de tags voor. Zie het hoofdstuk over WDS.

Onderscheid wel de oorzaak van een verschijnsel van het gevolg ervan, want dat zijn twee fouttypen. In M2 staat de verschuiving van de vraaglijn (`M2-H1-05`, waardóór schuift de lijn: een substituut, een exogene factor) los van de gevolgen van een verschuiving voor het marktevenwicht (`M2-H3-05`, wat gebeurt er dan met prijs, hoeveelheid en surplus). Een leerling die de lijn de verkeerde kant op schuift heeft een ander gat dan een leerling die niet weet wat de lijn in beweging zet.

**Een onderwerp moet zelfstandig voorkomen.** Dit is de belangrijkste eis en hij gaat boven de richtlijn hierboven. Komt een onderwerp altijd samen met een ander onderwerp in dezelfde deelvraag voor, dan kan de tool een fout niet aan één van de twee toeschrijven en is de feedback waardeloos. Tel daarom na het koppelen per code hoe vaak hij als enige code op een regel staat. Onder de vier is een reden om het onderwerp anders te knippen. In M2 sneuvelde op die grond een eerste opzet voor de prijselasticiteit: "typeer de uitkomst" kwam nul keer zelfstandig voor, "elastische en inelastische vraag herkennen" dertien keer.

Praktische controle achteraf: een onderwerp met minder dan vijf opgaven is verdacht, en een onderwerp met meer dan dertig is een splitsingskandidaat. Beide zijn geen harde regel maar wel een signaal om even naar te kijken.

Een onderwerp mag bestaan zonder begrip uit de begrippenlijst, maar dat is een uitzondering en moet altijd als aandachtspunt worden vastgelegd. In M1 gold dat voor de technische eisen aan geld, waar een opgave op W-niveau naar vroeg terwijl het begrip niet in de lijst stond.

---

## 6. Velden

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
  feedback                  optioneel, alleen bij A-codes: vaste tekst (nog niet gelezen door de feedbacktool, zie Domein A)
buiten_toetsstof[]
  hoofdstuk, label, waar, reden
  raakt                     optioneel: welke opgaven het raakt, als tekst
  advies                    optioneel: wat de docent ermee moet
wel_behandeld[]             optioneel, per hoofdstuk
  hoofdstuk, begrip, waar, raakt, toelichting
aandachtspunten[]           betreft, toelichting
```

**Let op de veldnamen van `buiten_toetsstof`: `label` en `reden`, niet `onderwerp` en `waarom`.** Het bouwscript leest precies die twee. Schrijf je ze anders, dan blijven de eerste en de derde kolom van de tabel leeg zonder dat er een foutmelding komt.

`raakt` en `advies` zijn optioneel, en `wel_behandeld` mag helemaal ontbreken. Het bouwscript laat die kolommen dan weg. Zo blijven oudere boeken werken zonder dat ze eerst bijgewerkt hoeven te worden.

Voor `raakt` geldt één vaste schrijfwijze: opgavenummer met het gedrukte paginanummer tussen haakjes, paragrafen gescheiden door een punt in het midden. Bijvoorbeeld: `§2: 1-IV (44), 10a t/m 10f (47) · §5: 4a (47)`. Drie of meer opeenvolgende deelvragen op dezelfde pagina worden samengetrokken met "t/m".

### `index-<boek>.json`

```
boek        id, titel, niveau, lesboeklabel (optioneel), rekentip (optioneel), status
legenda     uitleg van W, D, S en van de velden stof, paragraaf, soort en blz
rijen[]
  bron                      "lesboek" of "oefenboekje"
  hoofdstuk, paragraaf      bij lesboek
  soort                     paragraaf, weet-je-het-nog, herhaling, plus, rekenen of examentraining
  sectie                    bij oefenboekje
  opgave                    "1a", "2-III", "10"
  omschrijving              wat de opgave vraagt, in eigen woorden
  wds                       "W", "D" of "S"
  tags[]                    "rekenen", "tekenen"
  blz                       gedrukt paginanummer, null bij oefenboekje
  stof                      true of false
  begrippen_of_vaardigheid  bij oefenboekje
  verwijzing                bij oefenboekje: waar de theorie staat
  onderwerpen[]             codes; leeg als stof false is
```

**Het veld `lesboeklabel`** is optioneel en bepaalt hoe het lesboek in de feedbacktool wordt genoemd, bijvoorbeeld `PE-boek`. Staat het er niet, dan maakt de tool er zelf een van `titel` en `niveau`: de boeknaam (het deel vóór de "·", zonder los jaartal) met de niveau-afkorting erachter. Pincode wordt zo "Pincode 4M", en een latere 3-mavo-index vanzelf "Pincode 3M". `controle.html` toont welk label eruit komt en of het expliciet is of afgeleid.

**Het veld `soort`** zegt in wat voor onderdeel van het hoofdstuk een opgave staat. `paragraaf` is een gewone paragraafopgave; de andere waarden horen bij de rubrieken die naast de paragrafen staan: `weet-je-het-nog`, `herhaling` (Herhalingsopdrachten), `plus` (Plusopdrachten), `rekenen` en `examentraining`. Boeken zonder die rubrieken hebben overal `paragraaf` staan, of laten het veld weg.

**Bij een rubriek bevat `paragraaf` de rubrieknaam**, dus "Weet je het nog?", "Herhalingsopdrachten", "Plusopdrachten", "Rekenen" of "Examentraining", en geen §-nummer. Dat is nodig omdat de opgavenummering per rubriek opnieuw begint: hoofdstuk 1 heeft een opgave 1 in §1.1, en ook een opgave 1 bij Rekenen. Pas met hoofdstuk + paragraaf + opgave is een regel uniek. In Pincode loopt alleen binnen de Herhalingsopdrachten de nummering door over het hele hoofdstuk.

**Het veld `rekentip`** is optioneel en hoort bij het boek, niet bij de algemene tiptekst. Hij wordt achter de tip bij rekenfouten geplakt, zodat die naar het oefenmateriaal van dát boek kan verwijzen. Pincode heeft Rekenopdrachten achter in elk hoofdstuk en een rekentrainer online; Praktische Economie heeft die rubrieken niet en laat het veld dus weg. Ontbreekt het, dan blijft de tip precies zoals hij in de tool staat.

### Toetsbestanden: `boek`, `stofafbakening` en onderwerpen per vraag

Een toets gebruikt de index en de onderwerpen pas als drie dingen kloppen. Alleen `"boek"` invullen doet niets zichtbaars.

- **`boek`**: het boek-id, bijvoorbeeld `"PE-M2"`. Daarmee laadt de tool `index-PE-M2.json` en `onderwerpen-PE-M2.json`.
- **`stofafbakening`**: `hoofdstukken` (de getoetste hoofdstukken), `extra` (losse codes erbij, meestal A-codes) en `uitgesloten` (codes eraf). Zonder dit blok blijft de handmatige lijst `nietGetoetst` staan en komt er geen berekende lijst "Niet alle stof is getoetst".
- **`onderwerpen` per vraag**: de codes die de vraag toetst. Een vraag zonder codes, of met `geenOefenadvies: true`, krijgt geen oefenopgaven.

**Oefenopgaven komen alleen uit de getoetste hoofdstukken.** Een opgave uit H3 kan ook een H1- of A-code dragen (een herhalingsopdracht, een rekensom). Zonder filter zou een leerling die alleen H1 heeft gehad die opgave aangeraden krijgen. `rijBinnenHoofdstukken` in `scripts/stofafbakening.js` houdt die buiten de deur. Bij lesboekregels telt het veld `hoofdstuk`; bij oefenboekjeregels wordt het hoofdstuk afgeleid uit de sectienaam ("1.3 …", "gemengd H2", "H2 §3"). Secties waaruit geen hoofdstuk valt af te leiden, zoals "gemengd M1" of "procenten", blijven altijd meedoen. Geef oefenboeksecties daarom een naam waar het hoofdstuk uit blijkt.

**`algemeneFeedback` verschijnt alleen bij `geenOefenadvies: true`.** Krijgt een vraag codes en dus oefenopgaven, dan valt die tekst weg. Zet een aanwijzing die moet blijven staan in `specifiek`; die verschijnt als "Tip van je docent".

**Na het koppelen van een toets:** zet hem in `BEKENDE_TOETSEN` in `controle.html` en controleer daar het label, de stofafbakening en de onderwerpen die niet getoetst zijn. Bovenaan die pagina draait een vaste controle op de toets PW M1 H1+H2. Verandert de rekenlogica bewust, pas dan de verwachte getallen aan en schrijf in het commentaar waarom.

### Toetsbestanden: `weergave`

**Elke toets voor 4 mavo krijgt `"weergave": "mavo"`.** Zonder dat veld valt de toets terug op de gewone (havo-)weergave, en dat is bij een mavotoets altijd een fout en geen keuze. Het veld is een opmaakkeuze voor de doelgroep en staat los van `boek`: het boek bepaalt waar de oefenverwijzingen vandaan komen, de weergave bepaalt hoe de feedback eruitziet.

Wat de mavo-weergave doet, op scherm en in de pdf tegelijk:

- **Geen W/D/S-blok.** "Bij welk vraagniveau valt voor jou winst te halen?" vervalt in zijn geheel, inclusief de paginawissel die er in de pdf bij hoort.
- **Niet-getoetste stof als percentage.** In plaats van de volledige lijst met onderwerpen komt er één zin onder de kop "Hoeveel van de stof is getoetst?".
- **Mavoteksten bij alle vijf de fouttypen.** `FOUTTYPEN_MAVO` in `feedbacktool.html` overschrijft de tekst van reken, lees, begrip, redeneer en overig. Alleen redeneer wijzigt ook zijn label, naar "Uitlegfout". Brengt een toets eigen `fouttypen` mee, dan gaat deze overschrijving er bewust af.
- **Geen versie in de leerlingregel van de pdf.** Bij de SE-versies staat de versie al in de toetstitel; hem ook achter naam en docent zetten levert een dubbeling op.
- **Dezelfde scorezin als op het scherm:** "Je haalde X van de Y punten (Z%)." De havo-weergave houdt "Op basis van de gegeven informatie haal je …".

De havo-variant blijft bewust ongemoeid tot die weer aan de beurt is. Dat betekent concreet: raak `FOUTTYPEN` en de fouttypen van de ingebouwde toets niet aan, en zet mavoteksten nooit in de gedeelde bibliotheek maar altijd in het overschrijfblok.

---

## 7. WDS en tags

- **W = Weten**: een begrip, feit of definitie ophalen of herkennen.
- **D = Doen**: een vaardigheid uitvoeren, zoals rekenen, een tabel invullen, een grafiek tekenen of aflezen, of een regel toepassen op een concreet geval.
- **S = Snappen**: uitleggen, verklaren, beredeneren, een verband leggen of een onderbouwd oordeel geven.

Het toepassen van een definitie op een concreet geval is **D, niet W**. Gevolg: lesboeken leveren bijna geen W-opgaven, omdat vrijwel elke vraag in een context staat. In M1 hoofdstuk 1 was er precies één. Herclassificeer daar niet omheen. De oplossing is dat W-feedback verwijst naar de begrippenlijst en naar zelfgemaakte theorievragen, niet naar boekopgaven. Een begrip leer je niet door nog een contextopgave te maken.

Omdat D te breed is, verfijnen twee tags dat niveau:

- `rekenen`: er moet gerekend worden
- `tekenen`: er moet getekend worden

Automatisch toekennen op de omschrijving werkt, maar controleer handmatig. Indexomschrijvingen wisselen soms tussen "berekenen" en "bepalen" voor dezelfde handeling. In M1 stond bij één opgavenreeks bij a tot en met e "berekenen" en bij f "bepalen", terwijl het dezelfde reeks was.

---

## 8. Werkwijze per boek

1. **Brondocumenten inlezen.** Index van het lesboek, index van het oefenboekje, en het oefenboekje zelf voor de begrippenlijst.
2. **Onderwerpen ontwerpen per hoofdstuk**, met hoofdstuk 5 als richtlijn. Eerst voorleggen, dan pas doorwerken.
3. **Elke opgave koppelen.** Een opgave mag aan meerdere onderwerpen hangen, ook aan een onderwerp uit een ander hoofdstuk. In M1 raakten negen opgaven uit hoofdstuk 2 en 3 stof uit een eerder hoofdstuk. Die kruisverbanden zijn waardevol: zonder die koppeling zou een leerling met een gat bij schaarste de bijbehorende oefening uit hoofdstuk 3 nooit te zien krijgen.
4. **Valideren.** Drie controles die altijd moeten slagen:
   - elke code die in de index voorkomt bestaat in het onderwerpenbestand
   - elk onderwerp wordt door minstens één opgave gebruikt
   - elke regel met `stof: true` heeft minstens één onderwerp
   - geen enkele regel met `stof: false` draagt nog een code
   - elk onderwerp komt minstens vier keer als enige code op een regel voor (A-codes met een vaste `feedback` uitgezonderd)
5. **Het lesboeklabel zetten.** Vul `lesboeklabel` in het `boek`-blok van de index en controleer in `controle.html` hoe het lesboek in de feedback genoemd wordt. Doe je dat niet, dan leidt de tool zelf een naam af uit `titel` en `niveau`, en dat is niet altijd de naam die leerlingen moeten lezen: Praktische Economie Module 2 zou zonder label "Praktische Economie 4H" worden in plaats van "PE-boek".
6. **Controleoverzicht genereren** als leesbaar markdownbestand. Een JSON is niet te controleren, een tabel per onderwerp met de opgaven eronder wel.
7. **Voorleggen per hoofdstuk**, niet pas aan het eind.
8. **Docx genereren** uit de JSON, pas als alles klaar is.

---

## 9. Opmaak van de gegenereerde documenten

Gebaseerd op de bestaande indexen, zodat alle boeken er hetzelfde uitzien.

- A4 staand, marges 1134 dxa (2 cm) rondom
- Calibri; tekst in tabellen 9 pt, lopende tekst 10 pt
- Tabelbreedte 9638 dxa; zowel `columnWidths` op de tabel als `width` op elke cel, beide in DXA
- Randen zwart. Buitenrand 1 pt (`size: 8`), binnenlijnen 0,5 pt (`size: 4`). **Nooit dunne grijze randen**, die verdwijnen bij het printen
- Kopcellen met arcering `DCE8F4`, type `CLEAR` (nooit `SOLID`, dat rendert zwart)
- Celmarges: boven en onder 60, links en rechts 100
- Rijen met `cantSplit`, zodat een regel niet over twee pagina's breekt
- Koprij met `tableHeader`, zodat hij op elke pagina meeloopt
- Automatische inhoudsopgave met de `TableOfContents`-klasse, `headingStyleRange: "1-2"` en `updateFields: true`
- Sorteer op code, en toon niveaus in de volgorde W/D/S, niet alfabetisch

### Index van het lesboek

`node scripts/index-docx.js <boek-id>`, bijvoorbeeld `node scripts/index-docx.js PE-M2`. Zonder argument bouwt het script PE-M1. Hoofdstuk- en paragraafnamen staan in het script zelf, in de tabel `BOEKEN`, zodat de databestanden die de site inleest niet hoeven te veranderen.

Opbouw: titel, inleiding, inhoudsopgave, onderwerpenlijst, dan per hoofdstuk de paragraaftabellen gevolgd door twee overzichten, en tot slot de aandachtspunten.

| Tabel | Kolommen | Breedtes |
|---|---|---|
| Opgaven per paragraaf | Opgave · Onderwerp van de opgave · Code · WDS · Blz. · Stof | 800 / 4638 / 2200 / 700 / 650 / 650 |
| Onderwerpenlijst | Code · Onderwerp · Begrippen · Niveaus · Opgaven | 1100 / 2500 / 4038 / 1000 / 1000 |
| Buiten de toetsstof | Onderwerp of begrip · Waar in het boek · Waarom buiten de stof · Raakt opgaven · Advies | naar rato, 26/18/24/24/18 |
| Wel behandeld, niet in de begrippenlijst | Begrip · Waar in het boek · Raakt opgaven · Toelichting | naar rato, 20/17/27/36 |
| Aandachtspunten | Betreft · Toelichting | 2400 / 7238 |

De laatste twee kolommen van "Buiten de toetsstof" vervallen als geen enkele regel ze heeft ingevuld, en de tabel "Wel behandeld" vervalt als `wel_behandeld` ontbreekt. Onder de tabel met de A-codes drukt het script de vaste feedbacktekst af van elke code die er een heeft.

### Index van het oefenboekje

`node scripts/oefenboekje-docx.js <boek-id>`. Kolommen: Opgave · Onderwerp van de opgave · Begrippen · Code · WDS · Verwijzing, met breedtes 800 / 3000 / 2100 / 2038 / 700 / 1000. Bij de Basisvaardigheden vervangt de kolom Vaardigheid de kolom Begrippen en is de verwijzing "Domein A". Per sectie staat de beginpagina in de kop.

### Bouwen en controleren

```bash
export NODE_PATH=/usr/local/lib/node_modules_global
node scripts/index-docx.js PE-M2
```

Voor de visuele controle moet `updateFields` uit een kopie worden gestript, anders blijft LibreOffice hangen op de vraag of het veld bijgewerkt moet worden:

```bash
mkdir chk && cd chk && unzip -q ../Index_M2_PE.docx
python3 -c "import re; p='word/settings.xml'; x=open(p,encoding='utf-8').read(); open(p,'w',encoding='utf-8').write(re.sub(r'<w:updateFields[^/]*/>','',x))"
zip -Xrq ../check.docx . && cd ..
soffice --headless --convert-to pdf --outdir . check.docx
pdftoppm -jpeg -r 80 check.pdf p
```

Bekijk de afbeeldingen daarna echt. Renderen zonder kijken telt niet als controle. De inhoudsopgave is in die controlekopie leeg; dat is normaal, Word vult hem bij het openen.

---

## 10. Val niet in deze kuilen

Geleerd tijdens M1 en M2.

**Verzin nooit een gegeven dat niet in de bron staat.** Bij het vastleggen van een vindplaats stond er "blz. 41" terwijl dat nergens uit de documenten bleek. Staat het er niet, schrijf dan op dat het ontbreekt en vraag het na. Een geschat paginanummer is niet te onderscheiden van een gecontroleerd paginanummer zodra het eenmaal in het bestand staat.

**Controleer paginanummers tegen de inhoudsopgave én tegen het boek zelf.** In de oefenboekje-index van M1 stonden vier paginanummers verkeerd, en dat bleek pas veel later. De door Word berekende inhoudsopgave in het document zelf is de betrouwbaarste bron, en een conversie naar PDF bevestigt het. Maar de inhoudsopgave is niet genoeg: in M2 week een aantal beginpagina's ervan af en moest de PDF van het boek het laatste woord krijgen. Leg ook vast of het gedrukte paginanummer gelijkloopt met het PDF-paginanummer; in M2 was dat zo, in andere boeken niet.

**Let op synoniemen tussen boek en begrippenlijst.** Het boek gebruikte "spaarmiddel" waar de begrippenlijst "oppotmiddel" zegt. Zonder synoniem breekt de koppeling zodra iemand de boekterm gebruikt in een toetsvraag. Loop de begrippenlijst en de leertekst hierop na.

**Neem de aandachtspunten uit de bestaande index over.** Die bevatten vaak al de botsingen tussen begrippenlijst en boek. In M1 stonden er vier die anders opnieuw ontdekt hadden moeten worden.

**Schrijf aandachtspunten neutraal.** Deze documenten worden door collega's gelezen. Geen namen, geen "Mathijs gaat nog".

**Controleer de automatisch toegekende tags.** Toekennen op trefwoord in de omschrijving werkt, maar struikelt over woorden die een trefwoord bevatten. In M2 matchte "minteken" op *teken*, "gearceerd" op *arceer* en "zonder berekening" op *bereken*. Gebruik woordgrenzen en negatieve uitzonderingen, en loop de treffers daarna met het oog na.

**Nummers in een boek zijn niet altijd uniek.** In M2 dragen twee verschillende bronnen het nummer 9. Ga er niet van uit dat een bronverwijzing eenduidig is zonder paragraaf of pagina erbij.

**Een schrapping werkt door in meer opgaven dan je denkt.** Toen in M2 de marginale kosten als startpunt van de aanbodlijn uit de stof gingen, bleek dat naast de twee opgaven die het begrip noemen nog acht opgaven te raken die stilzwijgend MK = p toepassen ("hoeveel produceert deze producent bij p = € 40"). Zoek na elke afbakeningsbeslissing op de *redenering*, niet alleen op het begrip.

**Bedenk wat een schrapping raakt.** Toen de vier voorwaarden om te ruilen uit de stof gingen, vervielen vijf opgaven, waaronder twee casussen die verder prima waren. Meld dat expliciet in plaats van het stil door te voeren.

**Signaleer onderwerpen zonder oefenmateriaal.** In M1 hadden twaalf van de 32 onderwerpen geen enkele rekenopgave, en had "monetair beleid" helemaal geen opgave binnen de toetsstof. Dat is precies het soort gat dat je vóór een toets wilt weten in plaats van erna.
