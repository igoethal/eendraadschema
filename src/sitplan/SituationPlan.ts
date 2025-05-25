/**
 * Volledig overzicht van een situatieplan.
 * Werd gebouwd voor gebruik in de browser maar is redelijk browser-agnostic.
 * De effectieve code om te interageren met de browser zelf zit in class SituationPlanView.
 * 
 * Deze class refereert naar de volgende globale variabelen:
 * - globalThis.structure
 */


class SituationPlan {
    public activePage: number = 1; // We houden deze bij in situationplan zodat ook wijzigingen van pagina's worden opgeslagen
    private numPages: number = 1;
    private elements: SituationPlanElement[] = [];

    public defaults = {
        fontsize: 11,
        scale: SITPLANVIEW_DEFAULT_SCALE,
        rotate: 0
    }

    /**
     * Reset alle waarden van het situatieplan naar hun default waarde.
     * Gebruik deze functie om alle data te wissen en het situatieplan opnieuw te beginnen.
     */
    dispose() {
        this.elements = [];
        this.numPages = 1;
        this.activePage = 1;
        this.defaults = {
            fontsize: 11,
            scale: SITPLANVIEW_DEFAULT_SCALE,
            rotate: 0
        }
    }

    /**
     * Workaround om de private variabele elements te kunnen gebruiken in friend classs
     * @returns {SituationPlanElement[]} De elementen van het situatieplan
     */

    getElements(): SituationPlanElement[] {
        return this.elements;
    }

    /**
     * Geeft het aantal pagina's van het situatieplan terug.
     * @returns {number} Het aantal pagina's van het situatieplan.
     */
    getNumPages(): number {
        return (this.elements.length > 0 ? this.numPages : 0);
    }

    heeftEenzameSchakelaars() {
        var schakelaars = this.elements.filter(function (element) {
            if (element.isEendraadschemaSymbool()) {
                let electroItem = globalThis.structure.getElectroItemById(element.getElectroItemId());
                if (electroItem != null) {
                    if (electroItem.props.type == "Schakelaars") {
                        if ( (electroItem.props.aantal_schakelaars == 1) || (electroItem.props.aantal_schakelaars == null) ) {
                            return true;
                        }
                    }
                }
            }
        });
        return schakelaars.length > 1;
    }

    dropLegacySchakelaars() {
        for (let element of this.elements) {
            if (element.isEendraadschemaSymbool()) {
                let electroItem = globalThis.structure.getElectroItemById(element.getElectroItemId());
                if (electroItem != null) {
                    if (electroItem.props.type == "Schakelaars") {
                        if ( (electroItem.props.aantal_schakelaars == 1) || (electroItem.props.aantal_schakelaars == null) ) {
                            element.rotate = 0;
                        }
                    }
                }
            }
        };
    }

    /**
     * SituationPlanElement toevoegen aan het situatieplan
     * @param element
     * @returns {void}
     */

    addElement(element: SituationPlanElement) {
        this.elements.push(element);
    }

    /**
     * Laad een SVG-inhoud vanuit een bestand en voegt deze toe aan het situatieplan.
     * De SVG werd geselecteerd in een fileInput HTML element en komt binnen via het event in de functie header.
     * 
     * @param {any} event Het event dat aangaf dat er een bestand was gekozen om te uploaden.
     * @param {number} page Het pagina-nummer van het element in het situatieplan.
     * @param {number} posx De x-coordinaat van het element in het situatieplan.
     * @param {number} posy De y-coordinaat van het element in het situatieplan.
     * @param {() => void} callback Een callback-functie die wordt aangeroepen wanneer het element is toegevoegd.
     * @returns {SituationPlanElement} Het element dat is toegevoegd.
     */

    addElementFromFile(event: InputEvent, page: number, posx: number, posy: number, callback: () => void): SituationPlanElement {
        let element: SituationPlanElement = new SituationPlanElement();
        element.setVars({page: page, posx: posx, posy: posy, labelfontsize: this.defaults.fontsize, scale: this.defaults.scale, rotate: this.defaults.rotate});
        element.importFromFile(event, callback);
        this.elements.push(element);
        return element;
    }

    /**
     * Creëer een nieuw element in het situatieplan dat gelinkt is aan een Electro_Item
     * 
     * @param {number} electroItemId Het ID van de Electro_Item.
     * @param {number} page Het pagina-nummer van het element in het situatieplan.
     * @param {number} posx De x-coordinaat van het element in het situatieplan.
     * @param {number} posy De y-coordinaat van het element in het situatieplan.
     * @param {AdresType} adrestype Het type van het adres, bijvoorbeeld 'manueel'.
     *                              AdresType wordt definieerd in SituationPlanElement.ts
     * @param {string} adres Het adres.
     * @param {AdresLocation} adreslocation De locatie van het adres in het label ('boven' of 'onder' of 'rechts' of 'links').
     *                                      AdresLocation wordt definieerd in SituationPlanElement.ts
     * @param {number} labelfontsize De lettergrootte van het label.
     * @param {number} scale De schaal van het element.
     * @param {number} rotate De rotatie van het element.
     * @returns {SituationPlanElement} Het element dat is toegevoegd.
     */
    addElementFromElectroItem(electroItemId: number, page: number, posx: number, posy: number, adrestype: AdresType, adres:string, adreslocation: AdresLocation,
                              labelfontsize: number, scale: number, rotate: number): SituationPlanElement | null {

        const electroItem: Electro_Item = globalThis.structure.getElectroItemById(electroItemId);
        if (!electroItem) return null;
        
        const element: SituationPlanElement = electroItem.toSituationPlanElement();
        Object.assign(element, {page, posx, posy, labelfontsize, scale, rotate});
        element.setElectroItemId(electroItemId);
        element.setAdres(adrestype,adres,adreslocation);
        this.elements.push(element)
        return element;
    }

    /**
     * Verwijder een element van het situatieplan.
     * In principe is er altijd maar één maar de functie gebruikt recursie in het geval er meerdere zouden zijn
     * om ze allemaal te verwijderen.
     * 
     * @param {SituationPlanElement} element Het element dat verwijderd moet worden.
     * @returns {void}
     */

    removeElement(element: SituationPlanElement): void {
        const index = this.elements.indexOf(element);
        if (index === -1) return;
        this.elements.splice(index, 1);
        if (element.boxref != null) element.boxref.remove();
        if (element.boxlabelref != null) element.boxlabelref.remove();
        this.removeElement(element); // Recurse in het geval er meerdere zouden zijn maar dit zou niet mogen gebeuren
    }

    /**
     * Zorgt ervoor dat alle elementen in het situatieplan een link hebben naar
     * het eendraadschema.
     * 
     * Als een element in het situatieplan verwijst naar een symbool dat niet langer in 
     * het eendraadschema zit, wordt het element verwijderd uit het situatieplan.
     */
    syncToEendraadSchema() { 
        for (let element of this.elements) {            
            //Indien een symbool niet langer in het eendraadschema zit moet het ook uit het situatieplan verwijderd worden
            //We kunnen hier niet de functie isEendraadSchemaSymbool of getElectroItemById gebruiken want die zorgen
            //ervoor dat onderstaande altijd false geeft als de symbolen niet langer in het eendraadschema zitten waardoor
            //de cleanup die nodig is niet gebeurd.
            if (((element as any).electroItemId != null) && (globalThis.structure.getElectroItemById(element.getElectroItemId()) == null)) {
                this.removeElement(element); 
                this.syncToEendraadSchema(); return; // Start opnieuw en stop na recursie
            }
        }
    }

    /**
     * Sorteer de elementen in het situatieplan op basis van de z-index van hun boxref elementen in de DOM.
     * Elementen met een `null` `boxref` worden naar het einde van de lijst verplaatst.
     * 
     * Het sorteren is nodig om ervoor te zorgen dat bij het printen wanneer lineair door de elementen wordt gegaan
     * de elementen in de juiste volgorde worden gestacked.
     * 
     * @returns {void}
     */

    orderByZIndex() {
        //if (globalThis.structure.sitplanview == null) return;
        this.elements.sort((a, b) => {
            let asort = ( ((a.boxref == null) || (a.boxref.style.zIndex === "")) ? 0 : parseInt(a.boxref.style.zIndex));
            let bsort = ( ((b.boxref == null) || (b.boxref.style.zIndex === "")) ? 0 : parseInt(b.boxref.style.zIndex));
            return asort - bsort;
        });
    }

    /**
     * Initialiseer het situatieplan vanuit een json-object.
     * 
     * @param {Object} json Het json-object dat het situatieplan bevat.
     *                      Het object bevat een 'numPages' property dat het aantal pagina's in het situatieplan aangeeft.
     *                      Verder bevat het een 'elements' property dat een array is van json-objecten die elk een element in het situatieplan vertegenwoordigen.
     *                      Elke json-object in de array bevat de properties van een SituationPlanElement.
     * @returns {void}
     */

    fromJsonObject(json: any) {
        this.dispose();
        if (json.numPages !== undefined) {
            this.numPages = json.numPages;
        } else {
            this.numPages = 1; }

        if (json.activePage !== undefined) {
            this.activePage = json.activePage;
        } else {
            this.activePage = 1; }

        if (json.defaults !== undefined) {
            Object.assign(this.defaults, json.defaults);
        }

        if (Array.isArray(json.elements)) {
            this.elements = json.elements.map((element: any) => {
                const newElement = new SituationPlanElement();
                newElement.fromJsonObject(element);
                return newElement;
            });
        } else {
            this.elements = [];
        }
    }
    
    /**
     * Converteer het situatieplan naar een JSON-object dat gebruikt kan worden
     * voor opslaan in lokale storage of voor versturen naar de server.
     * 
     * @returns {any} Het JSON-object dat het situatieplan bevat.
     */
    toJsonObject(): any {
        this.orderByZIndex();
        let elements = [];
        for (let element of this.elements) {
            elements.push(element.toJsonObject());
        }
        return {numPages: this.numPages, activePage: this.activePage, defaults: this.defaults, elements: elements};
    }

    /**
     * Tel het aantal elementen in het situatieplan dat overeenkomt met het gegeven electroItemId.
     * 
     * @param {number} electroItemId - Het ID van het Electro_Item waarvan de elementen geteld moeten worden.
     * @returns {number} Het aantal elementen met het gegeven electroItemId.
     */
    countByElectroItemId(electroItemId: number): number {
        return this.elements.filter(element => element.getElectroItemId() === electroItemId).length;
    }

    /**
     * Converteer het situatieplan naar een formaat dat gebruikt kan worden voor printen.
     * 
     * @param {boolean} fitToPage Indien `true` dan wordt de pagina automatisch aangepast om alle elementen te laten passen.
     *                            Als `false` dan wordt de pagina in de originele grootte gebruikt.
     * @returns {any} Het formaat van het situatieplan dat gebruikt kan worden voor printen.
     *                Dit is een javascript object met structuur
     *                  {
     *                      numpages: number,
     *                      pages: [
     *                          {
     *                              svg: string,
     *                              minx: number,
     *                              miny: number,
     *                              maxx: number,
     *                              maxy: number
     *                          }
     *                      ]
     *                  }
     */

    toSitPlanPrint(fitToPage: boolean = false): any {
        this.syncToEendraadSchema(); // Om zeker te zijn dat we geen onbestaande elementen meer hebben
        this.orderByZIndex(); // Sorteer de elementen op basis van de z-index zodat ze in de juiste volgorde worden geprint

        let outstruct:any = {};
        outstruct.numpages = (this.elements.length > 0 ? globalThis.structure.sitplan.numPages : 0);
        outstruct.pages = [];

        for (let i=0; i<outstruct.numpages; i++ ) {    
            let svgstr = '';

            let maxx = getPixelsPerMillimeter() * 277;
            let maxy = getPixelsPerMillimeter() * 150;
            let minx = 0;
            let miny = 0;

            for (let element of this.elements) {
                if (element.page == (i+1)) {
                    let fontsize = (element.labelfontsize != null) ? element.labelfontsize : 11; 
                    svgstr += element.getScaledSVG(true);

                    if (fitToPage) {
                        let boundingbox = getRotatedRectangleSize(element.sizex*element.getscale(), element.sizey*element.getscale(), element.rotate);
                        maxx = Math.max(maxx, element.posx + boundingbox.width/2);
                        maxy = Math.max(maxy, element.posy + boundingbox.height/2);
                        minx = Math.min(minx, element.posx - boundingbox.width/2);
                        miny = Math.min(miny, element.posy - boundingbox.height/2);
                    }

                    let str = element.getAdres();
                    svgstr += `<text x="${element.labelposx}" y="${element.labelposy}" font-size="${fontsize}" fill="black" text-anchor="middle" dominant-baseline="middle">${htmlspecialchars(str)}</text>`
                }
            }

            svgstr = `<svg xmlns="http://www.w3.org/2000/svg" width="${maxx-minx}px" height="${maxy-miny}px" viewBox="${minx} ${miny} ${maxx-minx} ${maxy-miny}">${svgstr}</svg>`;

            outstruct.pages.push({sizex: maxx-minx, sizey: maxy-miny, svg: svgstr});
        }

        return outstruct;
    }

}