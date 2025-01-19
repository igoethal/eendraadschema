class Lichtpunt extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type                        = this.getLegacyKey(mykeys,0);
        this.props.aantal                      = this.getLegacyKey(mykeys,4);
        this.props.nr                          = this.getLegacyKey(mykeys,10);
        this.props.aantal_buizen_indien_TL     = this.getLegacyKey(mykeys,13);
        this.props.adres                       = this.getLegacyKey(mykeys,15);
        this.props.type_lamp                   = this.getLegacyKey(mykeys,16);
        this.props.type_noodverlichting        = this.getLegacyKey(mykeys,17);
        this.props.is_wandlamp                 = this.getLegacyKey(mykeys,19);
        this.props.is_halfwaterdicht           = this.getLegacyKey(mykeys,20);
        this.props.heeft_ingebouwde_schakelaar = this.getLegacyKey(mykeys,21);
    }    

    resetProps() {
        this.clearProps();
        this.props.type = "Lichtpunt";
        this.props.aantal = "1";
        this.props.aantal_buizen_indien_TL = "1";
        this.props.adres = "";
        this.props.type_lamp = "standaard";
        this.props.type_noodverlichting = "Geen";
        this.props.is_wandlamp = false;
        this.props.is_halfwaterdicht = false;
        this.props.heeft_ingebouwde_schakelaar = false;
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml() 
               +  "Type: " + this.selectPropToHTML('type_lamp',["standaard", "TL", "spot", "led" /*, "Spot", "Led", "Signalisatielamp" */]) + ", ";

        if (this.props.type_lamp == "TL") {
            output += "Aantal buizen: " + this.selectPropToHTML('aantal_buizen_indien_TL',["1","2","3","4"]) + ", ";
        }

        output += "Aantal lampen: " + this.selectPropToHTML('aantal',["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"]) + ", "
               +  "Wandlamp: " + this.checkboxPropToHTML('is_wandlamp') + ", "
               +  "Halfwaterdicht: " + this.checkboxPropToHTML('is_halfwaterdicht') + ", "
               +  "Ingebouwde schakelaar: " + this.checkboxPropToHTML('heeft_ingebouwde_schakelaar') + ", "
               +  "Noodverlichting: " + this.selectPropToHTML('type_noodverlichting',["Geen", "Centraal", "Decentraal"])
               +  ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG(sitplan: boolean = false, mirrortext = false) {
        let mySVG:SVGelement = new SVGelement();

        mySVG.xleft = 1;   // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 20; // We starten met breedte 20 (leidings links) en vullen later aan in functie van wat moet getekend worden
        mySVG.yup = 25;
        mySVG.ydown = 25;

        // Teken de leiding links
        mySVG.data = (sitplan? "" : '<line x1="1" x2="30" y1="25" y2="25" stroke="black" />');

        // Indien halfwaterdicht en/of meerdere lampen, voorzie de tekst bovenaan
        let print_str_upper = "";
        if (this.props.is_halfwaterdicht) {
            print_str_upper = "h";
            if ((parseInt(this.props.aantal) > 1) && (!sitplan)) print_str_upper += ", x" + this.props.aantal; //Meer dan 1 lamp
        } else if ((parseInt(this.props.aantal) > 1) && (!sitplan))
            print_str_upper = "x" + this.props.aantal;


        switch (this.props.type_lamp) {

            case "led":
                SVGSymbols.addSymbol('led');

                // Teken led
                mySVG.data += '<use xlink:href="#led" x="' + 30 + '" y="25" />';
      
                // Teken wandlamp indien van toepassing
                if (this.props.is_wandlamp) mySVG.data += '<line x1="30" y1="35" x2="42" y2="35" stroke="black" />'; //Wandlamp

                // Teken ingebouwde schakelaar indien van toepassing
                if (this.props.heeft_ingebouwde_schakelaar) {
                    mySVG.data += '<line x1="42" y1="25" x2="45.75" y2="17.5" stroke="black" />'
                               +  '<line x1="45.75" y1="17.5" x2="48.25" y2="18.75" stroke="black" />';
                }
                  
                // Bepaal positie noodsymbool en teken het indien van toepassing
                var noodxpos;
                var textxpos;
                var noodypos = 6.5;
                
                if (print_str_upper == "") { noodxpos = 36; textxpos = 36; } 
                else {
                    noodxpos = 20;
                    if ( (print_str_upper.length > 2) && ( (this.props.type_noodverlichting == "Centraal") || (this.props.type_noodverlichting == "Decentraal") ) ) textxpos = 40;
                    else textxpos = 36; };

                if (print_str_upper != "") {
                    let textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="7"';
                    if (mirrortext==false)
                        mySVG.data += `<text x="${textxpos}" y="10" ${textoptions}>${htmlspecialchars(print_str_upper)}</text>`;
                    else
                        mySVG.data += `<text transform="scale(-1,1) translate(${-2*textxpos},0)" x="${textxpos}" y="10" ${textoptions}>${htmlspecialchars(print_str_upper)}</text>`;
                }
                
                switch (this.props.type_noodverlichting) { // Type noodverlichting
                    case "Centraal":
                        mySVG.data += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />'
                                   +  '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />'
                                   +  '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                        break;
                    case "Decentraal":
                        mySVG.data += '<rect x="' + (noodxpos-5.6) + '" y="' + (noodypos-5.6) + '" width="11.2" height="11.2" fill="white" stroke="black" />'
                                   +  '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                                   +  '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                                   +  '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                        break;
                    default:
                        break;
                }

                // Verdere uitlijning en adres onderaan   
                mySVG.xright = 42;
                mySVG.data += (sitplan? "" : this.addAddressToSVG(mySVG,50,5,2));
                break;

            case "spot":
                SVGSymbols.addSymbol('spot');

                // teken spot
                mySVG.data += '<use xlink:href="#spot" x="' + 30 + '" y="25" />';
      
                // Teken wandlamp indien van toepassing
                if (this.props.is_wandlamp) mySVG.data += '<line x1="30" y1="38" x2="46" y2="38" stroke="black" />';
                
                // Teken ingebouwde schakelaar indien van toepassing
                if (this.props.heeft_ingebouwde_schakelaar) {
                    mySVG.data += '<line x1="46" y1="25" x2="49.75" y2="17.5" stroke="black" />'
                               +  '<line x1="49.75" y1="17.5" x2="52.25" y2="18.75" stroke="black" />';
                }

                // Bepaal positie noodsymbool en teken het indien van toepassing
                var noodxpos;
                var textxpos;
                var noodypos = 6.5;

                if (print_str_upper == "") { noodxpos = 40; textxpos = 40; }
                else {
                    noodxpos = 24;
                    if ( (print_str_upper.length > 2) && ( (this.props.type_noodverlichting == "Centraal") || (this.props.type_noodverlichting == "Decentraal") ) ) textxpos = 44;
                    else textxpos = 40; }
                  
                if (print_str_upper != "") {
                    let textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="7"';
                    if (mirrortext==false)
                        mySVG.data += `<text x="${textxpos}" y="10" ${textoptions}>${htmlspecialchars(print_str_upper)}</text>`;
                    else
                        mySVG.data += `<text transform="scale(-1,1) translate(${-2*textxpos},0)" x="${textxpos}" y="10" ${textoptions}>${htmlspecialchars(print_str_upper)}</text>`;
                }
                  
                switch (this.props.type_noodverlichting) {
                    case "Centraal":
                        mySVG.data += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />'
                                   +  '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />'
                                   +  '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                        break;
                    case "Decentraal":
                        mySVG.data += '<rect x="' + (noodxpos-5.6) + '" y="' + (noodypos-5.6) + '" width="11.2" height="11.2" fill="white" stroke="black" />'
                                   +  '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />'
                                   +  '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />'
                                   +  '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                        break;
                    default:
                        break;
                }

                // Verdere uitlijning en adres onderaan
                mySVG.xright = 45;
                mySVG.data += (sitplan? "" : this.addAddressToSVG(mySVG,52,7,4));
                break;

            case "TL":
                // Teken TL lampen
                var aantal_buizen = this.props.aantal_buizen_indien_TL;
                var starty = 25-(aantal_buizen)*3.5;
                var endy = 25+(aantal_buizen)*3.5;

                mySVG.data += '<line x1="30" y1="' + starty + '" x2="30" y2="' + endy + '" stroke="black" stroke-width="2" />'
                           +  '<line x1="90" y1="' + starty + '" x2="90" y2="' + endy + '" stroke="black" stroke-width="2" />';

                for (let i = 0; i < aantal_buizen ; i++) {
                    mySVG.data += '<line x1="30" y1="' + (starty + (i*7) + 3.5) + '" x2="90" y2="' + (starty + (i*7) + 3.5) + '" stroke="black" stroke-width="2" />';
                }

                // Teken wandlamp indien van toepassing
                if (this.props.is_wandlamp) mySVG.data += '<line x1="50" y1="' + (27 + (aantal_buizen*3.5)) + '" x2="70" y2="' + (27 + (aantal_buizen*3.5)) + '" stroke="black" />';

                // Zet symbool halfwaterdicht en aantal lampen bovenaan
                if (print_str_upper != "") {
                    let textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"';
                    if (mirrortext == false)
                        mySVG.data += `<text x="60" y="${25 - (aantal_buizen*3.5)}" ${textoptions}>${htmlspecialchars(print_str_upper)}</text>`;
                    else
                        mySVG.data += `<text transform="scale(-1,1) translate(-120,0)" x="60" y="${25 - (aantal_buizen*3.5)}" ${textoptions}>${htmlspecialchars(print_str_upper)}</text>`;
                }
                
                // Teken ingebouwde schakelaar indien van toepassing
                if (this.props.heeft_ingebouwde_schakelaar) {
                    mySVG.data += '<line x1="77.5" y1="' + (29-(aantal_buizen*3.5)) + '" x2="85" y2="' + (14-(aantal_buizen*3.5)) + '" stroke="black" />'
                               +  '<line x1="85" y1="' + (14-(aantal_buizen*3.5)) + '" x2="90" y2="' + (16.5-(aantal_buizen*3.5)) + '" stroke="black" />';
                }

                // Bepaal positie noodsymbool en teken het indien van toepassing
                var noodxpos;
                var noodypos = (25 - (aantal_buizen*3.5) - 5);

                if (print_str_upper == "") noodxpos = 60; else noodxpos = 39;
                
                switch (this.props.type_noodverlichting) {
                    case "Centraal":
                        mySVG.data += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />'
                                   +  '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />'
                                   +  '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                        break;
                    case "Decentraal":
                        mySVG.data += '<rect x="' + (noodxpos-5.6) + '" y="' + (noodypos-5.6) + '" width="11.2" height="11.2" fill="white" stroke="black" />'
                                   +  '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />'
                                   +  '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />'
                                   +  '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                      break;
                }

                // Verdere uitlijning en adres onderaan
                mySVG.xright = 90;
                mySVG.data += (sitplan? "" : this.addAddressToSVG(mySVG,endy+13,Math.max(mySVG.ydown,endy+18-25),2));
                break;
                
            default: //Normaal lichtpunt (kruisje)
                
                switch (this.props.type_noodverlichting) {
                    case "Centraal":
                        SVGSymbols.addSymbol('lamp');
                        mySVG.data += '<use xlink:href="#lamp" x="' + 30 + '" y="25" />'
                                   +  '<circle cx="30" cy="25" r="5" style="stroke:black;fill:black" />';
                        if ( (this.heeftVerbruikerAlsKind()) && (!sitplan) ) mySVG.data += '<line x1="'+30+'" y1="25" x2="'+(30+11)+'" y2="25" stroke="black" />';
                        break;
                    case "Decentraal":
                        SVGSymbols.addSymbol('noodlamp_decentraal');
                        mySVG.data += '<use xlink:href="#noodlamp_decentraal" x="' + 30 + '" y="25" />';
                        if (this.props.heeft_ingebouwde_schakelaar) mySVG.data += '<line x1="37" y1="18" x2="40" y2="15" stroke="black" stroke-width="2" />'; //Ingebouwde schakelaar
                        break;
                    default:
                        SVGSymbols.addSymbol('lamp');
                        mySVG.data += '<use xlink:href="#lamp" x="' + 30 + '" y="25" />';
                        if ( (this.heeftVerbruikerAlsKind()) && (!sitplan) ) mySVG.data += '<line x1="'+30+'" y1="25" x2="'+(30+11)+'" y2="25" stroke="black" />';
                        break;
                }

                // Zet symbool halfwaterdicht en aantal lampen bovenaan
                if (print_str_upper != "") {
                    let textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"';
                    if (mirrortext == false)
                        mySVG.data += `<text x="30" y="10" ${textoptions}>${htmlspecialchars(print_str_upper)}</text>`;
                    else
                        mySVG.data += `<text transform="scale(-1,1) translate(-60,0)" x="30" y="10" ${textoptions}>${htmlspecialchars(print_str_upper)}</text>`;
                }
                
                // Teken wandlamp indien van toepassing
                if (this.props.is_wandlamp) mySVG.data += '<line x1="20" y1="40" x2="40" y2="40" stroke="black" />';
                
                // Teken ingebouwde schakelaar indien van toepassing
                if (this.props.heeft_ingebouwde_schakelaar) mySVG.data += '<line x1="40" y1="15" x2="45" y2="20" stroke="black" stroke-width="2" />';
                
                // Verdere uitlijning en adres onderaan
                mySVG.xright = 39;
                mySVG.data += (sitplan? "" : this.addAddressToSVG(mySVG,54,10,-1));
                break;
        }

        mySVG.data += "\n";

        return(mySVG);
    }

}