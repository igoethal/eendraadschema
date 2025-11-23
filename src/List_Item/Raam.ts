import { Electro_Item } from "./Electro_Item";
import { SVGelement } from "../SVGelement";

export class Raam extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.breedte = this.getLegacyKey(mykeys, 1);
        this.props.dikte = this.getLegacyKey(mykeys, 2);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Raam";
        this.props.breedte = 100;
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
        if (isNaN(breedte)) breedte = 100;
        if (isNaN(dikte)) dikte = 20;

        mySVG.xleft = 0;
        mySVG.xright = breedte;
        mySVG.yup = dikte / 2;
        mySVG.ydown = dikte / 2;

        // Draw rectangle for wall opening bounds
        mySVG.data = `<rect x="0" y="${-dikte/2}" width="${breedte}" height="${dikte}" style="stroke:black;fill:white" />`;
        // Draw line in middle for glass
        mySVG.data += `<line x1="0" y1="0" x2="${breedte}" y2="0" style="stroke:black;stroke-width:1" />`;

        return mySVG;
    }
}
