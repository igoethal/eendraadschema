export const SITUATION_ONLY_SYMBOL_TYPES = [
  "Aardingsonderbreker",
  "Elektriciteitsmeter",
] as const;

export type SituationOnlySymbolType = typeof SITUATION_ONLY_SYMBOL_TYPES[number];

export interface AddSituationSymbolOptions {
  readonly type: SituationOnlySymbolType;
  readonly scale: number;
  readonly rotation: number;
  readonly useScaleAsDefault: boolean;
}

export interface SituationBackgroundImportResult {
  readonly elementId: string;
  readonly scaledToFit: boolean;
  readonly largeFile: boolean;
}

export interface SituationSymbolAddResult {
  readonly elementId: string;
  readonly itemId: number;
}

export interface SituationPlanAssetService {
  importBackground(file: File): Promise<SituationBackgroundImportResult>;
  addSituationOnlySymbol(options: AddSituationSymbolOptions): SituationSymbolAddResult;
}

export type SituationPlanAssetErrorCode =
  | "CANVAS_UNAVAILABLE"
  | "INVALID_IMAGE"
  | "INVALID_SYMBOL_OPTIONS";

export class SituationPlanAssetError extends Error {
  constructor(
    readonly code: SituationPlanAssetErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "SituationPlanAssetError";
  }
}
