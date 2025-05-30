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

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml()
               +  "Type: " + this.stringPropToHTML('type_kabel',10)
               +  ", Plaatsing: " + this.selectPropToHTML('kabel_locatie',["N/A","Ondergronds","Luchtleiding","In wand","Op wand"]);
        
        if (this.props.kabel_locatie != "Luchtleiding") output += ", In buis: " + this.checkboxPropToHTML('kabel_is_in_buis');

        return(output);
    }

    toSVG() {
        this.overrideKeys();

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