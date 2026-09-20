import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LocalEditorStore } from "../application/EditorStore";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { Hierarchical_List } from "../Hierarchical_List";
import { EditorApp } from "../ui/App";

afterEach(cleanup);

function createStore() {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  return { store: new LegacySchemaStore(structure), boardId: board.id };
}

describe("EditorApp", () => {
  it("renders an accessible Dutch editor shell from the schema store", () => {
    const { store } = createStore();
    render(
      <EditorApp
        schemaStore={store}
        editorStore={new LocalEditorStore()}
        hierarchyMountElement={null}
      />,
    );

    expect(screen.getByRole("banner")).toHaveTextContent("Eéndraadschema");
    expect(screen.getByRole("status")).toHaveTextContent("1 elektrisch onderdeel");
  });

  it("updates when a schema command publishes a new snapshot", () => {
    const { store, boardId } = createStore();
    render(
      <EditorApp
        schemaStore={store}
        editorStore={new LocalEditorStore()}
        hierarchyMountElement={null}
      />,
    );

    act(() => {
      store.commands.addItem(boardId, "Kring");
    });

    expect(screen.getByRole("status")).toHaveTextContent("2 elektrische onderdelen");
  });

});
