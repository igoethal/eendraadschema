import { describe, expect, it } from "vitest";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import type { LightPointPropertyChanges } from "../application/SchemaPropertyReader";
import { Hierarchical_List } from "../Hierarchical_List";
import { structureFromJson } from "../legacy/persistence/EdsCodec";
import { SVGSymbols } from "../SVGSymbols";

const typedChanges: LightPointPropertyChanges = {
  numberMode: "manueel",
  number: "L1",
  lampType: "TL",
  tubeCount: "3",
  count: "2",
  wallLight: true,
  splashProof: true,
  builtInSwitch: true,
  emergencyLighting: "Decentraal",
  address: "Garage",
};

const legacyChanges: Readonly<Record<string, unknown>> = {
  autonr: "manueel",
  nr: "L1",
  type_lamp: "TL",
  aantal_buizen_indien_TL: "3",
  aantal: "2",
  is_wandlamp: true,
  is_halfwaterdicht: true,
  heeft_ingebouwde_schakelaar: true,
  type_noodverlichting: "Decentraal",
  adres: "Garage",
};

function createLightPointDocument(): { structure: Hierarchical_List; lightPointId: number } {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  const circuit = structure.createItem("Kring");
  structure.insertChildAfterId(circuit, board.id);
  const lightPoint = structure.createItem("Lichtpunt");
  structure.insertChildAfterId(lightPoint, circuit.id);
  structure.reNumber(false);
  return { structure, lightPointId: lightPoint.id };
}

describe("React light-point property compatibility", () => {
  it("produces the same serialized document and SVG as the legacy property path", () => {
    const initial = createLightPointDocument();
    const serialized = initial.structure.toJsonObject(false);
    const commandDocument = structureFromJson(serialized, null, 0);
    const legacyDocument = structureFromJson(serialized, null, 0);
    const store = new LegacySchemaStore(commandDocument);

    store.commands.updateLightPoint(initial.lightPointId, typedChanges);

    const legacyLightPoint = legacyDocument.getElectroItemById(initial.lightPointId)!;
    Object.assign(legacyLightPoint.props, legacyChanges);
    legacyLightPoint.normalizeProperties();
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
