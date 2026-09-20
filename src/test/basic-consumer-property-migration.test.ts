import { describe, expect, it } from "vitest";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { BASIC_CONSUMER_TYPES } from "../application/SchemaPropertyReader";
import { Hierarchical_List } from "../Hierarchical_List";
import { structureFromJson } from "../legacy/persistence/EdsCodec";
import { SVGSymbols } from "../SVGSymbols";

function createConsumerDocument(type: typeof BASIC_CONSUMER_TYPES[number]) {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  const circuit = structure.createItem("Kring");
  structure.insertChildAfterId(circuit, board.id);
  const consumer = structure.createItem(type);
  structure.insertChildAfterId(consumer, circuit.id);
  structure.reNumber(false);
  return { structure, consumerId: consumer.id };
}

describe("React basic consumer property compatibility", () => {
  it.each(BASIC_CONSUMER_TYPES)("preserves %s serialization and SVG output", (type) => {
    const initial = createConsumerDocument(type);
    const serialized = initial.structure.toJsonObject(false);
    const commandDocument = structureFromJson(serialized, null, 0);
    const legacyDocument = structureFromJson(serialized, null, 0);
    const store = new LegacySchemaStore(commandDocument);

    store.commands.updateBasicConsumer(initial.consumerId, {
      numberMode: "manueel",
      number: "T1",
      address: "Testadres",
    });

    const legacyConsumer = legacyDocument.getElectroItemById(initial.consumerId)!;
    Object.assign(legacyConsumer.props, {
      autonr: "manueel",
      nr: "T1",
      adres: "Testadres",
    });
    legacyConsumer.normalizeProperties();
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
});
