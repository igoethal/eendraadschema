class Transformator extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { 
        super(mylist); 
        this.resetKeys();
    }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Transformator"; // This is rather a formality as we should already have this at this stage
        this.keys[14][2] = "230V/24V";     // Per default 24V
        this.keys[15][2] = "";             // Set Adres/tekst to "" when the item is cleared
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5)
               +  ", Voltage: " + this.stringToHTML(14,8)
               + ", Adres/tekst: " + this.stringToHTML(15,5);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 47;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
                   + '<use xlink:href="#transformator" x="21" y="25"></use>'
                   + '<text x="35" y="44" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                      htmlspecialchars(this.keys[14][2]) + "</text>";
        
        mySVG.data += this.addAddress(mySVG,58,15);
        mySVG.data += "\n";

        return(mySVG);
    }

}