/* FUNCTION showFilePage
   
   Shows the Documentation-Page.

*/

function showDocumentationPage() {

    let strleft = `
    <table border="1px" style="border-collapse:collapse" align="center" width="100%">
      <tr>
        <td width="100%" align="center" bgcolor="LightGrey">
          <b>Handleiding</b>
        </td>
      </tr>
      <tr>
        <td width="100%" align="left">
            <table border=0>
              <tr>
                <td width=100 style="vertical-align:top;padding:5px">
                  <button style="font-size:14px" id="Btn_downloadManual">Download</button>
                </td>
                <td style="vertical-align:top;padding:7px">
                  Een volledige handleiding is beschikbaar in PDF formaat.
                  Click link op "Download" om deze in een ander venster te openen.
                  <br>
                  Het programma is in volle ontwikkeling dus delen van de handleiding zijn
                  mogelijk ietwat verouderd.  
                </td>
              </tr>
            </table>
        </td>
      </tr>
    </table>`;

    document.getElementById("configsection").innerHTML = strleft;
    hide2col();

    (document.getElementById('Btn_downloadManual') as HTMLElement).onclick = () => { window.open('Documentation/edsdoc.pdf', '_blank') };
}