import { Electro_Item } from "./Electro_Item";
import { SVGelement } from "../SVGelement";

export class Deur extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.breedte = this.getLegacyKey(mykeys, 1);
        this.props.draairichting = this.getLegacyKey(mykeys, 2);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Deur";
        this.props.breedte = 90;
        this.props.draairichting = "L"; // L or R
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);
        output += "Breedte: " + this.stringPropToHTML('breedte', 5);
        output += ", Draairichting: " + this.selectPropToHTML('draairichting', ['L', 'R']);
        return output;
    }

    toSVG(sitplan = false) {
        let mySVG: SVGelement = new SVGelement();

        let breedte = Number(this.props.breedte);
        if (isNaN(breedte)) breedte = 90;
        let draairichting = this.props.draairichting;

        mySVG.xleft = 0;
        mySVG.xright = breedte;
        mySVG.yup = breedte;
        mySVG.ydown = 0;

        //line
        let line = `<line x1="0" y1="0" x2="${breedte}" y2="0" style="stroke:gray;stroke-width:10" />`;
        // Door panel
        let doorPanel = `<line x1="0" y1="0" x2="0" y2="${-breedte}" style="stroke:black;stroke-width:2" />`;
        // Swing arc
        let swingArc = `<path d="M 0 ${-breedte} A ${breedte} ${breedte} 0 0 1 ${breedte} 0" style="stroke:black;fill:none;stroke-dasharray:5,5" />`;

        if (draairichting === 'R') {
            // Hinge at (breedte, 0)
             doorPanel = `<line x1="${breedte}" y1="0" x2="${breedte}" y2="${-breedte}" style="stroke:black;stroke-width:2" />`;
             swingArc = `<path d="M ${breedte} ${-breedte} A ${breedte} ${breedte} 0 0 0 0 0" style="stroke:black;fill:none;stroke-dasharray:5,5" />`;
        }

        mySVG.data = line + doorPanel + swingArc;

        return mySVG;
    }
}
