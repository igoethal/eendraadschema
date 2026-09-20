import type { KeyboardEvent } from "react";
import type { EditorStore } from "../../application/EditorStore";
import type { HierarchyViewNode } from "../../application/SchemaDocumentReader";
import type { SchemaStore } from "../../application/SchemaStore";
import { AddItemControl } from "./AddItemControl";
import { getEditableChildren, type HierarchyIndex } from "./hierarchyModel";
import { cx, ui } from "../uiStyles";
import { GroupedItemTypeOptions } from "./GroupedItemTypeOptions";

interface HierarchyNodeProps {
  readonly node: HierarchyViewNode;
  readonly depth: number;
  readonly hierarchyIndex: HierarchyIndex;
  readonly schemaStore: SchemaStore;
  readonly editorStore: EditorStore;
  readonly selectedItemId: number | null;
  readonly expandedItemIds: ReadonlySet<number>;
  readonly visibleItemIds: readonly number[];
  readonly confirmDelete: (label: string) => boolean;
  readonly reportError: (message: string) => void;
}

function focusItem(itemId: number): void {
  document.querySelector<HTMLButtonElement>(`[data-hierarchy-item-id="${itemId}"]`)?.focus();
}

export function HierarchyNode({
  node,
  depth,
  hierarchyIndex,
  schemaStore,
  editorStore,
  selectedItemId,
  expandedItemIds,
  visibleItemIds,
  confirmDelete,
  reportError,
}: HierarchyNodeProps) {
  const children = getEditableChildren(hierarchyIndex, node.id);
  const siblings = getEditableChildren(hierarchyIndex, node.parentId);
  const siblingIndex = siblings.findIndex((sibling) => sibling.id === node.id);
  const expanded = expandedItemIds.has(node.id);
  const selected = selectedItemId === node.id;
  const hasStructuralActions = node.capabilities.canMove
    || node.capabilities.canDuplicate
    || node.capabilities.canDelete
    || node.capabilities.canExpand;

  function runCommand(command: () => void): void {
    try {
      command();
      reportError("");
    } catch (error) {
      reportError(error instanceof Error ? error.message : "De bewerking is mislukt.");
    }
  }

  function reconcileEditorState(): void {
    const validItemIds = new Set(
      schemaStore.getSnapshot().document.getAllItems().map((item) => item.id),
    );
    editorStore.commands.reconcileItemIds(validItemIds);
  }

  function handleKeyboard(event: KeyboardEvent<HTMLButtonElement>): void {
    const currentIndex = visibleItemIds.indexOf(node.id);
    let targetId: number | undefined;

    switch (event.key) {
      case "ArrowDown":
        targetId = visibleItemIds[currentIndex + 1];
        break;
      case "ArrowUp":
        targetId = visibleItemIds[currentIndex - 1];
        break;
      case "Home":
        targetId = visibleItemIds[0];
        break;
      case "End":
        targetId = visibleItemIds[visibleItemIds.length - 1];
        break;
      case "ArrowRight":
        if (children.length > 0 && !expanded) editorStore.commands.expandItem(node.id);
        else if (children.length > 0) targetId = children[0].id;
        break;
      case "ArrowLeft":
        if (expanded) editorStore.commands.collapseItem(node.id);
        else if (node.parentId !== null) targetId = node.parentId;
        break;
      default:
        return;
    }

    event.preventDefault();
    if (targetId !== undefined) {
      editorStore.commands.selectItem(targetId);
      focusItem(targetId);
    }
  }

  return (
    <li className="my-1">
      <div
        className={cx(
          "grid grid-cols-[1.75rem_minmax(0,1fr)] items-stretch gap-1 rounded-md border border-transparent px-1 py-0.5 [margin-left:calc(var(--hierarchy-depth)*0.625rem)] hover:border-neutral-200 hover:bg-neutral-50",
          selected && "border-blue-700 bg-blue-50 ring-2 ring-blue-700/15",
        )}
        style={{ "--hierarchy-depth": depth } as React.CSSProperties}
      >
        {children.length > 0 ? (
          <button
            type="button"
            className={cx(ui.button, "inline-grid min-w-8 place-items-center self-center p-0")}
            aria-label={`${expanded ? "Inklappen" : "Uitklappen"}: ${node.label}`}
            aria-expanded={expanded}
            onClick={() => editorStore.commands.toggleExpanded(node.id)}
          >
            {expanded ? "−" : "+"}
          </button>
        ) : <span className="inline-grid min-w-8 place-items-center self-center" aria-hidden="true" />}

        <button
          type="button"
          className="flex min-h-8 min-w-0 cursor-pointer flex-col border-0 bg-transparent px-2 py-1 text-left font-[inherit] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700/35"
          data-hierarchy-item-id={node.id}
          aria-current={selected ? "true" : undefined}
          onClick={() => editorStore.commands.selectItem(node.id)}
          onKeyDown={handleKeyboard}
        >
          <span>{node.label}</span>
          {node.description ? <small className="truncate text-neutral-500">{node.description}</small> : null}
        </button>

      {selected && node.capabilities.allowedItemTypes.length > 0 ? <label className="col-start-2 min-w-0 self-center">
          <span className="sr-only">Type van {node.label}</span>
          <select
            className={cx(ui.field, "max-w-full")}
            aria-label={`Type van ${node.label}`}
            value={node.type}
            onChange={(event) => runCommand(() => schemaStore.commands.changeItemType(node.id, event.target.value))}
          >
            <GroupedItemTypeOptions types={node.capabilities.allowedItemTypes} />
          </select>
        </label> : null}

        {selected && hasStructuralActions ? <div className="col-start-2 flex min-w-0 flex-wrap items-center gap-1" aria-label={`Acties voor ${node.label}`}>
          <button
            className={ui.button}
            type="button"
            aria-label={`${node.label} omhoog verplaatsen`}
            disabled={!node.capabilities.canMove || siblingIndex <= 0}
            onClick={() => runCommand(() => schemaStore.commands.moveItem(node.id, {
              targetParentId: node.parentId,
              position: siblingIndex - 1,
            }))}
          >↑</button>
          <button
            className={ui.button}
            type="button"
            aria-label={`${node.label} omlaag verplaatsen`}
            disabled={!node.capabilities.canMove || siblingIndex < 0 || siblingIndex >= siblings.length - 1}
            onClick={() => runCommand(() => schemaStore.commands.moveItem(node.id, {
              targetParentId: node.parentId,
              position: siblingIndex + 1,
            }))}
          >↓</button>
          <button
            className={ui.button}
            type="button"
            aria-label={`${node.label} dupliceren`}
            disabled={!node.capabilities.canDuplicate}
            onClick={() => runCommand(() => {
              const duplicateId = schemaStore.commands.duplicateItem(node.id);
              editorStore.commands.selectItem(duplicateId);
            })}
          >Dupliceren</button>
          {node.capabilities.canExpand ? (
            <button
              className={ui.button}
              type="button"
              aria-label={`${node.label} uitpakken`}
              onClick={() => runCommand(() => {
                schemaStore.commands.expandItem(node.id);
                reconcileEditorState();
              })}
            >Uitpakken</button>
          ) : null}
          <button
            type="button"
            className={ui.dangerButton}
            aria-label={`${node.label} verwijderen`}
            disabled={!node.capabilities.canDelete}
            onClick={() => {
              if (!confirmDelete(node.label)) return;
              runCommand(() => {
                schemaStore.commands.deleteItem(node.id);
                reconcileEditorState();
              });
            }}
          >Verwijderen</button>
        </div> : null}
      </div>

      {selected && node.capabilities.canAddChild ? (
        <AddItemControl
          label={`Onderdeel toevoegen onder ${node.label}`}
          allowedTypes={node.capabilities.allowedChildTypes}
          onAdd={(type) => runCommand(() => {
            const itemId = schemaStore.commands.addItem(node.id, type);
            editorStore.commands.expandItem(node.id);
            editorStore.commands.selectItem(itemId);
          })}
        />
      ) : null}

      {children.length > 0 && expanded ? (
        <ol className="m-0 list-none p-0">
          {children.map((child) => (
            <HierarchyNode
              key={child.id}
              node={child}
              depth={depth + 1}
              hierarchyIndex={hierarchyIndex}
              schemaStore={schemaStore}
              editorStore={editorStore}
              selectedItemId={selectedItemId}
              expandedItemIds={expandedItemIds}
              visibleItemIds={visibleItemIds}
              confirmDelete={confirmDelete}
              reportError={reportError}
            />
          ))}
        </ol>
      ) : null}
    </li>
  );
}
