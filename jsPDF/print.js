function printPDF(svg, sizex, sizey, owner="", installer="", info="", DPI=300, page=1, maxpage=1, statuscallback) { // Defaults to A4 and 300 DPI but 600 DPI is better

    paperdetails = { // All sizes in millimeters
        paperwidth: 297,
        paperheight: 210,

        paper_margin: 10,
        svg_padding: 5, //minimal size to keep below svg before the text boxes start

        drawnby_box_height: 5,

        owner_box_height: 30,
        owner_box_width: 80
    };

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

        lines = html.split(/<br>|<div><\/div>/);
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
        const doc = new jsPDF('landscape', 'mm', 'a4', true);

        svgToPng(svg, sizex, sizey, function(png,scale) {

            let canvasx = (paperdetails.paperwidth - 2*paperdetails.paper_margin);
            let canvasy = (paperdetails.paperheight - 2*paperdetails.paper_margin - paperdetails.owner_box_height - paperdetails.drawnby_box_height - paperdetails.svg_padding);

            if (sizex/sizey > canvasx/canvasy) { //width is leading
                doc.addImage(png, 'PNG', paperdetails.paper_margin, paperdetails.paper_margin, canvasx, sizey/sizex * canvasx, undefined, 'FAST');
            } else { //height is leading
                doc.addImage(png, 'PNG', paperdetails.paper_margin, paperdetails.paper_margin, sizex/sizey * canvasy, canvasy, undefined, 'FAST');
            }

            // Set the properties to remove margins
            doc.setProperties({
                title: 'Eendraadschema',
                subject: 'Eendraadschema',
                author: 'eendraadschema.goethals-jacobs.be',
                keywords: 'eendraadschema, online',
                creator: 'eendraadschema.goethals-jacobs.be'
            });

            let pageHeight = 210;
            let pageWidth = 297;
            let margin = 10;

            let largeRecWidth = 80;
            let largeRecHeight = 30;

            let drawnByHeight = 5;

            doc.rect(paperdetails.paper_margin,
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height, 
                     3 * paperdetails.owner_box_width, 
                     paperdetails.drawnby_box_height);
            doc.rect(paperdetails.paper_margin, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height, 
                     paperdetails.owner_box_width, 
                     paperdetails.owner_box_height);
            doc.rect(paperdetails.paper_margin + paperdetails.owner_box_width, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height, 
                     paperdetails.owner_box_width, 
                     paperdetails.owner_box_height);
            doc.rect(paperdetails.paper_margin + 2 * paperdetails.owner_box_width, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height, 
                     paperdetails.owner_box_width,
                     paperdetails.owner_box_height);
            doc.rect(paperdetails.paper_margin + 3 * paperdetails.owner_box_width, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height, 
                     paperdetails.paperwidth - 2 * paperdetails.paper_margin - 3 * paperdetails.owner_box_width, 
                     paperdetails.drawnby_box_height + paperdetails.owner_box_height);

            const fontSize = 8; // Set your font size
            const textHeight = fontSize * 0.352778; // 1 point = 0.352778 mm

            doc.setFont("helvetica", "bold");
            doc.setFontSize(fontSize); 
        
            doc.text("Getekend met https://www.eendraadschema.goethals-jacobs.be", 
                     paperdetails.paper_margin + 2, // Leave 2mm at the left of the drawn by text
                     paperdetails.paperheight - paperdetails.paper_margin - (paperdetails.drawnby_box_height-textHeight)/2 - textHeight/6);

            doc.text('pagina. ' + page + '/' + maxpage, 
                     paperdetails.paper_margin + 3 * paperdetails.owner_box_width + 2, //Leave 2mm at the left 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight + 1.5 ); //Leave 1.55mm at the top

            doc.text("Eendraadschema", 
                     paperdetails.paper_margin + 3 * paperdetails.owner_box_width + 2, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight * (1 + 1.2) + 1.5);

            doc.text(htmlToPDFlines(doc,"Erkend Organisme"), 
                    paperdetails.paper_margin + 2, 
                    paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight + 1.5);

            doc.text(htmlToPDFlines(doc,"Plaats van de elektrische installatie"), 
                     paperdetails.paper_margin + paperdetails.owner_box_width + 2, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight + 1.5);

            doc.text(htmlToPDFlines(doc,"Installateur"), 
                    paperdetails.paper_margin + (2*paperdetails.owner_box_width) + 2, 
                    paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight + 1.5);

            doc.setFont("helvetica", "normal");

            doc.text(htmlToPDFlines(doc,owner).slice(0,8), 
                     paperdetails.paper_margin + paperdetails.owner_box_width + 2 + 3, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight * (1+1.2) + 1.5);

            doc.text(htmlToPDFlines(doc,installer).slice(0,8), 
                     paperdetails.paper_margin + (2*paperdetails.owner_box_width) + 2 + 3, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight * (1+1.2) + 1.5);

            let infoshorter = info.replace('https://www.eendraadschema.goethals-jacobs.be','eendraadschema');
            doc.text(htmlToPDFlines(doc,infoshorter).slice(0,8), 
                     paperdetails.paper_margin + (3*paperdetails.owner_box_width) + 2 + 3, 
                     paperdetails.paperheight - paperdetails.paper_margin - paperdetails.drawnby_box_height - paperdetails.owner_box_height - textHeight/6 + textHeight * (1+3*1.2) + 1.5);


            //--- functions that could be useful some day ---
            //const textWidth = doc.getTextWidth("Page 1");
            //doc.addPage();
            //window.open(doc.output('bloburl'), '_blank');

            doc.save("landscape_a4.pdf");
            statuscallback.innerHTML = 'PDF is klaar. Kijk in uw Downloads folder indien deze niet spontaan wordt geopend.';
        });
    }

    statuscallback.innerHTML = 'PDF wordt gegenereerd. Even geduld..';
    generatePDF(svg, sizex, sizey);

}