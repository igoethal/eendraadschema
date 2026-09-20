import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CONFIGURED_ITEM_PROPERTY_SCHEMAS } from "../application/ConfiguredItemProperties";
import { LocalEditorStore } from "../application/EditorStore";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { Hierarchical_List } from "../Hierarchical_List";
import { ItemPropertiesPanel } from "../ui/properties/ItemPropertiesPanel";

afterEach(cleanup);

function createConfiguredItem(type: string) {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  let itemId = board.id;
  if (type !== "Bord") {
    const circuit = structure.createItem("Kring");
    structure.insertChildAfterId(circuit, board.id);
    const item = structure.createItem(type);
    structure.insertChildAfterId(item, circuit.id);
    itemId = item.id;
  }
  structure.reNumber(false);
  const schemaStore = new LegacySchemaStore(structure);
  const editorStore = new LocalEditorStore();
  editorStore.commands.selectItem(itemId);
  return { schemaStore, editorStore };
}

describe("ConfiguredItemPropertiesEditor", () => {
  it.each(Object.keys(CONFIGURED_ITEM_PROPERTY_SCHEMAS))("registers the complete %s editor", (type) => {
    const { schemaStore, editorStore } = createConfiguredItem(type);
    render(<ItemPropertiesPanel schemaStore={schemaStore} editorStore={editorStore} />);

    expect(screen.getByRole("group", { name: type })).toBeVisible();
    expect(screen.queryByText(/bestaande editor beheerd/i)).not.toBeInTheDocument();
  });

  it("renders conditional fields from the current document projection", () => {
    const { schemaStore, editorStore } = createConfiguredItem("Verwarmingstoestel");
    const view = render(<ItemPropertiesPanel schemaStore={schemaStore} editorStore={editorStore} />);

    expect(screen.queryByLabelText("Ventilator")).not.toBeInTheDocument();
    schemaStore.commands.updateConfiguredItem(
      editorStore.getSnapshot().selectedItemId!,
      { accumulation: true },
    );
    view.rerender(<ItemPropertiesPanel schemaStore={schemaStore} editorStore={editorStore} />);
    expect(screen.getByLabelText("Ventilator")).toBeInTheDocument();
  });

  it("edits omschakelaar poles, rating, incoming-wire port, and description", () => {
    const { schemaStore, editorStore } = createConfiguredItem("Omschakelaar");
    render(<ItemPropertiesPanel schemaStore={schemaStore} editorStore={editorStore} />);

    expect(screen.getByLabelText("Aantal polen")).toHaveValue("4");
    const rating = screen.getByLabelText("Nominale stroom");
    expect(Array.from(rating.querySelectorAll("option"), option => option.value)).toEqual([
      "16", "25", "32", "40", "63", "80", "100",
    ]);
    expect(screen.getByLabelText("Inkomende leiding op poort")).toHaveValue("IN");
    expect(screen.getByLabelText("Adres/omschrijving")).toHaveValue("");

    fireEvent.change(rating, { target: { value: "80" } });
    expect(schemaStore.getSnapshot().properties
      .getConfiguredItem(editorStore.getSnapshot().selectedItemId!)?.values.amperage).toBe("80");
  });
});
