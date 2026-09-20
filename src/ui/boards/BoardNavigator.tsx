import { useState, type FormEvent } from "react";
import type { EditorStore } from "../../application/EditorStore";
import type { HierarchyViewNode, SchemaDocumentReader } from "../../application/SchemaDocumentReader";
import type { SchemaStore } from "../../application/SchemaStore";
import type { ValidationIssue } from "../../application/SchemaValidation";
import { DocumentDetailsEditor } from "../document/DocumentDetailsEditor";
import { cx, ui } from "../uiStyles";

const detailsClass = "mt-3 [&_summary]:cursor-pointer [&_summary]:font-semibold";
const boardFormClass = "mt-2.5 grid gap-2 [&_label]:grid [&_label]:gap-0.5 [&_label]:text-sm [&_input]:min-h-9 [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-neutral-300 [&_input]:px-2 [&_select]:min-h-9 [&_select]:w-full [&_select]:rounded-md [&_select]:border [&_select]:border-neutral-300 [&_select]:bg-white [&_select]:px-2";

interface BoardNavigatorProps {
  readonly schemaStore: SchemaStore;
  readonly editorStore: EditorStore;
  readonly document: SchemaDocumentReader;
  readonly activeBoardId: string;
  readonly validationIssues: readonly ValidationIssue[];
  readonly reportError: (message: string) => void;
}

export function BoardNavigator({
  schemaStore,
  editorStore,
  document,
  activeBoardId,
  validationIssues,
  reportError,
}: BoardNavigatorProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [feederCircuitId, setFeederCircuitId] = useState("");
  const [cableType, setCableType] = useState("");
  const [conductorSection, setConductorSection] = useState("");
  const [lengthMeters, setLengthMeters] = useState("");
  const boards = document.getBoards();
  const activeBoard = document.getBoard(activeBoardId);
  const circuits = document.getAllItems().filter((item) => item.role === "item" && item.type === "Kring");

  function selectBoard(boardId: string): void {
    const firstRootId = document.getBoard(boardId)?.rootItemIds[0] ?? null;
    editorStore.commands.selectBoard(boardId, firstRootId);
    if (firstRootId !== null) editorStore.commands.expandItem(firstRootId);
  }

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    try {
      const boardId = schemaStore.commands.addDistributionBoard(Number(feederCircuitId), {
        name,
        location,
        cableType,
        conductorSection,
        lengthMeters: lengthMeters === "" ? undefined : Number(lengthMeters),
      });
      const rootItemId = schemaStore.getSnapshot().document.getBoard(boardId)?.rootItemIds[0] ?? null;
      editorStore.commands.selectBoard(boardId, rootItemId);
      if (rootItemId !== null) editorStore.commands.expandItem(rootItemId);
      setName("");
      setLocation("");
      setFeederCircuitId("");
      setCableType("");
      setConductorSection("");
      setLengthMeters("");
      reportError("");
    } catch (error) {
      reportError(error instanceof Error ? error.message : "Het verdeelbord kon niet worden toegevoegd.");
    }
  }

  return (
    <section className="mb-4 rounded-xl border border-neutral-300 bg-neutral-100 p-3" aria-labelledby="board-navigator-title">
      <header className="mb-2 flex items-center justify-between gap-3">
        <div>
          <span className={ui.eyebrow}>Document</span>
          <h2 className="m-0 text-base" id="board-navigator-title">Verdeelborden</h2>
        </div>
        {validationIssues.length > 0 ? (
          <span className="text-xs text-red-700" role="status">
            {validationIssues.length} {validationIssues.length === 1 ? "probleem" : "problemen"}
          </span>
        ) : <span className="text-xs text-emerald-700">Geen structurele problemen</span>}
      </header>

      <ol className="m-0 grid list-none gap-1.5 p-0">
        {boards.map((board) => {
          const sourceBoard = board.feeder ? document.getBoard(board.feeder.sourceBoardId) : undefined;
          const sourceCircuit = board.feeder ? document.getItem(board.feeder.sourceCircuitId) : undefined;
          return (
            <li key={board.id}>
              <button
                type="button"
                className={cx(
                  "flex w-full flex-col rounded-md border border-neutral-300 bg-white px-2.5 py-2 text-left",
                  board.id === activeBoardId && "border-blue-700 bg-blue-50",
                )}
                aria-current={board.id === activeBoardId ? "page" : undefined}
                onClick={() => selectBoard(board.id)}
              >
                <span>▣ {board.name}</span>
                {board.location ? <small className="mt-0.5 text-neutral-500">{board.location}</small> : null}
                {board.feeder ? (
                  <small className="mt-0.5 text-neutral-500">Gevoed door {sourceBoard?.name ?? "Onbekend bord"} — {sourceCircuit?.summary.name ?? sourceCircuit?.label.replace(/^Kring\s*/, "") ?? `Module ${board.feeder.sourceCircuitId}`}</small>
                ) : <small className="mt-0.5 text-neutral-500">Hoofdbord</small>}
              </button>
            </li>
          );
        })}
      </ol>

      <DocumentDetailsEditor
        details={document.getDocumentDetails()}
        schemaStore={schemaStore}
        reportError={reportError}
      />

      {activeBoard ? (
        <ActiveBoardEditor
          key={[
            activeBoard.id,
            activeBoard.name,
            activeBoard.location ?? "",
            activeBoard.feeder?.sourceCircuitId ?? "",
            activeBoard.feeder?.cableType ?? "",
            activeBoard.feeder?.conductorSection ?? "",
            activeBoard.feeder?.lengthMeters ?? "",
          ].join("|")}
          boardId={activeBoard.id}
          initialName={activeBoard.name}
          initialLocation={activeBoard.location ?? ""}
          initialFeederCircuitId={activeBoard.feeder?.sourceCircuitId}
          initialCableType={activeBoard.feeder?.cableType ?? ""}
          initialConductorSection={activeBoard.feeder?.conductorSection ?? ""}
          initialLengthMeters={activeBoard.feeder?.lengthMeters}
          circuits={circuits}
          document={document}
          schemaStore={schemaStore}
          editorStore={editorStore}
          reportError={reportError}
        />
      ) : null}

      <details className={detailsClass}>
        <summary>+ Verdeelbord toevoegen</summary>
        <form className={boardFormClass} onSubmit={submit}>
          <label>Naam<input required value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label>Locatie<input value={location} onChange={(event) => setLocation(event.target.value)} /></label>
          <label>Gevoed door
            <select required value={feederCircuitId} onChange={(event) => setFeederCircuitId(event.target.value)}>
              <option value="">Kies een module</option>
              {circuits.map((circuit) => {
                const board = document.getBoardForItem(circuit.id);
                return <option key={circuit.id} value={circuit.id}>{board?.name ?? "Onbekend bord"} — {circuit.label}</option>;
              })}
            </select>
          </label>
          <label>Voedingskabel<input value={cableType} onChange={(event) => setCableType(event.target.value)} /></label>
          <label>Doorsnede<input value={conductorSection} onChange={(event) => setConductorSection(event.target.value)} /></label>
          <label>Lengte (m)<input min="0" step="any" type="number" value={lengthMeters} onChange={(event) => setLengthMeters(event.target.value)} /></label>
          <button className={ui.primaryButton} type="submit">Verdeelbord toevoegen</button>
        </form>
      </details>

      {validationIssues.length > 0 ? (
        <details className={detailsClass}>
          <summary>Validatie bekijken</summary>
          <ul className="m-0 mt-2 list-none p-0">
            {validationIssues.map((validationIssue) => (
              <li key={validationIssue.id}>
                <button className="mt-1 h-auto w-full rounded-md border border-red-200 bg-red-50 p-2 text-left text-red-700" type="button" onClick={() => {
                  if (validationIssue.boardId) selectBoard(validationIssue.boardId);
                  if (validationIssue.itemId && document.getItem(validationIssue.itemId)) {
                    editorStore.commands.selectItem(validationIssue.itemId);
                  }
                }}>{validationIssue.message}</button>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}

interface ActiveBoardEditorProps {
  readonly boardId: string;
  readonly initialName: string;
  readonly initialLocation: string;
  readonly initialFeederCircuitId?: number;
  readonly initialCableType: string;
  readonly initialConductorSection: string;
  readonly initialLengthMeters?: number;
  readonly circuits: readonly HierarchyViewNode[];
  readonly document: SchemaDocumentReader;
  readonly schemaStore: SchemaStore;
  readonly editorStore: EditorStore;
  readonly reportError: (message: string) => void;
}

function ActiveBoardEditor({
  boardId,
  initialName,
  initialLocation,
  initialFeederCircuitId,
  initialCableType,
  initialConductorSection,
  initialLengthMeters,
  circuits,
  document,
  schemaStore,
  editorStore,
  reportError,
}: ActiveBoardEditorProps) {
  const [name, setName] = useState(initialName);
  const [location, setLocation] = useState(initialLocation);
  const [sourceCircuitId, setSourceCircuitId] = useState(initialFeederCircuitId?.toString() ?? "");
  const [cableType, setCableType] = useState(initialCableType);
  const [conductorSection, setConductorSection] = useState(initialConductorSection);
  const [lengthMeters, setLengthMeters] = useState(initialLengthMeters?.toString() ?? "");
  const isMainBoard = initialFeederCircuitId === undefined;

  function save(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    try {
      schemaStore.commands.updateDistributionBoard(boardId, {
        name,
        location,
        sourceCircuitId: isMainBoard ? undefined : Number(sourceCircuitId),
        cableType,
        conductorSection,
        lengthMeters: lengthMeters === "" ? undefined : Number(lengthMeters),
      });
      reportError("");
    } catch (error) {
      reportError(error instanceof Error ? error.message : "Het verdeelbord kon niet worden bijgewerkt.");
    }
  }

  return (
    <details className={detailsClass}>
      <summary>Instellingen van {initialName}</summary>
      <form className={boardFormClass} onSubmit={save}>
        <label>Naam<input required value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label>Locatie<input value={location} onChange={(event) => setLocation(event.target.value)} /></label>
        {!isMainBoard ? (
          <>
            <label>Gevoed door
              <select required value={sourceCircuitId} onChange={(event) => setSourceCircuitId(event.target.value)}>
                {circuits.map((circuit) => {
                  const sourceBoard = document.getBoardForItem(circuit.id);
                  return <option key={circuit.id} value={circuit.id}>{sourceBoard?.name ?? "Onbekend bord"} — {circuit.label}</option>;
                })}
              </select>
            </label>
            <label>Voedingskabel<input value={cableType} onChange={(event) => setCableType(event.target.value)} /></label>
            <label>Doorsnede<input value={conductorSection} onChange={(event) => setConductorSection(event.target.value)} /></label>
            <label>Lengte (m)<input min="0" step="any" type="number" value={lengthMeters} onChange={(event) => setLengthMeters(event.target.value)} /></label>
          </>
        ) : null}
        <button className={ui.primaryButton} type="submit">Instellingen opslaan</button>
        {!isMainBoard ? (
          <button
            className={ui.dangerButton}
            type="button"
            onClick={() => {
              if (!window.confirm(`Wilt u verdeelbord '${initialName}' en alle inhoud verwijderen?`)) return;
              try {
                schemaStore.commands.deleteDistributionBoard(boardId);
                const fallback = schemaStore.getSnapshot().document.getBoards()[0];
                editorStore.commands.selectBoard(fallback.id, fallback.rootItemIds[0] ?? null);
                reportError("");
              } catch (error) {
                reportError(error instanceof Error ? error.message : "Het verdeelbord kon niet worden verwijderd.");
              }
            }}
          >Verdeelbord verwijderen</button>
        ) : null}
      </form>
    </details>
  );
}
