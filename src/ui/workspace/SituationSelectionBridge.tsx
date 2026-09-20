import { useEffect } from "react";
import type { WorkspaceStore } from "../../application/WorkspaceStore";
import type { SituationPlanStore } from "../../application/SituationPlanStore";

export interface SituationSelectionBridgeProps {
  readonly paperElement: HTMLElement | null;
  readonly workspaceStore: WorkspaceStore;
  readonly situationPlanStore: SituationPlanStore | null;
  readonly onDeleteSelection: () => void;
  readonly onClearSelection: () => void;
}

export function SituationSelectionBridge({
  paperElement,
  workspaceStore,
  situationPlanStore,
  onDeleteSelection,
  onClearSelection,
}: SituationSelectionBridgeProps) {
  useEffect(() => {
    if (!paperElement) return;
    const suppressLegacyContextMenu = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest(".box")) return;
      event.preventDefault();
      event.stopPropagation();
    };
    const handleKeyboard = (event: KeyboardEvent) => {
      if (workspaceStore.getSnapshot().activeTab !== "situation" || !situationPlanStore) return;
      const target = event.target;
      if (
        (target instanceof Element && target.closest("input, textarea, select, [contenteditable='true']"))
        || document.querySelector("[role='dialog'][aria-modal='true']")
      ) return;
      const selectedIds = workspaceStore.getSnapshot().selectedSituationElementIds;
      if (selectedIds.length === 0) return;
      const elements = situationPlanStore.getSnapshot().elements
        .filter(element => selectedIds.includes(element.id));
      const movable = elements.filter(element => element.movable);
      const modifier = event.ctrlKey || event.metaKey;

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClearSelection();
        return;
      }
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        event.stopPropagation();
        onDeleteSelection();
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (modifier && event.key.toLowerCase() === "l") {
        event.preventDefault();
        event.stopPropagation();
        situationPlanStore.commands.updateElements(elements.map(element => ({
          elementId: element.id,
          changes: { movable: !element.movable },
        })));
        return;
      }
      if (!event.key.startsWith("Arrow") || movable.length === 0) return;
      event.preventDefault();
      event.stopPropagation();
      if (modifier && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        const rotation = event.key === "ArrowLeft" ? -90 : 90;
        situationPlanStore.commands.updateElements(movable.map(element => ({
          elementId: element.id,
          changes: { rotation: element.rotation + rotation },
        })));
      } else if (!modifier) {
        const delta = {
          ArrowLeft: { x: -1, y: 0 },
          ArrowRight: { x: 1, y: 0 },
          ArrowUp: { x: 0, y: -1 },
          ArrowDown: { x: 0, y: 1 },
        }[event.key];
        if (!delta) return;
        situationPlanStore.commands.updateElements(movable.map(element => ({
          elementId: element.id,
          changes: {
            position: {
              x: element.position.x + delta.x,
              y: element.position.y + delta.y,
            },
          },
        })));
      } else {
        return;
      }
    };
    paperElement.addEventListener("contextmenu", suppressLegacyContextMenu, true);
    document.addEventListener("keydown", handleKeyboard, true);

    return () => {
      paperElement.removeEventListener("contextmenu", suppressLegacyContextMenu, true);
      document.removeEventListener("keydown", handleKeyboard, true);
    };
  }, [
    onClearSelection,
    onDeleteSelection,
    paperElement,
    situationPlanStore,
    workspaceStore,
  ]);

  return null;
}
