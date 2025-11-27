import { Electro_Item } from "./Electro_Item";
import { SVGelement } from "../SVGelement";

export class Muur extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type = this.getLegacyKey(mykeys, 0);
        this.props.lengte = this.getLegacyKey(mykeys, 1);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Muur";
        this.props.lengte = 100;
        this.props.dikte = 20;
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);
        output += "Lengte: " + this.stringPropToHTML('lengte', 5);
        return output;
    }

    toSVG(sitplan = false) {
        let mySVG: SVGelement = new SVGelement();

        let lengte = Number(this.props.lengte);
        let dikte = Number(this.props.dikte);
        if (isNaN(lengte)) lengte = 100;
        if (isNaN(dikte)) dikte = 20;

        mySVG.xleft = 0;
        mySVG.xright = lengte;
        mySVG.yup = dikte / 2;
        mySVG.ydown = dikte / 2;

        // Center is at y=0. Top left is x=0, y=-dikte/2
        mySVG.data = `<rect x="0" y="${-dikte/2}" width="${lengte}" height="${dikte}" style="stroke:black;fill:gray;fill-opacity:0.5" />`;

        return mySVG;
    }

}
