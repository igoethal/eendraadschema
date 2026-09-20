import { describe, expect, it, beforeEach } from "vitest";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { loadFixture } from "./helpers";

beforeEach(() => {
  globalThis.SITPLANVIEW_DEFAULT_SCALE = 1;
});

describe("reviewed agent change sets", () => {
  it("stages and records several valid mutations as one undoable revision", () => {
    const structure = loadFixture("example001.eds");
    const store = new LegacySchemaStore(structure);
    const circuit = store.getSnapshot().document.getAllItems().find(item => item.type === "Kring")!;
    const before = store.getSnapshot().document.getAllItems().length;

    store.commands.applyAgentChangeSet([
      { kind: "add-item", parentId: circuit.id, type: "Contactdoos" },
      { kind: "add-item", parentId: circuit.id, type: "Lichtpunt" },
    ]);

    expect(store.getSnapshot().document.getAllItems()).toHaveLength(before + 2);
    expect(store.getSnapshot().placementTasks.some(task => task.destination === "situation")).toBe(true);
    expect(store.getSnapshot().canUndo).toBe(true);
    store.commands.undo();
    expect(store.getSnapshot().document.getAllItems()).toHaveLength(before);
  });

  it("leaves the live document untouched when any staged operation is invalid", () => {
    const structure = loadFixture("example001.eds");
    const store = new LegacySchemaStore(structure);
    const before = store.getSnapshot().revision;

    expect(() => store.commands.applyAgentChangeSet([
      { kind: "add-item", parentId: null, type: "Contactdoos" },
    ])).toThrow(/niet toegestaan/);
    expect(store.getSnapshot().revision).toBe(before);
  });

  it("stores dossier metadata and a named placement task", () => {
    const structure = loadFixture("example001.eds");
    const store = new LegacySchemaStore(structure);
    const item = store.getSnapshot().document.getAllItems().find(candidate => candidate.type === "Contactdoos")!;

    store.commands.updateDossierMetadata({ installationContext: "change", installationAddress: "Teststraat 1", revisionLabel: "v2", issueDate: "2026-08-16" });
    store.commands.createPlacementTask(item.id, "situation", "gelijkvloers keuken");

    expect(store.getSnapshot().document.getDocumentDetails().dossier).toMatchObject({ installationContext: "change", installationAddress: "Teststraat 1" });
    expect(store.getSnapshot().placementTasks).toContainEqual(expect.objectContaining({ itemId: item.id, locationHint: "gelijkvloers keuken" }));
  });
});
