import { Electro_Item } from "./Electro_Item";
import { htmlspecialchars, svgTextWidth } from "../general";
import { SVGelement } from "../SVGelement";

/** Extra length (in pixels) the busbar can be extended to the right, next to the space it already has on the left. */
export const BORD_BUSBAR_EXTENSIONS = ["0", "20", "40", "60", "80", "100", "150", "200", "300"];

export class Bord extends Electro_Item {

    erBestaatEenBordUpstream() : boolean {
        let parent = this.getParent();
        while ((parent != null) && (parent.id != 0)) {
            if (parent.props.type === "Bord") {
                return true;
            }
            parent = parent.getParent();
        }
        return false;
    }

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type             = this.getLegacyKey(mykeys,0);
        this.props.is_geaard        = this.getLegacyKey(mykeys,1);
        this.props.naam             = this.getLegacyKey(mykeys,10);
        this.props.adres            = this.getLegacyKey(mykeys,15);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Bord";
        if (this.erBestaatEenBordUpstream()) this.props.is_geaard = false; else this.props.is_geaard = true;
        this.props.naam = "";
        this.props.adres = "";
        this.props.verlenging_rechts = "0";
    }

    overrideKeys() {
        if (!BORD_BUSBAR_EXTENSIONS.includes(String(this.props.verlenging_rechts))) this.props.verlenging_rechts = "0";
    }

    allowedChilds() : Array<string> { // returns an array with the type-names of allowed childs
        return ["", "Kring", "Vrije ruimte"];
    }

    getMaxNumChilds(): number {
        return 256;
    }


    toSitPlanSVG(mirrortext: boolean = false) {

        /* suppress murrortext never used warning */ mirrortext;

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

        const boardMetadata = this.sourcelist.boards.find((board) => board.rootItemIds.includes(this.id));
        // Legacy item properties remain authoritative for visible labels so
        // migrated EDS004 documents retain their original board text.
        const boardName = this.props.naam || boardMetadata?.name || "";
        const boardLocation = this.props.adres || boardMetadata?.location || "";
        const feederDescription = boardMetadata?.feeder
            ? [boardMetadata.feeder.cableType, boardMetadata.feeder.conductorSection,
               boardMetadata.feeder.lengthMeters === undefined ? undefined : `${boardMetadata.feeder.lengthMeters} m`]
                .filter((value) => value !== undefined && value !== "")
                .join(" · ")
            : "";
        const boardLabelLines = [
            { text: boardName, prefix: "", weight: "bold", attribute: "data-distribution-board-name" },
            { text: boardLocation, prefix: "Locatie: ", weight: "normal", attribute: "data-distribution-board-location" },
            { text: feederDescription, prefix: "Voeding: ", weight: "normal", attribute: "data-distribution-board-feeder" },
        ].filter((line) => line.text !== "");
        let mintextsize = Math.max(30, ...boardLabelLines.map((line) =>
            svgTextWidth(htmlspecialchars(`${line.prefix}${line.text}`), 10, line.weight === "bold" ? 'font-weight="bold"' : "") + 13
        ));
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

        // De door de gebruiker gekozen verlenging van de balk naar rechts komt na het links-schuiven, anders wordt ze opgeslorpt
        mySVG.xright += Number(BORD_BUSBAR_EXTENSIONS.includes(String(this.props.verlenging_rechts)) ? this.props.verlenging_rechts : 0);

        // Voorzie voldoende plaats voor de lijn onderaan
        mySVG.ydown = Math.max(mySVG.ydown,1);

        // Teken de lijn onderaan
        mySVG.data += '<line x1="4" x2="' + (mySVG.xleft + mySVG.xright - 6) +
                      '" y1="' + mySVG.yup + '" y2="' + mySVG.yup + '" stroke="black" stroke-width="3" />'

        // Indien we kind zijn van een kring met meer dan 1 kind, voeg 10 pixels extra toe onderaan
        if (this.isChildOf("Kring")) {
            const parent =  this.getParent();
            if ( (parent !== null) && (parent.getNumChilds() > 1) ) {
                mySVG.ydown += 10;
                mySVG.data += `<line x1="${mySVG.xleft}" x2="${mySVG.xleft}" y1="${mySVG.yup+1}" y2="${mySVG.yup+11}" stroke="black" stroke-width="1" />`;
            }
        }

        // Voeg naam, locatie en voedingsgegevens van het bord toe.
        boardLabelLines.forEach((line, index) => {
            mySVG.data += `<text ${line.attribute}="true" x="5" y="${mySVG.yup + 13 + index * 11}" `
                       +  `style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-weight="${line.weight}" font-size="10">`
                       +  `${htmlspecialchars(line.prefix)}${htmlspecialchars(line.text)}</text>`;
        });
        
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

    /**
     * Geeft de boundary's terug van het element in het situatieplan. Deze boundary's worden gebruikt om het element te positioneren en te clippen.
     * 
     * @returns {Object} Een object met de volgende properties:
     *   - clipleft: de afstand die links wordt weggesneden op de standaard tekening van het Electro_Item. Vaak zit hier 20 nutteloze pixels waar in het eendraadschema een stukje leiding en het nummer staat.
     *   - addright: een eventuele afstand die rechts dient toegevoegd te worden, of (indien negatief) een clipping aan de rechter kant.
     *   - cliptop: zelfs als clipleft maar aan de bovenkant.
     *   - addbottom: zelfde als addright maar aan de onderkant.
     */

    getSitPlanBoundaries() {
        return {
            clipleft: 0,
            addright: 0,
            cliptop: 0,
            addbottom: 0
        }
    }

}
