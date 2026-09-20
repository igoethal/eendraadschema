import { useEffect, useState } from "react";
import type {
  SituationPlanElementChanges,
  SituationPlanElementSnapshot,
  SituationPlanElementUpdate,
  SituationPlanStore,
} from "../../application/SituationPlanStore";
import type { WorkspaceStore } from "../../application/WorkspaceStore";
import { useSituationPlanSnapshot } from "../useSituationPlanSnapshot";
import { useWorkspaceSnapshot } from "../useWorkspaceSnapshot";

interface SituationElementInspectorProps {
  readonly situationPlanStore: SituationPlanStore;
  readonly workspaceStore: WorkspaceStore;
}

interface PlacementDraft {
  page: string;
  x: string;
  y: string;
  scalePercent: string;
  rotation: string;
  labelFontSize: string;
  addressType: "auto" | "manueel";
  address: string;
  addressLocation: "rechts" | "links" | "boven" | "onder";
  movable: boolean;
}

function createDraft(element: SituationPlanElementSnapshot): PlacementDraft {
  return {
    page: String(element.page),
    x: String(element.position.x),
    y: String(element.position.y),
    scalePercent: String(element.scale * 100),
    rotation: String(element.rotation),
    labelFontSize: String(element.labelFontSize),
    addressType: element.addressType === "manueel" ? "manueel" : "auto",
    address: element.address ?? "",
    addressLocation: element.addressLocation as PlacementDraft["addressLocation"],
    movable: element.movable,
  };
}

interface MultiPlacementInspectorProps {
  readonly elements: readonly SituationPlanElementSnapshot[];
  readonly pageCount: number;
  readonly situationPlanStore: SituationPlanStore;
}

function MultiPlacementInspector({
  elements,
  pageCount,
  situationPlanStore,
}: MultiPlacementInspectorProps) {
  const [error, setError] = useState("");
  const [scalePercent, setScalePercent] = useState("");
  const inputClass = "w-full rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm focus:border-blue-700 focus:outline-none";
  const actionClass = "rounded border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50";

  function updateAll(changesFor: (element: SituationPlanElementSnapshot) => SituationPlanElementChanges) {
    const updates: SituationPlanElementUpdate[] = elements.map(element => ({
      elementId: element.id,
      changes: changesFor(element),
    }));
    try {
      situationPlanStore.commands.updateElements(updates);
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "De plaatsingen konden niet worden aangepast.");
    }
  }

  function applyScale() {
    const value = Number(scalePercent);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Vul een positieve schaal in.");
      return;
    }
    updateAll(() => ({ scale: value / 100 }));
    setScalePercent("");
  }

  function runSelectionCommand(command: () => void) {
    try {
      command();
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "De selectie kon niet worden aangepast.");
    }
  }

  return (
    <section className="p-4" aria-label="Eigenschappen van situatiesymbolen">
      <p className="m-0 text-xs tracking-wide text-neutral-500 uppercase">Situatieschema</p>
      <h2 className="my-1 text-lg font-semibold">{elements.length} plaatsingen geselecteerd</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Gebruik Shift-klik op het canvas om symbolen aan de selectie toe te voegen of eruit te verwijderen.
      </p>
      {error ? <p className="rounded bg-red-50 p-2 text-sm text-red-800" role="alert">{error}</p> : null}

      <fieldset className="mt-4 border-0 border-t border-neutral-200 p-0 pt-4">
        <legend className="text-sm font-semibold">Verplaatsen</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <span />
          <button type="button" className={actionClass} aria-label="Selectie omhoog" onClick={() => updateAll(element => ({
            position: { x: element.position.x, y: element.position.y - 10 },
          }))}>↑</button>
          <span />
          <button type="button" className={actionClass} aria-label="Selectie naar links" onClick={() => updateAll(element => ({
            position: { x: element.position.x - 10, y: element.position.y },
          }))}>←</button>
          <button type="button" className={actionClass} aria-label="Selectie omlaag" onClick={() => updateAll(element => ({
            position: { x: element.position.x, y: element.position.y + 10 },
          }))}>↓</button>
          <button type="button" className={actionClass} aria-label="Selectie naar rechts" onClick={() => updateAll(element => ({
            position: { x: element.position.x + 10, y: element.position.y },
          }))}>→</button>
        </div>
      </fieldset>

      <fieldset className="mt-4 border-0 border-t border-neutral-200 p-0 pt-4">
        <legend className="text-sm font-semibold">Gedeelde eigenschappen</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <button type="button" className={actionClass} onClick={() => runSelectionCommand(
            () => situationPlanStore.commands.alignElements(elements.map(element => element.id), "left"),
          )}>Links</button>
          <button type="button" className={actionClass} onClick={() => runSelectionCommand(
            () => situationPlanStore.commands.alignElements(elements.map(element => element.id), "horizontal-center"),
          )}>Midden X</button>
          <button type="button" className={actionClass} onClick={() => runSelectionCommand(
            () => situationPlanStore.commands.alignElements(elements.map(element => element.id), "right"),
          )}>Rechts</button>
          <button type="button" className={actionClass} onClick={() => runSelectionCommand(
            () => situationPlanStore.commands.alignElements(elements.map(element => element.id), "top"),
          )}>Boven</button>
          <button type="button" className={actionClass} onClick={() => runSelectionCommand(
            () => situationPlanStore.commands.alignElements(elements.map(element => element.id), "vertical-center"),
          )}>Midden Y</button>
          <button type="button" className={actionClass} onClick={() => runSelectionCommand(
            () => situationPlanStore.commands.alignElements(elements.map(element => element.id), "bottom"),
          )}>Onder</button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            className={actionClass}
            disabled={elements.length < 3}
            onClick={() => runSelectionCommand(
              () => situationPlanStore.commands.distributeElements(
                elements.map(element => element.id),
                "horizontal",
              ),
            )}
          >
            Horizontaal verdelen
          </button>
          <button
            type="button"
            className={actionClass}
            disabled={elements.length < 3}
            onClick={() => runSelectionCommand(
              () => situationPlanStore.commands.distributeElements(
                elements.map(element => element.id),
                "vertical",
              ),
            )}
          >
            Verticaal verdelen
          </button>
        </div>
        <label className="mt-2 grid gap-1 text-xs font-semibold text-neutral-600">
          Pagina
          <select
            className={inputClass}
            defaultValue=""
            onChange={(event) => {
              if (event.target.value) updateAll(() => ({ page: Number(event.target.value) }));
              event.target.value = "";
            }}
          >
            <option value="">Ongewijzigd</option>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(page => (
              <option key={page} value={page}>{page}</option>
            ))}
          </select>
        </label>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button type="button" className={actionClass} onClick={() => updateAll(element => ({
            rotation: element.rotation - 90,
          }))}>−90° draaien</button>
          <button type="button" className={actionClass} onClick={() => updateAll(element => ({
            rotation: element.rotation + 90,
          }))}>+90° draaien</button>
        </div>
        <div className="mt-3 flex items-end gap-2">
          <label className="grid flex-1 gap-1 text-xs font-semibold text-neutral-600">
            Schaal (%)
            <input
              className={inputClass}
              type="number"
              min="1"
              value={scalePercent}
              placeholder="Ongewijzigd"
              onChange={event => setScalePercent(event.target.value)}
            />
          </label>
          <button type="button" className={actionClass} onClick={applyScale}>Toepassen</button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button type="button" className={actionClass} onClick={() => updateAll(() => ({ movable: false }))}>
            Vergrendelen
          </button>
          <button type="button" className={actionClass} onClick={() => updateAll(() => ({ movable: true }))}>
            Ontgrendelen
          </button>
        </div>
        <button
          type="button"
          className={`${actionClass} mt-3 w-full`}
          onClick={() => runSelectionCommand(() => {
            situationPlanStore.commands.duplicateElements(elements.map(element => element.id));
          })}
        >
          Selectie dupliceren
        </button>
      </fieldset>
    </section>
  );
}

export function SituationElementInspector({
  situationPlanStore,
  workspaceStore,
}: SituationElementInspectorProps) {
  const situation = useSituationPlanSnapshot(situationPlanStore);
  const workspace = useWorkspaceSnapshot(workspaceStore);
  const selectedElementIds = new Set(workspace.selectedSituationElementIds);
  const selectedElements = situation.elements.filter(candidate => selectedElementIds.has(candidate.id));
  const element = situation.elements.find(
    candidate => candidate.id === workspace.selectedSituationElementId,
  );
  const [draft, setDraft] = useState<PlacementDraft | null>(
    element ? createDraft(element) : null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(element ? createDraft(element) : null);
    setError("");
  }, [element]);

  if (selectedElements.length > 1) {
    return (
      <MultiPlacementInspector
        elements={selectedElements}
        pageCount={situation.pageCount}
        situationPlanStore={situationPlanStore}
      />
    );
  }

  if (!element || !draft) {
    return (
      <section className="p-4" aria-label="Eigenschappen van situatiesymbool">
        <p className="m-0 text-xs tracking-wide text-neutral-500 uppercase">Situatieschema</p>
        <h2 className="mt-1 text-lg font-semibold">Plaatsing</h2>
        <p className="text-sm text-neutral-600">
          Selecteer een symbool op het situatieschema of kies een plaatsing in de linkerzijbalk.
        </p>
      </section>
    );
  }

  function commit(changes: SituationPlanElementChanges) {
    try {
      situationPlanStore.commands.updateElement(element.id, changes);
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "De plaatsing kon niet worden aangepast.");
      setDraft(createDraft(element));
    }
  }

  function commitNumber(
    key: keyof Pick<PlacementDraft, "page" | "scalePercent" | "rotation" | "labelFontSize">,
    changes: (value: number) => SituationPlanElementChanges,
  ) {
    const value = Number(draft[key]);
    if (!Number.isFinite(value)) {
      setError("Vul een geldig getal in.");
      setDraft(createDraft(element));
      return;
    }
    commit(changes(value));
  }

  function commitPosition() {
    const x = Number(draft.x);
    const y = Number(draft.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      setError("Vul geldige coördinaten in.");
      setDraft(createDraft(element));
      return;
    }
    commit({ position: { x, y } });
  }

  const inputClass = "w-full rounded border border-neutral-300 bg-white px-2 py-1.5 text-sm focus:border-blue-700 focus:outline-none";
  const labelClass = "grid gap-1 text-xs font-semibold text-neutral-600";

  return (
    <section className="p-4" aria-label="Eigenschappen van situatiesymbool">
      <p className="m-0 text-xs tracking-wide text-neutral-500 uppercase">Situatieschema</p>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="my-1 text-lg font-semibold">Plaatsing</h2>
          <p className="m-0 text-xs text-neutral-500">{element.id}</p>
        </div>
        <div className="grid justify-items-end gap-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
            <input
              type="checkbox"
              checked={!draft.movable}
              onChange={(event) => {
                const movable = !event.target.checked;
                setDraft(current => current ? { ...current, movable } : current);
                commit({ movable });
              }}
            />
            Vergrendeld
          </label>
          <button
            type="button"
            className="rounded border border-neutral-300 px-2 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            onClick={() => {
              try {
                situationPlanStore.commands.duplicateElements([element.id]);
                setError("");
              } catch (caught) {
                setError(caught instanceof Error ? caught.message : "De plaatsing kon niet worden gedupliceerd.");
              }
            }}
          >
            Dupliceren
          </button>
        </div>
      </div>

      {error ? <p className="rounded bg-red-50 p-2 text-sm text-red-800" role="alert">{error}</p> : null}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className={labelClass}>
          Pagina
          <select
            className={inputClass}
            value={draft.page}
            onChange={(event) => {
              setDraft({ ...draft, page: event.target.value });
              commit({ page: Number(event.target.value) });
            }}
          >
            {Array.from({ length: situation.pageCount }, (_, index) => index + 1).map(page => (
              <option key={page} value={page}>{page}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Rotatie (°)
          <input
            className={inputClass}
            type="number"
            value={draft.rotation}
            onChange={(event) => setDraft({ ...draft, rotation: event.target.value })}
            onBlur={() => commitNumber("rotation", rotation => ({ rotation }))}
          />
        </label>
        <label className={labelClass}>
          X
          <input
            className={inputClass}
            type="number"
            value={draft.x}
            onChange={(event) => setDraft({ ...draft, x: event.target.value })}
            onBlur={commitPosition}
          />
        </label>
        <label className={labelClass}>
          Y
          <input
            className={inputClass}
            type="number"
            value={draft.y}
            onChange={(event) => setDraft({ ...draft, y: event.target.value })}
            onBlur={commitPosition}
          />
        </label>
        <label className={labelClass}>
          Schaal (%)
          <input
            className={inputClass}
            type="number"
            min="1"
            value={draft.scalePercent}
            onChange={(event) => setDraft({ ...draft, scalePercent: event.target.value })}
            onBlur={() => commitNumber("scalePercent", scale => ({ scale: scale / 100 }))}
          />
        </label>
        <label className={labelClass}>
          Tekengrootte
          <input
            className={inputClass}
            type="number"
            min="1"
            value={draft.labelFontSize}
            onChange={(event) => setDraft({ ...draft, labelFontSize: event.target.value })}
            onBlur={() => commitNumber("labelFontSize", labelFontSize => ({ labelFontSize }))}
          />
        </label>
      </div>

      {element.electroItemId !== null ? (
        <fieldset className="mt-4 grid gap-3 border-0 border-t border-neutral-200 p-0 pt-4">
          <legend className="text-sm font-semibold">Adreslabel</legend>
          <label className={labelClass}>
            Bron
            <select
              className={inputClass}
              value={draft.addressType}
              onChange={(event) => {
                const addressType = event.target.value as PlacementDraft["addressType"];
                setDraft({ ...draft, addressType });
                commit({ addressType });
              }}
            >
              <option value="auto">Automatisch uit schema</option>
              <option value="manueel">Handmatig</option>
            </select>
          </label>
          {draft.addressType === "manueel" ? (
            <label className={labelClass}>
              Adres
              <input
                className={inputClass}
                value={draft.address}
                onChange={(event) => setDraft({ ...draft, address: event.target.value })}
                onBlur={() => commit({ address: draft.address })}
              />
            </label>
          ) : null}
          <label className={labelClass}>
            Positie
            <select
              className={inputClass}
              value={draft.addressLocation}
              onChange={(event) => {
                const addressLocation = event.target.value as PlacementDraft["addressLocation"];
                setDraft({ ...draft, addressLocation });
                commit({ addressLocation });
              }}
            >
              <option value="rechts">Rechts</option>
              <option value="links">Links</option>
              <option value="boven">Boven</option>
              <option value="onder">Onder</option>
            </select>
          </label>
        </fieldset>
      ) : null}
    </section>
  );
}
