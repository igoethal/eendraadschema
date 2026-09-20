import type { SchemaStore } from "../../application/SchemaStore";
import type { SituationPlanStore } from "../../application/SituationPlanStore";
import { createDossierSnapshot } from "../../application/DossierReader";
import { useSchemaSnapshot } from "../useSchemaSnapshot";
import { useSituationPlanSnapshot } from "../useSituationPlanSnapshot";

export function DossierOverview({ schemaStore, situationPlanStore }: {
  readonly schemaStore: SchemaStore;
  readonly situationPlanStore: SituationPlanStore | null;
}) {
  if (!situationPlanStore) {
    return <section className="mb-4 rounded-xl border border-neutral-300 bg-amber-50 p-3" aria-label="Documentatie-overzicht">
      Situatieschema wordt geladen…
    </section>;
  }
  return <DossierOverviewWithSituation schemaStore={schemaStore} situationPlanStore={situationPlanStore} />;
}

function DossierOverviewWithSituation({ schemaStore, situationPlanStore }: {
  readonly schemaStore: SchemaStore;
  readonly situationPlanStore: SituationPlanStore;
}) {
  const schema = useSchemaSnapshot(schemaStore);
  const situation = useSituationPlanSnapshot(situationPlanStore);
  const dossier = createDossierSnapshot(schema, situation);
  const fieldCount = dossier.items.filter(item => item.presentation === "field-device").length;
  const placedFieldCount = dossier.items.filter(item => item.presentation === "field-device" && item.situationOccurrenceIds.length > 0).length;

  return (
    <section className="mb-4 rounded-xl border border-neutral-300 bg-amber-50 p-3" aria-labelledby="dossier-overview-title">
      <span className="text-xs font-semibold uppercase tracking-wide text-amber-800">Dossier</span>
      <h2 className="m-0 text-base" id="dossier-overview-title">Documentatie-overzicht</h2>
      <p className="mb-2 mt-1 text-sm text-neutral-700">
        {placedFieldCount}/{fieldCount} veldonderdelen staan op het situatieschema.
      </p>
      {dossier.issues.length === 0 ? <p className="m-0 text-sm text-emerald-700">Alle gekende koppelingen zijn volledig.</p> : (
        <ul className="m-0 grid list-none gap-1 p-0">
          {dossier.issues.slice(0, 4).map(issue => <li key={issue.id} className={issue.severity === "error" ? "text-sm text-red-700" : "text-sm text-amber-900"}>{issue.message}</li>)}
          {dossier.issues.length > 4 ? <li className="text-sm text-neutral-600">+ {dossier.issues.length - 4} verdere aandachtspunten</li> : null}
        </ul>
      )}
    </section>
  );
}
