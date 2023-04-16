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

class Print_Table {
  pages:Array<Page_Info>

  height: number;
  maxwidth: number;
  displaypage: number;

  constructor() {
    this.height = 0;
    this.maxwidth = 0;
    this.displaypage = 0;

    this.pages = new Array<Page_Info>();
    var page_info: Page_Info;
    page_info = new Page_Info();
    this.pages.push(page_info); 
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

  forceCorrectFigures() {
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
    let outstr: String = "";
    let pagenum: number;

    outstr += '<table border="1" cellpadding="3">';
    outstr += '<tr><th align="center">Pagina</th><th align="center">Start</th><th align"center">Stop</th><th align"left">Acties</th></tr>';

    for (pagenum=0; pagenum<this.pages.length; pagenum++) {
      outstr += '<tr><td align=center>' + (pagenum+1) + '</td><td align=center>' + this.pages[pagenum].start + '</td><td align=center>';
      if (pagenum != this.pages.length-1) {
        outstr += '<input size="4" id="id_stop_change_' + pagenum + '" type="number" min="' + this.pages[pagenum].start +  '" step="1" max="' + this.maxwidth + '" onchange="HLChangePrintStop(' + pagenum + ')" value="' + this.pages[pagenum].stop + '">';
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