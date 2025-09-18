import { htmlspecialchars, insertArrow, contains, trimString } from "./general";
import { Aansluiting } from "./List_Item/Aansluiting";
import { Aansluitpunt } from "./List_Item/Aansluitpunt";
import { Aardingsonderbreker } from "./List_Item/Aardingsonderbreker";
import { Aftakdoos } from "./List_Item/Aftakdoos";
import { Batterij } from "./List_Item/Batterij";
import { Bel } from "./List_Item/Bel";
import { Boiler } from "./List_Item/Boiler";
import { Bord } from "./List_Item/Bord";
import { Contactdoos } from "./List_Item/Contactdoos";
import { Container } from "./List_Item/Container";
import { Diepvriezer } from "./List_Item/Diepvriezer";
import { Domotica } from "./List_Item/Domotica";
import { Domotica_gestuurde_verbruiker } from "./List_Item/Domotica_gestuurde_verbruiker";
import { Domotica_verticaal } from "./List_Item/Domotica_verticaal";
import { Droogkast } from "./List_Item/Droogkast";
import { Drukknop } from "./List_Item/Drukknop";
import { Electro_Item } from "./List_Item/Electro_Item";
import { Elektriciteitsmeter } from "./List_Item/Elektriciteitsmeter";
import { Elektrische_oven } from "./List_Item/Elektrische_oven";
import { EV_lader } from "./List_Item/EV_lader";
import { Ketel } from "./List_Item/Ketel";
import { Koelkast } from "./List_Item/Koelkast";
import { Kookfornuis } from "./List_Item/Kookfornuis";
import { Kring } from "./List_Item/Kring";
import { Leiding } from "./List_Item/Leiding";
import { Lichtpunt } from "./List_Item/Lichtpunt";
import { List_Item } from "./List_Item/List_Item";
import { Media } from "./List_Item/Media";
import { Meerdere_verbruikers } from "./List_Item/Meerdere_verbruikers";
import { Microgolfoven } from "./List_Item/Microgolfoven";
import { Motor } from "./List_Item/Motor";
import { Omvormer } from "./List_Item/Omvormer";
import { Overspanningsbeveiliging } from "./List_Item/Overspanningsbeveiliging";
import { Lichtcircuit } from "./List_Item/Schakelaars/Lichtcircuit";
import { Schakelaars } from "./List_Item/Schakelaars/Schakelaars";
import { Splitsing } from "./List_Item/Splitsing";
import { Stoomoven } from "./List_Item/Stoomoven";
import { Transformator } from "./List_Item/Transformator";
import { USB_lader } from "./List_Item/USB_lader";
import { Vaatwasmachine } from "./List_Item/Vaatwasmachine";
import { Ventilator } from "./List_Item/Ventilator";
import { Verbruiker } from "./List_Item/Verbruiker";
import { Verlenging } from "./List_Item/Verlenging";
import { Verwarmingstoestel } from "./List_Item/Verwarmingstoestel";
import { Vrije_ruimte } from "./List_Item/Vrije_ruimte";
import { Vrije_tekst } from "./List_Item/Vrije_tekst";
import { Warmtepomp } from "./List_Item/Warmtepomp";
import { Wasmachine } from "./List_Item/Wasmachine";
import { Zekering } from "./List_Item/Zekering";
import { Zeldzame_symbolen } from "./List_Item/Zeldzame_symbolen";
import { Zonnepaneel } from "./List_Item/Zonnepaneel";
import { Properties } from "./Properties";
import { SVGelement } from "./SVGelement";
import { SVGSymbols } from "./SVGSymbols";
import { Print_Table } from "./print/Print_Table";
import { SituationPlan } from "./sitplan/SituationPlan";
import { SituationPlanView } from "./sitplan/SituationPlanView";
import { MarkerList } from "./print/MarkerList";

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

export class Hierarchical_List {

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
    currentView: string = ""; // Here we store '2col' | 'config' | 'draw'
    
    // -- Hash table for efficient ID to ordinal lookups --
    private idToOrdinalMap: Map<number, number> | null = null;

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

    /** Member functie resort
     * 
     *  Sorteert de structuur zodat ouders steeds vlak voor de kinderen zitten en alles in de volgorde zoals
     *  zichtbaar in het schema.
     * 
     *  Onbereikbare of niet actieve elementen worden verwijderd
     * 
     **/

    reSort() { // niet de meest elegante implementate maar draait in 2 ms op een lang schema dus meer dan goed genoeg

        let isSorted = () => { // Controleer of de data reeds gesorteerd is. Controleert niet of Id's dubbel voorkomen, dat laatste mag normaal niet gebeuren
            if (this.length <= 1) return true; // If only one element or no element at all, it's sorted by definition

            // We maken een stack van Ids maar laatste element is een variabele voor snellere performance
            let stack: number[] = [];
            let stacktop: number = 0;

            for (let i: number = 0; i < this.length; i++) {
                if (this.active[i]) {
                    let parentId = this.data[i].parent;

                    if (parentId == stacktop) { // We zakken 1 level dieper
                        stack.push(stacktop);
                        stacktop = this.id[i];
                    } else { // We blijven op hetzelfde niveau of stijgen terug op tot we onder de parent hangen
                        while (stack.length > 0 && stack[stack.length - 1] !== parentId) stack.pop();
                        if (stack.length === 0) return false; // referentie naar een parentId die we nog niet eerder zagen due niet gesorteerd
                        stacktop = this.id[i];
                    }
                } else {
                    return(false); // force a re-sort if we find an inactive item
                }
            }

            return true;
        }

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

        if (isSorted()) return; // If already sorted, do nothing

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
        
        // Invalidate the hash table since the structure has changed
        this.idToOrdinalMap = null;
    }

    // -- Build or rebuild the internal hash table for fast ID to ordinal lookups --

    private buildIdToOrdinalMap() {
        this.idToOrdinalMap = new Map<number, number>();
        for (let i = 0; i < this.length; i++) {
            if (this.active[i]) {
                this.idToOrdinalMap.set(this.id[i], i);
            }
        }
    }

    // -- Plaats in de array zoeken op basis van de id --

    getOrdinalById(my_id: number) : number | null {

        function isInValidOrdinal(ordinal: number): boolean {
            return ( (ordinal === undefined) || 
                     (ordinal === null) ||
                     (ordinal >= this.length) ||
                     (!this.active[ordinal]) ||
                     (this.id[ordinal] !== my_id) )
        }

        if (my_id === 0) return null; // ID 0 is not a valid Electro_Item

        // Build hash table if it doesn't exist
        if (this.idToOrdinalMap === null) this.buildIdToOrdinalMap();

        // Try to get ordinal from hash table
        let ordinal = this.idToOrdinalMap!.get(my_id);

        if (isInValidOrdinal.call(this, ordinal)) {
            this.buildIdToOrdinalMap(); // Rebuild if not found or invalid
            ordinal = this.idToOrdinalMap!.get(my_id);
            if (isInValidOrdinal.call(this, ordinal)) {
                return(null); // if still not found, give up
            }
        }
        
        return ordinal // if all goes well, return the ordinal

    }

    getElectroItemById(my_id: number|null) : Electro_Item | null {
        if (my_id === null) return null;
        if (my_id === 0) return null; // ID 0 is not a valid Electro_Item
        
        let ordinal = this.getOrdinalById(my_id);
        if (ordinal !== null) return(this.data[ordinal] as Electro_Item);
        return null;
    }

    // -- Aantal actieve kinderen van id = parent_id --

    getNumChilds(parent_id: number) : number {
        let returnval = 0;
        for (let i = 0; i<this.length; i++) {
            if ( (this.data[i].parent == parent_id) && (this.active[i]) 
                && !((this.data[i] as Electro_Item).isAttribuut() ) ) returnval++;
        }
        return(returnval);
    }

    // -- Get the ID of the first child of parent_id --

    getFirstChildId(parent_id: number) : number | null {
        for (let i = 0; i < this.length; i++) {
            if (this.active[i] && this.data[i].parent == parent_id 
                && !((this.data[i] as Electro_Item).isAttribuut())) {
                return this.id[i];
            }
        }
        return null; // No child found
    }

    // -- Maximum aantal actieve kinderen van id = parent_id --

    getMaxNumChilds(parent_id: number) : number {
        let ordinal = this.getOrdinalById(parent_id);
        if (ordinal === null) return 0; // If parent_id is not found, return 0

        let returnval:number = this.data[ordinal].getMaxNumChilds();
        return(returnval);
    }

    createContainerIfNotExists(): Electro_Item {
        // loop over all childs of the root element (parent = 0) and check if any has type "Container"
        // if not, create a new Container with parent the root node and return it
        for (let i = 0; i < this.length; i++) {
            if (this.active[i] && this.data[i].parent === 0 && this.data[i] instanceof Container) {
                return (this.data[i] as Electro_Item); // Container already exists
            }
        }

        // Create a new Container
        let container = this.addItem("Container");
        container.parent = 0;
        return container; // Return the id of the newly created Container
    }

    // Creëer een nieuw Electro_Item --

    createItem(electroType: string) : Electro_Item {

        // First create the object
        let tempval;
        switch (electroType) {
            case 'Aansluiting': tempval = new Aansluiting(this); break; 
            case 'Aansluitpunt': case 'Leeg': tempval = new Aansluitpunt(this); break;
            case 'Aardingsonderbreker': tempval = new Aardingsonderbreker(this); break;
            case 'Aftakdoos': tempval = new Aftakdoos(this); break;
            case 'Batterij': tempval = new Batterij(this); break;
            case 'Bel': tempval = new Bel(this); break;
            case 'Boiler': tempval = new Boiler(this); break;
            case 'Bord': tempval = new Bord(this); break;
            case 'Container': tempval = new Container(this); break;
            case 'Diepvriezer': tempval = new Diepvriezer(this); break;
            case 'Domotica': tempval = new Domotica(this); break; 
            case 'Domotica module (verticaal)': tempval = new Domotica_verticaal(this); break; 
            case 'Domotica gestuurde verbruiker': tempval = new Domotica_gestuurde_verbruiker(this); break; 
            case 'Droogkast': tempval = new Droogkast(this); break; 
            case 'Drukknop': tempval = new Drukknop(this); break; 
            case 'Elektriciteitsmeter': tempval = new Elektriciteitsmeter(this); break; 
            case 'Elektrische oven': tempval = new Elektrische_oven(this); break; 
            case 'EV lader': tempval = new EV_lader(this); break;
            case 'Ketel': tempval = new Ketel(this); break; 
            case 'Koelkast': tempval = new Koelkast(this); break;
            case 'Kookfornuis': tempval = new Kookfornuis(this); break;
            case 'Kring': tempval = new Kring(this); break;
            case 'Leiding': tempval = new Leiding(this); break;
            case 'Lichtcircuit': tempval = new Lichtcircuit(this); break;
            case 'Lichtpunt': tempval = new Lichtpunt(this); break;
            case 'Meerdere verbruikers': tempval = new Meerdere_verbruikers(this); break;
            case 'Media': tempval = new Media(this); break;
            case 'Microgolfoven': tempval = new Microgolfoven(this); break;
            case 'Motor': tempval = new Motor(this); break;
            case 'Omvormer': tempval = new Omvormer(this); break;
            case 'Overspanningsbeveiliging': tempval = new Overspanningsbeveiliging(this); break;
            case 'Schakelaars': tempval = new Schakelaars(this); break;
            case 'Splitsing': tempval = new Splitsing(this); break;
            case 'Stoomoven': tempval = new Stoomoven(this); break;
            case 'Contactdoos': tempval = new Contactdoos(this); break;
            case 'Transformator': tempval = new Transformator(this); break;
            case 'USB lader': tempval = new USB_lader(this); break;
            case 'Vaatwasmachine': tempval = new Vaatwasmachine(this); break;
            case 'Ventilator': tempval = new Ventilator(this); break;
            case 'Verbruiker': tempval = new Verbruiker(this); break;
            case 'Verlenging': tempval = new Verlenging(this); break;
            case 'Verwarmingstoestel': tempval = new Verwarmingstoestel(this); break;
            case 'Vrije ruimte': tempval = new Vrije_ruimte(this); break;
            case 'Vrije tekst': tempval = new Vrije_tekst(this); break;
            case 'Warmtepomp/airco': tempval = new Warmtepomp(this); break;
            case 'Wasmachine': tempval = new Wasmachine(this); break;
            case 'Zeldzame symbolen': tempval = new Zeldzame_symbolen(this); break;
            case 'Zekering/differentieel': tempval = new Zekering(this); break;
            case 'Zonnepaneel': tempval = new Zonnepaneel(this); break;
            default: tempval = new Electro_Item(this);
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
        
        // Invalidate the hash table since the structure has changed
        this.idToOrdinalMap = null;

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

        if ( (numchilds < maxchilds) || ((my_item as Electro_Item).isAttribuut() ) ) {
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
        if (currentOrdinal === null) return; // If my_id is not found, do nothing

        let newOrdinal = currentOrdinal;
        let currentparent = this.data[currentOrdinal].parent;
        for (let i = currentOrdinal-1; i>=0; i--) {
            if ( (this.data[i].parent == currentparent) && (this.active[i]) 
                && !((this.data[i] as Electro_Item).isAttribuut() ) ) {
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
        if (currentOrdinal === null) return; // If my_id is not found, do nothing

        let newOrdinal = currentOrdinal;
        let currentparent = this.data[currentOrdinal].parent;
        for (let i = currentOrdinal+1; i<this.length; i++) {
            if ( (this.data[i].parent == currentparent) && (this.active[i]) 
                && !((this.data[i] as Electro_Item).isAttribuut() ) ) {
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
        if (currentOrdinal === null) return; // If my_id is not found, do nothing

        // Then create a clone of the object and assign the correct parent_id
        if(arguments.length < 2) parent_id = this.data[currentOrdinal].parent;

        let my_item = this.createItem((this.data[currentOrdinal] as Electro_Item).getType());
        my_item.clone(this.data[currentOrdinal]);

        // Now add the clone to the structure. The clone will have id this.curid-1
        if(arguments.length < 2)
            this.insertItemAfterId(my_item, my_id); //Cloning the top-element, this messes up the ordinals !!
        else
            this.insertChildAfterId(my_item, parent_id); //Cloning childs, this messes up the ordinals !!
        
        let new_id = this.curid-1;

        let new_ordinal = this.getOrdinalById(new_id);
        currentOrdinal = this.getOrdinalById(my_id); // we need to do this again as the ordinals might have changed

        if (currentOrdinal === null) return; // If my_id is not found, do nothing
        if (new_ordinal === null) return; // If new_id is not found, do nothing

        this.data[new_ordinal].collapsed = this.data[currentOrdinal].collapsed;

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
        
        // Hash table doesn't need invalidation as IDs and structure remain the same
    }

    // -- Pas type aan van item met id = my_id --

    adjustTypeById(my_id: number, electroType : string) {
        let ordinal = this.getOrdinalById(my_id);
        if (ordinal === null) return; // If my_id is not found, do nothing
        this.adjustTypeByOrdinal(ordinal, electroType);
    }

    //-- Verticale lijn tekenen (kring links van gebruiker) --

    tekenVerticaleLijnIndienKindVanKring(item: Electro_Item, mySVG: SVGelement) {

        // Eerst checken of het wel degelijk een kind van een kring is
        let parent:Electro_Item = (item.getParent() as Electro_Item);
        if (parent != null) {
            if (parent.getType() == "Kring") {

                let lastOrdinalInKring = 0;

                let myOrdinal = this.getOrdinalById(item.id);
                if (myOrdinal === null) return; // If item is not found, do nothing 

                for (let i = 0; i<item.sourcelist.length; i++) {
                    if (this.active[i] && (this.data[i].parent == parent.id)) lastOrdinalInKring = i;
                }

                if ( (item.getType() == "Omvormer") && (item.props.inkring) ) {

                    //if (myOrdinal < lastOrdinalInKring)
                    mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + 0 + '" y2="' + (mySVG.yup-5+0.5) + '" stroke="black" />'
                    mySVG.data += '<line x1="' + mySVG.xleft + '" x2="' + mySVG.xleft + '" y1="' + (mySVG.yup+5-0.5) + '" y2="' + (mySVG.yup + mySVG.ydown) + '" stroke="black" />'

                } else {        

                    // Bepaal hoogte van de lijn. Idien dit het laatste element van de kring is is het een halve lijn,
                    // zoniet een hele lijn
                    let y1, y2: number;
                    
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
            }

            if ( (parent.getType() == "Kring") || (["Domotica module (verticaal)"].includes(parent.getType())) ) {
                // Plaats het nummer van het item naast de lijn
                let displaynr:string;
                displaynr = item.props.nr;
                let posx = mySVG.xleft+9;
                let posy = mySVG.yup-5;
                if ( (item.getType() == "Omvormer") && (item.props.inkring) ) posy -= 5;
                
                mySVG.data +=
                  '<text x="' + (posx) + '" y="' + (posy) + '" ' +
                  'style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
                  htmlspecialchars(displaynr)+'</text>';
            }
        };
    };

    updateRibbon() {
        if (this.properties.currentView != '2col') return; // het heeft geen zin de EDS ribbon aan te passen als de EDS niet open staat

        let output: string = "";

        // Plaats bovenaan de switch van editeer-mode (teken of verplaats) --
        output += `
            <div class="icon" ${(globalThis.undostruct.undoStackSize() > 0 ? 'onclick="undoClicked()"' : "style=\"filter: opacity(45%)\"")}>
                <img src="gif/undo.png" alt="Ongedaan maken" class="icon-image">
                <span class="icon-text">Ongedaan maken</span>
            </div>
            <div class="icon" ${(globalThis.undostruct.redoStackSize() > 0 ? 'onclick="redoClicked()"' : "style=\"filter: opacity(45%)\"")}>
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

        if (globalThis.autoSaver && globalThis.autoSaver.hasChangesSinceLastManualSave()) {
            output +=  '<span style="display: inline-block; width: 30px;"></span>';
            output +=  `<div style="margin-top: 5px;margin-bottom: 5px;display: flex; align-items: center; justify-content: center;" class="highlight-warning-big" onclick="exportjson(false)"
                           onmouseover="this.style.cursor='pointer'" 
                           onmouseout="this.style.cursor='default'">
                           <div style="display: inline-block; vertical-align: middle;"><span class="icon-image" style="font-size:24px;">💾</span></div>
                           <div style="display: inline-block; vertical-align: middle; margin-left: 10px;">
                               U heeft niet opgeslagen wijzigingen. Klik hier om op te slaan<br>
                               of ga naar het "Bestand"-menu voor meer opties.
                           </div>
                        </div>`;
        } else {
            output +=  '<span style="display: inline-block; width: 30px;"></span>';
            output +=  `<div style="margin-top: 5px;margin-bottom: 5px;display: flex; align-items: center; justify-content: center;" class="highlight-ok-big" onclick="topMenu.selectMenuItemByName('Bestand')"
                           onmouseover="this.style.cursor='pointer'" 
                           onmouseout="this.style.cursor='default'">
                           <div style="display: inline-block; vertical-align: middle;"><span class="icon-image" style="font-size:24px; filter: grayscale(100%); opacity: 0.5;">💾</span></div>
                           <div style="display: inline-block; vertical-align: middle; margin-left: 10px;">
                               Er zijn geen niet opgeslagen wijzigingen. Ga naar het "Bestand"-menu<br>
                               indien u toch wenst op te slaan.
                           </div>
                        </div>`;
        }
        
        const ribbonElement = document.getElementById("ribbon");
        const newHTML = `<div id="left-icons">${output}</div>`;
        //if (ribbonElement.innerHTML !== newHTML) {
            ribbonElement.innerHTML = newHTML; // Doesn't make a lot of sense to test as browser changes innerHTML anyway
        //}
    }

    // -- Functie om de tree links te tekenen te starten by node met id = myParent --

    toHTMLinner(ordinal: number) {
        if (this.data[ordinal].collapsed) {
            return(`<tr>
                        <td bgcolor="#8AB2E4" onclick="HLCollapseExpand(${this.data[ordinal].id})" valign= "top">&#x229E;</td>
                        <td width="100%">${this.data[ordinal].toHTML(this.mode)}<br></td>
                    </tr>`);
        } else {
            return(`<tr>
                       <td bgcolor="C0C0C0" onclick="HLCollapseExpand(${this.data[ordinal].id})" valign= "top">&#x229F;</td>
                       <td width="100%">${this.data[ordinal].toHTML(this.mode)}<br>${this.toHTML(this.id[ordinal])}</td>
                    </tr>`);
        }
    }

    updateHTMLinner(id: number) {
        let ordinal: number = this.getOrdinalById(id);
        if (ordinal === null) return; // If id is not found, do nothing

        let div = document.getElementById('id_elem_'+id) as HTMLElement;
        div.innerHTML = this.toHTMLinner(ordinal);
    }

    voegAttributenToeAlsNodigEnReSort() {

        // Verwijder alle attributen die geen kind zijn van een domotica gestuurde verbruiker met externe sturing
        // of van het verkeerde type zijn
        for (let i = 0; i<this.length; i++) {
            if ( (this.data[i].props != null) && ( (this.data[i] as Electro_Item).isAttribuut() ) ) {
                let parentItem: Electro_Item = this.data[i].getParent() as Electro_Item;
                if (parentItem == null) continue;
                if (parentItem.getType() != "Domotica gestuurde verbruiker") continue;
                if (parentItem.props.heeft_externe_sturing == true) {
                    switch (parentItem.props.type_externe_sturing) {
                        case "schakelaar":
                            // Als het attribuut al een schakelaar is, dan doen we niets, anders maken we er een schakelaar van
                            if (this.data[i].props.type == "Schakelaars") continue;
                            Object.setPrototypeOf(this.data[i], Schakelaars.prototype);
                            this.data[i].resetProps(); this.data[i].props.isAttribuut = true; 
                            continue; 
                        case "drukknop":
                            if (this.data[i].props.type == "Drukknop") continue;
                            Object.setPrototypeOf(this.data[i], Drukknop.prototype);
                            this.data[i].resetProps(); this.data[i].props.isAttribuut = true; 
                            continue;
                        default:
                            continue;
                    }
                }
                    
                // Als al het bovenstaande faalt, dan hebben we een attribuut dat er niet mag zijn of van het verkeerde type is en maken 
                // we ons klaar om dat te verwijderen. reSort aan het einde van deze functie zal het effectieve
                // verwijderen uitvoeren
                this.active[i] = false;
            }
        }

        // Ga opnieuw over alle items om attributen toe te voegen waar het nodig is
        for (let i = 0; i<this.length; i++) {

            // Check of het item een domotica gestuurde verbruiker is met externe sturing
            if ( (this.active[i]) && ((this.data[i] as Electro_Item).getType() == "Domotica gestuurde verbruiker" )
                                  && (this.data[i].props.heeft_externe_sturing == true) ) {

                // Check of de externe sturing reeds als attribuut in de datastructuur hangt 
                let heeftAttribuut = false;
                for (let j = 0; j<this.length; j++) {
                    if (this.active[j] && (this.data[j].parent == this.id[i])
                    && ( (this.data[j] as Electro_Item).isAttribuut() ) )
                        heeftAttribuut = true;
                }

                // Indien het attribuut nog niet bestaat creëren we het
                if (!heeftAttribuut) {
                    let newElement: Electro_Item = null;
                    switch (this.data[i].props.type_externe_sturing) {
                        case "schakelaar":
                            newElement = this.createItem("Schakelaars");
                            newElement.props.type_schakelaar = "enkelpolig";
                            break;
                        case "drukknop":
                        default:
                            newElement = this.createItem("Drukknop");
                            break;
                    }
                    if (newElement != null) {
                        newElement.props.isAttribuut = true;
                        this.insertChildAfterId(newElement, this.id[i]);
                        this.voegAttributenToeAlsNodigEnReSort(); // De volgorde is gewijzigd dus we lanceren de functie opnieuw
                        return;
                    }
                }
            }
        }

        // herStoreren van de matrix

        this.reSort();
          
    }

    toHTML(myParent: number) {
        
        // Als we alles tekenen mogen we ook de ribbon niet vergeten te updaten
        if (myParent==0) {
            this.updateRibbon();
            this.reNumber();
        }

        // Enkele variabelen initialiseren
        let parent = this.getElectroItemById(myParent);
        let output: string = "";
        let aantalElementen: number = 0;
        let aantalKringen: number = 0;

        // Genereer de HTML voor de elementen die onder myParent hangen
        for (let i = 0; i<this.length; i++) {
            if (this.active[i] && (this.data[i].parent == myParent)
            && !( (this.data[i] as Electro_Item).isAttribuut() ) 
            && !((this.data[i] as Electro_Item).getType() == "Container") ) {
                aantalElementen++;
                const electroItemType = (this.data[i] as Electro_Item).getType();
                if (electroItemType == "Container") continue; // We tekenen de container niet zelf
                if (electroItemType != null && electroItemType == "Kring") aantalKringen++;
                output += '<table class="html_edit_table" id="id_elem_' + this.id[i]  + '">';
                output += this.toHTMLinner(i);
                output += "</table>";
            }
        };

        // Indien we het volledige schema aan het tekenen zijn, maar er valt niets te tekenen, dan gevven we enkel een melding om een nieuw schema te starten
        if ( (myParent == 0) && (aantalElementen<1) ) {
            output += "<button onclick=\"HLAdd()\">Voeg eerste object toe of kies bovenaan \"Nieuw\"</button><br>"; //no need for the add button if we have items
        };
        
        // Indien we een kring hebben met meer dan 1 kring als kind, dan geven we een waarschuwing en vragen we dit anders te doen
        if (parent != null && parent.getType() == "Kring" && aantalKringen > 1) {
            const EDStekenFoutKleur = trimString(getComputedStyle(document.documentElement).getPropertyValue('--EDStekenFoutKleur'));
            const arrowstr = insertArrow(EDStekenFoutKleur);
            output = `<div class="EDS-tekenfout">`
                   + `<b>Tekenfout:</b> U heeft meer dan 1 kring achter deze kring gehangen, Kring ${arrowstr} {Kring, Kring, &#8230;}. Dat is niet gebruikelijk.<br>`
                   + `Als u hier een vertakking wilt, gebruik dan eerst het "Splitsing"-element: Kring ${arrowstr} Splitsing ${arrowstr} {Kring, Kring, &#8230;}.<br>`
                   + `Als u daadwerkelijk verticaal gestapelde kringen in het schema wilt, is het correcter ze hiërarchisch onder elkaar te hangen: Kring ${arrowstr} Kring ${arrowstr} Kring.<br>`
                   + "</div>" + output;
        }

        // Indien we een Aansluiting hebben met meer dan 1 kind, dan geven we een waarschuwing en vragen we dit anders te doen
        if (parent != null && parent.getType() == "Aansluiting" && aantalElementen > 1) {
            const EDStekenFoutKleur = trimString(getComputedStyle(document.documentElement).getPropertyValue('--EDStekenFoutKleur'));
            const arrowstr = insertArrow(EDStekenFoutKleur);
            output = `<div class="EDS-tekenfout">`
                   + `<b>Tekenfout:</b> U heeft meer dan 1 element achter een aansluiting gehangen, Aansluiting ${arrowstr} {Element1, Element2, &#8230;}. Dat is niet gebruikelijk.<br>`
                   + `Het is correcter om elementen achter een aansluiting als volgt te stapelen: Aansluiting ${arrowstr} Element1 ${arrowstr} Element2 ${arrowstr} &#8230;.<br>`
                   + `Verwijder het teveel aan elementen of gebruik de werkmodus "Verplaatsen/Clone" bovenaan om ze onder elkaar te hangen.`
                   + "</div>" + output;
        }

        return(output);
    }

    /** Functie om de naam van een kring te vinden waartoe een element behoord 
     * 
    */

    findKringName(my_id: number) : string {
        let myOrdinal = this.getOrdinalById(my_id);
        if (myOrdinal == null) return(""); // If my_id is not found, do nothing

        let myParent = this.data[myOrdinal].parent;
        if (myParent == 0) {
            return("");
        } else {
            let myParentOrdinal = this.getOrdinalById(myParent);
            if (myParentOrdinal == null) return("");
            if ((this.data[myParentOrdinal] as Electro_Item).getType() == "Kring") {
                let kringnaam:string = trimString(this.data[myParentOrdinal].props.naam);
                if (kringnaam != "") {
                    return(this.data[myParentOrdinal].props.naam);
                } else {
                    return(this.findKringName(myParent));
                }
            } else {
                return(this.findKringName(myParent));
            }
        }
    }

    /**
     * Deze functie zorgt ervoor dat alle kringen een unieke naam krijgen.
     * Indien autoKringNaam is ingesteld op "auto", dan wordt de naam automatisch gegenereerd.
     * De namen worden gegenereerd in de volgorde van het alfabet, beginnend met "A", "B", ..., "Z", "AA", "AB", ..., "ZZ", "AAA", "AAB", ..., enzovoort.
     */

    updateKringNamen() {

        function changeInLeftColIfOpen(id: number, newname: string) {
            let div: HTMLInputElement = (document.getElementById(`HL_edit_${id}_naam`) as HTMLInputElement);
            if (div) {
                if (div.value != newname) div.value = newname;
            }
        }

        function vindVolgendeKringNaam(kringNamen: { [kring: string]: boolean }): string {
            let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let nextName = "";
            let found = false;

            // Loop through the letters and find the first available name
            for (let i = 0; i < letters.length; i++) {
                nextName = letters[i];
                if (!kringNamen[nextName]) { found = true; break; }
            }

            // If no single letter name was found, we need to create a two-letter name
            if (!found) {
                for (let i = 0; i < letters.length; i++) {
                    for (let j = 0; j < letters.length; j++) {
                        nextName = letters[i] + letters[j];
                        if (!kringNamen[nextName]) { found = true; break; }
                    }
                    if (found) break;
                }
            }

            // If still not found, we use a three-letter name
            if (!found) {
                for (let i = 0; i < letters.length; i++) {
                    for (let j = 0; j < letters.length; j++) { 
                        for (let k = 0; k < letters.length; k++) {
                            nextName = letters[i] + letters[j] + letters[k];
                            if (!kringNamen[nextName]) { found = true; break; }
                        }
                        if (found) break;
                    }
                    if (found) break;
                }
            }

            return nextName;
        }

        function bestaandeKringNamen(): { [kring: string]: boolean } {
            let kringNamen: { [kring: string]: boolean } = {}; // Object to keep track of kring names we have already seen
            for (let i = 0; i<this.length; i++) {
                if (!this.active[i]) continue;

                let electroItem = this.data[i] as Electro_Item;
                if (electroItem == null) continue;

                let electroType = electroItem.getType();
                if (electroType == null) continue;

                if ( (electroType == "Kring") && (electroItem.props.autoKringNaam !== "auto") ) {
                    // We have a kring, so we store the name in the list of names we have already seen
                    let kringnaam = trimString(electroItem.props.naam);
                    if (kringnaam != "") {
                        kringNamen[kringnaam] = true; // Store the name in the object
                    }
                }
            }
            return kringNamen
        }            

        // Eerst maken we een lookup structuur aan van alle kringen
        let kringNamen: { [kring: string]: boolean } = bestaandeKringNamen.call(this);

        // Nu lopen we doorheen alle kringen.  
        // Als electroItem.props.autoKringNaam is true, dan roepen we vindVolgendeKringNaam aan en zetten we electroItem.props.naam hieraan gelijk.
        // We voegen de naam ook toe aan onze lijst met namen die we al kennen.
        for (let i = 0; i<this.length; i++) {
            if (!this.active[i]) continue;
            
            let electroItem = this.data[i] as Electro_Item;
            if ( (electroItem == null) || (electroItem.isAttribuut()) ) continue;

            let electroType = electroItem.getType();
            if (electroType == null) continue;

            // Zoek naar kringen die een automatische naam moeten krijgen
            if (electroType == "Kring") {
                if (electroItem.props.autoKringNaam === "auto") {
                    let newName = "";

                    if (contains(["automatisch","differentieel","differentieelautomaat","smelt"],electroItem.props.bescherming)) {
                        newName = vindVolgendeKringNaam(kringNamen);
                    }
                    
                    kringNamen[newName] = true; // Add the new name to the list of names we have already seen
                    if (electroItem.props.naam != newName) {
                        electroItem.props.naam = newName; // Set the new name
                        changeInLeftColIfOpen(electroItem.id, newName); // Update the left column in the EDS view if it is open
                    }
                    
                }
            }
        }
    }

    /** Functie om de nummers van de kringen en verbruikers aan te passen
     * 
     * Deze functie gaat doorheen alle actieve items en past de nummers aan indien nodig.
     * Het houdt rekening met autonummering en zorgt ervoor dat de nummers uniek zijn binnen een kring.
     * 
     * @returns true indien er wijzigingen zijn gemaakt, anders false
     */
    reNumber() {

        function changeInLeftColIfOpen(id: number, newnr: string) {
            let div: HTMLInputElement = (document.getElementById(`HL_edit_${id}_nr`) as HTMLInputElement);
            if (div) {
                if (div.value != newnr) div.value = newnr;
            }
        }

        // Eerst sorteren we de lijst opnieuw en zorgen we ervoor dat alle kringen een naam hebben
        this.reSort();
        this.updateKringNamen(); // Zorg ervoor dat de kringen namen hebben

        // Nu gaan we doorheen alle items en passen we de nummers aan indien nodig
        let lastNumbers: { [kring: string]: number } = {}; // Object to keep track of last numbers for each type
        let itemsZonderNr: Array<string> = ["", "Bord", "Kring", "Splitsing"];
        
        for (let i = 0; i<this.length; i++) {
            if (!this.active[i]) continue;

            let electroItem = this.data[i] as Electro_Item;
            if ( (electroItem == null) || (electroItem.isAttribuut()) ) continue;

            let electroType = electroItem.getType();
            if (electroType == null) continue;

            let parent:Electro_Item = (electroItem.getParent() as Electro_Item);
            if (parent == null) continue;

            let kringnaam = this.findKringName(electroItem.id);

            if (electroType == "Bord") {
                // indien we een bord tegen komen tellen we elke kring opnieuw vanaf 1
                for (let kring in lastNumbers) lastNumbers[kring] = 0;
            } else if (electroType == "Kring") {
                if (parent.getType() === "Bord") {
                    let kring = trimString(electroItem.props.naam);
                    lastNumbers[kring] = 0;
                }
            } else if (!contains(itemsZonderNr, (this.data[i] as Electro_Item).getType())) {
                let electroItem: Electro_Item = this.data[i] as Electro_Item; if (electroItem == null) continue;
                let parent:Electro_Item = (electroItem.getParent() as Electro_Item); if (parent == null) continue;
                if ( (parent.getType() == "Kring") || (parent.getType() == "Domotica module (verticaal)") ) {
                    if (electroItem.props.autonr === 'auto') {
                        // We hebben een autonummering, dus we gaan het nummer aanpassen
                        lastNumbers[kringnaam] = (lastNumbers[kringnaam] || 0) + 1; // Increment the last number for this kring
                        let newnr = lastNumbers[kringnaam].toString(); 
                        if (electroItem.props.nr != newnr) {
                            electroItem.props.nr = newnr; // Set the new number
                            changeInLeftColIfOpen(electroItem.id, newnr); // Update the left column if it is open
                        }
                    } else {
                        // if electroItem.props.nr is a true number, we set lastNumber to that number
                        if (electroItem.props.nr != null && !isNaN(Number(electroItem.props.nr))) lastNumbers[kringnaam] = Number(electroItem.props.nr);
                    }
                }
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
            if (this.active[i]
                && !( (this.data[i] as Electro_Item).isAttribuut() ) 
                && ( (this.data[i].parent == myParent) || ( (includeparent==true) && (this.id[i] == myParent) ) ) ) {

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

                    case "Omvormer":
                        inSVG[elementCounter] = this.data[i].toSVG(); //Maak de tekening
                        this.tekenVerticaleLijnIndienKindVanKring(this.data[i] as Electro_Item,inSVG[elementCounter]);         
                        break;

                    case "Aftakdoos":
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

                    case "Container":
                        break;

                    default:
                        const parentElectroItem = this.getElectroItemById(myParent) as Electro_Item | null;
                        if (
                            myParent != 0 &&
                            parentElectroItem != null &&
                            parentElectroItem.getType() == "Meerdere verbruikers"
                        ) {
                            inSVG[elementCounter] = this.data[i].toSVG();
                        } else if (stack == "vertical") {
                            inSVG[elementCounter] = this.toSVG(this.id[i], "horizontal", 0, true); //if we are still in vertical mode, switch to horizontal and take childs with us
                        } else { //we are in horizontal mode and can start drawing
                            if (this.id[i] == myParent) { // Element is de parent en tekent zichzelf
                                inSVG[elementCounter] = this.data[i].toSVG();
                            } else { // Element is niet de parent, we tekenen het element en al zijn kinderen
                                inSVG[elementCounter] = this.toSVG(this.id[i],"horizontal",0,true); //if we are still in vertical mode, switch to horizontal and take childs with us
                            }
                        }
                        this.tekenVerticaleLijnIndienKindVanKring(this.data[i] as Electro_Item,inSVG[elementCounter]);
                        break;
                }
                if (mytype !== 'Container') elementCounter++;
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
                  if (inSVG[i].yup + inSVG[i].ydown > 0) {
                      outSVG.connectorPos.push(height - inSVG[i].yup);
                  } else {
                      outSVG.connectorPos.push(null);
                  }
                }
                max_xleft = Math.max(minxleft, max_xleft);
                width = max_xleft + max_xright;

                // decide on the output structure
                outSVG.yup = height; //As a general rule, there is no ydown, but to be confirmed
                outSVG.ydown = 0;
                //outSVG.xleft = Math.max(max_xleft,35); // foresee at least 35 for text at the left
                outSVG.xleft = max_xleft;

                if (elementCounter > 0) {
                    outSVG.firstChildydown = inSVG[0].ydown;
                    outSVG.lastChildyup = inSVG[elementCounter-1].yup;
                }

                let parentItem: Electro_Item = this.getElectroItemById(myParent);
                if (parentItem != null && parentItem.getType() == "Kring") max_xright += 10; // Altijd 10 extra rechts voorzien voor uitstekende tekst/adressen

                if (!(this.getElectroItemById(myParent) instanceof Omvormer) && 
                    !(this.getElectroItemById(myParent) instanceof Aftakdoos)) {
                    outSVG.xright = Math.max(max_xright,25); // foresee at least 25 at the right
                } else {
                    outSVG.xright = Math.max(max_xright,0);
                }

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

        //outSVG.data += "\n";

        if (myParent==0) { //We will always foresee a 20 pixel horizontal and 5 pixel vertical margin
          let header: string = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" transform=\"scale(1,1)\" width=\"" + (width + 20) + "\" height=\"" + (height + 5) + "\">";
          header += SVGSymbols.outputSVGSymbols();
          let footer: string = "</svg>";
          outSVG.data = header + outSVG.data + footer;
        }
        return(outSVG);
    }

    toJsonObject(removeUnneededDataMembers = true) {

        // Remove some unneeded data members that would only inflate the size of the output file
        for (let listitem of this.data) {
            listitem.sourcelist = null;
        }
        let swap:MarkerList = this.print_table.pagemarkers;
        let swap2:SituationPlan = this.sitplan;
        let swap3:SituationPlanView = this.sitplanview;
        let swap4:string = this.properties.currentView;
        
        this.print_table.pagemarkers = null;
        if (this.sitplan != null) this.sitplanjson = this.sitplan.toJsonObject();
        this.sitplan = null;
        this.sitplanview = null;
    
        if (removeUnneededDataMembers) {
            this.properties.currentView = null;
        }
        
        // Create the output structure in uncompressed form
        var text:string = JSON.stringify(this);
    
        // Put the removed data members back
        for (let listitem of this.data) {
            listitem.sourcelist = this;
        }
        this.print_table.pagemarkers = swap;
        this.sitplan = swap2;
        this.sitplanview = swap3;
        this.properties.currentView = swap4;
    
        // Remove sitplanjson again
        this.sitplanjson = null;    
    
        return(text);
    
    }
}
