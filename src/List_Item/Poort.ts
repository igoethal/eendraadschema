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

        // Draw dashed box
        mySVG.data = `<rect x="0" y="${-dikte/2}" width="${breedte}" height="${dikte}" style="stroke:black;fill:none;stroke-dasharray:5,5" />`;
        // Draw Cross
        mySVG.data += `<line x1="0" y1="${-dikte/2}" x2="${breedte}" y2="${dikte/2}" style="stroke:black" />`;
        mySVG.data += `<line x1="0" y1="${dikte/2}" x2="${breedte}" y2="${-dikte/2}" style="stroke:black" />`;

        return mySVG;
    }
}
