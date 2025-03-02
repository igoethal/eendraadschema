const SITPLANVIEW_SELECT_PADDING:number = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--selectPadding').trim());
const SITPLANVIEW_ZOOMINTERVAL = {MIN: 0.1, MAX: 1000};
const SITPLANVIEW_DEFAULT_SCALE = 0.7;

var CONFIGPAGE_LEFT:string = `
    <table border="1px" style="border-collapse:collapse;" align="center" width="100%"><tr><td style="padding-top: 0; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;">
        <p><font size="+2">
          <b>Welkom op ééndraadschema</b>
        </font></p>
      <p><font size="+1">  
           Kies één van onderstaande voorbeelden om van te starten of start van een leeg schema (optie 3).
      </font></p>
      <font size="+1">
        <i>
          <b>Tip: </b>Om de mogelijkheden van het programma te leren kennen is het vaak beter eerst een voorbeeldschema te
          bekijken alvorens van een leeg schema te vertrekken.
        </i>
      </font>
    </td></tr></table>
    <br>
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
          <button onclick="loadClicked()">Verdergaan met deze optie</button>
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

var EXAMPLE0 = `EDS0040000eJztWe9r6zYU/VeMv84rjp2kaxhjbQdv422f3qMblIdRrBtHtSwF2Un6g+5v35HsxM5emiVpB68QKCWRda+uzjmSjuInX5LKqqk/6l0EPmcV80e3T77gaAj8GTOkKn8UBr5QfPUx1VKyWUnoM2GyJPQzelb6oydfGX/k/yImEz/wq4cZ4dslU6Wci0qoDI2MqYrJZKYxLB5GaBpTmU7JFLbDyOcIJjuqIJI2oJiRYZnN1A+brEnOxiQTxZKKpCQ7ZnTfG+LpRnTCSVYs6WSIQ5uCcUOo1l9l2xwSFeNBOjcLSti80gVjVd15M7kok5Ikpfg2WQORa1O52S4wIZ25OcYIVYwVnRHr+hdam3YG/nPgl3puUpKixIhqLuVzUFMRtVT0Wip6/01FS8OVNhzfUHVGjOHzqDJz6la2hmVHIVYkq0qitpLokEo+mjeXAlr+urny4g9RMNhHBTaY8rLhtWZD6pQhAE1lxRR3GB0okDoRIBYqGc9FuYbiFcpZ5wRcS3oU2TqiYc6ttl3aCTviuWg5i1+nns0i9pTPeUc94UvyqXX5avXU1FQCbZvaibZq5/qa7a+froA+0jxHCV/L6DflLSGkl0S0TUPXW0VUA/K2GtpY/Je7OBt+C5y5zf0FznqHc3ZDRop02pxJ75e4q13ExZ3Vdn7Quu+11F1rUJZWXOty2+mBhtwmBhxCtuXVRDeZOsdtI4AJK8nCxAWppCAyaLDBGzvvlGhSoVNGYz1fckogCpaTxON12Rh+yuRkySoy3BLafdJJ3DTWKYHRlrFXcSoBBxxMjfV6m9sBcj86FuToBPLeIPeOBTk+gbw3yOGxIPdPIO8LcnxxLMiDE8h7KzluQe53bin9QxzvjRF35NWGoTUOf9pZ5TrHjS3wF7ZL4h4lTdSjtsB7OeOux1Qb8WjZkpTgdJfiTtVGJ0VBhuo+DoCO86FkjEe8+vdVpG0dhjXvC9oAF66k7LqKfRx51Ntu7/rfjL07wpJfMZ6zwqH7fr3d9U7aOrYj6vwkMDiZuzfcSKL+0Sif3N3+KF8cjXLH3v1ua0+FSbHSWpjaCZcd6W/g4PP5GCsRu5bIOlB/mgnK3M9O9ZQxQ8VQvN1HJHaeO9oDwjoUaORS5Dg0vg7EKZBvYaUp311SZ3NVuV2jt/OXuc49fXjsbe+tQXw/6J0fi150GHrRVvRI5e8YvDg6Frw3Wb/vFLwv6A2nsEDaW7fl/2//MJKl6bYXREHvIoDNOw+GQXwewBzjao2LH64lMM3YfOErcOhhR8Z2gjURR18sZULB4LKxJEscKfvpEv5o5rxXfVxNSWQWwMEQYijY/VJw+1Kp/0PfmqRyJtlD3d3dMjPL0e3TZhROLlO/YCqR28VakGzvghmwUNbIIb/mBHIqkboTkklJ9mh1CR7WGR6avDMGm1iKR/cyqm+5sCK04eSUOBHwq7CLVkr3IFpSGIZnxG1KvVTu5cyN1sb6Mu8SxJL7+OPY/PSpMvCIXmg/Iyj0UCpB/GQbPpMced/FkYf21Z9t//Dpj1X75gP6vmACMYtmsDO2HuxnrgsS6mxM1kIozLR5ayQ4Fda0wmMYbcGwiVyfibbbjXfvRXF44/09CL1fH+3k4W/dJWlQ42hnzbHknv8BXkCfFg==`;

var EXAMPLE1 = `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`;

var EXAMPLE_DEFAULT = `EDS0040000eJytVN9v00AM/leieyWM/GgniBCivICE4GVoL9MUuTk3PfVyF91dunbT+NuxkzZZAQ0VqKLq4rM/f/7s+EFoNHVYi2IWCwkBRHHzIJQURRqLFhyaIIokFsrI47GyWkPrkXxWoD2Sn7OtF8WDME4UQsQi7Fuk0wKM150KytRkBDABdNlayiiKLBZL9NUaXcPXhZBqtULOpxA1uzctOqgJ53I+IJYbWKIuDZQBtUbOle3SS/I9iS0l6gDlFJ8nxBqkQz+xK0/T9faqc1ssoQu2AQiD7RRZ+dKjxoreVmP1G+tCX+aWarE1F8eRBqB5km/gvrXWTezFYyy87VyFWnlKaDqtH+NB/mySP53kT8+R/4N1kt6IdI0AdC6C6/Aps1GUZ4jkE5FsIpKdQ+Sz+68T8LvO/NpzisCNP7RxUF/bCsidTF9fLc4chAGBtFSmXHbKj0X//YSMkKTLHd6regw4duiZtsymtuRTW/J/m4+f0v9hQG7pngrdEtZNP1mnf3TNRG/SOIvzeHbLRJQJZYClRqaDhk8LkrntezZM5xpVveZRv3wTiwZ2d0ryekpfp6y1bzXsB/eEFaiZHm2skygfwA27yhN2H8tk2bsBt0HnhwoI30qkpgRVAfce6MP04gCwHxH2B9wWaLy8uu9324w1YWk5HHt9V4oGGxq+RjTSAUie7wYuUDKsvTP9d39NW4A1jhbVOmB/fLt0764CRYQo4XNCv4joEk5ANnxDXUQv8iwi+/Fh+8erL0f76QW+bEBRzPaQ7ALGZO+lbVCZiyVy+w1Ve1hISmLD829NcJYFYaDeZ2V520a7KMuT6+j7PIk+3bMA9Klwk+eDlFy4VEE8/gDGURmI`;
