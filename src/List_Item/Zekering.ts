import { Electro_Item } from "./Electro_Item";
import { htmlspecialchars, svgTextWidth } from "../general";
import { SVGelement } from "../SVGelement";
import { SVGSymbols } from "../SVGSymbols";

export class Zekering extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {/* suppress never read warning */ mykeys} // Not needed as this element didn't exist when we still had legacy keys

    resetProps() {
        this.clearProps();
        this.props.type = "Zekering/differentieel"; // This is rather a formality as we should already have this at this stage
        this.props.nr = "";
        this.props.aantal_polen = "2";
        this.props.bescherming = "automatisch";
        this.props.amperage = "20";
        this.props.differentieel_delta_amperage = "300";
        this.props.type_differentieel = "";
        this.props.curve_automaat = "";
        this.props.differentieel_is_selectief = false;
        this.props.kortsluitvermogen = "";
        this.props.huishoudelijk = true;
        this.props.fase = '';
    }

    overrideKeys() {
        if ( ( (this.props.aantal_polen as number) < 1 ) || ( (this.props.aantal_polen as number) > 4 ) ) this.props.aantal_polen = "2"; //Test dat aantal polen bestaat
        if ( (this.props.bescherming != "differentieel") && (this.props.bescherming != "differentieelautomaat") ) this.props.differentieel_is_selectief = false;
        if (!this.isChildOf("Kring")) this.props.nr = "";
        if (typeof(this.props.huishoudelijk) == 'undefined') this.props.huishoudelijk = true;
        if (!["automatisch", "differentieel", "differentieelautomaat", "smelt"].includes(this.props.bescherming)) this.props.fase = '';
        if (!["automatisch", "differentieel", "differentieelautomaat"].includes(this.props.bescherming)) this.props.kortsluitvermogen = '';
    }

    toHTML(mode: string) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;";
        if (this.isChildOf("Kring")) output = output + this.nrToHtml();
        output = output + this.selectPropToHTML('bescherming',["automatisch","differentieel","differentieelautomaat","smelt"]);

        // Aantal polen en Ampérage

        if ( (this.props.bescherming != "geen") ) output += this.selectPropToHTML('aantal_polen',["2","3","4","-","1"]) + this.stringPropToHTML('amperage',2) + "A";

        // Specifieke input voor differentielen en automaten

        switch (this.props.bescherming) {

            case "differentieel":
                output += ", \u0394 " + this.stringPropToHTML('differentieel_delta_amperage',3) + "mA"
                       +  ", Type:" + this.selectPropToHTML('type_differentieel',["","A","B"])
                       +  ", Kortsluitstroom: " + this.stringPropToHTML('kortsluitvermogen',3) + "kA"
                       +  ", Selectief: " + this.checkboxPropToHTML('differentieel_is_selectief')
                       +  ", Fase: " + this.selectPropToHTML('fase',["","L1","L2","L3"]);
                break;

            case "automatisch":
                output += ", Curve:" + this.selectPropToHTML('curve_automaat',["","B","C","D"])
                       +  ", Kortsluitstroom: " + this.stringPropToHTML('kortsluitvermogen',3) + "kA"
                       +  ", Fase: " + this.selectPropToHTML('fase',["","L1","L2","L3"]);           
                break;

            case "differentieelautomaat":
                output += ", \u0394 " + this.stringPropToHTML('differentieel_delta_amperage',3) + "mA"
                       +  ", Curve:" + this.selectPropToHTML('curve_automaat',["","B","C","D"])
                       +  ", Type:" + this.selectPropToHTML('type_differentieel',["","A","B"])
                       +  ", Kortsluitstroom: " + this.stringPropToHTML('kortsluitvermogen',3) + "kA"
                       +  ", Selectief: " + this.checkboxPropToHTML('differentieel_is_selectief')
                       +  ", Fase: " + this.selectPropToHTML('fase',["","L1","L2","L3"]);
                break;

            case "smelt":
                output += ", Fase: " + this.selectPropToHTML('fase',["","L1","L2","L3"]);
                break;

        }

        if ((this.props.kortsluitvermogen != '') && (['differentieel','automatisch','differentieelautomaat'].includes(this.props.bescherming))) {
            output += ", Huishoudelijke installatie: " + this.checkboxPropToHTML('huishoudelijk');
        }

        return(output);
    }

    toSVG() {

        let addFase = (startNumlines:number, mySVG:SVGelement): number => {
            let numlines = startNumlines;
            if (['L1','L2','L3'].includes(this.props.fase)) {
                numlines = numlines + ((this.props.huishoudelijk && this.props.kortsluitvermogen != '') ? 1.3 : 1.0);
                mySVG.data += '<text x="' + (21+10+(this.props.bescherming == 'smelt' ? 4 : 0)) + '" y="' + (25+15+(numlines-1)*11) + '" ' 
                        +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                        +  htmlspecialchars(this.props.fase) + '</text>';
            }
            return numlines;
        }

        let mySVG:SVGelement = new SVGelement();

        SVGSymbols.addSymbol('zekering_automatisch_horizontaal');
        SVGSymbols.addSymbol('zekering_smelt_horizontaal');

        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 50;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data += '<line x1="1" y1="' + (25) + '" x2="21" y2="' + (25) + '" stroke="black"></line>';

        let numlines = 1;   // Hier houden we het aantal lijnen tekst bij

        switch (this.props.bescherming) {
            
            case "automatisch":
                numlines = 1; // Hier houden we het aantal lijnen tekst bij

                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch_horizontaal" x="21" y="25" />'
                           +  '<text x="' + (21+10) + '" y="' + (25+15) + '" '
                           +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                           +  htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + '</text>';

                // Code om de curve toe te voegen
                if ( (this.props.curve_automaat=='B') || (this.props.curve_automaat=='C') || (this.props.curve_automaat=='D') ) {
                    ++numlines;
                    mySVG.data += '<text x="' + (21+10) + '" y="' + (25+15+(numlines-1)*11) + '" ' 
                                +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                                +  htmlspecialchars("Curve " + this.props.curve_automaat) + '</text>';
                }

                // Code om kortsluitvermogen toe te voegen
                if ( (this.props.kortsluitvermogen!='') ) {
                    if (this.props.huishoudelijk) {
                        numlines = numlines + 1.3;
                        mySVG.data += '<text x="' + (21+10) + '" y="' + (25+15+(numlines-1)*11) + '" ' 
                                    +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                                    +  htmlspecialchars("" + (this.props.kortsluitvermogen*1000)) + '</text>';
                        let rectsize = svgTextWidth(htmlspecialchars("" + (this.props.kortsluitvermogen*1000)))+6;
                        mySVG.data += '<rect x="' + (21+10-(rectsize/2)) + '" y="' + (25+15+(numlines-1)*11-10) + '" width="' + rectsize + '" height="' + (11*1.2) + '" fill="none" stroke="black" />';
                    } else {
                        numlines = numlines + 1.0;
                        mySVG.data += '<text x="' + (21+10) + '" y="' + (25+15+(numlines-1)*11) + '" ' 
                                    +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                                    +  htmlspecialchars("" + (this.props.kortsluitvermogen)) + 'kA</text>';
                    }
                }

                // Code om fase toe te voegen
                numlines = addFase.bind(this)(numlines, mySVG);

                break;                          

            case "differentieel":
                numlines = 2; // Hier houden we het aantal lijnen tekst bij

                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch_horizontaal" x="21" y="25" />'
                           +  '<text x="' + (21+10) + '" y="' + (25+15) + '" '
                           +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                           +  '\u0394' + htmlspecialchars(this.props.differentieel_delta_amperage + "mA") + '</text>'
                           +  '<text x="' + (21+10) + '" y="' + (25+15+11) + '" ' 
                           +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                           +  htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + '</text>';

                // Code om het type toe te voegen
                if ( (this.props.type_differentieel=='A') || (this.props.type_differentieel=='B') ) {
                    ++numlines;
                    mySVG.data += '<text x="' + (21+10) + '" y="' + (25+15+(numlines-1)*11) + '" ' 
                               +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                               + htmlspecialchars("Type " + this.props.type_differentieel) + '</text>';

                }

                // Code om kortsluitvermogen toe te voegen
                if ( (this.props.kortsluitvermogen!='') ) {
                    if (this.props.huishoudelijk) {
                        numlines = numlines + 1.3;
                        mySVG.data += '<text x="' + (21+10) + '" y="' + (25+15+(numlines-1)*11) + '" ' 
                                    +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                                    +  htmlspecialchars("" + (this.props.kortsluitvermogen*1000)) + '</text>';
                        let rectsize = svgTextWidth(htmlspecialchars("" + (this.props.kortsluitvermogen*1000)))+6;
                        mySVG.data += '<rect x="' + (21+10-(rectsize/2)) + '" y="' + (25+15+(numlines-1)*11-10) + '" width="' + rectsize + '" height="' + (11*1.2) + '" fill="none" stroke="black" />';
                    } else {
                        numlines = numlines + 1.0;
                        mySVG.data += '<text x="' + (21+10) + '" y="' + (25+15+(numlines-1)*11) + '" ' 
                                    +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                                    +  htmlspecialchars("" + (this.props.kortsluitvermogen)) + 'kA</text>';
                    }
                }

                // Code om fase toe te voegen
                numlines = addFase.bind(this)(numlines, mySVG);

                break;

            case "differentieelautomaat":

                numlines = 2; // Hier houden we het aantal lijnen tekst bij
            
                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch_horizontaal" x="21" y="25" />'
                           +  '<text x="' + (21+10) + '" y="' + (25+15) + '" '
                           +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                           +  '\u0394' + htmlspecialchars(this.props.differentieel_delta_amperage + "mA") + '</text>'
                           +  '<text x="' + (21+10) + '" y="' + (25+15+11) + '" ' 
                           +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                           +  htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + '</text>';

                // Code om de curve toe te voegen
                if ( (this.props.curve_automaat=='B') || (this.props.curve_automaat=='C') || (this.props.curve_automaat=='D') ) {
                    ++numlines;
                    mySVG.data += '<text x="' + (21+10) + '" y="' + (25+15+(numlines-1)*11) + '" ' 
                                +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                                +  htmlspecialchars("Curve " + this.props.curve_automaat) + '</text>';
                }

                // Code om het type toe te voegen
                if ( (this.props.type_differentieel=='A') || (this.props.type_differentieel=='B') ) {
                    ++numlines;
                    mySVG.data += '<text x="' + (21+10) + '" y="' + (25+15+(numlines-1)*11) + '" ' 
                               +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                               + htmlspecialchars("Type " + this.props.type_differentieel) + '</text>';

                }               

                // Code om kortsluitvermogen toe te voegen
                if ( (this.props.kortsluitvermogen!='') ) {
                    if (this.props.huishoudelijk) {
                        numlines = numlines + 1.3;
                        mySVG.data += '<text x="' + (21+10) + '" y="' + (25+15+(numlines-1)*11) + '" ' 
                                    +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                                    +  htmlspecialchars("" + (this.props.kortsluitvermogen*1000)) + '</text>';
                        let rectsize = svgTextWidth(htmlspecialchars("" + (this.props.kortsluitvermogen*1000)))+6;
                        mySVG.data += '<rect x="' + (21+10-(rectsize/2)) + '" y="' + (25+15+(numlines-1)*11-10) + '" width="' + rectsize + '" height="' + (11*1.2) + '" fill="none" stroke="black" />';
                    } else {
                        numlines = numlines + 1.0;
                        mySVG.data += '<text x="' + (21+10) + '" y="' + (25+15+(numlines-1)*11) + '" ' 
                                    +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                                    +  htmlspecialchars("" + (this.props.kortsluitvermogen)) + 'kA</text>';
                    }
                }

                // Code om fase toe te voegen
                numlines = addFase.bind(this)(numlines, mySVG);

                break;

            case "smelt":

                numlines = 1.4; // Hier houden we het aantal lijnen tekst bij

                mySVG.data += '<use xlink:href="#zekering_smelt_horizontaal" x="21" y="25" />'
                           +  '<text x="' + (21+14) + '" y="' + (25+20) + '" ' 
                           +  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">'
                           +  htmlspecialchars(this.props.aantal_polen + "P - " +  this.props.amperage + "A") + '</text>';

                // Code om fase toe te voegen
                numlines = addFase.bind(this)(numlines, mySVG);

                break;
        }

        mySVG.ydown = mySVG.ydown + 11 * (numlines-1);

        // Selectief differentieel tekenen indien van toepassing

        if (this.props.differentieel_is_selectief) { //Differentieel is selectief
            mySVG.data += '<line x1="' +(mySVG.xright+2) + '" x2="' + (mySVG.xright+2+30) + '" y1="25" y2="25" stroke="black" />'
                        + '<rect x="' + (mySVG.xright+8) + '" y="32" width="16" height="16" stroke="black" fill="white" />'
                        + '<text x="' + (mySVG.xright+16) + '" y="' + (25+19) + '" ' 
                        + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + 'S' + '</text>';
            mySVG.xright = mySVG.xright + 30;
        }

        return(mySVG);
    }

}