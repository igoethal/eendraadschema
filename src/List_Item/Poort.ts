import { Electro_Item } from "./Electro_Item";
import { SVGelement } from "../SVGelement";

export class Poort extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.breedte = this.getLegacyKey(mykeys, 1);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Poort";
        this.props.breedte = 200;
        this.props.dikte = 20;
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);
        output += "Breedte: " + this.stringPropToHTML('breedte', 5);
        return output;
    }

    toSVG(sitplan = false) {
        let mySVG: SVGelement = new SVGelement();

        let breedte = Number(this.props.breedte);
        let dikte = Number(this.props.dikte);
        if (isNaN(breedte)) breedte = 200;
        if (isNaN(dikte)) dikte = 20;

        mySVG.xleft = 0;
        mySVG.xright = breedte;
        mySVG.yup = dikte / 2;
        mySVG.ydown = dikte / 2;

        // Sliding door representation
        mySVG.data = `<rect x="0" y="${-dikte/2}" width="${breedte / 2}" height="${dikte}" style="stroke:black;fill:white;" />`;
        mySVG.data += `<rect x="${breedte / 2}" y="${-dikte/2}" width="${breedte / 2}" height="${dikte}" style="stroke:black;fill:none;stroke-dasharray:5,5" />`;


        return mySVG;
    }
}
