import { useLayoutEffect, useMemo, useState } from "react";
import type { EditorStore } from "../../application/EditorStore";
import type { HierarchyViewNode } from "../../application/SchemaDocumentReader";
import type { SchemaStore } from "../../application/SchemaStore";
import { useSchemaSnapshot } from "../useSchemaSnapshot";
import { ui } from "../uiStyles";

type InsertMode = "before" | "end" | "start";

interface InsertTarget {
  readonly itemId: number;
  readonly mode: InsertMode;
  readonly left: number;
  readonly top: number;
}

interface ActiveInsert extends InsertTarget {
  readonly selectedType: string;
}

interface SchematicInsertControlsProps {
  readonly schemaStore: SchemaStore;
  readonly editorStore: EditorStore;
  readonly previewElement: HTMLElement;
  readonly overlayElement: HTMLElement;
}

function diagramPoint(
  element: SVGGraphicsElement,
  x: number,
  y: number,
  overlayElement: HTMLElement,
  isEnd: boolean,
): { left: number; top: number } {
  const matrix = element.getScreenCTM?.();
  if (matrix && typeof DOMPoint !== "undefined") {
    const point = new DOMPoint(x, y).matrixTransform(matrix);
    const overlayRect = overlayElement.getBoundingClientRect();
    return {
      left: point.x - overlayRect.left + overlayElement.scrollLeft,
      top: point.y - overlayRect.top + overlayElement.scrollTop,
    };
  }

  const rect = element.getBoundingClientRect();
  const overlayRect = overlayElement.getBoundingClientRect();
  return {
    left: (isEnd ? rect.right : rect.left) - overlayRect.left + overlayElement.scrollLeft,
    top: rect.top + rect.height / 2 - overlayRect.top + overlayElement.scrollTop,
  };
}

function insertionTypes(node: HierarchyViewNode, mode: InsertMode): readonly string[] {
  return mode === "before"
    ? node.capabilities.allowedInsertBeforeTypes
    : node.capabilities.allowedChildTypes;
}

// Different insert targets can end up anchored at (almost) the same pixel, e.g. "add
// item after the last child of a Kring" and "add item after the Kring itself" both sit
// at the end of the Kring's wire when the last child has no trailing space of its own.
// Spread such overlapping buttons apart horizontally so they remain distinguishable/clickable.
const OVERLAP_DISTANCE = 12;
const OVERLAP_SPACING = 14;

function spreadOverlappingTargets(targets: readonly InsertTarget[]): readonly InsertTarget[] {
  const groups: InsertTarget[][] = [];
  for (const target of targets) {
    const group = groups.find((candidate) => {
      const first = candidate[0];
      return (
        Math.abs(first.left - target.left) < OVERLAP_DISTANCE
        && Math.abs(first.top - target.top) < OVERLAP_DISTANCE
      );
    });
    if (group) group.push(target);
    else groups.push([target]);
  }

  return groups.flatMap((group) => {
    if (group.length === 1) return group;
    const offsetStart = -((group.length - 1) * OVERLAP_SPACING) / 2;
    return group.map((target, index) => ({
      ...target,
      left: target.left + offsetStart + index * OVERLAP_SPACING,
    }));
  });
}

export function SchematicInsertControls({
  schemaStore,
  editorStore,
  previewElement,
  overlayElement,
}: SchematicInsertControlsProps) {
  const snapshot = useSchemaSnapshot(schemaStore);
  const [targets, setTargets] = useState<readonly InsertTarget[]>([]);
  const [activeInsert, setActiveInsert] = useState<ActiveInsert | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const nodesById = useMemo(
    () => new Map(snapshot.document.getAllItems().map((node) => [node.id, node])),
    [snapshot.document],
  );
  const activeNode = activeInsert ? nodesById.get(activeInsert.itemId) : undefined;
  const popoverPosition = activeInsert ? {
    left: Math.max(
      overlayElement.scrollLeft + 8,
      Math.min(
        activeInsert.left,
        overlayElement.scrollLeft + overlayElement.clientWidth - 272,
      ),
    ),
    top: Math.max(
      overlayElement.scrollTop + 88,
      Math.min(
        activeInsert.top,
        overlayElement.scrollTop + overlayElement.clientHeight - 88,
      ),
    ),
  } : undefined;

  useLayoutEffect(() => {
    function updateTargets(): void {
      const nextTargets: InsertTarget[] = [];
      const diagramElements = previewElement.querySelectorAll<SVGGraphicsElement>(
        "[data-schema-item-id]",
      );

      const positionedItemIds = new Set<number>();
      for (const element of Array.from(diagramElements).reverse()) {
        const itemId = Number(element.dataset.schemaItemId);
        const node = nodesById.get(itemId);
        if (!node || node.role !== "item" || positionedItemIds.has(itemId)) continue;
        positionedItemIds.add(itemId);
        const anchorX = Number(element.dataset.schemaAnchorX ?? 0);
        const anchorY = Number(element.dataset.schemaAnchorY ?? 0);

        if (node.capabilities.canInsertBefore) {
          nextTargets.push({
            itemId,
            mode: "before",
            ...diagramPoint(element, anchorX, anchorY, overlayElement, false),
          });
        }
        if (node.capabilities.canAddChild) {
          const isKring = node.type === "Kring";
          const topX = Number(element.dataset.schemaTopX ?? anchorX);
          const topY = Number(element.dataset.schemaTopY ?? 0);
          nextTargets.push({
            itemId,
            mode: isKring ? "start" : "end",
            ...(isKring
              ? diagramPoint(element, topX, topY, overlayElement, false)
              : diagramPoint(
                  element,
                  Number(element.dataset.schemaEndX ?? 0),
                  anchorY,
                  overlayElement,
                  true,
                )),
          });
        }
      }

      setTargets(spreadOverlappingTargets(nextTargets));
    }

    updateTargets();
    const observer = new MutationObserver(updateTargets);
    observer.observe(previewElement, { childList: true, subtree: true });
    const scrollElement = previewElement.parentElement;
    window.addEventListener("resize", updateTargets);
    scrollElement?.addEventListener("scroll", updateTargets, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateTargets);
      scrollElement?.removeEventListener("scroll", updateTargets);
    };
  }, [nodesById, overlayElement, previewElement, snapshot.revision]);

  function openInsert(target: InsertTarget): void {
    const node = nodesById.get(target.itemId);
    if (!node) return;
    const allowedTypes = insertionTypes(node, target.mode);
    if (allowedTypes.length === 0) return;
    setActiveInsert({ ...target, selectedType: allowedTypes[0] });
    setErrorMessage("");
  }

  function addItem(): void {
    if (!activeInsert) return;
    try {
      const node = nodesById.get(activeInsert.itemId);
      const itemId = activeInsert.mode === "before"
        ? schemaStore.commands.insertItemBefore(activeInsert.itemId, activeInsert.selectedType)
        : schemaStore.commands.addItem(activeInsert.itemId, activeInsert.selectedType);
      if (activeInsert.mode === "start" && node) {
        schemaStore.commands.moveItem(itemId, { targetParentId: node.id, position: 0 });
      }
      const document = schemaStore.getSnapshot().document;
      const ancestorItemIds: number[] = [];
      let parentId = document.getItem(itemId)?.parentId;
      while (parentId !== null && parentId !== undefined) {
        ancestorItemIds.push(parentId);
        parentId = document.getItem(parentId)?.parentId;
      }
      editorStore.commands.revealItem(
        itemId,
        document.getBoardForItem(itemId)?.id,
        ancestorItemIds,
      );
      setActiveInsert(null);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Het onderdeel kon niet worden toegevoegd.");
    }
  }

  return (
    <div className="absolute inset-0" aria-label="Onderdelen toevoegen in het schema">
      {targets.map((target) => {
        const node = nodesById.get(target.itemId);
        if (!node) return null;
        const action = target.mode === "before"
          ? `vóór ${node.label} invoegen`
          : target.mode === "start"
            ? `in ${node.label} toevoegen`
            : `na ${node.label} toevoegen`;
        return (
          <button
            key={`${target.mode}-${target.itemId}`}
            type="button"
            className="pointer-events-auto absolute flex size-5 -translate-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-blue-700 bg-white font-sans text-sm leading-none font-bold text-blue-700 shadow-sm hover:bg-blue-700 hover:text-white focus-visible:bg-blue-700 focus-visible:text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700/30"
            style={{ left: target.left, top: target.top }}
            aria-label={`Onderdeel ${action}`}
            title={`Onderdeel ${action}`}
            onClick={() => openInsert(target)}
          >+</button>
        );
      })}

      {activeInsert && activeNode ? (
        <div
          className="pointer-events-auto absolute z-1 grid min-w-60 translate-x-3 -translate-y-1/2 gap-2.5 rounded-lg border border-neutral-400 bg-white p-3 text-neutral-800 shadow-xl"
          role="dialog"
          aria-label="Onderdeel toevoegen"
          style={popoverPosition}
        >
          <label className="grid gap-1 text-sm">
            <span>Type onderdeel</span>
            <select
              className={ui.field}
              value={activeInsert.selectedType}
              onChange={(event) => setActiveInsert({
                ...activeInsert,
                selectedType: event.currentTarget.value,
              })}
            >
              {insertionTypes(activeNode, activeInsert.mode)
                .map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          {errorMessage ? <p className="m-0 text-sm text-red-700" role="alert">{errorMessage}</p> : null}
          <div className="flex justify-end gap-2">
            <button className={ui.primaryButton} type="button" onClick={addItem}>Toevoegen</button>
            <button className={ui.button} type="button" onClick={() => setActiveInsert(null)}>Annuleren</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
