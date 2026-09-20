# Omschakelaar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a configurable 2P/4P, 16–100 A three-port omschakelaar with protected named ports, neutral SVG rendering, persistence, and editor support.

**Architecture:** Add focused legacy domain adapters for the switch and its internal ports, while enforcing compound-item invariants at the `LegacySchemaStore` command boundary. Reuse configured-property infrastructure for React, and keep the tree model by mapping one selected physical port to the parent side and the other two to protected connector children.

**Tech Stack:** TypeScript, React, legacy SVG strings, Vitest/jsdom, EDS006 JSON persistence.

---

## File map

- Create `src/List_Item/Omschakelaar.ts`: defaults, topology, normalization, and neutral SVG.
- Create `src/List_Item/Omschakelaarpoort.ts`: internal named connector with one circuit child.
- Create `src/application/Omschakelaar.ts`: shared port/rating constants and invariant helpers.
- Create `src/test/omschakelaar.test.ts`: focused domain, command, persistence, validation, and SVG coverage.
- Modify `src/Hierarchical_List.ts`: register both constructors and expose only the switch publicly.
- Modify the item classes whose child menus currently allow `Splitsing`: allow `Omschakelaar` in the same contexts.
- Modify `src/application/LegacySchemaStore.ts`: atomic creation, protected-port commands, and safe parent-port updates.
- Modify `src/application/ConfiguredItemProperties.ts`: configured property schema.
- Modify `src/application/LegacySchemaDocumentReader.ts`: port labels and locked hierarchy capabilities.
- Modify `src/application/SchemaValidation.ts`: report malformed switch topology.
- Modify `src/test/configured-item-properties.test.tsx`, `src/test/property-editor-coverage.test.ts`, and `src/test/hierarchy-reader.test.ts`: UI and projection coverage.

### Task 1: Domain types and registry

**Files:**
- Create: `src/application/Omschakelaar.ts`
- Create: `src/List_Item/Omschakelaar.ts`
- Create: `src/List_Item/Omschakelaarpoort.ts`
- Modify: `src/Hierarchical_List.ts`
- Modify: `src/List_Item/Electro_Item.ts`
- Modify: `src/List_Item/Aansluiting.ts`
- Modify: `src/List_Item/Aftakdoos.ts`
- Modify: `src/List_Item/Domotica_verticaal.ts`
- Modify: `src/List_Item/Kring.ts`
- Modify: `src/List_Item/Meerdere_verbruikers.ts`
- Modify: `src/List_Item/Omvormer.ts`
- Test: `src/test/omschakelaar.test.ts`

- [ ] **Step 1: Write the failing factory/default tests**

```ts
it("registers a public omschakelaar and an internal connector type", () => {
  const structure = new Hierarchical_List();
  const item = structure.createItem("Omschakelaar");
  const port = structure.createItem("Omschakelaarpoort");
  expect(item.props).toMatchObject({ aantal_polen: "4", amperage: "63", parent_port: "IN", adres: "" });
  expect(port.props).toMatchObject({ poort: "OUT1" });
  expect(PUBLIC_ELECTRO_ITEM_TYPES).toContain("Omschakelaar");
  expect(PUBLIC_ELECTRO_ITEM_TYPES).not.toContain("Omschakelaarpoort");
});
```

- [ ] **Step 2: Run the test and confirm it fails because the constructors are absent**

Run: `npm run test:run -- omschakelaar`
Expected: FAIL on unknown/default item types.

- [ ] **Step 3: Add shared constants and focused domain classes**

```ts
export const OMSCHAKELAAR_PORTS = ["IN", "OUT1", "OUT2"] as const;
export const OMSCHAKELAAR_POLES = ["2", "4"] as const;
export const OMSCHAKELAAR_RATINGS = ["16", "25", "32", "40", "63", "80", "100"] as const;
export type OmschakelaarPort = typeof OMSCHAKELAAR_PORTS[number];
export function remainingOmschakelaarPorts(parentPort: OmschakelaarPort): readonly OmschakelaarPort[] {
  return OMSCHAKELAAR_PORTS.filter(port => port !== parentPort);
}
```

Implement `Omschakelaar.resetProps()` with the approved defaults and `allowedChilds()` returning only the internal port type. Implement `Omschakelaarpoort.resetProps()`, `allowedChilds()` returning `["", "Kring"]`, and `getMaxNumChilds()` returning `1`.

- [ ] **Step 4: Register both constructors and add `Omschakelaar` next to every existing `Splitsing` choice**

Import both classes into `Hierarchical_List.ts`, add both to `ELECTRO_ITEM_CONSTRUCTORS`, and define public types as:

```ts
const INTERNAL_ELECTRO_ITEM_TYPES = new Set(["Container", "Omschakelaarpoort"]);
export const PUBLIC_ELECTRO_ITEM_TYPES = Object.keys(ELECTRO_ITEM_CONSTRUCTORS)
  .filter(type => !INTERNAL_ELECTRO_ITEM_TYPES.has(type));
```

- [ ] **Step 5: Run focused tests and commit**

Run: `npm run test:run -- omschakelaar`
Expected: PASS.

```bash
git add src/application/Omschakelaar.ts src/List_Item/Omschakelaar.ts src/List_Item/Omschakelaarpoort.ts src/Hierarchical_List.ts src/List_Item src/test/omschakelaar.test.ts
git commit -m "feat: add omschakelaar domain types"
```

### Task 2: Atomic creation and protected connector commands

**Files:**
- Modify: `src/application/LegacySchemaStore.ts`
- Modify: `src/application/LegacySchemaDocumentReader.ts`
- Test: `src/test/omschakelaar.test.ts`
- Test: `src/test/hierarchy-reader.test.ts`

- [ ] **Step 1: Add failing command tests**

```ts
it("creates the switch and two physical ports in one undoable revision", () => {
  const { store, circuitId } = createCircuitStore();
  const switchId = store.commands.addItem(circuitId, "Omschakelaar");
  const children = store.getSnapshot().document.getChildren(switchId);
  expect(children.map(child => child.label)).toEqual(["OUT1", "OUT2"]);
  expect(store.getSnapshot().revision).toBe(1);
  store.commands.undo();
  expect(store.getSnapshot().document.getItem(switchId)).toBeUndefined();
});
```

Also assert that public `addItem(..., "Omschakelaarpoort")`, delete, move, duplicate, change-type, and insert-before operations involving a connector throw `SchemaCommandError("INVALID_CHANGE", ...)`.

- [ ] **Step 2: Run tests and confirm compound creation/protection failures**

Run: `npm run test:run -- omschakelaar hierarchy-reader`
Expected: FAIL because ports are neither auto-created nor protected.

- [ ] **Step 3: Add store helpers and atomic creation**

Add private helpers to `LegacySchemaStore`:

```ts
private isOmschakelaarPort(item: Electro_Item): boolean {
  return item.getType() === "Omschakelaarpoort";
}

private addOmschakelaarPorts(item: Electro_Item): void {
  for (const poort of remainingOmschakelaarPorts(item.props.parent_port)) {
    const connector = this.structure.createItem("Omschakelaarpoort");
    connector.props.poort = poort;
    this.structure.insertChildAfterId(connector, item.id);
  }
}
```

Call the helper inside the existing `addItem` transaction. Reject direct creation of internal connectors before mutation. Centralize connector protection and call it from delete, move, duplicate, change/update type, and insert-before paths.

- [ ] **Step 4: Project connector labels and locked capabilities**

Add an `Omschakelaarpoort` label formatter based on `summary.text`, populate that summary from `props.poort`, and return false/empty values for structural capabilities except `canAddChild` and `allowedChildTypes: ["Kring"]`.

- [ ] **Step 5: Run focused tests and commit**

Run: `npm run test:run -- omschakelaar hierarchy-reader schema-store`
Expected: PASS.

```bash
git add src/application/LegacySchemaStore.ts src/application/LegacySchemaDocumentReader.ts src/test/omschakelaar.test.ts src/test/hierarchy-reader.test.ts
git commit -m "feat: enforce omschakelaar port topology"
```

### Task 3: Typed property editing and port remapping

**Files:**
- Modify: `src/application/ConfiguredItemProperties.ts`
- Modify: `src/application/LegacySchemaStore.ts`
- Test: `src/test/omschakelaar.test.ts`
- Test: `src/test/configured-item-properties.test.tsx`
- Test: `src/test/configured-item-property-migration.test.ts`

- [ ] **Step 1: Add failing property tests**

```ts
expect(CONFIGURED_ITEM_PROPERTY_SCHEMAS.Omschakelaar.fields).toMatchObject({
  poleCount: { legacyKey: "aantal_polen", options: ["2", "4"] },
  amperage: { legacyKey: "amperage", options: ["16", "25", "32", "40", "63", "80", "100"] },
  parentPort: { legacyKey: "parent_port", options: ["IN", "OUT1", "OUT2"] },
});
```

Test every valid select value, invalid values, remapping while empty, rejection after a port receives a `Kring`, unchanged revision on rejection, and undo/redo.

- [ ] **Step 2: Run tests and confirm schema/remapping failures**

Run: `npm run test:run -- omschakelaar configured-item`
Expected: FAIL because the configured schema and remapping behavior do not exist.

- [ ] **Step 3: Add the configured property schema**

```ts
Omschakelaar: schema({
  poleCount: { legacyKey: "aantal_polen", kind: "select", options: OMSCHAKELAAR_POLES, defaultValue: "4" },
  amperage: { legacyKey: "amperage", kind: "select", options: OMSCHAKELAAR_RATINGS, defaultValue: "63" },
  parentPort: { legacyKey: "parent_port", kind: "select", options: OMSCHAKELAAR_PORTS, defaultValue: "IN" },
  address: { legacyKey: "adres", kind: "text", defaultValue: "" },
}),
```

- [ ] **Step 4: Make parent-port updates atomic and safe**

In `updateConfiguredItem`, detect a changed `parent_port`, require both connector children to have no children, validate that exactly two connector nodes exist, and update the switch plus both connector `poort` values in one `commitTransaction`. Do not publish or checkpoint rejected changes.

- [ ] **Step 5: Run property/component tests and commit**

Run: `npm run test:run -- omschakelaar configured-item-properties configured-item-property-migration`
Expected: PASS.

```bash
git add src/application/ConfiguredItemProperties.ts src/application/LegacySchemaStore.ts src/test/omschakelaar.test.ts src/test/configured-item-properties.test.tsx src/test/configured-item-property-migration.test.ts
git commit -m "feat: edit omschakelaar properties"
```

### Task 4: Structural validation and EDS round trips

**Files:**
- Modify: `src/application/SchemaValidation.ts`
- Test: `src/test/omschakelaar.test.ts`
- Test: `src/test/persistence.test.ts`

- [ ] **Step 1: Add failing malformed-data and persistence tests**

Construct documents with a missing connector, duplicate connector identity, extra connector, connector matching `parent_port`, and a connector with two circuit children. Assert stable issue codes. Round-trip a valid wired switch through `toJsonObject(false)` and `structureFromJson`, checking IDs, properties, and parent relationships.

- [ ] **Step 2: Run tests and confirm validation failures**

Run: `npm run test:run -- omschakelaar persistence schema-validation`
Expected: FAIL because malformed switch topology is not reported.

- [ ] **Step 3: Add validation issues**

Extend `validateSchemaDocument` with issue codes:

```ts
"OMSCHAKELAAR_PORT_COUNT"
"OMSCHAKELAAR_DUPLICATE_PORT"
"OMSCHAKELAAR_PARENT_PORT_CONFLICT"
"OMSCHAKELAAR_INVALID_PORT_CHILD"
```

Inspect direct children through `SchemaDocumentReader`; keep messages in Dutch and associate every issue with the switch or connector item ID.

- [ ] **Step 4: Run persistence/validation tests and commit**

Run: `npm run test:run -- omschakelaar persistence schema-validation`
Expected: PASS.

```bash
git add src/application/SchemaValidation.ts src/test/omschakelaar.test.ts src/test/persistence.test.ts
git commit -m "feat: validate persisted omschakelaars"
```

### Task 5: Neutral SVG rendering

**Files:**
- Modify: `src/List_Item/Omschakelaar.ts`
- Modify: `src/List_Item/Omschakelaarpoort.ts`
- Test: `src/test/omschakelaar.test.ts`
- Test: `src/test/svg.test.ts`

- [ ] **Step 1: Add a failing SVG topology test**

```ts
expect(svg).toContain('data-component="omschakelaar"');
expect(svg).toContain('data-position="neutral"');
expect(svg).toContain(">IN</text>");
expect(svg).toContain(">OUT1</text>");
expect(svg).toContain(">OUT2</text>");
expect(svg).toContain(">63A 4P</text>");
expect(svg).not.toContain("&lt;script");
```

Parse the SVG using `DOMParser` and assert three contact markers, two untouching selector arms, both branch anchors, positive bounds, and escaped description text.

- [ ] **Step 2: Run tests and confirm missing SVG output**

Run: `npm run test:run -- omschakelaar svg`
Expected: FAIL because the classes do not yet render the neutral mechanism.

- [ ] **Step 3: Implement defensive SVG rendering**

Render child circuits through the existing horizontal traversal. Draw three contacts and centered open selector geometry directly in `Omschakelaar.toSVG()`. Use `htmlspecialchars` for every property-derived label, default invalid poles/current/ports to `4`, `63`, and `IN` for display only, and update `SVGelement` bounds for the rating and optional address.

- [ ] **Step 4: Run SVG tests and commit**

Run: `npm run test:run -- omschakelaar svg schematic-render-store`
Expected: PASS with unchanged fixture snapshots/counts.

```bash
git add src/List_Item/Omschakelaar.ts src/List_Item/Omschakelaarpoort.ts src/test/omschakelaar.test.ts src/test/svg.test.ts
git commit -m "feat: render neutral omschakelaar symbol"
```

### Task 6: Editor integration regression coverage

**Files:**
- Modify: `src/test/configured-item-properties.test.tsx`
- Modify: `src/test/property-editor-coverage.test.ts`
- Modify: `src/test/hierarchy-tree.test.tsx`
- Modify: `src/test/schematic-insert-controls.test.tsx`

- [ ] **Step 1: Add focused UI tests**

Render the configured editor for `Omschakelaar`, assert Dutch field labels and all select options, change `Nominale stroom` to `80`, and assert the store receives `amperage: "80"`. Render the hierarchy and confirm named connector rows have no delete/move/type controls but allow adding one circuit.

- [ ] **Step 2: Run tests and fix only integration gaps**

Run: `npm run test:run -- configured-item-properties property-editor-coverage hierarchy-tree schematic-insert-controls`
Expected: PASS after registry-driven UI sees the new public item and the connector capability projection is correct.

- [ ] **Step 3: Commit UI coverage**

```bash
git add src/test/configured-item-properties.test.tsx src/test/property-editor-coverage.test.ts src/test/hierarchy-tree.test.tsx src/test/schematic-insert-controls.test.tsx
git commit -m "test: cover omschakelaar editor integration"
```

### Task 7: Full verification

**Files:**
- Modify only files needed to resolve regressions caused by this feature.

- [ ] **Step 1: Run the complete unit/component suite**

Run: `npm test -- --run`
Expected: all Vitest files and tests pass.

- [ ] **Step 2: Run test TypeScript checking**

Run: `npm run typecheck:test`
Expected: exit 0 with no diagnostics.

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: exit 0; only the repository's documented legacy/Vite warnings may remain.

- [ ] **Step 4: Check patch hygiene and repository state**

Run: `git diff --check && git status --short`
Expected: no whitespace errors; only intentional feature changes and the user's untracked `feature/` reference remain.

- [ ] **Step 5: Commit any final integration fixes**

```bash
git add src/List_Item/Omschakelaar.ts src/List_Item/Omschakelaarpoort.ts src/application/Omschakelaar.ts src/application/LegacySchemaStore.ts src/application/LegacySchemaDocumentReader.ts src/application/ConfiguredItemProperties.ts src/application/SchemaValidation.ts src/Hierarchical_List.ts src/test/omschakelaar.test.ts
git commit -m "fix: complete omschakelaar integration"
```

### Task 8: Replace placeholder-port composition with owned branch geometry

**Files:**
- Modify: `src/List_Item/Omschakelaar.ts`
- Modify: `src/List_Item/Omschakelaarpoort.ts`
- Modify: `src/test/omschakelaar.test.ts`

- [ ] **Step 1: Add failing SVG tests for connected horizontal branches**

Create one empty and one wired switch. Parse renderer metadata and assert that `Omschakelaarpoort` emits no visible line, OUT1 is above OUT2, the neutral mechanism has one selector arm, and every contact/stub/circuit endpoint pair uses identical numeric coordinates.

- [ ] **Step 2: Run the focused test and confirm the existing V selector, placeholder lines, and disconnected branches fail**

Run: `npm run test:run -- omschakelaar`
Expected: FAIL on selector count, duplicate port conductors, and endpoint continuity.

- [ ] **Step 3: Render each connector subtree directly from the switch**

Make `Omschakelaarpoort.toSVG()` return an empty `SVGelement`. In `Omschakelaar.toSVG()`, resolve the two connector items by their `poort` property, render each connector's optional `Kring` subtree independently, position OUT1 first and OUT2 second, and draw exactly one conductor from each contact to the child circuit anchor. Add stable `data-*` coordinate metadata used by tests.

- [ ] **Step 4: Replace the V with one neutral selector arm**

Draw a single centered arm that ends between the two alternative contacts and cannot be read as either output being selected.

- [ ] **Step 5: Run focused tests**

Run: `npm run test:run -- omschakelaar svg`
Expected: PASS.

### Task 9: Automatic vertical orientation and explicit port insertion anchors

**Files:**
- Modify: `src/List_Item/Omschakelaar.ts`
- Modify: `src/application/LegacySchemaDocumentReader.ts`
- Modify: `src/ui/schematic/SchematicInsertControls.tsx`
- Modify: `src/test/omschakelaar.test.ts`
- Modify: `src/test/schematic-insert-controls.test.tsx`

- [ ] **Step 1: Add failing vertical-orientation and insertion tests**

Assert a switch directly below `Kring` renders with `data-orientation="vertical"`, IN below the common contact, OUT1 upper-left, OUT2 upper-right, upright labels, and continuous circuit endpoints. Render insertion controls for an empty switch and assert exactly one button named `Onderdeel na OUT1 toevoegen` and one named `Onderdeel na OUT2 toevoegen`; clicking each must add a `Kring` under the matching connector ID.

- [ ] **Step 2: Run tests and confirm orientation and insertion targeting fail**

Run: `npm run test:run -- omschakelaar schematic-insert-controls`
Expected: FAIL because the current renderer is always horizontal and relies on generic nested port bounds.

- [ ] **Step 3: Add automatic orientation and explicit anchors**

Infer vertical orientation from the incoming placement context (`Omschakelaar` directly on a `Kring` branch); otherwise render horizontally. Emit one explicit SVG anchor per physical connector with its connector item ID and exact visible stub endpoint. Teach `SchematicInsertControls` to prefer these explicit anchors over generic item bounds while retaining the existing behavior for all other item types.

- [ ] **Step 4: Run focused integration tests**

Run: `npm run test:run -- omschakelaar schematic-insert-controls schematic-render-store`
Expected: PASS.

### Task 10: Regression verification for the rendering revision

**Files:**
- Modify only files required to resolve regressions introduced by Tasks 8–9.

- [ ] **Step 1: Run all tests**

Run: `npm test -- --run`
Expected: all tests pass.

- [ ] **Step 2: Run test typechecking and production build**

Run: `npm run typecheck:test && npm run build`
Expected: exit 0; only documented legacy non-module warnings remain.

- [ ] **Step 3: Check patch hygiene**

Run: `git diff --check && git status --short`
Expected: no whitespace errors; the three user-provided screenshots remain untracked.

### Task 11: Preserve wired branches when changing the input side

**Files:**
- Modify: `src/application/LegacySchemaStore.ts:378-417`
- Test: `src/test/omschakelaar.test.ts:118-151`

- [ ] **Step 1: Replace the rejection test with a failing preservation test**

Create an omschakelaar with a `Kring` below OUT1, change `parentPort` from `IN` to `OUT1`, and assert that the same connector ID is now labelled `IN`, still owns the same circuit ID, and OUT2 is unchanged. Undo must restore `IN` as parent and OUT1 as the connector label; redo must reapply the exchange without changing IDs.

- [ ] **Step 2: Run the focused test and confirm the wired guard rejects the change**

Run: `npm run test:run -- omschakelaar`
Expected: FAIL with `SchemaCommandError: Maak beide omschakelaarpoorten leeg...`.

- [ ] **Step 3: Implement the targeted connector identity exchange**

In `updateConfiguredItem`, validate that exactly two unique connector ports equal `remainingOmschakelaarPorts(currentParentPort)`. Resolve the connector whose `poort` equals `nextParentPort`; inside the existing transaction, update the switch properties and rename only that connector to `currentParentPort`. Do not recreate connectors or move their children.

- [ ] **Step 4: Run focused tests and commit**

Run: `npm run test:run -- omschakelaar configured-item-properties`
Expected: PASS.

```bash
git add src/application/LegacySchemaStore.ts src/test/omschakelaar.test.ts
git commit -m "fix: preserve wired branches when remapping switch input"
```

### Task 12: Align the vertical input conductor and clear its labels

**Files:**
- Modify: `src/List_Item/Omschakelaar.ts:89-129`
- Test: `src/test/omschakelaar.test.ts:223-305`

- [ ] **Step 1: Add failing coordinate and label-clearance assertions**

Parse the vertical component and assert the input conductor uses the common contact's `cx` for both `x1` and `x2`. Mark the rating and address text with `data-switch-rating` and `data-switch-address`; assert each text `x` is greater than the conductor x-coordinate and uses `text-anchor="start"`.

- [ ] **Step 2: Run the focused test and confirm the centered rating fails**

Run: `npm run test:run -- omschakelaar`
Expected: FAIL because the rating currently uses the center x-coordinate with `text-anchor="middle"`.

- [ ] **Step 3: Place vertical metadata to the right of the incoming wire**

Keep `common.x` as the sole x-coordinate for the vertical input line. In vertical layout, set the rating/address x-coordinate to `common.x + 20`, render both with `text-anchor="start"`, add stable data attributes, and expand the right bound using `svgTextWidth` so neither label is clipped. Preserve the existing centered labels in horizontal orientation.

- [ ] **Step 4: Run focused tests and commit**

Run: `npm run test:run -- omschakelaar svg schematic-render-store`
Expected: PASS.

```bash
git add src/List_Item/Omschakelaar.ts src/test/omschakelaar.test.ts
git commit -m "fix: align vertical switch wiring and labels"
```

### Task 13: Verify the input-remapping revision

**Files:**
- Modify only files required to resolve regressions introduced by Tasks 11–12.

- [ ] **Step 1: Run all unit and component tests**

Run: `npm run test:run`
Expected: all tests pass.

- [ ] **Step 2: Run browser tests**

Run: `npm run test:e2e`
Expected: all Playwright tests pass.

- [ ] **Step 3: Run typechecking and the production build**

Run: `npm run typecheck:test && npm run build`
Expected: exit 0; only the repository's existing legacy non-module warnings remain.

- [ ] **Step 4: Check patch hygiene and repository state**

Run: `git diff --check && git status --short`
Expected: no whitespace errors; the three user screenshots and `.superpowers/` remain untracked.

### Task 14: Fixed slots, incoming wire on any slot, and label-collision fix

**Files:**
- Modify: `src/List_Item/Omschakelaar.ts`
- Modify: `src/test/omschakelaar.test.ts`

Two field problems after Tasks 11-13:

1. The rating/pole label (`63A 4P`) overlapped the `IN`/`OUT` port label in vertical orientation; it now renders one text line below the port label.
2. `parent_port` used to relabel the drawing (the same position could show different port text, and `IN` could end up on a side branch). The renderer is now slot-based: `OUT1` is always left/top, `IN` always middle, `OUT2` always right/bottom, and `parent_port` only chooses which slot the incoming wire attaches to (the maintainer's Sontheimer UL040 / Victron case: the existing net wire enters `OUT1`, `IN` continues up to the household board, `OUT2` goes via an automaat to the inverter).

Two detours to remember: removing `parent_port` entirely (fixed roles) was tried and reverted because the incoming wire must be able to attach to `OUT1`; and the maintainer's live document was inspected read-only through the MCP bridge (`Bord -> Kring A -> Omschakelaar`, both connectors empty) to confirm the real structure before implementing.

Verified with: `npm test -- --run`, `npm run typecheck:test`, `npm run build`, plus rendered SVG screenshots for every `parent_port` in both orientations.

### Task 15: Three connectors, extra items above every slot, and a right-hand busbar extension

**Files:**
- Modify: `src/List_Item/Omschakelaar.ts`, `src/application/Omschakelaar.ts`, `src/application/LegacySchemaStore.ts`, `src/application/SchemaValidation.ts`, `src/Hierarchical_List.ts`
- Modify: `src/List_Item/Bord.ts`, `src/application/ConfiguredItemProperties.ts`, `src/ui/properties/configured/configuredItemEditorConfig.ts`
- Test: `src/test/omschakelaar.test.ts`, `src/test/bord-busbar.test.ts`, `src/test/configured-item-properties.test.tsx`, `src/test/configured-item-property-migration.test.ts`

Field feedback: even where the incoming wire enters a slot, that slot must still accept extra items going up. The switch therefore always has three connectors (`OUT1`, `IN`, `OUT2`), each with its own upward branch and insertion anchor. This makes the connector-identity swap of Task 11 unnecessary: `parent_port` is now only the slot where the incoming wire is drawn (property label `Inkomende leiding op poort`), and changing it touches no connectors. Older documents with two connectors are completed by `voegAttributenToeAlsNodigEnReSort`. Validation now expects exactly three connectors and no longer has a parent-port conflict.

Separately, the Bord got a `verlenging_rechts` property (`Balk rechts verlengen (px)`, 0-300) that lengthens the busbar on the right. It is added after the existing shift-left logic, otherwise that logic absorbs it.

Verified with: `npm test -- --run` (387 tests), `npm run typecheck:test`, `npm run build`, and a rendered SVG of the three-branch switch with the incoming wire on `OUT1`.
