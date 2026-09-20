import { useCallback, useSyncExternalStore } from "react";
import type {
  SchematicRenderSnapshot,
  SchematicRenderStore,
} from "../application/SchematicRenderStore";

export function useSchematicRenderSnapshot(
  store: SchematicRenderStore,
): SchematicRenderSnapshot {
  const subscribe = useCallback(
    (listener: () => void) => store.subscribe(listener),
    [store],
  );
  const getSnapshot = useCallback(() => store.getSnapshot(), [store]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
