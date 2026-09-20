import { describe, expect, it, vi } from "vitest";
import { LegacyHistoryStatusStore } from "../application/HistoryStatusStore";

describe("LegacyHistoryStatusStore", () => {
  it("publishes only when undo or redo availability changes", () => {
    let state = { canUndo: false, canRedo: false };
    const store = new LegacyHistoryStatusStore(() => state);
    const listener = vi.fn();
    store.subscribe(listener);

    store.refresh();
    state = { canUndo: true, canRedo: false };
    store.refresh();
    store.refresh();

    expect(store.getSnapshot()).toEqual({ canUndo: true, canRedo: false });
    expect(listener).toHaveBeenCalledOnce();
  });
});
