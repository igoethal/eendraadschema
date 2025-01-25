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
                  <button style="font-size:14px" id="Btn_downloadManual">Eéndraadschema</button>
                </td>
                <td style="vertical-align:top;padding:7px">
                  Een volledige handleiding is beschikbaar in PDF formaat.
                  Klik links om deze in een ander venster te openen.
                  <br>
                  Het programma is in volle ontwikkeling dus delen van de handleiding zijn
                  mogelijk ietwat verouderd.  
                </td>
              </tr>
              <tr>
                <td width=100 style="vertical-align:top;padding:5px">
                  <button style="font-size:14px" id="Btn_downloadSitPlanManual">Situatieschema</button>
                </td>
                <td style="vertical-align:top;padding:7px">
                  Specifiek voor het werken met het situatieschema werd een ander korter document opgesteld.
                  Klik link om deze in een ander venster te openen.
                </td>
              </tr>
            </table>
        </td>
      </tr>
    </table>`;

    document.getElementById("configsection").innerHTML = strleft;
    toggleAppView('config');

    (document.getElementById('Btn_downloadManual') as HTMLElement).onclick = () => { window.open('Documentation/edsdoc.pdf', '_blank') };
    (document.getElementById('Btn_downloadSitPlanManual') as HTMLElement).onclick = () => { window.open('Documentation/sitplandoc.pdf', '_blank') };
}