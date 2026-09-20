# Current architecture and incremental React migration inventory

Status: Living inventory through the unified React workspace and legacy-boundary migration (17 August 2026).

For a concise continuation checklist, read [`migration-handoff.md`](migration-handoff.md) first.

## Current migration state

### Active boundary — 17 August 2026

The historical phase inventory below is retained for compatibility decisions, but its descriptions of visible legacy navigation are no longer current.

- React owns the workspace header, tabs, command bar, hierarchy, contextual inspector, dossier, board layout, new-document flow, file/print dialogs, documentation and contact.
- `WorkspaceStore` is the only owner of the active workspace and host visibility. `WorkspaceChromeController` maps that state to the remaining schema SVG and situation canvas hosts.
- The imperative `TopMenu`, old schema/situation entries and complete legacy ribbon DOM host have been removed. React owns the compact application menu and its Help dropdown.
- `WorkspaceViewAdapter` separates navigation from legacy rendering. React selects a tab; the adapter may only prepare its renderer.
- `WorkspaceHistoryAdapter` is the single React-facing undo/redo route. Situation commands record history inside `LegacySituationPlanStore`; `SituationPlanView` no longer writes to `globalThis.undostruct` directly.
- Situation creation, custom/background placement, pointer dragging and stacking changes use validated `SituationPlanStore` commands. One drag gesture is one mergeable history transaction, and the domain element order drives canvas, persistence and print stacking.
- Situation placement IDs persist across EDS and history reconstruction. Legacy files without IDs remain valid; malformed duplicates receive safe unique IDs, allowing React selection and cross-view links to survive undo/redo.
- `SituationPlanView` publishes selection through a typed `{ elementIds, primaryElementId }` callback and restores valid IDs across redraw. The React keyboard bridge no longer scans `.selected` classes or uses a `MutationObserver` as an application-state channel.
- Situation label positions are explicitly renderer-derived state: the established EDS keys remain intact, while canvas measurement is the only write boundary and print/store code reads the encapsulated value.
- `SituationCanvasAdapter` is the only React-facing imperative situation-canvas boundary. It owns reveal, occurrence creation, selection, ordering and zoom translation.
- `FileService`, `PrintService` and `SvgExportService` are interface boundaries. The deleted `src/print/print.ts` singleton has been replaced by composition-root construction.
- `DocumentHost` owns the current compatibility document. EDS open/replace/append, autosave and undo reconstruction cross an injected lifecycle port; production no longer publishes or reads a `globalThis.structure` mirror.
- The compatibility undo controller has no global document fallback either: callers must inject both current-document access and reconstruction. Static workspace mount points live declaratively in `index.html`, outside the composition root.
- `SchematicViewport` owns the visible one-line guidance, SVG host, legend and footer. `LegacySchematicRenderStore` evaluates the established renderer outside React and publishes a stable derived snapshot; React never calls the stateful compatibility renderer during component render. The old hidden hierarchy column and imperative viewport `innerHTML` path have been removed.
- `SituationPlan`, `SituationPlanElement`, `MouseDrag`, SVG page-marker generation and situation selection-history hooks receive their document/store/callback dependency explicitly. The old item finder, property popups, context menu and duplicate situation keyboard handler were removed after React reached feature coverage.
- The obsolete no-op situation sidebar and its global handlers are gone. Canvas preparation runs after React host visibility, refuses invalid hidden-host zoom measurements and uses live canvas bounds for mouse coordinates.
- React owns onboarding, autosave-recovery notices and the older-switch-symbol compatibility choice through `LocalNoticeStore`; no imperative modal writes raw HTML into `document.body`.
- Situation address labels are written as text rather than parsed HTML. Raw markup is now limited to generated electrical/situation SVG at the renderer boundary.
- Browser compatibility coverage opens the checked-in EDS004 uncommon-item fixture through the real file input, verifies its existing situation placement, saves and reopens the downloaded payload, and validates downloaded SVG and PDF signatures. This matrix also guards the legacy switch-symbol inspection path for imported plans.
- The authoritative electrical write model is still `Hierarchical_List` behind `LegacySchemaStore`; replacing its mutable parallel arrays remains a later model migration, not a UI prerequisite.

Current runtime direction:

```text
React workspace
  -> WorkspaceStore / EditorStore
  -> SchemaStore and SituationPlanStore commands
  -> WorkspaceViewAdapter / WorkspaceHistoryAdapter / SituationCanvasAdapter
  -> DocumentHost
  -> Hierarchical_List compatibility model

File / autosave / print / SVG
  -> typed service interfaces
  -> DocumentHost snapshot
```

The original Phase 0 inventory below is retained as historical context. The active architecture now has these boundaries:

- React is the only interactive one-line editor renderer; the hierarchy fallback flags and legacy change listener have been removed.
- `SchemaStore` owns undoable document commands and subscriptions. React does not mutate `Hierarchical_List.data` or legacy property bags.
- `SchemaDocumentReader` and `SchemaPropertyReader` expose immutable hierarchy, board, document-detail and type-specific property projections.
- every public electrical item type has a React property editor; concrete electrical classes no longer contain `toHTML()` methods or HTML form helpers.
- EDS005 persists stable first-class distribution boards. EDS001–EDS004 documents migrate to one default `Hoofdbord` while keeping their item IDs and legacy properties.
- secondary boards are real `Bord` nodes connected beneath a feeder `Kring`; commands reject missing, duplicate and cyclic feeder relationships and integrate with undo/redo.
- the React board navigator supports board selection, feeder/cable editing, document details and structural validation in Belgian Dutch.
- the existing SVG/print engine remains authoritative. Board name, location and feeder metadata are added at the existing `Bord` SVG adapter without rewriting electrical symbols or pagination.

The remaining visible legacy UI is limited to the situation canvas renderer and the generated eendraadschema SVG. Startup, help, file/print controls and all workspace navigation are React-owned. Persistence codecs, SVG generation and PDF export remain compatibility infrastructure behind typed services.

The sections below retain the original Phase 0 inventory for compatibility archaeology. Statements about visible configuration pages, ribbons, feature flags and generated hierarchy forms are historical unless the active-boundary section above says otherwise.

## Runtime overview

```text
index.html
  -> src/main.ts
       -> creates global session, document, undo, storage and file objects
       -> writes the application shell into #container
       -> exposes global functions used by generated HTML
       -> delegates hierarchy property changes from #left_col_inner
       -> switches between editor, situation-plan and configuration/print views

globalThis.structure: Hierarchical_List
  -> owns ordered electrical items and their IDs/parents
  -> creates and mutates concrete item classes
  -> renders the interactive hierarchy as HTML strings
  -> traverses the same objects to render SVG
  -> owns document properties, print pagination and the situation plan

EDS persistence / undo / autosave / print
  -> all consume or replace globalThis.structure directly
```

The present source of truth is the live `Hierarchical_List` object. Its `data`, `active`, and `id` arrays are parallel, while each `List_Item` also stores its own `id`, `parent`, `indent`, `collapsed`, `props`, and a back-reference to the list. Array order is significant for hierarchy traversal and drawing.

## Responsibility inventory

| Current component or class | Current responsibilities | Responsibilities that should remain | Responsibilities that should move | Proposed destination | Migration risk |
| --- | --- | --- | --- | --- | --- |
| `src/main.ts` | Composition root; creates globals; embeds examples and initial page HTML; defines hierarchy mutations; performs DOM redraws; delegates property changes; switches views; starts autosave/recovery | Temporary bootstrap and legacy wiring while migration is incremental | Commands, editor state, shell rendering, event handling, example fixture data | `application/SchemaStore`, `application/EditorStore`, React shell, and small legacy adapters | Very high: most generated handlers and subsystems assume named globals |
| `Hierarchical_List` | Electrical item collection; ID allocation; parent/child traversal; item factory; insertion/deletion/move/clone/type changes; normalization; numbering; HTML/ribbon rendering; SVG traversal; document serialization; owns print and situation-plan state | Existing item factory, hierarchy/domain rules, stable ID behavior, normalization/numbering, SVG traversal initially | HTML/ribbon rendering and DOM access; command orchestration; UI collapse state; serialization side effects should later be isolated | Legacy domain adapter behind `SchemaDocumentReader` and `SchemaCommands`; React hierarchy; persistence adapter | Very high: it is simultaneously the domain root, renderer input, persisted object and undo snapshot |
| `List_Item` | Base identity/tree fields; untyped property bag; parent lookup; HTML form helper methods; placeholder HTML/SVG | Identity/parent data and parent lookup during compatibility period | HTML form helpers and `toHTML()` | Typed read-model mapper and React property editors | High: serialized field names and loose `props` shape are part of EDS compatibility |
| `Electro_Item` | Domain helpers and constraints; allowed children; child limits; cloning; legacy key conversion; HTML action header/footer; SVG/address and situation-plan symbol support | Domain constraints, legacy conversion, clone semantics, SVG/situation-plan support | Interactive HTML and global handler names | Domain class plus legacy SVG adapter; React node actions/property editors | High: almost every concrete item inherits both UI and SVG behavior from it |
| Concrete classes in `src/List_Item` | Defaults and legacy conversion; type-specific constraints; `toHTML()` property editor; `toSVG()` electrical symbol | Defaults, conversions, electrical rules and existing SVG output | `toHTML()` methods, CSS-class and input-ID knowledge | Per-type React editor registry, migrated in small groups | High: 49 concrete electrical classes derive from `Electro_Item` (with `Lichtcircuit` via `Schakelaars`) and 53 `toHTML` definitions exist including bases |
| `undoRedo` | Stores JSON snapshots of the entire structure plus situation-plan selection/options; temporarily interns custom SVG strings; reloads through import code; redraws the current view | Current snapshot semantics until commands are characterized | Direct globals, DOM selection restoration, view navigation/redraw | Command/store history adapter first; later separate document history from editor state | Very high: undo currently depends on persistence, globals, DOM and view state |
| `importExport/importExport.ts` | File System Access API and file-input flows; EDS/TXT framing and compression; v1-v4 upgrades; reconstruction of item prototypes; append/ID remapping; downloads; file-page HTML | EDS/TXT wire format, v1-v4 upgrades, stable-ID restoration, local file behavior | Global entry points and file-page HTML; direct replacement of global document | `legacy/persistence` codec and file adapter called by application commands | Very high: compatibility code explicitly copies IDs, parents, item props, print state and situation-plan data |
| `AutoSaver`, `IndexedDBStorage`, `MultiLevelStorage`, `Session` | Five-second document autosave/recovery in IndexedDB; UI/help preferences and session ID in localStorage | Browser-only persistence behavior and recovery compatibility | Direct dependency on `Hierarchical_List`, ribbon callbacks and global composition | Persistence services subscribed to the application store | Medium/high: save-status UI currently derives from autosaver state, not a store snapshot |
| `Hierarchical_List.toSVG()` plus item `toSVG()` methods, `SVGSymbols`, `SVGelement` | Recursive one-line SVG construction, symbol registration, sizing, labels and layout | Entire existing SVG path for the initial migration | Only the caller boundary should move; no initial renderer rewrite | `legacy/svg` facade consuming the live domain model/read adapter | Very high: generated SVG is a key regression surface and uses item order, numbering and hierarchy |
| `Print_Table`, `print/print.ts`, `printToJsPDF.ts` | Pagination state and controls; SVG preview/download; situation-plan pages; rasterization and jsPDF export | Pagination and PDF/SVG output behavior | HTML controls, direct globals and DOM updates | Legacy print/export service behind React shell later | High: `Print_Table` mixes persisted pagination state with DOM control creation |
| `SituationPlan` / `SituationPlanView` | Situation-plan document elements and JSON; interactive canvas, sidebar, selection, drag/context menus, ribbon and SVG content | Existing situation-plan model, view and export during hierarchy migration | Eventually split model/view, but it is outside the first React scope | Keep as an isolated legacy view mounted alongside React | High: undo and print span both one-line and situation-plan state |
| `TopMenu` and configuration/documentation/dialog modules | Imperative navigation and DOM rendering | Existing callbacks while shell is introduced | Shell/navigation rendering | React editor shell, with legacy page adapters | Medium: callbacks cause redraws and view-state mutation |

## Entry point and shell

- `index.html` supplies external scripts for property customizations, Pako and jsPDF, then loads `src/main.js` as a module. Vite resolves this from `src/main.ts` during development/build.
- `main.ts` writes the complete shell into `#container`: top menu, configuration page, ribbon, two-column one-line editor, and situation-plan canvas/sidebar.
- It creates `globalThis.structure`, `undostruct`, `autoSaver`, `fileAPIobj`, `topMenu`, session and preference storage. Declarations are centralized in `src/global.d.ts`, though several import/export globals are not declared there.
- `toggleAppView()` imperatively shows, hides, or clears the three primary views (`2col`, `config`, `draw`) and stores `properties.currentView` in undo snapshots.
- A delegated `change` listener on `#left_col_inner` parses element IDs shaped as `HL_edit_<itemId>_<property>`, mutates `electroItem.props`, normalizes dependent attributes, stores undo, and redraws SVG/HTML.

## Hierarchy and item model

`Hierarchical_List` uses numeric ID `0` as the root sentinel. `curid` is monotonically incremented, so deleted IDs are not reused. `reSort()` orders every parent before its descendants and removes inactive or unreachable items. Insert, delete, move, clone, reparent and type-adjustment behavior all operate on the legacy arrays and concrete classes.

The hierarchy is not a pure electrical document today:

- `collapsed` lives on every serialized `List_Item`;
- `mode` (`edit` or `move`) lives on `Hierarchical_List`;
- `properties.currentView` lives in document properties;
- `sitplanview` is an interactive DOM view referenced by the document root;
- `print_table.displaypage` and several print-control values mix preview/UI state with persisted pagination settings.

These fields must not simply be deleted. The first change batch should characterize whether saved EDS files, undo/redo, autosave recovery, and reopening rely on them. Separation into editor state belongs after those tests exist.

## Interactive HTML rendering inventory

There are 53 `toHTML()` definitions under `src`, primarily one per item class plus the base classes and hierarchy renderer. Runtime calls are concentrated in `Hierarchical_List.toHTMLinner()` and recursive `Hierarchical_List.toHTML()`, invoked by `HLRedrawTreeHTML()` and `HLRedrawTreeHTMLLight()` in `main.ts`.

`List_Item` generates inputs/selects with encoded IDs; `Electro_Item` adds insert/delete/move/clone/type controls; concrete item classes add their property controls. `Hierarchical_List` wraps these in nested tables, renders collapse controls, warnings and the ribbon, and can replace one subtree with `updateHTMLinner()`.

Repository-wide searches currently find 69 `innerHTML`/`insertAdjacentHTML` sites and 50 source sites containing inline event attributes. These include non-hierarchy legacy views, so Phase 5 should initially target the hierarchy-specific subset rather than remove every use at once.

Generated hierarchy/shell HTML calls these globals:

- hierarchy commands: `HLAdd`, `HLDelete`, `HLInsertBefore`, `HLInsertAfter`, `HLInsertChild`, `HLMoveUp`, `HLMoveDown`, `HLClone`, `HL_changeparent`, `HLExpand`;
- hierarchy UI: `HLCollapseExpand`, `HL_editmode`, `HLRedrawTree*`;
- history and persistence: `undoClicked`, `redoClicked`, `exportjson`;
- filename/address and startup: `HL_enterSettings`, `HL_changeFilename`, `HL_cancelFilename`, `changeAddressParams`, `forceUndoStore`, `load_example`, `read_settings`, `loadClicked`;
- file/print: `importjson`, `appendjson`, `importToAppendClicked`, `HLDisplayPage`, `dosvgdownload`.

Other generated handlers remain in the situation-plan ribbon, file/configuration pages and print page. They are legacy dependencies, but not prerequisites for replacing the hierarchy tree.

## Persistence and compatibility

The current file format is version 4:

- `EDS0040000` prefixes Deflate-compressed, Base64-encoded JSON;
- `TXT0040000` prefixes uncompressed JSON;
- files without a header are treated as legacy version 1;
- `upgrade_version()` and `convertLegacyKeys()` cover older key-based versions and later property migrations.

`Hierarchical_List.toJsonObject()` obtains JSON by temporarily nulling cyclic/runtime references (`sourcelist`, situation-plan view/model and page markers), optionally removing `currentView`, and calling `JSON.stringify(this)`. Loading constructs a fresh `Hierarchical_List`, recreates each concrete class from its type, merges saved props, and explicitly restores `parent`, `active`, both copies of each ID, `indent`, `collapsed`, and `curid`.

This means the serialized shape is an implementation-shaped contract rather than a dedicated DTO. A read model must initially be an adapter over this structure; changing the saved format is not part of the first React work.

Append-import offsets item IDs and parent references, updates situation-plan `electroItemId` references, concatenates arrays, and re-sorts. Stable-ID tests must cover normal round trips and append behavior separately.

## Undo/redo and local persistence

- `undoRedo.store()` serializes the live structure with `removeUnneededDataMembers = false`, so `currentView` participates in history. Situation-plan selection/sidebar options are stored in a parallel history stack.
- Undo/redo reloads via the persistence importer, restores view/mode, re-sorts, navigates/redraws, and reselects situation-plan DOM boxes.
- `AutoSaver` compares `TXT0040000` snapshots every five seconds after editing begins and saves changed documents plus filename/timestamp/recovery metadata in IndexedDB (`DB_EDS` / `Store_EDS`).
- `MultiLevelStorage` stores application/help preferences in localStorage under `appDocStorage`; `Session` stores a random session ID under `SessionJS`.

The first command layer should wrap the existing `undostruct.store()` timing rather than replace history semantics immediately.

## SVG, print and export

`Hierarchical_List.toSVG()` recursively traverses the same concrete item objects used by the editor. Item `toSVG()` methods return `SVGelement` fragments and register definitions through `SVGSymbols`. `HLRedrawTreeSVG()` displays this output beside the editor.

`printsvg()` regenerates the one-line SVG, updates `Print_Table` dimensions/pages, builds print controls and previews either an EDS page or situation-plan page. PDF generation passes the flattened SVG, pagination, document properties and situation-plan pages to the TypeScript jsPDF implementation. SVG download reads the current preview DOM.

For the initial migration, expose this path through a facade but do not alter its inputs or output. Regression tests should compare meaningful SVG structure and, for the first change batch, preserve complete output for fixed fixtures where deterministic.

## Tests, build and deployment

- No test files, test runner, lint script or CI workflow are present.
- `npm run build` runs `tsc && vite build`; `tsconfig.json` includes only `src/global.d.ts` and `src/main.ts`, relying on imported files to pull the application into checking. Strict mode is not enabled.
- Vite targets ES2017 and uses `vite-plugin-singlefile`; the build emits an inlined `dist/index.html`/`bundle.js` arrangement while externalizing legacy resource scripts.
- README deployment guidance says the single-file result still needs root resources and must be renamed/copied into the root folder. No automated deployment configuration is present in this checkout.
- The Phase 0 baseline build initially could not execute because dependencies were not installed (`tsc: command not found`). Dependencies were subsequently installed for the first regression-test batch, after which the tests and production build passed.

## Proposed boundaries

The smallest safe direction is to keep `Hierarchical_List` as the authoritative legacy document initially and put interfaces around it:

```text
React hierarchy/editor shell
  -> SchemaStore commands + EditorState
       -> LegacySchemaDocumentAdapter
            -> Hierarchical_List and concrete Electro_Item classes

EDS codec / autosave / SVG / print
  -> same authoritative legacy document through narrow facades
```

The first read model should project only fields needed by a hierarchy row: stable ID, parent ID, type, Dutch summary/label, ordered child IDs, relevant property values and domain capabilities such as allowed child types. It must not call `toHTML()`, expose DOM nodes, or copy the entire document into a second mutable store.

Collapse, selection, search, zoom, active panel/view and property-panel visibility should become editor state. Moving `collapsed` and `currentView` out of persisted/history snapshots requires an explicit compatibility decision and tests; it should not be bundled into the read-model change batch.

### Phase 2 implementation status

The UI-independent hierarchy boundary is now implemented in `src/application`:

- `SchemaDocumentReader` defines the read API and immutable node shape;
- `LegacySchemaDocumentReader` projects the authoritative `Hierarchical_List` without calling `toHTML()`;
- root parent `0` is exposed as `null`;
- a narrow `summary` exposes only hierarchy-row fields (name, number, address and text), while type-specific property data is reserved for a later property-editor adapter;
- legacy ordering, stable IDs and direct child order are preserved;
- internal containers and generated attributes remain available through explicit semantic roles;
- capabilities expose existing child and duplication constraints without introducing UI mutations.

The legacy editor does not consume this interface yet. That switch belongs after a command/subscription layer exists, so read actions and write actions do not acquire competing integration paths.

### Phase 3 implementation status

The UI-independent command and subscription layer is now implemented in `src/application`:

- `SchemaStore` and `SchemaCommands` define the public application boundary;
- `LegacySchemaStore` remains backed by one authoritative `Hierarchical_List`;
- commands cover add, delete, move/reparent/reorder, update/type change, subtree duplication, explicit document replacement, undo and redo;
- hierarchy rules, capacity limits, invalid parents and cycles are validated before mutation;
- generated attribute items cannot be edited independently;
- immutable, referentially stable snapshots are published to subscribers;
- commands normalize and publish transactionally; a normalization failure restores the complete pre-command snapshot without adding history or notifying subscribers;
- application and legacy history now share one tested `DocumentSnapshotHistory` primitive while retaining their existing integration behavior;
- undo/redo and document replacement use the side-effect-free EDS reconstruction codec rather than importing browser file-handler registration;
- numbering can now run without DOM updates, allowing command tests in a Node environment.

The legacy global handlers are intentionally not wired to this store yet. They retain their existing undo stack and redraw behavior until the React shell integration provides one composition root. SVG, persistence and print adapters can temporarily obtain the current legacy document through `getLegacyDocument()`; they must retrieve it after undo/redo because history restoration replaces the document instance.

### Consolidation before React

The post-Phase-3 review resulted in a small consolidation pass rather than immediately mounting React:

- EDS decoding, version upgrades and reconstruction live in `src/legacy/persistence/EdsCodec.ts` and do not register globals or access the DOM;
- the browser-facing import/export module delegates to that codec and retains deprecated compatibility exports for existing callers;
- root child rules have one source in `Hierarchical_List.allowedRootChilds()` instead of being repeated in UI and command code;
- hierarchy snapshots no longer expose a cloned copy of every legacy property;
- structural SVG assertions record dimensions and meaningful element counts instead of opaque whole-file hashes;
- checked-in current-version and legacy fixtures cover uncommon components and situation-plan references;
- test sources have their own complete TypeScript check, and dependency audit findings were resolved with compatible lockfile updates.

This leaves a clearer Phase 4 seam: React can subscribe to `SchemaStore`, render `SchemaDocumentReader`, and call `SchemaCommands` without importing the browser persistence module or the legacy undo implementation.

### Phase 4 implementation status

React is now mounted incrementally without replacing the legacy application:

- `react` and `react-dom` are configured with the automatic TypeScript JSX runtime;
- `EditorApp` mounts into the dedicated `#react-editor-root` while the existing top menu, hierarchy, SVG preview, print view and situation plan keep their existing DOM roots;
- `useSchemaSnapshot()` consumes the framework-independent store with `useSyncExternalStore`; the domain document is not copied into React state;
- the first shell surface is a compact, semantic Dutch header with a live count of editable electrical items;
- legacy mutations synchronize the store's read snapshot through an explicit transition seam, while legacy history remains authoritative for legacy actions;
- `?reactShell=off` disables the React mount and provides an immediate fallback to the unchanged legacy application;
- React Testing Library covers semantic rendering, store-driven updates and the fallback flag.

Phase 4 deliberately exposes no React electrical commands yet. Adding hierarchy actions before React owns hierarchy rendering would create two interactive mutation paths and confusing undo ownership.

The next coherent phase is Phase 5: mount a React hierarchy beside the legacy renderer behind a separate feature flag, migrate selection/expansion into editor-only state, and route every action in that tree through `SchemaCommands`. The existing `toHTML()` hierarchy remains the fallback until command, keyboard and SVG-regression tests pass.

### Phase 5 implementation status

The first React hierarchy is available as an opt-in migration path:

- `LocalEditorStore` owns selection and expanded IDs separately from EDS document data and reconciles state after deletion or document replacement;
- `?reactHierarchy=on` mounts the React hierarchy into `#react-hierarchy-root` and hides the legacy hierarchy renderer; without the flag, legacy rendering remains unchanged;
- semantic `nav`, `header`, `ol`, `li`, `button`, `label` and `select` elements replace table layout and inline handlers in the new path;
- hierarchy rows support selection, expand/collapse, adding children, duplication, confirmed subtree deletion and sibling movement;
- arrow keys plus Home and End navigate visible items, with visible focus and selected states;
- every mutation and React undo/redo action dispatches `SchemaCommands`; React never edits legacy arrays or properties directly;
- a store subscription refreshes the unchanged SVG preview after React commands;
- the hierarchy builds a parent/children index once per schema snapshot instead of repeatedly scanning the full legacy list;
- generated attribute nodes and the internal situation-plan container remain in the read model but are hidden from editing, matching legacy hierarchy behavior;
- fixture tests render every editable node in the representative legacy documents, while structural SVG tests remain unchanged.

### Phase 6 implementation status

The first item property editor is available on the opt-in React path:

- `SchemaPropertyReader` exposes a typed, read-only `CircuitProperties` projection without copying the document or exposing the legacy `props` object;
- hierarchy and property readers materialize frozen projections per store revision, so retained external-store snapshots cannot observe later legacy mutations;
- `SchemaCommands.updateCircuit()` accepts application-level property names and translates them to stable EDS keys inside the legacy adapter;
- the circuit command rejects unknown keys, invalid choices, invalid numeric text and wrong runtime types before mutation or history publication;
- command updates invoke `normalizeProperties()`, an explicit application-facing seam over existing subclass invariants, before publishing;
- `ItemPropertiesPanel` selects editors through a registry; `Kring` and `Contactdoos` are registered and additional item types can migrate independently;
- the circuit editor composes reusable fields and focused protection, cable and advanced sections, with option metadata outside render paths;
- circuit inputs cover every field in the legacy `Kring.toHTML()` editor, retain its conditional visibility, group uncommon fields under “Geavanceerde instellingen”, and use Belgian Dutch labels;
- numeric drafts are validated on blur and invalid intermediate input is not written to the domain document;
- selection remains editor-only state, while every valid property change flows through the command layer and existing undo/redo history;
- on the opt-in one-line editor, both React controls and the visible legacy ribbon delegate to `SchemaStore` history; undo/redo also rebinds the transitional global document before SVG, autosave and ribbon refreshes;
- compatibility coverage compares command-path serialization and SVG output with the legacy property mutation path for both migrated types.

The properties panel is mounted in a dedicated right sidebar when `?reactHierarchy=on`; the unchanged SVG remains in the center workspace and the hierarchy remains on the left. Narrow viewports keep all three surfaces reachable with horizontal scrolling. The default legacy path remains fully functional. Unregistered item types clearly indicate that their properties are still managed by the existing editor rather than attempting a partial form.

Phase 6 property migration is now complete for every public electrical item type:

- `Kring`, `Contactdoos` and `Lichtpunt` retain dedicated typed projections and editors;
- common consumers share a typed number/address contract;
- the remaining field-driven classes use an explicit per-type application schema that allowlists semantic field names, legacy EDS keys, value kinds and select options;
- React never receives or mutates a legacy `props` object, and all edits pass through validated `SchemaCommands` with shared undo/redo;
- conditional legacy fields (protection, switch attributes, cable placement, text sizing and similar dependencies) are represented in the React editor configuration;
- a registry-coverage test requires an editor for all 48 public item types; only the internal `Container` node is deliberately excluded;
- parameterized compatibility tests compare complete serialized EDS data and exact SVG output with the legacy mutation path for every schema-driven type;
- type changes and expansion of composite switch/light-circuit items have dedicated commands and React controls.

The React hierarchy became the default one-line editor during rollout. After hierarchy, property, command and SVG regression coverage passed, the rollback flag, hierarchy `innerHTML` path, global hierarchy handlers and item `toHTML()` methods were removed. SVG, print, persistence and situation-plan rendering remain intact.

## First change batch

Suggested local commit description: `docs: inventory editor architecture; test: add document and SVG characterization coverage`

Scope:

1. Commit this architecture inventory without changing runtime code.
2. Add Vitest as the test runner and a DOM environment only where unavoidable. Prefer domain/persistence tests that do not require mounting the application entry point.
3. Extract or export the minimum pure codec seams needed to test EDS decoding/loading without triggering menus, autosave or DOM redraw. This is test-enabling refactoring only; keep file bytes and reconstructed objects unchanged.
4. Add checked-in EDS fixtures:
   - existing `example_default.eds` as the older/small compatibility fixture;
   - existing `example000.eds` as a small apartment/basic diagram;
   - existing `example001.eds` as a larger multi-circuit/nested diagram;
   - one focused fixture containing less-common types and a situation-plan reference, created from current behavior.
5. Add characterization tests for:
   - load current and older EDS headers;
   - save/load round trip without property or hierarchy loss;
   - stable `id`, item `id`, `parent`, ordering and `curid`;
   - add, delete, move/reparent and parent-child preservation;
   - undo/redo snapshot restoration, using a small adapter or controlled globals if necessary;
   - deterministic one-line `toSVG()` output and meaningful SVG labels/symbol references;
   - situation-plan `electroItemId` survival where represented by a fixture.
6. Add `npm test` and `npm run test:run`; run tests and the existing production build.

Explicit non-goals:

- no React dependencies or JSX configuration;
- no hierarchy read model or command/store implementation;
- no EDS format change;
- no movement of `collapsed`, `currentView` or print state;
- no HTML, SVG, print, undo/redo or visual redesign changes;
- no distribution-board model.

Acceptance criteria:

- all four fixture categories are represented;
- current and legacy EDS documents reconstruct the same item types, IDs, parents and important properties;
- mutation and undo/redo characterization tests pass;
- generated SVG for fixed fixtures is unchanged;
- `npm run test:run` and `npm run build` pass from a clean dependency install;
- any unavoidable browser globals used by tests are isolated in test setup, not added to domain code.

## Principal migration risks after the first change batch

1. UI state is embedded in serializable domain objects and undo snapshots.
2. Command boundaries are currently split between global functions, delegated DOM mutation, item methods and `Hierarchical_List` methods.
3. Tree order and IDs are represented redundantly; adapters must preserve both until the persistence contract is deliberately changed.
4. Type changes can replace object prototypes and reset properties, while normalization may synthesize attribute children.
5. SVG, situation-plan references, print pagination, autosave and history all share the same live root object.
6. Incremental redraw has browser-specific behavior (`isFirefox()` selects full redraws), so React hierarchy rollout needs a feature flag and an isolated mount boundary.
7. The external `prop/prop_scripts_js.js` customization hook can add menu behavior and remains part of the deployed shell.

## Remaining legacy dependencies after Phase 0

All runtime dependencies remain intentionally unchanged. In particular, the editor still depends on `globalThis.structure`, generated `toHTML()` strings, global handler names, direct DOM writes, serialization-shaped undo, and the legacy SVG/print/situation-plan paths. Phase 0 only makes those dependencies explicit and defines the regression work required before extracting them.
