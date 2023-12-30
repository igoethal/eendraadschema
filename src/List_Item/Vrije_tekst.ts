class Vrije_tekst extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Vrije tekst";   // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = "";             // Set Tekst itself to "" when the item is cleared
        this.keys[16][2] = "zonder kader"; // Per default zonder kader, gebruik symbool "Verbruiker (tekst)" voor de default met kader
        this.keys[17][2] = "links";        // Per default gecentreerd
        this.keys[18][2] = "automatisch";  // Per default automatische breedte
        this.keys[19][2] = false;          // Per default niet vet
        this.keys[20][2] = false;          // Per default niet schuin
        this.keys[23][2] = "";             // Set Adres/tekst to "" when the item is cleared
    }

    overrideKeys() {
        if (this.keys[16][2] != "verbruiker") { this.keys[16][2] = "zonder kader"; }
        if (this.keys[18][2] != "automatisch") { this.keys[18][2] = "handmatig"; }
        if (this.heeftVerbruikerAlsKind()) { this.keys[16][2] = "verbruiker"; }
        this.adjustTextWidthIfAuto();
    }

    toHTML(mode: string) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5)
               +  ", Tekst (nieuwe lijn = \"|\"): " + this.stringToHTML(15,30)
               +  ", Breedte: " + this.selectToHTML(18,["automatisch","handmatig"]);

        if (this.keys[18][2] != "automatisch") output += " " + this.stringToHTML(22,3);
        
        output += ", Vet: " + this.checkboxToHTML(19)
               +  ", Schuin: " + this.checkboxToHTML(20)
               +  ", Horizontale alignering: " + this.selectToHTML(17,["links","centreer","rechts"])
               +  ", Type: " + this.selectToHTML(16,(this.heeftVerbruikerAlsKind() ? ["verbruiker"] : ["verbruiker","zonder kader"]));
               
        if (this.keys[16][2] != "zonder kader") output += ", Adres/tekst: " + this.stringToHTML(23,5);

        return(output);
    }

    adjustTextWidthIfAuto() {
        if (this.keys[18][2] === "automatisch") {
            var options:string = "";
            if (this.keys[19][2]) options += ' font-weight="bold"';
            if (this.keys[20][2]) options += ' font-style="italic"';
            var strlines = htmlspecialchars(this.keys[15][2]).split("|");
            var width = 40;
            for (let i = 0; i<strlines.length; i++) {
                width = Math.round(Math.max(width,svgTextWidth(strlines[i],10,options)+10));
            }
            this.keys[22][2] = String(width);
        }    
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();
        var strlines = htmlspecialchars(this.keys[15][2]).split("|");

        // Breedte van de vrije tekst bepalen
        this.adjustTextWidthIfAuto();
        var width = ( isNaN(Number(this.keys[22][2])) || ( this.keys[22][2] === "" )  ? 40 : Math.max(Number(this.keys[22][2])*1,1) ); 

        // Voldoende ruimte voorzien voor alle elementen
        var extraplace = 15 * Math.max(strlines.length-2,0);
        var shiftx;
        if (this.keys[16][2] === "zonder kader") {
            if (this.getParent().keys[0][2] === "Kring") shiftx = 10;
            else if (this.getParent().keys[0][2] === "Stopcontact") shiftx = 0;
            else shiftx = 5;
        } else shiftx = 20;

        mySVG.xleft = 1;                      // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = shiftx + width;
        mySVG.yup = 25 + extraplace / 2.0;    // Wordt hieronder nog aangepast als er teveel lijnen tekst zijn
        mySVG.ydown = 25 + extraplace / 2.0;  // Wordt hieronder nog aangepast als er teveel lijnen tekst zijn

        // Optionele parameters voor vet en italic uitlezen
        var options:string = "";
        if (this.keys[19][2]) options += ' font-weight="bold"';
        if (this.keys[20][2]) options += ' font-style="italic"';

        // Tekst plaatsen --
        var outputstr_common;
        switch (this.keys[17][2]) {
            case "links":  outputstr_common = '<text style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="10" x="' + (shiftx + 5) + '" '; break;
            case "rechts": outputstr_common = '<text style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-size="10" x="' + (shiftx + width - 4) + '" '; break;
            default:       outputstr_common = '<text style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" x="' + (shiftx + 1 + width/2) + '" '; break;
        }

        for (let i = 0; i<strlines.length; i++) {
            let dispy = 28 - 7.5 * Math.min(1,strlines.length-1) + 15 * i;
            mySVG.data += outputstr_common + ' y="' + dispy + '"' + options + '>' + strlines[i] + '</text>';
        }
       
        // Kader en adres tekenen --
        switch (this.keys[16][2]) {
            case "zonder kader": break;
            default: //Wegens compatibiliteit met oudere versies van de software is het ontbreken van eender welke parameter een "met kader"
                mySVG.data += '<line x1="1" y1="' + (25 + extraplace/2.0) + '" x2="21" y2="' + (25 + extraplace/2.0) + '" stroke="black" />'
                           + '<rect x="21" y="5" width="' + width + '" height="' + (40 + extraplace) + '" fill="none" style="stroke:black" />'
                           + this.addAddress(mySVG,60+extraplace,15,width/2-(mySVG.xright-20)/2,23);
                break;
        }

        return(mySVG);
    }

}