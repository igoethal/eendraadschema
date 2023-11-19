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

function exportjson() {
  var filename:string;

  //We use the Pako library to entropy code the data
  //Final data reads "EDS0010000" and thereafter a 64base encoding of the deflated output from Pako
  //filename = "eendraadschema.eds";
  filename = structure.properties.filename;

  var text:string = JSON.stringify(structure);
  try {
    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();
    let pako_inflated = new Uint8Array(encoder.encode(text));
    let pako_deflated = new Uint8Array(pako.deflate(pako_inflated));
    text = "EDS0010000" + btoa(String.fromCharCode.apply(null, pako_deflated));
  } catch (error) {
    //We keep the non encoded text and do nothing
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
