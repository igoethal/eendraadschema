var CONFIGPAGE_LEFT:string = `
    <center>
        <p><font size="+2">
          <b>Eendraadschema ontwerpen: </b>
          Kies &eacute;&eacute;n van onderstaande voorbeelden om van te starten (u kan zelf kringen toevoegen achteraf) of
          start van een leeg schema met voorgekozen aantal kringen (optie 3).
        </font></p>
      <font size="+1">
        <i>
          <b>Tip: </b>Om de mogelijkheden van het programma te leren kennen is het vaak beter eerst een voorbeeldschema te
          bekijken alvorens van een leeg schema te vertrekken.
        </i>
      </font>
    </center><br><br>
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
          Eenvoudig schema, enkel stopcontacten en lichtpunten.
          <br><br>
        </td>
        <td width="25%" align="center">
          <br>
          <img src="examples/example001.svg" height="300px"><br><br>
          Iets complexer schema met teleruptoren, verbruikers achter stopcontacten en gesplitste kringen.
          <br><br>
        </td>
        <td width="25%" align="center">
          <br>
          <img src="examples/gear.svg" height="100px"><br><br>
`

var CONFIGPAGE_RIGHT:string = `
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
          <button onclick="importclicked()">Verdergaan met deze optie</button>
          <br><br>
        </td>
      </tr>
    </table>
  `;

var EXAMPLE0 = `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`;

var EXAMPLE1 = `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`
