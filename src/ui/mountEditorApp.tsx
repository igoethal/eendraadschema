import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { EditorStore } from "../application/EditorStore";
import type { SaveStatusStore } from "../application/SaveStatusStore";
import type { HistoryStatusStore } from "../application/HistoryStatusStore";
import type { SchemaStore } from "../application/SchemaStore";
import type { SituationPlanStore } from "../application/SituationPlanStore";
import type { SituationPlanAssetService } from "../application/SituationPlanAssetService";
import type { FileService } from "../application/FileService";
import type { PrintService } from "../application/PrintService";
import type { SvgExportService } from "../application/SvgExportService";
import type { WorkspaceStore } from "../application/WorkspaceStore";
import type { WorkspaceViewAdapter } from "../application/WorkspaceViewAdapter";
import type { WorkspaceHistoryAdapter } from "../application/WorkspaceHistoryAdapter";
import type { SituationCanvasAdapter } from "../application/SituationCanvasAdapter";
import type { NoticeStore } from "../application/NoticeStore";
import type { SchematicRenderStore } from "../application/SchematicRenderStore";
import { EditorApp } from "./App";
import type { NewDocumentOptions } from "./workspace/NewDocumentDialog";

export interface EditorAppMountOptions {
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

export function mountEditorApp(
  element: HTMLElement,
  schemaStore: SchemaStore,
  editorStore: EditorStore,
  hierarchyMountElement: HTMLElement | null,
  options: EditorAppMountOptions = {},
): Root {
  const root = createRoot(element);
  root.render(
    <StrictMode>
      <EditorApp
        schemaStore={schemaStore}
        editorStore={editorStore}
        hierarchyMountElement={hierarchyMountElement}
        applicationMenuMountElement={options.applicationMenuMountElement ?? null}
        propertiesMountElement={options.propertiesMountElement ?? null}
        saveStatusStore={options.saveStatusStore ?? null}
        statusBarMountElement={options.statusBarMountElement ?? null}
        zoomTargetElement={options.zoomTargetElement ?? null}
        schematicControlsMountElement={options.schematicControlsMountElement ?? null}
        schematicRenderStore={options.schematicRenderStore ?? null}
        buildDate={options.buildDate ?? ""}
        situationPlanStore={options.situationPlanStore ?? null}
        situationCanvasAdapter={options.situationCanvasAdapter ?? null}
        workspaceStore={options.workspaceStore}
        workspaceViewAdapter={options.workspaceViewAdapter}
        onRevealBoardItem={options.onRevealBoardItem}
        situationPaperElement={options.situationPaperElement ?? null}
        commandBarMountElement={options.commandBarMountElement ?? null}
        boardLayoutMountElement={options.boardLayoutMountElement ?? null}
        workspaceSidebarElement={options.workspaceSidebarElement ?? null}
        workspaceInspectorElement={options.workspaceInspectorElement ?? null}
        schematicWorkspaceElement={options.schematicWorkspaceElement ?? null}
        situationWorkspaceElement={options.situationWorkspaceElement ?? null}
        situationHistoryStore={options.situationHistoryStore ?? null}
        historyAdapter={options.historyAdapter ?? null}
        onSave={options.onSave}
        onOpenFile={options.onOpenFile}
        situationPlanAssetService={options.situationPlanAssetService ?? null}
        fileService={options.fileService ?? null}
        printService={options.printService ?? null}
        svgExportService={options.svgExportService ?? null}
        onOpenDocument={options.onOpenDocument}
        onAppendDocument={options.onAppendDocument}
        onLoadExample={options.onLoadExample}
        onCreateEmptyDocument={options.onCreateEmptyDocument}
        noticeStore={options.noticeStore ?? null}
      />
    </StrictMode>,
  );
  return root;
}
