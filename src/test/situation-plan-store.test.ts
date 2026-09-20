import { beforeEach, describe, expect, it, vi } from "vitest";
import { LegacySituationPlanStore } from "../application/LegacySituationPlanStore";
import { SituationPlanCommandError } from "../application/SituationPlanStore";
import { SituationPlanElement } from "../sitplan/SituationPlanElement";
import { loadFixture } from "./helpers";

beforeEach(() => {
  globalThis.SITPLANVIEW_DEFAULT_SCALE = 1;
});

function createStore() {
  const structure = loadFixture("example001.eds");
  const mutationCommitted = vi.fn();
  const undo = vi.fn();
  const redo = vi.fn();
  return {
    structure,
    mutationCommitted,
    undo,
    redo,
    store: new LegacySituationPlanStore(structure, {
      record: mutationCommitted,
      undo,
      redo,
    }),
  };
}

describe("LegacySituationPlanStore", () => {
  it("routes undo and redo through the injected history port", () => {
    const { redo, store, undo } = createStore();

    store.commands.undo();
    store.commands.redo();

    expect(undo).toHaveBeenCalledOnce();
    expect(redo).toHaveBeenCalledOnce();
  });

  it("exposes an immutable, DOM-independent snapshot", () => {
    const { structure, store } = createStore();
    const element = new SituationPlanElement();
    element.page = 1;
    element.posx = 25;
    element.posy = 40;
    element.boxref = document.createElement("div");
    element.boxlabelref = document.createElement("div");
    structure.sitplan.addElement(element);
    store.synchronizeLegacyDocument();

    const snapshot = store.getSnapshot();
    expect(snapshot.elements[0]).toMatchObject({
      id: element.id,
      page: 1,
      position: { x: 25, y: 40 },
    });
    expect(snapshot.elements[0]).not.toHaveProperty("boxref");
    expect(snapshot.elements[0]).not.toHaveProperty("boxlabelref");
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.elements)).toBe(true);
    expect(Object.isFrozen(snapshot.elements[0].position)).toBe(true);
  });

  it("only publishes legacy synchronization when document state changed", () => {
    const { structure, store } = createStore();
    const listener = vi.fn();
    store.subscribe(listener);

    store.synchronizeLegacyDocument();
    structure.sitplan.addPage();
    store.synchronizeLegacyDocument();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot()).toMatchObject({ revision: 1, pageCount: 2 });
  });

  it("publishes validated page commands and records mutations", () => {
    const { mutationCommitted, store } = createStore();
    const listener = vi.fn();
    store.subscribe(listener);

    expect(store.commands.addPage()).toBe(2);
    expect(store.getSnapshot()).toMatchObject({ revision: 1, pageCount: 2, activePage: 2 });

    store.commands.selectPage(1);
    store.commands.deletePage(2);

    expect(store.getSnapshot()).toMatchObject({ revision: 3, pageCount: 1, activePage: 1 });
    expect(listener).toHaveBeenCalledTimes(3);
    expect(mutationCommitted).toHaveBeenCalledTimes(3);
    expect(mutationCommitted.mock.calls).toEqual([
      [undefined],
      ["changePage"],
      [undefined],
    ]);
  });

  it("rejects invalid pages and defaults without publishing", () => {
    const { mutationCommitted, store } = createStore();
    const listener = vi.fn();
    store.subscribe(listener);

    expect(() => store.commands.selectPage(2)).toThrowError(
      expect.objectContaining<Partial<SituationPlanCommandError>>({ code: "INVALID_PAGE" }),
    );
    expect(() => store.commands.deletePage(1)).toThrowError(
      expect.objectContaining<Partial<SituationPlanCommandError>>({ code: "LAST_PAGE" }),
    );
    expect(() => store.commands.updateDefaults({ scale: 0 })).toThrowError(
      expect.objectContaining<Partial<SituationPlanCommandError>>({ code: "INVALID_DEFAULT" }),
    );

    expect(store.getSnapshot().revision).toBe(0);
    expect(listener).not.toHaveBeenCalled();
    expect(mutationCommitted).not.toHaveBeenCalled();
  });

  it("updates defaults and ignores no-op commands", () => {
    const { mutationCommitted, store } = createStore();

    store.commands.updateDefaults({ fontsize: 14, scale: 0.8 });
    store.commands.updateDefaults({ fontsize: 14 });
    store.commands.selectPage(1);

    expect(store.getSnapshot().defaults).toEqual({ fontsize: 14, scale: 0.8, rotate: 0 });
    expect(store.getSnapshot().revision).toBe(1);
    expect(mutationCommitted).toHaveBeenCalledTimes(1);
  });

  it("validates and publishes placement property changes", () => {
    const { structure, mutationCommitted, store } = createStore();
    const element = new SituationPlanElement();
    structure.sitplan.addElement(element);
    store.synchronizeLegacyDocument();
    mutationCommitted.mockClear();

    store.commands.updateElement(element.id, {
      position: { x: 120, y: 80 },
      rotation: 45,
      scale: 0.8,
      labelFontSize: 13,
      movable: false,
    });

    expect(store.getSnapshot().elements[0]).toMatchObject({
      position: { x: 120, y: 80 },
      rotation: 45,
      scale: 0.8,
      labelFontSize: 13,
      movable: false,
    });
    expect(mutationCommitted).toHaveBeenCalledOnce();
  });

  it("creates linked and custom placements as recorded store transactions", () => {
    const { structure, mutationCommitted, store } = createStore();
    const item = structure.data.find(candidate => candidate.props.type === "Contactdoos")!;
    structure.placementTasks = [{
      id: "place-contactdoos",
      itemId: item.id,
      destination: "situation",
    }];

    const occurrenceId = store.commands.addOccurrence({
      itemId: item.id,
      page: 1,
      position: { x: 25, y: 40 },
      addressType: "auto",
      address: "",
      addressLocation: "rechts",
      labelFontSize: 11,
      scale: 0.7,
      rotation: 0,
    });
    const customId = store.commands.addCustomElement({
      page: 1,
      position: { x: 100, y: 120 },
      size: { width: 200, height: 100 },
      labelFontSize: 11,
      scale: 0.5,
      rotation: 0,
      svg: '<svg width="200" height="100"></svg>',
    });

    expect(store.getSnapshot().elements).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: occurrenceId, electroItemId: item.id }),
      expect.objectContaining({ id: customId, svg: '<svg width="200" height="100"></svg>' }),
    ]));
    expect(structure.placementTasks).toHaveLength(0);
    expect(mutationCommitted).toHaveBeenCalledTimes(2);

    expect(() => store.commands.addCustomElement({
      page: 1,
      position: { x: 0, y: 0 },
      size: { width: 0, height: 100 },
      labelFontSize: 11,
      scale: 1,
      rotation: 0,
      svg: "",
    })).toThrowError(expect.objectContaining<Partial<SituationPlanCommandError>>({
      code: "INVALID_ELEMENT_CHANGE",
    }));
  });

  it("rejects invalid placement changes without publishing", () => {
    const { structure, store } = createStore();
    const element = new SituationPlanElement();
    structure.sitplan.addElement(element);
    store.synchronizeLegacyDocument();
    const revision = store.getSnapshot().revision;

    expect(() => store.commands.updateElement(element.id, { scale: 0 })).toThrowError(
      expect.objectContaining<Partial<SituationPlanCommandError>>({ code: "INVALID_ELEMENT_CHANGE" }),
    );
    expect(() => store.commands.updateElement("missing", { rotation: 90 })).toThrowError(
      expect.objectContaining<Partial<SituationPlanCommandError>>({ code: "ELEMENT_NOT_FOUND" }),
    );
    expect(store.getSnapshot().revision).toBe(revision);
  });

  it("validates and publishes multi-placement changes atomically", () => {
    const { structure, mutationCommitted, store } = createStore();
    const first = new SituationPlanElement();
    const second = new SituationPlanElement();
    first.posx = 10;
    second.posx = 20;
    structure.sitplan.addElement(first);
    structure.sitplan.addElement(second);
    store.synchronizeLegacyDocument();
    mutationCommitted.mockClear();

    store.commands.updateElements([
      { elementId: first.id, changes: { position: { x: 15, y: 0 } } },
      { elementId: second.id, changes: { position: { x: 25, y: 0 } } },
    ]);

    expect(store.getSnapshot().elements.map(element => element.position.x)).toEqual([15, 25]);
    expect(mutationCommitted).toHaveBeenCalledOnce();

    expect(() => store.commands.updateElements([
      { elementId: first.id, changes: { rotation: 90 } },
      { elementId: second.id, changes: { scale: 0 } },
    ])).toThrowError(expect.objectContaining<Partial<SituationPlanCommandError>>({
      code: "INVALID_ELEMENT_CHANGE",
    }));
    expect(store.getSnapshot().elements[0].rotation).toBe(0);
  });

  it("translates a drag selection through one mergeable command key", () => {
    const { structure, mutationCommitted, store } = createStore();
    const first = new SituationPlanElement();
    const second = new SituationPlanElement();
    first.posx = 10;
    first.posy = 20;
    second.posx = 30;
    second.posy = 40;
    structure.sitplan.addElement(first);
    structure.sitplan.addElement(second);
    store.synchronizeLegacyDocument();
    mutationCommitted.mockClear();

    store.commands.translateElements([first.id, second.id], { x: 5, y: -2 }, "drag-1");

    expect(store.getSnapshot().elements.map(element => element.position)).toEqual([
      { x: 15, y: 18 },
      { x: 35, y: 38 },
    ]);
    expect(mutationCommitted).toHaveBeenCalledWith("drag-1");
    expect(() => store.commands.translateElements([first.id], { x: Number.NaN, y: 0 }, "drag-2"))
      .toThrowError(expect.objectContaining<Partial<SituationPlanCommandError>>({
        code: "INVALID_ELEMENT_CHANGE",
      }));
  });

  it("moves movable placements between stacking edges while preserving relative order", () => {
    const { structure, mutationCommitted, store } = createStore();
    const first = new SituationPlanElement();
    const second = new SituationPlanElement();
    const locked = new SituationPlanElement();
    locked.movable = false;
    structure.sitplan.addElement(first);
    structure.sitplan.addElement(second);
    structure.sitplan.addElement(locked);
    store.synchronizeLegacyDocument();
    mutationCommitted.mockClear();

    store.commands.bringElementsToFront([first.id]);
    expect(store.getSnapshot().elements.map(element => element.id)).toEqual([
      second.id,
      locked.id,
      first.id,
    ]);

    store.commands.sendElementsToBack([first.id]);
    expect(store.getSnapshot().elements.map(element => element.id)).toEqual([
      first.id,
      second.id,
      locked.id,
    ]);

    store.commands.bringElementsToFront([locked.id]);
    expect(store.getSnapshot().elements.map(element => element.id)).toEqual([
      first.id,
      second.id,
      locked.id,
    ]);
    expect(mutationCommitted).toHaveBeenCalledTimes(2);
  });

  it("aligns, distributes, and duplicates selected placements", () => {
    const { structure, store } = createStore();
    const elements = [0, 40, 100].map((x, index) => {
      const element = new SituationPlanElement();
      element.posx = x;
      element.posy = index * 20;
      structure.sitplan.addElement(element);
      return element;
    });
    store.synchronizeLegacyDocument();
    const ids = elements.map(element => element.id);

    store.commands.alignElements(ids, "top");
    expect(store.getSnapshot().elements.map(element => element.position.y)).toEqual([0, 0, 0]);

    store.commands.distributeElements(ids, "horizontal");
    expect(store.getSnapshot().elements.map(element => element.position.x)).toEqual([0, 50, 100]);

    const duplicateIds = store.commands.duplicateElements(ids, { x: 5, y: 10 });
    expect(duplicateIds).toHaveLength(3);
    expect(store.getSnapshot().elements.slice(3).map(element => element.position)).toEqual([
      { x: 5, y: 10 },
      { x: 55, y: 10 },
      { x: 105, y: 10 },
    ]);
  });

  it("deletes movable placements while preserving locked placements", () => {
    const { structure, store } = createStore();
    const movable = new SituationPlanElement();
    const locked = new SituationPlanElement();
    locked.movable = false;
    structure.sitplan.addElement(movable);
    structure.sitplan.addElement(locked);
    store.synchronizeLegacyDocument();

    store.commands.deleteElements([movable.id, locked.id]);

    expect(store.getSnapshot().elements.map(element => element.id)).toEqual([locked.id]);
    expect(store.commands.deleteElements([locked.id])).toEqual([]);
  });

  it("deletes a situation-only graph item in the same recorded transaction", () => {
    const { mutationCommitted, store, structure } = createStore();
    const container = structure.createContainerIfNotExists();
    const item = structure.createItem("Aardingsonderbreker");
    structure.insertChildAfterId(item, container.id);
    const element = new SituationPlanElement();
    element.setElectroItemId(item.id);
    structure.sitplan.addElement(element);
    store.synchronizeLegacyDocument();
    mutationCommitted.mockClear();

    expect(store.commands.deleteElements([element.id])).toEqual([item.id]);

    expect(structure.getElectroItemById(item.id)).toBeNull();
    expect(store.getSnapshot().elements).toHaveLength(0);
    expect(mutationCommitted).toHaveBeenCalledOnce();
  });
});
