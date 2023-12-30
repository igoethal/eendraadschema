class Kring extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Kring";         // This is rather a formality as we should already have this at this stage
        this.keys[4][2] = "2";             // Per default 2-polige automaat
        this.keys[7][2] = "automatisch";   // Per default automatische zekering
        this.keys[8][2] = "20";            // Per deault 20 Ampère
        this.keys[9][2] = "XVB Cca 3G2,5"; // Default type kabel
        this.keys[11][2] = "300";          // Differentieel per default 300 mA
        this.keys[15][2] = "";             // Tekst naast de kabel
        this.keys[16][2] = "N/A";          // Per default, locatie kabel niet geweten
        this.keys[17][2] = "";             // Type differentieel, Type differentieelautomaat, of Curve automaat per default niet gegeven
        this.keys[18][2] = "";             // Curve differentieelautomaat per default niet gegeven
        this.keys[19][2] = false;          // Per default kabel niet in buis
        this.keys[20][2] = false;          // Per default niet selectief
        this.keys[22][2] = "";             // Kortsluitvermogen per default niet gegeven

        //Bepalen of er per default een kabel aanwezig is en of we zekeringen plaatsen
        let parent = this.getParent();
        if (parent == null) {
            this.keys[12][2] = true; // Kabel aanwezig
            this.keys[10][2] = "";   // We geven de kring geen naam als er geen parent is
        } else switch (parent.keys[0][2]) { // Selecteren op basis van parent
            case "Bord":
                this.keys[7][2] = "automatisch"; // Wel een zekering na bord
                this.keys[10][2] = "---";        // We zetten iets als default dat gebruikers niet vergeten een naam aan de kring te geven na een bord
                this.keys[12][2] = true;         // wel een kabel na bord
                break;
            case "Splitsing":
                this.keys[7][2] = "geen"; // geen zekering per default na splitsing
                this.keys[10][2] = "";    // We geven de kring geen naam
                this.keys[12][2] = false; // geen kabel per default na splitsing
                break;
            case "Kring":
                this.keys[9][2] = "";    // We geven geen kabeltype op
                this.keys[10][2] = "";   // We geven de kring geen naam
                this.keys[12][2] = true;  // wel een kabel na domotica
                break;    
            case "Domotica":
                this.keys[7][2] = "geen"; // geen zekering per default na domotica
                this.keys[10][2] = "";    // We geven de kring geen naam
                this.keys[12][2] = true;  // wel een kabel na domotica
                break;
            default:
                this.keys[7][2] = "automatisch"; // wel een zekering na bord
                this.keys[10][2] = "";           // We geven de kring geen naam
                this.keys[12][2] = true;         // wel een kabel na bord
                break;
        }
    }

    allowedChilds() : Array<string> { // returns an array with the type-names of allowed childs
        return ["", "Aansluiting", "Bord", "Domotica", "Domotica gestuurde verbruiker", "Kring", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
    }

    getMaxNumChilds(): number {
        return 256;
    }

    overrideKeys() {
        if ( ( (this.keys[4][2] as number) < 1 ) || ( (this.keys[4][2] as number) > 4 ) ) this.keys[4][2] = "2"; //Test dat aantal polen bestaat
        if (this.keys[16][2] == "Luchtleiding") this.keys[19][2] = false; //Indien luchtleiding nooit een buis tekenen
    }

    toHTML(mode: string) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Naam: " + this.stringToHTML(10,5) + "<br>"
               +  "Zekering: " + this.selectToHTML(7,["automatisch","differentieel","differentieelautomaat","smelt","geen","---","schakelaar","relais","schemer","overspanningsbeveiliging"]);


        // Aantal polen en Ampérage

        if ( (this.keys[7][2] != "geen") && (this.keys[7][2] != "relais") ) output += this.selectToHTML(4,["2","3","4","-","1"]) + this.stringToHTML(8,2) + "A";

        // Specifieke input voor differentielen en automaten

        switch (this.keys[7][2]) {

            case "differentieel":
                output += ", \u0394 " + this.stringToHTML(11,3) + "mA"
                       +  ", Type:" + this.selectToHTML(17,["","A","B"])
                       +  ", Kortsluitvermogen: " + this.stringToHTML(22,3) + "kA"
                       +  ", Selectief: " + this.checkboxToHTML(20);
                break;

            case "automatisch":
                output += ", Curve:" + this.selectToHTML(17,["","B","C","D"])
                       +  ", Kortsluitvermogen: " + this.stringToHTML(22,3) + "kA";               
                break;

            case "differentieelautomaat":
                output += ", \u0394 " + this.stringToHTML(11,3) + "mA"
                       +  ", Curve:" + this.selectToHTML(18,["","B","C","D"])
                       +  ", Type:" + this.selectToHTML(17,["","A","B"])
                       +  ", Kortsluitvermogen: " + this.stringToHTML(22,3) + "kA"
                       +  ", Selectief: " + this.checkboxToHTML(20);
                break;

        }

        // Eigenschappen van de kabel

        output += ", Kabel: " + this.checkboxToHTML(12);
        if (this.keys[12][2]) { // Kabel aanwezig
            output += ", Type: " + this.stringToHTML(9,10)
                   +  ", Plaatsing: " + this.selectToHTML(16,["N/A","Ondergronds","Luchtleiding","In wand","Op wand"]);
            if (this.keys[16][2] != "Luchtleiding") output += ", In buis: " + this.checkboxToHTML(19)
        }
        
        output += ", Tekst: " + this.stringToHTML(15,10);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();

        // Bepalen of we de hele kring naar rechts moeten opschuiven om rekening te houden met symbooltjes qua kabel-locatie

        let cable_location_available: number = 0;
        if ( this.keys[12][2] /* kabel aanwezig */ && (this.keys[19][2] /* kabel in buis */ || contains(["Ondergronds","In wand","Op wand"],this.keys[16][2]) ) ) {
            cable_location_available = 1;
        }

        // Alle verbruikers van de kring tekenen

        mySVG = this.sourcelist.toSVG(this.id,"vertical",35 + 20*cable_location_available);

        // Kabel tekenen

        if (this.keys[12][2]) { // Kabel aanwezig

            // Kabel tekenen en naam van de kabel ernaast zetten
            mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup+100) + '" stroke="black" />'
                       +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup+80) + "\""
                       +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup+80) + ")" 
                       +  "\" style=\"text-anchor:start\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                       +  htmlspecialchars(this.keys[9][2]) + "</text>";

            // Luchtleiding tekenen indien van toepassing
            if (this.keys[16][2] == "Luchtleiding") mySVG.data += '<circle cx="' + (mySVG.xleft)  + '" cy="' + (mySVG.yup+20)   +'" r="4" style="stroke:black;fill:none" />';

            // Symbolen naast de kabel zetten
            if (cable_location_available) {

                if ( (this.keys[19][2]) && (this.keys[16][2] != "Luchtleiding") ) // Rondje voor "in buis" tekenen
                    mySVG.data += '<circle cx="' + (mySVG.xleft-10) + '" cy="' + (mySVG.yup+40) +'" r="4" style="stroke:black;fill:none" />';

                switch (this.keys[16][2]) {

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

        if (this.keys[20][2]) { //Differentieel is selectief
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

        switch (this.keys[7][2]) {

            case "automatisch":

                numlines = 1; // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                // Basiscode voor het amperage        
                mySVG.data += '<use xlink:href="#zekering_automatisch" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                           +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>";

                // Code om de curve toe te voegen
                if ( (this.keys[17][2]=='B') || (this.keys[17][2]=='C') || (this.keys[17][2]=='D') ) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                               +  " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                               +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                               +  htmlspecialchars("Curve " + this.keys[17][2]) + "</text>";
                }

                // Code om kortsluitvermogen toe te voegen
                if ( (this.keys[22][2]!='') ) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                               +  " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                               +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                               +  htmlspecialchars("" + this.keys[22][2]) + "kA</text>";
                }

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
                           +  "\u0394" + htmlspecialchars(this.keys[11][2] + "mA") + "</text>"
                           +  "<text x=\"" + (mySVG.xleft+26) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+26) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>";

                // Code om het type toe te voegen
                if ( (this.keys[17][2]=='A') || (this.keys[17][2]=='B') ) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                               + " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                               + "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                               + htmlspecialchars("Type " + this.keys[17][2]) + "</text>";

                }

                // Code om kortsluitvermogen toe te voegen
                if ( (this.keys[22][2]!='') ) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                               +  " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                               +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                               +  htmlspecialchars("" + this.keys[22][2]) + "kA</text>";
                }

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
                           +  "\u0394" + htmlspecialchars(this.keys[11][2] + "mA") + "</text>"
                           +  "<text x=\"" + (mySVG.xleft+26) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+26) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>";

                // Code om de curve toe te voegen
                if ( (this.keys[18][2]=='B') || (this.keys[18][2]=='C') || (this.keys[18][2]=='D') ) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                               +  " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                               +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                               +  htmlspecialchars("Curve " + this.keys[18][2]) + "</text>";
                }

                // Code om het type toe te voegen
                if ( (this.keys[17][2]=='A') || (this.keys[17][2]=='B') ) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                               +  " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                               +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                               +  htmlspecialchars("Type " + this.keys[17][2]) + "</text>";
                }

                // Code om kortsluitvermogen toe te voegen
                if ( (this.keys[22][2]!='') ) {
                    ++numlines;
                    mySVG.data += "<text x=\"" + (mySVG.xleft+15+11*(numlines-1)) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                               +  " transform=\"rotate(-90 " + (mySVG.xleft+15+11*(numlines-1)) + "," + (mySVG.yup-10) + ")" 
                               +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                               +  htmlspecialchars("" + this.keys[22][2]) + "kA</text>";
                }

                // genoeg plaats voorzien aan de rechterkant en eindigen
                mySVG.xright = Math.max(mySVG.xright,20+11*(numlines-1));
                break;

            case "schakelaar":

                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                mySVG.data += '<use xlink:href="#zekering_empty" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                           +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>";
                break;

            case "overspanningsbeveiliging":

                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                mySVG.data += '<use xlink:href="#overspanningsbeveiliging_inline" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                           +  "<text x=\"" + (mySVG.xleft+20) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+20) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>";

                nameshift = -11; //
                break;

            case "schemer":

                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                mySVG.data += '<use xlink:href="#zekering_empty" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                           +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  htmlspecialchars(this.keys[4][2] + "P - " + this.keys[8][2] + "A") + "</text>"
                           +  '<use xlink:href="#arrow" x=\"' + (mySVG.xleft-18) + '" y="' + (mySVG.yup-15) + '" />'
                           +  '<use xlink:href="#arrow" x=\"' + (mySVG.xleft-18) + '" y="' + (mySVG.yup-12) + '" />';
                break;

            case "relais":

                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                mySVG.data += '<use xlink:href="#relais_kring" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />';
            
                nameshift = -11;
                break;

            case "smelt":

                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                mySVG.data += '<use xlink:href="#zekering_smelt" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                           +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                           +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup-10) + ")" 
                           +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                           +  htmlspecialchars(this.keys[4][2] + "P - " +  this.keys[8][2] + "A") + "</text>";
                break;

            case "geen":

                mySVG.yup += 0;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering
                break;
        }

        // Tekst naast de kring
        let tekstlocatie = mySVG.yup - 40;                 //Standaard staat tekst boven de zekering
        if (this.keys[7][2] == "geen") tekstlocatie += 25; //Als er geen zekering is kan tekst naar beneden
        mySVG.data += '<text x="' + (mySVG.xleft-6-20*cable_location_available) + '" ' + 'y="' + (tekstlocatie) + '" '
                   +  'transform="rotate(-90 ' + (mySVG.xleft-6-20*cable_location_available) + ',' + (tekstlocatie) + ')" '
                   + 'style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"' + '>'
                   + htmlspecialchars(this.keys[15][2]) + '</text>';

        // Naam onderaan zetten (links-onder)
        mySVG.data += '<text x="' + (mySVG.xleft+nameshift) + '" ' + 'y="' + (mySVG.yup+3) + '" '
                   +  'style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"' + '>'
                   + htmlspecialchars(this.keys[10][2]) + '</text>';


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