import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocalEditorStore } from "../application/EditorStore";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { LegacySituationPlanStore } from "../application/LegacySituationPlanStore";
import { LocalWorkspaceStore } from "../application/WorkspaceStore";
import { LegacySituationCanvasAdapter } from "../legacy/LegacySituationCanvasAdapter";
import { SituationPlanElement } from "../sitplan/SituationPlanElement";
import type { SituationPlanView } from "../sitplan/SituationPlanView";
import { loadFixture } from "./helpers";

beforeEach(() => {
  globalThis.SITPLANVIEW_DEFAULT_SCALE = 1;
});

function createAdapter() {
  const structure = loadFixture("example001.eds");
  const schemaStore = new LegacySchemaStore(structure);
  const situationStore = new LegacySituationPlanStore(structure);
  const editorStore = new LocalEditorStore();
  const workspaceStore = new LocalWorkspaceStore();
  const viewAdapter = { prepare: vi.fn() };
  const adapter = new LegacySituationCanvasAdapter(
    schemaStore,
    situationStore,
    editorStore,
    workspaceStore,
    viewAdapter,
    () => structure,
  );
  return { adapter, situationStore, structure, viewAdapter, workspaceStore };
}

describe("LegacySituationCanvasAdapter", () => {
  it("owns selection deletion and clears the React selection", () => {
    const { adapter, situationStore, structure, workspaceStore } = createAdapter();
    const element = new SituationPlanElement();
    structure.sitplan.addElement(element);
    situationStore.synchronizeLegacyDocument();
    workspaceStore.commands.selectSituationElement(element.id);

    adapter.deleteSelection([element.id]);

    expect(situationStore.getSnapshot().elements).toHaveLength(0);
    expect(workspaceStore.getSnapshot().selectedSituationElementId).toBeNull();
  });

  it("reveals an occurrence through the view boundary and workspace store", () => {
    const { adapter, situationStore, structure, viewAdapter, workspaceStore } = createAdapter();
    const element = new SituationPlanElement();
    element.boxref = document.createElement("div");
    structure.sitplan.addElement(element);
    situationStore.synchronizeLegacyDocument();
    const selectPage = vi.fn();
    const selectOneBox = vi.fn();
    structure.sitplanview = { selectPage, selectOneBox } as unknown as SituationPlanView;

    adapter.revealOccurrence(element.id);

    expect(viewAdapter.prepare).toHaveBeenCalledWith("situation");
    expect(selectPage).toHaveBeenCalledWith(element.page);
    expect(selectOneBox).toHaveBeenCalledWith(element.boxref);
    expect(workspaceStore.getSnapshot()).toMatchObject({
      activeTab: "situation",
      selectedSituationElementId: element.id,
    });
  });
});
