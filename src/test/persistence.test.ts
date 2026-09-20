import { describe, expect, it } from "vitest";
import { Hierarchical_List } from "../Hierarchical_List";
import { decodeEds, structureFromJson, wrapCurrentEdsPayload } from "../legacy/persistence/EdsCodec";
import { SituationPlanElement } from "../sitplan/SituationPlanElement";
import { hierarchySnapshot, loadCurrentFixture, loadFixture } from "./helpers";

describe("EDS compatibility", () => {
  it.each([
    ["example_default.eds", 4],
    ["example000.eds", 19],
    ["example001.eds", 31],
  ])("loads legacy fixture %s", (filename, expectedItems) => {
    const structure = loadFixture(filename);

    expect(structure.length).toBe(expectedItems);
    expect(structure.data.every((item) => item.sourcelist === structure)).toBe(true);
    expect(structure.data.every((item) => structure.getElectroItemById(item.id) === item)).toBe(true);
  });

  it("upgrades legacy item names while preserving the hierarchy", () => {
    const structure = loadFixture("example001.eds");
    const types = structure.data.map((item) => item.props.type);

    expect(types).toContain("Contactdoos");
    expect(types).not.toContain("Stopcontact");
    expect(structure.data.some((item) => item.parent !== 0)).toBe(true);
  });

  it("round trips the complete hierarchy, properties, and stable IDs", () => {
    const original = loadFixture("example001.eds");
    const before = hierarchySnapshot(original);
    const serialized = original.toJsonObject(true);
    const reloaded = structureFromJson(serialized, null, 0);

    expect(hierarchySnapshot(reloaded)).toEqual(before);
    expect(reloaded.curid).toBe(original.curid);
    expect(reloaded.properties.filename).toBe(original.properties.filename);
    expect(reloaded.sitplan.toJsonObject()).toEqual(original.sitplan.toJsonObject());
    expect(reloaded.sitplan.getElements().map(element => element.id))
      .toEqual(original.sitplan.getElements().map(element => element.id));
  });

  it("assigns safe unique placement IDs when older data has none or duplicates", () => {
    const original = new Hierarchical_List();
    original.sitplan.addElement(new SituationPlanElement());
    original.sitplan.addElement(new SituationPlanElement());
    original.sitplan.addElement(new SituationPlanElement());
    const legacyJson = JSON.parse(original.toJsonObject(true));
    delete legacyJson.sitplanjson.elements[0].id;
    legacyJson.sitplanjson.elements[1].id = "SP_duplicate";
    legacyJson.sitplanjson.elements[2].id = "SP_duplicate";

    const reloaded = structureFromJson(JSON.stringify(legacyJson), null, 4);
    const ids = reloaded.sitplan.getElements().map(element => element.id);

    expect(ids.every(id => /^SP_[A-Za-z0-9_-]+$/.test(id))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("decodes the current uncompressed EDS envelope", () => {
    const original = loadFixture("example_default.eds");
    const text = original.toJsonObject(true);
    const decoded = decodeEds(wrapCurrentEdsPayload("TXT", text));
    const reloaded = structureFromJson(decoded.text, null, decoded.version);

    expect(decoded.version).toBe(6);
    expect(hierarchySnapshot(reloaded)).toEqual(hierarchySnapshot(original));
  });

  it("preserves less-common types and situation-plan references in version 4 data", () => {
    const original = new Hierarchical_List();
    Object.assign(globalThis, { structure: original, SITPLANVIEW_DEFAULT_SCALE: 0.7 });
    const board = original.addItem("Bord");
    const circuit = original.createItem("Kring");
    original.insertChildAfterId(circuit, board.id);

    for (const type of ["EV lader", "Omvormer", "Overspanningsbeveiliging", "Zeldzame symbolen"]) {
      original.insertChildAfterId(original.createItem(type), circuit.id);
    }

    const linked = new SituationPlanElement();
    linked.setElectroItemId(circuit.id);
    linked.setAdres("auto", "", "rechts");
    original.sitplan.addElement(linked);

    const decoded = decodeEds(`TXT0040000${original.toJsonObject(true)}`);
    const reloaded = structureFromJson(decoded.text, null, decoded.version);

    expect(reloaded.data.map((item) => item.props.type)).toEqual(
      expect.arrayContaining(["EV lader", "Omvormer", "Overspanningsbeveiliging", "Zeldzame symbolen"]),
    );
    expect(reloaded.sitplan.getElements()[0].getElectroItemId()).toBe(circuit.id);
    expect(reloaded.getElectroItemById(circuit.id)?.props.type).toBe("Kring");
  });

  it("loads the checked-in current version fixture", () => {
    const structure = loadCurrentFixture("current-v4-uncommon.eds");

    expect(structure.properties.filename).toBe("current-v4-uncommon.eds");
    expect(structure.data.map((item) => item.props.type)).toEqual([
      "Aansluiting",
      "Bord",
      "Kring",
      "EV lader",
      "Overspanningsbeveiliging",
    ]);
    expect(structure.sitplan.getElements()[0].getElectroItemId()).toBe(4);
    expect(structure.sitplan.heeftEenzameSchakelaars()).toBe(false);
  });

  it("migrates documents without board metadata to one default main board", () => {
    const original = loadFixture("example001.eds");
    const legacyJson = JSON.parse(original.toJsonObject(true));
    delete legacyJson.boards;

    const reloaded = structureFromJson(JSON.stringify(legacyJson), null, 4);
    const rootItemIds = reloaded.data
      .filter((item, index) => reloaded.active[index] && item.parent === 0)
      .map((item) => item.id);

    expect(reloaded.boards).toEqual([{
      id: "main",
      name: "Hoofdbord",
      rootItemIds,
    }]);
  });

  it("round trips stable distribution-board IDs and feeder metadata", () => {
    const original = new Hierarchical_List();
    const connection = original.addItem("Aansluiting");
    const mainBoard = original.createItem("Bord");
    original.insertChildAfterId(mainBoard, connection.id);
    const feederCircuit = original.createItem("Kring");
    original.insertChildAfterId(feederCircuit, mainBoard.id);
    const garageBoard = original.createItem("Bord");
    original.insertChildAfterId(garageBoard, feederCircuit.id);
    const garageCircuit = original.createItem("Kring");
    original.insertChildAfterId(garageCircuit, garageBoard.id);
    original.boards = [
      { id: "main", name: "Hoofdbord", rootItemIds: [connection.id] },
      {
        id: "garage-board",
        name: "Garage",
        location: "Garage",
        rootItemIds: [garageBoard.id],
        feeder: {
          sourceBoardId: "main",
          sourceCircuitId: feederCircuit.id,
          cableType: "XVB",
          conductorSection: "5G6",
          lengthMeters: 18,
        },
      },
    ];

    const reloaded = structureFromJson(original.toJsonObject(true), null, 0);

    expect(reloaded.boards).toEqual(original.boards);
    expect(reloaded.boards[1].feeder?.sourceCircuitId).toBe(feederCircuit.id);
    expect(reloaded.getElectroItemById(garageCircuit.id)?.parent).toBe(garageBoard.id);
  });

  it("drops stale secondary-board root references on load", () => {
    const original = new Hierarchical_List();
    const connection = original.addItem("Aansluiting");
    const feederCircuit = original.createItem("Kring");
    original.insertChildAfterId(feederCircuit, connection.id);
    const garageBoard = original.createItem("Bord");
    original.insertChildAfterId(garageBoard, feederCircuit.id);
    original.boards = [
      { id: "main", name: "Hoofdbord", rootItemIds: [connection.id] },
      {
        id: "garage-board",
        name: "Garage",
        rootItemIds: [garageBoard.id, 999_999],
        feeder: { sourceBoardId: "main", sourceCircuitId: feederCircuit.id },
      },
    ];

    const reloaded = structureFromJson(original.toJsonObject(true), null, 0);

    expect(reloaded.boards[1].rootItemIds).toEqual([garageBoard.id]);
  });

  it("round trips optional EDS006 manual board layouts", () => {
    const original = loadFixture("example001.eds");
    const itemId = original.data.find((item, index) => original.active[index])?.id;
    expect(itemId).toBeDefined();
    if (itemId === undefined) throw new Error("Fixture bevat geen actief onderdeel.");
    original.boardLayouts = [{
      boardId: "main",
      rails: [{ id: "main-rail-1", name: "Rij 1", moduleCapacity: 18 }],
      placements: [{
        itemId,
        railId: "main-rail-1",
        startModule: 2,
        moduleWidth: 3,
      }],
    }];

    const reloaded = structureFromJson(original.toJsonObject(true), null, 6);

    expect(reloaded.boardLayouts).toEqual(original.boardLayouts);
  });
});
