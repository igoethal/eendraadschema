import { Hierarchical_List } from "./Hierarchical_List";
import {
    configureLegacyDocumentLifecycle,
    createFileService,
    download_by_blob,
    importDocumentFile,
    appendDocumentFile,
    openDocumentPicker,
    openAppendDocumentPicker,
} from "./importExport/importExport";
import { EDStoStructure } from "./importExport/importExport";
import { AutoSaver } from "./importExport/AutoSaver";
import {
    prepareSituationPlanPage,
    type SituationPlanSelection,
} from "./sitplan/SituationPlanView";
import type { WorkspaceViewAdapter } from "./application/WorkspaceViewAdapter";
import type { WorkspaceHistoryAdapter, WorkspaceHistoryScope } from "./application/WorkspaceHistoryAdapter";
import { LegacySituationCanvasAdapter } from "./legacy/LegacySituationCanvasAdapter";
import { LegacySvgExportService } from "./application/SvgExportService";
import { LocalDocumentHost } from "./application/DocumentHost";
import { LegacyPrintService } from "./application/PrintService";
import { CookieBanner } from "../prop/CookieBanner";
import { Bord } from "./List_Item/Bord";
import { Kring } from "./List_Item/Kring";
import { MultiLevelStorage } from "./storage/MultiLevelStorage";
import { undoRedo } from "./undoRedo";
import { importExportUsingFileAPI } from "./importExport/importExport";
import { LocalEditorStore } from "./application/EditorStore";
import { LegacySchemaStore } from "./application/LegacySchemaStore";
import { LegacySaveStatusStore } from "./application/SaveStatusStore";
import { LegacySituationPlanStore } from "./application/LegacySituationPlanStore";
import { LocalWorkspaceStore } from "./application/WorkspaceStore";
import { LegacyHistoryStatusStore } from "./application/HistoryStatusStore";
import { LegacySituationPlanAssetService } from "./application/LegacySituationPlanAssetService";
import { mountEditorApp } from "./ui/mountEditorApp";
import { BrowserMcpBridge } from "./mcp/BrowserMcpBridge";
import { decodeEds, structureFromJson } from "./legacy/persistence/EdsCodec";
import type { NewDocumentOptions } from "./ui/workspace/NewDocumentDialog";
import { LocalNoticeStore } from "./application/NoticeStore";
import { LegacySchematicRenderStore } from "./application/SchematicRenderStore";

import "../css/all.css";

declare const BUILD_DATE: string;
console.log(BUILD_DATE);

// Application composition state

const appDocStorage = new MultiLevelStorage<any>('appDocStorage', {});
const noticeStore = new LocalNoticeStore(appDocStorage);
let documentHost: LocalDocumentHost | null = null;
let autoSaver: AutoSaver | null = null;
let currentDocument = new Hierarchical_List();

function getCurrentDocument(): Hierarchical_List {
    return documentHost?.get() ?? currentDocument;
}

const legacyHistory = new undoRedo(
    100,
    getCurrentDocument,
    (text, version) => replaceCurrentDocument(structureFromJson(
        text,
        getCurrentDocument(),
        version,
    )),
    {
        showSituationPlan() {
            prepareDocumentView("draw");
            workspaceStore?.commands.selectTab("situation");
            prepareSituationPlanPage(
                documentHost!.get(),
                situationPlanStore!,
                noticeStore,
                synchronizeSituationSelection,
            );
        },
        showSchema() {
            prepareDocumentView("2col");
            workspaceStore?.commands.selectTab("schema");
            redrawTree();
        },
    },
);
const legacyFileApi = new importExportUsingFileAPI(
    getCurrentDocument,
);

let schemaStore: LegacySchemaStore | null = null;
let situationPlanStore: LegacySituationPlanStore | null = null;
let editorStore: LocalEditorStore | null = null;
let workspaceStore: LocalWorkspaceStore | null = null;
let situationHistoryStore: LegacyHistoryStatusStore | null = null;
let workspaceHistoryAdapter: WorkspaceHistoryAdapter | null = null;
let schematicRenderStore: LegacySchematicRenderStore | null = null;

function replaceCurrentDocument(replacement: Hierarchical_List): Hierarchical_List {
    currentDocument = replacement;
    documentHost?.replace(replacement);
    schemaStore?.synchronizeLegacyDocument(replacement);
    situationPlanStore?.synchronizeLegacyDocument(replacement);
    return replacement;
}

function synchronizeSchemaStoreWithLegacyDocument(): void {
    replaceCurrentDocument(getCurrentDocument());
    if (schemaStore !== null && editorStore !== null) {
        editorStore.commands.reconcileItemIds(new Set(
            schemaStore.getSnapshot().document.getAllItems().map((item) => item.id),
        ));
    }
}

function restoreSituationCanvasSelection(document: Hierarchical_List): void {
    const selectedIds = workspaceStore?.getSnapshot().selectedSituationElementIds ?? [];
    const view = document.sitplanview;
    for (const elementId of selectedIds) {
        const element = document.sitplan.getElements()
            .find(candidate => candidate.id === elementId);
        view?.selectBox(element?.boxref ?? null);
    }
}

function synchronizeSituationSelection(selection: SituationPlanSelection): void {
    legacyHistory.updateSelectedBoxes();
    workspaceStore?.commands.selectSituationElements(
        selection.elementIds,
        selection.primaryElementId,
    );
    if (selection.primaryElementId === null) return;
    const element = situationPlanStore?.getSnapshot().elements
        .find(candidate => candidate.id === selection.primaryElementId);
    if (element?.electroItemId !== null && element?.electroItemId !== undefined) {
        editorStore?.commands.selectItem(element.electroItemId);
    }
}

// Global constants

const EXAMPLE0 = `EDS0040000eJztWW1v2zYQ/iuCvk4L9JZkNoZhSQZ0Q7ehQIZsQFEItHS2GVGkQVF2XpD99t2RsiWjrptqcbYUAYJAOpLH4/M8vKOpez9vtAZprjis/LHvB74AOTNzfxyNAr9ghvnj9/c+L9AQ+AtGff1xGPhcFuvHXAnBFjVgnykTNWA/rRa1P773pUanP/HpFB2zxij7XjHZAIjW9FZzOfudsWqrxdwuAA1nTNai4Qa7UHcmDRPZQmGM2BijaQJ1PgddUYexX+BMQCHy1n+1AM1m5CkNW69ZySYgMskyA0IABRTfRCfYujU6K0AYlvU8JCG5YIWG2iFlvW1PiRFjA2K6hIwWVzFmXOdt57zOahCQ49t0g1qptLGrXeKC1MyuMcGh0oGzHf9SKd2tANvmDa/nqsGw+XXpj41u0OWU1RS6/xD4tWp0jo01BiQbIR4CR2vc0Rp1tEafp3UgpedKF/iGCMyAMXxuQ+1WuYF4T9SkznXYcRd2fLCwbePTahAtf12de8mbODh+jPxoMJR1KygnA6FyhgPQVBsmCwvoFyrTOUI+uMwmKKINbv9CsnvF2JsS0VzBHZ9tHLYqsCljn2jDnmpHHf/JM8p2O+JH6va0J9vwU7p1cA0Jm94HaNYJwnC0bSs23qnYiwv2eNX2ZfsWmhJD+Fi8v0hvhfL9lHR3Kfdip3QddM+q3K30dbaP/KTH/ukXiTbq09+S/FnJXiikPTeFUvWuhIuGkkJAXLnoFuLEsp6zq3atiAgKwrvgILMKQKOBBm/lnznA1GCnGUxUsyogQ2GxEgQ2bxaI08+ZmK6YAV3wfG76LT3HrdG5RDR3zL0eJzMks0AMJmqzQffQkcZD6Yhf6TgAHUlHR9qr6enBcvqV5tfgueTUJak/CYJSlXiwCvwldclsU9aOulPEkleywvaYK83viFoBGaYTTBvSJdUco9fg+li0elkWsgk2FYb8zZEoMlOm7qwnoRPJEraYwDRY99PYY2pOGg3VefKq8wPoPBxKR/pKx9PTkYyG0nH8SsfT03Hysg7I9uLgEwfk6MsPyFegBcHuwvpqT8nne3/a9yRwcvhT8q+Ed851jqvspNDtjbp1bCHvbxm/aCa4TBSNLd29Xem2Be4CyXB5RJ5Axq/hEdvMDUW0S8FLPIJ8PBDPFOWOndvGbdWzaKSxVEV7cT4divOg4+9jcI534gyyfMEwJ/FQmAedvobL+WXDHEe7C0f6AgvHgJuVc1aUrLI/Nr7aqnGxl//eNot7F9nHr5cr/8k5Lk4H8/F6u3IIPkaD+XjmOrT7WHW54DCzE/zP69EH7I3pcIlu31uRHewfzkTMvo+COIhGAVa90yA5DdI4SJMgjYI0DPDH7UmAB2o86+E5BHnHNIk7Mx59IJK5NJlhEwFE9Rz4jKA6PsFMWrGbFS/oM3D6XUo5v14IdruwlQeLK0gadYYacKa2rOJzbT8Xb/nCvaLdh+Ia+1uPBBL1rphGFmqHHM6qCkByDM/tnmRCAG1m6+B24+G29btgWAtrfme/E6fEBcmWhoPV7pRjUcaaSEebGyRaQBiGR1CQS7WS9rvplVKaqot3hsSCffx+on+4NBoLoRfSMw4KPQwVcLsAGf4AMfa+SWIP7es/sr+5/G1t326AbyvGccyyneyIbSb7sVAVcHk0AUpaElfaftDlBVRUmTGraUVgkCPbZ6ooRXo3XpyEV97fx6H3852r4d13fAengBnLby/7W85lBOpsb6KOHeaEUGG3ac0NEi3XHtrX61pJmw2a6p3jOFqL/J3lH18LmLJGGIc8Ru2IibClRjZJNkf4e0Mrw+h6M8Qg8NhQYcSkmA8Pm7mWmwU8/ANHMC6N`;
const EXAMPLE1 = `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`;
const EXAMPLE_DEFAULT = `EDS0040000eJytVN9v00AM/leieyWM/GgniBCivICE4GVoL9MUuTk3PfVyF91dunbT+NuxkzZZAQ0VqKLq4rM/f/7s+EFoNHVYi2IWCwkBRHHzIJQURRqLFhyaIIokFsrI47GyWkPrkXxWoD2Sn7OtF8WDME4UQsQi7Fuk0wKM150KytRkBDABdNlayiiKLBZL9NUaXcPXhZBqtULOpxA1uzctOqgJ53I+IJYbWKIuDZQBtUbOle3SS/I9iS0l6gDlFJ8nxBqkQz+xK0/T9faqc1ssoQu2AQiD7RRZ+dKjxoreVmP1G+tCX+aWarE1F8eRBqB5km/gvrXWTezFYyy87VyFWnlKaDqtH+NB/mySP53kT8+R/4N1kt6IdI0AdC6C6/Aps1GUZ4jkE5FsIpKdQ+Sz+68T8LvO/NpzisCNP7RxUF/bCsidTF9fLc4chAGBtFSmXHbKj0X//YSMkKTLHd6regw4duiZtsymtuRTW/J/m4+f0v9hQG7pngrdEtZNP1mnf3TNRG/SOIvzeHbLRJQJZYClRqaDhk8LkrntezZM5xpVveZRv3wTiwZ2d0ryekpfp6y1bzXsB/eEFaiZHm2skygfwA27yhN2H8tk2bsBt0HnhwoI30qkpgRVAfce6MP04gCwHxH2B9wWaLy8uu9324w1YWk5HHt9V4oGGxq+RjTSAUie7wYuUDKsvTP9d39NW4A1jhbVOmB/fLt0764CRYQo4XNCv4joEk5ANnxDXUQv8iwi+/Fh+8erL0f76QW+bEBRzPaQ7ALGZO+lbVCZiyVy+w1Ve1hISmLD829NcJYFYaDeZ2V520a7KMuT6+j7PIk+3bMA9Klwk+eDlFy4VEE8/gDGURmI`;


function redrawTreeSVG(): void {
    synchronizeSchemaStoreWithLegacyDocument();
    schematicRenderStore?.refresh();
}

function redrawTree(): void {
    redrawTreeSVG();
}

function buildNewStructure(structure: Hierarchical_List, options: NewDocumentOptions) {

    // Eerst het hoofddifferentieel maken
    let itemCounter:number = 0;
    structure.addItem("Aansluiting");
    structure.data[0].props.type  = "Aansluiting";
    structure.data[0].props.naam = "";
    structure.data[0].props.bescherming  = "differentieel";
    structure.data[0].props.aantal_polen  = options.phaseCount;
    structure.data[0].props.amperage  = options.mainBreakerAmperage;
    structure.data[0].props.type_kabel_na_teller  = options.phaseCount+"x16";
    structure.data[0].props.differentieel_delta_amperage = options.mainDifferentialMilliamps;
    itemCounter++;

    // Dan het hoofdbord maken
    structure.insertChildAfterId(new Bord(structure),itemCounter);
    structure.data[itemCounter].props.type = "Bord";
    itemCounter++;

    // Nat bord voorzien
    structure.insertChildAfterId(new Kring(structure),itemCounter);
    structure.data[itemCounter].props.type  = "Kring";
    structure.data[itemCounter].props.autoKringNaam  = "manueel";
    structure.data[itemCounter].props.bescherming  = "differentieel";
    structure.data[itemCounter].props.aantal_polen  = options.phaseCount;
    structure.data[itemCounter].props.amperage  = options.mainBreakerAmperage;
    structure.data[itemCounter].props.kabel_is_aanwezig = false;
    structure.data[itemCounter].props.differentieel_delta_amperage = 30;
    itemCounter++;
    structure.insertChildAfterId(new Bord(structure),itemCounter);
    structure.data[itemCounter].props.type = "Bord";
    structure.data[itemCounter].props.is_geaard = false; // Geaard
    itemCounter++;

    // Pas info aan
    switch (options.phaseCount) {
        case 2: structure.properties.info = '2 x 230V ~50 Hz'; break;
        case 3: structure.properties.info = '3 x 230V ~50 Hz'; break;
        case 4: structure.properties.info = '3 x 400V + N ~50 Hz';
    }
}

function createEmptyDocument(options: NewDocumentOptions): void {
    const document = getCurrentDocument();
    document.dispose();
    const replacement = new Hierarchical_List();
    buildNewStructure(replacement, options);
    replacement.properties.dossier = {
        ...replacement.properties.dossier,
        installationContext: "new",
    };
    replaceCurrentDocument(replacement);
    legacyFileApi.clear();
    prepareDocumentView('2col');
    workspaceStore?.commands.selectTab("dossier");
    redrawTree();
    legacyHistory.clear();
    legacyHistory.store();
}

function openNewDocumentDialog(): void {
    prepareDocumentView("2col");
    workspaceStore?.commands.selectTab("dossier");
    workspaceStore?.commands.openDialog("new");
}

function prepareDocumentView(type: '2col' | 'draw'): void {
    const schemaDocument = getCurrentDocument();
    const lastview = schemaDocument.properties.currentView;
    schemaDocument.properties.currentView = type;

    if ( (['2col','draw'].includes(type)) && (['2col','draw'].includes(lastview)) && (type !== lastview) )
        legacyHistory.store();
}

function loadExample(nr: 0 | 1): void {
    switch (nr) {
        case 0:
            EDStoStructure(EXAMPLE0);
            legacyFileApi.clear();
            break;
        case 1:
            EDStoStructure(EXAMPLE1);
            legacyFileApi.clear();
            break;
    }
}

//--- MAIN PROGRAM ---

document.getElementById("importfile")?.addEventListener("change", importDocumentFile);
document.getElementById("appendfile")?.addEventListener("change", appendDocumentFile);

const initialPayload = decodeEds(EXAMPLE_DEFAULT);
currentDocument = structureFromJson(initialPayload.text, currentDocument, initialPayload.version);
documentHost = new LocalDocumentHost(currentDocument);
schemaStore = new LegacySchemaStore(currentDocument);
situationPlanStore = new LegacySituationPlanStore(currentDocument, {
    record(historyKey) {
        legacyHistory.store(historyKey);
        situationHistoryStore?.refresh();
    },
    undo() {
        legacyHistory.undo();
        return documentHost.get();
    },
    redo() {
        legacyHistory.redo();
        return documentHost.get();
    },
});
schematicRenderStore = new LegacySchematicRenderStore(() => documentHost!.get());
configureLegacyDocumentLifecycle({
    getDocument: () => documentHost!.get(),
    replaceDocument: replaceCurrentDocument,
    redrawDocument() {
        prepareDocumentView("2col");
        workspaceStore?.commands.selectTab("schema");
        redrawTree();
    },
    resetHistory: () => legacyHistory.clear(),
    recordHistory: () => legacyHistory.store(),
    resetAutosave: () => autoSaver?.reset(),
    markDocumentLoaded: (askUserToSave) => {
        if (askUserToSave) autoSaver?.forceHasChangesSinceLastManualSave();
        else autoSaver?.saveManually();
    },
});
editorStore = new LocalEditorStore();
workspaceStore = new LocalWorkspaceStore();
const workspaceViewAdapter: WorkspaceViewAdapter = {
    prepare(tab) {
        if (tab === "schema") {
            prepareDocumentView("2col");
            redrawTree();
        } else if (tab === "situation") {
            prepareDocumentView("draw");
            prepareSituationPlanPage(
                documentHost.get(),
                situationPlanStore,
                noticeStore,
                synchronizeSituationSelection,
            );
            restoreSituationCanvasSelection(documentHost.get());
        } else {
            prepareDocumentView("2col");
        }
    },
};
const situationCanvasAdapter = new LegacySituationCanvasAdapter(
    schemaStore,
    situationPlanStore,
    editorStore,
    workspaceStore,
    workspaceViewAdapter,
    () => documentHost.get(),
);
const svgExportService = new LegacySvgExportService(download_by_blob);
const printService = new LegacyPrintService(() => documentHost.get());
const fileService = createFileService(
    () => documentHost.get(),
    () => legacyFileApi,
    () => autoSaver ?? undefined,
    (payload) => globalThis.propUpload(payload),
);
if (new URLSearchParams(window.location.search).get("mcp") === "on") {
    new BrowserMcpBridge(schemaStore, situationPlanStore).connect();
}
const reactEditorRoot = document.getElementById("react-editor-root");
const reactApplicationMenuRoot = document.getElementById("react-application-menu-root");
const reactHierarchyRoot = document.getElementById("react-hierarchy-root");
const reactPropertiesRoot = document.getElementById("react-properties-root");
const reactPropertiesColumn = document.getElementById("properties_col");
const reactStatusBarRoot = document.getElementById("react-statusbar-root");
const reactEditorCanvas = document.getElementById("canvas_2col");
const reactWorkspaceSidebar = document.getElementById("react-workspace-sidebar");
const reactCommandBarRoot = document.getElementById("react-workspace-commandbar-root");
const reactBoardLayoutRoot = document.getElementById("react-board-layout-root");
const situationWorkspaceElement = document.getElementById("outerdiv");
const situationPaperElement = document.getElementById("paper");
const svgPreviewElement = document.getElementById("right_col_inner");
const schematicControlsRoot = document.getElementById("react-schematic-controls-root");
const reactHierarchyIsEnabled = reactHierarchyRoot !== null;

const saveStatusStore = new LegacySaveStatusStore(() => ({
    hasUnsavedChanges: autoSaver?.hasChangesSinceLastManualSave() ?? false,
    filename: documentHost.get().properties.filename,
}));
situationHistoryStore = new LegacyHistoryStatusStore(() => ({
    canUndo: legacyHistory.undoStackSize() > 0,
    canRedo: legacyHistory.redoStackSize() > 0,
}));
workspaceHistoryAdapter = {
    undo(scope) {
        const selectedSituationElementIds = scope === "situation"
            ? workspaceStore?.getSnapshot().selectedSituationElementIds ?? []
            : [];
        if (scope === "schema") schemaStore?.commands.undo();
        else situationPlanStore?.commands.undo();
        reconcileHistorySelection(scope);
        if (scope === "situation") restoreSituationSelectionAfterHistory(selectedSituationElementIds);
    },
    redo(scope) {
        const selectedSituationElementIds = scope === "situation"
            ? workspaceStore?.getSnapshot().selectedSituationElementIds ?? []
            : [];
        if (scope === "schema") schemaStore?.commands.redo();
        else situationPlanStore?.commands.redo();
        reconcileHistorySelection(scope);
        if (scope === "situation") restoreSituationSelectionAfterHistory(selectedSituationElementIds);
    },
};

function restoreSituationSelectionAfterHistory(elementIds: readonly string[]): void {
    if (situationPlanStore === null || workspaceStore === null) return;
    const availableIds = new Set(situationPlanStore.getSnapshot().elements.map(element => element.id));
    const retainedIds = elementIds.filter(elementId => availableIds.has(elementId));
    const currentPrimary = workspaceStore.getSnapshot().selectedSituationElementId;
    const primaryId = currentPrimary !== null && retainedIds.includes(currentPrimary)
        ? currentPrimary
        : retainedIds[retainedIds.length - 1] ?? null;
    workspaceStore.commands.selectSituationElements(retainedIds, primaryId);
    restoreSituationCanvasSelection(documentHost!.get());
}

function reconcileHistorySelection(scope: WorkspaceHistoryScope): void {
    if (scope === "schema" && schemaStore !== null) {
        editorStore?.commands.reconcileItemIds(new Set(
            schemaStore.getSnapshot().document.getAllItems().map(item => item.id),
        ));
    }
    situationHistoryStore?.refresh();
}
const situationPlanAssetService = situationPaperElement === null
    ? null
    : new LegacySituationPlanAssetService(
        schemaStore,
        situationPlanStore,
        situationPaperElement,
        () => situationHistoryStore.refresh(),
    );

if (reactHierarchyRoot !== null) reactHierarchyRoot.hidden = false;
if (reactPropertiesRoot !== null) reactPropertiesRoot.hidden = false;
reactPropertiesColumn?.classList.remove("hidden");
if (reactEditorRoot !== null) {
    mountEditorApp(
        reactEditorRoot,
        schemaStore,
        editorStore,
        reactHierarchyIsEnabled ? reactHierarchyRoot : null,
        {
            applicationMenuMountElement: reactApplicationMenuRoot,
            propertiesMountElement: reactHierarchyIsEnabled ? reactPropertiesRoot : null,
            saveStatusStore,
            statusBarMountElement: reactStatusBarRoot,
            zoomTargetElement: svgPreviewElement,
            schematicControlsMountElement: schematicControlsRoot,
            schematicRenderStore,
            buildDate: BUILD_DATE,
            situationPlanStore,
            situationCanvasAdapter,
            workspaceStore,
            workspaceViewAdapter,
            onRevealBoardItem: (itemId) => {
                const boardId = schemaStore?.getSnapshot().document.getBoardForItem(itemId)?.id;
                if (!boardId) return;
                prepareDocumentView("2col");
                workspaceStore?.commands.selectTab("board");
                editorStore?.commands.selectBoard(boardId, itemId);
            },
            situationPaperElement,
            commandBarMountElement: reactCommandBarRoot,
            boardLayoutMountElement: reactBoardLayoutRoot,
            workspaceSidebarElement: reactWorkspaceSidebar,
            workspaceInspectorElement: reactPropertiesColumn,
            schematicWorkspaceElement: reactEditorCanvas,
            situationWorkspaceElement,
            situationHistoryStore,
            historyAdapter: workspaceHistoryAdapter,
            onSave: () => {
                fileService.saveDocument(false).catch((error) => {
                    if ((error as { name?: string }).name !== "AbortError") console.error(error);
                });
            },
            onOpenFile: () => workspaceStore?.commands.openDialog("file"),
            situationPlanAssetService,
            fileService,
            printService,
            svgExportService,
            onOpenDocument: () => { void openDocumentPicker(fileService); },
            onAppendDocument: () => { void openAppendDocumentPicker(); },
            onLoadExample: loadExample,
            onCreateEmptyDocument: createEmptyDocument,
            noticeStore,
        },
    );
}
if (reactHierarchyIsEnabled) {
    schemaStore.subscribe(() => {
        currentDocument = schemaStore!.getLegacyDocument();
        documentHost.replace(currentDocument);
        redrawTreeSVG();
        saveStatusStore.refresh();
    });
}
situationPlanStore.subscribe(() => {
    const currentDocument = documentHost!.get();
    if (currentDocument.properties.currentView === 'draw') {
        const view = currentDocument.sitplanview;
        view?.redraw();
        restoreSituationCanvasSelection(currentDocument);
    }
});
// Filename edits and legacy-view mutations bypass the schema store; a coarse
// timer keeps the React save status in sync with them.
window.setInterval(() => {
    saveStatusStore.refresh();
    situationHistoryStore.refresh();
}, 2000);

// Create the autoSaver
// - the constructor receives the current document through DocumentHost
// - Refresh React save state after automatic or manual persistence.

autoSaver = new AutoSaver(5, () => documentHost.get());
autoSaver.setCallbackAfterSave(() => saveStatusStore.refresh());

// Finally check if there is anything in the autosave and load it

let recoveryAvailable = false
let lastSavedStr:string|null = null;
let lastSavedInfo:any = null;

(async () => {
    [lastSavedStr, lastSavedInfo] = await autoSaver!.loadLastSaved();
    if ((lastSavedStr != null) /* && (lastSavedInfo.recovery == true) */ ) recoveryAvailable = true;
})().then(() => {
    if (!recoveryAvailable) {
        EDStoStructure(EXAMPLE_DEFAULT,false);
        openNewDocumentDialog();
        let myCookieBanner = new CookieBanner();
        myCookieBanner.run();
    } else {
        void noticeStore.commands.show({
            key: 'file.autoRecovered',
            title: 'Laatste dossier hersteld uit de browsercache',
            paragraphs: [
                `Het herstelde dossier dateert van ${lastSavedInfo.currentTimeStamp} en heet ${lastSavedInfo.filename}. Je kan verder werken of een ander EDS-bestand openen via Bestand.`,
                'De browsercache is tijdelijke opslag. Sla het dossier regelmatig zelf op om gegevensverlies te voorkomen.',
            ],
            remember: {},
        }).then(() => {
            const cookieBanner = new CookieBanner();
            cookieBanner.run();
        });
        if (lastSavedStr == null) return;
        EDStoStructure(lastSavedStr, true, true);
        documentHost!.get().sitplan?.setActivePage(1);
    }
    autoSaver?.start();
});
