import { Electro_Item } from "./Electro_Item";
import { htmlspecialchars, svgTextWidth, trimString } from "../general";
import { SVGelement } from "../SVGelement";
import { SVGSymbols } from "../SVGSymbols";

export class Aansluiting extends Electro_Item {
    
    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type                                 = this.getLegacyKey(mykeys,0);
        this.props.aantal_polen                         = this.getLegacyKey(mykeys,4);
        this.props.bescherming                          = this.getLegacyKey(mykeys,7);
        this.props.amperage                             = this.getLegacyKey(mykeys,8);
        this.props.type_kabel_na_teller                 = this.getLegacyKey(mykeys,9);
        this.props.nr                                   = this.getLegacyKey(mykeys,10);        
        this.props.differentieel_delta_amperage         = this.getLegacyKey(mykeys,11);
        this.props.adres                                = this.getLegacyKey(mykeys,15);
        this.props.differentieel_is_selectief           = this.getLegacyKey(mykeys,20);
        this.props.kortsluitvermogen                    = this.getLegacyKey(mykeys,22);
        this.props.naam                                 = this.getLegacyKey(mykeys,23);
        this.props.type_kabel_voor_teller               = this.getLegacyKey(mykeys,24);
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
        this.props.type = "Aansluiting";
        this.props.aantal_polen = "2";
        this.props.bescherming = "differentieel";
        this.props.amperage = "40";
        this.props.type_kabel_na_teller = "2x16";
        this.props.differentieel_delta_amperage = "300";
        this.props.adres = "";
        this.props.type_differentieel = "";
        this.props.curve_automaat = "";
        this.props.differentieel_is_selectief = false;
        this.props.kortsluitvermogen = "";
        this.props.naam = "";
        this.props.type_kabel_voor_teller = "";
        this.props.huishoudelijk = true;
        this.props.fase = '';
        this.props.normaalGesloten = false;
    }

    allowedChilds() : Array<string> { // returns an array with the type-names of allowed childs
        return ["", "Bord", "Kring", "Splitsing"];
    }

    getMaxNumChilds(): number {
        return 256;
        // Dit kan vreemd lijken omdat in principe een aansluiting maar 1 kind heeft.
        // Echter, in het verleden was 256 wel toegelaten en het is niet uit te sluiten dat gebruikers meerdere kringen onder een aansluiting gehangen hebben
        // om deze kringen verticaal te kunnen stapelen. Om het programma backward compatibel te houden behouden we dus 256 tot grandfathering code kan worden ontwikkeld.
        // Ook laat dit toe om tijdelijk een elementje onder aansluiting te hangen alvorens het met move elders onder te brengen
    }

    overrideKeys() {
        if (this.props.normaalGesloten == null) this.props.normaalGesloten = false;

        if (this.props.bescherming == "schakelaar") this.props.bescherming = "contact"; // used to be called "schakelaar" in older saves

        if ( (this.props.aantal_polen !== '') &&
             ( ( (this.props.aantal_polen as number) < 1 ) || 
               ( (this.props.aantal_polen as number) > 4 ) ) ) this.props.aantal_polen = "2"; //Test dat aantal polen bestaat

        if ( (this.props.normaalGesloten === true) && (this.props.bescherming !== "contact") ) {
            this.props.normaalGesloten = false; // Indien normaal gesloten, dan moet de bescherming een contact zijn
        }

        if (typeof(this.props.huishoudelijk) == 'undefined') this.props.huishoudelijk = true;
        if (!["automatisch", "differentieel", "differentieelautomaat", "smelt"].includes(this.props.bescherming)) this.props.fase = '';
        if (!["automatisch", "differentieel", "differentieelautomaat"].includes(this.props.bescherming)) this.props.kortsluitvermogen = '';
    }

    toHTML(mode: string) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Naam: " + this.stringPropToHTML('naam',5) + "<br>";

        if (this.getParent() != null) {
            const nrHtml = this.nrToHtml();
            output += (typeof nrHtml === "string" ? nrHtml.substring(2) : nrHtml);
        }
        
        output += "Bescherming: " + this.selectPropToHTML('bescherming',["automatisch","differentieel","differentieelautomaat","smelt","geen","---","contact","schemer"]) 

        if (this.props.bescherming != "geen") output += this.selectPropToHTML('aantal_polen',["2","3","4","-","1",""]) + this.stringPropToHTML('amperage',2) + "A";

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

            case "contact":
                output += ", Normaal Gesloten: " + this.checkboxPropToHTML('normaalGesloten');
                break;

        }

        output += ", Kabeltype na teller: " + this.stringPropToHTML('type_kabel_na_teller',10)
               +  ", Kabeltype v&oacute;&oacute;r teller: " + this.stringPropToHTML('type_kabel_voor_teller',10);

        if ((this.props.kortsluitvermogen != '') && (['differentieel','automatisch','differentieelautomaat'].includes(this.props.bescherming))) {
            output += ", Huishoudelijke installatie: " + this.checkboxPropToHTML('huishoudelijk');
        }

        output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan = false): SVGelement {

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

        // Als we het situateplan tekenen, dan tekenen we enkel de elektriciteitsmeter

        if (sitplan) {
                    let mySVG:SVGelement = new SVGelement();

            SVGSymbols.addSymbol('elektriciteitsmeter');

            mySVG.xleft = 1; // foresee at least some space for the conductor
            mySVG.xright = 59;
            mySVG.yup = 25;
            mySVG.ydown = 25;

            mySVG.data = '<use xlink:href="#elektriciteitsmeter" x="21" y="25"></use>';
            
            return(mySVG);
        }

        // Zo-niet tekenen we de hele aansluiting met zekering, differentieel, of ander symbool onderaan

        let mySVG:SVGelement = new SVGelement();

        SVGSymbols.addSymbol('zekering_automatisch');
        SVGSymbols.addSymbol('zekering_empty');
        SVGSymbols.addSymbol('arrow');
        SVGSymbols.addSymbol('zekering_smelt');
        SVGSymbols.addSymbol('elekriciteitsmeter');

        // Tekst voor aantal polen en amperage

        let aantalpolenstr = '';
        if (this.props.aantal_polen !== '') aantalpolenstr = `${htmlspecialchars(this.props.aantal_polen)}P`;

        let amperagestr = '';
        if (trimString(this.props.amperage) !== '') amperagestr = `${htmlspecialchars(this.props.amperage)}A`;

        let aantalpolenamperagestr = '';
        if (aantalpolenstr !== '' && amperagestr !== '') {
            aantalpolenamperagestr = `${aantalpolenstr} - ${amperagestr}`;
        } else if (aantalpolenstr !== '') {
            aantalpolenamperagestr = aantalpolenstr;
        } else if (amperagestr !== '') {
            aantalpolenamperagestr = amperagestr;
        }

        // Indien er een kabeltype vóór de teller is schuiven we alles op
        let extrashift = 0;
        if (this.props.type_kabel_voor_teller != "") extrashift += 50;

        // get image of the entire stack, make sure it is shifted to the right sufficiently so-that the counter can be added below
        mySVG = this.sourcelist.toSVG(this.id, "vertical", 150 + extrashift); //shift 150 to the right

        // Lijntje met hoogte 20 plaatsen net boven differentieel of automaat
        mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup+20) + '" stroke="black" />';
        mySVG.yup += 20;

        // Zekering, differentieel, of ander symbool onderaan plaatsen

        let numlines = 1;   // Hier houden we het aantal lijnen tekst bij 

        switch (this.props.bescherming) {

            case "automatisch":

                numlines = (trimString(aantalpolenamperagestr) !== '' ? 1 : 0); // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                           +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  aantalpolenamperagestr + "</text>";

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

                // Code als differentieel selectief is
                if (this.props.differentieel_is_selectief) {
                    mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup+30) + '" stroke="black" />'
                               +  '<rect x="' + (mySVG.xleft+7) + '" y="' + (mySVG.yup) + '" width="16" height="16" stroke="black" fill="white" />'
                               +  "<text x=\"" + (mySVG.xleft+19) + "\" y=\"" + (mySVG.yup+8) + "\"" + " transform=\"rotate(-90 " + (mySVG.xleft+19) + "," + (mySVG.yup+8) + ")" 
                               +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" + "S" + "</text>";
                    mySVG.yup += 23;
                }

                numlines = 1 + (trimString(aantalpolenamperagestr) !== '' ? 1 : 0); // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                // Basiscode voor het amperage en de sluitstroom       
                mySVG.data += '<use xlink:href="#zekering_automatisch" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                           +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  "\u0394" + htmlspecialchars(this.props.differentieel_delta_amperage + "mA") + "</text>"
                           +  "<text x=\"" + (mySVG.xleft+26) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+26) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  aantalpolenamperagestr + "</text>";

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

                // Code als differentieel selectief is
                if (this.props.differentieel_is_selectief) {
                    mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup+30) + '" stroke="black" />'
                               +  '<rect x="' + (mySVG.xleft+7) + '" y="' + (mySVG.yup) + '" width="16" height="16" stroke="black" fill="white" />'
                               +  "<text x=\"" + (mySVG.xleft+19) + "\" y=\"" + (mySVG.yup+8) + "\"" + " transform=\"rotate(-90 " + (mySVG.xleft+19) + "," + (mySVG.yup+8) + ")" 
                               +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" + "S" + "</text>";
                    mySVG.yup += 23;
                }

                numlines = 1 + (trimString(aantalpolenamperagestr) !== '' ? 1 : 0); // Hier houden we het aantal lijnen tekst bij
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
                           +  aantalpolenamperagestr + "</text>";

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

            case "contact":

                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                mySVG.data += '<use xlink:href="#zekering_empty" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                        +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                        +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup-10) + ")" 
                        +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                        +  aantalpolenamperagestr + "</text>";

                if (this.props.normaalGesloten) {
                    mySVG.data += `<line x1="${mySVG.xleft}" x2="${mySVG.xleft}" y1="${mySVG.yup-25.5
                    }" y2="${mySVG.yup-30}" stroke="black" />`
                               +  `<line x1="${mySVG.xleft-12}" x2="${mySVG.xleft+0.5}" y1="${mySVG.yup-25}" y2="${mySVG.yup-25}" stroke="black" />`
                }

                break;

            case "schemer":

                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                mySVG.data += '<use xlink:href="#zekering_empty" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                        +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                        +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup-10) + ")" 
                        +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                        +  aantalpolenamperagestr + "</text>"
                        +  '<use xlink:href="#arrow" x=\"' + (mySVG.xleft-18) + '" y="' + (mySVG.yup-15) + '" />'
                        +  '<use xlink:href="#arrow" x=\"' + (mySVG.xleft-18) + '" y="' + (mySVG.yup-12) + '" />';
                break;

            case "smelt":

                numlines = (trimString(aantalpolenamperagestr) !== '' ? 1 : 0); // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                mySVG.data += '<use xlink:href="#zekering_smelt" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                        +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                        +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup-10) + ")" 
                        +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                        +  aantalpolenamperagestr + "</text>";

                // Code om fase toe te voegen
                numlines = addFase.bind(this)(numlines, mySVG);

                // Genoeg plaats voorzien aan de rechterkant en eindigen
                mySVG.xright = Math.max(mySVG.xright,20+11*(numlines-1));

                break;

            case "geen":
                mySVG.yup += 0;
                break;
        }

        // Leiding helemaal links onderaan vóór de teller
        mySVG.data += '<line x1="1" ' + 'y1="' + (mySVG.yup+25) + '" x2="' + (21+extrashift)  + '" '+ 'y2="' + (mySVG.yup+25) + '" stroke="black"></line>';

        // Kabeltype en tekst links onderaan vóór de teller
        if (this.props.type_kabel_voor_teller != "") {
            mySVG.data += '<text x="55" y="' + (mySVG.yup+40) 
                       + '" style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                       + htmlspecialchars(this.props.type_kabel_voor_teller) + '</text>';
        }        

        // De teller
        mySVG.data += '<use xlink:href="#elektriciteitsmeter" x="' + (21+extrashift) + '" y="' + (mySVG.yup+25) + '"></use>';

        // Leiding rechts onderaan na de teller
        mySVG.data += '<line x1="' + (61+extrashift) + '" ' + 'y1="' + (mySVG.yup+25) + '" x2="' + (mySVG.xleft) + '" '+ 'y2="' + (mySVG.yup+25) + '" stroke="black"></line>'
        +  '<line x1="' + (mySVG.xleft) + '" y1="' + (mySVG.yup) + '" x2="' + (mySVG.xleft) + '" ' + 'y2="' + (mySVG.yup+25) + '" stroke="black"></line>';

        // Kabeltype en tekst rechts onderaan na de teller
        mySVG.data += '<text x="' + (85+extrashift) + '" y="' + (mySVG.yup+40) 
                   + '" style="text-anchor:left" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                   + htmlspecialchars(this.props.type_kabel_na_teller) + '</text>';

        // 25 extra pixels voorzien onderaan zodat de teller nooit in de tekening daaronder loopt
        mySVG.yup += 25;
        mySVG.ydown = 25;

        // Indien adres niet leeg is, plaats het onderaan
        if (!(/^\s*$/.test(this.props.adres))) { //check if adres contains only white space
            mySVG.data += '<text x="' + (41+extrashift) + '" y="' + (mySVG.yup+mySVG.ydown+10) 
                       + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' 
                       + htmlspecialchars(this.props.adres) + '</text>';
            mySVG.ydown += 15;
        }

        // Naam onderaan zetten (links-onder)
        mySVG.data += '<text x="' + (mySVG.xleft+(-6)) + '" ' + 'y="' + (mySVG.yup-10) + '" '
                + 'style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"'  + '>'
                + htmlspecialchars(this.props.naam) + '</text>';

        // rework xleft and xright to ensure the entire structure is always at the right of a potential parent kring
        mySVG.xright = mySVG.xright + mySVG.xleft - 1;
        mySVG.xleft = 1;
        
        return(mySVG);
    }

}