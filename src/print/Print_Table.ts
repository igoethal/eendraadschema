type PaperSize = "A4" | "A3";
type ModeVertical = "alles" | "kies";
type RedrawCallBackFunction = () => void;

/**
 * Stores all information about pagination and how pages will be printed.
 * Can perform automatic pagination or ask the user to paginate.
 * 
 * We don't use private variables in this class as we want to serialize it (JSON)
 */

class Print_Table {
    pages:Array<Page_Info> // List of pages with for every page the displayed height (in pixels) and startx and stopx in the SVG

    height: number = 0;          //How high is the SVG that will be printed in pixels
    maxwidth: number = 0;        //What is the width of the SVG that will be printed in pixels and therefore the maximum printing width
    displaypage: number = 0;

    modevertical: ModeVertical;  //default "alles" means full vertical page is always printed, expert "kies" means starty and stopy can be selected
    starty: number;              //if "kies" was chosen this is the starty to crop from the SVG
    stopy: number;               //if "kies" was chosen this is the stopy to crop from the SVG

    papersize: PaperSize;        //Can be "A4" or "A3"

    pagemarkers: MarkerList;             //List of pagemarkers that can be used for automatic pagination
    enableAutopage: boolean = true;      //Flag to indicate if automatic pagination is used or not

    /**
     * Initialize list of pages (foresee at least 1 page) and pagemarkers
     */

    constructor() {
        this.pages = new Array<Page_Info>();
        this.pages.push(new Page_Info()); 

        this.pagemarkers = new MarkerList;
    }

    /**
     * Set papersize to either "A4" or "A3"
     * @param papersize - A string, if it is neither "A4" or "A3", the papersize will default to "A4".
     */

    setPaperSize(papersize : string): void {
        this.papersize = (papersize === "A3" ? "A3" : "A4"); 
    }

    /**
     * Get papersize.  If papersize was not yet defined, it is forced to "A4"
     * @returns The papersize, either "A3" or "A4"
     */

    getPaperSize() : PaperSize {
        if (!this.papersize) this.papersize = "A4";
        return(this.papersize);
    }

    /**
     * Set displayheight of all pages to height
     * @param height - Height in pixels
     */

    setHeight(height: number): void {
        this.height = height;
        this.pages.forEach(page => { page.height = height; });
    }

    /**
     * Get displayheight
     * @returns Height in pixels
     */

    getHeight(): number {
        return(this.height);
    }

    /**
     * Set modevertical to either "alles" (meaning we show the full height of the page) or "kies" meaning the user can choose
     * @param more - Either "alles" or "kies"
     */

    setModeVertical(mode: string) {
       this.modevertical = (mode === "kies" ? "kies" : "alles");
       this.forceCorrectFigures();
    }

    /**
     * Get modevertical
     * @returns either "alles" or "kies"
     */

    getModeVertical(): ModeVertical {
      this.forceCorrectFigures();
      return(this.modevertical);
    }

    /**
     * Checks that all start and stop position of pages are valid
     * For instance, the startx position should never be higher than the stopx.
     * In addition, the SVG always goes from left to right over the pages so the startx
     * of a new page cannot be lower than the stopx of the page before.
     */

    forceCorrectFigures(): void {
      if (!this.modevertical) {
          this.modevertical = "alles";
      }

      switch (this.modevertical) {
          case "kies":
              this.starty = Math.min(Math.max(0,this.starty),this.height);
              this.stopy = Math.min(Math.max(this.starty,this.stopy),this.height);
              break;
          default:  
              this.starty = 0;
              this.stopy = this.height;
      }

      this.pages[this.pages.length-1].stop = this.maxwidth;

      this.pages.forEach((page, index) => {
          if (page.stop < 0) page.stop = 0;
          if (page.start < 0) page.start = 0;
          if (index > 0) {
              page.start = this.pages[index - 1].stop;
          }
          if (page.stop > this.maxwidth) {
              this.pages[this.pages.length - 1].stop = this.maxwidth;
          }
          if (page.start > page.stop) {
              page.start = page.stop;
          }
      });
    }

    /**
     * Sets the maximum width of the SVG to be displayed.
     * As a general rule this equals the width of the SVG itself in pixels
     * @param maxwidth
     */

    setMaxWidth(maxwidth: number): void {
        this.maxwidth = maxwidth;
        this.forceCorrectFigures();
    }

    /**
     * Gets the maximum width that can be displayed or printed
     * @returns maxwidth, as a general rule this equals the width of the SVG itsef in pixels
     */

    getMaxWidth(): number {
        return(this.maxwidth);
    }

    /**
     * Returns the starty position of the page that will be displayed or printed
     * @returns starty
     */

    getstarty(): number {
        this.forceCorrectFigures();
        return(this.starty);
    }

    /**
     * Returns the stopy position of the page that will be displayed or printed
     * @returns stopy
     */

    getstopy(): number {
        this.forceCorrectFigures();
        return(this.stopy);
    }

    /**
     * Sets the starty position of the page that will be displayed or printed
     * @param starty 
     */

    setstarty(starty: number) {
        this.starty = starty;
        this.forceCorrectFigures;
    }

    /**
     * Sets the stopy position of the page that will be displayed or printed
     * @param starty 
     */

    setstopy(stopy: number) {
        this.stopy = stopy;
        this.forceCorrectFigures;
    }

    /**
     * Sets the stopx position of one specific page to a desired value.
     * The function calls forceCorrectFigures() afterwards to ensure the natural flow of pages (left to right)
     * is respected.  Note that stopx in the underlying Page_Info object is called stop and we cannot change that
     * anymore as the classes are used for serialization.
     * @param page - page number for which we want to set the stopx (starts counting at zero)
     * @param stop - stopx position to set
     */

    setStop(page: number, stop: number) {
        if (page > 0) {
            if (stop<this.pages[page-1].stop) stop = this.pages[page-1].stop;
        }

        if (page < this.pages.length-1) {
            if (stop>this.pages[page+1].stop) stop = this.pages[page+1].stop;
        }

        if (stop>this.maxwidth) stop = this.maxwidth;

        this.pages[page].stop = stop;
        
        this.forceCorrectFigures();
    }

    /**
     * Automatically create pages based on pagemarkers
     */

    autopage(): void {

        /*  Autopage uses some ratio's determined by the useful SVG drawing size on the PDF.  This depends on the margins configured in print.js
            At present all of this is still hard-coded.  Should become a function of print.js
          
            A4

            Height: 210-20-30-5-5  --> 150
            Width: 297-20 --> 277
            Ratio: 1.8467
        
            A3
        
            Height: 297-20-30-5-5 --> 237
            Width: 420-20 --> 400
            Ratio: 1.6878  
        */

        //First set all pages to maximum to avoid that we bump into boundaries
        this.pages.forEach((page, index) => {
            page.stop = this.maxwidth;
        })

        let height = this.getstopy() - this.getstarty();
        let maxsvgwidth = height * (this.getPaperSize()=="A3" ? 1.6878 : 1.8467 );
        let minsvgwidth = 3/4*maxsvgwidth;

        let page = 0;
        let pos = 0;
        while ( (this.maxwidth - pos) > maxsvgwidth ) { // The undivided part still does not fit on a page
            pos = this.pagemarkers.findMinDepth(pos+minsvgwidth,pos+maxsvgwidth).xpos;
            while (this.pages.length < page+2) this.addPage();
            this.setStop(page,pos);
            page++;
        }

        // The last page stops at the maximum size of the SVG
        this.setStop(page,this.maxwidth);

        // Delete unneeded pages at the end
        for (let i=this.pages.length-1;i>page;i--) {
            this.deletePage(i);
        }
    }

    /**
     * Add a page
     */

    addPage(): void {
        var page_info: Page_Info;
        page_info = new Page_Info();

        page_info.height = this.height;
        page_info.start = this.pages[this.pages.length-1].stop;
        page_info.stop = this.maxwidth;
        
        this.pages.push(page_info); 
    }

    /**
     * Remove a page
     * @param page - number of the page to be removed, starting at 0
     */

    deletePage(page: number): void {
        if (page==0) {
            this.pages[1].start = 0;    
        } else {
            this.pages[page-1].stop = this.pages[page].stop;  
        }
        this.pages.splice(page,1);    
    }

    /**
     * Display a Select box to choose papersize (A3 or A4)
     * The table is displayed in the HTMLElement div that is given as a parameter to the function.
     * If any manipulation is done by the user that would require redrawing the print preview, the redrawCallBack function is executed
     * from within this function
     * @param div - Existing HTMLElement where the table will be inserted
     * @param redrawCallBack - Callback function that ensures everything that needs to be redrawn is redrawn
     */    

    insertHTMLselectPaperSize(div: HTMLElement, redrawCallBack: RedrawCallBackFunction): void {
        var select: HTMLSelectElement = document.createElement('select');
              
        var optionA4: HTMLOptionElement = document.createElement('option');
        optionA4.value = 'A4';
        optionA4.textContent = 'A4';

        var optionA3: HTMLOptionElement = document.createElement('option');
        optionA3.value = 'A3';
        optionA3.textContent = 'A3';

        if (this.papersize == "A3") optionA3.selected = true; else optionA4.selected = true;

        select.appendChild(optionA4);
        select.appendChild(optionA3);
        
        select.onchange = (event) => {
            this.setPaperSize((event.target as HTMLSelectElement).value);
            redrawCallBack();
        }

        div.appendChild(select);
    }

    /**
     * Display a Select box to choose dpi (300 or 600)
     * The table is displayed in the HTMLElement div that is given as a parameter to the function.
     * If any manipulation is done by the user that would require redrawing the print preview, the redrawCallBack function is executed
     * from within this function
     * @param div - Existing HTMLElement where the table will be inserted
     * @param redrawCallBack - Callback function that ensures everything that needs to be redrawn is redrawn
     */    

    insertHTMLselectdpi(div: HTMLElement, redrawCallBack: RedrawCallBackFunction): void {
        var select: HTMLSelectElement = document.createElement('select');
              
        var option300: HTMLOptionElement = document.createElement('option');
        option300.value = '300';
        option300.textContent = '300dpi (standaard)';

        var option600: HTMLOptionElement = document.createElement('option');
        option600.value = '600';
        option600.textContent = '600dpi (beter maar trager)';

        if (typeof(structure.properties.dpi) == 'undefined') structure.properties.dpi = 300;
        if (structure.properties.dpi == 600) option600.selected = true; else option300.selected = true;

        select.appendChild(option300);
        select.appendChild(option600);
        
        select.onchange = (event) => {
            structure.properties.dpi = parseInt((event.target as HTMLSelectElement).value,0);
        }

        div.appendChild(select);
    }

    /**
     * Display a Check box to decide if one wants to use autopage or not.
     * If autopage is enabled, we also recalculate the page boundaries
     * The checkbox is displayed in the HTMLElement div that is given as a parameter to the function.
     * If any manipulation is done by the user that would require redrawing the print preview, the redrawCallBack function is executed
     * from within this function
     * @param div - Existing HTMLElement where the table will be inserted
     * @param redrawCallBack - Callback function that ensures everything that needs to be redrawn is redrawn
     */    

    insertHTMLcheckAutopage(div: HTMLElement, redrawCallBack: RedrawCallBackFunction): void {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'autopage';
        checkbox.name = 'autopage';

        var label = document.createElement('label');
        label.htmlFor = 'autopage';
        label.textContent = "Handmatig over pagina's verdelen";

        if (this.enableAutopage) {
            this.setModeVertical("alles");
            this.autopage();
        } else {
            checkbox.checked = true; 
        }

        div.append(checkbox);
        div.append(label);

        checkbox.onchange = (event) => {
            this.enableAutopage = !(event.target as HTMLInputElement).checked;
            redrawCallBack();
        }
    }
    
    /**
     * Display a select box to choose the vertical mode.
     * If vertical mode is "kies", we also display input boxes to choose the starty and stopy positions.
     * The checkbox is displayed in the HTMLElement div that is given as a parameter to the function.
     * If any manipulation is done by the user that would require redrawing the print preview, the redrawCallBack function is executed
     * from within this function
     * @param div - Existing HTMLElement where the table will be inserted
     * @param redrawCallBack - Callback function that ensures everything that needs to be redrawn is redrawn
     */    

    insertHTMLchooseVerticals(div: HTMLElement, redrawCallBack: RedrawCallBackFunction): void {
        let outstr: string = "";

        switch (this.modevertical) {
            case "kies":
                outstr += 'Hoogte <select id="select_modeVertical"><option value="alles">Alles (standaard)</option><option value="kies" selected="Selected">Kies (expert)</option></select>';
                outstr += '&nbsp;&nbsp;StartY ';
                outstr += '<input size="4" id="input_starty" type="number" min="0" step="1" max="' + this.getHeight() + '" value="' + this.getstarty() + '">';
                outstr += '&nbsp;&nbsp;StopY '
                outstr += '<input size="4" id="input_stopy" type="number" min="0" step="1" max="' + this.getHeight() + '" value="' + this.getstopy() + '">';
                break;
            case "alles":  
            default:
                outstr += 'Hoogte <select id="select_modeVertical"><option value="alles">Alles (standaard)</option><option value="kies">Kies (expert)</option></select>';  
        }

        div.insertAdjacentHTML('beforeend', outstr);
        
        document.getElementById('select_modeVertical').onchange = (event) => {
            this.setModeVertical((event.target as HTMLInputElement).value);
            redrawCallBack();
        }

        if (this.modevertical == "kies") {
            document.getElementById('input_starty').onchange = (event) => {
                let starty = parseInt((event.target as HTMLInputElement).value);
                if (isNaN(starty)) starty = 0;
                this.setstarty(starty);
                this.forceCorrectFigures();
                redrawCallBack();
            }
            document.getElementById('input_stopy').onchange = (event) => {
                let stopy = parseInt((event.target as HTMLInputElement).value);
                if (isNaN(stopy)) stopy = this.getHeight();;
                this.setstopy(stopy);
                this.forceCorrectFigures();
                redrawCallBack();
            }
        }
    }

    /**
     * Display a button to force auto-pagination even when in manual mode
     * @param div - Existing HTMLElement where the table will be inserted
     * @param redrawCallBack - Callback function that ensures everything that needs to be redrawn is redrawn
     */

    insertHTMLsuggestXposButton(div: HTMLElement, redrawCallBack: RedrawCallBackFunction): void {
        var button = document.createElement('button');
        button.innerText = 'Suggereer X-posities';

        div.append(button);

        button.onclick = () => {
            this.autopage();
            redrawCallBack();
        }
    }

    /**
     * Display a table where the user can choose start and stop positions for the x-coordinates in the SVG of each individual page
     * The table is displayed in the HTMLElement div that is given as a parameter to the function.
     * If any manipulation is done by the user that would require redrawing the print preview, the redrawCallBack function is executed
     * from within this function
     * @param div - Existing HTMLElement where the table will be inserted
     * @param redrawCallBack - Callback function that ensures everything that needs to be redrawn is redrawn
     */

    insertHTMLposxTable(div: HTMLElement, redrawCallBack: RedrawCallBackFunction): void {
        if (structure.print_table.enableAutopage) this.autopage();

        let outstr: string = "";
        let pagenum: number;

        outstr += '<table border="1" cellpadding="3">';
        outstr += '<tr><th align="center">Pagina</th><th align="center">Startx</th><th align"center">Stopx</th><th align"left">Acties</th></tr>';

        for (pagenum=0; pagenum<this.pages.length; pagenum++) {
            outstr += '<tr><td align=center>' + (pagenum+1) + '</td><td align=center>' + this.pages[pagenum].start + '</td><td align=center>';

            if (pagenum != this.pages.length-1) {
                outstr += '<input size="5" id="input_stop_' + pagenum + '" type="number" min="' + this.pages[pagenum].start 
                      +  '" step="1" max="' + this.maxwidth + '" value="' + this.pages[pagenum].stop + '">';
            } else {
                outstr += this.pages[pagenum].stop.toString();
            }  

            outstr += '</td><td align=left>';

            if (pagenum == this.pages.length-1) {
                outstr += '<button style="background-color:green;" id="Btn_Addpage">&#9660;</button>';
            }

            if (this.pages.length>1) {
                outstr += '<button style="background-color:red;" id="Btn_Deletepage_' + pagenum + '">&#9851;</button>';
            }  

            outstr += '</td></tr>';
        }

        outstr += "</table>";

        div.insertAdjacentHTML('beforeend', outstr);

        document.getElementById('Btn_Addpage').onclick = () => {
            this.addPage();
            redrawCallBack();
        };

        document.querySelectorAll('button[id^="Btn_Deletepage_"]').forEach(button => {
            const match = button.id.match(/Btn_Deletepage_(\d+)/);
            if (match) {
                const page = parseInt(match[1]);
                (button as HTMLInputElement).onclick = () => {
                    this.deletePage(page);
                    redrawCallBack();
                }
            }
        });

        document.querySelectorAll('input[id^="input_stop_"]').forEach(input => {
            input.addEventListener('change', (event) => {
                const match = (event.target as HTMLInputElement).id.match(/input_stop_(\d+)/);
                if (match) {
                    const page = parseInt(match[1]);
                    const stop = parseInt((event.target as HTMLInputElement).value as string);
                    this.setStop(page, stop);
                    redrawCallBack();
                }
            });
        });

    }
}