import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocalEditorStore } from "../application/EditorStore";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { LegacySituationPlanStore } from "../application/LegacySituationPlanStore";
import { SituationPlacementPalette } from "../ui/workspace/SituationPlacementPalette";
import { loadFixture } from "./helpers";

beforeEach(() => {
  globalThis.SITPLANVIEW_DEFAULT_SCALE = 1;
});
afterEach(cleanup);

describe("SituationPlacementPalette", () => {
  it("shows missing field items, circuit filtering, and direct placement", () => {
    const structure = loadFixture("example001.eds");
    const schemaStore = new LegacySchemaStore(structure);
    const situationStore = new LegacySituationPlanStore(structure);
    const editorStore = new LocalEditorStore();
    const onCreateOccurrence = vi.fn();

    render(<SituationPlacementPalette
      schema={schemaStore.getSnapshot()}
      situation={situationStore.getSnapshot()}
      editorStore={editorStore}
      canCreateOccurrence={() => true}
      onCreateOccurrence={onCreateOccurrence}
    />);

    expect(screen.getByRole("heading", { name: "Nog te plaatsen" })).toBeVisible();
    expect(screen.getByLabelText("Kring").querySelectorAll("option").length).toBeGreaterThan(1);
    const firstPlaceButton = screen.getAllByRole("button", { name: "Plaats" })[0];
    fireEvent.click(firstPlaceButton);
    expect(onCreateOccurrence).toHaveBeenCalledOnce();
    expect(editorStore.getSnapshot().selectedItemId).toBe(onCreateOccurrence.mock.calls[0][0]);
  });
});
