var CONFIGPAGE_LEFT:string = `
    <center>
        <p><font size="+2">
          <b>Eendraadschema ontwerpen: </b>
          Kies &eacute;&eacute;n van onderstaande voorbeelden om van te starten (u kan zelf kringen toevoegen achteraf) of
          start van een leeg schema (optie 3).
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

var EXAMPLE0 = `EDS0020000eJztnG1P4zgQgP9Kla/nLYkTQK1Op4MeQqvldqUr6p2EEHKTaeqNE0eJQ3kR//3GhtJ0adjjZbe51hJCxmPPjMd5Mo4dcusIyGI1dfpejzgRU8zpn906PMIK4uSsgEw5fZc4PIvmxVAKwfISsM2EiRKIk8B1if3OHHWdg0Oc4dHJ0eAUCwcsK0XFFc9i55ycOTEwVkQoOPzy5eTo4LNDVFGBliTaQHEJXPB4CnxlGxaGVVoJpjjUxcYJI2eZYqJunxqrgodTlRToxEUuF/ofW0GWgDAS0/wSB8rRiixWWrmBBLSuuoaITyagY8UBhFHC0hwKFptonP718fMxFgLXiBI2BlGvp1fenpFkjKV1wR+o1giW9F/MdBCXNPtuTfUFxmEGNzxeGUMTI1p33rsftRTqG3+p7452aDAy8lCmKTqAputNjKgEAaHy6jpLxbLIzPWiwZLRg5rAb+45llJ4K6dBS2ijxF8pKZWeOG8pcs5CQJ+OzNT7T+q1iaDR+O5TyTkOTFZFCIKXSFFWCXFH7jmjC868BWfeizg7lA/x+tmAeT8JMFYpmaJfZThtxIs24PXP6LDjH1Oyu5KxDeVrVYN1crZ2zHR+m3NGF5zRF3H2qbCZ7LlM9jxqL0hn36Htm0CtHzebzh7TmVvLZ70FaP57JbRH32xGsxltmzPafi2huU0ZTc/iVie0t3I2GLBnWDtoN2yfoEoga0LuY9aZITJNwA1eCdp8LBuT0vYsaO8E2sM+xzOgeQ2gHbYbtBEUJsLzSba0vZo2v5bX9l+7fhwqmYcSpylUdl/kVatIr93A2WXke/EWUMtbC3ijlrct4c2zvLWAN9/ytiW8uZa3FvAWWN62gze/Z3lrAW+7lrft4C3wF7wFtZPt4EXAjQr+FToKktICt4nHbn8zBUUiMSBN5N1IPa+dhEVLbZY8CFFxAUvydbK3566dPuqtPhwI7OHAS7H7/uFAE3qDdrN3yKKEpc3k2ZOB/8habaeS1t6V3LVLS3s0YJeWPwC4wALXBuDs2cC2ANd7D+BO9KUe8iKseJuJi6rxuLXItfx4YJhziB9e0LbkvQN5Xu0lr73X7lpa8N4Onl1cbgtx+5tAXJs2UOzi0gL33MEc3QTg/v9Pcy1fWlrg3gwc1rFQ8UtAhMzW/w/7hZY02mceocTrEeqSfbJH/H0SUBJ4JHCJ3yOBT/BhklJCA4JPmLjUxdzrU+ybYxDUhWJjga7eOkhRPL3/yEPKrmY80h+GcPU/hZa5YNe5vpj65nWaGErzoYhaD5zdYl6SORbuzu+0BYnc4EVeagMTLiBjKWpx4AqJEuC6bheiEuMqZxkUKBhJWWhkOgeIOJjir+Pit6EqGFMdV5exk9uJIQW8ekFXnILod37xaQfr5z+6/nj457x+WQAfUsaxz+WDsS57NPZ7JFPgWXesweEZDksI4xiPIDVVE4l/xaDwrpFFnRSU1jhVKi/7Ozuz2ayLfkXobYT3DkhZN5agpnixfPjKQjkutWaMTFgV5vgWn+1TGZmQRHhPvfsXXgCWFw==`;

var EXAMPLE1 = `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`;

var EXAMPLE_DEFAULT = `EDS0020000eJztWutv2zYQ/1cEfp3i2FLSD8YwNFmDoMhraDJ3aFAEtHSWWfEhkJTdpMj/vjv6Jc92gGxr0IeMxCDvyHvxfnck4C9Mgi78mPUPYpZzz1n/9gsTOev3YlZxC9qzfjdmQueLYWak5JUDXDPi0kHMSrh3uO+W+fsKWMyuT85Pfr/BwRHXTtbCC12wj/EtK4BzmyPj+Orq/OToksXe1kCckhTYCQgpijGIrWt4ltWqltwLaLKDEYHPteeyoT8hqhTZ2JcWTbirzEr60kbQJcjACSZO0E2BOozdquMBSiBZTQm5GI2AIiUAZBDCVQWWFyEWN+/eXp6y+NVhcJMPQTaoLPncexW2aM5VkxGIa5LvphS8psy0210KvUPvp/AgiidCkzSt7s3cNdKvG8qStDvYTw4GgZ8ZpVA/at4wzoGEzPeaMtMGY01Zg5426c5znYecoAVDY2Rvq/3ESXZy0q0c5+mgept2B3qyg55u0EnDwU7dh5ucj4QR7WoFlmDBcMXZPGfWAPEYz5CWrJDWWyGt9yykHZt5DF8YYvM0+vog47U3Cu1y2XgXxFjSZVtB9tfgOEpPk/jwXyONIdTY01hbhvBloLaOnC2Q27bgp8DeHwFLd289KNZve1nby9pe9hK9bGNdaEmr5deVFN6tNb50BctkBcvkWbCciW8BuQ2Q/wGM3xYWL/ePnovGHwyEW5pae21sr43ttbG9Nn7vXaq9Nv6QePoa18YdQpcXyoMVYNMVYNP/qyUuvW57YtsTfwYMb+mJ7ZutfbO1b7b2zdb2p7Y/fYsIa99s7ZutfbN9F2+2DU5TzVLoG6OMFxlvDKMCnK9rzKpoAnZoa4HZ3dB/AYA82+S6NbNitrf7Q6q594iXTzQMiX9shAwq3gioJlbAw2xmjSlK7nwY12WpTYXDEwklnkomPKBCBT4snlOxq0FkEK9EGkSS5zPbcRVpOjMg5xLPjClHxupakPXnVBAyYTMM0GJa1ZrGFyKzpjByNBd7YWZ14EpNjFVB/BWGwlVca3TfDWFWseanlY051hJM5xAkbyo8F88zP5thzGdSbyweD9qj5lXmz+vjpfUDzv2UO8WzsdAEy0GzHg3A0q+MZupwMuVWkR3e4DkGrwcYbIg8lMHx98j3UBlV7XN02ARSQ/gHozWgMxD2Pn2Ui5yah+po5HmZGxMiCkAGfQCZP3AFkbtXQ4OGYm4iFjAAYgKYmVTH4/UvZFOvue3FSZzGBzitMPX8nedDCdSJsFoX41nfUfzzVOT0C6su1VxXSX5fUe2iOQ1c+MlVYwdWF7sYYT71u48ElsoarM5YUh0pGGE+ajSa9RmAzi3nOSWW4h3IyTcz1XgwfTYwmEBYo6MjTBcIw1+H9rdrjzt81KVxFz+IKIVyPBDhBmQ/+iVNIqQv/oh+en2xoK8zYE9xgXsmc2UdvlT2OjcKhO4M6dyERtekDIaJHFQgjQzOSAqWoqjT6dCQ/gsERImuRYgfmo+9r1x/f386nXb+4XJhwI+xhu194pkZOlJG1aW2dEiHeAQmD4HKETmPfwPoje90`
