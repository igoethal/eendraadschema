import { download_by_blob } from "../importExport/importExport";
import { SVGelement } from "../SVGelement";
import { flattenSVGfromString } from "../general";
import { printPDF } from './printToJsPDF';

globalThis.HLDisplayPage = () => {
    globalThis.structure.print_table.displaypage = parseInt((document.getElementById("id_select_page") as HTMLInputElement).value)-1;
    printsvg();
}

globalThis.dosvgdownload = () => {
    const printsvgarea = document.getElementById("printsvgarea");    
    let filename: string;

    if (printsvgarea == null) return;
    let prtContent = printsvgarea.innerHTML;
 
    const dosvgname = (document.getElementById("dosvgname") as HTMLInputElement);
    if (dosvgname == null)
        filename = "eendraadschema.svg";
    else
        filename = (document.getElementById("dosvgname") as HTMLInputElement).value;

    download_by_blob(prtContent, filename, 'data:image/svg+xml;charset=utf-8'); //Was text/plain
}

export function getPrintSVGWithoutAddress(outSVG: SVGelement, page:number = globalThis.structure.print_table.displaypage) {
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

export function printsvg() {

    function generatePdf() {

        if (typeof(globalThis.structure.properties.dpi) == 'undefined') globalThis.structure.properties.dpi = 300;
    
        let svg = flattenSVGfromString(globalThis.structure.toSVG(0,"horizontal").data);
        
        let pages: (number | null)[];
        const totalPages = globalThis.structure.print_table.pages.length + (globalThis.structure.sitplan ? globalThis.structure.sitplan.getNumPages() : 0);

        const modeSelect = document.getElementById("print_page_mode") as HTMLSelectElement | null;
        const rangeInput = document.getElementById("print_page_range") as HTMLInputElement | null;
        if (!globalThis.structure.print_table.canPrint()) {
            modeSelect.value = "all";
            rangeInput.value = "";
            rangeInput.style.display = "none";
            let rangeError = document.getElementById("print_range_error");
            if (rangeError) {
                rangeError.style.display = "none";
            }
        }

        let pagerange = "1-" + totalPages; // Default to all pages

        if (modeSelect && modeSelect.value === "custom" && rangeInput && rangeInput.value.trim() !== "") {
            pagerange = rangeInput.value.trim();
        }

        const sitplanprint = globalThis.structure.sitplan.toSitPlanPrint();
    
        printPDF(
            svg,
            globalThis.structure.print_table,
            globalThis.structure.properties,
            pagerange,
            (document.getElementById("dopdfname") as HTMLInputElement).value, //filename
            document.getElementById("progress_pdf"), //HTML element where callback status can be given
            sitplanprint
        );
    }

    function renderPrintSVG_EDS(outSVG: SVGelement) {
        const printarea = document.getElementById("printarea");
        if (printarea == null) return;
        printarea.innerHTML = '<div id="printsvgarea">' + getPrintSVGWithoutAddress(outSVG) + '</div>';
    }

    function renderPrintSVG_sitplan(page: number) {
        const outstruct = globalThis.structure.sitplan.toSitPlanPrint();
        const printarea = document.getElementById("printarea");
        if (printarea == null) return;
        printarea.innerHTML = '<div id="printsvgarea">' + outstruct.pages[page].svg + '</div>';
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

    const configsection = document.getElementById("configsection");
    if (configsection != null)
        configsection.innerHTML 
            = '<div>'
            +   '<button id="button_pdfdownload">Genereer PDF</button>&nbsp;'
            +   '<span id="select_papersize"></span>&nbsp;'
            +   '<span id="select_dpi"></span>&nbsp;'
            +   '<input id="dopdfname" size="20" value="eendraadschema_print.pdf">&nbsp;'
            +   '<span id="progress_pdf"></span>' // Area where status of pdf generation can be displayed
            + '</div>'
            + '<div id="select_page_range"></div>';

    const button_pdfdownload = document.getElementById('button_pdfdownload');
    if (button_pdfdownload != null)
        button_pdfdownload.onclick = generatePdf;

    globalThis.structure.print_table.insertHTMLselectPaperSize(document.getElementById('select_papersize') as HTMLElement, printsvg);
    globalThis.structure.print_table.insertHTMLselectdpi(document.getElementById('select_dpi') as HTMLElement, printsvg);

    // Insert page range selector
    globalThis.structure.print_table.insertHTMLselectPageRange(document.getElementById('select_page_range') as HTMLElement, printsvg);

    outstr 
        = '<div>'
        +   '<span style="margin-right: 2em" id="check_autopage"></span>' // Checkbox to choose if we want to auto paginate or not comes here
        +   '<span style="margin-right: 2em" id="id_verticals"></span>' // An optional area to choose what part of the y-space of the image is shown
        +   '<span id="id_suggest_xpos_button"></span>' // A button to force auto pagination comes here
        + '</div>';

    if (configsection != null)
        configsection.insertAdjacentHTML('beforeend', outstr);
        
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
        
        if (configsection != null)
            configsection.insertAdjacentHTML('beforeend', outstr);    

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
    
    strleft += globalThis.displayButtonPrintToPdf(); // This is only for the online version

    strleft += '<div id="printarea"></div>';

    if (configsection != null)
        configsection.insertAdjacentHTML('beforeend', strleft);

    // Finally we show the actual SVG

    if (globalThis.structure.print_table.displaypage < globalThis.structure.print_table.pages.length) { //displaypage starts counting at 0
        renderPrintSVG_EDS(outSVG);    
    } else {
        renderPrintSVG_sitplan(globalThis.structure.print_table.displaypage - globalThis.structure.print_table.pages.length);
    }

    globalThis.toggleAppView('config');
}