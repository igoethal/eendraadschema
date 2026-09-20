import type {
  HierarchyViewNode,
  SchemaDocumentReader,
} from "../../application/SchemaDocumentReader";

export interface VisibleHierarchyNode {
  readonly node: HierarchyViewNode;
  readonly depth: number;
}

export interface HierarchyIndex {
  readonly childrenByParent: ReadonlyMap<number | null, readonly HierarchyViewNode[]>;
}

const EMPTY_CHILDREN: readonly HierarchyViewNode[] = Object.freeze([]);

export function createHierarchyIndex(document: SchemaDocumentReader, boardId?: string): HierarchyIndex {
  const childrenByParent = new Map<number | null, HierarchyViewNode[]>();
  for (const node of document.getAllItems()) {
    if (node.role !== "item") continue;
    if (boardId !== undefined && document.getBoardForItem(node.id)?.id !== boardId) continue;
    const siblings = childrenByParent.get(node.parentId);
    if (siblings) siblings.push(node);
    else childrenByParent.set(node.parentId, [node]);
  }
  return { childrenByParent };
}

export function getEditableChildren(
  index: HierarchyIndex,
  parentId: number | null,
): readonly HierarchyViewNode[] {
  return index.childrenByParent.get(parentId) ?? EMPTY_CHILDREN;
}

export interface HierarchySearchResult {
  readonly node: HierarchyViewNode;
  readonly boardId: string | undefined;
  readonly boardName: string | undefined;
  readonly ancestorItemIds: readonly number[];
}

/** Case-insensitive substring search over label, type and the summary fields
 *  of every editable item, across all distribution boards. */
export function searchHierarchyItems(
  document: SchemaDocumentReader,
  query: string,
): HierarchySearchResult[] {
  const trimmedQuery = query.trim().toLowerCase();
  if (trimmedQuery === "") return [];

  const results: HierarchySearchResult[] = [];
  for (const node of document.getAllItems()) {
    if (node.role !== "item") continue;
    const haystack = [
      node.label,
      node.type,
      node.description,
      node.summary.name,
      node.summary.number,
      node.summary.address,
      node.summary.text,
    ];
    if (!haystack.some((value) => value !== undefined && value.toLowerCase().includes(trimmedQuery))) {
      continue;
    }

    const ancestorItemIds: number[] = [];
    let parentId = node.parentId;
    while (parentId !== null) {
      const parent = document.getItem(parentId);
      if (parent === undefined) break;
      ancestorItemIds.unshift(parent.id);
      parentId = parent.parentId;
    }

    const board = document.getBoardForItem(node.id);
    results.push({ node, boardId: board?.id, boardName: board?.name, ancestorItemIds });
  }
  return results;
}

export function getVisibleHierarchy(
  index: HierarchyIndex,
  expandedItemIds: ReadonlySet<number>,
  rootItems: readonly HierarchyViewNode[] = getEditableChildren(index, null),
): VisibleHierarchyNode[] {
  const visible: VisibleHierarchyNode[] = [];

  function appendChildren(parentId: number | null, depth: number): void {
    for (const node of getEditableChildren(index, parentId)) {
      visible.push({ node, depth });
      if (expandedItemIds.has(node.id)) appendChildren(node.id, depth + 1);
    }
  }

  for (const node of rootItems) {
    visible.push({ node, depth: 0 });
    if (expandedItemIds.has(node.id)) appendChildren(node.id, 1);
  }
  return visible;
}
