import { htmlspecialchars } from "../../general.js";
import { SVGelement } from "../../SVGelement";
import { SVGSymbols } from "../../SVGSymbols";
import { Lichtpunt } from "../Lichtpunt";
import { Schakelaar } from "./Schakelaar";
import { Schakelaars } from "./Schakelaars.js";

export class Lichtcircuit extends Schakelaars {

    resetProps() {
        super.resetProps(); //Schakelaars
        this.props.type = "Lichtcircuit"; // This is rather a formality as we should already have this at this stage
        this.props.aantal_lichtpunten = "1";           // Per default 1 lichtpunt
    }

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        super.convertLegacyKeys(mykeys);
        this.props.aantal_lichtpunten = this.getLegacyKey(mykeys,13);
    } 

    toHTML(mode: string) {
        this.overrideKeys();
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;" + this.nrToHtml();
        output += this.selectPropToHTML('type_schakelaar',["enkelpolig", "dubbelpolig", "driepolig", "dubbelaansteking", "wissel_enkel", "wissel_dubbel", "kruis_enkel", "---", "schakelaar", "dimschakelaar", "dimschakelaar wissel", "bewegingsschakelaar", "schemerschakelaar", "---", "teleruptor", "relais", "dimmer", "tijdschakelaar", "minuterie", "thermostaat", "rolluikschakelaar"]);

        if (this.kanHalfwaterdichtZijn())       output += ", Halfwaterdicht: " + this.checkboxPropToHTML('is_halfwaterdicht');
        if (this.kanVerklikkerlampjeHebben())   output += ", Verklikkerlampje: " + this.checkboxPropToHTML('heeft_verklikkerlampje');
        if (this.kanSignalisatielampjeHebben()) output += ", Signalisatielampje: " + this.checkboxPropToHTML('heeft_signalisatielampje');
        if (this.kanTrekschakelaarHebben())     output += ", Trekschakelaar: " + this.checkboxPropToHTML('is_trekschakelaar');
        
        switch (this.props.type_schakelaar) {
            case "enkelpolig":  
                if (this.props.aantal_schakelaars == 0) {
                    output += ", Aantal schakelaars: " + this.selectPropToHTML('aantal_schakelaars',["0", "1","2","3","4","5"]) 
                           +  '<span style="color: red;"> Compatibiliteitsmodus, kies aantal schakelaars verschillend van 0 of gebruik element lichtpunt</span>';
                } else {
                    output += ", Aantal schakelaars: " + this.selectPropToHTML('aantal_schakelaars',["1","2","3","4","5"]); }
                break;
            case "dubbelpolig": 
                if (this.props.aantal_schakelaars == 0) {
                    output += ", Aantal schakelaars: " + this.selectPropToHTML('aantal_schakelaars',["0","1","2"])
                           +  '<span style="color: red;"> Compatibiliteitsmodus, kies aantal schakelaars verschillend van 0 of gebruik element lichtpunt</span>';
                } else {
                    output += ", Aantal schakelaars: " + this.selectPropToHTML('aantal_schakelaars',["1","2"]); }
                break;
        }

        output += ", Aantal lichtpunten: " + this.selectPropToHTML('aantal_lichtpunten',["0","1","2","3","4","5","6","7","8","9","10"]);
        output += ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        output += this.toHTMLFooter();

        return(output);
    }

    countExpandableElements(): number {
        let countExpandableElements = (this.props.aantal_lichtpunten == "0") ? 0 : 1;
        switch (this.props.type_schakelaar) {
            case "enkelpolig": case "dubbelpolig":
                countExpandableElements += (+this.props.aantal_schakelaars);
                break;
            default:
                countExpandableElements += 1;
        }
        return countExpandableElements;
    }

    isExpandable() {
        return this.countExpandableElements() > 1;
    }

    expand() {

        //Nieuwe schakelaars maken, alle eigenschappen kopieren behalve type en aantal_lichtpunten
        //Het adres nemen we over van het this element
        let schakelaars = new Schakelaars(this.sourcelist);
        const {type, aantal_lichtpunten, ...rest} = this.props; 
        Object.assign(schakelaars.props, rest);
        schakelaars.props.adres = this.props.adres;

        if (+(this.props.aantal_lichtpunten) > 0) { // Er is minstens 1 lichtpunt

            // Eerst schakelaars in het schema hangen vlak voor het this element zodat ze een id krijgen
            window.global_structure.insertItemBeforeId(schakelaars,this.id); 

            // Dan het this element door een nieuw lichtpunt vervangen
            let lichtpunt = new Lichtpunt(this.sourcelist);
            lichtpunt.props.aantal = this.props.aantal_lichtpunten;
            lichtpunt.props.is_halfwaterdicht = this.props.is_halfwaterdicht;
            lichtpunt.id = this.id;
            if (this.getParent().props.type == "Meerdere verbruikers") {
                lichtpunt.parent = this.getParent().id;
            } else {
                lichtpunt.parent = schakelaars.id;
            }
            let ordinal = window.global_structure.getOrdinalById(this.id); // Deze kan hier pas komen want de ordinal is gewijzigd door het invoegen van de schakelaars
            if (ordinal !== null) {
                window.global_structure.data[ordinal] = lichtpunt;
            } else {
                console.error("Ordinal is null, cannot assign lichtpunt.");
            }

        } else { // enkel schakelaars

            // Het this element door de schakelaars vervangen
            schakelaars.id = this.id;
            schakelaars.parent = this.getParent().id;
            let ordinal = window.global_structure.getOrdinalById(this.id);
            if (ordinal !== null) {
                window.global_structure.data[ordinal] = schakelaars;
            } else {
                console.error("Ordinal is null, cannot assign schakelaars.");
            }

        }
        
        // schakelaars uitpakken in elementen
        schakelaars.expand();
    }

    toSVG(sitplan: boolean = false, mirrortext: boolean = false) {
        let mySVG:SVGelement = new SVGelement();
        let tekenKeten: Array<Schakelaar> = [];

        // Eerst maken we een keten van unieke schakelaars. De aantallen worden hier vervangen door individuele elementen in een array
        this.bouwSchakelaarKeten(tekenKeten);

        var lowerbound = 20; // How low does the switch go below the baseline, needed to place adres afterwards

        var startx = 1;
        var endx;

        // Teken de schakelaars
        for (let i=0; i<tekenKeten.length; i++ ) {
            let islast: boolean = ( (i == tekenKeten.length-1) && (!this.heeftVerbruikerAlsKind()) );
            let str:string; ( {endx: startx, str: str, lowerbound: lowerbound} = tekenKeten[i].toSVGString(startx,islast,sitplan,mirrortext) ); mySVG.data += str;
        }

        if (this.props.aantal_lichtpunten >= 1) { //1 of meerdere lampen
            // Teken de lamp
            endx = startx + 29;
            
            SVGSymbols.addSymbol('lamp');
            mySVG.data += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
                    +  '<use xlink:href="#lamp" x="' + endx + '" y="25" />';

            // Teken aantal lampen en symbool 'h' voor halfwaterdicht
            let print_str_upper = ""; //string om bovenaan te plaatsen
            if (this.props.is_halfwaterdicht) {
                print_str_upper = "h";
                if (parseInt(this.props.aantal_lichtpunten) > 1) print_str_upper += ", x" + this.props.aantal_lichtpunten; // Meer dan 1 lamp
            } else if (parseInt(this.props.aantal_lichtpunten) > 1) {
                print_str_upper = "x" + this.props.aantal_lichtpunten; }

            if (print_str_upper != "") {
                let textoptions = 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"';
                if (mirrortext==false)
                    mySVG.data += `<text x="${endx}" y="10" ${textoptions}>${htmlspecialchars(print_str_upper)}</text>`;
                else
                    mySVG.data += `<text transform="scale(-1,1) translate(${-2*endx},0)" x="${endx}" y="10" ${textoptions}>${htmlspecialchars(print_str_upper)}</text>`;
            }

            // Teken een leiding achter de lamp indien er nog kinderen zijn
            endx++;
            if (this.heeftVerbruikerAlsKind()) mySVG.data += '<line x1="'+endx+'" y1="25" x2="'+(endx+10)+'" y2="25" stroke="black" />';
                
            // Bepaal finale Bounding Box om het geheel te tekenen
            startx = endx + 10;
            lowerbound = Math.max(lowerbound,29);
        } else { //Geen lampen
            // Voor bepaalde symbolen moet wat extra ruimte rechts voorzien worden om te vermijden dat de tekening door de volgende kring loopt
            if ((!this.heeftVerbruikerAlsKind() || sitplan) && (tekenKeten.length>0)) {
                let extra = tekenKeten[tekenKeten.length-1].extraPlaatsRechts();
                if (sitplan) extra = Math.max(0,extra - 5);
                startx += extra;
            }
        }    

        mySVG.xleft = 1; // foresee at least some space for the conductor
        mySVG.xright = startx-2;
        mySVG.yup = 25;
        mySVG.ydown = 25;

        mySVG.data += (sitplan? '' : this.addAddressToSVG(mySVG,25+lowerbound,Math.max(0,lowerbound-20)));

        return(mySVG);
    }

}