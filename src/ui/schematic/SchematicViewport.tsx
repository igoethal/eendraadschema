import type { SchematicRenderStore } from "../../application/SchematicRenderStore";
import { useSchematicRenderSnapshot } from "../useSchematicRenderSnapshot";

interface SchematicViewportProps {
  readonly renderStore: SchematicRenderStore;
  readonly buildDate: string;
}

const legendItems = [
  ["↑", "Item hierboven invoegen (zelfde niveau)"],
  ["↓", "Item hieronder invoegen (zelfde niveau)"],
  ["↳", "Afhankelijk item hieronder toevoegen (niveau dieper)"],
  ["🗑", "Item verwijderen"],
] as const;

export function SchematicViewport({ renderStore, buildDate }: SchematicViewportProps) {
  const { svg } = useSchematicRenderSnapshot(renderStore);

  return (
    <section aria-label="Eéndraadschema" className="grid min-h-full content-start gap-4 p-2.5 text-black">
      <p className="m-0 text-sm text-neutral-700">
        <strong>Tekening: </strong>
        Gebruik de plusknoppen op de lijnen om een onderdeel tussen twee symbolen of aan het einde van een tak toe te voegen. Gebruik Print om de tekening af te drukken of als SVG te exporteren.
      </p>
      <div
        id="EDS"
        className="min-w-max"
        // This boundary accepts markup only from the internal electrical SVG renderer.
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <aside aria-label="Legende van het eendraadschema" className="grid max-w-xl gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
        <h2 className="m-0 text-base font-semibold">Legende</h2>
        <dl className="m-0 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 text-sm">
          {legendItems.map(([symbol, description]) => (
            <div key={symbol} className="contents">
              <dt className="flex size-7 items-center justify-center rounded border border-neutral-300 bg-white font-bold" aria-hidden="true">{symbol}</dt>
              <dd className="m-0">{description}</dd>
            </div>
          ))}
        </dl>
      </aside>
      <footer className="pb-3 text-xs italic text-neutral-500">
        Versie: {buildDate} · © Ivan Goethals ·{" "}
        <a className="underline hover:text-blue-800" href="license.html" target="_blank" rel="noopener noreferrer">Voorwaarden</a>
      </footer>
    </section>
  );
}
