import { describe, expect, it, vi } from "vitest";
import { LegacySchematicRenderStore } from "../application/SchematicRenderStore";
import { loadFixture } from "./helpers";

describe("LegacySchematicRenderStore", () => {
  it("publishes stable derived SVG snapshots only when the drawing changes", () => {
    const document = loadFixture("example_default.eds");
    const store = new LegacySchematicRenderStore(() => document);
    const listener = vi.fn();
    store.subscribe(listener);

    const initial = store.getSnapshot();
    expect(initial.svg).toContain('id="EDSSVG"');
    expect(initial.svg).toContain("data-schema-item-id");

    store.refresh();
    expect(store.getSnapshot()).toBe(initial);
    expect(listener).not.toHaveBeenCalled();

    document.addItem("Bord").props.naam = "Bijbord";
    store.refresh();

    expect(store.getSnapshot().revision).toBe(1);
    expect(store.getSnapshot().svg).toContain("Bijbord");
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
