import type { WorkspaceStore, WorkspaceTab } from "../../application/WorkspaceStore";
import { useWorkspaceSnapshot } from "../useWorkspaceSnapshot";

interface WorkspaceHeaderProps {
  readonly itemCount: number;
  readonly openIssueCount?: number;
  readonly store: WorkspaceStore;
  readonly onSelectTab: (tab: WorkspaceTab) => void;
}

function itemCountLabel(itemCount: number): string {
  return itemCount === 1
    ? "1 elektrisch onderdeel"
    : `${itemCount} elektrische onderdelen`;
}

export function WorkspaceHeader({ itemCount, openIssueCount = 0, store, onSelectTab }: WorkspaceHeaderProps) {
  const { activeTab } = useWorkspaceSnapshot(store);
  const tabClass = (tab: WorkspaceTab) => [
    "h-full border-b-2 px-4 text-sm font-semibold transition-colors",
    tab === activeTab
      ? "border-blue-700 bg-blue-50 text-blue-900"
      : "border-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
  ].join(" ");

  return (
    <header className="flex h-[var(--react-shell-height)] items-stretch justify-between gap-3 overflow-hidden border-b border-neutral-300 bg-white text-neutral-900">
      <div className="flex min-w-0 items-center gap-3 px-4">
        <div className="flex flex-col leading-tight">
          <span className="text-xs tracking-wide text-neutral-500 uppercase">Werkruimte</span>
          <strong className="whitespace-nowrap">Elektrisch dossier</strong>
        </div>
        <nav className="flex h-full min-w-0 items-stretch overflow-x-auto" aria-label="Werkruimteweergave">
          <button
            type="button"
            className={tabClass("dossier")}
            aria-current={activeTab === "dossier" ? "page" : undefined}
            onClick={() => onSelectTab("dossier")}
          >
            Dossier
          </button>
          <button
            type="button"
            className={tabClass("schema")}
            aria-current={activeTab === "schema" ? "page" : undefined}
            onClick={() => onSelectTab("schema")}
          >
            Eéndraadschema
          </button>
          <button
            type="button"
            className={tabClass("situation")}
            aria-current={activeTab === "situation" ? "page" : undefined}
            onClick={() => onSelectTab("situation")}
          >
            Situatieschema
          </button>
          <button
            type="button"
            className={tabClass("board")}
            aria-current={activeTab === "board" ? "page" : undefined}
            onClick={() => onSelectTab("board")}
          >
            Bordindeling
          </button>
        </nav>
      </div>
      <div className="hidden shrink-0 items-center gap-2 px-4 text-sm text-neutral-500 lg:flex" role="status" aria-live="polite">
        <span className="whitespace-nowrap">{itemCountLabel(itemCount)}</span>
        <span className={openIssueCount === 0 ? "whitespace-nowrap rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800" : "whitespace-nowrap rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900"}>
          {openIssueCount === 0 ? "Dossier volledig" : `${openIssueCount} aandachtspunten`}
        </span>
      </div>
    </header>
  );
}
