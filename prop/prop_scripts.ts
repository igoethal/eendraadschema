var VERSION = "git"; //can be "git" or "online"

var PROP_Contact_Text = `<html>
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

function PROP_GDPR() {
  return("");
}

function PROP_getCookieText() {
  return("");
}

//--- START OF DEVELOPMENT OPTIONS ---

function PROP_development_options() {
  let outstr:string = '<br><h2>Expert ontwikkel opties, Gebruik enkel indien u weet wat u doet.</h2>'
                    + '<textarea id="HL_loadfromtext" style="width: 80%; height: 8em;"></textarea><br>'
                    + '<button onclick="loadFileFromText()">Load from input</button>';
  return outstr;
}

function loadFileFromText() {
  let str:string = (document.getElementById('HL_loadfromtext') as HTMLInputElement).value;
  import_to_structure(str);
}

/// --- END OF DEVELOPMENT OPTIONS ---

function exportjson() {
    var filename:string;

    /* We use the Pako library to entropy code the data
     * Final data reads "EDSXXX0000" with XXX a version and thereafter a 64base encoding of the deflated output from Pako
     * filename = "eendraadschema.eds";
     */
    filename = structure.properties.filename;

    var text:string = structure_to_json();

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
        download_by_blob(text, filename, 'data:text/eds;charset=utf-8');
    }
}

function displayButtonPrintToPdf() {
  return("");
  //Does nothing in the serverless version, only used on https://eendraadschema.goethals-jacobs.be
}

function handleButtonPrintToPdf() {
  return(0);
  //Does nothing in the serverless version, only used on https://eendraadschema.goethals-jacobs.be
}
