class Schakelaars extends Electro_Item {
    
    constructor(mylist: Hierarchical_List) { 
        super(mylist);
    }

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type                      = this.getLegacyKey(mykeys,0);
        this.props.aantal_schakelaars        = this.getLegacyKey(mykeys,4);
        this.props.type_schakelaar           = this.getLegacyKey(mykeys,5);
        this.props.nr                        = this.getLegacyKey(mykeys,10);        
        this.props.adres                     = this.getLegacyKey(mykeys,15);
        this.props.heeft_signalisatielampje  = this.getLegacyKey(mykeys,19);
        this.props.is_halfwaterdicht         = this.getLegacyKey(mykeys,20);
        this.props.heeft_verklikkerlampje    = this.getLegacyKey(mykeys,21);
        this.props.is_trekschakelaar         = this.getLegacyKey(mykeys,25);
    } 

    resetProps() {
        this.clearProps();
        this.props.type = "Schakelaars"; // This is rather a formality as we should already have this at this stage
        this.props.aantal_schakelaars = "1";           // Per default 1 schakelaar
        this.props.type_schakelaar = "enkelpolig";  // Per default enkelpolig
        this.props.adres = "";           // Set Adres/tekst to "" when the item is cleared
        this.props.heeft_signalisatielampje = false;        // Per default geen signalisatielampje
        this.props.is_halfwaterdicht = false;        // Per default niet halfwaterdicht
        this.props.heeft_verklikkerlampje = false;        // Per default geen verklikkerslampje
        this.props.is_trekschakelaar = false;        // Per default geen trekschakelaar
    }

    kanHalfwaterdichtZijn() : boolean {
        return ( (this.props.type_schakelaar == "enkelpolig") || (this.props.type_schakelaar == "dubbelpolig") || (this.props.type_schakelaar == "driepolig") || (this.props.type_schakelaar == "kruis_enkel") ||
                 (this.props.type_schakelaar == "dubbelaansteking") || (this.props.type_schakelaar == "wissel_enkel") || (this.props.type_schakelaar == "wissel_dubbel") || (this.props.type_schakelaar == "dubbel") ||
                 (this.props.type_schakelaar == "dimschakelaar") || (this.props.type_schakelaar == "dimschakelaar wissel") || (this.props.type_schakelaar == "rolluikschakelaar") );
    }

    kanVerklikkerlampjeHebben() : boolean {
        return ( (this.props.type_schakelaar == "enkelpolig") || (this.props.type_schakelaar == "dubbelpolig") || (this.props.type_schakelaar == "driepolig") || (this.props.type_schakelaar == "kruis_enkel") ||
                 (this.props.type_schakelaar == "dubbelaansteking") || (this.props.type_schakelaar == "wissel_enkel") || (this.props.type_schakelaar == "wissel_dubbel") || (this.props.type_schakelaar == "dubbel") ||
                 (this.props.type_schakelaar == "dimschakelaar") || (this.props.type_schakelaar == "dimschakelaar wissel") )
    }

    kanSignalisatielampjeHebben() : boolean {
        return this.kanVerklikkerlampjeHebben();
    }

    kanTrekschakelaarHebben() : boolean {
        return ( (this.props.type_schakelaar == "enkelpolig") || (this.props.type_schakelaar == "dubbelpolig") || (this.props.type_schakelaar == "driepolig") || (this.props.type_schakelaar == "kruis_enkel") ||
                 (this.props.type_schakelaar == "dubbelaansteking") || (this.props.type_schakelaar == "wissel_enkel") || (this.props.type_schakelaar == "wissel_dubbel") || (this.props.type_schakelaar == "dubbel") )
    }

    overrideKeys() {
        switch (this.props.type_schakelaar) {
            case "enkelpolig":     this.props.aantal_schakelaars = String(Math.min(Number(this.props.aantal_schakelaars),5)); break;
            case "dubbelpolig":    this.props.aantal_schakelaars = String(Math.min(Number(this.props.aantal_schakelaars),2)); break;
            case "magneetcontact": this.props.aantal_schakelaars = String(Math.min(Number(this.props.aantal_schakelaars),20)); break;
            default:               this.props.aantal_schakelaars = "1"; break;
        }
        if (!this.kanHalfwaterdichtZijn) this.props.is_halfwaterdicht = false;
        if (!this.kanVerklikkerlampjeHebben) this.props.heeft_verklikkerlampje = false;
        if (!this.kanSignalisatielampjeHebben) this.props.heeft_signalisatielampje = false;
        if (!this.kanTrekschakelaarHebben) this.props.is_trekschakelaar = false;
    }

    toHTML(mode: string) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Nr: " + this.stringPropToHTML('nr',5);
        output += ", " + this.selectPropToHTML('type_schakelaar',["enkelpolig", "dubbelpolig", "driepolig", "dubbelaansteking", "wissel_enkel", "wissel_dubbel", "kruis_enkel", "---", "schakelaar", "dimschakelaar", "dimschakelaar wissel", "bewegingsschakelaar", "schemerschakelaar", "---", "teleruptor", "relais", "dimmer", "tijdschakelaar", "minuterie", "thermostaat", "rolluikschakelaar", "---", "magneetcontact"]);

        if (this.kanHalfwaterdichtZijn())       output += ", Halfwaterdicht: " + this.checkboxPropToHTML('is_halfwaterdicht');
        if (this.kanVerklikkerlampjeHebben())   output += ", Verklikkerlampje: " + this.checkboxPropToHTML('heeft_verklikkerlampje');
        if (this.kanSignalisatielampjeHebben()) output += ", Signalisatielampje: " + this.checkboxPropToHTML('heeft_signalisatielampje');
        if (this.kanTrekschakelaarHebben())     output += ", Trekschakelaar: " + this.checkboxPropToHTML('is_trekschakelaar');
        
        switch (this.props.type_schakelaar) {
            case "enkelpolig":     output += ", Aantal schakelaars: " + this.selectPropToHTML('aantal_schakelaars',["1","2","3","4","5"]); break;
            case "dubbelpolig":    output += ", Aantal schakelaars: " + this.selectPropToHTML('aantal_schakelaars',["1","2"]); break;
            case "magneetcontact": output += ", Aantal schakelaars: " + this.selectPropToHTML('aantal_schakelaars',["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"]); break;
        }

        output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);
        return(output);
    }

    bouwSchakelaarKeten(tekenKeten: Array<Schakelaar>) {      
        switch (this.props.type_schakelaar) {
            case "wissel_enkel":         tekenKeten.push(new Schakelaar("wissel_enkel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar)); break;
            case "wissel_dubbel":        tekenKeten.push(new Schakelaar("wissel_dubbel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar)); break;
            case "kruis_enkel":          tekenKeten.push(new Schakelaar("kruis_enkel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar)); break;
            case "teleruptor":           tekenKeten.push(new Schakelaar("teleruptor")); break;
            case "bewegingsschakelaar":  tekenKeten.push(new Schakelaar("bewegingsschakelaar")); break;
            case "schemerschakelaar":    tekenKeten.push(new Schakelaar("schemerschakelaar")); break;
            case "schakelaar":           tekenKeten.push(new Schakelaar("schakelaar")); break;
            case "dimmer":               tekenKeten.push(new Schakelaar("dimmer")); break;
            case "relais":               tekenKeten.push(new Schakelaar("relais")); break;
            case "minuterie":            tekenKeten.push(new Schakelaar("minuterie")); break;
            case "thermostaat":          tekenKeten.push(new Schakelaar("thermostaat")); break;
            case "tijdschakelaar":       tekenKeten.push(new Schakelaar("tijdschakelaar")); break;
            case "magneetcontact":       tekenKeten.push(new Schakelaar("magneetcontact",false,false,false,false,this.props.aantal_schakelaars)); break;
            case "rolluikschakelaar":    tekenKeten.push(new Schakelaar("rolluikschakelaar",this.props.is_halfwaterdicht)); break;
            case "dubbelaansteking":     tekenKeten.push(new Schakelaar("dubbelaansteking",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar)); break;
            case "dimschakelaar":        tekenKeten.push(new Schakelaar("dimschakelaar",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,false)); break;
            case "dimschakelaar wissel": tekenKeten.push(new Schakelaar("dimschakelaar_wissel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,false)); break;
            case "enkelpolig":
                if (Number(this.props.aantal_schakelaars) == 1) tekenKeten.push(new Schakelaar("enkel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar));
                if (Number(this.props.aantal_schakelaars) > 1) {
                    tekenKeten.push(new Schakelaar("wissel_enkel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar));
                    for (let i=2; i<Number(this.props.aantal_schakelaars); ++i) {
                        tekenKeten.push(new Schakelaar("kruis_enkel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar)); }
                    tekenKeten.push(new Schakelaar("wissel_enkel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar)); }
                break;
            case "dubbelpolig":
                if (Number(this.props.aantal_schakelaars) == 1) tekenKeten.push(new Schakelaar("dubbel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar));
                if (Number(this.props.aantal_schakelaars) > 1) {
                    tekenKeten.push(new Schakelaar("wissel_dubbel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar));
                    tekenKeten.push(new Schakelaar("wissel_dubbel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar));
                }  
                break;
            case "driepolig":
                tekenKeten.push(new Schakelaar("driepolig",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar));
                break;
        }
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();
        let tekenKeten: Array<Schakelaar> = [];

        // Eerst maken we een keten van unieke schakelaars. De aantallen worden hier vervangen door individuele elementen in een array
        this.bouwSchakelaarKeten(tekenKeten);

        var lowerbound = 20; // How low does the switch go below the baseline, needed to place adres afterwards
        
        var startx = 1;
        var endx;

        for (let i=0; i<tekenKeten.length; i++ ) {
            let islast: boolean = ( (i == tekenKeten.length-1) && (!this.heeftVerbruikerAlsKind()) );
            let str:string; ( {endx: startx, str: str, lowerbound: lowerbound} = tekenKeten[i].toSVGString(startx,islast) ); mySVG.data += str;
        }
        // Voor bepaalde symbolen moet wat extra ruimte rechts voorzien worden om te vermijden dat de tekening door de volgende kring loopt
        if (!this.heeftVerbruikerAlsKind()) startx += tekenKeten[tekenKeten.length-1].extraPlaatsRechts();

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = startx-2;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        
        mySVG.data += this.addAddressToSVG(mySVG,25+lowerbound,Math.max(0,lowerbound-20));
        mySVG.data += "\n";

        return(mySVG);
    }

}