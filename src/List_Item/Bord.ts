class Bord extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Bord";      // This is rather a formality as we should already have this at this stage
        this.keys[1][2] = true;        // Per default geaard
        this.keys[10][2] = "";         // Bord heeft initieel geen naam
        this.keys[15][2] = "";         // Set Adres/tekst to "" when the item is cleared
    }

    toHTML(mode: string, Parent?: List_Item) {
        let output = this.toHTMLHeader(mode, Parent);

        output += "&nbsp;Naam: " + this.stringToHTML(10,5) + ", "
               +  "Geaard: " + this.checkboxToHTML(1);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement; // = new SVGelement();

        // Maak een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id,"horizontal");

        // Voorzie 10 extra pixels rechts na de allerlaatste kring
        mySVG.xright += 10;

        // Schuif het geheel voldoende naar links om plaats te hebben voor label en eventuele aarding

        let mintextsize = Math.max(30, svgTextWidth('&lt'+htmlspecialchars(this.keys[10][2])+'&gt',10,'font-weight="bold"') + 13);
        let minxleft = mintextsize + (this.keys[1][2] ? 70 : 0); //Indien geaard hebben we 70 meer nodig

        if (mySVG.xleft <= minxleft) { // Minstens 100 pixels indien aarding
            mySVG.xright = mySVG.xleft + mySVG.xright - minxleft;
            mySVG.xleft = minxleft;
        }

        // Indien door het schuiven er niets rechts over blijft, voorzie minstens 10 pixels
        if (mySVG.xright <=10) mySVG.xright = 10;

        // Voorzie voldoende plaats voor de lijn onderaan
        mySVG.ydown = Math.max(mySVG.ydown,1);

        // Teken de lijn onderaan
        mySVG.data += '<line x1="4" x2="' + (mySVG.xleft + mySVG.xright - 6) +
                      '" y1="' + mySVG.yup + '" y2="' + mySVG.yup + '" stroke="black" stroke-width="3" />'

        // Voeg naam van het bord toe
        if (this.keys[10][2] !== "")
            mySVG.data += '<text x="' + (5) + '" y="' + (mySVG.yup + 13) + '" ' 
                       +  'style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="10">&lt;' 
                       +  htmlspecialchars(this.keys[10][2])+'&gt;</text>';
        
        // Teken aarding onderaan
        if (this.keys[1][2])
            mySVG.data += '<line x1="' + (mintextsize + 10) + '" y1="' + (mySVG.yup + 0) + '" x2="' + (mintextsize + 10) + '" y2="' + (mySVG.yup + 10) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 10) + '" y1="' + (mySVG.yup + 15) + '" x2="' + (mintextsize + 10) + '" y2="' + (mySVG.yup + 25) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 10) + '" y1="' + (mySVG.yup + 30) + '" x2="' + (mintextsize + 10) + '" y2="' + (mySVG.yup + 40) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 5) + '" y1="' + (mySVG.yup + 10) + '" x2="' + (mintextsize + 15) + '" y2="' + (mySVG.yup + 10) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 5) + '" y1="' + (mySVG.yup + 15) + '" x2="' + (mintextsize + 15) + '" y2="' + (mySVG.yup + 15) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 5) + '" y1="' + (mySVG.yup + 25) + '" x2="' + (mintextsize + 15) + '" y2="' + (mySVG.yup + 25) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 5) + '" y1="' + (mySVG.yup + 30) + '" x2="' + (mintextsize + 15) + '" y2="' + (mySVG.yup + 30) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 0) + '" y1="' + (mySVG.yup + 40) + '" x2="' + (mintextsize + 20) + '" y2="' + (mySVG.yup + 40) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 2.5) + '" y1="' + (mySVG.yup + 43) + '" x2="' + (mintextsize + 17.5) + '" y2="' + (mySVG.yup + 43) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 5) + '" y1="' + (mySVG.yup + 46) + '" x2="' + (mintextsize + 15) + '" y2="' + (mySVG.yup + 46) + '" stroke="black" />';

        return(mySVG);
    }

}