import { describe, expect, it } from "vitest";
import { LegacySchemaDocumentReader } from "../application/LegacySchemaDocumentReader";
import { Hierarchical_List } from "../Hierarchical_List";
import { loadFixture } from "./helpers";

function createNamedHierarchy() {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  board.props.naam = "Hoofdbord";
  const circuit = structure.createItem("Kring");
  circuit.props.naam = "G";
  structure.insertChildAfterId(circuit, board.id);
  const socket = structure.createItem("Contactdoos");
  socket.props.nr = "1";
  socket.props.adres = "Garage";
  structure.insertChildAfterId(socket, circuit.id);
  return { structure, board, circuit, socket };
}

describe("LegacySchemaDocumentReader", () => {
  it.each(["example_default.eds", "example000.eds", "example001.eds"])(
    "projects every active item from %s in legacy order",
    (fixture) => {
      const structure = loadFixture(fixture);
      const reader = new LegacySchemaDocumentReader(structure);
      const nodes = reader.getAllItems();

      expect(nodes.map((node) => node.id)).toEqual(structure.id);
      expect(reader.getHierarchy()).toEqual(nodes);
      expect(nodes.every((node) => !Object.hasOwn(node, "toHTML"))).toBe(true);
    },
  );

  it("maps the root sentinel to null and preserves ordered child IDs", () => {
    const { structure, board, circuit, socket } = createNamedHierarchy();
    const reader = new LegacySchemaDocumentReader(structure);

    expect(reader.getRootItems().map((node) => node.id)).toEqual([board.id]);
    expect(reader.getItem(board.id)?.parentId).toBeNull();
    expect(reader.getItem(board.id)?.childIds).toEqual([circuit.id]);
    expect(reader.getChildren(board.id).map((node) => node.id)).toEqual([circuit.id]);
    expect(reader.getChildren(circuit.id).map((node) => node.id)).toEqual([socket.id]);
    expect(reader.getItem(999_999)).toBeUndefined();
  });

  it("provides useful Dutch labels and descriptions without HTML rendering", () => {
    const { structure, board, circuit, socket } = createNamedHierarchy();
    const reader = new LegacySchemaDocumentReader(structure);

    expect(reader.getItem(board.id)?.label).toBe("Hoofdbord");
    expect(reader.getItem(circuit.id)?.label).toBe("Kring G");
    expect(reader.getItem(socket.id)?.label).toBe("Contactdoos 1");
    expect(reader.getItem(socket.id)?.description).toBe("Garage");
  });

  it("returns immutable hierarchy summaries instead of legacy property bags", () => {
    const { structure, circuit } = createNamedHierarchy();
    const reader = new LegacySchemaDocumentReader(structure);
    const node = reader.getItem(circuit.id)!;

    circuit.props.naam = "H";

    expect(node.summary.name).toBe("G");
    expect(Object.isFrozen(node)).toBe(true);
    expect(Object.isFrozen(node.summary)).toBe(true);
    expect(node).not.toHaveProperty("properties");
    expect(reader.getItem(circuit.id)?.label).toBe("Kring G");
    expect(new LegacySchemaDocumentReader(structure).getItem(circuit.id)?.label).toBe("Kring H");
  });

  it("exposes domain roles and capabilities without UI-specific filtering", () => {
    const structure = new Hierarchical_List();
    const container = structure.createContainerIfNotExists();
    const consumer = structure.addItem("Domotica gestuurde verbruiker");
    const attribute = structure.createItem("Schakelaars");
    attribute.props.isAttribuut = true;
    structure.insertChildAfterId(attribute, consumer.id);
    const reader = new LegacySchemaDocumentReader(structure);

    expect(reader.getItem(container.id)?.role).toBe("container");
    expect(reader.getItem(consumer.id)?.role).toBe("item");
    expect(reader.getItem(attribute.id)?.role).toBe("attribute");
    expect(reader.getItem(consumer.id)?.capabilities.allowedChildTypes).toContain("Contactdoos");
    expect(reader.getItem(consumer.id)?.capabilities.allowedChildTypes).not.toContain("---");
    expect(typeof reader.getItem(consumer.id)?.capabilities.canAddChild).toBe("boolean");
    expect(reader.getItem(attribute.id)?.capabilities.canDelete).toBe(false);
    expect(reader.getItem(container.id)?.capabilities.canAddChild).toBe(false);
    expect(reader.getRootCapabilities().allowedChildTypes).toEqual([
      "Aansluiting",
      "Zekering/differentieel",
      "Kring",
    ]);
  });

  it("keeps a complete revision stable across later document mutations", () => {
    const { structure, circuit } = createNamedHierarchy();
    const reader = new LegacySchemaDocumentReader(structure);
    const before = reader.getItem(circuit.id)!;
    const light = structure.createItem("Lichtpunt");
    structure.insertChildAfterId(light, circuit.id);

    expect(before.childIds).not.toContain(light.id);
    expect(reader.getItem(circuit.id)?.childIds).not.toContain(light.id);
    expect(reader.getItem(light.id)).toBeUndefined();

    const nextReader = new LegacySchemaDocumentReader(structure);
    expect(nextReader.getItem(circuit.id)?.childIds).toContain(light.id);
    expect(nextReader.getItem(light.id)?.parentId).toBe(circuit.id);
  });
});
