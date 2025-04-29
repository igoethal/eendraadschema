import { SVGelement } from "../SVGelement";
import { SVGSymbols } from "../SVGSymbols";
import { Electro_Item } from "./Electro_Item";

export class Boiler extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.heeft_accumulatie = this.getLegacyKey(mykeys,3);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type                = "Boiler";
        this.props.heeft_accumulatie    = false;  
        this.props.adres               = "";
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml();
        output += "Accumulatie: " + this.checkboxPropToHTML('heeft_accumulatie');
        output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan: boolean = false) {
        let mySVG:SVGelement = new SVGelement();
        let outputstr:string = "";

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data = (sitplan? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>');
        switch (this.props.heeft_accumulatie) { //accumulatie
            case false:
                SVGSymbols.addSymbol('VerticalStripe');
                SVGSymbols.addSymbol('boiler');
                mySVG.data += '<use xlink:href="#boiler" x="21" y="25"></use>';
                break;
            case true:
                SVGSymbols.addSymbol('VerticalStripe');
                SVGSymbols.addSymbol('boiler_accu');
                mySVG.data += '<use xlink:href="#boiler_accu" x="21" y="25"></use>';
                break;
          }

        mySVG.data += (sitplan? "" : this.addAddressToSVG(mySVG,60));

        return(mySVG);
    }

}