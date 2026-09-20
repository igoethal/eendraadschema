import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LocalEditorStore } from "../application/EditorStore";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { BASIC_CONSUMER_TYPES } from "../application/SchemaPropertyReader";
import { Hierarchical_List } from "../Hierarchical_List";
import { ItemPropertiesPanel } from "../ui/properties/ItemPropertiesPanel";

afterEach(cleanup);

function createConsumer(type: typeof BASIC_CONSUMER_TYPES[number]) {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  const circuit = structure.createItem("Kring");
  structure.insertChildAfterId(circuit, board.id);
  const consumer = structure.createItem(type);
  structure.insertChildAfterId(consumer, circuit.id);
  structure.reNumber(false);
  const schemaStore = new LegacySchemaStore(structure);
  const editorStore = new LocalEditorStore();
  editorStore.commands.selectItem(consumer.id);
  return { schemaStore, editorStore, consumerId: consumer.id };
}

describe("BasicConsumerPropertiesEditor", () => {
  it.each(BASIC_CONSUMER_TYPES)("registers the complete %s editor", (type) => {
    const { schemaStore, editorStore } = createConsumer(type);
    render(<ItemPropertiesPanel schemaStore={schemaStore} editorStore={editorStore} />);

    expect(screen.getByRole("group", { name: type })).toBeVisible();
    expect(screen.getByLabelText("Nummering")).toBeInTheDocument();
    expect(screen.getByLabelText("Adres of tekst")).toBeInTheDocument();
    expect(screen.queryByText(/bestaande editor beheerd/i)).not.toBeInTheDocument();
  });

  it("updates basic fields and restores them through history", () => {
    const { schemaStore, editorStore, consumerId } = createConsumer("Wasmachine");
    render(<ItemPropertiesPanel schemaStore={schemaStore} editorStore={editorStore} />);

    fireEvent.change(screen.getByLabelText("Nummering"), { target: { value: "manueel" } });
    const number = screen.getByLabelText("Nummer");
    fireEvent.change(number, { target: { value: "W1" } });
    fireEvent.blur(number);
    const address = screen.getByLabelText("Adres of tekst");
    fireEvent.change(address, { target: { value: "Wasplaats" } });
    fireEvent.blur(address);

    expect(schemaStore.getSnapshot().properties.getBasicConsumer(consumerId)).toMatchObject({
      numberMode: "manueel",
      number: "W1",
      address: "Wasplaats",
    });
    schemaStore.commands.undo();
    expect(schemaStore.getSnapshot().properties.getBasicConsumer(consumerId)?.address).toBe("");
    schemaStore.commands.redo();
    expect(schemaStore.getSnapshot().properties.getBasicConsumer(consumerId)?.address).toBe("Wasplaats");
  });
});
