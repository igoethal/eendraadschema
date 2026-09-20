import { describe, expect, it } from "vitest";
import { Hierarchical_List } from "../Hierarchical_List";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { SchemaCommandError } from "../application/SchemaStore";

function busbarEnd(store: LegacySchemaStore): number {
  const document = new DOMParser().parseFromString(
    store.getLegacyDocument().toSVG(0, "horizontal").data,
    "image/svg+xml",
  );
  const busbar = Array.from(document.querySelectorAll("line"))
    .find(line => line.getAttribute("stroke-width") === "3" && line.getAttribute("x1") === "4")!;
  return Number(busbar.getAttribute("x2"));
}

function createBoard() {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  const store = new LegacySchemaStore(structure);
  store.commands.addItem(board.id, "Kring");
  return { store, boardId: board.id };
}

describe("Bord busbar extension to the right", () => {
  it("is off by default", () => {
    const { store, boardId } = createBoard();

    expect(store.getSnapshot().properties.getConfiguredItem(boardId)?.values.busbarExtensionRight).toBe("0");
  });

  it("lengthens the busbar by the chosen number of pixels and can be undone", () => {
    const { store, boardId } = createBoard();
    const before = busbarEnd(store);

    store.commands.updateConfiguredItem(boardId, { busbarExtensionRight: "100" });
    expect(busbarEnd(store)).toBe(before + 100);

    store.commands.undo();
    expect(busbarEnd(store)).toBe(before);
  });

  it("rejects lengths that are not offered", () => {
    const { store, boardId } = createBoard();

    expect(() => store.commands.updateConfiguredItem(boardId, { busbarExtensionRight: "37" }))
      .toThrow(SchemaCommandError);
  });

  it("treats a board saved without the setting as not extended", () => {
    const { store, boardId } = createBoard();
    const board = store.getLegacyDocument().getElectroItemById(boardId)!;
    const before = busbarEnd(store);

    delete board.props.verlenging_rechts;

    expect(busbarEnd(store)).toBe(before);
  });
});
