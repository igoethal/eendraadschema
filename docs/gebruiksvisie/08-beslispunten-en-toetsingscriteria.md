# Deel 8 — Beslispunten en toetsingscriteria voor toekomstige wijzigingen

## 1. Hoe dit document gebruikt wordt

Bij een toekomstige interface- of datamodelwijziging wordt niet alleen gevraagd “werkt de knop?”, maar ook:

- past de wijziging in het mentale model van één installatie met drie weergaven;
- blijft de identiteit van onderdelen behouden;
- blijft duidelijk wat ontbreekt;
- kan de gebruiker de actie herstellen;
- blijft de interface bruikbaar voor een niet-professionele gebruiker;
- blijft de commandolaag ook bruikbaar voor MCP-voorstellen.

## 2. Open productbeslissingen

### 2.1 Automatische kringnamen

Te beslissen:

- wanneer een kring automatisch A, B, C, enzovoort krijgt;
- hoe manuele namen en technische codes naast elkaar getoond worden;
- wat er gebeurt bij herschikken of verwijderen.

### 2.2 Eén of meerdere situatieplaatsingen

Te beslissen per onderdeeltype:

- maximumaantal plaatsingen;
- hoe groepen of meervoudige symbolen geteld worden;
- hoe de gebruiker onderscheid ziet tussen echte duplicaten en meerdere fysieke verschijningen.

### 2.3 Dossiercontroles versus juridische AREI-validatie

Te beslissen:

- welke controles algemene interne consistentie zijn;
- welke controles expliciet aan een AREI-versie gekoppeld zijn;
- hoe bron, versie en geldigheidsdatum zichtbaar worden;
- welke meldingen waarschuwing, fout of advies zijn.

### 2.4 Plaatsingstaken dedupliceren

Te beslissen of een technische open taak en een afgeleide ontbrekende plaatsing als één gebruikersmelding verschijnen.

### 2.5 Mobiele en tabletinterface

De huidige brede werkruimte gebruikt zijbalken. Te beslissen:

- of zijbalken op tablet als drawers openen;
- welke primaire actie altijd zichtbaar blijft;
- hoe slepen en plaatsen op een aanraakscherm werkt;
- vanaf welke schermbreedte de desktopindeling overschakelt.

### 2.6 Automatische bordindeling

Te beslissen:

- of de toepassing een eerste railindeling mag voorstellen;
- welke tussenruimtes of groeperingen gelden;
- hoe een voorstel verschilt van een door de gebruiker bevestigde fysieke indeling.

### 2.7 Herkoppelen van verweesde plaatsingen

Te beslissen of een verweesd situatiesymbool aan een nieuw of bestaand elektrisch onderdeel gekoppeld kan worden, en welke controles daarbij nodig zijn.

## 3. Toetsingsscenario's

Iedere belangrijke release hoort minstens de volgende flows te verifiëren.

### Scenario A — Nieuw dossier

1. Start een leeg dossier.
2. Vul de dossiergegevens in.
3. Maak een kring aan.
4. Controleer dat de kring onder het gekozen bord staat.
5. Controleer dat één undo de volledige kringcreatie terugdraait.

### Scenario B — Kring volledig afwerken

1. Open een kring.
2. Voeg een contactdoos en lichtpunt toe.
3. Plaats beide via “Nog te plaatsen”.
4. Plaats de kring in de bordindeling.
5. Controleer dat de kringkaart volledige tellers toont.
6. Spring vanuit iedere weergave naar hetzelfde onderdeel.

### Scenario C — Meerdere borden

1. Voeg een onderbord toe via een voedingskring.
2. Maak in dat bord een nieuwe kring.
3. Controleer bordtoewijzing, kruimelpad en bordindeling.
4. Controleer dat het hoofdbord en onderbord geen onderdelen mengen.

### Scenario D — Onderdeel verwijderen

1. Selecteer een geplaatst veldonderdeel.
2. Verwijder het elektrische onderdeel.
3. Controleer het gedrag van de situatieplaatsing.
4. Controleer dossiermeldingen en undo.

### Scenario E — MCP-voorstel

1. Laat een LLM de graaf raadplegen.
2. Vraag een concrete uitbreiding.
3. Controleer het voorstel vóór toepassing.
4. Keur goed.
5. Controleer selectie, plaatsingstaken en validatie.
6. Maak de volledige wijziging ongedaan.

## 4. UX-acceptatiecriteria

Een wijziging is pas bruikbaar wanneer:

- de gebruiker binnen één scherm kan zien in welk bord en welke kring hij werkt;
- de belangrijkste volgende actie herkenbaar is;
- ontbrekende situatiesymbolen zonder handmatige vergelijking gevonden worden;
- een onderdeel met maximaal één gerichte actie in een andere weergave teruggevonden wordt;
- compacte rijen niet veranderen in permanente formulieren;
- zijbalken de centrale tekening niet onnodig verstikken;
- toetsenbordfocus en toegankelijke namen aanwezig blijven;
- fouten herstelbaar en begrijpelijk zijn;
- afgeleide voortgang onmiddellijk na iedere wijziging bijgewerkt wordt.

## 5. Technische invarianties

De volgende regels horen onafhankelijk van de interface behouden te blijven:

1. De elektrische graaf is de bron voor de structuur.
2. Een onderdeel behoudt één identiteit over alle weergaven.
3. Situatie- en bordplaatsingen verwijzen naar bestaande onderdelen.
4. Classificatie van veld-, bord- en structuurelementen is centraal.
5. Validatie en voortgang worden afgeleid uit actuele gegevens.
6. Mutaties lopen via gevalideerde commands.
7. Samengestelde gebruikersacties zijn atomair en ongedaan te maken.
8. Een LLM kan niet buiten dezelfde regels om muteren.

## 6. Wijzigingslog voor deze visie

Bij aanpassing van deze documentatie wordt hier kort vermeld:

- datum;
- gewijzigd deel;
- genomen productbeslissing;
- reden;
- eventuele impact op gegevensmodel, interface of bestaande bestanden.

Eerste versie — 16 augustus 2026: initiële gebruiksvisie opgesplitst in acht delen.
