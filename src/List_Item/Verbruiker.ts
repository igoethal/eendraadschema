class Verbruiker extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type                        = this.getLegacyKey(mykeys,0);
        this.props.nr                          = this.getLegacyKey(mykeys,10);
        this.props.tekst                       = this.getLegacyKey(mykeys,15);
        this.props.horizontale_uitlijning      = this.getLegacyKey(mykeys,17);
        this.props.heeft_automatische_breedte  = this.getLegacyKey(mykeys,18);
        this.props.is_vet                      = this.getLegacyKey(mykeys,19);
        this.props.is_cursief                   = this.getLegacyKey(mykeys,20);
        this.props.breedte                     = this.getLegacyKey(mykeys,22);
        this.props.adres                       = this.getLegacyKey(mykeys,23);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Verbruiker";
        this.props.tekst = "";
        this.props.horizontale_uitlijning = "centreer";
        this.props.heeft_automatische_breedte = "automatisch";
        this.props.breedte = "";
        this.props.is_vet = false;
        this.props.is_cursief = false;
        this.props.adres = "";
    }

    overrideKeys() {
        if (this.props.heeft_automatische_breedte != "automatisch") { this.props.heeft_automatische_breedte = "handmatig"; }
        this.adjustTextWidthIfAuto();
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml()
               +  "Tekst (nieuwe lijn = \"|\"): " + this.stringPropToHTML('tekst',30)
               +  ", Breedte: " + this.selectPropToHTML('heeft_automatische_breedte',["automatisch","handmatig"]);

        if (this.props.heeft_automatische_breedte != "automatisch") output += " " + this.stringPropToHTML('breedte',3);

        output += ", Vet: " + this.checkboxPropToHTML('is_vet')
               +  ", Cursief: " + this.checkboxPropToHTML('is_cursief')
               +  ", Horizontale alignering: " + this.selectPropToHTML('horizontale_uitlijning',["links","centreer","rechts"])
               +  ", Adres/tekst: " + this.stringPropToHTML('adres',2);

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

        // Voldoende ruimte voorzien voor alle elementen
        this.adjustTextWidthIfAuto();
        var width = ( isNaN(Number(this.props.breedte)) || ( this.props.breedte === "" )  ? 40 : Math.max(Number(this.props.breedte)*1,1) ); 

        // Breedte van de vrije tekst bepalen
        var extraplace = 15 * Math.max(strlines.length-2,0);

        mySVG.xleft = 1;                      // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 20 + width;
        mySVG.yup = 25 + extraplace / 2.0;    // Wordt hieronder nog aangepast als er teveel lijnen tekst zijn
        mySVG.ydown = 25 + extraplace / 2.0;  // Wordt hieronder nog aangepast als er teveel lijnen tekst zijn

        // Optionele parameters voor vet en italic uitlezen
        var options:string = "";
        if (this.props.is_vet) options += ' font-weight="bold"';
        if (this.props.is_cursief) options += ' font-style="italic"';

        // Tekst plaatsen --
        var outputstr_common;
        switch (this.props.horizontale_uitlijning) {
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
                   + this.addAddressToSVG(mySVG,60+extraplace,15,width/2-(mySVG.xright-20)/2);

        return(mySVG);
    }

}