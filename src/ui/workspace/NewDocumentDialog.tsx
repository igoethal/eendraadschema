import { useState } from "react";

export interface NewDocumentOptions {
  readonly phaseCount: 2 | 3 | 4;
  readonly mainBreakerAmperage: number;
  readonly mainDifferentialMilliamps: number;
}

interface NewDocumentDialogProps {
  readonly onLoadExample: (example: 0 | 1) => void;
  readonly onCreateEmpty: (options: NewDocumentOptions) => void;
  readonly onOpen: () => void;
  readonly onClose: () => void;
}

export function NewDocumentDialog({
  onLoadExample,
  onCreateEmpty,
  onOpen,
  onClose,
}: NewDocumentDialogProps) {
  const [phaseCount, setPhaseCount] = useState<2 | 3 | 4>(2);
  const [mainBreakerAmperage, setMainBreakerAmperage] = useState("65");
  const [mainDifferentialMilliamps, setMainDifferentialMilliamps] = useState("300");
  const breakerValue = Number(mainBreakerAmperage);
  const differentialValue = Number(mainDifferentialMilliamps);
  const canCreateEmpty = Number.isFinite(breakerValue)
    && breakerValue > 0
    && Number.isFinite(differentialValue)
    && differentialValue > 0;
  const primaryButton = "rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700/35";
  const cardClass = "flex min-h-44 flex-col rounded-xl border border-neutral-200 bg-white p-4 shadow-sm";

  function loadExample(example: 0 | 1) {
    onLoadExample(example);
    onClose();
  }

  function createEmpty() {
    if (!canCreateEmpty) return;
    onCreateEmpty({
      phaseCount,
      mainBreakerAmperage: breakerValue,
      mainDifferentialMilliamps: differentialValue,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-document-title"
        className="max-h-[94vh] w-full max-w-5xl overflow-auto rounded-2xl bg-neutral-50 p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-blue-700">Nieuw elektrisch dossier</p>
            <h2 id="new-document-title" className="my-1 text-2xl font-bold">Welkom op ééndraadschema</h2>
            <p className="m-0 max-w-3xl text-sm text-neutral-600">
              Start met een voorbeeld, maak een basisschema voor je woning of open een bestaand EDS-bestand.
            </p>
          </div>
          <button type="button" className="rounded px-2 py-1 text-xl hover:bg-neutral-200" aria-label="Sluiten" onClick={onClose}>×</button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className={cardClass}>
            <p className="m-0 text-xs font-semibold uppercase text-blue-700">Voorbeeld 1</p>
            <h3 className="my-2 text-lg">Eenvoudige woning</h3>
            <p className="mb-5 mt-0 flex-1 text-sm text-neutral-600">Contactdozen en verlichting in een overzichtelijk startschema.</p>
            <button id="start-example-0" type="button" className={primaryButton} onClick={() => loadExample(0)}>Start met voorbeeld 1</button>
          </article>

          <article className={cardClass}>
            <p className="m-0 text-xs font-semibold uppercase text-blue-700">Voorbeeld 2</p>
            <h3 className="my-2 text-lg">Uitgebreide installatie</h3>
            <p className="mb-5 mt-0 flex-1 text-sm text-neutral-600">Een groter dossier met schakelingen, verbruikers en gekoppelde onderdelen.</p>
            <button id="start-example-1" type="button" className={primaryButton} onClick={() => loadExample(1)}>Start met voorbeeld 2</button>
          </article>

          <article className={`${cardClass} md:col-span-2 xl:col-span-1`}>
            <p className="m-0 text-xs font-semibold uppercase text-emerald-700">Leeg schema</p>
            <h3 className="my-2 text-lg">Basisgegevens</h3>
            <div className="grid flex-1 gap-2 text-sm">
              <label className="grid gap-1 font-semibold">Fasen
                <select className="rounded border border-neutral-300 bg-white px-2 py-1.5" value={phaseCount} onChange={event => setPhaseCount(Number(event.target.value) as 2 | 3 | 4)}>
                  <option value={2}>2-polig</option>
                  <option value={3}>3-polig</option>
                  <option value={4}>4-polig (3P+N)</option>
                </select>
              </label>
              <label className="grid gap-1 font-semibold">Hoofdzekering (A)
                <input className="rounded border border-neutral-300 px-2 py-1.5" type="number" min={1} required value={mainBreakerAmperage} onChange={event => setMainBreakerAmperage(event.target.value)} />
              </label>
              <label className="grid gap-1 font-semibold">Hoofddifferentieel (mA)
                <input className="rounded border border-neutral-300 px-2 py-1.5" type="number" min={1} required value={mainDifferentialMilliamps} onChange={event => setMainDifferentialMilliamps(event.target.value)} />
              </label>
            </div>
            <button id="start-empty-document" type="button" disabled={!canCreateEmpty} className={`${primaryButton} mt-4 bg-emerald-700 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50`} onClick={createEmpty}>Start met een leeg schema</button>
          </article>

          <article className={cardClass}>
            <p className="m-0 text-xs font-semibold uppercase text-amber-700">Bestaand dossier</p>
            <h3 className="my-2 text-lg">EDS-bestand openen</h3>
            <p className="mb-5 mt-0 flex-1 text-sm text-neutral-600">Ga verder met een eerder opgeslagen dossier op deze computer.</p>
            <button id="start-open-document" type="button" className="rounded-md border border-amber-400 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-950 hover:bg-amber-100" onClick={() => { onOpen(); onClose(); }}>Open een EDS-bestand</button>
          </article>
        </div>
      </section>
    </div>
  );
}
