class USB_lader extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type                          = this.getLegacyKey(mykeys,0);
        this.props.aantal                        = this.getLegacyKey(mykeys,4);
        this.props.nr                            = this.getLegacyKey(mykeys,10);
        this.props.adres                         = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "USB lader"; // This is rather a formality as we should already have this at this stage
        this.props.aantal = "1";         // Per default 1 lader
        this.props.adres = "";         // Set Adres/tekst to "" when the item is cleared
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml();
        output += "Aantal: " + this.selectPropToHTML('aantal',["1","2","3","4","5","6","7","8","9","10"]);
        output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan = false) {
        let mySVG:SVGelement = new SVGelement();

        SVGSymbols.addSymbol('usblader');

        // Alles naar beneden schuiven als we het aantal laders boven het symbool willen plaatsen
        var shifty = 0;
        if (this.props.aantal > 1) {
            shifty = 12;
            mySVG.data += '<text x="51" y="14" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.props.aantal) + '</text>'
        }

        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 79;
        mySVG.yup = 25 + shifty;
        mySVG.ydown = 25;

        mySVG.data += (sitplan? "" : '<line x1="1" y1="' + (shifty+25) + '" x2="21" y2="' + (shifty+25) + '" stroke="black"></line>')
                   +  '<use xlink:href="#usblader" x="21" y="' + (shifty+25) + '"></use>';
        
        mySVG.data += (sitplan? "" : this.addAddressToSVG(mySVG,55 + shifty,10));

        return(mySVG);
    }

}