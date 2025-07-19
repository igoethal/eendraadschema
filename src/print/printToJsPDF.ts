// Import jsPDF types if available (otherwise use 'any')
declare global {
    interface Window {
        jspdf: any;
    }
}

type PrintTable = {
    papersize: string;
    pages: { start: number; stop: number }[];
    starty: number;
    stopy: number;
};

type Properties = {
    dpi?: number;
    control: string;
    owner: string;
    installer: string;
    info: string;
};

type SitPlanPrint = {
    numpages: number;
    pages: { svg: string; sizex: number; sizey: number }[];
};

type StatusCallback = { innerHTML: string };

export function printPDF(
    svg: string,                            // SVG van het eendraadschema
    print_table: PrintTable,                // Informatie over de paginering van het eendraadschema
    properties: Properties,                 // Extra informatie zoals eigenaar, installateur, etc.  Ook het aantal DPI
    pagerange: string,                      // Pagina's die moeten worden afgedrukt, in de vorm "1-3,5,7-9" of "1,2,3" of "1-3"
    //pages: number[] = [1],                // Pagina's die moeten worden afgedrukt, standaard is pagina 1
    filename = "eendraadschema_print.pdf",  // Filename van de PDF die gegenereerd wordt
    statuscallback: StatusCallback,         // Via deze functie wordt de voortgang doorgegeven aan een oproepend element (doorgaans GUI)
    sitplanprint: SitPlanPrint              // Informatie over het situatieschema
): void {
    let paperdetails: any;

    if (print_table.papersize === "A3") {
        paperdetails = { // All sizes in millimeters
            paperwidth: 420,
            paperheight: 297,
            paper_margin: 10,
            svg_padding: 5, //minimal size to keep below svg before the text boxes start
            drawnby_box_height: 5,
            owner_box_height: 30,
            owner_box_width: 80,
        };
    } else {
        paperdetails = { // All sizes in millimeters
            paperwidth: 297,
            paperheight: 210,
            paper_margin: 10,
            svg_padding: 5, //minimal size to keep below svg before the text boxes start
            drawnby_box_height: 5,
            owner_box_height: 30,
            owner_box_width: 80,
        };
    }

    let pages: (number | null)[];
    const totalPages = print_table.pages.length + sitplanprint.numpages;

    // Initialize all as null
    pages = Array(totalPages).fill(null);

    // Parse custom ranges
    const ranges = pagerange.split(',').map(r => r.trim());
    for (const range of ranges) {
        if (range.includes('-')) {
            const [start, end] = range.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end)) {
                for (let i = start; i <= end; i++) {
                    if (i >= 1 && i <= totalPages) pages[i - 1] = i;
                }
            }
        } else {
            const pageNum = Number(range);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                pages[pageNum - 1] = pageNum;
            }
        }
    }

    function svgToPng( svg: string, sizex: number, sizey: number,
             callback: (png: string, scale: number) => void ) {

        const max_height_in_mm =
            paperdetails.paperheight -
            2 * paperdetails.paper_margin -
            paperdetails.owner_box_height -
            paperdetails.drawnby_box_height -
            paperdetails.svg_padding;

        const max_width_in_mm =
            paperdetails.paperwidth - 2 * paperdetails.paper_margin;

        const dpi = properties.dpi || 300;
        const max_height_in_pixels = (max_height_in_mm / 25.4) * dpi;
        const max_width_in_pixels = (max_width_in_mm / 25.4) * dpi;

        const scale = Math.min(
            max_height_in_pixels / sizey,
            max_width_in_pixels / sizex
        );

        const scaledsvg =
            `<svg width="${sizex * scale}" height="${sizey * scale}" viewBox="0 0 ${sizex} ${sizey}" xmlns="http://www.w3.org/2000/svg">` +
            svg +
            "</svg>";

        const url =
            "data:image/svg+xml; charset=utf8, " +
            encodeURIComponent(scaledsvg);

        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            (canvas as any).crossOrigin = "anonymous";
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                let png: string | null = null;
                try {
                    png = canvas.toDataURL("image/png");
                } catch (e) {
                    if (img.complete) {
                        alert(
                            "Er is een element in het situatieschema dat verwijst naar een andere website en dit veroorzaakt een security-error in deze browser. Dit kan bijvoorbeeld gebeuren indien u een plattegrond gemaakt heeft met online tools zoals draw.io. Probeer uw plattegrond op te slaan in een ander formaat. Indien het probleem blijft aanhouden, contacteer ons dan via het contactformulier."
                        );
                    } else {
                        alert(
                            "Het genereren van de PDF is om onduidelijke redenen vastgelopen. Contacteer ons via het contactformulier."
                        );
                    }
                    return;
                }
                callback(png, scale);
                URL.revokeObjectURL(url);
                canvas.remove();
            }
        };
        img.src = url;
    }

    function htmlToPDFlines(doc: any, html: string): string[] {
        function htmlToUnicode(html: string): string {
            const tempElement = document.createElement("div");
            tempElement.innerHTML = html;
            return tempElement.textContent || tempElement.innerText || "";
        }

        let printlines: string[] = [];
        html = html.replace(/<div>/g, "");
        let lines = html.split(/<br>|<\/div>/).map(htmlToUnicode);
        for (let line of lines) {
            let wrappedlines = doc.splitTextToSize(
                line,
                paperdetails.owner_box_width - 2 * 2 - 3
            );
            printlines = printlines.concat(wrappedlines);
        }
        return printlines;
    }

    function init() {
        const { jsPDF } = window.jspdf;
        let doc: any;
        if (print_table.papersize === "A3") {
            doc = new jsPDF("landscape", "mm", "a3", true);
        } else {
            doc = new jsPDF("landscape", "mm", "a4", true);
        }
        return doc;
    }

    function addPage(doc: any, svg: string, sizex: number, sizey: number, callback: (doc: any, iter: number) => void, iter = 0) {

        svgToPng(svg, sizex, sizey, function (png, scale) {
            let canvasx = paperdetails.paperwidth - 2 * paperdetails.paper_margin;
            let canvasy = paperdetails.paperheight - 2 * paperdetails.paper_margin - paperdetails.owner_box_height - paperdetails.drawnby_box_height - paperdetails.svg_padding;

            if (sizex * sizey > 0) { //width is leading
                if (sizex / sizey > canvasx / canvasy) {
                    let max_height_in_mm = paperdetails.paperheight - 2 * paperdetails.paper_margin - paperdetails.owner_box_height - paperdetails.drawnby_box_height - paperdetails.svg_padding;
                    let shiftdown = (max_height_in_mm - (sizey / sizex) * canvasx) / 2;
                    doc.addImage(png, "PNG", paperdetails.paper_margin, paperdetails.paper_margin + shiftdown, canvasx, (sizey / sizex) * canvasx, undefined, "FAST");
                } else { //height is leading
                    doc.addImage(png, "PNG", paperdetails.paper_margin, paperdetails.paper_margin, (sizex / sizey) * canvasy, canvasy, undefined, "FAST");
                }
            }

            doc.setProperties({
                title: "Eendraadschema.pdf",
                subject: "Eendraadschema",
                author: "eendraadschema.goethals-jacobs.be",
                keywords: "eendraadschema, online",
                creator: "eendraadschema.goethals-jacobs.be",
            });

            let startx = paperdetails.paperwidth - (297 - paperdetails.paper_margin); //In "A4" we fill everything, in A3 we squeeze to the right

            doc.rect(startx, // Drawn by box below
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height,
                     3 * paperdetails.owner_box_width,
                     paperdetails.drawnby_box_height);
            doc.rect(startx, // first large box from left to right
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height,
                     paperdetails.owner_box_width,
                     paperdetails.owner_box_height);
            doc.rect(startx + paperdetails.owner_box_width, // second large box from left to right
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height,
                     paperdetails.owner_box_width,
                     paperdetails.owner_box_height);
            doc.rect(startx + 2 * paperdetails.owner_box_width, // third large box from left to right
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height,
                     paperdetails.owner_box_width,
                     paperdetails.owner_box_height);
            doc.rect(startx + 3 * paperdetails.owner_box_width, // Last box at the right
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height,
                     paperdetails.paperwidth - paperdetails.paper_margin - startx - 3 * paperdetails.owner_box_width,
                     paperdetails.drawnby_box_height + paperdetails.owner_box_height);

            const fontSize = 8;
            const textHeight = fontSize * 0.352778; // 1 point = 0.352778 mm

            doc.setFont("helvetica", "bold");
            doc.setFontSize(fontSize);

            doc.text("Getekend met https://eendraadschema.goethals-jacobs.be", 
                     startx + 2, // Leave 2mm at the left of the drawn by text
                     paperdetails.paperheight - paperdetails.paper_margin - (paperdetails.drawnby_box_height - textHeight) / 2 - textHeight / 6);

            let page = iter + 1;
            let maxpages = print_table.pages.length + sitplanprint.numpages;

            doc.text("pagina. " + page + "/" + maxpages,
                     startx + 3 * paperdetails.owner_box_width + 2, //Leave 2mm at the left 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight + 1.5);

            let pagename = iter < print_table.pages.length ? "Eendraadschema" : "Situatieschema";

            doc.text(pagename, 
                     startx + 3 * paperdetails.owner_box_width + 2, //Leave 2mm at the left 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight * (1 + 1.2) + 1.5);
            
            doc.text(htmlToPDFlines(doc, "Erkend Organisme"), 
                     startx + 2,
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight + 1.5);

            doc.text(htmlToPDFlines(doc, "Plaats van de elektrische installatie"), 
                     startx + paperdetails.owner_box_width + 2, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight + 1.5);

            doc.text(htmlToPDFlines(doc, "Installateur"), 
                     startx + 2 * paperdetails.owner_box_width + 2, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight + 1.5);

            doc.setFont("helvetica", "normal");

            doc.text(htmlToPDFlines(doc, properties.control).slice(0, 8),
                                    startx + 2 + 3,
                                    paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight * (1 + 1.2) + 1.5);

            doc.text(htmlToPDFlines(doc, properties.owner).slice(0, 8), 
                     startx + paperdetails.owner_box_width + 2 + 3, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight * (1 + 1.2) + 1.5);

            doc.text(htmlToPDFlines(doc, properties.installer).slice(0, 8), 
                     startx + 2 * paperdetails.owner_box_width + 2 + 3, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight * (1 + 1.2) + 1.5);

            let infoshorter = properties.info.replace("https://www.eendraadschema.goethals-jacobs.be", "eendraadschema");

            doc.text(htmlToPDFlines(doc, infoshorter).slice(0, 8), 
                     startx + 3 * paperdetails.owner_box_width + 2 + 3,
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight / 6 + textHeight * (1 + 3 * 1.2) + 1.5);

            callback(doc, iter + 1);
        });
    }

    function cropSVG(svg: string, page: number): string {
        let startx = print_table.pages[page].start;
        let width = print_table.pages[page].stop;
        let starty = print_table.starty;
        let height = print_table.stopy - starty;

        let viewbox = `${startx} ${starty} ${width} ${height}`;

        let outsvg =
            `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="scale(1,1)" style="border:1px solid white" ` +
            `height="${height}" width="${width}" viewBox="${viewbox}">` +
            svg +
            "</svg>";

        return outsvg;
    }

    function nextpage(doc: any, iter = 0) {

        // Check if this is the first page we will print
        let firstpage = false;
        let idx = pages.findIndex((page) => page !== null);
        if (iter === idx) firstpage = true;
        
        if (iter < print_table.pages.length) {
            if (pages[iter] == null) {
                nextpage(doc, iter + 1);
            } else {
                statuscallback.innerHTML = "Pagina " + pages[iter] + " wordt gegenereerd. Even geduld..";

                if (!firstpage) doc.addPage();

                let sizex = print_table.pages[pages[iter] - 1].stop - print_table.pages[pages[iter] - 1].start;
                let sizey = print_table.stopy - print_table.starty;

                addPage(doc, cropSVG(svg, pages[iter] - 1), sizex, sizey, nextpage, iter);
            }
        } else if (iter < pages.length) {
            if (pages[iter] == null) {
                nextpage(doc, iter + 1);
            } else {
                statuscallback.innerHTML = "Pagina " + (iter + 1) + " wordt gegenereerd. Even geduld..";

                if (!firstpage) doc.addPage();

                let toprint = sitplanprint.pages[iter - print_table.pages.length];
                addPage(doc, toprint.svg, toprint.sizex, toprint.sizey, nextpage, iter);
            }
        } else {
            save(doc);
        }
    }

    function save(doc: any) {
        doc.save(filename);
        statuscallback.innerHTML = "PDF is klaar. Kijk in uw Downloads folder indien deze niet spontaan wordt geopend.";
    }

    statuscallback.innerHTML = "PDF wordt gegenereerd. Even geduld..";
    let doc = init();
    nextpage(doc, 0);
}