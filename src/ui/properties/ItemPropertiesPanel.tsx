import type { EditorStore } from "../../application/EditorStore";
import type { SchemaStore } from "../../application/SchemaStore";
import { useEditorSnapshot } from "../useEditorSnapshot";
import { useSchemaSnapshot } from "../useSchemaSnapshot";
import { propertyEditors } from "./propertyEditors";
import { ui } from "../uiStyles";

interface ItemPropertiesPanelProps {
  readonly schemaStore: SchemaStore;
  readonly editorStore: EditorStore;
}

export function ItemPropertiesPanel({ schemaStore, editorStore }: ItemPropertiesPanelProps) {
  const schema = useSchemaSnapshot(schemaStore);
  const editor = useEditorSnapshot(editorStore);
  const item = editor.selectedItemId === null
    ? undefined
    : schema.document.getItem(editor.selectedItemId);
  const PropertyEditor = item === undefined ? undefined : propertyEditors[item.type];

  return (
    <section className="p-4 text-neutral-800" aria-labelledby="react-properties-title">
      <header className="mb-3">
        <span className={ui.eyebrow}>Selectie</span>
        <h2 className="m-0 text-lg" id="react-properties-title">Eigenschappen</h2>
      </header>
      {item === undefined ? (
        <p className="text-neutral-500">Selecteer een onderdeel om de eigenschappen te bewerken.</p>
      ) : PropertyEditor === undefined ? (
        <div className="text-neutral-500 [&_p]:mb-0">
          <strong>{item.label}</strong>
          <p>De eigenschappen van dit onderdeel worden nog door de bestaande editor beheerd.</p>
        </div>
      ) : (
        <PropertyEditor itemId={item.id} schemaStore={schemaStore} editorStore={editorStore} />
      )}
    </section>
  );
}
