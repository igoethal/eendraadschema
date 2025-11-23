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

        // Draw door frame/opening
        // A simple line for the door itself and an arc for the swing
        // Assume the door is hinged at (0,0) or (breedte, 0) depending on direction
        // And opens 'up' (negative y in SVG usually, but yup is positive)

        // Let's assume the wall is along the X axis.
        // Hinge at (0,0).
        // Door length is 'breedte'.
        // If L, it swings up-left? Or up-right?
        // Standard architectural symbols:
        // L: Hinge left, swings open.
        // We will draw hinge at (0,0).

        // Door panel
        let doorPanel = `<line x1="0" y1="0" x2="0" y2="${-breedte}" style="stroke:black;stroke-width:2" />`;
        // Swing arc
        let swingArc = `<path d="M 0 ${-breedte} A ${breedte} ${breedte} 0 0 1 ${breedte} 0" style="stroke:black;fill:none;stroke-dasharray:5,5" />`;

        if (draairichting === 'R') {
            // Hinge at (breedte, 0)
             doorPanel = `<line x1="${breedte}" y1="0" x2="${breedte}" y2="${-breedte}" style="stroke:black;stroke-width:2" />`;
             swingArc = `<path d="M ${breedte} ${-breedte} A ${breedte} ${breedte} 0 0 0 0 0" style="stroke:black;fill:none;stroke-dasharray:5,5" />`;
        }

        mySVG.data = doorPanel + swingArc;

        // Add a baseline for the opening? Or maybe not, as it is an opening in a wall.
        // Usually just the arc and the door leaf.

        return mySVG;
    }
}
