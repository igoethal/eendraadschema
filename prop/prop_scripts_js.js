function popUp(URL) {
  //day = new Date();
  //id = day.getTime();
  id=17993;
  var w = 800;
  var h = 500;
  var left = (screen.width/2)-(w/2);
  var top = (screen.height/2)-(h/2);
  eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);");
}
