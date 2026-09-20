import { useState, type FormEvent } from "react";
import type { DistributionBoard } from "../../domain/DistributionBoard";
import type {
  CircuitPoleCount,
  CircuitProtection,
  CircuitPropertyChanges,
} from "../../application/SchemaPropertyReader";
import { poleCountOptions, protectionOptions } from "../properties/circuit/circuitOptions";

interface CircuitSetupDialogProps {
  readonly boards: readonly DistributionBoard[];
  readonly onCancel: () => void;
  readonly onCreate: (boardId: string, changes: CircuitPropertyChanges) => void;
}

export function CircuitSetupDialog({ boards, onCancel, onCreate }: CircuitSetupDialogProps) {
  const [boardId, setBoardId] = useState(boards[0]?.id ?? "");
  const [name, setName] = useState("");
  const [protection, setProtection] = useState<CircuitProtection>("automatisch");
  const [poleCount, setPoleCount] = useState<CircuitPoleCount>("2");
  const [amperage, setAmperage] = useState("20");
  const [hasCable, setHasCable] = useState(true);
  const [cableType, setCableType] = useState("XVB Cca 3G2,5");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCreate(boardId, {
      nameMode: "manueel",
      name: name.trim(),
      protection,
      poleCount,
      amperage: amperage.trim(),
      hasCable,
      cableType: hasCable ? cableType.trim() : "",
    });
  }

  const fieldClass = "grid gap-1.5 text-sm font-medium text-neutral-800";
  const controlClass = "min-h-10 rounded-md border border-neutral-300 bg-white px-3 py-2 text-base font-normal text-neutral-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-neutral-950/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <section className="w-full max-w-xl rounded-xl border border-neutral-200 bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="new-circuit-title">
        <form onSubmit={submit}>
          <header className="border-b border-neutral-200 px-5 py-4">
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-blue-700">Nieuwe kring</p>
            <h2 className="mb-0 mt-1 text-xl" id="new-circuit-title">Basisgegevens instellen</h2>
            <p className="mb-0 mt-2 text-sm text-neutral-600">De kring wordt meteen onder het juiste bord geplaatst. Details kun je nadien in het eigenschappenpaneel aanvullen.</p>
          </header>
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <label className={`${fieldClass} sm:col-span-2`}>
              Verdeelbord
              <select className={controlClass} value={boardId} onChange={(event) => setBoardId(event.target.value)} required>
                {boards.map((board) => <option key={board.id} value={board.id}>{board.name}</option>)}
              </select>
            </label>
            <label className={`${fieldClass} sm:col-span-2`}>
              Kringnaam
              <input className={controlClass} value={name} onChange={(event) => setName(event.target.value)} placeholder="Bijv. Stopcontacten keuken" autoFocus required />
            </label>
            <label className={fieldClass}>
              Bescherming
              <select className={controlClass} value={protection} onChange={(event) => setProtection(event.target.value as CircuitProtection)}>
                {protectionOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className={fieldClass}>
              Aantal polen
              <select className={controlClass} value={poleCount} onChange={(event) => setPoleCount(event.target.value as CircuitPoleCount)}>
                {poleCountOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className={fieldClass}>
              Stroom (A)
              <input className={controlClass} value={amperage} onChange={(event) => setAmperage(event.target.value)} inputMode="decimal" required />
            </label>
            <label className={`${fieldClass} justify-end`}>
              <span className="flex min-h-10 items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 font-normal">
                <input type="checkbox" className="size-4 accent-blue-700" checked={hasCable} onChange={(event) => setHasCable(event.target.checked)} />
                Kabel opnemen in schema
              </span>
            </label>
            {hasCable ? <label className={`${fieldClass} sm:col-span-2`}>
              Kabeltype
              <input className={controlClass} value={cableType} onChange={(event) => setCableType(event.target.value)} placeholder="Bijv. XVB Cca 3G2,5" required />
            </label> : null}
          </div>
          <footer className="flex justify-end gap-2 border-t border-neutral-200 bg-neutral-50 px-5 py-4">
            <button type="button" className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100" onClick={onCancel}>Annuleren</button>
            <button type="submit" className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-neutral-400" disabled={boards.length === 0}>Kring aanmaken</button>
          </footer>
        </form>
      </section>
    </div>
  );
}
