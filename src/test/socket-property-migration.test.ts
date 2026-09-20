import { describe, expect, it } from "vitest";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import type { SocketPropertyChanges } from "../application/SchemaPropertyReader";
import { Hierarchical_List } from "../Hierarchical_List";
import { structureFromJson } from "../legacy/persistence/EdsCodec";
import { SVGSymbols } from "../SVGSymbols";

const typedChanges: SocketPropertyChanges = {
  numberMode: "manueel",
  number: "G1",
  grounded: false,
  childSafe: false,
  splashProof: true,
  multiPhase: true,
  phaseCount: "2",
  hasNeutral: true,
  builtInSwitch: true,
  outletCount: "4",
  inDistributionBoard: true,
  address: "Werkbank",
};

const legacyChanges: Readonly<Record<string, unknown>> = {
  autonr: "manueel",
  nr: "G1",
  is_geaard: false,
  is_kinderveilig: false,
  is_halfwaterdicht: true,
  is_meerfasig: true,
  aantal_fases_indien_meerfasig: "2",
  heeft_nul_indien_meerfasig: true,
  heeft_ingebouwde_schakelaar: true,
  aantal: "4",
  in_verdeelbord: true,
  adres: "Werkbank",
};

function createSocketDocument(): { structure: Hierarchical_List; socketId: number } {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  const circuit = structure.createItem("Kring");
  structure.insertChildAfterId(circuit, board.id);
  const socket = structure.createItem("Contactdoos");
  structure.insertChildAfterId(socket, circuit.id);
  structure.reNumber(false);
  return { structure, socketId: socket.id };
}

describe("React socket property compatibility", () => {
  it("produces the same serialized document and SVG as the legacy property path", () => {
    const initial = createSocketDocument();
    const serialized = initial.structure.toJsonObject(false);
    const commandDocument = structureFromJson(serialized, null, 0);
    const legacyDocument = structureFromJson(serialized, null, 0);
    const store = new LegacySchemaStore(commandDocument);

    store.commands.updateSocket(initial.socketId, typedChanges);

    const legacySocket = legacyDocument.getElectroItemById(initial.socketId)!;
    Object.assign(legacySocket.props, legacyChanges);
    legacySocket.normalizeProperties();
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
