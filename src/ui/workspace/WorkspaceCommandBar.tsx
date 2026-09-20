import { useRef, useState, useSyncExternalStore, type ChangeEvent } from "react";
import type { EditorStore } from "../../application/EditorStore";
import type {
  HistoryStatusSnapshot,
  HistoryStatusStore,
} from "../../application/HistoryStatusStore";
import type {
  SaveStatusSnapshot,
  SaveStatusStore,
} from "../../application/SaveStatusStore";
import type { SchemaStore } from "../../application/SchemaStore";
import type { SituationPlanStore } from "../../application/SituationPlanStore";
import type {
  AddSituationSymbolOptions,
  SituationPlanAssetService,
} from "../../application/SituationPlanAssetService";
import type { WorkspaceStore } from "../../application/WorkspaceStore";
import { useSchemaSnapshot } from "../useSchemaSnapshot";
import { useSituationPlanSnapshot } from "../useSituationPlanSnapshot";
import { useWorkspaceSnapshot } from "../useWorkspaceSnapshot";
import { CustomSituationSymbolDialog } from "./CustomSituationSymbolDialog";
import type { WorkspaceHistoryAdapter } from "../../application/WorkspaceHistoryAdapter";

interface WorkspaceCommandBarProps {
  readonly schemaStore: SchemaStore;
  readonly editorStore: EditorStore;
  readonly situationPlanStore: SituationPlanStore;
  readonly workspaceStore: WorkspaceStore;
  readonly saveStatusStore: SaveStatusStore;
  readonly situationHistoryStore: HistoryStatusStore;
  readonly historyAdapter: WorkspaceHistoryAdapter;
  readonly onSave: () => void;
  readonly onOpenFile: () => void;
  readonly situationAssetService: SituationPlanAssetService;
  readonly onDeleteSelection: () => void;
  readonly onSelectAll: () => void;
  readonly onClearSelection: () => void;
  readonly onSendBackward: () => void;
  readonly onBringForward: () => void;
  readonly onZoomIn: () => void;
  readonly onZoomOut: () => void;
  readonly onZoomToFit: () => void;
}

export function WorkspaceCommandBar({
  schemaStore,
  editorStore,
  situationPlanStore,
  workspaceStore,
  saveStatusStore,
  situationHistoryStore,
  historyAdapter,
  onSave,
  onOpenFile,
  situationAssetService,
  onDeleteSelection,
  onSelectAll,
  onClearSelection,
  onSendBackward,
  onBringForward,
  onZoomIn,
  onZoomOut,
  onZoomToFit,
}: WorkspaceCommandBarProps) {
  const backgroundInput = useRef<HTMLInputElement>(null);
  const [showCustomSymbolDialog, setShowCustomSymbolDialog] = useState(false);
  const [assetMessage, setAssetMessage] = useState("");
  const [assetError, setAssetError] = useState("");
  const [importingBackground, setImportingBackground] = useState(false);
  const schema = useSchemaSnapshot(schemaStore);
  const situation = useSituationPlanSnapshot(situationPlanStore);
  const workspace = useWorkspaceSnapshot(workspaceStore);
  const save = useSyncExternalStore<SaveStatusSnapshot>(
    listener => saveStatusStore.subscribe(listener),
    () => saveStatusStore.getSnapshot(),
    () => saveStatusStore.getSnapshot(),
  );
  const situationHistory = useSyncExternalStore<HistoryStatusSnapshot>(
    listener => situationHistoryStore.subscribe(listener),
    () => situationHistoryStore.getSnapshot(),
    () => situationHistoryStore.getSnapshot(),
  );
  const inSituation = workspace.activeTab === "situation";
  const canUndo = inSituation ? situationHistory.canUndo : schema.canUndo;
  const canRedo = inSituation ? situationHistory.canRedo : schema.canRedo;
  const hasSituationSelection = workspace.selectedSituationElementIds.length > 0;

  function undo() {
    historyAdapter.undo(inSituation ? "situation" : "schema");
  }

  function redo() {
    historyAdapter.redo(inSituation ? "situation" : "schema");
  }

  function selectPage(page: number) {
    if (page === situation.activePage) return;
    situationPlanStore.commands.selectPage(page);
    workspaceStore.commands.selectSituationElement(null);
  }

  function addPage() {
    situationPlanStore.commands.addPage();
  }

  function deletePage() {
    if (
      situation.pageCount <= 1
      || !window.confirm(`Pagina ${situation.activePage} volledig verwijderen?`)
    ) return;
    situationPlanStore.commands.deletePage(situation.activePage);
    workspaceStore.commands.selectSituationElement(null);
  }

  async function importBackground(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setImportingBackground(true);
    setAssetError("");
    setAssetMessage("");
    try {
      const result = await situationAssetService.importBackground(file);
      workspaceStore.commands.selectSituationElement(result.elementId);
      setAssetMessage(result.largeFile
        ? "De plattegrond is toegevoegd. Het grote bestand kan opslaan en afdrukken vertragen."
        : result.scaledToFit
          ? "De plattegrond is toegevoegd en passend verkleind."
          : "De plattegrond is toegevoegd.");
    } catch (error) {
      setAssetError(error instanceof Error ? error.message : "De plattegrond kon niet worden toegevoegd.");
    } finally {
      setImportingBackground(false);
    }
  }

  function addCustomSymbol(options: AddSituationSymbolOptions) {
    setAssetError("");
    setAssetMessage("");
    try {
      const result = situationAssetService.addSituationOnlySymbol(options);
      editorStore.commands.selectItem(result.itemId);
      workspaceStore.commands.selectSituationElement(result.elementId);
      setShowCustomSymbolDialog(false);
      setAssetMessage("Het losse symbool is toegevoegd.");
    } catch (error) {
      setAssetError(error instanceof Error ? error.message : "Het symbool kon niet worden toegevoegd.");
    }
  }

  const buttonClass = [
    "flex min-w-16 flex-col items-center justify-center gap-0.5 rounded px-2 py-1 text-xs font-semibold",
    "text-neutral-700 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40",
    "focus-visible:outline-2 focus-visible:outline-blue-700",
  ].join(" ");
  const separatorClass = "mx-1 h-9 w-px self-center bg-neutral-300";

  return (
    <div className="flex h-full min-w-max items-stretch justify-between border-b border-neutral-300 bg-neutral-50 px-2" role="toolbar" aria-label="Werkruimtecommando's">
      <div className="flex items-stretch whitespace-nowrap">
        <button type="button" className={buttonClass} disabled={!canUndo} onClick={undo}>
          <span className="text-xl leading-none" aria-hidden="true">↶</span>
          Ongedaan
        </button>
        <button type="button" className={buttonClass} disabled={!canRedo} onClick={redo}>
          <span className="text-xl leading-none" aria-hidden="true">↷</span>
          Opnieuw
        </button>
        <span className={separatorClass} />
        <button
          type="button"
          className={`${buttonClass} ${save.hasUnsavedChanges ? "text-red-800" : "text-emerald-800"}`}
          onClick={save.hasUnsavedChanges ? onSave : onOpenFile}
        >
          <span className="text-xl leading-none" aria-hidden="true">💾</span>
          {save.hasUnsavedChanges ? "Opslaan" : "Bestand"}
        </button>

        {inSituation ? (
          <>
            <span className={separatorClass} />
            <input
              ref={backgroundInput}
              className="sr-only"
              type="file"
              accept="image/*"
              aria-label="Kies een plattegrondbestand"
              onChange={importBackground}
            />
            <button
              type="button"
              className={buttonClass}
              disabled={importingBackground}
              onClick={() => backgroundInput.current?.click()}
            >
              <span className="text-xl leading-none" aria-hidden="true">🖼</span>
              {importingBackground ? "Laden…" : "Plattegrond"}
            </button>
            <button
              type="button"
              className={buttonClass}
              onClick={() => {
                setAssetError("");
                setShowCustomSymbolDialog(true);
              }}
            >
              <span className="text-xl leading-none" aria-hidden="true">＋</span>
              Los symbool
            </button>
            <button
              type="button"
              className={buttonClass}
              onClick={onSelectAll}
              aria-label="Alle symbolen op pagina selecteren"
            >
              <span className="text-xl leading-none" aria-hidden="true">▣</span>
              Alles
            </button>
            <button
              type="button"
              className={buttonClass}
              disabled={!hasSituationSelection}
              onClick={onClearSelection}
              aria-label="Selectie wissen"
            >
              <span className="text-xl leading-none" aria-hidden="true">□</span>
              Wis
            </button>
            <button
              type="button"
              className={buttonClass}
              disabled={!hasSituationSelection}
              onClick={onDeleteSelection}
            >
              <span className="text-xl leading-none" aria-hidden="true">🗑</span>
              Verwijder
            </button>
            <button
              type="button"
              className={buttonClass}
              disabled={!hasSituationSelection}
              onClick={onSendBackward}
            >
              <span className="text-xl leading-none" aria-hidden="true">↓↓</span>
              Naar achter
            </button>
            <button
              type="button"
              className={buttonClass}
              disabled={!hasSituationSelection}
              onClick={onBringForward}
            >
              <span className="text-xl leading-none" aria-hidden="true">↑↑</span>
              Naar voor
            </button>
          </>
        ) : null}
        {inSituation && hasSituationSelection ? (
          <span className="self-center rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800" role="status">
            {workspace.selectedSituationElementIds.length} geselecteerd
          </span>
        ) : null}
      </div>

      {inSituation ? (
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs font-semibold text-neutral-600">
            Pagina
            <select
              className="rounded border border-neutral-300 bg-white px-2 py-1"
              value={situation.activePage}
              onChange={(event) => selectPage(Number(event.target.value))}
            >
              {Array.from({ length: situation.pageCount }, (_, index) => index + 1).map(page => (
                <option key={page} value={page}>{page}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className={buttonClass}
            disabled={situation.activePage !== situation.pageCount}
            onClick={addPage}
          >
            <span className="text-xl leading-none" aria-hidden="true">＋</span>
            Pagina
          </button>
          <button
            type="button"
            className={buttonClass}
            disabled={situation.pageCount <= 1}
            onClick={deletePage}
            aria-label={`Pagina ${situation.activePage} verwijderen`}
          >
            <span className="text-xl leading-none" aria-hidden="true">♻</span>
            Pagina
          </button>
          <span className={separatorClass} />
          <button type="button" className={buttonClass} onClick={onZoomOut} aria-label="Situatieschema uitzoomen">
            <span className="text-xl leading-none" aria-hidden="true">−</span>
            Uit
          </button>
          <button type="button" className={buttonClass} onClick={onZoomToFit}>
            <span className="text-xl leading-none" aria-hidden="true">▣</span>
            Passend
          </button>
          <button type="button" className={buttonClass} onClick={onZoomIn} aria-label="Situatieschema inzoomen">
            <span className="text-xl leading-none" aria-hidden="true">＋</span>
            In
          </button>
        </div>
      ) : null}
      {assetMessage ? (
        <p className="sr-only" role="status">{assetMessage}</p>
      ) : null}
      {assetError ? (
        <p className="sr-only" role="alert">{assetError}</p>
      ) : null}
      {showCustomSymbolDialog ? (
        <CustomSituationSymbolDialog
          defaultScale={situation.defaults.scale}
          errorMessage={assetError}
          onCancel={() => setShowCustomSymbolDialog(false)}
          onSubmit={addCustomSymbol}
        />
      ) : null}
    </div>
  );
}
