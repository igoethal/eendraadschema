class Ketel extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Ketel"; // This is rather a formality as we should already have this at this stage
        this.keys[4][2] = "1";     // Per default 1 ketel
        this.keys[15][2] = "";     // Set Adres/tekst to "" when the item is cleared
    }

    toHTML(mode: string, Parent?: List_Item) {
        let output = this.toHTMLHeader(mode, Parent);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", Type: " + this.selectToHTML(16,["", "Met boiler", "Met tapspiraal", "Warmtekrachtkoppeling", "Warmtewisselaar"]);
        output += ", Energiebron: " + this.selectToHTML(17,["", "Elektriciteit", "Gas (atmosferisch)", "Gas (ventilator)", "Vaste brandstof", "Vloeibare brandstof"]);
        output += ", Warmte functie: " + this.selectToHTML(18,["", "Koelend", "Verwarmend", "Verwarmend en koelend"]);
        output += ", Aantal: " + this.selectToHTML(4,["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"]);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();

        // Alles naar beneden schuiven als we het aantal laders boven het symbool willen plaatsen
        var shifty = 0;
        if (this.keys[4][2]>1) {
            shifty = 15;
            mySVG.data += '<text x="41" y="12" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.keys[4][2]) + '</text>'
        }

        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 59;
        mySVG.yup = 25 + shifty;
        mySVG.ydown = 25;

        // Leiding links
        mySVG.data += '<line x1="1" y1="' + (shifty+25) + '" x2="21" y2="' + (shifty+25) + '" stroke="black"></line>'
                   +  '<use xlink:href="#verbruiker" x="21" y="' + (shifty+25) + '"></use>';


        // Type ketel
        switch (this.keys[16][2]) {
            case "Met tapspiraal":
                mySVG.data += '<line x1="21" y1="' + (shifty+15) + '" x2="61" y2="' + (shifty+7) + '" stroke="black" />'
                           +  '<line x1="21" y1="' + (shifty+15) + '" x2="61" y2="' + (shifty+23) + '" stroke="black" />';
                break;
            case "Met boiler":
                mySVG.data += '<rect x="31" y="' + (shifty+10) + '" width="20" height="10" stroke="black" fill="white" />';
                break;
            case "Warmtewisselaar":
                mySVG.data += '<line x1="26" y1="' + (shifty+0) + '" x2="26" y2="' + (shifty+5) + '" stroke="black" />'
                           +  '<line x1="56" y1="' + (shifty+0) + '" x2="56" y2="' + (shifty+5) + '" stroke="black" />'
                           +  '<line x1="26" y1="' + (shifty+5) + '" x2="33.5" y2="' + (shifty+23) + '" stroke="black" />'
                           +  '<line x1="56" y1="' + (shifty+5) + '" x2="48.5" y2="' + (shifty+23) + '" stroke="black" />'
                           +  '<line x1="33.5" y1="' + (shifty+23) + '" x2="41" y2="' + (shifty+14) + '" stroke="black" />'
                           +  '<line x1="48.5" y1="' + (shifty+23) + '" x2="41" y2="' + (shifty+14) + '" stroke="black" />';
                break;
            case "Warmtekrachtkoppeling":
                mySVG.data += '<circle cx="41" cy="' + (shifty+16) + '" r="7" style="stroke:black;fill:none" />'
                           + '<text x="41" y="' + (shifty+17) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">G</text>';
                break;
          }

        // Waar gaan we de andere symbolen plaatsen, indien slechts 1, midden onderaan, zoniet links en rechts
        var shift_symbol_energiebron = 41;
        var shift_symbol_warmtefunctie = 41;
        if ((this.keys[17][2] != "") && (this.keys[18][2] != "")) {
            var shift_symbol_energiebron = 31;
            var shift_symbol_warmtefunctie = 51;
        }

        // Plaats de symbolen onderaan
        switch (this.keys[17][2]) {
            case "Gas (ventilator)": mySVG.data += '<use xlink:href="#gas_ventilator" x="' + (shift_symbol_energiebron) + '" y="' + (shifty+35) + '"/>'; break;
            case "Gas (atmosferisch)": mySVG.data += '<use xlink:href="#gas_atmosferisch" x="' + (shift_symbol_energiebron) + '" y="' + (shifty+35) + '"/>'; break;
            case "Elektriciteit": mySVG.data += '<use xlink:href="#bliksem" x="' + (shift_symbol_energiebron) + '" y="' + (shifty+35) + '"/>'; break;
            case "Vaste brandstof": mySVG.data += '<rect x="' + (shift_symbol_energiebron-6) + '" y="' + (shifty+29) + '" width="12" height="12" style="stroke:black;fill:black" />'; break;
            case "Vloeibare brandstof": mySVG.data += '<circle cx="' + (shift_symbol_energiebron) + '" cy="' + (shifty+35) + '" r="6" style="stroke:black;fill:black" />'; break;
        }

        switch (this.keys[18][2]) {
            case "Verwarmend": mySVG.data += '<text x="' + (shift_symbol_warmtefunctie-1) + '" y="' + (shifty+36) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">+</text>'; break;
            case "Koelend": mySVG.data += '<text x="' + (shift_symbol_warmtefunctie-1) + '" y="' + (shifty+36) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">-</text>'; break;
            case "Verwarmend en koelend": mySVG.data += '<text x="' + (shift_symbol_warmtefunctie-1) + '" y="' + (shifty+36) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">+/-</text>'; break;
        }
       
        // Adres helemaal onderaan plaatsen
        mySVG.data += this.addAddress(mySVG,60 + shifty,15);
        mySVG.data += "\n";

        return(mySVG);
    }

}