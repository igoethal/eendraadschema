class Simple_Item extends List_Item {
  constructor(mylist: Hierarchical_List) {
    super(mylist);
    this.keys.push(["name","STRING","no_name"]);
  }

  toHTML() {
    let output:string = "";
    for (var i=0; i<this.keys.length; i++) {
      switch(this.keys[i][1]) {
        case "STRING": {
          output += this.keys[i][0] + ": ";
          var myId = "HL_edit_"+this.id+"_"+this.keys[i][0];
          output += "<input id=\""+myId+"\" type=\"Text\" value=\""+this.keys[i][2]+"\" onchange=HLUpdate("+this.id+",\""+this.keys[i][0]+"\",\""+myId+"\")>";
          break;
        }
      }
    }
    //output += " <input id=\"HL_name_"+this.id+"\" type=\"Text\" value=\""+this.name+"\" onchange=\"HLChangeName("+this.id+")\">";
    output += " <button onclick=\"HLInsertBefore(" + this.id +")\">InsertBefore</button>";
    output += " <button onclick=\"HLDelete(" + this.id +")\">Delete</button>";
    output += " <button onclick=\"HLInsertAfter(" + this.id +")\">Insert After</button>";
    output += "id: " + this.id + " parent: " + this.parent;
    return(output);
  }
}
