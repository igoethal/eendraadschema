var VERSION = "git"; //can be "git" or "online"

function PROP_GDPR() {
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
    var decoder = new TextDecoder("utf-8");
    var encoder = new TextEncoder();
    var pako_inflated = new Uint8Array(encoder.encode(text));
    var pako_deflated = new Uint8Array(pako.deflate(pako_inflated));
    text = "EDS0010000" + btoa(String.fromCharCode.apply(null, pako_deflated));
  } catch (error) {
    //We keep the non encoded text and do nothing
  } finally {
    download_by_blob(text, filename, 'data:text/plain;charset=utf-8');
  }
}
