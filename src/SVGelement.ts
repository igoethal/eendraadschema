export class SVGelement {
  data: string;
  xleft: number;
  xright: number;
  xrightmin: number; //is basically the full width of an array of horizontal items excluding the xright of the last item
  yup: number;
  ydown: number;
  firstChildydown: number|null; //ydown of the first child, not always set
  lastChildyup: number|null; //yup of the last child, not always set
  connectorPos: Array<number|null>; // posities van de leidingen, te beginnen vanaf onderaan, null indien leeg Electro_element

  constructor() {
    this.data = "";
    this.xleft = 0;
    this.xright = 0;
    this.xrightmin = 0;
    this.yup = 0;
    this.ydown = 0;
    this.firstChildydown = null;
    this.lastChildyup = null;
    this.connectorPos = [];
  }
}
