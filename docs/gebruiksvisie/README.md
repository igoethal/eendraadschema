# Gebruiksvisie voor de AREI-planningstoepassing

Status: werkdocument voor bespreking  
Taal en doelgroep: Nederlands/Vlaams, in de eerste plaats particuliere gebruikers  
Laatste herziening: 16 augustus 2026

## Doel van deze documentatie

Deze documentatie beschrijft hoe een gebruiker volgens de huidige productvisie met de toepassing werkt. Ze is geen handleiding per knop en evenmin een juridische interpretatie van het AREI. Ze legt vooral vast:

- welk mentaal model de toepassing aan de gebruiker aanbiedt;
- in welke volgorde iemand een elektrisch dossier opbouwt;
- hoe het eendraadschema, het situatieschema en de bordindeling met elkaar verbonden zijn;
- welke informatie op ieder ogenblik zichtbaar en bewerkbaar moet zijn;
- waar de toepassing fouten, ontbrekende plaatsingen en onvolledige dossiergegevens moet signaleren;
- hoe een lokale LLM via MCP kan helpen zonder de gebruiker de controle te ontnemen;
- welke productbeslissingen bij toekomstige wijzigingen opnieuw geëvalueerd moeten worden.

De centrale productgedachte is:

> De gebruiker maakt één elektrische installatie als gegevensmodel. Het eendraadschema, het situatieschema en de bordindeling zijn drie gekoppelde weergaven van diezelfde installatie.

## De delen

1. [Uitgangspunten en mentaal model](01-uitgangspunten-en-mentaal-model.md)
2. [Een dossier starten en structureren](02-dossier-starten-en-structureren.md)
3. [Werken in het eendraadschema](03-eendraadschema.md)
4. [Werken in het situatieschema](04-situatieschema.md)
5. [Werken in de bordindeling](05-bordindeling.md)
6. [Koppelingen, volledigheid en controle](06-koppelingen-en-controle.md)
7. [Bestanden, uitvoer en LLM/MCP-assistentie](07-bestanden-uitvoer-en-mcp.md)
8. [Beslispunten en toetsingscriteria voor toekomstige wijzigingen](08-beslispunten-en-toetsingscriteria.md)

## Terminologie

| Term | Betekenis in de toepassing |
|---|---|
| Dossier | De overkoepelende werkruimte met gegevens, voortgang, kringen en aandachtspunten. Het dossier is geen vierde wettelijk schema. |
| Eendraadschema | De grafisch gegenereerde elektrische structuur van aansluiting, borden, kringen en onderdelen. |
| Situatieschema | De ruimtelijke plaatsing van elektrische punten op een schets of plattegrond van de woning. |
| Bordindeling | De fysieke ordening van automaten en andere bordcomponenten op DIN-rails. |
| Kring | Een elektrische stroomkring met beveiliging, kabelgegevens en onderliggende verbruikers of punten. |
| Onderdeel | Eén identificeerbaar object in de elektrische installatie, zoals een contactdoos, lichtpunt of kring. |
| Plaatsing | Een verschijning van een onderdeel in een ruimtelijke of fysieke weergave. |
| Koppeling | De relatie tussen hetzelfde onderdeel in het gegevensmodel en zijn verschijningen in de drie weergaven. |
| Aandachtspunt | Een afgeleide melding over ontbrekende gegevens, plaatsingen of inconsistente verwijzingen. |

## Statusaanduidingen in deze teksten

- **Huidig gedrag** beschrijft functionaliteit die in de huidige interface aanwezig is.
- **Beoogd gedrag** beschrijft de productregel waaraan toekomstige implementaties moeten blijven voldoen.
- **Te beslissen** markeert een onderwerp waarvoor nog een expliciete productkeuze nodig is.

## Juridische afbakening

De toepassing helpt een gebruiker bij het samenstellen van de vereiste documentatie, maar vervangt geen keuring, vakkennis of actuele juridische controle. AREI-regels, interpretaties en vereisten kunnen wijzigen. Juridische validatieregels horen daarom traceerbaar, versieerbaar en afzonderlijk van algemene gebruikscontroles te worden beheerd.
