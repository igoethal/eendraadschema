import { afterEach, describe, expect, it, vi } from "vitest";
import type { Hierarchical_List } from "../Hierarchical_List";
import {
  configureLegacyDocumentLifecycle,
  loadFromText,
} from "../importExport/importExport";
import { loadFixture } from "./helpers";

afterEach(() => configureLegacyDocumentLifecycle(null));

describe("legacy document lifecycle boundary", () => {
  it("replaces and redraws through the configured host", () => {
    let current = loadFixture("example_default.eds");
    const replacement = loadFixture("example000.eds");
    const replaceDocument = vi.fn((document: Hierarchical_List) => { current = document; });
    const redrawDocument = vi.fn();
    const resetHistory = vi.fn();
    const recordHistory = vi.fn();
    configureLegacyDocumentLifecycle({
      getDocument: () => current,
      replaceDocument,
      redrawDocument,
      resetHistory,
      recordHistory,
      resetAutosave: vi.fn(),
      markDocumentLoaded: vi.fn(),
    });

    loadFromText(replacement.toJsonObject(false), 0);

    expect(replaceDocument).toHaveBeenCalledOnce();
    expect(current.length).toBe(replacement.length);
    expect(redrawDocument).toHaveBeenCalledOnce();
  });
});
