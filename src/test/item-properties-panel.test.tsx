import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LocalEditorStore } from "../application/EditorStore";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { Hierarchical_List } from "../Hierarchical_List";
import { ItemPropertiesPanel } from "../ui/properties/ItemPropertiesPanel";
import { HierarchyTree } from "../ui/hierarchy/HierarchyTree";

afterEach(cleanup);

function createSelectedCircuit() {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  const circuit = structure.createItem("Kring");
  structure.insertChildAfterId(circuit, board.id);
  const legacyItem = structure.createItem("Container");
  structure.insertChildAfterId(legacyItem, circuit.id);
  const schemaStore = new LegacySchemaStore(structure);
  const editorStore = new LocalEditorStore();
  editorStore.commands.selectItem(circuit.id);
  return { schemaStore, editorStore, circuitId: circuit.id, legacyItemId: legacyItem.id };
}

describe("ItemPropertiesPanel", () => {
  it("shows a useful empty and legacy fallback state", () => {
    const { schemaStore, editorStore, legacyItemId } = createSelectedCircuit();
    editorStore.commands.selectItem(null);
    const view = render(
      <ItemPropertiesPanel schemaStore={schemaStore} editorStore={editorStore} />,
    );
    expect(screen.getByText(/selecteer een onderdeel/i)).toBeVisible();

    act(() => editorStore.commands.selectItem(legacyItemId));
    expect(screen.getByText(/bestaande editor beheerd/i)).toBeVisible();
    view.unmount();
  });

  it("commits valid drafts through typed circuit commands and keeps invalid input local", () => {
    const { schemaStore, editorStore, circuitId } = createSelectedCircuit();
    render(<ItemPropertiesPanel schemaStore={schemaStore} editorStore={editorStore} />);

    fireEvent.change(screen.getByLabelText("Naamgeving"), { target: { value: "manueel" } });
    const name = screen.getByLabelText("Naam");
    fireEvent.change(name, { target: { value: "Garage" } });
    fireEvent.blur(name);
    expect(schemaStore.getSnapshot().properties.getCircuit(circuitId)?.name).toBe("Garage");

    const amperage = screen.getByLabelText("Stroom (A)");
    fireEvent.change(amperage, { target: { value: "ongeldig" } });
    fireEvent.blur(amperage);
    expect(screen.getByRole("alert")).toHaveTextContent("positief getal");
    expect(schemaStore.getSnapshot().properties.getCircuit(circuitId)?.amperage).toBe("20");

    fireEvent.change(amperage, { target: { value: "16" } });
    fireEvent.blur(amperage);
    expect(schemaStore.getSnapshot().properties.getCircuit(circuitId)?.amperage).toBe("16");
  });

  it("offers all conditional circuit fields and preserves normalization", () => {
    const { schemaStore, editorStore, circuitId } = createSelectedCircuit();
    render(<ItemPropertiesPanel schemaStore={schemaStore} editorStore={editorStore} />);

    fireEvent.change(screen.getByLabelText("Bescherming"), {
      target: { value: "differentieelautomaat" },
    });
    expect(screen.getByLabelText("Differentieelstroom (mA)")).toBeVisible();
    expect(screen.getByLabelText("Type differentieel")).toBeVisible();
    expect(screen.getByLabelText("Curve automaat")).toBeVisible();
    expect(screen.getByLabelText("Selectieve differentieel")).toBeVisible();
    expect(screen.getByLabelText("Fase")).toBeVisible();

    fireEvent.change(screen.getByLabelText("Plaatsing"), {
      target: { value: "Luchtleiding" },
    });
    expect(screen.queryByLabelText("In buis")).not.toBeInTheDocument();
    expect(schemaStore.getSnapshot().properties.getCircuit(circuitId)?.cableInConduit).toBe(false);

    expect(screen.getByText("Geavanceerde instellingen")).toBeVisible();
    expect(screen.getByLabelText("Tekst")).toBeInTheDocument();
    expect(screen.getByLabelText("Adres")).toBeInTheDocument();
  });

  it("shows an unknown legacy option without rewriting it", () => {
    const { schemaStore, editorStore, circuitId } = createSelectedCircuit();
    const circuit = schemaStore.getLegacyDocument().getElectroItemById(circuitId)!;
    circuit.props.bescherming = "historische-keuze";
    schemaStore.synchronizeLegacyDocument(schemaStore.getLegacyDocument());

    render(<ItemPropertiesPanel schemaStore={schemaStore} editorStore={editorStore} />);

    expect(screen.getByLabelText<HTMLSelectElement>("Bescherming").value)
      .toBe("historische-keuze");
    expect(screen.getByRole("option", { name: "Huidige waarde: historische-keuze" }))
      .toBeInTheDocument();
    expect(circuit.props.bescherming).toBe("historische-keuze");
  });

  it("updates history controls and restores property edits through undo and redo", () => {
    const { schemaStore, editorStore, circuitId } = createSelectedCircuit();
    render(
      <>
        <HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />
        <ItemPropertiesPanel schemaStore={schemaStore} editorStore={editorStore} />
      </>,
    );

    const undo = screen.getByRole("button", { name: "Ongedaan maken" });
    const redo = screen.getByRole("button", { name: "Opnieuw" });
    expect(undo).toBeDisabled();
    expect(redo).toBeDisabled();

    const amperage = screen.getByLabelText("Stroom (A)");
    fireEvent.change(amperage, { target: { value: "16" } });
    fireEvent.blur(amperage);
    expect(undo).toBeEnabled();
    expect(schemaStore.getSnapshot().properties.getCircuit(circuitId)?.amperage).toBe("16");

    fireEvent.click(undo);
    expect(schemaStore.getSnapshot().properties.getCircuit(circuitId)?.amperage).toBe("20");
    expect(redo).toBeEnabled();

    fireEvent.click(redo);
    expect(schemaStore.getSnapshot().properties.getCircuit(circuitId)?.amperage).toBe("16");
    expect(redo).toBeDisabled();
  });
});
