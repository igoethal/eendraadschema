class List_Item {
    id: number;
    parent: number;
    indent: number;
    collapsed: Boolean;
    sourcelist: Hierarchical_List; //reference to the hierarchical list that the list-item is a member of

    keys: Array<[string,string,any]>;

    constructor(mylist: Hierarchical_List) {
        this.id = 0; //undefined
        this.parent = 0; //no parent
        this.indent = 0; //at root note, no parent
        this.collapsed = false; //at the start, nothingh is collapsed
        this.keys = new Array<[string,string,any]>();
        this.sourcelist = mylist;
    }

    resetKeys() {
    }

    getMaxNumChilds() : number {
      return(2^24);
    }

    getNumChilds() : number {
        var numChilds = 0;
        if (this.sourcelist != null) {
            for (let i=0; i<this.sourcelist.data.length; ++i) {
                if ((this.sourcelist.data[i].parent === this.id) && (this.sourcelist.active[i])) numChilds++;
            }  
        }
        return(numChilds);
    }

    getNumChildsWithKnownType() : number {
      var numChilds = 0;
      if (this.sourcelist != null) {
          for (let i=0; i<this.sourcelist.data.length; ++i) {
              if ( (this.sourcelist.data[i].parent === this.id) && (this.sourcelist.active[i]) && (this.sourcelist.data[i].keys[0][2] != "") ) numChilds++;
          }  
      }
      return(numChilds);
    }

    isActief() : Boolean {
      if (this.sourcelist != null) {
        let ordinal = this.sourcelist.getOrdinalById(this.id);
        return(this.sourcelist.active[ordinal]);   
      } else {
        return(false);
      }
    }

    heeftKindMetGekendType() : boolean {
      return(this.getNumChildsWithKnownType() > 0);
    }

    heeftVerbruikerAlsKind() : boolean {
        let parent = this.getParent();

        if ( (parent != null) && (parent.keys[0][2] == "Meerdere verbruikers") ) {
            let myOrdinal = this.sourcelist.getOrdinalById(this.id);
            let lastOrdinal = 0;
            for (let i = 0; i<this.sourcelist.data.length; ++i) {
                //empty tekst at the end does not count as a valid last child of meerdere verbruikers (zo vermijden we een streepje op het einde van het stopcontact)
                if (this.sourcelist.active[i] && (this.sourcelist.data[i].keys[16][2] != "zonder kader") && (this.sourcelist.data[i].parent == this.parent)) lastOrdinal = i;
            }
            if (lastOrdinal > myOrdinal) return true; else return false; 
        } else {
            if (this.sourcelist != null) {
                for (let i=0; i<this.sourcelist.data.length; ++i) {
                    if ( (this.sourcelist.data[i].parent === this.id) && 
                         (this.sourcelist.active[i]) && (this.sourcelist.data[i].keys[16][2] != "zonder kader") && 
                         (this.sourcelist.data[i].keys[0][2] != "") ) return true;
                }  
            }
        }  

      return false;
    }

    getParent() {
      if ((this.sourcelist != null) && (this.parent != 0)) {
        return this.sourcelist.data[this.sourcelist.getOrdinalById(this.parent)];
      } else {
        return null;
      }
    }

    stringToHTML(keyid: number, size?: number) {
      let output:string = "";
      let sizestr:string = "";
      switch(size) {
        case null: break;
        default:
          sizestr = ' size="'+size+'" ';
      }
      output = '<input type="text"' + sizestr + ' id="' + 'HL_edit_' + this.id + '_' + keyid +  '" ' 
             + 'onchange=HLUpdate(' + this.id + ',' + keyid + ',"STRING","' + 'HL_edit_' + this.id + '_' + keyid + '") value="' + this.keys[keyid][2] + '">';

      return(output);
    }

    checkboxToHTML(keyid: number) {
      let output:string;    
      output = '<input type="checkbox" id="' + 'HL_edit_' + this.id + '_' + keyid + '" '
             + 'onchange=HLUpdate(' + this.id + ',' + keyid + ',"BOOLEAN","' + 'HL_edit_' + this.id + '_' + keyid + '")' 
             + (this.keys[keyid][2] ? ' checked' : '') + '>';

      return(output);
    }

    selectToHTML(keyid: number, items: Array<String>) {
      var myId = "HL_edit_"+this.id+"_"+keyid;
      var output: String = "";
      var options: string = "";

      output = '<select id="' + myId + '" onchange=HLUpdate(' + this.id + ',' + keyid + ',"SELECT","' + myId + '")>';
      for (var i:number=0; i<items.length; i++) {
        options = "";
        if (this.keys[keyid][2]==items[i]) { options += " selected"; }
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

    toHTML(mode: string) {
      return("toHTML() function not defined for base class List_Item. Extend class first.");
    }

    toSVG() {
      let mySVG:SVGelement = new SVGelement();
      return(mySVG);
    }
}
