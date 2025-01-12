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
    getElectroItemById(my_id: number) : Electro_Item
        Returns the Electro_Item in the array for a given ID
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

    // -- Public variables --

    data: Array<List_Item>;
    active: Array<Boolean>;
    id: Array<number>;
    properties: Properties;
    print_table: Print_Table;
    length: number;
    curid: number;
    mode: string; //can be "edit" or "move"
    sitplan: SituationPlan;
    sitplanjson: any; //this is where we store the situation plan in plan object exporting to json
    sitplanview: SituationPlanView;
    currentView: string; // Here we store '2col' | 'config' | 'draw'

    // -- Constructor --

    constructor() {
        this.length = 0;
        this.data = new Array<List_Item>();
        this.active = new Array<Boolean>();
        this.id = new Array<number>();
        this.print_table = new Print_Table();
        this.properties = new Properties();
        this.curid = 1;
        this.mode = "edit";
        this.sitplan = new SituationPlan();
      };

    /** dispose
     * 
     */
    dispose() {
        if (this.sitplanview != null) {
            this.sitplanview.dispose();
        }
    }

    // -- Definitief verwijderen van items die als inactief werden geflagged --

/*    deleteInactive() {
        for (let i = 0; i<this.length; i++) { //Loop over all items
            while ( (!this.active[i]) && (i<this.length) ) {
                this.data.splice(i,1);
                this.active.splice(i,1);
                this.id.splice(i,1);
                this.length--;
            }
        }
    }*/

    /** Member functie resort
     * 
     *  Sorteert de structuur zodat ouders steeds vlak voor de kinderen zitten en alles in de volgorde zoals
     *  zichtbaar in het schema.
     * 
     *  Onbereikbare of niet actieve elementen worden verwijderd
     * 
     **/

    reSort() {
        let sortToOrdinal = (parent = 0, ordinals = []) => {
            for (let i = 0; i<this.length; i++) {
                if (this.active[i]) {
                    if (this.data[i].parent == parent) {
                        ordinals.push(i);
                        sortToOrdinal(this.id[i], ordinals)
                    }
                }
            }
            return ordinals;
        }

        let ordinals = sortToOrdinal();

        let data = [];
        let active = [];
        let id=[];

        for (let i=0; i<ordinals.length; i++) {
            data.push(this.data[ordinals[i]]);
            active.push(this.active[ordinals[i]]);
            id.push(this.id[ordinals[i]]);
        }

        this.data = data;
        this.active = active;
        this.id = id;
        this.length = ordinals.length;
    }



    // -- Plaats in de array zoeken op basis van de id --

    getOrdinalById(my_id: number) : number | null {
        for (let i = 0; i<this.length; i++) {
            if (this.id[i]==my_id) return(i);
        }
        return null;
    }

    getElectroItemById(my_id: number) : Electro_Item | null {
        let ordinal = this.getOrdinalById(my_id);
        if (ordinal !== null) return(this.data[ordinal] as Electro_Item);
        return null;
    }

    // -- Aantal actieve kinderen van id = parent_id --

    getNumChilds(parent_id: number) : number {
        let returnval = 0;
        for (let i = 0; i<this.length; i++) {
            if ( (this.data[i].parent == parent_id) && (this.active[i]) ) returnval++;
        }
        return(returnval);
    }

    // -- Maximum aantal actieve kinderen van id = parent_id --

    getMaxNumChilds(parent_id: number) : number {
        let returnval:number = this.data[this.getOrdinalById(parent_id)].getMaxNumChilds();
        return(returnval);
    }

    // Creëer een nieuw Electro_Item --

    createItem(electroType: string) : Electro_Item {

        // First create the object
        let tempval;
        switch (electroType) {
            case 'Aansluiting': tempval = new Aansluiting(structure); break; 
            case 'Aansluitpunt': case 'Leeg': tempval = new Aansluitpunt(structure); break;
            case 'Aftakdoos': tempval = new Aftakdoos(structure); break;
            case 'Batterij': tempval = new Batterij(structure); break;
            case 'Bel': tempval = new Bel(structure); break;
            case 'Boiler': tempval = new Boiler(structure); break;
            case 'Bord': tempval = new Bord(structure); break;
            case 'Diepvriezer': tempval = new Diepvriezer(structure); break;
            case 'Domotica': tempval = new Domotica(structure); break; 
            case 'Domotica module (verticaal)': tempval = new Domotica_verticaal(structure); break; 
            case 'Domotica gestuurde verbruiker': tempval = new Domotica_gestuurde_verbruiker(structure); break; 
            case 'Droogkast': tempval = new Droogkast(structure); break; 
            case 'Drukknop': tempval = new Drukknop(structure); break; 
            case 'Elektriciteitsmeter': tempval = new Elektriciteitsmeter(structure); break; 
            case 'Elektrische oven': tempval = new Elektrische_oven(structure); break; 
            case 'EV lader': tempval = new EV_lader(structure); break;
            case 'Ketel': tempval = new Ketel(structure); break; 
            case 'Koelkast': tempval = new Koelkast(structure); break;
            case 'Kookfornuis': tempval = new Kookfornuis(structure); break;
            case 'Kring': tempval = new Kring(structure); break;
            case 'Leiding': tempval = new Leiding(structure); break;
            case 'Lichtcircuit': tempval = new Lichtcircuit(structure); break;
            case 'Lichtpunt': tempval = new Lichtpunt(structure); break;
            case 'Meerdere verbruikers': tempval = new Meerdere_verbruikers(structure); break;
            case 'Media': tempval = new Media(structure); break;
            case 'Microgolfoven': tempval = new Microgolfoven(structure); break;
            case 'Motor': tempval = new Motor(structure); break;
            case 'Omvormer': tempval = new Omvormer(structure); break;
            case 'Overspanningsbeveiliging': tempval = new Overspanningsbeveiliging(structure); break;
            case 'Schakelaars': tempval = new Schakelaars(structure); break;
            case 'Splitsing': tempval = new Splitsing(structure); break;
            case 'Stoomoven': tempval = new Stoomoven(structure); break;
            case 'Contactdoos': tempval = new Contactdoos(structure); break;
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
            case 'Zekering/differentieel': tempval = new Zekering(structure); break;
            case 'Zonnepaneel': tempval = new Zonnepaneel(structure); break;
            default: tempval = new Electro_Item(structure);
        }
      
        // Then set the correct identifyer
        tempval.id = this.curid;
        tempval.parent = 0;
        tempval.indent = 0;

        // Then return the Object
        return(tempval);
    }

    // -- Voeg item toe aan de Hierarchical list --

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

    // -- Item invoegen vóór bestaand item met id = my_id en op hetzelfde niveau --

    insertItemBeforeId(my_item: List_Item, my_id: number) {
        for (let i = 0; i<this.length; i++) {
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

    // -- Item invoegen na bestaand item met id = my_id en op hetzelfde niveau --

    insertItemAfterId(my_item: List_Item, my_id: number) {
        for (let i = 0; i<this.length; i++) {
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

    // -- Item invoegen na bestaand item met id = my_id en één niveau dieper --

    insertChildAfterId(my_item: List_Item, my_id: number) {
        let numchilds:number = this.getNumChilds(my_id);
        let maxchilds:number = this.getMaxNumChilds(my_id);

        if (numchilds < maxchilds) {
            let ordinal:number = this.insertItemAfterId(my_item, my_id);
            this.data[ordinal].parent = my_id;
            this.data[ordinal].indent = this.data[ordinal-1].indent+1;
        } else {
            alert("Het maximum aantal kinderen van dit element is "+maxchilds);
        }
        this.reSort();
    }

    // -- Item ééntje naar boven schuiven binnen hetzelfde niveau --

    moveUp(my_id: number) {

        // First find the ordinal number of the current location and the desired location --
        let currentOrdinal = this.getOrdinalById(my_id);
        let newOrdinal = currentOrdinal;
        let currentparent = this.data[currentOrdinal].parent;
        for (let i = currentOrdinal-1; i>=0; i--) {
            if ( (this.data[i].parent == currentparent) && (this.active[i]) ) {
                newOrdinal = i;
                break; //Leave the for loop
            }
        }

        // Swap both items (we swap data and id, we do not need to swap active as both items are active by construction)
        let swapItem: List_Item = new List_Item(this);
        swapItem = this.data[currentOrdinal];
        this.data[currentOrdinal] = this.data[newOrdinal];
        this.data[newOrdinal] = swapItem;

        let swapID = this.id[currentOrdinal];
        this.id[currentOrdinal] = this.id[newOrdinal];
        this.id[newOrdinal] = swapID;

        this.reSort();
    }

    // -- Item ééntje naar beneden schuiven binnen hetzelfde niveau --

    moveDown(my_id: number) {

        // First find the ordinal number of the current location and the desired location --
        let currentOrdinal = this.getOrdinalById(my_id);
        let newOrdinal = currentOrdinal;
        let currentparent = this.data[currentOrdinal].parent;
        for (let i = currentOrdinal+1; i<this.length; i++) {
            if ( (this.data[i].parent == currentparent) && (this.active[i]) ) {
                newOrdinal = i;
                break; //Leave the for loop
            }
        }

        // Swap both items (we swap data and id, we do not need to swap active as both items are active by construction)
        let swapItem: List_Item = new List_Item(this);
        swapItem = this.data[currentOrdinal];
        this.data[currentOrdinal] = this.data[newOrdinal];
        this.data[newOrdinal] = swapItem;

        let swapID = this.id[currentOrdinal];
        this.id[currentOrdinal] = this.id[newOrdinal];
        this.id[newOrdinal] = swapID;

        this.reSort();
    }

    // -- Item clonen --

    clone(my_id: number, parent_id?: number) {

        // First find the ordinal number of the current location and the desired location
        let currentOrdinal = this.getOrdinalById(my_id);

        // Then create a clone of the object and assign the correct parent_id
        if(arguments.length < 2) parent_id = this.data[currentOrdinal].parent;
        let parentOrdinal = this.getOrdinalById(parent_id);

        let my_item = this.createItem((this.data[currentOrdinal] as Electro_Item).getType());
        my_item.clone(this.data[currentOrdinal]);

        // Now add the clone to the structure. The clone will have id this.curid-1
        if(arguments.length < 2)
            this.insertItemAfterId(my_item, my_id); //Cloning the top-element, this messes up the ordinals !!
            else this.insertChildAfterId(my_item, parent_id); //Cloning childs, this messes up the ordinals !!
        
        let new_id = this.curid-1;
        this.data[this.getOrdinalById(new_id)].collapsed = this.data[this.getOrdinalById(my_id)].collapsed;
        
        // Now loop over the childs of the original and also clone those
        let toClone = new Array(); //list of id's to clone
        for (let i = 0; i<this.length; i++) {
            if (this.id[i]==my_id) {
                for (let j=this.length-1; j>=0; j--) { //We need to loop in opposite sense
                  if (this.data[j].parent==my_id) toClone.push(this.id[j]);
                }
            }
        }
        for (let clone_id=0; clone_id<toClone.length; clone_id++) {
          this.clone(toClone[clone_id],new_id);
        }

        this.reSort();
    }

    // -- Delete item with id = my_id --

    deleteById(my_id: number) {
        for (let i = 0; i<this.length; i++) {
            if (this.id[i]==my_id) {
                this.active[i] = false;
                for (let j=0; j<this.length; j++) {
                   if (this.data[j].parent==my_id) this.deleteById(this.id[j]);
                }
            }
        }
        this.reSort();
    }

    // -- Pas type aan van item op plaats ordinal in de array -- 

    adjustTypeByOrdinal(ordinal: number, electroType : string) {
        let tempval:Electro_Item = this.createItem(electroType);

        (<any> Object).assign(tempval,this.data[ordinal]);
        tempval.props.type = electroType; //We need to do this again as we overwrote it with assign
        tempval.resetProps();   //Already part of createItem but we need to run this again as the assign operation overwrote everything

        this.data[ordinal] = tempval;
    }

    // -- Pas type aan van item met id = my_id --

    adjustTypeById(my_id: number, electroType : string) {
        let ordinal = structure.getOrdinalById(my_id);
        this.adjustTypeByOrdinal(ordinal, electroType);
    }

    //-- Verticale lijn tekenen (kring links van gebruiker) --

    tekenVerticaleLijnIndienKindVanKring(item: Electro_Item, mySVG: SVGelement) {

        // Eerst checken of het wel degelijk een kind van een kring is
        let parent:Electro_Item = (item.getParent() as Electro_Item);
        if (parent != null) {
            if (parent.getType() == "Kring") {

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
            }

            if ( (parent.getType() == "Kring") || (parent.getType() == "Domotica module (verticaal)") ) {
                // Plaats het nummer van het item naast de lijn
                let displaynr:string;
                displaynr = item.props.nr;
                mySVG.data +=
                  '<text x="' + (mySVG.xleft+9) + '" y="' + (mySVG.yup - 5) + '" ' +
                  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                  htmlspecialchars(displaynr)+'</text>';
            }
        };
    };

    updateRibbon() {
        let output: string = "";

        // Plaats bovenaan de switch van editeer-mode (teken of verplaats) --
        output += `
            <div class="icon" ${(undostruct.undoStackSize() > 0 ? 'onclick="undoClicked()"' : "style=\"filter: opacity(45%)\"")}>
                <img src="gif/undo.png" alt="Ongedaan maken" class="icon-image">
                <span class="icon-text">Ongedaan maken</span>
            </div>
            <div class="icon" ${(undostruct.redoStackSize() > 0 ? 'onclick="redoClicked()"' : "style=\"filter: opacity(45%)\"")}>
                <img src="gif/redo.png" alt="Opnieuw" class="icon-image">
                <span class="icon-text">Opnieuw</span>
            </div>
            <span style="display: inline-block; width: 30px;"></span>
        `
        output += '<p style="margin-top: 5px;margin-bottom: 5px;">';
        switch (this.mode) {
            case "edit":
                output += `
                        <div>
                            Werkmodus<br>
                            <select id="edit_mode" onchange="HL_editmode()">
                                <option value="edit" selected>Invoegen</option>
                                <option value="move">Verplaatsen/Clone</option>
                            </select>
                        </div>`;
                break;
            case "move":
                output += `
                        <div>
                            Werkmodus<br>
                            <select id="edit_mode" onchange="HL_editmode()">
                                <option value="edit">Invoegen</option>
                                <option value="move" selected>Verplaatsen/Clone</option>
                            </select>
                        </div>
                        <span style="display: inline-block; width: 30px;"></span>`;

                output+= `
                        <div style="color:black;font-size:12px"><i>
                            Gebruik de <b>blauwe</b> pijlen om de volgorde van elementen te wijzigen.<br>
                            Gebruik het <u>Moeder</u>-veld om een component elders in het schema te hangen.<br>
                            Kies "<b>clone</b>" om een dubbel te maken van een element.
                        </i></div>`;
                break;
        }
        output += '</p>';

        output += '<span style="display: inline-block; width: 30px;"></span>';

        output += '<p style="margin-top: 5px;margin-bottom: 5px;" class="highlight-warning-big">Vergeet niet regelmatig uw werk<br>op te slaan in het "Bestand"-menu.</p>';
        
        document.getElementById("ribbon").innerHTML = `<div id="left-icons">${output}</div>`;
    }

    // -- Functie om de tree links te tekenen te starten by node met id = myParent --

    toHTMLinner(ordinal: number) {
        if (this.data[ordinal].collapsed) {
            return(`<tr>
                        <td bgcolor="#8AB2E4" onclick="HLCollapseExpand(${this.data[ordinal].id})" valign= "top">&#x229E;</td>
                        <td width="100%">${this.data[ordinal].toHTML(structure.mode)}<br></td>
                    </tr>`);
        } else {
            return(`<tr>
                       <td bgcolor="C0C0C0" onclick="HLCollapseExpand(${this.data[ordinal].id})" valign= "top">&#x229E;</td>
                       <td width="100%">${this.data[ordinal].toHTML(structure.mode)}<br>${this.toHTML(this.id[ordinal])}</td>
                    </tr>`);
        }
    }

    updateHTMLinner(id: number) {
        let ordinal: number = this.getOrdinalById(id);
        (document.getElementById('id_elem_'+id) as HTMLElement).innerHTML = this.toHTMLinner(ordinal);
    }

    toHTML(myParent: number) {
        
        if (myParent==0) this.updateRibbon();

        let output: string = "";
        let numberDrawn: number = 0;

        // Teken het volledige schema in HTML
        for (let i = 0; i<this.length; i++) {
            if (this.active[i] && (this.data[i].parent == myParent)) {
                numberDrawn++;
                output += '<table class="html_edit_table" id="id_elem_' + this.id[i]  + '">';
                output += this.toHTMLinner(i);
                output += "</table>";
            }
        }
        if ( (myParent == 0) && (numberDrawn<1) ) {
            output += "<button onclick=\"HLAdd()\">Voeg eerste object toe of kies bovenaan \"Nieuw\"</button><br>"; //no need for the add button if we have items
        }
        return(output);
    }

    /** Functie om de naam van een kring te vinden waartoe een element behoord 
     * 
    */

    findKringName(my_id: number) : string {
        let myOrdinal = this.getOrdinalById(my_id);
        let myParent = this.data[myOrdinal].parent;
        if (myParent == 0) {
            return("");
        } else {
            let myParentOrdinal = this.getOrdinalById(myParent);
            if (myParentOrdinal == null) return("");
            if ((this.data[myParentOrdinal] as Electro_Item).getType() == "Kring") {
                let kringnaam:string = this.data[myParentOrdinal].props.naam;
                if (kringnaam.trim() != "") {
                    return(this.data[myParentOrdinal].props.naam);
                } else {
                    return(this.findKringName(myParent));
                }
            } else {
                return(this.findKringName(myParent));
            }
        }
    }

    // -- Functie om de tree links te tekenen te starten by node met id = myParent --

    toSVG(myParent: number, stack: string, minxleft: number = 0, includeparent: boolean = false) { //stack can be "horizontal" or "vertical"

        // Eerst creëren we een array van SVGelements met alle kinderen van myParent en eventueel myParent zelf
        let inSVG: Array<SVGelement> = new Array<SVGelement>(); //Results from nested calls will be added here
        let elementCounter: number = 0;

        // Dan vullen we de array door doorheen de lijst van kinderen te gaan en een tekening van elk kind op te slaan
        for (let i = 0; i<this.length; i++) {
            if (this.active[i] && ( (this.data[i].parent == myParent) || ( (includeparent==true) && (this.id[i] == myParent) ) ) ) {
                let mytype:string = (this.data[i] as Electro_Item).getType();
                /*if (typeof(this.data[i].keys) != 'undefined') mytype = this.data[i].keys[0][2]; else*/ mytype = this.data[i].props.type;
                switch (mytype) {
                    case "":
                        inSVG[elementCounter] = new SVGelement();
                        break;
                    
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

                    case "Domotica module (verticaal)":
                        inSVG[elementCounter] = this.data[i].toSVG(); //Maak de tekening
                        this.tekenVerticaleLijnIndienKindVanKring(this.data[i] as Electro_Item,inSVG[elementCounter]);         
                        break; 

                    case "Domotica gestuurde verbruiker":
                        inSVG[elementCounter] = this.data[i].toSVG(); //Maak de tekening
                        this.tekenVerticaleLijnIndienKindVanKring(this.data[i] as Electro_Item,inSVG[elementCounter]);         
                        break;   
                      
                    case "Kring":
                        inSVG[elementCounter] = this.data[i].toSVG(); //Maak de tekening
                        break;

                    case "Aansluiting":
                        inSVG[elementCounter] = this.data[i].toSVG(); //Maak de tekening
                        this.tekenVerticaleLijnIndienKindVanKring(this.data[i] as Electro_Item,inSVG[elementCounter]);         
                        break;   

                    default:
                        if ( (myParent != 0) && 
                             ( (this.data[this.getOrdinalById(myParent)] as Electro_Item).getType() == "Meerdere verbruikers") )
                            inSVG[elementCounter] = this.data[i].toSVG();
                        else if (stack == "vertical") 
                            inSVG[elementCounter] = this.toSVG(this.id[i],"horizontal",0,true); //if we are still in vertical mode, switch to horizontal and take childs with us
                        else { //we are in horizontal mode and can start drawing
                            if (this.id[i] == myParent) { // Element is de parent en tekent zichzelf
                                inSVG[elementCounter] = this.data[i].toSVG();
                            } else { // Element is niet de parent, we tekenen het element en al zijn kinderen
                                inSVG[elementCounter] = this.toSVG(this.id[i],"horizontal",0,true); //if we are still in vertical mode, switch to horizontal and take childs with us
                            }
                        }
                        this.tekenVerticaleLijnIndienKindVanKring(this.data[i] as Electro_Item,inSVG[elementCounter]);
                        break;
                }
                elementCounter++;
            }    
        }

        // If there are no elements, make at least an empty one to avoid problems here below ---
        if (elementCounter == 0) {
            inSVG[0] = new SVGelement();
        }

        // Now create the output element ---
        let outSVG: SVGelement = new SVGelement;
        outSVG.xleft = 0; outSVG.xright = 0; outSVG.yup = 0; outSVG.ydown = 0;
        outSVG.data = "";

        let width: number = 0; //How wide is the structure?
        let height: number = 0; //How high is the structure?

        switch (stack) {
            case "horizontal":
                let max_yup : number = 0; //What is the maximal distance above the horizontal line?
                let max_ydown : number = 0; //What is the maximal distance below the horizontal line?

                // analyse the size of the structure. Build horizontally
                for (let i = 0; i<elementCounter; i++) {
                    width = width + inSVG[i].xleft + inSVG[i].xright;
                    max_yup = Math.max(max_yup,inSVG[i].yup);
                    max_ydown = Math.max(max_ydown,inSVG[i].ydown);
                  }
                height = max_yup + max_ydown;

                // decide on the output structure
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

                // Create the output data
                let xpos:number = 0;

                for (let i = 0; i<elementCounter; i++) {
                    outSVG.data += '<svg x="' + xpos + '" y="' + (max_yup-inSVG[i].yup) + '">';
                    outSVG.data += inSVG[i].data;
                    outSVG.data += '</svg>';
                    xpos += inSVG[i].xleft + inSVG[i].xright;
                }

                break;

            case "vertical":
                let max_xleft : number = 0; //What is the maximal distance left of the vertical line?
                let max_xright : number = 0; //What is the maximal distance right of the vertical line?

                // analyse the size of the structure. Build vertically
                for (let i = 0; i<elementCounter; i++) {
                  height = height + inSVG[i].yup + inSVG[i].ydown;
                  max_xleft = Math.max(max_xleft,inSVG[i].xleft);
                  max_xright = Math.max(max_xright,inSVG[i].xright);
                }
                max_xleft = Math.max(minxleft, max_xleft);
                width = max_xleft + max_xright;

                // decide on the output structure
                outSVG.yup = height; //As a general rule, there is no ydown, but to be confirmed
                outSVG.ydown = 0;
                //outSVG.xleft = Math.max(max_xleft,35); // foresee at least 35 for text at the left
                outSVG.xleft = max_xleft; 
                if ((this.data[this.getOrdinalById(myParent)] as Electro_Item).getType() == "Kring") max_xright += 10; // Altijd 10 extra rechts voorzien voor uitstekende tekst/adressen
                outSVG.xright = Math.max(max_xright,25); // foresee at least 25 at the right

                // create the output data
                let ypos:number = 0;

                for (let i = elementCounter-1; i>=0; i--) {
                    outSVG.data += '<svg x="' + (outSVG.xleft-inSVG[i].xleft) + '" y="' + ypos + '">';
                    outSVG.data += inSVG[i].data;
                    outSVG.data += '</svg>';
                    ypos += inSVG[i].yup + inSVG[i].ydown;
                }

                break;
        }

        outSVG.data += "\n";

        if (myParent==0) { //We will always foresee a 20 pixel horizontal and 5 pixel vertical margin
          let header: string = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" transform=\"scale(1,1)\" width=\"" + (width + 20) + "\" height=\"" + (height + 5) + "\">";
          header += SVGSymbols.outputSVGSymbols();
          let footer: string = "</svg>";
          outSVG.data = header + outSVG.data + footer;
        }
        return(outSVG);
    }
}
