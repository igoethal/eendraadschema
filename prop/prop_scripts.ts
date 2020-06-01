function exportjson() {
  var filename:string;
  filename = "eendraadschema.eds";
  var text:string = JSON.stringify(structure);

  download_by_blob(text, filename, 'data:text/plain;charset=utf-8');
}
