/** A dossier is a working view, not an additional statutory drawing. */
export type WorkspaceTab = "dossier" | "schema" | "situation" | "board";
export type WorkspaceDialog = "new" | "file" | "print" | "documentation" | "about";

export interface WorkspaceSnapshot {
  readonly isActive: boolean;
  readonly activeTab: WorkspaceTab;
  readonly selectedSituationElementId: string | null;
  readonly selectedSituationElementIds: readonly string[];
  readonly activeDialog: WorkspaceDialog | null;
}

export interface WorkspaceCommands {
  selectTab(tab: WorkspaceTab): void;
  leaveWorkspace(): void;
  selectSituationElement(elementId: string | null): void;
  selectSituationElements(elementIds: readonly string[], primaryElementId?: string | null): void;
  openDialog(dialog: WorkspaceDialog): void;
  closeDialog(): void;
}

export interface WorkspaceStore {
  getSnapshot(): WorkspaceSnapshot;
  subscribe(listener: () => void): () => void;
  readonly commands: WorkspaceCommands;
}

export class LocalWorkspaceStore implements WorkspaceStore {
  private readonly listeners = new Set<() => void>();
  private isActive = false;
  private activeTab: WorkspaceTab = "dossier";
  private selectedSituationElementId: string | null = null;
  private selectedSituationElementIds: readonly string[] = Object.freeze([]);
  private activeDialog: WorkspaceDialog | null = null;
  private snapshot = this.createSnapshot();

  readonly commands: WorkspaceCommands = Object.freeze({
    selectTab: this.selectTab.bind(this),
    leaveWorkspace: this.leaveWorkspace.bind(this),
    selectSituationElement: this.selectSituationElement.bind(this),
    selectSituationElements: this.selectSituationElements.bind(this),
    openDialog: this.openDialog.bind(this),
    closeDialog: this.closeDialog.bind(this),
  });

  getSnapshot(): WorkspaceSnapshot {
    return this.snapshot;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private selectTab(tab: WorkspaceTab): void {
    if (tab === this.activeTab && this.isActive) return;
    this.isActive = true;
    this.activeTab = tab;
    this.snapshot = this.createSnapshot();
    for (const listener of this.listeners) listener();
  }

  private leaveWorkspace(): void {
    if (!this.isActive) return;
    this.isActive = false;
    this.snapshot = this.createSnapshot();
    for (const listener of this.listeners) listener();
  }

  private selectSituationElement(elementId: string | null): void {
    this.selectSituationElements(elementId === null ? [] : [elementId], elementId);
  }

  private selectSituationElements(
    elementIds: readonly string[],
    primaryElementId: string | null = null,
  ): void {
    const uniqueIds = [...new Set(elementIds.filter(id => id.length > 0))];
    const primary = primaryElementId !== null && uniqueIds.includes(primaryElementId)
      ? primaryElementId
      : uniqueIds[uniqueIds.length - 1] ?? null;
    if (
      primary === this.selectedSituationElementId
      && uniqueIds.length === this.selectedSituationElementIds.length
      && uniqueIds.every((id, index) => id === this.selectedSituationElementIds[index])
    ) return;
    this.selectedSituationElementId = primary;
    this.selectedSituationElementIds = Object.freeze(uniqueIds);
    this.snapshot = this.createSnapshot();
    for (const listener of this.listeners) listener();
  }

  private openDialog(dialog: WorkspaceDialog): void {
    if (dialog === this.activeDialog) return;
    this.activeDialog = dialog;
    this.snapshot = this.createSnapshot();
    for (const listener of this.listeners) listener();
  }

  private closeDialog(): void {
    if (this.activeDialog === null) return;
    this.activeDialog = null;
    this.snapshot = this.createSnapshot();
    for (const listener of this.listeners) listener();
  }

  private createSnapshot(): WorkspaceSnapshot {
    return Object.freeze({
      isActive: this.isActive,
      activeTab: this.activeTab,
      selectedSituationElementId: this.selectedSituationElementId,
      selectedSituationElementIds: this.selectedSituationElementIds,
      activeDialog: this.activeDialog,
    });
  }
}
