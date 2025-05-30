import { EDStoStructure } from '../src/importExport/importExport';
import type { MenuItem } from '../src/TopMenu.js';

export var PROP_Contact_Text = `<html>
  <head>
    <title>Eendraadschema online</title>
    <link rel="stylesheet" href="css/about.css" style="text/css" />
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
  return("");
}

export function PROP_getCookieText() {
  return("");
}

export function PROP_edit_menu(menuItems: MenuItem[]) {}

//--- START OF DEVELOPMENT OPTIONS ---

export function PROP_development_options() {
  let outstr:string = '<br><h2>Expert ontwikkel opties, Gebruik enkel indien u weet wat u doet.</h2>'
                    + '<textarea id="HL_loadfromtext" style="width: 80%; height: 8em;"></textarea><br>'
                    + '<button onclick="loadFileFromText()">Load from input</button>';
  return outstr;
}

globalThis.loadFileFromText = () => {
  let str:string = (document.getElementById('HL_loadfromtext') as HTMLInputElement).value;
  EDStoStructure(str);
  globalThis.fileAPIobj.clear();
}

/// --- END OF DEVELOPMENT OPTIONS ---

globalThis.displayButtonPrintToPdf = () => {
  return("");
  //Does nothing, we use jsPDF now, not Latex anymore
}

globalThis.handleButtonPrintToPdf = () => {
  return(0);
  //Does nothing, we use jsPDF now, not Latex anymore
}

globalThis.propUpload = (text: string) => {
  return(0);
  //Does nothing in the serverless version, only used on https://eendraadschema.goethals-jacobs.be
  
  //avoid warning on text never used
  text;
}

export class CookieBanner {
  run() {} //Does nothing in the serverless version, only used on https://eendraadschema.goethals-jacobs.be
}
