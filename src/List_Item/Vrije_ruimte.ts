import { SVGelement } from "../SVGelement";
import { Electro_Item } from "./Electro_Item";

export class Vrije_ruimte extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type                        = this.getLegacyKey(mykeys,0);
        this.props.nr                          = this.getLegacyKey(mykeys,10);
        this.props.breedte                     = this.getLegacyKey(mykeys,22);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Vrije ruimte"; // This is rather a formality as we should already have this at this stage
        this.props.breedte = 25;            // Default breedte van de vrije ruimte
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Breedte: " + this.stringPropToHTML('breedte',3);

        return(output);
    }

    getMaxNumChilds(): number {
        return 0;
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();

        // Bepaal breedte van het element
        let desiredwidth = Number(this.props.breedte);
        if (isNaN(desiredwidth)) { desiredwidth = 25; }  

        // Creëer het element en return
        mySVG.yup = 0;
        mySVG.ydown = 0;
        mySVG.xleft = 0;
        mySVG.xright = desiredwidth;

        mySVG.data = "";

        return(mySVG);
    }

}