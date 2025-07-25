import { Electro_Item } from "./Electro_Item";
import { htmlspecialchars, svgTextWidth, trimString } from "../general";
import { SVGelement } from "../SVGelement";
import { SVGSymbols } from "../SVGSymbols";

export class Omvormer extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Omvormer";
        this.props.adres = "";
        this.props.inkring = false;
        this.props.micro = false;
    }

    allowedChilds() : Array<string> { // returns an array with the type-names of allowed childs
        return ["", "Aansluiting", "Domotica", "Domotica module (verticaal)", "Domotica gestuurde verbruiker", "Leiding", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Contactdoos", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Media", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zekering/differentieel", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Zeldzame symbolen"];
    }

    getMaxNumChilds(): number {
        return 256;
    }

    overrideKeys() {
        let parent: Electro_Item;
        if (this.props.tekst == null) this.props.tekst = "";
        if (this.props.inkring == null) this.props.inkring = false;
        if (this.props.micro == null) this.props.micro = false;
        if ( ((parent = this.getParent()) != null) && (parent.getType() != "Kring") )
            this.props.inkring = false;
        if (this.props.micro && this.getNumChilds() > 1) {
            this.props.micro = false;
        }
    }

    toHTML(mode: string) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode);
        let parent;

        output += "&nbsp;" + this.nrToHtml();
        if ( ((parent = this.getParent()) != null) && (parent.getType() == "Kring") )
            output += "In kring: " + this.checkboxPropToHTML('inkring') + ", ";
        
        // Only show micro checkbox if there's one child or less
        if (this.getNumChilds() <= 1) {
            output += "Micro: " + this.checkboxPropToHTML('micro') + ", ";
        }
        
        output += "Tekst: " + this.stringPropToHTML('tekst',10) + ", ";
        output += "Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan = false) {
        let mySVG:SVGelement = new SVGelement();

        if (sitplan) {
            SVGSymbols.addSymbol('sinus');
            SVGSymbols.addSymbol('omvormer');

            mySVG.yup = 25;
            mySVG.ydown = 25;

            mySVG.xleft = 1; // foresee at least some space for the conductor
            mySVG.xright = 59;

            mySVG.data += '<use xlink:href="#omvormer" x="21" y="25"></use>';

            return(mySVG);            
        }

        /* else (not sitplan) */

        const text = htmlspecialchars(this.props.tekst);

        SVGSymbols.addSymbol('sinusVerticaal');

        // Eerst vragen we een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id,"vertical");

        // Dan bepalen we de hoogte van het object en zorgen ervoor dat de tekst past
        let heightunaltered = mySVG.yup + mySVG.ydown;
        let height = heightunaltered;
        if (height < 60) height = 60;
        height = Math.max(height,svgTextWidth(htmlspecialchars(text),10,'') + 25);

        mySVG.yup = height/2;
        mySVG.ydown = mySVG.yup;

        // Nu zetten we detekening effectief op de goede plaats in het schema
        mySVG.data = '<svg x="70" y="' + (height-heightunaltered)/2 + '">' + mySVG.data + '</svg>';

        // Vervolgens tekenen we de module zelf
        mySVG.xleft = 1;
        mySVG.xright += 70;

        const strokeWidth = this.props.micro ? "1" : "2";
        mySVG.data += '<rect x="' + (21) + '" width="' + (50) +
                      '" y="' + (5) + '" height="' + (height-10) + '" stroke="black" stroke-width="' + strokeWidth + '" fill="white" />';

        mySVG.data += `<line x1="21" y1="5" x2="${21+50}" y2="${5 + (height-10)}" stroke="black" />`;

        if (this.props.inkring) {
            mySVG.data += `<line x1="1" x2="21" y1="${mySVG.yup-5}" y2="${mySVG.yup-5}" stroke="black" />` +
                          `<line x1="1" x2="21" y1="${mySVG.yup+5}" y2="${mySVG.yup+5}" stroke="black" />`; 
        } else {
            mySVG.data += `<line x1="1" x2="21" y1="${mySVG.yup}" y2="${mySVG.yup}" stroke="black" />`;
        }

        // Tekst plaatsen

        if (trimString(text) !== "") {
            const textX = 49;
            const textY = mySVG.yup;
            const fontSize = 10;
            const padding = 2;
            const textWidth = svgTextWidth(text, fontSize, 'font-weight="bold"');
            const rectWidth = textWidth + padding * 2;
            const rectHeight = fontSize + padding * 2;

            mySVG.data += `<rect x="${textX-4 - rectHeight/2}" y="${textY - rectWidth / 2}" width="${rectHeight}" height="${rectWidth}" fill="white" />`;

            mySVG.data += '<text x="' + textX + '" ' + 'y="' + textY + '" '
                +  'transform="rotate(90 ' + textX + ',' + textY + ')" '
                + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"' + '>'
                + text + '</text>';
        }

        // Symbolen toevoegen voor wisselstroom en gelijkstroom

        mySVG.data += `<use xlink:href="#sinusVerticaal" x="30" y="${5+height-10-10}" />` 
                   +  `<line x1="66" y1="12" x2="66" y2="27" stroke="black" stroke-dasharray="3" />` 
                   +  `<line x1="62" y1="12" x2="62" y2="27" stroke="black" />`;
        
        mySVG.data += this.addAddressToSVG(mySVG,height+10,15,(70-mySVG.xright)/2-1);

        return(mySVG);

    }

}