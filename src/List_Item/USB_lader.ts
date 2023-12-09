class USB_lader extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "USB lader"; // This is rather a formality as we should already have this at this stage
        this.keys[4][2] = "1";         // Per default 1 lader
        this.keys[15][2] = "";         // Set Adres/tekst to "" when the item is cleared
    }

    toHTML(mode: string, Parent?: List_Item) {
        let output = this.toHTMLHeader(mode, Parent);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", Aantal: " + this.selectToHTML(4,["1","2","3","4","5","6","7","8","9","10"]);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);

        return(output);
    }

    toSVG(hasChild: Boolean = false) {
        let mySVG:SVGelement = new SVGelement();
        let outputstr:string = "";

        // Alles naar beneden schuiven als we het aantal laders boven het symbool willen plaatsen
        var shifty = 0;
        if (this.keys[4][2]>1) {
            shifty = 12;
            mySVG.data += '<text x="51" y="14" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.keys[4][2]) + '</text>'
        }

        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 80;
        mySVG.yup = 25 + shifty;
        mySVG.ydown = 25;

        mySVG.data += '<line x1="1" y1="' + (shifty+25) + '" x2="21" y2="' + (shifty+25) + '" stroke="black"></line>'
                   +  '<use xlink:href="#usblader" x="21" y="' + (shifty+25) + '"></use>';
        
        mySVG.data += this.addAddress(mySVG,55 + shifty,10);
        mySVG.data += "\n";

        return(mySVG);
    }

}