class Omvormer extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Omvormer";
        this.props.adres = "";
        this.props.inkring = false;
    } 

    overrideKeys() {
        let parent: Electro_Item;
        if (this.props.inkring == null) this.props.inkring = false;
        if ( ((parent = this.getParent()) != null) && (parent.getType() != "Kring") )
            this.props.inkring = false;
        if (this.props.inkring) this.props.adres = "";
    }

    toHTML(mode: string) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode);
        let parent;

        output += "&nbsp;" + this.nrToHtml();
        if ( ((parent = this.getParent()) != null) && (parent.getType() == "Kring") )
            output += "In kring: " + this.checkboxPropToHTML('inkring') 
            + (!this.props.inkring ? ", " : "");
        if (!this.props.inkring) output += "Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan = false) {
        let mySVG:SVGelement = new SVGelement();

        SVGSymbols.addSymbol('sinus');
        SVGSymbols.addSymbol('omvormer');

        mySVG.yup = 25;
        mySVG.ydown = 25;

        if (this.props.inkring) {
            mySVG.xleft = 41; // foresee at least some space for the conductor
            mySVG.xright = 19;

            mySVG.data = '<use xlink:href="#omvormer" x="21" y="25"></use>';
        
            //mySVG.data += (sitplan? "" : this.addAddressToSVG(mySVG,60,15));
        } else {
            mySVG.xleft = 1; // foresee at least some space for the conductor
            mySVG.xright = 59;
            
            mySVG.data = (sitplan? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
                       + '<use xlink:href="#omvormer" x="21" y="25"></use>';
        
            mySVG.data += (sitplan? "" : this.addAddressToSVG(mySVG,60,15));
        }
        
        return(mySVG);
    }

}