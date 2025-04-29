import { svgTextWidth, htmlspecialchars } from "../general";
import { SVGelement } from "../SVGelement";
import { Electro_Item } from "./Electro_Item";

export class Domotica_verticaal extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        //Niet nodig, bestond niet toen we nog Keys gebruikten
    } 

    resetProps() {
        this.clearProps();
        this.props.type = "Domotica module (verticaal)";
        this.props.nr = "";
        this.props.tekst = "Domotica";
    }

    allowedChilds() : Array<string> { // returns an array with the type-names of allowed childs
        return ["", "Aansluiting", "Domotica", "Domotica module (verticaal)", "Domotica gestuurde verbruiker", "Leiding", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Contactdoos", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Media", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zekering/differentieel", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Zeldzame symbolen"];
    }

    getMaxNumChilds(): number {
        return 256;
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml()
               +  "Tekst: " + this.stringPropToHTML('tekst',10);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();

        // Eerst vragen we een tekening van alle kinderen
        mySVG = window.global_structure.toSVG(this.id,"vertical");

        // Dan bepalen we de hoogte van het object en zorgen ervoor dat de tekst past
        let heightunaltered = mySVG.yup + mySVG.ydown;
        let height = heightunaltered;
        if (height < 50) height = 50;
        height = Math.max(height,svgTextWidth(htmlspecialchars(this.props.tekst),10,'font-weight="bold"') + 25);

        mySVG.yup = height/2;
        mySVG.ydown = mySVG.yup;

        // Nu zetten we detekening effectief op de goede plaats in het schema
        mySVG.data = '<svg x="60" y="' + (height-heightunaltered) + '">' + mySVG.data + '</svg>';

        // Vervolgens tekenen we de module zelf
        mySVG.xleft = 1;
        mySVG.xright += 60;

        mySVG.data += '<rect x="' + (21) + '" width="' + (40) +
                      '" y="' + (5) + '" height="' + (height-10) + '" stroke="black" stroke-width="2" fill="white" />';

        mySVG.data += '<line x1="1" x2="21" y1="' + mySVG.yup + '" y2="' + mySVG.yup + '" stroke="black" />';


        mySVG.data += '<text x="' + (44) + '" ' + 'y="' + (mySVG.yup) + '" '
                   +  'transform="rotate(90 ' + (44) + ',' + (mySVG.yup) + ')" '
                   + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="10"' + '>'
                   + htmlspecialchars(this.props.tekst) + '</text>';

        return(mySVG);
    }

}