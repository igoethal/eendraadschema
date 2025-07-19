import { Electro_Item } from "./Electro_Item";
import { SVGelement } from "../SVGelement";
import { SVGSymbols } from "../SVGSymbols";

export class Zeldzame_symbolen extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
        this.props.symbool          = this.getLegacyKey(mykeys,16);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Zeldzame symbolen";
        this.props.adres = "";
        this.props.symbool = "";
    }

    overrideKeys() {
        if (this.props.symbool !== "deurslot") {
            this.props.adres = ""; // reset adres if not deurslot
        }
    }

    toHTML(mode: string) {
        this.overrideKeys();

        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml()
               +  "Symbool: " + this.selectPropToHTML('symbool',["","aarding","deurslot"]);

        if (this.props.symbool === "deurslot") output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan = false) {
        let mySVG:SVGelement = new SVGelement();

        SVGSymbols.addSymbol('deurslot');

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        switch (this.props.symbool) {
            case "aarding":
                let linesize = 20;
                mySVG.data += `<line x1="1" y1="25" x2="${linesize+0.5}" y2="25" stroke="black"></line>` 
                            + '<line x1="' + (linesize) + '" y1="' + (mySVG.yup) + '" x2="' + (linesize) + '" y2="' + (mySVG.yup + 10) + '" stroke="black" />'
                           +  '<line x1="' + (linesize - 10) + '" y1="' + (mySVG.yup + 10) + '" x2="' + (linesize + 10) + '" y2="' + (mySVG.yup + 10) + '" stroke="black" />'
                           +  '<line x1="' + (linesize - 7.5) + '" y1="' + (mySVG.yup + 13) + '" x2="' + (linesize + 7.5) + '" y2="' + (mySVG.yup + 13) + '" stroke="black" />'
                           +  '<line x1="' + (linesize - 5) + '" y1="' + (mySVG.yup + 16) + '" x2="' + (linesize + 5) + '" y2="' + (mySVG.yup + 16) + '" stroke="black" />';
                // Indien de aarding een kind heeft, teken een streepje rechts
                if ( (this.heeftVerbruikerAlsKind()) && (!sitplan) ) {
                    mySVG.data += `<line x1="${linesize+0.5}" y1="25" x2="${linesize+10}" y2="25" stroke="black" />`;
                };
                mySVG.xright = 28;
                break;
            case "deurslot":
                mySVG.data += (sitplan? "" : '<line x1="1" y1="25" x2="21.5" y2="25" stroke="black"></line>')
                           +  '<use xlink:href="#deurslot" x="21" y="25"></use>';
                mySVG.xright = 58;
                mySVG.data += this.addAddressToSVG(mySVG,55,10,2);
                break;
            default:
                mySVG.data += (sitplan? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>');
                mySVG.xright = -1;
                break;
          }

        return(mySVG);
    }

}