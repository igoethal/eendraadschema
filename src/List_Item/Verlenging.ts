class Verlenging extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2]  = "Verlenging"; // This is rather a formality as we should already have this at this stage
        this.keys[22][2] = "40";         // This is rather a formality as we should already have this at this stage
    }

    toHTML(mode: string, Parent?: List_Item) {
        let output = this.toHTMLHeader(mode, Parent);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5)
               +  ", Breedte: " + this.stringToHTML(22,3);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();
        let outputstr:string = "";

        var width;
        if (isNaN(Number(this.keys[22][2]))) {
            width = 40;
        } else {
            if (Number(this.keys[22][2] == "")) {
            width = 40;
            } else {
            width = Math.max(Number(this.keys[22][2])*1,0);
            }
        }

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = width-1;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data += '<line x1="1" y1="25" x2="' + (width+1) + '" y2="25" stroke="black" />';
        
        mySVG.data += this.addAddress(mySVG,40,0,width/2-mySVG.xright/2-10,23);
        mySVG.data += "\n";

        return(mySVG);
    }

}