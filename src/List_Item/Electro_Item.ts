import { List_Item } from "./List_Item";
import { htmlspecialchars, deepClone } from "../general";
import { SVGSymbols } from "../SVGSymbols";
import { SVGelement } from "../SVGelement";
import { Hierarchical_List } from "../Hierarchical_List";
import { SituationPlanElement } from "../sitplan/SituationPlanElement";
import { trimString } from "../general";

export class Electro_Item extends List_Item {

  constructor(mylist: Hierarchical_List) { // This is legacy but we will live with it for now until we completely removed the key-concept
    super(mylist);
    this.resetProps(); // In Javascript, this calls the derived classes
  }

  // -- Lees oude legacy keys (enkel voor EDS versies 001 en 002) --

  getLegacyKey(mykeys: Array<[string,string,any]>, keyid: number) {
    if ( (typeof(mykeys) != 'undefined') && (mykeys.length>keyid) ) {
      return mykeys[keyid][2];
    } else {
      return null;
    }
  }

  // -- Converteer oud key-based systeem (EDS versies 1 en 2) --

  convertLegacyKeys(mykeys: Array<[string,string,any]>) {} // Do nothing if not defined in derived class

  // -- Na creatie van een item, zet alle props op default waarden --

  resetProps() { super.resetProps(); } // overriden in each derived class

  // -- Zoek vader van het Electro_Item --
  
  getParent(): Electro_Item { 
      return(super.getParent() as Electro_Item);
  }

  // -- Lijst met toegestande kinderen van het Electro_item --

  allowedChilds() : Array<string> { 
      return ["", "Aansluiting", "Domotica", "Domotica module (verticaal)", "Domotica gestuurde verbruiker", "Leiding", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Contactdoos", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Media", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zekering/differentieel", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Zeldzame symbolen"];
  }

  // -- Aantal actieve kinderen van het Electro_item, attributes worden niet geteld --

  getNumChildsWithKnownType() : number {
      let numChilds = 0;
      if (this.sourcelist != null) {
          for (let i=0; i<this.sourcelist.data.length; ++i) {
              if ( (this.sourcelist.data[i].parent === this.id) && (this.sourcelist.active[i]) 
                && ((this.sourcelist.data[i] as Electro_Item).getType() != "") 
                && !(this.props.isAttribuut)) numChilds++;
          }  
      }
      return(numChilds);
  }

  // -- Check of Electro_item een kind heeft, attributen worden niet als kind beschouwd
  //    i.e. electro-Items waarvoor props.attribuut == true --

  heeftKindMetGekendType() : boolean {
    return(this.getNumChildsWithKnownType() > 0);
  }

  // -- Check of [item] een vrije tekst zonder kader is --

  isVrijeTekstZonderKader() : boolean {
    if (this.getType() == "Vrije tekst") {
      if (this.props.vrije_tekst_type == "zonder kader") return true; else return false;
    } else return false;
  }

  // -- Checken of parent een gevraagd type is --

  isChildOf(typestr: string) {
      if (this.parent != 0) return (this.getParent().getType() == typestr); else return false;
  }

  // Checken of Electro item een attribuut is (in casu externe sturing van Domotica Gestuurde Verbruiker)

  isAttribuut() : boolean { 
      return this.props.isAttribuut; // zal false teruggeven als isAttribuut niet gedefinieerd is
  }

  // -- Check of er een streepje moet geplaatst worden achter bepaalde elementen zoals een contactdoos of lichtpunt --

  heeftVerbruikerAlsKind() : boolean {
    let parent = this.getParent();

    if ( (parent != null) && ((parent as Electro_Item).getType() == "Meerdere verbruikers") ) {
        let myOrdinal = this.sourcelist.getOrdinalById(this.id);
        if (myOrdinal === null) return false; // This should never happen, but just in case
        
        let lastOrdinal = 0;
        for (let i = 0; i<this.sourcelist.data.length; ++i) {
            if (this.sourcelist.active[i] && !((this.sourcelist.data[i] as Electro_Item).isVrijeTekstZonderKader()) && (this.sourcelist.data[i].parent == this.parent)) lastOrdinal = i;
        }
        if (lastOrdinal > myOrdinal) return true; else return false; 
    } else {
        if (this.sourcelist != null) {
            for (let i=0; i<this.sourcelist.data.length; ++i) {
                if ( (this.sourcelist.data[i].parent === this.id) && 
                     (this.sourcelist.active[i]) && !((this.sourcelist.data[i] as Electro_Item).isVrijeTekstZonderKader()) && 
                     ((this.sourcelist.data[i] as Electro_Item).getType() != "") && ((this.sourcelist.data[i] as Electro_Item).getType() != null) ) return true;
            }  
        }
    }  

    return false;
  }

  // -- Maak het huidige Electro_item een copy van source_item --

  clone(source_item: List_Item) {

    this.parent = source_item.parent;
    this.indent = source_item.indent;
    this.collapsed = source_item.collapsed;
    this.sourcelist = source_item.sourcelist;

    this.props = deepClone((source_item as Electro_Item).props);  
  }

  // -- Type van het Electro_item teruggeven --

  getType() : string { return this.props.type; }

  //-- Clear all keys, met uitzondering van nr indien er een nummer is --

  clearProps() {
      let oldautonr: string = "auto";
      let oldautoKringNaam: string = "auto";
      let oldnr: string = "";

      if (typeof(this.props.autonr) != 'undefined') oldautonr = this.props.autonr;
      if (typeof(this.props.autoKringNaam) != 'undefined') oldautoKringNaam = this.props.autoKringNaam;
      if (typeof(this.props.nr) != 'undefined') oldnr = this.props.nr;

      this.props = {};
      this.props.nr = oldnr;
      if (oldautonr !== null) this.props.autonr = oldautonr;
      if (oldautoKringNaam !== null) this.props.autoKringNaam = oldautoKringNaam;
  }

  // -- Returns the maximum number of childs the Electro_Item can have --

  getMaxNumChilds(): number {
    let parent: Electro_Item = this.getParent();
    if (parent == null) return 256; //This should never happen, all allowed childs of null have their own implementations of getMaxNumChilds() and will never call this.
    switch ((parent as Electro_Item).getType()) {
      case "Meerdere verbruikers": return 0;  break;  // Childs of "Meerdere verbruikers" cannot have childs
      default:                     return 1;  break;  // By default, most element can have 1 child unless overwritten by derived classes
    } 
  }

  // -- Tel aantal kinderen, Attributes worden niet geteld --

  getNumChilds() : number {
      let numChilds = 0;
          for (let i=0; i<this.sourcelist.data.length; ++i) {
              if ((this.sourcelist.data[i].parent === this.id) && (this.sourcelist.active[i])
              && !((this.sourcelist.data[i] as Electro_Item).isAttribuut())) numChilds++;
          }  
      return(numChilds);
  }

  // -- Returns true if the Electro_Item can take an extra childs --

  checkInsertChild() { return(this.getMaxNumChilds() > this.getNumChilds()); }

  // -- Returns true if the parent can take an extra child --

  checkInsertSibling() {
    let parent: Electro_Item = this.getParent();
    if (parent == null) return true;
    else return(parent.getMaxNumChilds() > parent.getNumChilds());
  }

  // -- Displays the navigation buttons for the Electro_Item, i.e. the green and blue arrows, and the selection of the Type (Bord, Kring, ...) --

  toHTMLHeader(mode: string) {
    let output:string = "";
    
    if (mode=="move") {
      output += "<b>ID: "+this.id+"</b>, ";
      output += 'Moeder: <input id="id_parent_change_' + this.id + '" type="text" size="2" value="' + this.parent + '" onchange="HL_changeparent(' + this.id + ')"> ';
      output += `<button class="button-lightblue" onclick="HLMoveUp(${this.id})">&#9650;</button>`;
      output += `<button class="button-lightblue" onclick="HLMoveDown(${this.id})">&#9660;</button>`;
      if (this.checkInsertSibling()) {
        output += `<button class="button-lightblue" onclick="HLClone(${this.id})">Clone</button>`;
      }
    } else {
      if (this.checkInsertSibling()) {
        output += `<button class="button-insertBefore" onclick="HLInsertBefore(${this.id})"></button>`;
        output += `<button class="button-insertAfter" onclick="HLInsertAfter(${this.id})"></button>`;
      }
      if (this.checkInsertChild()) {
        output +=  `<button class="button-insertChild" onclick="HLInsertChild(${this.id})"></button>`;
      }
    };
    output += `<button class="button-delete-garbage-can" onclick="HLDelete(${this.id})"></button>`;
    output += "&nbsp;"

    let parent:Electro_Item = this.getParent();
    let consumerArray: Array<string>;
    
    if (parent == null) consumerArray = ["", "Aansluiting", "Zekering/differentieel", "Kring"];
    else consumerArray = this.getParent().allowedChilds()

    //output += '<div class="type-orange">';
    output += this.selectPropToHTML('type', consumerArray, 175);
    //output += '</div>';

    return(output);
  }

  // -- Displays the Expand button for the Electro_item, in case the item is expandable --

  toHTMLFooter() {
    if (this.isExpandable()) {
      return(` <button title="Meerdere elementen (bvb schakelaars) omzetten in indivuele elementen" style="background-color:lightblue;" onclick="HLExpand(${this.id})">Uitpakken</button>`);
    } else {
      return("");
    }
  }

  // -- This one will get called if the type of the Electro_Item has not yet been chosen --

  toHTML(mode: string) { return(this.toHTMLHeader(mode)); } // Implemented in the derived classes

  // -- Get the number of the Electro_Item, if it is not defined, ask the parent

  getnr() {
      let parent:Electro_Item = (this.getParent() as Electro_Item);
      if (parent != null) {
          switch (parent.getType()) {
              case "Kring": 
              case "Domotica module (verticaal)":
                  return this.props.nr? this.props.nr : "";
              default: 
                  return parent.getnr();
          }
      } else {
          return "";
      };
  }

  // -- Get readable address of the Electro_Item, if it is not defined, ask the parent --

  getReadableAdres() {
      if (this.getType() == "Bord") {
          let str = this.props.naam;
          if (str == null) str = "";
          return str;
      } else {
        let kringname:string = trimString(this.sourcelist.findKringName(this.id));
        let nr:string = trimString(this.getnr());

        if (kringname == "") return nr;
        else if (nr == "") return kringname
        else return kringname + "." + nr;
      }
  }

  // -- Display the number in the html tree view, but only if it is displayable

  nrToHtml() {
      if (typeof(this.props.autonr) == undefined) this.props.autonr = "manueel"; // false voor compatibiliteit met oude schema's
      let str = "";
      let parent:Electro_Item = (this.getParent() as Electro_Item);
      if (parent != null) {
          if ( (parent.getType() == "Kring") || (parent.getType() == "Domotica module (verticaal)") ) {
                str += `Nr: ${this.selectPropToHTML('autonr',['auto','manueel'])}`
                  +  (this.props.autonr === 'auto'
                  ? `<input type="text" id="HL_edit_${this.id}_nr" size="2" value="${this.props.nr ?? ''}" disabled />`
                  : this.stringPropToHTML('nr',2)) 
                  + ', ';
          } else {
              this.props.nr = "";
          }
      };
      return(str);
  };

  // -- Code to add the addressline below when drawing SVG. This is called by most derived classes --

  addAddressToSVG(mySVG: SVGelement, starty:number = 60, godown:number = 15, shiftx:number = 0): String {
    let returnstr:string = "";
    if (!(/^\s*$/.test(this.props.adres))) { //check if adres contains only white space
      returnstr = '<text x="' + ((mySVG.xright-20)/2 + 21 + shiftx) + '" y="' + starty + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.props.adres) + '</text>';
      mySVG.ydown = mySVG.ydown + godown;
    }
    return returnstr;
  }

  // -- Make the SVG for the electro item, placeholder for derived classes --

  toSVG(sitplan: boolean = false, mirror: boolean=false): SVGelement { return(new SVGelement()); } //Placeholder for derived classes

  /** ToSituationPlanElement
   * 
   * @returns {SituationPlanElement} The SituationPlanElement that represents this Electro_Item
   */

  toSituationPlanElement() {
    let myElement = new SituationPlanElement();
    //this.updateSituationPlanElement(myElement); //Lijkt niet nodig aangezien dit zoiezo gebeurt in getScaledSVG bij iedere update
    return(myElement);
  }


/** 
 * Functie geeft aan of een Electro_Item nog verder kan uitgesplitst worden in kleinere Items.
 * Deze is vooral nuttig voor het situatieschema om groepen van schakelaars of een lichtcircuit te herkennen.
 */
  isExpandable() {
    return false;
  }

  /**
   * Deze functie splitst een Electro_Item verder uit in kleinere Items.  Dit is uiteraard enkel mogelijk indien isExpandable() true geeft.
   * De aanpassing wordt direct op de sourcelist uitgevoerd.
   */
  expand() {
    if (!this.isExpandable()) return;
  }

  /**
   * Geeft het maximum aantal elementen dat een Electro_Item kan hebben in een situatieplan.
   * 
   * @returns {number} Het maximum aantal elementen dat een Electro_Item kan hebben in een situatieplan.
   */

  maxSituationPlanElements() {
    return 1;
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
      clipleft: 12,
      addright: 0,
      cliptop: 0,
      addbottom: 0
    }
  }

  /**
   * Genereert de SVG voor gebruik in het Situatieplan.  Deze wordt gegenereerd op basis van de standaard SVG in het eendraadschema
   * maar met extra aanpassingen:
   * - de getSVG functies van het Electro_Item worden aangeroepen met een flag dat het hier over een situatieplan symbool gaat.  Dit zal er vaak toe leiden dat het stukje leiding links niet getekend wordt.
   *   ook is het in dat geval niet altijd nodig om alle tekst rond de symbolen te zetten.
   * - er kunnen clipping operaties plaats vinden omdat de bounding box van het SVG element geoptimaliseerd werd voor gebruik in het eendraadschema en dit is niet noodzakelijk handig
   *   voor gebruik in het situatieplan.
   * 
   * @param myElement - Het SituationPlanElement waarvoor de SVG gecreëerd moet worden.
   */
  updateSituationPlanElement(myElement: SituationPlanElement) {
    
    let spiegeltext = false;
    let rotate = myElement.rotate % 360;
    if ( (rotate >= 90) && (rotate < 270) ) spiegeltext = true;

    // als we een enkelvoudige schakelaar hebben die niet legacy is, dan spiegelen we niet
    if (this.props.type == "Schakelaars") {
      if (this.sourcelist.properties.legacySchakelaars == false) {
        if ( (this.props.aantal_schakelaars == 1) || (this.props.aantal_schakelaars == null) ) {
          spiegeltext = false;
        }
      }
    }

    SVGSymbols.clearSymbols(); // We gaan enkel de symbolen gebruiken die nodig zijn voor dit element

    let mySVGElement:SVGelement = this.toSVG(true, spiegeltext);
    let sizex = mySVGElement.xright + mySVGElement.xleft + 10;
    let sizey = mySVGElement.yup + mySVGElement.ydown;
   
    let boundaries = this.getSitPlanBoundaries();

    let width = sizex-boundaries.clipleft+boundaries.addright;
    let height = sizey-boundaries.cliptop+boundaries.addbottom;

    myElement.updateElectroItemSVG( '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="scale(1,1)" ' +
                                    `viewBox="${boundaries.clipleft} ${boundaries.cliptop} ${sizex-boundaries.clipleft+boundaries.addright} ${sizey-boundaries.cliptop+boundaries.addbottom}" width="${width}" height="${height}">` +
                                        SVGSymbols.getNeededSymbols() + // enkel de symbolen die nodig zijn voor dit element
                                        mySVGElement.data +
                                    '</svg>',width,height); 
  }

}
