import { useState, type FormEvent } from "react";
import type { DossierMetadata } from "../../domain/Dossier";
import type { SchemaStore } from "../../application/SchemaStore";
import { ui } from "../uiStyles";

interface DossierDetailsFormProps {
  readonly metadata: DossierMetadata;
  readonly schemaStore: SchemaStore;
  readonly onError: (message: string) => void;
}

export function DossierDetailsForm({ metadata, schemaStore, onError }: DossierDetailsFormProps) {
  const [draft, setDraft] = useState(metadata);

  function update(changes: Partial<DossierMetadata>) {
    setDraft(current => ({ ...current, ...changes }));
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      schemaStore.commands.updateDossierMetadata(draft);
      onError("");
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : "De dossiergegevens konden niet worden opgeslagen.");
    }
  }

  return (
    <form className="grid gap-3" onSubmit={save} aria-labelledby="dossier-details-title">
      <div>
        <h2 className="m-0 text-lg font-semibold" id="dossier-details-title">Dossiergegevens</h2>
        <p className="mb-0 mt-1 text-sm text-neutral-600">Deze gegevens verschijnen op de documentatie en bij export.</p>
      </div>
      <label className={ui.label}>
        Type installatie
        <select className={ui.field} value={draft.installationContext} onChange={event => update({ installationContext: event.target.value as DossierMetadata["installationContext"] })}>
          <option value="new">Nieuwe installatie</option>
          <option value="change">Wijziging of uitbreiding</option>
          <option value="existing">Bestaande installatie</option>
        </select>
      </label>
      <label className={ui.label}>
        Adres van de installatie
        <textarea className={ui.field} rows={2} value={draft.installationAddress} onChange={event => update({ installationAddress: event.target.value })} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className={ui.label}>Spanning<input className={ui.field} placeholder="bv. 230 V" value={draft.nominalVoltage} onChange={event => update({ nominalVoltage: event.target.value })} /></label>
        <label className={ui.label}>Stroom
          <select className={ui.field} value={draft.currentNature} onChange={event => update({ currentNature: event.target.value as DossierMetadata["currentNature"] })}>
            <option value="">—</option><option value="AC">Wisselstroom</option><option value="DC">Gelijkstroom</option><option value="other">Anders</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className={ui.label}>Frequentie (Hz)<input className={ui.field} inputMode="decimal" placeholder="50" value={draft.frequencyHz} onChange={event => update({ frequencyHz: event.target.value })} /></label>
        <label className={ui.label}>Documentversie<input className={ui.field} placeholder="1.0" value={draft.revisionLabel} onChange={event => update({ revisionLabel: event.target.value })} /></label>
      </div>
      <label className={ui.label}>Uitgiftedatum<input className={ui.field} type="date" value={draft.issueDate} onChange={event => update({ issueDate: event.target.value })} /></label>
      <button className={ui.primaryButton} type="submit">Dossiergegevens opslaan</button>
    </form>
  );
}
