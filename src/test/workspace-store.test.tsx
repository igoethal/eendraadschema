import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LocalWorkspaceStore } from "../application/WorkspaceStore";
import { WorkspaceChromeController } from "../ui/workspace/WorkspaceChromeController";
import { WorkspaceSidebarResizers } from "../ui/workspace/WorkspaceSidebarResizers";

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

describe("LocalWorkspaceStore", () => {
  it("publishes schema and situation tab changes without duplicate notifications", () => {
    const store = new LocalWorkspaceStore();
    const listener = vi.fn();
    store.subscribe(listener);

    expect(store.getSnapshot().activeTab).toBe("dossier");
    expect(store.getSnapshot().isActive).toBe(false);
    store.commands.selectTab("situation");
    store.commands.selectTab("situation");
    store.commands.selectTab("schema");

    expect(store.getSnapshot().activeTab).toBe("schema");
    expect(store.getSnapshot().isActive).toBe(true);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("centralises workspace host visibility after the workspace is activated", () => {
    const store = new LocalWorkspaceStore();
    const schematic = document.createElement("div");
    const board = document.createElement("div");
    const sidebar = document.createElement("div");
    const inspector = document.createElement("div");
    const situation = document.createElement("div");
    const commandBar = document.createElement("div");
    board.classList.add("hidden");

    render(<WorkspaceChromeController
      store={store}
      schematicElement={schematic}
      boardWorkspaceElement={board}
      sidebarElement={sidebar}
      inspectorElement={inspector}
      situationElement={situation}
      commandBarElement={commandBar}
    />);
    expect(board.classList.contains("hidden")).toBe(true);
    expect(commandBar.classList.contains("hidden")).toBe(true);

    act(() => store.commands.selectTab("dossier"));
    expect(board.classList.contains("hidden")).toBe(false);
    expect(sidebar.classList.contains("hidden")).toBe(true);
    expect(board.style.left).toBe("0px");

    act(() => store.commands.selectTab("schema"));
    expect(schematic.style.display).toBe("flex");
    expect(board.classList.contains("hidden")).toBe(true);
    expect(sidebar.classList.contains("hidden")).toBe(false);
    expect(commandBar.classList.contains("hidden")).toBe(false);

    act(() => store.commands.selectTab("situation"));
    expect(schematic.style.display).toBe("none");
    expect(situation.style.display).toBe("flex");

    act(() => store.commands.leaveWorkspace());
    expect(situation.style.display).toBe("none");
    expect(commandBar.classList.contains("hidden")).toBe(true);
  });

  it("resizes and collapses workspace sidebars with accessible controls", () => {
    const store = new LocalWorkspaceStore();
    store.commands.selectTab("schema");
    render(<WorkspaceSidebarResizers store={store} />);

    const leftHandle = screen.getByRole("separator", { name: "Breedte van navigatie aanpassen" });
    fireEvent.keyDown(leftHandle, { key: "ArrowRight" });
    expect(document.documentElement.style.getPropertyValue("--workspace-left-width")).toBe("328px");

    fireEvent.click(screen.getByRole("button", { name: "Navigatie inklappen" }));
    expect(document.documentElement.style.getPropertyValue("--workspace-left-width")).toBe("0px");
    fireEvent.click(screen.getByRole("button", { name: "Navigatie tonen" }));
    expect(document.documentElement.style.getPropertyValue("--workspace-left-width")).toBe("328px");
  });

  it("tracks a stable primary placement within a deduplicated multi-selection", () => {
    const store = new LocalWorkspaceStore();
    const listener = vi.fn();
    store.subscribe(listener);

    store.commands.selectSituationElements(["SP_1", "SP_2", "SP_1"], "SP_1");
    store.commands.selectSituationElements(["SP_1", "SP_2"], "SP_1");

    expect(store.getSnapshot()).toMatchObject({
      selectedSituationElementId: "SP_1",
      selectedSituationElementIds: ["SP_1", "SP_2"],
    });
    expect(Object.isFrozen(store.getSnapshot().selectedSituationElementIds)).toBe(true);
    expect(listener).toHaveBeenCalledOnce();
  });

});
