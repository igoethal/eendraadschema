class Verlenging extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type                        = this.getLegacyKey(mykeys,0);
        this.props.nr                          = this.getLegacyKey(mykeys,10);
        this.props.breedte                     = this.getLegacyKey(mykeys,22);
        this.props.adres                       = this.getLegacyKey(mykeys,23);
    }

    resetProps() {
        this.clearProps();
        this.props.type  = "Verlenging";
        this.props.breedte = "40";
        this.props.adres = "";
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml()
               +  "Breedte: " + this.stringPropToHTML('breedte',3)
               +  ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();
        let outputstr:string = "";

        var width;
        if (isNaN(Number(this.props.breedte))) {
            width = 40;
        } else {
            if (Number(this.props.breedte == "")) {
            width = 40;
            } else {
            width = Math.max(Number(this.props.breedte)*1,0);
            }
        }

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = width-1;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data += '<line x1="1" y1="25" x2="' + (width+1) + '" y2="25" stroke="black" />';
        
        mySVG.data += this.addAddressToSVG(mySVG,40,0,width/2-mySVG.xright/2-10);
        mySVG.data += "\n";

        return(mySVG);
    }

}