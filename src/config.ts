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

var EXAMPLE_DEFAULT = `EDS0010000eJztXGtT2zgU/SsZfzbb+AEsfCMt0+nw2tmw2Z1lOoywbxKtH/LIctjS6X9fSQnEKUlpsoXa4XxhjCVfPa6P7j3nGj47KeUjNXYOva7rxEwx5/Dqs8NjfcN1CiYpV86hbuJ5fH8ZiTRlRUm6z5ClJblOQp9K/dyVoz4V5LhO//j0+O2lvjhieZlWXPF85Hx0r5wRMSZj3dC7uDg9Pjp3XCUrMi2JGUBOiKd8NCa+tA+LoiqrUqY41ZvtJGw7yxVL6+P7dtSUR2OVSD2J60LM7T/0ojyh1LbY7hO9UK5HEXLpKHeUkLFVtxDz4ZDMXnGi1BphWUGSjexuXP7+4fy9vgi7tilhN5TW7/v/enu2JWcsqze802Ztw4L961uziQuWg27N9LXeh1u646Ole2j3yK9P3puuWqTqq/n6QXfwxg8Htj0SWaYnoIeud7FNJaUUKa9us1Qsj62v5x38pzoEqzvcCJF6S91hWvyVLcHSllIZB3qPF2Lv+yvuB4/umxHCxyN8NBjJyyojaWDh6B4nszdmARBf3CnSwr051Lw51Ly1oNYTs616aYx5L4QxVimR6XmV0XglwvwVCPtr0OsE7313dynMALE2Quw3i5jrD4oy5xAhCyELeHqJkPWonw088+79IuWqXIxv+3Ncmlh3D0x/LWBOB9hmSD5fhDtqJyTP3xy9UjAuCW7IEpElIqohS0SWCDxtV5a4wug8f/TniN2fIzZYC7F9JQo9jmKRQgDcKAD6QGwbEbskAtb4mL+KjhkvgY1tCKTBRYvZ2AlVCeWA03fDyQcxAzFDWAIxe8HoBGIGPP1EYvaopT7Mg9F3IhOKR0xfnhHpN0hSZ0LyRlY8MY8uG9Z1dnZ2jAn7xvYET0naF5OKieR0N/1NCjFKWKnsdZUkuSj05XFKid64iCvS1jJStvPsrg481BEaajbFUdb8iaB0ZuZEiGQoZF5xM69TA+CIy0gv6f7XosrN9RmPpBiJdDizdSamuL3IJkJmdsR+NGYa4PpdMrbqzNN1LqXeKT1QNoP7H/1eJ2WxfW7AmLplZcaiMc8NMAb1g2FA8pbJTG9SqQSV0xUMJP+HOooSu4g/6w//LfKcCpaT7Tjd1Xs3zdZyNFQsiYWwSyaqc+6gVrOpkYRwrdO4PjskN9uX3JzyPClXnch3wri0k9iXe8WhLEm7pmzIieztvkAVB1pWE2AFLauVSQ60LGhZ0LKgZW1tXGo2moAjaFnQsoAnaFnQslqhZT3h2qd92iJf1ny2yq2t9uVMP+lCP/nuwPp8eWqIwNrGwAr9BPoJ9BPoJ1sbl5qNJuAI+gn0E+AJ+gn0kxZxbj+scYRaVrML0o2PFnAab8ISaumN39306zrw7s1599tmY6nH4oRlC9/NAVNPYKqmDHsHm0rD3+DeD8tDfAL53mooGfhAFH5e2v1tKK3BvZ9A01cbBThBE0ZYQlhqI46gCUMTBp6gCUMTbtQ3dXD69jt9lsge/IhCwMI2Njeljaubm8bmtEGzg3C/4DSa5R2IxagINIMmoiLwyjCFigCkF1BFVATaIbqgIvBq4ISKAMIScISKQHuCEyoCW4cnVAQgDqMiAKf/n4qAV/vz4b1NFZafXhBog3iJPw3YwhC8JKXdg9DyY4A0y1dXVAG8FUDqNRtI+nC3u3vvYGAKckvjg1OzIQUcQW6B3AI8QW4B824R8w78bWDe7U9uGv4lHk5jMG8wbzBvMO/XGJyaDSngCMwbzBt4AvMG824D89avkp4on5B2rCUC6/zQD5uD/Mpzwz033HdD3w0DN+y6fuj6B6637wa+7lNIoc8qfbSU5ugfahfnLNMDOjENWZWqXyguHfOSVdL+O/xfXScTselAsfbHl/8ACuXiVQ==`
