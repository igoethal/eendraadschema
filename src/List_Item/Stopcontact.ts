class Stopcontact extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Stopcontact"; // This is rather a formality as we should already have this at this stage
        this.keys[1][2] = true;    // Per default geaard
        this.keys[2][2] = true;    // Per default kinderveilig
        this.keys[4][2] = "1";     // Per default 1 Stopcontact
        this.keys[15][2] = "";     // Set Adres/tekst to "" when the item is cleared
        this.keys[16][2] = "3";    // Indien meerfasig is de default 3 fasen
        this.keys[19][2] = false;  // Per default niet met ingebouwde schakelaar
        this.keys[20][2] = false;  // Per default niet halfwaterdicht
        this.keys[21][2] = false;  // Per default niet meerfasig
        this.keys[25][2] = false;  // Indien meerfasig, per default niet met nul
        this.keys[26][2] = false;  // Per default niet in verdeelbord
    }

    toHTML(mode: string, Parent?: List_Item) {
        let output = this.toHTMLHeader(mode, Parent);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5) + ", "
               +  "Geaard: " + this.checkboxToHTML(1) + ", "
               +  "Kinderveiligheid: " + this.checkboxToHTML(2) + " "
               +  "Halfwaterdicht: " + this.checkboxToHTML(20) + ", "
               +  "Meerfasig: " + this.checkboxToHTML(21) + ", ";

        if (this.keys[21][2]) {
          output += "Aantal fasen: " + this.selectToHTML(16,["1","2","3"]) + ", "
                 +  "Met nul: " + this.checkboxToHTML(25) + ", ";
        };

        output += "Ingebouwde schakelaar: " + this.checkboxToHTML(19) + ", "
               +  "Aantal: " + this.selectToHTML(4,["1","2","3","4","5","6"]) + ", "
               +  "In verdeelbord: " + this.checkboxToHTML(26)
               +  ", Adres/tekst: " + this.stringToHTML(15,5);

        return(output);
    }

    toSVG(hasChild: Boolean = false) {
        let mySVG:SVGelement = new SVGelement();
        let outputstr:string = "";

        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 20; // We starten met breedte 20 (leidings links) en vullen later aan in functie van wat moet getekend worden
        mySVG.yup = 25;
        mySVG.ydown = 25;

        var startx: number = 1; // Punt waar we aan het tekenen zijn. Schuift gaandeweg op

        // Teken lijnen voor meerfasig stopcontact
        if (this.keys[21][2]) {
          mySVG.data += '<line x1="1" y1="25" x2="35" y2="25" stroke="black" />';

          switch (this.keys[16][2]) { //faselijnen
            case "1":
                mySVG.data += '<line x1="21" y1="35" x2="27" y2="15" stroke="black" />';
                break;
            case "2":
                mySVG.data += '<line x1="16.5" y1="35" x2="22.5" y2="15" stroke="black" />'
                           +  '<line x1="22.5" y1="35" x2="28.5" y2="15" stroke="black" />';
                break;
            case "3":
                mySVG.data += '<line x1="15" y1="35" x2="21" y2="15" stroke="black" />'
                           +  '<line x1="21" y1="35" x2="27" y2="15" stroke="black" />'
                           +  '<line x1="27" y1="35" x2="33" y2="15" stroke="black" />';
                break;
            default:
                mySVG.data += '<line x1="21" y1="35" x2="27" y2="15" stroke="black" />';
                break;
          }
          
          if (this.keys[25][2]) { //nullijn
            mySVG.data += '<line x1="39" y1="35" x2="45" y2="15" stroke="black" />'
                       +  '<circle cx="39" cy="35" r="2" fill="black" stroke="black" />';
          }

          startx += 34; mySVG.xright += 34; //We schuiven alles 34 pixels op
        }

        // Teken ingebouwde schakelaar
        if (this.keys[19][2]) { 
            mySVG.data += '<line x1="' + (startx + 0) + '" y1="25" x2="' + (startx + 11) + '" y2="25" stroke="black" />'
                       +  '<line x1="' + (startx + 30) + '" y1="25" x2="' + (startx + 20) + '" y2="5" stroke="black" />'
                       +  '<line x1="' + (startx + 20) + '" y1="5" x2="' + (startx + 15) + '" y2="7.5" stroke="black" />'
                       +  '<line x1="' + (startx + 22) + '" y1="9" x2="' + (startx + 17) + '" y2="11.5" stroke="black" />';

            startx += 10; mySVG.xright += 10; //We schuiven alles 10 pixels op
        }

        // Teken alle stopcontacten, inclusief aarding en kinderveiligheid indien van toepassing
        for (let i=0; i<this.keys[4][2]; ++i) {
            mySVG.data += '<use xlink:href="#stopcontact" x="' + startx + '" y="25"></use>';
            if (this.keys[1][2]) mySVG.data += '<use xlink:href="#stopcontact_aarding" x="' + startx + '" y="25"></use>';
            if (this.keys[2][2]) mySVG.data += '<use xlink:href="#stopcontact_kinderveilig" x="' + startx + '" y="25"></use>';
            startx += 20; mySVG.xright += 20;
        }

        // Teken kader indien in verdeelbord
        if (this.keys[26][2]) {
            mySVG.data += '<rect x="' + (mySVG.xright - this.keys[4][2] * 20 - 3 - (this.keys[19][2]) * 12) + '" y="3" width="' + (this.keys[4][2] * 20 + 6 + (this.keys[19][2]) * 12) + '" height="44" fill="none" style="stroke:black" />';
                       +  '<line x1="' + (17 + (mySVG.xright-20+3)) + '" y1="3" x2="' + (17 + (mySVG.xright-20+3)) + '" y2="47" fill="none" style="stroke:black" />';
        };  

        // Teken halfwaterdicht indien van toepassing
        if (this.keys[20][2]) mySVG.data += '<rect x="' + (22+(this.keys[19][2])*10+(this.keys[21][2])*34) + '" y="0" width="6" height="8" style="fill:rgb(255,255,255)" /><text x="' + (25+(this.keys[19][2])*10+(this.keys[21][2])*34) + '" y="8" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';

        // Indien het stopcontact een kind heeft, teken een streepje rechts
        if (hasChild) {
            mySVG.data += '<line x1="'+startx+'" y1="25" x2="'+(startx+21)+'" y2="25" stroke="black" />';
        };
       
        // Adres helemaal onderaan plaatsen
        mySVG.data += this.addAddress(mySVG,60,15);
        mySVG.data += "\n";

        return(mySVG);
    }

}