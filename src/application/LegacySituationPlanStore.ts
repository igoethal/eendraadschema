import type { Hierarchical_List } from "../Hierarchical_List";
import type { SituationPlan } from "../sitplan/SituationPlan";
import { SituationPlanElement } from "../sitplan/SituationPlanElement";
import {
  SituationPlanCommandError,
  type SituationPlanCommands,
  type AddSituationOccurrenceProperties,
  type AddSituationCustomElementProperties,
  type SituationPlanElementChanges,
  type SituationPlanAlignment,
  type SituationPlanDistributionAxis,
  type SituationPlanElementUpdate,
  type SituationPlanElementSnapshot,
  type SituationPlanSnapshot,
  type SituationPlanStore,
} from "./SituationPlanStore";

export interface SituationPlanHistoryPort {
  record(historyKey?: string): void;
  undo(): Hierarchical_List | void;
  redo(): Hierarchical_List | void;
}

export class LegacySituationPlanStore implements SituationPlanStore {
  private structure: Hierarchical_List;
  private readonly listeners = new Set<() => void>();
  private revision = 0;
  private snapshot: SituationPlanSnapshot;
  private stateKey: string;

  readonly commands: SituationPlanCommands;

  constructor(
    structure: Hierarchical_List,
    private readonly history?: SituationPlanHistoryPort,
  ) {
    this.structure = structure;
    this.snapshot = this.createSnapshot();
    this.stateKey = this.createStateKey(this.snapshot);
    this.commands = Object.freeze({
      undo: this.undo.bind(this),
      redo: this.redo.bind(this),
      selectPage: this.selectPage.bind(this),
      addPage: this.addPage.bind(this),
      deletePage: this.deletePage.bind(this),
      updateDefaults: this.updateDefaults.bind(this),
      addOccurrence: this.addOccurrence.bind(this),
      addCustomElement: this.addCustomElement.bind(this),
      updateElement: this.updateElement.bind(this),
      updateElements: this.updateElements.bind(this),
      translateElements: this.translateElements.bind(this),
      sendElementsToBack: this.sendElementsToBack.bind(this),
      bringElementsToFront: this.bringElementsToFront.bind(this),
      alignElements: this.alignElements.bind(this),
      distributeElements: this.distributeElements.bind(this),
      duplicateElements: this.duplicateElements.bind(this),
      deleteElements: this.deleteElements.bind(this),
    });
  }

  getSnapshot(): SituationPlanSnapshot {
    return this.snapshot;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Transitional document replacement seam used by EDS and shared graph commands. */
  synchronizeLegacyDocument(structure: Hierarchical_List = this.structure): void {
    this.structure = structure;
    const nextSnapshot = this.createSnapshot();
    const nextStateKey = this.createStateKey(nextSnapshot);
    if (nextStateKey === this.stateKey) return;
    this.publish();
  }

  getLegacyDocument(): Hierarchical_List {
    return this.structure;
  }

  private undo(): void {
    const document = this.history?.undo();
    this.synchronizeLegacyDocument(document ? document : this.structure);
  }

  private redo(): void {
    const document = this.history?.redo();
    this.synchronizeLegacyDocument(document ? document : this.structure);
  }

  private selectPage(page: number): void {
    this.assertPage(page);
    if (page === this.plan.getActivePage()) return;
    this.commit(() => this.plan.setActivePage(page), "changePage");
  }

  private addPage(): number {
    return this.commit(() => {
      const page = this.plan.addPage();
      this.plan.setActivePage(page);
      return page;
    });
  }

  private deletePage(page: number): void {
    this.assertPage(page);
    if (this.plan.getPageCount() === 1) {
      throw new SituationPlanCommandError("LAST_PAGE", "De laatste pagina kan niet worden verwijderd.");
    }
    this.commit(() => this.plan.deletePage(page));
  }

  private updateDefaults(changes: Parameters<SituationPlan["updateDefaults"]>[0]): void {
    if (changes.fontsize !== undefined && (!Number.isFinite(changes.fontsize) || changes.fontsize <= 0)) {
      throw new SituationPlanCommandError("INVALID_DEFAULT", "De lettergrootte moet groter zijn dan nul.");
    }
    if (changes.scale !== undefined && (!Number.isFinite(changes.scale) || changes.scale <= 0)) {
      throw new SituationPlanCommandError("INVALID_DEFAULT", "De schaal moet groter zijn dan nul.");
    }
    if (changes.rotate !== undefined && !Number.isFinite(changes.rotate)) {
      throw new SituationPlanCommandError("INVALID_DEFAULT", "De rotatie moet een eindig getal zijn.");
    }

    const defaults = this.plan.getDefaults();
    const changed = Object.entries(changes).some(
      ([key, value]) => defaults[key as keyof typeof defaults] !== value,
    );
    if (!changed) return;
    this.commit(() => this.plan.updateDefaults(changes));
  }

  private addOccurrence(properties: AddSituationOccurrenceProperties): string {
    this.validateNewElement(properties);
    const item = this.structure.getElectroItemById(properties.itemId);
    if (!item) {
      throw new SituationPlanCommandError(
        "INVALID_ELEMENT_CHANGE",
        `Elektrisch onderdeel ${properties.itemId} bestaat niet.`,
      );
    }
    if (this.plan.countByElectroItemId(properties.itemId) >= item.maxSituationPlanElements()) {
      throw new SituationPlanCommandError(
        "INVALID_ELEMENT_CHANGE",
        `Elektrisch onderdeel ${properties.itemId} laat geen extra plaatsing toe.`,
      );
    }

    return this.commit(() => {
      const element = this.plan.addElementFromElectroItem(
        properties.itemId,
        properties.page,
        properties.position.x,
        properties.position.y,
        properties.addressType,
        properties.address,
        properties.addressLocation,
        properties.labelFontSize,
        properties.scale,
        properties.rotation,
      );
      if (!element) {
        throw new SituationPlanCommandError(
          "INVALID_ELEMENT_CHANGE",
          `Elektrisch onderdeel ${properties.itemId} kon niet worden geplaatst.`,
        );
      }
      this.structure.placementTasks = this.structure.placementTasks.filter(
        task => !(task.itemId === properties.itemId && task.destination === "situation"),
      );
      return element.id;
    });
  }

  private addCustomElement(properties: AddSituationCustomElementProperties): string {
    this.validateNewElement(properties);
    if (
      !Number.isFinite(properties.size.width)
      || !Number.isFinite(properties.size.height)
      || properties.size.width <= 0
      || properties.size.height <= 0
      || properties.svg.trim() === ""
    ) {
      throw new SituationPlanCommandError(
        "INVALID_ELEMENT_CHANGE",
        "Een vrij situatiesymbool vereist geldige afmetingen en SVG-inhoud.",
      );
    }

    return this.commit(() => {
      const element = new SituationPlanElement();
      element.setVars({
        page: properties.page,
        posx: properties.position.x,
        posy: properties.position.y,
        labelfontsize: properties.labelFontSize,
        scale: properties.scale,
        rotate: properties.rotation,
      });
      element.sizex = properties.size.width;
      element.sizey = properties.size.height;
      element.svg = properties.svg;
      element.needsViewUpdate = true;
      this.plan.addElement(element);
      return element.id;
    });
  }

  private validateNewElement(properties: Readonly<{
    page: number;
    position: Readonly<{ x: number; y: number }>;
    labelFontSize: number;
    scale: number;
    rotation: number;
  }>): void {
    this.assertPage(properties.page);
    if (
      !Number.isFinite(properties.position.x)
      || !Number.isFinite(properties.position.y)
      || !Number.isFinite(properties.labelFontSize)
      || properties.labelFontSize <= 0
      || !Number.isFinite(properties.scale)
      || properties.scale <= 0
      || !Number.isFinite(properties.rotation)
    ) {
      throw new SituationPlanCommandError(
        "INVALID_ELEMENT_CHANGE",
        "De positie, schaal, rotatie en labelgrootte moeten geldig zijn.",
      );
    }
  }

  private updateElement(elementId: string, changes: SituationPlanElementChanges): void {
    this.updateElements([{ elementId, changes }]);
  }

  private updateElements(updates: readonly SituationPlanElementUpdate[], historyKey?: string): void {
    const elementIds = new Set<string>();
    const prepared = updates.map(({ elementId, changes }) => {
      if (elementIds.has(elementId)) {
        throw new SituationPlanCommandError(
          "INVALID_ELEMENT_CHANGE",
          `Plaatsing '${elementId}' komt meer dan eenmaal voor in dezelfde wijziging.`,
        );
      }

      elementIds.add(elementId);
      return this.prepareElementUpdate(elementId, changes);
    }).filter(update => update.changed);
    if (prepared.length === 0) return;

    this.commit(() => {
      for (const update of prepared) {
        this.applyElementChanges(update.element, update.serialized, update.changes);
      }
    }, historyKey);
  }

  private translateElements(
    elementIds: readonly string[],
    offset: Readonly<{ x: number; y: number }>,
    historyKey: string,
  ): void {
    if (!Number.isFinite(offset.x) || !Number.isFinite(offset.y) || historyKey.trim() === "") {
      throw new SituationPlanCommandError(
        "INVALID_ELEMENT_CHANGE",
        "De sleepverplaatsing en historiesleutel moeten geldig zijn.",
      );
    }
    if (offset.x === 0 && offset.y === 0) return;
    const elements = this.requireSelectedElements(elementIds, 1).filter(element => element.movable);
    this.updateElements(elements.map(element => ({
      elementId: element.id,
      changes: { position: { x: element.posx + offset.x, y: element.posy + offset.y } },
    })), historyKey);
  }

  private sendElementsToBack(elementIds: readonly string[]): void {
    this.moveElementsToEdge(elementIds, false);
  }

  private bringElementsToFront(elementIds: readonly string[]): void {
    this.moveElementsToEdge(elementIds, true);
  }

  private moveElementsToEdge(elementIds: readonly string[], front: boolean): void {
    const movableIds = new Set(
      this.requireSelectedElements(elementIds, 1)
        .filter(element => element.movable)
        .map(element => element.id),
    );
    if (movableIds.size === 0) return;
    this.commitWhenChanged(() => front
      ? this.plan.moveElementsToFront(movableIds)
      : this.plan.moveElementsToBack(movableIds));
  }

  private alignElements(elementIds: readonly string[], alignment: SituationPlanAlignment): void {
    const elements = this.requireSelectedElements(elementIds, 2).filter(element => element.movable);
    if (elements.length < 2) return;
    const horizontal = alignment === "left" || alignment === "horizontal-center" || alignment === "right";
    const values = elements.map(element => horizontal ? element.posx : element.posy);
    const target = alignment === "left" || alignment === "top"
      ? Math.min(...values)
      : alignment === "right" || alignment === "bottom"
        ? Math.max(...values)
        : values.reduce((sum, value) => sum + value, 0) / values.length;
    this.updateElements(elements.map(element => ({
      elementId: element.id,
      changes: {
        position: {
          x: horizontal ? target : element.posx,
          y: horizontal ? element.posy : target,
        },
      },
    })));
  }

  private distributeElements(
    elementIds: readonly string[],
    axis: SituationPlanDistributionAxis,
  ): void {
    const horizontal = axis === "horizontal";
    const elements = this.requireSelectedElements(elementIds, 3)
      .filter(element => element.movable)
      .sort((first, second) => (
        horizontal ? first.posx - second.posx : first.posy - second.posy
      ));
    if (elements.length < 3) return;
    const first = horizontal ? elements[0].posx : elements[0].posy;
    const last = horizontal
      ? elements[elements.length - 1].posx
      : elements[elements.length - 1].posy;
    const interval = (last - first) / (elements.length - 1);
    this.updateElements(elements.map((element, index) => ({
      elementId: element.id,
      changes: {
        position: {
          x: horizontal ? first + interval * index : element.posx,
          y: horizontal ? element.posy : first + interval * index,
        },
      },
    })));
  }

  private duplicateElements(
    elementIds: readonly string[],
    offset: Readonly<{ x: number; y: number }> = { x: 10, y: 10 },
  ): readonly string[] {
    if (!Number.isFinite(offset.x) || !Number.isFinite(offset.y)) {
      throw new SituationPlanCommandError(
        "INVALID_ELEMENT_CHANGE",
        "De verschuiving voor duplicaten moet uit geldige getallen bestaan.",
      );
    }

    const elements = this.requireSelectedElements(elementIds, 1);
    const duplicateCounts = new Map<number, number>();
    for (const element of elements) {
      const itemId = element.getElectroItemId();
      if (itemId !== null) duplicateCounts.set(itemId, (duplicateCounts.get(itemId) ?? 0) + 1);
    }
    for (const [itemId, addedCount] of duplicateCounts) {
      const item = this.structure.getElectroItemById(itemId);
      const existingCount = this.plan.countByElectroItemId(itemId);
      if (!item || existingCount + addedCount > item.maxSituationPlanElements()) {
        throw new SituationPlanCommandError(
          "INVALID_ELEMENT_SELECTION",
          `Het elektrische onderdeel ${itemId} laat geen extra plaatsing toe.`,
        );
      }
    }
    const duplicates = elements.map((element) => {
      const duplicate = new SituationPlanElement();
      const labelPosition = element.getLabelPosition();
      duplicate.fromJsonObject({
        ...element.toJsonObject(),
        posx: element.posx + offset.x,
        posy: element.posy + offset.y,
        labelposx: labelPosition.x + offset.x,
        labelposy: labelPosition.y + offset.y,
      });
      return duplicate;
    });
    return this.commit(() => {
      for (const duplicate of duplicates) this.plan.addElement(duplicate);
      return Object.freeze(duplicates.map(element => element.id));
    });
  }

  private deleteElements(elementIds: readonly string[]): readonly number[] {
    const elements = this.requireSelectedElements(elementIds, 1);
    const deletableElements = elements.filter(element => element.movable);
    const deletedItemIds = [...new Set(deletableElements.flatMap((element) => {
      const itemId = element.getElectroItemId();
      if (itemId === null) return [];
      const item = this.structure.getElectroItemById(itemId);
      return item?.getParent()?.getType() === "Container" ? [itemId] : [];
    }))];
    if (deletableElements.length === 0) return Object.freeze([]);
    return this.commit(() => {
      for (const element of deletableElements) this.plan.removeElement(element);
      for (const itemId of deletedItemIds) this.structure.deleteById(itemId);
      return Object.freeze(deletedItemIds);
    });
  }

  private requireSelectedElements(
    elementIds: readonly string[],
    minimum: number,
  ): SituationPlanElement[] {
    const uniqueIds = [...new Set(elementIds)];
    if (uniqueIds.length < minimum) {
      throw new SituationPlanCommandError(
        "INVALID_ELEMENT_SELECTION",
        `Selecteer minstens ${minimum} plaatsingen voor deze bewerking.`,
      );
    }
    const elements = uniqueIds.map((elementId) => {
      const element = this.plan.getElements().find(candidate => candidate.id === elementId);
      if (!element) {
        throw new SituationPlanCommandError(
          "ELEMENT_NOT_FOUND",
          `Situatieplanplaatsing '${elementId}' bestaat niet.`,
        );
      }
      return element;
    });
    if (new Set(elements.map(element => element.page)).size > 1) {
      throw new SituationPlanCommandError(
        "INVALID_ELEMENT_SELECTION",
        "Deze bewerking kan alleen op plaatsingen van dezelfde pagina worden uitgevoerd.",
      );
    }
    return elements;
  }

  private prepareElementUpdate(elementId: string, changes: SituationPlanElementChanges) {
    const element = this.plan.getElements().find(candidate => candidate.id === elementId);
    if (!element) {
      throw new SituationPlanCommandError(
        "ELEMENT_NOT_FOUND",
        `Situatieplanplaatsing '${elementId}' bestaat niet.`,
      );
    }
    if (changes.page !== undefined) this.assertPage(changes.page);
    if (changes.position !== undefined && (
      !Number.isFinite(changes.position.x) || !Number.isFinite(changes.position.y)
    )) {
      throw new SituationPlanCommandError("INVALID_ELEMENT_CHANGE", "De positie moet uit geldige getallen bestaan.");
    }
    if (changes.labelFontSize !== undefined && (
      !Number.isFinite(changes.labelFontSize) || changes.labelFontSize <= 0
    )) {
      throw new SituationPlanCommandError("INVALID_ELEMENT_CHANGE", "De lettergrootte moet groter zijn dan nul.");
    }
    if (changes.scale !== undefined && (!Number.isFinite(changes.scale) || changes.scale <= 0)) {
      throw new SituationPlanCommandError("INVALID_ELEMENT_CHANGE", "De schaal moet groter zijn dan nul.");
    }
    if (changes.rotation !== undefined && !Number.isFinite(changes.rotation)) {
      throw new SituationPlanCommandError("INVALID_ELEMENT_CHANGE", "De rotatie moet een geldig getal zijn.");
    }

    const serialized = element.toJsonObject();
    const changed = (
      (changes.page !== undefined && changes.page !== serialized.page)
      || (changes.position !== undefined && (
        changes.position.x !== serialized.posx || changes.position.y !== serialized.posy
      ))
      || (changes.labelFontSize !== undefined && changes.labelFontSize !== serialized.labelfontsize)
      || (changes.addressType !== undefined && changes.addressType !== serialized.adrestype)
      || (changes.address !== undefined && changes.address !== serialized.adres)
      || (changes.addressLocation !== undefined && changes.addressLocation !== serialized.adreslocation)
      || (changes.rotation !== undefined && changes.rotation !== serialized.rotate)
      || (changes.scale !== undefined && changes.scale !== serialized.scale)
      || (changes.movable !== undefined && changes.movable !== serialized.movable)
    );
    return { changed, changes, element, serialized };
  }

  private applyElementChanges(
    element: SituationPlanElement,
    serialized: ReturnType<SituationPlanElement["toJsonObject"]>,
    changes: SituationPlanElementChanges,
  ): void {
    if (changes.page !== undefined) element.page = changes.page;
    if (changes.position !== undefined) {
      element.posx = changes.position.x;
      element.posy = changes.position.y;
    }
    if (changes.labelFontSize !== undefined) element.labelfontsize = changes.labelFontSize;
    if (
      changes.addressType !== undefined
      || changes.address !== undefined
      || changes.addressLocation !== undefined
    ) {
      const addressType = changes.addressType ?? (serialized.adrestype === "manueel" ? "manueel" : "auto");
      const addressLocation = changes.addressLocation ?? (
        serialized.adreslocation === "links"
          ? "links"
          : serialized.adreslocation === "boven"
            ? "boven"
            : serialized.adreslocation === "onder"
              ? "onder"
              : "rechts"
      );
      element.setAdres(
        addressType,
        changes.address ?? serialized.adres ?? "",
        addressLocation,
      );
    }
    if (changes.rotation !== undefined) element.rotate = changes.rotation;
    if (changes.scale !== undefined) element.setscale(changes.scale);
    if (changes.movable !== undefined) element.movable = changes.movable;
  }

  private assertPage(page: number): void {
    if (!Number.isInteger(page) || page < 1 || page > this.plan.getPageCount()) {
      throw new SituationPlanCommandError(
        "INVALID_PAGE",
        `Pagina ${page} bestaat niet in het situatieplan.`,
      );
    }
  }

  private commit<Result>(mutation: () => Result, historyKey?: string): Result {
    const result = mutation();
    this.history?.record(historyKey);
    this.publish();
    return result;
  }

  private commitWhenChanged(mutation: () => boolean, historyKey?: string): void {
    if (!mutation()) return;
    this.history?.record(historyKey);
    this.publish();
  }

  private get plan(): SituationPlan {
    return this.structure.sitplan;
  }

  private createSnapshot(): SituationPlanSnapshot {
    return Object.freeze({
      revision: this.revision,
      activePage: this.plan.getActivePage(),
      pageCount: this.plan.getPageCount(),
      defaults: Object.freeze({ ...this.plan.getDefaults() }),
      elements: Object.freeze(this.plan.getElements().map(element => this.createElementSnapshot(element))),
    });
  }

  private createElementSnapshot(element: SituationPlanElement): SituationPlanElementSnapshot {
    const serialized = element.toJsonObject();
    return Object.freeze({
      id: element.id,
      page: serialized.page,
      position: Object.freeze({ x: serialized.posx, y: serialized.posy }),
      size: Object.freeze({ width: serialized.sizex, height: serialized.sizey }),
      labelPosition: Object.freeze({ x: serialized.labelposx, y: serialized.labelposy }),
      labelFontSize: serialized.labelfontsize,
      addressType: serialized.adrestype,
      address: serialized.adres,
      addressLocation: serialized.adreslocation,
      rotation: serialized.rotate,
      scale: serialized.scale,
      movable: serialized.movable,
      svg: serialized.svg,
      electroItemId: serialized.electroItemId,
    });
  }

  private publish(): void {
    this.revision += 1;
    this.snapshot = this.createSnapshot();
    this.stateKey = this.createStateKey(this.snapshot);
    for (const listener of this.listeners) listener();
  }

  private createStateKey(snapshot: SituationPlanSnapshot): string {
    return JSON.stringify({
      activePage: snapshot.activePage,
      pageCount: snapshot.pageCount,
      defaults: snapshot.defaults,
      elements: snapshot.elements,
    });
  }
}
