class Schakelaars extends Electro_Item {

    tekenKeten: Array<Schakelaar>; // Een lijst van elementen die we willen tekenen
    
    constructor(mylist: Hierarchical_List) { 
        super(mylist); 
        this.tekenKeten = [];
    }

    resetKeys() {
        this.clearKeys();
        this.keys[0][2] = "Schakelaars"; // This is rather a formality as we should already have this at this stage
        this.keys[4][2] = "1";           // Per default 1 schakelaar
        this.keys[5][2] = "enkelpolig";  // Per default enkelpolig
        this.keys[15][2] = "";           // Set Adres/tekst to "" when the item is cleared
        this.keys[19][2] = false;        // Per default geen signalisatielampje
        this.keys[20][2] = false;        // Per default niet halfwaterdicht
        this.keys[21][2] = false;        // Per default geen verklikkerslampje
        this.keys[25][2] = false;        // Per default geen trekschakelaar
    }

    kanHalfwaterdichtZijn() : boolean {
        return ( (this.keys[5][2] == "enkelpolig") || (this.keys[5][2] == "dubbelpolig") || (this.keys[5][2] == "driepolig") || (this.keys[5][2] == "kruis_enkel") ||
                 (this.keys[5][2] == "dubbelaansteking") || (this.keys[5][2] == "wissel_enkel") || (this.keys[5][2] == "wissel_dubbel") || (this.keys[5][2] == "dubbel") ||
                 (this.keys[5][2] == "dimschakelaar") || (this.keys[5][2] == "dimschakelaar wissel") || (this.keys[5][2] == "rolluikschakelaar") );
    }

    kanVerklikkerlampjeHebben() : boolean {
        return ( (this.keys[5][2] == "enkelpolig") || (this.keys[5][2] == "dubbelpolig") || (this.keys[5][2] == "driepolig") || (this.keys[5][2] == "kruis_enkel") ||
                 (this.keys[5][2] == "dubbelaansteking") || (this.keys[5][2] == "wissel_enkel") || (this.keys[5][2] == "wissel_dubbel") || (this.keys[5][2] == "dubbel") ||
                 (this.keys[5][2] == "dimschakelaar") || (this.keys[5][2] == "dimschakelaar wissel") )
    }

    kanSignalisatielampjeHebben() : boolean {
        return this.kanVerklikkerlampjeHebben();
    }

    kanTrekschakelaarHebben() : boolean {
        return ( (this.keys[5][2] == "enkelpolig") || (this.keys[5][2] == "dubbelpolig") || (this.keys[5][2] == "driepolig") || (this.keys[5][2] == "kruis_enkel") ||
                 (this.keys[5][2] == "dubbelaansteking") || (this.keys[5][2] == "wissel_enkel") || (this.keys[5][2] == "wissel_dubbel") || (this.keys[5][2] == "dubbel") )
    }

    overrideKeys() {
        switch (this.keys[5][2]) {
            case "enkelpolig":  this.keys[4][2] = String(Math.min(Number(this.keys[4][2]),5)); break;
            case "dubbelpolig": this.keys[4][2] = String(Math.min(Number(this.keys[4][2]),2)); break;
            default:            this.keys[4][2] = "1"; break;
        }
        if (!this.kanHalfwaterdichtZijn) this.keys[20][2] = false;
        if (!this.kanVerklikkerlampjeHebben) this.keys[21][2] = false;
        if (!this.kanSignalisatielampjeHebben) this.keys[19][2] = false;
        if (!this.kanTrekschakelaarHebben) this.keys[25][2] = false;
    }

    toHTML(mode: string, Parent?: List_Item) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode, Parent);

        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", " + this.selectToHTML(5,["enkelpolig", "dubbelpolig", "driepolig", "dubbelaansteking", "wissel_enkel", "wissel_dubbel", "kruis_enkel", "---", "schakelaar", "dimschakelaar", "dimschakelaar wissel", "bewegingsschakelaar", "schemerschakelaar", "---", "teleruptor", "relais", "dimmer", "tijdschakelaar", "minuterie", "thermostaat", "rolluikschakelaar"]);

        if (this.kanHalfwaterdichtZijn())       output += ", Halfwaterdicht: " + this.checkboxToHTML(20);
        if (this.kanVerklikkerlampjeHebben())   output += ", Verklikkerlampje: " + this.checkboxToHTML(21);
        if (this.kanSignalisatielampjeHebben()) output += ", Signalisatielampje: " + this.checkboxToHTML(19);
        if (this.kanTrekschakelaarHebben())     output += ", Trekschakelaar: " + this.checkboxToHTML(25);
        
        switch (this.keys[5][2]) {
            case "enkelpolig":  output += ", Aantal schakelaars: " + this.selectToHTML(4,["1","2","3","4","5"]); break;
            case "dubbelpolig": output += ", Aantal schakelaars: " + this.selectToHTML(4,["1","2"]); break;
        }

        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        return(output);
    }

    bouwSchakelaarKeten() {
        this.tekenKeten = [];        
        switch (this.keys[5][2]) {
            case "wissel_enkel":         this.tekenKeten.push(new Schakelaar("wissel_enkel",this.keys[20][2],this.keys[21][2],this.keys[19][2],this.keys[25][2])); break;
            case "wissel_dubbel":        this.tekenKeten.push(new Schakelaar("wissel_dubbel",this.keys[20][2],this.keys[21][2],this.keys[19][2],this.keys[25][2])); break;
            case "kruis_enkel":          this.tekenKeten.push(new Schakelaar("kruis_enkel",this.keys[20][2],this.keys[21][2],this.keys[19][2],this.keys[25][2])); break;
            case "teleruptor":           this.tekenKeten.push(new Schakelaar("teleruptor")); break;
            case "bewegingsschakelaar":  this.tekenKeten.push(new Schakelaar("bewegingsschakelaar")); break;
            case "schemerschakelaar":    this.tekenKeten.push(new Schakelaar("schemerschakelaar")); break;
            case "schakelaar":           this.tekenKeten.push(new Schakelaar("schakelaar")); break;
            case "dimmer":               this.tekenKeten.push(new Schakelaar("dimmer")); break;
            case "relais":               this.tekenKeten.push(new Schakelaar("relais")); break;
            case "minuterie":            this.tekenKeten.push(new Schakelaar("minuterie")); break;
            case "thermostaat":          this.tekenKeten.push(new Schakelaar("thermostaat")); break;
            case "tijdschakelaar":       this.tekenKeten.push(new Schakelaar("tijdschakelaar")); break;
            case "rolluikschakelaar":    this.tekenKeten.push(new Schakelaar("rolluikschakelaar",this.keys[20][2])); break;
            case "dubbelaansteking":     this.tekenKeten.push(new Schakelaar("dubbelaansteking",this.keys[20][2],this.keys[21][2],this.keys[19][2],this.keys[25][2])); break;
            case "dimschakelaar":        this.tekenKeten.push(new Schakelaar("dimschakelaar",this.keys[20][2],this.keys[21][2],this.keys[19][2],false)); break;
            case "dimschakelaar wissel": this.tekenKeten.push(new Schakelaar("dimschakelaar_wissel",this.keys[20][2],this.keys[21][2],this.keys[19][2],false)); break;
            case "enkelpolig":
                if (Number(this.keys[4][2]) == 1) this.tekenKeten.push(new Schakelaar("enkel",this.keys[20][2],this.keys[21][2],this.keys[19][2],this.keys[25][2]));
                if (Number(this.keys[4][2]) > 1) {
                    this.tekenKeten.push(new Schakelaar("wissel_enkel",this.keys[20][2],this.keys[21][2],this.keys[19][2],this.keys[25][2]));
                    for (let i=2; i<Number(this.keys[4][2]); ++i) {
                        this.tekenKeten.push(new Schakelaar("kruis_enkel",this.keys[20][2],this.keys[21][2],this.keys[19][2],this.keys[25][2])); }
                    this.tekenKeten.push(new Schakelaar("wissel_enkel",this.keys[20][2],this.keys[21][2],this.keys[19][2],this.keys[25][2])); }
                break;
            case "dubbelpolig":
                if (Number(this.keys[4][2]) == 1) this.tekenKeten.push(new Schakelaar("dubbel",this.keys[20][2],this.keys[21][2],this.keys[19][2],this.keys[25][2]));
                if (Number(this.keys[4][2]) > 1) {
                    this.tekenKeten.push(new Schakelaar("wissel_dubbel",this.keys[20][2],this.keys[21][2],this.keys[19][2],this.keys[25][2]));
                    this.tekenKeten.push(new Schakelaar("wissel_dubbel",this.keys[20][2],this.keys[21][2],this.keys[19][2],this.keys[25][2]));
                }  
                break;
            case "driepolig":
                this.tekenKeten.push(new Schakelaar("driepolig",this.keys[20][2],this.keys[21][2],this.keys[19][2],this.keys[25][2]));
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
            let islast: boolean = ( (i == this.tekenKeten.length-1) && (!this.hasChild()) );
            let str:string; ( {endx: startx, str: str, lowerbound: lowerbound} = this.tekenKeten[i].toSVGString(startx,islast) ); mySVG.data += str;
        }
        // Voor bepaalde symbolen moet wat extra ruimte rechts voorzien worden om te vermijden dat de tekening door de volgende kring loopt
        if (!this.hasChild()) startx += this.tekenKeten[this.tekenKeten.length-1].extraPlaatsRechts();

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = startx-2;
        mySVG.yup = 25;
        mySVG.ydown = 25;
        
        mySVG.data += this.addAddress(mySVG,25+lowerbound,Math.max(0,lowerbound-20));
        mySVG.data += "\n";

        return(mySVG);
    }

}