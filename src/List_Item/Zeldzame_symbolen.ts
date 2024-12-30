class Zeldzame_symbolen extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.nr               = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
        this.props.symbool          = this.getLegacyKey(mykeys,16);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Zeldzame symbolen";
        this.props.adres = "";
        this.props.symbool = "";
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml()
               +  "Symbool: " + this.selectPropToHTML('symbool',["","deurslot"])
               +  ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan = false) {
        let mySVG:SVGelement = new SVGelement();

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        switch (this.props.symbool) {
            case "deurslot":
                mySVG.data += (sitplan? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
                           +  '<use xlink:href="#deurslot" x="21" y="25"></use>';
                mySVG.xright = 58;
                mySVG.data += this.addAddressToSVG(mySVG,55,10,2);
                break;
            default:
                mySVG.data += (sitplan? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>');
                mySVG.xright = -1;
                break;
          }

        return(mySVG);
    }

}