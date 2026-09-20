export function optionalPositiveNumber(value: string): string | undefined {
  const normalized = value.trim().replace(",", ".");
  if (normalized === "") return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0
    ? undefined
    : "Gebruik een positief getal of laat dit veld leeg.";
}
