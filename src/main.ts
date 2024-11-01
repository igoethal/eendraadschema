interface Navigator{
   msSaveBlob:(blob: Blob,fileName:string) => boolean
}

function forceUndoStore() {
    undostruct.store();
}

function HLCollapseExpand(my_id: number, state?: Boolean) {
    let ordinal: number;
    ordinal = structure.getOrdinalById(my_id);
    if (state == undefined) {
       structure.data[ordinal].collapsed = !structure.data[ordinal].collapsed;
    } else {
       structure.data[ordinal].collapsed = state;
    }
    undostruct.store();
    structure.updateHTMLinner(my_id);
    HLRedrawTreeSVG();
}

function HLDelete(my_id: number) {
    structure.deleteById(my_id);
    undostruct.store();
    HLRedrawTree();
}

function HLAdd(my_id: number) {
    structure.addItem("");
    undostruct.store();
    HLRedrawTree();
}

function HLInsertBefore(my_id: number) {
    structure.insertItemBeforeId(new Electro_Item(structure), my_id);
    undostruct.store();
    HLRedrawTree();
}

function HLInsertAfter(my_id: number) {
    structure.insertItemAfterId(new Electro_Item(structure), my_id);
    undostruct.store();
    HLRedrawTree();
}

function HLMoveDown(my_id: number) {
    structure.moveDown(my_id);
    undostruct.store();
    HLRedrawTree();
}

function HLMoveUp(my_id: number) {
    structure.moveUp(my_id);
    undostruct.store();
    HLRedrawTree();
}

function HLClone(my_id: number) {
    structure.clone(my_id);
    undostruct.store();
    HLRedrawTree();
}

function HLInsertChild(my_id: number) {
    structure.insertChildAfterId(new Electro_Item(structure), my_id);
    //undostruct.store();  We should not call this as the CollapseExpand already does that
    HLCollapseExpand(my_id, false);
    //No need to call HLRedrawTree as HLCollapseExpand already does that
}

function HLPropUpdate(my_id: number, item: string, type: string, docId: string) {
    /*switch (type) {
      case "SELECT":
          var setvalueselect: string = (document.getElementById(docId) as HTMLInputElement).value;
          if (item == "type") { // Type changed
            structure.adjustTypeById(my_id, setvalueselect);
          } else {
            structure.data[structure.getOrdinalById(my_id)].props[item] = setvalueselect;
          }
          HLRedrawTreeHTML();
          break;
      case "STRING":
          var setvaluestr: string = (document.getElementById(docId) as HTMLInputElement).value;
          structure.data[structure.getOrdinalById(my_id)].props[item] = setvaluestr;
          break;
      case "BOOLEAN":
          var setvaluebool: boolean = (document.getElementById(docId) as HTMLInputElement).checked;
          structure.data[structure.getOrdinalById(my_id)].props[item] = setvaluebool;
          HLRedrawTreeHTML();
          break;
    }
    undostruct.store();
    HLRedrawTreeSVG();*/
}

function HL_editmode() {
    structure.mode = (document.getElementById("edit_mode") as HTMLInputElement).value;
    HLRedrawTreeHTML();
}

function HL_changeparent(my_id: number) {
    // See what the new parentid is
    let str_newparentid = (document.getElementById("id_parent_change_"+my_id) as HTMLInputElement).value;

    //-- Check that it is valid. It needs to be a number and the parent an active component --
    let error = 0;
    let parentOrdinal = 0;
    if (!isInt(str_newparentid)) { error=1; }
    let int_newparentid = parseInt(str_newparentid);
    if (int_newparentid != 0) {
        parentOrdinal = structure.getOrdinalById(int_newparentid);
        if (typeof(parentOrdinal) == "undefined")
          error=1;
          else if ( (!structure.active[parentOrdinal]) || (int_newparentid == my_id) ) error=1;
    }

    if (error == 1) alert("Dat is geen geldig moeder-object. Probeer opnieuw.");
    else structure.data[structure.getOrdinalById(my_id)].parent = int_newparentid;

    structure.reSort();
    undostruct.store();

    HLRedrawTree();
}

function HL_cancelFilename() {
    document.getElementById("settings").innerHTML = '<code>' + structure.properties.filename + '</code>&nbsp;<button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button>';
}

function HL_changeFilename() {
    var regex:RegExp = new RegExp('^.*\\.eds$');
    var filename = (document.getElementById("filename") as HTMLInputElement).value;
    if (regex.test(filename)) {
        structure.properties.setFilename((document.getElementById("filename") as HTMLInputElement).value);
        document.getElementById("settings").innerHTML = '<code>' + structure.properties.filename + '</code><br><button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button>';
    } else {
        structure.properties.setFilename((document.getElementById("filename") as HTMLInputElement).value+'.eds');
        document.getElementById("settings").innerHTML = '<code>' + structure.properties.filename + '</code><br><button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button>';
    }
}

function HL_enterSettings() {
    document.getElementById("settings").innerHTML = '<input type="text" id="filename" onchange="HL_changeFilename()" value="' + structure.properties.filename + '" pattern="^.*\\.eds$">&nbsp;<i>Gebruik enkel alphanumerieke karakters a-z A-Z 0-9, streepjes en spaties. <b>Eindig met ".eds"</b>. Druk daarna op enter.</i><br><button onclick="HL_cancelFilename()">Annuleer</button>&nbsp;<button onclick="HL_changeFilename()">Toepassen</button>';
}

function HLRedrawTreeHTML() {
    show2col();
    document.getElementById("configsection").innerHTML = "";
    var output:string = structure.toHTML(0) + "<br>" + renderAddressStacked();
    document.getElementById("left_col_inner").innerHTML = output;
}

function HLRedrawTreeHTMLLight() {
    var output:string = structure.toHTML(0) + "<br>" + renderAddressStacked();
    document.getElementById("left_col_inner").innerHTML = output;
}

function HLRedrawTreeSVG() {
    let str:string = '<b>Tekening: </b>Ga naar het print-menu om de tekening af te printen of te exporteren als SVG vector graphics.<br><br>'
                   +  flattenSVGfromString(structure.toSVG(0,"horizontal").data)
                   + '<h2>Legende:</h2>'
                   + '<button style="background-color:green;">&#9650;</button> Item hierboven invoegen (zelfde niveau)<br>'
                   + '<button style="background-color:green;">&#9660;</button> Item hieronder invoegen (zelfde niveau)<br>'
                   + '<button style="background-color:green;">&#9654;</button> Afhankelijk item hieronder toevoegen (niveau dieper)<br>'
                   + '<button style="background-color:red;">&#9851;</button> Item verwijderen<br>'
                   + '<i><br><small>Versie: ' + CONF_builddate
                   + ' (C) Ivan Goethals -- <a href="license.html" target="popup" onclick="window.open(\'license.html\',\'popup\',\'width=800,height=600\'); return false;">GPLv3</a></small></i><br><br>';

    document.getElementById("right_col_inner").innerHTML = str;
}

function HLRedrawTree() {
    HLRedrawTreeHTML();
    HLRedrawTreeSVG();
}

function buildNewStructure(structure: Hierarchical_List) {
    // Paremeterisation of the electro board
    let aantalDrogeKringen: number = CONF_aantal_droge_kringen;
    let aantalNatteKringen: number = CONF_aantal_natte_kringen;;

    // Eerst het hoofddifferentieel maken
    let itemCounter:number = 0;
    structure.addItem("Aansluiting");
    structure.data[0].props.type  = "Aansluiting";
    structure.data[0].props.naam = "";
    structure.data[0].props.bescherming  = "differentieel";
    structure.data[0].props.aantal_polen  = CONF_aantal_fazen_droog;
    structure.data[0].props.amperage  = CONF_hoofdzekering;
    structure.data[0].props.type_kabel_na_teller  = CONF_aantal_fazen_droog+"x16";
    structure.data[0].props.differentieel_delta_amperage = CONF_differentieel_droog;
    itemCounter++;

    // Dan het hoofdbord maken
    structure.insertChildAfterId(new Bord(structure),itemCounter);
    structure.data[itemCounter].props.type = "Bord";
    itemCounter++;
    let droogBordCounter:number = itemCounter;

    // Nat bord voorzien
    structure.insertChildAfterId(new Kring(structure),itemCounter);
    structure.data[itemCounter].props.type  = "Kring";
    structure.data[itemCounter].props.bescherming  = "differentieel";
    structure.data[itemCounter].props.aantal_polen  = CONF_aantal_fazen_nat;
    structure.data[itemCounter].props.amperage  = CONF_hoofdzekering;
    structure.data[itemCounter].props.kabel_is_aanwezig = false;
    structure.data[itemCounter].props.differentieel_delta_amperage = CONF_differentieel_nat;
    itemCounter++;
    structure.insertChildAfterId(new Bord(structure),itemCounter);
    structure.data[itemCounter].props.type = "Bord";
    structure.data[itemCounter].props.is_geaard = false; // Geaard
    itemCounter++;

    // Pas info aan
    switch (CONF_aantal_fazen_droog) {
        case 2: structure.properties.info = '2 x 230V ~50 Hz'; break;
        case 3: structure.properties.info = '3 x 230V ~50 Hz'; break;
        case 4: structure.properties.info = '3 x 400V + N ~50 Hz';
    }
}

function reset_all() {
    structure = new Hierarchical_List();
    buildNewStructure(structure);
    HLRedrawTree();
}

function renderAddress() {
    var outHTML: string = "";

    outHTML = '<div align="left">' +
              '<div style="display:inline-block; width:25px;"></div><div style="display:inline-block;"><table cols="3" rows="1" style="border-collapse: collapse;border-style: solid; border-width:medium;" cellpadding="5">' +
              '  <tr><th style="text-align: left;border-style: solid; border-width:thin;">Plaats van de elektrische installatie</th><th style="text-align: left;border-style: solid; border-width:thin;">Installateur</th><th style="text-align: left;border-style: solid; border-width:thin;">Info</th></tr>' +
              '  <tr>' +
              '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_owner" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + structure.properties.owner + '</td>' +
              '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_installer" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + structure.properties.installer + '</td>' +
              '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_control" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + structure.properties.control + '</td>' +
              '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_info" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + structure.properties.info + '</td>' +
              '  </tr>' +
              '</table></div></div>';

    return outHTML;
}

function renderAddressStacked() {
    var outHTML: string = "";

    if (!structure.properties.control) structure.properties.control = "<br>";

    outHTML = 'Plaats van de elektrische installatie' +
              '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
              '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_owner" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + structure.properties.owner + '</td></tr>' +
              '</table><br>' +
              'Installateur' +
              '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
              '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_installer" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + structure.properties.installer + '</td></tr>' +
              '</table><br>' +
              'Erkend organisme (keuring)' +
              '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
              '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_control" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + structure.properties.control + '</td></tr>' +
              '</table><br>' +
              'Info' +
              '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
              '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_info" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + structure.properties.info + '</td></tr>' +
              '</table>';

    return outHTML;
}

function changeAddressParams() {
    structure.properties.owner = (document.getElementById("conf_owner") as HTMLElement).innerHTML;
    structure.properties.installer = (document.getElementById("conf_installer") as HTMLElement).innerHTML;
    structure.properties.control = (document.getElementById("conf_control") as HTMLElement).innerHTML;
    structure.properties.info = (document.getElementById("conf_info") as HTMLElement).innerHTML;
}

function openContactForm() {
    var strleft: string = PROP_Contact_Text;

    document.getElementById("configsection").innerHTML = strleft;
    hide2col();
}

function restart_all() {
    var strleft: string = CONFIGPAGE_LEFT;

    strleft +=
    `
      Hoofddifferentieel (in mA) <input id="differentieel_droog" type="text" size="5" maxlength="5" value="300"><br><br>
      Hoofdzekering (in A) <input id="hoofdzekering" type="text" size="4" maxlength="4" value="65"><br><br>
      Aantal fazen:
      <select id="aantal_fazen_droog"><option value="2">2p</option><option value="3">3p</option><option value="4">4p (3p+n)</option></select>`;

    strleft += CONFIGPAGE_RIGHT;

    strleft += PROP_getCookieText(); //Will only be displayed in the online version
    strleft += PROP_development_options();

    document.getElementById("configsection").innerHTML = strleft;
    hide2col();

    if (browser_ie_detected()) {
       alert("Deze appicatie werkt niet in Internet Explorer. Wij raden aan een moderne browser te gebruiken zoals Edge, Firefox, Google Chrome, Opera, Vivaldi, ...");
    }
}

function hide2col() {
    document.getElementById("configsection").style.display = 'block';
    document.getElementById("ribbon").style.display = 'none';
    document.getElementById("canvas_2col").style.display = 'none';
    /*var leftElement = document.getElementById("left_col_inner");
    var rightElement = document.getElementById("right_col_inner");
    if(typeof(leftElement) != 'undefined' && leftElement != null){
        leftElement.innerHTML = "";
    };
    if(typeof(rightElement) != 'undefined' && rightElement != null){
        rightElement.innerHTML = "";
    };
    document.getElementById("canvas_2col").innerHTML = "";
    document.getElementById("ribbon").innerHTML = "";*/
}

function show2col() {
    document.getElementById("configsection").style.display = 'none';
    document.getElementById("ribbon").style.display = 'block';
    document.getElementById("canvas_2col").style.display = 'flex';
    /*if (document.getElementById("canvas_2col").innerHTML == "") {
        document.getElementById("canvas_2col").innerHTML = '<div id="left_col"><div id="left_col_inner"></div></div><div id="right_col"><div id="right_col_inner"></div></div>';
    }*/
    structure.updateRibbon();
}

function load_example(nr: number) {
    switch (nr) {
        case 0:
            import_to_structure(EXAMPLE0);
            fileAPIobj.clear();
            break;
        case 1:
            import_to_structure(EXAMPLE1);
            fileAPIobj.clear();
            break;
    }
}

function undoClicked() {
    undostruct.undo();    
}

function redoClicked() {
    undostruct.redo();    
}

function download(type: string) {
    var filename:string;
    var mimeType:string;
    switch (type) {
        case "html": {
            filename = "eendraadschema.html";
            mimeType = 'data:image/svg+xml;charset=utf-8';
            break;
        }
        case "svg": {
            filename = "eendraadschema.svg";
            mimeType = 'data:text/html;charset=utf-8';
            break;
        }
    }
    var text:string = structure.toSVG(0,"horizontal").data;
    if ((document.getElementById("noGroup") as HTMLInputElement).checked == true) text = flattenSVGfromString(text);

    download_by_blob(text, filename, mimeType); //was text/plain
}

function read_settings() {
  CONF_aantal_fazen_droog = parseInt((document.getElementById("aantal_fazen_droog") as HTMLInputElement).value);
  CONF_aantal_fazen_nat = CONF_aantal_fazen_droog;
  CONF_hoofdzekering = parseInt((document.getElementById("hoofdzekering") as HTMLInputElement).value);
  CONF_differentieel_droog = parseInt((document.getElementById("differentieel_droog") as HTMLInputElement).value);
  fileAPIobj.clear();
  reset_all();
}

//--- MAIN PROGRAM ---

declare var CONF_builddate: any; //needed to be able to read the variable from the builddate.js file (otherwise compiler will complain)

var CONF_aantal_droge_kringen = 7;
var CONF_aantal_natte_kringen = 3;
var CONF_aantal_fazen_droog = 2;
var CONF_aantal_fazen_nat = 2;
var CONF_hoofdzekering = 65;
var CONF_differentieel_droog = 300;
var CONF_differentieel_nat = 30;
var CONF_upload_OK = "ask"; //can be "ask", "yes", "no"; //before uploading, we ask

var structure: Hierarchical_List;
var undostruct: undoRedo = new undoRedo(100);

import_to_structure(EXAMPLE_DEFAULT,false); //Just in case the user doesn't select a scheme and goes to drawing immediately, there should be something there

// Now add handlers for everything that changes in the left column

document.querySelector('#left_col_inner').addEventListener('change', function(event) {

    function propUpdate(my_id: number, item: string, type: string, value: string | boolean): void {
        switch (type) {
          case "select-one":
              if (item == "type") { // Type changed
                structure.adjustTypeById(my_id, value as string);
              } else {
                structure.data[structure.getOrdinalById(my_id)].props[item] = (value as string);
              }
              structure.updateHTMLinner(my_id);
              break;
          case "text":
              structure.data[structure.getOrdinalById(my_id)].props[item] = (value as string);
              break;
          case "checkbox":
              structure.data[structure.getOrdinalById(my_id)].props[item] = (value as boolean);
              structure.updateHTMLinner(my_id);
              break;
        }
        undostruct.store();
        HLRedrawTreeSVG();
    }

    const element: HTMLInputElement = event.target as HTMLInputElement;

    // Ensure the id starts with 'HL_edit_'
    if (!element.id.startsWith('HL_edit_')) return;

    const { type, id } = element;
    const value = type === 'checkbox' ? element.checked : element.value;

    // Extract id and key from id
    const match = id.match(/^HL_edit_(\d+)_(.+)$/);
    const idNumber = match ? match[1] : null;
    const key = match ? match[2] : null;

    propUpdate(parseInt(idNumber),key,type,value);

    
    // Perform your logic here with the extracted data
});

restart_all();
