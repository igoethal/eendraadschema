import { describe, expect, it } from "vitest";
import {
  CONFIGURED_ITEM_PROPERTY_SCHEMAS,
  type ConfiguredItemPropertyChanges,
  type ConfiguredPropertyValue,
} from "../application/ConfiguredItemProperties";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { SchemaCommandError } from "../application/SchemaStore";
import { Hierarchical_List } from "../Hierarchical_List";
import { structureFromJson } from "../legacy/persistence/EdsCodec";
import { SVGSymbols } from "../SVGSymbols";

function createDocument(type: string): { structure: Hierarchical_List; itemId: number } {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  if (type === "Bord") return { structure, itemId: board.id };
  const circuit = structure.createItem("Kring");
  structure.insertChildAfterId(circuit, board.id);
  if (type === "Omschakelaar") {
    const store = new LegacySchemaStore(structure);
    const itemId = store.commands.addItem(circuit.id, type);
    structure.reNumber(false);
    return { structure, itemId };
  }
  const item = structure.createItem(type);
  structure.insertChildAfterId(item, circuit.id);
  structure.reNumber(false);
  return { structure, itemId: item.id };
}

function createChanges(type: string, store: LegacySchemaStore): ConfiguredItemPropertyChanges {
  const current = store.getSnapshot().properties.getConfiguredItem(
    type === "Bord" ? store.getSnapshot().document.getRootItems()[0].id :
      store.getSnapshot().document.getAllItems().find((item) => item.type === type)!.id,
  )!;
  const changes: Record<string, ConfiguredPropertyValue> = {};
  for (const [key, field] of Object.entries(CONFIGURED_ITEM_PROPERTY_SCHEMAS[type].fields)) {
    const value = current.values[key];
    if (field.kind === "boolean") changes[key] = value !== true;
    else if (field.kind === "select") changes[key] = field.options?.find((option) => option !== value) ?? String(value);
    else changes[key] = `${String(value)} test`;
  }
  return changes;
}

describe("React configured-item property compatibility", () => {
  it.each(Object.keys(CONFIGURED_ITEM_PROPERTY_SCHEMAS))("preserves %s serialization and SVG output", (type) => {
    const initial = createDocument(type);
    const serialized = initial.structure.toJsonObject(false);
    const commandDocument = structureFromJson(serialized, null, 0);
    const legacyDocument = structureFromJson(serialized, null, 0);
    const store = new LegacySchemaStore(commandDocument);
    const changes = createChanges(type, store);

    store.commands.updateConfiguredItem(initial.itemId, changes);

    const legacyItem = legacyDocument.getElectroItemById(initial.itemId)!;
    const legacyChanges: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(changes)) {
      legacyChanges[CONFIGURED_ITEM_PROPERTY_SCHEMAS[type].fields[key].legacyKey] = value;
    }
    Object.assign(legacyItem.props, legacyChanges);
    legacyItem.normalizeProperties();
    legacyDocument.voegAttributenToeAlsNodigEnReSort();
    legacyDocument.reNumber(false);

    expect(JSON.parse(store.getLegacyDocument().toJsonObject(false)))
      .toEqual(JSON.parse(legacyDocument.toJsonObject(false)));

    SVGSymbols.clearSymbols();
    const commandSvg = store.getLegacyDocument().toSVG(0, "horizontal").data;
    SVGSymbols.clearSymbols();
    const legacySvg = legacyDocument.toSVG(0, "horizontal").data;
    expect(commandSvg).toBe(legacySvg);
  });

  it("rejects unknown properties and wrong target types", () => {
    const configured = createDocument("Batterij");
    const configuredStore = new LegacySchemaStore(configured.structure);
    expect(() => configuredStore.commands.updateConfiguredItem(configured.itemId, { unknown: "x" }))
      .toThrow(SchemaCommandError);

    const plain = createDocument("Contactdoos");
    const plainStore = new LegacySchemaStore(plain.structure);
    expect(() => plainStore.commands.updateConfiguredItem(plain.itemId, { address: "x" }))
      .toThrow(SchemaCommandError);
  });
});
