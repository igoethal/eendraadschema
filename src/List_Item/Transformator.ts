class Transformator extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type                           = this.getLegacyKey(mykeys,0);
        this.props.nr                             = this.getLegacyKey(mykeys,10);
        this.props.voltage                        = this.getLegacyKey(mykeys,14);
        this.props.adres                          = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Transformator"; 
        this.props.voltage = "230V/24V";   
        this.props.adres = "";
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml()
               +  "Voltage: " + this.stringPropToHTML('voltage',8)
               + ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan = false) {
        let mySVG:SVGelement = new SVGelement();

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 47;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data = (sitplan? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
                   + '<use xlink:href="#transformator" x="21" y="25"></use>'
                   + '<text x="35" y="44" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                      htmlspecialchars(this.props.voltage) + "</text>";
        
        mySVG.data += (sitplan? "" : this.addAddressToSVG(mySVG,58,15));

        return(mySVG);
    }

}