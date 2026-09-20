import type { EditorStore } from "../../application/EditorStore";
import type { SchemaStore } from "../../application/SchemaStore";

export interface ItemEditorProps {
  readonly itemId: number;
  readonly schemaStore: SchemaStore;
  readonly editorStore: EditorStore;
}
