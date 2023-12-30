class Zeldzame_symbolen extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { 
        super(mylist); 
        this.resetKeys();
    }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Zeldzame symbolen"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = "";                 // Set Adres/tekst to "" when the item is cleared
        this.keys[16][2] = "";                 // Per default, geen symbool
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5)
               +  ", Symbool: " + this.selectToHTML(16,["","deurslot"])
               +  ", Adres/tekst: " + this.stringToHTML(15,5);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        switch (this.keys[16][2]) {
            case "deurslot":
                mySVG.data += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
                           +  '<use xlink:href="#deurslot" x="21" y="25"></use>';
                mySVG.xright = 58;
                mySVG.data += this.addAddress(mySVG,55,10,2);
                break;
            default:
                mySVG.data += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
                mySVG.xright = -1;
                break;
          }

        return(mySVG);
    }

}