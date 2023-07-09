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

var CONFIGPRINTPAGE:string = `
<div>
</div>
<br>
`;

var EXAMPLE0 = `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`;

var EXAMPLE1 = `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`;

var EXAMPLE_DEFAULT = `EDS0010000eJztWutv2zYQ/1cEfp3i2FLSD8YwNFmDoMhraDJ3aFAEtHSWWfEhkJTdpMj/vjv6Jc92gGxr0IeMxCDvyHvxfnck4C9Mgi78mPUPYpZzz1n/9gsTOev3YlZxC9qzfjdmQueLYWak5JUDXDPi0kHMSrh3uO+W+fsKWMyuT85Pfr/BwRHXTtbCC12wj/EtK4BzmyPj+Orq/OToksXe1kCckhTYCQgpijGIrWt4ltWqltwLaLKDEYHPteeyoT8hqhTZ2JcWTbirzEr60kbQJcjACSZO0E2BOozdquMBSiBZTQm5GI2AIiUAZBDCVQWWFyEWN+/eXp6y+NVhcJMPQTaoLPncexW2aM5VkxGIa5LvphS8psy0210KvUPvp/AgiidCkzSt7s3cNdKvG8qStDvYTw4GgZ8ZpVA/at4wzoGEzPeaMtMGY01Zg5426c5znYecoAVDY2Rvq/3ESXZy0q0c5+mgept2B3qyg55u0EnDwU7dh5ucj4QR7WoFlmDBcMXZPGfWAPEYz5CWrJDWWyGt9yykHZt5DF8YYvM0+vog47U3Cu1y2XgXxFjSZVtB9tfgOEpPk/jwXyONIdTY01hbhvBloLaOnC2Q27bgp8DeHwFLd289KNZve1nby9pe9hK9bGNdaEmr5deVFN6tNb50BctkBcvkWbCciW8BuQ2Q/wGM3xYWL/ePnovGHwyEW5pae21sr43ttbG9Nn7vXaq9Nv6QePoa18YdQpcXyoMVYNMVYNP/qyUuvW57YtsTfwYMb+mJ7ZutfbO1b7b2zdb2p7Y/fYsIa99s7ZutfbN9F2+2DU5TzVLoG6OMFxlvDKMCnK9rzKpoAnZoa4HZ3dB/AYA82+S6NbNitrf7Q6q594iXTzQMiX9shAwq3gioJlbAw2xmjSlK7nwY12WpTYXDEwklnkomPKBCBT4snlOxq0FkEK9EGkSS5zPbcRVpOjMg5xLPjClHxupakPXnVBAyYTMM0GJa1ZrGFyKzpjByNBd7YWZ14EpNjFVB/BWGwlVca3TfDWFWseanlY051hJM5xAkbyo8F88zP5thzGdSbyweD9qj5lXmz+vjpfUDzv2UO8WzsdAEy0GzHg3A0q+MZupwMuVWkR3e4DkGrwcYbIg8lMHx98j3UBlV7XN02ARSQ/gHozWgMxD2Pn2Ui5yah+po5HmZGxMiCkAGfQCZP3AFkbtXQ4OGYm4iFjAAYgKYmVTH4/UvZFOvue3FSZzGBzitMPX8nedDCdSJsFoX41nfUfzzVOT0C6su1VxXSX5fUe2iOQ1c+MlVYwdWF7sYYT71u48ElsoarM5YUh0pGGE+ajSa9RmAzi3nOSWW4h3IyTcz1XgwfTYwmEBYo6MjTBcIw1+H9rdrjzt81KVxFz+IKIVyPBDhBmQ/+iVNIqQv/oh+en2xoK8zYE9xgXsmc2UdvlT2OjcKhO4M6dyERtekDIaJHFQgjQzOSAqWoqjT6dCQ/gsERImuRYgfmo+9r1x/f386nXb+4XJhwI+xhu194pkZOlJG1aW2dEiHeAQmD4HKETmPfwPoje90`
