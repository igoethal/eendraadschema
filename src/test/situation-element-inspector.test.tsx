import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LegacySituationPlanStore } from "../application/LegacySituationPlanStore";
import { LocalWorkspaceStore } from "../application/WorkspaceStore";
import { SituationPlanElement } from "../sitplan/SituationPlanElement";
import { SituationElementInspector } from "../ui/workspace/SituationElementInspector";
import { loadFixture } from "./helpers";

beforeEach(() => {
  globalThis.SITPLANVIEW_DEFAULT_SCALE = 1;
});

afterEach(() => {
  cleanup();
});

function createInspectorState(onMutation = vi.fn()) {
  const structure = loadFixture("example001.eds");
  const element = new SituationPlanElement();
  element.posx = 20;
  element.posy = 30;
  structure.sitplan.addElement(element);
  const situationPlanStore = new LegacySituationPlanStore(structure, {
    record: onMutation,
    undo: vi.fn(),
    redo: vi.fn(),
  });
  const workspaceStore = new LocalWorkspaceStore();
  workspaceStore.commands.selectTab("situation");
  workspaceStore.commands.selectSituationElement(element.id);
  return { element, situationPlanStore, workspaceStore, onMutation };
}

function createMultiInspectorState(onMutation = vi.fn()) {
  const structure = loadFixture("example001.eds");
  const first = new SituationPlanElement();
  const second = new SituationPlanElement();
  first.posx = 20;
  second.posx = 60;
  structure.sitplan.addElement(first);
  structure.sitplan.addElement(second);
  const situationPlanStore = new LegacySituationPlanStore(structure, {
    record: onMutation,
    undo: vi.fn(),
    redo: vi.fn(),
  });
  const workspaceStore = new LocalWorkspaceStore();
  workspaceStore.commands.selectTab("situation");
  workspaceStore.commands.selectSituationElements([first.id, second.id], second.id);
  return { first, second, situationPlanStore, workspaceStore, onMutation };
}

describe("SituationElementInspector", () => {
  it("edits placement geometry and lock state through store commands", () => {
    const { element, situationPlanStore, workspaceStore, onMutation } = createInspectorState();
    render(
      <SituationElementInspector
        situationPlanStore={situationPlanStore}
        workspaceStore={workspaceStore}
      />,
    );

    const rotation = screen.getByLabelText("Rotatie (°)");
    fireEvent.change(rotation, { target: { value: "90" } });
    fireEvent.blur(rotation);
    fireEvent.click(screen.getByLabelText("Vergrendeld"));

    expect(situationPlanStore.getSnapshot().elements[0]).toMatchObject({
      id: element.id,
      rotation: 90,
      movable: false,
    });
    expect(onMutation).toHaveBeenCalledTimes(2);
  });

  it("shows guidance when no placement is selected", () => {
    const { situationPlanStore } = createInspectorState();
    render(
      <SituationElementInspector
        situationPlanStore={situationPlanStore}
        workspaceStore={new LocalWorkspaceStore()}
      />,
    );

    expect(screen.getByText(/Selecteer een symbool/)).toBeInTheDocument();
  });

  it("batch-edits a multi-selection with one recorded mutation", () => {
    const {
      first,
      second,
      situationPlanStore,
      workspaceStore,
      onMutation,
    } = createMultiInspectorState();
    render(
      <SituationElementInspector
        situationPlanStore={situationPlanStore}
        workspaceStore={workspaceStore}
      />,
    );

    expect(screen.getByRole("heading", { name: "2 plaatsingen geselecteerd" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Selectie naar rechts" }));
    fireEvent.click(screen.getByRole("button", { name: "+90° draaien" }));
    fireEvent.click(screen.getByRole("button", { name: "Links" }));

    const elements = situationPlanStore.getSnapshot().elements;
    expect(elements.find(element => element.id === first.id)).toMatchObject({
      position: { x: 30, y: 0 },
      rotation: 90,
    });
    expect(elements.find(element => element.id === second.id)).toMatchObject({
      position: { x: 30, y: 0 },
      rotation: 90,
    });
    expect(onMutation).toHaveBeenCalledTimes(3);
  });
});
