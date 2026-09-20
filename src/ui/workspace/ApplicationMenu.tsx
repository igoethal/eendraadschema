import type { MouseEvent } from "react";

interface ApplicationMenuProps {
  readonly onNew: () => void;
  readonly onFile: () => void;
  readonly onPrint: () => void;
  readonly onDocumentation: () => void;
  readonly onAbout: () => void;
}

export function ApplicationMenu({
  onNew,
  onFile,
  onPrint,
  onDocumentation,
  onAbout,
}: ApplicationMenuProps) {
  const actionClass = "rounded-md px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-white hover:text-blue-800 focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-blue-700/35";

  function runHelpAction(event: MouseEvent<HTMLButtonElement>, action: () => void) {
    event.currentTarget.closest("details")?.removeAttribute("open");
    action();
  }

  return (
    <nav className="flex h-full items-center gap-1 px-2" aria-label="Applicatiemenu">
      <button type="button" className={actionClass} onClick={onNew}>Nieuw</button>
      <button type="button" className={actionClass} onClick={onFile}>Bestand</button>
      <button type="button" className={actionClass} onClick={onPrint}>Print</button>
      <details className="group relative ml-1">
        <summary className={`${actionClass} cursor-pointer list-none marker:content-none after:ml-1 after:content-['▾'] group-open:bg-white`}>
          Hulp
        </summary>
        <div className="absolute left-0 top-[calc(100%+0.25rem)] z-40 grid min-w-44 gap-1 rounded-lg border border-neutral-200 bg-white p-1.5 shadow-xl">
          <button type="button" className={`${actionClass} text-left`} onClick={event => runHelpAction(event, onDocumentation)}>
            Documentatie
          </button>
          <button type="button" className={`${actionClass} text-left`} onClick={event => runHelpAction(event, onAbout)}>
            Info en contact
          </button>
        </div>
      </details>
    </nav>
  );
}
