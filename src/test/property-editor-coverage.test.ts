import { describe, expect, it } from "vitest";
import { PUBLIC_ELECTRO_ITEM_TYPES } from "../Hierarchical_List";
import { propertyEditors } from "../ui/properties/propertyEditors";

describe("React property editor coverage", () => {
  it("covers every public item type known to the item factory", () => {
    expect(PUBLIC_ELECTRO_ITEM_TYPES.length).toBeGreaterThanOrEqual(48);
  });

  it.each(PUBLIC_ELECTRO_ITEM_TYPES)("has an editor for %s", (type) => {
    expect(propertyEditors[type]).toBeDefined();
  });

  it("keeps internal container nodes out of the public editor registry", () => {
    expect(propertyEditors.Container).toBeUndefined();
  });

  it("registers no editor for a type the factory does not know", () => {
    const knownTypes = new Set<string>(PUBLIC_ELECTRO_ITEM_TYPES);
    for (const registeredType of Object.keys(propertyEditors)) {
      expect(knownTypes.has(registeredType), `unknown type: ${registeredType}`).toBe(true);
    }
  });
});
