# Deel 4 — Werken in het situatieschema

## 1. Doel van deze weergave

Het situatieschema legt vast waar elektrische punten zich in de woning bevinden. Het is geen tweede plaats waar de elektrische installatie opnieuw wordt opgebouwd. De bron blijft het elektrische gegevensmodel.

## 2. Schermindeling

Op een breed scherm bestaat de weergave uit:

- links: de wachtrij “Nog te plaatsen”;
- midden: de actieve pagina met plattegrond en symbolen;
- rechts: eigenschappen en koppelingen van de actuele selectie;
- bovenaan: acties voor pagina, achtergrond, selectie, ordening en zoom.

De buitenste zijbalken blijven aanpasbaar en inklapbaar. De gebruiker kan zo tijdelijk meer ruimte aan de plattegrond geven zonder context te verliezen.

## 3. De wachtrij “Nog te plaatsen”

De linkerkolom beantwoordt voortdurend de vraag:

> Welke onderdelen uit het eendraadschema moeten nog op het situatieschema staan?

Ze toont:

- het aantal ontbrekende veldsymbolen;
- hoeveel van het totale aantal al geplaatst zijn;
- een visuele voortgangsbalk;
- een zoekveld;
- een filter per kring;
- per ontbrekend onderdeel de naam, kring en eventueel het adres;
- een directe knop “Plaats”.

Reeds geplaatste onderdelen nemen geen prominente ruimte in deze wachtrij in. Wanneer alles geplaatst is, toont de toepassing expliciet een groene voltooiingsmelding.

## 4. Een gekoppeld symbool plaatsen

De gebruiker kan een plaatsing starten vanuit:

- de wachtrij “Nog te plaatsen”;
- de sectie “Koppelingen” van een geselecteerd onderdeel;
- een andere contextactie die naar het situatieschema verwijst.

De flow is:

1. de gebruiker kiest “Plaats”;
2. de toepassing maakt een plaatsing die naar het bestaande elektrische onderdeel verwijst;
3. de nieuwe plaatsing wordt geselecteerd;
4. de gebruiker sleept ze naar de juiste positie;
5. schaal, rotatie, label en adres kunnen rechts aangepast worden;
6. de wachtrij en dossiercontrole worden onmiddellijk bijgewerkt.

Er wordt geen los duplicaat van het elektrische onderdeel gemaakt.

## 5. Meerdere plaatsingen van hetzelfde onderdeel

Sommige onderdeeltypes kunnen volgens hun model meer dan één ruimtelijke verschijning toelaten. Iedere verschijning krijgt een eigen plaatsingsidentiteit, maar verwijst naar hetzelfde elektrische onderdeel.

De koppelingenlijst benoemt deze als “plaatsing 1”, “plaatsing 2”, enzovoort. De gebruiker kan rechtstreeks naar een concrete plaatsing springen.

De toepassing bewaakt het maximumaantal toegelaten plaatsingen per type.

## 6. Plattegrond en pagina's

De gebruiker kan:

- een afbeelding als plattegrond importeren;
- de plattegrond passend laten schalen;
- pagina's toevoegen en verwijderen;
- de actieve pagina kiezen;
- in- en uitzoomen;
- de weergave passend maken.

Een grote achtergrondafbeelding kan opslag en afdrukken vertragen. De toepassing meldt wanneer een afbeelding automatisch verkleind werd of mogelijk zwaar is.

## 7. Selectie en ordening

Voor één of meerdere geselecteerde symbolen zijn acties beschikbaar zoals:

- selectie wissen;
- verwijderen;
- naar achter of naar voor brengen;
- uitlijnen;
- verdelen;
- dupliceren waar dat is toegestaan.

Het eigenschappenpaneel maakt duidelijk of de gebruiker één plaatsing of meerdere plaatsingen bewerkt.

## 8. Losse symbolen

Sommige symbolen horen uitsluitend bij de ruimtelijke tekening en hebben geen gewone plaats in het eendraadschema. De gebruiker kan daarvoor “Los symbool” kiezen.

Een los symbool wordt intern nog steeds beheerd en mag geen verweesde of oncontroleerbare tekeningselementen veroorzaken. De toepassing moet duidelijk onderscheiden:

- gekoppelde elektrische onderdelen;
- bewust losse situatiesymbolen;
- foutieve verwijzingen naar verwijderde onderdelen.

## 9. Verwijderen

Een plaatsing verwijderen verwijdert niet automatisch het elektrische onderdeel. Het onderdeel verschijnt daarna opnieuw in “Nog te plaatsen” wanneer een situatiesymbool vereist is.

Een elektrisch onderdeel verwijderen moet zijn gekoppelde plaatsingen gecontroleerd opruimen of als conflict melden. Verweesde plaatsingen worden als fout in het dossier opgenomen.
