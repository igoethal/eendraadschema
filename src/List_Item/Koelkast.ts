class Koelkast extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Koelkast";
        this.props.adres = "";  
    } 

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml();
        output += "Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan = false) {
        let mySVG:SVGelement = new SVGelement();

        SVGSymbols.addSymbol('ster');
        SVGSymbols.addSymbol('koelkast');

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data = (sitplan? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
                   + '<use xlink:href="#koelkast" x="21" y="25"></use>';
        
        mySVG.data += this.addAddressToSVG(mySVG,60,15);

        return(mySVG);
    }

}