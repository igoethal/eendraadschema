import { Electro_Item } from "./Electro_Item";
import { SVGelement } from "../SVGelement";

export class Container extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        // Bestond nog niet toen de legacy keys werden gedefinieerd
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Container";  
    }    

    toHTML(mode: string) {
        return("");
    }

    toSVG(sitplan = false) {
        let mySVG:SVGelement = new SVGelement();

        mySVG.xleft = 0;
        mySVG.xright = 0;
        mySVG.yup = 0;
        mySVG.ydown = 0;

        mySVG.data = '';

        return(mySVG);
    }

}