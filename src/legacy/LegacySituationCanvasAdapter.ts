import type { Hierarchical_List } from "../Hierarchical_List";
import type { EditorStore } from "../application/EditorStore";
import type { LegacySchemaStore } from "../application/LegacySchemaStore";
import type { LegacySituationPlanStore } from "../application/LegacySituationPlanStore";
import type { SituationCanvasAdapter } from "../application/SituationCanvasAdapter";
import type { WorkspaceStore } from "../application/WorkspaceStore";
import type { WorkspaceViewAdapter } from "../application/WorkspaceViewAdapter";

/** Translates React workspace commands to the remaining legacy canvas API. */
export class LegacySituationCanvasAdapter implements SituationCanvasAdapter {
  constructor(
    private readonly schemaStore: LegacySchemaStore,
    private readonly situationStore: LegacySituationPlanStore,
    private readonly editorStore: EditorStore,
    private readonly workspaceStore: WorkspaceStore,
    private readonly viewAdapter: WorkspaceViewAdapter,
    private readonly getDocument: () => Hierarchical_List,
  ) {}

  canCreateOccurrence(itemId: number): boolean {
    const document = this.getDocument();
    const item = document.getElectroItemById(itemId);
    return item !== null
      && document.sitplan.countByElectroItemId(itemId) < item.maxSituationPlanElements();
  }

  createOccurrence(itemId: number): void {
    this.viewAdapter.prepare("situation");
    this.workspaceStore.commands.selectTab("situation");
    const document = this.getDocument();
    const defaults = document.sitplan.getDefaults();
    document.sitplanview?.addElectroItem(
      itemId,
      "auto",
      "",
      "rechts",
      defaults.fontsize,
      defaults.scale,
      defaults.rotate,
    );
    this.schemaStore.synchronizeLegacyDocument(document);
    const matchingElements = document.sitplan.getElements()
      .filter(candidate => candidate.getElectroItemId() === itemId);
    const created = matchingElements[matchingElements.length - 1];
    // Synchronizing the schema can redraw the legacy canvas and clear its DOM
    // selection. Restore it after both stores have observed the mutation so the
    // canvas and React inspector expose the same newly-created placement.
    document.sitplanview?.selectOneBox(created?.boxref ?? null);
    this.workspaceStore.commands.selectSituationElement(created?.id ?? null);
  }

  revealOccurrence(occurrenceId: string): void {
    this.viewAdapter.prepare("situation");
    this.workspaceStore.commands.selectTab("situation");
    const document = this.getDocument();
    const element = document.sitplan.getElements()
      .find(candidate => candidate.id === occurrenceId);
    if (!element) return;
    document.sitplanview?.selectPage(element.page);
    document.sitplanview?.selectOneBox(element.boxref);
    this.workspaceStore.commands.selectSituationElement(element.id);
  }

  deleteSelection(elementIds: readonly string[]): void {
    const deletedItemIds = this.situationStore.commands.deleteElements(elementIds);
    this.workspaceStore.commands.selectSituationElement(null);
    if (deletedItemIds.length === 0) return;
    this.schemaStore.synchronizeLegacyDocument(this.getDocument());
    this.editorStore.commands.reconcileItemIds(new Set(
      this.schemaStore.getSnapshot().document.getAllItems().map(item => item.id),
    ));
  }

  selectAll(): void {
    const document = this.getDocument();
    const view = document.sitplanview;
    if (!view) return;
    view.clearSelection();
    const activePage = document.sitplan.getActivePage();
    for (const element of document.sitplan.getElements()) {
      if (element.page === activePage) view.selectBox(element.boxref);
    }
  }

  clearSelection(): void {
    this.getDocument().sitplanview?.clearSelection();
    this.workspaceStore.commands.selectSituationElement(null);
  }

  sendBackward(): void {
    const view = this.getDocument().sitplanview;
    view?.sendToBack();
  }

  bringForward(): void {
    const view = this.getDocument().sitplanview;
    view?.bringToFront();
  }

  zoomIn(): void {
    const view = this.getDocument().sitplanview;
    view?.zoomIncrement(0.1);
  }

  zoomOut(): void {
    const view = this.getDocument().sitplanview;
    view?.zoomIncrement(-0.1);
  }

  zoomToFit(): void {
    const view = this.getDocument().sitplanview;
    view?.zoomToFit();
  }
}
