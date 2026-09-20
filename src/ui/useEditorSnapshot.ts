import { useCallback, useSyncExternalStore } from "react";
import type { EditorSnapshot, EditorStore } from "../application/EditorStore";

export function useEditorSnapshot(store: EditorStore): EditorSnapshot {
  const subscribe = useCallback(
    (listener: () => void) => store.subscribe(listener),
    [store],
  );
  const getSnapshot = useCallback(() => store.getSnapshot(), [store]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
