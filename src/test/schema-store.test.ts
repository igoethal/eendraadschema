// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import type {
  CircuitPropertyChanges,
  BasicConsumerPropertyChanges,
  SocketPropertyChanges,
} from "../application/SchemaPropertyReader";
import { SchemaCommandError } from "../application/SchemaStore";
import { Hierarchical_List } from "../Hierarchical_List";

function createStore() {
  const structure = new Hierarchical_List();
  const board = structure.addItem("Bord");
  board.props.naam = "Hoofdbord";
  return { store: new LegacySchemaStore(structure), boardId: board.id };
}

function expectCommandError(action: () => void, code: string) {
  try {
    action();
    throw new Error("Expected SchemaCommandError");
  } catch (error) {
    expect(error).toBeInstanceOf(SchemaCommandError);
    expect((error as SchemaCommandError).code).toBe(code);
  }
}

describe("LegacySchemaStore", () => {
  it("adds items through commands and publishes stable external-store snapshots", () => {
    const { store, boardId } = createStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    const before = store.getSnapshot();

    const circuitId = store.commands.addItem(boardId, "Kring");
    const after = store.getSnapshot();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot()).toBe(after);
    expect(after).not.toBe(before);
    expect(after.revision).toBe(1);
    expect(after.canUndo).toBe(true);
    expect(after.document.getItem(circuitId)?.type).toBe("Kring");
    expect(after.document.getItem(circuitId)?.parentId).toBe(boardId);
    expect(before.document.getItem(circuitId)).toBeUndefined();
    expect(before.document.getItem(boardId)?.childIds).toEqual([]);

    unsubscribe();
    store.commands.addItem(circuitId, "Contactdoos");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("creates a configured circuit beneath its board as one undoable revision", () => {
    const { store, boardId } = createStore();

    const circuitId = store.commands.addCircuit("main", {
      nameMode: "manueel",
      name: "Keuken",
      protection: "automatisch",
      poleCount: "2",
      amperage: "20",
      hasCable: true,
      cableType: "XVB Cca 3G2,5",
    });

    expect(store.getSnapshot().revision).toBe(1);
    expect(store.getSnapshot().document.getItem(circuitId)).toMatchObject({
      type: "Kring",
      parentId: boardId,
      label: "Kring Keuken",
    });
    expect(store.getSnapshot().properties.getCircuit(circuitId)).toMatchObject({
      name: "Keuken",
      amperage: "20",
      cableType: "XVB Cca 3G2,5",
    });
    expect(store.getSnapshot().placementTasks).toEqual([
      expect.objectContaining({ itemId: circuitId, destination: "board" }),
    ]);

    store.commands.undo();
    expect(store.getSnapshot().document.getItem(circuitId)).toBeUndefined();
  });

  it("resolves the Bord node when main-board metadata starts at Aansluiting", () => {
    const structure = new Hierarchical_List();
    const connection = structure.addItem("Aansluiting");
    const board = structure.createItem("Bord");
    structure.insertChildAfterId(board, connection.id);
    const store = new LegacySchemaStore(structure);

    const circuitId = store.commands.addCircuit("main", { nameMode: "manueel", name: "Wasplaats" });

    expect(store.getSnapshot().document.getItem(circuitId)?.parentId).toBe(board.id);
  });

  it("inserts an item atomically between an existing parent and child", () => {
    const { store, boardId } = createStore();
    const circuitId = store.commands.addItem(boardId, "Kring");
    const lightId = store.commands.addItem(circuitId, "Lichtpunt");

    const socketId = store.commands.insertItemBefore(lightId, "Contactdoos");

    expect(store.getSnapshot().document.getItem(socketId)).toMatchObject({
      type: "Contactdoos",
      parentId: circuitId,
    });
    expect(store.getSnapshot().document.getItem(lightId)?.parentId).toBe(socketId);
    expect(store.getSnapshot().document.getItem(circuitId)?.childIds).toEqual([socketId]);

    store.commands.undo();
    expect(store.getSnapshot().document.getItem(socketId)).toBeUndefined();
    expect(store.getSnapshot().document.getItem(lightId)?.parentId).toBe(circuitId);
  });

  it("adds situation-only symbols beneath the hidden document container", () => {
    const { store } = createStore();

    const symbolId = store.commands.addSituationOnlyItem("Aardingsonderbreker");
    const symbol = store.getLegacyDocument().getElectroItemById(symbolId);
    const container = store.getLegacyDocument().getElectroItemById(symbol?.parent ?? -1);

    expect(symbol?.getType()).toBe("Aardingsonderbreker");
    expect(container?.getType()).toBe("Container");
    expect(store.getSnapshot().canUndo).toBe(true);
    expect(() => store.commands.addSituationOnlyItem("Onbekend")).toThrowError(
      expect.objectContaining({ code: "INVALID_CHILD_TYPE" }),
    );
  });

  it("manages validated manual module placement on board rails", () => {
    const { store, boardId } = createStore();
    const circuitId = store.commands.addItem(boardId, "Kring");
    const secondCircuitId = store.commands.addItem(boardId, "Kring");
    const railId = store.commands.addBoardLayoutRail("main", {
      name: "Bovenste rij",
      moduleCapacity: 18,
    });

    store.commands.placeBoardLayoutItem("main", circuitId, {
      railId,
      startModule: 0,
      moduleWidth: 2,
    });

    expect(store.getSnapshot().boardLayouts).toEqual([{
      boardId: "main",
      rails: [{ id: railId, name: "Bovenste rij", moduleCapacity: 18 }],
      placements: [{ itemId: circuitId, railId, startModule: 0, moduleWidth: 2 }],
    }]);
    expect(() => store.commands.placeBoardLayoutItem("main", secondCircuitId, {
      railId,
      startModule: 1,
      moduleWidth: 1,
    })).toThrowError(expect.objectContaining({ code: "INVALID_BOARD_LAYOUT" }));

    store.commands.placeBoardLayoutItem("main", secondCircuitId, {
      railId,
      startModule: 2,
      moduleWidth: 1,
    });
    expect(() => store.commands.deleteBoardLayoutRail("main", railId)).toThrowError(
      expect.objectContaining({ code: "INVALID_BOARD_LAYOUT" }),
    );
    store.commands.removeBoardLayoutItem("main", secondCircuitId);
    expect(store.getSnapshot().boardLayouts[0].placements).toHaveLength(1);
  });

  it("configures board dimensions atomically and protects occupied positions", () => {
    const { store, boardId } = createStore();
    const circuitId = store.commands.addItem(boardId, "Kring");
    store.commands.configureBoardLayout("main", { moduleCapacity: 12, rowCount: 2 });
    const secondRail = store.getSnapshot().boardLayouts[0].rails[1];
    store.commands.placeBoardLayoutItem("main", circuitId, {
      railId: secondRail.id,
      startModule: 10,
      moduleWidth: 2,
    });

    expect(store.getSnapshot().boardLayouts[0].rails).toHaveLength(2);
    expect(() => store.commands.configureBoardLayout("main", {
      moduleCapacity: 11,
      rowCount: 2,
    })).toThrowError(expect.objectContaining({ code: "INVALID_BOARD_LAYOUT" }));
    expect(() => store.commands.configureBoardLayout("main", {
      moduleCapacity: 12,
      rowCount: 1,
    })).toThrowError(expect.objectContaining({ code: "INVALID_BOARD_LAYOUT" }));
    expect(store.getSnapshot().boardLayouts[0].rails).toHaveLength(2);
    expect(store.getSnapshot().boardLayouts[0].rails[0].moduleCapacity).toBe(12);
  });

  it("updates properties and changes type through the legacy domain factory", () => {
    const { store, boardId } = createStore();
    const circuitId = store.commands.addItem(boardId, "Kring");
    const itemId = store.commands.addItem(circuitId, "Contactdoos");

    store.commands.updateItem(itemId, { aantal: "3", adres: "Garage" });
    expect(store.getSnapshot().document.getItem(itemId)?.summary.address).toBe("Garage");
    expect(store.getLegacyDocument().getElectroItemById(itemId)?.props.aantal).toBe("3");

    store.commands.updateItem(itemId, { type: "Lichtpunt" });
    expect(store.getSnapshot().document.getItem(itemId)?.type).toBe("Lichtpunt");
    expect(store.getSnapshot().document.getItem(itemId)?.parentId).toBe(circuitId);
  });

  it("exposes typed circuit properties without leaking legacy property keys", () => {
    const { store, boardId } = createStore();
    const circuitId = store.commands.addItem(boardId, "Kring");
    const beforeUpdate = store.getSnapshot();
    store.commands.updateItem(circuitId, {
      autoKringNaam: "manueel",
      naam: "Garage",
      bescherming: "differentieelautomaat",
      differentieel_delta_amperage: "30",
      kabel_is_aanwezig: true,
      type_kabel: "XVB Cca 5G6",
    });

    expect(store.getSnapshot().properties.getCircuit(circuitId)).toMatchObject({
      itemId: circuitId,
      nameMode: "manueel",
      name: "Garage",
      protection: "differentieelautomaat",
      differentialCurrent: "30",
      hasCable: true,
      cableType: "XVB Cca 5G6",
    });
    expect(store.getSnapshot().properties.getCircuit(boardId)).toBeUndefined();
    expect(beforeUpdate.properties.getCircuit(circuitId)?.name).not.toBe("Garage");
  });

  it("applies existing circuit invariants before publishing command updates", () => {
    const { store, boardId } = createStore();
    const circuitId = store.commands.addItem(boardId, "Kring");

    store.commands.updateItem(circuitId, {
      bescherming: "contact",
      normaalGesloten: true,
      sturing: "spoel",
      fase: "L2",
      differentieel_is_selectief: true,
      kabel_locatie: "Luchtleiding",
      kabel_is_in_buis: true,
    });

    expect(store.getSnapshot().properties.getCircuit(circuitId)).toMatchObject({
      protection: "contact",
      normallyClosed: true,
      control: "spoel",
      phase: "",
      selectiveDifferential: false,
      cableLocation: "Luchtleiding",
      cableInConduit: false,
    });

    store.commands.updateItem(circuitId, { bescherming: "automatisch" });
    expect(store.getSnapshot().properties.getCircuit(circuitId)).toMatchObject({
      normallyClosed: false,
      control: "",
    });
  });

  it("maps typed circuit commands onto the legacy EDS property model", () => {
    const { store, boardId } = createStore();
    const circuitId = store.commands.addItem(boardId, "Kring");

    store.commands.updateCircuit(circuitId, {
      nameMode: "manueel",
      name: "Werkplaats",
      protection: "automatisch",
      amperage: "16",
      cableType: "XVB Cca 3G2,5",
    });

    expect(store.getSnapshot().properties.getCircuit(circuitId)).toMatchObject({
      nameMode: "manueel",
      name: "Werkplaats",
      protection: "automatisch",
      amperage: "16",
      cableType: "XVB Cca 3G2,5",
    });
    expect(store.getLegacyDocument().getElectroItemById(circuitId)?.props).toMatchObject({
      autoKringNaam: "manueel",
      naam: "Werkplaats",
      bescherming: "automatisch",
      amperage: "16",
      type_kabel: "XVB Cca 3G2,5",
    });
    expectCommandError(() => store.commands.updateCircuit(boardId, { name: "Geen kring" }), "INVALID_CHANGE");
  });

  it("rejects unknown and invalid circuit changes before mutating history", () => {
    const { store, boardId } = createStore();
    const circuitId = store.commands.addItem(boardId, "Kring");
    const before = store.getSnapshot();
    const listener = vi.fn();
    store.subscribe(listener);
    const invalidChanges: unknown[] = [
      { protection: "onbekend" },
      { amperage: "min twintig" },
      { hasCable: "ja" },
      { unknownRuntimeKey: true },
    ];

    for (const changes of invalidChanges) {
      expectCommandError(
        () => store.commands.updateCircuit(circuitId, changes as CircuitPropertyChanges),
        "INVALID_CHANGE",
      );
    }

    expect(listener).not.toHaveBeenCalled();
    expect(store.getSnapshot()).toBe(before);
    expect(store.getSnapshot().properties.getCircuit(circuitId)?.amperage).toBe("20");
  });

  it("exposes immutable typed socket properties and maps socket commands", () => {
    const { store, boardId } = createStore();
    const circuitId = store.commands.addItem(boardId, "Kring");
    const socketId = store.commands.addItem(circuitId, "Contactdoos");
    const beforeUpdate = store.getSnapshot();

    store.commands.updateSocket(socketId, {
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
    });

    expect(store.getSnapshot().properties.getSocket(socketId)).toEqual({
      itemId: socketId,
      numberMode: "manueel",
      number: "G1",
      canEditNumber: true,
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
    });
    expect(beforeUpdate.properties.getSocket(socketId)).toMatchObject({
      grounded: true,
      outletCount: "1",
      address: "",
    });
    expect(store.getLegacyDocument().getElectroItemById(socketId)?.props).toMatchObject({
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
    });
    expect(store.getSnapshot().properties.getSocket(circuitId)).toBeUndefined();
  });

  it("rejects invalid socket changes without publishing or creating history", () => {
    const { store, boardId } = createStore();
    const circuitId = store.commands.addItem(boardId, "Kring");
    const socketId = store.commands.addItem(circuitId, "Contactdoos");
    const before = store.getSnapshot();
    const listener = vi.fn();
    store.subscribe(listener);
    const invalidChanges: unknown[] = [
      { outletCount: "7" },
      { phaseCount: "4" },
      { grounded: "ja" },
      { unknownRuntimeKey: true },
    ];

    for (const changes of invalidChanges) {
      expectCommandError(
        () => store.commands.updateSocket(socketId, changes as SocketPropertyChanges),
        "INVALID_CHANGE",
      );
    }

    expect(listener).not.toHaveBeenCalled();
    expect(store.getSnapshot()).toBe(before);
    expectCommandError(() => store.commands.updateSocket(circuitId, { grounded: false }), "INVALID_CHANGE");
  });

  it("maps and validates the shared numbered-consumer contract", () => {
    const { store, boardId } = createStore();
    const circuitId = store.commands.addItem(boardId, "Kring");
    const consumerId = store.commands.addItem(circuitId, "Wasmachine");
    const before = store.getSnapshot();

    store.commands.updateBasicConsumer(consumerId, {
      numberMode: "manueel",
      number: "W1",
      address: "Wasplaats",
    });

    expect(store.getSnapshot().properties.getBasicConsumer(consumerId)).toMatchObject({
      type: "Wasmachine",
      numberMode: "manueel",
      number: "W1",
      address: "Wasplaats",
    });
    expect(before.properties.getBasicConsumer(consumerId)?.address).toBe("");
    expect(store.getLegacyDocument().getElectroItemById(consumerId)?.props).toMatchObject({
      autonr: "manueel",
      nr: "W1",
      adres: "Wasplaats",
    });
    expectCommandError(
      () => store.commands.updateBasicConsumer(
        consumerId,
        { unknown: true } as unknown as BasicConsumerPropertyChanges,
      ),
      "INVALID_CHANGE",
    );
    expectCommandError(
      () => store.commands.updateBasicConsumer(circuitId, { address: "Niet geldig" }),
      "INVALID_CHANGE",
    );
  });

  it("maps and validates typed light-point commands", () => {
    const { store, boardId } = createStore();
    const circuitId = store.commands.addItem(boardId, "Kring");
    const lightId = store.commands.addItem(circuitId, "Lichtpunt");

    store.commands.updateLightPoint(lightId, {
      lampType: "TL",
      tubeCount: "3",
      count: "4",
      wallLight: true,
      emergencyLighting: "Decentraal",
    });
    expect(store.getSnapshot().properties.getLightPoint(lightId)).toMatchObject({
      lampType: "TL",
      tubeCount: "3",
      count: "4",
      wallLight: true,
      emergencyLighting: "Decentraal",
    });
    expectCommandError(
      () => store.commands.updateLightPoint(lightId, { count: "21" } as never),
      "INVALID_CHANGE",
    );
    expectCommandError(
      () => store.commands.updateLightPoint(circuitId, { wallLight: true }),
      "INVALID_CHANGE",
    );
  });

  it("deletes a subtree and restores it through undo and redo", () => {
    const { store, boardId } = createStore();
    const circuitId = store.commands.addItem(boardId, "Kring");
    const itemId = store.commands.addItem(circuitId, "Contactdoos");
    store.commands.deleteItem(circuitId);

    expect(store.getSnapshot().document.getItem(circuitId)).toBeUndefined();
    expect(store.getSnapshot().document.getItem(itemId)).toBeUndefined();

    store.commands.undo();
    expect(store.getSnapshot().document.getItem(circuitId)?.type).toBe("Kring");
    expect(store.getSnapshot().document.getItem(itemId)?.parentId).toBe(circuitId);
    expect(store.getSnapshot().canRedo).toBe(true);

    store.commands.redo();
    expect(store.getSnapshot().document.getItem(circuitId)).toBeUndefined();
    expect(store.getSnapshot().canRedo).toBe(false);
  });

  it("clears redo history after a new command", () => {
    const { store, boardId } = createStore();
    store.commands.addItem(boardId, "Kring");
    store.commands.undo();
    expect(store.getSnapshot().canRedo).toBe(true);

    store.commands.addItem(boardId, "Kring");
    expect(store.getSnapshot().canRedo).toBe(false);
  });

  it("duplicates an entire subtree with new IDs", () => {
    const { store, boardId } = createStore();
    const circuitId = store.commands.addItem(boardId, "Kring");
    const socketId = store.commands.addItem(circuitId, "Contactdoos");
    store.commands.addItem(socketId, "Verbruiker");

    const duplicateId = store.commands.duplicateItem(socketId);
    const duplicate = store.getSnapshot().document.getItem(duplicateId)!;

    expect(duplicate.type).toBe("Contactdoos");
    expect(duplicate.parentId).toBe(circuitId);
    expect(duplicate.childIds).toHaveLength(1);
    expect(duplicate.childIds[0]).not.toBe(socketId);
    expect(store.getSnapshot().document.getItem(duplicate.childIds[0])?.type).toBe("Verbruiker");
  });

  it("changes item types and expands composite items through dedicated commands", () => {
    const { store, boardId } = createStore();
    const circuitId = store.commands.addItem(boardId, "Kring");
    const itemId = store.commands.addItem(circuitId, "Contactdoos");

    store.commands.changeItemType(itemId, "Lichtcircuit");
    store.commands.updateConfiguredItem(itemId, { lightCount: "2" });
    expect(store.getSnapshot().document.getItem(itemId)).toMatchObject({
      type: "Lichtcircuit",
      capabilities: { canExpand: true },
    });

    store.commands.expandItem(itemId);
    const circuitChildren = store.getSnapshot().document.getChildren(circuitId);
    expect(circuitChildren.some((item) => item.type === "Schakelaars")).toBe(true);
    expect(store.getSnapshot().document.getAllItems().some((item) => item.type === "Lichtpunt")).toBe(true);

    store.commands.undo();
    expect(store.getSnapshot().document.getItem(itemId)?.type).toBe("Lichtcircuit");
    expectCommandError(() => store.commands.expandItem(circuitId), "INVALID_CHANGE");
  });

  it("moves items between parents and to a requested sibling position", () => {
    const { store, boardId } = createStore();
    const firstCircuit = store.commands.addItem(boardId, "Kring");
    const secondCircuit = store.commands.addItem(boardId, "Kring");
    const firstItem = store.commands.addItem(firstCircuit, "Contactdoos");
    const secondItem = store.commands.addItem(firstCircuit, "Lichtpunt");

    store.commands.moveItem(secondItem, { targetParentId: firstCircuit, position: 0 });
    expect(store.getSnapshot().document.getItem(firstCircuit)?.childIds).toEqual([secondItem, firstItem]);

    store.commands.moveItem(firstItem, { targetParentId: secondCircuit });
    expect(store.getSnapshot().document.getItem(firstItem)?.parentId).toBe(secondCircuit);
    expect(store.getSnapshot().document.getItem(firstCircuit)?.childIds).toEqual([secondItem]);
  });

  it("creates a first-class secondary board and preserves it through undo and redo", () => {
    const { store, boardId } = createStore();
    const feederId = store.commands.addItem(boardId, "Kring");

    const garageBoardId = store.commands.addDistributionBoard(feederId, {
      name: "Garage",
      location: "Achterbouw",
      cableType: "XVB",
      conductorSection: "5G6",
      lengthMeters: 18,
    });

    const board = store.getSnapshot().document.getBoard(garageBoardId);
    expect(board).toMatchObject({
      id: garageBoardId,
      name: "Garage",
      location: "Achterbouw",
      feeder: {
        sourceBoardId: "main",
        sourceCircuitId: feederId,
        cableType: "XVB",
        conductorSection: "5G6",
        lengthMeters: 18,
      },
    });
    const [boardRoot] = store.getSnapshot().document.getBoardRootItems(garageBoardId);
    expect(boardRoot).toMatchObject({ type: "Bord", parentId: feederId });
    expect(store.getSnapshot().document.getBoardForItem(boardRoot.id)?.id).toBe(garageBoardId);

    store.commands.undo();
    expect(store.getSnapshot().document.getBoard(garageBoardId)).toBeUndefined();
    expect(store.getSnapshot().document.getItem(boardRoot.id)).toBeUndefined();
    store.commands.redo();
    expect(store.getSnapshot().document.getBoard(garageBoardId)?.feeder?.sourceCircuitId).toBe(feederId);
  });

  it("updates persistent document details through undoable commands", () => {
    const { store } = createStore();
    store.commands.updateDocumentDetails({
      owner: "Jan Janssens<br>Brussel",
      installer: "Installateur NV",
      control: "Keuringsorganisme",
      info: "3 x 400V + N ~50 Hz",
    });
    expect(store.getSnapshot().document.getDocumentDetails()).toEqual({
      owner: "Jan Janssens<br>Brussel",
      installer: "Installateur NV",
      control: "Keuringsorganisme",
      info: "3 x 400V + N ~50 Hz",
      dossier: {
        installationContext: "existing",
        installationAddress: "",
        nominalVoltage: "",
        currentNature: "",
        frequencyHz: "",
        revisionLabel: "",
        issueDate: "",
      },
    });
    store.commands.undo();
    expect(store.getSnapshot().document.getDocumentDetails().owner).not.toContain("Jan Janssens");
    store.commands.redo();
    expect(store.getSnapshot().document.getDocumentDetails().owner).toContain("Jan Janssens");
  });

  it("updates a board feeder while preventing duplicate and cyclic connections", () => {
    const { store, boardId } = createStore();
    const firstFeeder = store.commands.addItem(boardId, "Kring");
    const secondFeeder = store.commands.addItem(boardId, "Kring");
    const garageId = store.commands.addDistributionBoard(firstFeeder, { name: "Garage" });
    const garageRootId = store.getSnapshot().document.getBoard(garageId)!.rootItemIds[0];
    const garageCircuitId = store.commands.addItem(garageRootId, "Kring");
    const shedId = store.commands.addDistributionBoard(garageCircuitId, { name: "Tuinhuis" });
    const shedRootId = store.getSnapshot().document.getBoard(shedId)!.rootItemIds[0];
    const shedCircuitId = store.commands.addItem(shedRootId, "Kring");

    store.commands.updateDistributionBoard(garageId, {
      sourceCircuitId: secondFeeder,
      name: "Garage vernieuwd",
      location: "Garage",
    });
    expect(store.getSnapshot().document.getBoard(garageId)).toMatchObject({
      name: "Garage vernieuwd",
      feeder: { sourceCircuitId: secondFeeder, sourceBoardId: "main" },
    });
    expect(store.getSnapshot().document.getItem(garageRootId)?.parentId).toBe(secondFeeder);

    expectCommandError(
      () => store.commands.addDistributionBoard(secondFeeder, { name: "Dubbel" }),
      "INVALID_BOARD_FEEDER",
    );
    expectCommandError(
      () => store.commands.updateDistributionBoard(garageId, { sourceCircuitId: shedCircuitId }),
      "INVALID_BOARD_FEEDER",
    );
  });

  it("prevents generic mutations from silently orphaning boards", () => {
    const { store, boardId } = createStore();
    const feederId = store.commands.addItem(boardId, "Kring");
    const garageId = store.commands.addDistributionBoard(feederId, { name: "Garage" });
    const garageRootId = store.getSnapshot().document.getBoard(garageId)!.rootItemIds[0];

    expectCommandError(() => store.commands.deleteItem(feederId), "BOARD_DEPENDENCY");
    expectCommandError(() => store.commands.deleteItem(garageRootId), "BOARD_DEPENDENCY");
    expectCommandError(
      () => store.commands.moveItem(garageRootId, { targetParentId: boardId }),
      "BOARD_DEPENDENCY",
    );
    expectCommandError(() => store.commands.changeItemType(garageRootId, "Kring"), "BOARD_DEPENDENCY");
    expectCommandError(() => store.commands.deleteDistributionBoard("main"), "BOARD_DEPENDENCY");

    store.commands.deleteDistributionBoard(garageId);
    expect(store.getSnapshot().document.getBoard(garageId)).toBeUndefined();
    expect(store.getSnapshot().document.getItem(garageRootId)).toBeUndefined();
    store.commands.undo();
    expect(store.getSnapshot().document.getBoard(garageId)?.name).toBe("Garage");
  });

  it("rejects missing items, invalid child types, cycles, and full parents", () => {
    const { store, boardId } = createStore();
    const circuitId = store.commands.addItem(boardId, "Kring");
    const socketId = store.commands.addItem(circuitId, "Contactdoos");
    const consumerId = store.commands.addItem(socketId, "Verbruiker");

    expectCommandError(() => store.commands.deleteItem(999_999), "ITEM_NOT_FOUND");
    expectCommandError(() => store.commands.addItem(boardId, "Contactdoos"), "INVALID_CHILD_TYPE");
    expectCommandError(
      () => store.commands.moveItem(circuitId, { targetParentId: consumerId }),
      "CYCLIC_PARENT",
    );
    expectCommandError(() => store.commands.addItem(socketId, "Verbruiker"), "MAX_CHILDREN_REACHED");
    expectCommandError(
      () => store.commands.moveItem(consumerId, { targetParentId: circuitId, position: -1 }),
      "INVALID_POSITION",
    );
  });

  it("does not publish or create history entries when validation fails", () => {
    const { store, boardId } = createStore();
    const listener = vi.fn();
    store.subscribe(listener);
    const before = store.getSnapshot();

    expectCommandError(() => store.commands.addItem(boardId, "Onbekend"), "INVALID_CHILD_TYPE");

    expect(listener).not.toHaveBeenCalled();
    expect(store.getSnapshot()).toBe(before);
    expect(store.getSnapshot().canUndo).toBe(false);
  });

  it("rolls the complete document back when normalization fails", () => {
    const { store, boardId } = createStore();
    const listener = vi.fn();
    store.subscribe(listener);
    const before = store.getSnapshot();
    const originalRenumber = store.getLegacyDocument().reNumber;
    store.getLegacyDocument().reNumber = () => {
      throw new Error("normalization failed");
    };

    expect(() => store.commands.addItem(boardId, "Kring")).toThrow("normalization failed");

    expect(listener).not.toHaveBeenCalled();
    expect(store.getSnapshot().revision).toBe(before.revision);
    expect(store.getSnapshot().document.getItem(boardId)?.childIds).toEqual([]);
    expect(store.getSnapshot().canUndo).toBe(false);

    // The failed working document was disposed and replaced by its snapshot.
    expect(store.getLegacyDocument().reNumber).toBe(originalRenumber);
  });

  it("replaces an imported document explicitly and starts a fresh history", () => {
    const { store, boardId } = createStore();
    store.commands.addItem(boardId, "Kring");
    expect(store.getSnapshot().canUndo).toBe(true);

    const imported = new Hierarchical_List();
    const importedBoard = imported.addItem("Bord");
    importedBoard.props.naam = "Garage";
    const listener = vi.fn();
    store.subscribe(listener);

    store.commands.replaceDocument(imported.toJsonObject(false));

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot().document.getAllItems()).toHaveLength(1);
    expect(store.getSnapshot().document.getItem(importedBoard.id)?.summary.name).toBe("Garage");
    expect(store.getSnapshot().canUndo).toBe(false);
    expect(store.getSnapshot().canRedo).toBe(false);
  });

  it("refreshes subscribers after a legacy mutation without claiming its undo history", () => {
    const { store, boardId } = createStore();
    const listener = vi.fn();
    store.subscribe(listener);

    const legacyCircuit = store.getLegacyDocument().createItem("Kring");
    store.getLegacyDocument().insertChildAfterId(legacyCircuit, boardId);
    store.synchronizeLegacyDocument(store.getLegacyDocument());

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot().document.getItem(legacyCircuit.id)?.parentId).toBe(boardId);
    expect(store.getSnapshot().canUndo).toBe(false);

    store.synchronizeLegacyDocument(store.getLegacyDocument());
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("adopts a document replaced by legacy import code", () => {
    const { store } = createStore();
    const imported = new Hierarchical_List();
    const importedBoard = imported.addItem("Bord");
    importedBoard.props.naam = "Werkplaats";

    store.synchronizeLegacyDocument(imported);

    expect(store.getLegacyDocument()).toBe(imported);
    expect(store.getSnapshot().document.getItem(importedBoard.id)?.summary.name).toBe("Werkplaats");
    expect(store.getSnapshot().canUndo).toBe(false);
  });
});
