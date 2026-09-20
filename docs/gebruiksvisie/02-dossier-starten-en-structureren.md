# Deel 2 — Een dossier starten en structureren

## 1. Het startpunt

Bij het openen van de toepassing krijgt de gebruiker een beperkt aantal duidelijke keuzes:

- een nieuw leeg dossier starten;
- een voorbeeld openen om de werking te leren kennen;
- een bestaand EDS-bestand openen;
- een automatisch bewaarde versie herstellen wanneer die beschikbaar is.

Een voorbeeld moet als leeromgeving herkenbaar blijven. De gebruiker moet weten dat hij het voorbeeld kan aanpassen en onder een nieuwe bestandsnaam bewaren.

## 2. Een nieuw dossier

Bij een nieuw dossier worden eerst de minimale installatieparameters gevraagd die nodig zijn om een bruikbare basisstructuur te maken, bijvoorbeeld het aantal fasen, de hoofdbeveiliging en de hoofddifferentieel.

Na bevestiging maakt de toepassing een geldige startstructuur aan. De gebruiker komt daarna in de dossierweergave terecht en niet midden in een lege tekenzone.

### Waarom de dossierweergave eerst komt

De dossierweergave geeft een antwoord op drie vragen:

1. Wat is al aanwezig?
2. Wat ontbreekt nog?
3. Wat is de meest logische volgende actie?

Ze bevat daarom:

- dossiergegevens;
- een compacte voortgangssamenvatting;
- een overzicht van de kringen;
- aandachtspunten;
- de primaire actie “Kring toevoegen”.

## 3. Dossiergegevens invullen

De gebruiker vult onder andere in:

- type installatie: nieuw, bestaand of wijziging/uitbreiding;
- adres van de installatie;
- nominale spanning;
- aard van de stroom;
- frequentie;
- documentversie;
- uitgiftedatum.

Deze gegevens worden afzonderlijk bewaard van de elektrische boom. Ze horen bij het dossier en worden gebruikt bij documentatie en uitvoer.

Ontbrekende kerngegevens verschijnen als aandachtspunt. Ze blokkeren het tekenen niet, maar de toepassing maakt zichtbaar dat het dossier nog niet klaar is voor finale controle.

## 4. Een kring toevoegen

De gebruiker kiest “Kring toevoegen”. Een begeleid venster vraagt de basisgegevens:

1. het verdeelbord;
2. een herkenbare kringnaam;
3. het type bescherming;
4. het aantal polen;
5. de nominale stroom;
6. of een kabel getoond moet worden;
7. het kabeltype.

Na bevestiging gebeurt dit als één bewerking:

- de kring wordt onder het werkelijke bordelement van het gekozen verdeelbord toegevoegd;
- de ingevoerde eigenschappen worden toegepast;
- de kring wordt als actuele selectie ingesteld;
- een vereiste plaatsing voor de bordindeling wordt geregistreerd;
- de gebruiker wordt naar het eendraadschema gebracht.

Eén keer “Ongedaan maken” moet de volledige creatie terugdraaien, niet alleen een deel van de ingevulde eigenschappen.

## 5. Meerdere verdeelborden

Wanneer een woning meerdere borden heeft, kiest de gebruiker eerst het actieve bord via de bordnavigator. Een bijkomend bord wordt gekoppeld aan de kring die het voedt.

De toepassing toont het voedingspad als kruimelpad, bijvoorbeeld:

> Hoofdbord → kring garage → garagebord

Bij ieder onderdeel moet duidelijk blijven tot welk bord het behoort. Een gebruiker mag niet per ongeluk onderdelen van verschillende borden in dezelfde bewerkingsboom of bordindeling mengen.

## 6. De compacte dossierweergave

De dossierweergave moet voldoende informatie tonen zonder een lange rapportpagina te worden.

### Voortgangstegels

De gebruiker ziet in één oogopslag:

- of de dossiergegevens ingevuld zijn;
- of er kringen zijn;
- of vereiste veldonderdelen op het situatieschema staan;
- of bordonderdelen in de bordindeling geplaatst zijn.

### Kringkaarten

Iedere kring wordt als compacte kaart getoond met:

- naam en verdeelbord;
- aantal geplaatste versus vereiste situatiesymbolen;
- aantal geplaatste versus vereiste bordcomponenten;
- aantal openstaande plaatsingstaken;
- een knop om de kring te openen.

### Aandachtspunten

De belangrijkste aandachtspunten staan onder de kringkaarten. Een melding over een concreet onderdeel bevat een actie “Open”, zodat de gebruiker niet zelf naar het betrokken item hoeft te zoeken.

## 7. Verder werken na een onderbreking

Wanneer een bestaand bestand opnieuw geopend wordt, reconstrueert de toepassing de voortgang uit de gegevens. De gebruiker hoeft geen handmatige takenlijst bij te houden. Ontbrekende situatiesymbolen, bordplaatsingen en dossiergegevens worden opnieuw afgeleid.
