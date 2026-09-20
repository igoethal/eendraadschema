import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LocalEditorStore } from "../application/EditorStore";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { Hierarchical_List } from "../Hierarchical_List";
import { SchematicSelectionBridge } from "../ui/schematic/SchematicSelectionBridge";

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
});

function setupBridge() {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  const schemaStore = new LegacySchemaStore(structure);
  const circuitId = schemaStore.commands.addItem(board.id, "Kring");
  const socketId = schemaStore.commands.addItem(circuitId, "Contactdoos");
  const editorStore = new LocalEditorStore();
  const previewElement = document.createElement("div");
  previewElement.innerHTML = schemaStore.getLegacyDocument().toSVG(0, "horizontal").data;
  document.body.append(previewElement);
  render(
    <SchematicSelectionBridge
      schemaStore={schemaStore}
      editorStore={editorStore}
      previewElement={previewElement}
    />,
  );
  return { boardId: board.id, circuitId, editorStore, previewElement, schemaStore, socketId };
}

describe("SchematicSelectionBridge", () => {
  it("reveals the matching hierarchy item when its container is clicked", () => {
    const { boardId, circuitId, editorStore, previewElement, socketId } = setupBridge();
    const symbol = previewElement.querySelector(`[data-schema-item-id="${socketId}"]`);
    const hitArea = symbol?.querySelector("[data-schema-hit-area]");

    expect(hitArea).toHaveAttribute("pointer-events", "all");
    fireEvent.click(hitArea!);

    const editor = editorStore.getSnapshot();
    expect(editor.selectedItemId).toBe(socketId);
    expect(editor.expandedItemIds).toEqual(new Set([circuitId, boardId]));
  });

  it("shows which schematic container is being hovered", () => {
    const { previewElement, socketId } = setupBridge();
    const symbol = previewElement.querySelector(`[data-schema-item-id="${socketId}"]`)!;
    const hitArea = symbol.querySelector("[data-schema-hit-area]")!;

    fireEvent.pointerOver(hitArea);
    expect(symbol).toHaveAttribute("data-schema-hovered", "true");
    expect(symbol.getAttribute("class")).toContain("#2563eb");

    fireEvent.pointerOut(hitArea, { relatedTarget: previewElement });
    expect(symbol).not.toHaveAttribute("data-schema-hovered");
  });

  it("highlights the schematic item selected in the hierarchy and restores it after redraw", async () => {
    const { editorStore, previewElement, schemaStore, socketId } = setupBridge();

    act(() => editorStore.commands.selectItem(socketId));
    expect(previewElement.querySelectorAll(`[data-schema-item-id="${socketId}"][data-schema-selected="true"]`).length)
      .toBeGreaterThan(0);

    previewElement.innerHTML = schemaStore.getLegacyDocument().toSVG(0, "horizontal").data;
    await waitFor(() => {
      expect(previewElement.querySelector(`[data-schema-item-id="${socketId}"]`))
        .toHaveAttribute("data-schema-selected", "true");
    });
  });
});
