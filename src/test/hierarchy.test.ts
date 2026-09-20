import { describe, expect, it } from "vitest";
import { Hierarchical_List } from "../Hierarchical_List";
import { Electro_Item } from "../List_Item/Electro_Item";
import { hierarchySnapshot } from "./helpers";

function createHierarchy() {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  const circuit = structure.createItem("Kring");
  structure.insertChildAfterId(circuit, board.id);
  const first = structure.createItem("Contactdoos");
  structure.insertChildAfterId(first, circuit.id);
  const second = structure.createItem("Lichtpunt");
  structure.insertChildAfterId(second, circuit.id);
  return { structure, board, circuit, first, second };
}

describe("hierarchy mutations", () => {
  it("adds items with stable, increasing IDs and parent relationships", () => {
    const { structure, board, circuit, first, second } = createHierarchy();

    expect([board.id, circuit.id, first.id, second.id]).toEqual([1, 2, 3, 4]);
    expect(circuit.parent).toBe(board.id);
    expect(first.parent).toBe(circuit.id);
    expect(second.parent).toBe(circuit.id);
    expect(structure.curid).toBe(5);
  });

  it("deletes an item and all descendants without reusing IDs", () => {
    const { structure, circuit } = createHierarchy();
    structure.deleteById(circuit.id);
    const replacement = structure.addItem("Kring");

    expect(structure.getElectroItemById(circuit.id)).toBeNull();
    expect(structure.length).toBe(2);
    expect(replacement.id).toBe(5);
  });

  it("moves siblings while preserving parents and identities", () => {
    const { structure, circuit, first, second } = createHierarchy();
    structure.moveUp(second.id);

    const children = structure.data.filter((item) => item.parent === circuit.id);
    expect(children.map((item) => item.id)).toEqual([second.id, first.id]);
    expect(children.every((item) => item.parent === circuit.id)).toBe(true);
  });

  it("duplicates an item subtree with new stable IDs", () => {
    const { structure, circuit, first } = createHierarchy();
    const nested = structure.createItem("Verbruiker");
    structure.insertChildAfterId(nested, first.id);
    const oldCurid = structure.curid;

    structure.clone(first.id);

    const clones = structure.data.filter(
      (item) => item.parent === circuit.id && item.props.type === first.props.type,
    );
    expect(clones).toHaveLength(2);
    expect(clones[1].id).toBe(oldCurid);
    expect(structure.data.some((item) => item.parent === clones[1].id)).toBe(true);
  });

  it("can serialize an added, moved, and deleted hierarchy without drift", () => {
    const { structure, second } = createHierarchy();
    structure.moveUp(second.id);
    structure.insertItemAfterId(new Electro_Item(structure), second.id);
    structure.deleteById(second.id);

    const snapshot = hierarchySnapshot(structure);
    expect(snapshot.map((item) => item.id)).toEqual(structure.id);
    expect(new Set(structure.id).size).toBe(structure.id.length);
  });
});
