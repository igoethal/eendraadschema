# Spec: insert-between command for wire sections (`Leiding`)

Status: proposed, not implemented. Written 2026-08-23 after hitting this friction manually while
importing a real installation via the MCP bridge (see `migration-handoff.md`'s "MCP-driven document
edits" section for the underlying domain-model constraints this builds on).

## Problem

AREI 2025 and especially AREI 2026 require every physical piece of cable to be specified —
conductor count/section, cable type, routing — including ZLVS/SELV wiring (KNX bus, doorbell,
24V control loops), which today gets no more attention in this tool than mains cabling.

The item type for this is already `Leiding` (`src/List_Item/Leiding.ts`): a plain in-line item that
draws a labeled wire segment with no device symbol. It works fine as long as you're building a chain
from scratch. It falls over the moment you need to **retrofit a wire section into an existing chain**:

- `Leiding` is not in `allowedChilds()` for `Kring`, `Splitsing`, `Bord`, or `Aansluiting` — it can
  only be attached under an existing *device* item, never directly after a breaker/board/split point.
- Most device items (anything not overriding `getMaxNumChilds()`) default to **1 child**
  (`Electro_Item.getMaxNumChilds()`, `src/List_Item/Electro_Item.ts:157`). If that one slot is already
  occupied — e.g. a `Transformator` already feeding a `Domotica module (verticaal)` — there is no
  direct operation to slide a new item into the middle.

Today the only way to do this (verified live, this session, adding a `Leiding` between a `Transformator`
and its KNX actuator on ZMG) is a three-step manual dance across two separate change-set proposals:

1. `move-item` the existing child out to some unrelated parent that has room, to free the slot.
2. `add-item` the new `Leiding` into the now-empty slot.
3. Look up the new item's id, `move-item` the displaced child onto the new `Leiding`.

This is slow, needs a live id round-trip between steps, produces two throwaway undo-history entries
and one transient invalid-looking document state, and isn't something a non-technical user could do
in the React UI at all today (there's no UI affordance for it either — this is a command-layer gap,
not just an MCP-tool gap).

Given AREI 2025/2026 is going to make "insert a labeled wire segment here" a routine, frequent edit —
not an occasional one — this needs to become a single atomic operation.

## Proposed solution

### 1. New `SchemaCommands` method (core fix)

Add to `SchemaCommands` (`src/application/SchemaStore.ts`) and implement in `LegacySchemaStore.ts`,
composed from existing `Hierarchical_List` primitives (no changes to `Hierarchical_List.ts` itself —
consistent with treating it as frozen, same approach already used for `addDistributionBoard`):

```ts
insertItemBetween(parentId: number, existingChildId: number, type: string): number; // returns new item's id
```

Semantics:

- `existingChildId` must currently be a direct child of `parentId` — else throw.
- `type` must be an allowed child type of `parentId`'s type — else throw.
- `existingChildId`'s type must be an allowed child type of `type` — else throw (e.g. you can't insert
  a `Contactdoos` between a `Kring` and a `Domotica module (verticaal)`, since `Contactdoos` doesn't
  accept that as a child).
- Effect: create a new item of `type` with default props (`resetProps()`), reparent `existingChildId`
  (and its whole subtree, untouched) under the new item, and place the new item in `existingChildId`'s
  former slot under `parentId`.
- This is **net-neutral** on `parentId`'s occupied-child-slot count (one child out, one child in), so it
  always succeeds regardless of `parentId.getMaxNumChilds()` — that's the whole point: it works even
  when the slot is already at capacity (the common case: `Transformator`, `Domotica gestuurde
  verbruiker`, etc. all cap at 1).
- One `applyCommand`/history entry, one undo step — not the current two-proposal, three-op dance.

### 2. `allowedChilds()` widening

Add `"Leiding"` to the `allowedChilds()` arrays of `Kring`, `Splitsing`, `Bord`, and `Aansluiting`
(currently only device items list it). This lets a wire section sit immediately after a breaker or
fan-out point, not only between two devices — needed for e.g. labeling the run from a board's busbar
to the first device on a circuit.

### 3. MCP bridge exposure

Extend `AgentGraphOperation` (`src/application/SchemaStore.ts`) with a new variant:

```ts
| Readonly<{ kind: "insert-item"; parentId: number; existingChildId: number; type: string }>
```

wire it into `applyAgentChangeSet` in `LegacySchemaStore.ts` (calls `insertItemBetween`), add it to the
allowed-`kind` list in `BrowserMcpBridge.ts`'s `getOperations()` validation, and to the Zod
`operations` schema in `scripts/eds-mcp.mjs`'s `propose_change_set` tool. No new top-level MCP tool
needed — this fits the existing `propose_change_set` operation vocabulary.

### 4. React UI affordance

Add a context-menu action in the hierarchy tree (`src/ui/hierarchy/`) — "Draadsectie invoegen" /
similar — on any node that has a parent, calling `insertItemBetween(parent.id, node.id, "Leiding")`
directly (skipping a type picker for the common case; a generic "Insert item before" for arbitrary
types can reuse the same command if there's appetite for it, but isn't required for the AREI use case).

### 5. Out of scope for this spec (possible follow-up)

Structured ZLVS/SELV marking: today a `Leiding`'s voltage class is only implicit in free-text
`type_kabel` (e.g. "KNX buskabel J-Y(St)Y 2x2x0,8" — what I used today). If AREI compliance tooling or
a future BOM/report export needs to programmatically distinguish ZLVS/SELV runs from mains cabling,
that would need a new structured prop (e.g. `spanningsklasse: "230V" | "ZLVS" | "SELV" | ...`) on
`Leiding` (and arguably `Kring`). Not needed to unblock the insertion problem itself, so left out here.

## Testing

- `src/test/`: unit coverage for `insertItemBetween` — happy path (subtree preserved, single undo
  step), rejects when `existingChildId` isn't a child of `parentId`, rejects on either allowedChilds
  violation, works when parent is at/over its normal max-children cap.
- Extend the MCP `propose_change_set` validation test coverage (if any exists) for the new `kind`.
- No EDS format/persistence changes — existing fixtures unaffected, no migration needed.

## Non-goals / invariants preserved

- No change to `Hierarchical_List.ts`, `List_Item/*` rendering, or the EDS006 persisted key set.
- No change to existing `add-item`/`move-item`/`delete-item` semantics — this is a new, additive
  operation.
