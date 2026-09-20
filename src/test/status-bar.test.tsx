import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { LocalEditorStore } from "../application/EditorStore";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { LegacySaveStatusStore } from "../application/SaveStatusStore";
import { Hierarchical_List } from "../Hierarchical_List";
import { StatusBar } from "../ui/layout/StatusBar";

afterEach(cleanup);

function createStores() {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  board.props.naam = "Hoofdbord";
  const schemaStore = new LegacySchemaStore(structure);
  const editorStore = new LocalEditorStore();
  const saveState = { hasUnsavedChanges: false, filename: "schema.eds" };
  const saveStatusStore = new LegacySaveStatusStore(() => ({ ...saveState }));
  return { schemaStore, editorStore, saveStatusStore, saveState, board };
}

describe("LegacySaveStatusStore", () => {
  it("publishes only when the underlying state changes", () => {
    const { saveStatusStore, saveState } = createStores();
    let notifications = 0;
    saveStatusStore.subscribe(() => { notifications += 1; });

    saveStatusStore.refresh();
    expect(notifications).toBe(0);

    saveState.hasUnsavedChanges = true;
    saveStatusStore.refresh();
    saveStatusStore.refresh();
    expect(notifications).toBe(1);
    expect(saveStatusStore.getSnapshot().hasUnsavedChanges).toBe(true);
  });
});

describe("StatusBar", () => {
  it("shows board, selection, and save status", () => {
    const { schemaStore, editorStore, saveStatusStore, saveState, board } = createStores();
    editorStore.commands.selectItem(board.id);
    render(
      <StatusBar
        schemaStore={schemaStore}
        editorStore={editorStore}
        saveStatusStore={saveStatusStore}
      />,
    );

    const statusbar = screen.getByRole("contentinfo", { name: "Statusbalk van de editor" });
    expect(statusbar).toHaveTextContent("Bord: Hoofdbord");
    expect(statusbar).toHaveTextContent("Hoofdbord");
    expect(screen.getByRole("status")).toHaveTextContent("schema.eds is opgeslagen");

    saveState.hasUnsavedChanges = true;
    act(() => saveStatusStore.refresh());
    expect(screen.getByRole("status")).toHaveTextContent(
      "Niet opgeslagen wijzigingen in schema.eds",
    );
  });

  it("controls the zoom level and applies it to the preview element", () => {
    const { schemaStore, editorStore, saveStatusStore } = createStores();
    const zoomTarget = document.createElement("div");
    render(
      <StatusBar
        schemaStore={schemaStore}
        editorStore={editorStore}
        saveStatusStore={saveStatusStore}
        zoomTargetElement={zoomTarget}
      />,
    );

    expect(zoomTarget.style.getPropertyValue("zoom")).toBe("100%");

    fireEvent.click(screen.getByRole("button", { name: "Inzoomen" }));
    expect(editorStore.getSnapshot().zoomPercent).toBe(125);
    expect(zoomTarget.style.getPropertyValue("zoom")).toBe("125%");

    fireEvent.click(screen.getByRole("button", { name: "Zoom terugzetten naar 100 procent" }));
    expect(editorStore.getSnapshot().zoomPercent).toBe(100);
    expect(zoomTarget.style.getPropertyValue("zoom")).toBe("100%");

    fireEvent.click(screen.getByRole("button", { name: "Uitzoomen" }));
    fireEvent.click(screen.getByRole("button", { name: "Uitzoomen" }));
    fireEvent.click(screen.getByRole("button", { name: "Uitzoomen" }));
    expect(editorStore.getSnapshot().zoomPercent).toBe(25);
    expect(screen.getByRole("button", { name: "Uitzoomen" })).toBeDisabled();
  });
});
