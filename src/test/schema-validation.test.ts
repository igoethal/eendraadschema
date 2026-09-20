// @vitest-environment node

import { describe, expect, it } from "vitest";
import { LegacySchemaDocumentReader } from "../application/LegacySchemaDocumentReader";
import { validateSchemaDocument } from "../application/SchemaValidation";
import { Hierarchical_List } from "../Hierarchical_List";

function createDocument() {
  const structure = new Hierarchical_List();
  const mainRoot = structure.addItem("Bord");
  mainRoot.props.naam = "Hoofdbord";
  const feeder = structure.createItem("Kring");
  structure.insertChildAfterId(feeder, mainRoot.id);
  structure.boards = [{ id: "main", name: "Hoofdbord", rootItemIds: [mainRoot.id] }];
  return { structure, mainRoot, feeder };
}

describe("validateSchemaDocument", () => {
  it("accepts a structurally valid main and secondary board", () => {
    const { structure, feeder } = createDocument();
    const secondaryRoot = structure.createItem("Bord");
    structure.insertChildAfterId(secondaryRoot, feeder.id);
    structure.boards.push({
      id: "garage",
      name: "Garage",
      feeder: { sourceBoardId: "main", sourceCircuitId: feeder.id },
      rootItemIds: [secondaryRoot.id],
    });

    expect(validateSchemaDocument(new LegacySchemaDocumentReader(structure))).toEqual([]);
  });

  it("reports missing feeders, roots, source circuits, cycles, and orphaned items", () => {
    const { structure, mainRoot, feeder } = createDocument();
    const orphan = structure.addItem("Bord");
    structure.boards.push(
      { id: "garage", name: "Garage", rootItemIds: [99_999] },
      {
        id: "cycle-a",
        name: "A",
        feeder: { sourceBoardId: "cycle-b", sourceCircuitId: feeder.id },
        rootItemIds: [mainRoot.id],
      },
      {
        id: "cycle-b",
        name: "B",
        feeder: { sourceBoardId: "cycle-a", sourceCircuitId: 88_888 },
        rootItemIds: [],
      },
    );

    const codes = validateSchemaDocument(new LegacySchemaDocumentReader(structure))
      .map((validationIssue) => validationIssue.code);
    expect(codes).toEqual(expect.arrayContaining([
      "BOARD_WITHOUT_FEEDER",
      "MISSING_BOARD_ROOT",
      "MISSING_FEEDER_CIRCUIT",
      "BOARD_CONNECTION_CYCLE",
      "BOARD_WITHOUT_ROOT",
      "ORPHANED_ITEM",
    ]));
    expect(codes.filter((code) => code === "ORPHANED_ITEM")).toHaveLength(1);
    expect(orphan.id).not.toBe(mainRoot.id);
  });
});
