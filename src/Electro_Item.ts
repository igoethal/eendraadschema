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
          outputstr += '<use xlink:href="#relais" x="' + endx + '" y="25" />';
          outputstr += '<use xlink:href="#moving_man" x="' + (endx + 1.5) + '" y="20" />';
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
