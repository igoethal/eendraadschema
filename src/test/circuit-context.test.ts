import { beforeEach, describe, expect, it } from "vitest";
import { createCircuitCompletionSummaries, createCircuitContext } from "../application/CircuitContext";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { LegacySituationPlanStore } from "../application/LegacySituationPlanStore";
import { loadFixture } from "./helpers";

beforeEach(() => {
  globalThis.SITPLANVIEW_DEFAULT_SCALE = 1;
});

describe("circuit context", () => {
  it("derives a selected field item back to its circuit and board", () => {
    const structure = loadFixture("example001.eds");
    const schema = new LegacySchemaStore(structure);
    const situation = new LegacySituationPlanStore(structure);
    const fieldItem = schema.getSnapshot().document.getAllItems().find(item => item.type === "Contactdoos")!;

    const context = createCircuitContext(schema.getSnapshot(), situation.getSnapshot(), fieldItem.id);

    expect(context).toMatchObject({
      itemId: fieldItem.id,
      itemLabel: fieldItem.label,
      circuitId: expect.any(Number),
      circuitLabel: expect.any(String),
      boardId: "main",
    });
  });

  it("summarizes every graph circuit without persisting a second ownership relation", () => {
    const structure = loadFixture("example001.eds");
    const schema = new LegacySchemaStore(structure);
    const situation = new LegacySituationPlanStore(structure);

    const summaries = createCircuitCompletionSummaries(schema.getSnapshot(), situation.getSnapshot());

    expect(summaries.length).toBeGreaterThan(0);
    expect(summaries.every(summary => summary.itemCount > 0)).toBe(true);
  });
});
