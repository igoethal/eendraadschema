import { useCallback, useSyncExternalStore } from "react";
import type { SchemaSnapshot, SchemaStore } from "../application/SchemaStore";

export function useSchemaSnapshot(store: SchemaStore): SchemaSnapshot {
  const subscribe = useCallback(
    (listener: () => void) => store.subscribe(listener),
    [store],
  );
  const getSnapshot = useCallback(() => store.getSnapshot(), [store]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
