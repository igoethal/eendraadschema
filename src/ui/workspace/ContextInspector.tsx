import { useState, type ReactNode } from "react";
import type { CircuitContext } from "../../application/CircuitContext";
import { LinkedViewsPanel, type LinkedViewsPanelProps } from "./LinkedViewsPanel";

interface ContextInspectorProps extends LinkedViewsPanelProps {
  readonly context: CircuitContext | null;
  readonly issueCount: number;
  readonly children: ReactNode;
}

type InspectorTab = "details" | "links" | "checks";

export function ContextInspector({ context, issueCount, children, ...links }: ContextInspectorProps) {
  const [activeTab, setActiveTab] = useState<InspectorTab>("details");
  const tabs: readonly [InspectorTab, string][] = [["details", "Details"], ["links", "Koppelingen"], ["checks", "Checks"]];

  function showDetailsAfter(action: () => void) {
    action();
    setActiveTab("details");
  }

  return (
    <section className="min-h-full text-neutral-800" aria-label="Contextinspecteur">
      <nav className="flex border-b border-neutral-200" aria-label="Inspecteursecties">
        {tabs.map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? "border-b-2 border-blue-700 px-3 py-3 text-sm font-semibold text-blue-900" : "border-b-2 border-transparent px-3 py-3 text-sm font-semibold text-neutral-600 hover:bg-neutral-50"}
            aria-current={activeTab === tab ? "page" : undefined}
            onClick={() => setActiveTab(tab)}
          >{label}</button>
        ))}
      </nav>
      <div>
        {activeTab === "details" ? children : null}
        {activeTab === "links" ? (
          <div className="p-4">
            <LinkedViewsPanel
              context={context}
              canCreateSituationOccurrence={links.canCreateSituationOccurrence}
              onShowSchema={itemId => showDetailsAfter(() => links.onShowSchema(itemId))}
              onShowSituation={occurrenceId => showDetailsAfter(() => links.onShowSituation(occurrenceId))}
              onShowBoard={itemId => showDetailsAfter(() => links.onShowBoard(itemId))}
              onCreateSituationOccurrence={itemId => showDetailsAfter(() => links.onCreateSituationOccurrence(itemId))}
            />
          </div>
        ) : null}
        {activeTab === "checks" ? (
          <div className="grid gap-2 p-4">
            <p className="m-0 text-sm text-neutral-700">
              {issueCount === 0 ? "Geen gekende aandachtspunten voor deze context." : `${issueCount} aandachtspunten vragen nog opvolging.`}
            </p>
            {context?.openTaskCount ? <p className="m-0 rounded-md bg-amber-50 p-3 text-sm text-amber-900">{context.openTaskCount} open plaatsingstaak/taken.</p> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
