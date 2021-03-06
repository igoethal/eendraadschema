class List_Item {
    id: number;
    parent: number;
    indent: number;
    Parent_Item: List_Item;
    collapsed: Boolean;

    keys: Array<[string,string,any]>;

    constructor() {
        this.id = 0; //undefined
        this.parent = 0; //no parent
        this.indent = 0; //at root note, no parent
        this.collapsed = false; //at the start, nothingh is collapsed
        this.keys = new Array<[string,string,any]>();
    }

    resetKeys() {
    }

    getMaxNumChilds(Parent?: List_Item) : number {
      return(2^24);
    }

    setKey(key: string, setvalue: any) {
      for (var i: number = 0; i<this.keys.length; i++) {
        if (this.keys[i][0]==key) {
          this.keys[i][2] = setvalue;
        }
      }
    }

    getKey(key: string) {
      for (var i: number = 0; i<this.keys.length; i++) {
        if (this.keys[i][0]==key) {
          return(this.keys[i][2]);
        }
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
      output += "<input type=\"text\""+sizestr+" id=\"" + "HL_edit_"+this.id+"_"+this.keys[keyid][0] +
                "\" onchange=HLUpdate("+this.id+",\""+this.keys[keyid][0]+"\",\""+
                this.keys[keyid][1]+"\",\""+"HL_edit_"+this.id+"_"+this.keys[keyid][0]+
                "\") value=\"" + this.keys[keyid][2] + "\">";
      return(output);
    }

    checkboxToHTML(keyid: number) {
      let output:string = "";
      output += "<input type=\"checkbox\" id=\"" + "HL_edit_"+this.id+"_"+this.keys[keyid][0] + "\" onchange=HLUpdate("+this.id+",\""+this.keys[keyid][0]+"\",\""+this.keys[keyid][1]+"\",\""+"HL_edit_"+this.id+"_"+this.keys[keyid][0]+"\")"+(this.keys[keyid][2] ? ' checked' : '')+">";
      return(output);
    }

    selectToHTML(keyid: number, items: Array<String>) {
      var myId = "HL_edit_"+this.id+"_"+this.keys[keyid][0];
      var myType = this.keys[keyid][1];
      var output: String = "";
      var options: string = "";

      output += "<select id=\""+myId+"\" onchange=HLUpdate("+this.id+",\""+this.keys[keyid][0]+"\",\""+this.keys[keyid][1]+"\",\""+myId+"\")>";
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

    toHTML(mode: string, Parent?: List_Item) {
      return("toHTML() function not defined for base class List_Item. Extend class first.");
    }

    toSVG(hasChild: Boolean = false) {
      let mySVG:SVGelement = new SVGelement();
      return(mySVG);
    }

    updateConsumers() {
    } //Empty container class --> only in extended functions
}
