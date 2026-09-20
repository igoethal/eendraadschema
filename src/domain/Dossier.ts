export type InstallationContext = "new" | "change" | "existing";
export type PlacementTaskDestination = "situation" | "board";

export interface DossierMetadata {
  readonly installationContext: InstallationContext;
  readonly installationAddress: string;
  readonly nominalVoltage: string;
  readonly currentNature: "AC" | "DC" | "other" | "";
  readonly frequencyHz: string;
  readonly revisionLabel: string;
  readonly issueDate: string;
}

export interface PlacementTask {
  readonly id: string;
  readonly itemId: number;
  readonly destination: PlacementTaskDestination;
  readonly locationHint?: string;
}

export const DEFAULT_DOSSIER_METADATA: DossierMetadata = Object.freeze({
  installationContext: "existing",
  installationAddress: "",
  nominalVoltage: "",
  currentNature: "",
  frequencyHz: "",
  revisionLabel: "",
  issueDate: "",
});

export function parseDossierMetadata(value: unknown): DossierMetadata {
  if (!isRecord(value)) return { ...DEFAULT_DOSSIER_METADATA };
  return {
    installationContext: value.installationContext === "new" || value.installationContext === "change" || value.installationContext === "existing"
      ? value.installationContext : "existing",
    installationAddress: text(value.installationAddress),
    nominalVoltage: text(value.nominalVoltage),
    currentNature: value.currentNature === "AC" || value.currentNature === "DC" || value.currentNature === "other" ? value.currentNature : "",
    frequencyHz: text(value.frequencyHz),
    revisionLabel: text(value.revisionLabel),
    issueDate: isIsoDate(value.issueDate) ? value.issueDate : "",
  };
}

export function parsePlacementTasks(value: unknown, validItemIds: ReadonlySet<number>): PlacementTask[] {
  if (!Array.isArray(value)) return [];
  const ids = new Set<string>();
  return value.flatMap((candidate): PlacementTask[] => {
    if (!isRecord(candidate) || typeof candidate.id !== "string" || ids.has(candidate.id)
      || !Number.isInteger(candidate.itemId) || !validItemIds.has(candidate.itemId as number)
      || (candidate.destination !== "situation" && candidate.destination !== "board")) return [];
    ids.add(candidate.id);
    const locationHint = text(candidate.locationHint);
    return [{ id: candidate.id, itemId: candidate.itemId as number, destination: candidate.destination, ...(locationHint ? { locationHint } : {}) }];
  });
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; }
function text(value: unknown): string { return typeof value === "string" ? value.trim() : ""; }
function isIsoDate(value: unknown): value is string { return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value); }
