import { useLayoutEffect } from "react";
import type { WorkspaceStore } from "../../application/WorkspaceStore";
import { useWorkspaceSnapshot } from "../useWorkspaceSnapshot";

interface WorkspaceChromeControllerProps {
  readonly store: WorkspaceStore;
  readonly schematicElement: HTMLElement | null;
  readonly boardWorkspaceElement: HTMLElement | null;
  readonly sidebarElement: HTMLElement | null;
  readonly inspectorElement: HTMLElement | null;
  readonly situationElement: HTMLElement | null;
  readonly commandBarElement: HTMLElement | null;
}

/**
 * Owns the transitional boundary between React navigation and legacy canvas hosts.
 * Canvas rendering remains legacy; which workspace is visible is decided here.
 */
export function WorkspaceChromeController({
  store,
  schematicElement,
  boardWorkspaceElement,
  sidebarElement,
  inspectorElement,
  situationElement,
  commandBarElement,
}: WorkspaceChromeControllerProps) {
  const { activeTab, isActive } = useWorkspaceSnapshot(store);

  useLayoutEffect(() => {
    commandBarElement?.classList.toggle("hidden", !isActive);

    if (!isActive) {
      schematicElement?.style.setProperty("display", "none");
      situationElement?.style.setProperty("display", "none");
      boardWorkspaceElement?.classList.add("hidden");
      sidebarElement?.classList.add("hidden");
      inspectorElement?.classList.add("hidden");
      return;
    }
    const isDossier = activeTab === "dossier";
    const isBoardLayout = activeTab === "board";
    const usesBoardHost = isDossier || activeTab === "board";

    schematicElement?.style.setProperty("display", activeTab === "schema" ? "flex" : "none");
    situationElement?.style.setProperty("display", activeTab === "situation" ? "flex" : "none");
    boardWorkspaceElement?.classList.toggle("hidden", !usesBoardHost);
    sidebarElement?.classList.toggle("hidden", isDossier || isBoardLayout);
    inspectorElement?.classList.toggle("hidden", isDossier);

    if (isDossier || isBoardLayout) {
      boardWorkspaceElement?.style.setProperty("left", "0");
    } else {
      boardWorkspaceElement?.style.removeProperty("left");
    }
    if (isDossier) {
      boardWorkspaceElement?.style.setProperty("right", "0");
    } else {
      boardWorkspaceElement?.style.removeProperty("right");
    }
  }, [
    activeTab,
    boardWorkspaceElement,
    commandBarElement,
    inspectorElement,
    isActive,
    schematicElement,
    sidebarElement,
    situationElement,
  ]);

  return null;
}
