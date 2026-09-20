import { flattenSVGfromString } from "../general";
import type { Hierarchical_List } from "../Hierarchical_List";
import { printPDF } from "../print/printToJsPDF";
import { SVGelement } from "../SVGelement";
import { createBoardLayoutPrintPages } from "./BoardLayoutPrint";

export interface PrintPreviewState {
  readonly edsPageCount: number;
  readonly sitplanPageCount: number;
  readonly boardPageCount: number;
  readonly totalPageCount: number;
  readonly displayPageIndex: number;
  readonly enableAutopage: boolean;
  readonly includeBoardLayout: boolean;
  readonly paperSize: string;
  readonly dpi: number;
  readonly verticalMode: string;
  readonly startY: number;
  readonly stopY: number;
  readonly pages: readonly Readonly<{ start: number; stop: number; info: string }>[];
}

export interface GeneratePdfOptions {
  readonly filename: string;
  readonly pageRange?: string;
  readonly statusElement: { innerHTML: string };
  readonly incompleteDraft?: boolean;
}

export interface PrintSettingsChanges {
  readonly paperSize?: "A4" | "A3";
  readonly dpi?: number;
  readonly enableAutopage?: boolean;
  readonly includeBoardLayout?: boolean;
  readonly verticalMode?: string;
  readonly startY?: number;
  readonly stopY?: number;
}

export interface PrintService {
  computeLayout(): SVGelement;
  getPreviewState(): PrintPreviewState;
  setDisplayPageIndex(pageIndex: number): void;
  validatePageRange(pageRange: string): boolean;
  updateSettings(changes: PrintSettingsChanges): void;
  addManualPage(): void;
  deleteManualPage(pageIndex: number): void;
  updateManualPage(pageIndex: number, changes: Readonly<{ stop?: number; info?: string }>): void;
  getPreviewSvg(pageIndex?: number, precomputedSvg?: SVGelement): string;
  generatePdf(options: GeneratePdfOptions): void;
}

/** React-facing adapter over the legacy print pipeline. It owns no state of
 *  its own: pagination, paper size and dpi stay on the authoritative legacy
 *  document, and SVG/PDF generation is delegated unchanged. */
export class LegacyPrintService implements PrintService {
  constructor(private readonly getDocument: () => Hierarchical_List) {}

  /** Regenerate the one-line SVG and feed its dimensions to the pagination
   *  table. Mirrors the sizing step the legacy print page performs first. */
  computeLayout(): SVGelement {
    const document = this.getDocument();
    const outSVG = document.toSVG(0, "horizontal");
    document.print_table.setHeight(outSVG.yup + outSVG.ydown);
    document.print_table.setMaxWidth(outSVG.xleft + outSVG.xright + 10);
    if (document.print_table.enableAutopage) document.print_table.autopage();
    this.clampDisplayPage();
    return outSVG;
  }

  getPreviewState(): PrintPreviewState {
    const document = this.getDocument();
    const edsPageCount = document.print_table.pages.length;
    const sitplanPageCount = document.sitplan ? document.sitplan.getNumPages() : 0;
    const boardPageCount = document.print_table.includeBoardLayout ? createBoardLayoutPrintPages(document).length : 0;
    return {
      edsPageCount,
      sitplanPageCount,
      boardPageCount,
      totalPageCount: edsPageCount + sitplanPageCount + boardPageCount,
      displayPageIndex: document.print_table.displaypage,
      enableAutopage: document.print_table.enableAutopage,
      includeBoardLayout: document.print_table.includeBoardLayout,
      paperSize: document.print_table.getPaperSize(),
      dpi: this.getDpi(),
      verticalMode: document.print_table.getModeVertical(),
      startY: document.print_table.getstarty(),
      stopY: document.print_table.getstopy(),
      pages: Object.freeze(document.print_table.pages.map(page => Object.freeze({
        start: page.start,
        stop: page.stop,
        info: page.info,
      }))),
    };
  }

  setDisplayPageIndex(pageIndex: number): void {
    this.getDocument().print_table.displaypage = pageIndex;
    this.clampDisplayPage();
  }

  validatePageRange(pageRange: string): boolean {
    const state = this.getPreviewState();
    return this.getDocument().print_table.canPrint(pageRange, state.totalPageCount);
  }

  updateSettings(changes: PrintSettingsChanges): void {
    const document = this.getDocument();
    if (changes.paperSize !== undefined) document.print_table.setPaperSize(changes.paperSize);
    if (changes.dpi !== undefined) document.properties.dpi = changes.dpi;
    if (changes.enableAutopage !== undefined) {
      document.print_table.enableAutopage = changes.enableAutopage;
    }
    if (changes.includeBoardLayout !== undefined) document.print_table.includeBoardLayout = changes.includeBoardLayout;
    if (changes.verticalMode !== undefined) document.print_table.setModeVertical(changes.verticalMode);
    if (changes.startY !== undefined) document.print_table.setstarty(changes.startY);
    if (changes.stopY !== undefined) document.print_table.setstopy(changes.stopY);
    this.computeLayout();
  }

  addManualPage(): void {
    this.getDocument().print_table.addPage();
    this.computeLayout();
  }

  deleteManualPage(pageIndex: number): void {
    const table = this.getDocument().print_table;
    this.assertManualPageIndex(pageIndex);
    if (table.pages.length === 1) {
      throw new RangeError("De laatste afdrukpagina kan niet worden verwijderd.");
    }
    table.deletePage(pageIndex);
    this.computeLayout();
  }

  updateManualPage(pageIndex: number, changes: Readonly<{ stop?: number; info?: string }>): void {
    const table = this.getDocument().print_table;
    this.assertManualPageIndex(pageIndex);
    if (changes.stop !== undefined) table.setStop(pageIndex, changes.stop);
    if (changes.info !== undefined) table.pages[pageIndex].info = changes.info;
    this.computeLayout();
  }

  /** SVG markup of one preview page: an EDS page cut from the full one-line
   *  drawing, or a situation-plan page beyond the EDS page count. */
  getPreviewSvg(
    pageIndex: number = this.getDocument().print_table.displaypage,
    precomputedSvg?: SVGelement,
  ): string {
    const document = this.getDocument();
    const edsPageCount = document.print_table.pages.length;
    if (pageIndex < edsPageCount) {
      return this.getEdsPageSvg(precomputedSvg ?? document.toSVG(0, "horizontal"), pageIndex);
    }
    const additionalPages = [
      ...(document.sitplan?.toSitPlanPrint().pages ?? []),
      ...(document.print_table.includeBoardLayout ? createBoardLayoutPrintPages(document) : []),
    ];
    return additionalPages[pageIndex - edsPageCount]?.svg ?? "";
  }

  generatePdf(options: GeneratePdfOptions): void {
    const document = this.getDocument();
    if (typeof document.properties.dpi === "undefined") document.properties.dpi = 300;

    const svg = flattenSVGfromString(
      document.toSVG(0, "horizontal").data,
      0,
      document.print_table.pagemarkers,
    );
    const state = this.getPreviewState();
    if (!this.validatePageRange(options.pageRange ?? "")) {
      throw new RangeError("Het opgegeven paginabereik is ongeldig.");
    }
    const pageRange = options.pageRange?.trim() !== "" && options.pageRange !== undefined
      ? options.pageRange.trim()
      : `1-${state.totalPageCount}`;

    // With automatic pagination every page carries the document info text.
    if (document.print_table.enableAutopage) {
      for (const page of document.print_table.pages) page.info = document.properties.info;
    }

    printPDF(
      svg,
      document.print_table,
      options.incompleteDraft
        ? { ...document.properties, info: ["CONCEPT — documentatie onvolledig", document.properties.info].filter(Boolean).join("<br>") }
        : document.properties,
      pageRange,
      options.filename,
      options.statusElement,
      {
        numpages: (document.sitplan?.toSitPlanPrint().pages.length ?? 0) + (document.print_table.includeBoardLayout ? createBoardLayoutPrintPages(document).length : 0),
        pages: [
          ...(document.sitplan?.toSitPlanPrint().pages ?? []).map(page => ({ ...page, name: "Situatieschema" })),
          ...(document.print_table.includeBoardLayout ? createBoardLayoutPrintPages(document) : []),
        ],
      },
    );
  }

  private getEdsPageSvg(outSVG: SVGelement, pageIndex: number): string {
    const printTable = this.getDocument().print_table;
    const startx = printTable.pages[pageIndex].start;
    const width = printTable.pages[pageIndex].stop - startx;
    const starty = printTable.getstarty();
    const height = printTable.getstopy() - starty;
    const viewbox = `${startx} ${starty} ${width} ${height}`;

    return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
      + ' transform="scale(1,1)" style="border:1px solid white"'
      + ` height="${height}" width="${width}" viewBox="${viewbox}">`
      + flattenSVGfromString(outSVG.data)
      + "</svg>";
  }

  private getDpi(): number {
    return this.getDocument().properties.dpi ?? 300;
  }

  private assertManualPageIndex(pageIndex: number): void {
    const pages = this.getDocument().print_table.pages;
    if (!Number.isInteger(pageIndex) || pageIndex < 0 || pageIndex >= pages.length) {
      throw new RangeError(`Ongeldige afdrukpagina: ${pageIndex}.`);
    }
  }

  private clampDisplayPage(): void {
    const document = this.getDocument();
    const state = this.getPreviewState();
    if (document.print_table.displaypage >= state.totalPageCount) {
      document.print_table.displaypage = Math.max(0, state.totalPageCount - 1);
    }
    if (document.print_table.displaypage < 0) document.print_table.displaypage = 0;
  }
}
