import { Electro_Item } from "./Electro_Item";
import { htmlspecialchars, svgTextWidth, contains } from "../general";
import { SVGelement } from "../SVGelement";
import { SVGSymbols } from "../SVGSymbols";

export class Kring extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type                                 = this.getLegacyKey(mykeys,0);
        this.props.aantal_polen                         = this.getLegacyKey(mykeys,4);
        this.props.bescherming                          = this.getLegacyKey(mykeys,7);
        this.props.amperage                             = this.getLegacyKey(mykeys,8);
        this.props.type_kabel                           = this.getLegacyKey(mykeys,9);
        this.props.naam                                 = this.getLegacyKey(mykeys,10);
        this.props.differentieel_delta_amperage         = this.getLegacyKey(mykeys,11);
        this.props.kabel_is_aanwezig                    = this.getLegacyKey(mykeys,12);
        this.props.tekst                                = this.getLegacyKey(mykeys,15);
        this.props.kabel_locatie                        = this.getLegacyKey(mykeys,16);
        this.props.kabel_is_in_buis                     = this.getLegacyKey(mykeys,19);
        this.props.differentieel_is_selectief           = this.getLegacyKey(mykeys,20);
        this.props.kortsluitvermogen                    = this.getLegacyKey(mykeys,22);
        this.props.huishoudelijk                        = true;
        this.props.fase                                 = '';
        switch (this.props.bescherming) {
            case "differentieel":
                this.props.type_differentieel = this.getLegacyKey(mykeys,17);
                break;
            case "automatisch":
                this.props.curve_automaat = this.getLegacyKey(mykeys,17);               
                break;
            case "differentieelautomaat":
                this.props.type_differentieel = this.getLegacyKey(mykeys,17);
                this.props.curve_automaat = this.getLegacyKey(mykeys,18);
                break;
        }
    } 

    resetProps() {
        this.clearProps();
        this.props.type = "Kring";
        this.props.nr = "";
        this.props.aantal_polen = "2";
        this.props.bescherming = "automatisch";
        this.props.amperage = "20";
        this.props.type_kabel = "XVB Cca 3G2,5";
        this.props.differentieel_delta_amperage = "300";
        this.props.tekst = "";
        this.props.kabel_locatie = "N/A";
        this.props.type_differentieel = "";
        this.props.curve_automaat = "";
        this.props.kabel_is_in_buis = false;
        this.props.differentieel_is_selectief = false;
        this.props.kortsluitvermogen = "";
        this.props.huishoudelijk = true;
        this.props.fase = '';

        //Bepalen of er per default een kabel aanwezig is en of we zekeringen plaatsen
        let parent = this.getParent();
        if (parent == null) {
            this.props.kabel_is_aanwezig = true; // Kabel aanwezig
            this.props.naam = "";   // We geven de kring geen naam als er geen parent is
        } else switch ((parent as Electro_Item).getType()) { // Selecteren op basis van parent
            case "Bord":
                this.props.bescherming = "automatisch"; // Wel een zekering na bord
                this.props.naam = "---";        // We zetten iets als default dat gebruikers niet vergeten een naam aan de kring te geven na een bord
                this.props.kabel_is_aanwezig = true;         // wel een kabel na bord
                break;
            case "Splitsing":
                this.props.bescherming = "geen"; // geen zekering per default na splitsing
                this.props.naam = "";    // We geven de kring geen naam
                this.props.kabel_is_aanwezig = false; // geen kabel per default na splitsing
                break;
            case "Kring":
                this.props.type_kabel = "";    // We geven geen kabeltype op
                this.props.naam = "";   // We geven de kring geen naam
                this.props.kabel_is_aanwezig = true;  // wel een kabel na domotica
                break;    
            case "Domotica":
                this.props.bescherming = "geen"; // geen zekering per default na domotica
                this.props.naam = "";    // We geven de kring geen naam
                this.props.kabel_is_aanwezig = true;  // wel een kabel na domotica
                break;
            default:
                this.props.bescherming = "automatisch"; // wel een zekering na bord
                this.props.naam = "";           // We geven de kring geen naam
                this.props.kabel_is_aanwezig = true;         // wel een kabel na bord
                break;
        }
    }

    allowedChilds() : Array<string> { // returns an array with the type-names of allowed childs
        return ["", "Aansluiting", "Bord", "Domotica", "Domotica module (verticaal)", "Domotica gestuurde verbruiker", "Kring", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Contactdoos", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Media", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zekering/differentieel", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Zeldzame symbolen"];
    }

    getMaxNumChilds(): number {
        return 256;
    }

    overrideKeys() {
        if ( ( (this.props.aantal_polen as number) < 1 ) || ( (this.props.aantal_polen as number) > 4 ) ) this.props.aantal_polen = "2"; //Test dat aantal polen bestaat
        if (this.props.kabel_locatie == "Luchtleiding") this.props.kabel_is_in_buis = false; //Indien luchtleiding nooit een buis tekenen
        if ( (this.props.bescherming != "differentieel") && (this.props.bescherming != "differentieelautomaat") ) this.props.differentieel_is_selectief = false;
        if (typeof(this.props.huishoudelijk) == 'undefined') this.props.huishoudelijk = true;
        if (!["automatisch", "differentieel", "differentieelautomaat", "smelt"].includes(this.props.bescherming)) this.props.fase = '';
        if (!["automatisch", "differentieel", "differentieelautomaat"].includes(this.props.bescherming)) this.props.kortsluitvermogen = '';
    }

    toHTML(mode: string) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Naam: " + this.stringPropToHTML('naam',5) + "<br>"
               +  "Zekering: " + this.selectPropToHTML('bescherming',["automatisch","differentieel","differentieelautomaat","smelt","geen","---","schakelaar","relais","schemer","overspanningsbeveiliging"]);


        // Aantal polen en Ampérage

        if ( (this.props.bescherming != "geen") && (this.props.bescherming != "relais") ) output += this.selectPropToHTML('aantal_polen',["2","3","4","-","1"]) + this.stringPropToHTML('amperage',2) + "A";

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

        // Eigenschappen van de kabel
        output += ", Kabel: " + this.checkboxPropToHTML('kabel_is_aanwezig');
        if (this.props.kabel_is_aanwezig) { // Kabel aanwezig
            output += ", Type: " + this.stringPropToHTML('type_kabel',10)
                   +  ", Plaatsing: " + this.selectPropToHTML('kabel_locatie',["N/A","Ondergronds","Luchtleiding","In wand","Op wand"]);
            if (this.props.kabel_locatie != "Luchtleiding") output += ", In buis: " + this.checkboxPropToHTML('kabel_is_in_buis')
        }

        if ((this.props.kortsluitvermogen != '') && (['differentieel','automatisch','differentieelautomaat'].includes(this.props.bescherming))) {
            output += ", Huishoudelijke installatie: " + this.checkboxPropToHTML('huishoudelijk');
        }
        
        output += ", Tekst: " + this.stringPropToHTML('tekst',10);

        return(output);
    }

    toSVG() {

        let addFase = (startNumlines:number, mySVG:SVGelement): number => {
            let numlines = startNumlines;
            if (['L1','L2','L3'].includes(this.props.fase)) {
                numlines = numlines + ((this.props.huishoudelijk && this.props.kortsluitvermogen != '') ? 1.3 : 1.0);
                mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                        +  " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                        +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                        +  htmlspecialchars(this.props.fase) + "</text>";
            }
            return numlines;
        }

        let mySVG:SVGelement = new SVGelement();

        SVGSymbols.addSymbol('zekering_automatisch');
        SVGSymbols.addSymbol('zekering_empty');
        SVGSymbols.addSymbol('zekering_smelt');
        SVGSymbols.addSymbol('overspanningsbeveiliging_inline');
        SVGSymbols.addSymbol('arrow');
        SVGSymbols.addSymbol('relais_kring');
            
        // Bepalen of we de hele kring naar rechts moeten opschuiven om rekening te houden met symbooltjes qua kabel-locatie

        let cable_location_available: number = 0;
        if ( this.props.kabel_is_aanwezig /* kabel aanwezig */ && (this.props.kabel_is_in_buis /* kabel in buis */ || contains(["Ondergronds","In wand","Op wand"],this.props.kabel_locatie) ) ) {
            cable_location_available = 1;
        }

        // Determine how much everything needs to be shifted right
        let shiftright = /*35*/25+20*cable_location_available;
        if (this.props.naam.length>2) {
            shiftright = Math.max(shiftright,svgTextWidth(htmlspecialchars(this.props.naam),12,'font-weight="bold"')+20); 
        }

        // Alle verbruikers van de kring tekenen

        mySVG = this.sourcelist.toSVG(this.id,"vertical",shiftright);

        // Kabel tekenen

        if (this.props.kabel_is_aanwezig) { // Kabel aanwezig

            // Kabel tekenen en naam van de kabel ernaast zetten
            mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup+100) + '" stroke="black" />'
                       +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup+80) + "\""
                       +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup+80) + ")" 
                       +  "\" style=\"text-anchor:start\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                       +  htmlspecialchars(this.props.type_kabel) + "</text>";

            // Luchtleiding tekenen indien van toepassing
            if (this.props.kabel_locatie == "Luchtleiding") mySVG.data += '<circle cx="' + (mySVG.xleft)  + '" cy="' + (mySVG.yup+20)   +'" r="4" style="stroke:black;fill:none" />';

            // Symbolen naast de kabel zetten
            if (cable_location_available) {

                if ( (this.props.kabel_is_in_buis) && (this.props.kabel_locatie != "Luchtleiding") ) // Rondje voor "in buis" tekenen
                    mySVG.data += '<circle cx="' + (mySVG.xleft-10) + '" cy="' + (mySVG.yup+40) +'" r="4" style="stroke:black;fill:none" />';

                switch (this.props.kabel_locatie) {

                    case "Ondergronds":
                        mySVG.data += '<line x1="' + (mySVG.xleft-13) + '" x2="' + (mySVG.xleft-13) + '" y1="' + (mySVG.yup+60) + '" y2="' + (mySVG.yup+80) + '" style="stroke:black" />'
                                   +  '<line x1="' + (mySVG.xleft-10) + '" x2="' + (mySVG.xleft-10) + '" y1="' + (mySVG.yup+62) + '" y2="' + (mySVG.yup+78) + '" style="stroke:black" />'
                                   +  '<line x1="' + (mySVG.xleft-7)  + '" x2="' + (mySVG.xleft-7)  + '" y1="' + (mySVG.yup+64) + '" y2="' + (mySVG.yup+76) + '" style="stroke:black" />';
                        break;

                    case "In wand":
                        mySVG.data += '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-15) + '" y1="' + (mySVG.yup+10) + '" y2="' + (mySVG.yup+30)  + '" style="stroke:black" />'
                                   +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (mySVG.yup+10) + '" y2="' + (mySVG.yup+10)  + '" style="stroke:black" />'
                                   +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (mySVG.yup+20) + '" y2="' + (mySVG.yup+20)  + '" style="stroke:black" />'
                                   +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (mySVG.yup+30) + '" y2="' + (mySVG.yup+30)  + '" style="stroke:black" />'
                                   +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-15) + '" y1="' + (mySVG.yup+65) + '" y2="' + (mySVG.yup+85)  + '" style="stroke:black" />'
                                   +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (mySVG.yup+85) + '" y2="' + (mySVG.yup+85)  + '" style="stroke:black" />'
                                   +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (mySVG.yup+65) + '" y2="' + (mySVG.yup+65)  + '" style="stroke:black" />'
                                   +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (mySVG.yup+75) + '" y2="' + (mySVG.yup+75)  + '" style="stroke:black" />';
                        break;

                    case "Op wand":
                        mySVG.data += '<line x1="' + (mySVG.xleft-5)  + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (mySVG.yup+10) + '" y2="' + (mySVG.yup+30)  +'" style="stroke:black" />'
                                   +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (mySVG.yup+10) + '" y2="' + (mySVG.yup+10)  +'" style="stroke:black" />'
                                   +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (mySVG.yup+20) + '" y2="' + (mySVG.yup+20)  +'" style="stroke:black" />'
                                   +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (mySVG.yup+30) + '" y2="' + (mySVG.yup+30)  +'" style="stroke:black" />'
                                   +  '<line x1="' + (mySVG.xleft-5)  + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (mySVG.yup+65) + '" y2="' + (mySVG.yup+85)  +'" style="stroke:black" />'
                                   +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (mySVG.yup+85) + '" y2="' + (mySVG.yup+85)  +'" style="stroke:black" />'
                                   +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (mySVG.yup+65) + '" y2="' + (mySVG.yup+65)  +'" style="stroke:black" />'
                                   +  '<line x1="' + (mySVG.xleft-15) + '" x2="' + (mySVG.xleft-5)  + '" y1="' + (mySVG.yup+75) + '" y2="' + (mySVG.yup+75)  +'" style="stroke:black" />';
                        break;
                }
            }

            mySVG.yup += 100;

        } else { // Kabel niet aanwezig, we tekenen gewoon een verticaal lijntje van 20 pixels
            mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup+20) + '" stroke="black" />';
            mySVG.yup += 20;
        }

        // Selectief differentieel tekenen indien van toepassing

        if (this.props.differentieel_is_selectief) { //Differentieel is selectief
            mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup+30) + '" stroke="black" />'
                       +  '<rect x="' + (mySVG.xleft+7) + '" y="' + (mySVG.yup) + '" width="16" height="16" stroke="black" fill="white" />'
                       +  "<text x=\"" + (mySVG.xleft+19) + "\" y=\"" + (mySVG.yup+8) + "\"" 
                       + " transform=\"rotate(-90 " + (mySVG.xleft+19) + "," + (mySVG.yup+8) + ")" 
                       + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" + "S" + "</text>";
            mySVG.yup += 23;
        }

        // Zekering, differentieel, of ander symbool onderaan plaatsen

        let nameshift = -6; // Deze geeft aan hoeveel de naam naar beneden geduwd kan worden
        let numlines = 1;   // Hier houden we het aantal lijnen tekst bij

        switch (this.props.bescherming) {

            case "automatisch":

                numlines = 1; // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                           +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>";

                // Code om de curve toe te voegen
                if ( (this.props.curve_automaat=='B') || (this.props.curve_automaat=='C') || (this.props.curve_automaat=='D') ) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                               +  " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                               +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                               +  htmlspecialchars("Curve " + this.props.curve_automaat) + "</text>";
                }

                // Code om kortsluitvermogen toe te voegen
                if ( (this.props.kortsluitvermogen!='') ) {
                    if (this.props.huishoudelijk) {
                        numlines = numlines + 1.3;
                        mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                                +  " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                                +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                                +  htmlspecialchars("" + (this.props.kortsluitvermogen*1000)) + "</text>";
                        let rectsize = svgTextWidth(htmlspecialchars("" + (this.props.kortsluitvermogen*1000)))+6;
                        mySVG.data += '<rect x="' + (mySVG.xleft+15+11*(numlines-2)+1) + '" y="' + (mySVG.yup-10-(rectsize/2)) + '" width="' + (11*1.2) + '" height="' + rectsize + '" fill="none" stroke="black" />';
                    } else {
                        numlines = numlines + 1.0;
                        mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                                +  " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                                +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                                +  htmlspecialchars("" + (this.props.kortsluitvermogen)) + "kA</text>";
                    }
                }

                // Code om fase toe te voegen
                numlines = addFase.bind(this)(numlines, mySVG);

                // Genoeg plaats voorzien aan de rechterkant en eindigen
                mySVG.xright = Math.max(mySVG.xright,20+11*(numlines-1));
                break;  

            case "differentieel":

                numlines = 2; // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                           +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  "\u0394" + htmlspecialchars(this.props.differentieel_delta_amperage + "mA") + "</text>"
                           +  "<text x=\"" + (mySVG.xleft+26) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+26) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>";

                // Code om het type toe te voegen
                if ( (this.props.type_differentieel=='A') || (this.props.type_differentieel=='B') ) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                               + " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                               + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                               + htmlspecialchars("Type " + this.props.type_differentieel) + "</text>";

                }

                // Code om kortsluitvermogen toe te voegen
                if ( (this.props.kortsluitvermogen!='') ) {
                    if (this.props.huishoudelijk) {
                        numlines = numlines + 1.3;
                        mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                                +  " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                                +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                                +  htmlspecialchars("" + (this.props.kortsluitvermogen*1000)) + "</text>";
                        let rectsize = svgTextWidth(htmlspecialchars("" + (this.props.kortsluitvermogen*1000)))+6;
                        mySVG.data += '<rect x="' + (mySVG.xleft+15+11*(numlines-2)+1) + '" y="' + (mySVG.yup-10-(rectsize/2)) + '" width="' + (11*1.2) + '" height="' + rectsize + '" fill="none" stroke="black" />';
                    } else {
                        numlines = numlines + 1.0;
                        mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                                +  " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                                +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                                +  htmlspecialchars("" + (this.props.kortsluitvermogen)) + "kA</text>";
                    }
                }

                // Code om fase toe te voegen
                numlines = addFase.bind(this)(numlines, mySVG);

                // genoeg plaats voorzien aan de rechterkant en eindigen
                mySVG.xright = Math.max(mySVG.xright,20+11*(numlines-1));
                break;

            case "differentieelautomaat":

                numlines = 2; // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                           +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  "\u0394" + htmlspecialchars(this.props.differentieel_delta_amperage + "mA") + "</text>"
                           +  "<text x=\"" + (mySVG.xleft+26) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+26) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>";

                // Code om de curve toe te voegen
                if ( (this.props.curve_automaat=='B') || (this.props.curve_automaat=='C') || (this.props.curve_automaat=='D') ) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                               +  " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                               +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                               +  htmlspecialchars("Curve " + this.props.curve_automaat) + "</text>";
                }

                // Code om het type toe te voegen
                if ( (this.props.type_differentieel=='A') || (this.props.type_differentieel=='B') ) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                               +  " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                               +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                               +  htmlspecialchars("Type " + this.props.type_differentieel) + "</text>";
                }

                // Code om kortsluitvermogen toe te voegen
                if ( (this.props.kortsluitvermogen!='') ) {
                    if (this.props.huishoudelijk) {
                        numlines = numlines + 1.3;
                        mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                                +  " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                                +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                                +  htmlspecialchars("" + (this.props.kortsluitvermogen*1000)) + "</text>";
                        let rectsize = svgTextWidth(htmlspecialchars("" + (this.props.kortsluitvermogen*1000)))+6;
                        mySVG.data += '<rect x="' + (mySVG.xleft+15+11*(numlines-2)+1) + '" y="' + (mySVG.yup-10-(rectsize/2)) + '" width="' + (11*1.2) + '" height="' + rectsize + '" fill="none" stroke="black" />';
                    } else {
                        numlines = numlines + 1.0;
                        mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                                +  " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                                +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                                +  htmlspecialchars("" + (this.props.kortsluitvermogen)) + "kA</text>";
                    }
                }

                // Code om fase toe te voegen
                numlines = addFase.bind(this)(numlines, mySVG);

                // genoeg plaats voorzien aan de rechterkant en eindigen
                mySVG.xright = Math.max(mySVG.xright,20+11*(numlines-1));
                break;

            case "schakelaar":

                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                mySVG.data += '<use xlink:href="#zekering_empty" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                           +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>";
                break;

            case "overspanningsbeveiliging":

                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                mySVG.data += '<use xlink:href="#overspanningsbeveiliging_inline" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                           +  "<text x=\"" + (mySVG.xleft+20) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+20) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>";

                nameshift = -11; //
                break;

            case "schemer":

                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                mySVG.data += '<use xlink:href="#zekering_empty" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                           +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  htmlspecialchars(this.props.aantal_polen + "P - " + this.props.amperage + "A") + "</text>"
                           +  '<use xlink:href="#arrow" x=\"' + (mySVG.xleft-18) + '" y="' + (mySVG.yup-15) + '" />'
                           +  '<use xlink:href="#arrow" x=\"' + (mySVG.xleft-18) + '" y="' + (mySVG.yup-12) + '" />';
                break;

            case "relais":

                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                mySVG.data += '<use xlink:href="#relais_kring" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />';
            
                nameshift = -11;
                break;

            case "smelt":

                numlines = 1; // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                mySVG.data += '<use xlink:href="#zekering_smelt" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                           +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  htmlspecialchars(this.props.aantal_polen + "P - " +  this.props.amperage + "A") + "</text>";
                
                // Code om fase toe te voegen
                numlines = addFase.bind(this)(numlines, mySVG);

                // Genoeg plaats voorzien aan de rechterkant en eindigen
                mySVG.xright = Math.max(mySVG.xright,20+11*(numlines-1));
                
                break;

            case "geen":

                mySVG.yup += 0;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                break;
        }

        // Tekst naast de kring
        let tekstlocatie = mySVG.yup - 40;                 //Standaard staat tekst boven de zekering
        if (this.props.bescherming == "geen") tekstlocatie += 25; //Als er geen zekering is kan tekst naar beneden
        mySVG.data += '<text x="' + (mySVG.xleft-6-20*cable_location_available) + '" ' + 'y="' + (tekstlocatie) + '" '
                   +  'transform="rotate(-90 ' + (mySVG.xleft-6-20*cable_location_available) + ',' + (tekstlocatie) + ')" '
                   + 'style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"' + '>'
                   + htmlspecialchars(this.props.tekst) + '</text>';

        // Naam onderaan zetten (links-onder)
        mySVG.data += '<text x="' + (mySVG.xleft+nameshift) + '" ' + 'y="' + (mySVG.yup+3) + '" '
                   +  'style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"' + '>'
                   + htmlspecialchars(this.props.naam) + '</text>';


        // Lijntje onder de zekering
        mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup+15) + '" stroke="black" />';
        mySVG.yup  += 15;

        // Als er helemaal niets getekend is voorzien we nog steeds een lege box
        if (mySVG.yup <= 0) {
            mySVG.xleft = 20;
            mySVG.xright = 20;
            mySVG.yup = 50;
            mySVG.ydown = 0;
        }                   

        return(mySVG);
    }

}