import { Electro_Item } from "./Electro_Item";
import { SVGelement } from "../SVGelement";
import { SVGSymbols } from "../SVGSymbols";

export class Ventilator extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Ventilator";
        this.props.adres = "";  
        this.props.ventilatortype = "ventilator";
    }

    overrideKeys() {
        if (!this.props.ventilatortype) this.props.ventilatortype = "ventilator";
    }

    toHTML(mode: string) {
        this.overrideKeys();

        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml();
        output += this.selectPropToHTML('ventilatortype', ['ventilator', 'afzuigkap']);
        output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan = false) {
        let mySVG:SVGelement = new SVGelement();

        SVGSymbols.addSymbol('ventilator');

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 49;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data = (sitplan? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
                   + '<use xlink:href="#ventilator" x="21" y="25"></use>';

        if (this.props.ventilatortype === 'afzuigkap') {
            mySVG.data += `<line x1="21" y1="7" x2="36" y2="5" stroke="black" stroke-linecap="round"></line>`;
            mySVG.data += `<line x1="51" y1="7" x2="36" y2="5" stroke="black" stroke-linecap="round"></line>`;
        }
        
        mySVG.data += (sitplan? "" : this.addAddressToSVG(mySVG,55,10));

        return(mySVG);
    }

}