# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Eendraadschema (Community edition): a browser app for designing one-wire electrical diagrams that comply with
Belgian AREI legislation. TypeScript, transpiled to JS, no server component in production. UI copy and domain
terminology (circuits, boards, etc.) are in Belgian Dutch — keep new user-facing strings consistent with that.

This is a solo-maintained hobby project (see README.md "Frequent questions") that is not accepting outside
contributions; treat any work here as assisting the maintainer directly, not as preparing an OSS PR for review
by others.

## Commands

```sh
npm run dev              # start Vite dev server
npm run build             # tsc typecheck + vite build -> dist/index.html (single-file bundle)
npm run preview           # preview production build
npm test                  # vitest (watch mode)
npm run test:run          # vitest run (single pass, use this for CI-style checks)
npm run test:run -- <pattern>   # run a subset, e.g. `npm run test:run -- hierarchy`
npm run typecheck:test    # tsc -p tsconfig.test.json (type-checks src/**, including tests)
npm run test:e2e          # Playwright smoke tests (e2e/smoke.spec.ts); starts its own dev server
npm run mcp:serve         # start the local MCP WebSocket bridge (127.0.0.1 only)
npm run mcp:stdio         # stdio adapter an MCP client runs; requires mcp:serve already running
npm run mcp:http          # HTTP MCP server (127.0.0.1:9235/mcp) an MCP client connects to; requires mcp:serve
```

Before committing any migration-related change, run the full verification baseline used by this project:

```sh
npm test -- --run
npm run typecheck:test
npm run build
git diff --check
```

Vitest config (`vitest.config.ts`) uses jsdom and only picks up `src/test/**/*.test.{ts,tsx}`. There is no
separate lint script. `tsconfig.json` (used by `npm run build`) only includes `src/global.d.ts`, `src/main.ts`,
`src/application/**`, and `src/ui/**`; other files are pulled in transitively or checked instead via
`tsconfig.test.json`, which covers all of `src/**`.

The GitHub Pages deploy workflow (`.github/workflows/deploy-pages.yml`) runs `npm run test:run` then
`npm run build`, and separately copies `prop/`, `resources/`, `examples/`, `gif/`, `Documentation/`,
`license.html`, and `favicon.ico` into `dist/` — the Vite build alone does not produce a deployable tree.

## Architecture

**Read `docs/architecture/migration-handoff.md` first** in any session touching editor/document code — it is
the maintained operational memory for an in-progress incremental migration and records current invariants, key
files, and pitfalls. `docs/architecture/current-architecture.md` is the detailed historical inventory behind it;
consult it for background, not as the first source.

### Current boundary (post React-migration rollout)

```text
React editor UI
  -> SchemaCommands
  -> LegacySchemaStore (single authoritative document + history)
  -> Hierarchical_List and concrete electrical classes
  -> EDS persistence and existing SVG/print renderers

Editor-only state
  -> EditorStore / WorkspaceStore
  -> active board, selection and expanded nodes
```

- `Hierarchical_List` (`src/Hierarchical_List.ts`) remains the **sole authoritative electrical document**. It
  owns ordered electrical items, IDs, parent/child structure, and drives both the SVG renderer and the EDS
  serializer. Item ID `0` is the legacy root sentinel.
- React must **never** mutate `Hierarchical_List.data` or an item's `props` bag directly. All writes go through
  `SchemaCommands` (`src/application/SchemaStore.ts`, implemented by `src/application/LegacySchemaStore.ts`),
  which validate, normalize, and publish immutable snapshots to subscribers, integrated with undo/redo.
- Reads go through `SchemaDocumentReader`/`SchemaPropertyReader` (`src/application/*.ts`), which project frozen,
  UI-independent views of the document — never `toHTML()`-shaped data, never live references.
- Electrical item classes under `src/List_Item/` are domain classes: no React, JSX, hooks, DOM elements, CSS
  names, or interactive HTML. All `toHTML()` methods and HTML form helpers have been removed from them — do not
  reintroduce that pattern.
- Distribution boards (`src/domain/DistributionBoard.ts`) and manual DIN-rail board layouts
  (`src/domain/BoardLayout.ts`) are persisted domain models with invariants documented in
  `migration-handoff.md` (main board has fixed ID `main`, no feeder, cannot be deleted; one circuit feeds at
  most one secondary board; feeder relationships cannot be cyclic; etc.).
- EDS persistence/versioning lives in `src/legacy/persistence/EdsCodec.ts` (decoding, header detection, upgrades
  from older versions). Current file format is EDS006; loading older EDS001–EDS005 documents migrates them
  forward (default `Hoofdbord`, no physical layout, etc.). Existing EDS property keys are a compatibility
  contract even where React uses different semantic names internally — do not rename persisted keys casually.
- SVG generation (`Hierarchical_List.toSVG()`, `SVGSymbols`, `SVGelement`) and print/PDF export
  (`src/print/`, `PrintService.ts`) are frozen legacy renderers reached through typed application-service
  facades; their *interactive UI* is React-owned but their internals should not be rewritten incidentally while
  doing UI work.
- The situation plan (site/floor plan view) is a separate legacy-rendered surface
  (`LegacySituationPlanStore`, `LegacySituationPlanAssetService`) with React-owned contextual commands
  (movement, rotation, locking, alignment, multi-select) layered on top of an unchanged canvas renderer that
  remains the authoritative selection source.
- Local MCP bridge (`scripts/eds-mcp.mjs`, `src/mcp/BrowserMcpBridge.ts`): a WebSocket bridge that lets an
  external MCP client inspect the live document and submit reviewed changes (`propose_change_set` and
  `add_distribution_board`, the latter wrapping `SchemaCommands.addDistributionBoard` since no generic
  `AgentGraphOperation` can create a registered secondary board). It is strictly local-only (rejects
  non-localhost origins) and requires explicit in-browser approval (`McpProposalReview.tsx`) before any change
  is applied as one undoable document command. `npm run mcp:serve` starts the bridge; an MCP client then either
  spawns `npm run mcp:stdio` (per-session subprocess; code changes need a client session restart to take effect)
  or connects to `npm run mcp:http` (long-running HTTP server at `127.0.0.1:9235/mcp`; code changes only need
  that process restarted, not the MCP client). The app must be opened with `?mcp=on`, and that tab must be
  loaded *after* the bridge is already running — `BrowserMcpBridge.connect()` only attempts the WebSocket once,
  with no retry, so if the bridge wasn't up yet the page needs a reload once it is.

### Key directories

- `src/application/` — the read/command/store boundary (`SchemaStore`, `SchemaDocumentReader`,
  `SchemaPropertyReader`, `SchemaValidation`, `EditorStore`, `WorkspaceStore`, `FileService`, `PrintService`,
  situation-plan and board-layout adapters). This is the layer new editor features should be built against.
- `src/domain/` — persisted domain models independent of legacy rendering (`DistributionBoard`, `BoardLayout`,
  `Dossier`).
- `src/List_Item/` — concrete electrical item classes (defaults, legacy key conversion, `toSVG()`); frozen from
  new UI concerns.
- `src/ui/` — React components, organized by surface: `hierarchy/`, `properties/`, `boards/`, `document/`,
  `layout/`, `schematic/`, `workspace/`.
- `src/legacy/persistence/` — EDS codec (decode/upgrade/reconstruct), side-effect-free (no DOM, no globals).
- `src/importExport/` — browser-facing file I/O (File System Access API, downloads) that delegates to the codec.
- `src/print/`, `src/sitplan/` — legacy pagination/PDF export and situation-plan canvas implementation.
- `src/test/` — Vitest specs plus `fixtures/*.eds` sample documents (small/legacy/uncommon-type/situation-plan
  fixtures) used for characterization and compatibility tests; `helpers.ts` and `setup.ts` hold shared test
  scaffolding.
- `e2e/smoke.spec.ts` — Playwright smoke coverage (example loading, circuit editing + undo/redo, search, board
  create/delete, situation-plan pages, print dialog). Keep this suite small and rely on `src/test/` for
  migration coverage.

## Working rules specific to this migration

- Treat legacy implementation code (`Hierarchical_List`, `List_Item/*`, SVG/print/situation-plan internals) as
  frozen: change it only for EDS backward compatibility or persistence fixes required by new features. New
  behavior belongs in `src/application/` + React, wired through `SchemaCommands`.
- Do not add a second copy of the electrical document in React/component state; consume `SchemaDocumentReader`
  projections via the existing store hooks instead.
- Do not save `Set`-based or other editor-only state (selection, expanded nodes, active board, zoom) into EDS —
  that belongs in `EditorStore`/`WorkspaceStore`, not the persisted document.
- Tailwind CSS v4 (via `@tailwindcss/vite`, `css/all.css`) is the styling approach for new React UI; prefer
  utilities over new component CSS where they suffice.
- Do not claim browser-level validation succeeded when only jsdom/RTL tests were run — call that out explicitly.
