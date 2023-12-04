class Bel extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        //Whipe most keys; note how we don't reset keys[10][2] as usually we don't want the number to change
        for (let i = 1; i < 10; i++) this.keys[i][2] = "";
        for (let i = 11; i < this.keys.length; i++) this.keys[i][2] = "";

        this.keys[0][2] = "Bel"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = "";           // Set Adres/tekst to "" when the item is cleared
    }

    toHTML(mode: string, Parent?: List_Item) {
        let output = this.toHTMLHeader(mode, Parent);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);

        return(output);
    }

    toSVG(hasChild: Boolean = false) {
        let mySVG:SVGelement = new SVGelement();
        let outputstr:string = "";

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 40;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>'
                   + '<use xlink:href="#bel" x="21" y="25"></use>';
        
        mySVG.data += this.addAddress(mySVG,58,14);
        mySVG.data += "\n";

        return(mySVG);
    }

}