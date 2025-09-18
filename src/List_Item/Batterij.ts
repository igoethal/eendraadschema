import { Electro_Item } from "./Electro_Item";
import { SVGelement } from "../SVGelement";
import { SVGSymbols } from "../SVGSymbols";

export class Batterij extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Batterij";
        this.props.adres = "";
        this.props.symbool = "standaard";
    }

    overrideKeys() {
        if (this.props.symbool == null) this.props.symbool = "standaard";
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml();
        output += 'Symbool: ' + this.selectPropToHTML('symbool',["standaard","blokbatterij"])
        output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan: boolean = false) {
        let mySVG:SVGelement = new SVGelement();

        mySVG.xleft = 1; // foresee at least some space for the conductor

        mySVG.yup = 25;
        mySVG.ydown = 25;

        switch (this.props.symbool) {
            case "standaard":
                SVGSymbols.addSymbol('batterij_nieuw');
                mySVG.xright = 49;
                mySVG.data = (sitplan? "": '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
                                        + '<use xlink:href="#batterij_nieuw" x="21" y="25"></use>';
                break;
            default:
                SVGSymbols.addSymbol('batterij');
                mySVG.xright = 59;
                mySVG.data = (sitplan? "": '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
                                        + '<use xlink:href="#batterij" x="21" y="25"></use>';
        }

        
        mySVG.data += (sitplan? "": this.addAddressToSVG(mySVG,55,10));

        return(mySVG);
    }

}