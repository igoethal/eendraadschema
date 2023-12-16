class Verbruiker extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { super(mylist); }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Verbruiker";    // This is rather a formality as we should already have this at this stage
        this.keys[15][2] = "";             // Set Tekst itself to "" when the item is cleared
        this.keys[17][2] = "centreer";     // Per default gecentreerd
        this.keys[18][2] = "automatisch";  // Per default automatische breedte
        this.keys[19][2] = false;          // Per default niet vet
        this.keys[20][2] = false;          // Per default niet schuin
        this.keys[23][2] = "";             // Set Adres/tekst to "" when the item is cleared
    }

    overrideKeys() {
        if (this.keys[18][2] != "automatisch") { this.keys[18][2] = "handmatig"; }
        this.adjustTextWidthIfAuto();
    }

    toHTML(mode: string, Parent?: List_Item) {
        let output = this.toHTMLHeader(mode, Parent);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5)
               +  ", Tekst (nieuwe lijn = \"|\"): " + this.stringToHTML(15,30)
               +  ", Breedte: " + this.selectToHTML(18,["automatisch","handmatig"]);

        if (this.keys[18][2] != "automatisch") output += " " + this.stringToHTML(22,3);

        output += ", Vet: " + this.checkboxToHTML(19)
               +  ", Schuin: " + this.checkboxToHTML(20)
               +  ", Horizontale alignering: " + this.selectToHTML(17,["links","centreer","rechts"])
               +  ", Adres/tekst: " + this.stringToHTML(23,2);

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

    toSVG(hasChild: Boolean = false) {
        let mySVG:SVGelement = new SVGelement();
        var strlines = htmlspecialchars(this.keys[15][2]).split("|");

        // Voldoende ruimte voorzien voor alle elementen
        this.adjustTextWidthIfAuto();
        var width = ( isNaN(Number(this.keys[22][2])) || ( this.keys[22][2] === "" )  ? 40 : Math.max(Number(this.keys[22][2])*1,1) ); 

        // Breedte van de vrije tekst bepalen
        var extraplace = 15 * Math.max(strlines.length-2,0);

        mySVG.xleft = 1;                      // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 20 + width;
        mySVG.yup = 25 + extraplace / 2.0;    // Wordt hieronder nog aangepast als er teveel lijnen tekst zijn
        mySVG.ydown = 25 + extraplace / 2.0;  // Wordt hieronder nog aangepast als er teveel lijnen tekst zijn

        // Optionele parameters voor vet en italic uitlezen
        var options:string = "";
        if (this.keys[19][2]) options += ' font-weight="bold"';
        if (this.keys[20][2]) options += ' font-style="italic"';

        // Tekst plaatsen --
        var outputstr_common;
        switch (this.keys[17][2]) {
            case "links":  outputstr_common = '<text style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="10" x="' + (20 + 5) + '" '; break;
            case "rechts": outputstr_common = '<text style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-size="10" x="' + (20 + width - 4) + '" '; break;
            default:       outputstr_common = '<text style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" x="' + (20 + 1 + width/2) + '" '; break;
        }

        for (let i = 0; i<strlines.length; i++) {
            var dispy = 28 - 7.5 * Math.min(1,strlines.length-1) + 15 * i;
            mySVG.data += outputstr_common + ' y="' + dispy + '"' + options + '>' + strlines[i] + '</text>';
        }
       
        // Kader en adres tekenen --
        mySVG.data += '<line x1="1" y1="' + (25 + extraplace/2.0) + '" x2="21" y2="' + (25 + extraplace/2.0) + '" stroke="black" />'
                   + '<rect x="21" y="5" width="' + width + '" height="' + (40 + extraplace) + '" fill="none" style="stroke:black" />'
                   + this.addAddress(mySVG,60+extraplace,15,width/2-(mySVG.xright-20)/2,23);

        return(mySVG);
    }

}