import { Electro_Item } from "./Electro_Item";
import {
  isOmschakelaarPort,
  OMSCHAKELAAR_POLES,
  OMSCHAKELAAR_SLOT_ORDER,
  OMSCHAKELAAR_RATINGS,
} from "../application/Omschakelaar";
import type { OmschakelaarPort } from "../application/Omschakelaar";
import { htmlspecialchars, svgTextWidth } from "../general";
import { SVGelement } from "../SVGelement";

/**
 * The three ports always sit in the same slots, whatever the wiring:
 * left/top = OUT1, middle = IN, right/bottom = OUT2. Every slot has its own
 * connector item and always draws its own branch (so an extra item can be
 * added above any slot). `parent_port` only chooses which slot the incoming
 * wire (the switch's tree parent) additionally attaches to.
 */
const SLOT_ORDER: readonly OmschakelaarPort[] = OMSCHAKELAAR_SLOT_ORDER;

interface Slot {
  readonly port: OmschakelaarPort;
  readonly isParent: boolean;
  readonly connector: { readonly id: number } | undefined;
  readonly svg: SVGelement;
}

interface Point { x: number; y: number }

interface Layout {
  readonly orientation: "horizontal" | "vertical";
  readonly parentPort: OmschakelaarPort;
  readonly contacts: Record<OmschakelaarPort, Point>;
  readonly ends: Record<OmschakelaarPort, Point>;
  readonly parentConductor: { from: Point; to: Point };
  readonly arm: { from: Point; to: Point };
  readonly portLabels: Record<OmschakelaarPort, Point & { anchor: "start" | "middle" }>;
  readonly rating: Point;
  readonly address: Point;
  readonly metadataAnchor: "start" | "middle";
  readonly incomingY: number;
}

export class Omschakelaar extends Electro_Item {
  resetProps(): void {
    this.clearProps();
    this.props.type = "Omschakelaar";
    this.props.aantal_polen = "4";
    this.props.amperage = "63";
    this.props.parent_port = "IN";
    this.props.adres = "";
  }

  allowedChilds(): Array<string> {
    return ["Omschakelaarpoort"];
  }

  getMaxNumChilds(): number {
    return 3;
  }

  overrideKeys(): void {
    if (!OMSCHAKELAAR_POLES.includes(this.props.aantal_polen)) this.props.aantal_polen = "4";
    if (!OMSCHAKELAAR_RATINGS.includes(this.props.amperage)) this.props.amperage = "63";
    if (!isOmschakelaarPort(this.props.parent_port)) this.props.parent_port = "IN";
    if (typeof this.props.adres !== "string") this.props.adres = "";
  }

  toSVG(): SVGelement {
    const parentPort: OmschakelaarPort = isOmschakelaarPort(this.props.parent_port) ? this.props.parent_port : "IN";
    const slots = this.getSlots(parentPort);
    const poles = OMSCHAKELAAR_POLES.includes(this.props.aantal_polen) ? this.props.aantal_polen : "4";
    const rating = OMSCHAKELAAR_RATINGS.includes(this.props.amperage) ? this.props.amperage : "63";
    const address = typeof this.props.adres === "string" ? this.props.adres.trim() : "";
    const ratingLabel = `${rating}A ${poles}P`;
    const orientation = this.getParent()?.getType() === "Kring" ? "vertical" : "horizontal";

    return orientation === "vertical"
      ? this.renderVertical(parentPort, slots, ratingLabel, address)
      : this.renderHorizontal(parentPort, slots, ratingLabel, address);
  }

  private getSlots(parentPort: OmschakelaarPort): Slot[] {
    return SLOT_ORDER.map(port => {
      const connector = this.sourcelist.data.find((candidate, index) =>
        this.sourcelist.active[index]
        && candidate.parent === this.id
        && candidate.props.type === "Omschakelaarpoort"
        && candidate.props.poort === port,
      );
      return {
        port,
        isParent: port === parentPort,
        connector,
        svg: connector === undefined ? new SVGelement() : this.sourcelist.toSVG(connector.id, "horizontal"),
      };
    });
  }

  private renderHorizontal(
    parentPort: OmschakelaarPort,
    slots: Slot[],
    ratingLabel: string,
    address: string,
  ): SVGelement {
    const [top, middle, bottom] = slots;
    const contactX = 58;
    const commonX = 26;
    const upperY = Math.max(22, top.svg.yup);
    const centerY = upperY + Math.max(19, top.svg.ydown + middle.svg.yup + 14);
    const lowerY = centerY + Math.max(19, middle.svg.ydown + bottom.svg.yup + 14);
    const rowY: Record<OmschakelaarPort, number> = { OUT1: upperY, IN: centerY, OUT2: lowerY };
    const endpointX = contactX + 30 + Math.max(...slots.map(slot => slot.svg.xleft));
    const labelBottom = lowerY + (address === "" ? 24 : 38);
    const width = Math.max(
      ...slots.map(slot => endpointX + slot.svg.xright),
      88 + svgTextWidth(htmlspecialchars(address), 10, ""),
    );
    const parentY = rowY[parentPort];
    const contact = (port: OmschakelaarPort): Point => ({ x: port === "IN" ? commonX : contactX, y: rowY[port] });
    const layout: Layout = {
      orientation: "horizontal",
      parentPort,
      contacts: { OUT1: contact("OUT1"), IN: contact("IN"), OUT2: contact("OUT2") },
      ends: {
        OUT1: { x: endpointX, y: upperY },
        IN: { x: endpointX, y: centerY },
        OUT2: { x: endpointX, y: lowerY },
      },
      parentConductor: { from: { x: 1, y: parentY }, to: contact(parentPort) },
      arm: { from: { x: commonX, y: centerY }, to: { x: commonX + 20, y: centerY } },
      portLabels: {
        OUT1: { x: contactX + 7, y: upperY - 5, anchor: "start" },
        IN: { x: 5, y: centerY - 7, anchor: "start" },
        OUT2: { x: contactX + 7, y: lowerY - 5, anchor: "start" },
      },
      rating: { x: 44, y: lowerY + 15 },
      address: { x: 44, y: lowerY + 29 },
      metadataAnchor: "middle",
      incomingY: parentY,
    };
    const svg = new SVGelement();
    svg.xleft = 1;
    svg.xright = width - svg.xleft;
    svg.yup = parentY;
    svg.ydown = labelBottom - parentY;
    svg.data = this.renderComponent(layout, slots, ratingLabel, address);
    return svg;
  }

  private renderVertical(
    parentPort: OmschakelaarPort,
    slots: Slot[],
    ratingLabel: string,
    address: string,
  ): SVGelement {
    const [left, middle, right] = slots;
    const endpointY = Math.max(18, ...slots.map(slot => slot.svg.yup));
    const contactY = endpointY + 24;
    const commonY = contactY + 34;
    const leftX = Math.round(Math.max(34, left.svg.xleft));
    const centerX = Math.round(leftX + Math.max(36, left.svg.xright + middle.svg.xleft + 28));
    const rightX = Math.round(centerX + Math.max(36, middle.svg.xright + right.svg.xleft + 28));
    const columnX: Record<OmschakelaarPort, number> = { OUT1: leftX, IN: centerX, OUT2: rightX };
    const parentX = columnX[parentPort];
    // The port label ("IN"/"OUT1"/"OUT2") sits on its own line next to its
    // contact; the rating/address labels start a full line below it so long
    // text like "63A 4P" never collides with the port label.
    const ratingY = commonY + 16;
    const addressY = commonY + 30;
    const incomingY = commonY + (address === "" ? 24 : 38);
    const labelX = parentX + 20;
    const labelWidth = Math.max(
      svgTextWidth(htmlspecialchars(ratingLabel), 10, ""),
      svgTextWidth(htmlspecialchars(address), 10, ""),
    );
    const width = Math.max(
      leftX + left.svg.xright,
      centerX + middle.svg.xright,
      rightX + right.svg.xright,
      labelX + labelWidth,
    );
    const contact = (port: OmschakelaarPort): Point => ({ x: columnX[port], y: port === "IN" ? commonY : contactY });
    const layout: Layout = {
      orientation: "vertical",
      parentPort,
      contacts: { OUT1: contact("OUT1"), IN: contact("IN"), OUT2: contact("OUT2") },
      ends: {
        OUT1: { x: leftX, y: endpointY },
        IN: { x: centerX, y: endpointY },
        OUT2: { x: rightX, y: endpointY },
      },
      parentConductor: { from: { x: parentX, y: incomingY }, to: contact(parentPort) },
      arm: { from: { x: centerX, y: commonY }, to: { x: centerX, y: commonY - 18 } },
      portLabels: {
        OUT1: { x: leftX, y: contactY - 7, anchor: "middle" },
        IN: { x: centerX + 7, y: commonY + 4, anchor: "start" },
        OUT2: { x: rightX, y: contactY - 7, anchor: "middle" },
      },
      rating: { x: labelX, y: ratingY },
      address: { x: labelX, y: addressY },
      metadataAnchor: "start",
      incomingY,
    };
    const svg = new SVGelement();
    svg.xleft = parentX;
    svg.xright = width - parentX;
    svg.yup = incomingY;
    svg.ydown = 0;
    svg.data = this.renderComponent(layout, slots, ratingLabel, address);
    return svg;
  }

  private renderComponent(
    layout: Layout,
    slots: Slot[],
    ratingLabel: string,
    address: string,
  ): string {
    const { parentPort } = layout;
    const escapedParentPort = htmlspecialchars(parentPort);
    const line = (attribute: string, from: Point, to: Point) =>
      `<line ${attribute} x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="black" stroke-linecap="round" />`;
    let data = `<g data-component="omschakelaar" data-position="neutral" data-orientation="${layout.orientation}">`;
    data += line(`data-input-conductor="${escapedParentPort}"`, layout.parentConductor.from, layout.parentConductor.to);

    for (const slot of slots) {
      const escapedPort = htmlspecialchars(slot.port);
      const contact = layout.contacts[slot.port];
      data += `<circle data-switch-contact="${escapedPort}" cx="${contact.x}" cy="${contact.y}" r="2.5" fill="black" />`;
      data += line(`data-output-conductor="${escapedPort}"`, contact, layout.ends[slot.port]);
    }

    data += `<line data-selector-arm="true" x1="${layout.arm.from.x}" y1="${layout.arm.from.y}" x2="${layout.arm.to.x}" y2="${layout.arm.to.y}" stroke="black" />`;

    for (const slot of slots) {
      const label = layout.portLabels[slot.port];
      const anchor = label.anchor === "middle" ? ' style="text-anchor:middle"' : "";
      data += `<text x="${label.x}" y="${label.y}"${anchor} font-family="Arial, Helvetica, sans-serif" font-size="9">${htmlspecialchars(slot.port)}</text>`;
    }

    data += `<text data-switch-rating="true" x="${layout.rating.x}" y="${layout.rating.y}" text-anchor="${layout.metadataAnchor}" font-family="Arial, Helvetica, sans-serif" font-size="10">${htmlspecialchars(ratingLabel)}</text>`;
    if (address !== "") {
      data += `<text data-switch-address="true" x="${layout.address.x}" y="${layout.address.y}" text-anchor="${layout.metadataAnchor}" font-family="Arial, Helvetica, sans-serif" font-size="10">${htmlspecialchars(address)}</text>`;
    }

    for (const slot of slots) {
      const end = layout.ends[slot.port];
      const branchX = end.x - slot.svg.xleft;
      const branchY = end.y - slot.svg.yup;
      data += `<g data-branch-origin="${htmlspecialchars(slot.port)}" data-x="${end.x}" data-y="${end.y}">`;
      if (slot.svg.data !== "") {
        data += `<svg x="${branchX}" y="${branchY}">${slot.svg.data}</svg>`;
      }
      data += "</g>";
    }

    for (const slot of slots) {
      if (slot.connector === undefined) continue;
      const end = layout.ends[slot.port];
      data += `<g data-schema-item-id="${slot.connector.id}" data-explicit-port-anchor="${htmlspecialchars(slot.port)}" data-schema-anchor-x="${end.x}" data-schema-anchor-y="${end.y}" data-schema-end-x="${end.x}" data-schema-width="0" data-schema-height="0"></g>`;
    }
    return data + "</g>";
  }
}
