class Aansluiting extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Aansluiting";   // This is rather a formality as we should already have this at this stage
        this.keys[4][2] = "2";             // Per default 2-polig
        this.keys[7][2] = "differentieel"; // Per default een differentieel
        this.keys[8][2] = "40";            // Per default 40A
        this.keys[9][2] = "2x16";          // Default kabeltype voor een aansluiting
        this.keys[11][2] = "300";          // Differentieel per default 300 mA
        this.keys[15][2] = "";             // Per default geen adres/tekst
        this.keys[17][2] = "";             // Per default geen type voor een aansluiting
        this.keys[18][2] = "";             // Curve differentieelautomaat per default niet gegeven
        this.keys[20][2] = false;          // Per default niet selectief
        this.keys[22][2] = "";             // Per default geen kortsluitvermogen voor een aansluiting
        this.keys[23][2] = "";             // Per default geen naam
        this.keys[24][2] = "";             // Per default geen kabeltype vóór de aansluiting
    }

    overrideKeys() {
        if ( ( (this.keys[4][2] as number) < 1 ) || ( (this.keys[4][2] as number) > 4 ) ) this.keys[4][2] = "2"; //Test dat aantal polen bestaat
    }

    toHTML(mode: string, Parent?: List_Item) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode, Parent);

        output += "&nbsp;Naam: " + this.stringToHTML(23,5) + "<br>";

        if (this.getParent() != null) output += "Nr: " + this.stringToHTML(10,5) + ", ";
        
        output += "Zekering: " + this.selectToHTML(7,["automatisch","differentieel","differentieelautomaat","smelt","geen","---","schakelaar","schemer"]) 
                               + this.selectToHTML(4,["2","3","4"]) 
                               + this.stringToHTML(8,2) + "A";

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

        output += ", Kabeltype na teller: " + this.stringToHTML(9,10)
               +  ", Kabeltype v&oacute;&oacute;r teller: " + this.stringToHTML(24,10)
               +  ", Adres/tekst: " + this.stringToHTML(15,5);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();

        // Indien er een kabeltype vóór de teller is schuiven we alles op
        let extrashift = 0;
        if (this.keys[24][2] != "") extrashift += 50;

        // get image of the entire stack, make sure it is shifted to the right sufficiently so-that the counter can be added below
        mySVG = this.sourcelist.toSVG(this.id, "vertical", 150 + extrashift); //shift 150 to the right

        // Lijntje met hoogte 20 plaatsen net boven differentieel of automaat
        mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup+20) + '" stroke="black" />';
        mySVG.yup += 20;

        // Zekering, differentieel, of ander symbool onderaan plaatsen

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

                // Code als differentieel selectief is
                if (this.keys[20][2]) {
                    mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup+30) + '" stroke="black" />'
                               +  '<rect x="' + (mySVG.xleft+7) + '" y="' + (mySVG.yup) + '" width="16" height="16" stroke="black" fill="white" />'
                               +  "<text x=\"" + (mySVG.xleft+19) + "\" y=\"" + (mySVG.yup+8) + "\"" + " transform=\"rotate(-90 " + (mySVG.xleft+19) + "," + (mySVG.yup+8) + ")" 
                               +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" + "S" + "</text>";
                    mySVG.yup += 23;
                }

                numlines = 2; // Hier houden we het aantal lijnen tekst bij
                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                // Basiscode voor het amperage en de sluitstroom       
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

                // Code als differentieel selectief is
                if (this.keys[20][2]) {
                    mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + mySVG.yup + '" y2="' + (mySVG.yup+30) + '" stroke="black" />'
                               +  '<rect x="' + (mySVG.xleft+7) + '" y="' + (mySVG.yup) + '" width="16" height="16" stroke="black" fill="white" />'
                               +  "<text x=\"" + (mySVG.xleft+19) + "\" y=\"" + (mySVG.yup+8) + "\"" + " transform=\"rotate(-90 " + (mySVG.xleft+19) + "," + (mySVG.yup+8) + ")" 
                               +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" + "S" + "</text>";
                    mySVG.yup += 23;
                }

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

            case "smelt":

                mySVG.yup += 30;  // Hoeveel ruimte moeten we onderaan voorzien voor de zekering

                mySVG.data += '<use xlink:href="#zekering_smelt" x=\"' + mySVG.xleft + '" y="' + mySVG.yup + '" />'
                        +  "<text x=\"" + (mySVG.xleft+15) + "\" y=\"" + (mySVG.yup-10) + "\"" 
                        +  " transform=\"rotate(-90 " + (mySVG.xleft+15) + "," + (mySVG.yup-10) + ")" 
                        +  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" 
                        +  htmlspecialchars(this.keys[4][2] + "P - " +  this.keys[8][2] + "A") + "</text>";
                break;

            case "geen":
                mySVG.yup += 0;
                break;
        }

        // Leiding helemaal links onderaan vóór de teller
        mySVG.data += '<line x1="1" ' + 'y1="' + (mySVG.yup+25) + '" x2="' + (21+extrashift)  + '" '+ 'y2="' + (mySVG.yup+25) + '" stroke="black"></line>';

        // Kabeltype en tekst links onderaan vóór de teller
        if (this.keys[24][2] != "") {
            mySVG.data += '<text x="55" y="' + (mySVG.yup+40) 
                       + '" style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                       + htmlspecialchars(this.keys[24][2]) + '</text>';
        }        

        // De teller
        mySVG.data += '<use xlink:href="#elektriciteitsmeter" x="' + (21+extrashift) + '" y="' + (mySVG.yup+25) + '"></use>';

        // Leiding rechts onderaan na de teller
        mySVG.data += '<line x1="' + (61+extrashift) + '" ' + 'y1="' + (mySVG.yup+25) + '" x2="' + (mySVG.xleft) + '" '+ 'y2="' + (mySVG.yup+25) + '" stroke="black"></line>'
        +  '<line x1="' + (mySVG.xleft) + '" y1="' + (mySVG.yup) + '" x2="' + (mySVG.xleft) + '" ' + 'y2="' + (mySVG.yup+25) + '" stroke="black"></line>';

        // Kabeltype en tekst rechts onderaan na de teller
        mySVG.data += '<text x="' + (85+extrashift) + '" y="' + (mySVG.yup+40) 
                   + '" style="text-anchor:left" font-family="Arial, Helvetica, sans-serif" font-size="10">' 
                   + htmlspecialchars(this.keys[9][2]) + '</text>';

        // 25 extra pixels voorzien onderaan zodat de teller nooit in de tekening daaronder loopt
        mySVG.yup += 25;
        mySVG.ydown = 25;

        // Indien adres niet leeg is, plaats het onderaan
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
            mySVG.data += '<text x="' + (41+extrashift) + '" y="' + (mySVG.yup+mySVG.ydown+10) 
                       + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' 
                       + htmlspecialchars(this.keys[15][2]) + '</text>';
            mySVG.ydown += 15;
        }

        // Naam onderaan zetten (links-onder)
        mySVG.data += '<text x="' + (mySVG.xleft+(-6)) + '" ' + 'y="' + (mySVG.yup-10) + '" '
                + 'style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"'  + '>'
                + htmlspecialchars(this.keys[23][2]) + '</text>';

        // rework xleft and xright to ensure the entire structure is always at the right of a potential parent kring
        mySVG.xright = mySVG.xright + mySVG.xleft - 1;
        mySVG.xleft = 1;
        
        return(mySVG);
    }

}