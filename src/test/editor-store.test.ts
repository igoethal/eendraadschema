// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { LocalEditorStore } from "../application/EditorStore";

describe("LocalEditorStore", () => {
  it("keeps selection and expansion outside the electrical document", () => {
    const store = new LocalEditorStore();
    const listener = vi.fn();
    store.subscribe(listener);

    store.commands.selectItem(12);
    store.commands.expandItem(12);

    expect(store.getSnapshot().selectedItemId).toBe(12);
    expect(store.getSnapshot().expandedItemIds.has(12)).toBe(true);
    expect(store.getSnapshot().revision).toBe(2);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("does not publish when an explicit state command changes nothing", () => {
    const store = new LocalEditorStore();
    const listener = vi.fn();
    store.subscribe(listener);

    store.commands.selectItem(null);
    store.commands.expandItem(4);
    store.commands.expandItem(4);
    store.commands.collapseItem(7);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("toggles expansion and removes state for deleted document items", () => {
    const store = new LocalEditorStore();
    store.commands.selectItem(2);
    store.commands.toggleExpanded(1);
    store.commands.toggleExpanded(2);
    store.commands.reconcileItemIds(new Set([1]));

    expect(store.getSnapshot().selectedItemId).toBeNull();
    expect([...store.getSnapshot().expandedItemIds]).toEqual([1]);

    store.commands.toggleExpanded(1);
    expect(store.getSnapshot().expandedItemIds.size).toBe(0);
  });
});
