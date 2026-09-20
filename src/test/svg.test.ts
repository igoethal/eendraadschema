import { describe, expect, it } from "vitest";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { Hierarchical_List } from "../Hierarchical_List";
import { SVGSymbols } from "../SVGSymbols";
import { loadFixture } from "./helpers";

describe("one-line SVG generation", () => {
  it.each([
    ["example_default.eds", { width: "201", height: "174", uses: 15, lines: 183, texts: 19 }],
    ["example000.eds", { width: "504", height: "567", uses: 48, lines: 244, texts: 65 }],
    ["example001.eds", { width: "630", height: "552", uses: 60, lines: 259, texts: 71 }],
  ])(
    "renders %s as a complete SVG",
    (filename, expectedStructure) => {
      SVGSymbols.clearSymbols();
      const structure = loadFixture(filename);
      const svg = structure.toSVG(0, "horizontal");

      expect(svg.data).toMatch(/^<svg /);
      expect(svg.data).toContain("</svg>");
      expect(svg.xleft + svg.xright).toBeGreaterThan(0);
      expect(svg.yup + svg.ydown).toBeGreaterThan(0);
      expect(svg.data).toContain("<use");

      const document = new DOMParser().parseFromString(svg.data, "image/svg+xml");
      const root = document.documentElement;
      expect({
        width: root.getAttribute("width"),
        height: root.getAttribute("height"),
        uses: document.querySelectorAll("use").length,
        lines: document.querySelectorAll("line").length,
        texts: document.querySelectorAll("text").length,
      }).toEqual(expectedStructure);
    },
  );

  it("keeps meaningful circuit and component structure in the larger fixture", () => {
    SVGSymbols.clearSymbols();
    const structure = loadFixture("example001.eds");
    const svg = structure.toSVG(0, "horizontal").data;

    expect(svg).toContain("#contactdoos");
    expect(svg).toContain("#lamp");
    expect(svg).toMatch(/>A<\/text>/);
  });

  it("marks rendered items with insertion anchor metadata", () => {
    const structure = new Hierarchical_List();
    const board = structure.addItem("Bord");
    const store = new LegacySchemaStore(structure);
    const circuitId = store.commands.addItem(board.id, "Kring");
    const socketId = store.commands.addItem(circuitId, "Contactdoos");

    const document = new DOMParser().parseFromString(
      store.getLegacyDocument().toSVG(0, "horizontal").data,
      "image/svg+xml",
    );

    for (const itemId of [board.id, circuitId, socketId]) {
      const element = document.querySelector(`[data-schema-item-id="${itemId}"]`);
      expect(element).not.toBeNull();
      expect(Number(element?.getAttribute("data-schema-anchor-y"))).toBeGreaterThanOrEqual(0);
      expect(Number(element?.getAttribute("data-schema-end-x"))).toBeGreaterThan(0);
      expect(Number(element?.getAttribute("data-schema-width"))).toBeGreaterThan(0);
      expect(Number(element?.getAttribute("data-schema-height"))).toBeGreaterThan(0);
    }
  });

  it("renders secondary boards at their feeder with board export metadata", () => {
    const structure = new Hierarchical_List();
    const mainBoard = structure.addItem("Bord");
    mainBoard.props.naam = "Hoofdbord";
    const store = new LegacySchemaStore(structure);
    const feederCircuitId = store.commands.addItem(mainBoard.id, "Kring");
    const garageBoardId = store.commands.addDistributionBoard(feederCircuitId, {
      name: "Garage",
      location: "Achterbouw",
      cableType: "XVB",
      conductorSection: "5G6",
      lengthMeters: 18,
    });
    const garageRootId = store.getSnapshot().document.getBoard(garageBoardId)!.rootItemIds[0];
    store.commands.addItem(garageRootId, "Kring");

    const svg = store.getLegacyDocument().toSVG(0, "horizontal").data;
    expect(svg).toContain('data-distribution-board-name="true"');
    expect(svg).toContain("Hoofdbord");
    expect(svg).toContain("Garage");
    expect(svg).toContain("Locatie: Achterbouw");
    expect(svg).toContain("Voeding: XVB · 5G6 · 18 m");
    expect(store.getSnapshot().document.getItem(garageRootId)?.parentId).toBe(feederCircuitId);
  });
});
