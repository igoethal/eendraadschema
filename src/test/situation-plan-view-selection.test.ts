import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocalNoticeStore } from "../application/NoticeStore";
import { LegacySituationPlanStore } from "../application/LegacySituationPlanStore";
import { SituationPlanElement } from "../sitplan/SituationPlanElement";
import { SituationPlanView } from "../sitplan/SituationPlanView";
import { loadFixture } from "./helpers";

beforeEach(() => {
  globalThis.SITPLANVIEW_DEFAULT_SCALE = 1;
  document.documentElement.style.setProperty("--selectPadding", "2");
});

describe("SituationPlanView selection boundary", () => {
  it("publishes stable element IDs directly and preserves selection across redraw", () => {
    const structure = loadFixture("example001.eds");
    const elements = [10, 30].map(position => {
      const element = new SituationPlanElement();
      element.setVars({ posx: position, posy: position, sizex: 10, sizey: 10 });
      element.svg = '<svg width="10" height="10"></svg>';
      structure.sitplan.addElement(element);
      return element;
    });
    const store = new LegacySituationPlanStore(structure);
    const canvas = document.createElement("div");
    const paper = document.createElement("div");
    canvas.append(paper);
    document.body.append(canvas);
    const listener = vi.fn();
    const noticeStore = new LocalNoticeStore({ get: () => undefined, set: () => {} });
    const view = new SituationPlanView(canvas, paper, store, noticeStore, listener);

    view.redraw();
    view.selectOneBox(elements[0].boxref);
    view.selectBox(elements[1].boxref);

    expect(listener).toHaveBeenLastCalledWith({
      elementIds: [elements[0].id, elements[1].id],
      primaryElementId: elements[1].id,
    });
    listener.mockClear();

    view.redraw();

    expect(listener).not.toHaveBeenCalled();
    expect(paper.querySelectorAll(".box.selected")).toHaveLength(2);

    view.clearSelection();
    expect(listener).toHaveBeenLastCalledWith({ elementIds: [], primaryElementId: null });
    canvas.remove();
  });
});
