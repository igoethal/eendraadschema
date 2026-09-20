interface EditorShellProps {
  readonly itemCount: number;
}

function itemCountLabel(itemCount: number): string {
  return itemCount === 1
    ? "1 elektrisch onderdeel"
    : `${itemCount} elektrische onderdelen`;
}

export function EditorShell({ itemCount }: EditorShellProps) {
  return (
    <header className="flex h-[var(--react-shell-height)] items-center justify-between overflow-hidden border-b border-neutral-300 bg-white px-4 py-2 text-neutral-800 max-[36rem]:flex-col max-[36rem]:items-start max-[36rem]:gap-1">
      <div className="flex flex-col leading-tight">
        <span className="text-xs tracking-wide text-neutral-500 uppercase">Editor</span>
        <strong>Eéndraadschema</strong>
      </div>
      <p className="m-0 text-sm text-neutral-500" role="status" aria-live="polite">
        {itemCountLabel(itemCount)}
      </p>
    </header>
  );
}
