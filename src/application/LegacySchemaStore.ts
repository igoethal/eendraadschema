import { Hierarchical_List, PUBLIC_ELECTRO_ITEM_TYPES } from "../Hierarchical_List";
import { Electro_Item } from "../List_Item/Electro_Item";
import {
  boardConnectionCreatesCycle,
  findBoardIdForItem,
  type BoardFeeder,
  type DistributionBoard,
} from "../domain/DistributionBoard";
import { structureFromJson } from "../legacy/persistence/EdsCodec";
import { DocumentSnapshotHistory } from "./DocumentSnapshotHistory";
import { validateAndMapCircuitChanges } from "./CircuitPropertyValidation";
import { validateAndMapSocketChanges } from "./SocketPropertyValidation";
import {
  basicConsumerTypes,
  validateAndMapBasicConsumerChanges,
} from "./BasicConsumerPropertyValidation";
import { validateAndMapLightPointChanges } from "./LightPointPropertyValidation";
import { configuredItemTypes, type ConfiguredItemPropertyChanges } from "./ConfiguredItemProperties";
import { freezeBoardLayout, type BoardLayout } from "../domain/BoardLayout";
import { validateAndMapConfiguredItemChanges } from "./ConfiguredItemPropertyValidation";
import { OMSCHAKELAAR_SLOT_ORDER } from "./Omschakelaar";
import { LegacySchemaDocumentReader } from "./LegacySchemaDocumentReader";
import { LegacySchemaPropertyReader } from "./LegacySchemaPropertyReader";
import { validateSchemaDocument } from "./SchemaValidation";
import { parseDossierMetadata, type PlacementTaskDestination } from "../domain/Dossier";
import { getItemPresentation } from "./InstallationItemPolicy";
import type {
  BasicConsumerPropertyChanges,
  CircuitPropertyChanges,
  SocketPropertyChanges,
  LightPointPropertyChanges,
} from "./SchemaPropertyReader";
import {
  SchemaCommandError,
  type MoveItemOptions,
  type AddDistributionBoardProperties,
  type AddBoardLayoutRailProperties,
  type ConfigureBoardLayoutProperties,
  type PlaceBoardLayoutItemProperties,
  type SchemaCommands,
  type SchemaSnapshot,
  type SchemaStore,
  type UpdateDistributionBoardChanges,
  type UpdateDocumentDetailsChanges,
  type UpdateFileSettingsChanges,
  type UpdateBoardLayoutRailChanges,
  type AgentGraphOperation,
  type UpdateDossierMetadataChanges,
} from "./SchemaStore";

const BLOCKED_CHANGE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

export class LegacySchemaStore implements SchemaStore {
  private structure: Hierarchical_List;
  private readonly listeners = new Set<() => void>();
  private readonly history: DocumentSnapshotHistory;
  private serializedSnapshot: string;
  private revision = 0;
  private snapshot: SchemaSnapshot;

  readonly commands: SchemaCommands;

  constructor(structure: Hierarchical_List, maxHistorySteps: number = 100) {
    this.structure = structure;
    this.serializedSnapshot = this.serialize();
    this.history = new DocumentSnapshotHistory(this.serializedSnapshot, maxHistorySteps);
    this.snapshot = this.createSnapshot();
    this.commands = Object.freeze({
      addItem: this.addItem.bind(this),
      addCircuit: this.addCircuit.bind(this),
      insertItemBefore: this.insertItemBefore.bind(this),
      addSituationOnlyItem: this.addSituationOnlyItem.bind(this),
      deleteItem: this.deleteItem.bind(this),
      moveItem: this.moveItem.bind(this),
      changeItemType: this.changeItemType.bind(this),
      updateItem: this.updateItem.bind(this),
      updateCircuit: this.updateCircuit.bind(this),
      updateSocket: this.updateSocket.bind(this),
      updateBasicConsumer: this.updateBasicConsumer.bind(this),
      updateLightPoint: this.updateLightPoint.bind(this),
      updateConfiguredItem: this.updateConfiguredItem.bind(this),
      duplicateItem: this.duplicateItem.bind(this),
      expandItem: this.expandItem.bind(this),
      addDistributionBoard: this.addDistributionBoard.bind(this),
      updateDistributionBoard: this.updateDistributionBoard.bind(this),
      deleteDistributionBoard: this.deleteDistributionBoard.bind(this),
      updateDocumentDetails: this.updateDocumentDetails.bind(this),
      updateFileSettings: this.updateFileSettings.bind(this),
      updateDossierMetadata: this.updateDossierMetadata.bind(this),
      createPlacementTask: this.createPlacementTask.bind(this),
      resolvePlacementTask: this.resolvePlacementTask.bind(this),
      addBoardLayoutRail: this.addBoardLayoutRail.bind(this),
      configureBoardLayout: this.configureBoardLayout.bind(this),
      updateBoardLayoutRail: this.updateBoardLayoutRail.bind(this),
      deleteBoardLayoutRail: this.deleteBoardLayoutRail.bind(this),
      placeBoardLayoutItem: this.placeBoardLayoutItem.bind(this),
      removeBoardLayoutItem: this.removeBoardLayoutItem.bind(this),
      applyAgentChangeSet: this.applyAgentChangeSet.bind(this),
      replaceDocument: this.replaceDocument.bind(this),
      undo: this.undo.bind(this),
      redo: this.redo.bind(this),
    });
  }

  getSnapshot(): SchemaSnapshot {
    return this.snapshot;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Legacy integration seam for SVG, persistence, and print adapters. */
  getLegacyDocument(): Hierarchical_List {
    return this.structure;
  }

  /**
   * Transitional seam for legacy handlers that still mutate or replace the
   * authoritative document outside SchemaCommands. It refreshes subscribers
   * but deliberately starts a fresh command history: the store must never
   * claim it can undo a mutation that belongs to the legacy undo controller.
   */
  synchronizeLegacyDocument(structure: Hierarchical_List): void {
    const serialized = structure.toJsonObject(false);
    if (structure === this.structure && serialized === this.serializedSnapshot) return;

    this.structure = structure;
    this.serializedSnapshot = serialized;
    this.history.reset(serialized);
    this.publish();
  }

  private addItem(parentId: number | null, type: string): number {
    this.assertPublicItemType(type);
    const parent = this.getParent(parentId);
    this.assertChildAllowed(parent, type);
    this.assertParentCapacity(parent);

    return this.commitTransaction(() => {
      let item: Electro_Item;
      if (parent === null) {
        item = this.structure.addItem(type);
      } else {
        const placeholder = this.structure.createItem("");
        this.structure.insertChildAfterId(placeholder, parent.id);
        this.structure.adjustTypeById(placeholder.id, type);
        item = this.requireItem(placeholder.id);
      }

      if (item.getType() === "Omschakelaar") {
        for (const poort of [...OMSCHAKELAAR_SLOT_ORDER].reverse()) {
          const connector = this.structure.createItem("Omschakelaarpoort");
          connector.props.poort = poort;
          this.structure.insertChildAfterId(connector, item.id);
        }
      }

      this.createRequiredPlacementTask(item.id, item.getType());
      return item.id;
    });
  }

  private addCircuit(boardId: string, changes: Readonly<CircuitPropertyChanges>): number {
    const board = this.requireBoard(boardId);
    const document = new LegacySchemaDocumentReader(this.structure);
    const parentNode = document.getAllItems().find((item) => (
      item.type === "Bord"
      && document.getBoardForItem(item.id)?.id === boardId
      && item.capabilities.allowedChildTypes.includes("Kring")
    ));
    const parent = parentNode ? this.requireItem(parentNode.id) : undefined;
    if (!parent) {
      throw new SchemaCommandError(
        "INVALID_CHILD_TYPE",
        `Bord '${board.name}' heeft geen bordelement waaronder een kring kan worden toegevoegd.`,
      );
    }
    this.assertParentCapacity(parent);
    const legacyChanges = validateAndMapCircuitChanges(changes);

    return this.commitTransaction(() => {
      const placeholder = this.structure.createItem("");
      this.structure.insertChildAfterId(placeholder, parent.id);
      this.structure.adjustTypeById(placeholder.id, "Kring");
      const circuit = this.requireItem(placeholder.id);
      for (const [key, value] of Object.entries(legacyChanges)) circuit.props[key] = value;
      circuit.normalizeProperties();
      this.createRequiredPlacementTask(circuit.id, circuit.getType());
      return circuit.id;
    });
  }

  private insertItemBefore(itemId: number, type: string): number {
    this.assertPublicItemType(type);
    const item = this.requireItem(itemId);
    this.assertUserEditable(item);
    this.assertNotBoardRoot(itemId);
    const parent = this.getParent(item.parent === 0 ? null : item.parent);
    if (parent === null) {
      throw new SchemaCommandError("INVALID_CHANGE", "Voor een hoofdelement kan niets worden ingevoegd.");
    }
    this.assertChildAllowed(parent, type);

    const candidate = this.structure.createItem(type);
    candidate.parent = parent.id;
    if (!candidate.allowedChilds().includes(item.getType()) || candidate.getMaxNumChilds() < 1) {
      throw new SchemaCommandError(
        "INVALID_CHILD_TYPE",
        `Itemtype '${type}' kan niet vóór ${item.getType()} worden ingevoegd.`,
      );
    }

    return this.commitTransaction(() => {
      const newItemId = this.structure.curid;
      const placeholder = this.structure.createItem("");
      this.structure.insertItemBeforeId(placeholder, item.id);
      this.structure.adjustTypeById(newItemId, type);
      item.parent = newItemId;
      this.structure.reSort();
      return newItemId;
    });
  }

  private addSituationOnlyItem(type: string): number {
    if (!PUBLIC_ELECTRO_ITEM_TYPES.includes(type)) {
      throw new SchemaCommandError("INVALID_CHILD_TYPE", `Onbekend situatiesymbool '${type}'.`);
    }

    return this.commitTransaction(() => {
      const container = this.structure.createContainerIfNotExists();
      const item = this.structure.createItem(type);
      this.structure.insertChildAfterId(item, container.id);
      return item.id;
    });
  }

  private deleteItem(itemId: number): void {
    const item = this.requireItem(itemId);
    this.assertUserEditable(item);
    this.assertNoBoardDependencyInSubtree(itemId);
    const deletedItemIds = this.collectSubtreeIds(itemId);
    this.commitTransaction(() => {
      this.structure.boardLayouts = this.structure.boardLayouts.map(layout => ({
        ...layout,
        placements: layout.placements.filter(placement => !deletedItemIds.has(placement.itemId)),
      }));
      this.structure.placementTasks = this.structure.placementTasks.filter(task => !deletedItemIds.has(task.itemId));
      this.structure.deleteById(itemId);
    });
  }

  private moveItem(itemId: number, options: MoveItemOptions): void {
    const item = this.requireItem(itemId);
    this.assertUserEditable(item);
    this.assertNotBoardRoot(itemId);

    if (options.position !== undefined && (!Number.isInteger(options.position) || options.position < 0)) {
      throw new SchemaCommandError("INVALID_POSITION", "De doelpositie moet een positief geheel getal zijn.");
    }

    const targetParent = this.getParent(options.targetParentId);
    if (targetParent?.id === item.id) {
      throw new SchemaCommandError("CYCLIC_PARENT", "Een item kan niet zijn eigen ouder worden.");
    }
    this.assertNoCycle(item.id, targetParent);
    this.assertChildAllowed(targetParent, item.getType());

    const legacyTargetParentId = targetParent?.id ?? 0;
    if (item.parent !== legacyTargetParentId) this.assertParentCapacity(targetParent);

    this.commitTransaction(() => {
      item.parent = legacyTargetParentId;
      this.structure.reSort();
      this.moveToSiblingPosition(item.id, options.position);
      this.removePlacementsOutsideTheirBoard();
    });
  }

  private updateItem(itemId: number, changes: Readonly<Record<string, unknown>>): void {
    let item = this.requireItem(itemId);
    this.assertUserEditable(item);
    for (const key of Object.keys(changes)) {
      if (BLOCKED_CHANGE_KEYS.has(key)) {
        throw new SchemaCommandError("INVALID_CHANGE", `Eigenschap '${key}' kan niet worden aangepast.`);
      }
    }

    const hasTypeChange = Object.prototype.hasOwnProperty.call(changes, "type");
    const changedType = hasTypeChange
      ? changes.type
      : undefined;
    if (hasTypeChange) {
      this.assertNotBoardRoot(itemId);
      if (typeof changedType !== "string") {
        throw new SchemaCommandError("INVALID_CHANGE", "Het itemtype moet tekst zijn.");
      }
      if (
        changedType !== item.getType()
        && (item.getType() === "Omschakelaar" || changedType === "Omschakelaar")
      ) {
        throw new SchemaCommandError(
          "INVALID_CHANGE",
          "Een omschakelaar moet als volledig onderdeel worden toegevoegd of verwijderd.",
        );
      }
      this.assertPublicItemType(changedType);
      const parent = this.getParent(item.parent === 0 ? null : item.parent);
      this.assertChildAllowed(parent, changedType);
    }

    this.commitTransaction(() => {
      if (typeof changedType === "string" && changedType !== item.getType()) {
        this.structure.adjustTypeById(itemId, changedType);
        item = this.requireItem(itemId);
        this.createRequiredPlacementTask(itemId, item.getType());
      }
      for (const [key, value] of Object.entries(changes)) {
        if (key !== "type") item.props[key] = value;
      }
      item.normalizeProperties();
    });
  }

  private changeItemType(itemId: number, type: string): void {
    if (type.trim() === "") {
      throw new SchemaCommandError("INVALID_CHANGE", "Het itemtype mag niet leeg zijn.");
    }
    this.updateItem(itemId, { type });
  }

  private updateCircuit(itemId: number, changes: Readonly<CircuitPropertyChanges>): void {
    const item = this.requireItem(itemId);
    if (item.getType() !== "Kring") {
      throw new SchemaCommandError("INVALID_CHANGE", `Item ${itemId} is geen kring.`);
    }

    const legacyChanges = validateAndMapCircuitChanges(changes);
    if (Object.keys(legacyChanges).length === 0) return;
    this.updateItem(itemId, legacyChanges);
  }

  private updateSocket(itemId: number, changes: Readonly<SocketPropertyChanges>): void {
    const item = this.requireItem(itemId);
    if (item.getType() !== "Contactdoos") {
      throw new SchemaCommandError("INVALID_CHANGE", `Item ${itemId} is geen contactdoos.`);
    }

    const legacyChanges = validateAndMapSocketChanges(changes);
    if (Object.keys(legacyChanges).length === 0) return;
    this.updateItem(itemId, legacyChanges);
  }

  private updateBasicConsumer(
    itemId: number,
    changes: Readonly<BasicConsumerPropertyChanges>,
  ): void {
    const item = this.requireItem(itemId);
    if (!basicConsumerTypes.has(item.getType())) {
      throw new SchemaCommandError("INVALID_CHANGE", `Item ${itemId} gebruikt geen basiseigenschappen.`);
    }
    const legacyChanges = validateAndMapBasicConsumerChanges(changes);
    if (Object.keys(legacyChanges).length === 0) return;
    this.updateItem(itemId, legacyChanges);
  }

  private updateLightPoint(itemId: number, changes: Readonly<LightPointPropertyChanges>): void {
    const item = this.requireItem(itemId);
    if (item.getType() !== "Lichtpunt") {
      throw new SchemaCommandError("INVALID_CHANGE", `Item ${itemId} is geen lichtpunt.`);
    }
    const legacyChanges = validateAndMapLightPointChanges(changes);
    if (Object.keys(legacyChanges).length === 0) return;
    this.updateItem(itemId, legacyChanges);
  }

  private updateConfiguredItem(itemId: number, changes: ConfiguredItemPropertyChanges): void {
    const item = this.requireItem(itemId);
    const type = item.getType();
    if (!configuredItemTypes.has(type)) {
      throw new SchemaCommandError("INVALID_CHANGE", `Item ${itemId} gebruikt geen geconfigureerde eigenschappen.`);
    }
    const legacyChanges = validateAndMapConfiguredItemChanges(type, changes);
    if (Object.keys(legacyChanges).length === 0) return;
    this.updateItem(itemId, legacyChanges);
  }

  private duplicateItem(itemId: number): number {
    const item = this.requireItem(itemId);
    this.assertUserEditable(item);
    this.assertNotBoardRoot(itemId);
    if (!item.checkInsertSibling()) {
      throw new SchemaCommandError("MAX_CHILDREN_REACHED", "De ouder van dit item laat geen extra kinderen toe.");
    }

    return this.commitTransaction(() => {
      const duplicateId = this.structure.curid;
      this.structure.clone(itemId);
      if (this.structure.getElectroItemById(duplicateId) === null) {
        throw new SchemaCommandError("INVALID_CHANGE", "Het item kon niet worden gedupliceerd.");
      }
      this.createRequiredPlacementTask(duplicateId, this.requireItem(duplicateId).getType());
      return duplicateId;
    });
  }

  private expandItem(itemId: number): void {
    const item = this.requireItem(itemId);
    this.assertUserEditable(item);
    if (!item.isExpandable()) {
      throw new SchemaCommandError("INVALID_CHANGE", `Item ${itemId} kan niet worden uitgepakt.`);
    }
    this.commitTransaction(() => {
      item.expand();
      this.structure.reSort();
    });
  }

  private addDistributionBoard(
    feederCircuitId: number,
    properties: AddDistributionBoardProperties,
  ): string {
    const name = this.requireBoardName(properties.name);
    const { circuit, sourceBoardId } = this.requireAvailableFeeder(feederCircuitId);
    this.assertParentCapacity(circuit);

    return this.commitTransaction(() => {
      const placeholder = this.structure.createItem("");
      this.structure.insertChildAfterId(placeholder, circuit.id);
      this.structure.adjustTypeById(placeholder.id, "Bord");
      const boardItem = this.requireItem(placeholder.id);
      boardItem.props.naam = name;
      boardItem.props.adres = this.optionalBoardText(properties.location) ?? "";

      const boardId = this.uniqueBoardId(`board-${boardItem.id}`);
      this.structure.boards = [...this.structure.boards, {
        id: boardId,
        name,
        location: this.optionalBoardText(properties.location),
        feeder: this.createFeeder(sourceBoardId, feederCircuitId, properties),
        rootItemIds: [boardItem.id],
      }];
      return boardId;
    });
  }

  private updateDistributionBoard(
    boardId: string,
    changes: UpdateDistributionBoardChanges,
  ): void {
    const board = this.requireBoard(boardId);
    if (!board.feeder && changes.sourceCircuitId !== undefined) {
      throw new SchemaCommandError("INVALID_BOARD_FEEDER", "Het hoofdbord kan geen voeding vanuit een ander bord krijgen.");
    }

    const name = changes.name === undefined ? board.name : this.requireBoardName(changes.name);
    let feeder = board.feeder;
    let targetCircuit: Electro_Item | undefined;
    if (changes.sourceCircuitId !== undefined) {
      const available = this.requireAvailableFeeder(changes.sourceCircuitId, boardId);
      if (boardConnectionCreatesCycle(this.structure.boards, boardId, available.sourceBoardId)) {
        throw new SchemaCommandError("INVALID_BOARD_FEEDER", "Deze voeding zou een cyclus tussen verdeelborden maken.");
      }
      targetCircuit = available.circuit;
      feeder = this.createFeeder(available.sourceBoardId, changes.sourceCircuitId, {
        cableType: changes.cableType ?? board.feeder?.cableType,
        conductorSection: changes.conductorSection ?? board.feeder?.conductorSection,
        lengthMeters: changes.lengthMeters ?? board.feeder?.lengthMeters,
      });
    } else if (feeder) {
      feeder = this.createFeeder(feeder.sourceBoardId, feeder.sourceCircuitId, {
        cableType: changes.cableType ?? feeder.cableType,
        conductorSection: changes.conductorSection ?? feeder.conductorSection,
        lengthMeters: changes.lengthMeters ?? feeder.lengthMeters,
      });
    }

    this.commitTransaction(() => {
      if (targetCircuit) {
        for (const rootItemId of board.rootItemIds) this.requireItem(rootItemId).parent = targetCircuit.id;
      }
      for (const rootItemId of board.rootItemIds) {
        const rootItem = this.requireItem(rootItemId);
        if (rootItem.getType() === "Bord") {
          rootItem.props.naam = name;
          if (changes.location !== undefined) rootItem.props.adres = this.optionalBoardText(changes.location) ?? "";
        }
      }
      this.structure.boards = this.structure.boards.map((candidate) => candidate.id === boardId
        ? {
            ...candidate,
            name,
            location: changes.location === undefined
              ? candidate.location
              : this.optionalBoardText(changes.location),
            feeder,
          }
        : candidate);
      this.structure.reSort();
    });
  }

  private deleteDistributionBoard(boardId: string): void {
    const board = this.requireBoard(boardId);
    if (!board.feeder) {
      throw new SchemaCommandError("BOARD_DEPENDENCY", "Het hoofdbord kan niet worden verwijderd.");
    }
    if (this.structure.boards.some((candidate) => candidate.feeder?.sourceBoardId === boardId)) {
      throw new SchemaCommandError("BOARD_DEPENDENCY", "Verwijder eerst de verdeelborden die vanuit dit bord worden gevoed.");
    }
    this.commitTransaction(() => {
      for (const rootItemId of board.rootItemIds) {
        if (this.structure.getElectroItemById(rootItemId) !== null) this.structure.deleteById(rootItemId);
      }
      this.structure.boards = this.structure.boards.filter((candidate) => candidate.id !== boardId);
      this.structure.boardLayouts = this.structure.boardLayouts.filter(layout => layout.boardId !== boardId);
    });
  }

  private updateDocumentDetails(changes: UpdateDocumentDetailsChanges): void {
    for (const [key, value] of Object.entries(changes)) {
      if (!(["owner", "installer", "control", "info"] as const).includes(key as never)
          || typeof value !== "string") {
        throw new SchemaCommandError("INVALID_CHANGE", `Documenteigenschap '${key}' is niet geldig.`);
      }

    }
    if (Object.keys(changes).length === 0) return;
    this.commitTransaction(() => {
      if (changes.owner !== undefined) this.structure.properties.owner = changes.owner;
      if (changes.installer !== undefined) this.structure.properties.installer = changes.installer;
      if (changes.control !== undefined) this.structure.properties.control = changes.control;
      if (changes.info !== undefined) this.structure.properties.info = changes.info;
    });
  }

  private updateFileSettings(changes: UpdateFileSettingsChanges): void {
    if (changes.filename !== undefined && (typeof changes.filename !== "string" || changes.filename.trim() === "")) {
      throw new SchemaCommandError("INVALID_CHANGE", "De bestandsnaam mag niet leeg zijn.");
    }
    if (changes.compressionDisabled !== undefined && typeof changes.compressionDisabled !== "boolean") {
      throw new SchemaCommandError("INVALID_CHANGE", "De compressie-instelling is ongeldig.");
    }
    this.commitTransaction(() => {
      if (changes.filename !== undefined) this.structure.properties.filename = changes.filename.trim();
      if (changes.compressionDisabled !== undefined) {
        this.structure.properties.disableEDSCompression = changes.compressionDisabled;
      }
    });
  }

  private updateDossierMetadata(changes: UpdateDossierMetadataChanges): void {
    if (Object.keys(changes).length === 0) return;
    const next = parseDossierMetadata({ ...this.structure.properties.dossier, ...changes });
    this.commitTransaction(() => { this.structure.properties.dossier = next; });
  }

  private createPlacementTask(itemId: number, destination: PlacementTaskDestination, locationHint?: string): string {
    this.requireItem(itemId);
    if (destination !== "situation" && destination !== "board") {
      throw new SchemaCommandError("INVALID_CHANGE", "De bestemming van een plaatsingstaak is ongeldig.");
    }
    const hint = locationHint?.trim();
    return this.commitTransaction(() => {
      const existing = this.structure.placementTasks.find(task => task.itemId === itemId && task.destination === destination);
      if (existing) return existing.id;
      const id = `task-${this.structure.curid}-${this.structure.placementTasks.length + 1}`;
      this.structure.placementTasks = [...this.structure.placementTasks, { id, itemId, destination, ...(hint ? { locationHint: hint } : {}) }];
      return id;
    });
  }

  private resolvePlacementTask(taskId: string): void {
    if (!this.structure.placementTasks.some(task => task.id === taskId)) {
      throw new SchemaCommandError("INVALID_CHANGE", "De plaatsingstaak bestaat niet.");
    }
    this.commitTransaction(() => {
      this.structure.placementTasks = this.structure.placementTasks.filter(task => task.id !== taskId);
    });
  }

  private createRequiredPlacementTask(itemId: number, type: string): void {
    const presentation = getItemPresentation(type);
    const destination = presentation === "field-device" ? "situation"
      : presentation === "panel-device" ? "board" : null;
    this.structure.placementTasks = this.structure.placementTasks.filter(task => task.itemId !== itemId || task.destination === destination);
    if (destination === null || this.structure.placementTasks.some(task => task.itemId === itemId && task.destination === destination)) return;
    this.structure.placementTasks = [...this.structure.placementTasks, {
      id: `task-${this.structure.curid}-${this.structure.placementTasks.length + 1}`,
      itemId,
      destination,
    }];
  }

  private addBoardLayoutRail(
    boardId: string,
    properties: AddBoardLayoutRailProperties = {},
  ): string {
    this.requireBoard(boardId);
    const moduleCapacity = properties.moduleCapacity ?? 18;
    this.assertPositiveInteger(moduleCapacity, "Het aantal modules");
    return this.commitTransaction(() => {
      const layout = this.getBoardLayout(boardId);
      const usedIds = new Set(layout.rails.map(rail => rail.id));
      let number = layout.rails.length + 1;
      while (usedIds.has(`${boardId}-rail-${number}`)) number += 1;
      const railId = `${boardId}-rail-${number}`;
      this.replaceBoardLayout({
        ...layout,
        rails: [
          ...layout.rails,
          {
            id: railId,
            name: properties.name?.trim() || `Rij ${number}`,
            moduleCapacity,
          },
        ],
      });
      return railId;
    });
  }

  private configureBoardLayout(
    boardId: string,
    properties: ConfigureBoardLayoutProperties,
  ): void {
    this.requireBoard(boardId);
    this.assertPositiveInteger(properties.moduleCapacity, "Het aantal modules per rij");
    this.assertPositiveInteger(properties.rowCount, "Het aantal rijen");
    const layout = this.getBoardLayout(boardId);
    const removedRailIds = new Set(layout.rails.slice(properties.rowCount).map(rail => rail.id));
    if (layout.placements.some(placement => removedRailIds.has(placement.railId))) {
      throw new SchemaCommandError(
        "INVALID_BOARD_LAYOUT",
        "Verplaats eerst de modules uit de rijen die je wilt verwijderen.",
      );
    }
    if (layout.placements.some(placement => (
      placement.startModule + placement.moduleWidth > properties.moduleCapacity
    ))) {
      throw new SchemaCommandError(
        "INVALID_BOARD_LAYOUT",
        "Verplaats eerst de modules die buiten de nieuwe bordbreedte zouden vallen.",
      );
    }

    this.commitTransaction(() => {
      const rails = layout.rails.slice(0, properties.rowCount).map(rail => ({
        ...rail,
        moduleCapacity: properties.moduleCapacity,
      }));
      const usedIds = new Set(layout.rails.map(rail => rail.id));
      let number = rails.length + 1;
      while (rails.length < properties.rowCount) {
        while (usedIds.has(`${boardId}-rail-${number}`)) number += 1;
        const id = `${boardId}-rail-${number}`;
        usedIds.add(id);
        rails.push({ id, name: `Rij ${rails.length + 1}`, moduleCapacity: properties.moduleCapacity });
        number += 1;
      }
      this.replaceBoardLayout({ ...layout, rails });
    });
  }

  private updateBoardLayoutRail(
    boardId: string,
    railId: string,
    changes: UpdateBoardLayoutRailChanges,
  ): void {
    const layout = this.requireBoardLayout(boardId);
    const rail = layout.rails.find(candidate => candidate.id === railId);
    if (!rail) {
      throw new SchemaCommandError("BOARD_LAYOUT_NOT_FOUND", `Bordrij '${railId}' bestaat niet.`);
    }
    if (changes.name !== undefined && typeof changes.name !== "string") {
      throw new SchemaCommandError("INVALID_BOARD_LAYOUT", "De naam van een bordrij moet tekst zijn.");
    }
    if (changes.moduleCapacity !== undefined) {
      const moduleCapacity = changes.moduleCapacity;
      this.assertPositiveInteger(moduleCapacity, "Het aantal modules");
      const exceedsCapacity = layout.placements.some(placement => (
        placement.railId === railId
        && placement.startModule + placement.moduleWidth > moduleCapacity
      ));
      if (exceedsCapacity) {
        throw new SchemaCommandError(
          "INVALID_BOARD_LAYOUT",
          "Verplaats eerst modules die buiten de nieuwe breedte zouden vallen.",
        );
      }
    }
    this.commitTransaction(() => this.replaceBoardLayout({
      ...layout,
      rails: layout.rails.map(candidate => candidate.id === railId
        ? {
            ...candidate,
            name: changes.name?.trim() || candidate.name,
            moduleCapacity: changes.moduleCapacity ?? candidate.moduleCapacity,
          }
        : candidate),
    }));
  }

  private deleteBoardLayoutRail(boardId: string, railId: string): void {
    const layout = this.requireBoardLayout(boardId);
    if (!layout.rails.some(rail => rail.id === railId)) {
      throw new SchemaCommandError("BOARD_LAYOUT_NOT_FOUND", `Bordrij '${railId}' bestaat niet.`);
    }
    if (layout.placements.some(placement => placement.railId === railId)) {
      throw new SchemaCommandError(
        "INVALID_BOARD_LAYOUT",
        "Een bordrij met geplaatste modules kan niet worden verwijderd.",
      );
    }
    this.commitTransaction(() => this.replaceBoardLayout({
      ...layout,
      rails: layout.rails.filter(rail => rail.id !== railId),
    }));
  }

  private placeBoardLayoutItem(
    boardId: string,
    itemId: number,
    properties: PlaceBoardLayoutItemProperties,
  ): void {
    this.requireItem(itemId);
    const layout = this.requireBoardLayout(boardId);
    const rail = layout.rails.find(candidate => candidate.id === properties.railId);
    if (!rail) {
      throw new SchemaCommandError("BOARD_LAYOUT_NOT_FOUND", `Bordrij '${properties.railId}' bestaat niet.`);
    }
    this.assertNonNegativeInteger(properties.startModule, "De startmodule");
    this.assertPositiveInteger(properties.moduleWidth, "De modulebreedte");
    if (properties.startModule + properties.moduleWidth > rail.moduleCapacity) {
      throw new SchemaCommandError("INVALID_BOARD_LAYOUT", "De module past niet binnen deze bordrij.");
    }
    if (this.findItemBoardId(itemId) !== boardId) {
      throw new SchemaCommandError("INVALID_BOARD_LAYOUT", "Het onderdeel hoort niet bij dit verdeelbord.");
    }
    const overlaps = layout.placements.some(placement => (
      placement.itemId !== itemId
      && placement.railId === properties.railId
      && placement.startModule < properties.startModule + properties.moduleWidth
      && properties.startModule < placement.startModule + placement.moduleWidth
    ));
    if (overlaps) {
      throw new SchemaCommandError("INVALID_BOARD_LAYOUT", "Deze positie overlapt een andere module.");
    }
    this.commitTransaction(() => {
      this.replaceBoardLayout({
        ...layout,
        placements: [
          ...layout.placements.filter(placement => placement.itemId !== itemId),
          { itemId, ...properties },
        ],
      });
      this.structure.placementTasks = this.structure.placementTasks.filter(task => !(task.itemId === itemId && task.destination === "board"));
    });
  }

  private removeBoardLayoutItem(boardId: string, itemId: number): void {
    const layout = this.requireBoardLayout(boardId);
    if (!layout.placements.some(placement => placement.itemId === itemId)) return;
    this.commitTransaction(() => this.replaceBoardLayout({
      ...layout,
      placements: layout.placements.filter(placement => placement.itemId !== itemId),
    }));
  }

  private applyAgentChangeSet(operations: readonly AgentGraphOperation[]): void {
    if (operations.length === 0) {
      throw new SchemaCommandError("INVALID_CHANGE", "Een wijzigingsvoorstel mag niet leeg zijn.");
    }
    const before = this.serialize();
    // Stage against a separate authoritative document. Existing public commands
    // perform all domain validation there; only a complete successful draft is
    // installed in the live document and recorded once in its history.
    const staged = new LegacySchemaStore(structureFromJson(before, null, 0));
    for (const operation of operations) {
      switch (operation.kind) {
        case "add-item":
          staged.commands.addItem(operation.parentId, operation.type);
          break;
        case "update-item":
          staged.commands.updateItem(operation.itemId, operation.changes);
          break;
        case "move-item":
          staged.commands.moveItem(operation.itemId, {
            targetParentId: operation.targetParentId,
            position: operation.position,
          });
          break;
        case "delete-item":
          staged.commands.deleteItem(operation.itemId);
          break;
        case "create-placement-task":
          staged.commands.createPlacementTask(operation.itemId, operation.destination, operation.locationHint);
          break;
        default:
          throw new SchemaCommandError("INVALID_CHANGE", "Onbekende agentwijziging.");
      }
    }
    const stagedSerialized = staged.getLegacyDocument().toJsonObject(false);
    this.structure = structureFromJson(stagedSerialized, this.structure, 0);
    this.serializedSnapshot = this.serialize();
    this.history.record(this.serializedSnapshot);
    this.publish();
  }

  private replaceDocument(serializedDocument: string, version: number = 0): void {
    const replacement = structureFromJson(serializedDocument, null, version);
    this.structure.dispose();
    this.structure = replacement;
    this.serializedSnapshot = this.serialize();
    this.history.reset(this.serializedSnapshot);
    this.publish();
  }

  private undo(): void {
    const serialized = this.history.undo();
    if (serialized === undefined) return;
    this.restore(serialized);
  }

  private redo(): void {
    const serialized = this.history.redo();
    if (serialized === undefined) return;
    this.restore(serialized);
  }

  private getParent(parentId: number | null): Electro_Item | null {
    if (parentId === null) return null;
    const parent = this.structure.getElectroItemById(parentId);
    if (parent === null) {
      throw new SchemaCommandError("PARENT_NOT_FOUND", `Ouderitem ${parentId} bestaat niet.`);
    }
    return parent;
  }

  private requireItem(itemId: number): Electro_Item {
    const item = this.structure.getElectroItemById(itemId);
    if (item === null) {
      throw new SchemaCommandError("ITEM_NOT_FOUND", `Item ${itemId} bestaat niet.`);
    }
    return item;
  }

  private requireBoard(boardId: string): DistributionBoard {
    const board = this.structure.boards.find((candidate) => candidate.id === boardId);
    if (!board) throw new SchemaCommandError("BOARD_NOT_FOUND", `Verdeelbord '${boardId}' bestaat niet.`);
    return board;
  }

  private getBoardLayout(boardId: string): BoardLayout {
    return this.structure.boardLayouts.find(layout => layout.boardId === boardId)
      ?? { boardId, rails: [], placements: [] };
  }

  private requireBoardLayout(boardId: string): BoardLayout {
    this.requireBoard(boardId);
    const layout = this.structure.boardLayouts.find(candidate => candidate.boardId === boardId);
    if (!layout) {
      throw new SchemaCommandError(
        "BOARD_LAYOUT_NOT_FOUND",
        `Verdeelbord '${boardId}' heeft nog geen fysieke indeling.`,
      );
    }
    return layout;
  }

  private replaceBoardLayout(layout: BoardLayout): void {
    this.structure.boardLayouts = [
      ...this.structure.boardLayouts.filter(candidate => candidate.boardId !== layout.boardId),
      layout,
    ];
  }

  private findItemBoardId(itemId: number): string | undefined {
    return findBoardIdForItem(
      this.structure.boards,
      itemId,
      (id) => {
        const item = this.structure.getElectroItemById(id);
        return item === null || item.parent === 0 ? null : item.parent;
      },
    );
  }

  private removePlacementsOutsideTheirBoard(): void {
    this.structure.boardLayouts = this.structure.boardLayouts.map(layout => ({
      ...layout,
      placements: layout.placements.filter(placement => this.findItemBoardId(placement.itemId) === layout.boardId),
    }));
  }

  private assertPositiveInteger(value: number, label: string): void {
    if (!Number.isInteger(value) || value <= 0) {
      throw new SchemaCommandError("INVALID_BOARD_LAYOUT", `${label} moet een positief geheel getal zijn.`);
    }
  }

  private assertNonNegativeInteger(value: number, label: string): void {
    if (!Number.isInteger(value) || value < 0) {
      throw new SchemaCommandError("INVALID_BOARD_LAYOUT", `${label} moet een positief geheel getal of nul zijn.`);
    }
  }

  private requireAvailableFeeder(
    circuitId: number,
    currentBoardId?: string,
  ): { circuit: Electro_Item; sourceBoardId: string } {
    const circuit = this.requireItem(circuitId);
    if (circuit.getType() !== "Kring") {
      throw new SchemaCommandError("INVALID_BOARD_FEEDER", "Een verdeelbord moet door een kring worden gevoed.");
    }
    const occupied = this.structure.boards.find((board) => (
      board.id !== currentBoardId && board.feeder?.sourceCircuitId === circuitId
    ));
    if (occupied) {
      throw new SchemaCommandError("INVALID_BOARD_FEEDER", `Deze kring voedt al verdeelbord '${occupied.name}'.`);
    }
    const sourceBoardId = findBoardIdForItem(
      this.structure.boards,
      circuitId,
      (id) => {
        const item = this.structure.getElectroItemById(id);
        return item === null || item.parent === 0 ? null : item.parent;
      },
    );
    if (!sourceBoardId) {
      throw new SchemaCommandError("INVALID_BOARD_FEEDER", "De voedende kring hoort niet bij een verdeelbord.");
    }
    return { circuit, sourceBoardId };
  }

  private createFeeder(
    sourceBoardId: string,
    sourceCircuitId: number,
    properties: Pick<UpdateDistributionBoardChanges, "cableType" | "conductorSection" | "lengthMeters">,
  ): BoardFeeder {
    if (properties.lengthMeters !== undefined && (!Number.isFinite(properties.lengthMeters) || properties.lengthMeters < 0)) {
      throw new SchemaCommandError("INVALID_CHANGE", "De kabellengte moet nul of een positief getal zijn.");
    }
    return {
      sourceBoardId,
      sourceCircuitId,
      cableType: this.optionalBoardText(properties.cableType),
      conductorSection: this.optionalBoardText(properties.conductorSection),
      lengthMeters: properties.lengthMeters,
    };
  }

  private requireBoardName(value: string): string {
    const name = value.trim();
    if (!name) throw new SchemaCommandError("INVALID_CHANGE", "Een verdeelbord moet een naam hebben.");
    return name;
  }

  private optionalBoardText(value: string | undefined): string | undefined {
    const text = value?.trim();
    return text ? text : undefined;
  }

  private uniqueBoardId(preferredId: string): string {
    const ids = new Set(this.structure.boards.map((board) => board.id));
    if (!ids.has(preferredId)) return preferredId;
    let suffix = 2;
    while (ids.has(`${preferredId}-${suffix}`)) suffix += 1;
    return `${preferredId}-${suffix}`;
  }

  private assertNotBoardRoot(itemId: number): void {
    const board = this.structure.boards.find((candidate) => candidate.rootItemIds.includes(itemId));
    if (board) {
      throw new SchemaCommandError("BOARD_DEPENDENCY", `Gebruik de verdeelbordactie om '${board.name}' aan te passen.`);
    }
  }

  private assertNoBoardDependencyInSubtree(itemId: number): void {
    const subtreeIds = this.collectSubtreeIds(itemId);
    const affected = this.structure.boards.find((board) => (
      board.rootItemIds.some((rootId) => subtreeIds.has(rootId))
      || (board.feeder !== undefined && subtreeIds.has(board.feeder.sourceCircuitId))
    ));
    if (affected) {
      throw new SchemaCommandError("BOARD_DEPENDENCY", `Deze actie zou verdeelbord '${affected.name}' loskoppelen.`);
    }
  }

  private collectSubtreeIds(itemId: number): Set<number> {
    const subtreeIds = new Set<number>([itemId]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const candidate of this.structure.data as Electro_Item[]) {
        if (!subtreeIds.has(candidate.id) && subtreeIds.has(candidate.parent)) {
          subtreeIds.add(candidate.id);
          changed = true;
        }
      }
    }
    return subtreeIds;
  }

  private assertChildAllowed(parent: Electro_Item | null, type: string): void {
    const allowed = parent === null
      ? this.structure.allowedRootChilds().includes(type)
      : parent.allowedChilds().includes(type);
    if (!allowed) {
      const parentDescription = parent === null ? "de documentwortel" : `${parent.getType()} ${parent.id}`;
      throw new SchemaCommandError(
        "INVALID_CHILD_TYPE",
        `Itemtype '${type}' is niet toegestaan onder ${parentDescription}.`,
      );
    }
  }

  private assertParentCapacity(parent: Electro_Item | null): void {
    if (parent !== null && !parent.checkInsertChild()) {
      throw new SchemaCommandError("MAX_CHILDREN_REACHED", "De gekozen ouder laat geen extra kinderen toe.");
    }
  }

  private assertNoCycle(itemId: number, targetParent: Electro_Item | null): void {
    let ancestor = targetParent;
    while (ancestor !== null) {
      if (ancestor.id === itemId) {
        throw new SchemaCommandError("CYCLIC_PARENT", "Een item kan niet onder een eigen afstammeling worden geplaatst.");
      }
      ancestor = ancestor.getParent() as Electro_Item | null;
    }
  }

  private assertUserEditable(item: Electro_Item): void {
    if (item.getType() === "Omschakelaarpoort") {
      throw new SchemaCommandError(
        "INVALID_CHANGE",
        "Een vaste omschakelaarpoort kan niet afzonderlijk worden aangepast.",
      );
    }
    if (item.isAttribuut()) {
      throw new SchemaCommandError(
        "INVALID_CHANGE",
        "Gegenereerde attribuutitems kunnen niet afzonderlijk worden aangepast.",
      );
    }
  }

  private assertPublicItemType(type: string): void {
    if (type === "Omschakelaarpoort") {
      throw new SchemaCommandError(
        "INVALID_CHANGE",
        "Een omschakelaarpoort wordt automatisch met de omschakelaar aangemaakt.",
      );
    }
  }

  private moveToSiblingPosition(itemId: number, requestedPosition: number | undefined): void {
    const item = this.requireItem(itemId);
    const siblingIds = this.structure.data
      .filter((candidate) => candidate.parent === item.parent && !(candidate as Electro_Item).isAttribuut())
      .map((candidate) => candidate.id);
    const maximumPosition = Math.max(siblingIds.length - 1, 0);
    const targetPosition = requestedPosition === undefined
      ? maximumPosition
      : Math.min(requestedPosition, maximumPosition);

    let currentPosition = siblingIds.indexOf(itemId);
    while (currentPosition > targetPosition) {
      this.structure.moveUp(itemId);
      currentPosition -= 1;
    }
    while (currentPosition < targetPosition) {
      this.structure.moveDown(itemId);
      currentPosition += 1;
    }
  }

  private commitTransaction<Result>(mutation: () => Result): Result {
    const before = this.serialize();
    try {
      const result = mutation();
      this.structure.voegAttributenToeAlsNodigEnReSort();
      this.structure.reNumber(false);
      this.serializedSnapshot = this.serialize();
      this.history.record(this.serializedSnapshot);
      this.publish();
      return result;
    } catch (error) {
      this.structure = structureFromJson(before, this.structure, 0);
      this.serializedSnapshot = before;
      // A failed command must not advance the public revision, but future
      // reads must point at the restored document rather than the mutated one.
      this.snapshot = this.createSnapshot();
      throw error;
    }
  }

  private restore(serialized: string): void {
    this.structure = structureFromJson(serialized, this.structure, 0);
    this.serializedSnapshot = serialized;
    this.publish();
  }

  private serialize(): string {
    return this.structure.toJsonObject(false);
  }

  private createSnapshot(): SchemaSnapshot {
    const document = new LegacySchemaDocumentReader(this.structure);
    return Object.freeze({
      revision: this.revision,
      document,
      properties: new LegacySchemaPropertyReader(this.structure),
      canUndo: this.history.canUndo(),
      canRedo: this.history.canRedo(),
      validationIssues: validateSchemaDocument(document),
      boardLayouts: Object.freeze(this.structure.boardLayouts.map(freezeBoardLayout)),
      placementTasks: Object.freeze(this.structure.placementTasks.map(task => Object.freeze({ ...task }))),
    });
  }

  private publish(): void {
    this.revision += 1;
    this.snapshot = this.createSnapshot();
    for (const listener of this.listeners) listener();
  }
}
