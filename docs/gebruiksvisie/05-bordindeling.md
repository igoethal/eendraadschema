# Deel 5 — Werken in de bordindeling

## 1. Doel van de bordindeling

De bordindeling beschrijft de fysieke organisatie van beveiligingen en andere bordcomponenten. Ze gebruikt dezelfde onderdelen als het eendraadschema en is geen los getekende kast.

## 2. Een bord kiezen

De gebruiker kiest het actieve verdeelbord in de bordnavigator. Alleen onderdelen die tot dat bord behoren, mogen in de bijbehorende bordindeling geplaatst worden.

Bij een onderbord toont het voedingspad hoe het met het hoofdbord verbonden is. Dit voorkomt dat de gebruiker een automaat in het verkeerde bord plaatst.

## 3. Welke onderdelen verschijnen hier?

De toepassing classificeert onderdelen centraal als:

- veldonderdeel: hoort typisch op het situatieschema;
- bordonderdeel: hoort typisch in de bordindeling;
- structuurelement: heeft geen afzonderlijke plaatsing nodig.

Voorbeelden van bordonderdelen zijn kringen en specifieke componenten die fysiek in het bord zitten. Een bord of aansluiting zelf is een structuurelement en wordt niet als module op een rail geplaatst.

Deze classificatie is één centrale productregel. Ze mag niet apart en tegenstrijdig in iedere weergave worden geïmplementeerd.

## 4. Rails instellen

De gebruiker kan per bord één of meer rails toevoegen. Per rail worden minstens bijgehouden:

- naam of volgnummer;
- modulecapaciteit;
- bestaande plaatsingen.

Rails worden in een duidelijke fysieke volgorde getoond.

## 5. Een component plaatsen

Niet-geplaatste bordonderdelen staan als beschikbare items bij het actieve bord. De gebruiker kiest een rail, startmodule en modulebreedte.

De toepassing controleert:

- of het onderdeel bij het actieve bord hoort;
- of de rail bestaat;
- of de modulepositie binnen de rail valt;
- of de component niet met een andere plaatsing overlapt;
- of hetzelfde onderdeel niet dubbel in hetzelfde bord geplaatst wordt.

Na plaatsing worden de dossierstatus en de koppelingen onmiddellijk bijgewerkt.

## 6. Verplaatsen en verwijderen

Een bordplaatsing verwijderen verwijdert alleen de fysieke plaatsing, niet de kring of component uit het eendraadschema. Het onderdeel verschijnt opnieuw als “nog te plaatsen” in de bordindeling en als aandachtspunt in het dossier.

Wanneer een rail verwijderd wordt, mag dat niet stilzwijgend geplaatste componenten wissen. De gebruiker moet eerst de afhankelijkheden oplossen of de gevolgen expliciet bevestigen.

## 7. Eigenschappen en koppelingen

Bij selectie toont het rechterpaneel:

- het onderdeel en zijn kring;
- het actieve bord;
- rail, startmodule en breedte;
- een koppeling naar het eendraadschema;
- plaatsingsstatus en relevante checks.

De gebruiker moet vanuit de bordindeling met één actie terug kunnen naar hetzelfde onderdeel in de elektrische structuur.

## 8. Uitvoer

De bordindeling kan als afzonderlijke afdrukpagina of SVG-weergave opgenomen worden. De uitvoer vermeldt minstens het verdeelbord en de railstructuur. Een bord zonder rails krijgt een duidelijke lege toestand in plaats van een misleidende blanco pagina.
