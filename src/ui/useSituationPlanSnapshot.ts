import { useCallback, useSyncExternalStore } from "react";
import type {
  SituationPlanSnapshot,
  SituationPlanStore,
} from "../application/SituationPlanStore";

export function useSituationPlanSnapshot(store: SituationPlanStore): SituationPlanSnapshot {
  return useSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store),
    store.getSnapshot.bind(store),
  );
}

export function useOptionalSituationPlanSnapshot(
  store: SituationPlanStore | null,
): SituationPlanSnapshot | null {
  const subscribe = useCallback(
    (listener: () => void) => store?.subscribe(listener) ?? (() => {}),
    [store],
  );
  const getSnapshot = useCallback(() => store?.getSnapshot() ?? null, [store]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
