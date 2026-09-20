# React migration handoff

Last updated: 17 August 2026

This is the operational memory for continuing the incremental React migration. Read this file first in a future session, then use `current-architecture.md` for the detailed historical inventory.

## Repository and working rules

- Work only in this fork: `drskunk/eendraadschema`.
- Current local branch: `migration/react-foundations`.
- Do not push or open a pull request unless the user explicitly asks.
- The upstream default branch was renamed from `master` to `main`; the GitHub Pages workflow deploys `main`.
- Stage and commit coherent intermediate steps locally.
- Preserve unrelated user changes in a dirty worktree.
- Preserve EDS compatibility, SVG/PDF output, print behavior, undo/redo, local files, browser storage and the situation plan.
- Treat legacy implementation code as frozen. Only change it for EDS backward compatibility or migration fixes required by new persisted features (for example new situation-plan symbols); implement replacement UI and behavior in React/application code.
- Tailwind CSS v4 is integrated through `@tailwindcss/vite` and `css/all.css`; use Tailwind utilities for new React styling instead of adding component CSS where utilities suffice.

## Current architectural boundary

```text
React workspace UI
  -> WorkspaceStore + LocalEditorStore
  -> SchemaStore / SituationPlanStore commands
  -> WorkspaceViewAdapter / WorkspaceHistoryAdapter / SituationCanvasAdapter
  -> DocumentHost
  -> Hierarchical_List compatibility model

EDS / autosave / SVG / PDF
  -> FileService / PrintService / SvgExportService
  -> DocumentHost
```

React must never mutate `Hierarchical_List.data` or an item `props` bag directly. New UI actions go through `SchemaCommands`. The electrical classes must remain free of React, JSX, hooks, DOM elements, CSS names and interactive HTML.

## Completed work

- Regression fixtures and structural tests cover EDS loading, round trips, hierarchy, commands, stable IDs, older files and SVG generation.
- `SchemaDocumentReader` and `SchemaPropertyReader` expose frozen, UI-independent projections.
- `LegacySchemaStore` provides validated commands, subscriptions and snapshot-based undo/redo.
- React owns the one-line editor shell, hierarchy and property panel.
- All public electrical item types have React property editors.
- React is the only interactive one-line editor route. The old feature flags and hierarchy DOM change listener are gone.
- All item `toHTML()` implementations and shared HTML form helpers were removed. Do not reintroduce them.
- EDS005 persists first-class distribution boards; EDS001–EDS004 receive one default `Hoofdbord` when loaded.
- EDS006 adds optional manual board layouts. EDS001–EDS005 load with no physical layout, and invalid references in persisted layouts are discarded during parsing.
- A secondary board is represented by metadata plus a real `Bord` item beneath its feeder `Kring`.
- Board commands cover add, update, feeder changes and delete, and reject duplicate feeders, missing feeders, cycles and silent orphaning.
- Structural validation is independent from React and returns issues with `boardId`/`itemId` navigation targets.
- The React board navigator supports creation, selection, editing, deletion, feeder/cable fields and document details.
- Existing SVG traversal renders secondary boards through their real electrical hierarchy. Board name, location and feeder metadata are added by the existing `Bord` SVG adapter.
- GitHub Pages deployment exists at `.github/workflows/deploy-pages.yml`.
- Append-import (`mergeAppendedBoards` in `src/importExport/importExport.ts`) merges secondary boards from the appended document, remapping item IDs, feeder references and board IDs; the appended main board's items join the target main board.
- `structureFromJson` drops secondary-board root references to items that no longer exist instead of surfacing validation errors on load.
- The item factory uses `ELECTRO_ITEM_CONSTRUCTORS`/`PUBLIC_ELECTRO_ITEM_TYPES` in `src/Hierarchical_List.ts` as the single type registry; the property-editor coverage test derives its type list from it.
- React property editors subscribe through `useSchemaSnapshot`; the board settings form remounts when the stored board values change so undo/redo resets its drafts.
- Situation-plan page state and defaults are encapsulated by `SituationPlan`; the legacy view now uses typed document operations instead of directly mutating its element array, page count or defaults.
- `LegacySituationPlanStore` exposes immutable, DOM-independent situation-plan snapshots and validated page/default commands. The legacy view receives this store, its page/default controls use commands, and legacy document replacement refreshes the adapter.
- React owns the shared Tailwind workspace command bar. It presents tab-aware undo/redo, save/file actions, situation-plan page management, selection actions and zoom in one consistent surface; superseded standalone situation controls were removed.
- Situation-plan command-bar actions use the existing public canvas boundary while the legacy implementation remains unchanged. React now owns the image file input and Tailwind custom-symbol dialog; `LegacySituationPlanAssetService` imports backgrounds and places situation-only symbols without hidden legacy button clicks.
- The editor now has one unified workspace shell: a permanent electrical hierarchy on the left, a permanent contextual property inspector on the right, and tabbed `Eéndraadschema`/`Situatieschema`/`Bordindeling` workspaces in the center.
- `Bordindeling` is a fully manual DIN-rail editor. Rail capacity and every module's rail, start position and width are explicit; commands reject overlap, overflow, cross-board placement and deletion of occupied rails.
- Cross-editor linking is bidirectional. Selecting an electrical hierarchy item shows all linked situation-plan placements and can create or reveal one; selecting a linked situation-plan symbol selects its electrical item in the permanent hierarchy.
- The permanent right inspector is contextual: electrical properties in the one-line tab, placement properties in the situation tab and module placement in the board tab. Situation placements can be edited without a modal for page, coordinates, scale, rotation, label size, address mode/location and lock state.
- React owns situation movement, rotation, locking, deletion, duplication, alignment and distribution commands, including keyboard handling. The legacy canvas remains the authoritative renderer, pointer-drag and selection source; its duplicate keyboard path, context menu and edit popups were deleted.
- React-owned file and print dialogs replace the imperative pages. They use the existing file/print application services and renderers, including save-as/open/append, compression settings, print settings, preview, SVG/PDF export and automatic or manual pagination.
- Situation multi-selection is mirrored from the canvas into `WorkspaceStore`, preserving a primary placement for cross-editor linking. Shift-selected symbols receive a batch inspector for relative movement, rotation, page, scale and lock state; batch changes validate before one atomic store publication and one undo checkpoint. The command bar exposes select-all, clear-selection and a live selection count.
- Canvas selection now crosses an explicit typed callback carrying stable placement IDs and one primary ID. React no longer infers application selection by observing legacy DOM class mutations; redraw restores valid selected IDs directly and publishes selection loss only when an element or page no longer contains them.
- Renderer-measured situation label coordinates remain serialized under the existing `labelposx`/`labelposy` keys for old-file and print compatibility, but they are no longer public mutable fields. The canvas writes them through `setDerivedLabelPosition`; duplication, snapshots and print consume the encapsulated value.
- React now exclusively owns workspace navigation and visibility. Legacy render preparation is isolated in `WorkspaceViewAdapter`; view preparation no longer selects a tab.
- `WorkspaceHistoryAdapter` routes schema and situation undo/redo. React components no longer call or checkpoint `undostruct`.
- `LegacySituationPlanStore` owns situation history recording, including mutations initiated by the legacy canvas. Situation-only graph items and their placement are deleted in the same history transaction.
- Situation occurrence creation, custom/background creation, pointer dragging and z-order changes now cross validated `SituationPlanStore` commands. A pointer gesture uses one merge key, so all mouse moves form one undo step; model array order is authoritative for screen, EDS and print stacking.
- Situation placement IDs are persisted in new EDS writes and retained across undo/redo and save/reopen. Older files without IDs still load, while missing, unsafe or duplicate IDs receive safe unique replacements. Workspace history retains any selected placement whose ID still exists after reconstruction.
- `LegacySituationCanvasAdapter` is the sole imperative canvas API used by React. `main.ts` no longer carries individual zoom, selection, reveal and placement callbacks.
- The obsolete situation ribbon generator, `#ribbon` host and imperative `TopMenu` were removed. React renders the compact application menu; workspace views remain exclusively in `WorkspaceHeader`.
- File, print and SVG download are consumed through interfaces. The global print-service singleton was deleted.
- `LocalDocumentHost` owns the current compatibility document. File, print, autosave, history and canvas adapters read through it; the production composition no longer publishes or reads `globalThis.structure`.
- The `undoRedo` compatibility controller also requires explicit document read/replace dependencies. The former `globalThis.structure` defaults, declaration and test scaffolding are gone.
- `SituationPlan` and `SituationPlanElement` carry an injected document reference. Drag conversion and item lookup no longer access the global document; the superseded situation property dialogs and item finder were removed after React reached feature coverage.
- EDS open/replace/append is connected to `DocumentHost` through `LegacyDocumentLifecyclePort`. Legacy undo reconstruction replaces the host atomically instead of continuing on a stale document instance.
- SVG flattening receives its page-marker collection explicitly. Situation canvas selection history and property-dialog defaults receive callbacks/stores explicitly; those renderer paths no longer resolve document/history state through globals.
- Linked-view navigation returns the contextual inspector to `Details`, and occurrence creation restores the canvas selection after schema/store synchronization so the new placement is immediately editable.
- The no-op legacy situation sidebar and its global handlers were deleted. Situation coordinates derive from the actual canvas bounds, initial zoom waits until React has made the host measurable, and dragging through nested SVG content is browser-tested.
- `LocalNoticeStore` and `NoticeDialog` own queued onboarding, autosave-recovery and old-switch-symbol decisions. Remembered dismissals remain in `MultiLevelStorage`; the imperative `HelperTip` and `AskLegacySchakelaar` DOM popups were deleted.
- React owns the new-document/start flow, its electrical defaults, documentation and contact screens. The obsolete configuration host and startup HTML strings are deleted. Compatibility file inputs are created without reparsing `document.body`; file-picker functions are injected callbacks rather than browser globals.
- Static renderer hosts and compatibility file inputs are declared in `index.html`; `main.ts` no longer builds the entire workspace from one HTML string. Situation address labels use `textContent`, while only renderer-owned SVG markup crosses an HTML parsing boundary.
- React now owns the complete one-line viewport around that renderer boundary: guidance, the `#EDS` host, legend and version footer are rendered by `SchematicViewport`. `LegacySchematicRenderStore` computes derived SVG outside React and publishes stable snapshots; the obsolete hidden `#left_col` hierarchy host and direct `right_col_inner.innerHTML` redraw path are gone. The viewport, selection bridge and insertion overlay mount only while the schema tab is active.

## Important domain invariants

- `DocumentHost` holds the current document; `Hierarchical_List` remains the authoritative compatibility write model behind the stores.
- Item ID `0` is the legacy root sentinel; real item IDs are numeric and must survive save/load.
- Every item belongs to the nearest distribution-board root in its ancestor chain.
- The main board has ID `main`, has no feeder and cannot be deleted or re-fed.
- A secondary board has a stable string ID and references exactly one source board and source `Kring`.
- One circuit can feed at most one secondary board.
- Board feeder connections cannot be cyclic.
- Generic item delete, move, duplicate or type-change commands must not orphan or mutate a board root. Use board commands.
- Board names need not be unique.
- UI selection, active board and expanded nodes are editor state and must not be written to EDS.
- Existing EDS property keys remain a compatibility contract even when React uses semantic property names.
- SVG, PDF and print layout remain authoritative legacy renderers behind typed application services; their interactive UI is React-owned.

## Key files

- `src/application/SchemaStore.ts`: public snapshot and command contracts.
- `src/application/LegacySchemaStore.ts`: command adapter, validation boundaries and history integration.
- `src/application/SchemaDocumentReader.ts`: hierarchy, board and document-detail read contracts.
- `src/application/LegacySchemaDocumentReader.ts`: immutable projection over `Hierarchical_List`.
- `src/application/SchemaPropertyReader.ts`: typed property projections.
- `src/application/SchemaValidation.ts`: React-independent structural validation.
- `src/application/EditorStore.ts`: editor-only selection, expansion and active-board state.
- `src/application/HistoryStatusStore.ts`: reactive history availability adapter used by the situation-plan command bar.
- `src/application/DocumentHost.ts`: owner of the current compatibility document for React-facing services.
- `src/application/WorkspaceViewAdapter.ts`: render-only workspace preparation boundary.
- `src/application/WorkspaceHistoryAdapter.ts`: semantic schema/situation history routing.
- `src/application/SituationCanvasAdapter.ts`: React-facing imperative situation-canvas contract.
- `src/legacy/LegacySituationCanvasAdapter.ts`: injected implementation over the remaining canvas renderer.
- `src/application/SvgExportService.ts`: SVG download infrastructure boundary.
- `src/application/SchematicRenderStore.ts`: derived, subscribeable one-line SVG boundary consumed by React without invoking the legacy renderer during render.
- `src/application/SituationPlanAssetService.ts`: React-facing contracts for background import and situation-only symbols.
- `src/application/LegacySituationPlanAssetService.ts`: transitional implementation over the public situation canvas and authoritative stores.
- `src/application/PrintService.ts`: React-facing print settings, pagination, preview and export boundary.
- `src/domain/DistributionBoard.ts`: persisted board and feeder model plus membership/cycle helpers.
- `src/domain/BoardLayout.ts`: persisted manual DIN-rail and module placement model.
- `src/legacy/persistence/EdsCodec.ts`: EDS decoding and old-document migration.
- `src/ui/hierarchy/HierarchyTree.tsx`: active-board-filtered React hierarchy.
- `src/ui/boards/BoardNavigator.tsx`: board navigation and feeder editing.
- `src/ui/boards/BoardLayoutWorkspace.tsx`: central manual physical board editor.
- `src/ui/workspace/WorkspaceCommandBar.tsx`: shared tab-aware editing commands.
- `src/ui/workspace/FileDialog.tsx` and `src/ui/workspace/PrintDialog.tsx`: React-owned document workflows.
- `src/ui/workspace/NewDocumentDialog.tsx` and `src/ui/workspace/HelpDialog.tsx`: React-owned startup, documentation and contact workflows.
- `src/ui/schematic/SchematicViewport.tsx`: React-owned one-line viewport chrome around renderer-produced SVG.
- `src/application/NoticeStore.ts` and `src/ui/workspace/NoticeDialog.tsx`: queued React notices and compatibility decisions without raw HTML.
- `src/ui/document/DocumentDetailsEditor.tsx`: owner, installer, inspection and document info.
- `src/ui/properties/propertyEditors.ts`: registry for React property editors.
- `src/List_Item/Bord.ts`: existing SVG adapter for board export metadata.
- `docs/architecture/current-architecture.md`: original inventory and detailed migration history.

## Verification baseline

Run all of these before committing a migration step:

```sh
npm test -- --run
npm run typecheck:test
npm run build
git diff --check
```

Baseline on 17 August 2026: 56 test files and 339 tests passed. Test typechecking, the Vite production build and all 16 Playwright tests pass. Vite still reports expected warnings for non-module Pako/jsPDF/property scripts.

Playwright end-to-end tests exist in `e2e/smoke.spec.ts` and `e2e/compatibility.spec.ts` (`npm run test:e2e`, config in `playwright.config.ts`, starts the Vite dev server itself). Keep the general smoke suite small; migration coverage should primarily use focused application/component tests. The smoke tests cover React new/help flows, example loading into the React editor with live SVG, circuit property editing with SVG update and undo/redo, editor search reveal, secondary-board creation/breadcrumbs/deletion, status-bar zoom, situation-plan page management plus background/custom-symbol creation, and the React print dialog. The compatibility suite opens the checked-in EDS004 fixture, verifies an existing situation link, changes an uncommon item, downloads and reopens the EDS payload, and validates real SVG and PDF downloads. It exposed and now guards a lost-`this` crash in the legacy switch-symbol compatibility check.

## Relevant commits

```text
47e7955 feat: persist first-class distribution boards
b8535d7 feat: add distribution board commands and invariants
6443d92 feat: validate distribution board relationships
4d25928 feat: add React distribution board navigation
f63060d feat: include distribution boards in SVG export
8442c03 refactor: make React the only editor renderer
0722924 refactor: remove domain HTML renderers
16172e1 docs: record completed React editor boundaries
```

Earlier React/property-editor commits immediately precede these in branch history. GitHub Pages was added in `f222773`.

## Recommended next sequence

1. Done: editor search (`HierarchySearch` reveals results across boards via `EditorCommands.revealItem`), board breadcrumbs (`BoardBreadcrumbs` renders the feeder chain), save status and zoom (React `StatusBar` at the bottom of the one-line editor; `LegacySaveStatusStore` adapts `AutoSaver` state and is refreshed from schema commands, the autosave callback and a coarse timer; zoom is editor-only state applied as CSS `zoom` on the legacy SVG container). `src/main.ts` is now fully LF with trailing whitespace stripped — keep it that way.
2. Done: `LegacyPrintService` (`src/application/PrintService.ts`) is the React-facing print adapter for settings, automatic/manual pagination, preview, SVG download and PDF generation. The React `PrintDialog` owns the workflow; renderer internals remain unchanged.
3. Done: `LegacyFileService` (`src/application/FileService.ts`) is the React-facing open/save adapter. The React `FileDialog` owns open, save, save-as, append and persisted file settings while retaining established browser/file-system fallbacks.
4. Done: the unified workspace owns situation contextual commands and the fully manual `Bordindeling` editor. Board layouts are persisted in EDS006 and all mutations pass through schema commands.
5. Done: obsolete imperative file/print pages, their global callbacks, `Print_Table` DOM builders and the superseded one-line ribbon were removed. File-system callbacks and print render/pagination services remain as compatibility boundaries; the frozen situation implementation still owns its renderer-required DOM.
6. Done: EDS replace/append and undo reconstruction use `DocumentHost` lifecycle, history, autosave and render ports. Startup document replacement and situation view restoration update the host atomically; the production `globalThis.structure` mirror is gone.
7. Replace `Hierarchical_List` as the command-side source model only after a dedicated serializable document model can round-trip all supported EDS fixtures without changing IDs, SVG or board/situation links.
8. Done: `NewDocumentDialog` covers examples, EDS opening and electrical defaults; `HelpDialog` covers documentation and contact. The legacy configuration/start page and its embedded HTML were removed.
9. Done: the Playwright matrix covers legacy/current fixture decoding in focused tests and exercises the checked-in EDS004 fixture through the browser, including its situation placement, uncommon items, save/download/reopen, schema and situation histories, main/secondary boards, SVG download and PDF generation.

## Common pitfalls

- Do not introduce a second copy of the electrical document in React or Zustand.
- Do not infer new Belgian electrical rules when current behavior is unclear; preserve existing behavior.
- Do not refactor the SVG renderer while migrating a UI screen.
- Do not save `Set`-based editor state into EDS.
- Do not identify the main board only as “the first feederless board”; prefer ID `main` and validate malformed documents.
- Do not let deleting an ancestor silently remove a feeder circuit or board root.
- Do not use pixel-perfect SVG snapshots where structural labels, relationships and element counts are sufficient.
- Do not claim browser validation succeeded when only jsdom/RTL tests ran.

## MCP-driven document edits (agent/`propose_change_set` sessions)

Learned while importing a real installation through the MCP bridge; relevant to any session driving the live
document via `propose_change_set`/`add_distribution_board` rather than editing source:

- A `Kring` nested directly under another `Kring` renders as a **continuation of the same line (series)**, not
  a parallel branch — this is correct for genuinely sequential devices (e.g. a main breaker feeding a
  differential feeding a sub-board), but wrong for anything meant to read as parallel circuits sharing one
  upstream device. For parallel siblings behind a shared point, nest a `Splitsing` in between (only
  `Aansluiting`, `Bord`, `Splitsing` fan out children in parallel); `Zekering/differentieel` cannot hold `Kring`
  children at all (not in its `allowedChilds`), so a shared RCD covering several parallel circuits has to be
  represented as a `Kring` configured with differential properties, feeding a `Splitsing`, not as a
  `Zekering/differentieel` node.
- Setting a `Kring`'s `naam` via `update-item` is not enough for it to stick — the app's auto-numbering
  (`Hierarchical_List.vindVolgendeKringNaam`) silently overwrites `naam` on every structural change unless
  `autoKringNaam` is also set to `"manueel"` in the same update.
- A secondary board can only be created with `addDistributionBoard` (exposed over MCP as
  `add_distribution_board`); a plain `add-item` of type `Bord` produces an unregistered item that won't appear
  in `schema.document.getBoards()` and won't accept a feeder relationship.
- `propose_change_set`/`add_distribution_board` responses can time out on the adapter side (stdio or HTTP) while
  the user is still deciding on the in-browser approval dialog — the change may still land. After any apparent
  timeout, re-check state (`get_dossier_summary`/`get_item`) before assuming the proposal failed or retrying it.
