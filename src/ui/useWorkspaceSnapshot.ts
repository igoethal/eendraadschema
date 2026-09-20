import { useSyncExternalStore } from "react";
import type { WorkspaceSnapshot, WorkspaceStore } from "../application/WorkspaceStore";

export function useWorkspaceSnapshot(store: WorkspaceStore): WorkspaceSnapshot {
  return useSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store),
    store.getSnapshot.bind(store),
  );
}
