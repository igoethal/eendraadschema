import { useLayoutEffect } from "react";
import type { EditorStore } from "../../application/EditorStore";
import type { SchemaDocumentReader } from "../../application/SchemaDocumentReader";
import type { SchemaStore } from "../../application/SchemaStore";
import { useEditorSnapshot } from "../useEditorSnapshot";
import { useSchemaSnapshot } from "../useSchemaSnapshot";

const selectedClass = "drop-shadow-[0_0_3px_#f97316]";
const hoveredClass = "drop-shadow-[0_0_3px_#2563eb]";
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

interface SchematicSelectionBridgeProps {
  readonly schemaStore: SchemaStore;
  readonly editorStore: EditorStore;
  readonly previewElement: HTMLElement;
}

function ancestorIds(document: SchemaDocumentReader, itemId: number): number[] {
  const ancestors: number[] = [];
  let parentId = document.getItem(itemId)?.parentId;
  while (parentId !== null && parentId !== undefined) {
    ancestors.push(parentId);
    parentId = document.getItem(parentId)?.parentId;
  }
  return ancestors;
}

function focusHierarchyRow(itemId: number): void {
  requestAnimationFrame(() => {
    const row = window.document.querySelector<HTMLButtonElement>(
      `[data-hierarchy-item-id="${itemId}"]`,
    );
    row?.scrollIntoView?.({ block: "nearest" });
    row?.focus();
  });
}

export function SchematicSelectionBridge({
  schemaStore,
  editorStore,
  previewElement,
}: SchematicSelectionBridgeProps) {
  const schema = useSchemaSnapshot(schemaStore);
  const editor = useEditorSnapshot(editorStore);

  useLayoutEffect(() => {
    let hoveredElement: SVGGraphicsElement | null = null;

    function schematicElements(): SVGGraphicsElement[] {
      return Array.from(
        previewElement.querySelectorAll<SVGGraphicsElement>("[data-schema-item-id]"),
      );
    }

    function ensureHitArea(element: SVGGraphicsElement): void {
      if (element.querySelector(":scope > [data-schema-hit-area]")) return;
      const metadata = element.dataset;
      let x = Number(metadata.schemaX);
      let y = Number(metadata.schemaY);
      let width = Number(metadata.schemaWidth);
      let height = Number(metadata.schemaHeight);
      if (![x, y, width, height].every(Number.isFinite) || width <= 0 || height <= 0) {
        const bounds = element.getBBox();
        ({ x, y, width, height } = bounds);
      }
      const hitArea = document.createElementNS(SVG_NAMESPACE, "rect");
      hitArea.dataset.schemaHitArea = "true";
      hitArea.setAttribute("x", String(x));
      hitArea.setAttribute("y", String(y));
      hitArea.setAttribute("width", String(Math.max(width, 1)));
      hitArea.setAttribute("height", String(Math.max(height, 1)));
      hitArea.setAttribute("fill", "transparent");
      hitArea.setAttribute("pointer-events", "all");
      element.insertBefore(hitArea, element.firstChild);
    }

    function updateHighlight(element: SVGGraphicsElement): void {
      const selected = Number(element.dataset.schemaItemId) === editor.selectedItemId;
      element.classList.toggle(hoveredClass, element === hoveredElement);
      element.classList.toggle(selectedClass, selected && element !== hoveredElement);
    }

    function updateElements(): void {
      for (const element of schematicElements()) {
        ensureHitArea(element);
        const itemId = Number(element.dataset.schemaItemId);
        const item = schema.document.getItem(itemId);
        const selected = itemId === editor.selectedItemId;
        element.classList.add("cursor-pointer");
        updateHighlight(element);
        element.setAttribute("role", "button");
        element.setAttribute("tabindex", "0");
        element.setAttribute("aria-label", `Selecteer ${item?.label ?? `onderdeel ${itemId}`} in de hiërarchie`);
        if (selected) {
          element.dataset.schemaSelected = "true";
          element.setAttribute("aria-current", "true");
        } else {
          delete element.dataset.schemaSelected;
          element.removeAttribute("aria-current");
        }
      }
    }

    function revealFromTarget(target: EventTarget | null): void {
      if (!(target instanceof Element)) return;
      const element = target.closest<SVGGraphicsElement>("[data-schema-item-id]");
      if (!element || !previewElement.contains(element)) return;
      const itemId = Number(element.dataset.schemaItemId);
      if (!Number.isInteger(itemId) || !schema.document.getItem(itemId)) return;
      editorStore.commands.revealItem(
        itemId,
        schema.document.getBoardForItem(itemId)?.id,
        ancestorIds(schema.document, itemId),
      );
      focusHierarchyRow(itemId);
    }

    function handleClick(event: MouseEvent): void {
      revealFromTarget(event.target);
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      revealFromTarget(event.target);
    }

    function handlePointerOver(event: PointerEvent): void {
      if (!(event.target instanceof Element)) return;
      const nextHovered = event.target.closest<SVGGraphicsElement>("[data-schema-item-id]");
      if (!nextHovered || !previewElement.contains(nextHovered) || nextHovered === hoveredElement) return;
      const previousHovered = hoveredElement;
      hoveredElement = nextHovered;
      if (previousHovered) updateHighlight(previousHovered);
      updateHighlight(nextHovered);
      nextHovered.dataset.schemaHovered = "true";
      if (previousHovered) delete previousHovered.dataset.schemaHovered;
    }

    function handlePointerOut(event: PointerEvent): void {
      if (!hoveredElement) return;
      if (event.relatedTarget instanceof Node && hoveredElement.contains(event.relatedTarget)) return;
      const previousHovered = hoveredElement;
      hoveredElement = null;
      delete previousHovered.dataset.schemaHovered;
      updateHighlight(previousHovered);
    }

    updateElements();
    const observer = new MutationObserver(updateElements);
    observer.observe(previewElement, { childList: true, subtree: true });
    previewElement.addEventListener("click", handleClick);
    previewElement.addEventListener("keydown", handleKeyDown);
    previewElement.addEventListener("pointerover", handlePointerOver);
    previewElement.addEventListener("pointerout", handlePointerOut);

    return () => {
      observer.disconnect();
      previewElement.removeEventListener("click", handleClick);
      previewElement.removeEventListener("keydown", handleKeyDown);
      previewElement.removeEventListener("pointerover", handlePointerOver);
      previewElement.removeEventListener("pointerout", handlePointerOut);
      for (const element of schematicElements()) {
        element.querySelector(":scope > [data-schema-hit-area]")?.remove();
        element.classList.remove("cursor-pointer", selectedClass, hoveredClass);
        element.removeAttribute("role");
        element.removeAttribute("tabindex");
        element.removeAttribute("aria-label");
        element.removeAttribute("aria-current");
        delete element.dataset.schemaSelected;
        delete element.dataset.schemaHovered;
      }
    };
  }, [editor.selectedItemId, editorStore, previewElement, schema.document, schema.revision]);

  return null;
}
