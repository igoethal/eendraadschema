class Verwarmingstoestel extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Verwarmingstoestel"; // This is rather a formality as we should already have this at this stage
        this.keys[3][2] = false;                // Per default geen accumulatie
        this.keys[6][2] = false;                // Per default geen ventilator
        this.keys[15][2] = "";                  // Set Adres/tekst to "" when the item is cleared
    }

    overrideKeys() {
        if (!this.keys[3][2]) this.keys[6][2] = false; //Indien geen accumulatie kan er ook geen ventilator zijn
    }

    toHTML(mode: string, Parent?: List_Item) {
        this.overrideKeys;
        let output = this.toHTMLHeader(mode, Parent);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5)
               +  ", Accumulatie: " + this.checkboxToHTML(3)
               +  (this.keys[3][2] ? ", Ventilator: " + this.checkboxToHTML(6) : "")
               +  ", Adres/tekst: " + this.stringToHTML(15,5);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();
        let outputstr:string = "";

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 69;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        switch (this.getKey("accumulatie")) {
            case false:
                mySVG.data += '<use xlink:href="#verwarmingstoestel" x="21" y="25"></use>';
                break;
            case true:
                switch (this.getKey("ventilator")) {
                    case false:
                        mySVG.data += '<use xlink:href="#verwarmingstoestel_accu" x="21" y="25"></use>';
                        break;
                    case true:
                        mySVG.data += '<use xlink:href="#verwarmingstoestel_accu_ventilator" x="21" y="25"></use>';
                        mySVG.xright = 89;
                        break;
                }
                break;
        }

        mySVG.data += this.addAddress(mySVG,55,10);
        mySVG.data += "\n";

        return(mySVG);
    }

}