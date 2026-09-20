# Deel 1 — Uitgangspunten en mentaal model

## 1. De gebruiker vertrekt van zijn woning, niet van tekensoftware

De typische gebruiker is geen professioneel tekenaar. Hij kent zijn woning, kamers, stopcontacten, lichtpunten en zekeringkast, maar kent niet noodzakelijk alle grafische conventies of technische termen.

De toepassing vraagt daarom niet om lijnen en symbolen vrij te tekenen. De gebruiker beschrijft de installatie als een structuur:

1. de aansluiting voedt een bord;
2. een bord bevat kringen;
3. een kring heeft een beveiliging en kabel;
4. onder een kring bevinden zich elektrische punten en verbruikers;
5. relevante punten krijgen een plaats op het situatieschema;
6. relevante bordcomponenten krijgen een plaats in de bordindeling.

Het eendraadschema wordt uit die structuur gegenereerd. Vrij tekenen is alleen aangewezen waar het gegevensmodel een uitzonderlijke situatie nog niet voldoende kan uitdrukken.

## 2. Eén onderdeel, één identiteit

Ieder elektrisch onderdeel krijgt intern één stabiele identiteit. Die identiteit blijft dezelfde wanneer het onderdeel zichtbaar is in:

- de hiërarchische boom;
- de gegenereerde tekening van het eendraadschema;
- één of meer plaatsingen op het situatieschema;
- de bordindeling;
- controles en aandachtspunten;
- een vraag of wijzigingsvoorstel van een LLM.

De gebruiker mag deze technische identiteit niet hoeven kennen. Hij ziet herkenbare namen zoals “Kring A — stopcontacten keuken” of “Contactdoos 3 — werkblad”. De identiteit zorgt er achter de schermen voor dat selecteren, zoeken, aanpassen en verwijderen overal coherent blijft.

## 3. De drie weergaven hebben verschillende verantwoordelijkheden

### Eendraadschema

Beantwoordt vooral:

- Hoe is de installatie elektrisch opgebouwd?
- Door welk bord en welke kring wordt een onderdeel gevoed?
- Welke beveiliging en kabel horen bij de kring?
- Welke onderdelen volgen elektrisch op elkaar?

### Situatieschema

Beantwoordt vooral:

- Waar bevindt het elektrische punt zich in de woning?
- Op welke verdieping en pagina staat het?
- Welke nog vereiste punten zijn nog niet geplaatst?

### Bordindeling

Beantwoordt vooral:

- In welk verdeelbord zit een component?
- Op welke rail en modulepositie bevindt hij zich?
- Is er voldoende vrije ruimte en zijn er overlappingen?

Geen enkele weergave mag een losstaande kopie van de installatie worden. Een wijziging aan het onderdeel zelf moet doorwerken in alle afgeleide weergaven.

## 4. Kringen vormen de natuurlijke werkeenheid

Voor een particuliere gebruiker is “één kring afwerken” begrijpelijker dan “één volledige tekening afwerken”. De voorkeursflow is daarom:

1. maak of kies een kring;
2. stel de basisgegevens van de kring in;
3. voeg de elektrische punten van die kring toe;
4. plaats de punten op het situatieschema;
5. plaats de beveiliging in de bordindeling;
6. los de resterende aandachtspunten van die kring op;
7. ga verder met de volgende kring.

De dossierweergave toont voortgang per kring zodat de gebruiker altijd opnieuw kan instappen zonder te moeten onthouden waar hij gebleven was.

## 5. Selectie is globale context

Wanneer de gebruiker een onderdeel selecteert, wordt dat de actuele context. De toepassing gebruikt die context om:

- het overeenkomstige symbool in de tekening te markeren;
- de juiste eigenschappen te tonen;
- het bovenliggende bord en de kring te vermelden;
- bestaande plaatsingen te tonen;
- een ontbrekende plaatsing te laten aanmaken;
- rechtstreeks naar dezelfde context in een andere weergave te springen.

Een overstap tussen weergaven mag dus niet voelen alsof de gebruiker opnieuw moet zoeken.

## 6. Progressieve complexiteit

De interface toont eerst wat voor de meeste gebruikers nodig is. Geavanceerde elektrische eigenschappen blijven beschikbaar, maar domineren het scherm niet.

Voorbeelden:

- Bij het maken van een kring worden alleen bord, naam, bescherming, polen, stroom en kabel gevraagd.
- Meer gespecialiseerde eigenschappen worden nadien in het eigenschappenpaneel ingesteld.
- In de hiërarchie verschijnen bewerkingsknoppen en typekeuze alleen bij de geselecteerde rij.
- Ontbrekende situatiesymbolen worden in een gerichte wachtrij getoond, niet tussen alle reeds afgewerkte onderdelen.

## 7. Veiligheid en herstelbaarheid

Normale bewerkingen moeten ongedaan gemaakt kunnen worden. Destructieve handelingen vereisen een duidelijke bevestiging wanneer ze meerdere onderdelen of gekoppelde plaatsingen kunnen beïnvloeden.

Een foutmelding moet steeds beantwoorden:

- wat kon niet uitgevoerd worden;
- waarom niet;
- wat de gebruiker vervolgens kan doen.

Een fout mag nooit stilzwijgend een gedeeltelijk gewijzigde installatie achterlaten.
