export class SVGelement {
  data: string;
  xleft: number;
  xright: number;
  xrightmin: number; //is basically the full width of an array of horizontal items excluding the xright of the last item
  yup: number;
  ydown: number;

  constructor() {
    this.data = "";
    this.xleft = 0;
    this.xright = 0;
    this.xrightmin = 0;
    this.yup = 0;
    this.ydown = 0;
  }
}
