// @vitest-environment node

import { describe, expect, it } from "vitest";
import { DocumentSnapshotHistory } from "../application/DocumentSnapshotHistory";

describe("DocumentSnapshotHistory", () => {
  it("supports undo, redo, replacement, and redo invalidation", () => {
    const history = new DocumentSnapshotHistory("a", 10);
    history.record("b");
    history.record("c");

    expect(history.undo()).toBe("b");
    expect(history.redo()).toBe("c");
    history.replace("c-selected");
    expect(history.undo()).toBe("b");

    history.record("d");
    expect(history.canRedo()).toBe(false);
    expect(history.redo()).toBeUndefined();
  });

  it("can preserve duplicate frames for synchronized legacy histories", () => {
    const history = new DocumentSnapshotHistory(undefined, 10, false);
    history.record("same");
    history.record("same");

    expect(history.undoCount()).toBe(1);
    expect(history.undo()).toBe("same");
  });
});
