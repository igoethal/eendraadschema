import type { SchemaSnapshot } from "./SchemaStore";
import type { SituationPlanSnapshot } from "./SituationPlanStore";
import {
  createDossierSnapshot,
  type DossierItemLink,
  type InstallationItemPresentation,
} from "./DossierReader";

export interface CircuitContext {
  readonly boardId: string | null;
  readonly boardName: string | null;
  readonly circuitId: number | null;
  readonly circuitLabel: string | null;
  readonly itemId: number | null;
  readonly itemLabel: string | null;
  readonly presentation: InstallationItemPresentation;
  readonly situationOccurrenceIds: readonly string[];
  readonly hasBoardPlacement: boolean;
  readonly openTaskCount: number;
}

export interface CircuitCompletionSummary {
  readonly circuitId: number;
  readonly boardId: string | null;
  readonly boardName: string;
  readonly label: string;
  readonly itemCount: number;
  readonly situationComplete: number;
  readonly situationRequired: number;
  readonly boardComplete: number;
  readonly boardRequired: number;
  readonly openTaskCount: number;
  readonly issueCount: number;
}

export function createCircuitContext(
  schema: SchemaSnapshot,
  situation: SituationPlanSnapshot | null,
  itemId: number | null,
): CircuitContext | null {
  if (itemId === null) return null;
  const item = schema.document.getItem(itemId);
  if (!item) return null;
  const dossier = createDossierSnapshot(schema, situation);
  const link = dossier.items.find(candidate => candidate.itemId === itemId);
  const circuit = link?.circuitId === null || link?.circuitId === undefined
    ? null
    : schema.document.getItem(link.circuitId);
  const board = schema.document.getBoardForItem(itemId);
  return Object.freeze({
    boardId: board?.id ?? null,
    boardName: board?.name ?? null,
    circuitId: link?.circuitId ?? (item.type === "Kring" ? item.id : null),
    circuitLabel: circuit?.label ?? (item.type === "Kring" ? item.label : null),
    itemId,
    itemLabel: item.label,
    presentation: link?.presentation ?? "structural",
    situationOccurrenceIds: Object.freeze([...(link?.situationOccurrenceIds ?? [])]),
    hasBoardPlacement: link?.hasBoardPlacement ?? false,
    openTaskCount: link?.placementTasks.length ?? 0,
  });
}

export function createCircuitCompletionSummaries(
  schema: SchemaSnapshot,
  situation: SituationPlanSnapshot | null,
): readonly CircuitCompletionSummary[] {
  const dossier = createDossierSnapshot(schema, situation);
  const byCircuit = new Map<number, DossierItemLink[]>();
  for (const link of dossier.items) {
    if (link.circuitId === null) continue;
    const links = byCircuit.get(link.circuitId) ?? [];
    links.push(link);
    byCircuit.set(link.circuitId, links);
  }
  return Object.freeze([...byCircuit].map(([circuitId, links]) => {
    const circuit = schema.document.getItem(circuitId);
    const field = links.filter(link => link.presentation === "field-device");
    const panel = links.filter(link => link.presentation === "panel-device");
    return Object.freeze({
      circuitId,
      boardId: schema.document.getBoardForItem(circuitId)?.id ?? null,
      boardName: schema.document.getBoardForItem(circuitId)?.name ?? "Onbekend bord",
      label: circuit?.label ?? `Kring ${circuitId}`,
      itemCount: links.length,
      situationComplete: field.filter(link => link.situationOccurrenceIds.length > 0).length,
      situationRequired: field.length,
      boardComplete: panel.filter(link => link.hasBoardPlacement).length,
      boardRequired: panel.length,
      openTaskCount: links.reduce((count, link) => count + link.placementTasks.length, 0),
      issueCount: dossier.issues.filter(issue => links.some(link => link.itemId === issue.itemId)).length,
    });
  }).sort((left, right) => left.label.localeCompare(right.label)));
}
