import { Hierarchical_List } from "../Hierarchical_List";
import { Electro_Item } from "../List_Item/Electro_Item";
import { findBoardIdForItem, type DistributionBoard } from "../domain/DistributionBoard";
import type {
  HierarchyNodeRole,
  HierarchyItemSummary,
  HierarchyViewNode,
  SchemaDocumentDetails,
  SchemaDocumentReader,
} from "./SchemaDocumentReader";

function nonEmptyString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  const text = String(value).trim();
  return text === "" ? undefined : text;
}

function getSummary(item: Electro_Item): HierarchyItemSummary {
  return Object.freeze({
    name: nonEmptyString(item.props.naam),
    number: nonEmptyString(item.props.nr),
    address: nonEmptyString(item.props.adres),
    text: nonEmptyString(item.getType() === "Omschakelaarpoort" ? item.props.poort : item.props.tekst),
    connectionPort: nonEmptyString(
      item.getType() === "Omschakelaar"
        ? item.props.parent_port
        : item.getType() === "Omschakelaarpoort"
          ? item.props.poort
          : undefined,
    ),
  });
}

type LabelFormatter = (type: string, summary: HierarchyItemSummary) => string;

const labelFormatters: Readonly<Record<string, LabelFormatter>> = Object.freeze({
  "": () => "Nieuw element",
  Bord: (type, summary) => summary.name ?? type,
  Kring: (type, summary) => summary.name ? `${type} ${summary.name}` : type,
  Omschakelaarpoort: (_type, summary) => summary.text ?? "Omschakelaarpoort",
});

function getLabel(type: string, summary: HierarchyItemSummary): string {
  const formatter = labelFormatters[type];
  if (formatter) return formatter(type, summary);

  if (summary.name) return `${type} — ${summary.name}`;
  if (summary.number) return `${type} ${summary.number}`;
  return type;
}

function getDescription(summary: HierarchyItemSummary): string | undefined {
  return summary.text ?? summary.address;
}

function getRole(item: Electro_Item): HierarchyNodeRole {
  if (item.getType() === "Container") return "container";
  if (item.isAttribuut()) return "attribute";
  return "item";
}

function allowedChildTypes(item: Electro_Item): readonly string[] {
  return Object.freeze(
    item.allowedChilds().filter((type) => type !== "" && type !== "-" && type !== "---"),
  );
}

function allowedInsertBeforeTypes(
  structure: Hierarchical_List,
  item: Electro_Item,
  isBoardRoot: boolean,
): readonly string[] {
  const parent = item.getParent();
  if (parent === null || isBoardRoot) return Object.freeze([]);

  return Object.freeze(allowedChildTypes(parent).filter((type) => {
    const candidate = structure.createItem(type);
    candidate.parent = parent.id;
    return candidate.getMaxNumChilds() >= 1 && candidate.allowedChilds().includes(item.getType());
  }));
}

/**
 * Read-only projection over the current legacy document.
 *
 * The legacy Hierarchical_List remains the source of truth. Every call creates
 * fresh, frozen hierarchy summaries so consumers cannot mutate the document by
 * retaining or editing a returned node. Type-specific property data belongs to
 * a separate property-editor adapter.
 */
export class LegacySchemaDocumentReader implements SchemaDocumentReader {
  private readonly rootCapabilities;
  private readonly items: readonly HierarchyViewNode[];
  private readonly itemsById: ReadonlyMap<number, HierarchyViewNode>;
  private readonly childrenByParent: ReadonlyMap<number | null, readonly HierarchyViewNode[]>;
  private readonly boards: readonly DistributionBoard[];
  private readonly boardsById: ReadonlyMap<string, DistributionBoard>;
  private readonly documentDetails: SchemaDocumentDetails;

  constructor(structure: Hierarchical_List) {
    const activeItems: Electro_Item[] = [];
    const boardRootIds = new Set(structure.boards.flatMap((board) => board.rootItemIds));
    for (let ordinal = 0; ordinal < structure.length; ordinal += 1) {
      if (structure.active[ordinal]) activeItems.push(structure.data[ordinal] as Electro_Item);
    }

    const childIdsByParent = new Map<number, number[]>();
    for (const item of activeItems) {
      const childIds = childIdsByParent.get(item.parent);
      if (childIds) childIds.push(item.id);
      else childIdsByParent.set(item.parent, [item.id]);
    }

    this.rootCapabilities = Object.freeze({
      canAddChild: true,
      canInsertBefore: false,
      canDelete: false,
      canDuplicate: false,
      canMove: false,
      canExpand: false,
      allowedChildTypes: Object.freeze(
        structure.allowedRootChilds().filter((type) => type !== ""),
      ),
      allowedInsertBeforeTypes: Object.freeze([]),
      allowedItemTypes: Object.freeze([]),
    });
    this.items = Object.freeze(activeItems.map((item) => this.toViewNode(
      item,
      childIdsByParent.get(item.id) ?? [],
      boardRootIds.has(item.id),
    )));
    this.itemsById = new Map(this.items.map((item) => [item.id, item]));

    const childrenByParent = new Map<number | null, HierarchyViewNode[]>();
    for (const item of this.items) {
      const siblings = childrenByParent.get(item.parentId);
      if (siblings) siblings.push(item);
      else childrenByParent.set(item.parentId, [item]);
    }
    this.childrenByParent = new Map(
      Array.from(childrenByParent, ([parentId, children]) => [parentId, Object.freeze(children)]),
    );
    this.boards = Object.freeze(structure.boards.map((board) => Object.freeze({
      ...board,
      feeder: board.feeder ? Object.freeze({ ...board.feeder }) : undefined,
      rootItemIds: Object.freeze([...board.rootItemIds]),
    })));
    this.boardsById = new Map(this.boards.map((board) => [board.id, board]));
    this.documentDetails = Object.freeze({
      owner: structure.properties.owner,
      installer: structure.properties.installer,
      control: structure.properties.control,
      info: structure.properties.info,
      dossier: Object.freeze({ ...structure.properties.dossier }),
    });
  }

  getDocumentDetails(): SchemaDocumentDetails {
    return this.documentDetails;
  }

  getBoards(): readonly DistributionBoard[] {
    return this.boards;
  }

  getBoard(id: string): DistributionBoard | undefined {
    return this.boardsById.get(id);
  }

  getBoardForItem(itemId: number): DistributionBoard | undefined {
    const boardId = findBoardIdForItem(
      this.boards,
      itemId,
      (id) => this.itemsById.get(id)?.parentId,
    );
    return boardId === undefined ? undefined : this.boardsById.get(boardId);
  }

  getBoardRootItems(boardId: string): readonly HierarchyViewNode[] {
    const board = this.boardsById.get(boardId);
    if (!board) return Object.freeze([]);
    return Object.freeze(board.rootItemIds.flatMap((id) => {
      const item = this.itemsById.get(id);
      return item ? [item] : [];
    }));
  }

  getRootCapabilities() {
    return this.rootCapabilities;
  }

  getItem(id: number): HierarchyViewNode | undefined {
    return this.itemsById.get(id);
  }

  getChildren(parentId: number | null): readonly HierarchyViewNode[] {
    return this.childrenByParent.get(parentId) ?? Object.freeze([]);
  }

  getRootItems(): readonly HierarchyViewNode[] {
    return this.getChildren(null);
  }

  getAllItems(): readonly HierarchyViewNode[] {
    return this.items;
  }

  getHierarchy(): readonly HierarchyViewNode[] {
    return this.items;
  }

  private toViewNode(
    item: Electro_Item,
    childIds: readonly number[],
    isBoardRoot: boolean,
  ): HierarchyViewNode {
    const summary = getSummary(item);
    const role = getRole(item);
    const isEditableItem = role === "item";
    const isProtectedConnector = item.getType() === "Omschakelaarpoort";
    const insertBeforeTypes = isEditableItem && !isProtectedConnector
      ? allowedInsertBeforeTypes(item.sourcelist, item, isBoardRoot)
      : Object.freeze([]);
    return Object.freeze({
      id: item.id,
      parentId: item.parent === 0 ? null : item.parent,
      type: item.getType() ?? "",
      label: getLabel(item.getType() ?? "", summary),
      description: item.getType() === "Omschakelaarpoort" ? undefined : getDescription(summary),
      childIds: Object.freeze([...childIds]),
      summary,
      role,
      capabilities: Object.freeze({
        canAddChild: isEditableItem && item.checkInsertChild(),
        canInsertBefore: insertBeforeTypes.length > 0,
        canDelete: isEditableItem && !isProtectedConnector && !isBoardRoot,
        canDuplicate: isEditableItem && !isProtectedConnector && !isBoardRoot && item.checkInsertSibling(),
        canMove: isEditableItem && !isProtectedConnector && !isBoardRoot,
        canExpand: isEditableItem && !isProtectedConnector && item.isExpandable(),
        allowedChildTypes: isEditableItem ? allowedChildTypes(item) : Object.freeze([]),
        allowedInsertBeforeTypes: insertBeforeTypes,
        allowedItemTypes: isEditableItem && !isProtectedConnector && item.getType() !== "Omschakelaar" ? Object.freeze(isBoardRoot
          ? [item.getType()]
          : Array.from(new Set([
              item.getType(),
              ...(item.parent === 0 ? item.sourcelist.allowedRootChilds() : item.getParent().allowedChilds()),
            ])).filter((type) => type !== "" && type !== "-" && type !== "---")) : Object.freeze([]),
      }),
    });
  }
}
