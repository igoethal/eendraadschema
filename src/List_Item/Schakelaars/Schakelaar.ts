interface drawReturnObj {
    endx: number;
    str: string;
    lowerbound: number;
}

class Schakelaar {

    type: String;
    halfwaterdicht: boolean;
    verklikkerlamp: boolean;
    signalisatielamp: boolean;
    trekschakelaar: boolean;

    constructor(type: String, halfwaterdicht: boolean=false, verklikkerlamp: boolean=false, signalisatielamp: boolean=false, trekschakelaar: boolean=false) {
        this.type = type;
        this.halfwaterdicht = halfwaterdicht;
        this.verklikkerlamp = verklikkerlamp;
        this.signalisatielamp = signalisatielamp;
        this.trekschakelaar = trekschakelaar;
    }

    schakelaarAttributentoSVGString(endx: number, isdubbel: boolean = false) {
        let outputstr:string = "";
        if (this.signalisatielamp) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
        if (this.halfwaterdicht)   outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
        if (this.verklikkerlamp)   outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />';
        if (this.trekschakelaar) {
            switch (isdubbel) {
                case false: outputstr += '<line x1="' + (endx+10.5) + '" x2="' + (endx+10.5) + '" y1="5" y2="15" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+8.5) + '" y1="15" y2="11" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+12.5) + '" y1="15" y2="11" stroke="black" />'; break;
                case true:  outputstr += '<line x1="' + (endx+8.5) + '" x2="' + (endx+8.5) + '" y1="9" y2="19" stroke="black" /><line x1="' + (endx+8.5) + '" x2="' + (endx+6.5) + '" y1="19" y2="15" stroke="black" /><line x1="' + (endx+8.5) + '" x2="' + (endx+10.5) + '" y1="19" y2="15" stroke="black" />'; break;
            }
        }
        return outputstr;
    }

    enkeltoDrawReturnObj(startx: number): drawReturnObj {
        let outputstr:string = "";
        let endx = startx + 30;

        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
                  +  '<use xlink:href="#schakelaar_enkel" x="' + endx + '" y="25" />'
                  + this.schakelaarAttributentoSVGString(endx);

        return({endx: endx, str: outputstr, lowerbound: null});
    }

    dubbeltoDrawReturnObj(startx: number): drawReturnObj {
        let outputstr:string = "";
        let endx = startx + 30;

        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
                  +  '<use xlink:href="#schakelaar_dubbel" x="' + endx + '" y="25" />'
                  + this.schakelaarAttributentoSVGString(endx,true);

        return({endx: endx, str: outputstr, lowerbound: null});
    }

    driepoligtoDrawReturnObj(startx: number): drawReturnObj {
        let outputstr:string = "";
        let endx = startx + 30;

        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
                  +  '<use xlink:href="#schakelaar_trippel" x="' + endx + '" y="25" />'
                  + this.schakelaarAttributentoSVGString(endx,true);

        return({endx: endx, str: outputstr, lowerbound: null});
    }

    dubbelaanstekingtoDrawReturnObj(startx: number): drawReturnObj {
        let outputstr:string = "";
        let endx = startx + 30;

        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
                  +  '<use xlink:href="#schakelaar_dubbelaansteking" x="' + endx + '" y="25" />'
                  + this.schakelaarAttributentoSVGString(endx);

        return({endx: endx, str: outputstr, lowerbound: null});
    }

    wissel_enkeltoDrawReturnObj(startx: number): drawReturnObj {
        let outputstr:string = "";
        let endx = startx + 30;

        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
                  +  '<use xlink:href="#schakelaar_wissel_enkel" x="' + endx + '" y="25" />'
                  + this.schakelaarAttributentoSVGString(endx);

        return({endx: endx, str: outputstr, lowerbound: null});
    }

    wissel_dubbeltoDrawReturnObj(startx: number): drawReturnObj {
        let outputstr:string = "";
        let endx = startx + 30;

        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
                  +  '<use xlink:href="#schakelaar_wissel_dubbel" x="' + endx + '" y="25" />'
                  + this.schakelaarAttributentoSVGString(endx,true);

        return({endx: endx, str: outputstr, lowerbound: null});
    }

    kruis_enkeltoDrawReturnObj(startx: number): drawReturnObj {
        let outputstr:string = "";
        let endx = startx + 30;

        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
                  +  '<use xlink:href="#schakelaar_kruis_enkel" x="' + endx + '" y="25" />'
                  + this.schakelaarAttributentoSVGString(endx);

        return({endx: endx, str: outputstr, lowerbound: null});
    }

    dimschakelaartoDrawReturnObj(startx: number): drawReturnObj {
        let outputstr:string = "";
        let endx = startx + 30;

        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
                  +  '<use xlink:href="#schakelaar_enkel_dim" x="' + endx + '" y="25" />'
                  + this.schakelaarAttributentoSVGString(endx);

        return({endx: endx, str: outputstr, lowerbound: null});
    }

    dimschakelaarWisseltoDrawReturnObj(startx: number): drawReturnObj {
        let outputstr:string = "";
        let endx = startx + 30;

        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
                  +  '<use xlink:href="#schakelaar_wissel_dim" x="' + endx + '" y="25" />'
                  + this.schakelaarAttributentoSVGString(endx);

        return({endx: endx, str: outputstr, lowerbound: null});
    }

    bewegingsschakelaartoDrawReturnObj(startx: number): drawReturnObj {
        let outputstr:string = "";
        let endx = startx + 20;

        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
                  +  '<use xlink:href="#relais" x="' + endx + '" y="16" />'
                  +  '<use xlink:href="#moving_man" x="' + (endx + 1.5) + '" y="11" />'
                  +  '<use xlink:href="#detectie_klein" x="' + (endx + 23) +'" y="13"></use>'
                  +  '<line x1="' + endx + '" x2="' + endx + '" y1="29" y2="43" fill="none" style="stroke:black" />'
                  +  '<line x1="' + (endx+40) + '" x2="' + (endx+40) + '" y1="29" y2="43" fill="none" style="stroke:black" />'
                  +  '<line x1="' + (endx) + '" x2="' + (endx+40) + '" y1="43" y2="43" fill="none" style="stroke:black" />';

        return({endx: endx, str: outputstr, lowerbound: null});        
    }

    rolluikschakelaartoDrawReturnObj(startx: number): drawReturnObj {
        let outputstr:string = "";
        let endx = startx + 30;

        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
                  +  '<use xlink:href="#schakelaar_rolluik" x="' + endx + '" y="25" />';

        if (this.halfwaterdicht) outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';

        return({endx: endx, str: outputstr, lowerbound: null});        
    }

    defaulttoDrawReturnObj(startx: number, symbol: string): drawReturnObj {
        let outputstr:string = "";
        let endx = startx + 20;

        outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />'
                  +  '<use xlink:href="' + symbol + '" x="' + endx + '" y="25" />';

        return({endx: endx, str: outputstr, lowerbound: null});        
    }

    extraPlaatsRechts() : number {
        if ( (this.type == "enkel") || (this.type == "dubbel") || (this.type == "driepolig") || (this.type == "dubbelaansteking") ||
             (this.type == "wissel_enkel") || (this.type == "wissel_dubbel") || (this.type == "kruis_enkel") || (this.type == "dimschakelaar") ||
             (this.type == "dimschakelaar_wissel") ) return 10;
        else if (this.type == "rolluikschakelaar")   return 7;
        else                                         return 0;
    }

    toSVGString(startx: number, last: boolean): drawReturnObj {
        let outputstr:string = "";
        let endx;
        let lowerbound = 20;
        switch(this.type) {
            case "enkel":
                ( {endx: endx, str: outputstr} = (this.enkeltoDrawReturnObj(startx)) );
                endx += 5;
                break;
            case "dubbel":
                ( {endx: endx, str: outputstr} = (this.dubbeltoDrawReturnObj(startx)) );
                endx += 5;
                break;
            case "driepolig":
                ( {endx: endx, str: outputstr} = (this.driepoligtoDrawReturnObj(startx)) );
                endx += 5;
                break;
            case "dubbelaansteking":
                ( {endx: endx, str: outputstr} = (this.dubbelaanstekingtoDrawReturnObj(startx)) );
                endx += 5;
                break;
            case "wissel_enkel":
                ( {endx: endx, str: outputstr} = (this.wissel_enkeltoDrawReturnObj(startx)) );
                endx += 5;
                lowerbound = Math.max(lowerbound,35);
                break;
            case "wissel_dubbel":
                ( {endx: endx, str: outputstr} = (this.wissel_dubbeltoDrawReturnObj(startx)) );
                endx += 5;
                lowerbound = Math.max(lowerbound,35);
                break;            
            case "kruis_enkel":
                ( {endx: endx, str: outputstr} = (this.kruis_enkeltoDrawReturnObj(startx)) );
                endx += 5;
                lowerbound = Math.max(lowerbound,35);
                break;
            case "dimschakelaar":
                ( {endx: endx, str: outputstr} = (this.dimschakelaartoDrawReturnObj(startx)) );
                endx += 5;
                break;
            case "dimschakelaar_wissel":
                ( {endx: endx, str: outputstr} = (this.dimschakelaarWisseltoDrawReturnObj(startx)) );
                endx += 5;
                lowerbound = Math.max(lowerbound,35);
                break;                      
            case "bewegingsschakelaar":
                ( {endx: endx, str: outputstr} = (this.bewegingsschakelaartoDrawReturnObj(startx)) );
                endx += 40;
                lowerbound = Math.max(lowerbound,30);
                break;
            case "rolluikschakelaar":
                ( {endx: endx, str: outputstr} = (this.rolluikschakelaartoDrawReturnObj(startx)) );
                endx += 8;
                lowerbound = Math.max(lowerbound,25);
                break;    
            case "schakelaar": 
                ( {endx: endx, str: outputstr} = (this.defaulttoDrawReturnObj(startx,'#schakelaar')) ); 
                endx += 40; 
                break;
            case "schemerschakelaar": 
                ( {endx: endx, str: outputstr} = (this.defaulttoDrawReturnObj(startx,'#schemerschakelaar')) ); 
                endx += 40; 
                break;
            case "teleruptor": 
                ( {endx: endx, str: outputstr} = (this.defaulttoDrawReturnObj(startx,'#teleruptor')) ); 
                endx += 40; 
                lowerbound = Math.max(lowerbound,30);
                break;
            case "dimmer": 
                ( {endx: endx, str: outputstr} = (this.defaulttoDrawReturnObj(startx,'#dimmer')) ); 
                endx += 40; 
                lowerbound = Math.max(lowerbound,30);
                break;
            case "relais": 
                ( {endx: endx, str: outputstr} = (this.defaulttoDrawReturnObj(startx,'#relais')) ); 
                endx += 40; 
                lowerbound = Math.max(lowerbound,30);
                break;
            case "minuterie": 
                ( {endx: endx, str: outputstr} = (this.defaulttoDrawReturnObj(startx,'#minuterie')) ); 
                endx += 40; 
                lowerbound = Math.max(lowerbound,30);
                break;
            case "thermostaat": 
                ( {endx: endx, str: outputstr} = (this.defaulttoDrawReturnObj(startx,'#thermostaat')) ); 
                endx += 40; 
                lowerbound = Math.max(lowerbound,30);
                break;
            case "tijdschakelaar": 
                ( {endx: endx, str: outputstr} = (this.defaulttoDrawReturnObj(startx,'#tijdschakelaar')) ); 
                endx += 40; 
                lowerbound = Math.max(lowerbound,30);
                break;                
            default:
                endx = 30; //Indien type niet herkend wordt minstens deze variabele definieren
        }

        return({endx: endx, str: outputstr, lowerbound: lowerbound});
    }

}