class Verwarmingstoestel extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.heeft_accumulatie = this.getLegacyKey(mykeys,3);
        this.props.heeft_ventilator  = this.getLegacyKey(mykeys,6);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Verwarmingstoestel";
        this.props.heeft_accumulatie = false;
        this.props.heeft_ventilator = false;
        this.props.adres = "";
    }

    overrideKeys() {
        if (!this.props.heeft_accumulatie) this.props.heeft_ventilator = false; //Indien geen accumulatie kan er ook geen ventilator zijn
    }

    toHTML(mode: string) {
        this.overrideKeys;
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml()
               +  "Accumulatie: " + this.checkboxPropToHTML('heeft_accumulatie')
               +  (this.props.heeft_accumulatie ? ", Ventilator: " + this.checkboxPropToHTML('heeft_ventilator') : "")
               +  ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan = false) {
        let mySVG:SVGelement = new SVGelement();      

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 69;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data = (sitplan? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>');
        switch (this.props.heeft_accumulatie) { //accumulatie
            case false:
                SVGSymbols.addSymbol('VerticalStripe');
                SVGSymbols.addSymbol('verwarmingstoestel');
                mySVG.data += '<use xlink:href="#verwarmingstoestel" x="21" y="25"></use>';
                break;
            case true:
                switch (this.props.heeft_ventilator) { //ventilator
                    case false:
                        SVGSymbols.addSymbol('VerticalStripe');
                        SVGSymbols.addSymbol('verwarmingstoestel_accu');
                        mySVG.data += '<use xlink:href="#verwarmingstoestel_accu" x="21" y="25"></use>';
                        break;
                    case true:
                        SVGSymbols.addSymbol('VerticalStripe');
                        SVGSymbols.addSymbol('verwarmingstoestel_accu_ventilator');
                        mySVG.data += '<use xlink:href="#verwarmingstoestel_accu_ventilator" x="21" y="25"></use>';
                        mySVG.xright = 89;
                        break;
                }
                break;
        }

        mySVG.data += (sitplan? "" : this.addAddressToSVG(mySVG,55,10));

        return(mySVG);
    }

}