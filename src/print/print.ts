function HLDisplayPage() {
    globalThis.structure.print_table.displaypage = parseInt((document.getElementById("id_select_page") as HTMLInputElement).value)-1;
    printsvg();
}

function dosvgdownload() {
    var prtContent = document.getElementById("printsvgarea").innerHTML;
    var filename = (document.getElementById("dosvgname") as HTMLInputElement).value;
    download_by_blob(prtContent, filename, 'data:image/svg+xml;charset=utf-8'); //Was text/plain
}

function getPrintSVGWithoutAddress(outSVG: SVGelement, page:number = globalThis.structure.print_table.displaypage) {
    var scale = 1;

    var startx = globalThis.structure.print_table.pages[page].start;
    var width = globalThis.structure.print_table.pages[page].stop - startx;
    var starty = globalThis.structure.print_table.getstarty();
    var height = globalThis.structure.print_table.getstopy() - starty;

    var viewbox = '' + startx + ' ' + starty + ' ' + width + ' ' + height;

    var outstr = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="scale(1,1)" style="border:1px solid white" ' +
              'height="' + (height*scale) + '" width="' + (width*scale) + '" viewBox="' + viewbox + '">' +
              flattenSVGfromString(outSVG.data) + '</svg>';

    return(outstr);
}

function printsvg() {

    function generatePdf() {
        if (typeof(globalThis.structure.properties.dpi) == 'undefined') globalThis.structure.properties.dpi = 300;
    
        let svg = flattenSVGfromString(globalThis.structure.toSVG(0,"horizontal").data);
        const pages = Array.from({ length: globalThis.structure.print_table.pages.length }, (_, i) => i+1);  

        const sitplanprint = globalThis.structure.sitplan.toSitPlanPrint();
    
        printPDF(
            svg,
            globalThis.structure.print_table,
            globalThis.structure.properties,
            pages, 
            (document.getElementById("dopdfname") as HTMLInputElement).value, //filename
            document.getElementById("progress_pdf"), //HTML element where callback status can be given
            sitplanprint
        );
    }

    function renderPrintSVG_EDS(outSVG: SVGelement) {
        document.getElementById("printarea").innerHTML = '<div id="printsvgarea">' +
                                                            getPrintSVGWithoutAddress(outSVG) +
                                                        '</div>';
    }

    function renderPrintSVG_sitplan(page: number) {
        const outstruct = globalThis.structure.sitplan.toSitPlanPrint();

        document.getElementById("printarea").innerHTML = '<div id="printsvgarea">' +
                                                            outstruct.pages[page].svg +
                                                        '</div>';
    }
    
    // First we generate an SVG image. We do this first because we need the size
    // We will display it at the end of this function    

    var outSVG = new SVGelement();
    outSVG = globalThis.structure.toSVG(0,"horizontal");

    var height = outSVG.yup + outSVG.ydown;
    var width = outSVG.xleft + outSVG.xright;

    globalThis.structure.print_table.setHeight(height);
    globalThis.structure.print_table.setMaxWidth(width+10);

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
    globalThis.structure.print_table.insertHTMLselectPaperSize(document.getElementById('select_papersize') as HTMLElement, printsvg);
    globalThis.structure.print_table.insertHTMLselectdpi(document.getElementById('select_dpi') as HTMLElement, printsvg);
    
    outstr 
        =  '<br>'
        +  '<div>'
        +  '    <span style="margin-right: 2em" id="check_autopage"></span>' // Checkbox to choose if we want to auto paginate or not comes here
        +  '    <span style="margin-right: 2em" id="id_verticals"></span>' // An optional area to choose what part of the y-space of the image is shown
        +  '    <span id="id_suggest_xpos_button"></span>' // A button to force auto pagination comes here
        +  '</div>';

    document.getElementById("configsection").insertAdjacentHTML('beforeend', outstr);

    globalThis.structure.print_table.insertHTMLcheckAutopage(document.getElementById('check_autopage') as HTMLElement, printsvg);
    if (!globalThis.structure.print_table.enableAutopage) {
        globalThis.structure.print_table.insertHTMLchooseVerticals(document.getElementById('id_verticals') as HTMLElement, printsvg);
        globalThis.structure.print_table.insertHTMLsuggestXposButton(document.getElementById('id_suggest_xpos_button') as HTMLElement, printsvg);
    }

    if (!globalThis.structure.print_table.enableAutopage) {
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

        globalThis.structure.print_table.insertHTMLposxTable(document.getElementById('id_print_table') as HTMLElement, printsvg)
    }

    strleft += '<hr>';

    const numPages = globalThis.structure.print_table.pages.length + (globalThis.structure.sitplan? globalThis.structure.sitplan.getNumPages() : 0);
    if (globalThis.structure.print_table.displaypage >= numPages) {
        globalThis.structure.print_table.displaypage = numPages-1;
    }

    strleft += '<b>Printvoorbeeld: </b>Pagina <select onchange="HLDisplayPage()" id="id_select_page">'
    for (let i=0; i<numPages; i++) {
        if (i==globalThis.structure.print_table.displaypage) {
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

    if (globalThis.structure.print_table.displaypage < globalThis.structure.print_table.pages.length) { //displaypage starts counting at 0
        renderPrintSVG_EDS(outSVG);    
    } else {
        renderPrintSVG_sitplan(globalThis.structure.print_table.displaypage - globalThis.structure.print_table.pages.length);
    }

    toggleAppView('config');
}