export interface HistoryStatusSnapshot {
  readonly canUndo: boolean;
  readonly canRedo: boolean;
}

export interface HistoryStatusStore {
  getSnapshot(): HistoryStatusSnapshot;
  subscribe(listener: () => void): () => void;
  refresh(): void;
}

export class LegacyHistoryStatusStore implements HistoryStatusStore {
  private readonly listeners = new Set<() => void>();
  private snapshot: HistoryStatusSnapshot;

  constructor(private readonly readState: () => HistoryStatusSnapshot) {
    this.snapshot = Object.freeze(readState());
  }

  getSnapshot(): HistoryStatusSnapshot {
    return this.snapshot;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  refresh(): void {
    const next = this.readState();
    if (next.canUndo === this.snapshot.canUndo && next.canRedo === this.snapshot.canRedo) return;
    this.snapshot = Object.freeze(next);
    for (const listener of this.listeners) listener();
  }
}
