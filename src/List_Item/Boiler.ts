class Boiler extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.heeft_accumulatie = this.getLegacyKey(mykeys,3);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type                = "Boiler";
        this.props.heeft_accumulatie    = false;  
        this.props.adres               = "";
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Nr: " + this.stringPropToHTML('nr',5) + ", ";
        output += "Accumulatie: " + this.checkboxPropToHTML('heeft_accumulatie');
        output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();
        let outputstr:string = "";

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data = '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        switch (this.props.heeft_accumulatie) { //accumulatie
            case false:
                mySVG.data += '<use xlink:href="#boiler" x="21" y="25"></use>';
                break;
            case true:
                mySVG.data += '<use xlink:href="#boiler_accu" x="21" y="25"></use>';
                break;
          }

        mySVG.data += this.addAddressToSVG(mySVG,60);
        mySVG.data += "\n";

        return(mySVG);
    }

}