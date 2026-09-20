export type HelpDialogKind = "documentation" | "about";

interface HelpDialogProps {
  readonly kind: HelpDialogKind;
  readonly onClose: () => void;
}

export function HelpDialog({ kind, onClose }: HelpDialogProps) {
  const isDocumentation = kind === "documentation";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-dialog-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-blue-700">
              {isDocumentation ? "Hulp bij het tekenen" : "Over deze toepassing"}
            </p>
            <h2 id="help-dialog-title" className="my-1 text-2xl font-bold">
              {isDocumentation ? "Documentatie" : "Info en contact"}
            </h2>
          </div>
          <button
            type="button"
            className="rounded px-2 py-1 text-xl hover:bg-neutral-100"
            aria-label="Sluiten"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {isDocumentation ? <DocumentationContent /> : <AboutContent />}
      </section>
    </div>
  );
}

function DocumentationContent() {
  const linkClass = "inline-flex rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800";
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <article className="rounded-xl border border-neutral-200 p-4">
        <h3 className="mt-0 text-lg">Eendraadschema</h3>
        <p className="text-sm text-neutral-600">
          De volledige handleiding behandelt de opbouw, onderdelen, bestanden en uitvoer van het schema.
        </p>
        <a className={linkClass} href="Documentation/edsdoc.pdf" target="_blank" rel="noopener noreferrer">
          Open handleiding
        </a>
      </article>
      <article className="rounded-xl border border-neutral-200 p-4">
        <h3 className="mt-0 text-lg">Situatieschema</h3>
        <p className="text-sm text-neutral-600">
          Deze beknopte handleiding legt pagina's, achtergronden, plaatsingen en bewerkingen uit.
        </p>
        <a className={linkClass} href="Documentation/sitplandoc.pdf" target="_blank" rel="noopener noreferrer">
          Open handleiding
        </a>
      </article>
      <p className="m-0 rounded-lg bg-amber-50 p-3 text-sm text-amber-950 sm:col-span-2">
        De toepassing evolueert verder; delen van de PDF-handleidingen kunnen daarom nog de vroegere interface tonen.
      </p>
    </div>
  );
}

function AboutContent() {
  return (
    <div className="mt-5 space-y-4 text-sm text-neutral-700">
      <p className="m-0">
        Eendraadschema is een toepassing om elektrische dossiers met een eendraadschema en situatieschema op te bouwen.
      </p>
      <p className="m-0">
        Een creatie van{" "}
        <a className="font-semibold text-blue-700 underline" href="https://ivan.goethals-jacobs.be" target="_blank" rel="noopener noreferrer">
          Ivan Goethals
        </a>.
      </p>
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <h3 className="mt-0 text-base">Contact</h3>
        <p className="mb-3 mt-0">Gebruik de online versie voor het contactformulier en de meest recente publieke versie.</p>
        <a
          className="inline-flex rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
          href="https://eendraadschema.goethals-jacobs.be"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open de online versie
        </a>
      </div>
    </div>
  );
}
