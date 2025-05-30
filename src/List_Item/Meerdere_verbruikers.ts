import { Electro_Item } from "./Electro_Item";
import { htmlspecialchars } from "../general";
import { SVGelement } from "../SVGelement";

export class Meerdere_verbruikers extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }    

    resetProps() {
        this.clearProps();
        this.props.type = "Meerdere verbruikers"; // This is rather a formality as we should already have this at this stage
        this.props.adres = "";     // Set Adres/tekst to "" when the item is cleared
    }

    allowedChilds() : Array<string> { // returns an array with the type-names of allowed childs
        return ["", "Domotica", "Domotica gestuurde verbruiker", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Contactdoos", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Omvormer", "Overspanningsbeveiliging", "Media", "Microgolfoven", "Motor", "Schakelaars", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zekering/differentieel", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Zeldzame symbolen"];
    }

    getMaxNumChilds(): number {
        return 256;
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml()
               +  "Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement; // = new SVGelement();

        // Maak een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id,"horizontal");

        // We voorzien altijd verticale ruimte, zelfs als de kinderen nog niet gedefinieerd zijn
        mySVG.ydown = Math.max(mySVG.ydown,25);
        mySVG.yup = Math.max(mySVG.yup,25);
        mySVG.xleft = Math.max(mySVG.xleft,1);

        // Plaats adres onderaan indien niet leeg en indien er actieve kinderen zijn
        if ( (!(/^\s*$/.test(this.props.adres))) && (this.heeftKindMetGekendType()) ) { // Controleer of adres leeg is
            mySVG.data += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="' + (mySVG.yup+mySVG.ydown+10)
              + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.props.adres) + '</text>';
              mySVG.ydown += 15;
        }

        return(mySVG);
    }

}