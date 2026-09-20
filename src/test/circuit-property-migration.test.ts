import { describe, expect, it } from "vitest";
import type { CircuitPropertyChanges } from "../application/SchemaPropertyReader";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { Hierarchical_List } from "../Hierarchical_List";
import { structureFromJson } from "../legacy/persistence/EdsCodec";
import { SVGSymbols } from "../SVGSymbols";

const typedChanges: CircuitPropertyChanges = {
  nameMode: "manueel",
  name: "Garage",
  protection: "differentieelautomaat",
  poleCount: "4",
  amperage: "32",
  differentialCurrent: "30",
  differentialType: "A",
  breakerCurve: "C",
  shortCircuitRating: "6",
  selectiveDifferential: true,
  phase: "L2",
  hasCable: true,
  cableType: "XVB Cca 5G6",
  cableLocation: "Ondergronds",
  cableInConduit: true,
  residential: true,
  address: "G1",
  text: "Voeding garage",
};

const legacyChanges: Readonly<Record<string, unknown>> = {
  autoKringNaam: "manueel",
  naam: "Garage",
  bescherming: "differentieelautomaat",
  aantal_polen: "4",
  amperage: "32",
  differentieel_delta_amperage: "30",
  type_differentieel: "A",
  curve_automaat: "C",
  kortsluitvermogen: "6",
  differentieel_is_selectief: true,
  fase: "L2",
  kabel_is_aanwezig: true,
  type_kabel: "XVB Cca 5G6",
  kabel_locatie: "Ondergronds",
  kabel_is_in_buis: true,
  huishoudelijk: true,
  adres: "G1",
  tekst: "Voeding garage",
};

function createCircuitDocument(): { structure: Hierarchical_List; circuitId: number } {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  board.props.naam = "Hoofdbord";
  const circuit = structure.createItem("Kring");
  structure.insertChildAfterId(circuit, board.id);
  structure.reNumber(false);
  return { structure, circuitId: circuit.id };
}

describe("React circuit property compatibility", () => {
  it("produces the same serialized document and SVG as the legacy property path", () => {
    const initial = createCircuitDocument();
    const serialized = initial.structure.toJsonObject(false);
    const commandDocument = structureFromJson(serialized, null, 0);
    const legacyDocument = structureFromJson(serialized, null, 0);
    const store = new LegacySchemaStore(commandDocument);

    store.commands.updateCircuit(initial.circuitId, typedChanges);

    const legacyCircuit = legacyDocument.getElectroItemById(initial.circuitId)!;
    Object.assign(legacyCircuit.props, legacyChanges);
    legacyCircuit.normalizeProperties();
    legacyDocument.voegAttributenToeAlsNodigEnReSort();
    legacyDocument.reNumber(false);

    expect(JSON.parse(store.getLegacyDocument().toJsonObject(false)))
      .toEqual(JSON.parse(legacyDocument.toJsonObject(false)));

    SVGSymbols.clearSymbols();
    const commandSvg = store.getLegacyDocument().toSVG(0, "horizontal").data;
    SVGSymbols.clearSymbols();
    const legacySvg = legacyDocument.toSVG(0, "horizontal").data;
    expect(commandSvg).toBe(legacySvg);
  });
});
