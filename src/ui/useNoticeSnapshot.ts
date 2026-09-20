import { useSyncExternalStore } from "react";
import type { NoticeStore } from "../application/NoticeStore";

export function useNoticeSnapshot(store: NoticeStore) {
  return useSyncExternalStore(
    listener => store.subscribe(listener),
    () => store.getSnapshot(),
    () => store.getSnapshot(),
  );
}
