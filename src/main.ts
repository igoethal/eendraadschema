import { showDocumentationPage } from "./documentation/documentation";
import { browser_ie_detected, flattenSVGfromString, isInt } from "./general";
import { Hierarchical_List } from "./Hierarchical_List";
import { Bord } from "./List_Item/Bord";
import { Electro_Item } from "./List_Item/Electro_Item";
import { Kring } from "./List_Item/Kring";
import { MarkerList } from "./print/MarkerList";
import { SituationPlan } from "./sitplan/SituationPlan";
import { SituationPlanView } from "./sitplan/SituationPlanView";
import * as pako from 'pako';
import { CONFIGPAGE_LEFT, CONFIGPAGE_RIGHT, EXAMPLE0, EXAMPLE1, EXAMPLE_DEFAULT } from "./config";
import { type MenuItem, TopMenu } from "./TopMenu";
import { LocalStorageService } from "./services/localstorage.service";
import jsPDF from "jspdf";
import { SVGelement } from "./SVGelement";

const structureStorage = new LocalStorageService<Hierarchical_List>('structureStorage');
const structures = structureStorage.get();

if (structures.length === 0) {
    window.global_structure = new Hierarchical_List()
    structureStorage.save([window.global_structure]);
} else {
    window.global_structure = new Hierarchical_List();
    Object.assign(window.global_structure, structures[0]);
}

export interface INavigator {
    msSaveBlob: (blob: Blob, fileName: string) => boolean
}

function forceUndoStore() {
    undostruct.store();
}

function HLCollapseExpand(my_id: number, state?: Boolean) {
    let ordinal: number;
    ordinal = window.global_structure.getOrdinalById(my_id);
    if (state == undefined) {
        window.global_structure.data[ordinal].collapsed = !window.global_structure.data[ordinal].collapsed;
    } else {
        window.global_structure.data[ordinal].collapsed = state;
    }
    undostruct.store();
    window.global_structure.updateHTMLinner(my_id);
    HLRedrawTreeSVG();
}

function HLDelete(my_id: number) {
    window.global_structure.deleteById(my_id);
    undostruct.store();
    HLRedrawTree();
}

export function HLAdd(my_id: number) {
    window.global_structure.addItem("");
    undostruct.store();
    HLRedrawTree();
}

function HLInsertBefore(my_id: number) {
    window.global_structure.insertItemBeforeId(new Electro_Item(window.global_structure), my_id);
    undostruct.store();
    HLRedrawTree();
}

function HLInsertAfter(my_id: number) {
    window.global_structure.insertItemAfterId(new Electro_Item(window.global_structure), my_id);
    undostruct.store();
    HLRedrawTree();
}

function HLMoveDown(my_id: number) {
    window.global_structure.moveDown(my_id);
    undostruct.store();
    HLRedrawTree();
}

function HLMoveUp(my_id: number) {
    window.global_structure.moveUp(my_id);
    undostruct.store();
    HLRedrawTree();
}

function HLClone(my_id: number) {
    window.global_structure.clone(my_id);
    undostruct.store();
    HLRedrawTree();
}

function HLInsertChild(my_id: number) {
    window.global_structure.insertChildAfterId(new Electro_Item(window.global_structure), my_id);
    //undostruct.store();  We should not call this as the CollapseExpand already does that
    HLCollapseExpand(my_id, false);
    //No need to call HLRedrawTree as HLCollapseExpand already does that
}

function HL_editmode() {
    window.global_structure.mode = (document.getElementById("edit_mode") as HTMLInputElement).value;
    HLRedrawTreeHTML();
}

function HLExpand(my_id: number) {
    let element: Electro_Item = window.global_structure.getElectroItemById(my_id) as Electro_Item;
    if (element !== null) {
        element.expand();
    }

    window.global_structure.reSort();
    undostruct.store();
    HLRedrawTree();
}

function HL_changeparent(my_id: number) {
    // See what the new parentid is
    let str_newparentid = (document.getElementById("id_parent_change_" + my_id) as HTMLInputElement).value;

    //-- Check that it is valid. It needs to be a number and the parent an active component --
    let error = 0;
    let parentOrdinal = 0;
    if (!isInt(str_newparentid)) { error = 1; }
    let int_newparentid = parseInt(str_newparentid);
    if (int_newparentid != 0) {
        parentOrdinal = window.global_structure.getOrdinalById(int_newparentid);
        if (typeof (parentOrdinal) == "undefined")
            error = 1;
        else if ((!window.global_structure.active[parentOrdinal]) || (int_newparentid == my_id)) error = 1;
    }

    if (error == 1) alert("Dat is geen geldig moeder-object. Probeer opnieuw.");
    else window.global_structure.data[window.global_structure.getOrdinalById(my_id)].parent = int_newparentid;

    window.global_structure.reSort();
    undostruct.store();
    HLRedrawTree();
}

function HL_cancelFilename() {
    document.getElementById("settings").innerHTML = '<code>' + window.global_structure.properties.filename + '</code><br><button style="font-size:14px" onclick="exportjson()">Opslaan</button>&nbsp;<button style="font-size:14px" onclick="HL_enterSettings()">Naam wijzigen</button>';
}

function HL_changeFilename() {
    var regex: RegExp = new RegExp('^.*\\.eds$');
    var filename = (document.getElementById("filename") as HTMLInputElement).value;
    if (regex.test(filename)) {
        window.global_structure.properties.setFilename((document.getElementById("filename") as HTMLInputElement).value);
        document.getElementById("settings").innerHTML = '<code>' + window.global_structure.properties.filename + '</code><br><button style="font-size:14px" onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button style="font-size:14px" onclick="exportjson()">Opslaan</button>';
    } else {
        window.global_structure.properties.setFilename((document.getElementById("filename") as HTMLInputElement).value + '.eds');
        document.getElementById("settings").innerHTML = '<code>' + window.global_structure.properties.filename + '</code><br><button style="font-size:14px" onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button style="font-size:14px" onclick="exportjson()">Opslaan</button>';
    }
}

function HL_enterSettings() {
    document.getElementById("settings").innerHTML = '<input type="text" id="filename" onchange="HL_changeFilename()" value="' + window.global_structure.properties.filename + '" pattern="^.*\\.eds$"><br><i>Gebruik enkel alphanumerieke karakters a-z A-Z 0-9, streepjes en spaties. <b>Eindig met ".eds"</b>. Druk daarna op enter.</i><br><button onclick="HL_cancelFilename()">Annuleer</button>&nbsp;<button onclick="HL_changeFilename()">Toepassen</button>';
}

function HLRedrawTreeHTML() {
    toggleAppView('2col');
    document.getElementById("configsection").innerHTML = "";
    var output: string = window.global_structure.toHTML(0) + "<br>" + renderAddressStacked();
    document.getElementById("left_col_inner").innerHTML = output;
}

function HLRedrawTreeHTMLLight() {
    var output: string = window.global_structure.toHTML(0) + "<br>" + renderAddressStacked();
    document.getElementById("left_col_inner").innerHTML = output;
}

function HLRedrawTreeSVG() {
    let str: string = '<b>Tekening: </b>Ga naar het print-menu om de tekening af te printen of te exporteren als SVG vector graphics.<br><br>'
        + '<div id="EDS">' + flattenSVGfromString(window.global_structure.toSVG(0, "horizontal").data, 10) + '</div>'
        + '<h2>Legende:</h2>'
        + '<button style="background-color:green;">&#9650;</button> Item hierboven invoegen (zelfde niveau)<br>'
        + '<button style="background-color:green;">&#9660;</button> Item hieronder invoegen (zelfde niveau)<br>'
        + '<button style="background-color:green;">&#9654;</button> Afhankelijk item hieronder toevoegen (niveau dieper)<br>'
        + '<button style="background-color:red;">&#9851;</button> Item verwijderen<br>'
        + '<i><br><small>Versie: ' + CONF_builddate
        + ' (C) Ivan Goethals -- <a href="license.html" target="popup" onclick="window.open(\'license.html\',\'popup\',\'width=800,height=600\'); return false;">Terms</a></small></i><br><br>';

    document.getElementById("right_col_inner").innerHTML = str;
}

export function HLRedrawTree() {
    HLRedrawTreeHTML();
    HLRedrawTreeSVG();
}

function buildNewStructure(structure: Hierarchical_List) {
    // Paremeterisation of the electro board
    let aantalDrogeKringen: number = CONF_aantal_droge_kringen;
    let aantalNatteKringen: number = CONF_aantal_natte_kringen;;

    // Eerst het hoofddifferentieel maken
    let itemCounter: number = 0;
    structure.addItem("Aansluiting");
    structure.data[0].props.type = "Aansluiting";
    structure.data[0].props.naam = "";
    structure.data[0].props.bescherming = "differentieel";
    structure.data[0].props.aantal_polen = CONF_aantal_fazen_droog;
    structure.data[0].props.amperage = CONF_hoofdzekering;
    structure.data[0].props.type_kabel_na_teller = CONF_aantal_fazen_droog + "x16";
    structure.data[0].props.differentieel_delta_amperage = CONF_differentieel_droog;
    itemCounter++;

    // Dan het hoofdbord maken
    structure.insertChildAfterId(new Bord(structure), itemCounter);
    structure.data[itemCounter].props.type = "Bord";
    itemCounter++;
    let droogBordCounter: number = itemCounter;

    // Nat bord voorzien
    structure.insertChildAfterId(new Kring(structure), itemCounter);
    structure.data[itemCounter].props.type = "Kring";
    structure.data[itemCounter].props.bescherming = "differentieel";
    structure.data[itemCounter].props.aantal_polen = CONF_aantal_fazen_nat;
    structure.data[itemCounter].props.amperage = CONF_hoofdzekering;
    structure.data[itemCounter].props.kabel_is_aanwezig = false;
    structure.data[itemCounter].props.differentieel_delta_amperage = CONF_differentieel_nat;
    itemCounter++;
    structure.insertChildAfterId(new Bord(structure), itemCounter);
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
    if (window.global_structure != null) window.global_structure.dispose();
    window.global_structure = new Hierarchical_List();
    buildNewStructure(window.global_structure);
    topMenu.selectMenuItemByName('Eéndraadschema');
    undostruct.clear();
    undostruct.store();
}

function renderAddress() {
    var outHTML: string = "";

    outHTML = '<div align="left">' +
        '<div style="display:inline-block; width:25px;"></div><div style="display:inline-block;"><table cols="3" rows="1" style="border-collapse: collapse;border-style: solid; border-width:medium;" cellpadding="5">' +
        '  <tr><th style="text-align: left;border-style: solid; border-width:thin;">Plaats van de elektrische installatie</th><th style="text-align: left;border-style: solid; border-width:thin;">Installateur</th><th style="text-align: left;border-style: solid; border-width:thin;">Info</th></tr>' +
        '  <tr>' +
        '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_owner" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + window.global_structure.properties.owner + '</td>' +
        '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_installer" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + window.global_structure.properties.installer + '</td>' +
        '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_control" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + window.global_structure.properties.control + '</td>' +
        '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_info" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + window.global_structure.properties.info + '</td>' +
        '  </tr>' +
        '</table></div></div>';

    return outHTML;
}

function renderAddressStacked() {
    var outHTML: string = "";

    if (!window.global_structure.properties.control) window.global_structure.properties.control = "<br>";

    outHTML = 'Plaats van de elektrische installatie' +
        '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
        '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_owner" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + window.global_structure.properties.owner + '</td></tr>' +
        '</table><br>' +
        'Installateur' +
        '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
        '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_installer" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + window.global_structure.properties.installer + '</td></tr>' +
        '</table><br>' +
        'Erkend organisme (keuring)' +
        '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
        '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_control" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + window.global_structure.properties.control + '</td></tr>' +
        '</table><br>' +
        'Info' +
        '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
        '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_info" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + window.global_structure.properties.info + '</td></tr>' +
        '</table>';

    return outHTML;
}

function changeAddressParams() {
    window.global_structure.properties.owner = (document.getElementById("conf_owner") as HTMLElement).innerHTML;
    window.global_structure.properties.installer = (document.getElementById("conf_installer") as HTMLElement).innerHTML;
    window.global_structure.properties.control = (document.getElementById("conf_control") as HTMLElement).innerHTML;
    window.global_structure.properties.info = (document.getElementById("conf_info") as HTMLElement).innerHTML;
}

function openContactForm() {
    var strleft: string = PROP_Contact_Text;
    strleft = strleft.replace(/Bewerken/g, "Eéndraadschema");

    document.getElementById("configsection").innerHTML = strleft;
    toggleAppView('config');
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

    // strleft += PROP_getCookieText(); //Will only be displayed in the online version
    // strleft += PROP_development_options();

    document.getElementById("configsection").innerHTML = strleft;
    toggleAppView('config');

    if (browser_ie_detected()) {
        alert("Deze appicatie werkt niet in Internet Explorer. Wij raden aan een moderne browser te gebruiken zoals Edge, Firefox, Google Chrome, Opera, Vivaldi, ...");
    }
}

export function toggleAppView(type: '2col' | 'config' | 'draw') {
    let lastview = window.global_structure.properties.currentView ?? '2col';
    if ((window.global_structure.sitplanview != null) && (window.global_structure.sitplanview.contextMenu != null)) window.global_structure.sitplanview.contextMenu.hide();

    window.global_structure.properties.currentView = type;
    if (type === '2col') {
        document.getElementById("configsection").innerHTML = '';
        document.getElementById("configsection").style.display = 'none';

        document.getElementById("outerdiv").style.display = 'none';

        document.getElementById("ribbon").style.display = 'flex';
        document.getElementById("canvas_2col").style.display = 'flex';
        window.global_structure.updateRibbon(); // We moeten de ribbon updaten want de structuur is gewijzigd
    } else if (type === 'config') {
        document.getElementById("configsection").style.display = 'block';

        document.getElementById("outerdiv").style.display = 'none';

        document.getElementById("ribbon").innerHTML = ''; // Voor performance redenen
        document.getElementById("ribbon").style.display = 'none';

        document.getElementById("left_col_inner").innerHTML = ''; // Voor performance redenen

        // We zetten bewist het SVG element EDS niet op nul want is nodig voor het print-voorbeeld

        document.getElementById("canvas_2col").style.display = 'none';
    } else if (type === 'draw') {
        document.getElementById("configsection").innerHTML = "";
        document.getElementById("configsection").style.display = 'none';

        document.getElementById("outerdiv").style.display = 'flex';
        document.getElementById("ribbon").style.display = 'flex';

        document.getElementById("left_col_inner").innerHTML = ''; // Voor performance redenen

        if (document.getElementById("EDSSVG") !== null)
            document.getElementById("EDSSVG").innerHTML = ''; // Deze is nodig anders wil het situatieschema het patroon VerticalStripe niet laden wegens dubbel gedefinieerd
        // We maken de EDSSVG leeg en niet de EDS-DIV want anders onthoudt de browser de positie van de scrollbars niet

        document.getElementById("canvas_2col").style.display = 'none';
    }

    if ((['2col', 'draw'].includes(type)) && (['2col', 'draw'].includes(lastview)) && (type !== lastview))
        undostruct.store();

}

function load_example(nr: number) {
    switch (nr) {
        case 0:
            EDStoStructure(EXAMPLE0);
            fileAPIobj.clear();
            break;
        case 1:
            EDStoStructure(EXAMPLE1);
            fileAPIobj.clear();
            break;
    }
}

function undoClicked() {
    if ((window.global_structure.sitplanview != null) && (window.global_structure.sitplanview.contextMenu != null)) window.global_structure.sitplanview.contextMenu.hide();
    undostruct.undo();
}

function redoClicked() {
    if ((window.global_structure.sitplanview != null) && (window.global_structure.sitplanview.contextMenu != null)) window.global_structure.sitplanview.contextMenu.hide();
    undostruct.redo();
}

function download(type: string) {
    var filename: string;
    var mimeType: string;
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
    var text: string = window.global_structure.toSVG(0, "horizontal").data;
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

var CONF_builddate: string = '20250317-222603'; //needed to be able to read the variable from the builddate.js file (otherwise compiler will complain)

var CONF_aantal_droge_kringen = 7;
var CONF_aantal_natte_kringen = 3;
var CONF_aantal_fazen_droog = 2;
var CONF_aantal_fazen_nat = 2;
var CONF_hoofdzekering = 65;
var CONF_differentieel_droog = 300;
var CONF_differentieel_nat = 30;
var CONF_upload_OK = "ask"; //can be "ask", "yes", "no"; //before uploading, we ask


// Configure the app-zone in the HTML

document.getElementById('svgdefs').innerHTML =
    '<pattern id="VerticalStripe" x="5" y="0" width="5" height="10" patternUnits="userSpaceOnUse" >' +
    '<line x1="0" y1="0" x2="0" y2="10" stroke="black" />' +
    '</pattern>';

// Build the menu

let menuItems: MenuItem[]

menuItems = [
    { name: 'Nieuw', callback: restart_all },
    { name: 'Bestand', callback: showFilePage },
    { name: 'Eéndraadschema', callback: HLRedrawTree },
    { name: 'Situatieschema', callback: showSituationPlanPage },
    { name: 'Print', callback: printsvg },
    { name: 'Documentatie', callback: showDocumentationPage },
    { name: 'Info/Contact', callback: openContactForm }
];


PROP_edit_menu(menuItems);

export const topMenu = new TopMenu('minitabs', 'menu-item', menuItems);

// Download a default structure

// Now add handlers for everything that changes in the left column

document.querySelector('#left_col_inner').addEventListener('change', function (event) {

    function propUpdate(my_id: number, item: string, type: string, value: string | boolean): void {
        switch (type) {
            case "select-one":
                if (item == "type") { // Type changed
                    window.global_structure.adjustTypeById(my_id, value as string);
                } else {
                    window.global_structure.data[window.global_structure.getOrdinalById(my_id)].props[item] = (value as string);
                }
                window.global_structure.updateHTMLinner(my_id);
                break;
            case "text":
                window.global_structure.data[window.global_structure.getOrdinalById(my_id)].props[item] = (value as string);
                if (item === 'kortsluitvermogen') window.global_structure.updateHTMLinner(my_id);
                break;
            case "checkbox":
                window.global_structure.data[window.global_structure.getOrdinalById(my_id)].props[item] = (value as boolean);
                window.global_structure.updateHTMLinner(my_id);
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

    propUpdate(parseInt(idNumber), key, type, value);

    // Perform your logic here with the extracted data
});

restart_all(); // Create the default structure

function showSituationPlanPage(): void {
    throw new Error("Function not implemented.");
}

class importExportUsingFileAPI {

    saveNeeded: boolean;
    fileHandle: any;
    filename: string;
    lastsaved: string;

    constructor() {
        this.clear();
        //this.updateButtons();
    }

    clear() {
        this.saveNeeded = false;
        this.fileHandle = null;
        this.filename = null;
    }

    updateLastSaved() {
        var currentdate = new Date();
        this.lastsaved = currentdate.getHours().toString().padStart(2, '0') + ":" +
            currentdate.getMinutes().toString().padStart(2, '0') + ":" +
            currentdate.getSeconds().toString().padStart(2, '0');;

        //If there is an object on the screen that needs updating, do it
        if (document.getElementById('exportscreen') as HTMLInputElement) {
            showFilePage(); // Update the export screen if we are actually on the export screen
        }
    }

    setSaveNeeded(input) {
        let lastSaveNeeded = this.saveNeeded;
        this.saveNeeded = input;
        //if (input !== lastSaveNeeded) this.updateButtons();
    }

    async readFile() {

        [this.fileHandle] = await (window as any).showOpenFilePicker({
            types: [{
                description: 'Eendraadschema (.eds)',
                accept: { 'application/eds': ['.eds'] },
            }],
        });

        const file = await (this.fileHandle as any).getFile();
        const contents = await file.text();

        this.filename = file.name;
        window.global_structure.properties.filename = file.name;

        this.setSaveNeeded(false);

        this.updateLastSaved(); // Needed because EDStoStructure whipes everything   

        return contents;
    }

    async saveAs(content: string) {
        const options = {
            suggestedName: window.global_structure.properties.filename,
            types: [{
                description: 'Eendraadschema (.eds)',
                accept: { 'application/eds': ['.eds'] },
            }],
            startIn: 'documents' // Suggests the Documents folder
        };

        this.fileHandle = await (window as any).showSaveFilePicker(options);
        await this.saveFile(content, this.fileHandle);


    };

    async saveFile(content: any, handle: any) {
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();

        this.filename = handle.name;
        window.global_structure.properties.filename = handle.name;

        this.setSaveNeeded(false);

        this.updateLastSaved();
    };

    async save(content: string) {
        await this.saveFile(content, this.fileHandle);
    };
}

export var fileAPIobj = new importExportUsingFileAPI();

/* FUNCTION importjson

   This is the callback function for the legacy filepicker if the file API is not available in the browser */

var importjson = function (event) {
    var input = event.target;
    var reader = new FileReader();
    var text: string = "";

    reader.onload = function () {
        EDStoStructure(reader.result.toString());
    };

    reader.readAsText(input.files[0]);
};

var appendjson = function (event) {
    var input = event.target;
    var reader = new FileReader();
    var text: string = "";

    reader.onload = function () {
        importToAppend(reader.result.toString());
    };

    reader.readAsText(input.files[0]);
};


/* FUNCTION loadClicked()

   Gets called when a user wants to open a file.  Checks if the fileAPI is available in the browser.
   If so, the fileAPI is used.  If not, the legacy function importjson is called */

async function loadClicked() {
    if ((window as any).showOpenFilePicker) { // Use fileAPI
        let data = await fileAPIobj.readFile();
        EDStoStructure(data);
    } else { // Legacy
        document.getElementById('importfile').click();
        (document.getElementById('importfile') as HTMLInputElement).value = "";
    }
}


/**
 * function importToAppendClicked() 
 * 
 * Vraagt om een EDS bestand op de machine te kiezen en voegt de inhoud toe aan het reeds geopende schema.
 * We gebruiken hier bewust niet de fileAPI aangezien die reeds gebruikt wordt voor het reeds geopende schema.
 */
async function importToAppendClicked() {
    document.getElementById('appendfile').click();
    (document.getElementById('appendfile') as HTMLInputElement).value = "";
}


/* FUNCTION upgrade_version

   Takes a structure, usually imported from json into javascript object, and performs a version upgrade if needed.
   as mystructure is passed by reference, all upgrades are done in-line.

*/

function upgrade_version(mystructure, version) {

    // At a certain moment (2023-01-11 to 2023-01-13) there was a bug in the systen so that files where accidentally outputed with props, without keys, but with version 1.
    // We correct for this below. If there are props and not keys but it still reads version 1, it should be interpreted as version 3.

    if ((version == 1) && (mystructure.length > 0) && (typeof (mystructure.data[0].keys) == 'undefined') && (typeof (mystructure.data[0].props) != 'undefined')) {
        version = 3
    }

    /* Indien versie 1 moeten we vrije tekst elementen die niet leeg zijn 30 pixels breder maken.
    * Merk ook op dat versie 1 nog een key based systeem had met keys[0][2] het type
    * en keys[16][2] die aangeeft of vrije tekst al dan niet een kader bevat (verbruiker) of niet (zonder kader)
    */
    if (version < 2) {
        for (let i = 0; i < mystructure.length; i++) {
            // Breedte van Vrije tekst velden zonder kader met 30 verhogen sinds 16/12/2023
            if ((mystructure.data[i].keys[0][2] === "Vrije tekst") && (mystructure.data[i].keys[16][2] != "verbruiker")) {
                if (Number(mystructure.data[i].keys[22][2]) > 0) mystructure.data[i].keys[22][2] = String(Number(mystructure.data[i].keys[22][2]) + 30);
                else mystructure.data[i].keys[18][2] = "automatisch";
                if (mystructure.data[i].keys[16][2] != "zonder kader") mystructure.data[i].keys[16][2] = "verbruiker";
            }
        }
    }

    // In versie 2 heetten Contactdozen altijd nog Stopcontacten

    if (version < 3) {
        for (let i = 0; i < mystructure.length; i++) {
            if (mystructure.data[i].keys[0][2] === "Stopcontact") mystructure.data[i].keys[0][2] = "Contactdoos";
            if (mystructure.data[i].keys[0][2] === "Leeg") mystructure.data[i].keys[0][2] = "Aansluitpunt";
        }
    }

    // In versie 3 heetten Contactdozen ook soms nog Stopcontacten, maar niet altijd
    if (version == 3) {
        for (let i = 0; i < mystructure.length; i++) {
            if (mystructure.data[i].props.type === "Stopcontact") mystructure.data[i].props.type = "Contactdoos";
        }
    }

    //Vanaf versie 4 staan niet automatisch meer haakjes <> rond de benaming van borden. Indien kleiner dan versie 4 moeten we deze toevoegen
    if (version < 4) {
        if (version < 3) {
            for (let i = 0; i < mystructure.length; i++) {
                if ((mystructure.data[i].keys[0][2] === "Bord") && (mystructure.data[i].keys[10][2] !== "")) mystructure.data[i].keys[10][2] = '<' + mystructure.data[i].keys[10][2] + '>';
            }
        } else {
            for (let i = 0; i < mystructure.length; i++) {
                if ((mystructure.data[i].props.type === "Bord") && (mystructure.data[i].props.naam !== "")) mystructure.data[i].props.naam = '<' + mystructure.data[i].props.naam + '>';
            }
        }
    }

    //Algemene upgrade voor versies 3 tot en met 4

    if ((version >= 3) && (version <= 4)) {
        for (let i = 0; i < mystructure.length; i++) {
            if (mystructure.data[i].props.type === "Leeg") mystructure.data[i].props.type = "Aansluitpunt";
        }
    }

}

/* FUNCTION json_to_structure

   Takes a string in pure json and puts the content in a hierarchical list that is returned.
   The function can take an old structure that is to be cleaned as input (optional)
    
   Will perform a version upgrade in case the json is from an earlier version of the eendraadschema tool but this vers Fion upgrade will not be performed
   if version is set to 0.  If version is not set to 0 it should be set to the verson of the json.
    
*/

function json_to_structure(text: string, version = 0): Hierarchical_List {


    /* Read all data from disk in a javascript structure mystructure.
        * Afterwards we will gradually copy elements from this one into the official outstruct
        */
    let mystructure = JSON.parse(text);

    // upgrade if needed
    if (version != 0) upgrade_version(mystructure, version);

    /* We starten met het kopieren van data naar de eigenlijke outstruct.
    * Ook hier houden we er rekening mee dat in oude saves mogelijk niet alle info voorhanden was */

    let outstruct = new Hierarchical_List();

    // Kopieren van hoofd-eigenschappen

    if (typeof mystructure.properties != 'undefined') {
        if (typeof mystructure.properties.filename != "undefined") outstruct.properties.filename = mystructure.properties.filename;
        if (typeof mystructure.properties.owner != "undefined") outstruct.properties.owner = mystructure.properties.owner;
        if (typeof mystructure.properties.control != "undefined") outstruct.properties.control = mystructure.properties.control;
        if (typeof mystructure.properties.installer != "undefined") outstruct.properties.installer = mystructure.properties.installer;
        if (typeof mystructure.properties.info != "undefined") outstruct.properties.info = mystructure.properties.info;
        if (typeof mystructure.properties.info != "undefined") outstruct.properties.dpi = mystructure.properties.dpi;
        if (typeof mystructure.properties.currentView != "undefined") outstruct.properties.currentView = mystructure.properties.currentView;
    }

    // Kopieren van de paginatie voor printen

    if (typeof mystructure.print_table != "undefined") {
        outstruct.print_table.setHeight(mystructure.print_table.height);
        outstruct.print_table.setMaxWidth(mystructure.print_table.maxwidth);
        outstruct.print_table.setPaperSize(mystructure.print_table.papersize);
        outstruct.print_table.setModeVertical(mystructure.print_table.modevertical);
        outstruct.print_table.setstarty(mystructure.print_table.starty);
        outstruct.print_table.setstopy(mystructure.print_table.stopy);
        if (typeof mystructure.print_table.enableAutopage != "undefined") {
            outstruct.print_table.enableAutopage = mystructure.print_table.enableAutopage;
        } else {
            outstruct.print_table.enableAutopage = false;
        }

        for (let i = 0; i < mystructure.print_table.pages.length; i++) {
            if (i != 0) outstruct.print_table.addPage();
            outstruct.print_table.pages[i].height = mystructure.print_table.pages[i].height;
            outstruct.print_table.pages[i].start = mystructure.print_table.pages[i].start;
            outstruct.print_table.pages[i].stop = mystructure.print_table.pages[i].stop;
        }
    }

    // Kopieren van de situatieplannen

    if (typeof mystructure.sitplanjson != "undefined") {
        outstruct.sitplan = new SituationPlan(undefined);
        outstruct.sitplan.fromJsonObject(mystructure.sitplanjson);
    }

    /* Kopieren van de eigenschappen van elk element.
    * Keys voor versies 1 en 2 en props voor versie 3
    */

    for (let i = 0; i < mystructure.length; i++) {
        if ((version != 0) && (version < 3)) {
            outstruct.addItem(mystructure.data[i].keys[0][2]);
            (outstruct.data[i] as Electro_Item).convertLegacyKeys(mystructure.data[i].keys);
        } else {
            outstruct.addItem(mystructure.data[i].props.type);
            (Object as any).assign(outstruct.data[i].props, mystructure.data[i].props);
        }
        outstruct.data[i].parent = mystructure.data[i].parent;
        outstruct.active[i] = mystructure.active[i];
        outstruct.id[i] = mystructure.id[i];
        outstruct.data[i].id = mystructure.data[i].id;
        outstruct.data[i].indent = mystructure.data[i].indent;
        outstruct.data[i].collapsed = mystructure.data[i].collapsed;
    }

    // As we re-read the structure and it might be shorter then it once was (due to deletions) but we might still have the old high ID's, always take over the curid from the file
    outstruct.curid = mystructure.curid;

    // Sort the entire new structure
    outstruct.reSort();

    // Return the result
    Object.assign(window.global_structure, outstruct);
    return window.global_structure // We copy the entire structure to the global variable so that it can be used in the rest of the program
}

export function loadFromText(text: string, version: number, redraw = true) {
    json_to_structure(text, version);
    if (redraw == true) topMenu.selectMenuItemByName('Eéndraadschema'); // Ga naar het bewerken scherm, dat zal automatisch voor hertekenen zorgen.
}

/**
 * Converteert een string in EDS formaat naar een json string.
 * De string kan eventueel eerst entropy gecodeerd en base64 encoded zijn.
 * De string kan ook een header hebben met een versie en een identificatie.
 * 
 * @param {string} mystring - De string die uit een bestand of een json string is geladen.
 * @returns {Object} - Een object met twee attributen: text en version. Text is de json string en version is de versie van de string.
 */
function EDStoJson(mystring: string) {

    let text: string = "";
    let version: number;

    /* If first 3 bytes read "EDS", it is an entropy coded file
        * The first 3 bytes are EDS, the next 3 bytes indicate the version
        * The next 4 bytes are decimal zeroes "0000"
        * thereafter is a base64 encoded data-structure 
        * 
        * If the first 3 bytes read "TXT", it is not entropy coded, nor base64
        * The next 7 bytes are the same as above.
        * 
        * If there is no identifier, it is treated as a version 1 TXT
        * */

    if ((mystring.charCodeAt(0) == 69) && (mystring.charCodeAt(1) == 68) && (mystring.charCodeAt(2) == 83)) { //recognize as EDS

        /* Determine versioning
        * < 16/12/2023: Version 1, original key based implementation
        *   16/12/2023: Version 2, Introductie van automatische breedte voor bepaalde SVG-tekst
        *                          Vrije tekst van Version 1 moet 30 pixels groter gemaakt worden om nog mooi in het schema te passen
        *   XX/01/2024: Version 3, Overgang van key based implementation naar props based implementation
        *                          functies convertLegacyKeys ingevoerd om oude files nog te lezen.
        */

        version = Number(mystring.substring(3, 6));
        if (isNaN(version)) version = 1; // Hele oude files bevatten geen versie, ze proberen ze te lezen als versie 1

        mystring = atob(mystring.substring(10, mystring.length))
        var buffer: Uint8Array = new Uint8Array(mystring.length);
        for (let i = 0; i < mystring.length; i++) {
            buffer[i - 0] = mystring.charCodeAt(i);
        }

        try { //See if the text decoder works, if not, we will do it manually (slower)
            let decoder = new TextDecoder("utf-8");
            text = decoder.decode(pako.inflate(buffer));
        } catch (error) { //Continue without the text decoder (old browsers)
            var inflated: Uint8Array = pako.inflate(buffer);
            text = "";
            for (let i = 0; i < inflated.length; i++) {
                text += String.fromCharCode(inflated[i])
            }
        }
    } else if ((mystring.charCodeAt(0) == 84) && (mystring.charCodeAt(1) == 88) && (mystring.charCodeAt(2) == 84)) { //recognize as TXT

        version = Number(mystring.substring(3, 6));
        if (isNaN(version)) version = 3;

        text = mystring.substring(10, mystring.length)

    } else { // Very old file without header

        text = mystring;
        version = 1;
    }

    //Return an object with the text and the version
    return { text: text, version: version };
}

/* FUNCTION EDStoStructure
   
   Starts from a string that can be loaded from disk or from a file and is in EDS-format.
   puts the content in the javascript structure called "structure".
   Will redraw everything if the redraw flag is set.

*/

export function EDStoStructure(mystring: string, redraw = true) {

    let JSONdata = EDStoJson(mystring);

    // Dump the json in into the structure and redraw if needed
    loadFromText(JSONdata.text, JSONdata.version, redraw);

    // Clear the undo stack and push this one on top
    undostruct.clear();
    undostruct.store();

    // Scroll to top left for the SVG and HTML, this can only be done at the end because "right col" has to actually be visible
    const leftelem = document.getElementById("left_col");
    if (leftelem != null) {
        leftelem.scrollTop = 0;
        leftelem.scrollLeft = 0;
    }

    const rightelem = document.getElementById("right_col");
    if (rightelem != null) {
        rightelem.scrollTop = 0;
        rightelem.scrollLeft = 0;
    }

}



function importToAppend(mystring: string, redraw = true) {
    let JSONdata = EDStoJson(mystring);
    let structureToAppend = json_to_structure(JSONdata.text, JSONdata.version);

    //get the Maximal ID in array structure.id and call it maxID
    let maxID = 0;
    for (let i = 0; i < window.global_structure.id.length; i++) {
        if (window.global_structure.id[i] > maxID) maxID = window.global_structure.id[i];
    }

    //then increase the ID's in structureToAppend accordingly
    for (let i = 0; i < structureToAppend.id.length; i++) {
        structureToAppend.id[i] += maxID;
        structureToAppend.data[i].id += maxID;
        if (structureToAppend.data[i].parent != 0) {
            structureToAppend.data[i].parent += maxID;
        }
    }
    window.global_structure.curid += structureToAppend.curid;

    //then merge information for the eendraadschema
    window.global_structure.length = window.global_structure.length + structureToAppend.length;
    window.global_structure.active = window.global_structure.active.concat(structureToAppend.active);
    window.global_structure.id = window.global_structure.id.concat(structureToAppend.id);
    window.global_structure.data = window.global_structure.data.concat(structureToAppend.data);

    //update the sourcelist
    window.global_structure.data.forEach((item) => {
        item.sourcelist = window.global_structure;
    });

    //then set the printer to autopage
    window.global_structure.print_table.enableAutopage = true;

    //then merge the situation plans but only if both exist
    if (window.global_structure.sitplan != null) {
        if (structureToAppend.sitplan != null) {

            // Eerst oude situationplanview leeg maken, anders blijven oude div's hangen
            if (window.global_structure.sitplanview != null) window.global_structure.sitplanview.dispose();

            // dan nieuw situationplan maken en bij openen van het schema zal automatisch een nieuw situationplanview gecreëerd wordne
            window.global_structure.sitplanjson = window.global_structure.sitplan.toJsonObject();
            structureToAppend.sitplanjson = structureToAppend.sitplan.toJsonObject();

            for (let i = 0; i < structureToAppend.sitplanjson.elements.length; i++) {
                if (structureToAppend.sitplanjson.elements[i].electroItemId != null)
                    structureToAppend.sitplanjson.elements[i].electroItemId += maxID;
                structureToAppend.sitplanjson.elements[i].page += window.global_structure.sitplanjson.numPages;
            }

            if ((window.global_structure.sitplanjson != null) && (structureToAppend.sitplanjson != null)) {
                window.global_structure.sitplanjson.numPages += structureToAppend.sitplanjson.numPages;
                window.global_structure.sitplanjson.elements = window.global_structure.sitplanjson.elements.concat(structureToAppend.sitplanjson.elements);
            }
            window.global_structure.sitplan.fromJsonObject(window.global_structure.sitplanjson);

            window.global_structure.sitplanjson = null;
        }
    }

    window.global_structure.reSort();
    undostruct.store();

    //then remove the pointer from structureToAppend and let the garbage collector do its work
    structureToAppend = null;

    //redraw if needed
    if (redraw) topMenu.selectMenuItemByName('Eéndraadschema');
}

export async function structure_to_json() {

    window.global_structure.sitplan = new SituationPlan(window.global_structure.sitplan);
    // Remove some unneeded data members that would only inflate the size of the output file
    for (let listitem of window.global_structure.data) {
        listitem.sourcelist = null;
    }
    let swap: MarkerList = window.global_structure.print_table.pagemarkers;
    let swap2: SituationPlan = window.global_structure.sitplan;
    let swap3: SituationPlanView = window.global_structure.sitplanview;

    window.global_structure.print_table.pagemarkers = null;
    if (window.global_structure.sitplan != null) window.global_structure.sitplanjson = await window.global_structure.sitplan.toJsonObject();
    window.global_structure.sitplan = null;
    window.global_structure.sitplanview = null;

    // Create the output structure in uncompressed form
    var text: string = JSON.stringify(window.global_structure);

    // Put the removed data members back
    for (let listitem of window.global_structure.data) {
        listitem.sourcelist = window.global_structure;
    }
    window.global_structure.print_table.pagemarkers = swap;
    window.global_structure.sitplan = swap2;
    window.global_structure.sitplanview = swap3;

    // Remove sitplanjson again
    window.global_structure.sitplanjson = null;

    return (text);

}



/** FUNCTION download_by_blob
 *
 *  Downloads an EDS file to the user's PC
 *
 */

export function download_by_blob(text, filename, mimeType): void {

    var element = document.createElement('a');
    if ((navigator as unknown as INavigator).msSaveBlob) {
        if ('msSaveBlob' in navigator) {
            (navigator as any).msSaveBlob(new Blob([text], { type: mimeType }), filename);
        }
    } else if (URL && 'download' in element) {
        let uriContent = URL.createObjectURL(new Blob([text], { type: mimeType }));
        element.setAttribute('href', uriContent);
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        setTimeout(() => document.body.removeChild(element), 1000); // 1-second delay
    } else {
        this.location.go(`${mimeType},${encodeURIComponent(text)}`);
    }

}

/* FUNCTION showFilePage
   
   Shows the File-Page.  It will look different depending on whether the browser supports the file API or not

*/

export function showFilePage() {

    var strleft: string = '<span id="exportscreen"></span>'; //We need the id to check elsewhere that the screen is open

    strleft += `
    <table border="1px" style="border-collapse:collapse" align="center" width="100%">
      <tr>
        <td width="100%" align="center" bgcolor="LightGrey">
          <b>Openen</b>
        </td>
      </tr>
      <tr>
        <td width="100%" align="left">
            <table border=0>
              <tr>
                <td width=350 style="vertical-align:top;padding:5px">
                  <button style="font-size:14px" onclick="loadClicked()">Openen</button>
                </td>
                <td style="vertical-align:top;padding:7px">
                  Click op "openen" en selecteer een eerder opgeslagen EDS bestand.
                </td>
              </tr>
            </table>
        </td>
      </tr>
    </table><br>
    <table border="1px" style="border-collapse:collapse" align="center" width="100%">
      <tr>
        <td width="100%" align="center" bgcolor="LightGrey">
          <b>Opslaan</b>
        </td>
      </tr>
      <tr>
        <td width="100%" align="left">
    `;

    if ((window as any).showOpenFilePicker) { // Use fileAPI

        strleft += '<table border=0><tr><td width=350 style="vertical-align:top;padding:5px">';
        if (fileAPIobj.filename != null) {
            strleft += '<button style="font-size:14px" onclick="exportjson(saveAs = false)">Opslaan</button>&nbsp;';
            strleft += '<button style="font-size:14px" onclick="exportjson(saveAs = true)">Opslaan als</button>';
            strleft += '</td><td style="vertical-align:top;padding:5px">'
            strleft += 'Laatst geopend of opgeslagen om <b>' + fileAPIobj.lastsaved + '</b> met naam <b>' + fileAPIobj.filename + '</b><br><br>'
                + 'Klik links op "Opslaan" om bij te werken'
        } else {
            strleft += '<button style="font-size:14px" onclick="exportjson(saveAs = true)">Opslaan als</button>';
            strleft += '</td><td style="vertical-align:top;padding:7px">'
            strleft += '<span class="highlight-warning">Uw werk werd nog niet opgeslagen. Klik links op "Opslaan als".</span>';
        }
        strleft += '</td></tr>';
        strleft += PROP_GDPR(); //Function returns empty for GIT version, returns GDPR notice when used online.
        strleft += '</table>';

    } else { // Legacy
        strleft += '<table border=0><tr><td width=350 style="vertical-align:top;padding:7px">';
        strleft += 'Bestandsnaam: <span id="settings"><code>' + window.global_structure.properties.filename + '</code><br><button style="font-size:14px" onclick="exportjson()">Opslaan</button>&nbsp;<button style="font-size:14px" onclick="HL_enterSettings()">Naam wijzigen</button></span>';
        strleft += '</td><td style="vertical-align:top;padding:5px">'
        strleft += 'U kan het schema opslaan op uw lokale harde schijf voor later gebruik. De standaard-naam is eendraadschema.eds. U kan deze wijzigen door links op "wijzigen" te klikken. ';
        strleft += 'Klik vervolgens op "opslaan" en volg de instructies van uw browser. '
        strleft += 'In de meeste gevallen zal uw browser het bestand automatisch plaatsen in de Downloads-folder tenzij u uw browser instelde dat die eerst een locatie moet vragen.<br><br>'
        strleft += 'Eens opgeslagen kan het schema later opnieuw geladen worden door in het menu "openen" te kiezen en vervolgens het bestand op uw harde schijf te selecteren.'
        strleft += '</td></tr>';

        strleft += PROP_GDPR(); //Function returns empty for GIT version, returns GDPR notice when used online.

        strleft += '</table>';
    }

    strleft += `
        </td>
      </tr>
    </table><br>    
    `;

    strleft += `
    <table border="1px" style="border-collapse:collapse" align="center" width="100%">
      <tr>
        <td width="100%" align="center" bgcolor="LightGrey">
          <b>Samenvoegen</b>
        </td>
      </tr>
      <tr>
        <td width="100%" align="left">
            <table border=0>
              <tr>
                <td width=350 style="vertical-align:top;padding:5px">
                  <button style="font-size:14px" onclick="importToAppendClicked()">Samenvoegen (Expert!)</button>
                </td>
                <td style="vertical-align:top;padding:7px">
                  Open een tweede EDS bestand en voeg de inhoud toe aan het huidige EDS bestand.<br>
                  Voegt de ééndraadschema's samen en voegt eveneens pagina's toe aan het situatieschema als dat nodig is.<br><br>
                  <span style="color:red;font-weight:bold">Opgelet!</span> Het is aanbevolen uw werk op te slaan alvorens deze functie te gebruiken!
                </td>
              </tr>
            </table>
        </td>
      </tr>
    </table>`

    document.getElementById("configsection").innerHTML = strleft;
    toggleAppView('config');
}


var VERSION = "git"; //can be "git" or "online"

export var PROP_Contact_Text = `<html>
  <head>
    <title>Eendraadschema online</title>
    <link rel="stylesheet" href="css/about.css">
  </head>
  <body>
    <h2>Een &eacute;&eacute;ndraadschema tekenen.</h2>
    <p class="ondertitel">Een cr&eacute;atie van <a target="_blank" href="https://ivan.goethals-jacobs.be">Ivan Goethals</a></p>
    <p>Dit is een standalone versie (development) waarbij enkele functionaliteiten zijn uitgeschakeld.</p>
    <p>Gebruik de online versie op <a href="https://eendraadschema.goethals-jacobs.be">https://eendraadschema.goethals-jacobs.be</a> om toegang te krijgen tot het contactformulier.</p>
    <p>Kies <b>Bewerken</b> in het menu om verder te gaan met tekenen.</p>
  </body>
</html>`

export function PROP_GDPR() {
    return ("");
}

function PROP_getCookieText() {
    return ("");
}

export function PROP_edit_menu(menuItems) { }

//--- START OF DEVELOPMENT OPTIONS ---

function PROP_development_options() {
    let outstr: string = '<br><h2>Expert ontwikkel opties, Gebruik enkel indien u weet wat u doet.</h2>'
        + '<textarea id="HL_loadfromtext" style="width: 80%; height: 8em;"></textarea><br>'
        + '<button onclick="loadFileFromText()">Load from input</button>';
    return outstr;
}

function loadFileFromText() {
    let str: string = (document.getElementById('HL_loadfromtext') as HTMLInputElement).value;
    EDStoStructure(str);
    fileAPIobj.clear();
}

/// --- END OF DEVELOPMENT OPTIONS ---

async function exportjson(saveAs: boolean = true) { //if the boolean is false and the file API is installed, a normal save is performed (known filename)
    var filename: string;

    /* We use the Pako library to entropy code the data
     * Final data reads "EDSXXX0000" with XXX a version and thereafter a 64base encoding of the deflated output from Pako
     * filename = "eendraadschema.eds";
     */
    filename = window.global_structure.properties.filename;

    var text: string = await structure_to_json();

    // Compress the output structure and offer as download to the user. We are at version 004
    try {
        let decoder = new TextDecoder("utf-8");
        let encoder = new TextEncoder();
        let pako_inflated = new Uint8Array(encoder.encode(text));
        let pako_deflated = new Uint8Array(pako.deflate(pako_inflated));
        text = "EDS0040000" + btoa(String.fromCharCode.apply(null, pako_deflated));
    } catch (error) {
        text = "TXT0040000" + text;
    } finally {
        if ((window as any).showOpenFilePicker) { // Use fileAPI     
            if (saveAs) this.fileAPIobj.saveAs(text); else this.fileAPIobj.save(text);
        } else { // legacy
            download_by_blob(text, filename, 'data:text/eds;charset=utf-8');
        }
    }
}

export function displayButtonPrintToPdf() {
    return ("");
    //Does nothing in the serverless version, only used on https://eendraadschema.goethals-jacobs.be
}

function handleButtonPrintToPdf() {
    return (0);
    //Does nothing in the serverless version, only used on https://eendraadschema.goethals-jacobs.be
}

class jsonStore {
    private maxSteps: number;
    private undoStack: string[];
    private redoStack: string[];

    constructor(maxSteps: number = 100) {
        this.maxSteps = maxSteps;
        this.undoStack = [];
        this.redoStack = [];
    }

    store(text: string): void {
        if (this.undoStack.length >= this.maxSteps) {
            this.undoStack.shift(); // Remove the oldest entry to maintain maxSteps
        }
        this.undoStack.push(text);
        this.redoStack = []; // Clear the redo stack whenever a new store is made
    }

    replace(text: string): void {
        if (this.undoStack.length > 0) {
            this.undoStack[this.undoStack.length - 1] = text;
        } else {
            this.store(text);
        }
    }

    //Always call store before undo otherwise there is nothing to put on the redo stack !!
    undo(): string | null {
        if (this.undoStack.length <= 1) {
            return null;
        }
        const lastState = this.undoStack.pop()!;
        this.redoStack.push(lastState);
        return this.undoStack.length > 0 ? this.undoStack[this.undoStack.length - 1] : null;
    }

    redo(): string | null {
        if (this.redoStack.length === 0) {
            return null;
        }
        var lastRedoState = this.redoStack.pop()!;
        this.undoStack.push(lastRedoState);
        return lastRedoState;
    }

    clear(): void {
        this.undoStack = [];
        this.redoStack = [];
    }

    undoStackSize(): number { return (Math.max(this.undoStack.length - 1, 0)); }
    redoStackSize(): number { return (Math.max(this.redoStack.length, 0)); }
}

class LargeStringStore {
    private data: string[] = [];

    push(text: string): number {
        this.data.push(text);
        return (this.data.length - 1);
    }

    pushIfNotExists(text: string): number {
        let index = this.data.indexOf(text);
        if (index == -1) {
            this.data.push(text);
            return (this.data.length - 1);
        } else {
            return index;
        }
    }

    get(index: number): string {
        return this.data[index];
    }

    clear() {
        this.data = [];
    }
}

export class undoRedo {
    private historyEds: jsonStore;
    private historyOptions: jsonStore;
    private largeStrings: LargeStringStore = new LargeStringStore();

    private samenVoegSleutel: string = null; // Indien de store functie wordt opgeroepen met deze string wordt geen nieuwe undo stap gecreëerd maar de vorige aangepast

    constructor(maxSteps: number = 100) {
        this.historyEds = new jsonStore(maxSteps);
        this.historyOptions = new jsonStore(maxSteps);
    }

    replaceSVGsByStringStore() {
        if (window.global_structure.sitplan != null) {
            for (let element of window.global_structure.sitplan.elements) {
                if (!element.isEendraadschemaSymbool()) element.svg = this.largeStrings.pushIfNotExists(element.getUnscaledSVGifNotElectroItem()).toString();
            }
        }
    }

    replaceStringStoreBySVGs() {
        if (window.global_structure.sitplan != null) {
            for (let element of window.global_structure.sitplan.elements) {
                if (!element.isEendraadschemaSymbool()) element.svg = this.largeStrings.get(parseInt(element.svg));
            }
        }
    }

    getOptions(): string {
        let options: any = {};

        if (window.global_structure.sitplanview != null) {
            options.selectedBoxOrdinal = window.global_structure.sitplanview.getSelectedBoxOrdinal();
            if ((window.global_structure.sitplanview.sideBar as any).getUndoRedoOptions != null) {
                Object.assign(options, (window.global_structure.sitplanview.sideBar as any).getUndoRedoOptions());
            }
        }

        return (JSON.stringify(options));
    }

    async store(sleutel: string = null) {
        let overschrijfVorige = false;

        if ((sleutel != null) && (sleutel == this.samenVoegSleutel)) overschrijfVorige = true;
        this.samenVoegSleutel = sleutel;

        // We store the current state of the structure in the history but we replace the SVGs by a reference to a large string store
        this.replaceSVGsByStringStore();

        if (!overschrijfVorige) {
            this.historyEds.store(await structure_to_json());
            this.historyOptions.store(this.getOptions());
        } else {
            this.historyEds.replace(await structure_to_json());
            this.historyOptions.replace(this.getOptions());
        }

        this.replaceStringStoreBySVGs();

        if ((window.global_structure.properties.currentView == 'draw') && (window.global_structure.sitplanview != null)) window.global_structure.sitplanview.updateRibbon();
        else if (window.global_structure.properties.currentView == '2col') window.global_structure.updateRibbon();
    }

    reload(text: string, options: any) {
        this.samenVoegSleutel = null;

        let lastView = window.global_structure.properties.currentView;
        let lastmode = window.global_structure.mode;
        if (text != null) loadFromText(text, 0, false);

        // We replace the references to the large string store by the actual SVGs
        this.replaceStringStoreBySVGs();
        // We need to resort and clean the structure to avoid bad references
        window.global_structure.reSort();

        window.global_structure.mode = lastmode;
        if (window.global_structure.properties.currentView != lastView) toggleAppView(window.global_structure.properties.currentView as '2col' | 'config' | 'draw');
        switch (window.global_structure.properties.currentView) {
            case 'draw':
                topMenu.selectMenuItemByOrdinal(3);
                showSituationPlanPage();

                if ((window.global_structure.sitplanview.sideBar as any).setUndoRedoOptions != null) (window.global_structure.sitplanview.sideBar as any).setUndoRedoOptions(options);

                let htmlId = window.global_structure.sitplan.getElements()[options.selectedBoxOrdinal].id;
                if (htmlId == null) break;
                let div = document.getElementById(htmlId);
                if (div != null) window.global_structure.sitplanview.selectBox(div);

                break;
            case '2col': topMenu.selectMenuItemByOrdinal(2); HLRedrawTree(); break;
            case 'config': topMenu.selectMenuItemByOrdinal(4); printsvg(); break;
        }
    }

    undo() {
        let text: string = this.historyEds.undo();
        let optionsString: string | null = this.historyOptions.undo();
        let options: any = optionsString ? JSON.parse(optionsString) : {};
        this.reload(text, options);
    }

    redo() {
        let text: string = this.historyEds.redo();
        let optionsString: string | null = this.historyOptions.redo();
        let options: any = optionsString ? JSON.parse(optionsString) : {};
        this.reload(text, options);
    }

    clear() {
        this.samenVoegSleutel = null;

        this.historyEds.clear();
        this.historyOptions.clear();
        this.largeStrings.clear();
        window.global_structure.updateRibbon();
    }

    undoStackSize(): number { return (this.historyEds.undoStackSize()); }
    redoStackSize(): number { return (this.historyEds.redoStackSize()); }

}

// Hierarchical_List is the main structure of the application. It contains all the elements and their properties.
export var undostruct: undoRedo = new undoRedo(100);
EDStoStructure(EXAMPLE_DEFAULT, false); //Just in case the user doesn't select a scheme and goes to drawing immediately, there should be something there



function printPDF(svg, print_table, properties, pages = [1], filename = "eendraadschema_print.pdf", statuscallback, sitplanprint) { // Defaults to A4 and 300 DPI but 600 DPI is better
    var paperdetails: any = {};
    if (print_table.papersize == "A3") {
        paperdetails = { // All sizes in millimeters
            paperwidth: 420,
            paperheight: 297,

            paper_margin: 10,
            svg_padding: 5, //minimal size to keep below svg before the text boxes start

            drawnby_box_height: 5,

            owner_box_height: 30,
            owner_box_width: 80
        };
    } else {
        paperdetails = { // All sizes in millimeters
            paperwidth: 297,
            paperheight: 210,

            paper_margin: 10,
            svg_padding: 5, //minimal size to keep below svg before the text boxes start

            drawnby_box_height: 5,

            owner_box_height: 30,
            owner_box_width: 80
        };
    }

    // ___ FUNCTION svgToPng ___
    //
    // Converts SVG with dimensions sizex and sizey to a PNG for use in the PDF document.
    // Ensures the desired DPI is respected.  Then calls function given by callback.

    function svgToPng(svg, sizex, sizey, callback) {

        let max_height_in_mm = paperdetails.paperheight - 2 * paperdetails.paper_margin - paperdetails.owner_box_height - paperdetails.drawnby_box_height - paperdetails.svg_padding;
        let max_width_in_mm = paperdetails.paperwidth - 2 * paperdetails.paper_margin;

        let max_height_in_pixels = max_height_in_mm / 25.4 * (properties.dpi || 300); // if dpi undefined, use 300
        let max_width_in_pixels = max_width_in_mm / 25.4 * (properties.dpi || 300); // if dpi undefined, use 300

        let scale = Math.min(max_height_in_pixels / sizey, max_width_in_pixels / sizex);

        let scaledsvg = '<svg width="' + (sizex * scale) + '" height="' + (sizey * scale)
            + '" viewBox="0 0 ' + sizex + ' ' + sizey + '" xmlns="http://www.w3.org/2000/svg">'
            + svg + '</svg>';

        const svgBlob = new Blob([scaledsvg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const png = canvas.toDataURL('image/png');
            callback(png, scale);
            URL.revokeObjectURL(url);
            canvas.remove(); // remove the canvas element when we are done with it
        };
        img.src = url;
    }

    function htmlToPDFlines(doc, html) {
        var lines: any;

        function htmlToUnicode(html) {
            // Create a temporary element to hold the HTML
            const tempElement = document.createElement('div');
            tempElement.innerHTML = html;

            // Use the textContent property to get the Unicode string
            const unicodeString = tempElement.textContent || tempElement.innerText || '';
            return unicodeString;
        }

        let printlines = [];

        html = html.replace(/<div>/g, ''); //remove all instances of <div>
        lines = html.split(/<br>|<\/div>/);
        lines = lines.map(htmlToUnicode);
        for (let line of lines) {
            let wrappedlines = doc.splitTextToSize(line, paperdetails.owner_box_width - 2 * 2 - 3);
            printlines = printlines.concat(wrappedlines);
        }

        return printlines;
    }

    function init() {
        var doc;

        if (print_table.papersize == "A3") {
            doc = new jsPDF('landscape', 'mm', 'a3', true);
        } else {
            doc = new jsPDF('landscape', 'mm', 'a4', true);
        }

        return (doc);
    }

    // ___ FUNCTION generatePDF ___
    //
    // Makes the actual PDF

    function addPage(doc, svg, sizex, sizey, callback, iter = 0) {

        svgToPng(svg, sizex, sizey, function (png, scale) {

            let canvasx = (paperdetails.paperwidth - 2 * paperdetails.paper_margin);
            let canvasy = (paperdetails.paperheight - 2 * paperdetails.paper_margin - paperdetails.owner_box_height - paperdetails.drawnby_box_height - paperdetails.svg_padding);

            if (sizex * sizey > 0) {
                if (sizex / sizey > canvasx / canvasy) { //width is leading
                    let max_height_in_mm = paperdetails.paperheight - 2 * paperdetails.paper_margin - paperdetails.owner_box_height - paperdetails.drawnby_box_height - paperdetails.svg_padding;
                    let shiftdown = (max_height_in_mm - sizey / sizex * canvasx) / 2;
                    doc.addImage(png, 'PNG', paperdetails.paper_margin, paperdetails.paper_margin + shiftdown, canvasx, sizey / sizex * canvasx, undefined, 'FAST');
                } else { //height is leading
                    doc.addImage(png, 'PNG', paperdetails.paper_margin, paperdetails.paper_margin, sizex / sizey * canvasy, canvasy, undefined, 'FAST');
                }
            }

            // Set the properties to remove margins
            doc.setProperties({
                title: 'Eendraadschema.pdf',
                subject: 'Eendraadschema',
                author: 'eendraadschema.goethals-jacobs.be',
                keywords: 'eendraadschema, online',
                creator: 'eendraadschema.goethals-jacobs.be'
            });

            let startx = paperdetails.paperwidth - (297 - paperdetails.paper_margin); //In "A4" we fill everything, in A3 we squeeze to the right

            doc.rect(startx, // Drawn by box below
                paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height,
                3 * paperdetails.owner_box_width,
                paperdetails.drawnby_box_height);
            doc.rect(startx, // first large box from left to right
                paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height,
                paperdetails.owner_box_width,
                paperdetails.owner_box_height);
            doc.rect(startx + paperdetails.owner_box_width, // second large box from left to right
                paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height,
                paperdetails.owner_box_width,
                paperdetails.owner_box_height);
            doc.rect(startx + 2 * paperdetails.owner_box_width, // third large box from left to right
                paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height,
                paperdetails.owner_box_width,
                paperdetails.owner_box_height);
            doc.rect(startx + 3 * paperdetails.owner_box_width, // Last box at the right
                paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height,
                paperdetails.paperwidth - paperdetails.paper_margin - startx - 3 * paperdetails.owner_box_width,
                paperdetails.drawnby_box_height + paperdetails.owner_box_height);

            const fontSize = 8; // Set your font size
            const textHeight = fontSize * 0.352778; // 1 point = 0.352778 mm

            doc.setFont("helvetica", "bold");
            doc.setFontSize(fontSize);

            doc.text("Getekend met https://eendraadschema.goethals-jacobs.be",
                startx + 2, // Leave 2mm at the left of the drawn by text
                paperdetails.paperheight - paperdetails.paper_margin - (paperdetails.drawnby_box_height - textHeight) / 2 - textHeight / 6);

            let page = 0;
            if (iter < print_table.pages.length)
                page = pages[iter];
            else
                page = pages[print_table.pages.length - 1] + (iter - print_table.pages.length + 1);

            let maxpages = print_table.pages.length + sitplanprint.numpages;

            doc.text('pagina. ' + page + '/' + maxpages,
                startx + 3 * paperdetails.owner_box_width + 2, //Leave 2mm at the left 
                paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight + 1.5); //Leave 1.55mm at the top

            let pagename = (iter < print_table.pages.length ? 'Eendraadschema' : 'Situatieschema');

            doc.text(pagename,
                startx + 3 * paperdetails.owner_box_width + 2,
                paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight * (1 + 1.2) + 1.5);

            doc.text(htmlToPDFlines(doc, "Erkend Organisme"),
                startx + 2,
                paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight + 1.5);

            doc.text(htmlToPDFlines(doc, "Plaats van de elektrische installatie"),
                startx + paperdetails.owner_box_width + 2,
                paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight + 1.5);

            doc.text(htmlToPDFlines(doc, "Installateur"),
                startx + (2 * paperdetails.owner_box_width) + 2,
                paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight + 1.5);

            doc.setFont("helvetica", "normal");

            doc.text(htmlToPDFlines(doc, properties.control).slice(0, 8),
                startx + 2 + 3,
                paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight * (1 + 1.2) + 1.5);

            doc.text(htmlToPDFlines(doc, properties.owner).slice(0, 8),
                startx + paperdetails.owner_box_width + 2 + 3,
                paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight * (1 + 1.2) + 1.5);

            doc.text(htmlToPDFlines(doc, properties.installer).slice(0, 8),
                startx + (2 * paperdetails.owner_box_width) + 2 + 3,
                paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight * (1 + 1.2) + 1.5);

            let infoshorter = properties.info.replace('https://www.eendraadschema.goethals-jacobs.be', 'eendraadschema');
            doc.text(htmlToPDFlines(doc, infoshorter).slice(0, 8),
                startx + (3 * paperdetails.owner_box_width) + 2 + 3,
                paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight * (1 + 3 * 1.2) + 1.5);

            callback(doc, iter + 1);
        });
    }

    function cropSVG(svg, page) {

        let startx = print_table.pages[page].start;
        let width = print_table.pages[page].stop;
        let starty = print_table.starty;
        let height = print_table.stopy - starty;

        let viewbox = '' + startx + ' ' + starty + ' ' + width + ' ' + height;

        let outsvg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="scale(1,1)" style="border:1px solid white" ' +
            'height="' + (height) + '" width="' + (width) + '" viewBox="' + viewbox + '">' +
            svg + '</svg>';

        return (outsvg);
    }

    function nextpage(doc, iter = 0) {

        if (iter < pages.length) {
            statuscallback.innerHTML = 'Pagina ' + pages[iter] + ' wordt gegenereerd. Even geduld..';
            if (iter > 0) doc.addPage();
            let sizex = print_table.pages[pages[iter] - 1].stop - print_table.pages[pages[iter] - 1].start;
            let sizey = print_table.stopy - print_table.starty;
            addPage(doc, cropSVG(svg, pages[iter] - 1), sizex, sizey, nextpage, iter); //add one more page and callback here
        } else if (iter < pages.length + sitplanprint.numpages) {
            statuscallback.innerHTML = 'Pagina ' + (pages[pages.length - 1] + (iter - pages.length) + 1) + ' wordt gegenereerd. Even geduld..';
            if (iter > 0) doc.addPage();
            var toprint = sitplanprint.pages[iter - pages.length];
            addPage(doc, toprint.svg, toprint.sizex, toprint.sizey, nextpage, iter);
        } else {
            save(doc); //we are done
        }
    }

    function save(doc) {
        doc.save(filename);
        statuscallback.innerHTML = 'PDF is klaar. Kijk in uw Downloads folder indien deze niet spontaan wordt geopend.';
    }

    statuscallback.innerHTML = 'PDF wordt gegenereerd. Even geduld..';

    var doc = init();
    nextpage(doc, 0)


}


function HLDisplayPage() {
    window.global_structure.print_table.displaypage = parseInt((document.getElementById("id_select_page") as HTMLInputElement).value) - 1;
    printsvg();
}

function dosvgdownload() {
    var prtContent = document.getElementById("printsvgarea").innerHTML;
    var filename = (document.getElementById("dosvgname") as HTMLInputElement).value;
    download_by_blob(prtContent, filename, 'data:image/svg+xml;charset=utf-8'); //Was text/plain
}

function getPrintSVGWithoutAddress(outSVG: SVGelement, page: number = window.global_structure.print_table.displaypage) {
    var scale = 1;

    var startx = window.global_structure.print_table.pages[page].start;
    var width = window.global_structure.print_table.pages[page].stop - startx;
    var starty = window.global_structure.print_table.getstarty();
    var height = window.global_structure.print_table.getstopy() - starty;

    var viewbox = '' + startx + ' ' + starty + ' ' + width + ' ' + height;

    var outstr = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="scale(1,1)" style="border:1px solid white" ' +
        'height="' + (height * scale) + '" width="' + (width * scale) + '" viewBox="' + viewbox + '">' +
        flattenSVGfromString(outSVG.data) + '</svg>';

    return (outstr);
}

export function printsvg() {

    function generatePdf() {
        if (typeof (window.global_structure.properties.dpi) == 'undefined') window.global_structure.properties.dpi = 300;

        let svg = flattenSVGfromString(window.global_structure.toSVG(0, "horizontal").data);
        const pages = Array.from({ length: window.global_structure.print_table.pages.length }, (_, i) => i + 1);

        const sitplanprint = window.global_structure.sitplan.toSitPlanPrint(false);

        printPDF(
            svg,
            window.global_structure.print_table,
            window.global_structure.properties,
            pages,
            (document.getElementById("dopdfname") as HTMLInputElement).value, //filename
            document.getElementById("progress_pdf"), //HTML element where callback status can be given
            sitplanprint
        );
    }

    function renderPrintSVG(outSVG: SVGelement) {
        document.getElementById("printarea").innerHTML = '<div id="printsvgarea">' +
            getPrintSVGWithoutAddress(outSVG) +
            '</div>';
    }

    // First we generate an SVG image. We do this first because we need the size
    // We will display it at the end of this function    

    var outSVG = new SVGelement();
    outSVG = window.global_structure.toSVG(0, "horizontal");

    var height = outSVG.yup + outSVG.ydown;
    var width = outSVG.xleft + outSVG.xright;

    window.global_structure.print_table.setHeight(height);
    window.global_structure.print_table.setMaxWidth(width + 10);

    // Then we display all the print options

    let outstr: string = "";
    var strleft: string = "";


    document.getElementById("configsection").innerHTML
        = '<div>'
        + '    <button id="button_pdfdownload">Genereer PDF</button>' // Generate PDF button comes here
        + '    <span id="select_papersize"></span>' // Selector to choose "A3" and "A4" comes here
        + '    <span id="select_dpi"></span>' // Selector for dpi 300 or 600 comes here
        + '    <input id="dopdfname" size="20" value="eendraadschema_print.pdf">&nbsp;' // Input box for filename of pdf document
        + '    <span id="progress_pdf"></span>' // Area where status of pdf generation can be displayed
        + '</div>';

    document.getElementById('button_pdfdownload').onclick = generatePdf;
    window.global_structure.print_table.insertHTMLselectPaperSize(document.getElementById('select_papersize') as HTMLElement, printsvg);
    window.global_structure.print_table.insertHTMLselectdpi(document.getElementById('select_dpi') as HTMLElement, printsvg);

    outstr
        = '<br>'
        + '<div>'
        + '    <span style="margin-right: 2em" id="check_autopage"></span>' // Checkbox to choose if we want to auto paginate or not comes here
        + '    <span style="margin-right: 2em" id="id_verticals"></span>' // An optional area to choose what part of the y-space of the image is shown
        + '    <span id="id_suggest_xpos_button"></span>' // A button to force auto pagination comes here
        + '</div>';

    document.getElementById("configsection").insertAdjacentHTML('beforeend', outstr);

    window.global_structure.print_table.insertHTMLcheckAutopage(document.getElementById('check_autopage') as HTMLElement, printsvg);
    if (!window.global_structure.print_table.enableAutopage) {
        window.global_structure.print_table.insertHTMLchooseVerticals(document.getElementById('id_verticals') as HTMLElement, printsvg);
        window.global_structure.print_table.insertHTMLsuggestXposButton(document.getElementById('id_suggest_xpos_button') as HTMLElement, printsvg);
    }

    if (!window.global_structure.print_table.enableAutopage) {
        outstr
            = '<br>'
            + '<table border="0">'
            + '    <tr>'
            + '        <td style="vertical-align:top;">'
            + '            <div id="id_print_table"></div>' // Table with all startx and stopx comes here
            + '        </td>'
            + '        <td style="vertical-align:top;padding:5px">'
            + '            <div>Klik op de groene pijl om het schema over meerdere pagina\'s te printen en kies voor elke pagina de start- en stop-positie in het schema (in pixels).</div>'
            + '            <div>Onderaan kan je bekijken welk deel van het schema op welke pagina belandt.</div>'
            + '        </td>'
            + '    </tr>'
            + '</table>'
            + '<br>';

        document.getElementById("configsection").insertAdjacentHTML('beforeend', outstr);

        window.global_structure.print_table.insertHTMLposxTable(document.getElementById('id_print_table') as HTMLElement, printsvg)
    }

    strleft += '<hr>';

    strleft += '<b>Printvoorbeeld: </b>Pagina <select onchange="HLDisplayPage()" id="id_select_page">'
    for (let i = 0; i < window.global_structure.print_table.pages.length; i++) {
        if (i == window.global_structure.print_table.displaypage) {
            strleft += '<option value=' + (i + 1) + ' selected>' + (i + 1) + '</option>';
        } else {
            strleft += '<option value=' + (i + 1) + '>' + (i + 1) + '</option>';
        }
    }
    strleft += '</select>&nbsp;&nbsp;(Enkel tekening, kies "Genereer PDF" om ook de tekstuele gegevens te zien)';

    strleft += '<br><br>';

    strleft += '<table border="0"><tr><td style="vertical-align:top"><button onclick="dosvgdownload()">Zichtbare pagina als SVG opslaan</button></td><td>&nbsp;</td><td style="vertical-align:top"><input id="dosvgname" size="20" value="eendraadschema_print.svg"></td><td>&nbsp;&nbsp;</td><td>Sla tekening hieronder op als SVG en converteer met een ander programma naar PDF (bvb Inkscape).</td></tr></table><br>';

    strleft += displayButtonPrintToPdf(); // This is only for the online version

    strleft += '<div id="printarea"></div>';

    document.getElementById("configsection").insertAdjacentHTML('beforeend', strleft);

    // Finally we show the actual SVG

    renderPrintSVG(outSVG);

    toggleAppView('config');
}

// Extend the Window interface to include HLAdd
declare global {
    interface Window {
        global_structure: Hierarchical_List;
        HLAdd: typeof HLAdd;
        HLDelete: typeof HLDelete;
        HLExpand: typeof HLExpand;
        load_example: typeof load_example;
        HLRedrawTree: typeof HLRedrawTree;
        HLInsertBefore: typeof HLInsertBefore;
        HLInsertAfter: typeof HLInsertAfter;
        HLMoveDown: typeof HLMoveDown;
        HLMoveUp: typeof HLMoveUp;
        HLClone: typeof HLClone;
        HLInsertChild: typeof HLInsertChild;
        HL_editmode: typeof HL_editmode;
        HL_changeparent: typeof HL_changeparent;
        HL_changeFilename: typeof HL_changeFilename;
        HL_cancelFilename: typeof HL_cancelFilename;
        HL_enterSettings: typeof HL_enterSettings;
        HLCollapseExpand: typeof HLCollapseExpand;
        undoClicked: typeof undoClicked;
        redoClicked: typeof redoClicked;
        download: typeof download;
        read_settings: typeof read_settings;
        loadClicked: typeof loadClicked;
    }
}

window.HLAdd = HLAdd;
window.HLDelete = HLDelete;
window.HLExpand = HLExpand;
window.load_example = load_example;
window.HLRedrawTree = HLRedrawTree;
window.HLInsertBefore = HLInsertBefore;
window.HLInsertAfter = HLInsertAfter;
window.HLMoveDown = HLMoveDown;
window.HLMoveUp = HLMoveUp;
window.HLClone = HLClone;
window.HLInsertChild = HLInsertChild;
window.HL_editmode = HL_editmode;
window.HL_changeparent = HL_changeparent;
window.HL_changeFilename = HL_changeFilename;
window.HL_cancelFilename = HL_cancelFilename;
window.HL_enterSettings = HL_enterSettings;
window.HLCollapseExpand = HLCollapseExpand;
window.undoClicked = undoClicked;
window.redoClicked = redoClicked;
window.download = download;
window.read_settings = read_settings;
window.loadClicked = loadClicked;
