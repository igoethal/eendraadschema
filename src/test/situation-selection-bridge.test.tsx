import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LegacySituationPlanStore } from "../application/LegacySituationPlanStore";
import { SituationPlanElement } from "../sitplan/SituationPlanElement";
import { SituationSelectionBridge } from "../ui/workspace/SituationSelectionBridge";
import { LocalWorkspaceStore } from "../application/WorkspaceStore";
import { loadFixture } from "./helpers";

beforeEach(() => {
  globalThis.SITPLANVIEW_DEFAULT_SCALE = 1;
});

afterEach(() => {
  cleanup();
});

describe("SituationSelectionBridge", () => {
  it("handles canvas shortcuts but ignores typing and active dialogs", () => {
    const structure = loadFixture("example001.eds");
    const element = new SituationPlanElement();
    structure.sitplan.addElement(element);
    const onMutation = vi.fn();
    const situationPlanStore = new LegacySituationPlanStore(structure, {
      record: onMutation,
      undo: vi.fn(),
      redo: vi.fn(),
    });
    const workspaceStore = new LocalWorkspaceStore();
    workspaceStore.commands.selectTab("situation");
    workspaceStore.commands.selectSituationElement(element.id);
    const onDeleteSelection = vi.fn();
    const paper = document.createElement("div");
    render(
      <SituationSelectionBridge
        paperElement={paper}
        workspaceStore={workspaceStore}
        situationPlanStore={situationPlanStore}
        onDeleteSelection={onDeleteSelection}
        onClearSelection={() => {}}
      />,
    );

    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(situationPlanStore.getSnapshot().elements[0].position.x).toBe(1);
    expect(onMutation).toHaveBeenCalledOnce();

    const input = document.createElement("input");
    document.body.append(input);
    fireEvent.keyDown(input, { key: "ArrowRight" });
    expect(situationPlanStore.getSnapshot().elements[0].position.x).toBe(1);

    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    document.body.append(dialog);
    fireEvent.keyDown(document, { key: "Delete" });
    expect(onDeleteSelection).not.toHaveBeenCalled();
    input.remove();
    dialog.remove();
  });
});
