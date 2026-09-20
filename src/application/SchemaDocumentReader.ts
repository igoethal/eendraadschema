import type { DossierMetadata } from "../domain/Dossier";

export type HierarchyNodeRole = "item" | "attribute" | "container";

export interface HierarchyNodeCapabilities {
  readonly canAddChild: boolean;
  readonly canInsertBefore: boolean;
  readonly canDelete: boolean;
  readonly canDuplicate: boolean;
  readonly canMove: boolean;
  readonly canExpand: boolean;
  readonly allowedChildTypes: readonly string[];
  readonly allowedInsertBeforeTypes: readonly string[];
  readonly allowedItemTypes: readonly string[];
}

export interface HierarchyItemSummary {
  readonly name?: string;
  readonly number?: string;
  readonly address?: string;
  readonly text?: string;
  readonly connectionPort?: string;
}

export interface HierarchyViewNode {
  readonly id: number;
  readonly parentId: number | null;
  readonly type: string;
  readonly label: string;
  readonly description?: string;
  readonly childIds: readonly number[];
  readonly summary: HierarchyItemSummary;
  readonly role: HierarchyNodeRole;
  readonly capabilities: HierarchyNodeCapabilities;
}

export interface SchemaDocumentDetails {
  readonly owner: string;
  readonly installer: string;
  readonly control: string;
  readonly info: string;
  readonly dossier: DossierMetadata;
}

export interface SchemaDocumentReader {
  getDocumentDetails(): SchemaDocumentDetails;
  getBoards(): readonly DistributionBoard[];
  getBoard(id: string): DistributionBoard | undefined;
  getBoardForItem(itemId: number): DistributionBoard | undefined;
  getBoardRootItems(boardId: string): readonly HierarchyViewNode[];
  getRootCapabilities(): HierarchyNodeCapabilities;
  getItem(id: number): HierarchyViewNode | undefined;
  getChildren(parentId: number | null): readonly HierarchyViewNode[];
  getRootItems(): readonly HierarchyViewNode[];
  getAllItems(): readonly HierarchyViewNode[];
  getHierarchy(): readonly HierarchyViewNode[];
}
import type { DistributionBoard } from "../domain/DistributionBoard";
