import { useEffect, useRef, useState } from "react";
import type { PrintService } from "../../application/PrintService";
import type { SvgExportService } from "../../application/SvgExportService";
import type { DossierIssue } from "../../application/DossierReader";

interface PrintDialogProps {
  readonly printService: PrintService;
  readonly svgExportService: SvgExportService;
  readonly onClose: () => void;
  readonly dossierIssues?: readonly DossierIssue[];
}

export function PrintDialog({ printService, svgExportService, onClose, dossierIssues = [] }: PrintDialogProps) {
  const [, setRevision] = useState(0);
  const [pdfFilename, setPdfFilename] = useState("eendraadschema_print.pdf");
  const [svgFilename, setSvgFilename] = useState("eendraadschema_print.svg");
  const [pageRange, setPageRange] = useState("");
  const status = useRef<HTMLSpanElement>(null);
  const state = printService.getPreviewState();

  useEffect(() => {
    printService.computeLayout();
    setRevision(value => value + 1);
  }, [printService]);

  function refresh() {
    printService.computeLayout();
    setRevision(value => value + 1);
  }

  const previewSvg = state.totalPageCount > 0 ? printService.getPreviewSvg() : "";
  const validPageRange = printService.validatePageRange(pageRange);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="print-dialog-title" className="grid max-h-[95vh] w-full max-w-6xl gap-5 overflow-auto rounded-xl bg-white p-6 shadow-2xl lg:grid-cols-[20rem_1fr]">
        <aside>
          <div className="flex items-start justify-between">
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-wide text-blue-700">Uitvoer</p>
              <h2 id="print-dialog-title" className="my-1 text-2xl font-bold">Afdrukken</h2>
            </div>
            <button type="button" className="rounded px-2 py-1 text-xl hover:bg-neutral-100" aria-label="Sluiten" onClick={onClose}>×</button>
          </div>
          <div className="mt-5 grid gap-3">
            {dossierIssues.length > 0 ? <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950"><strong>Documentatie nakijken ({dossierIssues.length})</strong><ul className="mb-0 mt-1 pl-4">{dossierIssues.slice(0, 3).map(issue => <li key={issue.id}>{issue.message}</li>)}</ul><p className="mb-0 mt-2">U kunt enkel verder als expliciet onvolledig concept.</p></div> : null}
            <label className="grid gap-1 text-sm font-semibold">
              Papierformaat
              <select
                className="rounded border border-neutral-300 px-3 py-2"
                value={state.paperSize}
                onChange={(event) => {
                  printService.updateSettings({ paperSize: event.target.value === "A3" ? "A3" : "A4" });
                  refresh();
                }}
              >
                <option>A4</option>
                <option>A3</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              Resolutie
              <select
                className="rounded border border-neutral-300 px-3 py-2"
                value={state.dpi}
                onChange={(event) => {
                  printService.updateSettings({ dpi: Number(event.target.value) });
                  refresh();
                }}
              >
                {[150, 300, 600].map(dpi => <option key={dpi} value={dpi}>{dpi} dpi</option>)}
              </select>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input
                className="mt-1"
                type="checkbox"
                checked={state.enableAutopage}
                onChange={(event) => {
                  printService.updateSettings({ enableAutopage: event.target.checked });
                  refresh();
                }}
              />
              Automatisch over pagina&apos;s verdelen
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input className="mt-1" type="checkbox" checked={state.includeBoardLayout} onChange={(event) => { printService.updateSettings({ includeBoardLayout: event.target.checked }); refresh(); }} />
              Bordindeling als bijlage toevoegen
            </label>
            {!state.enableAutopage ? (
              <div className="grid gap-2 rounded border border-neutral-200 bg-neutral-50 p-3">
                <label className="grid gap-1 text-sm font-semibold">
                  Verticale uitsnede
                  <select
                    className="rounded border border-neutral-300 px-3 py-2"
                    value={state.verticalMode}
                    onChange={(event) => {
                      printService.updateSettings({ verticalMode: event.target.value });
                      refresh();
                    }}
                  >
                    <option value="alles">Volledige hoogte</option>
                    <option value="kies">Handmatig bereik</option>
                  </select>
                </label>
                {state.verticalMode === "kies" ? (
                  <div className="grid grid-cols-2 gap-2">
                    <label className="grid gap-1 text-xs font-semibold">
                      Start Y
                      <input
                        className="rounded border border-neutral-300 px-2 py-1"
                        type="number"
                        value={state.startY}
                        onChange={(event) => {
                          printService.updateSettings({ startY: Number(event.target.value) });
                          refresh();
                        }}
                      />
                    </label>
                    <label className="grid gap-1 text-xs font-semibold">
                      Stop Y
                      <input
                        className="rounded border border-neutral-300 px-2 py-1"
                        type="number"
                        value={state.stopY}
                        onChange={(event) => {
                          printService.updateSettings({ stopY: Number(event.target.value) });
                          refresh();
                        }}
                      />
                    </label>
                  </div>
                ) : null}
                <div className="max-h-56 overflow-auto">
                  {state.pages.map((page, index) => (
                    <div key={`${index}-${page.start}`} className="mb-2 grid grid-cols-[2rem_1fr_2fr_auto] items-end gap-1 text-xs">
                      <span className="pb-2 font-semibold">{index + 1}</span>
                      <label className="grid gap-1">
                        Stop X
                        <input
                          className="min-w-0 rounded border border-neutral-300 px-2 py-1"
                          type="number"
                          value={page.stop}
                          disabled={index === state.pages.length - 1}
                          onChange={(event) => {
                            printService.updateManualPage(index, { stop: Number(event.target.value) });
                            refresh();
                          }}
                        />
                      </label>
                      <label className="grid gap-1">
                        Info
                        <input
                          className="min-w-0 rounded border border-neutral-300 px-2 py-1"
                          value={page.info}
                          onChange={(event) => {
                            printService.updateManualPage(index, { info: event.target.value });
                            refresh();
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        className="rounded border border-red-200 px-2 py-1 text-red-700"
                        disabled={state.pages.length <= 1}
                        aria-label={`Pagina ${index + 1} verwijderen`}
                        onClick={() => {
                          printService.deleteManualPage(index);
                          refresh();
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="rounded border border-neutral-300 px-3 py-1 text-xs font-semibold"
                    onClick={() => {
                      printService.addManualPage();
                      refresh();
                    }}
                  >
                    Pagina toevoegen
                  </button>
                </div>
              </div>
            ) : null}
            <label className="grid gap-1 text-sm font-semibold">
              Paginabereik
              <input
                className="rounded border border-neutral-300 px-3 py-2"
                aria-invalid={!validPageRange}
                placeholder={`1-${state.totalPageCount}`}
                value={pageRange}
                onChange={event => setPageRange(event.target.value)}
              />
              {!validPageRange ? <span className="text-xs font-normal text-red-700">Gebruik oplopende pagina&apos;s binnen 1-{state.totalPageCount}.</span> : null}
            </label>
            <label className="grid gap-1 text-sm font-semibold">
              PDF-bestandsnaam
              <input className="rounded border border-neutral-300 px-3 py-2" value={pdfFilename} onChange={event => setPdfFilename(event.target.value)} />
            </label>
            <button
              type="button"
              className="rounded bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
              disabled={!validPageRange}
              onClick={() => {
                if (!status.current) return;
                if (dossierIssues.length > 0 && !window.confirm("Er zijn onopgeloste dossierpunten. Exporteer als onvolledig concept?")) return;
                printService.generatePdf({
                  filename: pdfFilename,
                  pageRange,
                  statusElement: status.current,
                  incompleteDraft: dossierIssues.length > 0,
                });
              }}
            >
              PDF genereren
            </button>
            <span ref={status} className="text-sm text-neutral-600" role="status" />
          </div>
        </aside>
        <main>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <label className="grid gap-1 text-sm font-semibold">
              Voorbeeldpagina
              <select
                className="rounded border border-neutral-300 px-3 py-2"
                value={state.displayPageIndex}
                onChange={(event) => {
                  printService.setDisplayPageIndex(Number(event.target.value));
                  setRevision(value => value + 1);
                }}
              >
                {Array.from({ length: state.totalPageCount }, (_, index) => (
                  <option key={index} value={index}>Pagina {index + 1}</option>
                ))}
              </select>
            </label>
            <div className="flex gap-2">
              <input className="rounded border border-neutral-300 px-3 py-2 text-sm" aria-label="SVG-bestandsnaam" value={svgFilename} onChange={event => setSvgFilename(event.target.value)} />
              <button type="button" className="rounded border border-neutral-300 px-3 py-2 text-sm font-semibold hover:bg-neutral-50" disabled={!previewSvg} onClick={() => svgExportService.download(previewSvg, svgFilename)}>
                SVG downloaden
              </button>
            </div>
          </div>
          <div aria-label="Afdrukvoorbeeld" className="flex min-h-[30rem] items-start justify-center overflow-auto rounded-lg border border-neutral-300 bg-neutral-100 p-4">
            {previewSvg
              ? <div className="max-w-full bg-white shadow" dangerouslySetInnerHTML={{ __html: previewSvg }} />
              : <p className="text-neutral-500">Geen afdrukvoorbeeld beschikbaar.</p>}
          </div>
        </main>
      </section>
    </div>
  );
}
