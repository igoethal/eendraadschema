export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export const ui = Object.freeze({
  focusRing: "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700/35",
  button: "min-h-8 rounded-md border border-neutral-300 bg-white px-2 py-1 font-[inherit] hover:bg-neutral-50 disabled:cursor-default disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700/35",
  primaryButton: "min-h-9 rounded-md border border-blue-700 bg-blue-700 px-3 py-2 font-semibold text-white hover:bg-blue-800 disabled:cursor-default disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700/35",
  dangerButton: "min-h-8 rounded-md border border-red-200 bg-white px-2 py-1 font-semibold text-red-700 hover:bg-red-50 disabled:cursor-default disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-red-700/35",
  field: "min-h-9 w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 font-[inherit] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-700/35",
  label: "grid gap-1 text-sm font-semibold",
  eyebrow: "text-xs tracking-wide text-neutral-500 uppercase",
  error: "rounded-md border border-red-200 bg-red-50 p-3 text-red-800",
});

export const propertyStyles = Object.freeze({
  form: "grid gap-3",
  fieldset: "m-0 grid gap-3 rounded-md border border-neutral-300 p-3 [&_legend]:px-1 [&_legend]:font-semibold",
  row: "grid grid-cols-2 gap-3 max-[52rem]:grid-cols-1",
  field: "grid gap-1 text-sm font-semibold",
  checkbox: "flex items-center gap-2 text-sm font-semibold [&_input]:size-5",
  advanced: "rounded-md border border-neutral-300 p-3 [&_summary]:cursor-pointer [&_summary]:font-semibold open:grid open:gap-3 open:[&_summary]:mb-3",
});
