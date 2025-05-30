import { Electro_Item } from "./Electro_Item";
import { SVGelement } from "../SVGelement";
import { SVGSymbols } from "../SVGSymbols";

export class Bel extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Bel";
        this.props.adres = "";  
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml();
        output += "Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();

        SVGSymbols.addSymbol('bel');

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 40;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
                   + '<use xlink:href="#bel" x="21" y="25"></use>';
        
        mySVG.data += this.addAddressToSVG(mySVG,60,15);

        return(mySVG);
    }

    /**
     * Geeft de boundary's terug van het element in het situatieplan. Deze boundary's worden gebruikt om het element te positioneren en te clippen.
     * 
     * @returns {Object} Een object met de volgende properties:
     *   - clipleft: de afstand die links wordt weggesneden op de standaard tekening van het Electro_Item. Vaak zit hier 20 nutteloze pixels waar in het eendraadschema een stukje leiding en het nummer staat.
     *   - addright: een eventuele afstand die rechts dient toegevoegd te worden, of (indien negatief) een clipping aan de rechter kant.
     *   - cliptop: zelfs als clipleft maar aan de bovenkant.
     *   - addbottom: zelfde als addright maar aan de onderkant.
     */

    getSitPlanBoundaries() {
        return {
            clipleft: 0,
            addright: 0,
            cliptop: 0,
            addbottom: 0
        }
    }

}