import { describe, expect, it } from "vitest";
import { LegacyPrintService } from "../application/PrintService";
import { SVGSymbols } from "../SVGSymbols";
import { loadFixture } from "./helpers";

function createService() {
  SVGSymbols.clearSymbols();
  const structure = loadFixture("example001.eds");
  const service = new LegacyPrintService(() => structure);
  return { structure, service };
}

describe("LegacyPrintService", () => {
  it("computes the layout and reports the preview state", () => {
    const { structure, service } = createService();
    const outSVG = service.computeLayout();

    expect(structure.print_table.getHeight()).toBe(outSVG.yup + outSVG.ydown);
    expect(structure.print_table.getMaxWidth()).toBe(outSVG.xleft + outSVG.xright + 10);

    const state = service.getPreviewState();
    expect(state.edsPageCount).toBe(structure.print_table.pages.length);
    expect(state.sitplanPageCount).toBe(structure.sitplan ? structure.sitplan.getNumPages() : 0);
    expect(state.totalPageCount).toBe(state.edsPageCount + state.sitplanPageCount);
    expect(state.displayPageIndex).toBe(0);
    expect(state.paperSize).toBe(structure.print_table.getPaperSize());
    expect(state.dpi).toBeGreaterThan(0);
  });

  it("clamps the display page to the available pages", () => {
    const { structure, service } = createService();
    service.computeLayout();
    const state = service.getPreviewState();

    service.setDisplayPageIndex(state.totalPageCount + 5);
    expect(structure.print_table.displaypage).toBe(state.totalPageCount - 1);

    service.setDisplayPageIndex(-3);
    expect(structure.print_table.displaypage).toBe(0);

    service.setDisplayPageIndex(0);
    expect(structure.print_table.displaypage).toBe(0);
  });

  it("validates React-owned PDF page ranges", () => {
    const { service } = createService();
    service.computeLayout();
    const pageCount = service.getPreviewState().totalPageCount;

    expect(service.validatePageRange("")).toBe(true);
    expect(service.validatePageRange(`1-${pageCount}`)).toBe(true);
    expect(service.validatePageRange(`${pageCount + 1}`)).toBe(false);
    expect(service.validatePageRange("2-1")).toBe(false);
  });

  it("produces a viewbox-cropped SVG for an EDS preview page", () => {
    const { structure, service } = createService();
    const outSVG = service.computeLayout();
    const previewSvg = service.getPreviewSvg(0, outSVG);

    const page = structure.print_table.pages[0];
    const expectedViewbox = `${page.start} ${structure.print_table.getstarty()}`
      + ` ${page.stop - page.start}`
      + ` ${structure.print_table.getstopy() - structure.print_table.getstarty()}`;

    expect(previewSvg).toMatch(/^<svg /);
    expect(previewSvg).toContain(`viewBox="${expectedViewbox}"`);
    expect(previewSvg).toContain("</svg>");
  });

  it("manages manual page boundaries and metadata safely", () => {
    const { service } = createService();
    service.computeLayout();
    service.updateSettings({ enableAutopage: false });

    expect(() => service.deleteManualPage(0)).toThrow(RangeError);
    expect(() => service.updateManualPage(4, { info: "Onbereikbaar" })).toThrow(RangeError);

    service.addManualPage();
    const before = service.getPreviewState();
    const boundary = Math.max(before.pages[0].start, before.pages[0].stop - 1);
    service.updateManualPage(0, { stop: boundary, info: "Verdeler" });

    const updated = service.getPreviewState();
    expect(updated.pages).toHaveLength(2);
    expect(updated.pages[0]).toMatchObject({ stop: boundary, info: "Verdeler" });
    expect(updated.pages[1].start).toBe(boundary);

    service.deleteManualPage(1);
    expect(service.getPreviewState().pages).toHaveLength(1);
  });
});
