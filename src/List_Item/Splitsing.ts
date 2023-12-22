class Splitsing extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Splitsing"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = "";         // Set Adres/tekst to "" when the item is cleared
    }

    toHTML(mode: string, Parent?: List_Item) {
        let output = this.toHTMLHeader(mode, Parent);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement; // = new SVGelement();

        // Maak een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id,"horizontal");

        let parent = this.getParent();
        
        // Teken de lijn onderaan
        if ( (parent.keys[0][2] == "Aansluiting") || (parent.keys[0][2] == "Kring") ) {
            mySVG.data += '<line x1="' + (mySVG.xleft) + '" x2="' + (mySVG.xleft + mySVG.xrightmin)
                       +  '" y1="' + mySVG.yup + '" y2="' + mySVG.yup + '" stroke="black" />'

        } else {

            if ( (mySVG.xleft + mySVG.xright) <=0 ) mySVG.xrightmin = 15; // We teken altijd minstens een lijntje van 15 pixels om duidelijk te maken dat er een splitsing is

            if (mySVG.yup < 25) mySVG.yup = 25;
            if (mySVG.ydown < 25) mySVG.ydown = 25;

            mySVG.data += '<line x1="' + (1) + '" x2="' + (mySVG.xleft + mySVG.xrightmin)
                       +  '" y1="' + mySVG.yup + '" y2="' + mySVG.yup + '" stroke="black" />'
      
            mySVG.xright = mySVG.xright + mySVG.xleft;
            mySVG.xleft = 1; //we leave one pixel for the bold kring-line at the left
        }

        return(mySVG);
    }

}