import { beforeEach, describe, expect, it } from "vitest";
import { SituationPlan } from "../sitplan/SituationPlan";
import { SituationPlanElement } from "../sitplan/SituationPlanElement";

beforeEach(() => {
  globalThis.SITPLANVIEW_DEFAULT_SCALE = 1;
});

describe("SituationPlan document state", () => {
  it("owns page creation, selection and deletion independently of the view", () => {
    const plan = new SituationPlan();
    const secondPageElement = new SituationPlanElement();
    const thirdPageElement = new SituationPlanElement();
    secondPageElement.page = 2;
    thirdPageElement.page = 3;
    plan.addElement(secondPageElement);
    plan.addElement(thirdPageElement);

    expect(plan.addPage()).toBe(2);
    expect(plan.addPage()).toBe(3);
    plan.setActivePage(2);

    expect(plan.deletePage(2)).toBe(true);
    expect(plan.getPageCount()).toBe(2);
    expect(plan.getActivePage()).toBe(2);
    expect(plan.getElements()).toEqual([thirdPageElement]);
    expect(thirdPageElement.page).toBe(2);
  });

  it("does not delete the only page", () => {
    const plan = new SituationPlan();

    expect(plan.deletePage(1)).toBe(false);
    expect(plan.getPageCount()).toBe(1);
    expect(plan.getActivePage()).toBe(1);
  });

  it("persists defaults and exposes them as an immutable snapshot", () => {
    const plan = new SituationPlan();
    plan.updateDefaults({ fontsize: 14, scale: 0.75 });

    const defaults = plan.getDefaults();
    expect(defaults).toEqual({ fontsize: 14, scale: 0.75, rotate: 0 });
    expect(Object.isFrozen(defaults)).toBe(true);
    expect(plan.toJsonObject().defaults).toEqual(defaults);
  });
});
