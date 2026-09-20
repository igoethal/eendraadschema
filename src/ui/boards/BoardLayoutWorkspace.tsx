import {
  useEffect,
  useMemo,
  useState,
  type DragEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import type { EditorStore } from "../../application/EditorStore";
import type { SchemaStore } from "../../application/SchemaStore";
import type { BoardLayoutPlacement } from "../../domain/BoardLayout";
import type { HierarchyViewNode } from "../../application/SchemaDocumentReader";
import { useEditorSnapshot } from "../useEditorSnapshot";
import { useSchemaSnapshot } from "../useSchemaSnapshot";

interface BoardLayoutWorkspaceProps {
  readonly schemaStore: SchemaStore;
  readonly editorStore: EditorStore;
}

interface BoardSlot {
  readonly railId: string;
  readonly railName: string;
  readonly startModule: number;
}

const CIRCUIT_DRAG_TYPE = "application/x-eendraadschema-circuit";
const PROTECTION_LABELS: Readonly<Record<string, string>> = {
  automatisch: "Automaat",
  differentieel: "Differentieel",
  differentieelautomaat: "Differentieelautomaat",
  smelt: "Smeltzekering",
  geen: "Geen bescherming",
  contact: "Contact",
  zekeringscheider: "Zekeringscheider",
  relais: "Relais",
  schemer: "Schemerschakelaar",
  overspanningsbeveiliging: "Overspanningsbeveiliging",
};

function protectionLabel(protection: string | undefined): string {
  return protection ? (PROTECTION_LABELS[protection] ?? protection) : "Onbekend";
}

function circuitName(item: { readonly type?: string; readonly label: string; readonly summary: { readonly name?: string } }): string {
  if (item.type === "Aansluiting") return item.summary.name ?? "Hoofddifferentieel";
  return item.summary.name ?? (item.label.replace(/^(Kring|Aansluiting)\s*/, "") || "Naamloos");
}

function groupCircuitsByProtection(
  circuits: readonly HierarchyViewNode[],
): readonly [string, readonly HierarchyViewNode[]][] {
  const groups = new Map<string, HierarchyViewNode[]>();
  for (const circuit of circuits) {
    const protection = circuit.summary.protection ?? "";
    const group = groups.get(protection) ?? [];
    group.push(circuit);
    groups.set(protection, group);
  }
  return [...groups].map(([protection, group]) => [protection, group]);
}

export function BoardLayoutWorkspace({ schemaStore, editorStore }: BoardLayoutWorkspaceProps) {
  const schema = useSchemaSnapshot(schemaStore);
  const editor = useEditorSnapshot(editorStore);
  const boards = schema.document.getBoards();
  const board = schema.document.getBoard(editor.activeBoardId) ?? boards[0];
  const layout = schema.boardLayouts.find(candidate => candidate.boardId === board?.id);
  const circuits = useMemo(() => schema.document.getAllItems().filter(item => (
    item.role === "item"
    && ["Kring", "Aansluiting"].includes(item.type)
    && schema.document.getBoardForItem(item.id)?.id === board?.id
  )), [board?.id, schema]);
  const placementsByItemId = new Map(
    (layout?.placements ?? []).map(placement => [placement.itemId, placement]),
  );
  const unplacedCircuits = circuits.filter(item => !placementsByItemId.has(item.id));
  const placedCircuits = circuits.filter(item => placementsByItemId.has(item.id));
  const [selectedCircuitId, setSelectedCircuitId] = useState<number | null>(null);
  const [widths, setWidths] = useState<Readonly<Record<number, number>>>({});
  const [moduleCapacity, setModuleCapacity] = useState("18");
  const [rowCount, setRowCount] = useState("3");
  const [pendingSlot, setPendingSlot] = useState<BoardSlot | null>(null);
  const [dialogCircuitId, setDialogCircuitId] = useState("");
  const [dialogWidth, setDialogWidth] = useState("1");
  const [draggedCircuitId, setDraggedCircuitId] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [error, setError] = useState("");
  const selectedCircuitAvailable = selectedCircuitId === null
    || unplacedCircuits.some(item => item.id === selectedCircuitId);

  useEffect(() => {
    setSelectedCircuitId(null);
    setPendingSlot(null);
    setError("");
  }, [board?.id]);

  useEffect(() => {
    setModuleCapacity(String(layout?.rails[0]?.moduleCapacity ?? 18));
    setRowCount(String(layout?.rails.length || 3));
  }, [layout?.rails.length, layout?.rails[0]?.moduleCapacity]);

  useEffect(() => {
    if (!selectedCircuitAvailable) {
      setSelectedCircuitId(null);
    }
  }, [selectedCircuitAvailable]);

  if (!board) {
    return <section className="p-6">Er is nog geen verdeelbord om in te delen.</section>;
  }

  function run(command: () => void): boolean {
    try {
      command();
      setError("");
      return true;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "De bordindeling kon niet worden aangepast.");
      return false;
    }
  }

  function selectBoard(boardId: string) {
    editorStore.commands.selectBoard(boardId);
  }

  function configureBoard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    run(() => schemaStore.commands.configureBoardLayout(board.id, {
      moduleCapacity: Number(moduleCapacity),
      rowCount: Number(rowCount),
    }));
  }

  function getCircuitWidth(itemId: number): number {
    return widths[itemId] ?? 1;
  }

  function setCircuitWidth(itemId: number, value: string) {
    const width = Number(value);
    if (!Number.isInteger(width) || width < 1) return;
    setWidths(current => ({ ...current, [itemId]: width }));
  }

  function placeCircuit(itemId: number, slot: BoardSlot, width = getCircuitWidth(itemId)) {
    const placed = run(() => schemaStore.commands.placeBoardLayoutItem(board.id, itemId, {
      railId: slot.railId,
      startModule: slot.startModule,
      moduleWidth: width,
    }));
    if (placed) {
      setSelectedCircuitId(null);
      setPendingSlot(null);
      editorStore.commands.selectItem(itemId);
    }
  }

  function clickSlot(slot: BoardSlot) {
    if (selectedCircuitId !== null) {
      placeCircuit(selectedCircuitId, slot);
      return;
    }
    if (unplacedCircuits.length === 0) return;
    setPendingSlot(slot);
    setDialogCircuitId(String(unplacedCircuits[0].id));
    setDialogWidth(String(getCircuitWidth(unplacedCircuits[0].id)));
  }

  function startDrag(event: DragEvent<HTMLButtonElement>, itemId: number) {
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData(CIRCUIT_DRAG_TYPE, String(itemId));
    setDraggedCircuitId(itemId);
  }

  function dropCircuit(event: DragEvent<HTMLButtonElement>, slot: BoardSlot) {
    event.preventDefault();
    const itemId = Number(event.dataTransfer.getData(CIRCUIT_DRAG_TYPE));
    setDraggedCircuitId(null);
    setDropTarget(null);
    if (unplacedCircuits.some(item => item.id === itemId)) placeCircuit(itemId, slot);
  }

  function submitSlotDialog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pendingSlot) return;
    placeCircuit(Number(dialogCircuitId), pendingSlot, Number(dialogWidth));
  }

  const fieldClass = "min-h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
  const railById = new Map((layout?.rails ?? []).map(rail => [rail.id, rail]));

  return (
    <section className="flex h-full min-h-0 flex-col bg-neutral-100 text-neutral-900" aria-label="Fysieke bordindeling">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 bg-white px-5 py-4">
        <div>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Bordindeling</p>
          <h1 className="mb-0 mt-1 text-xl font-semibold">Stel je verdeelbord samen</h1>
        </div>
        <label className="grid min-w-56 gap-1 text-xs font-semibold text-neutral-600">
          Verdeelbord
          <select
            className={fieldClass}
            value={board.id}
            onChange={event => selectBoard(event.target.value)}
          >
            {boards.map(candidate => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}
          </select>
        </label>
      </header>

      {error ? <p className="m-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{error}</p> : null}

      <div className="grid min-h-0 flex-1 lg:grid-cols-[19rem_minmax(0,1fr)]">
        <aside className="overflow-y-auto border-r border-neutral-200 bg-white" aria-label="Modules van het verdeelbord">
          <form className="grid grid-cols-2 gap-2 border-b border-neutral-200 p-4" onSubmit={configureBoard}>
            <div className="col-span-2">
              <p className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-500">Bordformaat</p>
              <p className="mb-1 mt-1 text-sm text-neutral-600">{board.name}{board.location ? ` · ${board.location}` : ""}</p>
            </div>
            <label className="grid gap-1 text-xs font-medium text-neutral-600">
              Modules breed
              <input className={`${fieldClass} min-w-0`} aria-label="Modules breed" type="number" min="1" max="72" value={moduleCapacity} onChange={event => setModuleCapacity(event.target.value)} />
            </label>
            <label className="grid gap-1 text-xs font-medium text-neutral-600">
              Aantal rijen
              <input className={`${fieldClass} min-w-0`} aria-label="Aantal rijen" type="number" min="1" max="12" value={rowCount} onChange={event => setRowCount(event.target.value)} />
            </label>
            <button type="submit" className="col-span-2 min-h-10 rounded-md bg-neutral-900 px-3 text-sm font-semibold text-white hover:bg-neutral-700">
              Formaat toepassen
            </button>
          </form>

          <CircuitSection title="Nog te plaatsen" count={unplacedCircuits.length}>
            {groupCircuitsByProtection(unplacedCircuits).map(([protection, groupedCircuits]) => (
              <li key={protection} className="border-b border-neutral-200">
                <h3 className="m-0 bg-neutral-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-600">{protectionLabel(protection)}</h3>
                <ul className="m-0 list-none p-0">
            {groupedCircuits.map(item => {
              const selected = selectedCircuitId === item.id;
              return (
                <li key={item.id} className="border-b border-neutral-100">
                  <div className={selected ? "bg-blue-50 p-2.5" : "p-2.5 hover:bg-neutral-50"}>
                    <button
                      type="button"
                      draggable
                      className="flex w-full cursor-grab items-center gap-2 text-left active:cursor-grabbing"
                      onClick={() => {
                        setSelectedCircuitId(item.id);
                        editorStore.commands.selectItem(item.id);
                      }}
                      onDragStart={event => startDrag(event, item.id)}
                      onDragEnd={() => {
                        setDraggedCircuitId(null);
                        setDropTarget(null);
                      }}
                    >
                      <span className="text-neutral-400" aria-hidden="true">⠿</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{circuitName(item)}</span>
                        <span className="block truncate text-xs text-neutral-500">Sleep naar het bord of selecteer en klik</span>
                      </span>
                    </button>
                    <label className="mt-2 flex items-center justify-between gap-2 text-xs text-neutral-600">
                      Modulebreedte
                      <span className="flex items-center gap-1">
                        <input
                          className="h-8 w-16 rounded border border-neutral-300 px-2 text-right"
                          aria-label={`Breedte voor ${item.label}`}
                          type="number"
                          min="1"
                          max={Number(moduleCapacity) || 72}
                          value={getCircuitWidth(item.id)}
                          onChange={event => setCircuitWidth(item.id, event.target.value)}
                        />
                        <span>M</span>
                      </span>
                    </label>
                  </div>
                </li>
              );
            })}
                </ul>
              </li>
            ))}
            {unplacedCircuits.length === 0 ? <EmptyList>Alle modules zijn geplaatst.</EmptyList> : null}
          </CircuitSection>

          <CircuitSection title="Geplaatst" count={placedCircuits.length}>
            {placedCircuits.map(item => {
              const placement = placementsByItemId.get(item.id);
              const rail = placement ? railById.get(placement.railId) : undefined;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 border-b border-neutral-100 px-3 py-2.5 text-left hover:bg-neutral-50"
                    onClick={() => editorStore.commands.selectItem(item.id)}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{circuitName(item)}</span>
                      <span className="block text-xs text-neutral-500">{rail?.name} · module {(placement?.startModule ?? 0) + 1}</span>
                    </span>
                    <span className="shrink-0 rounded bg-neutral-100 px-2 py-1 text-xs font-semibold">{placement?.moduleWidth}M</span>
                  </button>
                </li>
              );
            })}
          </CircuitSection>
        </aside>

        <main className="min-w-0 overflow-auto p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="m-0 text-lg font-semibold">{board.name}</h2>
              <p className="mb-0 mt-1 text-sm text-neutral-600">
                {selectedCircuitId === null
                  ? "Sleep een module naar een vrije positie, of klik op een lege module."
                  : `Klik op een vrije module om ${circuitName(schema.document.getItem(selectedCircuitId) ?? { label: "de module", summary: {} })} te plaatsen.`}
              </p>
            </div>
            {layout && layout.rails.length > 0 ? (
              <span className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-600">
                {layout.rails[0].moduleCapacity} modules × {layout.rails.length} rijen
              </span>
            ) : null}
          </div>

          {!layout || layout.rails.length === 0 ? (
            <div className="grid min-h-64 place-items-center rounded-xl border-2 border-dashed border-neutral-300 bg-white p-8 text-center">
              <div>
                <p className="m-0 text-base font-semibold">Geef eerst het formaat van dit bord op</p>
                <p className="mb-0 mt-1 text-sm text-neutral-500">Kies links het aantal modules en rijen en pas het formaat toe.</p>
              </div>
            </div>
          ) : (
            <div className="min-w-max overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm">
              <div className="flex h-10 items-center border-b border-neutral-300 bg-neutral-800 px-4 text-xs font-semibold uppercase tracking-wide text-white">
                DIN-verdeelbord
              </div>
              <div className="space-y-5 bg-neutral-200 p-4 sm:p-6">
                {layout.rails.map(rail => {
                  const railPlacements = layout.placements.filter(placement => placement.railId === rail.id);
                  return (
                    <article key={rail.id} aria-label={rail.name}>
                      <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-neutral-600">
                        <span>{rail.name}</span>
                        <span>{rail.moduleCapacity}M</span>
                      </div>
                      <div
                        className="grid overflow-hidden rounded-md border border-neutral-400 bg-white"
                        style={{ gridTemplateColumns: `repeat(${rail.moduleCapacity}, minmax(2.75rem, 1fr))` }}
                      >
                        {Array.from({ length: rail.moduleCapacity }, (_, index) => {
                          const slot: BoardSlot = { railId: rail.id, railName: rail.name, startModule: index };
                          const occupied = findPlacementAt(railPlacements, index);
                          const targetId = `${rail.id}:${index}`;
                          return (
                            <button
                              key={index}
                              type="button"
                              className={[
                                "h-24 border-r border-neutral-200 p-1 text-left text-[10px] text-neutral-400 outline-none",
                                occupied ? "cursor-default" : "hover:bg-blue-50 focus:bg-blue-50",
                                dropTarget === targetId ? "bg-blue-100 ring-2 ring-inset ring-blue-600" : "bg-white",
                              ].join(" ")}
                              style={{ gridColumn: index + 1, gridRow: 1 }}
                              disabled={occupied !== undefined}
                              aria-label={`Lege positie ${rail.name}, module ${index + 1}`}
                              onClick={() => clickSlot(slot)}
                              onDragOver={(event) => {
                                if (draggedCircuitId === null) return;
                                event.preventDefault();
                                event.dataTransfer.dropEffect = "copy";
                                setDropTarget(targetId);
                              }}
                              onDragLeave={() => setDropTarget(current => current === targetId ? null : current)}
                              onDrop={event => dropCircuit(event, slot)}
                            >
                              {index + 1}
                            </button>
                          );
                        })}
                        {railPlacements.map(placement => (
                          <PlacedCircuit
                            key={placement.itemId}
                            placement={placement}
                            item={schema.document.getItem(placement.itemId)}
                            selected={editor.selectedItemId === placement.itemId}
                            onSelect={() => editorStore.commands.selectItem(placement.itemId)}
                          />
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {pendingSlot ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4" onMouseDown={() => setPendingSlot(null)}>
          <form
            className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
            aria-label="Module op lege positie plaatsen"
            onSubmit={submitSlotDialog}
            onMouseDown={event => event.stopPropagation()}
          >
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-blue-700">{pendingSlot.railName} · module {pendingSlot.startModule + 1}</p>
            <h2 className="mb-4 mt-1 text-lg font-semibold">Module toevoegen</h2>
            <label className="grid gap-1 text-xs font-semibold text-neutral-600">
              Module
              <select className={fieldClass} value={dialogCircuitId} onChange={event => setDialogCircuitId(event.target.value)}>
                {groupCircuitsByProtection(unplacedCircuits).map(([protection, groupedCircuits]) => (
                  <optgroup key={protection} label={protectionLabel(protection)}>
                    {groupedCircuits.map(item => <option key={item.id} value={item.id}>{circuitName(item)}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="mt-3 grid gap-1 text-xs font-semibold text-neutral-600">
              Modulebreedte
              <input className={fieldClass} type="number" min="1" max={Number(moduleCapacity) || 72} value={dialogWidth} onChange={event => setDialogWidth(event.target.value)} />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-semibold" onClick={() => setPendingSlot(null)}>Annuleren</button>
              <button type="submit" className="rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800">Module plaatsen</button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}

function CircuitSection({ title, count, children }: { readonly title: string; readonly count: number; readonly children: ReactNode }) {
  return (
    <section>
      <header className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-2">
        <h2 className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-600">{title}</h2>
        <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-semibold text-neutral-600">{count}</span>
      </header>
      <ul className="m-0 list-none p-0">{children}</ul>
    </section>
  );
}

function EmptyList({ children }: { readonly children: ReactNode }) {
  return <li className="px-3 py-4 text-sm text-neutral-500">{children}</li>;
}

function PlacedCircuit({ placement, item, selected, onSelect }: {
  readonly placement: BoardLayoutPlacement;
  readonly item: HierarchyViewNode | undefined;
  readonly selected: boolean;
  readonly onSelect: () => void;
}) {
  const label = item ? circuitName(item) : "Naamloos";
  return (
    <button
      type="button"
      className={[
        "z-10 m-1 flex min-w-0 flex-col justify-between overflow-hidden rounded border-2 px-2 py-2 text-left shadow-sm",
        selected
          ? "border-blue-700 bg-blue-100 text-blue-950"
          : "border-neutral-500 bg-neutral-50 text-neutral-800 hover:border-blue-500",
      ].join(" ")}
      style={{ gridColumn: `${placement.startModule + 1} / span ${placement.moduleWidth}`, gridRow: 1 }}
      onClick={onSelect}
      title={`${label} · ${placement.moduleWidth} modules`}
    >
      <span className="block w-full truncate text-[10px] font-semibold uppercase tracking-wide">{item ? protectionLabel(item.summary.protection) : "Onbekend"}</span>
      <span className="block w-full truncate text-xs font-semibold">{label}</span>
      {item?.summary.text ? <span className="block w-full truncate text-[10px] text-neutral-500">{item.summary.text}</span> : null}
    </button>
  );
}

function findPlacementAt(
  placements: readonly BoardLayoutPlacement[],
  moduleIndex: number,
): BoardLayoutPlacement | undefined {
  return placements.find(placement => (
    placement.startModule <= moduleIndex
    && moduleIndex < placement.startModule + placement.moduleWidth
  ));
}
