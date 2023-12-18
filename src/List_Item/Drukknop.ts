class Drukknop extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Drukknop";    // This is rather a formality as we should already have this at this stage
        this.keys[4][2] = "1";           // Per default 1 armatuur
        this.keys[13][2] = "1";          // Per default 1 knop per armatuur
        this.keys[15][2] = "";           // Set Adres/tekst to "" when the item is cleared
        this.keys[16][2] = "standaard";  // Per default een standaard drukknop
        this.keys[19][2] = false;        // Per default niet afgeschermd
        this.keys[20][2] = false;        // Per default niet halfwaterdicht
        this.keys[21][2] = false;        // Per default geen verklikkerslampje
    }

    toHTML(mode: string, Parent?: List_Item) {
        let output = this.toHTMLHeader(mode, Parent);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5)
               +  ", Type: " + this.selectToHTML(16,["standaard","dimmer","rolluik"])
               +  ", Verklikkerlampje: " + this.checkboxToHTML(21)
               +  ", Halfwaterdicht: " + this.checkboxToHTML(20)
               +  ", Afgeschermd: " + this.checkboxToHTML(19)
               +  ", Aantal armaturen: " + this.selectToHTML(4,["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"])
               +  ", Aantal knoppen per armatuur: " + this.selectToHTML(13,["1","2","3","4","5","6","7","8"])
               +  ", Adres/tekst: " + this.stringToHTML(15,5);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();
        
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 43; 
        mySVG.yup = 25;
        mySVG.ydown = 25;

        var aantal_knoppen:number = this.keys[4][2];
        
        // Teken lijn links
        mySVG.data += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
                   +  '<use xlink:href="#drukknop" x="21" y="25"></use>';

        // Teken verklikkerlampje indien van toepassing
        if (this.keys[21][2]) { 
            mySVG.data += '<line x1="28" y1="20" x2="38" y2="30" stroke="black"></line>'  // midden 33, 25, lengte 7
                       +  '<line x1="28" y1="30" x2="38" y2="20" stroke="black"></line>';
        }

        // Teken afgeschermd indien van toepassing
        if (this.keys[19][2]) {
            mySVG.data += '<line x1="26" y1="10" x2="40" y2="10" stroke="black"></line>'  // midden 33, 25 lengte 7
                       +  '<line x1="26" y1="10" x2="26" y2="15" stroke="black"></line>'
                       +  '<line x1="40" y1="10" x2="40" y2="15" stroke="black"></line>'
                       +  '<line x1="22" y1="15" x2="26" y2="15" stroke="black"></line>'
                       +  '<line x1="40" y1="15" x2="44" y2="15" stroke="black"></line>';
        }

        // Plaats tekst voor "h" en/of aantal armaturen onderaan
        var printstr:string = "";
        if (this.keys[20][2]) printstr += 'h';
        if (aantal_knoppen > 1) {
          if (printstr != '') { printstr += ', ' }
          printstr += 'x' + aantal_knoppen;
        }
        if (printstr != '') mySVG.data += '<text x="33" y="49" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(printstr) + '</text>';

        // Plaats tekst voor aantal knoppen
        if (this.keys[13][2] > 1) {
            mySVG.data += '<text x="44" y="13" style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(this.keys[13][2]) + '</text>'
                       +  '<line x1="39" y1="19" x2="44" y2="14" stroke="black" />';
        }

        // Plaats extra tekens voor rolluik of dimmer
        switch (this.keys[16][2]) {
            case "dimmer":
                mySVG.data += '<polygon points="18,20 18,13 28,20" fill="black" stroke="black" />';
                break;
            case "rolluik":
                mySVG.data += '<polygon points="18,12 22,12 20,9" fill="black" stroke="black" />'
                           +  '<polygon points="18,15 22,15 20,18" fill="black" stroke="black" />';
                break;
            default:
        }

        // Plaats adres helemaal onderaan
        if (printstr != '') {
            mySVG.data += this.addAddress(mySVG,65,20);
        } else {
            mySVG.data += this.addAddress(mySVG,49,5);
        }

        return(mySVG);
    }

}