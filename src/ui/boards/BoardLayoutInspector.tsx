import { useEffect, useState } from "react";
import type { EditorStore } from "../../application/EditorStore";
import type { SchemaStore } from "../../application/SchemaStore";
import { useEditorSnapshot } from "../useEditorSnapshot";
import { useSchemaSnapshot } from "../useSchemaSnapshot";

interface BoardLayoutInspectorProps {
  readonly schemaStore: SchemaStore;
  readonly editorStore: EditorStore;
}

export function BoardLayoutInspector({ schemaStore, editorStore }: BoardLayoutInspectorProps) {
  const schema = useSchemaSnapshot(schemaStore);
  const editor = useEditorSnapshot(editorStore);
  const layout = schema.boardLayouts.find(candidate => candidate.boardId === editor.activeBoardId);
  const placement = layout?.placements.find(candidate => candidate.itemId === editor.selectedItemId);
  const item = editor.selectedItemId === null ? undefined : schema.document.getItem(editor.selectedItemId);
  const [railId, setRailId] = useState("");
  const [startModule, setStartModule] = useState("1");
  const [moduleWidth, setModuleWidth] = useState("1");
  const [error, setError] = useState("");

  useEffect(() => {
    setRailId(placement?.railId ?? "");
    setStartModule(String((placement?.startModule ?? 0) + 1));
    setModuleWidth(String(placement?.moduleWidth ?? 1));
    setError("");
  }, [placement]);

  if (!placement || !item || !layout) {
    return (
      <section className="p-4" aria-label="Eigenschappen van bordmodule">
        <p className="m-0 text-xs uppercase tracking-wide text-neutral-500">Bordindeling</p>
        <h2 className="my-1 text-lg font-semibold">Module</h2>
        <p className="text-sm text-neutral-600">
          Selecteer een geplaatste module om haar rij, positie en breedte aan te passen.
        </p>
      </section>
    );
  }

  function save() {
    try {
      schemaStore.commands.placeBoardLayoutItem(editor.activeBoardId, placement.itemId, {
        railId,
        startModule: Number(startModule) - 1,
        moduleWidth: Number(moduleWidth),
      });
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "De module kon niet worden verplaatst.");
    }
  }

  const fieldClass = "w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm";
  return (
    <section className="p-4" aria-label="Eigenschappen van bordmodule">
      <p className="m-0 text-xs uppercase tracking-wide text-neutral-500">Bordindeling</p>
      <h2 className="my-1 text-lg font-semibold">{item.label}</h2>
      <p className="mt-0 text-xs text-neutral-500">{item.type}</p>
      {error ? <p className="rounded bg-red-50 p-2 text-sm text-red-800" role="alert">{error}</p> : null}
      <div className="mt-4 grid gap-3">
        <label className="grid gap-1 text-xs font-semibold text-neutral-600">
          Bordrij
          <select className={fieldClass} value={railId} onChange={event => setRailId(event.target.value)}>
            {layout.rails.map(rail => <option key={rail.id} value={rail.id}>{rail.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold text-neutral-600">
          Startmodule
          <input className={fieldClass} type="number" min="1" value={startModule} onChange={event => setStartModule(event.target.value)} />
        </label>
        <label className="grid gap-1 text-xs font-semibold text-neutral-600">
          Modulebreedte
          <input className={fieldClass} type="number" min="1" value={moduleWidth} onChange={event => setModuleWidth(event.target.value)} />
        </label>
        <button type="button" className="rounded bg-blue-700 px-3 py-2 font-semibold text-white hover:bg-blue-800" onClick={save}>
          Positie toepassen
        </button>
        <button
          type="button"
          className="rounded border border-red-200 px-3 py-2 font-semibold text-red-700 hover:bg-red-50"
          onClick={() => schemaStore.commands.removeBoardLayoutItem(editor.activeBoardId, placement.itemId)}
        >
          Uit bordindeling verwijderen
        </button>
      </div>
    </section>
  );
}
