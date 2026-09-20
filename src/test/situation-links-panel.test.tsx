import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocalEditorStore } from "../application/EditorStore";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { LegacySituationPlanStore } from "../application/LegacySituationPlanStore";
import { Electro_Item } from "../List_Item/Electro_Item";
import { SituationLinksPanel } from "../ui/workspace/SituationLinksPanel";
import { loadFixture } from "./helpers";

beforeEach(() => {
  globalThis.SITPLANVIEW_DEFAULT_SCALE = 1;
});

afterEach(() => {
  cleanup();
});

function createLinkedItem() {
  const structure = loadFixture("example001.eds");
  const item = structure.data.find(
    (candidate): candidate is Electro_Item => candidate instanceof Electro_Item && candidate.getType() === "Kring",
  )!;
  const defaults = structure.sitplan.getDefaults();
  const occurrence = structure.sitplan.addElementFromElectroItem(
    item.id,
    1,
    25,
    40,
    "auto",
    "",
    "rechts",
    defaults.fontsize,
    defaults.scale,
    defaults.rotate,
  )!;
  const schemaStore = new LegacySchemaStore(structure);
  const editorStore = new LocalEditorStore();
  const situationPlanStore = new LegacySituationPlanStore(structure);
  editorStore.commands.selectItem(item.id);
  return { item, occurrence, schemaStore, editorStore, situationPlanStore };
}

describe("SituationLinksPanel", () => {
  it("shows and opens situation-plan occurrences for the selected hierarchy item", () => {
    const { item, occurrence, schemaStore, editorStore, situationPlanStore } = createLinkedItem();
    const onRevealOccurrence = vi.fn();
    const onCreateOccurrence = vi.fn();
    render(
      <SituationLinksPanel
        schemaStore={schemaStore}
        editorStore={editorStore}
        situationPlanStore={situationPlanStore}
        canCreateOccurrence={() => true}
        onCreateOccurrence={onCreateOccurrence}
        onRevealOccurrence={onRevealOccurrence}
      />,
    );

    expect(screen.getByText(new RegExp(`${item.getType()}.*1 plaatsing`))).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Toon plaatsing 1 · pagina 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Plaats symbool" }));

    expect(onRevealOccurrence).toHaveBeenCalledWith(occurrence.id);
    expect(onCreateOccurrence).toHaveBeenCalledWith(item.id);
  });

  it("explains the linking flow before an item is selected", () => {
    const { schemaStore, situationPlanStore } = createLinkedItem();
    render(
      <SituationLinksPanel
        schemaStore={schemaStore}
        editorStore={new LocalEditorStore()}
        situationPlanStore={situationPlanStore}
        canCreateOccurrence={() => false}
        onCreateOccurrence={() => {}}
        onRevealOccurrence={() => {}}
      />,
    );

    expect(screen.getByText(/Selecteer een elektrisch onderdeel/)).toBeInTheDocument();
  });
});
