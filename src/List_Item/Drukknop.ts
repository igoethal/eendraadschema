class Drukknop extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type                           = this.getLegacyKey(mykeys,0);
        this.props.aantal                         = this.getLegacyKey(mykeys,4);
        this.props.nr                             = this.getLegacyKey(mykeys,10);
        this.props.aantal_knoppen_per_armatuur    = this.getLegacyKey(mykeys,13);
        this.props.adres                          = this.getLegacyKey(mykeys,15);
        this.props.type_knop                      = this.getLegacyKey(mykeys,16);
        this.props.is_afgeschermd                 = this.getLegacyKey(mykeys,19);
        this.props.is_halfwaterdicht              = this.getLegacyKey(mykeys,20);
        this.props.heeft_verklikkerlampje         = this.getLegacyKey(mykeys,21);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Drukknop";
        this.props.aantal = "1";
        this.props.aantal_knoppen_per_armatuur = "1";
        this.props.adres = "";
        this.props.type_knop = "standaard";
        this.props.is_afgeschermd = false; 
        this.props.is_halfwaterdicht = false; 
        this.props.heeft_verklikkerlampje = false;
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml()
               +    "Type: " + this.selectPropToHTML('type_knop',["standaard","dimmer","rolluik"])
               +  ", Verklikkerlampje: " + this.checkboxPropToHTML('heeft_verklikkerlampje')
               +  ", Halfwaterdicht: " + this.checkboxPropToHTML('is_halfwaterdicht')
               +  ", Afgeschermd: " + this.checkboxPropToHTML('is_afgeschermd')
               +  ", Aantal armaturen: " + this.selectPropToHTML('aantal',["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"])
               +  ", Aantal knoppen per armatuur: " + this.selectPropToHTML('aantal_knoppen_per_armatuur',["1","2","3","4","5","6","7","8"])
               +  ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan: boolean = false, mirrortext: boolean = false) {
        let mySVG:SVGelement = new SVGelement();
        
        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 43; 
        mySVG.yup = 25;
        mySVG.ydown = 25;

        var aantal_knoppen:number = this.props.aantal;
        
        // Teken lijn links
        mySVG.data += (sitplan? "" : '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>')
                   +  '<use xlink:href="#drukknop" x="21" y="25"></use>';

        // Teken verklikkerlampje indien van toepassing
        if (this.props.heeft_verklikkerlampje) { 
            mySVG.data += '<line x1="28" y1="20" x2="38" y2="30" stroke="black"></line>'  // midden 33, 25, lengte 7
                       +  '<line x1="28" y1="30" x2="38" y2="20" stroke="black"></line>';
        }

        // Teken afgeschermd indien van toepassing
        if (this.props.is_afgeschermd) {
            mySVG.data += '<line x1="26" y1="10" x2="40" y2="10" stroke="black"></line>'  // midden 33, 25 lengte 7
                       +  '<line x1="26" y1="10" x2="26" y2="15" stroke="black"></line>'
                       +  '<line x1="40" y1="10" x2="40" y2="15" stroke="black"></line>'
                       +  '<line x1="22" y1="15" x2="26" y2="15" stroke="black"></line>'
                       +  '<line x1="40" y1="15" x2="44" y2="15" stroke="black"></line>';
        }

        // Plaats tekst voor "h" en/of aantal armaturen onderaan
        var printstr:string = "";
        if (this.props.is_halfwaterdicht) printstr += 'h';
        if (aantal_knoppen > 1) {
          if (printstr != '') { printstr += ', ' }
          printstr += 'x' + aantal_knoppen;
        }
        if (printstr != '') {
            let textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"';
            if (mirrortext == false)
                mySVG.data += '<text x="33" y="49" ' + textoptions + '>' + htmlspecialchars(printstr) + '</text>';
            else
                mySVG.data += '<text transform="scale(-1,1) translate(-66,0)" x="33" y="49" ' + textoptions + '>' + htmlspecialchars(printstr) + '</text>';
        }

        // Plaats tekst voor aantal knoppen per armatuur
        if (this.props.aantal_knoppen_per_armatuur > 1) {
            let textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"';
            if (mirrortext == false)
                mySVG.data += '<text x="44" y="13" ' + textoptions + '>' + htmlspecialchars(this.props.aantal_knoppen_per_armatuur) + '</text>';
            else
                mySVG.data += '<text transform="scale(-1,1) translate(-88,0)" x="44" y="13" ' + textoptions + '>' + htmlspecialchars(this.props.aantal_knoppen_per_armatuur) + '</text>';
            mySVG.data += '<line x1="39" y1="19" x2="44" y2="14" stroke="black" />';
        }

        // Plaats extra tekens voor rolluik of dimmer
        switch (this.props.type_knop) {
            case "dimmer":
                mySVG.data += '<polygon points="18,20 18,13 28,20" fill="black" stroke="black" />';
                break;
            case "rolluik":
                mySVG.data += '<polygon points="18,12 22,12 20,9" fill="black" stroke="black" />'
                           +  '<polygon points="18,15 22,15 20,18" fill="black" stroke="black" />';
                break;
            default:
        }

        // Plaats adres helemaal onderaan
        if (printstr != '') {
            mySVG.data += (sitplan? "" : this.addAddressToSVG(mySVG,65,20));
        } else {
            mySVG.data += (sitplan? "" : this.addAddressToSVG(mySVG,49,5));
        }

        return(mySVG);
    }

}