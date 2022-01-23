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
