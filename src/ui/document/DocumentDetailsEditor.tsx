import { useEffect, useState, type FormEvent } from "react";
import type { SchemaDocumentDetails } from "../../application/SchemaDocumentReader";
import type { SchemaStore } from "../../application/SchemaStore";
import { ui } from "../uiStyles";

interface DocumentDetailsEditorProps {
  readonly details: SchemaDocumentDetails;
  readonly schemaStore: SchemaStore;
  readonly reportError: (message: string) => void;
}

function htmlBreaksToNewlines(value: string): string {
  return value.replace(/<br\s*\/?>/gi, "\n");
}

function newlinesToHtmlBreaks(value: string): string {
  return value.replace(/\r?\n/g, "<br>");
}

export function DocumentDetailsEditor({ details, schemaStore, reportError }: DocumentDetailsEditorProps) {
  const [owner, setOwner] = useState(() => htmlBreaksToNewlines(details.owner));
  const [installer, setInstaller] = useState(() => htmlBreaksToNewlines(details.installer));
  const [control, setControl] = useState(() => htmlBreaksToNewlines(details.control));
  const [info, setInfo] = useState(() => htmlBreaksToNewlines(details.info));
  const [dossier, setDossier] = useState(details.dossier);

  useEffect(() => {
    setOwner(htmlBreaksToNewlines(details.owner));
    setInstaller(htmlBreaksToNewlines(details.installer));
    setControl(htmlBreaksToNewlines(details.control));
    setInfo(htmlBreaksToNewlines(details.info));
    setDossier(details.dossier);
  }, [details.owner, details.installer, details.control, details.info]);

  function save(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    try {
      schemaStore.commands.updateDocumentDetails({
        owner: newlinesToHtmlBreaks(owner),
        installer: newlinesToHtmlBreaks(installer),
        control: newlinesToHtmlBreaks(control),
        info: newlinesToHtmlBreaks(info),
      });
      schemaStore.commands.updateDossierMetadata(dossier);
      reportError("");
    } catch (error) {
      reportError(error instanceof Error ? error.message : "De documentgegevens konden niet worden opgeslagen.");
    }
  }

  return (
    <details className="mt-3">
      <summary className="cursor-pointer font-semibold">Documentgegevens</summary>
      <form className="mt-2.5 grid gap-2" onSubmit={save}>
        <label className={ui.label}>Plaats van de elektrische installatie<textarea className={ui.field} rows={5} value={owner} onChange={(event) => setOwner(event.target.value)} /></label>
        <label className={ui.label}>Installateur<textarea className={ui.field} rows={3} value={installer} onChange={(event) => setInstaller(event.target.value)} /></label>
        <label className={ui.label}>Erkend organisme (keuring)<textarea className={ui.field} rows={3} value={control} onChange={(event) => setControl(event.target.value)} /></label>
        <label className={ui.label}>Info<textarea className={ui.field} rows={2} value={info} onChange={(event) => setInfo(event.target.value)} /></label>
        <fieldset className="grid gap-2 rounded border border-neutral-200 p-2">
          <legend className="px-1 text-sm font-semibold">Dossiergegevens</legend>
          <label className={ui.label}>Projectcontext<select className={ui.field} value={dossier.installationContext} onChange={event => setDossier(value => ({ ...value, installationContext: event.target.value as typeof value.installationContext }))}><option value="new">Nieuwe installatie</option><option value="change">Wijziging of uitbreiding</option><option value="existing">Bestaande installatie</option></select></label>
          <label className={ui.label}>Adres van de installatie<textarea className={ui.field} rows={2} value={dossier.installationAddress} onChange={event => setDossier(value => ({ ...value, installationAddress: event.target.value }))} /></label>
          <div className="grid grid-cols-2 gap-2"><label className={ui.label}>Spanning<input className={ui.field} value={dossier.nominalVoltage} onChange={event => setDossier(value => ({ ...value, nominalVoltage: event.target.value }))} /></label><label className={ui.label}>Stroom<select className={ui.field} value={dossier.currentNature} onChange={event => setDossier(value => ({ ...value, currentNature: event.target.value as typeof value.currentNature }))}><option value="">—</option><option value="AC">Wisselstroom</option><option value="DC">Gelijkstroom</option><option value="other">Anders</option></select></label></div>
          <div className="grid grid-cols-2 gap-2"><label className={ui.label}>Frequentie (Hz)<input className={ui.field} value={dossier.frequencyHz} onChange={event => setDossier(value => ({ ...value, frequencyHz: event.target.value }))} /></label><label className={ui.label}>Versie<input className={ui.field} value={dossier.revisionLabel} onChange={event => setDossier(value => ({ ...value, revisionLabel: event.target.value }))} /></label></div>
          <label className={ui.label}>Uitgiftedatum<input className={ui.field} type="date" value={dossier.issueDate} onChange={event => setDossier(value => ({ ...value, issueDate: event.target.value }))} /></label>
        </fieldset>
        <button className={ui.primaryButton} type="submit">Documentgegevens opslaan</button>
      </form>
    </details>
  );
}
