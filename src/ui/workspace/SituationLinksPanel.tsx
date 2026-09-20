import type { EditorStore } from "../../application/EditorStore";
import type { SchemaStore } from "../../application/SchemaStore";
import type { SituationPlanStore } from "../../application/SituationPlanStore";
import { useEditorSnapshot } from "../useEditorSnapshot";
import { useSchemaSnapshot } from "../useSchemaSnapshot";
import { useSituationPlanSnapshot } from "../useSituationPlanSnapshot";

export interface SituationLinksPanelProps {
  readonly schemaStore: SchemaStore;
  readonly editorStore: EditorStore;
  readonly situationPlanStore: SituationPlanStore;
  readonly canCreateOccurrence: (itemId: number) => boolean;
  readonly onCreateOccurrence: (itemId: number) => void;
  readonly onRevealOccurrence: (occurrenceId: string) => void;
  readonly onRevealBoardItem?: (itemId: number) => void;
}

export function SituationLinksPanel({
  schemaStore,
  editorStore,
  situationPlanStore,
  canCreateOccurrence,
  onCreateOccurrence,
  onRevealOccurrence,
  onRevealBoardItem = () => {},
}: SituationLinksPanelProps) {
  const schema = useSchemaSnapshot(schemaStore);
  const editor = useEditorSnapshot(editorStore);
  const situation = useSituationPlanSnapshot(situationPlanStore);
  const selectedItem = editor.selectedItemId === null
    ? undefined
    : schema.document.getItem(editor.selectedItemId);
  const occurrences = selectedItem
    ? situation.elements.filter(element => element.electroItemId === selectedItem.id)
    : [];

  return (
    <section className="border-y border-neutral-200 bg-blue-50/60 p-3" aria-label="Koppelingen met situatieschema">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="m-0 text-sm font-semibold text-neutral-900">Situatieschema</h2>
          <p className="m-0 mt-0.5 text-xs text-neutral-600">
            {selectedItem
              ? `${selectedItem.label}: ${occurrences.length} ${occurrences.length === 1 ? "plaatsing" : "plaatsingen"}`
              : "Selecteer een elektrisch onderdeel om de plaatsingen te beheren."}
          </p>
        </div>
        {selectedItem && canCreateOccurrence(selectedItem.id) ? (
          <button
            type="button"
            className="shrink-0 rounded border border-blue-700 bg-white px-2 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-100"
            onClick={() => onCreateOccurrence(selectedItem.id)}
          >
            Plaats symbool
          </button>
        ) : null}
      </div>
      {occurrences.length > 0 ? (
        <ul className="m-0 mt-2 flex list-none flex-wrap gap-1 p-0">
          {occurrences.map((occurrence, index) => (
            <li key={occurrence.id}>
              <button
                type="button"
                className="rounded bg-blue-700 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-800"
                onClick={() => onRevealOccurrence(occurrence.id)}
              >
                Toon plaatsing {index + 1} · pagina {occurrence.page}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {selectedItem && schema.document.getBoardForItem(selectedItem.id) ? (
        <button type="button" className="mt-2 rounded border border-blue-700 bg-white px-2 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-100" onClick={() => onRevealBoardItem(selectedItem.id)}>
          Toon in bordindeling
        </button>
      ) : null}
    </section>
  );
}
