import { Page_Info } from "./Page_Info";
import { MarkerList } from "./MarkerList";  

type PaperSize = "A4" | "A3";
type ModeVertical = "alles" | "kies";
type printPageMode = "all" | "custom";

/**
 * Stores all information about pagination and how pages will be printed.
 * Can perform automatic pagination or ask the user to paginate.
 * 
 * We don't use private variables in this class as we want to serialize it (JSON)
 */

export class Print_Table {

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
    includeBoardLayout: boolean = false;

    printPageMode: printPageMode = "all"; // Current print page mode
    printPageRange: string = ""; // Custom page range input by user, e.g. "1-2, 4"

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
        let forceMarker: { depth: number, xpos: number } | null = null;

        if (maxsvgwidth > 0) {
            while ((forceMarker = this.pagemarkers.findForceNewPage(pos, pos+maxsvgwidth)) != null
                    || (this.maxwidth - pos) > maxsvgwidth ) { // The undivided part still does not fit on a page
                if (forceMarker) 
                    pos = forceMarker.xpos; // If there is a forceNewPage marker, we take that position
                else
                    pos = this.pagemarkers.findMinDepth(pos+minsvgwidth,pos+maxsvgwidth).xpos;
                while (this.pages.length < page+2) this.addPage();
                this.setStop(page,pos);
                page++;
            }
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
     * Static helper for validating custom page ranges (same logic as before)
     */
    static isValidPageRange(input: string, maxPage: number): [boolean, string] {
        if (input.trim() === "") return [true, ""];
        // Only allow digits, spaces, commas, and dashes
        if (!/^[\d\s,\-]*$/.test(input)) {
            return [false, "Ongeldige invoer: alleen cijfers, spaties, komma's en streepjes toegestaan."];
        }
        const ranges = input.split(',').map(r => r.trim());
        let lastPage = 0;
        for (const range of ranges) {
            if (range === "") continue;
            if (range.includes('-')) {
                const [startStr, endStr] = range.split('-').map(s => s.trim());
                // Check if both are integer numbers
                if (!/^\d+$/.test(startStr) || !/^\d+$/.test(endStr)) {
                    return [false, `Ongeldige invoer: niet-geheel getal in bereik (${range})`];
                }
                const start = Number(startStr);
                const end = Number(endStr);
                if (!Number.isInteger(start) || !Number.isInteger(end)) {
                    return [false, `Ongeldige invoer: niet-geheel getal in bereik (${range})`];
                }
                if (start < 1 || end > maxPage) {
                    return [false, `Ongeldige invoer: pagina buiten bereik (${range}), toegestaan: 1-${maxPage}`];
                }
                if (start > end) {
                    return [false, `Ongeldige invoer: startpagina groter dan eindpagina (${range})`];
                }
                if (start <= lastPage) {
                    return [false, `Ongeldige invoer: overlappende of niet-oplopende pagina's (${range})`];
                }
                lastPage = end;
            } else {
                // Check if integer
                if (!/^\d+$/.test(range)) {
                    return [false, `Ongeldige invoer: niet-geheel getal (${range})`];
                }
                const pageNum = Number(range);
                if (!Number.isInteger(pageNum)) {
                    return [false, `Ongeldige invoer: niet-geheel getal (${range})`];
                }
                if (pageNum < 1 || pageNum > maxPage) {
                    return [false, `Ongeldige invoer: pagina buiten bereik (${range}), toegestaan: 1-${maxPage}`];
                }
                if (pageNum <= lastPage) {
                    return [false, `Ongeldige invoer: overlappende of niet-oplopende pagina's (${range})`];
                }
                lastPage = pageNum;
            }
        }
        return [true, ""];
    }

    /**
     * Returns true if the current page range is valid and can be printed.
     */
    canPrint(pageRange: string = this.printPageRange ?? "", maxPage?: number): boolean {
        const availablePages = maxPage ?? this.pages.length;
        const [isValid] = Print_Table.isValidPageRange(pageRange, availablePages);
        return isValid;
    }
}
