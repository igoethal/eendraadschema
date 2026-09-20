import type { BoardLayout } from "../domain/BoardLayout";
import type { PlacementTask } from "../domain/Dossier";
import type { SchemaSnapshot } from "./SchemaStore";
import type { SituationPlanSnapshot } from "./SituationPlanStore";
import {
  getInstallationItemPolicy,
  type InstallationItemPresentation,
} from "./InstallationItemPolicy";

export { getItemPresentation } from "./InstallationItemPolicy";
export type { InstallationItemPresentation } from "./InstallationItemPolicy";

export interface DossierItemLink {
  readonly itemId: number;
  readonly circuitId: number | null;
  readonly boardId: string | null;
  readonly presentation: InstallationItemPresentation;
  readonly situationOccurrenceIds: readonly string[];
  readonly hasBoardPlacement: boolean;
  readonly placementTasks: readonly PlacementTask[];
}

export interface DossierIssue {
  readonly id: string;
  readonly severity: "warning" | "error";
  readonly itemId?: number;
  readonly code: "MISSING_SITUATION_PLACEMENT" | "MISSING_BOARD_PLACEMENT" | "ORPHANED_SITUATION_PLACEMENT" | "MISSING_DOSSIER_METADATA" | "OPEN_PLACEMENT_TASK";
  readonly message: string;
}

export interface DossierSnapshot {
  readonly items: readonly DossierItemLink[];
  readonly issues: readonly DossierIssue[];
}

/**
 * A read-only join across the three dossier views.  It deliberately derives
 * completeness rather than persisting a second copy of graph ownership.
 */
export function createDossierSnapshot(
  schema: SchemaSnapshot,
  situation: SituationPlanSnapshot | null,
): DossierSnapshot {
  const byItemId = new Map<number, string[]>();
  for (const occurrence of situation?.elements ?? []) {
    if (occurrence.electroItemId === null) continue;
    const ids = byItemId.get(occurrence.electroItemId) ?? [];
    ids.push(occurrence.id);
    byItemId.set(occurrence.electroItemId, ids);
  }
  const placementIds = getBoardPlacementIds(schema.boardLayouts);
  const tasksByItemId = new Map<number, PlacementTask[]>();
  for (const task of schema.placementTasks) {
    const tasks = tasksByItemId.get(task.itemId) ?? [];
    tasks.push(task);
    tasksByItemId.set(task.itemId, tasks);
  }
  const itemById = new Map(schema.document.getAllItems().map(item => [item.id, item]));
  const items: DossierItemLink[] = [];
  const issues: DossierIssue[] = [];

  for (const item of schema.document.getAllItems()) {
    if (item.role !== "item") continue;
    const policy = getInstallationItemPolicy(item.type);
    const presentation = policy.presentation;
    const occurrences = Object.freeze([...(byItemId.get(item.id) ?? [])]);
    const link: DossierItemLink = Object.freeze({
      itemId: item.id,
      circuitId: findCircuitId(item.id, itemById),
      boardId: schema.document.getBoardForItem(item.id)?.id ?? null,
      presentation,
      situationOccurrenceIds: occurrences,
      hasBoardPlacement: placementIds.has(item.id),
      placementTasks: Object.freeze([...(tasksByItemId.get(item.id) ?? [])]),
    });
    items.push(link);
    if (policy.requiresSituationPlacement && occurrences.length === 0) {
      issues.push(dossierIssue("warning", "MISSING_SITUATION_PLACEMENT", item.id,
        `${item.label} staat nog niet op het situatieschema.`));
    }
    if (policy.requiresBoardPlacement && !link.hasBoardPlacement) {
      issues.push(dossierIssue("warning", "MISSING_BOARD_PLACEMENT", item.id,
        `${item.label} staat nog niet in de bordindeling.`));
    }
    for (const task of link.placementTasks) {
      issues.push(dossierIssue("warning", "OPEN_PLACEMENT_TASK", item.id,
        `${item.label} wacht nog op ${task.destination === "situation" ? "plaatsing op het situatieschema" : "plaatsing in de bordindeling"}${task.locationHint ? ` (${task.locationHint})` : ""}.`));
    }
  }
  const metadata = schema.document.getDocumentDetails().dossier;
  for (const [key, label] of [
    ["installationAddress", "adres van de installatie"], ["nominalVoltage", "nominale spanning"],
    ["revisionLabel", "documentversie"], ["issueDate", "uitgiftedatum"],
  ] as const) {
    if (!metadata[key]) issues.push(dossierIssue(
      "warning",
      "MISSING_DOSSIER_METADATA",
      undefined,
      `Dossiergegeven ontbreekt: ${label}.`,
      key,
    ));
  }

  for (const [itemId, occurrenceIds] of byItemId) {
    if (itemById.has(itemId)) continue;
    issues.push(dossierIssue("error", "ORPHANED_SITUATION_PLACEMENT", itemId,
      `Een situatiesymbool (${occurrenceIds.length}) verwijst naar een verwijderd elektrisch item.`));
  }
  return Object.freeze({ items: Object.freeze(items), issues: Object.freeze(issues) });
}

function getBoardPlacementIds(layouts: readonly BoardLayout[]): ReadonlySet<number> {
  return new Set(layouts.flatMap(layout => layout.placements.map(placement => placement.itemId)));
}

function findCircuitId(itemId: number, itemById: ReadonlyMap<number, { parentId: number | null; type: string }>): number | null {
  let currentId: number | null = itemId;
  const visited = new Set<number>();
  while (currentId !== null && !visited.has(currentId)) {
    visited.add(currentId);
    const item = itemById.get(currentId);
    if (!item) return null;
    if (item.type === "Kring") return currentId;
    currentId = item.parentId;
  }
  return null;
}

function dossierIssue(
  severity: DossierIssue["severity"],
  code: DossierIssue["code"],
  itemId: number | undefined,
  message: string,
  discriminator?: string,
): DossierIssue {
  return Object.freeze({
    id: `${code}:${discriminator ?? itemId ?? "document"}`,
    severity,
    code,
    itemId,
    message,
  });
}
