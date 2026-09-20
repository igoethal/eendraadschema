import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LegacyHistoryStatusStore } from "../application/HistoryStatusStore";
import { LocalEditorStore } from "../application/EditorStore";
import { LegacySaveStatusStore } from "../application/SaveStatusStore";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { LegacySituationPlanStore } from "../application/LegacySituationPlanStore";
import type { SituationPlanAssetService } from "../application/SituationPlanAssetService";
import { LocalWorkspaceStore } from "../application/WorkspaceStore";
import { WorkspaceCommandBar } from "../ui/workspace/WorkspaceCommandBar";
import { loadFixture } from "./helpers";

beforeEach(() => {
  globalThis.SITPLANVIEW_DEFAULT_SCALE = 1;
});

afterEach(() => {
  cleanup();
});

function renderCommandBar() {
  const structure = loadFixture("example001.eds");
  const schemaStore = new LegacySchemaStore(structure);
  const situationPlanStore = new LegacySituationPlanStore(structure);
  const workspaceStore = new LocalWorkspaceStore();
  const onSave = vi.fn();
  const onOpenFile = vi.fn();
  const onSelectAll = vi.fn();
  const onClearSelection = vi.fn();
  const historyAdapter = { undo: vi.fn(), redo: vi.fn() };
  const importBackground = vi.fn(async () => ({
    elementId: "SP_background",
    scaledToFit: false,
    largeFile: false,
  }));
  const addSituationOnlySymbol = vi.fn(() => ({
    elementId: "SP_symbol",
    itemId: 42,
  }));
  const situationAssetService: SituationPlanAssetService = {
    importBackground,
    addSituationOnlySymbol,
  };
  render(
    <WorkspaceCommandBar
      schemaStore={schemaStore}
      editorStore={new LocalEditorStore()}
      situationPlanStore={situationPlanStore}
      workspaceStore={workspaceStore}
      saveStatusStore={new LegacySaveStatusStore(() => ({
        hasUnsavedChanges: true,
        filename: "test.eds",
      }))}
      situationHistoryStore={new LegacyHistoryStatusStore(() => ({
        canUndo: true,
        canRedo: false,
      }))}
      historyAdapter={historyAdapter}
      onSave={onSave}
      onOpenFile={onOpenFile}
      situationAssetService={situationAssetService}
      onDeleteSelection={() => {}}
      onSelectAll={onSelectAll}
      onClearSelection={onClearSelection}
      onSendBackward={() => {}}
      onBringForward={() => {}}
      onZoomIn={() => {}}
      onZoomOut={() => {}}
      onZoomToFit={() => {}}
    />,
  );
  return {
    addSituationOnlySymbol,
    historyAdapter,
    importBackground,
    onOpenFile,
    onSelectAll,
    onClearSelection,
    onSave,
    situationPlanStore,
    workspaceStore,
  };
}

describe("WorkspaceCommandBar", () => {
  it("keeps common commands fixed and switches contextual situation actions", () => {
    const { historyAdapter, onSave, situationPlanStore, workspaceStore } = renderCommandBar();

    expect(screen.getByRole("button", { name: "Ongedaan" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Opslaan" }));
    expect(onSave).toHaveBeenCalledOnce();
    expect(screen.queryByRole("button", { name: "Plattegrond" })).not.toBeInTheDocument();

    act(() => workspaceStore.commands.selectTab("situation"));
    fireEvent.click(screen.getByRole("button", { name: "Ongedaan" }));
    expect(historyAdapter.undo).toHaveBeenCalledWith("situation");
    expect(screen.getByRole("button", { name: "Plattegrond" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Verwijder" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: /^Pagina$/ }));
    expect(situationPlanStore.getSnapshot()).toMatchObject({ pageCount: 2, activePage: 2 });
  });

  it("enables placement actions when the workspace has a selection", () => {
    const { onClearSelection, onSelectAll, workspaceStore } = renderCommandBar();
    act(() => {
      workspaceStore.commands.selectTab("situation");
      workspaceStore.commands.selectSituationElement("SP_selected");
    });

    expect(screen.getByRole("button", { name: "Verwijder" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Naar achter" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Naar voor" })).toBeEnabled();
    expect(screen.getByRole("status")).toHaveTextContent("1 geselecteerd");
    fireEvent.click(screen.getByRole("button", { name: "Alle symbolen op pagina selecteren" }));
    fireEvent.click(screen.getByRole("button", { name: "Selectie wissen" }));
    expect(onSelectAll).toHaveBeenCalledOnce();
    expect(onClearSelection).toHaveBeenCalledOnce();
  });

  it("owns background selection and custom-symbol configuration in React", async () => {
    const {
      addSituationOnlySymbol,
      importBackground,
      workspaceStore,
    } = renderCommandBar();
    act(() => workspaceStore.commands.selectTab("situation"));

    const file = new File(["image"], "plan.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("Kies een plattegrondbestand"), {
      target: { files: [file] },
    });
    await waitFor(() => expect(importBackground).toHaveBeenCalledWith(file));
    expect(workspaceStore.getSnapshot().selectedSituationElementId).toBe("SP_background");

    fireEvent.click(screen.getByRole("button", { name: "Los symbool" }));
    expect(screen.getByRole("dialog", { name: "Los symbool toevoegen" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Schaal (%)"), { target: { value: "125" } });
    fireEvent.change(screen.getByLabelText("Rotatie (°)"), { target: { value: "90" } });
    fireEvent.click(screen.getByRole("checkbox"));
    const dialog = screen.getByRole("dialog", { name: "Los symbool toevoegen" });
    const form = dialog.querySelector("form");
    if (!form) throw new Error("Custom-symbol form ontbreekt.");
    fireEvent.submit(form);

    await waitFor(() => expect(addSituationOnlySymbol).toHaveBeenCalledWith({
        type: "Aardingsonderbreker",
        scale: 1.25,
        rotation: 90,
        useScaleAsDefault: true,
      }));
    expect(workspaceStore.getSnapshot().selectedSituationElementId).toBe("SP_symbol");
  });
});
