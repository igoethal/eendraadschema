class Meerdere_verbruikers extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Meerdere verbruikers"; // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = "";     // Set Adres/tekst to "" when the item is cleared
    }

    toHTML(mode: string, Parent?: List_Item) {
        let output = this.toHTMLHeader(mode, Parent);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5)
               +  ", Adres/tekst: " + this.stringToHTML(15,5);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement; // = new SVGelement();

        // Maak een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id,"horizontal");

        // We voorzien altijd verticale ruimte, zelfs als de kinderen nog niet gedefinieerd zijn
        mySVG.ydown = Math.max(mySVG.ydown,25);
        mySVG.yup = Math.max(mySVG.yup,25);
        mySVG.xleft = Math.max(mySVG.xleft,1);

        // Plaats adres onderaan indien niet leeg en indien er actieve kinderen zijn
        if ( (!(/^\s*$/.test(this.keys[15][2]))) && (this.heeftActiefKind()) ) { // Controleer of adres leeg is
            mySVG.data += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="' + (mySVG.yup+mySVG.ydown+10)
              + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
              mySVG.ydown += 15;
        }

        return(mySVG);
    }

}