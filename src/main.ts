import { TopMenu } from "./TopMenu";
import type { MenuItem } from "./TopMenu";
import { Electro_Item } from "./List_Item/Electro_Item";
import { Hierarchical_List } from "./Hierarchical_List";
import { showFilePage } from "./importExport/importExport";
import { EDStoStructure } from "./importExport/importExport";
import { AutoSaver } from "./importExport/AutoSaver";
import { showSituationPlanPage } from "./sitplan/SituationPlanView";
import { printsvg } from "./print/print";
import { PROP_edit_menu } from "../prop/prop_scripts";
import { PROP_getCookieText } from "../prop/prop_scripts";
import { CookieBanner } from "../prop/CookieBanner";
import { flattenSVGfromString } from "./general";
import { isInt } from "./general";
import { Bord } from "./List_Item/Bord";
import { Kring } from "./List_Item/Kring";
import { PROP_Contact_Text, PROP_development_options } from "../prop/prop_scripts";
import { browser_ie_detected } from "./general";
import { showDocumentationPage } from "./documentation/documentation";
import { HelperTip } from "./documentation/HelperTip";
import { Session } from "./Session";
import { MultiLevelStorage } from "./storage/MultiLevelStorage";   
import { undoRedo } from "./undoRedo";
import { importExportUsingFileAPI } from "./importExport/importExport";

import "../css/all.css";

declare const BUILD_DATE: string;
console.log(BUILD_DATE);

// Global mutable variables

globalThis.session = new Session();
globalThis.appDocStorage = new MultiLevelStorage<any>('appDocStorage', {});
globalThis.undostruct = new undoRedo(100);
globalThis.fileAPIobj = new importExportUsingFileAPI();

// Global constants

globalThis.SITPLANVIEW_SELECT_PADDING = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--selectPadding').trim());
globalThis.SITPLANVIEW_ZOOMINTERVAL = {MIN: 0.1, MAX: 1000};
globalThis.SITPLANVIEW_DEFAULT_SCALE = 0.7;

globalThis.CONFIGPAGE_LEFT = `
    <table border="1px" style="border-collapse:collapse;" align="center" width="100%"><tr><td style="padding-top: 0; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;">
        <p><font size="+2">
          <b>Welkom op ééndraadschema</b>
        </font></p>
      <p><font size="+1">  
           Deze gratis tool laat toe zowel ééndraadschema's als situatieschema's te tekenen, inclusief complexere schema's
           met bijvoorbeeld domotica. De schema's kunnen als PDF bestand worden geëxporteerd en geprint.
           Voor de experts kunnen schema's eveneens worden omgezet in SVG vectorformaat om in andere programma's verder te bewerken.
      </font></p>
      <p><font size="+1">  
           Kies één van onderstaande voorbeelden om van te starten of start van een leeg schema (optie 3).
      </font></p>
      <font size="+1">
        <i>
          <b>Tip: </b>Om de mogelijkheden van het programma te leren kennen is het vaak beter eerst een voorbeeldschema te
          bekijken alvorens van een leeg schema te vertrekken.
        </i>
      </font>
    </td></tr></table>
    <div id="autoSaveRecover"></div>
    <br>
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
          <b>Openen</b>
        </td>
      </tr>
      <tr>
        <td width="25%" align="center">
          <br>
          <img src="examples/example000.svg" height="300px"><br><br>
          Eenvoudig schema, enkel contactdozen en lichtpunten.
          <br><br>
        </td>
        <td width="25%" align="center">
          <br>
          <img src="examples/example001.svg" height="300px"><br><br>
          Iets complexer schema met teleruptoren, verbruikers achter contactdozen en gesplitste kringen.
          <br><br>
        </td>
        <td width="25%" align="center">
          <br>
          <img src="examples/gear.svg" height="100px"><br><br>
`

globalThis.CONFIGPAGE_RIGHT = `
          <br><br>
        </td>
        <td width="25%" align="center">
          <br>
          <img src="examples/import_icon.svg" height="100px"><br><br>
          Open een schema dat u eerder heeft opgeslagen op uw computer (EDS-bestand). Enkel bestanden aangemaakt na 12 juli 2019 worden herkend.
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
          <button onclick="loadClicked()">Verdergaan met deze optie</button>
          <br><br>
        </td>
      </tr>
    </table>
  `;

globalThis.CONFIGPRINTPAGE  = `<div></div><br>`;

globalThis.EXAMPLE0 = `EDS0040000eJztWe9r6zYU/VeMv84rjp2kaxhjbQdv422f3qMblIdRrBtHtSwF2Un6g+5v35HsxM5emiVpB68QKCWRda+uzjmSjuInX5LKqqk/6l0EPmcV80e3T77gaAj8GTOkKn8UBr5QfPUx1VKyWUnoM2GyJPQzelb6oydfGX/k/yImEz/wq4cZ4dslU6Wci0qoDI2MqYrJZKYxLB5GaBpTmU7JFLbDyOcIJjuqIJI2oJiRYZnN1A+brEnOxiQTxZKKpCQ7ZnTfG+LpRnTCSVYs6WSIQ5uCcUOo1l9l2xwSFeNBOjcLSti80gVjVd15M7kok5Ikpfg2WQORa1O52S4wIZ25OcYIVYwVnRHr+hdam3YG/nPgl3puUpKixIhqLuVzUFMRtVT0Wip6/01FS8OVNhzfUHVGjOHzqDJz6la2hmVHIVYkq0qitpLokEo+mjeXAlr+urny4g9RMNhHBTaY8rLhtWZD6pQhAE1lxRR3GB0okDoRIBYqGc9FuYbiFcpZ5wRcS3oU2TqiYc6ttl3aCTviuWg5i1+nns0i9pTPeUc94UvyqXX5avXU1FQCbZvaibZq5/qa7a+froA+0jxHCV/L6DflLSGkl0S0TUPXW0VUA/K2GtpY/Je7OBt+C5y5zf0FznqHc3ZDRop02pxJ75e4q13ExZ3Vdn7Quu+11F1rUJZWXOty2+mBhtwmBhxCtuXVRDeZOsdtI4AJK8nCxAWppCAyaLDBGzvvlGhSoVNGYz1fckogCpaTxON12Rh+yuRkySoy3BLafdJJ3DTWKYHRlrFXcSoBBxxMjfV6m9sBcj86FuToBPLeIPeOBTk+gbw3yOGxIPdPIO8LcnxxLMiDE8h7KzluQe53bin9QxzvjRF35NWGoTUOf9pZ5TrHjS3wF7ZL4h4lTdSjtsB7OeOux1Qb8WjZkpTgdJfiTtVGJ0VBhuo+DoCO86FkjEe8+vdVpG0dhjXvC9oAF66k7LqKfRx51Ntu7/rfjL07wpJfMZ6zwqH7fr3d9U7aOrYj6vwkMDiZuzfcSKL+0Sif3N3+KF8cjXLH3v1ua0+FSbHSWpjaCZcd6W/g4PP5GCsRu5bIOlB/mgnK3M9O9ZQxQ8VQvN1HJHaeO9oDwjoUaORS5Dg0vg7EKZBvYaUp311SZ3NVuV2jt/OXuc49fXjsbe+tQXw/6J0fi150GHrRVvRI5e8YvDg6Frw3Wb/vFLwv6A2nsEDaW7fl/2//MJKl6bYXREHvIoDNOw+GQXwewBzjao2LH64lMM3YfOErcOhhR8Z2gjURR18sZULB4LKxJEscKfvpEv5o5rxXfVxNSWQWwMEQYijY/VJw+1Kp/0PfmqRyJtlD3d3dMjPL0e3TZhROLlO/YCqR28VakGzvghmwUNbIIb/mBHIqkboTkklJ9mh1CR7WGR6avDMGm1iKR/cyqm+5sCK04eSUOBHwq7CLVkr3IFpSGIZnxG1KvVTu5cyN1sb6Mu8SxJL7+OPY/PSpMvCIXmg/Iyj0UCpB/GQbPpMced/FkYf21Z9t//Dpj1X75gP6vmACMYtmsDO2HuxnrgsS6mxM1kIozLR5ayQ4Fda0wmMYbcGwiVyfibbbjXfvRXF44/09CL1fH+3k4W/dJWlQ42hnzbHknv8BXkCfFg==`;
globalThis.EXAMPLE1 = `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`;
globalThis.EXAMPLE_DEFAULT = `EDS0040000eJytVN9v00AM/leieyWM/GgniBCivICE4GVoL9MUuTk3PfVyF91dunbT+NuxkzZZAQ0VqKLq4rM/f/7s+EFoNHVYi2IWCwkBRHHzIJQURRqLFhyaIIokFsrI47GyWkPrkXxWoD2Sn7OtF8WDME4UQsQi7Fuk0wKM150KytRkBDABdNlayiiKLBZL9NUaXcPXhZBqtULOpxA1uzctOqgJ53I+IJYbWKIuDZQBtUbOle3SS/I9iS0l6gDlFJ8nxBqkQz+xK0/T9faqc1ssoQu2AQiD7RRZ+dKjxoreVmP1G+tCX+aWarE1F8eRBqB5km/gvrXWTezFYyy87VyFWnlKaDqtH+NB/mySP53kT8+R/4N1kt6IdI0AdC6C6/Aps1GUZ4jkE5FsIpKdQ+Sz+68T8LvO/NpzisCNP7RxUF/bCsidTF9fLc4chAGBtFSmXHbKj0X//YSMkKTLHd6regw4duiZtsymtuRTW/J/m4+f0v9hQG7pngrdEtZNP1mnf3TNRG/SOIvzeHbLRJQJZYClRqaDhk8LkrntezZM5xpVveZRv3wTiwZ2d0ryekpfp6y1bzXsB/eEFaiZHm2skygfwA27yhN2H8tk2bsBt0HnhwoI30qkpgRVAfce6MP04gCwHxH2B9wWaLy8uu9324w1YWk5HHt9V4oGGxq+RjTSAUie7wYuUDKsvTP9d39NW4A1jhbVOmB/fLt0764CRYQo4XNCv4joEk5ANnxDXUQv8iwi+/Fh+8erL0f76QW+bEBRzPaQ7ALGZO+lbVCZiyVy+w1Ve1hISmLD829NcJYFYaDeZ2V520a7KMuT6+j7PIk+3bMA9Klwk+eDlFy4VEE8/gDGURmI`;


globalThis.forceUndoStore = () => {
    globalThis.undostruct.store();
}

globalThis.HLCollapseExpand = (my_id: number, state?: Boolean) => {
    let ordinal: number|null;
    ordinal = globalThis.structure.getOrdinalById(my_id);
    if (ordinal == null) return;
    if (state == undefined) {
       globalThis.structure.data[ordinal].collapsed = !globalThis.structure.data[ordinal].collapsed;
    } else {
       globalThis.structure.data[ordinal].collapsed = state;
    }
    globalThis.undostruct.store();
    globalThis.structure.updateHTMLinner(my_id);
    globalThis.HLRedrawTreeSVG();
}

globalThis.HLDelete = (my_id: number) => {
    globalThis.structure.deleteById(my_id);
    globalThis.undostruct.store();
    globalThis.HLRedrawTree();
}

globalThis.HLAdd = () => {
    globalThis.structure.addItem("");
    globalThis.undostruct.store();
    globalThis.HLRedrawTree();
}

globalThis.HLInsertBefore = (my_id: number) => {
    globalThis.structure.insertItemBeforeId(new Electro_Item(globalThis.structure), my_id);
    globalThis.undostruct.store();
    globalThis.HLRedrawTree();
}

globalThis.HLInsertAfter = (my_id: number) => {
    globalThis.structure.insertItemAfterId(new Electro_Item(globalThis.structure), my_id);
    globalThis.undostruct.store();
    globalThis.HLRedrawTree();
}

globalThis.HLMoveDown = (my_id: number) => {
    globalThis.structure.moveDown(my_id);
    globalThis.undostruct.store();
    globalThis.HLRedrawTree();
}

globalThis.HLMoveUp = (my_id: number) => {
    globalThis.structure.moveUp(my_id);
    globalThis.undostruct.store();
    globalThis.HLRedrawTree();
}

globalThis.HLClone = (my_id: number) => {
    globalThis.structure.clone(my_id);
    globalThis.undostruct.store();
    globalThis.HLRedrawTree();
}

globalThis.HLInsertChild = (my_id: number) => {
    globalThis.structure.insertChildAfterId(new Electro_Item(globalThis.structure), my_id);
    //globalThis.undostruct.store();  We should not call this as the CollapseExpand already does that
    globalThis.HLCollapseExpand(my_id, false);
    //No need to call HLRedrawTree as HLCollapseExpand already does that
}

globalThis.HL_editmode = () => {
    globalThis.structure.mode = (document.getElementById("edit_mode") as HTMLInputElement).value;
    globalThis.HLRedrawTreeHTML();
}

globalThis.HLExpand = (my_id: number ) => {
    let element: Electro_Item = globalThis.structure.getElectroItemById(my_id) as Electro_Item;
    if (element !== null) {
        element.expand();
    }
    
    globalThis.structure.reSort();
    globalThis.undostruct.store();
    globalThis.HLRedrawTree();
}

globalThis.HL_changeparent = (my_id: number) => {
    // See what the new parentid is
    let str_newparentid = (document.getElementById("id_parent_change_"+my_id) as HTMLInputElement).value;

    //-- Check that it is valid. It needs to be a number and the parent an active component --
    let error = 0;
    let parentOrdinal: number|null = 0;
    if (!isInt(str_newparentid)) { error=1; }
    let int_newparentid = parseInt(str_newparentid);
    if (int_newparentid != 0) {
        parentOrdinal = globalThis.structure.getOrdinalById(int_newparentid);
        if (parentOrdinal == null)
          error=1;
          else if ( (!globalThis.structure.active[parentOrdinal]) || (int_newparentid == my_id) ) error=1;
    }

    if (error == 1) alert("Dat is geen geldig moeder-object. Probeer opnieuw.");
    else {
        const idx = globalThis.structure.getOrdinalById(my_id);
        if (idx !== null) globalThis.structure.data[idx].parent = int_newparentid;
    }

    globalThis.structure.reSort();
    globalThis.undostruct.store();
    globalThis.HLRedrawTree();
}

globalThis.HL_cancelFilename = () => {
    const settings = document.getElementById("settings");
    if (settings === null) return;
    settings.innerHTML = '<code>' + globalThis.structure.properties.filename + '</code><br><button style="font-size:14px" onclick="exportjson()">Opslaan</button>&nbsp;<button style="font-size:14px" onclick="HL_enterSettings()">Naam wijzigen</button>';
}

globalThis.HL_changeFilename = () => {
    var regex:RegExp = new RegExp('^.*\\.eds$');
    var filename = (document.getElementById("filename") as HTMLInputElement).value;
    const settings = document.getElementById("settings");
    if (settings === null) return;
    if (regex.test(filename)) {
        globalThis.structure.properties.setFilename((document.getElementById("filename") as HTMLInputElement).value);
        settings.innerHTML = '<code>' + globalThis.structure.properties.filename + '</code><br><button style="font-size:14px" onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button style="font-size:14px" onclick="exportjson()">Opslaan</button>';
    } else {
        globalThis.structure.properties.setFilename((document.getElementById("filename") as HTMLInputElement).value+'.eds');
        settings.innerHTML = '<code>' + globalThis.structure.properties.filename + '</code><br><button style="font-size:14px" onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button style="font-size:14px" onclick="exportjson()">Opslaan</button>';
    }
}

globalThis.HL_enterSettings = () => {
    const settings = document.getElementById("settings");
    if (settings == null) return;
    settings.innerHTML = '<input type="text" id="filename" onchange="HL_changeFilename()" value="' + globalThis.structure.properties.filename + '" pattern="^.*\\.eds$"><br><i>Gebruik enkel alphanumerieke karakters a-z A-Z 0-9, streepjes en spaties. <b>Eindig met ".eds"</b>. Druk daarna op enter.</i><br><button onclick="HL_cancelFilename()">Annuleer</button>&nbsp;<button onclick="HL_changeFilename()">Toepassen</button>';
}

globalThis.HLRedrawTreeHTML = () => {
    globalThis.toggleAppView('2col');
    const settings = document.getElementById("settings");
    if (settings != null) settings.innerHTML = "";
    var output:string = globalThis.structure.toHTML(0) + "<br>" + renderAddressStacked();
    const left_col_inner = document.getElementById("left_col_inner");
    if (left_col_inner != null) left_col_inner.innerHTML = output;
}

globalThis.HLRedrawTreeHTMLLight = () => {
    var output:string = globalThis.structure.toHTML(0) + "<br>" + renderAddressStacked();
    const left_col_inner = document.getElementById("left_col_inner");
    if (left_col_inner != null) left_col_inner.innerHTML = output;
}

globalThis.HLRedrawTreeSVG = () => {
    let str:string = '<b>Tekening: </b>Ga naar het print-menu om de tekening af te printen of te exporteren als SVG vector graphics.<br><br>'
                   + '<div id="EDS">' + flattenSVGfromString(globalThis.structure.toSVG(0,"horizontal").data,10) + '</div>'
                   + '<h2>Legende:</h2>'
                   + '<button style="background-color:green;">&#9650;</button> Item hierboven invoegen (zelfde niveau)<br>'
                   + '<button style="background-color:green;">&#9660;</button> Item hieronder invoegen (zelfde niveau)<br>'
                   + '<button style="background-color:green;">&#9654;</button> Afhankelijk item hieronder toevoegen (niveau dieper)<br>'
                   + '<button style="background-color:red;">&#9851;</button> Item verwijderen<br>'
                   + '<i><br><small>Versie: ' + BUILD_DATE
                   + ' (C) Ivan Goethals -- <a href="license.html" target="popup" onclick="window.open(\'license.html\',\'popup\',\'width=800,height=600\'); return false;">Terms</a></small></i><br><br>';

    const right_col_inner = document.getElementById("right_col_inner");
    if (right_col_inner != null) right_col_inner.innerHTML = str;
}

globalThis.HLRedrawTree = () => {
    globalThis.HLRedrawTreeHTML();
    globalThis.HLRedrawTreeSVG();
}

function buildNewStructure(structure: Hierarchical_List) {

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
    if (globalThis.structure != null) globalThis.structure.dispose();
    globalThis.structure = new Hierarchical_List();
    buildNewStructure(globalThis.structure);
    globalThis.topMenu.selectMenuItemByName('Eéndraadschema');
    globalThis.undostruct.clear();
    globalThis.undostruct.store();
}

function renderAddressStacked() {
    var outHTML: string = "";

    if (!globalThis.structure.properties.control) globalThis.structure.properties.control = "<br>";

    outHTML = 'Plaats van de elektrische installatie' +
              '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
              '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_owner" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + globalThis.structure.properties.owner + '</td></tr>' +
              '</table><br>' +
              'Installateur' +
              '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
              '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_installer" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + globalThis.structure.properties.installer + '</td></tr>' +
              '</table><br>' +
              'Erkend organisme (keuring)' +
              '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
              '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_control" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + globalThis.structure.properties.control + '</td></tr>' +
              '</table><br>' +
              'Info' +
              '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
              '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_info" onblur="javascript:forceUndoStore()" onkeyup="javascript:changeAddressParams()">' + globalThis.structure.properties.info + '</td></tr>' +
              '</table>';

    return outHTML;
}

globalThis.changeAddressParams = () => {
    globalThis.structure.properties.owner = (document.getElementById("conf_owner") as HTMLElement).innerHTML;
    globalThis.structure.properties.installer = (document.getElementById("conf_installer") as HTMLElement).innerHTML;
    globalThis.structure.properties.control = (document.getElementById("conf_control") as HTMLElement).innerHTML;
    globalThis.structure.properties.info = (document.getElementById("conf_info") as HTMLElement).innerHTML;
}

function openContactForm() {
    var strleft: string = PROP_Contact_Text;
    strleft = strleft.replace(/Bewerken/g, "Eéndraadschema");
    const configsection = document.getElementById("configsection");
    if (configsection != null) configsection.innerHTML = strleft;
    globalThis.toggleAppView('config');
}

function restart_all() {
    var strleft: string = globalThis.CONFIGPAGE_LEFT;

    strleft +=
    `
      Hoofddifferentieel (in mA) <input id="differentieel_droog" type="text" size="5" maxlength="5" value="300"><br><br>
      Hoofdzekering (in A) <input id="hoofdzekering" type="text" size="4" maxlength="4" value="65"><br><br>
      Aantal fazen:
      <select id="aantal_fazen_droog"><option value="2">2p</option><option value="3">3p</option><option value="4">4p (3p+n)</option></select>`;

    strleft += globalThis.CONFIGPAGE_RIGHT;

    strleft += PROP_getCookieText(); //Will only be displayed in the online version
    strleft += PROP_development_options();

    const configsection = document.getElementById("configsection");
    if (configsection != null) configsection.innerHTML = strleft;
    globalThis.toggleAppView('config');

    if (browser_ie_detected()) {
       alert("Deze appicatie werkt niet in Internet Explorer. Wij raden aan een moderne browser te gebruiken zoals Edge, Firefox, Google Chrome, Opera, Vivaldi, ...");
    }
}

globalThis.toggleAppView = (type: '2col' | 'config' | 'draw') => {
    let lastview = globalThis.structure.properties.currentView;
    if ((globalThis.structure.sitplanview != null) && (globalThis.structure.sitplanview.contextMenu != null)) globalThis.structure.sitplanview.contextMenu.hide();
    
    globalThis.structure.properties.currentView = type;

    const configsection = document.getElementById("configsection");
    const outerdiv = document.getElementById("outerdiv");
    const ribbon = document.getElementById("ribbon");
    const canvas_2col = document.getElementById("canvas_2col");
    const left_col_inner = document.getElementById("left_col_inner");
    const EDSSVG = document.getElementById("EDSSVG");

    if (type === '2col') {  
        if (configsection == null) return;
        if (outerdiv == null) return;
        if (ribbon == null) return;
        if (canvas_2col == null) return;

        configsection.innerHTML = '';
        configsection.style.display = 'none';

        outerdiv.style.display = 'none';

        ribbon.style.display = 'flex';
        canvas_2col.style.display = 'flex';
        globalThis.structure.updateRibbon();
    } else if (type === 'config') {
        if (configsection == null) return;
        if (outerdiv == null) return;
        if (ribbon == null) return;
        if (left_col_inner == null) return;
        if (canvas_2col == null) return;

        configsection.style.display = 'block';
        
        outerdiv.style.display = 'none';

        ribbon.innerHTML = ''; // Voor performance redenen
        ribbon.style.display = 'none';

        left_col_inner.innerHTML = ''; // Voor performance redenen

        // We zetten bewist het SVG element EDS niet op nul want is nodig voor het print-voorbeeld

        canvas_2col.style.display = 'none';
    } else if (type === 'draw') {
        if (configsection == null) return;
        if (outerdiv == null) return;
        if (ribbon == null) return;
        if (left_col_inner == null) return;
        if (canvas_2col == null) return;
        
        configsection.innerHTML = "";
        configsection.style.display = 'none';

        outerdiv.style.display = 'flex';
        ribbon.style.display = 'flex';

        left_col_inner.innerHTML = ''; // Voor performance redenen

        if (EDSSVG !== null) EDSSVG.innerHTML = ''; // Deze is nodig anders wil het situatieschema het patroon VerticalStripe niet laden wegens dubbel gedefinieerd
                                                             // We maken de EDSSVG leeg en niet de EDS-DIV want anders onthoudt de browser de positie van de scrollbars niet

        canvas_2col.style.display = 'none';
    }

    if ( (['2col','draw'].includes(type)) && (['2col','draw'].includes(lastview)) && (type !== lastview) )
        globalThis.undostruct.store();

}

globalThis.load_example = (nr: number) => {
    switch (nr) {
        case 0:
            EDStoStructure(globalThis.EXAMPLE0);
            globalThis.fileAPIobj.clear();
            break;
        case 1:
            EDStoStructure(globalThis.EXAMPLE1);
            globalThis.fileAPIobj.clear();
            break;
    }
}

globalThis.undoClicked = () => {
    if ((globalThis.structure.sitplanview != null) && (globalThis.structure.sitplanview.contextMenu != null)) globalThis.structure.sitplanview.contextMenu.hide();
    globalThis.undostruct.undo();    
}

globalThis.redoClicked = () => {
    if ((globalThis.structure.sitplanview != null) && (globalThis.structure.sitplanview.contextMenu != null)) globalThis.structure.sitplanview.contextMenu.hide();
    globalThis.undostruct.redo();    
}

globalThis.read_settings = () => {
  CONF_aantal_fazen_droog = parseInt((document.getElementById("aantal_fazen_droog") as HTMLInputElement).value);
  CONF_aantal_fazen_nat = CONF_aantal_fazen_droog;
  CONF_hoofdzekering = parseInt((document.getElementById("hoofdzekering") as HTMLInputElement).value);
  CONF_differentieel_droog = parseInt((document.getElementById("differentieel_droog") as HTMLInputElement).value);
  globalThis.fileAPIobj.clear();
  reset_all();
}

//--- MAIN PROGRAM ---

// Define content of index.html container

const container = document.getElementById('container');

if (container == null) throw new Error("HTML element container is null");

container.innerHTML = `
<div id="topmenu"><ul id="minitabs"></ul></div>
<div id="app">
<svg id="svgdefs"></svg> <!-- Bevat SVG patronen die app-wide gebruikt worden -->
<div id="configsection" class="configsection">
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:larger;font-weight:bold; text-align: center;">
    De App wordt geladen.<br><br>Even geduld..
    </div>
</div> <!-- Full page configuratie --> 
<div id="ribbon" style="display:none;">
    <div id="left-icons" class="left-icons"></div>
    <div id="right-icons" class="right-icons"></div>
</div> <!-- Ribbon -->
<div id="canvas_2col" style="display:none;"> <!-- Eendraadschema-->
    <div id="left_col">
    <div id="left_col_inner"></div>
    </div>
    <div id="right_col">
    <div id="right_col_inner"></div>
    </div>
</div>
<div id="outerdiv" style="display:none;"> <!-- Situatieschets -->
    <div id="sidebar"></div>
    <div id="canvas">
    <div id="paper"></div>
    </div>
</div>
</div>`

// Configure the app-zone in the HTML

const svgdefs = document.getElementById('svgdefs');
if (svgdefs == null) throw new Error("HTML element svgdefs is null");

svgdefs.innerHTML = 
    '<pattern id="VerticalStripe" x="5" y="0" width="5" height="10" patternUnits="userSpaceOnUse" >' +
    '<line x1="0" y1="0" x2="0" y2="10" stroke="black" />' +
    '</pattern>';

// Add file input elements

if (!document.getElementById('importfile')) {
  document.body.innerHTML += `
    <input id="importfile" type="file" accept=".eds" onchange="importjson(event)" style="display:none;">
    <input id="appendfile" type="file" accept=".eds" onchange="appendjson(event)" style="display:none;">
    <input type="file" id="fileInput" accept="image/*" style="display:none;">
  `;
}

// Some general variables that are only used in main.ts

//declare var CONF_builddate: any; //needed to be able to read the variable from the builddate.js file (otherwise compiler will complain)

var CONF_aantal_fazen_droog = 2;
var CONF_aantal_fazen_nat = 2;
var CONF_hoofdzekering = 65;
var CONF_differentieel_droog = 300;
var CONF_differentieel_nat = 30;

// Build the menu

let menuItems: MenuItem[]

menuItems = [
    { name: 'Nieuw', callback: restart_all },
    { name: 'Bestand', callback: showFilePage },
    { name: 'Eéndraadschema', callback: globalThis.HLRedrawTree },
    { name: 'Situatieschema', callback: showSituationPlanPage },
    { name: 'Print', callback: printsvg },
    { name: 'Documentatie', callback: showDocumentationPage },
    { name: 'Info/Contact', callback: openContactForm }
];

PROP_edit_menu(menuItems);

globalThis.topMenu = new TopMenu('minitabs', 'menu-item', menuItems);

// Now add handlers for everything that changes in the left column
const left_col_inner = document.querySelector('#left_col_inner');
if (left_col_inner == null) throw new Error("HTML element left_col_inner is null");
left_col_inner.addEventListener('change', function(event) {

    function propUpdate(my_id: number, item: string, type: string, value: string | boolean): void {
        let ordinal: number|null;
        ordinal = globalThis.structure.getOrdinalById(my_id);
        if (ordinal == null) return;
        switch (type) {
            case "select-one":
                if (item == "type") { // Type changed
                    globalThis.structure.adjustTypeById(my_id, value as string);
                } else {
                    globalThis.structure.data[ordinal].props[item] = (value as string);
                }
                globalThis.structure.updateHTMLinner(my_id);
                break;
            case "text":
                globalThis.structure.data[ordinal].props[item] = (value as string);
                if (item==='kortsluitvermogen') globalThis.structure.updateHTMLinner(my_id);
                break;
            case "checkbox":
                globalThis.structure.data[ordinal].props[item] = (value as boolean);
                globalThis.structure.updateHTMLinner(my_id);
                break;
        }
        globalThis.undostruct.store();
        globalThis.HLRedrawTreeSVG();
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
    if (idNumber == null || key == null) return;
    propUpdate(parseInt(idNumber),key,type,value);

    // Perform your logic here with the extracted data
});

EDStoStructure(globalThis.EXAMPLE_DEFAULT,false); //Just in case the user doesn't select a scheme and goes to drawing immediately, there should be something there

// Create the autoSaver
// - the constructor takes a function that points it to the latest globalThis.structure whenever it asks for it
// - We also add a callback function that is called after each save performed by the autoSaver.  This function will update the Save icon in the ribbon when needed

globalThis.autoSaver = new AutoSaver(5, () => {return(globalThis.structure);}); // Als globale variabele moet dit een var zijn en geen let
globalThis.autoSaver.setCallbackAfterSave((() => { // Update ribbons after each save (automatic or manual) by the autoSaver, but only if the lastSavedType changed
    let lastSavedType = globalThis.autoSaver.getSavedType();
    function updateRibbons(){
        const currentSavedType = globalThis.autoSaver.getSavedType();
        if (lastSavedType === currentSavedType) return; // Only update the ribbons if the type changed
        lastSavedType = currentSavedType;
        globalThis.structure.updateRibbon(); 
        if (globalThis.structure.sitplanview) globalThis.structure.sitplanview.updateRibbon(); 
    }
    return updateRibbons;
})());

// Finally check if there is anything in the autosave and load it

let recoveryAvailable = false
let lastSavedStr:string|null = null;
let lastSavedInfo:any = null;

(async () => {   
    [lastSavedStr, lastSavedInfo] = await globalThis.autoSaver.loadLastSaved();
    if ((lastSavedStr != null) /* && (lastSavedInfo.recovery == true) */ ) recoveryAvailable = true;
})().then(() => {
    if (!recoveryAvailable) {
        EDStoStructure(globalThis.EXAMPLE_DEFAULT,false);
        restart_all();
        let myCookieBanner = new CookieBanner();
        myCookieBanner.run();
    } else {
        const helperTip = new HelperTip(globalThis.appDocStorage);
        helperTip.show( 'file.autoRecovered',
                        `<h3>Laatste schema geladen uit browsercache</h3>` +
                        `<p>Deze tool vond een schema in de browsercache. `+
                            `Dit schema dateert van <b>${lastSavedInfo.currentTimeStamp}</b> ` +
                            `met als naam <b>${lastSavedInfo.filename}</b>. ` +
                            `U kan op dit gerecupereerde schema verder werken of een ander schema laden in het "Bestand"-menu.</p>` +
                        `<p><b>Opgelet! </b>De browsercache is een tijdelijke opslag, en wordt occasioneel gewist. ` +
                            `Het blijft belangrijk uw werk regelmatig op te slaan om gegevensverlies te voorkomen.</p>`
                        ,false,(() => {
                            let myCookieBanner = new CookieBanner();
                            myCookieBanner.run();
                        }).bind(this));
        if (lastSavedStr == null) return;
        EDStoStructure(lastSavedStr, true, true);  
    } 
    globalThis.autoSaver.start();    
});




