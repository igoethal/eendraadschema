class Domotica_gestuurde_verbruiker extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Domotica gestuurde verbruiker"; // This is rather a formality as we should already have this at this stage
        this.keys[5][2] = "drukknop";
        this.keys[15][2] = "";
        this.keys[19][2] = true;
        this.keys[20][2] = true;
        this.keys[21][2] = true;
        this.keys[25][2] = false;
        this.keys[26][2] = false;
    }

    allowedChilds() : Array<string> { // returns an array with the type-names of allowed childs
        return ["", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
    }

    getMaxNumChilds(): number {
        return 1;
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5)
               +  ", Draadloos: " + this.checkboxToHTML(19)
               +  ", Lokale Drukknop: " + this.checkboxToHTML(20)
               +  ", Geprogrammeerd: " + this.checkboxToHTML(21)
               +  ", Detectie: " + this.checkboxToHTML(25)
               +  ", Externe sturing: " + this.checkboxToHTML(26);    

        if (this.keys[26][2]) output += ", Externe sturing: " + this.selectToHTML(5,["drukknop","schakelaar"]);

        output += ", Adres/tekst: " + this.stringToHTML(15,5); 

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();

        // Eerst de tekening van de aangestuurde verbruiker maken

        let childcounter = 0; // Variabele voor het aantal kinderen, op dit moment ondersteunt de tool slechts 1 kind
                              // Kind 1 is het element dat effectief gestuurd wordt.                

        for (let i = 0; i<this.sourcelist.length; i++) {
            if ( this.isActief() && (this.sourcelist.data[i].parent == this.id ) ) {
                childcounter++; // We hebben een kind gevonden
                switch (childcounter) {
                    case 1: // Het Kind is het eerste element, i.e. de aangestuurde verbruiker. We tekenen dit kind.
                        mySVG = this.sourcelist.toSVG(this.sourcelist.data[i].id,"horizontal",35,true);
                        break;      
                }
            }
        }

        // We maken het aangestuurde element altijd minstens 50 x 56 pixels groot

        if (mySVG.yup + mySVG.ydown < 50) { mySVG.yup = 25; mySVG.ydown = 25; }
        if (mySVG.xleft + mySVG.xright < 56) { mySVG.xleft = 1; mySVG.xright = 55; }

        // We plaatsen het aangestuurde element in een kader

        mySVG.data = '<svg x="' + (21+5) + '" y="25">' + mySVG.data + '</svg>';

        mySVG.data +=   '<rect x="' + (21) + '" y="' + (5) +
                        '" width="' + (mySVG.xleft + mySVG.xright+12) +
                        '" height="' + (mySVG.yup + mySVG.ydown + 20) + '" stroke="black" fill="none" />';

        mySVG.data +=   '<line x1="' + (21) + '" x2="' + (21 + mySVG.xleft + mySVG.xright+12) + '" y1="' + (25) + '" y2="' + (25) + '" stroke="black" />';                              
        
        mySVG.xright += (21 + 12); //We shifted the element by 21 and then added a margin of 5 left and 7 right
        mySVG.yup += 25; 
        mySVG.ydown += 5; 

        // We plaatsen de leiding links

        mySVG.data +=   '<line x1="'+ mySVG.xleft + '" x2="' + (mySVG.xleft+20) +
                        '" y1="' + (mySVG.yup) + '" y2="' + (mySVG.yup) + '" stroke="black" />';

        // We plaatsen de symbolen bovenaan

        if (this.keys[19][2]) mySVG.data += '<use xlink:href="#draadloos_klein" x="22" y="15"></use>';
        if (this.keys[20][2]) mySVG.data += '<use xlink:href="#drukknop_klein" x="38" y="15"></use>';
        if (this.keys[21][2]) mySVG.data += '<use xlink:href="#tijdschakelaar_klein" x="54" y="15"></use>';
        if (this.keys[25][2]) mySVG.data += '<use xlink:href="#detectie_klein" x="70" y="15"></use>';

        if (this.keys[26][2]) {
            switch(this.keys[5][2]) {
                case "schakelaar":
                    mySVG.data = '<svg x="' + (0) + '" y="20">' + mySVG.data + '</svg>'
                               + '<use xlink:href="#schakelaar_klein" x="78" y="18"></use>'
                               + '<line x1="78" y1="21" x2="78" y2="25" stroke="black" />';
                    mySVG.yup += 20;
                    break; 
                default:  
                    mySVG.data = '<svg x="' + (0) + '" y="20">' + mySVG.data + '</svg>'
                               + '<use xlink:href="#drukknop_klein" x="70" y="14"></use>'
                               + '<line x1="78" y1="21" x2="78" y2="25" stroke="black" />';
                    mySVG.yup += 20;
            }
        }

        //Place text below if there is any

        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
            mySVG.data += '<text x="' + ((mySVG.xright-20)/2 + 21 + 0) + '" y="' + (mySVG.ydown + mySVG.yup + 10) 
                       +  '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' 
                       + htmlspecialchars(this.keys[15][2]) + '</text>';
                       
            mySVG.ydown += 15;
        }  


        return(mySVG);
    }

}