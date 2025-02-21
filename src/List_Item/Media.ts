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
        if (['luidspreker','intercom'].includes(this.props.symbool)) {
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
               +  "Symbool: " + this.selectPropToHTML('symbool',["","luidspreker","intercom"]);

        if (['luidspreker','intercom'].includes(this.props.symbool)) {
            output += ", Aantal: " + this.selectPropToHTML('aantal',["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"]);
        }

        output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan = false) {
        let mySVG:SVGelement = new SVGelement();

        SVGSymbols.addSymbol('luidspreker');

        // Alles naar beneden schuiven als we het aantal laders boven het symbool willen plaatsen
        let shifty = 0;
        if ((this.props.aantal>1) && (!sitplan) && (['luidspreker','intercom'].includes(this.props.symbool))) {
            switch (this.props.symbool) {
                case "luidspreker": 
                    shifty = 15; 
                    mySVG.data += '<text x="31" y="12" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.props.aantal) + '</text>'
                    break;
                case "intercom": 
                    shifty = 5; 
                    mySVG.data += '<text x="36" y="12" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.props.aantal) + '</text>'
                    break;
                default:
                    //Do nothing
            }
            
        }

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = 59;
        mySVG.yup = 25 + shifty;
        mySVG.ydown = 25;

        switch (this.props.symbool) {
            case "luidspreker":
                mySVG.data += (sitplan? '' : '<line x1="1" y1="' + (25 + shifty) + '" x2="21" y2="' + (25 + shifty) + '" stroke="black" />');
                mySVG.data += '<use xlink:href="#luidspreker" x="21" y="' + (25 + shifty) + '" />';
                mySVG.xright = 36;
                mySVG.data += (sitplan? '' : this.addAddressToSVG(mySVG,60 + shifty,15,0));
                break;
            case "intercom":
                mySVG.data += (sitplan? '' : '<line x1="1" y1="' + (25 + shifty) + '" x2="21" y2="' + (25 + shifty) + '" stroke="black" />');
                mySVG.data += `<rect x="21" y="${(15 + shifty)}" width="30" height="20" stroke="black" fill="none" />`;
                mySVG.data += `<rect x="36" y="${(20 + shifty)}" width="4" height="10" stroke="black" fill="none" />`;
                mySVG.data += `<line x1="40" y1="${(20 + shifty)}" x2="51" y2="${(15 + shifty)}" stroke="black" />`;
                mySVG.data += `<line x1="40" y1="${(30 + shifty)}" x2="51" y2="${(35 + shifty)}" stroke="black" />`;
                mySVG.data += `<line x1="46" y1="${(25 + shifty)}" x2="56" y2="${(25 + shifty)}" stroke="black" stroke-width="2" />`;
                mySVG.data += `<line x1="46" y1="${(25 + shifty)}" x2="48" y2="${(23 + shifty)}" stroke="black" stroke-width="1" stroke-linecap="round" />`;
                mySVG.data += `<line x1="46" y1="${(25 + shifty)}" x2="48" y2="${(27 + shifty)}" stroke="black" stroke-width="1" stroke-linecap="round" />`;
                mySVG.data += `<line x1="56" y1="${(25 + shifty)}" x2="54" y2="${(23 + shifty)}" stroke="black" stroke-width="1" stroke-linecap="round" />`;
                mySVG.data += `<line x1="56" y1="${(25 + shifty)}" x2="54" y2="${(27 + shifty)}" stroke="black" stroke-width="1" stroke-linecap="round" />`;
                mySVG.xright = 54;
                mySVG.data += (sitplan? '' : this.addAddressToSVG(mySVG,50 + shifty,5,-3));
                break;
            default:
                mySVG.data += (sitplan? '' : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>');
                mySVG.xright = 19;
                break;
          }

        return(mySVG);
    }

    getSitPlanBoundaries() {
        let clipleft = 12;
        let addright = 0;
        let cliptop = 0;
        let addbottom = 0;
        switch (this.props.symbool) {
            case 'luidspreker':
                break;
            case 'intercom':
                addright = -5;
                cliptop = 5;
                addbottom = -5;
                break;
            default:
                break;
        }
        return({clipleft: clipleft, addright: addright, cliptop: cliptop, addbottom: addbottom});
    }
}