class Boiler extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Boiler"; // This is rather a formality as we should already have this at this stage
        this.keys[3][2] = false;    // Per default geen accumulatie
        this.keys[15][2] = "";      // Set Adres/tekst to "" when the item is cleared
    }

    toHTML(mode: string, Parent?: List_Item) {
        let output = this.toHTMLHeader(mode, Parent);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5) + ", ";
        output += "Accumulatie: " + this.checkboxToHTML(3);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);

        return(output);
    }

    toSVG(hasChild: Boolean = false) {
        let mySVG:SVGelement = new SVGelement();
        let outputstr:string = "";

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 60;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        switch (this.getKey("accumulatie")) {
            case false:
                mySVG.data += '<use xlink:href="#boiler" x="21" y="25"></use>';
                break;
            case true:
                mySVG.data += '<use xlink:href="#boiler_accu" x="21" y="25"></use>';
                break;
          }

        mySVG.data += this.addAddress(mySVG,60,15);
        mySVG.data += "\n";

        return(mySVG);
    }

}