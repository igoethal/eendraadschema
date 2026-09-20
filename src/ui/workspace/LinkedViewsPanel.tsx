import type { CircuitContext } from "../../application/CircuitContext";

export interface LinkedViewsPanelProps {
  readonly context: CircuitContext | null;
  readonly onShowSchema: (itemId: number) => void;
  readonly onShowSituation: (occurrenceId: string) => void;
  readonly onShowBoard: (itemId: number) => void;
  readonly onCreateSituationOccurrence: (itemId: number) => void;
  readonly canCreateSituationOccurrence: (itemId: number) => boolean;
}

export function LinkedViewsPanel({
  context,
  onShowSchema,
  onShowSituation,
  onShowBoard,
  onCreateSituationOccurrence,
  canCreateSituationOccurrence,
}: LinkedViewsPanelProps) {
  if (!context || context.itemId === null) {
    return <p className="text-sm text-neutral-500">Selecteer een onderdeel om de gekoppelde weergaven te openen.</p>;
  }
  const buttonClass = "rounded-md border border-neutral-300 bg-white px-2.5 py-2 text-left text-sm font-semibold text-neutral-800 hover:bg-neutral-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700/35";
  return (
    <section className="grid gap-2" aria-labelledby="linked-views-title">
      <div>
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-500">Huidige context</p>
        <h3 className="m-0 text-base" id="linked-views-title">{context.itemLabel}</h3>
        <p className="m-0 text-xs text-neutral-600">
          {context.boardName ?? "Geen verdeelbord"}{context.circuitLabel ? ` · ${context.circuitLabel}` : ""}
        </p>
      </div>
      <button type="button" className={buttonClass} onClick={() => onShowSchema(context.itemId)}>
        Eéndraadschema
      </button>
      {context.presentation === "field-device" && context.situationOccurrenceIds.length > 0 ? context.situationOccurrenceIds.map((occurrenceId, index) => (
        <button key={occurrenceId} type="button" className={buttonClass} onClick={() => onShowSituation(occurrenceId)}>
          Situatieschema · plaatsing {index + 1}
        </button>
      )) : context.presentation === "field-device" && canCreateSituationOccurrence(context.itemId) ? (
        <button type="button" className={buttonClass} onClick={() => onCreateSituationOccurrence(context.itemId)}>
          Situatieschema · symbool plaatsen
        </button>
      ) : null}
      {context.presentation === "panel-device" ? (
        <button type="button" className={buttonClass} onClick={() => onShowBoard(context.itemId)}>
          Bordindeling{context.hasBoardPlacement ? " · geplaatst" : " · plaatsen"}
        </button>
      ) : null}
      {context.presentation === "structural" ? (
        <p className="m-0 rounded-md bg-neutral-100 p-3 text-sm text-neutral-600">
          Dit is een structuurelement van het schema en heeft geen afzonderlijke plaatsing nodig.
        </p>
      ) : null}
    </section>
  );
}
