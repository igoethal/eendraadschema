# Deel 6 — Koppelingen, volledigheid en controle

## 1. Waarom koppelingen zichtbaar moeten zijn

Een gebruiker mag er niet op moeten vertrouwen dat twee gelijknamige symbolen toevallig hetzelfde voorstellen. De toepassing kent de relatie en moet ze ook zichtbaar maken.

Bij ieder geselecteerd onderdeel toont de sectie “Koppelingen”:

- de herkenbare naam van het onderdeel;
- het verdeelbord;
- de kring;
- een actie naar het eendraadschema;
- bestaande situatieschema-plaatsingen of een actie om er één te maken;
- de bordplaatsing of een actie naar de bordindeling wanneer relevant.

## 2. Springen tussen weergaven

Wanneer de gebruiker vanuit een koppeling naar een andere weergave gaat:

1. opent de juiste werkweergave;
2. wordt het juiste bord of de juiste pagina actief;
3. worden de nodige boomtakken opengeklapt;
4. wordt het gekoppelde onderdeel of de plaatsing geselecteerd;
5. wordt het visueel benadrukt en indien nodig in beeld gebracht.

De selectiecontext blijft behouden. Alleen van tab wisselen zonder de bestemming zichtbaar te maken is onvoldoende.

## 3. Volledigheid wordt afgeleid

De toepassing bewaart niet apart een handmatig vinkje “voltooid”. Ze berekent de status uit de actuele installatie:

- Heeft ieder vereist veldonderdeel minstens één geldige situatieplaatsing?
- Heeft ieder vereist bordonderdeel een geldige bordplaatsing?
- Zijn de vereiste dossiergegevens ingevuld?
- Bestaan alle verwijzingen nog?
- Zijn er openstaande plaatsingstaken?

Hierdoor kan de status niet verouderen wanneer een onderdeel of plaatsing later gewijzigd wordt.

## 4. Soorten aandachtspunten

### Ontbrekende situatieplaatsing

Een veldonderdeel staat in het elektrische model maar nog niet op het situatieschema.

Gewenste actie: open of plaats het onderdeel rechtstreeks.

### Ontbrekende bordplaatsing

Een bordcomponent bestaat in het elektrische model maar staat nog niet op een rail.

Gewenste actie: open het juiste bord en plaats de component.

### Verweesde situatieplaatsing

Een situatiesymbool verwijst naar een elektrisch onderdeel dat niet meer bestaat.

Dit is een fout en geen gewone open taak. De gebruiker moet de plaatsing verwijderen of opnieuw koppelen zodra herkoppeling ondersteund wordt.

### Ontbrekende dossiergegevens

Een noodzakelijk administratief veld is leeg.

Gewenste actie: open de dossiergegevens en vul het ontbrekende veld in.

### Open plaatsingstaak

Een eerdere bewerking heeft expliciet vastgelegd dat een onderdeel nog in een andere weergave geplaatst moet worden.

## 5. Prioriteit en dubbelmeldingen

De huidige gegevens kunnen zowel een ontbrekende plaatsing als een open plaatsingstaak voor hetzelfde onderdeel opleveren. Voor de gebruiker moeten die waar mogelijk als één begrijpelijke opdracht gepresenteerd worden.

**Te beslissen:** aandachtspunten verder dedupliceren tot één taak per onderdeel en bestemming, of de technische taak en de afgeleide controle apart zichtbaar houden in een geavanceerde controleweergave.

## 6. Controle per kring en per dossier

De dossierweergave toont een samenvatting per kring. De contextinspecteur toont alleen controles die relevant zijn voor het geselecteerde onderdeel.

De gebruiker werkt daardoor op twee niveaus:

- lokaal: “Is deze kring volledig?”;
- globaal: “Is het volledige dossier klaar voor nazicht en uitvoer?”

## 7. Betekenis van “klaar voor review”

“Klaar voor review” betekent:

- geen gekende interne inconsistenties;
- geen ontbrekende vereiste plaatsingen;
- geen ontbrekende kerngegevens volgens de toepassing;
- geen openstaande plaatsingstaken.

Het betekent niet automatisch dat de installatie juridisch conform is of een keuring zal doorstaan. Die formulering moet in de interface ondubbelzinnig blijven.
