/*****************************************************************************
  CLASS Hierarchical_List

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
  print_table: Print_Table;
  length: number;
  curid: number;
  mode: string; //can be "edit" or "move"

  //-----------------------------------------------------

  constructor() {
    this.length = 0;
    this.data = new Array<List_Item>();
    this.active = new Array<Boolean>();
    this.id = new Array<number>();
    this.print_table = new Print_Table();
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

  createItem(electroType: string) {
    //Create the object
    let tempval;
    switch (electroType) {
      case 'Aansluitpunt': case 'Leeg': tempval = new Aansluitpunt(structure); break;
      case 'Aftakdoos': tempval = new Aftakdoos(structure); break;
      case 'Batterij': tempval = new Batterij(structure); break;
      case 'Bel': tempval = new Bel(structure); break;
      case 'Boiler': tempval = new Boiler(structure); break;
      case 'Bord': tempval = new Bord(structure); break;
      case 'Diepvriezer': tempval = new Diepvriezer(structure); break;
      case 'Domotica': tempval = new Domotica(structure); break; 
      case 'Domotica gestuurde verbruiker': tempval = new Domotica_gestuurde_verbruiker(structure); break; 
      case 'Droogkast': tempval = new Droogkast(structure); break; 
      case 'Drukknop': tempval = new Drukknop(structure); break; 
      case 'Elektriciteitsmeter': tempval = new Elektriciteitsmeter(structure); break; 
      case 'Elektrische oven': tempval = new Elektrische_oven(structure); break; 
      case 'EV lader': tempval = new EV_lader(structure); break;
      case 'Ketel': tempval = new Ketel(structure); break; 
      case 'Koelkast': tempval = new Koelkast(structure); break;
      case 'Kookfornuis': tempval = new Kookfornuis(structure); break;
      case 'Lichtcircuit': tempval = new Lichtcircuit(structure); break;
      case 'Lichtpunt': tempval = new Lichtpunt(structure); break;
      case 'Meerdere verbruikers': tempval = new Meerdere_verbruikers(structure); break;
      case 'Microgolfoven': tempval = new Microgolfoven(structure); break;
      case 'Motor': tempval = new Motor(structure); break;
      case 'Omvormer': tempval = new Omvormer(structure); break;
      case 'Overspanningsbeveiliging': tempval = new Overspanningsbeveiliging(structure); break;
      case 'Schakelaars': tempval = new Schakelaars(structure); break;
      case 'Splitsing': tempval = new Splitsing(structure); break;
      case 'Stoomoven': tempval = new Stoomoven(structure); break;
      case 'Stopcontact': tempval = new Stopcontact(structure); break;
      case 'Transformator': tempval = new Transformator(structure); break;
      case 'USB lader': tempval = new USB_lader(structure); break;
      case 'Vaatwasmachine': tempval = new Vaatwasmachine(structure); break;
      case 'Ventilator': tempval = new Ventilator(structure); break;
      case 'Verbruiker': tempval = new Verbruiker(structure); break;
      case 'Verlenging': tempval = new Verlenging(structure); break;
      case 'Verwarmingstoestel': tempval = new Verwarmingstoestel(structure); break;
      case 'Vrije ruimte': tempval = new Vrije_ruimte(structure); break;
      case 'Vrije tekst': tempval = new Vrije_tekst(structure); break;
      case 'Warmtepomp/airco': tempval = new Warmtepomp(structure); break;
      case 'Wasmachine': tempval = new Wasmachine(structure); break;
      case 'Zeldzame symbolen': tempval = new Zeldzame_symbolen(structure); break;
      case 'Zonnepaneel': tempval = new Zonnepaneel(structure); break;
      default: tempval = new Electro_Item(structure);
    }
    tempval.keys[0][2] = electroType;

    //First set the correct identifyer
    tempval.id = this.curid;
    tempval.parent = 0;
    tempval.indent = 0;

    //Return the Object
    return(tempval);
  }

  //-----------------------------------------------------

  addItem(electroType: string) {
    //First create the item
    let tempval = this.createItem(electroType);
    
    //Then push the item into the queue
    this.data.push(tempval);
    this.active.push(true);
    this.id.push(this.curid);

    //Adjust length of the queue and future identifyer
    this.curid += 1;
    this.length += 1;

    //Return the Object
    return(tempval);
  }

  //-----------------------------------------------------

  insertItemBeforeId(my_item: List_Item, my_id: number) {
    for (var i = 0; i<this.length; i++) {
      if (this.id[i]==my_id) {
        //First set the correct identifyer
        my_item.id = this.curid;
        my_item.parent = this.data[i].parent;
        my_item.indent = this.data[i].indent;
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
    var swapItem: List_Item = new List_Item(this);
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
    var swapItem: List_Item = new List_Item(this);
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
    let currentOrdinal = this.getOrdinalById(my_id);
    //-- Then create a clone of the object and assign the correct parent_id
    if(arguments.length < 2) {
      parent_id = this.data[currentOrdinal].parent
    }
    let parentOrdinal = this.getOrdinalById(parent_id);

    let my_item = this.createItem(this.data[currentOrdinal].keys[0][2]);
    my_item.clone(this.data[currentOrdinal]);
    //var original_length = this.length;

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
    for (var i = 0; i<this.length; i++) {
      if (this.id[i]==my_id) {
        for (var j=this.length-1; j>=0; j--) { //We need to loop in opposite sense
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

  adjustTypeByOrdinal(ordinal: number, electroType : string, resetkeys? : boolean) {
    //this.data[ordinal].keys[0][2] = electroType; //We call setKey to ensure that also resetKeys is called in the Electro_Item

    let tempval = this.createItem(electroType);

    (<any> Object).assign(tempval,this.data[ordinal]);
    tempval.keys[0][2] = electroType; //We need to do this again as we overwrote it with assign
    if (resetkeys) tempval.resetKeys();

    this.data[ordinal] = tempval;
  }

  //-----------------------------------------------------

  adjustTypeById(my_id: number, electroType : string, resetkeys? : boolean) {
    let ordinal = structure.getOrdinalById(my_id);
    this.adjustTypeByOrdinal(ordinal, electroType, resetkeys);
  }

  //-----------------------------------------------------

  tekenVerticaleLijnIndienKindVanKring(item: Electro_Item, mySVG: SVGelement) {

      // Eerst checken of het wel degelijk een kind van een kring is
      let parent:Electro_Item = (item.getParent() as Electro_Item);
      if (parent != null) {
          if (parent.keys[0][2] == "Kring") {

              // Bepaal hoogte van de lijn. Idien dit het laatste element van de kring is is het een halve lijn,
              // zoniet een hele lijn
              let y1, y2: number;
              let lastOrdinalInKring = 0;
              let myOrdinal = this.getOrdinalById(item.id);

              for (let i = 0; i<item.sourcelist.length; i++) {
                  if (this.active[i] && (this.data[i].parent == parent.id)) lastOrdinalInKring = i;
              }

              if (myOrdinal < lastOrdinalInKring) { // Teken een verticale lijn over de volledige hoogte
                  y1 = 0;
                  y2 = mySVG.yup + mySVG.ydown;
              } else { // Teken een verticale lijn over de halve hoogte
                  y1 = mySVG.yup;
                  y2 = mySVG.yup + mySVG.ydown;    
              }

              // Teken de lijn
              mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + y1 + '" y2="' + y2 + '" stroke="black" />'

              // Plaats het nummer van het item naast de lijn
              mySVG.data +=
                '<text x="' + (mySVG.xleft+9) + '" y="' + (mySVG.yup - 5) + '" ' +
                'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                htmlspecialchars(item.keys[10][2])+'</text>';
            }
      };
  };

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
      output += "<button onclick=\"HLAdd()\">Voeg eerste object toe of kies bovenaan \"Nieuw\"</button><br>"; //no need for the add button if we have items
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
        //empty tekst at the end does not count as a valid last child of meerdere verbruikers (zo vermijden we een streepje op het einde van het stopcontact)
        if (this.active[i] && (this.data[i].keys[16][2] != "zonder kader") && (this.data[i].parent == myParent)) lastChildOrdinal = i;
      } 
    } else if ( (myParent != 0) && ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Kring") ) {
        for (var i = 0; i<this.length; i++) {
          //Hier is vrije tekst wel effectieve verbruiker
          if (this.active[i] && (this.data[i].parent == myParent)) lastChildOrdinal = i;
        }
    } else { //if not a child of meerdere verbruikers, we also allow the parent to be the lastChild
      for (var i = 0; i<this.length; i++) {
        //empty tekst at the end does not count as a valid last child of meerdere verbruikers (zo vermijden we een streepje op het einde van het stopcontact)
        if (this.active[i] && (this.data[i].keys[16][2] != "zonder kader") && (this.data[i].parent == myParent)) lastChildOrdinal = i;
        if (this.active[i] && (this.data[i].keys[16][2] != "zonder kader") && (includeparent==true) && (this.id[i] == myParent)) lastChildOrdinal = i;
      }
    }

    for (var i = 0; i<this.length; i++) {
      if (this.active[i] && ( (this.data[i].parent == myParent) || ( (includeparent==true) && (this.id[i] == myParent) ) ) ) {
        switch (this.data[i].getKey("type")) {
          
          case "Bord":
            inSVG[elementCounter] = this.data[i].toSVG();
            break;

          case "Splitsing":
            inSVG[elementCounter] = this.data[i].toSVG();
            break;

          case "Domotica":
            inSVG[elementCounter] = this.data[i].toSVG(); //Maak de tekening van Domotica
            this.tekenVerticaleLijnIndienKindVanKring(this.data[i] as Electro_Item,inSVG[elementCounter]);
            break;

          case "Meerdere verbruikers":
            inSVG[elementCounter] = this.data[i].toSVG(); //Maak de tekening van meerdere verbruikers
            this.tekenVerticaleLijnIndienKindVanKring(this.data[i] as Electro_Item,inSVG[elementCounter]);
            break;

          case "Vrije ruimte":
            inSVG[elementCounter] = this.data[i].toSVG(); //Maak de tekening
            break;  

          case "Domotica gestuurde verbruiker":
            inSVG[elementCounter] = this.data[i].toSVG(); //Maak de tekening
            this.tekenVerticaleLijnIndienKindVanKring(this.data[i] as Electro_Item,inSVG[elementCounter]);         
            break;            

          case "Aansluiting":
            var extrashift = 0;
            if (this.data[i].keys[24][2] != "") {
              extrashift += 50;
            }

            //get image of the entire stack, make sure it is shifted to the right sufficiently so-that the counter can be added below
            inSVG[elementCounter] = this.toSVG(this.id[i],"vertical",150+extrashift); //shift 100 to the right

            //add the fuse below

            inSVG[elementCounter].data += '<line x1="' + inSVG[elementCounter].xleft +
              '" x2="' + inSVG[elementCounter].xleft +
              '" y1="' + inSVG[elementCounter].yup +
              '" y2="' + (inSVG[elementCounter].yup+20) + '" stroke="black" />';
            inSVG[elementCounter].yup += 20;

            switch (this.data[i].getKey("zekering")) {

              case "automatisch":

                //Basiscode voor het amperage
                var numlines = 1;
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

                //Code om de curve toe te voegen
                if ( (this.data[i].keys[17][2]=='B') || (this.data[i].keys[17][2]=='C') || (this.data[i].keys[17][2]=='D') ) {
                  numlines = numlines + 1;
                  inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "\" y=\"" + (inSVG[elementCounter].yup-10) +
                    "\"" +
                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "," + (inSVG[elementCounter].yup-10) +
                    ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                    htmlspecialchars("Curve " + this.data[i].keys[17][2]) + "</text>";
                }

                //Code om kortsluitvermogen toe te voegen
                if ( (this.data[i].keys[22][2]!='') ) {
                  numlines = numlines + 1;
                  inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "\" y=\"" + (inSVG[elementCounter].yup-10) +
                    "\"" +
                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "," + (inSVG[elementCounter].yup-10) +
                    ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                    htmlspecialchars("" + this.data[i].keys[22][2]) + "kA</text>";
                }

                //genoeg plaats voorzien aan de rechterkant en eindigen
                inSVG[elementCounter].xright = Math.max(inSVG[elementCounter].xright,20+11*(numlines-1));
                break;

              case "differentieel":

                //Code als differentieel selectief is
                if (this.data[i].keys[20][2]) {
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

                //Basiscode voor het amperage en de sluitstroom
                var numlines = 2;
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
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+26) +
                   "\" y=\"" + (inSVG[elementCounter].yup-10) +
                   "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+26) +
                   "," + (inSVG[elementCounter].yup-10) +
                   ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                   htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";

                //Code om het type toe te voegen
                if ( (this.data[i].keys[17][2]=='A') || (this.data[i].keys[17][2]=='B') ) {
                  numlines = numlines + 1;
                  inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "\" y=\"" + (inSVG[elementCounter].yup-10) +
                    "\"" +
                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "," + (inSVG[elementCounter].yup-10) +
                    ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                    htmlspecialchars("Type " + this.data[i].keys[17][2]) + "</text>";
                }

                //Code om kortsluitvermogen toe te voegen
                if ( (this.data[i].keys[22][2]!='') ) {
                  numlines = numlines + 1;
                  inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "\" y=\"" + (inSVG[elementCounter].yup-10) +
                    "\"" +
                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "," + (inSVG[elementCounter].yup-10) +
                    ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                    htmlspecialchars("" + this.data[i].keys[22][2]) + "kA</text>";
                }

                //genoeg plaats voorzien aan de rechterkant en eindigen
                inSVG[elementCounter].xright = Math.max(inSVG[elementCounter].xright,20+11*(numlines-1));
                break;

              case "differentieelautomaat":

                //Code als differentieel selectief is
                if (this.data[i].keys[20][2]) {
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

                //Basiscode voor het amperage en de sluitstroom
                var numlines = 2;
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
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+26) +
                   "\" y=\"" + (inSVG[elementCounter].yup-10) +
                   "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+26) +
                   "," + (inSVG[elementCounter].yup-10) +
                   ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                   htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";

                //Code om de curve toe te voegen
                if ( (this.data[i].keys[18][2]=='B') || (this.data[i].keys[18][2]=='C') || (this.data[i].keys[18][2]=='D') ) {
                  numlines = numlines + 1;
                  inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                   "\" y=\"" + (inSVG[elementCounter].yup-10) +
                   "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                   "," + (inSVG[elementCounter].yup-10) +
                   ")" +
                   "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                   htmlspecialchars("Curve " + this.data[i].keys[18][2]) + "</text>";
                }

                //Code om het type toe te voegen
                if ( (this.data[i].keys[17][2]=='A') || (this.data[i].keys[17][2]=='B') ) {
                  numlines = numlines + 1;
                  inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "\" y=\"" + (inSVG[elementCounter].yup-10) +
                    "\"" +
                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "," + (inSVG[elementCounter].yup-10) +
                    ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                    htmlspecialchars("Type " + this.data[i].keys[17][2]) + "</text>";
                }

                //Code om kortsluitvermogen toe te voegen
                if ( (this.data[i].keys[22][2]!='') ) {
                  numlines = numlines + 1;
                  inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "\" y=\"" + (inSVG[elementCounter].yup-10) +
                    "\"" +
                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "," + (inSVG[elementCounter].yup-10) +
                    ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                    htmlspecialchars("" + this.data[i].keys[22][2]) + "kA</text>";
                }

                //genoeg plaats voorzien aan de rechterkant en eindigen
                inSVG[elementCounter].xright = Math.max(inSVG[elementCounter].xright,20+11*(numlines-1));
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
              '" x2="' + (21+extrashift)  + '" '+
              'y2="' + (inSVG[elementCounter].yup+25) + '" stroke="black"></line>';

            //draw outgoing connecting lines
            inSVG[elementCounter].data += '<line x1="' + (61+extrashift) + '" ' +
              'y1="' + (inSVG[elementCounter].yup+25) +
              '" x2="' + (inSVG[elementCounter].xleft) + '" '+
              'y2="' + (inSVG[elementCounter].yup+25) + '" stroke="black"></line>';
            inSVG[elementCounter].data += '<line x1="' + (inSVG[elementCounter].xleft) +
              '" y1="' + (inSVG[elementCounter].yup) +
              '" x2="' + (inSVG[elementCounter].xleft) + '" '+
              'y2="' + (inSVG[elementCounter].yup+25) + '" stroke="black"></line>';

            //Draw the counter
            inSVG[elementCounter].data += '<use xlink:href="#elektriciteitsmeter" x="' + (21+extrashift) + '" y="' + (inSVG[elementCounter].yup+25) + '"></use>';

            //set kabel type Text
            inSVG[elementCounter].data += '<text x="' + (85+extrashift) + '" y="' + (inSVG[elementCounter].yup+40) +
               '" style="text-anchor:left" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
               htmlspecialchars(this.data[i].getKey("kabel")) + '</text>';
            if (this.data[i].keys[24][2] != "") {
              inSVG[elementCounter].data += '<text x="55" y="' + (inSVG[elementCounter].yup+40) +
                 '" style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                 htmlspecialchars(this.data[i].keys[24][2]) + '</text>';
            }

            //inSVG[elementCounter].xleft = Math.max(inSVG[elementCounter].xleft,60);
            //inSVG[elementCounter].xright = Math.max(inSVG[elementCounter].xright,10);
            //Foresee sufficient room below for the counter
            inSVG[elementCounter].yup += 25;
            inSVG[elementCounter].ydown = 25;

            //If adres is not empty, put it below
            if (!(/^\s*$/.test(this.data[i].keys[15][2]))) { //check if adres contains only white space
              inSVG[elementCounter].data += '<text x="' + (41+extrashift) + '" y="' + (inSVG[elementCounter].yup+inSVG[elementCounter].ydown+10) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.data[i].keys[15][2]) + '</text>';
              inSVG[elementCounter].ydown += 15;
            }

            //--Naam onderaan zetten (links-onder)--
            inSVG[elementCounter].data +=
                  '<text x="' + (inSVG[elementCounter].xleft+(-6)) + '" '
                  + 'y="' + (inSVG[elementCounter].yup-10) + '" '
                  //+ 'transform="rotate(-90 ' + (inSVG[elementCounter].xleft-6) + ',' + (inSVG[elementCounter].yup+3) + ')" '
                  + 'style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"'
                  + '>'
                  + htmlspecialchars(this.data[i].keys[23][2])
                  + '</text>';


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

            //--- Now the bottom part ---

            //add the fuse below
            var nameshift = -6;
            switch (this.data[i].getKey("zekering")) {
              case "automatisch":

                //Basiscode voor het amperage
                var numlines = 1;
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

                //Code om de curve toe te voegen
                if ( (this.data[i].keys[17][2]=='B') || (this.data[i].keys[17][2]=='C') || (this.data[i].keys[17][2]=='D') ) {
                  numlines = numlines + 1;
                  inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "\" y=\"" + (inSVG[elementCounter].yup-10) +
                    "\"" +
                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "," + (inSVG[elementCounter].yup-10) +
                    ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                    htmlspecialchars("Curve " + this.data[i].keys[17][2]) + "</text>";
                }

                //Code om kortsluitvermogen toe te voegen
                if ( (this.data[i].keys[22][2]!='') ) {
                  numlines = numlines + 1;
                  inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "\" y=\"" + (inSVG[elementCounter].yup-10) +
                    "\"" +
                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "," + (inSVG[elementCounter].yup-10) +
                    ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                    htmlspecialchars("" + this.data[i].keys[22][2]) + "kA</text>";
                }

                //genoeg plaats voorzien aan de rechterkant en eindigen
                inSVG[elementCounter].xright = Math.max(inSVG[elementCounter].xright,20+11*(numlines-1));
                break;  

              case "differentieel":

                //Basiscode voor het amperage en de sluitstroom
                var numlines = 2;
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
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+26) +
                   "\" y=\"" + (inSVG[elementCounter].yup-10) +
                   "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+26) +
                   "," + (inSVG[elementCounter].yup-10) +
                   ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                   htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";

                //Code om het type toe te voegen
                if ( (this.data[i].keys[17][2]=='A') || (this.data[i].keys[17][2]=='B') ) {
                  numlines = numlines + 1;
                  inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "\" y=\"" + (inSVG[elementCounter].yup-10) +
                    "\"" +
                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "," + (inSVG[elementCounter].yup-10) +
                    ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                    htmlspecialchars("Type " + this.data[i].keys[17][2]) + "</text>";

                }

                //Code om kortsluitvermogen toe te voegen
                if ( (this.data[i].keys[22][2]!='') ) {
                  numlines = numlines + 1;
                  inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "\" y=\"" + (inSVG[elementCounter].yup-10) +
                    "\"" +
                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "," + (inSVG[elementCounter].yup-10) +
                    ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                    htmlspecialchars("" + this.data[i].keys[22][2]) + "kA</text>";
                }

                //genoeg plaats voorzien aan de rechterkant en eindigen
                inSVG[elementCounter].xright = Math.max(inSVG[elementCounter].xright,20+11*(numlines-1));
                break;

              case "differentieelautomaat":

                //Basiscode voor het amperage en de sluitstroom
                var numlines = 2;
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
                inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+26) +
                   "\" y=\"" + (inSVG[elementCounter].yup-10) +
                   "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+26) +
                   "," + (inSVG[elementCounter].yup-10) +
                   ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                   htmlspecialchars(this.data[i].getKey("aantal") + "P - " + this.data[i].getKey("amperage") + "A") + "</text>";

                //Code om de curve toe te voegen
                if ( (this.data[i].keys[18][2]=='B') || (this.data[i].keys[18][2]=='C') || (this.data[i].keys[18][2]=='D') ) {
                 numlines = numlines + 1;
                 inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                   "\" y=\"" + (inSVG[elementCounter].yup-10) +
                   "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                   "," + (inSVG[elementCounter].yup-10) +
                   ")" +
                   "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                   htmlspecialchars("Curve " + this.data[i].keys[18][2]) + "</text>";
                }

                //Code om het type toe te voegen
                if ( (this.data[i].keys[17][2]=='A') || (this.data[i].keys[17][2]=='B') ) {
                  numlines = numlines + 1;
                  inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "\" y=\"" + (inSVG[elementCounter].yup-10) +
                    "\"" +
                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "," + (inSVG[elementCounter].yup-10) +
                    ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                    htmlspecialchars("Type " + this.data[i].keys[17][2]) + "</text>";
                }

                //Code om kortsluitvermogen toe te voegen
                if ( (this.data[i].keys[22][2]!='') ) {
                  numlines = numlines + 1;
                  inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "\" y=\"" + (inSVG[elementCounter].yup-10) +
                    "\"" +
                    " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15+11*(numlines-1)) +
                    "," + (inSVG[elementCounter].yup-10) +
                    ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                    htmlspecialchars("" + this.data[i].keys[22][2]) + "kA</text>";
                }

                //genoeg plaats voorzien aan de rechterkant en eindigen
                inSVG[elementCounter].xright = Math.max(inSVG[elementCounter].xright,20+11*(numlines-1));
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

              case "relais":
                inSVG[elementCounter].yup += 30;
                inSVG[elementCounter].data +=
                  '<use xlink:href="#relais_kring" x=\"' + inSVG[elementCounter].xleft +
                  '" y="' + inSVG[elementCounter].yup + '" />';
                /*inSVG[elementCounter].data += "<text x=\"" + (inSVG[elementCounter].xleft+15) +
                   "\" y=\"" + (inSVG[elementCounter].yup-10) +
                   "\"" +
                   " transform=\"rotate(-90 " + (inSVG[elementCounter].xleft+15) +
                   "," + (inSVG[elementCounter].yup-10) +
                   ")" +
                    "\" style=\"text-anchor:middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"10\">" +
                   htmlspecialchars(this.data[i].getKey("aantal") + "P - " +  this.data[i].getKey("amperage") + "A") + "</text>";*/
                nameshift = -11;
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
              inSVG[elementCounter] = this.data[i].toSVG();
            } else if (stack == "vertical") {
              inSVG[elementCounter] = this.toSVG(this.id[i],"horizontal",0,true); //if we are still in vertical mode, switch to horizontal and take childs with us
            } else { //we are in horizontal mode and can start drawing
              //First get the image itself
              //if ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Meerdere verbruikers") {
                //the following function takes true as an argument if there is still an element following in a horizontal chain.
                //This is the case if the element is not last and/or not followed by empty tekst without border
                if (this.id[i] == myParent) {
                  inSVG[elementCounter] = this.data[i].toSVG();
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
      header += SVGSymbols.outputSVGSymbols();
      var footer: string = "</svg>";
      outSVG.data = header+outSVG.data+footer;
    }

    return(outSVG);

  }

}
