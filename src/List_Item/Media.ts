class Media extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        //Nothing to do since Media did not exist when Legacy Keys where still a thing
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Media";
        this.props.adres = "";
        this.props.aantal = 1;
        this.props.symbool = "";
    }

    overrideKeys() {
        if (this.props.symbool == 'luidspreker') {
            if (this.props.aantal < 1) this.props.aantal = 1;
            if (this.props.aantal > 20) this.props.aantal = 20;
        } else {
            this.props.aantal = 1;
        }    
    }

    toHTML(mode: string) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml()
               +  "Symbool: " + this.selectPropToHTML('symbool',["","luidspreker"]);

        if (this.props.symbool == 'luidspreker') {
            output += ", Aantal: " + this.selectPropToHTML('aantal',["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"]);
        }

        output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan = false) {
        let mySVG:SVGelement = new SVGelement();

        SVGSymbols.addSymbol('luidspreker');

        // Alles naar beneden schuiven als we het aantal laders boven het symbool willen plaatsen
        var shifty = 0;
        if (this.props.aantal>1) {
            shifty = 15;
            mySVG.data += '<text x="31" y="12" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.props.aantal) + '</text>'
        }

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25 + shifty;
        mySVG.ydown = 25;

        switch (this.props.symbool) {
            case "luidspreker":
                mySVG.data += (sitplan? '' : '<line x1="1" y1="' + (25 + shifty) + '" x2="21" y2="' + (25 + shifty) + '" stroke="black"></line>');
                mySVG.data += '<use xlink:href="#luidspreker" x="21" y="' + (25 + shifty) + '"></use>';
                mySVG.xright = 36;
                mySVG.data += (sitplan? '' : this.addAddressToSVG(mySVG,60 + shifty,15,0));
                break;
            default:
                mySVG.data += (sitplan? '' : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>');
                mySVG.xright = 19;
                break;
          }

        return(mySVG);
    }

}