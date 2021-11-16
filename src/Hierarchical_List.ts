/*****************************************************************************
  CLASS Hierarchival_List

  Defines a list with a parent-child relationship.

  FUNCTIONS:
    Constructor()
      makes an empty list
    deleteInactive()
      remove all inactive members from the array. This saves memory
    reSort()
      Internal function. Usually does not need external calling.
      Make sure parent's are always earlier in the array than child.
      Re-arranges the array if needed. Always run reSort after
      having moved around stuff in the array. reSort will also
      remove inactive members from the array.
    getOrdinalById(my_id: number) : number
      Returns the element in the array for a given ID
    getNumChilds(parent_id: number) : number
      Returns the number of childs for a given parent ID
    getMaxNumChilds(parent_id: number) : number
      Returns the maximum number of permissible childs for a given parent ID
      Calls the getMaxNumChilds function of the underlying data element
    addItem(my_item: List_Item)
      Add an item to the end of the list with parent=0 (root)
    insertItemBeforeId(my_item: List_Item, my_id: number)
      Add an item before element with ID my_id having the same parent as my_id
    insertItemAfterId(my_item: List_Item, my_id: number)
      Add an item after element with ID my_id having the same parent as my_id
    insertChildAfterId(my_item: List_Item, my_id: number)
      Add an item after element with ID my_id and make it a child of
      this element.
    moveUp(my_id: number)
      Move element with ID my_id one place up but remain below the parent.
    moveDown(my_id: number)
      Move element with ID my_id one place down but remain below the parent.
    deleteById(my_id: number)
      Remove element with ID my_id and remove all its childs.
    toHTML()
      Outputs the hierarchical list in HTML format. Uses the toHTML function
      of the list item
    toSVG()
      Outputs the hierarchival list in SVG format. Uses the toSVG function
      of the list item

 VARIABLES:
   data: Array<List_Item>;
     Array of list items.
     Stores some standard elements such as parent
   active: Array<Boolean>;
     If an element is deleted, it is first made "inactive" and only then
     deleted when reSort() is called, usually at the end of functions
     that manipulate the array.
   id: Array<number>;
     Array with the official ID's
   properties: Properties;
     Specific properties of the item such as the filename
   length: number;
     Physical length of the array
   curid: number;
     When a new element is inserted, this is the ID it will get. This is NOT
     the same as the phsyical length of the array as the ID keeps on counting
     all once created and deleted members.
   mode: string;
     Mode can be "edit" or "move" depending on whether the interface is set
     to editing a hierarchival list of moving items around.

 *****************************************************************************/

class Hierarchical_List {
  data: Array<List_Item>;
  active: Array<Boolean>;
  id: Array<number>;
  properties: Properties;
  length: number;
  curid: number;
  mode: string; //can be "edit" or "move"

  //-----------------------------------------------------

  constructor() {
    this.length = 0;
    this.data = new Array<List_Item>();
    this.active = new Array<Boolean>();
    this.id = new Array<number>();
    this.properties = new Properties();
    this.curid = 1;
    this.mode = "edit";
  };

  //-----------------------------------------------------

  deleteInactive() {
    for (var i = 0; i<this.length; i++) { //Loop over all items
      while ( (!this.active[i]) && (i<this.length) ) {
        this.data.splice(i,1);
        this.active.splice(i,1);
        this.id.splice(i,1);
        this.length--;
      }
    }
  }

  //-----------------------------------------------------

  reSort() {
    this.deleteInactive();
    var continue_looping = true;
    while (continue_looping) {
      continue_looping = false
      for (var i = 0; i<this.length; i++) { //Loop over all items
        if (this.active[i]) { //We only do something for active members
          var parentOrdinal = this.getOrdinalById(this.data[i].parent);
          if (parentOrdinal > i) { //This shouldn't happen
            //We will need another pass to ensure we had them all
            continue_looping = true;
            //Repush data to the end
            this.data.push(this.data[i]);
            this.active.push(true);
            this.id.push(this.id[i]);
            this.length += 1
            //Set the original element to inactive
            this.active[i] = false;
          }
        }
      }
    }
    this.deleteInactive();
  }

  //-----------------------------------------------------

  getOrdinalById(my_id: number) : number {
    for (var i = 0; i<this.length; i++) {
      if (this.id[i]==my_id) {
        return(i);
      }
    }
  }

  //-----------------------------------------------------

  getNumChilds(parent_id: number) : number {
    var returnval = 0;
    for (var i = 0; i<this.length; i++) {
      if ( (this.data[i].parent == parent_id) && (this.active[i]) ) {
        returnval++;
      }
    }
    return(returnval);
  }

  //-----------------------------------------------------

  getMaxNumChilds(parent_id: number) : number {
    var newparentitem = this.data[this.getOrdinalById(parent_id)];
    var newparentofparentid = this.data[this.getOrdinalById(parent_id)].parent;
    var newparentofparentitem = this.data[this.getOrdinalById(newparentofparentid)];

    var returnval:number = newparentitem.getMaxNumChilds(newparentofparentitem);

    return(returnval);
  }

  //-----------------------------------------------------

  addItem(my_item: List_Item) {
    //First set the correct identifyer
    my_item.id = this.curid;
    my_item.parent = 0;
    my_item.indent = 0;

    //Then push the data into the queue
    this.data.push(my_item);
    this.active.push(true);
    this.id.push(this.curid);

    //Adjust length of the queue and future identifyer
    this.curid += 1;
    this.length += 1;
  }

  //-----------------------------------------------------

  insertItemBeforeId(my_item: List_Item, my_id: number) {
    for (var i = 0; i<this.length; i++) {
      if (this.id[i]==my_id) {
        //First set the correct identifyer
        my_item.id = this.curid;
        my_item.parent = this.data[i].parent;
        my_item.indent = this.data[i].indent;
        my_item.Parent_Item = this.data[this.getOrdinalById(my_item.parent)];
        my_item.collapsed = false;

        //Insert the data
        this.data.splice(i,0,my_item);
        this.active.splice(i,0,true);
        this.id.splice(i,0,this.curid);

        //Adjust length of the queue and future identifyer
        this.curid += 1;
        this.length += 1;

        break;
      }
    }
    this.reSort();
  }

  //-----------------------------------------------------

  insertItemAfterId(my_item: List_Item, my_id: number) {
    for (var i = 0; i<this.length; i++) {
      if (this.id[i]==my_id) {
        //First set the correct identifyer
        my_item.id = this.curid;
        my_item.parent = this.data[i].parent;
        my_item.indent = this.data[i].indent;
        my_item.Parent_Item = this.data[this.getOrdinalById(my_item.parent)];
        my_item.collapsed = false;

        //Insert the data
        this.data.splice(i+1,0,my_item);
        this.active.splice(i+1,0,true);
        this.id.splice(i+1,0,this.curid);

        //Adjust length of the queue and future identifyer
        this.curid += 1;
        this.length += 1;

        return(i+1);
        break;
      }
    }
    this.reSort();
  }

  //-----------------------------------------------------

  insertChildAfterId(my_item: List_Item, my_id: number) {
    var numchilds:number = this.getNumChilds(my_id);
    var maxchilds:number = this.getMaxNumChilds(my_id);

    if (numchilds < maxchilds) {
      var ordinal:number = this.insertItemAfterId(my_item, my_id);
      this.data[ordinal].parent = my_id;
      this.data[ordinal].indent = this.data[ordinal-1].indent+1;
      this.data[ordinal].Parent_Item = this.data[this.getOrdinalById(my_id)];
    } else {
      alert("Het maximum aantal kinderen van dit element is "+maxchilds);
    }
    this.reSort();
  }

  //-----------------------------------------------------

  moveUp(my_id: number) {
    //-- First find the ordinal number of the current location and the desired location --
    let currentOrdinal = this.getOrdinalById(my_id);
    let newOrdinal = currentOrdinal;
    let currentparent = this.data[currentOrdinal].parent;
    for (var i = currentOrdinal-1; i>=0; i--) {
      if ( (this.data[i].parent == currentparent) && (this.active[i]) ) {
        newOrdinal = i;
        break; //Leave the for loop
      }
    }
    //Swap both items (we swap data and id, we do not need to swap active as both items are active by construction)
    var swapItem: List_Item = new List_Item();
    swapItem = this.data[currentOrdinal];
    this.data[currentOrdinal] = this.data[newOrdinal];
    this.data[newOrdinal] = swapItem;

    var swapID = this.id[currentOrdinal];
    this.id[currentOrdinal] = this.id[newOrdinal];
    this.id[newOrdinal] = swapID;

    this.reSort();
  }

  //-----------------------------------------------------

  moveDown(my_id: number) {
    //-- First find the ordinal number of the current location and the desired location --
    let currentOrdinal = this.getOrdinalById(my_id);
    let newOrdinal = currentOrdinal;
    let currentparent = this.data[currentOrdinal].parent;
    for (var i = currentOrdinal+1; i<this.length; i++) {
      if ( (this.data[i].parent == currentparent) && (this.active[i]) ) {
        newOrdinal = i;
        break; //Leave the for loop
      }
    }
    //Swap both items (we swap data and id, we do not need to swap active as both items are active by construction)
    var swapItem: List_Item = new List_Item();
    swapItem = this.data[currentOrdinal];
    this.data[currentOrdinal] = this.data[newOrdinal];
    this.data[newOrdinal] = swapItem;

    var swapID = this.id[currentOrdinal];
    this.id[currentOrdinal] = this.id[newOrdinal];
    this.id[newOrdinal] = swapID;

    this.reSort();
  }

  //-----------------------------------------------------

  clone(my_id: number, parent_id?: number) {
    //-- First find the ordinal number of the current location and the desired location --
    //   Also look for the original length of the structure
    let currentOrdinal = this.getOrdinalById(my_id);
    var original_length = this.length;
    //-- Then create a clone of the object and assign the correct parent_id
    if(arguments.length < 2) {
      parent_id = this.data[currentOrdinal].parent
    }
    let parentOrdinal = this.getOrdinalById(parent_id);
    var my_item = new Electro_Item(this.data[parentOrdinal]);
    my_item.clone(this.data[currentOrdinal]);
    //-- Now add the clone to the structure
    //   The clone will have id this.curid-1
    if(arguments.length < 2) {
      this.insertItemAfterId(my_item, my_id); //Cloning the top-element, this messes up the ordinals !!
    } else {
      this.insertChildAfterId(my_item, parent_id); //Cloning childs, this messes up the ordinals !!
    }
    var new_id = this.curid-1;
    this.data[this.getOrdinalById(new_id)].collapsed = this.data[this.getOrdinalById(my_id)].collapsed;
    //-- Now loop over the childs of the original and also clone those
    var toClone = new Array(); //list of id's to clone
    for (var i = 0; i<original_length; i++) {
      if (this.id[i]==my_id) {
        for (var j=original_length-1; j>=0; j--) { //We need to loop in opposite sense
          if (this.data[j].parent==my_id) toClone.push(this.id[j]);
        }
      }
    }
    for (var clone_id=0; clone_id<toClone.length; clone_id++) {
      this.clone(toClone[clone_id],new_id);
    }
    this.reSort();
  }

  //-----------------------------------------------------

  deleteById(my_id: number) {
    for (var i = 0; i<this.length; i++) {
      if (this.id[i]==my_id) {
        this.active[i] = false;
        for (var j=0; j<this.length; j++) {
          if (this.data[j].parent==my_id) this.deleteById(this.id[j]);
        }
      }
    }
    this.reSort();
  }

  //-----------------------------------------------------

  toHTML(myParent: number) {
    var output: string = "";
    var numberDrawn: number = 0;
    //-- bovenaan de switch van editeer-mode (teken of verplaats) --
    if (myParent == 0) {
      switch (this.mode) {
        case "edit":
          output+= 'Modus (Invoegen/Verplaatsen/Clone) <select id="edit_mode" onchange="HL_editmode()"><option value="edit" selected>Invoegen</option><option value="move">Verplaatsen/Clone</option></select><br><br>';
          break;
        case "move":
          output+= 'Modus (Invoegen/Verplaatsen/Clone) <select id="edit_mode" onchange="HL_editmode()"><option value="edit">Invoegen</option><option value="move" selected>Verplaatsen/Clone</option></select>'+
                   '<span style="color:black"><i>&nbsp;Gebruik de pijlen om de volgorde van elementen te wijzigen. '+
                   'Gebruik het Moeder-veld om een component elders in het schema te hangen. Kies "clone" om een dubbel te maken van een element.</i></span><br><br>';
          break;
      }
      //-- plaats input box voor naam van het schema bovenaan --
      //output += 'Bestandsnaam: <span id="settings"><code>' + this.properties.filename + '</code>&nbsp;<button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button></span><br><br>'
    }

    //--Teken het volledige schema in HTML--
    for (var i = 0; i<this.length; i++) {
      if (this.active[i] && (this.data[i].parent == myParent)) {
        numberDrawn++;
        if (this.data[i].collapsed) {
          output += '<table class="html_edit_table"><tr><td bgcolor="#8AB2E4" onclick="HLCollapseExpand(' + this.data[i].id + ')" valign= "top">&#x229E;</td><td width="100%">'
        } else {
          output += '<table class="html_edit_table"><tr><td bgcolor="#C0C0C0" onclick="HLCollapseExpand(' + this.data[i].id + ')" valign= "top">&#x229F;</td><td width="100%">'
        }
        switch(myParent) {
          case 0: {
            output += this.data[i].toHTML(structure.mode) + "<br>";
            break; }
          default: {
            output += this.data[i].toHTML(structure.mode,this.data[this.getOrdinalById(myParent)]) + "<br>";
            break; }
        }
        if (!this.data[i].collapsed) {
          output += this.toHTML(this.id[i]);
        }
        output += "</td></tr></table>"
      }
    }
    if ( (myParent == 0) && (numberDrawn<1) ) {
      output += "<button onclick=\"HLAdd()\">Voeg eerste object toe of kies bovenaan \"opnieuw beginnen\"</button>"; //no need for the add button if we have items
    }
    return(output);
  }

  //-----------------------------------------------------

  toSVG(myParent: number, stack: string, minxleft: number = 0, includeparent: boolean = false) { //stack can be "horizontal" or "vertical"

    //--- First read all underlying elements in an Array called inSVG ---

    var inSVG: Array<SVGelement> = new Array<SVGelement>(); //Results from nested calls will be added here
    var elementCounter: number = 0;
    var lastChildOrdinal = 0;

    if ( (myParent != 0) && ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Meerdere verbruikers") ) {
      for (var i = 0; i<this.length; i++) {
        //empty tekst at the end does not count as a valid last child
        if (this.active[i] && (this.data[i].keys[16][2] != "zonder kader") && (this.data[i].parent == myParent)) lastChildOrdinal = i;
      }
    } else { //if not a child of meerdere verbruikers, we also allow the parent to be the lastChild
      for (var i = 0; i<this.length; i++) {
        //empty tekst at the end does not count as a valid last child
        if (this.active[i] && (this.data[i].keys[16][2] != "zonder kader") && (this.data[i].parent == myParent)) lastChildOrdinal = i;
        if (this.active[i] && (this.data[i].keys[16][2] != "zonder kader") && (includeparent==true) && (this.id[i] == myParent)) lastChildOrdinal = i;
      }
    }

    for (var i = 0; i<this.length; i++) {
      if (this.active[i] && ( (this.data[i].parent == myParent) || ( (includeparent==true) && (this.id[i] == myParent) ) ) ) {
        switch (this.data[i].getKey("type")) {
          case "Bord":
            //get image of the entire bord
            inSVG[elementCounter] = this.toSVG(this.id[i],"horizontal");
            inSVG[elementCounter].xright += 10;
            if (this.data[i].getKey("geaard")) {
              if (inSVG[elementCounter].xleft <=100) {
                var toShift = 100-inSVG[elementCounter].xleft;
                inSVG[elementCounter].xleft = 100;
                inSVG[elementCounter].xright -= toShift;
              }
            } else {
              if (inSVG[elementCounter].xleft <=30) {
                var toShift = 30-inSVG[elementCounter].xleft;
                inSVG[elementCounter].xleft = 30;
                inSVG[elementCounter].xright -= toShift;
              }
            }
            if (inSVG[elementCounter].xright <=10) inSVG[elementCounter].xright = 10;

            //Ensure there is enough space to draw the bottom line
            inSVG[elementCounter].ydown = Math.max(inSVG[elementCounter].ydown,1);

            //Draw the bottom line
            inSVG[elementCounter].data = inSVG[elementCounter].data +
              '<line x1="4" x2="' + (inSVG[elementCounter].xleft + inSVG[elementCounter].xright-6) +
              '" y1="' + inSVG[elementCounter].yup + '" y2="' + inSVG[elementCounter].yup + '" stroke="black" stroke-width="3" />'

            //Add name of the board
            if (this.data[i].getKey("naam") !== "") {
              inSVG[elementCounter].data += '<text x="' + (0) + '" y="' + (inSVG[elementCounter].yup + 13) + '" ' +
                'style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="10">&lt;' +
                htmlspecialchars(this.data[i].getKey("naam"))+'&gt;</text>';
            };

            //Add an image of the grounding
            if (this.data[i].getKey("geaard")) {
              inSVG[elementCounter].data += '<line x1="40" y1="' + (inSVG[elementCounter].yup + 0) + '" x2="40" y2="' + (inSVG[elementCounter].yup + 10) + '" stroke="black" />';
              inSVG[elementCounter].data += '<line x1="40" y1="' + (inSVG[elementCounter].yup + 15) + '" x2="40" y2="' + (inSVG[elementCounter].yup + 25) + '" stroke="black" />';
              inSVG[elementCounter].data += '<line x1="40" y1="' + (inSVG[elementCounter].yup + 30) + '" x2="40" y2="' + (inSVG[elementCounter].yup + 40) + '" stroke="black" />';
              inSVG[elementCounter].data += '<line x1="35" y1="' + (inSVG[elementCounter].yup + 10) + '" x2="45" y2="' + (inSVG[elementCounter].yup + 10) + '" stroke="black" />';
              inSVG[elementCounter].data += '<line x1="35" y1="' + (inSVG[elementCounter].yup + 15) + '" x2="45" y2="' + (inSVG[elementCounter].yup + 15) + '" stroke="black" />';
              inSVG[elementCounter].data += '<line x1="35" y1="' + (inSVG[elementCounter].yup + 25) + '" x2="45" y2="' + (inSVG[elementCounter].yup + 25) + '" stroke="black" />';
              inSVG[elementCounter].data += '<line x1="35" y1="' + (inSVG[elementCounter].yup + 30) + '" x2="45" y2="' + (inSVG[elementCounter].yup + 30) + '" stroke="black" />';
              inSVG[elementCounter].data += '<line x1="30" y1="' + (inSVG[elementCounter].yup + 40) + '" x2="50" y2="' + (inSVG[elementCounter].yup + 40) + '" stroke="black" />';
              inSVG[elementCounter].data += '<line x1="32.5" y1="' + (inSVG[elementCounter].yup + 43) + '" x2="47.5" y2="' + (inSVG[elementCounter].yup + 43) + '" stroke="black" />';
              inSVG[elementCounter].data += '<line x1="35" y1="' + (inSVG[elementCounter].yup + 46) + '" x2="45" y2="' + (inSVG[elementCounter].yup + 46) + '" stroke="black" />';
            };
            break;

          case "Splitsing":
            //Algoritme werkt gelijkaardig aan een "Bord", eerst maken we een tekening van het geheel
            inSVG[elementCounter] = this.toSVG(this.id[i],"horizontal");

            switch ((this.data[this.getOrdinalById(myParent)]).getKey("type")) {
              case "Aansluiting":
              case "Kring": //in-line with kring or aansluiting
                inSVG[elementCounter].data = inSVG[elementCounter].data +
                  '<line x1="' + (inSVG[elementCounter].xleft) + '" x2="' + (inSVG[elementCounter].xleft + inSVG[elementCounter].xrightmin) +
                  '" y1="' + inSVG[elementCounter].yup + '" y2="' + inSVG[elementCounter].yup + '" stroke="black" />'
                break;
              default:
                if ((inSVG[elementCounter].xright + inSVG[elementCounter].xleft) <=0) inSVG[elementCounter].xrightmin = 15; // ensure we see there is a "splitsing"
                if (inSVG[elementCounter].yup < 25) inSVG[elementCounter].yup = 25;
                if (inSVG[elementCounter].ydown < 25) inSVG[elementCounter].ydown = 25;
                inSVG[elementCounter].data = inSVG[elementCounter].data +
                  '<line x1="' + (1) + '" x2="' + (inSVG[elementCounter].xleft + inSVG[elementCounter].xrightmin) +
                  '" y1="' + inSVG[elementCounter].yup + '" y2="' + inSVG[elementCounter].yup + '" stroke="black" />'
                var toShift = inSVG[elementCounter].xleft;
                inSVG[elementCounter].xleft -= toShift - 1; //we leave one pixel for the bold kring-line at the left
                inSVG[elementCounter].xright += toShift;
                break;
            }
            break;

          case "Domotica":
            //Algoritme werkt gelijkaardig aan een "Bord" en "Splitsing", eerst maken we een tekening van het geheel
            inSVG[elementCounter] = this.toSVG(this.id[i],"horizontal");

            //Make sure there is always enough space to display the element
            if ((inSVG[elementCounter].xright + inSVG[elementCounter].xleft) <=100) inSVG[elementCounter].xright = (100 - inSVG[elementCounter].xleft) ;
            inSVG[elementCounter].yup = Math.max(inSVG[elementCounter].yup+20, 25);
            inSVG[elementCounter].ydown += Math.max(inSVG[elementCounter].ydown, 25);

            var width = (inSVG[elementCounter].xleft + inSVG[elementCounter].xright - 20);
            inSVG[elementCounter].data = inSVG[elementCounter].data +
              '<rect x="' + (20) + '" width="' + (width) +
              '" y="' + (inSVG[elementCounter].yup-20) + '" height="' + (40) + '" stroke="black" stroke-width="2" fill="white" />'
            inSVG[elementCounter].data = inSVG[elementCounter].data +
              '<line x1="0" x2="20" y1="' + (inSVG[elementCounter].yup) + '" y2="' + (inSVG[elementCounter].yup) + '" stroke="black" />'
            inSVG[elementCounter].data +=
              '<text x="' + (21 + width/2) + '" y="' + (inSVG[elementCounter].yup+3) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="bold">' + htmlspecialchars(this.data[i].keys[15][2]) + '</text>';

            var toShift = inSVG[elementCounter].xleft;
            inSVG[elementCounter].xleft -= toShift - 1; //we leave one pixel for the bold kring-line at the left
            inSVG[elementCounter].xright += toShift - 1;

            //If direct child of a Kring, put a vertical pipe and "nr" at the left
            if (myParent != 0) {
              if ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Kring") {

                var y1, y2: number;
                if (i !== lastChildOrdinal) {
                  y1 = 0;
                  y2 = inSVG[elementCounter].yup + inSVG[elementCounter].ydown;
                } else {
                  y1 = inSVG[elementCounter].yup;
                  y2 = inSVG[elementCounter].yup + inSVG[elementCounter].ydown;
                }

                inSVG[elementCounter].data = inSVG[elementCounter].data +
                  '<line x1="' + inSVG[elementCounter].xleft +
                  '" x2="' + inSVG[elementCounter].xleft +
                  '" y1="' + y1 + '" y2="' + y2 + '" stroke="black" />'

                inSVG[elementCounter].data +=
                  '<text x="' + (inSVG[elementCounter].xleft+9) + '" y="' + (inSVG[elementCounter].yup - 5) + '" ' +
                  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                  htmlspecialchars(this.data[i].getKey("naam"))+'</text>';
              };
            };

            break;

          case "Meerdere verbruikers":
            //Algoritme werkt gelijkaardig aan een "Bord", eerst maken we een tekening van het geheel
            inSVG[elementCounter] = this.toSVG(this.id[i],"horizontal");

            //We voorzien altijd verticale ruimte, zelfs als de kinderen nog niet gedefinieerd zijn
            inSVG[elementCounter].ydown = Math.max(inSVG[elementCounter].ydown,25);
            inSVG[elementCounter].yup = Math.max(inSVG[elementCounter].yup,25);
            inSVG[elementCounter].xleft = Math.max(inSVG[elementCounter].xleft,1);

            //--plaats adres onderaan als nodig--
            if (!(/^\s*$/.test(this.data[i].keys[15][2]))) { //check if adres contains only white space
              inSVG[elementCounter].data += '<text x="' + ((inSVG[elementCounter].xright-20)/2 + 21) + '" y="' + (inSVG[elementCounter].yup+inSVG[elementCounter].ydown+10)
                + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.data[i].keys[15][2]) + '</text>';
              inSVG[elementCounter].ydown += 15;
            }

            //If direct child of a Kring, put a vertical pipe and "nr" at the left
            if (myParent != 0) {
              if ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Kring") {

                var y1, y2: number;
                if (i !== lastChildOrdinal) {
                  y1 = 0;
                  y2 = inSVG[elementCounter].yup + inSVG[elementCounter].ydown;
                } else {
                  y1 = inSVG[elementCounter].yup;
                  y2 = inSVG[elementCounter].yup + inSVG[elementCounter].ydown;
                }

                inSVG[elementCounter].data = inSVG[elementCounter].data +
                  '<line x1="' + inSVG[elementCounter].xleft +
                  '" x2="' + inSVG[elementCounter].xleft +
                  '" y1="' + y1 + '" y2="' + y2 + '" stroke="black" />'

                inSVG[elementCounter].data +=
                  '<text x="' + (inSVG[elementCounter].xleft+9) + '" y="' + (inSVG[elementCounter].yup - 5) + '" ' +
                  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                  htmlspecialchars(this.data[i].getKey("naam"))+'</text>';
              };
            };

            break;

          case "Aansluiting":
            //get image of the entire stack, make sure it is shifted to the right sufficiently so-that the counter can be added below
            inSVG[elementCounter] = this.toSVG(this.id[i],"vertical",150); //shift 100 to the right

            //add the fuse below

            inSVG[elementCounter].data += '<line x1="' + inSVG[elementCounter].xleft +
              '" x2="' + inSVG[elementCounter].xleft +
              '" y1="' + inSVG[elementCounter].yup +
              '" y2="' + (inSVG[elementCounter].yup+20) + '" stroke="black" />';
            inSVG[elementCounter].yup += 20;

            switch (this.data[i].getKey("zekering")) {
              case "automatisch":
                inSVG[elementCounter].yup += 30;
                inSVG[elementCounter].data +=
                  '<use xlink:href="#zekering_automatisch" x=\"' + inSVG[elementCounter].xleft +
                  '" y="' + inSVG[elementCounter].yup + '" />';
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15) +
                   "\" y=\"" + (inSVG[elementCounter].yup-10) +
                   "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15) +
                   "," + (inSVG[elementCounter].yup-10) +
                   ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                   htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") +"</text>";
                break;
              case "schakelaar":
                inSVG[elementCounter].yup += 30;
                inSVG[elementCounter].data +=
                  '<use xlink:href="#zekering_empty" x=\"' + inSVG[elementCounter].xleft +
                  '" y="' + inSVG[elementCounter].yup + '" />';
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15) +
                   "\" y=\"" + (inSVG[elementCounter].yup-10) +
                   "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15) +
                   "," + (inSVG[elementCounter].yup-10) +
                   ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                   htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
              break;
              case "schemer":
                inSVG[elementCounter].yup += 30;
                inSVG[elementCounter].data +=
                  '<use xlink:href="#zekering_empty" x=\"' + inSVG[elementCounter].xleft +
                  '" y="' + inSVG[elementCounter].yup + '" />';
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15) +
                   "\" y=\"" + (inSVG[elementCounter].yup-10) +
                   "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15) +
                   "," + (inSVG[elementCounter].yup-10) +
                   ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                   htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                 inSVG[elementCounter].data +=
                   '<use xlink:href="#arrow" x=\"' + (inSVG[elementCounter].xleft-18) +
                   '" y="' + (inSVG[elementCounter].yup-15) + '" />';
                 inSVG[elementCounter].data +=
                   '<use xlink:href="#arrow" x=\"' + (inSVG[elementCounter].xleft-18) +
                   '" y="' + (inSVG[elementCounter].yup-12) + '" />';
                break;
              case "differentieel":
                if (this.data[i].keys[20][2]) { //Differentieel is selectief
                  inSVG[elementCounter].data += '<line x1="' + inSVG[elementCounter].xleft +
                    '" x2="' + inSVG[elementCounter].xleft +
                    '" y1="' + inSVG[elementCounter].yup +
                    '" y2="' + (inSVG[elementCounter].yup+30) + '" stroke="black" />';
                  inSVG[elementCounter].data += '<rect x="' + (inSVG[elementCounter].xleft+7) +
                    '" y="' + (inSVG[elementCounter].yup) +
                    '" width="16" height="16" stroke="black" fill="white" />';
                  inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15) +
                     "\" y=\"" + (inSVG[elementCounter].yup+12) +
                     "\"" +
                     " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15) +
                     "," + (inSVG[elementCounter].yup+8) +
                     ")" +
                      "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                     "S" + "</text>";
                  inSVG[elementCounter].yup += 23;
                }
                inSVG[elementCounter].yup += 30;
                inSVG[elementCounter].data +=
                  '<use xlink:href="#zekering_automatisch" x=\"' + inSVG[elementCounter].xleft +
                  '" y="' + inSVG[elementCounter].yup + '" />';
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+25) +
                   "\" y=\"" + (inSVG[elementCounter].yup-10) +
                   "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+25) +
                   "," + (inSVG[elementCounter].yup-10) +
                   ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                   htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15) +
                  "\" y=\"" + (inSVG[elementCounter].yup-10) +
                  "\"" +
                  " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15) +
                  "," + (inSVG[elementCounter].yup-10) +
                  ")" +
                  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                  "\u0394" + htmlspecialchars(this.data[i].getKey("differentieel_waarde") + "mA") + "</text>";
                if ( (this.data[i].keys[17][2]=='A') || (this.data[i].keys[17][2]=='B') ) {
                  inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+35) +
                    "\" y=\"" + (inSVG[elementCounter].yup-10) +
                    "\"" +
                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+35) +
                    "," + (inSVG[elementCounter].yup-10) +
                    ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                    htmlspecialchars("Type " + this.data[i].keys[17][2]) + "</text>";
                  inSVG[elementCounter].xright = Math.max(inSVG[elementCounter].xright,40);
                }
                break;
              case "smelt":
                inSVG[elementCounter].yup += 30;
                inSVG[elementCounter].data +=
                  '<use xlink:href="#zekering_smelt" x=\"' + inSVG[elementCounter].xleft +
                  '" y="' + inSVG[elementCounter].yup + '" />';
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15) +
                   "\" y=\"" + (inSVG[elementCounter].yup-10) +
                   "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15) +
                   "," + (inSVG[elementCounter].yup-10) +
                   ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                   htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                break;
              case "geen":
                inSVG[elementCounter].yup += 0;
                break;
            }

            //draw the counter
            inSVG[elementCounter].data += '<line x1="1" ' +
              'y1="' + (inSVG[elementCounter].yup+25) +
              '" x2="21" '+
              'y2="' + (inSVG[elementCounter].yup+25) + '" stroke="black"></line>';

            //draw outgoing connecting lines
            inSVG[elementCounter].data += '<line x1="60" ' +
              'y1="' + (inSVG[elementCounter].yup+25) +
              '" x2="' + (inSVG[elementCounter].xleft) + '" '+
              'y2="' + (inSVG[elementCounter].yup+25) + '" stroke="black"></line>';
            inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft) +
              '" y1="' + (inSVG[elementCounter].yup) +
              '" x2="' + (inSVG[elementCounter].xleft) + '" '+
              'y2="' + (inSVG[elementCounter].yup+25) + '" stroke="black"></line>';

            //Draw the counter
            inSVG[elementCounter].data += '<use xlink:href="#elektriciteitsmeter" x="21" y="' + (inSVG[elementCounter].yup+25) + '"></use>';

            //set kabel type Text
            inSVG[elementCounter].data += '<text x="100" y="' + (inSVG[elementCounter].yup+40) +
               '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
               htmlspecialchars(this.data[i].getKey("kabel")) + '</text>';

            //inSVG[elementCounter].xleft = Math.max(inSVG[elementCounter].xleft,60);
            //inSVG[elementCounter].xright = Math.max(inSVG[elementCounter].xright,10);
            //Foresee sufficient room below for the counter
            inSVG[elementCounter].yup += 25;
            inSVG[elementCounter].ydown = 25;

            //If adres is not empty, put it below
            if (!(/^\s*$/.test(this.data[i].keys[15][2]))) { //check if adres contains only white space
              inSVG[elementCounter].data += '<text x="41" y="' + (inSVG[elementCounter].yup+inSVG[elementCounter].ydown+10) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.data[i].keys[15][2]) + '</text>';
              inSVG[elementCounter].ydown += 15;
            }

            //rework xleft and xright to ensure the entire structure is always at the right of a potential parent kring
            var width = inSVG[elementCounter].xleft + inSVG[elementCounter].xright;
            inSVG[elementCounter].xleft = 1;
            inSVG[elementCounter].xright = width-1;

            //If direct child of a Kring, put a vertical pipe and "nr" at the left
            if (myParent != 0) {
            if ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Kring") {

              var y1, y2: number;
              if (i !== lastChildOrdinal) {
                y1 = 0;
                y2 = inSVG[elementCounter].yup + inSVG[elementCounter].ydown;
              } else {
                y1 = inSVG[elementCounter].yup;
                y2 = inSVG[elementCounter].yup + inSVG[elementCounter].ydown;
              }

              inSVG[elementCounter].data = inSVG[elementCounter].data +
                '<line x1="' + inSVG[elementCounter].xleft +
                '" x2="' + inSVG[elementCounter].xleft +
                '" y1="' + y1 + '" y2="' + y2 + '" stroke="black" />'

              inSVG[elementCounter].data +=
                '<text x="' + (inSVG[elementCounter].xleft+9) + '" y="' + (inSVG[elementCounter].yup - 5) + '" ' +
                'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                htmlspecialchars(this.data[i].getKey("naam"))+'</text>';
            };};

            break;

          case "Kring":
            let cable_location_available: number = 0;
            if ( (this.data[i].getKey("kabel_aanwezig"))
                && (this.data[i].keys[19][2] || contains(["Ondergronds","Luchtleiding","In wand","Op wand"],this.data[i].keys[16][2]) ) ) {
                  cable_location_available = 1;
            }

            //get image of the entire kring
            inSVG[elementCounter] = this.toSVG(this.id[i],"vertical",35 + 20*cable_location_available);

            //--- Code for the cable including text and indications where the cable is located ---

            if (this.data[i].getKey("kabel_aanwezig")) {
              //foresee space for the conductor specifications
              inSVG[elementCounter].data += '<line x1="' + inSVG[elementCounter].xleft +
                '" x2="' + inSVG[elementCounter].xleft +
                '" y1="' + inSVG[elementCounter].yup +
                '" y2="' + (inSVG[elementCounter].yup+100) + '" stroke="black" />';
              inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15) +
                 "\" y=\"" + (inSVG[elementCounter].yup+80) +
                 "\"" +

                 " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15) +
                 "," + (inSVG[elementCounter].yup+80) +
                 ")" +

                  "\" style=\"text-anchor:start\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                 htmlspecialchars(this.data[i].getKey("kabel")) + "</text>";

               //Draw the cable location symbols
               if (cable_location_available) {
                 if ( (this.data[i].keys[19][2]) && (this.data[i].keys[16][2] != "Luchtleiding") )  {
                   inSVG[elementCounter].data += '<circle cx="' + (inSVG[elementCounter].xleft-10)
                                               + '" cy="' + (inSVG[elementCounter].yup+40)
                                               +'" r="4" style="stroke:black;fill:none" />';
                 }
                 switch (this.data[i].keys[16][2]) {
                   case "Ondergronds":
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-13)
                                               + '" x2="' + (inSVG[elementCounter].xleft-13)
                                               + '" y1="' + (inSVG[elementCounter].yup+60)
                                               + '" y2="' + (inSVG[elementCounter].yup+80)
                                               +'" style="stroke:black" />';
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-10)
                                               + '" x2="' + (inSVG[elementCounter].xleft-10)
                                               + '" y1="' + (inSVG[elementCounter].yup+62)
                                               + '" y2="' + (inSVG[elementCounter].yup+78)
                                               +'" style="stroke:black" />';
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-7)
                                               + '" x2="' + (inSVG[elementCounter].xleft-7)
                                               + '" y1="' + (inSVG[elementCounter].yup+64)
                                               + '" y2="' + (inSVG[elementCounter].yup+76)
                                               +'" style="stroke:black" />';
                     break;
                   case "Luchtleiding":
                     inSVG[elementCounter].data += '<circle cx="' + (inSVG[elementCounter].xleft)
                                                   + '" cy="' + (inSVG[elementCounter].yup+20)
                                                   +'" r="4" style="stroke:black;fill:none" />';
                     break;
                   case "In wand":
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-15)
                                               + '" x2="' + (inSVG[elementCounter].xleft-15)
                                               + '" y1="' + (inSVG[elementCounter].yup+10)
                                               + '" y2="' + (inSVG[elementCounter].yup+30)
                                               +'" style="stroke:black" />';
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-15)
                                               + '" x2="' + (inSVG[elementCounter].xleft-5)
                                               + '" y1="' + (inSVG[elementCounter].yup+10)
                                               + '" y2="' + (inSVG[elementCounter].yup+10)
                                               +'" style="stroke:black" />';
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-15)
                                               + '" x2="' + (inSVG[elementCounter].xleft-5)
                                               + '" y1="' + (inSVG[elementCounter].yup+20)
                                               + '" y2="' + (inSVG[elementCounter].yup+20)
                                               +'" style="stroke:black" />';
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-15)
                                               + '" x2="' + (inSVG[elementCounter].xleft-5)
                                               + '" y1="' + (inSVG[elementCounter].yup+30)
                                               + '" y2="' + (inSVG[elementCounter].yup+30)
                                               +'" style="stroke:black" />';
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-15)
                                               + '" x2="' + (inSVG[elementCounter].xleft-15)
                                               + '" y1="' + (inSVG[elementCounter].yup+65)
                                               + '" y2="' + (inSVG[elementCounter].yup+85)
                                               +'" style="stroke:black" />';
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-15)
                                               + '" x2="' + (inSVG[elementCounter].xleft-5)
                                               + '" y1="' + (inSVG[elementCounter].yup+85)
                                               + '" y2="' + (inSVG[elementCounter].yup+85)
                                               +'" style="stroke:black" />';
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-15)
                                               + '" x2="' + (inSVG[elementCounter].xleft-5)
                                               + '" y1="' + (inSVG[elementCounter].yup+65)
                                               + '" y2="' + (inSVG[elementCounter].yup+65)
                                               +'" style="stroke:black" />';
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-15)
                                               + '" x2="' + (inSVG[elementCounter].xleft-5)
                                               + '" y1="' + (inSVG[elementCounter].yup+75)
                                               + '" y2="' + (inSVG[elementCounter].yup+75)
                                               +'" style="stroke:black" />';
                     break;
                   case "Op wand":
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-5)
                                               + '" x2="' + (inSVG[elementCounter].xleft-5)
                                               + '" y1="' + (inSVG[elementCounter].yup+10)
                                               + '" y2="' + (inSVG[elementCounter].yup+30)
                                               +'" style="stroke:black" />';
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-15)
                                               + '" x2="' + (inSVG[elementCounter].xleft-5)
                                               + '" y1="' + (inSVG[elementCounter].yup+10)
                                               + '" y2="' + (inSVG[elementCounter].yup+10)
                                               +'" style="stroke:black" />';
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-15)
                                               + '" x2="' + (inSVG[elementCounter].xleft-5)
                                               + '" y1="' + (inSVG[elementCounter].yup+20)
                                               + '" y2="' + (inSVG[elementCounter].yup+20)
                                               +'" style="stroke:black" />';
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-15)
                                               + '" x2="' + (inSVG[elementCounter].xleft-5)
                                               + '" y1="' + (inSVG[elementCounter].yup+30)
                                               + '" y2="' + (inSVG[elementCounter].yup+30)
                                               +'" style="stroke:black" />';
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-5)
                                               + '" x2="' + (inSVG[elementCounter].xleft-5)
                                               + '" y1="' + (inSVG[elementCounter].yup+65)
                                               + '" y2="' + (inSVG[elementCounter].yup+85)
                                               +'" style="stroke:black" />';
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-15)
                                               + '" x2="' + (inSVG[elementCounter].xleft-5)
                                               + '" y1="' + (inSVG[elementCounter].yup+85)
                                               + '" y2="' + (inSVG[elementCounter].yup+85)
                                               +'" style="stroke:black" />';
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-15)
                                               + '" x2="' + (inSVG[elementCounter].xleft-5)
                                               + '" y1="' + (inSVG[elementCounter].yup+65)
                                               + '" y2="' + (inSVG[elementCounter].yup+65)
                                               +'" style="stroke:black" />';
                     inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft-15)
                                               + '" x2="' + (inSVG[elementCounter].xleft-5)
                                               + '" y1="' + (inSVG[elementCounter].yup+75)
                                               + '" y2="' + (inSVG[elementCounter].yup+75)
                                               +'" style="stroke:black" />';
                     break;
                 }
               }

              inSVG[elementCounter].yup += 100;
            } else {
              inSVG[elementCounter].data += '<line x1="' + inSVG[elementCounter].xleft +
                '" x2="' + inSVG[elementCounter].xleft +
                '" y1="' + inSVG[elementCounter].yup +
                '" y2="' + (inSVG[elementCounter].yup+20) + '" stroke="black" />';
              inSVG[elementCounter].yup += 20;
            }

            //--- Code for selective diff ---

            if (this.data[i].keys[20][2]) { //Differentieel is selectief
              inSVG[elementCounter].data += '<line x1="' + inSVG[elementCounter].xleft +
                '" x2="' + inSVG[elementCounter].xleft +
                '" y1="' + inSVG[elementCounter].yup +
                '" y2="' + (inSVG[elementCounter].yup+30) + '" stroke="black" />';
              inSVG[elementCounter].data += '<rect x="' + (inSVG[elementCounter].xleft+7) +
                '" y="' + (inSVG[elementCounter].yup) +
                '" width="16" height="16" stroke="black" fill="white" />';
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+19) +
                   "\" y=\"" + (inSVG[elementCounter].yup+8) +
                   "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+19) +
                   "," + (inSVG[elementCounter].yup+8) +
                   ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                   "S" + "</text>";
              inSVG[elementCounter].yup += 23;
            }

            //--- End of large code block ---

            //add the fuse below
            var nameshift = -6;
            switch (this.data[i].getKey("zekering")) {
              case "automatisch":
                inSVG[elementCounter].yup += 30;
                inSVG[elementCounter].data +=
                  '<use xlink:href="#zekering_automatisch" x=\"' + inSVG[elementCounter].xleft +
                  '" y="' + inSVG[elementCounter].yup + '" />';
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15) +
                   "\" y=\"" + (inSVG[elementCounter].yup-10) +
                   "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15) +
                   "," + (inSVG[elementCounter].yup-10) +
                   ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                   htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                break;
              case "schakelaar":
                inSVG[elementCounter].yup += 30;
                inSVG[elementCounter].data +=
                  '<use xlink:href="#zekering_empty" x=\"' + inSVG[elementCounter].xleft +
                  '" y="' + inSVG[elementCounter].yup + '" />';
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15) +
                  "\" y=\"" + (inSVG[elementCounter].yup-10) +
                  "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15) +
                  "," + (inSVG[elementCounter].yup-10) +
                  ")" +
                  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                  htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                break;
              case "overspanningsbeveiliging":
                inSVG[elementCounter].yup += 30;
                inSVG[elementCounter].data +=
                  '<use xlink:href="#overspanningsbeveiliging_inline" x=\"' + inSVG[elementCounter].xleft +
                  '" y="' + inSVG[elementCounter].yup + '" />';
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+20) +
                  "\" y=\"" + (inSVG[elementCounter].yup-10) +
                  "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+20) +
                  "," + (inSVG[elementCounter].yup-10) +
                  ")" +
                  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                  htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                  nameshift = -11;
                break;
              case "schemer":
                inSVG[elementCounter].yup += 30;
                inSVG[elementCounter].data +=
                  '<use xlink:href="#zekering_empty" x=\"' + inSVG[elementCounter].xleft +
                  '" y="' + inSVG[elementCounter].yup + '" />';
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15) +
                  "\" y=\"" + (inSVG[elementCounter].yup-10) +
                  "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15) +
                  "," + (inSVG[elementCounter].yup-10) +
                  ")" +
                  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                  htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                inSVG[elementCounter].data +=
                  '<use xlink:href="#arrow" x=\"' + (inSVG[elementCounter].xleft-18) +
                  '" y="' + (inSVG[elementCounter].yup-15) + '" />';
                inSVG[elementCounter].data +=
                  '<use xlink:href="#arrow" x=\"' + (inSVG[elementCounter].xleft-18) +
                  '" y="' + (inSVG[elementCounter].yup-12) + '" />';
                break;
              case "differentieel":
                inSVG[elementCounter].yup += 30;
                inSVG[elementCounter].data +=
                  '<use xlink:href="#zekering_automatisch" x=\"' + inSVG[elementCounter].xleft +
                  '" y="' + inSVG[elementCounter].yup + '" />';
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15) +
                  "\" y=\"" + (inSVG[elementCounter].yup-10) +
                  "\"" +
                  " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15) +
                  "," + (inSVG[elementCounter].yup-10) +
                  ")" +
                  "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                  "\u0394" + htmlspecialchars(this.data[i].getKey("differentieel_waarde") + "mA") + "</text>";
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+25) +
                   "\" y=\"" + (inSVG[elementCounter].yup-10) +
                   "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+25) +
                   "," + (inSVG[elementCounter].yup-10) +
                   ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                   htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";
                if ( (this.data[i].keys[17][2]=='A') || (this.data[i].keys[17][2]=='B') ) {
                  inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+35) +
                    "\" y=\"" + (inSVG[elementCounter].yup-10) +
                    "\"" +
                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+35) +
                    "," + (inSVG[elementCounter].yup-10) +
                    ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                    htmlspecialchars("Type " + this.data[i].keys[17][2]) + "</text>";
                  inSVG[elementCounter].xright = Math.max(inSVG[elementCounter].xright,40);
                }
                break;
              case "smelt":
                inSVG[elementCounter].yup += 30;
                inSVG[elementCounter].data +=
                  '<use xlink:href="#zekering_smelt" x=\"' + inSVG[elementCounter].xleft +
                  '" y="' + inSVG[elementCounter].yup + '" />';
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15) +
                   "\" y=\"" + (inSVG[elementCounter].yup-10) +
                   "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15) +
                   "," + (inSVG[elementCounter].yup-10) +
                   ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                   htmlspecialchars(this.data[i].getKey("aantal") + "P - " +  this.data[i].getKey("amperage") + "A") + "</text>";
                break;
              case "geen":
                inSVG[elementCounter].yup += 0;
                break;
            }

            //--Tekst naast de kring--
            var tekstlocatie = (inSVG[elementCounter].yup-40); //Standaard staat tekst boven de zekering
            if (this.data[i].getKey("zekering")=="geen") tekstlocatie+=25; //Als er geen zekering is kan tekst naar beneden
            inSVG[elementCounter].data +=
                  '<text x="' + (inSVG[elementCounter].xleft-6-20*cable_location_available) + '" '
                  + 'y="' + (tekstlocatie) + '" '
                  + 'transform="rotate(-90 ' + (inSVG[elementCounter].xleft-6-20*cable_location_available) + ',' + (tekstlocatie) + ')" '
                  + 'style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"'
                  + '>'
                  + htmlspecialchars(this.data[i].getKey("commentaar"))
                  + '</text>';

            //--Naam onderaan zetten (links-onder)--
            inSVG[elementCounter].data +=
                  '<text x="' + (inSVG[elementCounter].xleft+nameshift) + '" '
                  + 'y="' + (inSVG[elementCounter].yup+3) + '" '
                  //+ 'transform="rotate(-90 ' + (inSVG[elementCounter].xleft-6) + ',' + (inSVG[elementCounter].yup+3) + ')" '
                  + 'style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"'
                  + '>'
                  + htmlspecialchars(this.data[i].getKey("naam"))
                  + '</text>';

            //--Lijntje onder de zekering--
            inSVG[elementCounter].data += '<line x1="' + inSVG[elementCounter].xleft +
            '" x2="' + inSVG[elementCounter].xleft +
            '" y1="' + inSVG[elementCounter].yup +
            '" y2="' + (inSVG[elementCounter].yup+15) + '" stroke="black" />';
            inSVG[elementCounter].yup += 15;

            //if there is nothing, still draw an empty one
            if (inSVG[elementCounter].yup <= 0) {
              inSVG[elementCounter].xleft = 20;
              inSVG[elementCounter].xright = 20;
              inSVG[elementCounter].yup = 50;
              inSVG[elementCounter].ydown = 0;
            }

            break;

          case "":
            inSVG[elementCounter] = new SVGelement();
            break;

          default:
            var x = this.data[this.getOrdinalById(myParent)].getKey("type");
            //get image of all lowest level elements

            if ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Meerdere verbruikers") {
              inSVG[elementCounter] = this.data[i].toSVG(i !== lastChildOrdinal);
            } else if (stack == "vertical") {
              inSVG[elementCounter] = this.toSVG(this.id[i],"horizontal",0,true); //if we are still in vertical mode, switch to horizontal and take childs with us
            } else { //we are in horizontal mode and can start drawing
              //First get the image itself
              //if ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Meerdere verbruikers") {
                //the following function takes true as an argument if there is still an element following in a horizontal chain.
                //This is the case if the element is not last and/or not followed by empty tekst without border
                if (this.id[i] == myParent) {
                  inSVG[elementCounter] = this.data[i].toSVG(i !== lastChildOrdinal);
                } else {
                  inSVG[elementCounter] = this.toSVG(this.id[i],"horizontal",0,true); //if we are still in vertical mode, switch to horizontal and take childs with us
                }
              //} else {
              //  inSVG[elementCounter] = this.data[i].toSVG(false);
              //}
            }

            //If direct child of a Kring, put a vertical pipe and "nr" at the left
            if ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Kring") {

              var y1, y2: number;
              if (i !== lastChildOrdinal) {
                y1 = 0;
                y2 = inSVG[elementCounter].yup + inSVG[elementCounter].ydown;
              } else {
                y1 = inSVG[elementCounter].yup;
                y2 = inSVG[elementCounter].yup + inSVG[elementCounter].ydown;
              }

              inSVG[elementCounter].data = inSVG[elementCounter].data +
                '<line x1="' + inSVG[elementCounter].xleft +
                '" x2="' + inSVG[elementCounter].xleft +
                '" y1="' + y1 + '" y2="' + y2 + '" stroke="black" />'

              inSVG[elementCounter].data +=
                '<text x="' + (inSVG[elementCounter].xleft+9) + '" y="' + (inSVG[elementCounter].yup - 5) + '" ' +
                'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                htmlspecialchars(this.data[i].getKey("naam"))+'</text>';

              //--See if we can add childs to the left --
              //elementCounter++
              //inSVG[elementCounter] = this.toSVG(this.id[i],"horizontal");
            };

        }
        elementCounter++;

        //outSVG.xleft = Math.max(outSVG.xleft,inSVG[elementCounter].xleft);
      }
    }

    //--- If there are no elements, make at least an empty one to avoid problems here below ---

    if (elementCounter == 0) {
      inSVG[0] = new SVGelement();
    }

    //--- Now create the output element ---

    var outSVG: SVGelement = new SVGelement;
    outSVG.xleft = 0; outSVG.xright = 0; outSVG.yup = 0; outSVG.ydown = 0;
    outSVG.data = "";

    var width: number = 0; //How wide is the structure?
    var height: number = 0; //How high is the structure?

    switch (stack) {
      case "horizontal":

        var max_yup : number = 0; //What is the maximal distance above the horizontal line?
        var max_ydown : number = 0; //What is the maximal distance below the horizontal line?

        //analyse the size of the structure. Build horizontally
        for (var i = 0; i<elementCounter; i++) {
          width = width + inSVG[i].xleft + inSVG[i].xright;
          max_yup = Math.max(max_yup,inSVG[i].yup);
          max_ydown = Math.max(max_ydown,inSVG[i].ydown);
        }
        height = max_yup + max_ydown;

        //decide on the output structure
        if (elementCounter > 0) {
          outSVG.xleft = inSVG[0].xleft; //Leave space of the first element at the left
          outSVG.xright = width - outSVG.xleft;
          outSVG.xrightmin = outSVG.xright - inSVG[elementCounter-1].xright;
        } else {
          outSVG.xleft = 0;
          outSVG.xright = 0;
          outSVG.xrightmin = 0;
        };
        outSVG.yup = max_yup;
        outSVG.ydown = max_ydown;

        //--Create the output data--
        var xpos:number = 0;

        for (var i = 0; i<elementCounter; i++) {
          outSVG.data += '<svg x="' + xpos + '" y="' + (max_yup-inSVG[i].yup) + '">';
          outSVG.data += inSVG[i].data;
          outSVG.data += '</svg>';
          xpos += inSVG[i].xleft + inSVG[i].xright;
        }

        break;

      case "vertical":

        var max_xleft : number = 0; //What is the maximal distance left of the vertical line?
        var max_xright : number = 0; //What is the maximal distance right of the vertical line?

        //analyse the size of the structure. Build vertically
        for (var i = 0; i<elementCounter; i++) {
          height = height + inSVG[i].yup + inSVG[i].ydown;
          max_xleft = Math.max(max_xleft,inSVG[i].xleft);
          max_xright = Math.max(max_xright,inSVG[i].xright);
        }
        max_xleft = Math.max(minxleft, max_xleft);
        width = max_xleft + max_xright;

        //decide on the output structure
        outSVG.yup = height; //As a general rule, there is no ydown, but to be confirmed
        outSVG.ydown = 0;
        outSVG.xleft = Math.max(max_xleft,35); // foresee at least 35 for text at the left
        outSVG.xright = Math.max(max_xright,25); // foresee at least 25 at the right

        //create the output data
        var ypos:number = 0;

        for (var i = elementCounter-1; i>=0; i--) {
          outSVG.data += '<svg x="' + (outSVG.xleft-inSVG[i].xleft) + '" y="' + ypos + '">';
          outSVG.data += inSVG[i].data;
          outSVG.data += '</svg>';
          ypos += inSVG[i].yup + inSVG[i].ydown;
        }

        break;
    }

    outSVG.data += "\n";

    if (myParent==0) { //We will always foresee a 20 pixel horizontal and 5 pixel vertical margin
      var header: string = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" transform=\"scale(1,1)\" width=\"" + (width + 20) + "\" height=\"" + (height + 5) + "\">";
      header += this.outputSVGDefs();
      var footer: string = "</svg>";
      outSVG.data = header+outSVG.data+footer;
    }

    return(outSVG);

  }

  //-----------------------------------------------------

  outputSVGDefs() {
    var output: string = `
    <defs>
    <pattern id="VerticalStripe"
      x="5" y="0" width="5" height="10"
      patternUnits="userSpaceOnUse" >
      <line x1="0" y1="0" x2="0" y2="10" stroke="black" />
    </pattern>
    <g id="ster">
      <line x1="0" y1="-5" x2="0" y2="5" style="stroke:black" />
      <line x1="-4.33" y1="-2.5" x2="4.33" y2="2.5" style="stroke:black" />
      <line x1="-4.66" y1="2.5" x2="4.33" y2="-2.5" style="stroke:black" />
    </g>
    <g id="EVlader">
      <rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
      <rect style="fill:black;stroke:black" width="18" height="6" x="12" y="-10" />
      <rect style="fill:black;stroke:black" width="28" height="10" x="6" y="-4" ry="0" />
      <circle cx="12" cy="6" r="4" style="stroke:black;fill:black" />
      <circle cx="28" cy="6" r="4" style="stroke:black;fill:black" />
      <line x1="20" y1="-7.2" x2="17" y2="-2" stroke="white"/>
      <line x1="17" y1="-2" x2="23" y2="-2" stroke="white"/>
      <line x1="23" y1="-2" x2="20" y2="3.2" stroke="white"/>
      <line x1="20" y1="3.2" x2="20" y2="0.2" stroke="white"/>
      <line x1="20" y1="3.2" x2="22.6" y2="1.7" stroke="white"/>
    </g>
    <g id="lamp">
      <line x1="-10.61" y1="-10.61" x2="10.61" y2="10.61" stroke="black" stroke-width="2" />
      <line x1="-10.61" y1="10.61" x2="10.61" y2="-10.61" stroke="black" stroke-width="2" />
    </g>
    <g id="led">
      <line x1="0" y1="-7" x2="0" y2="7" stroke="black" stroke-width="2" />
      <line x1="0" y1="-7" x2="12" y2="0" stroke="black" stroke-width="2" />
      <line x1="0" y1="7" x2="12" y2="0" stroke="black" stroke-width="2" />
      <line x1="12" y1="-7" x2="12" y2="7" stroke="black" stroke-width="2" />
      <line x1="6" y1="-6" x2="7" y2="-11" stroke="black" stroke-width="1" />
      <line x1="7" y1="-11" x2="8.11" y2="-9.34" stroke="black" stroke-width="1" />
      <line x1="7" y1="-11" x2="5.34" y2="-9.9" stroke="black" stroke-width="1" />
      <line x1="9" y1="-6" x2="10" y2="-11" stroke="black" stroke-width="1" />
      <line x1="10" y1="-11" x2="11.11" y2="-9.34" stroke="black" stroke-width="1" />
      <line x1="10" y1="-11" x2="8.34" y2="-9.9" stroke="black" stroke-width="1" />
    </g>
    <g id="sinus">
      <path d="M0,0 C2,-5 8,-5 10,0 S18,5 20,0" style="stroke:black;fill:none" />
    </g>
    <g id="spot">
      <path d="M0 0 A10 10 0 0 1 10 -10" stroke="black" fill="white" stroke-width="1" />
      <path d="M0 0 A10 10 0 0 0 10 10" stroke="black" fill="white" stroke-width="1" />
      <circle cx="10" cy="0" r="6" style="stroke:black;fill:white" />
      <line x1="5.76" x2="14.24" y1="-4.24" y2="4.24" stroke="black" stroke-width="1" />
      <line x1="5.76" x2="14.24" y1="4.24" y2="-4.24" stroke="black" stroke-width="1" />
    </g>
    <g id="noodlamp_decentraal">
      <rect x="-10.61" y="-10.61" width="21.22" height="21.22" fill="white" stroke="black" />
      <circle cx="0" cy="0" r="5" style="stroke:black;fill:black" />
      <line x1="-7" y1="-7" x2="7" y2="7" stroke="black" stroke-width="2" />
      <line x1="-7" y1="7" x2="7" y2="-7" stroke="black" stroke-width="2" />
    </g>
    <g id="signalisatielamp">
      <circle cx="0" cy="0" r="5" fill="white" stroke="black" />
      <line x1="-3" y1="-3" x2="3" y2="3" stroke="black" />
      <line x1="-3" y1="3" x2="3" y2="-3" stroke="black" />
    </g>
    <g id="schakelaar_enkel">
      <line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
      <line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
      <circle cx="0" cy="0" r="5" fill="white" stroke="black" />
    </g>
    <g id="schakelaar_dubbel">
      <line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
      <line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
      <line x1="8" y1="-16" x2="13" y2="-13.5" stroke="black" />
      <circle cx="0" cy="0" r="5" fill="white" stroke="black" />
    </g>
    <g id="schakelaar_trippel">
      <line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
      <line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
      <line x1="8" y1="-16" x2="13" y2="-13.5" stroke="black" />
      <line x1="6" y1="-12" x2="11" y2="-9.5" stroke="black" />
      <circle cx="0" cy="0" r="5" fill="white" stroke="black" />
    </g>
    <g id="schakelaar_wissel_enkel">
      <line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
      <line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
      <line x1="0" y1="0" x2="-10" y2="20" stroke="black" />
      <line x1="-10" y1="20" x2="-15" y2="17.5" stroke="black" />
      <circle cx="0" cy="0" r="5" fill="white" stroke="black" />
    </g>
    <g id="schakelaar_rolluik">
      <line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
      <line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
      <line x1="0" y1="0" x2="-10" y2="-20" stroke="black" />
      <line x1="-10" y1="-20" x2="-15" y2="-17.5" stroke="black" />
      <rect x="-8" y="-8" width="16" height="16" fill="white" stroke="black" />
      <text x="0" y="6" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="16">S</text>
    </g>
    <g id="schakelaar_enkel_dim">
      <line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
      <line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
      <circle cx="0" cy="0" r="5" fill="white" stroke="black" />
      <polygon points="-1,-8 11,-8 11,-15" fill="black" stroke="black" />
    </g>
    <g id="schakelaar_wissel_dim">
      <line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
      <line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
      <line x1="0" y1="0" x2="-10" y2="20" stroke="black" />
      <line x1="-10" y1="20" x2="-15" y2="17.5" stroke="black" />
      <circle cx="0" cy="0" r="5" fill="white" stroke="black" />
      <polygon points="-1,-8 11,-8 11,-15" fill="black" stroke="black" />
    </g>
    <g id="schakelaar_kruis_enkel">
      <line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
      <line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
      <line x1="0" y1="0" x2="-10" y2="20" stroke="black" />
      <line x1="-10" y1="20" x2="-15" y2="17.5" stroke="black" />
      <line x1="0" y1="0" x2="-10" y2="-20" stroke="black" />
      <line x1="-10" y1="-20" x2="-15" y2="-17.5" stroke="black" />
      <line x1="0" y1="0" x2="10" y2="20" stroke="black" />
      <line x1="10" y1="20" x2="15" y2="17.5" stroke="black" />
      <circle cx="0" cy="0" r="5" fill="white" stroke="black" />
    </g>
    <g id="schakelaar_dubbelaansteking">
      <line x1="0" y1="0" x2="-10" y2="-20" stroke="black" />
      <line x1="-10" y1="-20" x2="-15" y2="-17.5" stroke="black" />
      <line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
      <line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
      <circle cx="0" cy="0" r="5" fill="white" stroke="black" />
    </g>
    <g id="schakelaar_wissel_dubbel">
      <line x1="0" y1="0" x2="10" y2="-20" stroke="black" />
      <line x1="10" y1="-20" x2="15" y2="-17.5" stroke="black" />
      <line x1="8" y1="-16" x2="13" y2="-13.5" stroke="black" />
      <line x1="0" y1="0" x2="-10" y2="20" stroke="black" />
      <line x1="-10" y1="20" x2="-15" y2="17.5" stroke="black" />
      <line x1="-8" y1="16" x2="-13" y2="13.5" stroke="black" />
      <circle cx="0" cy="0" r="5" fill="white" stroke="black" />
    </g>
    <g id="aansluitpunt">
      <circle cx="5" cy="0" r="5" style="stroke:black;fill:none" />
    </g>
    <g id="aftakdoos">
      <circle cx="15" cy="0" r="15" style="stroke:black;fill:none" />
      <circle cx="15" cy="0" r="7.5" style="stroke:black;fill:black" />
    </g>
    <g id="bewegingsschakelaar">
      <rect x="0" y="-13" width="10" height="26" fill="none" style="stroke:black" />
      <rect x="10" y="-13" width="30" height="26" fill="none" style="stroke:black" />
      <line x1="10" y1="13" x2="40" y2="-13"  stroke="black" />
      <line x1="15" y1="-5" x2="20" y2="-5"  stroke="black" />
      <line x1="20" y1="-10" x2="20" y2="-5"  stroke="black" />
      <line x1="20" y1="-10" x2="25" y2="-10"  stroke="black" />
      <text x="22" y="11" style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="10">PIR</text>
    </g>
    <g id="schakelaar">
      <line x1="0" y1="0" x2="5" y2="0"  stroke="black" />
      <line x1="5" y1="0" x2="35" y2="-10"  stroke="black" />
      <line x1="35" y1="0" x2="40" y2="0"  stroke="black" />
    </g>
    <g id="schemerschakelaar">
      <line x1="0" y1="0" x2="5" y2="0"  stroke="black" />
      <line x1="5" y1="0" x2="35" y2="-10"  stroke="black" />
      <line x1="35" y1="0" x2="40" y2="0"  stroke="black" />
      <use xlink:href="#arrow" x="14" y="-17" transform="rotate(90 14 -17)" />
      <use xlink:href="#arrow" x="18" y="-17" transform="rotate(90 18 -17)" />
    </g>
    <g id="stopcontact">
      <path d="M20 0 A15 15 0 0 1 35 -15" stroke="black" fill="white" stroke-width="2" />
      <path d="M20 0 A15 15 0 0 0 35 15" stroke="black" fill="white" stroke-width="2" />
      <line x1="0" y1="0" x2="20" y2="0" stroke="black" />
    </g>
    <g id="stoomoven">
      <rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
      <path d="M 6 -2 A 7 5 0 0 1 13 -7 A 7 5 0 0 1 27 -7 A 7 5 0 0 1 33 -2" stroke="black" fill="none" />
      <path d="M 6  5 A 7 5 0 0 1 13  0 A 7 5 0 0 1 27  0 A 7 5 0 0 1 33  5" stroke="black" fill="none" />
      <path d="M 6 12 A 7 5 0 0 1 13  7 A 7 5 0 0 1 27  7 A 7 5 0 0 1 33 12" stroke="black" fill="none" />
    </g>
    <g id="stopcontact_aarding">
      <line x1="20" y1="-15" x2="20" y2="15"  stroke="black" stroke-width="2" />
    </g>
    <g id="stopcontact_kinderveilig">
      <line x1="35" y1="-20" x2="35" y2="-15"  stroke="black" stroke-width="2" />
      <line x1="35" y1="20" x2="35" y2="15"  stroke="black" stroke-width="2" />
    </g>
    <g id="bel">
      <path d="M20 0 A15 15 0 0 1 0 15" stroke="black" fill="none" stroke-width="2" />
      <path d="M20 0 A15 15 0 0 0 0 -15" stroke="black" fill="none" stroke-width="2" />
      <line x1="0" y1="15" x2="0" y2="-15" stroke="black" stroke-width="2" />
    </g>
    <g id="boiler">
      <circle cx="20" cy="0" r="20" style="stroke:black;fill:url(#VerticalStripe)" />
    </g>
    <g id="boiler_accu">
      <circle cx="20" cy="0" r="20" style="stroke:black;fill:none" />
      <circle cx="20" cy="0" r="15" style="stroke:black;fill:url(#VerticalStripe)" />
    </g>
    <g id="motor">
      <circle cx="20" cy="0" r="20" style="stroke:black;fill:none" />
      <text x="20" y="6" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="16">M</text>
    </g>
    <g id="elektriciteitsmeter">
      <rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
      <line x1="0" y1="-6" x2="40" y2="-6" stroke="black" stroke-width="1" />
      <text x="20" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12">kWh</text>
    </g>
    <g id="diepvriezer">
      <rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
      <use xlink:href="#ster" x="10" y="0" />
      <use xlink:href="#ster" x="20" y="0" />
      <use xlink:href="#ster" x="30" y="0" />
    </g>
    <g id="batterij">
      <line x1="1" y1="-15" x2="1" y2="15" stroke="black"/>
      <line x1="10" y1="-8" x2="10" y2="8" stroke-width="3" stroke="black"/>
      <line x1="17" y1="0" x2="11" y2="0" stroke="black"/>
      <line x1="30" y1="0" x2="23" y2="0" stroke="black"/>
      <line x1="42" y1="0" x2="36" y2="0" stroke="black"/>
      <line x1="43" y1="-15" x2="43" y2="15" stroke="black"/>
      <line x1="51" y1="-8" x2="51" y2="8" stroke-width="3" stroke="black"/>
    </g>
    <g id="zonnepaneel">
      <rect x="0" y="-12" width="80" height="30" fill="none" style="stroke:black" />
      <line x1="3" y1="3" x2="77" y2="3" stroke="black" />
      <line x1="20" y1="-9" x2="20" y2="15" stroke="black" />
      <line x1="40" y1="-9" x2="40" y2="15" stroke="black" />
      <line x1="60" y1="-9" x2="60" y2="15" stroke="black" />
    </g>
    <g id="drukknop">
      <circle cx="12" cy="0" r="12" style="stroke:black;fill:none" />
      <circle cx="12" cy="0" r="7" style="stroke:black;fill:none" />
    </g>
    <g id="teleruptor">
      <rect x="0" y="-13" width="40" height="26" fill="none" style="stroke:black" />
      <line x1="8" y1="6" x2="16" y2="6"  stroke="black" />
      <line x1="24" y1="6" x2="32" y2="6"  stroke="black" />
      <line x1="16" y1="-6" x2="16" y2="6"  stroke="black" />
      <line x1="24" y1="-6" x2="24" y2="6"  stroke="black" />
    </g>
    <g id="dimmer">
      <rect x="0" y="-13" width="40" height="26" fill="none" style="stroke:black" />
      <line x1="10" y1="5" x2="30" y2="6"  stroke="black" />
      <line x1="10" y1="5" x2="10" y2="-5"  stroke="black" />
      <line x1="10" y1="-5" x2="30" y2="5"  stroke="black" />
    </g>
    <g id="relais">
      <rect x="0" y="-13" width="40" height="26" fill="none" style="stroke:black" />
      <line x1="10" y1="-13" x2="30" y2="13"  stroke="black" />
    </g>
    <g id="minuterie">
      <rect x="0" y="-13" width="40" height="26" fill="none" style="stroke:black" />
      <text x="20" y="6" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="16">t</text>
    </g>
    <g id="thermostaat">
      <rect x="0" y="-13" width="40" height="26" fill="none" style="stroke:black" />
      <circle cx="20" cy="0" r="8" style="stroke:black;fill:none" />
      <line x1="12" y1="0" x2="28" y2="0"  stroke="black" />
    </g>
    <g id="tijdschakelaar">
      <rect x="0" y="-13" width="40" height="26" fill="none" style="stroke:black" />
      <circle cx="11" cy="0" r="8" style="stroke:black;fill:none" />
      <line x1="10" y1="0"  x2="17" y2="0"  stroke="black" />
      <line x1="11" y1="-6" x2="11" y2="1"  stroke="black" />
      <line x1="21" y1="0"  x2="25" y2="0"  stroke="black" />
      <line x1="25" y1="0"  x2="31" y2="-5"  stroke="black" />
      <line x1="31" y1="0"  x2="36" y2="0"  stroke="black" />
    </g>
    <g id="droogkast">
      <rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
      <circle cx="15" cy="-7.5" r="5" style="stroke:black;fill:none" />
      <circle cx="25" cy="-7.5" r="5" style="stroke:black;fill:none" />
      <circle cx="20" cy="7.5" r="3" style="stroke:black;fill:black" />
    </g>
    <g id="omvormer">
      <rect x="0" y="-15" width="60" height="30" fill="none" style="stroke:black" />
      <line x1="35" y1="-12" x2="25" y2="12" stroke="black" />
      <text x="15" y="-1" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">AC</text>
      <text x="45" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">DC</text>
    </g>
    <g id="overspanningsbeveiliging">
      <rect x="0" y="-15" width="15" height="30" fill="none" style="stroke:black" />
      <line x1="7.5" y1="-18" x2="7.5" y2="-5" stroke="black" />
      <line x1="7.5" y1="-5" x2="4.5" y2="-9" stroke="black" />
      <line x1="7.5" y1="-5" x2="10.5" y2="-9" stroke="black" />
      <line x1="7.5" y1="18" x2="7.5" y2="5" stroke="black" />
      <line x1="7.5" y1="5" x2="4.5" y2="9" stroke="black" />
      <line x1="7.5" y1="5" x2="10.5" y2="9" stroke="black" />
    </g>
    <g id="koelkast">
      <rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
      <use xlink:href="#ster" x="20" y="0" />"
    </g>
    <g id="kookfornuis">
      <rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
      <circle cx="10" cy="10" r="3" style="stroke:black;fill:black" />
      <circle cx="30" cy="10" r="3" style="stroke:black;fill:black" />
      <circle cx="30" cy="-10" r="3" style="stroke:black;fill:black" />
    </g>
    <g id="microgolf">
      <rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
      <use xlink:href="#sinus" x="10" y="-10" />"
      <use xlink:href="#sinus" x="10" y="0" />"
      <use xlink:href="#sinus" x="10" y="10" />"
    </g>
    <g id="oven">
      <rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
      <line x1="0" y1="-5" x2="40" y2="-5" stroke="black" />
      <circle cx="20" cy="7.5" r="3" style="stroke:black;fill:black" />
    </g>
    <g id="usblader">
      <rect x="0" y="-15" width="60" height="30" fill="none" style="stroke:black" />
      <circle cx="12" cy="-5" r="5" style="stroke:black;fill:none" />
      <circle cx="19" cy="-5" r="5" style="stroke:black;fill:none" />
      <text x="15" y="8" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="8">AC/DC</text>
      <text x="42" y="4" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="11">USB</text>
    </g>
    <g id="vaatwasmachine">
      <rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
      <line x1="0" y1="-20" x2="40" y2="20" style="stroke:black;fill:none" />
      <line x1="40" y1="-20" x2="0" y2="20" style="stroke:black;fill:none" />
      <circle cx="20" cy="0" r="8" style="stroke:black;fill:white" />
    </g>
    <g id="ventilator">
      <rect x="0" y="-15" width="30" height="30" fill="none" style="stroke:black" />
      <circle cx="10" cy="0" r="5" style="stroke:black;fill:none" />
      <circle cx="20" cy="0" r="5" style="stroke:black;fill:none" />
    </g>
    <g id="transformator">
      <circle cx="8" cy="0" r="8" style="stroke:black;fill:none" />
      <circle cx="20" cy="0" r="8" style="stroke:black;fill:none" />
    </g>
    <g id="verwarmingstoestel">
      <rect x="0" y="-15" width="50" height="30" fill="url(#VerticalStripe)" style="stroke:black" />
    </g>
    <g id="verwarmingstoestel_accu">
      <rect x="0" y="-15" width="50" height="30" fill="none" style="stroke:black" />
      <rect x="5" y="-10" width="40" height="20" fill="url(#VerticalStripe)" style="stroke:black" />
    </g>
    <g id="verwarmingstoestel_accu_ventilator">
      <rect x="0" y="-15" width="70" height="30" fill="none" style="stroke:black" />
      <rect x="5" y="-10" width="35" height="20" fill="url(#VerticalStripe)" style="stroke:black" />
      <circle cx="50" cy="0" r="5" style="stroke:black;fill:none" />
      <circle cx="60" cy="0" r="5" style="stroke:black;fill:none" />
    </g>
    <g id="verbruiker">
      <rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
    </g>
    <g id="wasmachine">
      <rect x="0" y="-20" width="40" height="40" fill="none" style="stroke:black" />
      <circle cx="20" cy="0" r="3" style="stroke:black;fill:black" />
      <circle cx="20" cy="0" r="15" style="stroke:black;fill:none" />
    </g>
    <g transform="rotate(-20)" id="zekering_automatisch">
      <line x1="0" y1="-30" x2="0" y2="0"  stroke="black" />
      <rect x="-4" y="-30" width="4" height="10" style="fill:black" />
    </g>
    <g id="zekering_smelt">
      <rect x="-4" y="-30" width="8" height="30" style="stroke:black;fill:none" />
      <line x1="0" y1="-30" x2="0" y2="0" stroke="black" />
    </g>
    <g id="overspanningsbeveiliging_inline">   -> shift x -7.5  y -15
      <rect x="-7.5" y="-30" width="15" height="30" fill="none" style="stroke:black" />
      <line x1="0" y1="-30" x2="0" y2="-20" stroke="black" />
      <line x1="0" y1="-20" x2="-3" y2="-24" stroke="black" />
      <line x1="0" y1="-20" x2="3" y2="-24" stroke="black" />
      <line x1="0" y1="0" x2="0" y2="-10" stroke="black" />
      <line x1="0" y1="-10" x2="-3" y2="-6" stroke="black" />
      <line x1="0" y1="-10" x2="3" y2="-6" stroke="black" />
    </g>
    <g transform="rotate(-20)" id="zekering_empty">
      <line x1="0" y1="-30" x2="0" y2="0"  stroke="black" />
    </g>
    <g id="arrow">
      <line x1="0" y1="0" x2="8" y2="0" stroke="black" />
      <line x1="8" y1="0" x2="5" y2="-1" stroke="black" />
      <line x1="8" y1="0" x2="5" y2="1" stroke="black" />
    </g>
    <g id="gas_ventilator">
      <polygon points="-6,5.2 0,-5.2 6,5.2" fill="black" stroke="black" />
    </g>
    <g id="gas_atmosferisch">
      <polygon points="-6,5.2 0,-5.2 6,5.2" fill="white" stroke="black" />
    </g>
    <g id="bliksem">
      <line x1="0" y1="-5.2" x2="-3" y2="0" stroke="black"/>
      <line x1="-3" y1="0" x2="3" y2="0" stroke="black"/>
      <line x1="3" y1="0" x2="0" y2="5.2" stroke="black"/>
      <line x1="0" y1="5.2" x2="0" y2="2.2" stroke="black"/>
      <line x1="0" y1="5.2" x2="2.6" y2="3.7" stroke="black"/>
    </g>
    <g id="moving_man"
       transform="matrix(0.0152987,0,0,0.01530866,0,0)">
       <path
         d="M 710.7,10.1 C 904.8,5.2 908.6,261.4 730.9,278.4 637.5,287.3 566.3,181.5 603.8,90.8 623.4,43.4 668.7,12.9 711.4,10.1 c 1.1,-0.1 2.8,26.1 1.7,26.2 -31.4,2 -74.8,32.1 -89.1,74.7 -26.8,79.9 47,156.6 125.1,139.2 123.9,-27.6 114.1,-218.5 -36.3,-214 -0.7,0 -3.2,-26 -2.1,-26.1 z"
         id="path4" stroke="black" stroke-width="10" />
       <path
         d="m 545.3,225.9 c -67.8,-5 -133.2,0 -199.7,0 -20.7,13.6 -115,100.7 -121.1,121.1 -5.7,19.1 6.2,31.9 12.1,40.4 60.1,18.3 96.7,-60.4 133.2,-88.8 29.6,0 59.2,0 88.8,0 -59.2,78.9 -190.7,169.9 -58.5,264.3 -27.6,31.6 -55.1,63.2 -82.7,94.8 -46.9,-14.7 -165.6,-41.3 -199.7,-18.2 -7,21 -4.8,32.1 6.1,48.4 34.1,10.3 205.5,53.2 232,36.3 34.3,-37.7 68.6,-75.3 102.9,-113 32.3,27.6 64.6,55.2 96.9,82.7 -1,62.6 -14.6,249.9 24.2,266.3 10.2,3 19.1,0.5 28.2,-2 5.4,-7.4 10.8,-14.8 16.1,-22.2 6.9,-27 0.3,-272.6 -6.1,-282.5 -37.7,-32.9 -75.3,-65.9 -113,-98.9 1.3,-1.3 2.7,-2.7 4,-4 45.7,-48.4 91.5,-96.9 137.2,-145.3 20.2,19.5 40.4,39 60.5,58.5 16.7,35.8 152.2,25.4 179.6,6.1 2,-8.1 4,-16.1 6.1,-24.2 -16,-40.1 -71.7,-31.8 -127.1,-30.3 C 741.8,384.3 590.6,253 545.5,225.7 c -1.7,-1 14.9,-23.3 15.4,-22.4 -2.2,-3.5 126,97.7 134.4,107.4 9.4,9.1 55.2,51.5 82.1,78.4 68.5,-2 122,-6.5 137.2,46.4 4.9,17.1 1.9,37.1 -8.1,50.4 -18.8,25.3 -156,39.1 -197.7,18.2 -20.2,-20.2 -40.4,-40.4 -60.5,-60.5 -18.8,18.2 -37.7,36.3 -56.5,54.5 -16.8,18.2 -33.6,36.3 -50.4,54.5 32.9,28.9 65.9,57.8 98.9,86.8 11.2,17.9 18.9,272.3 8.1,306.7 -4.8,15.2 -19.9,32.9 -34.3,38.3 C 498.3,1028.1 527.8,798.3 529.4,706 505.9,686.5 482.3,667 458.8,647.5 427.9,676.7 402,732.8 362,750.4 333.5,762.9 140.3,728.4 113.8,712.1 100.1,703.6 89.3,686 85.6,667.7 59.7,543.2 281.5,646 321.3,617.4 334.7,601.3 348.2,585.1 361.7,569 266.4,454.2 335.5,414.9 402.1,326.9 c 0,-0.7 0,-1.3 0,-2 -8.1,0 -16.1,0 -24.2,0 -26.3,36.3 -124.9,147 -173.5,64.6 -35.9,-60.8 103.6,-172.2 141.1,-189.8 56.7,-3.8 167.5,-11 215.9,4 0.8,0.7 -14.9,22.6 -16.1,22.2 z"
         id="path6" stroke="black" stroke-width="10" /></g>
    </defs>
    `
    return(output);
  }

}
