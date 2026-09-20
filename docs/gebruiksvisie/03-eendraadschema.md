# Deel 3 — Werken in het eendraadschema

## 1. Schermindeling

De werkruimte bestaat op een breed scherm uit drie zones:

- links: bordkeuze, zoeken en elektrische hiërarchie;
- midden: de gegenereerde tekening;
- rechts: context, koppelingen, controles en eigenschappen.

De linker- en rechterzijbalk kunnen versleept, met het toetsenbord verbreed of versmald, en tijdelijk ingeklapt worden. Dubbelklikken op een resize-rand herstelt de standaardbreedte. Op smallere schermen verdwijnen de vaste zijbalken zodat de centrale inhoud bruikbaar blijft.

## 2. De elektrische hiërarchie lezen

De boom wordt van voeding naar verbruiker gelezen. Inspringing betekent dat een onderdeel elektrisch onder een ander onderdeel valt.

De boom toont standaard compacte rijen. Alleen de geselecteerde rij toont aanvullende bewerkingsmogelijkheden. Dat voorkomt dat typekeuzes, verplaatsknoppen en verwijderknoppen de volledige structuur visueel overheersen.

De gebruiker kan:

- takken open- en dichtklappen;
- met pijltoetsen door zichtbare rijen navigeren;
- zoeken op type, naam, nummer, adres of tekst;
- een onderdeel selecteren;
- het type aanpassen wanneer de structuur dit toelaat;
- een onderdeel omhoog of omlaag verplaatsen;
- dupliceren, uitpakken of verwijderen;
- een kindonderdeel toevoegen.

## 3. Logische symboolkeuze

Keuzelijsten met onderdeeltypes worden gegroepeerd volgens gebruik:

- structuur en verdeling;
- stopcontacten en aansluitingen;
- verlichting en bediening;
- toestellen en verbruikers;
- energie en beveiliging;
- overige symbolen.

Alleen types die op de gekozen plaats structureel toegestaan zijn, worden aangeboden. De groepering helpt zoeken, maar verandert de technische regels niet.

## 4. Onderdelen toevoegen

De voorkeurswerkwijze is:

1. selecteer de kring of het bovenliggende onderdeel;
2. kies in “Onderdeel toevoegen” het gewenste type;
3. bevestig met “Toevoegen”;
4. vul rechts de eigenschappen in;
5. controleer onmiddellijk de gegenereerde tekening.

Daarnaast kunnen plusknoppen op de getekende takken gebruikt worden om een onderdeel op een concrete positie tussen of na bestaande symbolen in te voegen.

De toepassing bewaakt de geldige ouder-kindrelaties en maximumaantallen. Een ongeldige toevoeging wordt geweigerd met een gerichte melding.

## 5. Interactie met de gegenereerde tekening

De tekening is geen passieve afdrukvoorbeeldzone. Symbolen in de SVG dragen de identiteit van het bijbehorende onderdeel.

Wanneer de gebruiker:

- over een symbool beweegt, wordt het visueel benadrukt;
- op een symbool klikt, wordt dezelfde rij in de hiërarchie geselecteerd;
- een rij in de hiërarchie selecteert, wordt het overeenkomstige symbool benadrukt;
- via zoeken naar een onderdeel gaat, worden de nodige voorouders opengeklapt.

De huidige selectie moet na een wijziging herkenbaar blijven, zolang het onderdeel nog bestaat.

## 6. Eigenschappen en context

Het rechterpaneel heeft drie logische secties:

### Details

Toont de eigenschappen die bij het geselecteerde type horen. Veelgebruikte velden staan vooraan. Minder gebruikelijke instellingen staan onder “Geavanceerde instellingen”.

### Koppelingen

Toont:

- het huidige verdeelbord;
- de huidige kring;
- een actie naar het eendraadschema;
- bestaande plaatsingen op het situatieschema;
- een actie om een ontbrekend situatiesymbool te plaatsen;
- een actie naar de bordindeling voor bordcomponenten.

### Checks

Toont de controles en open plaatsingstaken die relevant zijn voor de huidige context.

## 7. Bewerken en ongedaan maken

Elke normale grafbewerking publiceert een nieuwe documentversie. Ongedaan maken en opnieuw uitvoeren werken op betekenisvolle gebruikersacties.

Voorbeelden van één actie:

- een kring met basisgegevens maken;
- een onderdeel toevoegen;
- een eigenschap wijzigen;
- een onderdeel verplaatsen;
- een goedgekeurd MCP-wijzigingsvoorstel toepassen.

Na een verwijdering worden selecties en gekoppelde bordplaatsingen gereconcilieerd. Verwijderen van een bord of deelboom met afhankelijke onderdelen wordt geblokkeerd of expliciet bevestigd.
