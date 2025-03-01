class Bord extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.is_geaard        = this.getLegacyKey(mykeys,1);
        this.props.naam             = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Bord";
        this.props.is_geaard = true;
        this.props.naam = "";
        this.props.adres = "";
    }

    allowedChilds() : Array<string> { // returns an array with the type-names of allowed childs
        return ["", "Kring", "Vrije ruimte"];
    }

    getMaxNumChilds(): number {
        return 256;
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Naam: " + this.stringPropToHTML('naam',5) + ", "
               +  "Geaard: " + this.checkboxPropToHTML('is_geaard');

        return(output);
    }

    toSitPlanSVG(mirrortext: boolean = false) {
        //let str = this.props.naam;
        //if ((str == null) || (str.trim() == "")) {
        //    str = '';
        //}
        let minheight = 60; //Math.max(60,svgTextWidth(htmlspecialchars(str),16,'') + 20); //15 padding
        let shift = (minheight-60)/2;

        let mySVG:SVGelement = new SVGelement();
        mySVG.xleft = 0;
        mySVG.xright = 41 - 10; // the 10 is added again by another routine
        mySVG.yup = 0;
        mySVG.ydown = minheight;
        mySVG.data += `<rect y="5" x="8" height="${minheight-10}" width="24" stroke="black" stroke-width="1" fill="none" />`;
        mySVG.data += `<line y1="${minheight/2}" x1="0" y2="${minheight/2}" x2="8" stroke="black" stroke-width="1" />`;
        for (let i=0; i<5; i++) {
            mySVG.data += `<line y1="${10+shift+i*10}" x1="32" y2="${10+shift+i*10}" x2="40" stroke="black" stroke-width="1" />`;
        }
        /*mySVG.data += '<text x="' + (15) + '" ' + 'y="' + (minheight/2) + '" '
                   +  `transform="${mirrortext ? `translate(${44},0) scale(-1,1) `: ''} rotate(90 18,${(minheight/2)})" `
                   + 'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="16"' + '>'
                   + htmlspecialchars(str) + '</text>';*/

        return mySVG;
    }

    toSVG(sitplan: boolean = false, mirrortext: boolean = false) {
        let mySVG:SVGelement; // = new SVGelement();

        if (sitplan) {
            return this.toSitPlanSVG(mirrortext);
        }

        // Maak een tekening van alle kinderen
        mySVG = this.sourcelist.toSVG(this.id,"horizontal");
        if (mySVG.yup == 0) mySVG.yup = 2; // Om zeker te zijn dat de vette lijn netjes wordt getekend.

        // Voorzie 10 extra pixels rechts na de allerlaatste kring
        mySVG.xright += 10;

        // Schuif het geheel voldoende naar links om plaats te hebben voor label en eventuele aarding

        let mintextsize = Math.max(30, svgTextWidth(htmlspecialchars(this.props.naam),10,'font-weight="bold"') + 13);
        let minxleft = mintextsize + (this.props.is_geaard ? 70 : 0); //Indien geaard hebben we 70 meer nodig
        if (this.isChildOf("Aansluiting")) {
            let maxTotalSize = 145;
            if (this.getParent().props.type_kabel_voor_teller != "") maxTotalSize = maxTotalSize + 50;
            let lengthToAdd = Math.max(0,(maxTotalSize - minxleft));
            mintextsize = mintextsize + lengthToAdd;
            minxleft = minxleft + lengthToAdd;
        }
        
        if (mySVG.xleft <= minxleft) { // Minstens 100 pixels indien aarding
            mySVG.xright = mySVG.xleft + mySVG.xright - minxleft;
            mySVG.xleft = minxleft;
        }

        // Indien door het schuiven er niets rechts over blijft, voorzie minstens 10 pixels
        if (mySVG.xright <=10) mySVG.xright = 10;

        // Voorzie voldoende plaats voor de lijn onderaan
        mySVG.ydown = Math.max(mySVG.ydown,1);

        // Teken de lijn onderaan
        mySVG.data += '<line x1="4" x2="' + (mySVG.xleft + mySVG.xright - 6) +
                      '" y1="' + mySVG.yup + '" y2="' + mySVG.yup + '" stroke="black" stroke-width="3" />'

        // Voeg naam van het bord toe
        if (this.props.naam !== "")
            mySVG.data += '<text x="' + (5) + '" y="' + (mySVG.yup + 13) + '" ' 
                       +  'style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="10">' 
                       +  htmlspecialchars(this.props.naam)+'</text>';
        
        // Teken aarding onderaan
        if (this.props.is_geaard)
            mySVG.data += '<line x1="' + (mintextsize + 10) + '" y1="' + (mySVG.yup + 0) + '" x2="' + (mintextsize + 10) + '" y2="' + (mySVG.yup + 10) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 10) + '" y1="' + (mySVG.yup + 15) + '" x2="' + (mintextsize + 10) + '" y2="' + (mySVG.yup + 25) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 10) + '" y1="' + (mySVG.yup + 30) + '" x2="' + (mintextsize + 10) + '" y2="' + (mySVG.yup + 40) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 5) + '" y1="' + (mySVG.yup + 10) + '" x2="' + (mintextsize + 15) + '" y2="' + (mySVG.yup + 10) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 5) + '" y1="' + (mySVG.yup + 15) + '" x2="' + (mintextsize + 15) + '" y2="' + (mySVG.yup + 15) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 5) + '" y1="' + (mySVG.yup + 25) + '" x2="' + (mintextsize + 15) + '" y2="' + (mySVG.yup + 25) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 5) + '" y1="' + (mySVG.yup + 30) + '" x2="' + (mintextsize + 15) + '" y2="' + (mySVG.yup + 30) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 0) + '" y1="' + (mySVG.yup + 40) + '" x2="' + (mintextsize + 20) + '" y2="' + (mySVG.yup + 40) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 2.5) + '" y1="' + (mySVG.yup + 43) + '" x2="' + (mintextsize + 17.5) + '" y2="' + (mySVG.yup + 43) + '" stroke="black" />'
                       +  '<line x1="' + (mintextsize + 5) + '" y1="' + (mySVG.yup + 46) + '" x2="' + (mintextsize + 15) + '" y2="' + (mySVG.yup + 46) + '" stroke="black" />';

        return(mySVG);
    }

}