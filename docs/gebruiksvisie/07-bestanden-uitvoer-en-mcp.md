# Deel 7 — Bestanden, uitvoer en LLM/MCP-assistentie

## 1. Bestanden openen en bewaren

De gebruiker kan een bestaand EDS-bestand openen en het actieve dossier bewaren. Bestandsacties staan in één herkenbare dialoog en in de bovenste werkbalk.

De interface maakt onderscheid tussen:

- handmatig bewaren;
- automatisch bewaren in de browser;
- herstellen uit browseropslag;
- een document openen;
- een document samenvoegen of toevoegen wanneer die functie gebruikt wordt.

De statusbalk toont de bestandsnaam en of er niet-bewaarde wijzigingen zijn.

## 2. Ongedaan maken in verschillende werkmodi

De elektrische graaf en het situatieschema hebben historisch verschillende bewerkingsmechanismen. Voor de gebruiker moeten de knoppen “Ongedaan” en “Opnieuw” steeds op de actieve werkcontext slaan.

Een toekomstige verdere migratie mag dit intern vereenvoudigen, maar niet leiden tot onduidelijkheid over welke actie teruggedraaid wordt.

## 3. Afdrukken en exporteren

De gebruiker opent de afdrukdialoog en kiest welke documentonderdelen opgenomen worden. Mogelijke uitvoer omvat:

- eendraadschema;
- situatieschema;
- bordindeling per verdeelbord;
- dossier- of titelgegevens;
- SVG voor verdere verwerking;
- PDF voor afdruk of overdracht.

De afdrukvoorbeeldweergave moet dezelfde gegevens gebruiken als de editor. Er mag geen afzonderlijke, handmatig bijgewerkte exportstructuur bestaan.

## 4. Lokale MCP-koppeling

Een externe LLM-client kan via de lokale MCP-brug de elektrische graaf raadplegen. De koppeling wordt bewust lokaal gestart.

Typische vragen zijn:

- “Welke kringen zijn nog onvolledig?”
- “Welke stopcontacten staan nog niet op het situatieschema?”
- “In welk bord zit de kring van de garage?”
- “Welke componenten moeten nog in de bordindeling geplaatst worden?”
- “Voeg onder kring B een contactdoos voor de wasplaats toe.”

## 5. Voorstellen in plaats van stille wijzigingen

De LLM mag een wijzigingsvoorstel samenstellen, maar past dat niet onzichtbaar toe. De flow is:

1. de LLM leest de huidige graaf via MCP;
2. de LLM formuleert één of meer concrete bewerkingen;
3. de toepassing toont het voorstel in begrijpelijke taal;
4. de gebruiker keurt het voorstel goed of wijst het af;
5. alleen een goedgekeurd voorstel wordt toegepast;
6. het volledige voorstel vormt één ongedaan te maken documentactie.

## 6. Grenzen van LLM-assistentie

De LLM:

- mag geen elektrische of juridische zekerheid veinzen;
- mag geen verboden structuur afdwingen buiten de commandolaag;
- krijgt alleen toegang tot de in de MCP-interface aangeboden gegevens en acties;
- moet bestaande identifiers gebruiken wanneer een bestaand onderdeel bedoeld wordt;
- moet onzekerheid expliciet maken wanneer de opdracht meerdere interpretaties heeft;
- mag geen bestand overschrijven of extern delen zonder afzonderlijke toestemming.

## 7. Verbale uitbreiding van schema's

Een bruikbare verbale opdracht bevat idealiter:

- doelbord of kring;
- onderdeeltype;
- herkenbare naam of adres;
- relevante elektrische eigenschappen;
- gewenste plaatsingstaak.

Voorbeeld:

> Voeg aan kring “Stopcontacten keuken” een geaard dubbel stopcontact toe met adres “werkblad links” en zet het klaar om op het situatieschema te plaatsen.

De LLM vertaalt dit naar een voorstel op de graaf. De ruimtelijke eindpositie op een plattegrond blijft normaal een visuele keuze van de gebruiker, tenzij later een voldoende betrouwbare positioneringsinteractie wordt ontworpen.

## 8. Controle na een LLM-wijziging

Na goedkeuring:

- wordt het betrokken onderdeel geselecteerd;
- worden de drie weergaven opnieuw afgeleid;
- verschijnen nieuwe plaatsingstaken in het dossier en de relevante wachtrij;
- worden validatieproblemen onmiddellijk zichtbaar;
- kan de gebruiker de volledige wijziging ongedaan maken.
