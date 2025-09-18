import { Electro_Item } from "./Electro_Item";
import { SVGelement } from "../SVGelement";
import { SVGSymbols } from "../SVGSymbols";
import { trimString, svgTextWidth, htmlspecialchars } from "../general";

export class Aftakdoos extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Aftakdoos";
        this.props.adres = "";  
    }    

    allowedChilds() : Array<string> { // returns an array with the type-names of allowed childs
        return ["", "Aansluiting", "Domotica", "Domotica module (verticaal)", "Domotica gestuurde verbruiker", "Leiding", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Contactdoos", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Media", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zekering/differentieel", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Zeldzame symbolen"];
    }

    getMaxNumChilds(): number {
        return 256;
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml();
        output += "Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan: boolean = false) {
        let mySVG:SVGelement = new SVGelement();

        if (sitplan) {
            SVGSymbols.addSymbol('aftakdoos');

            mySVG.yup = 25;
            mySVG.ydown = 25;

            mySVG.xleft = 1; // foresee at least some space for the conductor
            mySVG.xright = 49;

            mySVG.data += '<use xlink:href="#aftakdoos" x="21" y="25"></use>';

            return(mySVG);            
        }

        /* else (not sitplan) */

        SVGSymbols.addSymbol('aftakdoos');

        // Eerst vragen we een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id,"vertical");

        // Dan bepalen we de hoogte van het object
        // CHECK CONNECTORPOS
        let height = Math.max(mySVG.yup + mySVG.ydown,50);

        // Parameters van mySVG aanpassen omdat mySVG nu de Omvormer gaat beschrijven
        mySVG.yup = height/2;
        mySVG.ydown = mySVG.yup;
        mySVG.firstChildydown = null;
        mySVG.lastChildyup = null;

        //hoeveel plaats moeten we voorzien voor connectors met de kinderen
        let connectorSpace = 0;
        const numChilds = this.getNumChilds();
        if (height > 150) {
            connectorSpace = 20;
        } else if (height > 100) {
            connectorSpace = 10;
        }

        // Nu zetten we detekening effectief op de goede plaats in het schema
        mySVG.data = `<svg x="${50+connectorSpace}" y="0">${mySVG.data}</svg>`;

        // Vervolgens tekenen we de module zelf
        mySVG.xleft = 1;
        mySVG.xright += (50+connectorSpace);

        for (let i=0; i<mySVG.connectorPos.length; i++) {
            if (mySVG.connectorPos[i] == null) continue;
            let startpos = { x: 36, y: mySVG.yup };
            let endpos = { x: 51+connectorSpace, y: height-mySVG.connectorPos[i] };
            let distance = Math.sqrt(Math.pow(endpos.x-startpos.x, 2) + Math.pow(endpos.y - startpos.y, 2));
            let startfraction = 15/distance;
            mySVG.data += `<line x1="${startpos.x+startfraction*(endpos.x-startpos.x)}" y1="${startpos.y+startfraction*(endpos.y-startpos.y)}" x2="${endpos.x}" y2="${endpos.y}" stroke="black" stroke-linecap="round"></line>`;
        }

        mySVG.data += `<line x1="1" y1="${mySVG.yup}" x2="21" y2="${mySVG.yup}" stroke="black"></line>`
                   +  `<use xlink:href="#aftakdoos" x="21" y="${mySVG.yup}"></use>`;



        //mySVG.data += this.addAddressToSVG(mySVG,55,10);

        if (!(/^\s*$/.test(this.props.adres))) { //check if adres contains only white space
            const textX = 35;
            const textY = height/2+30;
            const fontSize = 10;
            const padding = 2;
            const textWidth = svgTextWidth(htmlspecialchars(this.props.adres), fontSize, '');
            const rectWidth = textWidth + padding * 2;
            const rectHeight = fontSize + padding * 2;

            mySVG.data += `<rect x="${textX - rectWidth / 2}" y="${textY - rectHeight / 2 - 4}" width="${rectWidth}" height="${rectHeight}" fill="white" />`;

            mySVG.data += '<text x="' + textX + '" ' + 'y="' + textY + '" '
                + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"' + '>'
                + this.props.adres + '</text>';

            mySVG.ydown = Math.max(mySVG.ydown, 40);
        }

        return(mySVG);
    }

}