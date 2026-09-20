import { useMemo, useState } from "react";
import { createDossierSnapshot } from "../../application/DossierReader";
import type { EditorStore } from "../../application/EditorStore";
import type { SchemaSnapshot } from "../../application/SchemaStore";
import type { SituationPlanSnapshot } from "../../application/SituationPlanStore";

interface SituationPlacementPaletteProps {
  readonly schema: SchemaSnapshot;
  readonly situation: SituationPlanSnapshot;
  readonly editorStore: EditorStore;
  readonly canCreateOccurrence: (itemId: number) => boolean;
  readonly onCreateOccurrence: (itemId: number) => void;
}

export function SituationPlacementPalette({
  schema,
  situation,
  editorStore,
  canCreateOccurrence,
  onCreateOccurrence,
}: SituationPlacementPaletteProps) {
  const [query, setQuery] = useState("");
  const [circuitFilter, setCircuitFilter] = useState("all");
  const dossier = useMemo(() => createDossierSnapshot(schema, situation), [schema, situation]);
  const fieldItems = dossier.items.filter((item) => item.presentation === "field-device");
  const missingItems = fieldItems.filter((item) => item.situationOccurrenceIds.length === 0);
  const placedCount = fieldItems.length - missingItems.length;
  const circuits = (() => {
    const ids = new Set(missingItems.flatMap((item) => item.circuitId === null ? [] : [item.circuitId]));
    return [...ids].flatMap((circuitId) => {
      const circuit = schema.document.getItem(circuitId);
      return circuit ? [{ id: circuitId, label: circuit.label }] : [];
    }).sort((left, right) => left.label.localeCompare(right.label));
  })();
  const normalizedQuery = query.trim().toLocaleLowerCase("nl");
  const visibleMissing = missingItems.filter((item) => {
    if (circuitFilter !== "all" && String(item.circuitId) !== circuitFilter) return false;
    const node = schema.document.getItem(item.itemId);
    const circuit = item.circuitId === null ? null : schema.document.getItem(item.circuitId);
    return normalizedQuery === ""
      || `${node?.label ?? ""} ${node?.description ?? ""} ${circuit?.label ?? ""}`.toLocaleLowerCase("nl").includes(normalizedQuery);
  });

  function place(itemId: number) {
    editorStore.commands.selectItem(itemId);
    onCreateOccurrence(itemId);
  }

  return (
    <section className="grid gap-3 p-3 text-neutral-800" aria-labelledby="situation-palette-title">
      <header className="grid gap-1 border-b border-neutral-200 pb-3">
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-blue-700">Situatieschema</p>
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="m-0 text-lg" id="situation-palette-title">Nog te plaatsen</h2>
          <strong className={missingItems.length === 0 ? "text-sm text-emerald-700" : "text-sm text-amber-800"}>{missingItems.length}</strong>
        </div>
        <p className="m-0 text-xs text-neutral-600">{placedCount} van {fieldItems.length} veldsymbolen geplaatst</p>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-neutral-200" aria-hidden="true">
          <div className="h-full rounded-full bg-emerald-600" style={{ width: `${fieldItems.length === 0 ? 100 : placedCount / fieldItems.length * 100}%` }} />
        </div>
      </header>

      {missingItems.length > 0 ? <div className="grid gap-2">
        <label className="grid gap-1 text-xs font-semibold text-neutral-700">
          Zoeken
          <input className="min-h-9 rounded-md border border-neutral-300 px-2 text-sm font-normal" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Naam, adres of kring" />
        </label>
        <label className="grid gap-1 text-xs font-semibold text-neutral-700">
          Kring
          <select className="min-h-9 rounded-md border border-neutral-300 bg-white px-2 text-sm font-normal" value={circuitFilter} onChange={(event) => setCircuitFilter(event.target.value)}>
            <option value="all">Alle kringen ({missingItems.length})</option>
            {circuits.map((circuit) => <option key={circuit.id} value={circuit.id}>{circuit.label}</option>)}
          </select>
        </label>
      </div> : null}

      {missingItems.length === 0 ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          <strong>Alles geplaatst.</strong><br />Elk veldonderdeel uit het eendraadschema staat op het situatieschema.
        </div>
      ) : visibleMissing.length === 0 ? (
        <p className="rounded-md bg-neutral-100 p-3 text-sm text-neutral-600">Geen onderdelen gevonden met deze filters.</p>
      ) : (
        <ul className="m-0 grid list-none gap-1.5 p-0">
          {visibleMissing.map((item) => {
            const node = schema.document.getItem(item.itemId);
            const circuit = item.circuitId === null ? null : schema.document.getItem(item.circuitId);
            const canCreate = canCreateOccurrence(item.itemId);
            return <li key={item.itemId} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-neutral-200 bg-white p-2 shadow-sm">
              <button type="button" className="min-w-0 text-left" onClick={() => editorStore.commands.selectItem(item.itemId)}>
                <span className="block truncate text-sm font-semibold">{node?.label ?? `Onderdeel ${item.itemId}`}</span>
                <span className="block truncate text-xs text-neutral-500">{circuit?.label ?? "Zonder kring"}{node?.description ? ` · ${node.description}` : ""}</span>
              </button>
              <button type="button" className="rounded-md bg-blue-700 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 disabled:bg-neutral-300" disabled={!canCreate} onClick={() => place(item.itemId)}>
                Plaats
              </button>
            </li>;
          })}
        </ul>
      )}
    </section>
  );
}
