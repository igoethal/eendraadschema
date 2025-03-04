type AdresLocation = 'rechts'|'links'|'boven'|'onder';
type AdresType = 'auto'|'manueel';

/**
 * Class SituationPlanElement
 * 
 * Deze class refereert naar de volgende globale variabelen:
 * - structure
 * - SITPLANVIEW_DEFAULT_SCALE
 */

class SituationPlanElement {

    // -- Identificatie --
    public id:string; //unieke identificatie van het element
    private electroItemId: number | null = null; // Referentie naar het electro-element in de datastructuur indien van toepassing

    // -- Basis eigenschappen van het element zelf --
    public boxref: HTMLDivElement | null = null; // Referentie naar het DIV document in de browser waar het element wordt afgebeeld
    public svg:string = ''; /* SVG content van het element indien van toepassing
                                Indien electroItemId == null dan is dit de SVG content van het element zelf
                                Indien electroItemId != null dan is dit de laatste geladen SVG content van het electro-element
                                Altijd te verifiëren dat deze niet leeg is en evenueel een update forceren */


    // -- Basis eigenschappen van het label --
    //    adres gegevens zijn private gedefinieerd omwille van consistentie (bvb adres kan leeg gelaten worden als het type auto is)

    public boxlabelref = null; // Referentie naar het DIV document in de browser waar het label wordt afgebeeld

    private adrestype: string | null = null;
    private adres: string | null = null
    private adreslocation: AdresLocation = 'rechts';

    // -- Positionering van het element zelf --
    public page:number = 1; //pagina waarop het element zich bevindt    
    public posx:number = 0; //center positie-x in het schema
    public posy:number = 0; //center positie-y in het schema
    public sizex:number = 0; //breedte
    public sizey:number = 0; //hoogte

    public rotate:number = 0;
    private scale:number = SITPLANVIEW_DEFAULT_SCALE;

    // -- Positionering van het label --
    public labelposx = 0;
    public labelposy = 0;
    public labelfontsize = 11;

    // -- Een vlag om de situationplanview te laten weten dat de box content moet geupdated worden
    public needsViewUpdate = false;

    // -- Een vlag voor verplaatsbaarheid
    public movable = true;

    /**
     * Constructor 
     */

    constructor() {
        this.id = randomId("SP_");
    }

    public setscale(scale: number) {
        this.scale = scale;
        this.needsViewUpdate = true;
    }

    public getscale(): number {
        return this.scale;
    }

    /**
     * isEendraadschemaSymbool
     * 
     * Controleer of het element een geldig electro-element is
     * Hiervoor is een geldige electroItemId nodig en moet het element in de datastructuur voorkomen.
     * 
     * @returns boolean
     */

    isEendraadschemaSymbool(): boolean {
        if (this.electroItemId != null) {
            return (structure.getElectroItemById(this.electroItemId) != null);
        }
        return false;
    }

    /**
     * rotates360degrees
     * 
     * Per default wordt er vanuit gegaan dat bij rotatie over rotatiehoeken alpha tussen 90 en 270 graden deze rotatie kan vervangen worden.
     * door een rotatie over alpha-180 graden.  Om een voorbeeld te geven, een batterij roteren over 180 graden heeft geen zin, dat blijft het originele symbool.
     * 
     * Voor bepaalde elementen is dit niet het geval. Een contactdoos gedraaid over 180 graden moet de opening naar rechts hebben in plaats van naar links.
     * Deze functie geeft true terug indien een volledige rotatie nodig is.
     * 
     * @returns boolean
     * 
     * TODO: functie verplaatsen naar Electro_Item
     */

    private static readonly ROTATES_360_DEGREES_TYPES = new Set(['Contactdoos','Lichtpunt','Drukknop','Media','Schakelaars','Lichtcircuit','Bord','Bel']);

    isEDSSymbolAndRotates360degrees(): boolean {
        if (this.isEendraadschemaSymbool()) {
            let electroElement: Electro_Item = structure.getElectroItemById(this.electroItemId);
            if (electroElement != null) {
                let type = electroElement.getType();
                return SituationPlanElement.ROTATES_360_DEGREES_TYPES.has(type);
            }
            return false;
        }
        return false;
    }

    /**
     * setAdres
     * 
     * @param adrestype string : 'auto' of 'manueel'
     * @param adres string : Indien manueel, het adres. Indien auto wordt deze genegeerd en this.adres altijd op null gezet.
     * @param adreslocation string: 'rechts' of 'links' of 'boven' of 'onder'
     */

    setAdres(adrestype: AdresType, adres: string, adreslocation: AdresLocation) {
        this.adrestype = adrestype;
        this.adreslocation = adreslocation;
        if (this.adrestype === 'manueel') this.adres = adres; else this.adres = null;
    }

    /**
     * setAdresLocation
     * 
     * @param adreslocation string: 'rechts' of 'links' of 'boven' of 'onder'
     */


    setAdresLocation(adreslocation: AdresLocation) {
        this.adreslocation = adreslocation;
    }

    /** 
     * getAdresType
     * 
     * @returns string : 'auto' of 'manueel'
     */

    getAdresType(): string {
        return this.adrestype;
    }

    /** 
     * getAdres
     * 
     * @returns string : adres
     */

    getAdres(): string {
        if (!this.isEendraadschemaSymbool()) return ''; // Geen adres voor niet-elektro-elementen

        let element = structure.getElectroItemById(this.electroItemId);
        if (element == null) return ''; // zou redundant moeten zijn want we controleerden al in isEendraadschemaSymbool

        if (this.adrestype === 'auto') {
            return element.getReadableAdres();
        } else {
            return this.adres ?? '';
        }
    } 

    /** 
     * getAdresLocation
     * 
     * @returns 'rechts'|'links'|'boven'|'onder'
     */

    getAdresLocation(): AdresLocation {
        return this.adreslocation;
    }

    /**
     * setElectroItemId
     * 
     * @param electroItemId number : id van het electroitem in structure
     * 
     * TODO: zou beter een private functie zijn en niet worden aangeroepen vanuit SituationPlan en SituationPlanView
     */

    setElectroItemId(electroItemId: number) {
        this.electroItemId = electroItemId;
    }

    /**
     * getElectroItemId
     * 
     * @returns number : id van het electroitem in structure
     */

    getElectroItemId(): number | null {
        if (this.isEendraadschemaSymbool()) return this.electroItemId;
        else return null;
    }

    /**
     * updateElectroItemSVG
     * 
     * @param svg string : nieuwe gegenereerde SVG door het electro-element
     * @param width number : breedte van de SVG zonder schaling en rotatie, indien niet gegeven wordt de breedte gezocht met functie getSizeFromString
     * @param height number : hoogte van de SVG zonder schaling en rotatie
     */

    updateElectroItemSVG(svg: string, width: number | undefined = undefined, height: number | undefined = undefined) { // Set the SVG string and update the size, this only works with an electro item
        if (this.isEendraadschemaSymbool()) {
            if (this.svg !== svg) { // This works because when saving to a file, svg is set to '' so an update will be triggered here
                this.needsViewUpdate = true;
                this.svg = svg;
                if (width != null) this.sizex = width;
                if (height != null) this.sizey = height;
                if (width == null || height == null) this.getSizeFromString();
            }    
        }
    }

    /**
     * getUnscaledSVGifNotElectroItem
     * 
     * @returns string : SVG content van het element op voorwaarde dat het geen electro-element is
     */

    getUnscaledSVGifNotElectroItem() {

        // cleanSVG(): Deze functie is nodig omdat gebleken is dat de print SVG commando's in jsPDF niet overweg kunnen met SVG's die niet dadelijk beginnen met '<svg' 

        const cleanSVG = () => {
            if (this.svg == null) this.svg = '';
            else {
                const index = this.svg.indexOf('<svg'); 
                if (index !== -1) this.svg =  this.svg.substring(index); 
            }
        }

        if (!this.isEendraadschemaSymbool()) {
            cleanSVG();
            return this.svg;
        } else {
            return '';
        }
    }

    /**
     * getScaledSVG
     * 
     * @param positioned boolean : indien true wordt de SVG getransformeerd naar de correcte positie en rotatie
     * @returns string : SVG content van het element dat onmmiddellijk in een innerHTML van de browser of een grotere SVG
     *                   om te printen kan worden geplaatst
     * 
     * TODO: kan nog efficienter indien we een flag "updated" hebben in het element zodat we weten wanneer we alles moeten hertekenen
     */

    getScaledSVG(positioned: boolean = false): string {

        const berekenAfbeeldingsRotatieEnSpiegeling = (): [number, boolean] => {

            let rotate = this.rotate;
            while (rotate < 0) rotate = rotate + 360;
            rotate = rotate % 360;
            
            let spiegel = false;
            
            if ( (rotate >= 90) && (rotate < 270) ) {
                if (this.isEDSSymbolAndRotates360degrees()) spiegel = true;
                if (this.isEendraadschemaSymbool()) rotate = rotate + 180;
            }

            return [rotate, spiegel];
        }

        if (this.isEendraadschemaSymbool()) {
            let electroItem = structure.getElectroItemById(this.electroItemId);
            if (electroItem != null) electroItem.updateSituationPlanElement(this);
        }

        let posinfo = '';
        let transform = '';

        if (positioned) { // Indien we de SVG willen positioneren en roteren, bvb voor gebruik in een print
            
            posinfo = `x="${this.posx-this.sizex/2*this.scale}" y="${this.posy-this.sizey/2*this.scale}"`;
            
            const [rotate, spiegel] = berekenAfbeeldingsRotatieEnSpiegeling();
           
            transform = `transform="rotate(${rotate} ${this.posx} ${this.posy})${(spiegel ? ` scale(-1,1) translate(${-this.posx * 2} 0)` : '')}"`;

            return `<g ${transform}>
                    <svg ${posinfo} width="${this.sizex*this.scale}px" height="${this.sizey*this.scale}px" viewBox="0 0 ${this.sizex} ${this.sizey}">${this.svg}</svg>
                    </g>`;               

        } else { // Indien we de SVG willen gebruiken in een innerHTML van een div element en dit element dan zelf positioneren en roteren

            return `<svg class="svg-icon" width="${this.sizex*this.scale}px" height="${this.sizey*this.scale}px" viewBox="0 0 ${this.sizex} ${this.sizey}">${this.svg}</svg>`;           
        }
    }

    /**
     * getSizeFromString
     * 
     * Haal de grootte van het SVG element uit de SVG string
     */

    private getSizeFromString() {
        // Create a DOMParser to parse the SVG string
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(this.svg, "image/svg+xml");

        // Access the SVG element
        const svgElement = svgDoc.querySelector('svg');

        if (svgElement) {
            // Extract the height and width attributes
            this.sizey = parseInt(svgElement.getAttribute('height'));
            this.sizex = parseInt(svgElement.getAttribute('width'));
        } else {
            console.error('Invalid SVG string');
        }
    }

    /**
     * Scalet het selecteerde element naar het papier als dat nodig is
     * 
     * @param {number} maxx - Maximale breedte van het canvas
     * @param {number} maxy - Maximale hoogte van het canvas
     */
    scaleSelectedBoxToPaperIfNeeded(maxx: number,maxy: number,defaultscale: number = 1) {
        //get the width and hight of the sitplanelement
        const width = this.sizex;
        const height = this.sizey;
        //calculate the maximum allowed scaling for a canvas of 550x300
        const maxScale = Math.min(defaultscale, maxx / width, maxy / height);
        //scale the element to the maximum allowed scaling
        this.scale = Math.floor(maxScale*10000)/10000;
    }

    /**
     * Leest de inhoud van een situatieplanelement uit een image bestand
     * Enkel image bestanden ondersteund door de browser worden ondersteund
     * 
     * @param event Event van het file input element gedefinieerd in index.html
     * @param callback Callback functie die wordt uitgevoerd na het inladen van de file
     */

    importFromFile(event: InputEvent, callback: () => void) {
        const input = event.target as HTMLInputElement;
        const file = input.files[0];

        if (file) {
            const reader = new FileReader();
            const fileName = file.name.toLowerCase();
            const mimeType = file.type;

            reader.onload = (e) => {
                const fileContent = e.target.result as string;
                const image = new Image();
                image.src = fileContent;
                image.onload = () => {
                    this.sizex = image.width;
                    this.sizey = image.height;
                    this.svg = `<svg width="${image.width}" height="${image.height}"><image href="${fileContent}" width="${image.width}" height="${image.height}"/></svg>`;
                    callback();
                };
                image.onerror = () => { 
                    alert('Het formaat van deze file wordt niet ondersteund.'); 
                };
            };
            reader.readAsDataURL(file); // Read the file as a data URL 
        } else {
            alert('Geen bestand geselecteerd');
        }
    }

    /**
     * setVars
     * 
     * @param object Object : object met de variabelen die moeten worden ingesteld
     */

    setVars(object: Object) {
        Object.assign(this, object);
    }

    /**
     * toJsonObject
     * 
     * @returns Object : object met de variabelen van het element dat dadelijk kan worden omgezet naar een JSON string
     */

    toJsonObject() {
        return {
            page: this.page,

            posx: this.posx, 
            posy: this.posy,

            sizex: this.sizex, 
            sizey: this.sizey, 

            labelposx: this.labelposx, 
            labelposy: this.labelposy,

            labelfontsize: this.labelfontsize,

            adrestype: this.adrestype, 
            adres: this.adres, 
            adreslocation: this.adreslocation,

            rotate: this.rotate, 
            scale: this.scale,

            movable: this.movable,
            
            svg: (this.isEendraadschemaSymbool() ? '' : this.svg), 
            electroItemId: this.electroItemId
        };
    }

    /**
     * fromJsonObject
     * 
     * @param json any : object met de variabelen van het element dat dadelijk kan worden omgezet naar een JSON string
     */

    fromJsonObject(json: any) {
        this.page = json.page;

        this.posx = json.posx;
        this.posy = json.posy;

        this.sizex = json.sizex;
        this.sizey = json.sizey;

        this.labelposx = (json.labelposx != null) ? json.labelposx : this.posx + 20;
        this.labelposy = (json.labelposy != null) ? json.labelposy : this.posy;

        this.labelfontsize = (json.labelfontsize != null ? json.labelfontsize : 11);

        this.adrestype = (json.adrestype != null) ? json.adrestype : "manueel";
        this.adres = json.adres;
        this.adreslocation = (json.adreslocation != null) ? json.adreslocation : "rechts";

        this.rotate = (json.rotate != null) ? json.rotate : 0;
        this.scale = (json.scale != null) ? json.scale : SITPLANVIEW_DEFAULT_SCALE;

        this.svg = json.svg;
        this.electroItemId = json.electroItemId;

        this.needsViewUpdate = true; // TODO: make this more efficient as it will always trigger redraws, even when not needed

        this.movable = (json.movable != null) ? json.movable : true;
    }
}