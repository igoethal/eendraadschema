class SituationPlanElement {
    public page:number = 1;

    public posx:number = 0; //center positie-x in het schema
    public posy:number = 0; //center positie-y in het schema
    public sizex:number = 0; //breedte
    public sizey:number = 0; //hoogte

    public labelposx = 0;
    public labelposy = 0;

    public rotate:number = 0;
    public scale:number = SITPLANVIEW_DEFAULT_SCALE;
    public id:string;

    public boxref = null;
    public boxlabelref = null;

    private svg:string = "";
    private electroItemId:number = null;
    private adrestype:string = null;
    private adres:string = null
    private adreslocation:string = "rechts";

    constructor(
        page: number,
        posx: number, posy: number,
        sizex: number, sizey: number,
        rotate: number, scale: number,
        id: string, svg: string ) 
    {
        this.page = page;
        this.posx = posx; this.posy = posy;
        this.sizex = sizex, this.sizey = sizey;
        this.rotate = rotate; this.scale = scale;
        this.id = id; this.svg = svg;
    }

    isEDSymbol(): Boolean {
        if (this.electroItemId != null) {
            let idnum = Number(this.electroItemId);
            if (!isNaN(idnum)) {
                let ordinal = structure.getOrdinalById(idnum);
                if (ordinal != null) {
                    let electroElement = structure.data[ordinal];
                    if (electroElement != null) return true;
                }
            }
        }
        return false;
    }

    needsTextMirroring(): boolean {
        if (this.isEDSymbol()) {
            let electroElement: Electro_Item = (structure.data[structure.getOrdinalById(Number(this.getElectroItemId()))] as Electro_Item);
            let type = electroElement.getType();
            if (['Contactdoos','Lichtpunt','Drukknop','Media','Schakelaars','Lichtcircuit'].includes(type)) return true; else return false;
        }
        return true;
    }

    setAdres(adrestype: string, adres:string, adreslocation: string) {
        this.adrestype = adrestype;
        this.adreslocation = adreslocation;
        if (this.adrestype === 'manueel') this.adres = adres;
        else this.adres = null;
    }

    getAdresType() {
        return this.adrestype;
    }

    getAdres() {
        if (this.electroItemId == null) return "";

        let id = this.electroItemId;
        let element = structure.data[structure.getOrdinalById(id)] as Electro_Item;

        switch (this.adrestype) {
            case 'auto':
                return element.getReadableAdres();
                break;
            case 'adres':        
                return "Adres";
            case 'manueel':
            default:
                return (this.adres == null) ? "" : this.adres;
        }
    } 

    getAdresLocation() {
        return this.adreslocation;
    }

    setElectroItemId(id: number) {
        this.electroItemId = id;
    }

    getElectroItemId() {
        return this.electroItemId;
    }

    setSVG(svg: string) { // Set the SVG string and update the size, this only works when the id-field is empty
        this.svg = svg;
        this.getSizeFromString();
    }

    getSVG() {
        if (this.electroItemId != null) {
            let ordinal = structure.getOrdinalById(this.electroItemId);
            if (ordinal != null) {
                let electroItem = structure.data[ordinal] as Electro_Item;
                electroItem.updateSituationPlanElement(this);
            } else {
                return null;
            }
        }

        function removeBeforeFirstSVG(input: string): string { 
            const index = input.indexOf('<svg'); 
            if (index !== -1) return input.substring(index); 
            return input;
        }

        return removeBeforeFirstSVG(this.svg);
    }

    getScaledSVG(positioned: boolean = false) {
        let svg = this.getSVG();
        if (svg == null) return null;

        let posinfo = '';
        let transform = '';

        if (positioned) {
            posinfo = `x="${this.posx-this.sizex/2*this.scale}" y="${this.posy-this.sizey/2*this.scale}"`;
            let rotate = this.rotate;
            while (rotate < 0) rotate = rotate + 360;
            rotate = rotate % 360;
            let spiegel = false;
            if ( (rotate >= 90) && (rotate < 270) ) {
                if (this.needsTextMirroring()) spiegel = true;
                if (this.isEDSymbol()) rotate = rotate + 180;
            }
            transform = `transform="rotate(${rotate} ${this.posx} ${this.posy})${(spiegel ? ' scale(-1,1) translate(' + (-2*this.posx) + ' 0)' : '')}"`;
        }

        return `
            <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" ${posinfo} ${transform} width="${this.sizex*this.scale}px" height="${this.sizey*this.scale}px" viewBox="0 0 ${this.sizex} ${this.sizey}">
                ${svg}   
            </svg>`;           
    }

    getSizeFromString() {
        // Create a DOMParser to parse the SVG string
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(this.svg, "image/svg+xml");

        // Access the SVG element
        const svgElement = svgDoc.querySelector('svg');

        // Extract the height and width attributes
        this.sizey = parseInt(svgElement.getAttribute('height'));
        this.sizex = parseInt(svgElement.getAttribute('width'));
    }

    importFromFile(event: any, callback) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => { 
                const fileContent = e.target.result; 
                this.svg = fileContent.toString();
                this.getSizeFromString();
                callback();
            }; 
            reader.readAsText(file); // Read the file as a text string
        }
    }

    toJsonObject() {
        let svg:string = ((this.electroItemId != null) ? "" : this.svg)
        return {
            page: this.page, posx: this.posx, posy: this.posy,
            sizex: this.sizex, sizey: this.sizey, 
            labelposx: this.labelposx, labelposy: this.labelposy,
            adrestype: this.adrestype, adres: this.adres, adreslocation: this.adreslocation,
            rotate: this.rotate, scale: this.scale,
            svg: svg, electroItemId: this.electroItemId
        };
    }

    fromJsonObject(json: any) {
        this.page = (json.page != null) ? json.page : 1;
        this.posx = json.posx;
        this.posy = json.posy;
        this.labelposx = (json.labelposx != null) ? json.labelposx : this.posx + 20;
        this.labelposy = (json.labelposy != null) ? json.labelposy : this.posy;
        this.sizex = json.sizex;
        this.sizey = json.sizey;
        this.adrestype = (json.adrestype != null) ? json.adrestype : "manueel";
        this.adres = json.adres;
        this.adreslocation = (json.adreslocation != null) ? json.adreslocation : "rechts";
        this.rotate = (json.rotate != null) ? json.rotate : 0;
        this.scale = (json.scale != null) ? json.scale : SITPLANVIEW_DEFAULT_SCALE;
        this.svg = json.svg;
        this.electroItemId = json.electroItemId;
    }
}