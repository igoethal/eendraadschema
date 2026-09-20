import { Electro_Item } from "./Electro_Item";
import { htmlspecialchars } from "../general";
import { SVGelement } from "../SVGelement";

export class Leiding extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        // Niet van toepassing, element bestond nog niet toen we met legacy keys werkten
        // suppress warning on mykeys never used
        mykeys
    }

    resetProps() {
        this.clearProps();
        this.props.type  = "Leiding";
        this.props.type_kabel = "XVB Cca 3G2,5";
        this.props.kabel_locatie = "N/A";
        this.props.kabel_is_in_buis = false;
        this.props.adres = "";
    }

    overrideKeys() {
        if (this.props.kabel_locatie == "Luchtleiding") this.props.kabel_is_in_buis = false; //Indien luchtleiding nooit een buis tekenen
    }


    toSVG() {
        this.overrideKeys();

        // Een leiding die rechtstreeks onder een kring hangt (tussen verbruikers) wordt verticaal
        // getekend, in lijn met de verticale as van de kring, in plaats van horizontaal.
        let parent = this.getParent();
        if (parent != null && parent.getType() == "Kring") return this.toSVGVerticaal();

        return this.toSVGHorizontaal();
    }


    toSVGVerticaal() {
        let mySVG:SVGelement = new SVGelement();

        let height = 100;

        mySVG.xleft = 15; // ruimte links van de as voor symbolen (in buis, ondergronds, in/op wand)
        mySVG.xright = 20; // ruimte rechts van de as voor de naam van de kabel
        mySVG.yup = height/2;
        mySVG.ydown = height/2;

        // De as (het verticale stuk kabel) tekenen
        mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="0" y2="' + height + '" stroke="black" />'
                   +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (80) + "\""
                   +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (80) + ")"
                   +  "\" style=\"text-anchor:start\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">"
                   +  htmlspecialchars(this.props.type_kabel) + "</text>";

        // Luchtleiding tekenen indien van toepassing
        if (this.props.kabel_locatie == "Luchtleiding") mySVG.data += '<circle cx="' + (mySVG.xleft) + '" cy="' + (20) + '" r="4" style="stroke:black;fill:none" />';

        // Symbolen naast de kabel zetten
        if ( (this.props.kabel_is_in_buis) && (this.props.kabel_locatie != "Luchtleiding") ) // Rondje voor "in buis" tekenen
            mySVG.data += '<circle cx="' + (mySVG.xleft-10) + '" cy="' + (40) + '" r="4" style="stroke:black;fill:none" />';

        switch (this.props.kabel_locatie) {

            case "Ondergronds":
                mySVG.data += '<line x1="' + (mySVG.xleft-13) + '" x2="' + (mySVG.xleft-13) + '" y1="' + (60) + '" y2="' + (80) + '" style="stroke:black" />'
                           +  '<line x1="' + (mySVG.xleft-10) + '" x2="' + (mySVG.xleft-10) + '" y1="' + (62) + '" y2="' + (78) + '" style="stroke:black" />'
                           +  '<line x1="' + (mySVG.xleft-7)  + '" x2="' + (mySVG.xleft-7)  + '" y1="' + (64) + '" y2="' + (76) + '" style="stroke:black" />';
                break;

            case "In wand":
                mySVG.data += '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-15) + '" y1="' + (10) + '" y2="' + (30) + '" style="stroke:black" />'
                           +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (10) + '" y2="' + (10) + '" style="stroke:black" />'
                           +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (20) + '" y2="' + (20) + '" style="stroke:black" />'
                           +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (30) + '" y2="' + (30) + '" style="stroke:black" />'
                           +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-15) + '" y1="' + (65) + '" y2="' + (85) + '" style="stroke:black" />'
                           +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (85) + '" y2="' + (85) + '" style="stroke:black" />'
                           +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (65) + '" y2="' + (65) + '" style="stroke:black" />'
                           +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (75) + '" y2="' + (75) + '" style="stroke:black" />';
                break;

            case "Op wand":
                mySVG.data += '<line x1="' + (mySVG.xleft-5)  + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (10) + '" y2="' + (30) + '" style="stroke:black" />'
                           +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (10) + '" y2="' + (10) + '" style="stroke:black" />'
                           +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (20) + '" y2="' + (20) + '" style="stroke:black" />'
                           +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (30) + '" y2="' + (30) + '" style="stroke:black" />'
                           +  '<line x1="' + (mySVG.xleft-5)  + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (65) + '" y2="' + (85) + '" style="stroke:black" />'
                           +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (85) + '" y2="' + (85) + '" style="stroke:black" />'
                           +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (65) + '" y2="' + (65) + '" style="stroke:black" />'
                           +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (75) + '" y2="' + (75) + '" style="stroke:black" />';
                break;
        }

        mySVG.data += "\n";

        return(mySVG);
    }


    toSVGHorizontaal() {
        let mySVG:SVGelement = new SVGelement();

        let width = 100;

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = width-1;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data += '<line x1="1" y1="25" x2="' + (width+1) + '" y2="25" stroke="black" />';

        // Luchtleiding tekenen indien van toepassing
        if (this.props.kabel_locatie == "Luchtleiding") mySVG.data += '<circle cx="' + (80)  + '" cy="' + (25)   +'" r="4" style="stroke:black;fill:none" />';

        // Symbolen naast de kabel zetten
        if ( (this.props.kabel_is_in_buis) && (this.props.kabel_locatie != "Luchtleiding") ) // Rondje voor "in buis" tekenen
            mySVG.data += '<circle cx="' + (65) + '" cy="' + (15) +'" r="4" style="stroke:black;fill:none" />';

        switch (this.props.kabel_locatie) {

            case "Ondergronds":
                mySVG.data += '<line y1="' + (25-13) + '" y2="' + (25-13) + '" x1="' + (100-60+5) + '" x2="' + (100-80+5) + '" style="stroke:black" />'
                           +  '<line y1="' + (25-10) + '" y2="' + (25-10) + '" x1="' + (100-62+5) + '" x2="' + (100-78+5) + '" style="stroke:black" />'
                           +  '<line y1="' + (25-7)  + '" y2="' + (25-7)  + '" x1="' + (100-64+5) + '" x2="' + (100-76+5) + '" style="stroke:black" />';
                break;

            case "In wand":
                mySVG.data += '<line y1="' + (25-15) + '" y2="' + (25-15) + '" x1="' + (100-10+5) + '" x2="' + (100-30+5)  + '" style="stroke:black" />'
                           +  '<line y1="' + (25-15) + '" y2="' + (25-5)  + '" x1="' + (100-10+5) + '" x2="' + (100-10+5)  + '" style="stroke:black" />'
                           +  '<line y1="' + (25-15) + '" y2="' + (25-5)  + '" x1="' + (100-20+5) + '" x2="' + (100-20+5)  + '" style="stroke:black" />'
                           +  '<line y1="' + (25-15) + '" y2="' + (25-5)  + '" x1="' + (100-30+5) + '" x2="' + (100-30+5)  + '" style="stroke:black" />'
                           +  '<line y1="' + (25-15) + '" y2="' + (25-15) + '" x1="' + (100-65+5) + '" x2="' + (100-85+5)  + '" style="stroke:black" />'
                           +  '<line y1="' + (25-15) + '" y2="' + (25-5)  + '" x1="' + (100-85+5) + '" x2="' + (100-85+5)  + '" style="stroke:black" />'
                           +  '<line y1="' + (25-15) + '" y2="' + (25-5)  + '" x1="' + (100-65+5) + '" x2="' + (100-65+5)  + '" style="stroke:black" />'
                           +  '<line y1="' + (25-15) + '" y2="' + (25-5)  + '" x1="' + (100-75+5) + '" x2="' + (100-75+5)  + '" style="stroke:black" />';
                break;

            case "Op wand":
                mySVG.data += '<line y1="' + (25-5)  + '" y2="' + (25-5)  + '" x1="' + (100-10+5) + '" x2="' + (100-30+5)  +'" style="stroke:black" />'
                           +  '<line y1="' + (25-15) + '" y2="' + (25-5)  + '" x1="' + (100-10+5) + '" x2="' + (100-10+5)  +'" style="stroke:black" />'
                           +  '<line y1="' + (25-15) + '" y2="' + (25-5)  + '" x1="' + (100-20+5) + '" x2="' + (100-20+5)  +'" style="stroke:black" />'
                           +  '<line y1="' + (25-15) + '" y2="' + (25-5)  + '" x1="' + (100-30+5) + '" x2="' + (100-30+5)  +'" style="stroke:black" />'
                           +  '<line y1="' + (25-5)  + '" y2="' + (25-5)  + '" x1="' + (100-65+5) + '" x2="' + (100-85+5)  +'" style="stroke:black" />'
                           +  '<line y1="' + (25-15) + '" y2="' + (25-5)  + '" x1="' + (100-85+5) + '" x2="' + (100-85+5)  +'" style="stroke:black" />'
                           +  '<line y1="' + (25-15) + '" y2="' + (25-5)  + '" x1="' + (100-65+5) + '" x2="' + (100-65+5)  +'" style="stroke:black" />'
                           +  '<line y1="' + (25-15) + '" y2="' + (25-5)  + '" x1="' + (100-75+5) + '" x2="' + (100-75+5)  +'" style="stroke:black" />';
                break;
        }

        mySVG.data += '<text x="' + (15) + '" y="' + (39) + '" style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                       +  htmlspecialchars(this.props.type_kabel) + '</text>';
        
        mySVG.data += "\n";

        return(mySVG);
    }

}
