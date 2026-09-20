import { Hierarchical_List } from "../Hierarchical_List";
import { SVGelement } from "../SVGelement";

export class List_Item {

    // -- Publieke variabelen --

    id: number;                    // id van dit element 
    parent: number;                // id van de ouder
    indent: number;                // inspring-level
    collapsed: Boolean;            // ingeklapt of uitgeklapt.  True is ingeklapt.
    sourcelist: Hierarchical_List; //reference to the hierarchical list that the list-item is a member of

    props: any; // We willen deze gebruiken als een Object waar vrij zaken aan toegevoegd kunnen worden

    // -- Constructor --

    constructor(mylist: Hierarchical_List) {
        this.id = 0;            //undefined
        this.parent = 0;        //no parent
        this.indent = 0;        //at root note, no parent
        this.collapsed = false; //at the start, nothingh is collapsed
        this.props = {};        // Lege properties
        this.sourcelist = mylist;
    }

    // -- Initialisatie van properties --

    resetProps() { this.props = {}; }

    // -- Default maximum aantal kinderen ==

    getMaxNumChilds() : number {
        return(2^16);
    }

    // -- Check of het item actief is --

    isActief() : Boolean {
        let ordinal = this.sourcelist.getOrdinalById(this.id);
        if (ordinal === null) return false; // This should never happen, but just in case
        return(this.sourcelist.active[ordinal]);   
    }

    // -- Retourneer ouder-item --

    getParent() {
        let ordinal = this.sourcelist.getOrdinalById(this.parent);
        if (ordinal === null) return null; // If parent is not found, return null

        let returnval = this.sourcelist.data[ordinal];
        if (returnval === undefined) returnval = null; // If parent is not found, return null
        
        return returnval;
    }

    // -- Editeren van een string --


    // -- Editeren van een checkbox --


    // -- Editeren van een select box --


    // -- Genereer HTML code voor de boom-editor --


    toSVG() {
        let mySVG:SVGelement = new SVGelement();
        return(mySVG);
    }
}
