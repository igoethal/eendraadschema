class Vrije_ruimte extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Vrije ruimte"; // This is rather a formality as we should already have this at this stage
        this.keys[22][2] = 25;            // Default breedte van de vrije ruimte
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Breedte: " + this.stringToHTML(22,3);

        return(output);
    }

    getMaxNumChilds(): number {
        return 0;
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();

        // Bepaal breedte van het element
        let desiredwidth = Number(this.keys[22][2]);
        if (isNaN(desiredwidth)) { desiredwidth = 25; }  

        // Creëer het element en return
        mySVG.yup = 0;
        mySVG.ydown = 0;
        mySVG.xleft = 0;
        mySVG.xright = desiredwidth;

        mySVG.data = "";

        return(mySVG);
    }

}