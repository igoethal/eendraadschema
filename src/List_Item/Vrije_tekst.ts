class Vrije_tekst extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type                        = this.getLegacyKey(mykeys,0);
        this.props.nr                          = this.getLegacyKey(mykeys,10);
        this.props.tekst                       = this.getLegacyKey(mykeys,15);
        this.props.vrije_tekst_type            = this.getLegacyKey(mykeys,16);
        this.props.horizontale_uitlijning      = this.getLegacyKey(mykeys,17);
        this.props.heeft_automatische_breedte  = this.getLegacyKey(mykeys,18);
        this.props.is_vet                      = this.getLegacyKey(mykeys,19);
        this.props.is_cursief                  = this.getLegacyKey(mykeys,20);
        this.props.breedte                     = this.getLegacyKey(mykeys,22);
        this.props.adres                       = this.getLegacyKey(mykeys,23);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Vrije tekst";
        this.props.tekst = "";
        this.props.vrije_tekst_type = "zonder kader";
        this.props.horizontale_uitlijning = "links";
        this.props.heeft_automatische_breedte = "automatisch";
        this.props.breedte = "";
        this.props.is_vet = false;
        this.props.is_cursief = false;
        this.props.adres = "";
    }    

    overrideKeys() {
        if (this.props.vrije_tekst_type != "verbruiker") { this.props.vrije_tekst_type = "zonder kader"; }
        if (this.props.heeft_automatische_breedte != "automatisch") { this.props.heeft_automatische_breedte = "handmatig"; }
        if (this.heeftVerbruikerAlsKind()) { this.props.vrije_tekst_type = "verbruiker"; }
        this.adjustTextWidthIfAuto();
    }

    toHTML(mode: string) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Nr: " + this.stringPropToHTML('nr',5)
               +  ", Tekst (nieuwe lijn = \"|\"): " + this.stringPropToHTML('tekst',30)
               +  ", Breedte: " + this.selectPropToHTML('heeft_automatische_breedte',["automatisch","handmatig"]);

        if (this.props.heeft_automatische_breedte != "automatisch") output += " " + this.stringPropToHTML('breedte',3);
        
        output += ", Vet: " + this.checkboxPropToHTML('is_vet')
               +  ", Cursief: " + this.checkboxPropToHTML('is_cursief')
               +  ", Horizontale alignering: " + this.selectPropToHTML('horizontale_uitlijning',["links","centreer","rechts"])
               +  ", Type: " + this.selectPropToHTML('vrije_tekst_type',(this.heeftVerbruikerAlsKind() ? ["verbruiker"] : ["verbruiker","zonder kader"]));
               
        if (this.props.vrije_tekst_type != "zonder kader") output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    adjustTextWidthIfAuto() {
        if (this.props.heeft_automatische_breedte === "automatisch") {
            var options:string = "";
            if (this.props.is_vet) options += ' font-weight="bold"';
            if (this.props.is_cursief) options += ' font-style="italic"';
            var strlines = htmlspecialchars(this.props.tekst).split("|");
            var width = 40;
            for (let i = 0; i<strlines.length; i++) {
                width = Math.round(Math.max(width,svgTextWidth(strlines[i],10,options)+10));
            }
            this.props.breedte = String(width);
        }    
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();
        var strlines = htmlspecialchars(this.props.tekst).split("|");

        // Breedte van de vrije tekst bepalen
        this.adjustTextWidthIfAuto();
        var width = ( isNaN(Number(this.props.breedte)) || ( this.props.breedte === "" )  ? 40 : Math.max(Number(this.props.breedte)*1,1) ); 

        // Voldoende ruimte voorzien voor alle elementen
        var extraplace = 15 * Math.max(strlines.length-2,0);
        var shiftx;
        if (this.props.vrije_tekst_type === "zonder kader") {
            if ((this.getParent() as Electro_Item).getType() === "Kring") shiftx = 10;
            else if ((this.getParent() as Electro_Item).getType() === "Contactdoos") shiftx = 0;
            else shiftx = 5;
        } else shiftx = 20;

        mySVG.xleft = 1;                      // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = shiftx + width;
        mySVG.yup = 25 + extraplace / 2.0;    // Wordt hieronder nog aangepast als er teveel lijnen tekst zijn
        mySVG.ydown = 25 + extraplace / 2.0;  // Wordt hieronder nog aangepast als er teveel lijnen tekst zijn

        // Optionele parameters voor vet en italic uitlezen
        var options:string = "";
        if (this.props.is_vet) options += ' font-weight="bold"';
        if (this.props.is_cursief) options += ' font-style="italic"';

        // Tekst plaatsen --
        var outputstr_common;
        switch (this.props.horizontale_uitlijning) {
            case "links":  outputstr_common = '<text style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="10" x="' + (shiftx + 5) + '" '; break;
            case "rechts": outputstr_common = '<text style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-size="10" x="' + (shiftx + width - 4) + '" '; break;
            default:       outputstr_common = '<text style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" x="' + (shiftx + 1 + width/2) + '" '; break;
        }

        for (let i = 0; i<strlines.length; i++) {
            let dispy = 28 - 7.5 * Math.min(1,strlines.length-1) + 15 * i;
            mySVG.data += outputstr_common + ' y="' + dispy + '"' + options + '>' + strlines[i] + '</text>';
        }
       
        // Kader en adres tekenen --
        switch (this.props.vrije_tekst_type) {
            case "zonder kader": break;
            default: //Wegens compatibiliteit met oudere versies van de software is het ontbreken van eender welke parameter een "met kader"
                mySVG.data += '<line x1="1" y1="' + (25 + extraplace/2.0) + '" x2="21" y2="' + (25 + extraplace/2.0) + '" stroke="black" />'
                           + '<rect x="21" y="5" width="' + width + '" height="' + (40 + extraplace) + '" fill="none" style="stroke:black" />'
                           + this.addAddressToSVG(mySVG,60+extraplace,15,width/2-(mySVG.xright-20)/2);
                break;
        }

        return(mySVG);
    }

}