import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  DEFAULT_ZOOM_PERCENT,
  MAX_ZOOM_PERCENT,
  MIN_ZOOM_PERCENT,
  type EditorStore,
} from "../../application/EditorStore";
import type { SaveStatusSnapshot, SaveStatusStore } from "../../application/SaveStatusStore";
import type { SchemaStore } from "../../application/SchemaStore";
import { useEditorSnapshot } from "../useEditorSnapshot";
import { useSchemaSnapshot } from "../useSchemaSnapshot";
import { cx, ui } from "../uiStyles";

const ZOOM_STEP = 25;

interface StatusBarProps {
  readonly schemaStore: SchemaStore;
  readonly editorStore: EditorStore;
  readonly saveStatusStore: SaveStatusStore;
  readonly zoomTargetElement?: HTMLElement | null;
}

function useSaveStatus(store: SaveStatusStore): SaveStatusSnapshot {
  const subscribe = useCallback((listener: () => void) => store.subscribe(listener), [store]);
  const getSnapshot = useCallback(() => store.getSnapshot(), [store]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function StatusBar({
  schemaStore,
  editorStore,
  saveStatusStore,
  zoomTargetElement = null,
}: StatusBarProps) {
  const schemaSnapshot = useSchemaSnapshot(schemaStore);
  const editorSnapshot = useEditorSnapshot(editorStore);
  const saveStatus = useSaveStatus(saveStatusStore);
  const activeBoard = schemaSnapshot.document.getBoard(editorSnapshot.activeBoardId);
  const selectedItem = editorSnapshot.selectedItemId === null
    ? undefined
    : schemaSnapshot.document.getItem(editorSnapshot.selectedItemId);
  const zoomPercent = editorSnapshot.zoomPercent;

  useEffect(() => {
    if (zoomTargetElement === null) return;
    zoomTargetElement.style.setProperty("zoom", `${zoomPercent}%`);
    return () => {
      zoomTargetElement.style.removeProperty("zoom");
    };
  }, [zoomTargetElement, zoomPercent]);

  return (
    <footer className="flex h-9 items-center justify-between gap-4 border-t border-neutral-300 bg-neutral-50 px-4 text-xs text-neutral-800" aria-label="Statusbalk van de editor">
      <span className="truncate">
        {activeBoard ? `Bord: ${activeBoard.name}` : null}
        {selectedItem ? ` — ${selectedItem.label}` : null}
      </span>
      <span
        className={cx(
          saveStatus.hasUnsavedChanges ? "font-semibold text-red-700" : "text-emerald-700",
        )}
        role="status"
      >
        {saveStatus.hasUnsavedChanges
          ? `Niet opgeslagen wijzigingen in ${saveStatus.filename}`
          : `${saveStatus.filename} is opgeslagen`}
      </span>
      <span className="flex items-center gap-1" aria-label="Zoomniveau van de tekening">
        <button
          className={cx(ui.button, "min-w-8 px-1.5 py-0.5")}
          type="button"
          aria-label="Uitzoomen"
          disabled={zoomPercent <= MIN_ZOOM_PERCENT}
          onClick={() => editorStore.commands.setZoomPercent(zoomPercent - ZOOM_STEP)}
        >−</button>
        <button
          className={cx(ui.button, "min-w-8 px-1.5 py-0.5")}
          type="button"
          aria-label="Zoom terugzetten naar 100 procent"
          onClick={() => editorStore.commands.setZoomPercent(DEFAULT_ZOOM_PERCENT)}
        >{zoomPercent}%</button>
        <button
          className={cx(ui.button, "min-w-8 px-1.5 py-0.5")}
          type="button"
          aria-label="Inzoomen"
          disabled={zoomPercent >= MAX_ZOOM_PERCENT}
          onClick={() => editorStore.commands.setZoomPercent(zoomPercent + ZOOM_STEP)}
        >+</button>
      </span>
    </footer>
  );
}
