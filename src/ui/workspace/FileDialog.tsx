import { useState } from "react";
import type { FileService } from "../../application/FileService";
import type { SchemaStore } from "../../application/SchemaStore";
import { useSchemaSnapshot } from "../useSchemaSnapshot";

interface FileDialogProps {
  readonly fileService: FileService;
  readonly schemaStore: SchemaStore;
  readonly onOpen: () => void;
  readonly onAppend: () => void;
  readonly onClose: () => void;
}

export function FileDialog({
  fileService,
  schemaStore,
  onOpen,
  onAppend,
  onClose,
}: FileDialogProps) {
  useSchemaSnapshot(schemaStore);
  const state = fileService.getState();
  const [filename, setFilename] = useState(state.filename);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(saveAs: boolean) {
    setBusy(true);
    setError("");
    try {
      schemaStore.commands.updateFileSettings({ filename });
      await fileService.saveDocument(saveAs);
    } catch (caught) {
      if (!(caught instanceof DOMException && caught.name === "AbortError")) {
        setError(caught instanceof Error ? caught.message : "Het document kon niet worden opgeslagen.");
      }
    } finally {
      setBusy(false);
    }
  }

  const buttonClass = "rounded bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-50";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="file-dialog-title" className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-blue-700">Elektrisch dossier</p>
            <h2 id="file-dialog-title" className="my-1 text-2xl font-bold">Bestand</h2>
          </div>
          <button type="button" className="rounded px-2 py-1 text-xl hover:bg-neutral-100" aria-label="Sluiten" onClick={onClose}>×</button>
        </div>
        {error ? <p className="rounded bg-red-50 p-3 text-red-800" role="alert">{error}</p> : null}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <article className="rounded-lg border border-neutral-200 p-4">
            <h3 className="mt-0">Openen</h3>
            <p className="text-sm text-neutral-600">Open een bestaand EDS-bestand en vervang het huidige dossier.</p>
            <button type="button" className={buttonClass} onClick={() => {
              onOpen();
              onClose();
            }}>EDS-bestand openen</button>
          </article>
          <article className="rounded-lg border border-neutral-200 p-4">
            <h3 className="mt-0">Opslaan</h3>
            <label className="grid gap-1 text-sm font-semibold">
              Bestandsnaam
              <input className="rounded border border-neutral-300 px-3 py-2" value={filename} onChange={event => setFilename(event.target.value)} />
            </label>
            <label className="mt-3 flex items-start gap-2 text-sm">
              <input
                className="mt-1"
                type="checkbox"
                checked={state.compressionDisabled}
                onChange={event => schemaStore.commands.updateFileSettings({
                  compressionDisabled: event.target.checked,
                })}
              />
              Compatibele tekstuitvoer gebruiken zonder compressie.
            </label>
            {state.lastSavedAt ? <p className="text-xs text-neutral-500">Laatst opgeslagen: {state.lastSavedAt}</p> : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className={buttonClass} disabled={busy} onClick={() => save(false)}>
                {busy ? "Opslaan…" : "Opslaan"}
              </button>
              {state.fileApiAvailable ? (
                <button type="button" className="rounded border border-neutral-300 px-4 py-2 font-semibold hover:bg-neutral-50" disabled={busy} onClick={() => save(true)}>
                  Opslaan als
                </button>
              ) : null}
            </div>
          </article>
          <article className="rounded-lg border border-amber-200 bg-amber-50 p-4 md:col-span-2">
            <h3 className="mt-0">Dossiers samenvoegen</h3>
            <p className="text-sm text-neutral-700">Voeg verdeelborden en onderdelen uit een ander EDS-bestand aan dit dossier toe.</p>
            <button type="button" className="rounded border border-amber-400 bg-white px-4 py-2 font-semibold text-amber-900 hover:bg-amber-100" onClick={() => {
              onAppend();
              onClose();
            }}>
              EDS-bestand samenvoegen
            </button>
          </article>
        </div>
      </section>
    </div>
  );
}
