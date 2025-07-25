import { Electro_Item } from "./Electro_Item";
import { SVGelement } from "../SVGelement";
import { List_Item } from "./List_Item";

export class Splitsing extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Splitsing"; // This is rather a formality as we should already have this at this stage
        this.props.adres = "";         // Set Adres/tekst to "" when the item is cleared
    }

    allowedChilds() : Array<string> { // returns an array with the type-names of allowed childs
        return ["", "Kring"];
    }

    getMaxNumChilds(): number {
        return 256;
    }

    toHTML(mode: string, Parent?: List_Item) {
        // Suppress 'declared but never read' warning for the Parent parameter
        Parent;
        
        let output = this.toHTMLHeader(mode);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement; // = new SVGelement();

        // Maak een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id,"horizontal");

        let parent = this.getParent();
        
        // Teken de lijn onderaan
        if ( (parent.getType() == "Aansluiting") || (parent.getType() == "Kring") ) {
            mySVG.data += '<line x1="' + (mySVG.xleft) + '" x2="' + (mySVG.xleft + mySVG.xrightmin)
                       +  '" y1="' + mySVG.yup + '" y2="' + mySVG.yup + '" stroke="black" />'

        // Indien we kind zijn van een kring met meer dan 1 kind, voeg 10 pixels extra toe onderaan
        if (this.isChildOf("Kring")) {
            const parent =  this.getParent();
            if ( (parent !== null) && (parent.getNumChilds() > 1) ) {
                mySVG.ydown += 10;
                mySVG.data += `<line x1="${mySVG.xleft}" x2="${mySVG.xleft}" y1="${mySVG.yup+0}" y2="${mySVG.yup+10}" stroke="black" stroke-width="1" />`;
            }
        }

        } else {

            if ( (mySVG.xleft + mySVG.xright) <=0 ) mySVG.xrightmin = 15; // We teken altijd minstens een lijntje van 15 pixels om duidelijk te maken dat er een splitsing is

            if (mySVG.yup < 25) mySVG.yup = 25;
            if (mySVG.ydown < 25) mySVG.ydown = 25;

            mySVG.data += '<line x1="' + (1) + '" x2="' + (mySVG.xleft + mySVG.xrightmin)
                       +  '" y1="' + mySVG.yup + '" y2="' + mySVG.yup + '" stroke="black" />'
      
            mySVG.xright = mySVG.xright + mySVG.xleft;
            mySVG.xleft = 1; //we leave one pixel for the bold kring-line at the left
        }

        return(mySVG);
    }

}