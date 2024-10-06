var CONFIGPAGE_LEFT:string = `
    <br>
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

var EXAMPLE0 = `EDS0040000eJztWe9r6zYU/VeMv84rjp0fNIyxtoO38bZPHd2gPIxi3TiqFcnITtL20fe370h2Yue9NEvSDl6hUIp9pXt1dc6VdBR/9iWprJr549554HNWMX98+9kXHIbAL5ghVfnjMPCF4uvHVEvJipLQZ8pkSehndFH648++Mv7Y/1VMp37gVw8F4e2CqVIuRCVUBiNjqmIyKTSGRWME04TKdEZmbjuMfQ5nsqMKImkd5gUZltlI/bCJmuRsQjJRLKlISrJjRve9IVq3vBNOsmJJJ0Ic2hCMG0K2/jra9pDIGA3pwiwpYYtKzxmr6s7bwUWZlCQpxdt0A0SuTeVmu8SEdObmGMNVMTbvjFjnv9TatDPwnwK/1AuTkhQlRlQLKZ+CmoqopaLXUtH7bypaGi614XhD1hkxhudxZRbUzWwDy55EbJGsM4naTKJjMvloXr0UYPnn5tKLP0TB4JAqsM6Ulw2vNRtSpwwOMJUVU9xhdGSB1IEAsVDJZCHKDRQvqJxNTMC1okeRbTwa5txq21c7Yad4zlvO4pdVz3YSB5bPqFM94XPlU9fli6unpqYSsG3XTrSzdq6u2OH10y2gj7TIkcK3ZfS78lYopOeKaFcNXe0sohqQ162hrcV/sY+z4ffAmdvcn+GsdzxnN2SkSGfNmfR2ibvcR1zcWW2jo9Z9r6XuSoOytOJal7tODxhyGxhwCNmmVxPdROoct00BTFlJFiYuSCVzIgODdd7aeWdE0wqdMproxYpTgqJgOUk0b9LG8DMmpytWkeGW0G5LJ3BjrEMCox1jr/1UAg44mJrozTa3B+R+dCrI0TvIB4PcOxXk+B3kg0EOTwW5/w7yoSDH56eCPHgH+eBKjluQ+51bSv8YxXtjxB15tWBohcPfdla5znFjC/yl7ZK4pqTxetQWeC9n3PWYaSMeLVuSEpzuUtypWuikSMhQ3ccB0FE+lEzQxKuvryKtdRjWvC9pC1yokrKrKg5R5FFvt7zrfzfy7gRJfsl4zuYO3ber7a720taRHVHnJ4HBu7h7xY0k6p+M8ru6Oxzl85NR7si7P2zuqTApVloLUzvhslP6Wzj4fDHBSsSuJbIO1NeFoMz97FRPGTNUDMnbfURi57mjAyCsXYFGLkWOQ+NbR5wC+Q5WmvTdJbVYqMrtGr29v8x17unDU297rw3i20FvdCp60XHoRTvRI5W/YfDi6FTwXmX9vlHwPqE3lMISYW/dlv+//cNIlqbbXhAFvfMAMm8UDIN4FEAc42qNix+uJRDN2HyhK3DoYUfGdoI1EUefLGVCQeCyiSRL3IxEZqEaDEH7nN2vBLefj/qjvpVDZSHZQ+FEmbtPZpaN26+8cEaZ+lNSWenC+Vo45poTMK9E6g4+JiXZE9P1fth0f2iCFAzqrxSP7htT30Jsa8u6kyuwqYAMhQq0FXIP/iSFYXhG3IbUK+W+udxobazc8i7AF7nHnybm5+vKQPp5oX2GU+hlhGMObFrDXyTH3g9x5MG+/rP2D9d/ru3bDfTjnAn4LJvBzthmsF+4npNQZxOyykBhps3HIMFp7kxTbTcN796L4vDG+zIIvd8e7VyhUt1VZ1DDZifJsXCe/gU6jIrZ`;

var EXAMPLE1 = `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`;

var EXAMPLE_DEFAULT = `EDS0040000eJytVE2P0zAQ/SuRr4SSJt09RAhRLiAhuCzaS7WKJvEkteqPyHba7lbltzNO2mYDaFGBKIomY8/Me2/GPjCJuvFrli9ixsEDy1cHJjjL5zFrwaL2LE9iJjQ/m5WRElqHtKcG6ZD2WdM6lh+YtixnLGb+sUWylqCd7IQXuiEngPYgi9ZQRZanMSvRVWu0KiznjIu6xlBPIMqwXbVooaE8tzdDxmIDJcpCQ+FRSgy10v38lvZOYguO0kMxxmcJoQZu0Y3oimm53l91dosFdN4oAD/4ppmFKxxKrOivvrDfGOt7mlviYppALkRqAPWs3oB9a4wd0bNjzJzpbIVSOCqoOymP8SB/Oso/H+WfXyP/B2M5/RHoBgHIzr3t8DmyiygvAMlGIOkIJL0GyGf7Xyfgd535tecUgRt3auOgvjQV0HZyfX2zvHIQhgykpdBF2Ql3If33E3JJSbrs8Ek0l4Bzh15oy2JsSza2Jfu3+fip/B8G5IHWieiWcq36yZp+aDkAXc3jNM7ixUMAIrQvPJQSA5w1imY93CkK9jvBwzWUBEVdK+Gx7RuZBJ5NALGaRDgP9myZlozjw3GgipbE7/nWggYNVOCKqLkF4GHeFMyQO2Jndro/h/d0KgPnaFmtPfbm29K+u/MU4aMk2Ak9UYOK8ngMjm8o8+hVlkbkP7/B//Huy9k/XcDXCgTFbE/FZnAp9p4bhULPSgzt0ETtdEEIjqp31SZcdtE+SrPkPvp+k0SfnkJPaFKDxnQ8lOE9Ty48O/4AHu7vTA==`;
