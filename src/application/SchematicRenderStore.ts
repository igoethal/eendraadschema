import type { Hierarchical_List } from "../Hierarchical_List";
import { flattenSVGfromString } from "../general";

export interface SchematicRenderSnapshot {
  readonly revision: number;
  readonly svg: string;
}

export interface SchematicRenderStore {
  getSnapshot(): SchematicRenderSnapshot;
  subscribe(listener: () => void): () => void;
  refresh(): void;
}

/** Derived view store around the established one-line SVG renderer.
 * Rendering stays outside React because the compatibility renderer still owns
 * internal SVG-symbol caches. React only consumes the stable markup snapshot. */
export class LegacySchematicRenderStore implements SchematicRenderStore {
  private readonly listeners = new Set<() => void>();
  private snapshot: SchematicRenderSnapshot;

  constructor(private readonly getDocument: () => Hierarchical_List) {
    this.snapshot = Object.freeze({ revision: 0, svg: this.renderSvg() });
  }

  getSnapshot(): SchematicRenderSnapshot {
    return this.snapshot;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  refresh(): void {
    const svg = this.renderSvg();
    if (svg === this.snapshot.svg) return;
    this.snapshot = Object.freeze({
      revision: this.snapshot.revision + 1,
      svg,
    });
    for (const listener of this.listeners) listener();
  }

  private renderSvg(): string {
    const document = this.getDocument();
    return flattenSVGfromString(
      document.toSVG(0, "horizontal").data,
      10,
      document.print_table.pagemarkers,
    );
  }
}
