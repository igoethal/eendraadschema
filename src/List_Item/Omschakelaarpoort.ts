import { Electro_Item } from "./Electro_Item";
import { isOmschakelaarPort } from "../application/Omschakelaar";
import { SVGelement } from "../SVGelement";

export class Omschakelaarpoort extends Electro_Item {
  resetProps(): void {
    this.clearProps();
    this.props.type = "Omschakelaarpoort";
    this.props.poort = "OUT1";
  }

  allowedChilds(): Array<string> {
    return ["", "Kring"];
  }

  getMaxNumChilds(): number {
    return 1;
  }

  overrideKeys(): void {
    if (!isOmschakelaarPort(this.props.poort)) this.props.poort = "OUT1";
  }

  toSVG(): SVGelement {
    return new SVGelement();
  }
}
