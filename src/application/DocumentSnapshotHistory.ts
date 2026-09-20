export class DocumentSnapshotHistory {
  private readonly past: string[] = [];
  private readonly future: string[] = [];

  constructor(
    initialSnapshot?: string,
    private readonly maxSteps: number = 100,
    private readonly deduplicate: boolean = true,
  ) {
    if (initialSnapshot !== undefined) this.past.push(initialSnapshot);
  }

  record(snapshot: string): void {
    if (this.deduplicate && this.past[this.past.length - 1] === snapshot) return;
    this.past.push(snapshot);
    if (this.past.length > this.maxSteps + 1) this.past.shift();
    this.future.length = 0;
  }

  replace(snapshot: string): void {
    if (this.past.length === 0) this.record(snapshot);
    else this.past[this.past.length - 1] = snapshot;
  }

  undo(): string | undefined {
    if (!this.canUndo()) return undefined;
    this.future.push(this.past.pop()!);
    return this.past[this.past.length - 1];
  }

  redo(): string | undefined {
    const snapshot = this.future.pop();
    if (snapshot === undefined) return undefined;
    this.past.push(snapshot);
    return snapshot;
  }

  canUndo(): boolean {
    return this.past.length > 1;
  }

  canRedo(): boolean {
    return this.future.length > 0;
  }

  clear(): void {
    this.past.length = 0;
    this.future.length = 0;
  }

  reset(snapshot: string): void {
    this.clear();
    this.past.push(snapshot);
  }

  undoCount(): number {
    return Math.max(this.past.length - 1, 0);
  }

  redoCount(): number {
    return this.future.length;
  }
}
