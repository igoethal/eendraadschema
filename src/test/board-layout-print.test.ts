import { beforeEach, describe, expect, it } from "vitest";
import { createBoardLayoutPrintPages } from "../application/BoardLayoutPrint";
import { LegacySchemaStore } from "../application/LegacySchemaStore";
import { loadFixture } from "./helpers";

beforeEach(() => { globalThis.SITPLANVIEW_DEFAULT_SCALE = 1; });

describe("board-layout print appendix", () => {
  it("renders a named DIN-rail page from the persisted layout", () => {
    const structure = loadFixture("example001.eds");
    const store = new LegacySchemaStore(structure);
    const item = store.getSnapshot().document.getAllItems().find(candidate => candidate.role === "item" && store.getSnapshot().document.getBoardForItem(candidate.id)?.id === "main")!;
    const railId = store.commands.addBoardLayoutRail("main", { name: "Rij test", moduleCapacity: 6 });
    store.commands.placeBoardLayoutItem("main", item.id, { railId, startModule: 1, moduleWidth: 2 });

    const page = createBoardLayoutPrintPages(store.getLegacyDocument())[0];
    expect(page.name).toContain("Bordindeling");
    expect(page.svg).toContain("Rij test");
    expect(page.svg).toContain("2M");
  });
});
