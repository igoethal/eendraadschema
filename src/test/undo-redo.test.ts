import { describe, expect, it } from "vitest";
import { Hierarchical_List } from "../Hierarchical_List";
import { structureFromJson } from "../legacy/persistence/EdsCodec";
import { undoRedo } from "../undoRedo";

describe("undo and redo", () => {
  it("restores additions and deletions through serialized history", () => {
    let structure = new Hierarchical_List();
    structure.properties.currentView = "test";
    const history = new undoRedo(
      10,
      () => structure,
      (text, version) => {
        structure = structureFromJson(text, structure, version);
        return structure;
      },
    );
    structure.addItem("Bord");
    history.store();

    const circuit = structure.addItem("Kring");
    history.store();
    expect(structure.getElectroItemById(circuit.id)?.props.type).toBe("Kring");

    history.undo();
    expect(structure.getElectroItemById(circuit.id)).toBeNull();
    expect(history.redoStackSize()).toBe(1);

    history.redo();
    expect(structure.getElectroItemById(circuit.id)?.props.type).toBe("Kring");
    expect(history.undoStackSize()).toBe(1);
  });
});
