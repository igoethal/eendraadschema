class Electro_Item extends List_Item {

  //-- Constructor, can be invoked with the List_Item of the parent to know better what kind of
  //   elements are acceptable (e.g. not all parent can have all possible childs) --

  constructor(mylist: Hierarchical_List) {
    super(mylist);
    this.keys.push(["type","SELECT",""]); //0
    this.keys.push(["geaard","BOOLEAN",true]); //1
    this.keys.push(["kinderveiligheid","BOOLEAN",true]); //2
    this.keys.push(["accumulatie","BOOLEAN",false]); //3
    this.keys.push(["aantal","SELECT","1"]); //4
    this.keys.push(["lichtkring_poligheid","SELECT","enkelpolig"]); //5
      //Ook gebruikt voor schakelaar (type schakelaar)
      //Ook gebruikt voor externe sturing Domotica gestuurde verbruiker (type sturing)
    this.keys.push(["ventilator","BOOLEAN",false]); //6
    this.keys.push(["zekering","SELECT","automatisch"]); //7
    this.keys.push(["amperage","STRING","20"]); //8
    this.keys.push(["kabel","STRING","XVB 3G2,5"]); //9
    this.keys.push(["naam","STRING",""]); //10
    this.keys.push(["differentieel_waarde","STRING","300"]); //11
    this.keys.push(["kabel_aanwezig","BOOLEAN",true]); //12, In eerste plaats om aan te geven of er een kabel achter een zekering zit.
    this.keys.push(["aantal2","SELECT","1"]); //13, a.o. gebruikt voor aantal lampen of aantal knoppen op drukknop_armatuur
    this.keys.push(["voltage","STRING","230V/24V"]); //14, a.o. gebruikt voor aantal lampen
    this.keys.push(["commentaar","STRING",""]); //15, extra tekstveld
    this.keys.push(["select1","SELECT","standaard"]); //16, algemeen veld
      //Indien lichtpunt, select1 is het type van licht (standaard, TL, ...)
      //Indien drukknop, select1 kan "standaard", "dimmer" of "rolluik" zijn
      //Indien vrije tekst, select1 kan "verbruiker" of "zonder kader" zijn
      //Indien ketel, type is het soort verwarming
      //Indien stopcontact, select1 is het aantal fasen
    this.keys.push(["select2","SELECT","standaard"]); //17, algemeen veld
      //Indien lichtpunt, select2 is de selector voor het type noodverlichting (indien aanwezig)
      //Indien vrije tekst of verbruiker, kan "links", "centreer", "rechts" zijn
      //Indien differentieel of differentieelautomaat (in kring of aansluiting), kan type "", "A", of "B" zijn
      //Indien automaat (in kring of aansluiting), kan curve "", "A", "B", of "C" zijn
    this.keys.push(["select3","SELECT","standaard"]); //18, algemeen veld
      //Indien differentieelautomaat (in kring of aansluiting), kan curve "", "A", "B", of "C" zijn.  Veld 17 is dan het Type.
      //Indien vrije tekst kan je hier kiezen tussen automatisch of handmatige breedte
    this.keys.push(["bool1","BOOLEAN",false]); //19, algemeen veld
      //Indien lichtpunt, bool1 is de selector voor wandverlichting of niet
      //Indien drukknop, bool1 is de selector voor afgeschermd of niet
      //Indien schakelaar/lichtcircuit, bool1 is de selector voor signalisatielamp of niet
      //Indien vrije tekst of verbruiker, bool1 is de selector voor vet
      //Indien stopcontact, bool1 is de selector voor ingebouwde schakelaar
      //Indien domotica gestuurde verbruiker, bool1 is de selector voor draadloos
    this.keys.push(["bool2","BOOLEAN",false]); //20, algemeen veld
      //Indien lichtpunt, schakelaar, drukknop of stopcontact, bool2 is de selector voor halfwaterdicht of niet
      //Indien vrije tekst of verbruiker, bool2 is de selector voor schuin
      //Indien ketel, bool2 is de selector voor energiebron
      //Indien kring, bool2 is de selector voor selectieve differentieel
      //Indien stopcontact, bool2 is de selector voor halfwaterdicht
      //Indien domotica gestuurde verbruiker, bool2 is de selector voor drukknop
    this.keys.push(["bool3","BOOLEAN",false]); //21, algemeen veld
      //Indien lichtpunt, bool3 is de selector voor ingebouwde schakelaar of niet
      //Indien schakelaar of drukknop, bool3 is de selector voor verklikkerlamp of niet
      //Indien ******, bool3 is de selector voor warmtefunctie
      //Indien stopcontact, bool3 is de selector voor meerfasig
      //Indien domotica gestuurde verbruiker, bool3 is de selector voor geprogrammeerd
    this.keys.push(["string1","STRING",""]); //22, algemeen veld
      //Indien vrije tekst of verbruiker, breedte van het veld
      //Indien vrije ruimte, breede van de ruimte
    this.keys.push(["string2","STRING",""]); //23, algemeen veld
      //Indien vrije tekst of verbruiker, het adres-veld (want reeds gebruikt voor de tekst zelf)
      //Indien aansluiting, hier kan ook een extra naam voor de aansluiting staan
    this.keys.push(["string3","STRING",""]); //24, algemeen veld
      //Indien aansluiting, kabeltype vóór de teller
    this.keys.push(["bool4","BOOLEAN",false]); //25, algemeen veld
      //Indien schakelaar, indicatie trekschakelaar of niet
      //Indien stopcontact, bool4 is de selector voor nulgeleider of niet
      //Indien domotica gestuurde verbruiker, bool4 is de selector voor detectie
    this.keys.push(["bool5","BOOLEAN",false]); //26, algemeen veld
      //Indien domotica gestuurde verbruiker, bool5 is de selector voor uitbreiding van de sturing met drukknop
      //Indien stopcontact, geeft aan dat deze in een verdeelbord zit

    this.updateConsumers();
  }

  //-- When called, this one ensures we cannot have a child that doesn't align with its parent --

  getConsumers() {
    var Parent = this.getParent();

    var consumers = [];
    if (Parent == null) {
      consumers = ["", "Kring", "Aansluiting"];
    } else {
      switch (Parent.keys[0][2]) {
        case "Bord": {
          consumers = ["", "Kring", "Vrije ruimte"];
          break;
        }
        case "Splitsing":
        case "Domotica": {
          consumers = ["", "Kring"];
          break;
        }
        case "Kring": {
          consumers = ["", "Aansluiting", "Bord", "Domotica", "Domotica gestuurde verbruiker", "Kring", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
          break;
        }
        case "Meerdere verbruikers": {
          consumers = ["", "Domotica", "Domotica gestuurde verbruiker", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Omvormer", "Overspanningsbeveiliging", "Microgolfoven", "Motor", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
          break;
        }
        case "Domotica gestuurde verbruiker": {
          consumers = ["", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
          break;
        }
        case "Aansluiting": {
          consumers = ["", "Bord", "Kring", "Splitsing"];
          break;
        }
        default: {
          consumers = ["", "Aansluiting", "Domotica", "Domotica gestuurde verbruiker", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stopcontact", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
          break;
        }
      }
    }

    return consumers;
  }

  //-- Make the current item a copy of source_item --

  clone(source_item: List_Item) {
    this.parent = source_item.parent;
    this.indent = source_item.indent;
    this.collapsed = source_item.collapsed;
    this.sourcelist = source_item.sourcelist;
    
    for (var i = 0; i<this.keys.length; i++) {
      for (var j=0; j<3; j++) {
        this.keys[i][j] = source_item.keys[i][j];
      }
    }
  }

  //-- Clear all keys --

  clearKeys() {
    //Whipe most keys; note how we don't reset keys[10][2] as usually we don't want the number to change
    for (let i = 1; i < 10; i++) this.keys[i][2] = "";
    for (let i = 11; i < this.keys.length; i++) this.keys[i][2] = "";  
  }

  //-- When a new element is created, we will call resetKeys to set the keys to their default values --

  resetKeys() {} // Implemented in the derived classes

  //-- Algorithm to manually set a key, but most of the time, the keys-array is updated directly
  //   Note that getKey is defined in List_Item --

  setKey(key: string, setvalue: any) {
    super.setKey(key, setvalue);
    //If type of component changed, reset everything
    if (key=="type") {
      this.resetKeys();
    }
    //Some validation on the input. Do properties still make sense after update
    switch (this.keys[0][2]) {
      case "Lichtcircuit":
        if (this.getKey("lichtkring_poligheid") == "dubbelpolig") {
          if ((this.getKey("aantal") as number) > 2) {
            this.setKey("aantal","2");
          }
        }
        break;
      case "Verwarmingstoestel":
        if ( (this.getKey("accumulatie") == false) && (this.getKey("ventilator") == true) ) {
          this.setKey("ventilator",false);
        }
        break;
      case "Kring":
        if ( ( (this.getKey("aantal") as number) < 1 ) || ( (this.getKey("aantal") as number) > 4 ) ) {
          this.setKey("aantal","2");
        }
        break;
    }
  }

  //-- Returns true if the Electro_Item can have childs in case it is or
  //   will become a child of Parent --

  checkInsertChild(Parent?: List_Item) { //Checks if the insert after button should be displayed or not
    var allow = false;
    switch (this.keys[0][2]) {
      case "Aansluiting":
      case "Bord":
      case "Kring":
      case "Domotica":
      case "Domotica gestuurde verbruiker":
      case "Splitsing":
        allow = true;
        break;
      case "Bel":
      case "Lichtcircuit":
        allow = false;
        break;
      default:
        if (typeof Parent == 'undefined') {
          allow = true;
        } else {
          switch(Parent.keys[0][2]) {
            case "Aansluiting":
            case "Bord":
            case "Domotica":
            case "Splitsing":
            case "Meerdere verbruikers":
              allow = false;
              break;
            default:
              allow = true;
              break;
          }
        }
    }
    return(allow);
  }

  //-- returns the maximum number of childs the current Electro_Item can have in case
  //   it is or will become a child of Parent --

  getMaxNumChilds(Parent?: List_Item) {
    var maxchilds = 0;
    switch (this.keys[0][2]) {
      case "Aansluiting":
      case "Bord":
      case "Kring":
      case "Domotica":
      case "Splitsing":
      case "Meerdere verbruikers":
        maxchilds = 256;
        break;  

      case "Domotica gestuurde verbruiker":
        maxchilds = 1;
        break;  
      
      case "Bel": 
      case "Lichtcircuit":
      case "Vrije ruimte":
        maxchilds = 0;
        break;

      default:
        if (typeof Parent == 'undefined') {
          maxchilds = 256;
        } else {
          switch(Parent.keys[0][2]) {
            case "Aansluiting":
            case "Bord":
            case "Domotica":
            case "Splitsing":
            case "Meerdere verbruikers":
              maxchilds = 0;
              break;
            default:
              maxchilds = 1;
              break;
          }
        }
    }
    return(maxchilds);
  }

  //-- Checks if the insert after button should be displayed or not in case the
  //   element is or will become a child of Parent --

  checkInsertAfter(Parent?: List_Item) {
    var allow = false;
    if (typeof Parent == 'undefined') {
      allow = true;
    } else {
      //alert(Parent.keys[0][2]);
      switch(Parent.keys[0][2]) {
        case "Aansluiting":
        case "Bord":
        case "Kring":
        case "Domotica":
        case "Splitsing":
        case "Meerdere verbruikers":
          allow = true;
          break;
        default:
          allow = false;
          break;
      }
    }
    return(allow);
  }

  toHTMLHeader(mode: string, Parent?: List_Item) {
    let output:string = "";

    if (mode=="move") {
      output += "<b>ID: "+this.id+"</b>, ";
      output += 'Moeder: <input id="id_parent_change_' + this.id + '" type="text" size="2" value="' + this.parent + '" onchange="HL_changeparent(' + this.id + ')"> ';
      output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveUp(" + this.id +")\">&#9650;</button>";
      output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveDown(" + this.id +")\">&#9660;</button>";
      if (this.checkInsertAfter(Parent)) {
        output += " <button style=\"background-color:lightblue;\" onclick=\"HLClone(" + this.id +")\">Clone</button>";
      }
    } else {
      if (this.checkInsertAfter(Parent)) {
        output += " <button style=\"background-color:green;\" onclick=\"HLInsertBefore(" + this.id +")\">&#9650;</button>";
        output += " <button style=\"background-color:green;\" onclick=\"HLInsertAfter(" + this.id +")\">&#9660;</button>";
      }
      if (this.checkInsertChild(Parent)) {
        output += " <button style=\"background-color:green;\" onclick=\"HLInsertChild(" + this.id +")\">&#9654;</button>";
      }
    };
    output += " <button style=\"background-color:red;\" onclick=\"HLDelete(" + this.id +")\">&#9851;</button>";
    output += "&nbsp;"

    output += this.selectToHTML(0, this.getConsumers());

    return(output);
  }

  //-- Display the element in the editing grid at the left of the screen in case the
  //   element is or will become a child of Parent --

  toHTML(mode: string, Parent?: List_Item) { return(this.toHTMLHeader(mode, Parent)); } // Implemented in the derived classes

  //-- Add the addressline below --

  addAddress(mySVG: SVGelement, starty:number = 60, godown:number = 15, shiftx:number = 0, key:number=15): String {
    let returnstr:string = "";
    if (!(/^\s*$/.test(this.keys[key][2]))) { //check if adres contains only white space
      returnstr = '<text x="' + ((mySVG.xright-20)/2 + 21 + shiftx) + '" y="' + starty + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[key][2]) + '</text>';
      mySVG.ydown = mySVG.ydown + godown;
    }
    return returnstr;
  }

  //-- Make the SVG for the entire electro item --

  toSVG(): SVGelement { return(new SVGelement()); } //Placeholder for derived classes
}
