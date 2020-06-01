function isInt(value) {
  return !isNaN(value) &&
         parseInt(value) == value &&
         !isNaN(parseInt(value, 10));
}

function flattenSVG(SVGstruct,shiftx,shifty,node) {
  var str:string = "";

  var X = new XMLSerializer()
  var parser = new DOMParser();

  var outstruct = SVGstruct;
  if (SVGstruct.localName == "svg") {
    if (outstruct.attributes.getNamedItem("x")) { // make SVG a 0,0 element
      shiftx += parseFloat(outstruct.attributes.getNamedItem("x").nodeValue);
      outstruct.attributes.getNamedItem("x").nodeValue = 0;
    }
    if (outstruct.attributes.getNamedItem("y")) { // make SVG a 0,0 element
      shifty += parseFloat(outstruct.attributes.getNamedItem("y").nodeValue);
      outstruct.attributes.getNamedItem("y").nodeValue = 0;
    }
    for (var i = 0; i < SVGstruct.children.length; i++) {
      str = str.concat(flattenSVG(SVGstruct.children[i],shiftx,shifty,node+1),"\n");
    }
    if (node <= 0) {
      //---output[0] = outstruct;
      if (outstruct.attributes.getNamedItem("width")) { // make SVG a 0,0 element
        str = '<svg width="' + (outstruct.attributes.getNamedItem("width").nodeValue)  +
                    '" height="' + (outstruct.attributes.getNamedItem("height").nodeValue) + '">' + str + '</svg>';
      } else {
        str = '<svg>' + str + '</svg>';
      }
    }
  } else {
    if (SVGstruct.localName == "line") {
      if (shiftx != 0) {
        outstruct.attributes.getNamedItem("x1").nodeValue = parseFloat(outstruct.attributes.getNamedItem("x1").nodeValue) + shiftx;
        outstruct.attributes.getNamedItem("x2").nodeValue = parseFloat(outstruct.attributes.getNamedItem("x2").nodeValue) + shiftx;
      }
      if (shifty != 0) {
        outstruct.attributes.getNamedItem("y1").nodeValue = parseFloat(outstruct.attributes.getNamedItem("y1").nodeValue) + shifty;
        outstruct.attributes.getNamedItem("y2").nodeValue = parseFloat(outstruct.attributes.getNamedItem("y2").nodeValue) + shifty;
      }
    }
    if (SVGstruct.localName == "use") {
      if (shiftx != 0) {
        outstruct.attributes.getNamedItem("x").nodeValue = parseFloat(outstruct.attributes.getNamedItem("x").nodeValue) + shiftx;
      }
      if (shifty != 0) {
        outstruct.attributes.getNamedItem("y").nodeValue = parseFloat(outstruct.attributes.getNamedItem("y").nodeValue) + shifty;
      }
    }
    if (SVGstruct.localName == "rect") {
      if (shiftx != 0) {
        outstruct.attributes.getNamedItem("x").nodeValue = parseFloat(outstruct.attributes.getNamedItem("x").nodeValue) + shiftx;
      }
      if (shifty != 0) {
        outstruct.attributes.getNamedItem("y").nodeValue = parseFloat(outstruct.attributes.getNamedItem("y").nodeValue) + shifty;
      }
    }
    if (SVGstruct.localName == "circle") {
      if (shiftx != 0) {
        outstruct.attributes.getNamedItem("cx").nodeValue = parseFloat(outstruct.attributes.getNamedItem("cx").nodeValue) + shiftx;
      }
      if (shifty != 0) {
        outstruct.attributes.getNamedItem("cy").nodeValue = parseFloat(outstruct.attributes.getNamedItem("cy").nodeValue) + shifty;
      }
    }
    if (SVGstruct.localName == "text") {
      outstruct.attributes.getNamedItem("x").nodeValue = parseFloat(outstruct.attributes.getNamedItem("x").nodeValue) + shiftx;
      outstruct.attributes.getNamedItem("y").nodeValue = parseFloat(outstruct.attributes.getNamedItem("y").nodeValue) + shifty;
      if (outstruct.attributes.getNamedItem("transform")) {
        outstruct.attributes.getNamedItem("transform").value = "rotate(-90 " +
        outstruct.attributes.getNamedItem("x").nodeValue + "," +
        outstruct.attributes.getNamedItem("y").nodeValue + ")";
      }
    }
    if (SVGstruct.localName == "polygon") {
      var polystr_out = "";
      var polystr_in = outstruct.attributes.getNamedItem("points").nodeValue;
      var splitted_in = polystr_in.split(" ");
      for (var countstr = 0; countstr < splitted_in.length; countstr++) {
        var points_in = splitted_in[countstr].split(",");
        polystr_out += (points_in[0]*1+shiftx) + ',' + (points_in[1]*1+shifty);
        if (countstr < splitted_in.length-1) { polystr_out += ' ' }
      }
      outstruct.attributes.getNamedItem("points").nodeValue = polystr_out;
    }
    str = X.serializeToString(outstruct);

    //remove all the xmlns tags
    var regex = /xmlns="[^"]+"/g;
    str = str.replace(regex, '');
  }
  return str;
}

function flattenSVGfromString(xmlstr) {
  var str:string = "";
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlstr, "text/xml"); //important to use "text/xml"
  //str = flattenSVG(xmlDoc.children[0],0,0,0);
  str = flattenSVG(xmlDoc.childNodes[0],0,0,0);
  return str;
}

function htmlspecialchars(my_input)
{
    var str:string
    if (isNaN(my_input)) str = my_input; else str=my_input.toString();

    var map =
    {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, function(m) {return map[m];});
}

function browser_ie_detected()
{
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var trident = ua.indexOf('Trident/');


    if ( (msie > 0) || (trident > 0) ) return true; else return false;
}
class SVGelement {
  data: string;
  xleft: number;
  xright: number;
  xrightmin: number; //is basically the full width of an array of horizontal items excluding the xright of the last item
  yup: number;
  ydown: number;

  constructor() {
    this.data = "";
    this.xleft = 0;
    this.xright = 0;
    this.xrightmin = 0;
    this.yup = 0;
    this.ydown = 0;
  }
}
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
class Electro_Item extends List_Item {
  consumers:Array<String>;

  constructor(Parent?: List_Item) {
    super();
    this.keys.push(["type","SELECT",""]); //0
    this.keys.push(["geaard","BOOLEAN",true]); //1
    this.keys.push(["kinderveiligheid","BOOLEAN",true]); //2
    this.keys.push(["accumulatie","BOOLEAN",false]); //3
    this.keys.push(["aantal","SELECT","1"]); //4
    this.keys.push(["lichtkring_poligheid","SELECT","enkelpolig"]); //5
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
      //Indien drukknop, select1 kan "standaard", "dimmer" or "rolluik" zijn
      //Indien vrije tekst, select1 kan "verbruiker" of "zonder kader" zijn
      //Indien ketel, type is het soort verwarming
    this.keys.push(["select2","SELECT","standaard"]); //17, algemeen veld
      //Indien lichtpunt, select2 is de selector voor het type noodverlichting (indien aanwezig)
      //Indien vrije tekst kan "links", "centreer", "rechts" zijn
    this.keys.push(["select3","SELECT","standaard"]); //18, algemeen veld
    this.keys.push(["bool1","BOOLEAN",false]); //19, algemeen veld
      //Indien lichtpunt, bool1 is de selector voor wandverlichting of niet
      //Indien drukknop, bool1 is de selector voor afgeschermd of niet
      //Indien schakelaar/lichtcircuit, bool1 is de selector voor signalisatielamp of niet
      //Indien vrije tekst, bool1 is de selector voor vet
    this.keys.push(["bool2","BOOLEAN",false]); //20, algemeen veld
      //Indien lichtpunt, schakelaar, drukknop of stopcontact, bool2 is de selector voor halfwaterdicht of niet
      //Indien vrije tekst, bool2 is de selector voor schuin
      //Indien vrije tekst, bool2 is de selector voor energiebron
    this.keys.push(["bool3","BOOLEAN",false]); //21, algemeen veld
      //Indien lichtpunt, bool3 is de selector voor ingebouwde schakelaar of niet
      //Indien schakelaar of drukknop, bool3 is de selector voor verklikkerlamp of niet
      //Indien vrije tekst, bool3 is de selector voor warmtefunctie
    this.keys.push(["string1","STRING",""]); //22, algemeen veld
      //Indien vrije tekst, breedte van het veld
    this.keys.push(["string2","STRING",""]); //23, algemeen veld
      //Indien vrije tekst, het adres-veld (want reeds gebruikt voor de tekst zelf)
    this.keys.push(["string3","STRING",""]); //24, algemeen veld
    this.keys.push(["bool4","BOOLEAN",false]); //25, algemeen veld
      //Indien schakelaar, indicatie trekschakelaar of niet

    this.Parent_Item = Parent;
    this.updateConsumers();
  }

  updateConsumers() {
    if (this.Parent_Item == null) {
      this.consumers = ["", "Kring", "Aansluiting"];
    } else {
      switch (this.Parent_Item.getKey("type")) {
        case "Bord": {
          this.consumers = ["", "Kring"];
          break;
        }
        case "Splitsing":
        case "Domotica": {
          this.consumers = ["", "Kring"];
          break;
        }
        case "Kring": {
          this.consumers = ["", "Aansluiting", "Bord", "Domotica", "Meerdere verbruikers", "Kring", "Splitsing", "---", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Schakelaars", "Stopcontact", "Transformator", "Vaatwasmachine", "Ventilator", "Verwarmingstoestel", "Vrije tekst", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt",
                            "Aftakdoos", "Leeg"];
          break;
        }
        case "Meerdere verbruikers": {
          this.consumers = ["", "Domotica", "Splitsing", "---", "Bel", "Boiler", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Omvormer", "Microgolfoven", "Motor", "Schakelaars", "Stopcontact", "Transformator", "Vaatwasmachine", "Ventilator", "Verwarmingstoestel", "Vrije tekst", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt",
                            "Aftakdoos", "Leeg"];
          break;
        }
        case "Aansluiting": {
          this.consumers = ["", "Bord", "Kring", "Splitsing"];
          break;
        }
        default: {
          this.consumers = [""];
          break;
        }
      }
    }
  }

  resetKeys() {
    this.keys[1][2] = true;
    this.keys[2][2] = true;
    this.keys[3][2] = false;
    this.keys[5][2] = "enkelpolig";
    this.keys[6][2] = false;
    if (this.keys[0][2] == "Aansluiting") {
      this.keys[4][2] = "2";
      this.keys[7][2] = "differentieel";
      this.keys[8][2] = "40";
      this.keys[9][2] = "2x16";
    } else {
      this.keys[4][2] = "1";
      this.keys[7][2] = "automatisch";
      this.keys[8][2] = "20";
      this.keys[9][2] = "XVB 3G2,5";
    };
    if (this.keys[0][2] == "Vrije tekst") {
      this.keys[22][2] = 40;
      this.keys[17][2] = "centreer";
    };
    this.keys[11][2] = "300"; //Differentieel
    if (this.Parent_Item == null) {
      this.keys[12][2] = true;
    } else {
      switch (this.Parent_Item.getKey("type")) { //Kabel_aanwezig
        case "Splitsing":
          this.keys[7][2] = "geen"; //geen zekering per default na splitsing
          this.keys[12][2] = false; //geen kabel per default na splitsing
          break;
        case "Domotica":
          this.keys[7][2] = "geen"; //geen zekering per default na domotica
          break;
        default:
          this.keys[7][2] = "automatisch"; //wel een zekering na bord
          this.keys[12][2] = true; //wel een kabel na bord
          break;
      }
    };
    if (this.keys[0][2] == "Schakelaars") {this.keys[25][2] = false; }
    this.keys[13][2] = "1";
    this.keys[14][2] = "230V/24V";
    this.keys[15][2] = "";
    //-- Set each of the optional booleans to false --
    this.keys[19][2] = false;
    this.keys[20][2] = false;
    this.keys[21][2] = false;
    switch (this.keys[0][2]) { //Special cases
      case "Kring":
        this.keys[10][2] = "---";
        break;
      case "Splitsing":
        //this.keys[10][2] = "";
        break;
      case "Domotica":
        this.keys[15][2] = "Domotica";
        break;
      case "Lichtpunt":
        this.keys[17][2] = "Geen"; //Geen noodverlichting
        break;
      default:
        //this.keys[10][2] = "";
        break;
    };
  }

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
          if ((this.getKey("aantal") as Number) > 2) {
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
        if ( ( (this.getKey("aantal") as Number) < 2 ) || ( (this.getKey("aantal") as Number) > 4 ) ) {
          this.setKey("aantal","2");
        }
        break;
    }
  }

  toHTML(mode: string, Parent?: List_Item) {
    let output:string = "";

    if (mode=="move") {
      output += "<b>ID: "+this.id+"</b>, ";
      output += 'Moeder: <input id="id_parent_change_' + this.id + '" type="text" size="2" value="' + this.parent + '" onchange="HL_changeparent(' + this.id + ')"> ';
      output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveUp(" + this.id +")\">&#9650;</button>";
      output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveDown(" + this.id +")\">&#9660;</button>";
    } else {
      output += " <button style=\"background-color:green;\" onclick=\"HLInsertBefore(" + this.id +")\">&#9650;</button>";
      output += " <button style=\"background-color:green;\" onclick=\"HLInsertAfter(" + this.id +")\">&#9660;</button>";
      output += " <button style=\"background-color:green;\" onclick=\"HLInsertChild(" + this.id +")\">&#9654;</button>";
    };
    output += " <button style=\"background-color:red;\" onclick=\"HLDelete(" + this.id +")\">&#9851;</button>";
    output += "&nbsp;"

    this.updateConsumers();
    output += this.selectToHTML(0, this.consumers);

    switch (this.keys[0][2]) {
      case "Kring":
        output += "&nbsp;Naam: " + this.stringToHTML(10,5) + "<br>";
        output += "Zekering: " + this.selectToHTML(7,["automatisch","differentieel","smelt","geen","---","schemer"]);
        if (this.keys[7][2] != "geen") output += this.selectToHTML(4,["2","3","4"]) + this.stringToHTML(8,2) + "A";
        if (this.getKey("zekering")=="differentieel") {
          output += ", \u0394 " + this.stringToHTML(11,3) + "mA";
        }
        output += "<br>";
        output += "Kabel: " + this.checkboxToHTML(12);
        if (this.getKey("kabel_aanwezig")) {
          output += ", Type: " + this.stringToHTML(9,10);
        }
        output += ", Tekst: " + this.stringToHTML(15,10);
        break;
      case "Aansluiting":
        output += "&nbsp;";
        if (typeof Parent != 'undefined') output += "Nr: " + this.stringToHTML(10,5) + ", ";
        output += "Zekering: " + this.selectToHTML(7,["automatisch","differentieel","smelt","geen"]) +
                                       this.selectToHTML(4,["2","3","4"]) +
                                       this.stringToHTML(8,2) + "A";
        if (this.getKey("zekering")=="differentieel") {
          output += ", \u0394 " + this.stringToHTML(11,3) + "mA";
        }
        output += ", Kabeltype: " + this.stringToHTML(9,10);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      case "Bord":
        output += "&nbsp;Naam: " + this.stringToHTML(10,5) + ", ";
        output += "Geaard: " + this.checkboxToHTML(1);
        break;
      case "Drukknop":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", Type: " + this.selectToHTML(16,["standaard","dimmer","rolluik"]);
        output += ", Verklikkerlampje: " + this.checkboxToHTML(21);
        output += ", Halfwaterdicht: " + this.checkboxToHTML(20);
        output += ", Afgeschermd: " + this.checkboxToHTML(19);
        output += ", Aantal armaturen: " + this.selectToHTML(4,["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"]);
        output += ", Aantal knoppen per armatuur: " + this.selectToHTML(13,["1","2","3","4","5","6"]);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      case "Stopcontact":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5) + ", ";
        output += "Geaard: " + this.checkboxToHTML(1) + ", ";
        output += "Kinderveiligheid: " + this.checkboxToHTML(2) + " ";
        output += "Halfwaterdicht: " + this.checkboxToHTML(20) + ", ";
        output += "Aantal: " + this.selectToHTML(4,["1","2","3","4","5","6"]);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      case "Boiler":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5) + ", ";
        output += "Accumulatie: " + this.checkboxToHTML(3);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      case "Ketel":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", Type: " + this.selectToHTML(16,["", "Met boiler", "Met tapspiraal", "Warmtekrachtkoppeling", "Warmtewisselaar"]);
        output += ", Energiebron: " + this.selectToHTML(17,["", "Elektriciteit", "Gas (atmosferisch)", "Gas (ventilator)", "Vaste brandstof", "Vloeibare brandstof"]);
        output += ", Warmte functie: " + this.selectToHTML(18,["", "Koelend", "Verwarmend", "Verwarmend en koelend"]);
        output += ", Aantal: " + this.selectToHTML(4,["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"]);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      case "Lichtpunt":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5) + ", ";
        output += "Type: " + this.selectToHTML(16,["standaard", "TL", "spot", "led" /*, "Spot", "Led", "Signalisatielamp" */]) + ", ";
        if (this.keys[16][2] == "TL") {
          output += "Aantal buizen: " + this.selectToHTML(13,["1","2","3","4"]) + ", ";
        }
        output += "Aantal lampen: " + this.selectToHTML(4,["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"]) + ", ";
        output += "Wandlamp: " + this.checkboxToHTML(19) + ", ";
        output += "Halfwaterdicht: " + this.checkboxToHTML(20) + ", ";
        output += "Ingebouwde schakelaar: " + this.checkboxToHTML(21) + ", ";
        output += "Noodverlichting: " + this.selectToHTML(17,["Geen", "Centraal", "Decentraal"]);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      case "Lichtcircuit":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", " + this.selectToHTML(5,["enkelpolig", "dubbelpolig", "dubbelaansteking", "---", "dimschakelaar", "bewegingsschakelaar", "schemerschakelaar", "---", "teleruptor", "relais", "dimmer", "tijdschakelaar", "minuterie", "thermostaat"]);
        output += ", Halfwaterdicht: " + this.checkboxToHTML(20);
        if ( (this.keys[5][2] == "enkelpolig") || (this.keys[5][2] == "dubbelpolig") || (this.keys[5][2] == "kruis_enkel") ||
             (this.keys[5][2] == "dubbelaansteking") || (this.keys[5][2] == "wissel_enkel") || (this.keys[5][2] == "dubbel") ||
             (this.keys[5][2] == "dimschakelaar") ) {
          output += ", Verklikkerlampje: " + this.checkboxToHTML(21);
          output += ", Signalisatielampje: " + this.checkboxToHTML(19);
          if (this.keys[5][2] != "dimschakelaar") {output += ", Trekschakelaar: " + this.checkboxToHTML(25); }
        }
        switch (this.getKey("lichtkring_poligheid")) {
          case "enkelpolig":
            output += ", Aantal schakelaars: " + this.selectToHTML(4,["0","1","2","3","4","5"]);
            break;
          case "dubbelpolig":
            output += ", Aantal schakelaars: " + this.selectToHTML(4,["0","1","2"]);
            break;
        }
        output += ", Aantal lichtpunten: " + this.selectToHTML(13,["0","1","2","3","4","5","6","7","8","9","10"]);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      case "Schakelaars":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", " + this.selectToHTML(5,["enkelpolig", "dubbelpolig", "dubbelaansteking", "wissel_enkel", "wissel_dubbel", "kruis_enkel", "---", "dimschakelaar", "bewegingsschakelaar", "schemerschakelaar", "---", "teleruptor", "relais", "dimmer", "tijdschakelaar", "minuterie", "thermostaat", "rolluikschakelaar"]);
        if ( (this.keys[5][2] == "enkelpolig") || (this.keys[5][2] == "dubbelpolig") || (this.keys[5][2] == "kruis_enkel") ||
             (this.keys[5][2] == "dubbelaansteking") || (this.keys[5][2] == "wissel_enkel") || (this.keys[5][2] == "wissel_dubbel") || (this.keys[5][2] == "dubbel") ||
             (this.keys[5][2] == "dimschakelaar") || (this.keys[5][2] == "rolluikschakelaar") ) {
          output += ", Halfwaterdicht: " + this.checkboxToHTML(20);
        }
        if ( (this.keys[5][2] == "enkelpolig") || (this.keys[5][2] == "dubbelpolig") || (this.keys[5][2] == "kruis_enkel") ||
             (this.keys[5][2] == "dubbelaansteking") || (this.keys[5][2] == "wissel_enkel") || (this.keys[5][2] == "wissel_dubbel") || (this.keys[5][2] == "dubbel") ||
             (this.keys[5][2] == "dimschakelaar") ) {
          output += ", Verklikkerlampje: " + this.checkboxToHTML(21);
          output += ", Signalisatielampje: " + this.checkboxToHTML(19);
          if (this.keys[5][2] != "dimschakelaar") {output += ", Trekschakelaar: " + this.checkboxToHTML(25); }
        }
        switch (this.getKey("lichtkring_poligheid")) {
          case "enkelpolig":
            output += ", Aantal schakelaars: " + this.selectToHTML(4,["1","2","3","4","5"]);
            break;
          case "dubbelpolig":
            output += ", Aantal schakelaars: " + this.selectToHTML(4,["1","2"]);
            break;
        }
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      case "Domotica":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", Tekst: " + this.stringToHTML(15,10);
      case "Splitsing":
        break;
      case "Transformator":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", Voltage: " + this.stringToHTML(14,8);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      case "Verwarmingstoestel":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", Accumulatie: " + this.checkboxToHTML(3);
        if (this.getKey("accumulatie")) {
          output += ", Ventilator: " + this.checkboxToHTML(6);
        }
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      case "Vrije tekst":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", Tekst: " + this.stringToHTML(15,10);
        output += ", Type: " + this.selectToHTML(16,["","verbruiker","zonder kader"]);
        output += ", Horizontale alignering: " + this.selectToHTML(17,["links","centreer","rechts"]);
        output += ", Vet: " + this.checkboxToHTML(19);
        output += ", Schuin: " + this.checkboxToHTML(20);
        output += ", Breedte: " + this.stringToHTML(22,3);
        if (this.keys[16][2] != "zonder kader") output += ", Adres/tekst: " + this.stringToHTML(23,2);
        break;
      case "Zonnepaneel":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5) + ", ";
        output += " Aantal: " + this.selectToHTML(4,["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20",
                                                     "21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40"]);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      case "Meerdere vebruikers":
        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
      default:
        output += "&nbsp;Nr: " + this.stringToHTML(10,5);
        output += ", Adres/tekst: " + this.stringToHTML(15,5);
        break;
    }
    //output += "id: " + this.id + " parent: " + this.parent;
    return(output);
  }

  toSVGswitches(hasChild: Boolean, mySVG: SVGelement) {
    let outputstr:string = "";
    var elements:Array<string> = new Array<string>();
    var halfwaterdicht:Array<boolean> = new Array<boolean>();
    var verklikkerlamp:Array<boolean> = new Array<boolean>();
    var signalisatielamp:Array<boolean> = new Array<boolean>();
    var trekschakelaar:Array<boolean> = new Array<boolean>();

    var lowerbound = 20; // How low does the switch go below the baseline, needed to place adres afterwards

    switch (this.getKey("lichtkring_poligheid")) {
      case "wissel_enkel":
        elements.push("wissel_enkel");
        signalisatielamp.push(this.keys[19][2]);
        halfwaterdicht.push(this.keys[20][2]);
        verklikkerlamp.push(this.keys[21][2]);
        trekschakelaar.push(this.keys[25][2]);
        break;
      case "wissel_dubbel":
        elements.push("wissel_dubbel");
        signalisatielamp.push(this.keys[19][2]);
        halfwaterdicht.push(this.keys[20][2]);
        verklikkerlamp.push(this.keys[21][2]);
        trekschakelaar.push(this.keys[25][2]);
        break;
      case "kruis_enkel":
        elements.push("kruis_enkel");
        signalisatielamp.push(this.keys[19][2]);
        halfwaterdicht.push(this.keys[20][2]);
        verklikkerlamp.push(this.keys[21][2]);
        trekschakelaar.push(this.keys[25][2]);
        break;
      case "teleruptor":
        elements.push("teleruptor");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "bewegingsschakelaar":
        elements.push("bewegingsschakelaar");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "schemerschakelaar":
        elements.push("schemerschakelaar");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "dimmer":
        elements.push("dimmer");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "relais":
        elements.push("relais");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "minuterie":
        elements.push("minuterie");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "thermostaat":
        elements.push("thermostaat");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "tijdschakelaar":
        elements.push("tijdschakelaar");
        signalisatielamp.push(false);
        halfwaterdicht.push(false);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "rolluikschakelaar":
        elements.push("rolluik");
        signalisatielamp.push(false);
        halfwaterdicht.push(this.keys[20][2]);
        verklikkerlamp.push(false);
        trekschakelaar.push(false);
        break;
      case "dubbelaansteking":
        elements.push("dubbelaansteking");
        signalisatielamp.push(this.keys[19][2]);
        halfwaterdicht.push(this.keys[20][2]);
        verklikkerlamp.push(this.keys[21][2]);
        trekschakelaar.push(this.keys[25][2]);
        break;
      case "dimschakelaar":
        elements.push("dimschakelaar");
        signalisatielamp.push(this.keys[19][2]);
        halfwaterdicht.push(this.keys[20][2]);
        verklikkerlamp.push(this.keys[25][2]);
        trekschakelaar.push(false);
        break;
      default: {
        if (this.getKey("aantal") == "0") {
          //do nothing
        } else if (this.getKey("aantal") == "1") {
          if (this.getKey("lichtkring_poligheid") == "enkelpolig") {
            elements.push("enkel");
          } else if (this.getKey("lichtkring_poligheid") == "dubbelpolig") {
            elements.push("dubbel");
          }
          signalisatielamp.push(this.keys[19][2]);
          halfwaterdicht.push(this.keys[20][2]);
          verklikkerlamp.push(this.keys[21][2]);
          trekschakelaar.push(this.keys[25][2]);
        } else {
          if (this.getKey("lichtkring_poligheid") == "enkelpolig") {
            elements.push("wissel_enkel");
            signalisatielamp.push(this.keys[19][2]);
            halfwaterdicht.push(this.keys[20][2]);
            verklikkerlamp.push(this.keys[21][2]);
            trekschakelaar.push(this.keys[25][2]);
            for (var i=2; i<this.getKey("aantal"); i++) {
              elements.push("kruis_enkel");
              signalisatielamp.push(this.keys[19][2]);
              halfwaterdicht.push(this.keys[20][2]);
              verklikkerlamp.push(this.keys[21][2]);
              trekschakelaar.push(this.keys[25][2]);
            }
            elements.push("wissel_enkel");
            signalisatielamp.push(this.keys[19][2]);
            halfwaterdicht.push(this.keys[20][2]);
            verklikkerlamp.push(this.keys[21][2]);
            trekschakelaar.push(this.keys[25][2]);
          } else if (this.getKey("lichtkring_poligheid") == "dubbelpolig") {
            elements.push("wissel_dubbel");
            signalisatielamp.push(this.keys[19][2]);
            halfwaterdicht.push(this.keys[20][2]);
            verklikkerlamp.push(this.keys[21][2]);
            trekschakelaar.push(this.keys[25][2]);
            elements.push("wissel_dubbel");
            signalisatielamp.push(this.keys[19][2]);
            halfwaterdicht.push(this.keys[20][2]);
            verklikkerlamp.push(this.keys[21][2]);
            trekschakelaar.push(this.keys[25][2]);
          }
        }
      }
    }

    //--START CHANGE below old code which put a lot of lamps next to each other--
    /*for (var i=0; i<this.getKey("aantal2"); i++) {
      elements.push("lamp");
      halfwaterdicht.push(this.keys[20][2]);
      verklikkerlamp.push(this.keys[21][2]);
    }*/
    //--here new code which pushes the lamp only once and then puts for instance a "x5" next to it
    if (this.getKey("aantal2")>=1) {
      elements.push("lamp");
      signalisatielamp.push(this.keys[19][2]);
      halfwaterdicht.push(this.keys[20][2]);
      verklikkerlamp.push(this.keys[21][2]);
    }
    //--END CHANGE--

    var startx = 1;
    var endx = 0;

    for (i=0; i<elements.length; i++ ) {
      switch (elements[i]) {
        case "enkel":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_enkel" x="' + endx + '" y="25" />';
          if (signalisatielamp[i]) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
          if (halfwaterdicht[i]) outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
          if (verklikkerlamp[i]) outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />';
          if (trekschakelaar[i]) outputstr += '<line x1="' + (endx+10.5) + '" x2="' + (endx+10.5) + '" y1="5" y2="15" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+8.5) + '" y1="15" y2="11" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+12.5) + '" y1="15" y2="11" stroke="black" />';
          startx = endx+5;
          break;
        case "dubbel":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_dubbel" x="' + endx + '" y="25" />';
          if (signalisatielamp[i]) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
          if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
          if (verklikkerlamp[i]) { outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />'; };
          if (trekschakelaar[i]) outputstr += '<line x1="' + (endx+8.5) + '" x2="' + (endx+8.5) + '" y1="9" y2="19" stroke="black" /><line x1="' + (endx+8.5) + '" x2="' + (endx+6.5) + '" y1="19" y2="15" stroke="black" /><line x1="' + (endx+8.5) + '" x2="' + (endx+10.5) + '" y1="19" y2="15" stroke="black" />';
          startx = endx+5;
          break;
        case "dubbelaansteking":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_dubbelaansteking" x="' + endx + '" y="25" />';
          if (signalisatielamp[i]) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
          if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
          if (verklikkerlamp[i]) { outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />'; };
          if (trekschakelaar[i]) outputstr += '<line x1="' + (endx+10.5) + '" x2="' + (endx+10.5) + '" y1="5" y2="15" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+8.5) + '" y1="15" y2="11" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+12.5) + '" y1="15" y2="11" stroke="black" />';
          startx = endx+5;
          break;
        case "wissel_enkel":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_wissel_enkel" x="' + endx + '" y="25" />';
          if (signalisatielamp[i]) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
          if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
          if (verklikkerlamp[i]) { outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />'; };
          if (trekschakelaar[i]) outputstr += '<line x1="' + (endx+10.5) + '" x2="' + (endx+10.5) + '" y1="5" y2="15" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+8.5) + '" y1="15" y2="11" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+12.5) + '" y1="15" y2="11" stroke="black" />';
          startx = endx+5;
          lowerbound = Math.max(lowerbound,35);
          break;
        case "wissel_dubbel":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_wissel_dubbel" x="' + endx + '" y="25" />';
          if (signalisatielamp[i]) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
          if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
          if (verklikkerlamp[i]) { outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />'; };
          if (trekschakelaar[i]) outputstr += '<line x1="' + (endx+8.5) + '" x2="' + (endx+8.5) + '" y1="9" y2="19" stroke="black" /><line x1="' + (endx+8.5) + '" x2="' + (endx+6.5) + '" y1="19" y2="15" stroke="black" /><line x1="' + (endx+8.5) + '" x2="' + (endx+10.5) + '" y1="19" y2="15" stroke="black" />';
          startx = endx+5;
          lowerbound = Math.max(lowerbound,35);
          break;
        case "kruis_enkel":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_kruis_enkel" x="' + endx + '" y="25" />';
          if (signalisatielamp[i]) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
          if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
          if (verklikkerlamp[i]) { outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />'; };
          if (trekschakelaar[i]) outputstr += '<line x1="' + (endx+10.5) + '" x2="' + (endx+10.5) + '" y1="5" y2="15" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+8.5) + '" y1="15" y2="11" stroke="black" /><line x1="' + (endx+10.5) + '" x2="' + (endx+12.5) + '" y1="15" y2="11" stroke="black" />';
          startx = endx+5;
          lowerbound = Math.max(lowerbound,35);
          break;
        case "dimschakelaar":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_enkel_dim" x="' + endx + '" y="25" />';
          if (signalisatielamp[i]) outputstr += '<use xlink:href="#signalisatielamp" x="' + (endx-10) + '" y="25" />';
          if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
          if (verklikkerlamp[i]) { outputstr += '<line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="22" y2="28" stroke="black" /><line x1="' + (endx-3) + '" x2="' + (endx+3) + '" y1="28" y2="22" stroke="black" />'; };
          startx = endx+5;
          break;
        case "bewegingsschakelaar":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#bewegingsschakelaar" x="' + endx + '" y="25" />';
          startx = endx + 40;
          lowerbound = Math.max(lowerbound,30);
          break;
        case "schemerschakelaar":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schemerschakelaar" x="' + endx + '" y="25" />';
          startx = endx + 40;
          break;
        case "teleruptor":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#teleruptor" x="' + endx + '" y="25" />';
          startx = endx + 40;
          lowerbound = Math.max(lowerbound,30);
          break;
        case "dimmer":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#dimmer" x="' + endx + '" y="25" />';
          startx = endx + 40;
          lowerbound = Math.max(lowerbound,30);
          break;
        case "relais":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#relais" x="' + endx + '" y="25" />';
          startx = endx + 40;
          lowerbound = Math.max(lowerbound,30);
          break;
        case "minuterie":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#minuterie" x="' + endx + '" y="25" />';
          startx = endx + 40;
          lowerbound = Math.max(lowerbound,30);
          break;
        case "thermostaat":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#thermostaat" x="' + endx + '" y="25" />';
          startx = endx + 40;
          lowerbound = Math.max(lowerbound,30);
          break;
        case "tijdschakelaar":
          endx = startx + 20;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#tijdschakelaar" x="' + endx + '" y="25" />';
          startx = endx + 40;
          lowerbound = Math.max(lowerbound,30);
          break;
        case "rolluik":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#schakelaar_rolluik" x="' + endx + '" y="25" />';
          if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }
          startx = endx + 8;
          lowerbound = Math.max(lowerbound,25);
          break;
        case "lamp":
          endx = startx + 30;
          outputstr += '<line x1="' + startx + '" x2="' + endx + '" y1="25" y2="25" stroke="black" />';
          //outputstr += '<path d="M' + startx + ' 25 L' + endx + ' 25" stroke="black" />';
          outputstr += '<use xlink:href="#lamp" x="' + endx + '" y="25" />';

          var print_str_upper = "";
          if (this.keys[20][2]) {
            print_str_upper = "h";
            if (parseInt(this.keys[13][2]) > 1) { // Meer dan 1 lamp
              print_str_upper += ", x" + this.keys[13][2];
            }
          } else if (parseInt(this.keys[13][2]) > 1) {
            print_str_upper = "x" + this.keys[13][2];
          }

          //if (halfwaterdicht[i]) { outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>'; }

          if (print_str_upper != "") {
            outputstr += '<text x="' + endx + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(print_str_upper) + '</text>';
          }

          if ( (i<elements.length-1) || ((i==elements.length-1) && (hasChild)) ) {
            outputstr += '<line x1="'+endx+'" y1="25" x2="'+(endx+10)+'" y2="25" stroke="black" />';
          }

          startx = endx + 10;
          lowerbound = Math.max(lowerbound,29);
          break;
      }
    }

    //mySVG.xright = 10 + elements.length*35 - 1; //we take off "1" as xleft is already "1"
    endx = startx-2;
    mySVG.xright = endx;

    //Place adred underneath
    if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
      outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="' + (25 + lowerbound) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-style="italic" font-size="10">' + htmlspecialchars(this.keys[15][2]) + '</text>';
      mySVG.ydown += Math.max(0,lowerbound-20);
    }

    return(outputstr);
  }

  toSVG(hasChild: Boolean = false) {
    let mySVG:SVGelement = new SVGelement();
    let outputstr:string = "";

    mySVG.data = "";
    mySVG.xleft = 1; // foresee at least some space for the conductor
    mySVG.xright = 20;
    mySVG.yup = 25;
    mySVG.ydown = 25;

    switch (this.keys[0][2]) {
      case "Stopcontact":
        var startx: number = 1;
        for (var i=0; i<this.getKey("aantal"); i++) {
          outputstr += '<use xlink:href="#stopcontact" x="' + startx + '" y="25"></use>';
          if (this.getKey("geaard")) outputstr += '<use xlink:href="#stopcontact_aarding" x="' + startx + '" y="25"></use>';
          if (this.getKey("kinderveiligheid")) outputstr += '<use xlink:href="#stopcontact_kinderveilig" x="' + startx + '" y="25"></use>';
          startx += 20;
        }
        //--check halfwaterdicht--
        if (this.keys[20][2]) outputstr += '<text x="25" y="8" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';
        if (hasChild) {
          outputstr += '<line x1="'+startx+'" y1="25" x2="'+(startx+21)+'" y2="25" stroke="black" />';
        };
        mySVG.xright = 20 + this.getKey("aantal")*20;
        //-- Plaats adres onderaan --
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 15;
        }
        break;
      case "Bel":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#bel" x="21" y="25"></use>';
        mySVG.xright = 40;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="58" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 14;
        }
        break;
      case "Boiler":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        switch (this.getKey("accumulatie")) {
          case false:
            outputstr += '<use xlink:href="#boiler" x="21" y="25"></use>';
            break;
          case true:
            outputstr += '<use xlink:href="#boiler_accu" x="21" y="25"></use>';
            break;
        }
        mySVG.xright = 60;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 15;
        }
        break;
      case "Diepvriezer":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#diepvriezer" x="21" y="25"></use>';
        mySVG.xright = 60;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 15;
        }
        break;
      case "Droogkast":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#droogkast" x="21" y="25"></use>';
        mySVG.xright = 60;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 15;
        }
        break;
      case "Drukknop":
        var printstr:string = "";
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#drukknop" x="21" y="25"></use>';
        var aantal_knoppen:number = this.getKey("aantal");
        if (this.keys[21][2]) { //met verklikkerlampje
          outputstr += '<line x1="28" y1="20" x2="38" y2="30" stroke="black"></line>'; // midden 33, 25, lengte 7
          outputstr += '<line x1="28" y1="30" x2="38" y2="20" stroke="black"></line>';
        }
        if (this.keys[19][2]) { //afgeschermd
          outputstr += '<line x1="26" y1="10" x2="40" y2="10" stroke="black"></line>'; // midden 33, 25 lengte 7
          outputstr += '<line x1="26" y1="10" x2="26" y2="15" stroke="black"></line>';
          outputstr += '<line x1="40" y1="10" x2="40" y2="15" stroke="black"></line>';
          outputstr += '<line x1="22" y1="15" x2="26" y2="15" stroke="black"></line>';
          outputstr += '<line x1="40" y1="15" x2="44" y2="15" stroke="black"></line>';
        }
        //-- Plaats tekst voor "h" en/of aantal armaturen onderaan --
        if (this.keys[20][2]) printstr += 'h';
        if (aantal_knoppen > 1) {
          if (printstr != '') { printstr += ', ' }
          printstr += 'x' + aantal_knoppen;
        }
        if (printstr != '') outputstr += '<text x="33" y="49" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(printstr) + '</text>';
        //-- Plaats tekst voor aantal knoppen --
        if (this.keys[13][2] > 1) {
          outputstr += '<text x="44" y="13" style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(this.keys[13][2]) + '</text>';
          outputstr += '<line x1="39" y1="19" x2="44" y2="14" stroke="black" />';
        }
        //-- Extra tekens voor rolluik of dimmer --
        switch (this.keys[16][2]) {
          case "dimmer":
            outputstr += '<polygon points="18,20 18,13 28,20" fill="black" stroke="black" />';
            break;
          case "rolluik":
            outputstr += '<polygon points="18,15 22,15 20,12" fill="black" stroke="black" />';
            outputstr += '<polygon points="18,17 22,17 20,20" fill="black" stroke="black" />';
            break;
          default:
        }
        //-- Bereken correcte breedte
        mySVG.xright = 44;
        //-- Plaats adres onderaan --
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          if (printstr != '') {
            outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="65" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
            mySVG.ydown += 20;
          } else {
            outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="49" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
            mySVG.ydown += 5;
          }
        }
        break;
      case "Elektriciteitsmeter":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#elektriciteitsmeter" x="21" y="25"></use>';
        mySVG.xright = 60;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 15;
        }
        break;
      case "Elektrische oven":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#oven" x="21" y="25"></use>';
        mySVG.xright = 60;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 15;
        }
        break;
      case "Ketel":
        var shifty = 0; if (this.keys[4][2]>1) {
          shifty = 15;
          outputstr += '<text x="41" y="12" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">x' + htmlspecialchars(this.keys[4][2]) + '</text>'
        }
        outputstr += '<line x1="1" y1="' + (shifty+25) + '" x2="21" y2="' + (shifty+25) + '" stroke="black"></line>';
        outputstr += '<use xlink:href="#verbruiker" x="21" y="' + (shifty+25) + '"></use>';
        switch (this.keys[16][2]) {
          case "Met tapspiraal":
            outputstr += '<line x1="21" y1="' + (shifty+15) + '" x2="61" y2="' + (shifty+7) + '" stroke="black" />';
            outputstr += '<line x1="21" y1="' + (shifty+15) + '" x2="61" y2="' + (shifty+23) + '" stroke="black" />';
            break;
          case "Met boiler":
            outputstr += '<rect x="31" y="' + (shifty+10) + '" width="20" height="10" stroke="black" fill="white" />';
            break;
          case "Warmtewisselaar":
            outputstr += '<line x1="26" y1="' + (shifty+0) + '" x2="26" y2="' + (shifty+5) + '" stroke="black" />';
            outputstr += '<line x1="56" y1="' + (shifty+0) + '" x2="56" y2="' + (shifty+5) + '" stroke="black" />';
            outputstr += '<line x1="26" y1="' + (shifty+5) + '" x2="33.5" y2="' + (shifty+23) + '" stroke="black" />';
            outputstr += '<line x1="56" y1="' + (shifty+5) + '" x2="48.5" y2="' + (shifty+23) + '" stroke="black" />';
            outputstr += '<line x1="33.5" y1="' + (shifty+23) + '" x2="41" y2="' + (shifty+14) + '" stroke="black" />';
            outputstr += '<line x1="48.5" y1="' + (shifty+23) + '" x2="41" y2="' + (shifty+14) + '" stroke="black" />';
            break;
          case "Warmtekrachtkoppeling":
            outputstr += '<circle cx="41" cy="' + (shifty+16) + '" r="7" style="stroke:black;fill:none" />';
            outputstr += '<text x="41" y="' + (shifty+17) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">G</text>'
            break;
        }
        //Waar gaan we de andere symbolen plaatsen, indien slechts 1, midden onderaan, zoniet links en rechts
        var shift_symbol_energiebron = 41;
        var shift_symbol_warmtefunctie = 41;
        if ((this.keys[17][2] != "") && (this.keys[18][2] != "")) {
          var shift_symbol_energiebron = 31;
          var shift_symbol_warmtefunctie = 51;
        }
        switch (this.keys[17][2]) {
          case "Gas (ventilator)":
            outputstr += '<use xlink:href="#gas_ventilator" x="' + (shift_symbol_energiebron) + '" y="' + (shifty+35) + '"/>';
            break;
          case "Gas (atmosferisch)":
            outputstr += '<use xlink:href="#gas_atmosferisch" x="' + (shift_symbol_energiebron) + '" y="' + (shifty+35) + '"/>';
            break;
          case "Elektriciteit":
            outputstr += '<use xlink:href="#bliksem" x="' + (shift_symbol_energiebron) + '" y="' + (shifty+35) + '"/>';
            break;
          case "Vaste brandstof":
            outputstr += '<rect x="' + (shift_symbol_energiebron-6) + '" y="' + (shifty+29) + '" width="12" height="12" style="stroke:black;fill:black" />';
            break;
          case "Vloeibare brandstof":
            outputstr += '<circle cx="' + (shift_symbol_energiebron) + '" cy="' + (shifty+35) + '" r="6" style="stroke:black;fill:black" />';
            break;
        }
        switch (this.keys[18][2]) {
          case "Verwarmend":
            outputstr += '<text x="' + (shift_symbol_warmtefunctie-1) + '" y="' + (shifty+36) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">+</text>'
            break;
          case "Koelend":
            outputstr += '<text x="' + (shift_symbol_warmtefunctie-1) + '" y="' + (shifty+36) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">-</text>'
            break;
          case "Verwarmend en koelend":
            outputstr += '<text x="' + (shift_symbol_warmtefunctie-1) + '" y="' + (shifty+36) + '" style="text-anchor:middle;dominant-baseline:middle" font-family="Arial, Helvetica, sans-serif" font-size="12">+/-</text>'
            break;
        }
        mySVG.xright = 60;
        mySVG.yup += shifty;
        //Place adres underneath
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="' + (shifty+60) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-style="italic" font-size="10">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 15;
        }
        break;
      case "Koelkast":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#koelkast" x="21" y="25"></use>';
        mySVG.xright = 60;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 15;
        }
        break;
      case "Kookfornuis":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#kookfornuis" x="21" y="25"></use>';
        mySVG.xright = 60;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 15;
        }
        break;
      case "Microgolfoven":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#microgolf" x="21" y="25"></use>';
        mySVG.xright = 60;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 15;
        }
        break;
      case "Motor":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#motor" x="21" y="25"></use>';
        mySVG.xright = 60;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 15;
        }
        break;
      case "Omvormer":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#omvormer" x="21" y="25"></use>';
        mySVG.xright = 80;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="55" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 10;
        }
        break;
      case "Leeg":
      case "Aansluitpunt":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#aansluitpunt" x="21" y="25"></use>';
        mySVG.xright = 29;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="45" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 0;
        }
        break;
      case "Aftakdoos":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#aftakdoos" x="21" y="25"></use>';
        mySVG.xright = 49;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="55" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 10;
        }
        break;
      case "Lichtcircuit":
        outputstr += this.toSVGswitches(hasChild, mySVG);
        break;
      case "Lichtpunt":
        outputstr += '<line x1="0" x2="30" y1="25" y2="25" stroke="black" />';
        var print_str_upper = "";
        if (this.keys[20][2]) {
          print_str_upper = "h";
          if (parseInt(this.keys[4][2]) > 1) { // Meer dan 1 lamp
            print_str_upper += ", x" + this.keys[4][2];
          }
        } else if (parseInt(this.keys[4][2]) > 1) {
          print_str_upper = "x" + this.keys[4][2];
        }
        switch (this.keys[16][2]) {
          case "led":
            outputstr += '<use xlink:href="#led" x="' + 30 + '" y="25" />';

            if (this.keys[19][2]) {
              outputstr += '<line x1="30" y1="35" x2="42" y2="35" stroke="black" />';
            }
            //determine positioning of emergency symbol and draw it
            var noodxpos;
            var textxpos;
            if (print_str_upper == "") {
              noodxpos = 36;
              textxpos = 36; // not used
            } else {
              noodxpos = 20;
              if ( (print_str_upper.length > 2) && ( (this.keys[17][2] == "Centraal") || (this.keys[17][2] == "Decentraal") ) ) {
                textxpos = 40;
              } else {
                textxpos = 36;
              }
            };
            if (print_str_upper != "") {
              outputstr += '<text x="' + textxpos + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="7">' + htmlspecialchars(print_str_upper) + '</text>';
            }
            if (this.keys[21][2]) {
              outputstr += '<line x1="42" y1="25" x2="45.75" y2="17.5" stroke="black" />';
              outputstr += '<line x1="45.75" y1="17.5" x2="48.25" y2="18.75" stroke="black" />';
            }
            var noodypos = 6.5;
            switch (this.keys[17][2]) {
              case "Centraal":
                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                break;
              case "Decentraal":
                outputstr += '<rect x="' + (noodxpos-5.6) + '" y="' + (noodypos-5.6) + '" width="11.2" height="11.2" fill="white" stroke="black" />'
                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                break;
              default:
                break;
            }
            mySVG.xright = 42;
            //-- Plaats adres onderaan --
            if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
              outputstr += '<text x="' + ((mySVG.xright-20)/2 + 23) + '" y="50" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
              mySVG.ydown += 5;
            }
            break;
          case "spot":
            outputstr += '<use xlink:href="#spot" x="' + 30 + '" y="25" />';

            if (this.keys[19][2]) {
              outputstr += '<line x1="30" y1="38" x2="46" y2="38" stroke="black" />';
            }
            //determine positioning of emergency symbol and draw it
            var noodxpos;
            var textxpos;
            if (print_str_upper == "") {
              noodxpos = 40;
              textxpos = 40; // not used
            } else {
              noodxpos = 24;
              if ( (print_str_upper.length > 2) && ( (this.keys[17][2] == "Centraal") || (this.keys[17][2] == "Decentraal") ) ) {
                textxpos = 44;
              } else {
                textxpos = 40;
              }
            };
            if (print_str_upper != "") {
              outputstr += '<text x="' + textxpos + '" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="7">' + htmlspecialchars(print_str_upper) + '</text>';
            }
            if (this.keys[21][2]) {
              outputstr += '<line x1="46" y1="25" x2="49.75" y2="17.5" stroke="black" />';
              outputstr += '<line x1="49.75" y1="17.5" x2="52.25" y2="18.75" stroke="black" />';
            }
            var noodypos = 6.5;
            switch (this.keys[17][2]) {
              case "Centraal":
                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                break;
              case "Decentraal":
                outputstr += '<rect x="' + (noodxpos-5.6) + '" y="' + (noodypos-5.6) + '" width="11.2" height="11.2" fill="white" stroke="black" />'
                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                break;
              default:
                break;
            }
            mySVG.xright = 45;
            //-- Plaats adres onderaan --
            if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
              outputstr += '<text x="' + ((mySVG.xright-20)/2 + 25) + '" y="52" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
              mySVG.ydown += 7;
            }
            break;
          case "TL":
            var aantal_buizen = this.keys[13][2];
            var starty = 25-(aantal_buizen)*3.5;
            var endy = 25+(aantal_buizen)*3.5;
            outputstr += '<line x1="30" y1="' + starty + '" x2="30" y2="' + endy + '" stroke="black" stroke-width="2" />';
            outputstr += '<line x1="90" y1="' + starty + '" x2="90" y2="' + endy + '" stroke="black" stroke-width="2" />';
            for (var i = 0; i < aantal_buizen ; i++) {
              outputstr += '<line x1="30" y1="' + (starty + (i*7) + 3.5) + '" x2="90" y2="' + (starty + (i*7) + 3.5) + '" stroke="black" stroke-width="2" />';
            }
            if (this.keys[19][2]) {
              outputstr += '<line x1="50" y1="' + (27 + (aantal_buizen*3.5)) + '" x2="70" y2="' + (27 + (aantal_buizen*3.5)) + '" stroke="black" />';
            }
            if (print_str_upper != "") {
              outputstr += '<text x="60" y="' + (25 - (aantal_buizen*3.5)) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(print_str_upper) + '</text>';
            }
            if (this.keys[21][2]) {
              outputstr += '<line x1="77.5" y1="' + (29-(aantal_buizen*3.5)) + '" x2="85" y2="' + (14-(aantal_buizen*3.5)) + '" stroke="black" />';
              outputstr += '<line x1="85" y1="' + (14-(aantal_buizen*3.5)) + '" x2="90" y2="' + (16.5-(aantal_buizen*3.5)) + '" stroke="black" />';
            }
            //determine positioning of emergency symbol and draw it
            var noodxpos;
            if (print_str_upper == "") {noodxpos = 60} else {noodxpos = 39};
            var noodypos = (25 - (aantal_buizen*3.5) - 5);
            switch (this.keys[17][2]) {
              case "Centraal":
                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                break;
              case "Decentraal":
                outputstr += '<rect x="' + (noodxpos-5.6) + '" y="' + (noodypos-5.6) + '" width="11.2" height="11.2" fill="white" stroke="black" />'
                outputstr += '<circle cx="' + noodxpos + '" cy="' + noodypos + '" r="2.5" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos-5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos+5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                outputstr += '<line x1="' + (noodxpos+5.6) + '" y1="' + (noodypos-5.6) + '" x2="' + (noodxpos-5.6) + '" y2="' + (noodypos+5.6) + '" style="stroke:black;fill:black" />';
                break;
            }
            mySVG.xright = 90;
            //-- Plaats adres onderaan --
            if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
              outputstr += '<text x="' + ((mySVG.xright-20)/2 + 23) + '" y="' + (endy+13) + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
              mySVG.ydown = Math.max(mySVG.ydown,endy+18-25);
            }
            break;
          default:
            switch (this.keys[17][2]) {
              case "Centraal":
                outputstr += '<use xlink:href="#lamp" x="' + 30 + '" y="25" />';
                outputstr += '<circle cx="30" cy="25" r="5" style="stroke:black;fill:black" />';
                if ( hasChild ) {
                  outputstr += '<line x1="'+30+'" y1="25" x2="'+(30+10)+'" y2="25" stroke="black" />';
                }
                break;
              case "Decentraal":
                outputstr += '<use xlink:href="#noodlamp_decentraal" x="' + 30 + '" y="25" />';
                if (this.keys[21][2]) { //Ingebouwde schakelaar
                  outputstr += '<line x1="37" y1="18" x2="40" y2="15" stroke="black" stroke-width="2" />';
                }
                break;
              default:
                outputstr += '<use xlink:href="#lamp" x="' + 30 + '" y="25" />';
                if ( hasChild ) {
                  outputstr += '<line x1="'+30+'" y1="25" x2="'+(30+10)+'" y2="25" stroke="black" />';
                }
                break;
            }
            if (print_str_upper != "") {
              outputstr += '<text x="30" y="10" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(print_str_upper) + '</text>';
            }
            if (this.keys[19][2]) {
              outputstr += '<line x1="20" y1="40" x2="40" y2="40" stroke="black" />';
            }
            if (this.keys[21][2]) {
              outputstr += '<line x1="40" y1="15" x2="45" y2="20" stroke="black" stroke-width="2" />';
            }
            mySVG.xright = 39;
            //-- Plaats adres onderaan --
            if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
              outputstr += '<text x="' + ((mySVG.xright-20)/2 + 20) + '" y="54" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
              mySVG.ydown += 10;
            }
            break;
        }
        break;
      case "Schakelaars":
        this.setKey("aantal2", 0);
        outputstr += this.toSVGswitches(hasChild, mySVG);
        break;
      case "Transformator":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#transformator" x="21" y="25"></use>';
        outputstr += '<text x="35" y="44" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' +
          htmlspecialchars(this.getKey("voltage")) + "</text>";
        mySVG.xright = 48;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="58" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 15;
        }
        break;
      case "Vaatwasmachine":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#vaatwasmachine" x="21" y="25"></use>';
        mySVG.xright = 60;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 15;
        }
        break;
      case "Ventilator":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#ventilator" x="21" y="25"></use>';
        mySVG.xright = 50;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="55" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 10;
        }
        break;
      case "Verwarmingstoestel":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        mySVG.xright = 70;
        switch (this.getKey("accumulatie")) {
          case false:
            outputstr += '<use xlink:href="#verwarmingstoestel" x="21" y="25"></use>';
            break;
          case true:
            switch (this.getKey("ventilator")) {
              case false:
                outputstr += '<use xlink:href="#verwarmingstoestel_accu" x="21" y="25"></use>';
                break;
              case true:
                outputstr += '<use xlink:href="#verwarmingstoestel_accu_ventilator" x="21" y="25"></use>';
                mySVG.xright = 95;
                break;
            }
          break;
        }
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="55" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 10;
        }
        break;
      case "Vrije tekst":
        var width;
        if (isNaN(Number(this.keys[22][2]))) {
          width = 40;
        } else {
          if (Number(this.keys[22][2] == "")) {
            width = 40;
          } else {
            width = Math.max(Number(this.keys[22][2])*1,1);
          }
        }

        var options:string = "";
        if (this.keys[19][2]) options += ' font-weight="bold"';
        if (this.keys[20][2]) options += ' font-style="italic"';

        //width = Math.max(this.getKey("commentaar").length * 8, width)
        switch (this.keys[16][2]) {
          case "zonder kader":
            break;
          default:
            outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black" />';
            outputstr += '<rect x="21" y="5" width="' + width + '" height="40" fill="none" style="stroke:black" />';
            if (!(/^\s*$/.test(this.keys[23][2]))) { //check if adres contains only white space
              outputstr += '<text x="' + (21 + width/2) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[23][2]) + '</text>';
              mySVG.ydown += 15;
            }
            break;
        }
        switch (this.keys[17][2]) {
          case "links":
            outputstr += '<text x="' + (20 + 5) + '" y="28" style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-size="10"' + options + '>' + htmlspecialchars(this.getKey("commentaar")) + '</text>'
            mySVG.xright = 20 + width;
            break;
          case "rechts":
            outputstr += '<text x="' + (20 + width - 4) + '" y="28" style="text-anchor:end" font-family="Arial, Helvetica, sans-serif" font-size="10"' + options + '>' + htmlspecialchars(this.getKey("commentaar")) + '</text>'
            mySVG.xright = 20 + width;
            break;
          default:
            outputstr += '<text x="' + (21 + width/2) + '" y="28" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10"' + options + '>' + htmlspecialchars(this.getKey("commentaar")) + '</text>'
            mySVG.xright = 20 + width;
            break;
        }
        break;
      case "Wasmachine":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#wasmachine" x="21" y="25"></use>';
        mySVG.xright = 60;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 15;
        }
        break;
      case "Zonnepaneel":
        outputstr += '<line x1="1" y1="25" x2="21" y2="25" stroke="black"></line>';
        outputstr += '<use xlink:href="#zonnepaneel" x="21" y="25"></use>';
        outputstr += '<text x="60" y="9" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">' + htmlspecialchars(this.keys[4][2]) + 'x</text>';
        mySVG.xright = 100;
        if (!(/^\s*$/.test(this.keys[15][2]))) { //check if adres contains only white space
          outputstr += '<text x="' + ((mySVG.xright-20)/2 + 21) + '" y="60" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.keys[15][2]) + '</text>';
          mySVG.ydown += 15;
        }
        break;
    }
    mySVG.data = outputstr + "\n";
    return(mySVG);
  }
}
class Simple_Item extends List_Item {
  constructor() {
    super();
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
class Hierarchical_List {
  data: Array<List_Item>;
  active: Array<Boolean>;
  id: Array<number>;
  length: number;
  curid: number;
  mode: string; //can be "edit" or "move"

  constructor() {
    this.length = 0;
    this.data = new Array<List_Item>();
    this.active = new Array<Boolean>();
    this.id = new Array<number>();
    this.curid = 1;
    this.mode = "edit";
  };

  getOrdinalById(my_id: number) : number {
    for (var i = 0; i<this.length; i++) {
      if (this.id[i]==my_id) {
        return(i);
      }
    }
  }

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

  insertItemBeforeId(my_item: List_Item, my_id: number) {
    for (var i = 0; i<this.length; i++) {
      if (this.id[i]==my_id) {
        //First set the correct identifyer
        my_item.id = this.curid;
        my_item.parent = this.data[i].parent;
        my_item.indent = this.data[i].indent;
        my_item.Parent_Item = this.data[this.getOrdinalById(my_item.parent)];
        my_item.collapsed = false;
        //my_item.updateConsumers(); //Needed to ensure we do not give options in the select-box that parent wouldn't allow

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
  }

  insertItemAfterId(my_item: List_Item, my_id: number) {
    for (var i = 0; i<this.length; i++) {
      if (this.id[i]==my_id) {
        //First set the correct identifyer
        my_item.id = this.curid;
        my_item.parent = this.data[i].parent;
        my_item.indent = this.data[i].indent;
        my_item.Parent_Item = this.data[this.getOrdinalById(my_item.parent)];
        my_item.collapsed = false;
        //my_item.updateConsumers(); //Needed to ensure we do not give options in the select-box that parent wouldn't allow

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
  }

  insertChildAfterId(my_item: List_Item, my_id: number) {
    var ordinal:number = this.insertItemAfterId(my_item, my_id);

    this.data[ordinal].parent = my_id;
    this.data[ordinal].indent = this.data[ordinal-1].indent+1;
    this.data[ordinal].Parent_Item = this.data[this.getOrdinalById(my_id)];
    //this.data[ordinal].resetKeys();
    //this.data[ordinal].updateConsumers(); //Needed to ensure we do not give options in the select-box that parent wouldn't allow
  }

  MoveUp(my_id: number) {
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
  }

  MoveDown(my_id: number) {
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
  }

  deleteById(my_id: number) {
    for (var i = 0; i<this.length; i++) {
      if (this.id[i]==my_id) {
        this.active[i] = false;
        for (var j=0; j<this.length; j++) {
          if (this.data[j].parent==my_id) this.deleteById(this.id[j]);
        }
      }
    }
    //alert("Deleted id: " + my_id);
  }

  toHTML(myParent: number) {
    var output: string = "";
    var numberDrawn: number = 0;

    //-- bovenaan de switch van editeer-mode (teken of verplaats) --
    if (myParent == 0) {
      switch (this.mode) {
        case "edit":
          output+= 'Modus (Invoegen/Verplaatsen) <select id="edit_mode" onchange="HL_editmode()"><option value="edit" selected>Invoegen</option><option value="move">Verplaatsen</option></select><br><br>';
          break;
        case "move":
          output+= 'Modus (Invoegen/verplaatsen) <select id="edit_mode" onchange="HL_editmode()"><option value="edit">Invoegen</option><option value="move" selected>Verplaatsen</option></select>'+
                   '<span style="color:red">&nbsp;Verplaatsen is experimenteel!, feedback welkom via het contact-form. Gebruik de pijlen om de volgorde van elementen te wijzigen. '+
                   'Gebruik het Moeder-veld om een component elders in het schema te hangen.</span><br><br>';
          break;
      }
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
            output += this.data[i].toHTML(structure.mode,this.data[myParent]) + "<br>";
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
    <g id="sinus">
      <path d="M0,0 C2,-5 8,-5 10,0 S18,5 20,0" style="stroke:black;fill:none" />
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
    </defs>
    `
    return(output);
  }

  toSVG(myParent: number, stack: string, minxleft: number = 0) { //stack can be "horizontal" or "vertical"

    //--- First read all underlying elements in an Array called inSVG ---

    var inSVG: Array<SVGelement> = new Array<SVGelement>(); //Results from nested calls will be added here
    var elementCounter: number = 0;
    var lastChildOrdinal = 0;

    for (var i = 0; i<this.length; i++) {
      //empty tekst at the end does not count as a valid last child
      if (this.active[i] && (this.data[i].keys[16][2] != "zonder kader") && (this.data[i].parent == myParent)) lastChildOrdinal = i;
    }

    for (var i = 0; i<this.length; i++) {
      if (this.active[i] && (this.data[i].parent == myParent)) {
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

            //If child of "meerdere verbruikers, shift everything by 24 pixels to the right
            if ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Meerdere verbruikers") {
              if ((inSVG[elementCounter].xright + inSVG[elementCounter].xleft) <=0) inSVG[elementCounter].xrightmin = 15; // ensure we see there is a "splitsing"
              if (inSVG[elementCounter].yup < 25) inSVG[elementCounter].yup = 25;
              if (inSVG[elementCounter].ydown < 25) inSVG[elementCounter].ydown = 25;
              inSVG[elementCounter].data = inSVG[elementCounter].data +
                '<line x1="' + (1) + '" x2="' + (inSVG[elementCounter].xleft + inSVG[elementCounter].xrightmin) +
                '" y1="' + inSVG[elementCounter].yup + '" y2="' + inSVG[elementCounter].yup + '" stroke="black" />'
              var toShift = inSVG[elementCounter].xleft;
              inSVG[elementCounter].xleft -= toShift - 1; //we leave one pixel for the bold kring-line at the left
              inSVG[elementCounter].xright += toShift;
            } else {
              inSVG[elementCounter].data = inSVG[elementCounter].data +
                '<line x1="' + (inSVG[elementCounter].xleft) + '" x2="' + (inSVG[elementCounter].xleft + inSVG[elementCounter].xrightmin) +
                '" y1="' + inSVG[elementCounter].yup + '" y2="' + inSVG[elementCounter].yup + '" stroke="black" />'
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
            //get image of the entire kring
            inSVG[elementCounter] = this.toSVG(this.id[i],"vertical");

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

              inSVG[elementCounter].yup += 100;
            } else {
              inSVG[elementCounter].data += '<line x1="' + inSVG[elementCounter].xleft +
                '" x2="' + inSVG[elementCounter].xleft +
                '" y1="' + inSVG[elementCounter].yup +
                '" y2="' + (inSVG[elementCounter].yup+20) + '" stroke="black" />';
              inSVG[elementCounter].yup += 20;
            }

            //add the fuse below

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
                  '<text x="' + (inSVG[elementCounter].xleft-6) + '" '
                  + 'y="' + (tekstlocatie) + '" '
                  + 'transform="rotate(-90 ' + (inSVG[elementCounter].xleft-6) + ',' + (tekstlocatie) + ')" '
                  + 'style="text-anchor:start" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="12"'
                  + '>'
                  + htmlspecialchars(this.data[i].getKey("commentaar"))
                  + '</text>';

            //--Naam onderaan zetten (links-onder)--
            inSVG[elementCounter].data +=
                  '<text x="' + (inSVG[elementCounter].xleft-6) + '" '
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
            //get image of all lowest level elements

            //First get the image itself
            if ((this.data[this.getOrdinalById(myParent)]).getKey("type") == "Meerdere verbruikers") {
              //the following function takes true as an argument if there is still an element following in a horizontal chain.
              //This is the case if the element is not last and/or not followed by empty tekst without border
              inSVG[elementCounter] = this.data[i].toSVG(i !== lastChildOrdinal);
            } else {
              inSVG[elementCounter] = this.data[i].toSVG(false);
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
        outSVG.xleft = Math.max(max_xleft,35); // foresee at least 30 at the left
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

    //alert("stack = " + stack + " width = " + width + "height = " + height  + " yup = " + outSVG.yup + "ydown = " + outSVG.ydown);

    outSVG.data += "\n";

    if (myParent==0) { //We will always foresee a 20 pixel horizontal and 5 pixel vertical margin
      var header: string = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" transform=\"scale(1,1)\" width=\"" + (width + 20) + "\" height=\"" + (height + 5) + "\">";
      header += this.outputSVGDefs();
      var footer: string = "</svg>";
      outSVG.data = header+outSVG.data+footer;
    }

    return(outSVG);

  }

}
var CONFIGPAGE_LEFT:string = `
    <center>
        <p><font size="+2">
          <b>Eendraadschema ontwerpen: </b>
          Kies &eacute;&eacute;n van onderstaande voorbeelden om van te starten (u kan zelf kringen toevoegen achteraf) of
          start van een leeg schema met voorgekozen aantal kringen (optie 3).
        </font></p>
      <font size="+1">
        <i>
          <b>Tip: </b>Om de mogelijkheden van het programma te leren kennen is het vaak beter eerst een voorbeeldschema te
          bekijken alvorens van een leeg schema te vertrekken.
        </i>
      </font>
    </center><br><br>
    <table border="1px" style="border-collapse:collapse" align="center" width="100%">
      <tr>
        <td width="25%" align="center" bgcolor="LightGrey">
          <b>Voorbeeld 1</b>
        </td>
        <td width="25%" align="center" bgcolor="LightGrey">
          <b>Voorbeeld 2</b>
        </td>
        <td width="25%" align="center" bgcolor="LightGrey">
          <b>Leeg schema</b>
        </td>
        <td width="25%" align="center" bgcolor="LightGrey">
          <b>Importeren</b>
        </td>
      </tr>
      <tr>
        <td width="25%" align="center">
          <br>
          <img src="examples/example000.svg" height="300px"><br><br>
          Eenvoudig schema, enkel stopcontacten en lichtpunten.
          <br><br>
        </td>
        <td width="25%" align="center">
          <br>
          <img src="examples/example001.svg" height="300px"><br><br>
          Iets complexer schema met teleruptoren, verbruikers achter stopcontacten en gesplitste kringen.
          <br><br>
        </td>
        <td width="25%" align="center">
          <br>
          <img src="examples/gear.svg" height="100px"><br><br>
`

var CONFIGPAGE_RIGHT:string = `
          <br><br>
        </td>
        <td width="25%" align="center">
          <br>
          <img src="examples/import_icon.svg" height="100px"><br><br>
          Importeer een vooraf opgeslagen schema (EDS-bestand). Enkel bestanden aangemaakt na 12 juli 2019 worden herkend.
          <br><br>
        </td>
      </tr>
      <tr>
        <td width="25%" align="center">
          <br>
          <button onclick="load_example(0)">Verdergaan met deze optie</button>
          <br><br>
        </td>
        <td width="25%" align="center">
          <br>
          <button onclick="load_example(1)">Verdergaan met deze optie</button>
          <br><br>
        </td>
        <td width="25%" align="center">
          <br>
          <button onclick="read_settings()">Verdergaan met deze optie</button>
          <br><br>
        </td>
        <td width="25%" align="center">
          <br>
          <button onclick="importclicked()">Verdergaan met deze optie</button>
          <br><br>
        </td>
      </tr>
    </table>
  `;

var EXAMPLE0 = `
{"length":42,"data":[{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},{"id":18,"parent":2,"indent":2,"collapsed":false,"keys":[["type","SELECT",""],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},{"id":37,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","1"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":42,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","2"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":41,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","3"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":40,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","4"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":39,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","5"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":38,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT",""],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":9,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},{"id":11,"parent":9,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","1"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":9,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":13,"parent":9,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","2"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":9,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":12,"parent":9,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","3"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":9,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":34,"parent":9,"indent":5,"collapsed":false,"keys":[["type","SELECT","Meerdere verbruikers"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","4"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":9,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":35,"parent":34,"indent":6,"collapsed":false,"keys":[["type","SELECT","Lichtcircuit"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","teleruptor"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","0"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":34,"parent":9,"indent":5,"collapsed":false,"keys":[["type","SELECT","Meerdere verbruikers"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","4"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":9,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Splitsing","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektriciteitsmeter","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":36,"parent":34,"indent":6,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":34,"parent":9,"indent":5,"collapsed":false,"keys":[["type","SELECT","Meerdere verbruikers"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","4"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":9,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Splitsing","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektriciteitsmeter","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":33,"parent":9,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":9,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":10,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},{"id":15,"parent":10,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","5"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":10,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":14,"parent":10,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","6"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":10,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":6,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","16"],["kabel","STRING","VOB 3G1,5"],["naam","STRING","B"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":21,"parent":20,"indent":4,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},{"id":22,"parent":21,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","1"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":28,"parent":21,"indent":5,"collapsed":false,"keys":[["type","SELECT",""],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":24,"parent":21,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","2"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":29,"parent":21,"indent":5,"collapsed":false,"keys":[["type","SELECT","Lichtcircuit"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","dubbelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","3"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":31,"parent":29,"indent":6,"collapsed":false,"keys":[["type","SELECT",""],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":29,"parent":21,"indent":5,"collapsed":false,"keys":[["type","SELECT","Lichtcircuit"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","dubbelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","3"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["Leeg"]},{"id":30,"parent":29,"indent":6,"collapsed":false,"keys":[["type","SELECT",""],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":29,"parent":21,"indent":5,"collapsed":false,"keys":[["type","SELECT","Lichtcircuit"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","dubbelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","3"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["Leeg"]},{"id":25,"parent":24,"indent":6,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":24,"parent":21,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","2"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["Leeg"]},{"id":26,"parent":24,"indent":6,"collapsed":false,"keys":[["type","SELECT","Wasmachine"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":24,"parent":21,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","2"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["Leeg"]},{"id":27,"parent":24,"indent":6,"collapsed":false,"keys":[["type","SELECT","Lichtcircuit"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","dubbelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":24,"parent":21,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","2"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["Leeg"]},{"id":23,"parent":21,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":16,"parent":6,"indent":3,"collapsed":false,"keys":[["type","SELECT","Lichtcircuit"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","dubbelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","1"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":6,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","16"],["kabel","STRING","VOB 3G1,5"],["naam","STRING","B"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":17,"parent":6,"indent":3,"collapsed":false,"keys":[["type","SELECT","Lichtcircuit"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","2"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":6,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","16"],["kabel","STRING","VOB 3G1,5"],["naam","STRING","B"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":32,"parent":6,"indent":3,"collapsed":false,"keys":[["type","SELECT","Lichtcircuit"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","3"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":6,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","16"],["kabel","STRING","VOB 3G1,5"],["naam","STRING","B"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":3,"parent":2,"indent":2,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT",2],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING",65],["kabel","STRING",""],["naam","STRING",""],["differentieel_waarde","STRING",30],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},{"id":4,"parent":3,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":3,"parent":2,"indent":2,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT",2],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING",65],["kabel","STRING",""],["naam","STRING",""],["differentieel_waarde","STRING",30],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":5,"parent":4,"indent":4,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",3],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":4,"parent":3,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":3,"parent":2,"indent":2,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT",2],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING",65],["kabel","STRING",""],["naam","STRING",""],["differentieel_waarde","STRING",30],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]}],"active":[true,true,false,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,false,true,true,false,false,false,false,false,false,true,true,true,false,false,false],"id":[1,2,18,7,37,42,41,40,39,38,8,9,11,13,12,34,35,36,33,10,15,14,6,19,20,21,22,28,24,29,31,30,25,26,27,23,16,17,32,3,4,5],"curid":43}`;

var EXAMPLE1 = `
{"length":36,"data":[{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},{"id":18,"parent":2,"indent":2,"collapsed":false,"keys":[["type","SELECT",""],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":9,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},{"id":11,"parent":9,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","1"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":9,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":13,"parent":9,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","2"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":9,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":12,"parent":9,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","3"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":9,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":34,"parent":9,"indent":5,"collapsed":false,"keys":[["type","SELECT","Meerdere verbruikers"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","4"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":9,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":35,"parent":34,"indent":6,"collapsed":false,"keys":[["type","SELECT","Lichtcircuit"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","teleruptor"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","0"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":34,"parent":9,"indent":5,"collapsed":false,"keys":[["type","SELECT","Meerdere verbruikers"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","4"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":9,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Splitsing","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektriciteitsmeter","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":36,"parent":34,"indent":6,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":34,"parent":9,"indent":5,"collapsed":false,"keys":[["type","SELECT","Meerdere verbruikers"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","4"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":9,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Splitsing","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektriciteitsmeter","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":33,"parent":9,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":9,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":10,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},{"id":15,"parent":10,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","5"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":10,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":14,"parent":10,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","6"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":10,"parent":8,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","geen"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":8,"parent":7,"indent":3,"collapsed":false,"keys":[["type","SELECT","Splitsing"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":7,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","A"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":6,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","16"],["kabel","STRING","VOB 3G1,5"],["naam","STRING","B"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":21,"parent":20,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},{"id":22,"parent":21,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","1"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":28,"parent":21,"indent":5,"collapsed":false,"keys":[["type","SELECT",""],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":24,"parent":21,"indent":5,"collapsed":true,"keys":[["type","SELECT","Meerdere verbruikers"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","2"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":29,"parent":21,"indent":5,"collapsed":false,"keys":[["type","SELECT","Lichtcircuit"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","dubbelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","3"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":31,"parent":29,"indent":6,"collapsed":false,"keys":[["type","SELECT",""],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":29,"parent":21,"indent":5,"collapsed":false,"keys":[["type","SELECT","Lichtcircuit"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","dubbelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","3"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["Leeg"]},{"id":30,"parent":29,"indent":6,"collapsed":false,"keys":[["type","SELECT",""],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":29,"parent":21,"indent":5,"collapsed":false,"keys":[["type","SELECT","Lichtcircuit"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","dubbelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","3"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["Leeg"]},{"id":25,"parent":24,"indent":6,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":24,"parent":21,"indent":5,"collapsed":true,"keys":[["type","SELECT","Meerdere verbruikers"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","2"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Splitsing","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektriciteitsmeter","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":26,"parent":24,"indent":6,"collapsed":false,"keys":[["type","SELECT","Wasmachine"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":24,"parent":21,"indent":5,"collapsed":true,"keys":[["type","SELECT","Meerdere verbruikers"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","2"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Splitsing","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektriciteitsmeter","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":27,"parent":24,"indent":6,"collapsed":false,"keys":[["type","SELECT","Lichtcircuit"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","dubbelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":24,"parent":21,"indent":5,"collapsed":true,"keys":[["type","SELECT","Meerdere verbruikers"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","2"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Splitsing","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektriciteitsmeter","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":23,"parent":21,"indent":5,"collapsed":false,"keys":[["type","SELECT","Stopcontact"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":21,"parent":20,"indent":4,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","VOB 3G2,5"],["naam","STRING","C"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":20,"parent":19,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",false],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":19,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","Diff"],["differentieel_waarde","STRING","30"],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":16,"parent":6,"indent":3,"collapsed":false,"keys":[["type","SELECT","Lichtcircuit"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","dubbelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","1"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":6,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","16"],["kabel","STRING","VOB 3G1,5"],["naam","STRING","B"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":17,"parent":6,"indent":3,"collapsed":false,"keys":[["type","SELECT","Lichtcircuit"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","2"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":6,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","16"],["kabel","STRING","VOB 3G1,5"],["naam","STRING","B"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":32,"parent":6,"indent":3,"collapsed":false,"keys":[["type","SELECT","Lichtcircuit"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","teleruptor"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING","3"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":6,"parent":2,"indent":2,"collapsed":true,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","16"],["kabel","STRING","VOB 3G1,5"],["naam","STRING","B"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":3,"parent":2,"indent":2,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT",2],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING",65],["kabel","STRING",""],["naam","STRING",""],["differentieel_waarde","STRING",30],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},{"id":4,"parent":3,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":3,"parent":2,"indent":2,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT",2],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING",65],["kabel","STRING",""],["naam","STRING",""],["differentieel_waarde","STRING",30],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},{"id":5,"parent":4,"indent":4,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",3],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":4,"parent":3,"indent":3,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":3,"parent":2,"indent":2,"collapsed":false,"keys":[["type","SELECT","Kring"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT",2],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING",65],["kabel","STRING",""],["naam","STRING",""],["differentieel_waarde","STRING",30],["kabel_aanwezig","BOOLEAN",false],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":2,"parent":1,"indent":1,"collapsed":false,"keys":[["type","SELECT","Bord"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","1"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","automatisch"],["amperage","STRING","20"],["kabel","STRING","XVB 3G2,5"],["naam","STRING",""],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"Parent_Item":{"id":1,"parent":0,"indent":0,"collapsed":false,"keys":[["type","SELECT","Aansluiting"],["geaard","BOOLEAN",true],["kinderveiligheid","BOOLEAN",true],["accumulatie","BOOLEAN",false],["aantal","SELECT","2"],["lichtkring_poligheid","SELECT","enkelpolig"],["ventilator","BOOLEAN",false],["zekering","SELECT","differentieel"],["amperage","STRING","40"],["kabel","STRING","2x16"],["naam","STRING","Diff"],["differentieel_waarde","STRING","300"],["kabel_aanwezig","BOOLEAN",true],["aantal2","SELECT","1"],["voltage","STRING","230V/24V"],["commentaar","STRING",""],["select1","SELECT","standaard"],["select2","SELECT","standaard"],["select3","SELECT","standaard"],["bool1","BOOLEAN",false],["bool2","BOOLEAN",false],["bool3","BOOLEAN",false],["string1","STRING",""],["string2","STRING",""],["string3","STRING",""]],"consumers":["","Kring","Aansluiting"]},"consumers":["","Bord","Kring","Splitsing"]},"consumers":["","Kring"]},"consumers":["","Bord","Kring","Aansluiting","Splitsing","Meerdere verbruikers","Leeg","Vrije tekst","Stopcontact","Lichtcircuit","Lichtpunt","Schakelaars","Bel","Boiler","Diepvriezer","Droogkast","Drukknop","Elektrische oven","Koelkast","Kookfornuis","Microgolfoven","Motor","Transformator","Vaatwasmachine","Ventilator","Verwarmingstoestel","Wasmachine"]},"consumers":["","Kring"]}],"active":[true,true,false,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,false,true,true,false,false,true,true,false,false,true,true,true,false,false,false],"id":[1,2,18,7,8,9,11,13,12,34,35,36,33,10,15,14,6,19,20,21,22,28,24,29,31,30,25,26,27,23,16,17,32,3,4,5],"curid":37}
`
function exportjson() {
  var filename:string;
  filename = "eendraadschema.eds";
  var text:string = JSON.stringify(structure);

  download_by_blob(text, filename, 'data:text/plain;charset=utf-8');
}
function HLCollapseExpand(my_id: number, state?: Boolean) {
  var ordinal: number;
  ordinal = structure.getOrdinalById(my_id);
  if (state == undefined) {
    structure.data[ordinal].collapsed = !structure.data[ordinal].collapsed;
  } else {
    structure.data[ordinal].collapsed = state;
  }
  HLRedrawTree();
}

function HLDelete(my_id: number) {
  structure.deleteById(my_id);
  HLRedrawTree();
}

function HLAdd(my_id: number) {
  structure.addItem(new Electro_Item());
  HLRedrawTree();
}

function HLInsertBefore(my_id: number) {
  structure.insertItemBeforeId(new Electro_Item(), my_id);
  HLRedrawTree();
}

function HLInsertAfter(my_id: number) {
  structure.insertItemAfterId(new Electro_Item(), my_id);
  HLRedrawTree();
}

function HLMoveDown(my_id: number) {
  structure.MoveDown(my_id);
  HLRedrawTree();
}

function HLMoveUp(my_id: number) {
  structure.MoveUp(my_id);
  HLRedrawTree();
}

function HLInsertChild(my_id: number) {
  structure.insertChildAfterId(new Electro_Item(), my_id);
  HLCollapseExpand(my_id, false);
  //No need to call HLRedrawTree as HLCollapseExpand already does that
}

function HLUpdate(my_id: number, key: string, type: string, docId: string) {
  switch (type) {
    case "SELECT":
      var setvalueselect: string = (document.getElementById(docId) as HTMLInputElement).value;
      structure.data[structure.getOrdinalById(my_id)].setKey(key,setvalueselect);
      HLRedrawTreeHTML();
      break;
    case "STRING":
      var setvaluestr: string = (document.getElementById(docId) as HTMLInputElement).value;
      structure.data[structure.getOrdinalById(my_id)].setKey(key,setvaluestr);
      break;
    case "BOOLEAN":
      var setvaluebool: boolean = (document.getElementById(docId) as HTMLInputElement).checked;
      structure.data[structure.getOrdinalById(my_id)].setKey(key,setvaluebool);
      HLRedrawTreeHTML();
      break;
  }
  HLRedrawTreeSVG();
}

function HL_editmode() {
  structure.mode = (document.getElementById("edit_mode") as HTMLInputElement).value;
  HLRedrawTreeHTML();
}

function HL_changeparent(my_id: number) {
  //-- See what the new parentid is --
  let str_newparentid = (document.getElementById("id_parent_change_"+my_id) as HTMLInputElement).value;

  //-- Check that it is valid. It needs to be a number and the parent an active component --
  let error = 0;
  let parentOrdinal = 0;
  if (!isInt(str_newparentid)) { error=1; }
  let int_newparentid = parseInt(str_newparentid);
  if (int_newparentid != 0) {
    parentOrdinal = structure.getOrdinalById(int_newparentid);
    if (typeof(parentOrdinal) == "undefined") {error=1; } else {
      if (!structure.active[parentOrdinal]) {error=1; }
    }
  }

  if (error == 1) {
    alert("Dat is geen geldig moeder-object. Probeer opnieuw.")
  } else {
    structure.data[structure.getOrdinalById(my_id)].parent = int_newparentid;
    structure.data[structure.getOrdinalById(my_id)].Parent_Item = structure.data[parentOrdinal];
  }

  HLRedrawTree();
}



function HLRedrawTreeHTML() {
  document.getElementById("configsection").innerHTML = "";
  document.getElementById("left_col_inner").innerHTML = structure.toHTML(0);
}

function HLRedrawTreeSVG() {
  document.getElementById("right_col_inner").innerHTML = '<b>Tekening: </b><button onclick=download("html")>Download als html</button>';
  document.getElementById("right_col_inner").innerHTML += '&nbsp;<button onclick=download("svg")>Download als svg</button>';
  document.getElementById("right_col_inner").innerHTML += '&nbsp;<input type="checkbox" id="noGroup" checked></input><small>SVG elementen niet groeperen (aanbevolen voor meeste tekenprogramma\'s)</small>';
  document.getElementById("right_col_inner").innerHTML += '<br><small><i>Noot: De knoppen hierboven laden enkel de tekening. Wenst u het schema ook later te bewerken, gebruik dan "Export" in het hoofdmenu.</i></small><br><br>';

  document.getElementById("right_col_inner").innerHTML += structure.toSVG(0,"horizontal").data;
  document.getElementById("right_col_inner").innerHTML += `
    <h2>Legend:</h2>
    <button style="background-color:green;">&#9650;</button> Item hierboven invoegen (zelfde niveau)<br>
    <button style="background-color:green;">&#9660;</button> Item hieronder invoegen (zelfde niveau)<br>
    <button style="background-color:green;">&#9654;</button> Afhankelijk item hieronder toevoegen (niveau dieper)<br>
    <button style="background-color:red;">&#9851;</button> Item verwijderen<br>
  `;

  document.getElementById("right_col_inner").innerHTML += '<i><br><small>Versie: ' + CONF_builddate +
                          ' (C) Ivan Goethals -- <a href="license.html" target="popup" onclick="window.open(\'license.html\',\'popup\',\'width=800,height=600\'); return false;">GPLv3</a></small></i><br><br>';

}

function HLRedrawTree() {
  HLRedrawTreeHTML();
  HLRedrawTreeSVG();
}

function buildNewStructure(structure: Hierarchical_List) {

  //Paremeterisation of the electro board
  let aantalDrogeKringen: number = CONF_aantal_droge_kringen;
  let aantalNatteKringen: number = CONF_aantal_natte_kringen;;

  //Eerst het hoofddifferentieel maken
  let itemCounter:number = 0;
  structure.addItem(new Electro_Item());
  structure.data[0].setKey("type","Aansluiting");
  structure.data[0].setKey("naam","");
  structure.data[0].setKey("zekering","differentieel");
  structure.data[0].setKey("aantal",CONF_aantal_fazen_droog);
  structure.data[0].setKey("amperage",CONF_hoofdzekering);
  structure.data[0].setKey("kabel",CONF_aantal_fazen_droog+"x16");
  structure.data[0].setKey("kabel_aanwezig",false);
  structure.data[0].setKey("differentieel_waarde",CONF_differentieel_droog);
  itemCounter++;

  //Dan het hoofdbord maken
  structure.insertChildAfterId(new Electro_Item(structure.data[itemCounter-1]),itemCounter);
  structure.data[itemCounter].setKey("type","Bord");
  itemCounter++;
  let droogBordCounter:number = itemCounter;

  //Nat bord voorzien
  structure.insertChildAfterId(new Electro_Item(structure.data[itemCounter-1]),itemCounter);
  structure.data[itemCounter].setKey("type","Kring");
  structure.data[itemCounter].setKey("naam","");
  structure.data[itemCounter].setKey("zekering","differentieel");
  structure.data[itemCounter].setKey("aantal",CONF_aantal_fazen_nat);
  structure.data[itemCounter].setKey("amperage",CONF_hoofdzekering);
  structure.data[itemCounter].setKey("kabel","");
  structure.data[itemCounter].setKey("kabel_aanwezig",false);
  structure.data[itemCounter].setKey("differentieel_waarde",CONF_differentieel_nat);
  itemCounter++;
  structure.insertChildAfterId(new Electro_Item(structure.data[itemCounter-1]),itemCounter);
  structure.data[itemCounter].setKey("type","Bord");
  structure.data[itemCounter].setKey("geaard",false);
  itemCounter++;

  //3 kringen toevoegen aan nat bord
  let natBordCounter:number = itemCounter;
  for (var i=0; i<aantalNatteKringen; i++) {
    structure.insertChildAfterId(new Electro_Item(structure.data[natBordCounter-1]),natBordCounter);
    structure.data[structure.getOrdinalById(itemCounter+1)].setKey("type","Kring");
    structure.data[structure.getOrdinalById(itemCounter+1)].setKey("naam",aantalDrogeKringen+aantalNatteKringen-i);
    itemCounter++;
  };

  //7 droge kringen toevoegen aan droog bord
  for (var i=0; i<aantalDrogeKringen; i++) {
    structure.insertChildAfterId(new Electro_Item(structure.data[structure.getOrdinalById(droogBordCounter)]),droogBordCounter);
    structure.data[structure.getOrdinalById(itemCounter+1)].setKey("type","Kring");
    structure.data[structure.getOrdinalById(itemCounter+1)].setKey("naam",aantalDrogeKringen-i);
    itemCounter++;
  }
}

function reset_all() {
  structure = new Hierarchical_List();
  buildNewStructure(structure);
  HLRedrawTree();
}



function restart_all() {
  var strleft: string = CONFIGPAGE_LEFT;

  strleft +=
  `
    Hoofddifferentieel (in mA) <input id="differentieel_droog" type="text" size="5" maxlength="5" value="300"><br>
    Hoofdzekering (in A) <input id="hoofdzekering" type="text" size="4" maxlength="4" value="65"><br><br>
    Aantal fazen:
    <select id="aantal_fazen_droog"><option value="2">2p</option><option value="3">3p</option><option value="4">4p (3p+n)</option></select>
    <br><br>
    Aantal kringen droog:
    <select id="aantal_droge_kringen">
  `

  for (var i=1;i<51;i++) {
    if (i==7) {
      strleft = strleft + '<option selected="selected" value="'+i+'">'+i+'</option>'
    } else {
      strleft = strleft + '<option value="'+i+'">'+i+'</option>'
    }
  }

  strleft += `
    </select>
    <br>
    Aantal kringen nat:
    <select id="aantal_natte_kringen">
  `

  for (var i=1;i<21;i++) {
    if (i==3) {
      strleft = strleft + '<option selected="selected" value="'+i+'">'+i+'</option>'
    } else {
      strleft = strleft + '<option value="'+i+'">'+i+'</option>'
    }
  }

  strleft +=  `
    </select><br><br>
    Aantal fazen nat: <select id="aantal_fazen_nat"><option value="2">2p</option><option value="3">3p</option><option value="4">4p (3p+n)</option></select><br>
    Differentieel nat (in mA) <input id="differentieel_nat" type="text" size="5" maxlength="5" value="30"><br>
  `
  //<button onclick="read_settings()">Start</button>

  var strright:string = `<br><br><br><br>
    Deze tool tekent een &eacute;&eacute;ndraadschema.
    De tool is in volle ontwikkeling en laat thans toe meer complexe
    schakelingen met gesplitste kringen en horizontale aaneenschakelingen
    van gebruikers (bvb koelkast achter een stopcontact) uit te voeren.
    <br><br>
    Eveneens kunnen de schemas worden opgeslagen en weer ingeladen
    voor latere aanpassing (zie knoppen "export" en "bladeren").
    <br><br>
    Op basis van een screenshot-tool (bvb snipping-tool in Windows) kan het gegenereerde
    &eacute;&eacute;ndraadschema verder verwerkt worden in een meer complete schets.
    Een andere mogelijkheid is het eendraadschema te exporteren (SVG-vector-graphics) en verder te verwerken
    met een professionele tool zoals Inkscape (open source optie).
    <br><br>
     Nuttige tips:
    <ul>
      <li>Kies "meerdere gebruikers" om horizontale ketens te bouwen, bijvoorbeeld een koelkast na een stopcontact.</li>
      <li>Een schakelbaar stopcontact kan gemaakt worden door onder "meerdere gebruikers" eerst een lichtcircuit met "0" lampen gevolgd door een stopcontact te voorzien.</li>
    </ul>
  `

  strleft += CONFIGPAGE_RIGHT;

  document.getElementById("configsection").innerHTML = strleft;

  document.getElementById("left_col_inner").innerHTML = "";
  document.getElementById("right_col_inner").innerHTML = "";

  if (browser_ie_detected()) {
    alert("Deze appicatie werkt niet in Internet Explorer. Wij raden aan een moderne browser te gebruiken zoals Edge, Firefox, Google Chrome, Opera, Vivaldi, ...");
  }
}

function import_to_structure(text: string) {
  var mystructure: Hierarchical_List = new Hierarchical_List();
  structure = new Hierarchical_List();
  var obj = JSON.parse(text);
  (<any> Object).assign(mystructure, obj);

  for (var i = 0; i < mystructure.length; i++) {
    if (mystructure.data[i].parent==0) {
      structure.addItem(new Electro_Item());
      structure.data[i].parent = 0;
    } else {
      structure.addItem(new Electro_Item(structure.data[structure.getOrdinalById(mystructure.data[i].parent)]));
      structure.data[i].parent = mystructure.data[i].parent;
    }

    structure.active[i] = mystructure.active[i];
    structure.id[i] = mystructure.id[i];

    for (var j = 0; j < mystructure.data[i].keys.length; j++) {
      structure.data[i].keys[j] = mystructure.data[i].keys[j];
    }
    structure.data[i].id = mystructure.data[i].id;
    structure.data[i].indent = mystructure.data[i].indent;
    structure.data[i].collapsed = mystructure.data[i].collapsed;

    //Parent_Item: List_Item;
  }
  HLRedrawTree();
}

function load_example(nr: number) {
  switch (nr) {
    case 0:
      import_to_structure(EXAMPLE0);
      break;
    case 1:
      import_to_structure(EXAMPLE1);
      break;
  }
}

var importjson = function(event) {
  var input = event.target;
  var reader = new FileReader();
  reader.onload = function(){
    let text:string = reader.result.toString();
    import_to_structure(text);
  };

  reader.readAsText(input.files[0]);
};

function importclicked() {
  document.getElementById('importfile').click();
  (document.getElementById('importfile') as HTMLInputElement).value = "";
}


function download_by_blob(text, filename, mimeType) {
  var element = document.createElement('a');
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(new Blob([text], {
      type: mimeType
    }), filename);
  } else if (URL && 'download' in element) {
    let uriContent = URL.createObjectURL(new Blob([text], {type : mimeType}));
    element.setAttribute('href', uriContent);
    //element.setAttribute('href', mimeType + ',' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

/*    const id = GetUniqueID();
    this.renderer.setAttribute(a, 'id', id);
    this.renderer.setAttribute(a, 'href', URL.createObjectURL(new Blob([content], {
      type: mimeType
    })));

    this.renderer.setAttribute(a, 'download', fileName);
    this.renderer.appendChild(document.body, a);

    const anchor = this.renderer.selectRootElement(`#${id}`);
    anchor.click();

    this.renderer.removeChild(document.body, a);*/
  } else {
    this.location.go(`${mimeType},${encodeURIComponent(text)}`);
  }
}

function download(type: string) {
  var filename:string;
  switch (type) {
    case "html": {
      filename = "eendraadschema.html";
      break;
    }
    case "svg": {
      filename = "eendraadschema.svg";
      break;
    }
  }
  var text:string = structure.toSVG(0,"horizontal").data;
  //Experimental, flatten everything
  if ((document.getElementById("noGroup") as HTMLInputElement).checked == true) {
    text = flattenSVGfromString(text);
  }

  download_by_blob(text, filename, 'data:text/plain;charset=utf-8');
}



function read_settings() {
  CONF_aantal_droge_kringen = parseInt((document.getElementById("aantal_droge_kringen") as HTMLInputElement).value);
  CONF_aantal_natte_kringen = parseInt((document.getElementById("aantal_natte_kringen") as HTMLInputElement).value);
  CONF_aantal_fazen_droog = parseInt((document.getElementById("aantal_fazen_droog") as HTMLInputElement).value);
  CONF_aantal_fazen_nat = parseInt((document.getElementById("aantal_fazen_nat") as HTMLInputElement).value);
  CONF_hoofdzekering = parseInt((document.getElementById("hoofdzekering") as HTMLInputElement).value);
  CONF_differentieel_droog = parseInt((document.getElementById("differentieel_droog") as HTMLInputElement).value);
  CONF_differentieel_nat = parseInt((document.getElementById("differentieel_nat") as HTMLInputElement).value);
  reset_all();
}

declare var CONF_builddate: any;
var CONF_aantal_droge_kringen = 7;
var CONF_aantal_natte_kringen = 3;
var CONF_aantal_fazen_droog = 2;
var CONF_aantal_fazen_nat = 2;
var CONF_hoofdzekering = 65;
var CONF_differentieel_droog = 300;
var CONF_differentieel_nat = 30;
var CONF_upload_OK = "ask"; //can be "ask", "yes", "no";
var structure: Hierarchical_List;
restart_all();
