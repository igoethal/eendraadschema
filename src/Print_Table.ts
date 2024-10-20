class Page_Info {
  height: number;
  start: number;
  stop: number;

  constructor() {
    this.height = 0;
    this.start = 0;
    this.stop = 0;
  }
}

class MarkerList {
  markers: any;

  constructor() {
    this.clear();
  }

  clear() {
    this.markers = [];
  }

  addMarker(depth, xpos) {
      // Check if the marker already exists
      const exists = this.markers.some(marker => marker.depth === depth && marker.xpos === xpos);
      if (!exists) {
        this.markers.push({ depth, xpos });
      }
  }

  sort() {
      this.markers.sort((a, b) => a.xpos - b.xpos);
  }

  findMinDepth(min, max) {
    // Filter markers within the range
    const filteredMarkers = this.markers.filter(marker => marker.xpos > min && marker.xpos <= max);
    if (filteredMarkers.length === 0) {
        return {depth: null, xpos: max}; // No markers in the specified range so we just take the maximum
    }
    
    // Find the marker with the lowest depth
    let minDepthMarker = filteredMarkers[0];
    for (let marker of filteredMarkers) {
        if (marker.depth < minDepthMarker.depth ||
            (marker.depth === minDepthMarker.depth && marker.xpos > minDepthMarker.xpos)) {
            minDepthMarker = marker;
        }
    }
    return minDepthMarker;
  }

}

class Print_Table {
  pages:Array<Page_Info>

  height: number;
  maxwidth: number;
  displaypage: number;
  modevertical: string; //default "alles" means full vertical page is always printed, expert "kies" means starty and stopy can be selected
  starty: number;
  stopy: number;
  papersize: string;

  pagemarkers: MarkerList;
  enableAutopage: boolean = true;

  constructor() {
    this.height = 0;
    this.maxwidth = 0;
    this.displaypage = 0;
    this.enableAutopage = true;

    this.pages = new Array<Page_Info>();
    var page_info: Page_Info;
    page_info = new Page_Info();
    this.pages.push(page_info); 

    this.pagemarkers = new MarkerList;
  }

  setPaperSize(papersize : string) {
    this.papersize = papersize;
  }

  getPaperSize() : string {
    if (!this.papersize) {
      this.papersize = "A4";
    }
    return(this.papersize);
  }

  setHeight(height: number) {
    let pagenum: number;
    this.height = height;
    for (pagenum=0; pagenum<this.pages.length; pagenum++) {
      this.pages[pagenum].height = height;
    }
  }

  getHeight(): number {
    return(this.height);
  }

  setModeVertical(mode: string) {
    this.modevertical = mode;
  }

  getModeVertical(): string {
    this.forceCorrectFigures();
    return(this.modevertical);
  }

  forceCorrectFigures() {
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
    let pagenum: number;
    this.pages[this.pages.length-1].stop = this.maxwidth;
    for (pagenum=0; pagenum<this.pages.length; pagenum++) {
      if (pagenum>0) {
        this.pages[pagenum].start = this.pages[pagenum-1].stop;
      }  
      if (this.pages[pagenum].stop > this.maxwidth) {
        this.pages[this.pages.length-1].stop = this.maxwidth;
      };
      if (this.pages[pagenum].start > this.pages[pagenum].stop) {
        this.pages[pagenum].start = this.pages[pagenum].stop;
      };
    }
  }

  setMaxWidth(maxwidth: number) {
    this.maxwidth = maxwidth;
    this.forceCorrectFigures();
  }

  getMaxWidth(): number {
    return(this.maxwidth);
  }

  getstarty(): number {
    this.forceCorrectFigures();
    return(this.starty);
  }

  getstopy(): number {
    this.forceCorrectFigures();
    return(this.stopy);
  }

  setstarty(starty: number) {
    this.starty = starty;
    this.forceCorrectFigures;
  }

  setstopy(stopy: number) {
    this.stopy = stopy;
    this.forceCorrectFigures;
  }

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

  autopage() {

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

    // 
    this.setStop(page,this.maxwidth);

    // Delete unneeded pages at the end
    for (let i=this.pages.length-1;i>page;i--) {
      this.deletePage(i);
    }

  }

  addPage() {
    var page_info: Page_Info;
    page_info = new Page_Info();

    page_info.height = this.height;
    page_info.start = this.pages[this.pages.length-1].stop;
    page_info.stop = this.maxwidth;
    
    this.pages.push(page_info); 
  }

  deletePage(page: number) {
    if (page==0) {
      this.pages[1].start = 0;    
    } else {
      this.pages[page-1].stop = this.pages[page].stop;  
    }
    this.pages.splice(page,1);    
  }

  toHTML() {
    if (structure.print_table.enableAutopage) this.autopage();

    let outstr: String = "";
    let pagenum: number;

    outstr += '<table border="1" cellpadding="3">';
    outstr += '<tr><th align="center">Pagina</th><th align="center">Startx</th><th align"center">Stopx</th><th align"left">Acties</th></tr>';

    for (pagenum=0; pagenum<this.pages.length; pagenum++) {
      outstr += '<tr><td align=center>' + (pagenum+1) + '</td><td align=center>' + this.pages[pagenum].start + '</td><td align=center>';
      if (pagenum != this.pages.length-1) {
        outstr += '<input size="5" id="id_stop_change_' + pagenum + '" type="number" min="' + this.pages[pagenum].start +  '" step="1" max="' + this.maxwidth + '" onchange="HLChangePrintStop(' + pagenum + ')" value="' + this.pages[pagenum].stop + '">';
      } else {
        outstr += this.pages[pagenum].stop.toString();
      }  
      outstr += '</td><td align=left>';
      if (pagenum == this.pages.length-1) {
        outstr += '<button style="background-color:green;" onclick="HLAddPrintPage()">&#9660;</button>';
      }
      if (this.pages.length>1) {  
        outstr += '<button style="background-color:red;" onclick="HLDeletePrintPage(' + pagenum + ')">&#9851</button>';
      }  
      outstr += '</td></tr>';
      //outstr += this.Pages[pagenum].height.toString();
    }

    outstr += "</table>";
    return(outstr);
  }
}