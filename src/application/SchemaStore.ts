import type { SchemaDocumentReader } from "./SchemaDocumentReader";
import type { SchemaPropertyReader } from "./SchemaPropertyReader";
import type { ConfiguredItemPropertyChanges } from "./ConfiguredItemProperties";
import type { ValidationIssue } from "./SchemaValidation";
import type { BoardLayout } from "../domain/BoardLayout";
import type { DossierMetadata, PlacementTask, PlacementTaskDestination } from "../domain/Dossier";
import type {
  BasicConsumerPropertyChanges,
  CircuitPropertyChanges,
  SocketPropertyChanges,
  LightPointPropertyChanges,
} from "./SchemaPropertyReader";

export interface SchemaSnapshot {
  readonly revision: number;
  readonly document: SchemaDocumentReader;
  readonly properties: SchemaPropertyReader;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly validationIssues: readonly ValidationIssue[];
  readonly boardLayouts: readonly BoardLayout[];
  readonly placementTasks: readonly PlacementTask[];
}

export interface MoveItemOptions {
  readonly targetParentId: number | null;
  readonly position?: number;
}

export interface AddDistributionBoardProperties {
  readonly name: string;
  readonly location?: string;
  readonly cableType?: string;
  readonly conductorSection?: string;
  readonly lengthMeters?: number;
}

export interface UpdateDistributionBoardChanges {
  readonly name?: string;
  readonly location?: string;
  readonly sourceCircuitId?: number;
  readonly cableType?: string;
  readonly conductorSection?: string;
  readonly lengthMeters?: number;
}

export interface UpdateDocumentDetailsChanges {
  readonly owner?: string;
  readonly installer?: string;
  readonly control?: string;
  readonly info?: string;
}

export interface UpdateFileSettingsChanges {
  readonly filename?: string;
  readonly compressionDisabled?: boolean;
}
export type UpdateDossierMetadataChanges = Partial<DossierMetadata>;

export interface AddBoardLayoutRailProperties {
  readonly name?: string;
  readonly moduleCapacity?: number;
}

export interface ConfigureBoardLayoutProperties {
  readonly moduleCapacity: number;
  readonly rowCount: number;
}

export interface UpdateBoardLayoutRailChanges {
  readonly name?: string;
  readonly moduleCapacity?: number;
}

export interface PlaceBoardLayoutItemProperties {
  readonly railId: string;
  readonly startModule: number;
  readonly moduleWidth: number;
}

/** A deliberately small, serializable command language for reviewed agent changes. */
export type AgentGraphOperation =
  | Readonly<{ kind: "add-item"; parentId: number | null; type: string }>
  | Readonly<{ kind: "update-item"; itemId: number; changes: Readonly<Record<string, unknown>> }>
  | Readonly<{ kind: "move-item"; itemId: number; targetParentId: number | null; position?: number }>
  | Readonly<{ kind: "delete-item"; itemId: number }>
  | Readonly<{ kind: "create-placement-task"; itemId: number; destination: PlacementTaskDestination; locationHint?: string }>;

export interface SchemaCommands {
  addItem(parentId: number | null, type: string): number;
  /** Creates and configures a circuit below a distribution board as one undoable change. */
  addCircuit(boardId: string, changes: Readonly<CircuitPropertyChanges>): number;
  insertItemBefore(itemId: number, type: string): number;
  addSituationOnlyItem(type: string): number;
  deleteItem(itemId: number): void;
  moveItem(itemId: number, options: MoveItemOptions): void;
  changeItemType(itemId: number, type: string): void;
  updateItem(itemId: number, changes: Readonly<Record<string, unknown>>): void;
  updateCircuit(itemId: number, changes: Readonly<CircuitPropertyChanges>): void;
  updateSocket(itemId: number, changes: Readonly<SocketPropertyChanges>): void;
  updateBasicConsumer(itemId: number, changes: Readonly<BasicConsumerPropertyChanges>): void;
  updateLightPoint(itemId: number, changes: Readonly<LightPointPropertyChanges>): void;
  updateConfiguredItem(itemId: number, changes: ConfiguredItemPropertyChanges): void;
  duplicateItem(itemId: number): number;
  expandItem(itemId: number): void;
  addDistributionBoard(feederCircuitId: number, properties: AddDistributionBoardProperties): string;
  updateDistributionBoard(boardId: string, changes: UpdateDistributionBoardChanges): void;
  deleteDistributionBoard(boardId: string): void;
  updateDocumentDetails(changes: UpdateDocumentDetailsChanges): void;
  updateFileSettings(changes: UpdateFileSettingsChanges): void;
  updateDossierMetadata(changes: UpdateDossierMetadataChanges): void;
  createPlacementTask(itemId: number, destination: PlacementTaskDestination, locationHint?: string): string;
  resolvePlacementTask(taskId: string): void;
  addBoardLayoutRail(boardId: string, properties?: AddBoardLayoutRailProperties): string;
  configureBoardLayout(boardId: string, properties: ConfigureBoardLayoutProperties): void;
  updateBoardLayoutRail(
    boardId: string,
    railId: string,
    changes: UpdateBoardLayoutRailChanges,
  ): void;
  deleteBoardLayoutRail(boardId: string, railId: string): void;
  placeBoardLayoutItem(
    boardId: string,
    itemId: number,
    properties: PlaceBoardLayoutItemProperties,
  ): void;
  removeBoardLayoutItem(boardId: string, itemId: number): void;
  /** Applies a previously reviewed agent proposal as one undoable revision. */
  applyAgentChangeSet(operations: readonly AgentGraphOperation[]): void;
  replaceDocument(serializedDocument: string, version?: number): void;
  undo(): void;
  redo(): void;
}

export interface SchemaStore {
  getSnapshot(): SchemaSnapshot;
  subscribe(listener: () => void): () => void;
  readonly commands: SchemaCommands;
}

export type SchemaCommandErrorCode =
  | "ITEM_NOT_FOUND"
  | "PARENT_NOT_FOUND"
  | "INVALID_CHILD_TYPE"
  | "MAX_CHILDREN_REACHED"
  | "CYCLIC_PARENT"
  | "INVALID_POSITION"
  | "INVALID_CHANGE"
  | "BOARD_NOT_FOUND"
  | "INVALID_BOARD_FEEDER"
  | "BOARD_DEPENDENCY"
  | "BOARD_LAYOUT_NOT_FOUND"
  | "INVALID_BOARD_LAYOUT";

export class SchemaCommandError extends Error {
  constructor(
    public readonly code: SchemaCommandErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "SchemaCommandError";
  }
}
