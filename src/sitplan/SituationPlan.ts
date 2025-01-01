class SituationPlan {
    private numPages: number = 1;
    private activePage: number = 1;

    public elements: SituationPlanElement[];

    constructor() {
        this.elements = [];
    }

    addElement(element: SituationPlanElement) {
        this.elements.push(element);
    }

    addElementFromFile(event: any, page: number, posx: number, posy: number, callback): SituationPlanElement {
        let element: SituationPlanElement = new SituationPlanElement(page,posx,posy,0,0,11,0,SITPLANVIEW_DEFAULT_SCALE,randomId("SP_"),"");
        element.importFromFile(event, callback);
        this.elements.push(element);
        return element;
    }

    addElementFromSVG(svg: string, page: number, posx: number, posy: number) {
        let element: SituationPlanElement = new SituationPlanElement(page,posx,posy,0,0,11,0,SITPLANVIEW_DEFAULT_SCALE,randomId("SP_"),svg);
        element.getSizeFromString();
        this.elements.push(element);
    }

    addElectroItem(id: number, page: number, posx: number, posy: number, adrestype: string, adres:string, adreslocation: string,
                   labelfontsize: number, scale: number, rotate: number): SituationPlanElement {
        let electroItem: Electro_Item = structure.data[structure.getOrdinalById(id)] as Electro_Item;
        if (electroItem != null) {
            let element: SituationPlanElement = electroItem.toSituationPlanElement();
            Object.assign(element, {page: page, posx: posx, posy: posy, labelfontsize: labelfontsize, scale: scale, rotate: rotate});
            element.setElectroItemId(id);
            element.setAdres(adrestype,adres,adreslocation);
            this.elements.push(element)
            return element;
        } else {
            return null;
        }
    }

    removeElement(element: SituationPlanElement) {
        for (let i = this.elements.length - 1; i >= 0; i--) { 
            if (this.elements[i] == element) { this.elements.splice(i, 1); } 
        }
        if (element.boxref != null) element.boxref.remove();
        if (element.boxlabelref != null) element.boxlabelref.remove();
    }

    toJsonObject() {
        let elements = [];
        for (let element of this.elements) {
            elements.push(element.toJsonObject());
        }
        return {numPages: this.numPages, elements: elements};
    }

    fromJsonObject(json: any) {
        this.numPages = json.numPages;
        this.elements = [];
        for (let element of json.elements) {
            let newElement = new SituationPlanElement(1,0,0,0,0,11,0,SITPLANVIEW_DEFAULT_SCALE,randomId("SP_"),"");
            newElement.fromJsonObject(element);
            this.elements.push(newElement);
        }
    }

    toSitPlanPrint() {
        let outstruct:any = {};

        outstruct.numpages = (this.elements.length > 0 ? structure.sitplan.numPages : 0);
        outstruct.pages = [];

        for (let i=0; i<outstruct.numpages; i++ ) {
                
            let svgstr = '';

            let pixelsPerMm = getPixelsPerMillimeter();

            let maxx = pixelsPerMm * 277;
            let maxy = pixelsPerMm * 150;

            for (let element of this.elements) {
                if (element.page == (i+1)) {
                    let fontsize = element.labelfontsize;
                    if (fontsize == null) fontsize = 11;
                    svgstr += element.getScaledSVG(true);

                    let rotatedimgwidth = element.sizex*element.scale;
                    let rotatedimgheight = element.sizey*element.scale;

                    rotatedimgwidth = Math.max(rotatedimgwidth * Math.cos(element.rotate*Math.PI/180), rotatedimgheight * Math.sin(element.rotate*Math.PI/180));
                    rotatedimgheight = Math.max(rotatedimgwidth * Math.sin(element.rotate*Math.PI/180), rotatedimgheight * Math.cos(element.rotate*Math.PI/180));

                    maxx = Math.max(maxx, element.posx + rotatedimgwidth/2);
                    maxy = Math.max(maxy, element.posy + rotatedimgheight/2);

                    svgstr += `<text x="${element.labelposx}" y="${element.labelposy}" font-size="${fontsize}" fill="black" text-anchor="middle" dominant-baseline="middle">${element.getAdres()}</text>`
                }
            }

            svgstr = `<svg xmlns="http://www.w3.org/2000/svg" width="${maxx}px" height="${maxy}px" viewBox="0 0 ${maxx} ${maxy}">${svgstr}</svg>`;

            outstruct.pages.push({sizex: maxx, sizey: maxy, svg: svgstr});
        }

        return outstruct;
    }

}