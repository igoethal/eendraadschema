/**
 * Imperative boundary around the legacy situation-plan canvas. React owns the
 * workflow and selection state; this adapter translates commands to the canvas.
 */
export interface SituationCanvasAdapter {
  canCreateOccurrence(itemId: number): boolean;
  createOccurrence(itemId: number): void;
  revealOccurrence(occurrenceId: string): void;
  deleteSelection(elementIds: readonly string[]): void;
  selectAll(): void;
  clearSelection(): void;
  sendBackward(): void;
  bringForward(): void;
  zoomIn(): void;
  zoomOut(): void;
  zoomToFit(): void;
}

