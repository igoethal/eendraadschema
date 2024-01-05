class Schakelaars extends Electro_Item {

    tekenKeten: Array<Schakelaar>; // Een lijst van elementen die we willen tekenen
    
    constructor(mylist: Hierarchical_List) { 
        super(mylist);
        this.tekenKeten = [];
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
            case "enkelpolig":  this.props.aantal_schakelaars = String(Math.min(Number(this.props.aantal_schakelaars),5)); break;
            case "dubbelpolig": this.props.aantal_schakelaars = String(Math.min(Number(this.props.aantal_schakelaars),2)); break;
            default:            this.props.aantal_schakelaars = "1"; break;
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
        output += ", " + this.selectPropToHTML('type_schakelaar',["enkelpolig", "dubbelpolig", "driepolig", "dubbelaansteking", "wissel_enkel", "wissel_dubbel", "kruis_enkel", "---", "schakelaar", "dimschakelaar", "dimschakelaar wissel", "bewegingsschakelaar", "schemerschakelaar", "---", "teleruptor", "relais", "dimmer", "tijdschakelaar", "minuterie", "thermostaat", "rolluikschakelaar"]);

        if (this.kanHalfwaterdichtZijn())       output += ", Halfwaterdicht: " + this.checkboxPropToHTML('is_halfwaterdicht');
        if (this.kanVerklikkerlampjeHebben())   output += ", Verklikkerlampje: " + this.checkboxPropToHTML('heeft_verklikkerlampje');
        if (this.kanSignalisatielampjeHebben()) output += ", Signalisatielampje: " + this.checkboxPropToHTML('heeft_signalisatielampje');
        if (this.kanTrekschakelaarHebben())     output += ", Trekschakelaar: " + this.checkboxPropToHTML('is_trekschakelaar');
        
        switch (this.props.type_schakelaar) {
            case "enkelpolig":  output += ", Aantal schakelaars: " + this.selectPropToHTML('aantal_schakelaars',["1","2","3","4","5"]); break;
            case "dubbelpolig": output += ", Aantal schakelaars: " + this.selectPropToHTML('aantal_schakelaars',["1","2"]); break;
        }

        output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);
        return(output);
    }

    bouwSchakelaarKeten() {
        this.tekenKeten = [];        
        switch (this.props.type_schakelaar) {
            case "wissel_enkel":         this.tekenKeten.push(new Schakelaar("wissel_enkel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar)); break;
            case "wissel_dubbel":        this.tekenKeten.push(new Schakelaar("wissel_dubbel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar)); break;
            case "kruis_enkel":          this.tekenKeten.push(new Schakelaar("kruis_enkel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar)); break;
            case "teleruptor":           this.tekenKeten.push(new Schakelaar("teleruptor")); break;
            case "bewegingsschakelaar":  this.tekenKeten.push(new Schakelaar("bewegingsschakelaar")); break;
            case "schemerschakelaar":    this.tekenKeten.push(new Schakelaar("schemerschakelaar")); break;
            case "schakelaar":           this.tekenKeten.push(new Schakelaar("schakelaar")); break;
            case "dimmer":               this.tekenKeten.push(new Schakelaar("dimmer")); break;
            case "relais":               this.tekenKeten.push(new Schakelaar("relais")); break;
            case "minuterie":            this.tekenKeten.push(new Schakelaar("minuterie")); break;
            case "thermostaat":          this.tekenKeten.push(new Schakelaar("thermostaat")); break;
            case "tijdschakelaar":       this.tekenKeten.push(new Schakelaar("tijdschakelaar")); break;
            case "rolluikschakelaar":    this.tekenKeten.push(new Schakelaar("rolluikschakelaar",this.props.is_halfwaterdicht)); break;
            case "dubbelaansteking":     this.tekenKeten.push(new Schakelaar("dubbelaansteking",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar)); break;
            case "dimschakelaar":        this.tekenKeten.push(new Schakelaar("dimschakelaar",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,false)); break;
            case "dimschakelaar wissel": this.tekenKeten.push(new Schakelaar("dimschakelaar_wissel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,false)); break;
            case "enkelpolig":
                if (Number(this.props.aantal_schakelaars) == 1) this.tekenKeten.push(new Schakelaar("enkel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar));
                if (Number(this.props.aantal_schakelaars) > 1) {
                    this.tekenKeten.push(new Schakelaar("wissel_enkel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar));
                    for (let i=2; i<Number(this.props.aantal_schakelaars); ++i) {
                        this.tekenKeten.push(new Schakelaar("kruis_enkel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar)); }
                    this.tekenKeten.push(new Schakelaar("wissel_enkel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar)); }
                break;
            case "dubbelpolig":
                if (Number(this.props.aantal_schakelaars) == 1) this.tekenKeten.push(new Schakelaar("dubbel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar));
                if (Number(this.props.aantal_schakelaars) > 1) {
                    this.tekenKeten.push(new Schakelaar("wissel_dubbel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar));
                    this.tekenKeten.push(new Schakelaar("wissel_dubbel",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar));
                }  
                break;
            case "driepolig":
                this.tekenKeten.push(new Schakelaar("driepolig",this.props.is_halfwaterdicht,this.props.heeft_verklikkerlampje,this.props.heeft_signalisatielampje,this.props.is_trekschakelaar));
                break;
        }
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();

        // Eerst maken we een keten van unieke schakelaars. De aantallen worden hier vervangen door individuele elementen in een array
        this.bouwSchakelaarKeten();

        var lowerbound = 20; // How low does the switch go below the baseline, needed to place adres afterwards
        
        var startx = 1;
        var endx;

        for (let i=0; i<this.tekenKeten.length; i++ ) {
            let islast: boolean = ( (i == this.tekenKeten.length-1) && (!this.heeftVerbruikerAlsKind()) );
            let str:string; ( {endx: startx, str: str, lowerbound: lowerbound} = this.tekenKeten[i].toSVGString(startx,islast) ); mySVG.data += str;
        }
        // Voor bepaalde symbolen moet wat extra ruimte rechts voorzien worden om te vermijden dat de tekening door de volgende kring loopt
        if (!this.heeftVerbruikerAlsKind()) startx += this.tekenKeten[this.tekenKeten.length-1].extraPlaatsRechts();

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = startx-2;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        
        mySVG.data += this.addAddressToSVG(mySVG,25+lowerbound,Math.max(0,lowerbound-20));
        mySVG.data += "\n";

        return(mySVG);
    }

}