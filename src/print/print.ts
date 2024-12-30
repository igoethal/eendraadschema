function HLDisplayPage() {
    structure.print_table.displaypage = parseInt((document.getElementById("id_select_page") as HTMLInputElement).value)-1;
    printsvg();
}

function dosvgdownload() {
    var prtContent = document.getElementById("printsvgarea").innerHTML;
    var filename = (document.getElementById("dosvgname") as HTMLInputElement).value;
    download_by_blob(prtContent, filename, 'data:image/svg+xml;charset=utf-8'); //Was text/plain
}

function getPrintSVGWithoutAddress(outSVG: SVGelement, page:number = structure.print_table.displaypage) {
    var scale = 1;

    var startx = structure.print_table.pages[page].start;
    var width = structure.print_table.pages[page].stop - startx;
    var starty = structure.print_table.getstarty();
    var height = structure.print_table.getstopy() - starty;

    var viewbox = '' + startx + ' ' + starty + ' ' + width + ' ' + height;

    var outstr = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="scale(1,1)" style="border:1px solid white" ' +
              'height="' + (height*scale) + '" width="' + (width*scale) + '" viewBox="' + viewbox + '">' +
              flattenSVGfromString(outSVG.data) + '</svg>';

    return(outstr);
}

function printsvg() {

    function generatePdf() {
        if (typeof(structure.properties.dpi) == 'undefined') structure.properties.dpi = 300;
    
        let svg = flattenSVGfromString(structure.toSVG(0,"horizontal").data);
        const pages = Array.from({ length: structure.print_table.pages.length }, (_, i) => i+1);  

        const sitplanprint = structure.sitplan.toSitPlanPrint();
    
        printPDF(
            svg,
            structure.print_table,
            structure.properties,
            pages, 
            (document.getElementById("dopdfname") as HTMLInputElement).value, //filename
            document.getElementById("progress_pdf"), //HTML element where callback status can be given
            sitplanprint
        );
    }

    function renderPrintSVG(outSVG: SVGelement) {
        document.getElementById("printarea").innerHTML = '<div id="printsvgarea">' +
                                                            getPrintSVGWithoutAddress(outSVG) +
                                                        '</div>';
    }
    
    // First we generate an SVG image. We do this first because we need the size
    // We will display it at the end of this function    

    var outSVG = new SVGelement();
    outSVG = structure.toSVG(0,"horizontal");

    var height = outSVG.yup + outSVG.ydown;
    var width = outSVG.xleft + outSVG.xright;

    structure.print_table.setHeight(height);
    structure.print_table.setMaxWidth(width+10);

    // Then we display all the print options

    let outstr: string = "";
    var strleft: string = "";


    document.getElementById("configsection").innerHTML
        =  '<div>'
        +  '    <button id="button_pdfdownload">Genereer PDF</button>' // Generate PDF button comes here
        +  '    <span id="select_papersize"></span>' // Selector to choose "A3" and "A4" comes here
        +  '    <span id="select_dpi"></span>' // Selector for dpi 300 or 600 comes here
        +  '    <input id="dopdfname" size="20" value="eendraadschema_print.pdf">&nbsp;' // Input box for filename of pdf document
        +  '    <span id="progress_pdf"></span>' // Area where status of pdf generation can be displayed
        +  '</div>';

    document.getElementById('button_pdfdownload').onclick = generatePdf;
    structure.print_table.insertHTMLselectPaperSize(document.getElementById('select_papersize') as HTMLElement, printsvg);
    structure.print_table.insertHTMLselectdpi(document.getElementById('select_dpi') as HTMLElement, printsvg);
    
    outstr 
        =  '<br>'
        +  '<div>'
        +  '    <span style="margin-right: 2em" id="check_autopage"></span>' // Checkbox to choose if we want to auto paginate or not comes here
        +  '    <span style="margin-right: 2em" id="id_verticals"></span>' // An optional area to choose what part of the y-space of the image is shown
        +  '    <span id="id_suggest_xpos_button"></span>' // A button to force auto pagination comes here
        +  '</div>';

    document.getElementById("configsection").insertAdjacentHTML('beforeend', outstr);

    structure.print_table.insertHTMLcheckAutopage(document.getElementById('check_autopage') as HTMLElement, printsvg);
    if (!structure.print_table.enableAutopage) {
        structure.print_table.insertHTMLchooseVerticals(document.getElementById('id_verticals') as HTMLElement, printsvg);
        structure.print_table.insertHTMLsuggestXposButton(document.getElementById('id_suggest_xpos_button') as HTMLElement, printsvg);
    }

    if (!structure.print_table.enableAutopage) {
        outstr 
            = '<br>'
            +  '<table border="0">'
            +  '    <tr>'
            +  '        <td style="vertical-align:top;">'
            +  '            <div id="id_print_table"></div>' // Table with all startx and stopx comes here
            +  '        </td>'
            +  '        <td style="vertical-align:top;padding:5px">'
            +  '            <div>Klik op de groene pijl om het schema over meerdere pagina\'s te printen en kies voor elke pagina de start- en stop-positie in het schema (in pixels).</div>'
            +  '            <div>Onderaan kan je bekijken welk deel van het schema op welke pagina belandt.</div>'
            +  '        </td>'
            +  '    </tr>'
            +  '</table>'
            +  '<br>';
        
        document.getElementById("configsection").insertAdjacentHTML('beforeend', outstr);    

        structure.print_table.insertHTMLposxTable(document.getElementById('id_print_table') as HTMLElement, printsvg)
    }

    strleft += '<hr>';

    strleft += '<b>Printvoorbeeld: </b>Pagina <select onchange="HLDisplayPage()" id="id_select_page">'
    for (let i=0; i<structure.print_table.pages.length; i++) {
        if (i==structure.print_table.displaypage) {
            strleft += '<option value=' + (i+1) + ' selected>' + (i+1) + '</option>';
        } else {
            strleft += '<option value=' + (i+1) + '>' + (i+1) + '</option>';
        }  
    }
    strleft += '</select>&nbsp;&nbsp;(Enkel tekening, kies "Genereer PDF" om ook de tekstuele gegevens te zien)';
    
    strleft += '<br><br>';
    
    strleft += '<table border="0"><tr><td style="vertical-align:top"><button onclick="dosvgdownload()">Zichtbare pagina als SVG opslaan</button></td><td>&nbsp;</td><td style="vertical-align:top"><input id="dosvgname" size="20" value="eendraadschema_print.svg"></td><td>&nbsp;&nbsp;</td><td>Sla tekening hieronder op als SVG en converteer met een ander programma naar PDF (bvb Inkscape).</td></tr></table><br>';
    
    strleft += displayButtonPrintToPdf(); // This is only for the online version

    strleft += '<div id="printarea"></div>';

    document.getElementById("configsection").insertAdjacentHTML('beforeend', strleft);

    // Finally we show the actual SVG

    renderPrintSVG(outSVG);

    toggleAppView('config');
}