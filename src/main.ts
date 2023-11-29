interface Navigator{
  msSaveBlob:(blob: Blob,fileName:string) => boolean
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
  structure.moveDown(my_id);
  HLRedrawTree();
}

function HLMoveUp(my_id: number) {
  structure.moveUp(my_id);
  HLRedrawTree();
}

function HLClone(my_id: number) {
  structure.clone(my_id);
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
      if ( (!structure.active[parentOrdinal]) || (int_newparentid == my_id) ) {error=1; }
    }
  }

  if (error == 1) {
    alert("Dat is geen geldig moeder-object. Probeer opnieuw.")
  } else {
    structure.data[structure.getOrdinalById(my_id)].parent = int_newparentid;
    structure.data[structure.getOrdinalById(my_id)].Parent_Item = structure.data[parentOrdinal];
  }

  structure.reSort();

  HLRedrawTree();
}

function HL_cancelFilename() {
  document.getElementById("settings").innerHTML = '<code>' + structure.properties.filename + '</code>&nbsp;<button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button>';
}

function HL_changeFilename() {
  var regex:RegExp = new RegExp('^[-_ A-Za-z0-9]{2,}\\.eds$');
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
  document.getElementById("settings").innerHTML = '<input type="text" id="filename" onchange="HL_changeFilename()" value="' + structure.properties.filename + '" pattern="^[-_ A-Za-z0-9]{2,}\\\.eds$">&nbsp;<i>Gebruik enkel alphanumerieke karakters a-z A-Z 0-9, streepjes en spaties. <b>Eindig met ".eds"</b>. Druk daarna op enter.</i><br><button onclick="HL_cancelFilename()">Annuleer</button>&nbsp;<button onclick="HL_changeFilename()">Toepassen</button>';
}

function HLRedrawTreeHTML() {
  show2col();
  document.getElementById("configsection").innerHTML = "";
  var output:string = structure.toHTML(0) + "<br>" + renderAddressStacked();
  document.getElementById("left_col_inner").innerHTML = output;
}

function HLRedrawTreeSVG() {
  document.getElementById("right_col_inner").innerHTML = '<b>Tekening: </b>Ga naar het print-menu om de tekening af te printen of te exporteren als SVG vector graphics.<br><br>';
  /*document.getElementById("right_col_inner").innerHTML = '<b>Tekening: </b><button onclick=download("html")>Download als html</button>';
  document.getElementById("right_col_inner").innerHTML += '&nbsp;<button onclick=download("svg")>Download als svg</button>';
  document.getElementById("right_col_inner").innerHTML += '&nbsp;<input type="checkbox" id="noGroup" checked></input><small>SVG elementen niet groeperen (aanbevolen voor meeste tekenprogramma\'s)</small>';
  document.getElementById("right_col_inner").innerHTML += '<br><small><i>Noot: De knoppen hierboven laden enkel de tekening. Wenst u het schema ook later te bewerken, gebruik dan "Opslaan" in het hoofdmenu.</i></small><br><br>';*/

  document.getElementById("right_col_inner").innerHTML += flattenSVGfromString(structure.toSVG(0,"horizontal").data);
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

function HLAddPrintPage() {
  this.structure.print_table.addPage();
  printsvg();
}

function HLDeletePrintPage(mypage: number) {
  this.structure.print_table.deletePage(mypage);
  printsvg();
}

function HLChangePrintStop(page: number) {
  let str_newstop = (document.getElementById("id_stop_change_"+page) as HTMLInputElement).value;
  let int_newstop = parseInt(str_newstop);
  structure.print_table.setStop(page,int_newstop);
  printsvg();
}

function HLDisplayPage() {
  structure.print_table.displaypage = parseInt((document.getElementById("id_select_page") as HTMLInputElement).value)-1;
  printsvg();
}

function HLChangeModeVertical() {
  structure.print_table.setModeVertical((document.getElementById("id_modeVerticalSelect") as HTMLInputElement).value);
  printsvg();
}

function HLChangeStartY() {
  var starty = parseInt((document.getElementById("id_starty") as HTMLInputElement).value);
  if (isNaN(starty)) {
    starty = 0;
  }
  structure.print_table.setstarty(starty);
  structure.print_table.forceCorrectFigures();
  printsvg();
}

function HLChangeStopY() {
  var stopy = parseInt((document.getElementById("id_stopy") as HTMLInputElement).value);
  if (isNaN(stopy)) {
    stopy = structure.print_table.getHeight();
  }
  structure.print_table.setstopy(stopy);
  structure.print_table.forceCorrectFigures();
  printsvg();
}

function HLChangePaperSize() {
  structure.print_table.setPaperSize((document.getElementById("id_papersize") as HTMLInputElement).value);
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
  /*let natBordCounter:number = itemCounter;
  for (var i=0; i<aantalNatteKringen; i++) {
    structure.insertChildAfterId(new Electro_Item(structure.data[natBordCounter-1]),natBordCounter);
    structure.data[structure.getOrdinalById(itemCounter+1)].setKey("type","Kring");
    structure.data[structure.getOrdinalById(itemCounter+1)].setKey("naam",aantalDrogeKringen+aantalNatteKringen-i);
    itemCounter++;
  };*/

  //7 droge kringen toevoegen aan droog bord
  /*for (var i=0; i<aantalDrogeKringen; i++) {
    structure.insertChildAfterId(new Electro_Item(structure.data[structure.getOrdinalById(droogBordCounter)]),droogBordCounter);
    structure.data[structure.getOrdinalById(itemCounter+1)].setKey("type","Kring");
    structure.data[structure.getOrdinalById(itemCounter+1)].setKey("naam",aantalDrogeKringen-i);
    itemCounter++;
  }*/
}

function reset_all() {
  structure = new Hierarchical_List();
  buildNewStructure(structure);
  HLRedrawTree();
}


function doprint() {

  var prtContent = document.getElementById("printarea");
  var WinPrint = window.open();

  var prtStr = `
  <html>
    <head>
    <style type="text/css">
    @media print {
      .header, .hide { visibility: hidden }
    }
    @page
    {
	    size: landscape;
	    margin: 0cm;
      body { margin: 2cm; }
    }
    </style>
    <style type="text/css" media="print">
    @page
    {
	    size: landscape;
	    margin: 0cm;
      body { margin: 2cm; }
    }
    </style>
    </head>
    <body>`
    + prtContent.innerHTML + '</body></html>';

  WinPrint.document.write(prtStr);
  WinPrint.document.close();
  WinPrint.focus();
  WinPrint.print();
  WinPrint.close();
}

function dosvgdownload() {
  var prtContent = document.getElementById("printsvgarea").innerHTML;
  var filename = (document.getElementById("dosvgname") as HTMLInputElement).value;
  download_by_blob(prtContent, filename, 'data:image/svg+xml;charset=utf-8'); //Was text/plain
}

function renderAddress() {
  var outHTML: string = "";

  outHTML = '<div align="left">' +
            '<div style="display:inline-block; width:25px;"></div><div style="display:inline-block;"><table cols="3" rows="1" style="border-collapse: collapse;border-style: solid; border-width:medium;" cellpadding="5">' +
            '  <tr><th style="text-align: left;border-style: solid; border-width:thin;">Plaats van de elektrische installatie</th><th style="text-align: left;border-style: solid; border-width:thin;">Installateur</th><th style="text-align: left;border-style: solid; border-width:thin;">Info</th></tr>' +
            '  <tr>' +
            '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_owner" onkeyup="javascript:changeAddressParams()">' + structure.properties.owner + '</td>' +
            '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_installer" onkeyup="javascript:changeAddressParams()">' + structure.properties.installer + '</td>' +
            '    <td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_info" onkeyup="javascript:changeAddressParams()">' + structure.properties.info + '</td>' +
            '  </tr>' +
            '</table></div></div>';

  return outHTML;
}

function renderAddressStacked() {
  var outHTML: string = "";

  outHTML = 'Plaats van de elektrische installatie' +
            '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
            '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_owner" onkeyup="javascript:changeAddressParams()">' + structure.properties.owner + '</td></tr>' +
            '</table><br>' +
            'Installateur' +
            '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
            '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_installer" onkeyup="javascript:changeAddressParams()">' + structure.properties.installer + '</td></tr>' +
            '</table><br>' +
            'Info' +
            '<table width="90%" cols="1" rows="1" style="border-collapse: collapse;border-style: solid; border-width:thin;" cellpadding="5">' +
            '<tr><td style="border-style: solid; border-width:thin;" contenteditable="true" valign="top" id="conf_info" onkeyup="javascript:changeAddressParams()">' + structure.properties.info + '</td></tr>' +
            '</table>';

  return outHTML;
}

function getPrintSVGWithoutAddress() {
  var outSVG = new SVGelement();
  outSVG = structure.toSVG(0,"horizontal");

  var scale = 1;
  //var height = outSVG.yup + outSVG.ydown;

  var page = structure.print_table.displaypage;
  var startx = structure.print_table.pages[page].start;
  var width = structure.print_table.pages[page].stop - startx;
  var starty = structure.print_table.getstarty();
  var height = structure.print_table.getstopy() - starty;

  var viewbox = '' + startx + ' ' + starty + ' ' + width + ' ' + height;

  var outstr = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="scale(1,1)" style="border:1px solid white" ' +
             'height="' + (height*scale) + '" width="' + (width*scale) + '" viewBox="' + viewbox + '">' +
             flattenSVGfromString(outSVG.data) + '</svg>';

  return(outstr);
}

function renderPrintSVG() {
  document.getElementById("printarea").innerHTML = '<div id="printsvgarea">' +
                                                      getPrintSVGWithoutAddress() +
                                                   '</div>'; // + '<br><br>' + renderAddress();
}

function changePrintParams() {
  renderPrintSVG();
}

function changeAddressParams() {
  structure.properties.owner = (document.getElementById("conf_owner") as HTMLElement).innerHTML;
  structure.properties.installer = (document.getElementById("conf_installer") as HTMLElement).innerHTML;
  structure.properties.info = (document.getElementById("conf_info") as HTMLElement).innerHTML;
}

function printsvg() {
  var strleft: string = "";

  var outSVG = new SVGelement();
  outSVG = structure.toSVG(0,"horizontal");

  var scale = 1;
  var startx = 0
  var height = outSVG.yup + outSVG.ydown;
  var width = outSVG.xleft + outSVG.xright;

  structure.print_table.setHeight(height);
  structure.print_table.setMaxWidth(width);

  strleft += '<br><table border="0"><tr><td style="vertical-align:top;">';

  strleft += structure.print_table.toHTML() + '<br>';

  strleft += '</td><td style="vertical-align:top;padding:5px">';

  strleft += 'Klik op de groene pijl om het schema over meerdere pagina\'s te printen en kies voor elke pagina de start- en stop-positie in het schema (in pixels). '
          +  '<br><br>Onderaan kan je bekijken welk deel van het schema op welke pagina belandt en de pagina exporteren en/of omzetten naar PDF. '
          +  "Het exporteren of omzetten naar PDF dient voor elke pagina herhaald te worden.";

  strleft += '</td></tr></table>'

  strleft += '<hr>';

  strleft += 'Pagina <select onchange="HLDisplayPage()" id="id_select_page">'
  for (var i=0; i<structure.print_table.pages.length; i++) {
    if (i==structure.print_table.displaypage) {
      strleft += '<option value=' + (i+1) + ' selected>' + (i+1) + '</option>';
    } else {
      strleft += '<option value=' + (i+1) + '>' + (i+1) + '</option>';
    }  
  }
  strleft += '</select>&nbsp;&nbsp;';
  strleft += 'Layout ';
  switch (structure.print_table.getPaperSize()) {
    case "A3":
      strleft += '<select onchange="HLChangePaperSize()" id="id_papersize"><option value="A4">A4</option><option value="A3" selected="selected">A3</option></select>';
      break;
    case "A4":
      strleft += '<select onchange="HLChangePaperSize()" id="id_papersize"><option value="A4" selected="Selected">A4</option><option value="A3">A3</option></select>';
    default:
  }
  strleft += '&nbsp;&nbsp;';

  switch (structure.print_table.getModeVertical()) {
    case "kies":
      strleft += 'Hoogte <select onchange="HLChangeModeVertical()" id="id_modeVerticalSelect"><option value="alles">Alles (standaard)</option><option value="kies" selected="Selected">Kies (expert)</option></select>';
      strleft += '&nbsp;&nbsp;StartY ';
      strleft += '<input size="4" id="id_starty" type="number" min="0" step="1" max="' + structure.print_table.getHeight() + '" onchange="HLChangeStartY()" value="' + structure.print_table.getstarty() + '">';
      strleft += '&nbsp;&nbsp;StopY '
      strleft += '<input size="4" id="id_stopy" type="number" min="0" step="1" max="' + structure.print_table.getHeight() + '" onchange="HLChangeStopY()" value="' + structure.print_table.getstopy() + '">';
      break;
    case "alles":  
    default:
      strleft += 'Hoogte <select onchange="HLChangeModeVertical()" id="id_modeVerticalSelect"><option value="alles">Alles (standaard)</option><option value="kies">Kies (expert)</option></select>';  
  }
  strleft += '<br><br>';
  
  strleft += '<table border="0"><tr><td style="vertical-align:top"><button onclick="dosvgdownload()">Download SVG</button></td><td>&nbsp;</td><td style="vertical-align:top"><input id="dosvgname" size="20" value="eendraadschema_print.svg"></td><td>&nbsp;&nbsp;</td><td>Sla tekening hieronder op als SVG en converteer met een ander programma naar PDF (bvb Inkscape).</td></tr></table><br>';
  strleft += displayButtonPrintToPdf();

  strleft += '<div id="printarea"></div>';

  document.getElementById("configsection").innerHTML = strleft;
  renderPrintSVG();

  hide2col();
}

function exportscreen() {
  var strleft: string = "";

  strleft += '<table border=0><tr><td width=500 style="vertical-align:top;padding:5px">';
  strleft += 'Bestandsnaam: <span id="settings"><code>' + structure.properties.filename + '</code><br><button onclick="HL_enterSettings()">Wijzigen</button>&nbsp;<button onclick="exportjson()">Opslaan</button></span>';
  strleft += '</td><td style="vertical-align:top;padding:5px">'
  strleft += 'U kan het schema opslaan op uw lokale harde schijf voor later gebruik. De standaard-naam is eendraadschema.eds. U kan deze wijzigen door links op "wijzigen" te klikken. ';
  strleft += 'Klik vervolgens op "opslaan" en volg de instructies van uw browser. '
  strleft += 'In de meeste gevallen zal uw browser het bestand automatisch plaatsen in de Downloads-folder tenzij u uw browser instelde dat die eerst een locatie moet vragen.<br><br>'
  strleft += 'Eens opgeslagen kan het schema later opnieuw geladen worden door in het menu "openen" te kiezen en vervolgens het bestand op uw harde schijf te selecteren.<br><br>'
  strleft += '</td></tr>';

  strleft += PROP_GDPR(); //Function returns empty for GIT version, returns GDPR notice when used online.

  '</table>';
  //-- plaats input box voor naam van het schema bovenaan --

  strleft += '<br>';

  document.getElementById("configsection").innerHTML = strleft;
  hide2col();

  //renderPrintSVG();
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

    /*<br><br>
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
  `*/
  //<button onclick="read_settings()">Start</button>

  /*var strright:string = `<br><br><br><br>
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
  `*/

  strleft += CONFIGPAGE_RIGHT;

  strleft += PROP_getCookieText(); //Will only be displayed in the online version

  document.getElementById("configsection").innerHTML = strleft;
  hide2col();

  if (browser_ie_detected()) {
    alert("Deze appicatie werkt niet in Internet Explorer. Wij raden aan een moderne browser te gebruiken zoals Edge, Firefox, Google Chrome, Opera, Vivaldi, ...");
  }
}

function hide2col() {
  var leftElement = document.getElementById("left_col_inner");
  var rightElement = document.getElementById("right_col_inner");
  if(typeof(leftElement) != 'undefined' && leftElement != null){
    leftElement.innerHTML = "";
  };
  if(typeof(rightElement) != 'undefined' && rightElement != null){
    rightElement.innerHTML = "";
  };
  document.getElementById("canvas_2col").innerHTML = "";
}

function show2col() {
  if (document.getElementById("canvas_2col").innerHTML == "") {
    document.getElementById("canvas_2col").innerHTML = '<div id="left_col"><div id="left_col_inner"></div></div><div id="right_col"><div id="right_col_inner"></div></div>';
  }
}

function import_to_structure(mystring: string, redraw = true) {

  var text:string = "";

  //If first 3 bytes read "EDS", it is an entropy coded file
  //The first 3 bytes are EDS, the next 3 bytes indicate the version (currently only 001 implemented)
  //the next 4 bytes are decimal zeroes "0000"
  //thereafter is a base64 encoded data-structure
  if ( (mystring.charCodeAt(0)==69) && (mystring.charCodeAt(1)==68) && (mystring.charCodeAt(2)==83) ) { //recognize as EDS
    mystring = atob(mystring.substring(10,mystring.length))
    var buffer:Uint8Array = new Uint8Array(mystring.length);
    for (var i = 0; i < mystring.length; i++) {
      buffer[i-0] = mystring.charCodeAt(i);
    }
    try { //See if the text decoder works, if not, we will do it manually (slower)
      let decoder = new TextDecoder("utf-8");
      text = decoder.decode(pako.inflate(buffer));
    } catch (error) { //Continue without the text decoder (old browsers)
      var inflated:Uint8Array = pako.inflate(buffer);
      text = "";
      for (i=0; i<inflated.length; i++) {
        text += String.fromCharCode(inflated[i])
      }
    }
  }

  //If first 3 bytes do not read "EDS", the file is in the old non encoded format and can be used as is
  else {
    text = mystring;
  }

  var mystructure: Hierarchical_List = new Hierarchical_List();
  structure = new Hierarchical_List();
  var obj = JSON.parse(text);
  (<any> Object).assign(mystructure, obj);
  for (var listitem of structure.data) {
    listitem.Parent_Item = structure.data[structure.getOrdinalById(listitem.parent)];;
  }

  if (typeof mystructure.properties.filename != "undefined") {
    structure.properties.filename = mystructure.properties.filename;
  }
  if (typeof mystructure.properties.owner != "undefined") {
    structure.properties.owner = mystructure.properties.owner;
  }
  if (typeof mystructure.properties.installer != "undefined") {
    structure.properties.installer = mystructure.properties.installer;
  }
  if (typeof mystructure.properties.info != "undefined") {
    structure.properties.info = mystructure.properties.info;
  }

  if (typeof mystructure.print_table != "undefined") {
    structure.print_table.setHeight(mystructure.print_table.height);
    structure.print_table.setMaxWidth(mystructure.print_table.maxwidth);
    structure.print_table.setPaperSize(mystructure.print_table.papersize);
    structure.print_table.setModeVertical(mystructure.print_table.modevertical);
    structure.print_table.setstarty(mystructure.print_table.starty);
    structure.print_table.setstopy(mystructure.print_table.stopy);

    for (var i=0; i<mystructure.print_table.pages.length; i++) {
      if (i != 0) this.structure.print_table.addPage();
      this.structure.print_table.pages[i].height = mystructure.print_table.pages[i].height;
      this.structure.print_table.pages[i].start = mystructure.print_table.pages[i].start;
      this.structure.print_table.pages[i].stop = mystructure.print_table.pages[i].stop;
    }
  }

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
  }

  //As we re-read the structure and it might be shorter then it once was (due to deletions) but we might still have the old high ID's, always take over the curid from the file
  structure.curid = mystructure.curid;

  //Sort the entire new structure
  structure.reSort();

  //Draw the structure
  if (redraw == true) {
    HLRedrawTree();
  }
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
  var text:string = "";

  reader.onload = function(){
    var mystring = reader.result.toString();

    //If first 3 bytes read "EDS", it is an entropy coded file
    //The first 3 bytes are EDS, the next 3 bytes indicate the version (currently only 001 implemented)
    //the next 4 bytes are decimal zeroes "0000"
    //thereafter is a base64 encoded data-structure
    if ( (mystring.charCodeAt(0)==69) && (mystring.charCodeAt(1)==68) && (mystring.charCodeAt(2)==83) ) { //recognize as EDS
      mystring = atob(mystring.substring(10,mystring.length))
      var buffer:Uint8Array = new Uint8Array(mystring.length);
      for (var i = 0; i < mystring.length; i++) {
        buffer[i-0] = mystring.charCodeAt(i);
      }
      try { //See if the text decoder works, if not, we will do it manually (slower)
        let decoder = new TextDecoder("utf-8");
        text = decoder.decode(pako.inflate(buffer));
      } catch (error) { //Continue without the text decoder (old browsers)
        var inflated:Uint8Array = pako.inflate(buffer);
        text = "";
        for (i=0; i<inflated.length; i++) {
          text += String.fromCharCode(inflated[i])
        }
      }
    }

    //If first 3 bytes do not read "EDS", the file is in the old non encoded format and can be used as is
    else {
      text = mystring;
    }

    //code to transform input read into memory structure
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
  } else {
    this.location.go(`${mimeType},${encodeURIComponent(text)}`);
  }
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
  //Experimental, flatten everything
  if ((document.getElementById("noGroup") as HTMLInputElement).checked == true) {
    text = flattenSVGfromString(text);
  }

  download_by_blob(text, filename, mimeType); //was text/plain
}

function read_settings() {
  //CONF_aantal_droge_kringen = parseInt((document.getElementById("aantal_droge_kringen") as HTMLInputElement).value);
  //CONF_aantal_natte_kringen = parseInt((document.getElementById("aantal_natte_kringen") as HTMLInputElement).value);
  CONF_aantal_fazen_droog = parseInt((document.getElementById("aantal_fazen_droog") as HTMLInputElement).value);
  CONF_aantal_fazen_nat = CONF_aantal_fazen_droog;
  CONF_hoofdzekering = parseInt((document.getElementById("hoofdzekering") as HTMLInputElement).value);
  CONF_differentieel_droog = parseInt((document.getElementById("differentieel_droog") as HTMLInputElement).value);
  //CONF_differentieel_nat = parseInt((document.getElementById("differentieel_nat") as HTMLInputElement).value);
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
import_to_structure(EXAMPLE_DEFAULT,false); //Just in case the user doesn't select a scheme and goes to drawing immediately, there should be something there

restart_all();
