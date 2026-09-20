export interface SaveStatusSnapshot {
  readonly hasUnsavedChanges: boolean;
  readonly filename: string;
}

export interface SaveStatusStore {
  getSnapshot(): SaveStatusSnapshot;
  subscribe(listener: () => void): () => void;
  /** Re-read the underlying legacy state and notify subscribers when it changed. */
  refresh(): void;
}

/** Framework-independent adapter over the legacy save state (AutoSaver and
 *  document properties). The caller decides when to refresh: after autosaves,
 *  after schema commands and on a coarse timer for legacy-only mutations. */
export class LegacySaveStatusStore implements SaveStatusStore {
  private readonly listeners = new Set<() => void>();
  private snapshot: SaveStatusSnapshot;

  constructor(private readonly readState: () => SaveStatusSnapshot) {
    this.snapshot = Object.freeze(readState());
  }

  getSnapshot(): SaveStatusSnapshot {
    return this.snapshot;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  refresh(): void {
    const next = this.readState();
    if (
      next.hasUnsavedChanges === this.snapshot.hasUnsavedChanges
      && next.filename === this.snapshot.filename
    ) {
      return;
    }
    this.snapshot = Object.freeze(next);
    for (const listener of this.listeners) listener();
  }
}
