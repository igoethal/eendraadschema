class Zonnepaneel extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Zonnepaneel"; // This is rather a formality as we should already have this at this stage
        this.keys[4][2] = "1";     // Per default 1 zonnepaneel
        this.keys[15][2] = "";     // Set Adres/tekst to "" when the item is cleared
    }

    toHTML(mode: string, Parent?: List_Item) {
        let output = this.toHTMLHeader(mode, Parent);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5) + ", "
               +  " Aantal: " + this.selectToHTML(4,["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20",
                                                     "21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40"])
               +  ", Adres/tekst: " + this.stringToHTML(15,5);

        return(output);
    }

    toSVG(hasChild: Boolean = false) {
        let mySVG:SVGelement = new SVGelement();

        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 69;
        mySVG.yup = 35;
        mySVG.ydown = 25;

        mySVG.data += '<line x1="1" y1="35" x2="21" y2="35" stroke="black"></line>'
                   +  '<use xlink:href="#zonnepaneel" x="21" y="35"></use>'
                   +  '<text x="45" y="9" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(this.keys[4][2]) + 'x</text>';
            
        // Adres helemaal onderaan plaatsen
        mySVG.data += this.addAddress(mySVG,70,15);
        mySVG.data += "\n";

        return(mySVG);
    }

}0