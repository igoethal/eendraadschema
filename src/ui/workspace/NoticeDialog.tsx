import { useState } from "react";
import type { NoticeStore } from "../../application/NoticeStore";
import { useNoticeSnapshot } from "../useNoticeSnapshot";

interface NoticeDialogProps {
  readonly store: NoticeStore;
}

export function NoticeDialog({ store }: NoticeDialogProps) {
  const { activeNotice } = useNoticeSnapshot(store);
  if (!activeNotice) return null;
  return <ActiveNoticeDialog key={activeNotice.key} store={store} notice={activeNotice} />;
}

function ActiveNoticeDialog({
  store,
  notice,
}: {
  readonly store: NoticeStore;
  readonly notice: NonNullable<ReturnType<NoticeStore["getSnapshot"]>["activeNotice"]>;
}) {
  const [neverDisplay, setNeverDisplay] = useState(notice.remember?.defaultChecked === true);
  const actions = notice.actions ?? [{ id: "ok", label: "OK", tone: "primary" as const }];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-dialog-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-blue-700">Mededeling</p>
        <h2 id="notice-dialog-title" className="mb-4 mt-1 text-xl font-bold">{notice.title}</h2>
        <div className="space-y-3 text-sm leading-6 text-neutral-700">
          {notice.paragraphs.map((paragraph, index) => <p className="m-0" key={index}>{paragraph}</p>)}
          {notice.illustration === "switch-symbols" ? <SwitchSymbolComparison /> : null}
          {notice.link ? (
            <a className="font-semibold text-blue-700 underline" href={notice.link.href} target="_blank" rel="noopener noreferrer">
              {notice.link.label}
            </a>
          ) : null}
        </div>
        {notice.remember ? (
          <label className="mt-5 flex items-start gap-2 text-sm text-neutral-700">
            <input
              className="mt-1"
              type="checkbox"
              checked={neverDisplay}
              onChange={event => setNeverDisplay(event.target.checked)}
            />
            Deze tekst nooit meer weergeven in deze browser.
          </label>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          {actions.map(action => (
            <button
              key={action.id}
              type="button"
              className={action.tone === "neutral"
                ? "rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
                : "rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"}
              onClick={() => store.commands.resolve(action.id, neverDisplay)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function SwitchSymbolComparison() {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl bg-neutral-50 p-3 text-center text-xs">
      <figure className="m-0 rounded-lg border border-neutral-200 bg-white p-3">
        <svg className="mx-auto" viewBox="0 0 70 45" width="90" height="58" aria-label="Schakelaarsymbool met leiding">
          <line x1="5" y1="30" x2="38" y2="30" stroke="currentColor" />
          <circle cx="38" cy="30" r="5" fill="white" stroke="currentColor" />
          <line x1="38" y1="30" x2="52" y2="8" stroke="currentColor" />
        </svg>
        <figcaption>Vroegere weergave</figcaption>
      </figure>
      <figure className="m-0 rounded-lg border border-neutral-200 bg-white p-3">
        <svg className="mx-auto" viewBox="0 0 70 45" width="90" height="58" aria-label="Schakelaarsymbool zonder leiding">
          <circle cx="30" cy="30" r="5" fill="white" stroke="currentColor" />
          <line x1="30" y1="30" x2="44" y2="8" stroke="currentColor" />
        </svg>
        <figcaption>Nieuwe weergave</figcaption>
      </figure>
    </div>
  );
}
