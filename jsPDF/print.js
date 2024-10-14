function printPDF(svg, format="A4", sizex, sizey, owner="", installer="", control="", info="", DPI=300, page=1, maxpage=1, filename="eendraadschema_print.pdf", statuscallback) { // Defaults to A4 and 300 DPI but 600 DPI is better

    if (format=="A3") {
        paperdetails = { // All sizes in millimeters
            paperwidth: 420,
            paperheight: 297,

            paper_margin: 10,
            svg_padding: 5, //minimal size to keep below svg before the text boxes start

            drawnby_box_height: 5,

            owner_box_height: 30,
            owner_box_width: 80
        };
    } else {
        paperdetails = { // All sizes in millimeters
            paperwidth: 297,
            paperheight: 210,

            paper_margin: 10,
            svg_padding: 5, //minimal size to keep below svg before the text boxes start

            drawnby_box_height: 5,

            owner_box_height: 30,
            owner_box_width: 80
        };
    }    

    // ___ FUNCTION svgToPng ___
    //
    // Converts SVG with dimensions sizex and sizey to a PNG for use in the PDF document.
    // Ensures the desired DPI is respected.  Then calls function given by callback.

    function svgToPng(svg, sizex, sizey, callback) {

        let max_height_in_mm = paperdetails.paperheight - 2 * paperdetails.paper_margin - paperdetails.owner_box_height - paperdetails.drawnby_box_height - paperdetails.svg_padding;
        let max_width_in_mm = paperdetails.paperwidth - 2 * paperdetails.paper_margin;

        let max_height_in_pixels = max_height_in_mm/25.4*DPI;
        let max_width_in_pixels = max_width_in_mm/25.4*DPI;

        let scale = Math.min(max_height_in_pixels/sizey, max_width_in_pixels/sizex);

        let scaledsvg = '<svg width="' + (sizex * scale) + '" height="' + (sizey * scale) 
                    + '" viewBox="0 0 ' + sizex + ' ' + sizey + '" xmlns="http://www.w3.org/2000/svg">'
                    + svg + '</svg>';

        const svgBlob = new Blob([scaledsvg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const png = canvas.toDataURL('image/png');
            callback(png,scale);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }

    function htmlToPDFlines(doc,html) {

        function htmlToUnicode(html) {
            // Create a temporary element to hold the HTML
            const tempElement = document.createElement('div');
            tempElement.innerHTML = html;

            // Replace <br> tags with \n
            //tempElement.innerHTML = tempElement.innerHTML.replace(/<br>/g, "\n");
        
            // Use the textContent property to get the Unicode string
            const unicodeString = tempElement.textContent || tempElement.innerText || '';
            return unicodeString;
        }

        let printlines = [];

        lines = html.split(/<br>|<\/div><div>/);
        lines = lines.map(htmlToUnicode);
        for (let line of lines) {
            let wrappedlines = doc.splitTextToSize(line, paperdetails.owner_box_width - 2 * 2 - 3);
            printlines = printlines.concat(wrappedlines);    
        }

        return printlines;
    }

    // ___ FUNCTION generatePDF ___
    //
    // Makes the actual PDF

    function generatePDF(svg, sizex, sizey) {
        const { jsPDF } = window.jspdf;
        var doc;

        if (format=="A3") {
            doc = new jsPDF('landscape', 'mm', 'a3', true);
        } else {
            doc = new jsPDF('landscape', 'mm', 'a4', true);
        }

        svgToPng(svg, sizex, sizey, function(png,scale) {

            let canvasx = (paperdetails.paperwidth - 2*paperdetails.paper_margin);
            let canvasy = (paperdetails.paperheight - 2*paperdetails.paper_margin - paperdetails.owner_box_height - paperdetails.drawnby_box_height - paperdetails.svg_padding);

            if (sizex/sizey > canvasx/canvasy) { //width is leading
                let max_height_in_mm = paperdetails.paperheight - 2 * paperdetails.paper_margin - paperdetails.owner_box_height - paperdetails.drawnby_box_height - paperdetails.svg_padding;
                //let max_height_in_pixels = max_height_in_mm/25.4*DPI;
                let shiftdown = (max_height_in_mm - sizey/sizex*canvasx)/2;
                doc.addImage(png, 'PNG', paperdetails.paper_margin, paperdetails.paper_margin+shiftdown, canvasx, sizey/sizex * canvasx, undefined, 'FAST');
            } else { //height is leading
                doc.addImage(png, 'PNG', paperdetails.paper_margin, paperdetails.paper_margin, sizex/sizey * canvasy, canvasy, undefined, 'FAST');
            }

            // Set the properties to remove margins
            doc.setProperties({
                title: 'Eendraadschema.pdf',
                subject: 'Eendraadschema',
                author: 'eendraadschema.goethals-jacobs.be',
                keywords: 'eendraadschema, online',
                creator: 'eendraadschema.goethals-jacobs.be'
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

            const fontSize = 8; // Set your font size
            const textHeight = fontSize * 0.352778; // 1 point = 0.352778 mm

            doc.setFont("helvetica", "bold");
            doc.setFontSize(fontSize); 
        
            doc.text("Getekend met https://www.eendraadschema.goethals-jacobs.be", 
                     startx + 2, // Leave 2mm at the left of the drawn by text
                     paperdetails.paperheight - paperdetails.paper_margin - (paperdetails.drawnby_box_height-textHeight)/2 - textHeight/6);

            doc.text('pagina. ' + page + '/' + maxpage, 
                     startx + 3 * paperdetails.owner_box_width + 2, //Leave 2mm at the left 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight + 1.5 ); //Leave 1.55mm at the top

            doc.text("Eendraadschema", 
                     startx + 3 * paperdetails.owner_box_width + 2, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight * (1 + 1.2) + 1.5);

            doc.text(htmlToPDFlines(doc,"Erkend Organisme"), 
                    startx + 2, 
                    paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight + 1.5);

            doc.text(htmlToPDFlines(doc,"Plaats van de elektrische installatie"), 
                     startx + paperdetails.owner_box_width + 2, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight + 1.5);

            doc.text(htmlToPDFlines(doc,"Installateur"), 
                    startx + (2*paperdetails.owner_box_width) + 2, 
                    paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight + 1.5);

            doc.setFont("helvetica", "normal");

            doc.text(htmlToPDFlines(doc,control).slice(0,8), 
                    startx + 2 + 3, 
                    paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight * (1+1.2) + 1.5);

            doc.text(htmlToPDFlines(doc,owner).slice(0,8), 
                     startx + paperdetails.owner_box_width + 2 + 3, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight * (1+1.2) + 1.5);

            doc.text(htmlToPDFlines(doc,installer).slice(0,8), 
                     startx + (2*paperdetails.owner_box_width) + 2 + 3, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight * (1+1.2) + 1.5);

            let infoshorter = info.replace('https://www.eendraadschema.goethals-jacobs.be','eendraadschema');
            doc.text(htmlToPDFlines(doc,infoshorter).slice(0,8), 
                     startx + (3*paperdetails.owner_box_width) + 2 + 3, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight * (1+3*1.2) + 1.5);

            doc.save(filename);
            statuscallback.innerHTML = 'PDF is klaar. Kijk in uw Downloads folder indien deze niet spontaan wordt geopend.';

            //--- functions that could be useful some day ---
            //const textWidth = doc.getTextWidth("Page 1");
            //doc.addPage();
            
            // Open PDF in a new tab with the correct filename
            //const pdfBlob = doc.output('blob');
            //doc.output('dataurlnewwindow');
            /*const pdfBlob = doc.output('pdfjsnewwindow');
            const url = URL.createObjectURL(pdfBlob);
            window.open(url, '_blank');*/

            //window.open(doc.output('bloburl'), '_blank');
        });
    }

    statuscallback.innerHTML = 'PDF wordt gegenereerd. Even geduld..';
    generatePDF(svg, sizex, sizey);

}