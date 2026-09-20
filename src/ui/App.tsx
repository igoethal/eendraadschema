import { useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import type { EditorStore } from "../application/EditorStore";
import type { SaveStatusStore } from "../application/SaveStatusStore";
import type { HistoryStatusStore } from "../application/HistoryStatusStore";
import type { SchemaStore } from "../application/SchemaStore";
import type { SituationPlanStore } from "../application/SituationPlanStore";
import type { SituationPlanAssetService } from "../application/SituationPlanAssetService";
import type { FileService } from "../application/FileService";
import type { PrintService } from "../application/PrintService";
import type { SvgExportService } from "../application/SvgExportService";
import {
  LocalWorkspaceStore,
  type WorkspaceStore,
  type WorkspaceTab,
} from "../application/WorkspaceStore";
import { HierarchyTree } from "./hierarchy/HierarchyTree";
import { StatusBar } from "./layout/StatusBar";
import { ItemPropertiesPanel } from "./properties/ItemPropertiesPanel";
import { useSchemaSnapshot } from "./useSchemaSnapshot";
import { useEditorSnapshot } from "./useEditorSnapshot";
import { WorkspaceHeader } from "./workspace/WorkspaceHeader";
import { SituationSelectionBridge } from "./workspace/SituationSelectionBridge";
import { SituationElementInspector } from "./workspace/SituationElementInspector";
import { useWorkspaceSnapshot } from "./useWorkspaceSnapshot";
import { WorkspaceCommandBar } from "./workspace/WorkspaceCommandBar";
import { BoardLayoutWorkspace } from "./boards/BoardLayoutWorkspace";
import { BoardLayoutInspector } from "./boards/BoardLayoutInspector";
import { SchematicInsertControls } from "./schematic/SchematicInsertControls";
import { SchematicSelectionBridge } from "./schematic/SchematicSelectionBridge";
import { FileDialog } from "./workspace/FileDialog";
import { PrintDialog } from "./workspace/PrintDialog";
import { createDossierSnapshot } from "../application/DossierReader";
import { McpProposalReview } from "./workspace/McpProposalReview";
import { DossierWorkspace } from "./workspace/DossierWorkspace";
import { ContextInspector } from "./workspace/ContextInspector";
import { createCircuitContext } from "../application/CircuitContext";
import { useOptionalSituationPlanSnapshot } from "./useSituationPlanSnapshot";
import { WorkspaceChromeController } from "./workspace/WorkspaceChromeController";
import { WorkspaceSidebarResizers } from "./workspace/WorkspaceSidebarResizers";
import { SituationPlacementPalette } from "./workspace/SituationPlacementPalette";
import type { WorkspaceViewAdapter } from "../application/WorkspaceViewAdapter";
import type { WorkspaceHistoryAdapter } from "../application/WorkspaceHistoryAdapter";
import type { SituationCanvasAdapter } from "../application/SituationCanvasAdapter";
import type { NoticeStore } from "../application/NoticeStore";
import type { SchematicRenderStore } from "../application/SchematicRenderStore";
import { NewDocumentDialog, type NewDocumentOptions } from "./workspace/NewDocumentDialog";
import { HelpDialog } from "./workspace/HelpDialog";
import { ApplicationMenu } from "./workspace/ApplicationMenu";
import { NoticeDialog } from "./workspace/NoticeDialog";
import { SchematicViewport } from "./schematic/SchematicViewport";

export interface EditorAppProps {
  readonly schemaStore: SchemaStore;
  readonly editorStore: EditorStore;
  readonly hierarchyMountElement: HTMLElement | null;
  readonly applicationMenuMountElement?: HTMLElement | null;
  readonly propertiesMountElement?: HTMLElement | null;
  readonly saveStatusStore?: SaveStatusStore | null;
  readonly statusBarMountElement?: HTMLElement | null;
  readonly zoomTargetElement?: HTMLElement | null;
  readonly schematicControlsMountElement?: HTMLElement | null;
  readonly schematicRenderStore?: SchematicRenderStore | null;
  readonly buildDate?: string;
  readonly situationPlanStore?: SituationPlanStore | null;
  readonly situationCanvasAdapter?: SituationCanvasAdapter | null;
  readonly workspaceStore?: WorkspaceStore;
  readonly workspaceViewAdapter?: WorkspaceViewAdapter | null;
  readonly onRevealBoardItem?: (itemId: number) => void;
  readonly situationPaperElement?: HTMLElement | null;
  readonly commandBarMountElement?: HTMLElement | null;
  readonly boardLayoutMountElement?: HTMLElement | null;
  readonly workspaceSidebarElement?: HTMLElement | null;
  readonly workspaceInspectorElement?: HTMLElement | null;
  readonly schematicWorkspaceElement?: HTMLElement | null;
  readonly situationWorkspaceElement?: HTMLElement | null;
  readonly situationHistoryStore?: HistoryStatusStore | null;
  readonly historyAdapter?: WorkspaceHistoryAdapter | null;
  readonly onSave?: () => void;
  readonly onOpenFile?: () => void;
  readonly situationPlanAssetService?: SituationPlanAssetService | null;
  readonly fileService?: FileService | null;
  readonly printService?: PrintService | null;
  readonly svgExportService?: SvgExportService | null;
  readonly onOpenDocument?: () => void;
  readonly onAppendDocument?: () => void;
  readonly onLoadExample?: (example: 0 | 1) => void;
  readonly onCreateEmptyDocument?: (options: NewDocumentOptions) => void;
  readonly noticeStore?: NoticeStore | null;
}

export function EditorApp({
  schemaStore,
  editorStore,
  hierarchyMountElement,
  applicationMenuMountElement = null,
  propertiesMountElement = null,
  saveStatusStore = null,
  statusBarMountElement = null,
  zoomTargetElement = null,
  schematicControlsMountElement = null,
  schematicRenderStore = null,
  buildDate = "",
  situationPlanStore = null,
  situationCanvasAdapter = null,
  workspaceStore = defaultWorkspaceStore,
  workspaceViewAdapter = null,
  onRevealBoardItem = () => {},
  situationPaperElement = null,
  commandBarMountElement = null,
  boardLayoutMountElement = null,
  workspaceSidebarElement = null,
  workspaceInspectorElement = null,
  schematicWorkspaceElement = null,
  situationWorkspaceElement = null,
  situationHistoryStore = null,
  historyAdapter = null,
  onSave = () => {},
  onOpenFile = () => {},
  situationPlanAssetService = null,
  fileService = null,
  printService = null,
  svgExportService = null,
  onOpenDocument = () => {},
  onAppendDocument = () => {},
  onLoadExample = () => {},
  onCreateEmptyDocument = () => {},
  noticeStore = null,
}: EditorAppProps) {
  const snapshot = useSchemaSnapshot(schemaStore);
  const editor = useEditorSnapshot(editorStore);
  const workspace = useWorkspaceSnapshot(workspaceStore);
  const situationSnapshot = useOptionalSituationPlanSnapshot(situationPlanStore);
  const itemCount = snapshot.document
    .getAllItems()
    .filter((item) => item.role === "item").length;
  const dossierIssues = situationSnapshot
    ? createDossierSnapshot(snapshot, situationSnapshot).issues
    : [];
  const selectedContext = createCircuitContext(
    snapshot,
    situationSnapshot,
    editor.selectedItemId,
  );

  useLayoutEffect(() => {
    if (workspace.isActive) workspaceViewAdapter?.prepare(workspace.activeTab);
  }, [workspace.activeTab, workspace.isActive, workspaceViewAdapter]);

  function selectWorkspaceTab(tab: WorkspaceTab) {
    workspaceStore.commands.selectTab(tab);
  }

  function revealSchemaItem(itemId: number) {
    // Commands can create and reveal an item within the same event. Read the
    // external store directly so this callback never relies on a stale render.
    const currentDocument = schemaStore.getSnapshot().document;
    const item = currentDocument.getItem(itemId);
    if (!item) return;
    const ancestors: number[] = [];
    let parentId = item.parentId;
    while (parentId !== null) {
      ancestors.push(parentId);
      parentId = currentDocument.getItem(parentId)?.parentId ?? null;
    }
    editorStore.commands.revealItem(itemId, currentDocument.getBoardForItem(itemId)?.id, ancestors);
    selectWorkspaceTab("schema");
  }

  function deleteSituationSelection() {
    const elementIds = workspaceStore.getSnapshot().selectedSituationElementIds;
    if (elementIds.length === 0) return;
    situationCanvasAdapter?.deleteSelection(elementIds);
  }

  return (
    <>
      <McpProposalReview />
      {noticeStore ? <NoticeDialog store={noticeStore} /> : null}
      <WorkspaceChromeController
        store={workspaceStore}
        schematicElement={schematicWorkspaceElement}
        boardWorkspaceElement={boardLayoutMountElement}
        sidebarElement={workspaceSidebarElement}
        inspectorElement={workspaceInspectorElement}
        situationElement={situationWorkspaceElement}
        commandBarElement={commandBarMountElement}
      />
      <WorkspaceSidebarResizers store={workspaceStore} />
      {applicationMenuMountElement
        ? createPortal(
            <ApplicationMenu
              onNew={() => {
                workspaceStore.commands.selectTab("dossier");
                workspaceStore.commands.openDialog("new");
              }}
              onFile={() => workspaceStore.commands.openDialog("file")}
              onPrint={() => workspaceStore.commands.openDialog("print")}
              onDocumentation={() => workspaceStore.commands.openDialog("documentation")}
              onAbout={() => workspaceStore.commands.openDialog("about")}
            />,
            applicationMenuMountElement,
          )
        : null}
      <WorkspaceHeader
        itemCount={itemCount}
        openIssueCount={dossierIssues.length}
        store={workspaceStore}
        onSelectTab={selectWorkspaceTab}
      />
      {hierarchyMountElement
        ? createPortal(
            workspace.activeTab === "situation" && situationSnapshot
              ? <SituationPlacementPalette
                  schema={snapshot}
                  situation={situationSnapshot}
                  editorStore={editorStore}
                  canCreateOccurrence={itemId => situationCanvasAdapter?.canCreateOccurrence(itemId) ?? false}
                  onCreateOccurrence={itemId => situationCanvasAdapter?.createOccurrence(itemId)}
                />
              : <HierarchyTree schemaStore={schemaStore} editorStore={editorStore} />,
            hierarchyMountElement,
          )
        : null}
      {propertiesMountElement
        ? createPortal(
            <ContextInspector
              context={selectedContext}
              issueCount={dossierIssues.filter(issue => issue.itemId === selectedContext?.itemId).length}
              onShowSchema={revealSchemaItem}
              onShowSituation={occurrenceId => situationCanvasAdapter?.revealOccurrence(occurrenceId)}
              onShowBoard={onRevealBoardItem}
              onCreateSituationOccurrence={itemId => situationCanvasAdapter?.createOccurrence(itemId)}
              canCreateSituationOccurrence={itemId => situationCanvasAdapter?.canCreateOccurrence(itemId) ?? false}
            >
              {workspace.activeTab === "board"
                ? <BoardLayoutInspector schemaStore={schemaStore} editorStore={editorStore} />
                : workspace.activeTab === "situation" && situationPlanStore
                ? (
                    <SituationElementInspector
                      situationPlanStore={situationPlanStore}
                      workspaceStore={workspaceStore}
                    />
                  )
                : <ItemPropertiesPanel schemaStore={schemaStore} editorStore={editorStore} />}
            </ContextInspector>,
            propertiesMountElement,
          )
        : null}
      {boardLayoutMountElement && workspace.activeTab === "dossier"
        ? createPortal(
            <DossierWorkspace
              schemaStore={schemaStore}
              editorStore={editorStore}
              situationPlanStore={situationPlanStore}
              onShowItem={revealSchemaItem}
            />,
            boardLayoutMountElement,
          )
        : null}
      {boardLayoutMountElement && workspace.activeTab === "board"
        ? createPortal(
            <BoardLayoutWorkspace schemaStore={schemaStore} editorStore={editorStore} />,
            boardLayoutMountElement,
          )
        : null}
      {statusBarMountElement && saveStatusStore
        ? createPortal(
            <StatusBar
              schemaStore={schemaStore}
              editorStore={editorStore}
              saveStatusStore={saveStatusStore}
              zoomTargetElement={zoomTargetElement}
            />,
            statusBarMountElement,
          )
        : null}
      {workspace.activeTab === "schema" && zoomTargetElement && schematicRenderStore
        ? createPortal(
            <SchematicViewport renderStore={schematicRenderStore} buildDate={buildDate} />,
            zoomTargetElement,
          )
        : null}
      {workspace.activeTab === "schema" && schematicControlsMountElement && zoomTargetElement
        ? createPortal(
            <SchematicInsertControls
              schemaStore={schemaStore}
              editorStore={editorStore}
              previewElement={zoomTargetElement}
              overlayElement={schematicControlsMountElement.parentElement ?? schematicControlsMountElement}
            />,
            schematicControlsMountElement,
          )
        : null}
      {workspace.activeTab === "schema" && zoomTargetElement ? (
        <SchematicSelectionBridge
          schemaStore={schemaStore}
          editorStore={editorStore}
          previewElement={zoomTargetElement}
        />
      ) : null}
      {commandBarMountElement
        && situationPlanStore
        && situationPlanAssetService
        && saveStatusStore
        && situationHistoryStore
        && historyAdapter
        && situationCanvasAdapter
        ? createPortal(
            <WorkspaceCommandBar
              schemaStore={schemaStore}
              editorStore={editorStore}
              situationPlanStore={situationPlanStore}
              workspaceStore={workspaceStore}
              saveStatusStore={saveStatusStore}
              situationHistoryStore={situationHistoryStore}
              historyAdapter={historyAdapter}
              onSave={onSave}
              onOpenFile={onOpenFile}
              situationAssetService={situationPlanAssetService}
              onDeleteSelection={deleteSituationSelection}
              onSelectAll={() => situationCanvasAdapter.selectAll()}
              onClearSelection={() => situationCanvasAdapter.clearSelection()}
              onSendBackward={() => situationCanvasAdapter.sendBackward()}
              onBringForward={() => situationCanvasAdapter.bringForward()}
              onZoomIn={() => situationCanvasAdapter.zoomIn()}
              onZoomOut={() => situationCanvasAdapter.zoomOut()}
              onZoomToFit={() => situationCanvasAdapter.zoomToFit()}
            />,
            commandBarMountElement,
          )
        : null}
      <SituationSelectionBridge
        paperElement={situationPaperElement}
        workspaceStore={workspaceStore}
        situationPlanStore={situationPlanStore}
        onDeleteSelection={deleteSituationSelection}
        onClearSelection={() => situationCanvasAdapter?.clearSelection()}
      />
      {workspace.activeDialog === "new" ? (
        <NewDocumentDialog
          onLoadExample={onLoadExample}
          onCreateEmpty={onCreateEmptyDocument}
          onOpen={onOpenDocument}
          onClose={() => workspaceStore.commands.closeDialog()}
        />
      ) : null}
      {workspace.activeDialog === "file" && fileService ? (
        <FileDialog
          fileService={fileService}
          schemaStore={schemaStore}
          onOpen={onOpenDocument}
          onAppend={onAppendDocument}
          onClose={() => workspaceStore.commands.closeDialog()}
        />
      ) : null}
      {workspace.activeDialog === "print" && printService && svgExportService ? (
        <PrintDialog
          printService={printService}
          svgExportService={svgExportService}
          dossierIssues={dossierIssues}
          onClose={() => workspaceStore.commands.closeDialog()}
        />
      ) : null}
      {workspace.activeDialog === "documentation" || workspace.activeDialog === "about" ? (
        <HelpDialog
          kind={workspace.activeDialog}
          onClose={() => workspaceStore.commands.closeDialog()}
        />
      ) : null}
    </>
  );
}

const defaultWorkspaceStore = new LocalWorkspaceStore();
