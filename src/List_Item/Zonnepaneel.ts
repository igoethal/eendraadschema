class Zonnepaneel extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.aantal           = this.getLegacyKey(mykeys,4);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Zonnepaneel";
        this.props.aantal = "1";
        this.props.adres = "";
        this.props.symbool = "driehoek";
    }

    overrideKeys() {
        if (this.props.symbool == null) this.props.symbool = "driehoek";
    }

    toHTML(mode: string) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml()
               +  " Aantal: " + this.selectPropToHTML('aantal',["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20",
                                                     "21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40"])
               +  ', Symbool: ' + this.selectPropToHTML('symbool',["driehoek","pijltjes"])
               +  ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan = false) {
        let mySVG:SVGelement = new SVGelement();

        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 69;
        mySVG.yup = 35;
        mySVG.ydown = 25;

        mySVG.data += (sitplan? "" : '<line x1="1" y1="35" x2="21" y2="35" stroke="black"></line>');

        switch (this.props.symbool) {
            case "driehoek":
                mySVG.data += '<use xlink:href="#zonnepaneel_driehoek" x="21" y="35"></use>';
                SVGSymbols.addSymbol('zonnepaneel_driehoek');
                break;
            case "pijltjes": default:
                mySVG.data += '<use xlink:href="#zonnepaneel" x="21" y="35"></use>';
                SVGSymbols.addSymbol('arrow');
                SVGSymbols.addSymbol('zonnepaneel');
                break;
        }

        mySVG.data += '<text x="45" y="9" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(this.props.aantal) + 'x</text>';
            
        // Adres helemaal onderaan plaatsen
        mySVG.data += (sitplan? "" : this.addAddressToSVG(mySVG,70,15));

        return(mySVG);
    }

}0