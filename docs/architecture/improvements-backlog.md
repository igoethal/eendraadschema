# Improvements backlog

Compiled 2026-08-23 after finishing the live import of a real installation via the MCP bridge
(`docs/architecture/migration-handoff.md` → "MCP-driven document edits" has the domain-model lessons
from that work). Grouped the way it was originally requested: essential / nice-to-have / handy.

## Essential

1. **Insert-between command for wire sections — insert-before *and* insert-after.** Spec'd
   separately: [`insert-between-command-spec.md`](./insert-between-command-spec.md), which as
   originally written only covers inserting a new item between a parent and one existing child
   (functionally "insert after the parent / before the child"). Needs extending to also support
   inserting a new item as a new *sibling* after an existing item under a multi-child parent (e.g.
   `Kring`, `Splitsing`) — i.e. two distinct operations: insert-before-child (the original spec) and
   insert-after-item (new sibling placed immediately following a given item in child order). Blocks
   AREI 2025/2026 compliance work, which requires specifying every physical cable segment (including
   ZLVS/SELV runs like KNX bus wiring) — today even the "before" case needs a manual 3-step
   move/add/move dance because most device items cap at 1 child and `Leiding` isn't a valid child of
   `Kring`/`Bord`/`Splitsing`.

2. **Automatic re-ordering of circuits/items by name.** Circuit order under a board currently only
   reflects insertion order (each new item prepends to `childIds`), with no way to have the schematic
   simply lay them out sorted by their `naam` (A, B, C… or whatever scheme is in use). Would remove
   the need to manually position new circuits via insert-before/after at all in the common case —
   worth scoping as either a per-board "sort by name" action, or a persistent
   sort-order-follows-name mode.

3. **MCP proposal/revision friction.** Hit repeatedly this session:
   - `get_dossier_summary` routinely exceeds the tool output token cap once a document has real
     content (60K+ chars), forcing a fallback of grepping a saved file just to read the current
     `revision` number.
   - `propose_change_set` rejects outright on any `baseRevision` mismatch — including ones caused
     by the user's own concurrent in-browser edits — with no way to see *what* changed or retry
     against latest without a full manual re-fetch-and-resubmit cycle.
   - Needs: a lightweight `get_revision` (or a trimmed/paginated summary mode), and either
     auto-rebase-on-conflict or a diff surfaced in the rejection so a stale proposal can be assessed
     instead of blindly re-submitted.

4. **Clarify what's still missing from item deletion.** Originally flagged mid-session as "being
   able to remove items again" — but single-item deletion already exists (`Verwijderen` button,
   `src/ui/hierarchy/HierarchyNode.tsx:188-196`, wired to `schemaStore.commands.deleteItem`), and
   `canDelete` is already reported per item over MCP. Need to pin down what's actually missing:
   bulk/multi-select delete? one-confirm subtree delete? an undo toast after deleting? a keyboard
   shortcut? Can't spec this further without that answer.

5. **Schematic diagram should wrap boards across multiple lines, driven by existing rail/row data.**
   Hit this session with Garage-1: a wide board (16 circuits) had to be visually split by inventing a
   fake "Garage-2" board fed through an unprotected busbar, purely to get a second row — because the
   one-line SVG renderer (`Hierarchical_List.toSVG`, driven from `Bord`'s child fan-out) always lays
   a board's circuits out in one row, with no wrap. The useful finding: the domain model for
   multi-row physical layout **already exists** — `src/domain/BoardLayout.ts` models a board as
   `rails` (rows, each with a `moduleCapacity`) plus per-item `placements` onto a specific rail — but
   it's currently only consumed by the print/physical-layout feature
   (`BoardLayoutWorkspace`/`BoardLayoutInspector`/`BoardLayoutPrint.ts`/`Print_Table.ts`), not by the
   schematic SVG renderer at all. Wiring the schematic to respect a board's existing rail assignment
   (one visual row per rail) would fix the width problem properly and retire the Garage-2-style
   busbar hack as a workaround — this is "connect an existing model to a second renderer," not a
   net-new data model.

## Nice-to-have

6. **MCP tool list hot-reload.** Editing `scripts/eds-mcp.mjs` to add or change a tool (as happened
   twice this session — `add_distribution_board`, and now the proposed `insert-item` operation)
   requires reconnecting the MCP client, since the tool list is fixed at connect time. The
   stdio-vs-http tradeoff is already documented in `CLAUDE.md`; this would remove the remaining
   friction on top of that.

7. **Undo/redo history persistence.** Undo/redo already runs through the same command layer for
   both UI and MCP-driven edits, so it's already unified — but history is in-memory only and is lost
   on reload/reopen. Raised mid-session in passing ("ctrl-y, ctrl-z would be nice") — worth
   confirming whether persisting history across reloads is actually the ask, since the underlying
   mechanism already covers both edit paths.

8. **Structured ZLVS/SELV voltage-class field.** Called out as explicitly out-of-scope in the
   insert-between spec: a `spanningsklasse` prop on `Leiding` (and arguably `Kring`) so extra-low-
   voltage runs can be distinguished from mains programmatically, for future compliance tooling or
   BOM/report exports. Today it's only ever free text inside `type_kabel`.

9. **Clearer approval-proposal feedback.** A pending `propose_change_set` currently gives no visible
   distinction between "still waiting on your in-browser approval," "timed out with unknown outcome,"
   and "rejected due to revision conflict" — all surfaced as the same kind of ambiguous silence or
   generic error. Not a correctness bug (proposals do land correctly), just unclear in the moment.

10. **Drag-and-drop detach/reattach in the hierarchy tree.** The legacy tool supported detaching a
    subtree and reattaching it elsewhere via copy/paste; today reparenting only happens through
    `schemaStore.commands.moveItem` calls with no interactive affordance in
    `src/ui/hierarchy/` — every reparent this session went through raw MCP `move-item` operations,
    which isn't something a user working in the browser alone can do at all right now. Visual
    drag-and-drop in the hierarchy tree (drag a node onto a new parent, respecting the same
    `allowedChilds`/max-children validation the command layer already enforces) would restore that
    workflow without reviving copy/paste semantics.

11. **Reclaim print/page real estate from the footer info block in landscape.** The PDF/print title
    block (`src/print/printToJsPDF.ts` — "Erkend Organisme", "Plaats van de elektrische installatie",
    "Installateur", plus the free-text `info`/`properties.info` block, drawn as a full-width band near
    the bottom of every page) eats a large horizontal strip on every landscape page. Moving it into
    the left/right corners instead of one full-width band would free up meaningfully more room for
    the actual diagram, which matters more now that boards can run wide (see item 5).

12. **Upload an existing diagram/photo and let an MCP-connected agent OCR/interpret it into proposed
    items.** This is exactly the workflow used to import the real installation this session — except
    today it only worked because the source PDF happened to be a local file I could read directly
    with a filesystem tool, entirely outside the MCP bridge. `BrowserMcpBridge.ts` currently exposes
    no way to hand a visual to an agent at all: no upload endpoint, no MCP resource for an uploaded
    file. Turning this into a supported feature means: (a) an in-app upload for a scan/photo/PDF of
    an existing diagram, (b) exposing that upload to the connected MCP client (as an MCP resource, or
    a dedicated tool returning the image), so any capable agent can vision/OCR-parse it and propose a
    structured item list the same way `propose_change_set` already works — no bespoke file-path
    access needed. Bigger and more open-ended than the other items here; worth a dedicated design pass
    once there's appetite for it (which capabilities/formats to support, how much pre-parsing vs. raw
    image handoff, etc.) rather than a one-line spec.

13. **Denser, Explorer-style hierarchy tree in the left panel.** The underlying tree behavior is
    already there — `src/ui/hierarchy/HierarchyNode.tsx`/`HierarchyTree.tsx` already do expand/
    collapse, arrow-key navigation, and even reordering (↑/↓ move buttons) and delete per node — but
    the visual density isn't Explorer-like: each selected row grows to show a horizontal row of full
    action buttons (Dupliceren/Uitpakken/Verwijderen/move arrows) inline, rather than staying a
    single compact line with actions tucked away (context menu / hover-reveal / icon-only). Worth a
    visual pass on `HierarchyNode.tsx` to get to a true one-line-per-item, Windows-Explorer-style
    drill-down tree — a styling/interaction change, not new underlying capability.

14. **Treat Print, PDF, and SVG export as three fully-supported, distinct features.** Today all
    three are bundled into one `PrintDialog.tsx`: a preview pane on the left with PDF-generation and
    SVG-download controls squeezed into a narrow options column on the right — SVG export in
    particular is a single "SVG downloaden" button next to the PDF controls, not a first-class flow
    of its own. Worth splitting into three properly-supported paths (their own entry points/dialogs
    or at least clearly separated sections), each getting the attention it deserves rather than SVG
    riding along as an afterthought of the print flow. Related to item 11 (footer eating print real
    estate) — both are about the same dialog/output pipeline.

~~15. Resizable and collapsible left/right panels~~ — **already implemented, struck from this list.**
    Checked while writing item 16 below: `src/ui/workspace/WorkspaceSidebarResizers.tsx` already has
    full drag-to-resize (pointer handles with min/max clamping), collapse/expand toggle buttons, a
    keyboard-accessible resize (arrow keys + Home-to-reset), and double-click-to-reset — on both
    panels. This was wrongly listed as a gap; correcting the record rather than leaving it in.

15. **Drag-and-drop placement onto the situation plan, plus dimension-only floor plans.** Two related
    gaps, checked against the actual code:
    - **Drag-and-drop placement is genuinely missing.** Uploading a floor plan image already works
      (`LegacySituationPlanAssetService.importBackground(file)`), and placing an item's symbol onto it
      already works via a command (`LegacySituationPlanStore`'s `addOccurrence`) — but there's no
      `draggable`/`onDrop` anywhere in `src/ui/`, so today that placement must happen through some
      other UI action, not by dragging an outlet/light from the hierarchy tree onto its spot on the
      plan. Worth adding real drag-and-drop from `src/ui/hierarchy/` onto the situation-plan canvas.
    - **The "still needs placement" queue exists but is invisible.** `placementTasks`
      (`destination: "situation" | "board"`, seen throughout this session's MCP `get_item` responses)
      is a real, already-computed field — but it's only consumed in `src/application/` and tests,
      with zero references anywhere in `src/ui/`. There's no on-screen list today telling a user which
      items still await placement; surfacing this (even as a simple checklist alongside drag-and-drop)
      would close the loop.
    - **Dimension-only floor plans genuinely don't exist.** Background import is image-only
      (`importBackground` decodes an uploaded image file); there's no path to generate a basic floor
      outline from just typed room dimensions when no scan/photo is available. Would need a small new
      generator (rooms → simple rectangles at scale) as an alternative to `importBackground`, feeding
      the same situation-plan background slot.

    **How, concretely:**
    - *Drag-and-drop*: `addOccurrence` (`SituationPlanStore.ts:85`) already takes exactly what a drop
      event naturally produces — `itemId`, `page`, `position: {x, y}` — plus `scale`/`rotation`/label
      fields that can just default (1, 0, existing defaults) and be adjusted afterward through the
      selection-based contextual commands that already exist (movement/rotation/etc., per
      `CLAUDE.md`'s architecture notes). Two viable mechanisms: native HTML5 DnD (`draggable` on
      `HierarchyNode` rows, `onDragOver`/`onDrop` on the plan canvas, item id in `dataTransfer`), or
      pointer-event dragging matching the pattern `WorkspaceSidebarResizers.tsx` already uses
      (`onPointerDown`/`onPointerMove`/`onPointerUp` + `setPointerCapture`) — the pointer approach is
      more consistent with this codebase and works on touch, at the cost of writing hit-testing by
      hand instead of getting it from the browser. Drop coordinates need converting from
      viewport/client space into the plan's own coordinate system (same conversion the canvas already
      does for click/select today). Restrict draggability to items whose `placementTasks` actually
      include a `"situation"` destination, so you can't drag something that's already placed or
      doesn't belong there.
    - *Surfacing the queue*: no new data needed, `placementTasks` is already computed
      (`DossierReader`/`SchemaStore` snapshot) — just needs a consumer. Cheapest version: a small
      panel or a tab next to the hierarchy tree listing pending items grouped by destination
      (`"situation"` vs `"board"`), each entry clickable to select/scroll-to that item and, for
      `"situation"` ones, kick off the same drag flow (or a "place at center" fallback for
      non-pointer/accessibility use). A badge count in `StatusBar.tsx` (which already exists and shows
      live status) is a natural, low-effort way to make "N items still need placing" visible at a
      glance without a dedicated panel.
    - *Dimension-only generator*: needs a small new `Room { name, widthM, depthM }[]` input form, and
      a generator function producing the same `SituationBackgroundImportResult` shape that
      `importBackground` already returns (`svg`, `size`, transform info —
      `LegacySituationPlanAssetService.ts:31-70`) so it plugs into the existing background slot without
      touching the rendering/store side at all. Keep v1 genuinely simple — rooms laid out in a single
      row or basic grid at scale, purely for reference/placement purposes, not real room-adjacency
      layout — and let the user reposition/resize afterward with the alignment tools that already
      exist for situation-plan elements.

16. **Feasibility: export to draw.io.** Explored, not spec'd. draw.io/diagrams.net files are mxGraph
    XML (`<mxCell>` vertices/edges with explicit `x`/`y`/`width`/`height` geometry), not SVG — so this
    isn't a format conversion, it's a real second exporter. The encouraging part: our own SVG renderer
    already computes exactly this kind of per-item bounding-box geometry during `toSVG()`
    (`SVGelement.xleft/xright/yup/ydown`, used throughout `src/List_Item/*`), so a `drawio` exporter
    could walk the same `Hierarchical_List` tree used for SVG and emit one `mxCell` per item at its
    already-computed position, rather than starting from nothing. Two open questions that decide the
    real scope: (a) shape fidelity — draw.io has no Belgian AREI symbol library, so items would render
    as generic labeled rectangles/shapes unless a custom drawio shape library is authored to match
    (a separate, nontrivial effort on its own); (b) whether edges (the wires) need to be real
    `mxCell` edges between vertices for draw.io's connector semantics, or whether embedding the
    existing SVG as a single static image object is actually good enough for what you want a drawio
    export *for*. Worth answering "what's the actual use case" before scoping further — round-tripping
    and editing in draw.io needs real vertices/edges; just having a `.drawio` file to open and view
    doesn't.

17. **AREI compliance verifier, LLM-backed.** The biggest, most novel item in this list — flagged as
    genuinely tricky by you, not spec'd here. Two layers:
    - **The LLM connectivity itself**: pluggable provider support (OpenAI-compatible endpoint, Claude/
      ChatGPT via OAuth, and local inference via Ollama/llama.cpp) — meaning a real provider-config
      surface in the app (endpoint/key entry, OAuth flow, local-model selection), not just a hardcoded
      single API call. Local-model support matters here specifically because this tool handles real
      client installation data; not everyone will want that leaving the machine. **This layer is
      already spec'd in much more depth**:
      [`byo-llm-provider-rag-webmcp-idea.md`](./byo-llm-provider-rag-webmcp-idea.md) — a pre-existing
      architecture seed in this same directory covering exactly this (provider abstraction, an
      OpenAI-compatible provider type that covers Ollama/llama.cpp/local endpoints, secrets/SSRF/
      egress-policy requirements, and a "WebMCP" concept for the *other* direction — an external
      agent calling into the product — which is conceptually the same role
      `BrowserMcpBridge.ts`/`scripts/eds-mcp.mjs` already plays in this codebase today, just via a
      custom WebSocket bridge instead of the proposed browser-native WebMCP API). The AREI verifier
      would be a *consumer* of that provider-gateway layer, not a reason to build a second one. That
      doc's new §33 grounds the generic template in this exact use case — concept-by-concept mapping,
      a narrowed PoC scope, and the one open question (tenancy) that only matters if item 18 happens.
    - **The hard domain problem, in your own words**: compliance can't be checked against a single
      "current AREI edition" for the whole document, because different parts of a real installation
      were legitimately approved under whichever AREI edition was in force *when that part was last
      approved*, and stay valid under those older rules even after the document is re-approved or
      redrawn — unless something specifically triggers a re-evaluation of that part. There is currently
      **no data model for this at all**: `Kring`/`Bord` props (`bescherming`, `amperage`,
      `type_kabel`, etc. — see `src/List_Item/Kring.ts:38-60`) carry no "approved under edition X as of
      date Y" attribution. A real verifier needs that per-circuit (or per-board) vintage tag before it
      can even decide *which ruleset* to check a given part against, let alone do the check itself.
    Both layers are substantial on their own; this needs a dedicated design pass, not a bullet.

## Handy / longer-term direction (not spec'd — you asked to defer this mid-session)

18. **Broader platform rework**, sketched during a frustrated aside mid-import: a Python backend with
    a proper container setup, a modern single-page frontend, a clearer menu structure, and first-class
    import/export. (Resizable/collapsible panels are already implemented — see the correction above —
    so this is purely backend + frontend-framework + menu/import-export scope now.) If the Python
    backend happens, [`byo-llm-provider-rag-webmcp-idea.md`](./byo-llm-provider-rag-webmcp-idea.md)'s
    suggested stack (section 22: FastAPI, SQLAlchemy, PostgreSQL+pgvector) is a reasonable starting
    point to evaluate against, since item 17 would need to live somewhere in that same backend anyway.
    Substantially bigger scope than items 1–17 above, and you explicitly said to hold off until the
    live import was done. Now's presumably the moment to turn this into a real plan, if you want to go
    there — happy to draft one, but it deserves its own dedicated planning pass rather than a bullet
    here.
