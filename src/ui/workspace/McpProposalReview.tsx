import { useEffect, useState } from "react";

interface PendingProposal { readonly summary: string; readonly resolve: (accepted: boolean) => void; }

/** Receives browser-bridge proposals without giving the bridge access to React state. */
export function McpProposalReview() {
  const [proposal, setProposal] = useState<PendingProposal | null>(null);
  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<PendingProposal>).detail;
      if (detail?.resolve && typeof detail.summary === "string") setProposal(detail);
    };
    window.addEventListener("eds-mcp-proposal", listener);
    return () => window.removeEventListener("eds-mcp-proposal", listener);
  }, []);
  if (!proposal) return null;
  const decide = (accepted: boolean) => { proposal.resolve(accepted); setProposal(null); };
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"><section role="dialog" aria-modal="true" aria-labelledby="mcp-proposal-title" className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl"><p className="m-0 text-xs font-semibold uppercase tracking-wide text-violet-700">Lokale assistent</p><h2 className="my-1 text-xl font-bold" id="mcp-proposal-title">Wijzigingsvoorstel beoordelen</h2><pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded bg-neutral-100 p-3 text-sm text-neutral-800">{proposal.summary}</pre><p className="text-sm text-neutral-600">Bij goedkeuring wordt dit één ongedaan-te-maken dossierwijziging.</p><div className="flex justify-end gap-2"><button type="button" className="rounded border border-neutral-300 px-3 py-2 font-semibold" onClick={() => decide(false)}>Verwerpen</button><button type="button" className="rounded bg-violet-700 px-3 py-2 font-semibold text-white" onClick={() => decide(true)}>Goedkeuren</button></div></section></div>;
}
