import type { SituationPlanDefaults } from "../sitplan/SituationPlan";
import type { AdresLocation, AdresType } from "../sitplan/SituationPlanElement";

export interface SituationPlanElementChanges {
  readonly page?: number;
  readonly position?: Readonly<{ x: number; y: number }>;
  readonly labelFontSize?: number;
  readonly addressType?: AdresType;
  readonly address?: string;
  readonly addressLocation?: AdresLocation;
  readonly rotation?: number;
  readonly scale?: number;
  readonly movable?: boolean;
}

export interface SituationPlanElementUpdate {
  readonly elementId: string;
  readonly changes: SituationPlanElementChanges;
}

export interface AddSituationOccurrenceProperties {
  readonly itemId: number;
  readonly page: number;
  readonly position: Readonly<{ x: number; y: number }>;
  readonly addressType: AdresType;
  readonly address: string;
  readonly addressLocation: AdresLocation;
  readonly labelFontSize: number;
  readonly scale: number;
  readonly rotation: number;
}

export interface AddSituationCustomElementProperties {
  readonly page: number;
  readonly position: Readonly<{ x: number; y: number }>;
  readonly size: Readonly<{ width: number; height: number }>;
  readonly labelFontSize: number;
  readonly scale: number;
  readonly rotation: number;
  readonly svg: string;
}

export type SituationPlanAlignment =
  | "left"
  | "horizontal-center"
  | "right"
  | "top"
  | "vertical-center"
  | "bottom";

export type SituationPlanDistributionAxis = "horizontal" | "vertical";

export interface SituationPlanElementSnapshot {
  readonly id: string;
  readonly page: number;
  readonly position: Readonly<{ x: number; y: number }>;
  readonly size: Readonly<{ width: number; height: number }>;
  readonly labelPosition: Readonly<{ x: number; y: number }>;
  readonly labelFontSize: number;
  readonly addressType: string | null;
  readonly address: string | null;
  readonly addressLocation: string;
  readonly rotation: number;
  readonly scale: number;
  readonly movable: boolean;
  readonly svg: string;
  readonly electroItemId: number | null;
}

export interface SituationPlanSnapshot {
  readonly revision: number;
  readonly activePage: number;
  readonly pageCount: number;
  readonly defaults: Readonly<SituationPlanDefaults>;
  readonly elements: readonly SituationPlanElementSnapshot[];
}

export interface SituationPlanCommands {
  undo(): void;
  redo(): void;
  selectPage(page: number): void;
  addPage(): number;
  deletePage(page: number): void;
  updateDefaults(changes: Partial<SituationPlanDefaults>): void;
  addOccurrence(properties: AddSituationOccurrenceProperties): string;
  addCustomElement(properties: AddSituationCustomElementProperties): string;
  updateElement(elementId: string, changes: SituationPlanElementChanges): void;
  updateElements(updates: readonly SituationPlanElementUpdate[]): void;
  translateElements(
    elementIds: readonly string[],
    offset: Readonly<{ x: number; y: number }>,
    historyKey: string,
  ): void;
  sendElementsToBack(elementIds: readonly string[]): void;
  bringElementsToFront(elementIds: readonly string[]): void;
  alignElements(elementIds: readonly string[], alignment: SituationPlanAlignment): void;
  distributeElements(elementIds: readonly string[], axis: SituationPlanDistributionAxis): void;
  duplicateElements(
    elementIds: readonly string[],
    offset?: Readonly<{ x: number; y: number }>,
  ): readonly string[];
  deleteElements(elementIds: readonly string[]): readonly number[];
}

export interface SituationPlanStore {
  getSnapshot(): SituationPlanSnapshot;
  subscribe(listener: () => void): () => void;
  readonly commands: SituationPlanCommands;
}

export type SituationPlanCommandErrorCode =
  | "INVALID_PAGE"
  | "LAST_PAGE"
  | "INVALID_DEFAULT"
  | "ELEMENT_NOT_FOUND"
  | "INVALID_ELEMENT_SELECTION"
  | "INVALID_ELEMENT_CHANGE";

export class SituationPlanCommandError extends Error {
  constructor(
    public readonly code: SituationPlanCommandErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "SituationPlanCommandError";
  }
}
