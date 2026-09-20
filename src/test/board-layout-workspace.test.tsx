import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LocalEditorStore } from "../application/EditorStore";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { BoardLayoutInspector } from "../ui/boards/BoardLayoutInspector";
import { BoardLayoutWorkspace } from "../ui/boards/BoardLayoutWorkspace";
import { loadFixture } from "./helpers";

beforeEach(() => {
  globalThis.SITPLANVIEW_DEFAULT_SCALE = 1;
});

afterEach(() => {
  cleanup();
});

function createState() {
  const structure = loadFixture("example001.eds");
  const schemaStore = new LegacySchemaStore(structure);
  schemaStore.commands.addItem(null, "Zekering/differentieel");
  return {
    editorStore: new LocalEditorStore(),
    schemaStore,
  };
}

describe("BoardLayoutWorkspace", () => {
  it("configures the board and places a circuit by clicking an empty module", () => {
    const { editorStore, schemaStore } = createState();
    render(<BoardLayoutWorkspace schemaStore={schemaStore} editorStore={editorStore} />);

    fireEvent.change(screen.getByLabelText("Modules breed"), { target: { value: "12" } });
    fireEvent.change(screen.getByLabelText("Aantal rijen"), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: "Formaat toepassen" }));
    fireEvent.click(screen.getByRole("button", { name: "Lege positie Rij 1, module 2" }));
    const itemSelect = screen.getByLabelText("Module") as HTMLSelectElement;
    const placedItemId = Number(itemSelect.value);
    fireEvent.change(screen.getByLabelText("Modulebreedte"), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: "Module plaatsen" }));

    expect(schemaStore.getSnapshot().boardLayouts[0]).toMatchObject({
      boardId: "main",
      rails: [
        { name: "Rij 1", moduleCapacity: 12 },
        { name: "Rij 2", moduleCapacity: 12 },
      ],
      placements: [{
        itemId: placedItemId,
        startModule: 1,
        moduleWidth: 2,
      }],
    });
  });

  it("switches board roots and only lists circuits from the selected board", () => {
    const { editorStore, schemaStore } = createState();
    const sourceCircuit = schemaStore.getSnapshot().document.getAllItems().find(item => item.type === "Kring");
    if (!sourceCircuit) throw new Error("Fixture bevat geen voedende kring.");
    const secondBoardId = schemaStore.commands.addDistributionBoard(sourceCircuit.id, { name: "Tuinbord" });
    const secondBoardRootId = schemaStore.getSnapshot().document.getBoard(secondBoardId)?.rootItemIds[0];
    if (secondBoardRootId === undefined) throw new Error("Nieuw bord heeft geen wortelitem.");
    const secondCircuitId = schemaStore.commands.addItem(secondBoardRootId, "Kring");
    schemaStore.commands.addItem(secondCircuitId, "Contactdoos");

    render(<BoardLayoutWorkspace schemaStore={schemaStore} editorStore={editorStore} />);
    fireEvent.change(screen.getByLabelText("Verdeelbord"), { target: { value: secondBoardId } });

    expect((screen.getByLabelText("Verdeelbord") as HTMLSelectElement).value).toBe(secondBoardId);
    const palette = screen.getByLabelText("Modules van het verdeelbord");
    const draggableItems = within(palette).getAllByRole("button").filter(button => button.draggable);
    expect(draggableItems).toHaveLength(1);
    expect(draggableItems[0]).not.toHaveTextContent(/^Kring\b/);
    expect(within(palette).queryByText("Contactdoos")).not.toBeInTheDocument();
  });

  it("edits a selected module through the contextual inspector", () => {
    const { editorStore, schemaStore } = createState();
    const item = schemaStore.getSnapshot().document.getAllItems()
      .find(candidate => candidate.role === "item"
        && schemaStore.getSnapshot().document.getBoardForItem(candidate.id)?.id === "main");
    if (!item) throw new Error("Fixture bevat geen onderdeel voor het hoofdbord.");
    const railId = schemaStore.commands.addBoardLayoutRail("main");
    schemaStore.commands.placeBoardLayoutItem("main", item.id, {
      railId,
      startModule: 0,
      moduleWidth: 1,
    });
    editorStore.commands.selectItem(item.id);
    render(<BoardLayoutInspector schemaStore={schemaStore} editorStore={editorStore} />);

    fireEvent.change(screen.getByLabelText("Startmodule"), { target: { value: "3" } });
    fireEvent.change(screen.getByLabelText("Modulebreedte"), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: "Positie toepassen" }));

    expect(schemaStore.getSnapshot().boardLayouts[0].placements[0]).toMatchObject({
      itemId: item.id,
      startModule: 2,
      moduleWidth: 2,
    });
  });
});
