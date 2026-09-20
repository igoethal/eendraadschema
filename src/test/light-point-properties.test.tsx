import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LocalEditorStore } from "../application/EditorStore";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { Hierarchical_List } from "../Hierarchical_List";
import { ItemPropertiesPanel } from "../ui/properties/ItemPropertiesPanel";

afterEach(cleanup);

function createSelectedLight() {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  const circuit = structure.createItem("Kring");
  structure.insertChildAfterId(circuit, board.id);
  const light = structure.createItem("Lichtpunt");
  structure.insertChildAfterId(light, circuit.id);
  structure.reNumber(false);
  const schemaStore = new LegacySchemaStore(structure);
  const editorStore = new LocalEditorStore();
  editorStore.commands.selectItem(light.id);
  return { schemaStore, editorStore, lightId: light.id };
}

describe("LightPointPropertiesEditor", () => {
  it("edits all light-point fields and conditional TL settings", () => {
    const { schemaStore, editorStore, lightId } = createSelectedLight();
    render(<ItemPropertiesPanel schemaStore={schemaStore} editorStore={editorStore} />);

    fireEvent.change(screen.getByLabelText("Lamptype"), { target: { value: "TL" } });
    fireEvent.change(screen.getByLabelText("Aantal buizen"), { target: { value: "3" } });
    fireEvent.change(screen.getByLabelText("Aantal lampen"), { target: { value: "4" } });
    fireEvent.click(screen.getByLabelText("Wandlamp"));
    fireEvent.click(screen.getByLabelText("Halfwaterdicht"));
    fireEvent.click(screen.getByLabelText("Ingebouwde schakelaar"));
    fireEvent.change(screen.getByLabelText("Noodverlichting"), { target: { value: "Decentraal" } });

    expect(schemaStore.getSnapshot().properties.getLightPoint(lightId)).toMatchObject({
      lampType: "TL",
      tubeCount: "3",
      count: "4",
      wallLight: true,
      splashProof: true,
      builtInSwitch: true,
      emergencyLighting: "Decentraal",
    });
    expect(schemaStore.getSnapshot().canUndo).toBe(true);
  });
});
