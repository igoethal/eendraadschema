import { useState, type FormEvent } from "react";
import {
  SITUATION_ONLY_SYMBOL_TYPES,
  type AddSituationSymbolOptions,
  type SituationOnlySymbolType,
} from "../../application/SituationPlanAssetService";

interface CustomSituationSymbolDialogProps {
  readonly defaultScale: number;
  readonly errorMessage: string;
  readonly onCancel: () => void;
  readonly onSubmit: (options: AddSituationSymbolOptions) => void;
}

export function CustomSituationSymbolDialog({
  defaultScale,
  errorMessage,
  onCancel,
  onSubmit,
}: CustomSituationSymbolDialogProps) {
  const [type, setType] = useState<SituationOnlySymbolType>(SITUATION_ONLY_SYMBOL_TYPES[0]);
  const [scale, setScale] = useState(String(defaultScale * 100));
  const [rotation, setRotation] = useState("0");
  const [useScaleAsDefault, setUseScaleAsDefault] = useState(false);
  const numericScale = Number(scale);
  const numericRotation = Number(rotation);
  const valid = Number.isFinite(numericScale)
    && numericScale > 0
    && Number.isFinite(numericRotation);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid) return;
    onSubmit({
      type,
      scale: numericScale / 100,
      rotation: numericRotation,
      useScaleAsDefault,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-situation-symbol-title"
        className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Situatieschema</p>
            <h2 id="custom-situation-symbol-title" className="text-lg font-bold text-neutral-900">
              Los symbool toevoegen
            </h2>
          </div>
          <button
            type="button"
            className="rounded px-2 py-1 text-neutral-500 hover:bg-neutral-100"
            aria-label="Sluiten"
            onClick={onCancel}
          >
            ×
          </button>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <label className="block text-sm font-semibold text-neutral-700">
            Type
            <select
              className="mt-1 w-full rounded border border-neutral-300 bg-white px-3 py-2"
              value={type}
              onChange={(event) => {
                const selected = SITUATION_ONLY_SYMBOL_TYPES.find(value => value === event.target.value);
                if (selected) setType(selected);
              }}
            >
              {SITUATION_ONLY_SYMBOL_TYPES.map(symbolType => (
                <option key={symbolType} value={symbolType}>{symbolType}</option>
              ))}
            </select>
          </label>
          <p className="text-sm text-neutral-600">
            Dit symbool wordt alleen in het situatieschema geplaatst en niet in het ééndraadschema getekend.
          </p>
          {errorMessage ? (
            <p className="rounded bg-red-50 p-3 text-sm text-red-800" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-semibold text-neutral-700">
              Schaal (%)
              <input
                className="mt-1 w-full rounded border border-neutral-300 px-3 py-2"
                type="number"
                min="1"
                step="1"
                value={scale}
                onChange={event => setScale(event.target.value)}
              />
            </label>
            <label className="text-sm font-semibold text-neutral-700">
              Rotatie (°)
              <input
                className="mt-1 w-full rounded border border-neutral-300 px-3 py-2"
                type="number"
                step="10"
                value={rotation}
                onChange={event => setRotation(event.target.value)}
              />
            </label>
          </div>
          <label className="flex items-start gap-2 text-sm text-neutral-700">
            <input
              className="mt-1"
              type="checkbox"
              checked={useScaleAsDefault}
              onChange={event => setUseScaleAsDefault(event.target.checked)}
            />
            Gebruik deze schaal voortaan als standaard voor nieuwe symbolen.
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="rounded border border-neutral-300 px-4 py-2 font-semibold text-neutral-700 hover:bg-neutral-50"
              onClick={onCancel}
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="rounded bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-40"
              disabled={!valid}
            >
              Toevoegen
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
