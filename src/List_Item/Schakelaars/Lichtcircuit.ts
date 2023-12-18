class Lichtcircuit extends Schakelaars {
    
    constructor(mylist: Hierarchical_List) { 
        super(mylist); //Schakelaars
    }

    resetKeys() {
        super.resetKeys(); //Schakelaars
        this.keys[0][2] = "Lichtcircuit"; // This is rather a formality as we should already have this at this stage
        this.keys[13][2] = "1";           // Per default 1 lichtpunt
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

        output += ", Aantal lichtpunten: " + this.selectToHTML(13,["0","1","2","3","4","5","6","7","8","9","10"]);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();

        // Eerst maken we een keten van unieke schakelaars. De aantallen worden hier vervangen door individuele elementen in een array
        this.bouwSchakelaarKeten();

        var lowerbound = 20; // How low does the switch go below the baseline, needed to place adres afterwards

        var startx = 1;
        var endx;

        // Teken de schakelaars
        for (let i=0; i<this.tekenKeten.length; i++ ) {
            let islast: boolean = ( (i == this.tekenKeten.length-1) && (!this.hasChild()) );
            let str:string; ( {endx: startx, str: str, lowerbound: lowerbound} = this.tekenKeten[i].toSVGString(startx,islast) ); mySVG.data += str;
        }

        if (this.keys[13][2] >= 1) { //1 of meerdere lampen
            // Teken de lamp
            endx = startx + 30;
            mySVG.data += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
                    +  '<use xlink:href="#lamp" x="' + endx + '" y="25" />';

            // Teken aantal lampen en symbool 'h' voor halfwaterdicht
            let print_str_upper = ""; //string om bovenaan te plaatsen
            if (this.keys[20][2]) {
                print_str_upper = "h";
                if (parseInt(this.keys[13][2]) > 1) print_str_upper += ", x" + this.keys[13][2]; // Meer dan 1 lamp
            } else if (parseInt(this.keys[13][2]) > 1) {
                print_str_upper = "x" + this.keys[13][2]; }

            if (print_str_upper != "") mySVG.data += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(print_str_upper) + '</text>';

            // Teken een leiding achter de lamp indien er nog kinderen zijn
            if (this.hasChild()) mySVG.data += '<line x1="'+endx+'" y1="25" x2="'+(endx+10)+'" y2="25" stroke="black" />';
                
            // Bepaal finale Bounding Box om het geheel te tekenen
            startx = endx + 10;
            lowerbound = Math.max(lowerbound,29);
        } else { //Geen lampen
            // Voor bepaalde symbolen moet wat extra ruimte rechts voorzien worden om te vermijden dat de tekening door de volgende kring loopt
            if (!this.hasChild()) startx += this.tekenKeten[this.tekenKeten.length-1].extraPlaatsRechts();
        }    

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = startx-2;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data += this.addAddress(mySVG,25+lowerbound,Math.max(0,lowerbound-20));
        mySVG.data += "\n";

        return(mySVG);
    }

}