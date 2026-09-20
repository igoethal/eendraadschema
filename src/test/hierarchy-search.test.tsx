import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LocalEditorStore } from "../application/EditorStore";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { Hierarchical_List } from "../Hierarchical_List";
import { HierarchyTree } from "../ui/hierarchy/HierarchyTree";
import { searchHierarchyItems } from "../ui/hierarchy/hierarchyModel";

afterEach(cleanup);

function createDocumentWithGarageBoard() {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  board.props.naam = "Hoofdbord";
  const circuit = structure.createItem("Kring");
  circuit.props.naam = "Keuken";
  structure.insertChildAfterId(circuit, board.id);
  const socket = structure.createItem("Contactdoos");
  socket.props.adres = "Aanrecht";
  structure.insertChildAfterId(socket, circuit.id);

  const schemaStore = new LegacySchemaStore(structure);
  const editorStore = new LocalEditorStore();

  const feederId = schemaStore.commands.addItem(board.id, "Kring");
  const garageBoardId = schemaStore.commands.addDistributionBoard(feederId, { name: "Garage" });
  const garageRootId = schemaStore.getSnapshot().document.getBoard(garageBoardId)!.rootItemIds[0];
  const garageCircuitId = schemaStore.commands.addItem(garageRootId, "Kring");
  const freezerId = schemaStore.commands.addItem(garageCircuitId, "Diepvriezer");

  return {
    schemaStore,
    editorStore,
    board,
    circuit,
    socket,
    garageBoardId,
    garageRootId,
    garageCircuitId,
    freezerId,
  };
}

describe("searchHierarchyItems", () => {
  it("matches label, type, and summary fields case-insensitively", () => {
    const { schemaStore, socket, freezerId } = createDocumentWithGarageBoard();
    const document = schemaStore.getSnapshot().document;

    expect(searchHierarchyItems(document, "aanrecht").map((result) => result.node.id))
      .toEqual([socket.id]);
    expect(searchHierarchyItems(document, "DIEPVRIEZER").map((result) => result.node.id))
      .toEqual([freezerId]);
    expect(searchHierarchyItems(document, "  ")).toEqual([]);
    expect(searchHierarchyItems(document, "bestaatniet")).toEqual([]);
  });

  it("reports the containing board and the ancestor chain", () => {
    const { schemaStore, garageBoardId, garageRootId, garageCircuitId, freezerId } =
      createDocumentWithGarageBoard();
    const document = schemaStore.getSnapshot().document;

    const [result] = searchHierarchyItems(document, "Diepvriezer");
    expect(result.node.id).toBe(freezerId);
    expect(result.boardId).toBe(garageBoardId);
    expect(result.boardName).toBe("Garage");
    expect(result.ancestorItemIds.slice(-2)).toEqual([garageRootId, garageCircuitId]);
  });
});

describe("HierarchySearch in the tree", () => {
  it("shows results while typing and clears them on Escape", () => {
    const { schemaStore, editorStore } = createDocumentWithGarageBoard();
    render(<HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />);

    const input = screen.getByRole("searchbox", { name: "Zoeken in het schema" });
    fireEvent.change(input, { target: { value: "Diepvriezer" } });
    expect(screen.getByRole("status").textContent).toContain("1 onderdeel gevonden");

    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("reveals a result on another board with expanded ancestors and selection", () => {
    const { schemaStore, editorStore, garageBoardId, garageRootId, garageCircuitId, freezerId } =
      createDocumentWithGarageBoard();
    render(<HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />);
    expect(editorStore.getSnapshot().activeBoardId).toBe("main");

    const input = screen.getByRole("searchbox", { name: "Zoeken in het schema" });
    fireEvent.change(input, { target: { value: "Diepvriezer" } });
    fireEvent.click(screen.getByRole("button", { name: /Diepvriezer/ }));

    const editorSnapshot = editorStore.getSnapshot();
    expect(editorSnapshot.activeBoardId).toBe(garageBoardId);
    expect(editorSnapshot.selectedItemId).toBe(freezerId);
    expect(editorSnapshot.expandedItemIds.has(garageRootId)).toBe(true);
    expect(editorSnapshot.expandedItemIds.has(garageCircuitId)).toBe(true);
    expect((input as HTMLInputElement).value).toBe("");

    const revealedRow = document.querySelector(`[data-hierarchy-item-id="${freezerId}"]`);
    expect(revealedRow).not.toBeNull();
    expect(revealedRow).toHaveAttribute("aria-current", "true");
  });

  it("selects the first result with Enter", () => {
    const { schemaStore, editorStore, socket } = createDocumentWithGarageBoard();
    render(<HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />);

    const input = screen.getByRole("searchbox", { name: "Zoeken in het schema" });
    fireEvent.change(input, { target: { value: "Aanrecht" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(editorStore.getSnapshot().selectedItemId).toBe(socket.id);
  });
});
