class List_Item {

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

    // -- Tel aantal kinderen --

    getNumChilds() : number {
        let numChilds = 0;
            for (let i=0; i<this.sourcelist.data.length; ++i) {
                if ((this.sourcelist.data[i].parent === this.id) && (this.sourcelist.active[i])) numChilds++;
            }  
        return(numChilds);
    }

    // -- Check of het item actief is --

    isActief() : Boolean {
        let ordinal = this.sourcelist.getOrdinalById(this.id);
        return(this.sourcelist.active[ordinal]);   
    }

    // -- Retourneer ouder-item --

    getParent() {
        return this.sourcelist.data[this.sourcelist.getOrdinalById(this.parent)];
    }

    // -- Editeren van een string --

    stringPropToHTML(item: string, size?: number) {
        let output:string = "";
        let sizestr:string = "";
        if (size!=null) sizestr = ' size="'+size+'" ';
        output = '<input type="text"' + sizestr + ' id="' + 'HL_edit_' + this.id + '_' + item +  '" ' 
               + 'onchange=HLPropUpdate(' + this.id + ',"' + item + '","STRING","' + 'HL_edit_' + this.id + '_' + item + '") value="' + this.props[item] + '">';

        return(output);
    }

    // -- Editeren van een checkbox --

    checkboxPropToHTML(item: string) {
        let output:string;    
        output = '<input type="checkbox" id="' + 'HL_edit_' + this.id + '_' + item + '" '
               + 'onchange=HLPropUpdate(' + this.id + ',"' + item + '","BOOLEAN","' + 'HL_edit_' + this.id + '_' + item + '")' 
               + (this.props[item] ? ' checked' : '') + '>';

        return(output);
    }

    // -- Editeren van een select box --

    selectPropToHTML(item: string, items: Array<String>) {
        let myId = "HL_edit_"+this.id+"_"+item;
        let output: string = "";
        let options: string = "";

        output = '<select id="' + myId + '" onchange=HLPropUpdate(' + this.id + ',"' + item + '","SELECT","' + myId + '")>';
        for (let i:number=0; i<items.length; i++) {
            options = "";
            if (this.props[item]==items[i]) { options += " selected"; }
            if (items[i] == "---") {
              options += " disabled";
              items[i] = "---------------------------";
            }
            if (items[i] == "-") {
              options += " disabled";
              items[i] = "---";
            }
            output += '<option value="' + items[i] + '" ' + options + '>' + items[i] + '</option>';
        }
        output += "</select>"

        return(output);
    }    

    // -- Genereer HTML code voor de boom-editor --

    toHTML(mode: string) {
        return("toHTML() function not defined for base class List_Item. Extend class first.");
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();
        return(mySVG);
    }
}
